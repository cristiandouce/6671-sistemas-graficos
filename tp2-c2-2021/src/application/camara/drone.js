import { mat4, vec3 } from "gl-matrix";

export class DroneCameraControl {
  static MIN_Y = 1;

  static DELTA_TRASLACION = 0.3; // velocidad de traslacion
  static DELTA_ROTACION = 0.01; // velocidad de rotacion
  static FACTOR_INERCIA = 0.1;

  static INITIAL_STATE = {
    xVel: 0,
    zVel: 0,
    yVel: 0,
    xVelTarget: 0,
    zVelTarget: 0,
    yVelTarget: 0,

    yRotVelTarget: 0,
    yRotVel: 0,
    zRotVelTarget: 0,
    zRotVel: 0,
    xRotVelTarget: 0,
    xRotVel: 0,

    rightAxisMode: "move",
  };

  initialPosition = [0, 0, 0];
  initialRotation = [0, 0, 0];
  position = vec3.create();
  rotation = vec3.create();

  rotationMatrix = mat4.create();
  worldMatrix = mat4.create();

  state = Object.assign({}, DroneCameraControl.INITIAL_STATE);

  constructor(initialPosition = [0, 0, 0], initialRotation = [0, 0, 0]) {
    this.initialPosition = initialPosition;
    this.initialRotation = initialRotation;
    this.keyDownListener = this.keyDownListener.bind(this);
    this.keyUpListener = this.keyUpListener.bind(this);
    this.reset();
  }

  attach() {
    this.reset();
    this.bindListeners();
    return this;
  }

  bindListeners() {
    document.addEventListener("keydown", this.keyDownListener);
    document.addEventListener("keyup", this.keyUpListener);
    return this;
  }

  unbindListeners() {
    document.removeEventListener("keydown", this.keyDownListener);
    document.removeEventListener("keyup", this.keyUpListener);
    return this;
  }

  keyDownListener(e) {
    const { DELTA_ROTACION, DELTA_TRASLACION, INITIAL_STATE } =
      DroneCameraControl;
    /**
     * ASDWQE para rotar en 3 ejes en el espacio del objeto
     * Flechas + PgUp/PgDw o HJKUOL para trasladar en el espacio del objeto
     */

    switch (e.key) {
      // plano xz
      case "w":
        this.state.zVelTarget = DELTA_TRASLACION;
        break;
      case "s":
        this.state.zVelTarget = -DELTA_TRASLACION;
        break;
      case "a":
        this.state.xVelTarget = DELTA_TRASLACION;
        break;
      case "d":
        this.state.xVelTarget = -DELTA_TRASLACION;
        break;

      // eje y
      case "q":
        this.state.yVelTarget = DELTA_TRASLACION;
        break;
      case "e":
        this.state.yVelTarget = -DELTA_TRASLACION;
        break;

      // guinada
      case "ArrowLeft":
      case "j":
        this.state.yRotVelTarget = DELTA_ROTACION;
        break;
      case "ArrowRight":

      case "l":
        this.state.yRotVelTarget = -DELTA_ROTACION;
        break;

      // cabezeo
      case "ArrowUp":

      case "i":
        this.state.xRotVelTarget = DELTA_ROTACION;
        break;
      case "ArrowDown":

      case "k":
        this.state.xRotVelTarget = -DELTA_ROTACION;
        break;

      // alabeo
      case "PageUp":
      case "u":
        this.state.zRotVelTarget = DELTA_ROTACION;
        break;
      case "PageDown":
      case "o":
        this.state.zRotVelTarget = -DELTA_ROTACION;
        break;

      // controles
      case "r":
        this.reset();
        break;

      case "t":
        this.rotation = vec3.create();
        this.state = Object.assign({}, INITIAL_STATE);
        break;
    }
  }

  keyUpListener(e) {
    switch (e.key) {
      // plano xz
      case "a":
      case "d":
        this.state.xVelTarget = 0;
        break;
      case "w":
      case "s":
        this.state.zVelTarget = 0;
        break;

      // eje y
      case "q":
      case "e":
        this.state.yVelTarget = 0;

      // guinada
      case "ArrowLeft":
      case "j":
      case "ArrowRight":
      case "l":
        this.state.yRotVelTarget = 0;
        break;

      // cabezeo
      case "ArrowUp":
      case "i":
      case "ArrowDown":
      case "k":
        this.state.xRotVelTarget = 0;
        break;

      // alabeo
      case "PageUp":
      case "u":
      case "PageDown":
      case "o":
        this.state.zRotVelTarget = 0;
        break;
    }
  }

  reset() {
    const { INITIAL_STATE, DELTA_ROTACION } = DroneCameraControl;

    this.position = vec3.fromValues(...this.initialPosition);
    this.rotation = vec3.fromValues(...this.initialRotation);
    this.state = Object.assign({}, INITIAL_STATE);

    this.rotationMatrix = mat4.create();
    mat4.rotateX(
      this.rotationMatrix,
      this.rotationMatrix,
      this.rotation[0] * DELTA_ROTACION
    );
    mat4.rotateY(
      this.rotationMatrix,
      this.rotationMatrix,
      this.rotation[1] * DELTA_ROTACION
    );

    mat4.rotateZ(
      this.rotationMatrix,
      this.rotationMatrix,
      this.rotation[2] * DELTA_ROTACION
    );

    this.worldMatrix = mat4.create();
    mat4.translate(this.worldMatrix, this.worldMatrix, this.position);
    mat4.multiply(this.worldMatrix, this.worldMatrix, this.rotationMatrix);

    return this;
  }

  update() {
    const { FACTOR_INERCIA } = DroneCameraControl;
    const { state, rotation, rotationMatrix, position } = this;
    state.xVel += (state.xVelTarget - state.xVel) * FACTOR_INERCIA;
    state.yVel += (state.yVelTarget - state.yVel) * FACTOR_INERCIA;
    state.zVel += (state.zVelTarget - state.zVel) * FACTOR_INERCIA;

    state.xRotVel += (state.xRotVelTarget - state.xRotVel) * FACTOR_INERCIA;
    state.yRotVel += (state.yRotVelTarget - state.yRotVel) * FACTOR_INERCIA;
    state.zRotVel += (state.zRotVelTarget - state.zRotVel) * FACTOR_INERCIA;

    let translation = vec3.fromValues(-state.xVel, state.yVel, -state.zVel);

    if (Math.abs(state.xRotVel) > 0) {
      // este metodo aplica una rotacion en el eje AXIS en el espacio del objeto o respecto del eje "local", NO el eje de mundo
      mat4.rotate(
        rotationMatrix,
        rotationMatrix,
        state.xRotVel,
        vec3.fromValues(1, 0, 0)
      );
    }

    if (Math.abs(state.yRotVel) > 0) {
      mat4.rotate(
        rotationMatrix,
        rotationMatrix,
        state.yRotVel,
        vec3.fromValues(0, 1, 0)
      );
    }

    if (Math.abs(state.zRotVel) > 0) {
      mat4.rotate(
        rotationMatrix,
        rotationMatrix,
        state.zRotVel,
        vec3.fromValues(0, 0, 1)
      );
    }

    vec3.transformMat4(translation, translation, rotationMatrix);
    vec3.add(position, position, translation);

    this.worldMatrix = mat4.create();
    mat4.translate(this.worldMatrix, this.worldMatrix, position);
    mat4.multiply(this.worldMatrix, this.worldMatrix, rotationMatrix);
  }

  getViewMatrix = function () {
    const { worldMatrix } = this;
    let m = mat4.clone(worldMatrix);
    mat4.invert(m, m);
    return m;
  };

  getMatrix = function () {
    const { worldMatrix } = this;
    return worldMatrix;
  };
}
