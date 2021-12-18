import { vec3 } from "gl-matrix";
import Superficie from "./_superficie";

export default class Granada extends Superficie {
  constructor() {
    super();
  }
  getPosicion(a, b) {
    // como normalizamos para u/v la obtención de array Buffers
    // convertimos a modo del ejemplo, para obtener nuevamente los alpha y beta
    // que se requieren para computar la normal y la posición de la granda de ejemplo
    const alpha = a * 2 * Math.PI;
    const beta = (0.1 + b * 0.8) * Math.PI;

    const r = 2;
    const nx = Math.sin(beta) * Math.sin(alpha);
    const ny = Math.sin(beta) * Math.cos(alpha);
    const nz = Math.cos(beta);

    const g = beta % 0.5;
    const h = alpha % 1;
    let f = 1;

    if (g < 0.25) f = 0.95;
    if (h < 0.5) f = f * 0.95;

    const x = nx * r * f;
    const y = ny * r * f;
    const z = nz * r * f;

    return [x, y, z];
  }

  getNormal(a, b) {
    // como normalizamos para u/v la obtención de array Buffers
    // convertimos a modo del ejemplo, para obtener nuevamente los alpha y beta
    // que se requieren para computar la normal y la posición de la granda de ejemplo
    const alpha = a * 2 * Math.PI;
    const beta = (0.1 + b * 0.8) * Math.PI;

    const p = this.getPosicion(a, b);
    const v = vec3.create();
    vec3.normalize(v, p);

    // como normalizamos a u/v para la creación de buffers
    // realizamos las transformaciones inversas de los delta para alpha y beta
    // ahora a y b.
    const deltaA = 0.05 / 2 / Math.PI;
    const deltaB = 0.05 / 0.8 / Math.PI;
    const p1 = this.getPosicion(a, b);
    const p2 = this.getPosicion(a, b + deltaB);
    const p3 = this.getPosicion(a + deltaA, b);

    const v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    const v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    const n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }
}
