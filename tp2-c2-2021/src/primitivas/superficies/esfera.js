import { vec3 } from "gl-matrix";
import Superficie from "./_superficie";

export default class Esfera extends Superficie {
  /**
   *
   * @param {number} radio el radio de la esfera
   */
  constructor(radio = 1) {
    super();
    this.radio = radio;
  }

  getPosicion(u, v) {
    const { radio } = this;
    const x = radio * Math.sin(Math.PI * u) * Math.cos(2 * Math.PI * v);
    const y = radio * Math.sin(Math.PI * u) * Math.sin(2 * Math.PI * v);
    const z = radio * Math.cos(Math.PI * u);
    return [x, y, z];
  }

  getNormal(u, v) {
    var xyz = this.getPosicion(u, v);
    // obtenemos el vector normal punto a punto para la esfera
    // como las coordenadas de cada punto.
    // luego lo normalizamos con gl-matrix para obtener un vector normal
    return vec3.normalize([], xyz);
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  }
}
