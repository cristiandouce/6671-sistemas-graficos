import { mat4, vec3 } from "gl-matrix";

import Superficie from "../superficies/_superficie";

export default class Objeto3D {
  /**
   * @type {import("../../helpers/webgl-engine").default}
   */
  engine = null;

  /**
   * @description buffers a pasar al programa para el procesado
   */
  buffers = {};

  /**
   * @description vector de posición del objeto respecto de su eje de referencia
   */
  position = vec3.create();

  /**
   * @description vector de rotación del objeto respecto de su eje de referencia
   */
  rotation = vec3.create();

  /**
   * @description vector de escala del objeto
   */
  scale = vec3.fromValues(1, 1, 1);

  /**
   * @description matriz de modelado del objeto
   */
  modelMatrix = mat4.create();

  /**
   * @description hijos del Objeto3D, en el arbol de la escena
   * @type {Objeto3D[]}
   */
  children = [];

  /**
   * @description superficie que define la geometria del objeto - las clases que hereden de Objeto3D, tienen que implementarla
   */
  superficie = new Superficie(1, 1);

  /**
   * @description Color del objeto
   */
  color = vec3.fromValues(
    256 * Math.random(),
    256 * Math.random(),
    256 * Math.random()
  );

  /**
   *
   * @param {import("../../helpers/webgl-engine").default} engine
   */
  constructor(engine) {
    this.engine = engine;
    this.setupBuffers();
    console.log("OBJETO3D", this);
    this.updateModelMatrix();
    console.log("OBJETO", this);
  }

  setupBuffers() {
    const { position, normal, texture, index } =
      this.superficie.getArrayBuffers();
    const { gl } = this.engine;

    // Creación e Inicialización de los buffers
    // al position buffer también se lo suele nombrar "vertexBuffer", pasa que use
    // los distintos demos para componer esto.
    const webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = position.length / 3;

    const webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normal.length / 3;

    const webgl_texture_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);
    webgl_texture_buffer.itemSize = 2;
    webgl_texture_buffer.numItems = texture.length / 2;

    const webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(index),
      gl.STATIC_DRAW
    );
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = index.length;

    this.buffers = {
      position: webgl_position_buffer,
      normal: webgl_normal_buffer,
      texture: webgl_texture_buffer,
      index: webgl_index_buffer,
    };
  }

  /**
   * Agrega un Objeto3D como hijo
   * @param {Objeto3D} child
   */
  addChild(child) {
    this.children.push(child);
  }

  /**
   * Agrega un Objeto3D como hijo
   * @param {Objeto3D} child
   */
  removeChild(child) {
    const foundIndex = this.children.findIndex((c) => c == child);
    if (foundIndex !== -1) {
      this.children.splice(foundIndex, 1);
    }
  }

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setPosition(x, y, z) {
    vec3.set(this.position, x, y, z);
  }

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setRotation(x, y, z) {
    vec3.set(this.position, x, y, z);
  }

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setEscala(x, y, z) {
    vec3.set(this.position, x, y, z);
  }

  /**
   * @description Actualiza la matriz de modelado usando posicion, rotacion y escala
   * @private
   */
  updateModelMatrix() {
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);

    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);

    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }

  /**
   * @description Dibuja el objeto en la escena, usando el programa, e iterando sobre todos los hijos.
   * @param {import('gl-matrix').ReadonlyMat4} parentModelMatrix la matriz de modelo del padre a usar como base
   */
  draw(parentModelMatrix = mat4.create()) {
    const worldModelMatrix = mat4.create();

    // Obteno la matriz de modelado respecto del mundo
    mat4.multiply(worldModelMatrix, parentModelMatrix, this.modelMatrix);

    // Dibujo mi objeto
    if (this.buffers.position && this.buffers.index) {
      this.engine.setupVertexShaderMatrix(worldModelMatrix);
      this.drawScene();
    }

    // Imboco para el arbol de hijos, el dibujado
    // OJO, capaz el for-each no me sirve, por ser "async" el llamado...
    // necesitaría capaz usar un for-loop.
    this.children.forEach((child) => child.draw(worldModelMatrix));
  }

  drawScene() {
    const { gl, glProgram } = this.engine;

    console.log(this.buffers);

    const vertexPositionAttribute = gl.getAttribLocation(
      glProgram,
      "aVertexPosition"
    );
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(
      vertexPositionAttribute,
      this.buffers.position.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    const vertexNormalAttribute = gl.getAttribLocation(
      glProgram,
      "aVertexNormal"
    );
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
    gl.vertexAttribPointer(
      vertexNormalAttribute,
      this.buffers.normal.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    // bindeo el indexBuffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);

    // Y finalmente dibujo los streams, acá es donde se triggerean los shaders
    // de vertex y fragment, y se empieza a pintar la pantalla con mi objeto.
    gl.drawElements(
      gl.TRIANGLE_STRIP,
      this.buffers.index.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}