precision highp float;
uniform vec3 color;
uniform vec3 lightPosition;
varying vec3 vNormal;
varying vec3 vPosWorld;

void main(void) {

    vec3 lightVec = normalize(lightPosition-vPosWorld);
    vec3 objectColor = dot(lightVec,vNormal)*color;

    gl_FragColor = vec4(objectColor,1.0);
}
