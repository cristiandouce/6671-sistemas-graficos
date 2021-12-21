import { Color } from "./color";
import { Textura } from "./texture";

export class Material {
  static create({ engine, texture, reflection, color, applyLights }) {
    const material = new Material(engine);
    if (texture) {
      material.setTexture(texture);
    }

    if (reflection) {
      material.setReflection(reflection);
    }

    material.color = color || material.color;

    material.applyLights =
      applyLights != null ? applyLights : material.applyLights;
    return material;
  }

  /**@type {import('./texture').Textura} */
  texture = null;
  /** @type {import('./texture').Textura} */
  reflection = null;

  applyLights = true;

  /**
   *
   * @param {import('./webgl-engine').default} engine
   */
  constructor(engine) {
    this.engine = engine;
    this.texture = new Textura(engine);
    this.reflection = new Textura(engine);
    // controla el color y los factores de iluminacion
    // por ambiente, difuso y especular (modelo  de Phong)
    this.color = new Color(engine);
  }

  /**
   *
   * @param {import('./texture').Textura} reflection
   */
  setReflection(reflection) {
    this.reflection = reflection;
  }

  /**
   *
   * @return {import('./texture').Textura}
   */
  getReflection() {
    return this.reflection;
  }

  /**
   *
   * @param {import('./texture').Textura} texture
   */
  setTexture(texture) {
    this.texture = texture;
  }

  /**
   *
   * @return {import('./texture').Textura}
   */
  getTexture() {
    return this.texture;
  }

  bind() {
    const { gl, glProgram } = this.engine;
    const { reflection, texture, color, applyLights } = this;

    // BIND COLOR
    color.bind();

    // BIND TEXTURA
    gl.uniform1i(
      gl.getUniformLocation(glProgram, "hasTexture"),
      texture.loaded
    );

    if (texture._texture && texture.loaded) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture._texture);
      gl.uniform1i(gl.getUniformLocation(glProgram, "textura"), 0);
    }

    // BIND REFLECTION MAP
    gl.uniform1i(
      gl.getUniformLocation(glProgram, "hasReflection"),
      reflection.loaded
    );

    if (reflection._texture && reflection.loaded) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, reflection._texture);
      gl.uniform1i(gl.getUniformLocation(glProgram, "reflection"), 1);
    }

    gl.uniform1i(gl.getUniformLocation(glProgram, "applyLights"), applyLights);
  }
}
