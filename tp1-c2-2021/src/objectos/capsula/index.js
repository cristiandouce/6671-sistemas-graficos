import Esfera from "../../primitivas/superficies/esfera";
import Objeto3D from "../../primitivas/objetos/base";

export default class CapsulaEspacial extends Objeto3D {
  superficie = new Esfera();
  color = [0, 0, 1.0];

  constructor(engine) {
    super(engine);
    this.setupBuffers();
  }
}
