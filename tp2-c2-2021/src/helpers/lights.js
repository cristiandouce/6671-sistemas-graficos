import { mat4, vec3 } from "gl-matrix";

export class Ligths {
  lights = [];

  constructor(engine) {
    this.engine = engine;
  }

  get length() {
    return this.lights.length;
  }

  createLight(options = {}) {
    const light = Light.create(this.engine, options);
    this.lights.push(light);
    console.log("LIGHT", light);
    return light;
  }

  bind() {
    const { gl, glProgram } = this.engine;

    this.lights.forEach((light, i) => {
      const lightLoaded = gl.getUniformLocation(
        glProgram,
        `lights[${i}].loaded`
      );
      gl.uniform1i(lightLoaded, light.loaded);

      const ligthPos = gl.getUniformLocation(
        glProgram,
        `lights[${i}].position`
      );
      gl.uniform3fv(ligthPos, light.position);

      const lightColor = gl.getUniformLocation(glProgram, `lights[${i}].color`);
      gl.uniform3fv(lightColor, light.color);

      const ligthDirection = gl.getUniformLocation(
        glProgram,
        `lights[${i}].direction`
      );
      gl.uniform3fv(
        ligthDirection,
        vec3.sub(vec3.create(), light.direction, light.position)
      );

      const cosThreshold = gl.getUniformLocation(
        glProgram,
        `lights[${i}].cos_threshold`
      );
      gl.uniform1f(cosThreshold, Math.cos(light.maxAngle));

      const lightDecay = gl.getUniformLocation(glProgram, `lights[${i}].decay`);
      gl.uniform1f(lightDecay, light.decay);

      const lightDecayC = gl.getUniformLocation(
        glProgram,
        `lights[${i}].decayCoefficients`
      );
      gl.uniform3fv(lightDecayC, light.decayCoefficients);
    });
  }
}

export class Light {
  static types = {
    LIGHT_TYPE_OMNIDIRECTIONAL: 0,
    LIGHT_TYPE_DIRECTIONAL: 1,
    LIGHT_TYPE_SPOTLIGHT: 2,
  };

  static create(engine, options = {}) {
    const light = new Light(engine);

    light.type = options.type || light.type;
    light.color = options.color || light.color;
    light.position = options.position || light.position;
    light.maxAngle = options.maxAngle || light.maxAngle;
    light.decayCoefficients =
      options.decayCoefficients || light.decayCoefficients;
    light.setDirection(options.direction || light.direction);

    // options
    return light;
  }

  constructor(engine) {
    this.engine = engine;
    this.color = vec3.fromValues(1.0, 1.0, 1.0);
    this.type = Light.types.LIGHT_TYPE_OMNIDIRECTIONAL; // luz por defecto
    this.position = vec3.create();
    this.direction = vec3.create();
    this.maxAngle = Math.PI;
    this.decayCoefficients = vec3.fromValues(0.0, 1.0, 0.0);

    // flag para detener la iteracion del shader de luces
    this.loaded = true;
  }

  draw(parentModelMatrix = null) {
    if (parentModelMatrix) {
      this.updatePosition(parentModelMatrix);
    }
  }

  setDirection(direction = vec3.create()) {
    this.originalDirection = direction;
    this.direction = direction;
  }

  setParent() {}

  updatePosition(parentModelMatrix = mat4.create()) {
    const normal = vec3.fromValues(...this.originalDirection);
    const normalMatrix = mat4.clone(parentModelMatrix);

    // actualizamos la posición actual de la camara
    mat4.getTranslation(this.position, parentModelMatrix);

    // obtenemos la matriz normal, para multiplicar por la dirección normal
    // de la luz...
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    vec3.transformMat4(normal, normal, normalMatrix);

    // asignamos la nueva dirección de la luz
    vec3.set(this.direction, normal[0], normal[1], normal[2]);
    vec3.normalize(this.direction, this.direction);
  }
}
