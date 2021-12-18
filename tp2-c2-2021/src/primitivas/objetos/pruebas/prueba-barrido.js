import { Circulo } from "../../curvas/circulo";
import Recorrido from "../../curvas/recorrido";
import { SuperficieBarrido } from "../../superficies/barrido";
import Objeto3D from "../base";
import { Rect2D } from "../../curvas/recta2d";
import { Rectangle } from "../../curvas/rectanculo";

export default class PruebaBarrido extends Objeto3D {
  color = [1, 0.7, 0];
  position = [0, 0, 0];

  constructor(engine) {
    super(engine);

    this.cilindroConTapas();
    this.cilindroConTapasRecta();
    this.prismaConTapas();
  }

  cilindroConTapas(radio = 1) {
    const forma = new Circulo(radio);
    const recorrido = new Recorrido([
      [0, 0, -10],
      [0, 0, 0],
      [0, 0, 10],
    ]);
    this.superficie = new SuperficieBarrido(forma, recorrido, true, true);
    this.setupBuffers();
  }

  cilindroConTapasRecta(radio = 1) {
    const forma = new Circulo(radio);

    const recorrido = new Rect2D(0, -10, 0, 10);

    this.superficie = new SuperficieBarrido(forma, recorrido, true, true);
    this.setupBuffers();
  }

  prismaConTapas() {
    const forma = new Rectangle(1, 1);

    const recorrido = new Rect2D(0, -10, 0, 10);

    this.superficie = new SuperficieBarrido(forma, recorrido, true, true);
    this.setupBuffers();
  }
}
