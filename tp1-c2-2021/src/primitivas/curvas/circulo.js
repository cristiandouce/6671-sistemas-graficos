import { vec3 } from "gl-matrix";
import Recorrido from "./recorrido";

export class Circulo extends Recorrido {
  constructor(radio) {
    // REVISAR LA INICIALIZACION DEL RECORRIDO...
    super([1], 0);

    this.grade = 2;
    // Desarrollando la forma cuadrática de bezier
    // para el punto intermedio del recorrido de un cuarto arco de radio
    // nos da que el punto intermedio de control se tiene que encontrar
    // en...

    const intermedio = radio * (Math.sqrt(2) - 0.5);

    this.points = [
      [radio, 0, 0],
      [intermedio, intermedio, 0],
      [0, radio, 0],
      [-intermedio, intermedio, 0],
      [-radio, 0, 0],
      [-intermedio, -intermedio, 0],
      [0, -radio, 0],
      [intermedio, -intermedio, 0],
      [radio, 0, 0],
    ];

    this.generateCurves();
  }
}

window.vec3 = vec3;
