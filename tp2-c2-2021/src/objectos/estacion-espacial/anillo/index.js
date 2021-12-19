import { mat4 } from "gl-matrix";
import { Material } from "../../../helpers/material";
import { Arco } from "../../../primitivas/curvas/arco";
import Recorrido from "../../../primitivas/curvas/recorrido";
import { Rect2D } from "../../../primitivas/curvas/recta2d";
import Objeto3D from "../../../primitivas/objetos/base";
import Prisma from "../../../primitivas/objetos/prisma";
import { SuperficieBarrido } from "../../../primitivas/superficies/barrido";
import { SuperficieRevolucion } from "../../../primitivas/superficies/revolucion";

export default class Anillo extends Objeto3D {
  superficie = null;

  factorEscala = 1;

  color = [1.0, 0, 0];

  anguloRotacion = 0;

  constructor(engine, cantModulos = 6, velocidadRotacion = 0) {
    super(engine);

    this.cantModulos = cantModulos;
    this.velocidadRotacion = velocidadRotacion;

    this.radioAnillo = 8;

    const centro = this.getCentro();
    centro.color = vec3.fromValues(1, 0.5, 0.0);
    this.addChild(centro);

    const cilindroCircular = this.getCilindroCircular(0.3, this.radioAnillo);
    this.addChild(cilindroCircular);

    this.modulos = this.generarModulos();
    this.modulos.forEach((modulo) => this.addChild(modulo));

    this.setupBuffers();
  }

  getFactorizedNumber(number) {
    return this.factorEscala * number;
  }

  getCentro() {
    const radio = this.getFactorizedNumber(2);
    const ancho = this.getFactorizedNumber(0.4);
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

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = new SuperficieRevolucion(recorrido);
    objeto.setupBuffers();

    return objeto;
  }

  getEscalera(longitud = 10) {
    const escalera = new Objeto3D(this.engine);
    const color = [0.8, 0.8, 0.8];

    // definimos los hijos
    const ancho = this.getFactorizedNumber(0.05);
    const radio = ancho / 4;
    const largo = this.getFactorizedNumber(0.2);
    const distEntreVigas = largo * Math.cos(Math.PI / 4);

    const vigaIzquierda = new Prisma(this.engine, ancho, ancho, longitud);
    vigaIzquierda.setPosition(-distEntreVigas, 0, 0);
    vigaIzquierda.color = color;

    const vigaDerecha = new Prisma(this.engine, ancho, ancho, longitud);
    vigaDerecha.setPosition(distEntreVigas, 0, 0);
    vigaDerecha.color = color;

    const superficieCilindro = new SuperficieRevolucion(
      new Rect2D(radio, -largo / 2, radio, largo / 2)
    );

    const totalVigasCruzadas = longitud / distEntreVigas;

    let posicion = -longitud / 2 - distEntreVigas / 4; // ajuste de posición inicial
    let rotacion = -Math.PI / 4;

    escalera.addChild(vigaDerecha);
    escalera.addChild(vigaIzquierda);

    for (let i = 0; i < totalVigasCruzadas - 1; i++) {
      posicion += distEntreVigas;
      rotacion *= -1;
      const cilindro = new Objeto3D(this.engine);
      cilindro.superficie = superficieCilindro;
      cilindro.setPosition(0, 0, posicion);
      cilindro.setRotation(0, rotacion, 0);
      cilindro.setEscala(2, 1, 1);
      cilindro.color = color;
      cilindro.setupBuffers();
      escalera.addChild(cilindro);
    }

    return escalera;
  }

  getCilindroCircular(radioCilindro = 0.3, radioArco = 8) {
    const color = [0.8, 0.8, 0.6];
    const forma = new Arco(radioCilindro, 2 * Math.PI);
    const recorrido = new Arco(radioArco, 2 * Math.PI);

    const superficie = new SuperficieBarrido(forma, recorrido);
    const objeto = new Objeto3D(this.engine);
    objeto.color = color;
    objeto.superficie = superficie;
    objeto.superficie.getCoordenadasTextura = function (u, v) {
      const TWO_PI = 2 * Math.PI;
      // const repeticionesCilindro = 1; // 4 veces replicado
      // const repeticionesArco = TWO_PI * 100000; // lo quiero replicado 10 veces en arco;
      // const nu = ((u * repeticionesCilindro * TWO_PI) % TWO_PI) / TWO_PI;
      // const nv = ((v * repeticionesArco * TWO_PI) % TWO_PI) / TWO_PI;
      const perimetroArco = radioArco * TWO_PI;
      const perimetroCilindro = radioCilindro * TWO_PI;

      const posU = u * perimetroCilindro;
      const posV = v * perimetroArco;

      const escalaU = 4;
      const escalaV = 64;

      const nu = ((escalaU * posU) % perimetroCilindro) / perimetroCilindro;
      const nv = ((escalaV * posV) % perimetroArco) / perimetroArco;

      return [nu, nv];
    };
    objeto.superficie.buffers = null;

    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        texture: this.engine.getTexture("anillo"),
      })
    );

    objeto.setupBuffers();
    return objeto;
  }

  getModulo(radioArco = 8, anguloArco = Math.PI / 4) {
    const ancho = this.getFactorizedNumber(1);
    const alto = ancho * 3;
    const delta = ancho * 0.2;

    const forma = new Recorrido([
      [-ancho / 2, -alto / 2 + delta, 0],
      [-ancho / 2, 0, 0],
      [-ancho / 2, alto / 2 - delta, 0],

      // [-ancho / 2, alto / 2 - delta, 0],
      [-ancho / 2 + delta / 2, alto / 2 - delta / 2, 0],
      [-ancho / 2 + delta, alto / 2, 0],

      //
      // [-ancho / 2 + delta, alto / 2, 0],
      [0, alto / 2, 0],
      [ancho / 2 - delta, alto / 2, 0],

      //
      // [ancho/2 - delta, alto/2, 0],
      [ancho / 2 - delta / 2, alto / 2 - delta / 2, 0],
      [ancho / 2, alto / 2 - delta, 0],

      //
      // [ancho / 2, alto / 2 - delta, 0],
      [ancho / 2, 0, 0],
      [ancho / 2, -alto / 2 + delta, 0],

      // [ancho / 2, -alto / 2 + delta, 0],
      [ancho / 2 - delta / 2, -alto / 2 + delta / 2, 0],
      [ancho / 2 - delta, -alto / 2, 0],

      // [ancho / 2 - delta, -alto / 2, 0],
      [0, -alto / 2, 0],
      [-ancho / 2 + delta, -alto / 2, 0],

      // [-ancho / 2 + delta, -alto / 2, 0],
      [-ancho / 2 + delta / 2, -alto / 2 + delta / 2, 0],
      [-ancho / 2, -alto / 2 + delta, 0],
    ]);

    const recorrido = new Arco(radioArco, anguloArco);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);
    superficie.getCoordenadasTextura = (u, v) => {
      const delta = 0.05; // desplazamiento en u para el mapeo
      const escala = 2; // desplazamiento en u para el mapeo
      let nu = escala * (u + delta);
      if (nu > 1) nu %= 1;
      return [nu, v];
    };
    superficie.buffers = null;
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    // objeto.color = [0.3, 0.7, 0.7];
    objeto.color = [0, 0, 0];
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        texture: this.engine.getTexture("modulo"),
      })
    );
    objeto.setupBuffers();

    return objeto;
  }

  generarModulos() {
    const modulos = [];
    for (let i = 0; i < this.cantModulos; i++) {
      const conjunto = this.generarConjunto(i);
      modulos.push(conjunto);
    }
    return modulos;
  }

  generarConjunto(i) {
    const deltaAngulo = (2 * Math.PI) / this.cantModulos;

    const conjunto = new Objeto3D(this.engine);

    const escalera = this.getEscalera(8);
    escalera.setRotation(Math.PI / 2, 0, 0);
    escalera.setPosition(0, this.radioAnillo / 2, 0);
    conjunto.addChild(escalera);

    const modulo = this.getModulo(this.radioAnillo, Math.PI / this.cantModulos);
    modulo.setRotation(0, 0, Math.PI / 2 - Math.PI / 2 / this.cantModulos);
    conjunto.addChild(modulo);

    conjunto.setRotation(0, 0, deltaAngulo * i);

    return conjunto;
  }

  setVelocidad(vel = 0) {
    this.velocidadRotacion = vel;
  }

  setModules(m = 4) {
    this.cantModulos = m;

    this.modulos.forEach((modulo) => this.removeChild(modulo));
    this.modulos = this.generarModulos();
    this.modulos.forEach((modulo) => this.addChild(modulo));
  }

  draw(parentModelMatrix = mat4.create()) {
    const dosPI = 2 * Math.PI;
    this.anguloRotacion += this.velocidadRotacion;
    this.anguloRotacion = this.anguloRotacion % dosPI;

    this.setRotation(0, 0, this.anguloRotacion);
    this.updateModelMatrix();
    // sigo con el draw habitual
    super.draw(parentModelMatrix);
  }
}
