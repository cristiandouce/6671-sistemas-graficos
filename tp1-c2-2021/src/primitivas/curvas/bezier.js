import { vec2, vec3, vec4 } from "gl-matrix";
import Curva from "./curva";

export default class BezierCurve extends Curva {
  constructor(controlPoints = []) {
    super(controlPoints);
    this.controlPoints = controlPoints;
  }

  get grade() {
    return this.controlPoints.length - 1;
  }

  /**
   * Devuelve el coeficiente binomial para el grado
   * de la curva de bezier.
   *
   * @param {Number} k Parámetro de la binomial
   * @returns
   */
  binomial(n, k) {
    let coefficient = 1;

    // numerador
    for (let x = n - k + 1; x <= n; x++) {
      coefficient *= x;
    }

    // denominador
    for (let x = 1; x <= k; x++) {
      coefficient /= x;
    }

    return coefficient;
  }

  /**
   * Generalización de los coeficientes de Bezier, utilizando
   * la fórmula genérica de Berstein.
   * Fuente:
   *    - https://en.wikipedia.org/wiki/Bernstein_polynomial
   *
   * @param {Number} n Grado del coeficiente a evaluar
   * @param {Number} k Coeficiente de Bezier a evaluar
   * @param {Number} u Parametro del recorrido
   * @returns {Number}
   */
  berstein(n, k, u) {
    if (k < 0) {
      return 0;
    }

    if (k > n) {
      return 0;
    }

    return this.binomial(n, k) * Math.pow(u, k) * Math.pow(1 - u, n - k);
  }

  /**
   * Generalización de los coeficientes de Bezier derivados, utilizando
   * la fórmula genérica de Berstein para la derivada.
   * Fuente:
   *    - https://en.wikipedia.org/wiki/Bernstein_polynomial
   *
   * @param {Number} n Grado del coeficiente a evaluar
   * @param {Number} k Coeficiente de Bezier a evaluar
   * @param {Number} u Parametro del recorrido
   * @returns {Number}
   */

  d_berstein(n, k, u) {
    return n * (this.berstein(n - 1, k - 1, u) - this.berstein(n - 1, k, u));
  }

  /**
   * Generalización de los coeficientes de Bezier derivados 2 veces, utilizando
   * la fórmula genérica de Berstein para la derivada.
   * Fuente:
   *    - https://en.wikipedia.org/wiki/Bernstein_polynomial
   *
   * @param {Number} n Grado del coeficiente a evaluar
   * @param {Number} k Coeficiente de Bezier a evaluar
   * @param {Number} u Parametro del recorrido
   * @returns {Number}
   */

  d_d_berstein(n, k, u) {
    return (
      n * (this.d_berstein(n - 1, k - 1, u) - this.d_berstein(n - 1, k, u))
    );
  }

  getNormalizedU(u) {
    // con el arreglo del coeficiente de bernstein cuando
    // no se complen con los parametros corner,
    // ya no hace falta normalizar el parámetro u.
    return u;
    // const diff = 0.000000000001;
    // if (u === 0) {
    //   return diff;
    // }

    // if (u === 1) {
    //   return 1 - diff;
    // }

    // return u;
  }

  getPosition(u) {
    // el tamaño de puntos de control
    const n = this.grade + 1;

    // El vector posición a devolver
    const position = vec3.create();

    // Iteramos sobre los puntos para obtener
    // la posición segun la forma recursiva de bezier
    for (let i = 0; i < n; i++) {
      const B = this.berstein(this.grade, i, u);
      const point_i = vec3.fromValues(...this.controlPoints[i]);
      vec3.scale(point_i, point_i, B);
      vec3.add(position, position, point_i);
    }

    return position;
  }

  /**
   * Obtenemos el fector tangente a partir de la derivada de la expresión
   * de la curva de Bezier parametrizada.
   *
   * @param {Number} u
   * @returns
   */
  getTangent(u) {
    const n = this.grade + 1;

    const tangent = vec3.create();

    for (let i = 0; i < n; i++) {
      const B = this.d_berstein(this.grade, i, this.getNormalizedU(u));
      const point_i = vec3.fromValues(...this.controlPoints[i]);
      vec3.scale(point_i, point_i, B);
      vec3.add(tangent, tangent, point_i);
    }

    vec3.normalize(tangent, tangent);
    return tangent;
  }

  /**
   * Obtenemos la segunda derivada del vector, como la segunda derivada
   * de la curva de Bezier parametrizada.
   *
   * @param {Number} u
   * @returns
   */
  getSecondDerivate(u) {
    const n = this.grade + 1;

    const sd = vec3.create();

    for (let i = 0; i < n; i++) {
      const B = this.d_d_berstein(this.grade, i, this.getNormalizedU(u));
      const point_i = vec3.fromValues(...this.controlPoints[i]);
      vec3.scale(point_i, point_i, B);
      vec3.add(sd, sd, point_i);
    }

    return sd;
  }

  /**
   * El vector Binormal se calcula como el producto vectorial
   * entre el vector tangente y el vector segunda derivada. El mismo,
   * indica la direccíon angular del cambio.
   *
   * Fuente:
   *    - https://en.wikipedia.org/wiki/Frenet%E2%80%93Serret_formulas
   *    - https://es.wikipedia.org/wiki/Geometr%C3%ADa_diferencial_de_curvas
   * @param {Number} u
   */
  getBinormal(u) {
    // const tangent = this.getTangent(u);
    // const sd = this.getSecondDerivate(u);
    // const binormal = vec3.create();

    // vec3.cross(binormal, tangent, sd);

    // obtenemos el vector binormal como la tendencia de cambio
    // const du1 = u === 1 ? -0.000001 : 0;
    // const du2 = u === 1 ? 0 : 0.000001;
    // const pos1 = this.getPosition(u + du1);
    // const pos2 = this.getPosition(u + du2);
    // const binormal = vec3.create();

    // vec3.cross(binormal, pos1, pos2);

    // obtenemos el vector binormal como el producto vectorial entre
    // el vector posicion y la tengente, marcando la velocidad angular.
    const tangent = this.getTangent(u);
    const pos = this.getPosition(u);
    const binormal = vec3.create();

    vec3.cross(binormal, pos, tangent);

    if (vec3.equals([0, 0, 0], binormal)) {
      // tangent[0] += 0.00001;
      pos[0] += 0.00001;
      // pos[1] += 0.00001;
      pos[2] += 0.00001;
      vec3.cross(binormal, tangent, pos);
    }

    vec3.normalize(binormal, binormal);

    return binormal;
  }

  /**
   * El vector normal es la segunda derivada de la curva, normalizada.
   * Fuente:
   *    - https://en.wikipedia.org/wiki/Frenet%E2%80%93Serret_formulas
   * @param {Number} u
   * @returns
   */
  getNormal(u) {
    const normal = vec3.create();
    const tangent = this.getTangent(u);
    const binormal = this.getBinormal(u);
    vec3.cross(normal, binormal, tangent);

    vec3.normalize(normal, normal);
    return normal;
  }
}

window.BezierCurve = BezierCurve;
