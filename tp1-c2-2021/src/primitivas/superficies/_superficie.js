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

  getArrayBuffers(rows = 128, columns = 256) {
    const positionBuffer = [];
    const normalBuffer = [];
    const textureBuffer = [];
    const indexBuffer = [];

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

    for (let i = 0; i < rows - 1; i++) {
      indexBuffer.push(i * columns);
      for (let j = 0; j < columns - 1; j++) {
        indexBuffer.push(i * columns + j);
        indexBuffer.push((i + 1) * columns + j);
        indexBuffer.push(i * columns + j + 1);
        indexBuffer.push((i + 1) * columns + j + 1);
      }
      indexBuffer.push((i + 1) * columns + columns - 1);
    }

    return {
      position: positionBuffer,
      normal: normalBuffer,
      texture: textureBuffer,
      index: indexBuffer,
    };
  }
}
