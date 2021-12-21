precision highp float;

const float PI = 3.1415926535897932384626433832795;
const int RESERVED_LIGHTS_ARRAY = 32;

const int LIGHT_TYPE_OMNIDIRECTIONAL = 0;
const int LIGHT_TYPE_DIRECTIONAL = 1;
const int LIGHT_TYPE_SPOTLIGHT = 2;

struct Light {
  int type;
  bool loaded;
  vec3 color;
  vec3 position;
  vec3 direction;
  float cos_threshold;
  float decay;
};

uniform vec3 color;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUv;

uniform bool hasTexture;
uniform sampler2D textura;

uniform bool hasReflection;
uniform sampler2D reflection;
varying vec3 vFromPointToCameraNormalized;

// luces
uniform Light lights[RESERVED_LIGHTS_ARRAY];

// colores
uniform vec3 vPointColor;
uniform vec3 phongConstants;
uniform float glossiness;

// utilitario para encontrar max / min boundary
float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec3 v_light_direction(Light light, vec3 ref) {
  if (light.type == LIGHT_TYPE_OMNIDIRECTIONAL || light.type == LIGHT_TYPE_SPOTLIGHT) {
    return light.position - ref;
  }

  if (light.type == LIGHT_TYPE_DIRECTIONAL) {
    return -light.direction;
  }

  return vec3(0.0, 0.0, 0.0);
}

float phong_diffuse_intensity(Light light, float kd) {
  vec3 L = v_light_direction(light, vPosWorld);
  vec3 N = vNormal;

  return kd * max(dot(L, N), 0.0);
}

float phong_specular_intensity(Light light, float ks, float glossiness) {
  vec3 L = v_light_direction(light, vPosWorld);
  vec3 N = vNormal;
  vec3 V = vFromPointToCameraNormalized;
  vec3 R = reflect(-L, N); // TODO: revisar

  return ks * pow(
    max(dot(R,V), 0.0),
    glossiness
  );
}

float get_light_attenuation(Light light) {
  vec3 L = v_light_direction(light, vPosWorld);
  vec3 N = vNormal;

  // computamos atenuacion lineal con la distancia
  // http://learnwebgl.brown37.net/09_lights/lights_attenuation.html
  float d = length(L);

  if (light.type == LIGHT_TYPE_DIRECTIONAL) {
    return 1.0;
  }

  if (light.type == LIGHT_TYPE_SPOTLIGHT) {
    float cosTheta = dot(normalize(L), -light.direction);
    if (abs(cosTheta) <= light.cos_threshold) {
      // decaimiento lineal con el angulo de separación con la dirección
      return 1.0-cosTheta;
    } else {
      // fuera del angulo del spotlight la luz no contribuye
      return 0.0;
    }
  }

  return 1.0/d;
}

vec3 phong_light_model(Light light, vec3 phong) {
  // parametros de modelo de phong para el material
  float ka = phong[0];
  float kd = phong[1];
  float ks = phong[2];

  float attenuation = get_light_attenuation(light);
  float baseIntensity = 1.0;

  return baseIntensity * attenuation * light.color * (
    ka +
    phong_diffuse_intensity(light, kd) +
    phong_specular_intensity(light, ks, glossiness)
  );
}

void main(void) {
  // inicializo el vector de fragmento con el color del punto
  vec3 frColor = vPointColor;

  // si tengo una textura, la aplico
  if (hasTexture) {
    vec4 textureColor = texture2D(textura, vUv);
    frColor = textureColor.xyz;
  } else {
    // de lo contrario, me quedo con el color base
  }

  // computamos la intensidad y color de las luces
  vec3 lightColor = vec3(0.0, 0.0, 0.0);
  for (int i = 0; i < RESERVED_LIGHTS_ARRAY; i++) {
    if (!lights[i].loaded) {
      continue;
    }

    lightColor += phong_light_model(lights[i], phongConstants);
  }

  frColor += lightColor;

  if (hasReflection) {
    // obtenemos la direccion del vector de reflexion y su modulo
    vec3 reflection_vector = reflect(vFromPointToCameraNormalized, vNormal);
    float m_reflection_vector = length(reflection_vector);

    // mapa a coordenadas esfericas theta y phi
    float theta = map(atan(reflection_vector.x, reflection_vector.z), -PI, PI, 0., 1.);
    float phi = map(acos(reflection_vector.z / m_reflection_vector), 0., PI, 0., 1.);

    vec4 reflectionColor = texture2D(reflection, vec2(theta,phi));

    // frColor = mix(frColor, reflectionColor.xyz, 0.5);
    frColor += reflectionColor.xyz * 0.5;
  }

  gl_FragColor = vec4(frColor,1.0);
}
