import Esfera from "../../primitivas/objetos/esfera";
import Objeto3D from "../../primitivas/objetos/base";
import Recorrido from "../../primitivas/curvas/recorrido";
import { SuperficieRevolucion } from "../../primitivas/superficies/revolucion";

export default class CapsulaEspacial extends Objeto3D {
  color = [0, 0, 1.0];

  constructor(engine) {
    super(engine);

    // Empiezo a dibujar la capsula
    // const esfera = new Esfera(engine);
    // esfera.color = this.color;
    // this.addChild(esfera);
    const objeto = new Objeto3D(this.engine);

    const modulo = this.getModulo();
    objeto.addChild(modulo);

    const cohete = this.getCohete();
    cohete.setPosition(0, 0, -0.5 / 2 - 1.5 / 2);
    objeto.addChild(cohete);

    objeto.setRotation(Math.PI, 0, Math.PI);
    this.addChild(objeto);
    this.setupBuffers();
  }

  getModulo() {
    const r1 = 0.25;
    const r2 = 0.35;
    const r3 = 0.37;
    const r4 = 0.8;
    const r5 = 0.6;
    const d1 = (r1 * 2) / 3;
    const d2 = 1.5;
    const d3 = r3 / 2;

    const forma = new Recorrido([
      [0, 0, d2 / 2],
      [r1 / 2, 0, d2 / 2],
      [r1, 0, d2 / 2],

      [r1 + (r2 - r1) / 2, 0, d2 / 2 - d1 / 2],
      [r2, 0, d2 / 2 - d1],

      [r3 - (r3 - r2) / 2, 0, d2 / 2 - d1],
      [r3, 0, d2 / 2 - d1],

      [r4, 0, 0],
      [r4, 0, -d2 / 2 + d3],

      [r4 - (r4 - r5) / 2, 0, -d2 / 2 + d3 / 2],
      [r5, 0, -d2 / 2],

      [r5 / 2, 0, -d2 / 2],
      [0, 0, -d2 / 2],
    ]);

    const superficie = new SuperficieRevolucion(forma);
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.color = [1, 0.8, 0.6];

    objeto.setupBuffers();

    return objeto;
  }

  getCohete() {
    const r1 = 0.07;
    const r2 = 0.25;

    const d1 = r2 * 2;

    const forma = new Recorrido([
      [0, 0, d1 / 2],
      [r1 / 2, 0, d1 / 2],
      [r1, 0, d1 / 2],

      [r2, 0, 0],
      [r2, 0, -d1 / 2],

      [r2 / 2, 0, -d1 / 2],
      [0, 0, -d1 / 2],
    ]);

    const superficie = new SuperficieRevolucion(forma);
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.color = [0.3, 0.3, 0.3];

    objeto.setupBuffers();

    return objeto;
  }
}
