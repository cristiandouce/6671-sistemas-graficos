import { vec3 } from "gl-matrix";
import Superficie from "./_superficie";
export default class TuboSenoidal extends Superficie {
  constructor(
    radio = 1,
    longitud = 5,
    senoidal = { amplitud: 0.2, longitud: 0.1 }
  ) {
    super();
    this.radio = radio;
    this.longitud = longitud;
    this.senoidal = senoidal;

    // si la amplitud de la onda es mayor al radio pasan cosas raras.
    // me fijo que como maximo sea el radio.
    if (this.senoidal && this.senoidal.amplitud > this.radio) {
      this.senoidal.amplitud = this.radio;
    }
  }

  getPosicion(u, v) {
    const {
      radio,
      longitud,
      senoidal: { amplitud: amplitudOnda, longitud: longitudOnda },
    } = this;
    // definimos el radio del TuboSenoidal como un radio que cambia
    // en funcion de los parametros de amplitud de onda y longitud de onda.
    // Usamos la función coseno.
    const radioPosicion =
      radio + amplitudOnda * Math.cos((2 * v * Math.PI) / longitudOnda);

    // Calculamos las coordenadas xyz como si fuera un cilindro, pasando a coordenadas
    // cilindricas... la diferencia es que el radio es variable.
    const z = radioPosicion * Math.cos(2 * u * Math.PI);
    const y = (v - 0.5) * longitud;
    const x = radioPosicion * Math.sin(2 * u * Math.PI);

    // devolvemos las coordenadas.
    return [x, y, z];
  }

  getNormal(u, v) {
    // para calcular un vector normal, usaremos el producto vectorial
    // necesitamos un vector que se desplace un diferencial hacia un sentido
    // y otro que haga lo mismo hacia otro, desplazandonos un diferencial sobre nuestra
    // parametrización. Definimos las variables du y dv por dichos diferenciales.
    const du = 0.0001;
    const dv = 0.0001;

    // calculamos los vectores con un desplazamiento diferencial en base
    // a nuestros parámetros de recorrido v y u.
    const v1 = this.getPosicion(u + du, v);
    const v2 = this.getPosicion(u, v + dv);

    // obtenemos el producto vectorial, para encontrar el vector normal
    // utilizanod la librería glMatrix
    const vn = vec3.cross([], v1, v2);

    // normalizamos el vector normal utilizando
    // glMatrix, y devolvemos el mismo
    return vec3.normalize([], vn);
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  }
}
