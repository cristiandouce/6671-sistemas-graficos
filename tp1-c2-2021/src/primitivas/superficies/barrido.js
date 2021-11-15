import { mat3, mat4, vec3, vec4 } from "gl-matrix";
import Superficie from "./_superficie";

export class SuperficieBarrido extends Superficie {
  /** @type {import("../curvas/recorrido").default} */
  shape = null;
  shapeStep = 0.01;

  /** @type {import("../curvas/recorrido").default} */
  route = null;
  routeStep = 0.01;

  /**
   *
   * @param {import("../curvas/recorrido").default} shape
   * @param {import("../curvas/recorrido").default} route
   * @param {number} shapeStep
   * @param {number} routeStep
   */
  constructor(shape = null, route = null, shapeStep = 0.01, routeStep = 0.01) {
    super();
    this.shape = shape;
    this.route = route;
    this.shapeStep = shapeStep;
    this.routeStep = routeStep;

    this.levels = 1 / this.routeStep;
    this.pointsPerLevel = 1 / this.shapeStep;
  }

  getLevelMatrix(v) {
    const position = this.route.getPosition(v);
    const tangent = this.route.getTangent(v);
    const normal = this.route.getNormal(v);
    const binormal = this.route.getBinormal(v);

    const levelMatrix = mat4.fromValues(
      // primer columna
      normal[0],
      normal[1],
      normal[2],
      0,

      // segunda columna

      tangent[0],
      tangent[1],
      tangent[2],
      0,
      // tercer columna

      binormal[0],
      binormal[1],
      binormal[2],
      0,
      // cuarta columna
      position[0],
      position[1],
      position[2],
      1
    );

    return levelMatrix;
  }

  getArrayBuffers() {
    const positionBuffer = [];
    const normalBuffer = [];
    const textureBuffer = [];
    const indexBuffer = [];

    for (let v = 0; v <= 1; v += this.routeStep) {
      const levelMatrix = this.getLevelMatrix(v);

      for (let u = 0; u <= 1; u += this.shapeStep) {
        // transformamos el position buffer por la matriz de nivel
        const pos = this.shape.getPosition(u);

        vec3.transformMat4(pos, pos, levelMatrix);

        positionBuffer.push(pos[0]);
        positionBuffer.push(pos[1]);
        positionBuffer.push(pos[2]);

        // transformamos el normal buffer por la matriz de nivel
        const nrm = this.shape.getNormal(u);

        vec3.transformMat4(nrm, nrm, levelMatrix);

        normalBuffer.push(nrm[0]);
        normalBuffer.push(nrm[1]);
        normalBuffer.push(nrm[2]);

        // TODO: implementar texture buffers...
        textureBuffer.push(u);
        textureBuffer.push(v);
      }
    }

    const ind = this.getIndexBuffer(this.levels - 1, this.pointsPerLevel - 1);

    console.log({
      position: positionBuffer,
      normal: normalBuffer,
      texture: textureBuffer,
      index: ind,
    });

    return {
      position: positionBuffer,
      normal: normalBuffer,
      texture: textureBuffer,
      index: ind,
    };
  }
}

export class SuperficieBarridoE extends Superficie {
  /**
   *
   * @param {import("../curvas/recorrido").default} shape
   * @param {import("../curvas/recorrido").default} route
   * @param {number} shapeStep
   * @param {number} routeStep
   */
  constructor(shape = null, route = null, shapeStep = 0.01, routeStep = 0.01) {
    super();
    this.shape = shape;
    this.route = route;
    this.shapeStep = shapeStep;
    this.routeStep = routeStep;

    this.levels = 1 / this.routeStep;
    this.pointsPerLevel = 1 / this.shapeStep;
  }

  getLevelMatrix(v) {
    const position = this.route.getPosition(v);
    const tangent = this.route.getTangent(v);
    const normal = this.route.getNormal(v);
    const binormal = this.route.getBinormal(v);

    const levelMatrix = mat4.fromValues(
      // primer columna
      normal[0],
      normal[1],
      normal[2],
      0,

      // tercer columna
      binormal[0],
      binormal[1],
      binormal[2],
      0,

      // segunda columna
      tangent[0],
      tangent[1],
      tangent[2],
      0,

      // cuarta columna
      position[0],
      position[1],
      position[2],
      1
    );

    // mat4.transpose(levelMatrix, levelMatrix);
    return levelMatrix;
  }

  getPosicion(u, v) {
    const pos = this.shape.getPosition(u);
    const levelMatrix = this.getLevelMatrix(v);
    vec3.transformMat4(pos, pos, levelMatrix);
    return pos;
  }

  getNormal(u, v) {
    const nrm = this.shape.getNormal(u);
    const levelMatrix = this.getLevelMatrix(v);

    // Adoptamos la matriz normal para la ilumunación
    mat4.invert(levelMatrix, levelMatrix);
    mat4.transpose(levelMatrix, levelMatrix);
    vec3.transformMat4(nrm, nrm, levelMatrix);
    vec3.scale(nrm, nrm, -1);
    // retornamos el vector normal
    return nrm;
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  }

  getArrayBuffers(rows = 128, columns = 128) {
    const buffers = super.getArrayBuffers(rows, columns);

    // // agrego buffers de la tapa inferior
    // const bottomCoverPosition = buffers.position.length;
    // const bottomPosition = this.route.getPosition(0);
    // const bottomNormal = this.route.getTangent(0);
    // const bottomUV = [0, 0];

    // buffers.position.push(bottomPosition[0]);
    // buffers.position.push(bottomPosition[1]);
    // buffers.position.push(bottomPosition[2]);

    // buffers.normal.push(bottomNormal[0]);
    // buffers.normal.push(bottomNormal[1]);
    // buffers.normal.push(bottomNormal[2]);

    // buffers.texture.push(bottomUV[0]);
    // buffers.texture.push(bottomUV[1]);

    // // buffers.index = this.getIndexBuffer(rows + 1, columns);

    // // agrego buffers de la tapa superior
    // const topCoverPosition = buffers.position.length;
    // const topPosition = this.route.getPosition(1);
    // const topNormal = this.route.getTangent(1);
    // const topUV = [0, 0];

    // buffers.position.push(topPosition[0]);
    // buffers.position.push(topPosition[1]);
    // buffers.position.push(topPosition[2]);

    // buffers.normal.push(topNormal[0]);
    // buffers.normal.push(topNormal[1]);
    // buffers.normal.push(topNormal[2]);

    // buffers.texture.push(topUV[0]);
    // buffers.texture.push(topUV[1]);

    // buffers.index = this.getIndexBuffer(
    //   rows + 2,
    //   columns,
    //   buffers.position.length
    // );
    return buffers;
  }

  // getIndexBuffer(
  //   rows = 128,
  //   columns = 128,
  //   positionBufferSize = Math.pow(128, 2)
  // ) {
  //   const indexBuffer = [];
  //   const bottomCoverPosition = positionBufferSize - 2;
  //   const topCoverPosition = positionBufferSize - 1;

  //   const columnVertices = columns + 1;

  //   for (let i = 0; i < columnVertices; i++) {
  //     indexBuffer.push(bottomCoverPosition);
  //     indexBuffer.push(i); // first vertices
  //   }

  //   for (let level = 0; level < rows; level++) {
  //     for (let point = 0; point < columnVertices; point++) {
  //       indexBuffer.push((level + 0) * columnVertices + point);
  //       indexBuffer.push((level + 1) * columnVertices + point);
  //     }

  //     indexBuffer.push(level * columnVertices + 0);
  //   }

  //   for (let i = 0; i < columnVertices; i++) {
  //     indexBuffer.push(topCoverPosition);
  //     indexBuffer.push(i + (positionBufferSize - 2 - columnVertices)); // last vertices
  //   }
  //   return indexBuffer;
  // }
}
