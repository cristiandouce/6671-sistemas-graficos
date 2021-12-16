import { Arco, ArcoXZ, ArcoYZ } from "../../primitivas/curvas/arco";
import Objeto3D from "../../primitivas/objetos/base";
import { SuperficieBarrido } from "../../primitivas/superficies/barrido";
import Esfera from "../../primitivas/superficies/esfera";
import { SuperficieRevolucion } from "../../primitivas/superficies/revolucion";

export class Tierra extends Objeto3D {
  color = [0.0, 0.8, 1.0];
  position = [0, 0, 0];

  constructor(engine, radio = 100) {
    super(engine);

    // const forma = new ArcoXZ(radio, Math.PI);
    // this.superficie = new SuperficieRevolucion(forma);
    // this.rotation = [-Math.PI / 2, 0, Math.PI / 3];
    this.superficie = new Esfera(radio);
    this.setupBuffers();
  }
}
