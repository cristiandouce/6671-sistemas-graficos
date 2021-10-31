import { mat4, vec3 } from "gl-matrix";
import Granada from "../primitivas/objetos/granada";

// TODO: revisar las responsabilidades de esta clase
// tranquilamente podría llamarla "Mundo" o simplemente "Programa"
// debería tener la posibilidad de agregar la cámara y la raiz del arbol
// de objetos de mi mundo a esta clase, y asi controlar todo.
// Ya que los objetos dependen del Engine para dibujarse...
export default class GLEngine {
  /** @type {HTMLCanvasElement} */
  canvas = null;

  /** @type {WebGLRenderingContext} */
  gl = null;

  /** @type {WebGLProgram} */
  glProgram = null;

  /** @type {import("gl-matrix").ReadonlyMat4} */
  modelMatrix = mat4.create();
  viewMatrix = mat4.create();
  projMatrix = mat4.create();
  normalMatrix = mat4.create();
  rotate_angle = -1.57078;

  vertexPositionAttribute = null;
  trianglesVerticeBuffer = null;
  vertexNormalAttribute = null;
  trianglesNormalBuffer = null;
  trianglesIndexBuffer = null;

  /**
   * @param {object} options el objeto de configuracion de mi GLEngine class
   * @param {HTMLCanvasElement} [options.canvas] El Canvas element del DOM para trabajar
   * @param {object} [options.shaders] Los shaders del engine
   * @param {object} [options.shaders.vertex] El vertex shader
   * @param {object} [options.shaders.fragment] El fragment shader
   *
   */
  constructor({ canvas, shaders }) {
    this.canvas = canvas;
    this.shaders = shaders;
    try {
      this.gl = this.canvas.getContext("webgl");
    } catch (error) {
      const msg = `Error al inicializar el WebGL Engine: ${error.message}`;
      console.error(msg);
      alert(msg);
    }
  }

  /**
   * Inicializa el engine de WebGL
   */
  init() {
    if (!this.gl) {
      return console.error(
        "Imposible inicializar el engine sin el WebGL context"
      );
    }
    this.granada = new Granada(this);

    this.setup();
    this.initShaders();
    // this.setupBuffers();
    // this.setupVertexShaderMatrix();
    this.tick();
  }

  setup() {
    this.gl.enable(this.gl.DEPTH_TEST);
    //set the clear color
    this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(
      this.projMatrix,
      45,
      this.canvas.width / this.canvas.height,
      0.1,
      100.0
    );

    mat4.identity(this.modelMatrix);
    mat4.rotate(this.modelMatrix, this.modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

    mat4.identity(this.viewMatrix);
    mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -5.0]);
  }

  initShaders() {
    //get shader source
    const fs_source = this.shaders.fragment;
    const vs_source = this.shaders.vertex;

    //compile shaders
    const vertexShader = this.makeShader(vs_source, this.gl.VERTEX_SHADER);
    const fragmentShader = this.makeShader(fs_source, this.gl.FRAGMENT_SHADER);

    //create program
    this.glProgram = this.gl.createProgram();

    //attach and link shaders to the program
    this.gl.attachShader(this.glProgram, vertexShader);
    this.gl.attachShader(this.glProgram, fragmentShader);
    this.gl.linkProgram(this.glProgram);

    if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program.");
    }

    //use program
    this.gl.useProgram(this.glProgram);
  }

  /**
   *
   * @param {WebGLProgram} src
   * @param {WebGLRenderingContextBase.FRAGMENT_SHADER | WebGLRenderingContextBase.VERTEX_SHADER} type
   * @returns
   */
  makeShader(src, type) {
    //compile the vertex shader
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(
        "Error compiling shader: " + this.gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }

  setupBuffers() {
    const pos = [];
    const normal = [];
    const r = 2;
    const rows = 128;
    const cols = 256;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const alfa = (j / (cols - 1)) * Math.PI * 2;
        const beta = (0.1 + (i / (rows - 1)) * 0.8) * Math.PI;

        const p = this.getPos(alfa, beta);

        pos.push(p[0]);
        pos.push(p[1]);
        pos.push(p[2]);

        const n = this.getNrm(alfa, beta);

        normal.push(n[0]);
        normal.push(n[1]);
        normal.push(n[2]);
      }
    }

    this.trianglesVerticeBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(pos),
      this.gl.STATIC_DRAW
    );

    this.trianglesNormalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(normal),
      this.gl.STATIC_DRAW
    );

    const index = [];

    for (let i = 0; i < rows - 1; i++) {
      index.push(i * cols);
      for (let j = 0; j < cols - 1; j++) {
        index.push(i * cols + j);
        index.push((i + 1) * cols + j);
        index.push(i * cols + j + 1);
        index.push((i + 1) * cols + j + 1);
      }
      index.push((i + 1) * cols + cols - 1);
    }

    this.trianglesIndexBuffer = this.gl.createBuffer();
    this.trianglesIndexBuffer.number_vertex_point = index.length;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(index),
      this.gl.STATIC_DRAW
    );
  }

  getPos(alfa, beta) {
    const r = 2;
    const nx = Math.sin(beta) * Math.sin(alfa);
    const ny = Math.sin(beta) * Math.cos(alfa);
    const nz = Math.cos(beta);

    const g = beta % 0.5;
    const h = alfa % 1;
    let f = 1;

    if (g < 0.25) f = 0.95;
    if (h < 0.5) f = f * 0.95;

    const x = nx * r * f;
    const y = ny * r * f;
    const z = nz * r * f;

    return [x, y, z];
  }

  getNrm(alfa, beta) {
    const p = this.getPos(alfa, beta);
    const v = vec3.create();
    vec3.normalize(v, p);

    const delta = 0.05;
    const p1 = this.getPos(alfa, beta);
    const p2 = this.getPos(alfa, beta + delta);
    const p3 = this.getPos(alfa + delta, beta);

    const v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    const v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    const n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }

  // esto de momento parece pertenecer al engine, pq tiene conocimiento no solo
  // de la matriz de modelo del objeto, sino también de la de vista y projección
  // que son necesarias para dibujar la escena (globales).
  // Lo que hace es preparar las variables uniform para los shaders, asignando
  // las matrices de mi programa, relativas al objeto que estoy por dibujar ahora.
  setupVertexShaderMatrix(objectModelMatrix) {
    const { gl, glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix } =
      this;

    // obtengo referencias a las matrices del programa, del modelo a dibujar,
    // de la vista, projección y normal...
    const modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    const viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
    const projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
    const normalMatrixUniform = gl.getUniformLocation(
      glProgram,
      "normalMatrix"
    );

    // Y luego asigno a estas variables uniformes de los shaders a las matrices de
    // lo que estoy por dibujar.
    gl.uniformMatrix4fv(
      modelMatrixUniform,
      false,
      // temporal, reubicando las responsabildiades
      objectModelMatrix || modelMatrix
    );

    console.log("lalala", objectModelMatrix || modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
  }

  tick() {
    // requestAnimationFrame(this.tick.bind(this));
    this.granada.draw();
    setTimeout(() => {
      this.granada.draw();
    }, 5000);
    // this.drawScene();
    // this.animate();
  }

  drawScene() {
    const { gl, glProgram } = this;
    this.setupVertexShaderMatrix();

    console.log("ENGINE", this);
    this.vertexPositionAttribute = gl.getAttribLocation(
      glProgram,
      "aVertexPosition"
    );
    gl.enableVertexAttribArray(this.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    gl.vertexAttribPointer(
      this.vertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    this.vertexNormalAttribute = gl.getAttribLocation(
      glProgram,
      "aVertexNormal"
    );
    gl.enableVertexAttribArray(this.vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
    gl.vertexAttribPointer(
      this.vertexNormalAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
    gl.drawElements(
      gl.TRIANGLE_STRIP,
      this.trianglesIndexBuffer.number_vertex_point,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  // TODO: falta ver donde incorporar esto, si en objeto, o en engine...
  // ... y a que tiempos. PQ el angulo de rotacion, y la animación en sí
  // son parte del objeto, pero el resto de las matrices son globales...
  animate() {
    this.rotate_angle += 0.01;
    mat4.identity(this.modelMatrix);
    mat4.rotate(
      this.modelMatrix,
      this.modelMatrix,
      this.rotate_angle,
      [1.0, 0.0, 1.0]
    );

    mat4.identity(this.normalMatrix);
    mat4.multiply(this.normalMatrix, this.viewMatrix, this.modelMatrix);
    mat4.invert(this.normalMatrix, this.normalMatrix);
    mat4.transpose(this.normalMatrix, this.normalMatrix);
  }
}
