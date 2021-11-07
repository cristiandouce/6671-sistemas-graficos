import Esfera from "../../primitivas/objetos/esfera";
import Objeto3D from "../../primitivas/objetos/base";

export default class CapsulaEspacial extends Objeto3D {
  color = [0, 0, 1.0];

  constructor(engine) {
    super(engine);

    // Empiezo a dibujar la capsula
    const esfera = new Esfera(engine);
    esfera.color = this.color;
    this.addChild(esfera);

    this.setupBuffers();
  }
}
