import SuperficieTuboSenoidal from "../superficies/tubo-senoidal";
import Objeto3D from "./base";

export default class TuboSenoidal extends Objeto3D {
  constructor(
    engine,
    radio = 1,
    longitud = 5,
    senoidal = { amplitud: 0.2, longitud: 0.1 }
  ) {
    super(engine);

    this.superficie = new SuperficieTuboSenoidal(radio, longitud, senoidal);

    // Necesito volver a llamar `setupBuffers`, por el simple hecho
    // de que las class propertis, se pisan solo después del llamado de
    // super(engine). Pero como es parte de los llamados del constructor
    // necesito llamar todos los metodos que ependen de la superficie
    // acá... no tengo Generics en el lenguaje tampoco como para resolverlo.
    this.setupBuffers();
  }
}
