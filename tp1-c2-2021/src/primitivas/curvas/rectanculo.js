import Recorrido from "./recorrido";
import { RectXY } from "./recta2d";

export class Rectangle extends Recorrido {
  constructor(ancho = 2, alto = 2) {
    // REVISAR LA INICIALIZACION DEL RECORRIDO...
    super([1], 0);

    this.grade = 2;

    this.ancho = ancho;
    this.alto = alto;

    this.curves = [
      new RectXY(-ancho / 2, -alto / 2, -ancho / 2, alto / 2),
      new RectXY(-ancho / 2, alto / 2, ancho / 2, alto / 2),
      new RectXY(ancho / 2, alto / 2, ancho / 2, -alto / 2),
      new RectXY(ancho / 2, -alto / 2, -ancho / 2, -alto / 2),
    ];
  }
}
