import TuboSenoidal from "../../../primitivas/objetos/tubo-senoidal";
import Objeto3D from "../../../primitivas/objetos/base";
import { Arco, ArcoXZ, ArcoYZ } from "../../../primitivas/curvas/arco";
import { Rect2D, RectXY } from "../../../primitivas/curvas/recta2d";
import { SuperficieBarrido } from "../../../primitivas/superficies/barrido";
import { Rectangle } from "../../../primitivas/curvas/rectanculo";
import { Circulo } from "../../../primitivas/curvas/circulo";
import Recorrido from "../../../primitivas/curvas/recorrido";
import { SuperficieRevolucion } from "../../../primitivas/superficies/revolucion";
import { Material } from "../../../helpers/material";
import { Color } from "../../../helpers/color";

export default class PanelesSolares extends Objeto3D {
  superficie = null;
  color = [1.0, 0, 0];

  largo = 5;

  largoPanel = 6;
  anchoPanel = 1;
  altoPanel = 0.2;

  anguloPanel = Math.PI / 3;

  cantidadFilas = 4;

  constructor(engine, cantidadFilas = 4, anguloPanel = Math.PI / 3) {
    super(engine);

    this.cantidadFilas = cantidadFilas;
    this.anguloPanel = anguloPanel;

    const separacion = this.anchoPanel * 1.2;
    this.largo += separacion * this.cantidadFilas;

    const eje = this.getEje(this.largo);
    this.addChild(eje);

    const posLejana = -this.largo / 2 - separacion / 2;
    for (let i = 0; i < this.cantidadFilas; i++) {
      const fila = this.getFilaPanel();
      fila.setPosition(0, posLejana + (i + 1) * separacion, 0);
      fila.setRotation(this.anguloPanel, 0, 0);
      this.addChild(fila);
    }

    this.setupBuffers();
  }

  getEje(largo = 8) {
    const radioEje = 0.2;
    const forma = new Arco(radioEje, 2 * Math.PI);
    const recorrido = new Rect2D(0, -largo / 2, 0, largo / 2);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, {
          rgb: [0.5, 0.5, 0.5],
        }),
      })
    );

    objeto.setRotation(-Math.PI / 2, 0, Math.PI / 2);

    objeto.setupBuffers();

    return objeto;
  }

  getFilaPanel() {
    const fila = new Objeto3D(this.engine);
    const { largoPanel = 6, anchoPanel = 1, altoPanel = 0.2 } = this;
    const color = [0.5, 0.5, 0.5];
    const radioEje = altoPanel / 2;
    const largoEje = 2;

    const ejePaneles = new Objeto3D(this.engine);
    ejePaneles.superficie = new SuperficieRevolucion(
      new Rect2D(radioEje, -largoEje / 2, radioEje, largoEje / 2)
    );
    ejePaneles.setMaterial(
      Material.create({
        engine: this.engine,
        color: Color.create(this.engine, {
          rgb: [0.5, 0.5, 0.5],
          glossiness: 50.0,
        }),
      })
    );
    ejePaneles.setRotation(0, Math.PI / 2, 0);
    ejePaneles.setupBuffers();

    fila.addChild(ejePaneles);

    const panelIzq = this.getPanel(largoPanel, anchoPanel, altoPanel);
    panelIzq.setPosition(-largoPanel / 2 - largoEje / 2, 0, 0);
    fila.addChild(panelIzq);

    const panelDer = this.getPanel(largoPanel, anchoPanel, altoPanel);
    panelDer.setPosition(largoPanel / 2 + largoEje / 2, 0, 0);
    fila.addChild(panelDer);

    return fila;
  }

  getPanel(largo = 6, ancho = 1, alto = 0.2) {
    const forma = new Rectangle(alto, ancho);
    const recorrido = new Rect2D(0, -largo / 2, 0, largo / 2);
    const superficie = new SuperficieBarrido(forma, recorrido, true, true);

    const objeto = new Objeto3D(this.engine);
    objeto.superficie = superficie;
    objeto.setMaterial(
      Material.create({
        engine: this.engine,
        texture: this.engine.getTexture("panel-solar"),
        color: Color.create(this.engine, {}),
      })
    );
    objeto.setupBuffers();

    objeto.setRotation(0, Math.PI / 2, 0);

    return objeto;
  }

  getLargoEje() {
    return this.largo;
  }
}
