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

    // Nos aseguramos que el objeto arranque en el angulo que esperamos
    // para que cualquier transformación que apliquemos, pase sobre esta matriz
    // del modelo.
    mat4.rotate(
      this.modelMatrix,
      this.modelMatrix,
      this.rotate_angle,
      [1.0, 0.0, 1.0]
    );
  }

  draw(m) {
    // acá es como puedo animar...
    // en lugar de llevar a la matriz del modelo a la identidad
    // adicionamos el angulo de rotación a la matriz de modelo, como antes sumabamos
    // sobre this.rotate_angle.
    mat4.rotate(this.modelMatrix, this.modelMatrix, 0.01, [1.0, 0.0, 1.0]);

    // TODO: REVISAR DONDE UBICAR ESTO, YA QUE DEPENDE DE LA MODEL MATRIX Y DE LAS NORMALES
    mat4.identity(this.engine.normalMatrix);
    mat4.multiply(
      this.engine.normalMatrix,
      this.engine.viewMatrix,
      this.modelMatrix
    );
    mat4.invert(this.engine.normalMatrix, this.engine.normalMatrix);
    mat4.transpose(this.engine.normalMatrix, this.engine.normalMatrix);

    super.draw(m);
  }
}
