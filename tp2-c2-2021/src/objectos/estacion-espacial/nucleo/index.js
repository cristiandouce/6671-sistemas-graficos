import { Arco, ArcoXZ, ArcoYZ } from "../../../primitivas/curvas/arco";
import { Circulo, CirculoXZ } from "../../../primitivas/curvas/circulo";
import Recorrido from "../../../primitivas/curvas/recorrido";
import { Rect2D, RectXY } from "../../../primitivas/curvas/recta2d";
import Objeto3D from "../../../primitivas/objetos/base";
import Prisma from "../../../primitivas/objetos/prisma";
import { SuperficieBarrido } from "../../../primitivas/superficies/barrido";
import { SuperficieRevolucion } from "../../../primitivas/superficies/revolucion";

export default class Nucleo extends Objeto3D {
  superficie = null;

  factorEscala = 1;

  color = [1.0, 0, 0];

  largoModulo = 3;
  largoConector = 1;
  radioEsfera = 1.3;
  anguloCorteEsfera = Math.PI / 5;

  constructor(engine) {
    super(engine);

    const { largoModulo, largoConector, radioEsfera, anguloCorteEsfera } = this;

    const moduloCentral = this.getModuloCilindro(largoModulo);
    this.addChild(moduloCentral);

    // hacia los paneles
    const moduloConector1 = this.getPrismaConector(largoConector);
    moduloConector1.setPosition(0, 0, largoModulo / 2 + largoConector / 2);
    this.addChild(moduloConector1);

    const moduloPaneles = this.getModuloCilindro(largoModulo);
    moduloPaneles.setPosition(0, 0, largoModulo + largoConector);
    this.addChild(moduloPaneles);

    // hacia contra peso
    const moduloConector2 = this.getPrismaConector(largoConector);
    moduloConector2.setPosition(0, 0, -largoModulo / 2 + -largoConector / 2);
    this.addChild(moduloConector2);

    const moduloEsferico = this.getModuloEsferico(
      radioEsfera,
      anguloCorteEsfera
    );
    moduloEsferico.setPosition(
      0,
      0,
      -(
        largoModulo / 2 +
        largoConector +
        radioEsfera * Math.cos(anguloCorteEsfera)
      )
    );
    this.addChild(moduloEsferico);

    this.setupBuffers();
  }

  getFactorizedNumber(number) {
    return this.factorEscala * number;
  }

  getPrismaConector(largo = 1) {
    const alto = largo;
    const ancho = largo;
    const delta = 0.2 * ancho;

    const forma = new Recorrido([
      [-ancho / 2, -alto / 2 + delta, 0],
      [-ancho / 2, 0, 0],
      [-ancho / 2, alto / 2 - delta, 0],

      // [-ancho/2, alto/2 - delta, 0],
      [-ancho / 2, alto / 2, 0],
      [-ancho / 2 + delta, alto / 2, 0],

      // [-ancho/2 + delta , alto/2, 0],
      [0, alto / 2, 0],
      [ancho / 2 - delta, alto / 2, 0],

      // [ancho / 2 - delta, alto / 2, 0],
      [ancho / 2, alto / 2, 0],
      [ancho / 2, alto / 2 - delta, 0],

      //
      [ancho / 2, 0, 0],
      [ancho / 2, -alto / 2 + delta, 0],

      //
      [ancho / 2, -alto / 2, 0],
      [ancho / 2 - delta, -alto / 2, 0],

      //
      [0, -alto / 2, 0],
      [-ancho / 2 + delta, -alto / 2, 0],

      //
      [-ancho / 2, -alto / 2, 0],
      [-ancho / 2, -alto / 2 + delta, 0],
    ]);

    const recorrido = new Rect2D(0, -largo / 2, 0, largo / 2);

    const superficie = new SuperficieBarrido(forma, recorrido, true, true);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.color = [0.7, 0.2, 0.8];
    objeto.setupBuffers();

    return objeto;
  }

  getModuloCilindro(largo = 4) {
    const delta = 0.08 * largo;
    const radio = 1.7;

    const forma = new Recorrido([
      [0, -largo / 2, 0],
      [-radio / 2, -largo / 2, 0],
      [-radio + delta, -largo / 2, 0],

      [-radio + delta / 2, -largo / 2 + delta / 2, 0],
      [-radio, -largo / 2 + delta, 0],

      //
      [-radio, 0, 0],
      [-radio, largo / 2 - delta, 0],

      //
      [-radio + delta / 2, largo / 2 - delta / 2, 0],
      [-radio + delta, largo / 2, 0],
      [-radio / 2, largo / 2, 0],
      [0, largo / 2, 0],
    ]);

    const recorrido = new Arco(0.0000001, -2 * Math.PI);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = new SuperficieBarrido(forma, recorrido, true, true);
    objeto.color = [1, 0.8, 0.6];
    objeto.setupBuffers();

    return objeto;
  }

  getModuloEsferico(radio = 1, anguloInicio = Math.PI / 5) {
    const anguloRecorrido = (2 / 3) * Math.PI;
    const sen = Math.sin(anguloInicio);
    const cos = Math.cos(anguloInicio);

    const forma = new Recorrido([
      [0, -radio * cos, 0],
      [(radio * sen) / 2, -radio * cos, 0],
      [radio * sen, -radio * cos, 0],

      //
      [radio, -radio * (cos - sen / 2), 0],
      //

      [radio, 0, 0],

      //
      [radio, radio * (cos - sen / 2), 0],
      //

      [radio * sen, radio * cos, 0],
      [(radio * sen) / 2, radio * cos, 0],
      [0, radio * cos, 0],
    ]);

    // const forma = new Arco(radio, anguloRecorrido, anguloInicio);
    // const recorrido = new RectXY(0, (-radio / 2) * cos, 0, (radio / 2) * cos);
    const recorrido = new Arco(0.000001, -Math.PI * 2);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.color = [1, 0.8, 0.6];
    objeto.setupBuffers();

    return objeto;
  }

  getDistanciaAModuloInferior() {
    const { largoModulo, largoConector } = this;
    return 1.5 * largoModulo + largoConector;
  }
}
