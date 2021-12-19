import { Arco, ArcoXZ, ArcoYZ } from "../../primitivas/curvas/arco";
import Objeto3D from "../../primitivas/objetos/base";
import { SuperficieBarrido } from "../../primitivas/superficies/barrido";
import Esfera from "../../primitivas/superficies/esfera";
import { SuperficieRevolucion } from "../../primitivas/superficies/revolucion";

export class Tierra extends Objeto3D {
  color = [0.0, 0.8, 1.0];
  position = [0, 0, 0];
  velocidadRotacion = 0.001;
  anguloRotacion = -Math.PI / 6;

  constructor(engine, radio = 100) {
    super(engine);

    // const forma = new ArcoXZ(radio, Math.PI);
    // this.superficie = new SuperficieRevolucion(forma);
    // this.rotation = [-Math.PI / 2, 0, Math.PI / 3];
    this.superficie = new Esfera(radio);
    this.rotation = [Math.PI / 5, 0, -Math.PI / 6];
    this.setupBuffers();
  }

  draw(parentModelMatrix) {
    const dosPI = 2 * Math.PI;
    this.anguloRotacion -= this.velocidadRotacion;
    this.anguloRotacion = this.anguloRotacion % dosPI;

    this.setRotation(Math.PI / 5, 0, this.anguloRotacion);
    this.updateModelMatrix();
    // sigo con el draw habitual
    super.draw(parentModelMatrix);
  }
}
