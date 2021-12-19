import { mat3, mat4, vec3, vec4 } from "gl-matrix";
import Superficie from "./_superficie";

export class SuperficieRevolucion extends Superficie {
  /** @type {import("../curvas/recorrido").default} */
  shape = null;
  shapeStep = 0.01;

  /**
   *
   * @param {import("../curvas/recorrido").default} shape
   * @param {import("../curvas/recorrido").default} route
   * @param {number} shapeStep
   * @param {number} routeStep
   */
  constructor(
    shape = null,
    symmetryAxis = "Z",
    levels = 512,
    pointsPerLevel = 128
  ) {
    super();
    this.shape = shape;
    this.symmetryAxis = symmetryAxis;
    this.levels = levels;
    this.pointsPerLevel = pointsPerLevel;

    // cache buffers
    this.buffers = null;
  }

  getRotationMatrix(v) {
    const thetha = 2 * Math.PI * v;
    const cos = Math.cos(thetha);
    const sen = Math.sin(thetha);

    // ROTACION X
    if ("X" === this.symmetryAxis) {
      return mat3.fromValues(
        // primer columna
        1,
        0,
        0,

        // segunda columna

        0,
        cos,
        sen,

        // tercer columna
        0,
        -sen,
        cos
      );
    }

    // ROTACION Y
    if ("Y" === this.symmetryAxis) {
      return mat3.fromValues(
        // primer columna
        cos,
        0,
        -sen,

        // segunda columna
        0,
        1,
        0,

        // tercer columna
        sen,
        0,
        cos
      );
    }

    // ROTACION Z
    return mat3.fromValues(
      // primer columna
      Math.cos(thetha),
      Math.sin(thetha),
      0,

      // segunda columna
      -Math.sin(thetha),
      Math.cos(thetha),
      0,

      // tercer columna
      0,
      0,
      1
    );
  }

  getNormalMatrix(v) {
    const thetha = 2 * Math.PI * v;
    const cos = Math.cos(thetha);
    const sen = Math.sin(thetha);

    // ROTACION X
    if ("X" === this.symmetryAxis) {
      return mat3.fromValues(
        // primer columna
        1,
        0,
        0,

        // segunda columna

        0,
        cos,
        sen,

        // tercer columna
        0,
        -sen,
        cos
      );
    }

    // ROTACION Y
    if ("Y" === this.symmetryAxis) {
      return mat3.fromValues(
        // primer columna
        cos,
        0,
        -sen,

        // segunda columna
        0,
        1,
        0,

        // tercer columna
        sen,
        0,
        cos
      );
    }

    // ROTACION Z
    return mat4.fromValues(
      // primer columna
      cos,
      sen,
      0,
      0,

      // segunda columna
      -sen,
      cos,
      0,
      0,

      // tercer columna
      0,
      0,
      1,
      0,

      0,
      0,
      0,
      1
    );
  }

  getPosicion(u, v) {
    const pos = this.shape.getPosition(u);
    const rotationMatrix = this.getRotationMatrix(v);
    vec3.transformMat3(pos, pos, rotationMatrix);
    return pos;
  }

  getNormal(u, v) {
    const nrm = this.shape.getNormal(u);
    const normalMatrix = this.getNormalMatrix(v);
    vec3.scale(nrm, nrm, -1);
    // mat3.invert(rotationMatrix, rotationMatrix);
    // mat3.transpose(rotationMatrix, rotationMatrix);
    vec3.transformMat4(nrm, nrm, normalMatrix);
    return nrm;
  }

  getTexture(u, v) {
    return [u, v];
  }
}
