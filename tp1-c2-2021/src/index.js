import fs_source from "./shaders/shader.frag";
import vs_source from "./shaders/shader.vert";

import GLEngine from "./helpers/webgl-engine";

import Application from "./application";
import Recorrido from "./primitivas/curvas/recorrido";
import BezierCurve from "./primitivas/curvas/bezier";
import { Circulo } from "./primitivas/curvas/circulo";
import { SuperficieBarrido } from "./primitivas/superficies/barrido";
import { vec3 } from "gl-matrix";

const engine = new GLEngine({
  canvas: document.getElementById("application-canvas"),
  shaders: {
    fragment: fs_source,
    vertex: vs_source,
  },
});

const application = new Application({
  engine,
});

application.init();

// NECESITO:

// 1. SUPERFICIE DE BARRIDO
// 2. SUPERFICIE DE REVOLUCION
// 3. RECORRIDO POR CONCATENACION DE CURVAS

// console.log(BezierCurve);

var bz = new BezierCurve([
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
]);

// const recorrido = (window.recorrido = new Recorrido(
//   [
//     [0, 0, 0],
//     [0, 1, 0],
//     [1, 1, 0],
//     [1, 0, 0],
//   ],
//   3
// ));

const recorrido = new Circulo(4);
const us = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

us.forEach((u) => {
  console.log("u =", u);
  console.log("U =", recorrido.getU(u));

  console.log("posicion", bz.getPosition(u));
  console.log("posicion", recorrido.getPosition(u));

  console.log("tangente", bz.getTangent(u));
  console.log("tangente", recorrido.getTangent(u));

  console.log("segunda derivada", bz.getSecondDerivate(u));
  console.log("segunda derivada", recorrido.getSecondDerivate(u));

  console.log("normal", bz.getNormal(u));
  console.log("normal", recorrido.getNormal(u));

  console.log("bi-normal", bz.getBinormal(u));
  console.log("bi-normal", recorrido.getBinormal(u));

  console.log(
    "PRODUCTO tangente . normal",
    vec3.dot(bz.getTangent(u), bz.getNormal(u))
  );
  console.log(
    "PRODUCTO tangente . normal",
    vec3.dot(recorrido.getTangent(u), recorrido.getNormal(u))
  );
});

var radio = 4;
var circle = new BezierCurve([
  [radio, 0, 0],
  [radio * (Math.sqrt(2) - 0.5), radio * (Math.sqrt(2) - 0.5), 0],
  [0, radio, 0],
]);

window.circle = circle;
window.circuloR = new Circulo(4);

window.barrido = new SuperficieBarrido(window.circuloR, window.circuloR);
