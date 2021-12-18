export default class Curva {
  controlPoints = [];

  constructor(controlPoints = []) {
    this.controlPoints = controlPoints;
  }

  getPositionVectorAt(u) {
    throw new Error("debe implementar el metodo de posicion");
  }

  getTangentVectorAt(u) {
    throw new Error("debe implementar el metodo de tangente");
  }

  getNormalVectorAt(u) {
    throw new Error("debe implementar el metodo de normal");
  }
}
