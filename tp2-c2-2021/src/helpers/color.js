import { vec3 } from "gl-matrix";

export class Color {
  static create(engine, options) {
    const color = new Color(engine);

    // inicializo sobre parametros
    color.rgb = options.rgb || color.rgb;
    color.phongConstants = options.phongConstants || color.phongConstants;
    color.glossiness = options.glossiness || color.glossiness;

    // retorno color
    return color;
  }
  constructor(engine) {
    this.engine = engine;
    this.rgb = vec3.fromValues(0.1, 1.0, 0.3);
    // kd, ka, ks
    this.phongConstants = vec3.fromValues(0.1, 1.0, 0.5);
    this.glossiness = 0.5;
  }

  bind() {
    const { gl, glProgram } = this.engine;

    // attach color uniforms and attributes
    const pointColorUniform = gl.getUniformLocation(glProgram, "vPointColor");

    const phongConstantsUniform = gl.getUniformLocation(
      glProgram,
      "phongConstants"
    );

    const glossinessUniform = gl.getUniformLocation(glProgram, "glossiness");

    gl.uniform3fv(pointColorUniform, this.rgb);
    gl.uniform3fv(phongConstantsUniform, this.phongConstants);
    gl.uniform1f(glossinessUniform, this.glossiness);
  }
}
