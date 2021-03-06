import Objeto3D from "../base";
import PruebaBarrido from "./prueba-barrido";
import PruebaRevolucion from "./prueba-revolucion";

export default class Prueba extends Objeto3D {
  color = [1, 0.7, 0];
  position = [0, 0, 0];

  constructor(engine) {
    super(engine);

    this.cilindroRevolucion();
  }

  cilindroBarridoConTapas() {
    this.addChild(new PruebaBarrido(this.engine));
  }

  cilindroRevolucion() {
    this.addChild(new PruebaRevolucion(this.engine));
  }
}
