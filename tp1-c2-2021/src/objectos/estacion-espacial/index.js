import Objeto3D from "../../primitivas/objetos/base";
import Anillo from "./anillo";
import Nucleo from "./nucleo";
import PanelesSolares from "./paneles";

export default class EstacionEspacial extends Objeto3D {
  color = [1.0, 0, 0];
  context = {};

  constructor(engine, context) {
    super(engine);
    // guardo el estado inicial del contexto
    this.context = Object.assign({}, context);

    this.setupBuffers();

    // !!! Importante para poder referenciar y actualizar
    const anillo = (this.anillo = this.generarAnillo());
    this.addChild(anillo);

    const nucleo = (this.nucleo = new Nucleo(engine));
    this.addChild(nucleo);

    const paneles = (this.paneles = this.generarPaneles(
      context.panelRows,
      (context.panelsAngle / 360) * 2 * Math.PI
    ));

    this.addChild(paneles);
  }

  actualizarContexto(contexto) {
    const viejo = this.context;
    const nuevo = contexto;

    debugger;
    if (
      nuevo.panelRows != viejo.panelRows ||
      nuevo.panelsAngle !== viejo.panelsAngle
    ) {
      this.removeChild(this.paneles);
      this.paneles = this.generarPaneles(
        nuevo.panelRows,
        (nuevo.panelsAngle / 360) * 2 * Math.PI
      );
      this.addChild(this.paneles);
    }

    if (nuevo.ringSpeed !== viejo.ringSpeed) {
      this.anillo.setVelocidad(nuevo.ringSpeed / 100);
    }

    if (nuevo.ringModules !== viejo.ringModules) {
      this.anillo.setModules(nuevo.ringModules);
    }

    this.context = Object.assign({}, contexto);
    this.updateModelMatrix();
  }

  generarAnillo() {
    const anillo = new Anillo(
      this.engine,
      this.context.ringModules,
      this.context.ringSpeed / 100
    );

    anillo.updateModelMatrix();
    return anillo;
  }

  generarPaneles(filas = 4, anguloPanel = Math.PI / 4) {
    // !!! Importante para poder definir la camara orbital 2
    const paneles = new PanelesSolares(this.engine, filas, anguloPanel);
    paneles.setRotation(-Math.PI / 2, 0, 0);
    paneles.setPosition(
      0,
      0,
      this.nucleo.getDistanciaAModuloInferior() + paneles.getLargoEje() / 2
    );

    paneles.updateModelMatrix();
    return paneles;
  }
}
