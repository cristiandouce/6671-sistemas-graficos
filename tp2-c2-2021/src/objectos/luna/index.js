import { Material } from "../../helpers/material";
import Objeto3D from "../../primitivas/objetos/base";
import Esfera from "../../primitivas/superficies/esfera";

export class Luna extends Objeto3D {
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
    this.setMaterial(
      Material.create({
        engine: this.engine,
        applyLights: false,
        texture: this.engine.getTexture("luna"),
      })
    );

    // this.rotation = [Math.PI / 5, 0, -Math.PI / 6];
    this.setupBuffers();
  }

  draw(parentModelMatrix) {
    // sigo con el draw habitual
    super.draw(parentModelMatrix);
  }
}
