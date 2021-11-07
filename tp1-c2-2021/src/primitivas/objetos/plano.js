import PlanoSuperficie from "../superficies/plano";
import Objeto3D from "./base";

export default class Plano extends Objeto3D {
  superficie = new PlanoSuperficie(50, 50);
  color = [0.7, 0.7, 0.7];
  position = [0, 0, 0];

  constructor(engine) {
    super(engine);

    this.setupBuffers();
  }
}
