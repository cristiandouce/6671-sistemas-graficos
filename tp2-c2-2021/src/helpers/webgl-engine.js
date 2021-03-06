import { mat4 } from "gl-matrix";
import { Ligths } from "./lights";
import { ManagerTexturas } from "./texture";

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

  /**
   * @description manager de luces
   * @type {import("./lights").Ligths}
   */
  lights = null;

  /** @type {import("gl-matrix").ReadonlyMat4} */
  viewMatrix = mat4.create();
  /** @type {import("gl-matrix").ReadonlyMat4} */
  projMatrix = mat4.create();
  /** @type {import("gl-matrix").ReadonlyMat4} */
  normalMatrix = mat4.create();

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
    this.textureManager = new ManagerTexturas(this);
    this.lights = new Ligths(this);

    try {
      this.canvas.width = "1280";
      this.canvas.height = "1024";
      this.gl = this.canvas.getContext("webgl");
    } catch (error) {
      const msg = `Error al inicializar el WebGL Engine: ${error.message}`;
      console.error(msg, error);
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

    this.setup();
    this.initShaders();
  }

  setup() {
    this.gl.enable(this.gl.DEPTH_TEST);
    //set the clear color
    this.gl.clearColor(0.9, 0.0, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(
      this.projMatrix,
      45,
      this.canvas.width / this.canvas.height,
      0.1,
      2000.0
    );

    // mat4.identity(this.viewMatrix);
    // mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -10.0]);
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

  loadTextures(textures = []) {
    textures.forEach(({ name, url }) => {
      this.textureManager.addTexture(name, url);
    });
  }

  getTexture(name) {
    return this.textureManager.getTexture(name);
  }

  // esto de momento parece pertenecer al engine, pq tiene conocimiento no solo
  // de la matriz de modelo del objeto, sino también de la de vista y projección
  // que son necesarias para dibujar la escena (globales).
  // Lo que hace es preparar las variables uniform para los shaders, asignando
  // las matrices de mi programa, relativas al objeto que estoy por dibujar ahora.
  setupVertexShaderMatrix(modelMatrix, normalMatrix) {
    const { gl, glProgram, viewMatrix, projMatrix } = this;

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
    // lo que estoy por dibujar. La model matrix proviende del modelo a representar ahora
    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
  }

  drawLights() {
    this.lights.bind();
  }

  getViewMatrix() {
    return mat4.clone(this.viewMatrix);
  }

  setViewMatrix(viewMatrix) {
    this.viewMatrix = viewMatrix;
  }

  ready(cb) {
    this.textureManager.ready(cb);
  }
}
