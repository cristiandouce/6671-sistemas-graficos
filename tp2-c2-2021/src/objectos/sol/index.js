import { Rect2D } from "../../primitivas/curvas/recta2d";
import { Rectangle } from "../../primitivas/curvas/rectanculo";
import Objeto3D from "../../primitivas/objetos/base";
import Plano from "../../primitivas/superficies/plano";
import { SuperficieBarrido } from "../../primitivas/superficies/barrido";
import { Material } from "../../helpers/material";

export class Sol extends Objeto3D {
  color = [0.0, 0.8, 1.0];
  position = [0, 0, 0];
  velocidadRotacion = 0.001;
  anguloRotacion = -Math.PI / 6;

  constructor(engine, radio = 100) {
    super(engine);

    this.superficie = new Plano(radio, radio);

    this.setMaterial(
      Material.create({
        engine: this.engine,
        applyLights: false,
        texture: this.engine.getTexture("sol"),
      })
    );

    this.setupBuffers();
  }

  draw(parentModelMatrix) {
    // sigo con el draw habitual
    super.draw(parentModelMatrix);
  }
}
