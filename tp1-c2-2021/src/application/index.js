import dat from "dat.gui";
import CapsulaEspacial from "../objectos/capsula";
import Drone from "../objectos/drone";
import EstacionEspacial from "../objectos/estacion-espacial";

import Objeto3D from "../primitivas/objetos/base";
import Plano from "../primitivas/objetos/plano";
import Barrido from "../primitivas/objetos/prueba-barrido";
import { DroneCameraControl } from "./camara/drone";
import { OrbitalCamera } from "./camara/orbital";

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

    selectedCamera: "orbital 1",
  };

  /**
   * @constructor
   * @param {object} params
   * @param {import("../helpers/webgl-engine")} params.engine
   */
  constructor(params) {
    this.engine = params.engine;
    this.rootObject = new Objeto3D(this.engine);
    this.cameras = {
      "orbital 1": new OrbitalCamera([0, 30, 30], [0, 0, 0]).attach(),
      "orbital 2": new OrbitalCamera([0, 30, 30], [0, 0, 0]).attach(),
      drone: new DroneCameraControl([0, 30, 30], [-65, 0, 0]).attach(),
    };

    this.keyDownListener = this.keyDownListener.bind(this);
  }

  init() {
    this.initializeGUI();
    this.bindGlobalControls();
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
    this.cameraController = this.gui
      .add(this.guiState, "selectedCamera", ["orbital 1", "orbital 2", "drone"])
      .onFinishChange(this.onGUIChange.bind(this, "selectedCamera"));
  }

  /**
   *
   * @param {string} param nombre del parametro que cambio
   * @param {number|string} value nuevo valor adquirido por el parametro
   */
  onGUIChange(param, value) {
    switch (param) {
      case "selectedCamera":
        console.log("selecciono camara:", value);
        break;
      default:
        console.log(param, value, this.guiState);
        break;
    }
  }

  bindGlobalControls() {
    document.addEventListener("keydown", this.keyDownListener);
  }

  /**
   *
   * @param {KeyboardEvent} e
   */
  keyDownListener(e) {
    switch (e.key) {
      case "1":
        this.guiState.selectedCamera = "orbital 1";
        break;
      case "2":
        this.guiState.selectedCamera = "orbital 2";
        break;
      case "3":
        this.guiState.selectedCamera = "drone";
        break;
    }

    this.cameraController.updateDisplay();
  }

  initializeEngine() {
    this.engine.init();
  }

  initializeScene() {
    const estacion = new EstacionEspacial(this.engine);
    estacion.setPosition(0, 0, 0);
    estacion.updateModelMatrix();
    this.rootObject.addChild(estacion);

    const capsula = new CapsulaEspacial(this.engine);
    capsula.setPosition(0, -2, -5);
    capsula.updateModelMatrix();

    const drone = new Drone(this.engine, this.cameras.drone);
    drone.addChild(capsula);
    this.rootObject.addChild(drone);

    const plano = new Plano(this.engine);
    plano.setPosition(0, 0, 0);
    plano.setRenderMode(this.engine.gl.LINE_LOOP);
    plano.updateModelMatrix();
    this.rootObject.addChild(plano);

    // determino como target de las camaras orbitales
    // el centro de la estacion, y los paneles solares
    this.cameras["orbital 1"].setTarget(estacion.getWorldPosition());
    this.cameras["orbital 2"].setTarget(estacion.paneles.getWorldPosition());

    // PRUEBAS
    const barrido = new Barrido(this.engine);
    barrido.setPosition(0, 15, 0);
    barrido.updateModelMatrix();
    this.rootObject.addChild(barrido);

    // TODO: BORRAR ESTA LINEA
    this.cameras["orbital 1"].setTarget(barrido.getWorldPosition());

    console.log(
      "POSICIONES",
      estacion.getWorldPosition(),
      estacion.paneles.getWorldPosition(),
      capsula.getWorldPosition(),
      barrido.getWorldPosition()
    );
  }

  tick() {
    this.cameras[this.guiState.selectedCamera].update();
    this.engine.setViewMatrix(
      this.cameras[this.guiState.selectedCamera].getViewMatrix()
    );
    requestAnimationFrame(this.tick.bind(this));
    this.rootObject.draw();
  }
}
