import dat from "dat.gui";
import CapsulaEspacial from "../objectos/capsula";
import Drone from "../objectos/drone";
import EstacionEspacial from "../objectos/estacion-espacial";
import { Tierra } from "../objectos/tierra";

import Objeto3D from "../primitivas/objetos/base";
import Plano from "../primitivas/objetos/plano";
import Prueba from "../primitivas/objetos/pruebas";
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
    ringSpeed: 2,
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
      "orbital 1": new OrbitalCamera([-30, -30, 30], [0, 0, 0]).attach(),
      "orbital 2": new OrbitalCamera([-30, -30, 30], [0, 0, 0]).attach(),
      drone: new DroneCameraControl(
        [0, 5, -15],
        [0, Math.PI * 100, 0]
      ).attach(),
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
      .add(this.guiState, "ringSpeed", -10, 10, 1)
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
      case "panelRows":
        console.log("cambio filas de paneles", value);
        this.estacion.actualizarContexto(this.guiState);
      case "panelsAngle":
        console.log("cambio angulo de paneles", value);
        this.estacion.actualizarContexto(this.guiState);
      case "ringSpeed":
        console.log("cambio velocidad anillo", value);
        this.estacion.actualizarContexto(this.guiState);
      case "ringModules":
        console.log("cambio numero de modulos", value);
        this.estacion.actualizarContexto(this.guiState);
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
    const tierra = new Tierra(this.engine, 500);
    tierra.setPosition(10, -580, 10);

    this.rootObject.addChild(tierra);

    const estacion = (this.estacion = new EstacionEspacial(
      this.engine,
      this.guiState
    ));
    estacion.setPosition(0, 0, 0);

    this.rootObject.addChild(estacion);

    const capsula = new CapsulaEspacial(this.engine);
    capsula.setPosition(0, -3, -7);

    const drone = new Drone(this.engine, this.cameras.drone);
    drone.addChild(capsula);
    this.rootObject.addChild(drone);

    const plano = new Plano(this.engine);
    plano.setPosition(0, 0, 0);
    plano.setRenderMode(this.engine.gl.LINE_LOOP);

    // this.rootObject.addChild(plano);

    // determino como target de las camaras orbitales
    // el centro de la estacion, y los paneles solares
    this.cameras["orbital 1"].setTarget(estacion.getWorldPosition());
    this.cameras["orbital 2"].setTarget(estacion.paneles.getWorldPosition());

    // PRUEBAS
    const prueba = new Prueba(this.engine);
    prueba.setPosition(0, 15, 0);
    prueba.updateModelMatrix();
    // this.rootObject.addChild(prueba);

    // TODO: BORRAR ESTA LINEA
    // this.cameras["orbital 2"].setTarget(prueba.getWorldPosition());

    console.log(
      "POSICIONES",
      estacion.getWorldPosition(),
      estacion.paneles.getWorldPosition(),
      capsula.getWorldPosition(),
      tierra.getWorldPosition(),
      prueba.getWorldPosition()
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
