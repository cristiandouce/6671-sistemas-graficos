import dat from "dat.gui";

export default class Application {
  gui = new dat.GUI();
  guiState = {
    /** numero de filas de paneles: [1, 10] */
    panelRows: 6,
    /** angulo de los paneles: [0, 360] */
    panelsAngle: 135,
    /** velocidad de rotación del anillo: [0, 100] */
    ringSpeed: 20,
    /** numero de modulos en el anillo: [2, 8] */
    ringModules: 4,
  };

  /**
   * @constructor
   * @param {object} params
   * @param {import("../helpers/webgl-engine")} params.engine
   */
  constructor(params) {
    this.engine = params.engine;
  }

  init() {
    this.initializeGUI();
    this.initializeEngine();
  }

  initializeGUI() {
    this.gui
      .add(this.guiState, "panelRows", 1, 10, 1)
      .onFinishChange(this.onGUIChange.bind(this, "panelRows"));
    this.gui
      .add(this.guiState, "panelsAngle", 0, 360, 1)
      .onFinishChange(this.onGUIChange.bind(this, "panelsAngle"));
    this.gui
      .add(this.guiState, "ringSpeed", 0, 100, 1)
      .onFinishChange(this.onGUIChange.bind(this, "ringSpeed"));
    this.gui
      .add(this.guiState, "ringModules", 2, 8, 1)
      .onFinishChange(this.onGUIChange.bind(this, "ringModules"));
  }

  /**
   *
   * @param {string} param nombre del parametro que cambio
   * @param {number|string} value nuevo valor adquirido por el parametro
   */
  onGUIChange(param, value) {
    console.log(param, value, this.guiState);
  }

  initializeEngine() {
    this.engine.init();
  }
}
