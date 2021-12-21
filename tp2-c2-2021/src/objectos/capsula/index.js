import Esfera from "../../primitivas/objetos/esfera";
import Objeto3D from "../../primitivas/objetos/base";
import Recorrido from "../../primitivas/curvas/recorrido";
import { SuperficieRevolucion } from "../../primitivas/superficies/revolucion";
import { Material } from "../../helpers/material";
import { Color } from "../../helpers/color";
import { Arco } from "../../primitivas/curvas/arco";
import { Rect2D } from "../../primitivas/curvas/recta2d";
import { SuperficieBarrido } from "../../primitivas/superficies/barrido";
import BezierCurve from "../../primitivas/curvas/bezier";
import { Light } from "../../helpers/lights";

export default class CapsulaEspacial extends Objeto3D {
  color = [0, 0, 1.0];

  constructor(engine) {
    super(engine);
    const objeto = new Objeto3D(this.engine);

    const modulo = this.getModulo();
    const luzRoja = this.getLuzRoja();
    const luzVerde = this.getLuzVerde();
    const luzSpot = this.getLuzSpot();
    modulo.addChild(luzRoja);
    modulo.addChild(luzVerde);
    // modulo.addChild(luzSpot);
    objeto.addChild(modulo);

    const cohete = this.getCohete();
    cohete.setPosition(0, 0, -0.5 / 2 - 1.5 / 2);
    objeto.addChild(cohete);

    objeto.setRotation(Math.PI, 0, Math.PI);
    this.addChild(objeto);
    // this.setupBuffers(200, 200);
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
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        texture: this.engine.getTexture("shiphull"),
        reflection: this.engine.getTexture("reflection-tierra"),
      })
    );
    objeto.setupBuffers(200, 200);

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
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, {
          rgb: [0.3, 0.3, 0.3],
        }),
      })
    );

    objeto.setupBuffers(200, 200);

    return objeto;
  }

  getLuzRoja() {
    const r1 = 0.25;
    const r2 = 0.35;
    const r3 = 0.37;
    const r4 = 0.8;
    const r5 = 0.6;
    const d1 = (r1 * 2) / 3;
    const d2 = 1.5;
    const d3 = r3 / 2;
    const curvaLuzRoja = new BezierCurve([
      [r3, 0, d2 / 2 - d1],
      [r4, 0, 0],
      [r4, 0, -d2 / 2 + d3],
    ]);

    const rojo = [1.0, 0.0, 0.0];
    const forma = new Arco(0.01, 2 * Math.PI);
    const recorrido = new Rect2D(0, 0, 0, 0.01);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, { rgb: rojo }),
        glossiness: 1000,
      })
    );

    objeto.setPosition(...curvaLuzRoja.getPosition(0.2));
    objeto.setRotation(0, Math.PI / 2, 0);
    objeto.setupBuffers();
    const light = this.engine.lights.createLight({
      color: rojo,
      decayCoefficients: [300.0, 1000.0, 300.0],
      position: curvaLuzRoja.getPosition(0.2),
    });
    objeto.addChild(light);
    return objeto;
  }

  getLuzVerde() {
    const r1 = 0.25;
    const r2 = 0.35;
    const r3 = 0.37;
    const r4 = 0.8;
    const r5 = 0.6;
    const d1 = (r1 * 2) / 3;
    const d2 = 1.5;
    const d3 = r3 / 2;
    const curvaLuzVerde = new BezierCurve([
      [-r3, 0, d2 / 2 - d1],
      [-r4, 0, 0],
      [-r4, 0, -d2 / 2 + d3],
    ]);

    const color = [0.0, 1.0, 0.0];
    const forma = new Arco(0.01, 2 * Math.PI);
    const recorrido = new Rect2D(0, 0, 0, 0.01);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, { rgb: color }),
        glossiness: 1000,
      })
    );

    objeto.setPosition(...curvaLuzVerde.getPosition(0.2));
    objeto.setRotation(0, Math.PI / 2, 0);
    objeto.setupBuffers();
    const light = this.engine.lights.createLight({
      color: color,
      decayCoefficients: [300.0, 1000.0, 300.0],
      position: curvaLuzVerde.getPosition(0.2),
    });
    objeto.addChild(light);
    return objeto;
  }

  getLuzSpot() {
    const color = [1.0, 1.0, 0.4];
    const forma = new Arco(0.01, 2 * Math.PI);
    const recorrido = new Rect2D(0, 0, 0, 0.01);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);
    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, { rgb: color }),
        glossiness: 1000,
      })
    );

    objeto.setPosition(0, 0, 0.75);

    objeto.setupBuffers();

    // const light = this.engine.lights.createLight({
    //   color: color,
    //   type: Light.types.LIGHT_TYPE_SPOTLIGHT,
    //   maxAngle: Math.PI / 6,
    //   // decayCoefficients: [100.0, 100.0, 100.0],
    //   position: [0, 0, 0.75],
    //   direction: [0, 0, 1],
    // });
    // objeto.addChild(light);
    return objeto;
  }
}
