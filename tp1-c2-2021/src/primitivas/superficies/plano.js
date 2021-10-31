export default class Plano {
  constructor(ancho, largo) {
    this.ancho = ancho;
    this.largo = largo;
  }

  // u = [0,1], al igual que v = [0,1]
  // nos desplazamos entre [-0.5, 0.5]
  // como parametro multiplicado por el largo y ancho
  // del plano
  getPosicion(u, v) {
    const x = (u - 0.5) * ancho;
    const z = (v - 0.5) * largo;
    return [x, 0, z];
  }

  // el plano va a ser siempre normal al eje y
  // por como fue construido.
  getNormal(u, v) {
    return [0, 1, 0];
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  }
}
