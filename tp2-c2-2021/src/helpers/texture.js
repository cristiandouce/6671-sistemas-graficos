export class ManagerTexturas {
  textures = {};
  doneCallbacks = [];
  /**
   * @param {import("./webgl-engine").default} engine
   */
  constructor(engine) {
    this.engine = engine;
  }

  addTexture(name, url) {
    const textura = new Textura(this.engine, name, url);
    this.textures[name] = textura;
    textura.load((err, textura) => {
      if (err) {
        console.error(`Error cargando textura ${name}: ${url}`, err);
      }

      this.checkDone();
    });
  }

  checkDone() {
    const { textures } = this;
    const loading = Object.keys(textures).some((key) => !textures.loaded);

    if (loading) {
      return;
    }

    this.doneCallbacks.forEach((cb) => cb());
  }

  getTexture(name) {
    if (!this.textures[name]) {
      console.log("textura no existente");
    }
    return this.textures[name];
  }

  // TODO: implementar metodo para esperar a que carguen las texturas
  ready(callback) {
    if (this.doneCallbacks.length === 0) {
      return callback();
    }

    this.doneCallbacks.push(callback);
  }
}

export class Textura {
  /**
   * @property {Image}
   */
  image = null;

  loaded = false;
  /**
   * @param {import("./webgl-engine").default} engine
   * @param {string} name
   * @param {string} url
   */
  constructor(engine, name, url) {
    this.loaded = false;
    this.engine = engine;
    this._texture = engine.gl.createTexture();
    this.name = name;
    this.url = url;
  }

  load(callback) {
    var img = new Image();

    img.onload = () => {
      this.image = img;
      this.initialize();
      callback(null, this);
    };

    img.onerror = (err) => {
      this.image = null;
      callback(err);
    };

    img.src = this.url;
  }

  initialize() {
    const { gl } = this.engine;
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.image
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.loaded = true;
  }

  bind() {
    const { gl, glProgram } = this.engine;

    gl.uniform1i(gl.getUniformLocation(glProgram, "hasTexture"), this.loaded);

    if (!this._texture) {
      gl.bindTexture(gl.TEXTURE_2D, null);
      return;
    }
    gl.activeTexture(this._texture);
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.uniform1i(gl.getUniformLocation(glProgram, "textura"), 0);
  }
}
