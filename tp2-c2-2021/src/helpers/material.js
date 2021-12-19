import { Textura } from "./texture";

export class Material {
  static create({ engine, texture, reflection }) {
    const material = new Material(engine);
    if (texture) {
      material.setTexture(texture);
    }

    if (reflection) {
      material.setReflection(reflection);
    }

    return material;
  }

  /**@type {import('./texture').Textura} */
  texture = null;
  /** @type {import('./texture').Textura} */
  reflection = null;
  /**
   *
   * @param {import('./webgl-engine').default} engine
   */
  constructor(engine) {
    this.engine = engine;
    this.texture = new Textura(engine);
    this.reflection = new Textura(engine);

    // TODO: agregar luces
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
    const { reflection, texture } = this;

    // BIND TEXTURA
    gl.uniform1i(
      gl.getUniformLocation(glProgram, "hasTexture"),
      texture.loaded
    );

    if (texture._texture && texture.loaded) {
      gl.activeTexture(texture._texture);
      gl.bindTexture(gl.TEXTURE_2D, texture._texture);
      gl.uniform1i(gl.getUniformLocation(glProgram, "textura"), 0);
    }

    // BIND REFLECTION MAP
    gl.uniform1i(
      gl.getUniformLocation(glProgram, "hasReflection"),
      reflection.loaded
    );

    if (reflection._texture && reflection.loaded) {
      gl.activeTexture(reflection._texture);
      gl.bindTexture(gl.TEXTURE_2D, reflection._texture);
      gl.uniform1i(gl.getUniformLocation(glProgram, "reflection"), 1);
    }
  }
}
