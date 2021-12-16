import PlanoSuperficie from "../superficies/plano";
import Objeto3D from "./base";

export default class Plano extends Objeto3D {
  color = [0.7, 0.7, 0.7];
  position = [0, 0, 0];

  constructor(engine, ancho = 100, largo = 100) {
    super(engine);
    this.superficie = new PlanoSuperficie(ancho, largo);
    this.setupBuffers();
  }
}
