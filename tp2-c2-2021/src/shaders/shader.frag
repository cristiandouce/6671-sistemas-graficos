precision highp float;

uniform vec3 color;
uniform vec3 lightPosition;

uniform sampler2D textura;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUv;

void main(void) {

    vec3 lightVec = normalize(lightPosition-vPosWorld);
    vec3 objectColor = dot(lightVec,vNormal)*color;
    vec4 texColor = texture2D(textura, vUv);

    objectColor.x += texColor.x;
    objectColor.y += texColor.y;
    objectColor.z += texColor.z;

    gl_FragColor = vec4(objectColor,1.0);
}
