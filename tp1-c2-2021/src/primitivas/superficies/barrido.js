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
    let newRowCount = rows;
    let positionBuffer = [];
    let normalBuffer = [];
    let textureBuffer = [];
    let indexBuffer = [];

    const buffers = super.getArrayBuffers(rows, columns);

    // TODO: Parametrizar el que tenga o no tapas
    const hasBottomCover = true;
    const hasTopCover = true;

    if (hasBottomCover) {
      // la tangente del recorrido, es la normal a la tapa
      const bottomCoverNormal = this.route.getTangent(0);
      // pero hay que hacer que mire hacia afuera
      vec3.scale(bottomCoverNormal, bottomCoverNormal, -1);

      const bottomCoverCenterPosition = vec3.create();

      for (let i = 0; i < columns; i++) {
        vec3.add(
          bottomCoverCenterPosition,
          bottomCoverCenterPosition,
          vec3.fromValues(
            buffers.position[3 * i],
            buffers.position[3 * i + 1],
            buffers.position[3 * i + 2]
          )
        );
      }

      // promediamos la suma de todos los puntos para obtener el centro de masa de la tapa inferior.
      vec3.scale(
        bottomCoverCenterPosition,
        bottomCoverCenterPosition,
        1 / columns
      );

      // agregamos una fila completa con el centro de masa calculado, con posicion, normal y textura
      for (var i = 0; i < columns; i++) {
        positionBuffer.push(
          bottomCoverCenterPosition[0],
          bottomCoverCenterPosition[1],
          bottomCoverCenterPosition[2]
        );

        normalBuffer.push(
          bottomCoverNormal[0],
          bottomCoverNormal[1],
          bottomCoverNormal[2]
        );

        // TODO: parametrizar el UV buffer, para poder dar textura a las capas
        // estamos en el `v=0` al agregar la tapa inferior.
        textureBuffer.push(i / columns, 0);
      }

      // doplicamos la primer fila de la superficie, tanto posición, normal y textura
      for (var i = 0; i < columns; i++) {
        positionBuffer.push(
          buffers.position[3 * i],
          buffers.position[3 * i + 1],
          buffers.position[3 * i + 2]
        );

        normalBuffer.push(
          bottomCoverNormal[0],
          bottomCoverNormal[1],
          bottomCoverNormal[2]
        );

        // TODO: parametrizar el UV buffer, para poder dar textura a las capas
        // estamos en el `v=0` al agregar la tapa inferior.
        textureBuffer.push(i / columns, 0);
      }

      // aumentamos el numero de filas en 2
      newRowCount += 2;
    }

    // concatenamos las primeras dos nuevas filas, con las ya existentes
    positionBuffer = positionBuffer.concat(buffers.position);
    normalBuffer = normalBuffer.concat(buffers.normal);
    textureBuffer = textureBuffer.concat(buffers.texture);

    // Hasta acá tenemos la tapa inicial incorporada en los buffers. Todavía sin buffer de indices.
    // Repetimos lo mismo para la tapa superior.

    if (hasTopCover) {
      // la tangente del recorrido, es la normal a la tapa
      // que tiene la misma dirección que el recorrido.
      const topCoverNormal = this.route.getTangent(1);

      const topCoverCenterPosition = vec3.create();

      // Nos corremos 3 posiciones, desde el final, para estar en la primer
      // coordenada del último vector de 3 coordenadas. Luego, nos corremos
      // tantos vertices a la izquierda como columnas agregamos en el index buffer
      // de la clase superficie por `this.getIndexBuffer()`. Y eso nos deja posicionados
      // en la primer coordenada, de la ultima fila de vectores.
      const lastRowPositionIndex =
        buffers.position.length - 1 - 3 * (columns - 1) - 2;

      // Buscamos calcular el centro de masa de la tapa superior.
      for (let i = 0; i < columns; i++) {
        vec3.add(
          topCoverCenterPosition,
          topCoverCenterPosition,
          vec3.fromValues(
            buffers.position[3 * i + lastRowPositionIndex],
            buffers.position[3 * i + 1 + lastRowPositionIndex],
            buffers.position[3 * i + 2 + lastRowPositionIndex]
          )
        );
      }

      // promediamos la suma de todos los puntos para obtener el centro de masa de la tapa inferior.
      vec3.scale(topCoverCenterPosition, topCoverCenterPosition, 1 / columns);

      // doplicamos la ultima fila de la superficie, tanto posición, normal y textura
      for (var i = 0; i < columns; i++) {
        positionBuffer.push(
          buffers.position[3 * i + lastRowPositionIndex],
          buffers.position[3 * i + 1 + lastRowPositionIndex],
          buffers.position[3 * i + 2 + lastRowPositionIndex]
        );

        normalBuffer.push(
          topCoverNormal[0],
          topCoverNormal[1],
          topCoverNormal[2]
        );

        // TODO: parametrizar el UV buffer, para poder dar textura a las capas
        // estamos en el `v=0` al agregar la tapa inferior.
        textureBuffer.push(i / columns, 1);
      }

      console.log(
        "LALALALA",
        buffers.position.length,
        columns,
        columns * 3,
        lastRowPositionIndex
      );

      // agregamos una fila completa con el centro de masa calculado, con posicion, normal y textura
      for (var i = 0; i < columns; i++) {
        positionBuffer.push(
          topCoverCenterPosition[0],
          topCoverCenterPosition[1],
          topCoverCenterPosition[2]
        );

        normalBuffer.push(
          topCoverNormal[0],
          topCoverNormal[1],
          topCoverNormal[2]
        );

        // TODO: parametrizar el UV buffer, para poder dar textura a las capas
        // estamos en el `v=1` al agregar la tapa inferior.
        textureBuffer.push(i / columns, 1);
      }
      // aumentamos el numero de filas en 2
      newRowCount += 2;
    }

    indexBuffer = this.getIndexBuffer(newRowCount, columns);

    return {
      position: positionBuffer,
      normal: normalBuffer,
      texture: textureBuffer,
      index: indexBuffer,
    };
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
