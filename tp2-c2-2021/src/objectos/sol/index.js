import { Rect2D } from "../../primitivas/curvas/recta2d";
import { Rectangle } from "../../primitivas/curvas/rectanculo";
import Objeto3D from "../../primitivas/objetos/base";
import Plano from "../../primitivas/superficies/plano";
import { SuperficieBarrido } from "../../primitivas/superficies/barrido";

export class Sol extends Objeto3D {
  color = [0.0, 0.8, 1.0];
  position = [0, 0, 0];
  velocidadRotacion = 0.001;
  anguloRotacion = -Math.PI / 6;

  constructor(engine, radio = 100) {
    super(engine);

    // const profundidad = radio;
    // const forma = new Rectangle(radio, radio);
    // const recorrido = new Rect2D(0, -profundidad / 2, 0, profundidad / 2);
    // this.superficie = new SuperficieBarrido(forma, recorrido, true, true);

    // this.setTexture(engine.getTexture("sol"));
    // this.superficie.getCoordenadasTextura = (u, v) => {
    //   const escala = 4;
    //   let nu = (escala * u) % 1;
    //   let nv = v % 1;
    //   return [nu, nv];
    // };
    // this.superficie.buffers = null;
    try {
      this.superficie = new Plano(radio, radio);
    } catch (e) {
      console.log(e);
    }

    this.setTexture(engine.getTexture("sol"));

    this.setupBuffers();
  }

  draw(parentModelMatrix) {
    // sigo con el draw habitual
    super.draw(parentModelMatrix);
  }
}
