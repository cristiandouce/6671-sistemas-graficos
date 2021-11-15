export default class Superficie {
  constructor() {}

  getPosicion(u, v) {
    return [0, 0, 0];
  }

  getNormal(u, v) {
    return [0, 0, 1];
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  }

  // getArrayBuffers(rows = 128, columns = 128) {
  //   const positionBuffer = [];
  //   const normalBuffer = [];
  //   const textureBuffer = [];
  //   const indexBuffer = [];

  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < columns; j++) {
  //       const u = j / (columns - 1);
  //       const v = i / (rows - 1);

  //       const pos = this.getPosicion(u, v);

  //       positionBuffer.push(pos[0]);
  //       positionBuffer.push(pos[1]);
  //       positionBuffer.push(pos[2]);

  //       const nrm = this.getNormal(u, v);

  //       normalBuffer.push(nrm[0]);
  //       normalBuffer.push(nrm[1]);
  //       normalBuffer.push(nrm[2]);

  //       const txt = this.getCoordenadasTextura(u, v);

  //       textureBuffer.push(txt[0]);
  //       textureBuffer.push(txt[1]);
  //     }
  //   }

  //   for (let i = 0; i < rows - 1; i++) {
  //     indexBuffer.push(i * columns);
  //     for (let j = 0; j < columns - 1; j++) {
  //       indexBuffer.push(i * columns + j);
  //       indexBuffer.push((i + 1) * columns + j);
  //       indexBuffer.push(i * columns + j + 1);
  //       indexBuffer.push((i + 1) * columns + j + 1);
  //     }
  //     indexBuffer.push((i + 1) * columns + columns - 1);
  //   }

  //   return {
  //     position: positionBuffer,
  //     normal: normalBuffer,
  //     texture: textureBuffer,
  //     index: indexBuffer,
  //   };
  // }

  getArrayBuffers(rows = 128, columns = 128) {
    const indexBuffer = this.getIndexBuffer(rows, columns);
    const positionBuffer = [];
    const normalBuffer = [];
    const textureBuffer = [];

    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= columns; j++) {
        const u = j / columns;
        const v = i / rows;

        const pos = this.getPosicion(u, v);

        positionBuffer.push(pos[0]);
        positionBuffer.push(pos[1]);
        positionBuffer.push(pos[2]);

        const nrm = this.getNormal(u, v);

        normalBuffer.push(nrm[0]);
        normalBuffer.push(nrm[1]);
        normalBuffer.push(nrm[2]);

        const txt = this.getCoordenadasTextura(u, v);

        textureBuffer.push(txt[0]);
        textureBuffer.push(txt[1]);
      }
    }

    return {
      position: positionBuffer,
      normal: normalBuffer,
      texture: textureBuffer,
      index: indexBuffer,
    };
  }

  getIndexBuffer(rows = 128, columns = 128) {
    const indexBuffer = [];
    const rowVertices = rows + 1;
    const columnVertices = columns + 1;

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var vertice = i * columnVertices + j;
        var verticeInferior = vertice + columnVertices;
        // agrego el vertice actual al indice
        indexBuffer.push(vertice);

        // si ya pase mi primera vuelta duplico el indice del principio para respetar
        // el algoritmo, y degenerar con trianculos condensados en segmentos para continuar
        if (j === 0 && i > 0) {
          indexBuffer.push(vertice);
        }

        // argego el indice inferior en las rows
        indexBuffer.push(verticeInferior);
      }

      // como iteramos con menor estricto sobre el for-loop
      // necesitamos agregar la ultima columna de indices a mano
      indexBuffer.push(vertice + 1);
      indexBuffer.push(vertice + columnVertices + 1);

      // si  no me encuentro en la última fila, necesito
      // duplicar el ultimo indice para degenerar con un
      // triangulo condensado.
      if (i < rows - 1) {
        indexBuffer.push(vertice + columnVertices + 1);
      }
    }

    return indexBuffer;
  }
}
