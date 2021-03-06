varying vec2 vUv;
varying vec3 vPosModel;
varying vec3 vPosWorld;

uniform float t;        // tiempo en segundos
uniform float frame;    // numero de frame (60 frames x segundo)

void main() {
  vec4 aux = vec4(position,1.0);
  vPosWorld = (modelMatrix * vec4(aux.xyz, 1.0 )).xyz;

  vec2 auxUv=uv;

  /*
      Objetivo
      --------
      Aplicar modificaciones a auxUV para que se reproduzcan los 16 cuadros de animacion
      cubriendo cada cara completa del cubo;

      Las variables t y frame son dependientes del tiempo.

      Suegerencias:
      1) Verificar que efecto tiene multiplicar auxUV por un factor de escala
      2) Verificar que efecto tiene sumar o restar un delta a auxUV.x o auxUV.y
      3) Pensar en que modificaciones deben hacerse para que mostrar un cuadro especifico en las caras del cubo.
      4) Incluir la variable tiempo

      tip: las funciones floor() y mod() pueden ser de utilizada

  */

  // La textura es una grilla de 4x4. Cuando se carga la textura la misma lo hace en un sistema
  // de coordenadas que va de (0,0) a (1,1).
  float cuadrosFila = 4.0;
  float cuadrosColumna = 4.0;

  // Asumiendo que la textura tiene cuadros identicos en tamaño, y que la projección a las coordenadas
  // de la textura no produjo deformación, nos podemos mover sobre la grilla en saltos de float 0.25,
  // para recorrer todos los cuadros. No obstante, antes de realizar cualquier operación debemos escalar
  // la cara del cubo a estos 0.25, ya que por defecto se carga la textura de 0 a 1 en las caras del cubo.
  float cuadroX = 1.0 / cuadrosFila; // tamaño proporcional en X
  float cuadroY = 1.0 / cuadrosColumna; // tamaño proporcional en Y

  auxUv.x *= cuadroX;
  auxUv.y *= cuadroY;

  // Ahora si, empezando desde arriba, el primer cuadro será: (x,y) = (0, 0.75)
  // ya que el 0 en y está abajo. Luego el cuadro 2 será: (x,y) = (0.25, 0.75)... El cuadro 5: (x,y) = (0, 0.5),
  // y asi sucesivamente.
  // Podemos ver que para movernos en la numeración de la grilla, tenemos que sumar de a 0.25 sobre X, pero
  // restar de a 0.25 en y.

  // Nos posicionamos inicialmente en el primer cuadro arriba a la izquierda
  // usamos la variable cuadrosColumna - 1, para posicionarnos en la primer fila arriba.
  auxUv.y += (cuadrosColumna - 1.0) * cuadroY;
  // Vamos a usar la variable del tiempo t, para desplazarnos sobre los cuadros.
  // Para modificar la velocidad, vamos a usar la variable float factorDeEscala
  float factorEscala = 4.0; // 4 cuadros por segundo

  // Ademas de la variable tiempo con su factor de escala, debemos movernos multiplos del tamaño del cuadro
  // Pero para que la imagen no se desplace de forma continua, necesitamos que sean multiplos exactos de 0.25
  // pero el tiempo, en segundos, es continuo... por lo que tenemos que llevarlo primero a un "entero", y luego
  // usar la función módulo, para obtener el resto de la división del tiempo y el numero de cuadros por fila o columna
  // y así desplazarnos adecuadamente sobre la grilla.
  auxUv.x += cuadroX * mod(floor(factorEscala * t), cuadrosFila);

  // La salvedad para Y, es que se desplaza 1 vez por cada desplazamiento completo de una fila en X.
  auxUv.y -= cuadroY * mod(floor(factorEscala * t / cuadrosFila), cuadrosColumna);

  // reasignamos las variables modificadas y la obligatoria de la transformación y projección de possición.
  vUv = auxUv;
  gl_Position = projectionMatrix * modelViewMatrix * aux;
}
