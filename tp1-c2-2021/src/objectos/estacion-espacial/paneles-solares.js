import TuboSenoidal from "../../primitivas/superficies/tubo-senoidal";
import Objeto3D from "../../primitivas/objetos/base";

export default class PanelesSolares extends Objeto3D {
  superficie = new TuboSenoidal();
  color = [1.0, 0, 0];

  constructor(engine) {
    super(engine);
    this.setupBuffers();
  }
}
