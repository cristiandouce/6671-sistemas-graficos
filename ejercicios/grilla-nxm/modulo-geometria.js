/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)


    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
*/

var superficie3D;
var mallaDeTriangulos;

var filas = 50;
var columnas = 50;

function crearGeometria() {
  if (primitiva === "Plano") {
    superficie3D = new Plano(5, 5);
  }

  if (primitiva === "Esfera") {
    superficie3D = new Esfera(3);
  }

  if (primitiva === "Tubo Senoidal") {
    superficie3D = new TuboSenoidal(0.2, 0.1, 1, 5);
  }
  mallaDeTriangulos = generarSuperficie(superficie3D, filas, columnas);
}

function dibujarGeometria() {
  dibujarMalla(mallaDeTriangulos);
}

function Plano(ancho, largo) {
  this.getPosicion = function (u, v) {
    // u = [0,1], al igual que v = [0,1]
    // nos desplazamos entre [-0.5, 0.5]
    // como parametro multiplicado por el largo y ancho
    // del plano
    var x = (u - 0.5) * ancho;
    var z = (v - 0.5) * largo;
    return [x, 0, z];
  };

  this.getNormal = function (u, v) {
    // el plano va a ser siempre normal al eje y
    // por como fue construido.
    return [0, 1, 0];
  };

  this.getCoordenadasTextura = function (u, v) {
    return [u, v];
  };
}

function Esfera(radio) {
  // como calcularlas con coordenadas esfericas, como latitud y longitud
  // x = R * sin(lat) * cos(lon)
  // y = R * sin(lat) * sin(lon)
  // z = R * cos(lat)
  this.getPosicion = function (u, v) {
    var x = radio * Math.sin(Math.PI * u) * Math.cos(2 * Math.PI * v);
    var y = radio * Math.sin(Math.PI * u) * Math.sin(2 * Math.PI * v);
    var z = radio * Math.cos(Math.PI * u);
    return [x, y, z];
  };

  this.getNormal = function (u, v) {
    var xyz = this.getPosicion(u, v);
    // obtenemos el vector normal punto a punto para la esfera
    // como las coordenadas de cada punto.
    // luego lo normalizamos con glMatrix para obtener un vector normal
    return glMatrix.vec3.normalize([], xyz);
  };

  this.getCoordenadasTextura = function (u, v) {
    return [u, v];
  };
}

function TuboSenoidal(amplitudDeOnda, longitudDeOnda, radio, altura) {
  // si la amplitud de la onda es mayor al radio pasan cosas raras.
  // me fijo que como maximo sea el radio.
  if (amplitudDeOnda > radio) {
    amplitudDeOnda = radio;
  }

  this.getPosicion = function (u, v) {
    // definimos el radio del TuboSenoidal como un radio que cambia
    // en funcion de los parametros de amplitud de onda y longitud de onda.
    // Usamos la función coseno.
    var radioPosicion =
      radio + amplitudDeOnda * Math.cos((2 * v * Math.PI) / longitudDeOnda);

    // Calculamos las coordenadas xyz como si fuera un cilindro, pasando a coordenadas
    // cilindricas... la diferencia es que el radio es variable.
    var z = radioPosicion * Math.cos(2 * u * Math.PI);
    var y = (v - 0.5) * altura;
    var x = radioPosicion * Math.sin(2 * u * Math.PI);

    // devolvemos las coordenadas.
    return [x, y, z];
  };

  this.getNormal = function (u, v) {
    // para calcular un vector normal, usaremos el producto vectorial
    // necesitamos un vector que se desplace un diferencial hacia un sentido
    // y otro que haga lo mismo hacia otro, desplazandonos un diferencial sobre nuestra
    // parametrización. Definimos las variables du y dv por dichos diferenciales.
    var du = 0.0001;
    var dv = 0.0001;

    // calculamos los vectores con un desplazamiento diferencial en base
    // a nuestros parámetros de recorrido v y u.
    var v1 = this.getPosicion(u + du, v);
    var v2 = this.getPosicion(u, v + dv);

    // obtenemos el producto vectorial, para encontrar el vector normal
    // utilizanod la librería glMatrix
    var vn = glMatrix.vec3.cross([], v1, v2);

    // normalizamos el vector normal utilizando
    // glMatrix, y devolvemos el mismo
    return glMatrix.vec3.normalize([], vn);
  };

  this.getCoordenadasTextura = function (u, v) {
    return [u, v];
  };
}

function generarSuperficie(superficie, filas, columnas) {
  positionBuffer = [];
  normalBuffer = [];
  uvBuffer = [];

  for (var i = 0; i <= filas; i++) {
    for (var j = 0; j <= columnas; j++) {
      var u = j / columnas;
      var v = i / filas;

      var pos = superficie.getPosicion(u, v);

      positionBuffer.push(pos[0]);
      positionBuffer.push(pos[1]);
      positionBuffer.push(pos[2]);

      var nrm = superficie.getNormal(u, v);

      normalBuffer.push(nrm[0]);
      normalBuffer.push(nrm[1]);
      normalBuffer.push(nrm[2]);

      var uvs = superficie.getCoordenadasTextura(u, v);

      uvBuffer.push(uvs[0]);
      uvBuffer.push(uvs[1]);
    }
  }

  // Buffer de indices de los triángulos
  indexBuffer = [];

  // numero total de vertices unicos es
  uniqueVertices = (filas + 1) * (columnas + 1);
  // vertices por fila
  verticesFila = filas + 1;
  // vertices por columna
  verticesColumna = columnas + 1;

  for (var i = 0; i < filas; i++) {
    for (var j = 0; j < columnas; j++) {
      var vertice = i * verticesColumna + j;
      var verticeInferior = vertice + verticesColumna;
      // agrego el vertice actual al indice
      indexBuffer.push(vertice);

      // si ya pase mi primera vuelta duplico el indice del principio para respetar
      // el algoritmo, y degenerar con trianculos condensados en segmentos para continuar
      if (j === 0 && i > 0) {
        indexBuffer.push(vertice);
      }

      // argego el indice inferior en las filas
      indexBuffer.push(verticeInferior);
    }

    // como iteramos con menor estricto sobre el for-loop
    // necesitamos agregar la ultima columna de indices a mano
    indexBuffer.push(vertice + 1);
    indexBuffer.push(vertice + verticesColumna + 1);

    // si  no me encuentro en la última fila, necesito
    // duplicar el ultimo indice para degenerar con un
    // triangulo condensado.
    if (i < filas - 1) {
      indexBuffer.push(vertice + verticesColumna + 1);
    }
  }

  // Creación e Inicialización de los buffers

  webgl_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionBuffer),
    gl.STATIC_DRAW
  );
  webgl_position_buffer.itemSize = 3;
  webgl_position_buffer.numItems = positionBuffer.length / 3;

  webgl_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(normalBuffer),
    gl.STATIC_DRAW
  );
  webgl_normal_buffer.itemSize = 3;
  webgl_normal_buffer.numItems = normalBuffer.length / 3;

  webgl_uvs_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
  webgl_uvs_buffer.itemSize = 2;
  webgl_uvs_buffer.numItems = uvBuffer.length / 2;

  webgl_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexBuffer),
    gl.STATIC_DRAW
  );
  webgl_index_buffer.itemSize = 1;
  webgl_index_buffer.numItems = indexBuffer.length;

  return {
    webgl_position_buffer,
    webgl_normal_buffer,
    webgl_uvs_buffer,
    webgl_index_buffer,
  };
}

function dibujarMalla(mallaDeTriangulos) {
  // Se configuran los buffers que alimentaron el pipeline
  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    mallaDeTriangulos.webgl_position_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
  gl.vertexAttribPointer(
    shaderProgram.textureCoordAttribute,
    mallaDeTriangulos.webgl_uvs_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    mallaDeTriangulos.webgl_normal_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

  if (modo != "wireframe") {
    gl.uniform1i(shaderProgram.useLightingUniform, lighting == "true");
    gl.drawElements(
      // gl.TRIANGLES,
      // camibamos esto
      gl.TRIANGLE_STRIP,
      mallaDeTriangulos.webgl_index_buffer.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  if (modo != "smooth") {
    gl.uniform1i(shaderProgram.useLightingUniform, false);
    gl.drawElements(
      gl.LINE_LOOP,
      mallaDeTriangulos.webgl_index_buffer.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
