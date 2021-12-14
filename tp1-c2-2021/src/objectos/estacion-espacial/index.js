import Objeto3D from "../../primitivas/objetos/base";
import Anillo from "./anillo";
import Nucleo from "./nucleo";
import PanelesSolares from "./paneles";

export default class EstacionEspacial extends Objeto3D {
  color = [1.0, 0, 0];

  constructor(engine) {
    super(engine);
    this.setupBuffers();

    const largoEjePaneles = 20;

    const anillo = new Anillo(engine);
    this.addChild(anillo);

    const nucleo = new Nucleo(engine);
    this.addChild(nucleo);

    const paneles = new PanelesSolares(engine);
    paneles.setRotation(-Math.PI / 2, 0, 0);
    paneles.setPosition(
      0,
      0,
      nucleo.getDistanciaAModuloInferior() + paneles.getLargoEje() / 2
    );

    paneles.updateModelMatrix();
    this.addChild(paneles);

    // !!! Importante para poder definir la camara orbital 2
    this.paneles = paneles;
    this.anillo = anillo;
  }

  actualizarContexto(contexto) {
    this.paneles.actualizarContexto(contexto);
    this.anillo.actualizarContexto(contexto);
  }
}
