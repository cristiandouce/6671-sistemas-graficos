import { Rect2D } from "../curvas/recta2d";
import { Rectangle } from "../curvas/rectanculo";
import { SuperficieBarrido } from "../superficies/barrido";
import Objeto3D from "./base";

export default class Prisma extends Objeto3D {
  color = [0.7, 0, 0];
  position = [0, 0, 0];
  constructor(engine, ancho, alto, largo) {
    super(engine);

    // Necesito volver a llamar `setupBuffers`, por el simple hecho
    // de que las class propertis, se pisan solo después del llamado de
    // super(engine). Pero como es parte de los llamados del constructor
    // necesito llamar todos los metodos que ependen de la superficie
    // acá... no tengo Generics en el lenguaje tampoco como para resolverlo.
    const forma = new Rectangle(ancho, alto);
    const recorrido = new Rect2D(0, -largo / 2, 0, largo / 2);

    this.superficie = new SuperficieBarrido(forma, recorrido, true, true);
    this.setupBuffers();
    // mat4.rotate(this.modelMatrix, this.modelMatrix, -1.75, [1.0, 0.0, 1.0]);
  }
}
