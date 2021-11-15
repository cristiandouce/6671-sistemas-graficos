import { vec3 } from "gl-matrix";
import BezierCurve from "../curvas/bezier";
import { Circulo } from "../curvas/circulo";
import Recorrido from "../curvas/recorrido";
import { SuperficieBarrido, SuperficieBarridoE } from "../superficies/barrido";
import Objeto3D from "./base";

export default class Barrido extends Objeto3D {
  color = [1, 0.7, 0];
  position = [0, 0, 0];

  constructor(engine) {
    super(engine);

    const radio = 6;
    // const formaLateral = (window.formaLateral = new Recorrido(
    //   [
    //     [0.0001, 0, 0.00001],
    //     [0, 0, 5],
    //     [0, 0, 10],
    //     [0, 5, 15],
    //     [0, 10, 20],
    //     [0, 10, 25],
    //     [0, 10, 30],
    //     [0, 0, 30],
    //     [0, 0, 30],
    //   ],
    //   2
    // ));

    // const formaLateral = (window.formaLateral = new Recorrido([
    //   [0.00001, 0.00001, 0.00001],
    //   [1, 1, 0],
    //   [0, 2, 0],
    //   [1.5, 2.5, 0],
    //   [3, 3, 0],
    //   [3.5, 1.5, 0],
    //   [4, 0, 0],
    // ]));

    const formaLateral = (window.formaLateral = new Recorrido([
      [0.00001, 0.00001, 0.00001],
      [0, 2, 0],
      [0, 3, 0],
      [0, 4, 0],
      [0, 5, 0],
    ]));

    // formaLateral.getTangent = function (u) {
    //   return vec3.fromValues(0, 0, 1);
    // };
    // formaLateral.getNormal = function (u) {
    //   return vec3.fromValues(0, 1, 0);
    // };
    // formaLateral.getBinormal = function (u) {
    //   return vec3.fromValues(-1, 0, 0);
    // };

    this.superficie = new SuperficieBarridoE(
      // recorrido circular
      new Circulo(1),

      formaLateral

      // new Recorrido([
      //   [1, 0, 0],
      //   [0, 1, 1],
      //   [0, 1, 5],
      // ])
      // new BezierCurve([
      //   [radio, 0, 0],
      //   [radio * (Math.sqrt(2) - 0.5), radio * (Math.sqrt(2) - 0.5), 0],
      //   [0, radio, 0],
      // ])
      // new Circulo(4)
    );
    this.setupBuffers();
  }
}
