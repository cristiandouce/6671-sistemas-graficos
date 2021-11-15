import BezierCurve from "./bezier";

export default class Recorrido {
  static DIFFERENTIAL = 0.00000001;

  points = [];
  grade = 2;
  curves = [];

  constructor(points = [], grade = 2) {
    this.points = points;
    this.grade = grade;

    if (this.points.length < this.grade + 1) {
      throw new Error(
        "El recorrido requiere al menos 1 punto más que el grado elegido."
      );
    }

    if ((this.points.length - 1) % this.grade) {
      throw new Error(
        `La cantidad de puntos provista no es multiplo del grado + 1. Agregar ${
          this.grade - ((this.points.length - 1) % this.grade)
        } puntos restantes`
      );
    }

    this.generateCurves();
  }

  generateCurves() {
    const n = this.points.length;
    this.curves = [];
    for (let i = 0; i < n - 1; i += this.grade) {
      const controlPoints = [];
      for (let k = 0; k < this.grade + 1; k++) {
        controlPoints.push(this.points[i + k]);
      }
      this.curves.push(new BezierCurve(controlPoints));
    }
  }

  getCurve(u) {
    let curve = 0;
    for (let i = 0; i < this.curves.length; i++) {
      if (i < u * this.curves.length) {
        curve = i;
      }
    }

    return curve;
  }

  getU(u) {
    return u * this.curves.length - this.getCurve(u);
  }

  getPosition(u) {
    const U = this.getU(u);
    const curve = this.getCurve(u);

    return this.curves[curve].getPosition(U);
  }

  getTangent(u) {
    const U = this.getU(u);
    const curve = this.getCurve(u);

    return this.curves[curve].getTangent(U);
  }

  getSecondDerivate(u) {
    const U = this.getU(u);
    const curve = this.getCurve(u);

    return this.curves[curve].getSecondDerivate(U);
  }

  getNormal(u) {
    const U = this.getU(u);
    const curve = this.getCurve(u);

    return this.curves[curve].getNormal(U);
  }

  getBinormal(u) {
    const U = this.getU(u);
    const curve = this.getCurve(u);

    return this.curves[curve].getBinormal(U);
  }
}
