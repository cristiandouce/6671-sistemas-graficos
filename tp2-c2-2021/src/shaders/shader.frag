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
  vec3 decayCoefficients;
};

uniform vec3 color;
uniform bool applyLights;

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

vec3 phong_diffuse_intensity(Light light, vec3 kd) {
  vec3 L = normalize(v_light_direction(light, vPosWorld));
  vec3 N = vNormal;

  return kd * max(dot(L, N), 0.0);
}

vec3 phong_specular_intensity(Light light, vec3 ks, float glossiness) {
  vec3 L = v_light_direction(light, vPosWorld);
  vec3 N = vNormal;
  vec3 V = vFromPointToCameraNormalized;
  vec3 R = -reflect(normalize(L), N); // TODO: revisar

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
  vec3 c = vec3(0.0, 1.0, 0.0);
  // float d = c[0] + c[1] * length(L) + c[2] * length(L) * length(L);
  float d = light.decayCoefficients[0] + light.decayCoefficients[1] * length(L) + light.decayCoefficients[2] * length(L) * length(L);

  if (light.type == LIGHT_TYPE_DIRECTIONAL) {
    return 1.0;
  }

  if (light.type == LIGHT_TYPE_SPOTLIGHT) {
    float cosTheta = dot(normalize(L), -light.direction);
    if (abs(cosTheta) <= light.cos_threshold) {
      // decaimiento lineal con el angulo de separaci??n con la direcci??n
      return (1.0-cosTheta)/d;
    } else {
      // fuera del angulo del spotlight la luz no contribuye
      return 0.0;
    }
  }

  return 1.0/d;
}

vec3 get_spolight_intensity(Light light, vec3 kd) {
  float intensity = 0.0;
  float decay = 0.04;

  vec3 L = v_light_direction(light, vPosWorld);
  float dotFromDirection = dot(L, -light.direction);

  if (dotFromDirection >= light.cos_threshold) {
      intensity = dot(vNormal, L);
      float dist = distance(light.position, vPosWorld);
      return kd * intensity * (decay / dist) /1000.0;
  } else {
      return vec3(0,0,0);
  }
}

vec3 phong_light_model(Light light, vec3 kd, vec3 ks) {

  if (light.type == LIGHT_TYPE_SPOTLIGHT) {
    get_spolight_intensity(light, kd);
  }

  float attenuation = get_light_attenuation(light);
  float baseIntensity = 200.0;
  vec3 v_phong_intensity = (
    // vec3(0.05, 0.05, 0.05) +
    phong_diffuse_intensity(light, kd) +
    phong_specular_intensity(light, ks, glossiness)
  );
  return baseIntensity * attenuation * light.color * v_phong_intensity;
}

void main(void) {
  // inicializo el vector de fragmento con el color del punto
  vec3 frColor = vec3(0.0, 0.0, 0.0);
  vec3 baseColor = vec3(0.0, 0.0, 0.0);
  vec3 kd;
  vec3 ks;
  // si tengo una textura, la aplico
  if (hasTexture) {
    vec4 textureColor = texture2D(textura, vUv);
    baseColor = textureColor.xyz;
    kd = phongConstants[1] * textureColor.xyz;
    ks = phongConstants[2] * textureColor.xyz;
  } else {
    // de lo contrario, me quedo con el color base
    baseColor = vPointColor.xyz;
    kd = phongConstants[1] * vPointColor.xyz;
    ks = phongConstants[2] * vPointColor.xyz;
  }

  // computamos la intensidad y color de las luces
  if (applyLights) {
    for (int i = 0; i < RESERVED_LIGHTS_ARRAY; i++) {
      if (lights[i].loaded) {
        frColor += phong_light_model(lights[i], kd, ks);
      }
    }
    frColor += phongConstants[0] * baseColor;
  } else {
    frColor = baseColor;
  }

  if (hasReflection) {
    // obtenemos la direccion del vector de reflexion y su modulo
    vec3 reflection_vector = reflect(vFromPointToCameraNormalized, vNormal);
    float m_reflection_vector = length(reflection_vector);

    // mapa a coordenadas esfericas theta y phi
    float theta = map(atan(reflection_vector.x, reflection_vector.z), -PI, PI, 0., 1.);
    float phi = map(acos(reflection_vector.y / m_reflection_vector), 0., PI, 0., 1.);

    vec4 reflectionColor = texture2D(reflection, vec2(theta,phi));

    // frColor = mix(frColor, reflectionColor.xyz, 0.5);
    frColor += reflectionColor.xyz * phongConstants[2] * 0.7;
  }

  gl_FragColor = vec4(frColor,1.0);
}
