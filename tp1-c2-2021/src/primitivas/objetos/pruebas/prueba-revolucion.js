import Recorrido from "../../curvas/recorrido";
import { SuperficieRevolucion } from "../../superficies/revolucion";
import Objeto3D from "../base";

export default class PruebaRevolucion extends Objeto3D {
  color = [1, 0.7, 0];
  position = [0, 0, 0];

  constructor(engine) {
    super(engine);

    this.addChild(this.getEje());
  }

  getCilindro() {
    const recorrido = new Recorrido([
      [1, 0, -10],
      [1, 0.0, 0],
      [1, 0.0, 10],
    ]);

    this.superficie = new SuperficieRevolucion(recorrido);
    this.setupBuffers();
  }

  cilindroCortoConTapas() {
    const radio = 2;
    const ancho = 0.4;
    const anchoTapa = 0.3 * ancho;
    const radioTapa = radio - anchoTapa;
    const diffRadio = radio - radioTapa;

    const recorrido = new Recorrido([
      [0.0, 0.0, -ancho / 2],
      [radioTapa / 2, 0, -ancho / 2],
      [radioTapa, 0, -ancho / 2],
      //
      // [radioTapa, 0, -ancho / 2],
      [radioTapa + diffRadio / 2, 0, -ancho / 2 + diffRadio / 2],
      [radio, 0, -ancho / 2 + diffRadio],
      //
      // [radio, 0, -ancho / 2 + diffRadio],
      [radio, 0, 0],
      [radio, 0, ancho / 2 - diffRadio],
      //
      // [radio, 0, ancho / 2 - diffRadio],
      [radioTapa + diffRadio / 2, 0, ancho / 2 - diffRadio / 2],
      [radioTapa, 0, ancho / 2],
      //
      // [radioTapa, 0, ancho / 2],
      [radioTapa / 2, 0, ancho / 2],
      [0, 0, ancho / 2],
    ]);

    this.superficie = new SuperficieRevolucion(recorrido);
    this.setupBuffers();
  }

  getEje(largo = 8) {
    const radioEje = 0.5;
    // const forma = new Arco(0.1, 2 * Math.PI);
    // const recorrido = new RectXY(0, -largo / 2, 0, largo / 2);
    // const superficie = new SuperficieBarrido(recorrido, forma, true, true);

    // const objeto = new Objeto3D(this.engine);
    // objeto.superficie = superficie;
    // objeto.color = [1, 0.8, 0.9];
    // objeto.setRotation(Math.PI / 2, Math.PI, 0);
    // objeto.setEscala(1, 1, 1);
    // objeto.setupBuffers();

    const forma = new Recorrido([
      [0, 0, -largo / 2],
      [0, radioEje / 2, -largo / 2],
      [0, radioEje, -largo / 2],
      [0, radioEje, 0],
      [0, radioEje, largo / 2],
      [0, radioEje / 2, largo / 2],
      [0, 0, largo / 2],
    ]);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = new SuperficieRevolucion(forma);
    objeto.color = [1, 0.8, 0.9];
    objeto.setupBuffers();

    // objeto.setRotation(Math.PI / 2, Math.PI, 0);
    return objeto;
  }
}
