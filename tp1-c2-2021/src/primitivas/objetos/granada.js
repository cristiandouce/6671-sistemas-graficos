import Objeto3D from "./base";
import SuperficieGranada from "../superficies/granada";
import { mat4 } from "gl-matrix";

export default class Granada extends Objeto3D {
  superficie = new SuperficieGranada();
  rotate_angle = -1.57078;
  constructor(engine) {
    super(engine);

    console.log("OBJETO-SUPERFICIE", this.superficie.getPosicion);
    this.setEscala(0.2, 0.2, 0.2);
    this.updateModelMatrix();
  }

  draw(m) {
    // acá es como puedo animar... pero solo desde
    // this.rotate_angle += 0.01;
    mat4.identity(this.modelMatrix);
    mat4.rotate(
      this.modelMatrix,
      this.modelMatrix,
      this.rotate_angle,
      [1.0, 0.0, 1.0]
    );

    super.draw(m);

    // mat4.identity(this.normalMatrix);
    // mat4.multiply(this.normalMatrix, this.viewMatrix, this.modelMatrix);
    // mat4.invert(this.normalMatrix, this.normalMatrix);
    // mat4.transpose(this.normalMatrix, this.normalMatrix);
  }
}
