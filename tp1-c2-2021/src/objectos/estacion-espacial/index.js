import Esfera from "../../primitivas/objetos/esfera";
import Objeto3D from "../../primitivas/objetos/base";
import TuboSenoidal from "../../primitivas/objetos/tubo-senoidal";

export default class EstacionEspacial extends Objeto3D {
  color = [1.0, 0, 0];

  constructor(engine) {
    super(engine);
    this.setupBuffers();

    const esfera = new Esfera(engine, 4);
    esfera.color = this.color;

    this.addChild(esfera);

    const tubo = new TuboSenoidal(engine, 1, 20);
    tubo.setRotation(Math.PI / 2, 0, 0);
    tubo.setPosition(0, 0, 12);
    tubo.setEscala(1, 1.5, 1);
    tubo.updateModelMatrix();
    this.addChild(tubo);

    // !!! Importante para poder definir la camara orbital 2
    this.paneles = tubo;
  }
}
