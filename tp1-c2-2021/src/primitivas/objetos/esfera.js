import { mat4 } from "gl-matrix";
import SuperficieEsfera from "../superficies/esfera";
import Objeto3D from "./base";

export default class Esfera extends Objeto3D {
  superficie = new SuperficieEsfera();

  constructor(engine) {
    super(engine);

    // Necesito volver a llamar `setupBuffers`, por el simple hecho
    // de que las class propertis, se pisan solo después del llamado de
    // super(engine). Pero como es parte de los llamados del constructor
    // necesito llamar todos los metodos que ependen de la superficie
    // acá... no tengo Generics en el lenguaje tampoco como para resolverlo.
    this.setupBuffers();
    mat4.rotate(this.modelMatrix, this.modelMatrix, -1.75, [1.0, 0.0, 1.0]);
  }
}
