import dat from "dat.gui";

import Objeto3D from "../primitivas/objetos/base";
import Esfera from "../primitivas/objetos/esfera";
import { DroneCameraControl } from "./camara/drone";

// import Granada from "../primitivas/objetos/granada";
// import TuboSenoidal from "../primitivas/objetos/tubo-senoidal";

export default class Application {
  gui = new dat.GUI({ hideable: false });
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
    this.rootObject = new Objeto3D(this.engine);
    this.camera = new DroneCameraControl();
    this.camera.bindListeners();
  }

  init() {
    this.initializeGUI();
    this.initializeEngine();
    this.initializeScene();
    this.tick();
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

  initializeScene() {
    var esfera = new Esfera(this.engine);
    esfera.setPosition(0, 0, 0);
    esfera.updateModelMatrix();

    this.rootObject.addChild(esfera);
  }

  tick() {
    this.camera.update();
    this.engine.setViewMatrix(this.camera.getViewMatrix());
    requestAnimationFrame(this.tick.bind(this));
    this.rootObject.draw();
  }
}
