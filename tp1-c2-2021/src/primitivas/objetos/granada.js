import Objeto3D from "./base";
import SuperficieGranada from "../superficies/granada";
import { mat4 } from "gl-matrix";

export default class Granada extends Objeto3D {
  superficie = new SuperficieGranada();
  rotate_angle = -1.57078;
  constructor(engine) {
    super(engine);

    // Necesito volver a llamar `setupBuffers`, por el simple hecho
    // de que las class propertis, se pisan solo después del llamado de
    // super(engine). Pero como es parte de los llamados del constructor
    // necesito llamar todos los metodos que ependen de la superficie
    // acá... no tengo Generics en el lenguaje tampoco como para resolverlo.
    this.setupBuffers();
  }

  draw(m) {
    // acá es como puedo animar... pero solo desde
    this.rotate_angle += 0.01;
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
