import { mat4, vec3 } from "gl-matrix";

export class OrbitalCamera {
  static FACTOR_VELOCIDAD = 0.01;
  static MIN_RADIUS = 2;
  static MAX_RADIUS = 80;

  initialPosition = [0, 10, 10];
  targetPosition = [0, 0, 0];

  alpha = 0;
  beta = 0.01;

  mouse = { current: { x: 0, y: 0 }, previous: { x: 0, y: 0 } };
  radius = 30;

  isMouseDown = false;

  constructor(initialPosition = [0, 10, 10], targetPosition = [0, 0, 0]) {
    this.initialPosition = initialPosition;
    this.targetPosition = targetPosition;

    this.eyePosition = vec3.fromValues(...this.initialPosition);

    this.updateAlphaBetaFromTarget();

    this.mouseMoveListener = this.mouseMoveListener.bind(this);
    this.mouseDownListener = this.mouseDownListener.bind(this);
    this.mouseUpListener = this.mouseUpListener.bind(this);
    this.mouseWheelListener = this.mouseWheelListener.bind(this);
    this.keyDownListener = this.keyDownListener.bind(this);
  }

  bindListeners() {
    document.addEventListener("mousemove", this.mouseMoveListener);
    document.addEventListener("mousedown", this.mouseDownListener);
    document.addEventListener("mouseup", this.mouseUpListener);
    document.addEventListener("wheel", this.mouseWheelListener);
    document.addEventListener("keydown", this.keyDownListener);
  }

  unbindListeners() {
    document.removeEventListener("mousemove", this.mouseMoveListener);
    document.removeEventListener("mousedown", this.mouseDownListener);
    document.removeEventListener("mouseup", this.mouseUpListener);
    document.removeEventListener("wheel", this.mouseWheelListener);
    document.removeEventListener("keydown", this.keyDownListener);
  }

  /**
   * Setea flag del mouse apretado a `true`
   * @param {MouseEvent} e
   */
  mouseDownListener(e) {
    this.isMouseDown = true;

    // Actualizamos la posicion en funcion del delta
    // no de la posición que es relativa al viewport
    this.mouse.previous.x = e.clientX || e.pageX;
    this.mouse.previous.y = e.clientY || e.pageY;
    this.mouse.current.x = e.clientX || e.pageX;
    this.mouse.current.y = e.clientY || e.pageY;
  }

  /**
   * Setea flag del mouse apretado a `false`
   * @param {MouseEvent} e
   */
  mouseUpListener() {
    this.isMouseDown = false;
  }

  /**
   * Actualiza la posición del mouse en funcion de lo
   * que retorne. Solo si el mouse está presionado.
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (!this.isMouseDown) {
      return;
    }

    // actualizamos la actual posicion, cuando nos movemos
    // luego de haber hecho click.
    this.mouse.current.x = e.clientX || e.pageX;
    this.mouse.current.y = e.clientY || e.pageY;
  }

  /**
   * Actualiza el "zoom" o bien el radio de proximidad
   * al `target` que la camara apunta.
   * @param {MouseEvent} e
   */
  mouseWheelListener(e) {
    const { FACTOR_VELOCIDAD, MIN_RADIUS, MAX_RADIUS } = OrbitalCamera;
    // Hacemos que el radio se mueva más rápido que los giros.
    const deltaRadius = e.deltaY * FACTOR_VELOCIDAD * 5;

    const newRadius = this.radius + deltaRadius;

    if (newRadius < MIN_RADIUS || newRadius > MAX_RADIUS) {
      return;
    }

    // Actualizo el radio solo si estoy dentro de los limites
    this.radius = newRadius;
  }

  /**
   * Actualiza el "zoom" o bien el radio de proximidad
   * al `target` que la camara apunta.
   * @param {MouseEvent} e
   */
  keyDownListener(e) {
    if (e.key !== "z" && e.key !== "x") {
      return;
    }

    const mult = e.key === "z" ? -1 : 1;

    const { FACTOR_VELOCIDAD, MIN_RADIUS, MAX_RADIUS } = OrbitalCamera;
    // Hacemos que el radio se mueva más rápido que los giros.
    const deltaRadius = mult * FACTOR_VELOCIDAD * 50;

    const newRadius = this.radius + deltaRadius;

    if (newRadius < MIN_RADIUS || newRadius > MAX_RADIUS) {
      return;
    }

    // Actualizo el radio solo si estoy dentro de los limites
    this.radius = newRadius;
  }

  attach() {
    this.bindListeners();
    return this;
  }

  /**
   * Determina la posición a mirar por la cámara orbital
   * @param {number[]} target
   */
  setTarget(target = [0, 0, 0]) {
    this.targetPosition = target;
    this.updateAlphaBetaFromTarget();
  }

  updateAlphaBetaFromTarget() {
    const deltaX = this.initialPosition[0] - this.targetPosition[0];
    const deltaY = this.initialPosition[1] - this.targetPosition[1];
    const deltaZ = this.initialPosition[2] - this.targetPosition[2];

    if (deltaX > 0 && deltaY > 0) {
      this.alpha = Math.atan(deltaY / deltaX);
    } else if (deltaX > 0 && deltaY < 0) {
      this.alpha = 2 * Math.PI + Math.atan(deltaY / deltaX);
    } else if (deltaX < 0) {
      this.alpha = Math.PI + Math.atan(deltaY / deltaX);
    } else if (deltaX === 0) {
      this.alpha = (Math.PI / 2) * Math.sign(deltaY);
    }

    if (deltaZ > 0) {
      this.beta = Math.atan(
        Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaZ
      );
    } else if (deltaZ < 0) {
      this.beta =
        Math.PI +
        Math.atan(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaZ);
    } else if (deltaZ === 0) {
      this.beta = Math.PI / 2;
    }

    const radious = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2)
    );

    if (
      radious > OrbitalCamera.MIN_RADIUS &&
      radious < OrbitalCamera.MAX_RADIUS
    ) {
      this.radius = radious;
    }
  }
  /**
   * Actualiza la posición del ojo en funcion de las posiciones
   * de los parametros del mouse y la rueda determinados.
   */
  update() {
    const { FACTOR_VELOCIDAD } = OrbitalCamera;
    const {
      mouse: { current: currentMouse, previous: previousMouse },
      radius,
    } = this;

    const deltaX = currentMouse.x - previousMouse.x;
    const deltaY = currentMouse.y - previousMouse.y;

    previousMouse.x = currentMouse.x;
    previousMouse.y = currentMouse.y;

    this.alpha += FACTOR_VELOCIDAD * deltaX;
    this.beta -= FACTOR_VELOCIDAD * deltaY;

    if (this.beta < 0) {
      // se requiere un limite, de lo contrario hay posiciones
      // que dan 0 en el limite cuando no deberian
      this.beta = 0.001;
    }

    if (this.beta > Math.PI) {
      // se requiere un limite, de lo contrario hay posiciones
      // que dan 0 en el limite cuando no deberian
      this.beta = Math.PI - 0.001;
    }

    this.alpha = this.alpha % (2 * Math.PI);

    let { alpha, beta } = this;

    // Calculamos las nuevas posiciones del "expectador"
    // recordando que tienen que estar centradas en nuestro target
    // para que la camara sea puramente orbital
    const eyePositionX =
      this.targetPosition[0] + radius * Math.cos(alpha) * Math.sin(beta);
    const eyePositionY = this.targetPosition[1] + radius * Math.cos(beta);
    const eyePositionZ =
      this.targetPosition[2] + radius * Math.sin(alpha) * Math.sin(beta);

    this.eyePosition = vec3.fromValues(
      eyePositionX,
      eyePositionY,
      eyePositionZ
    );
  }

  getViewMatrix() {
    const viewMatrix = mat4.create();
    const YAxis = vec3.fromValues(0, 1, 0);
    mat4.lookAt(
      viewMatrix,
      this.eyePosition,
      vec3.fromValues(...this.targetPosition),
      YAxis
    );

    return viewMatrix;
  }

  getPosition() {
    return this.eyePosition;
  }
}
