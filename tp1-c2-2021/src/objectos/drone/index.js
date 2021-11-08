import Objeto3D from "../../primitivas/objetos/base";

export default class Drone extends Objeto3D {
  /**
   * @type {import("../../application/camara/drone")}
   */
  camera = null;
  /**
   *
   * @param {import("../../helpers/webgl-engine")} engine
   * @param {import("../../application/camara/drone")} camera
   */
  constructor(engine, camera) {
    super(engine);
    this.camera = camera;
  }

  draw(parent) {
    this.camera.update();
    super(parent);
  }
}
