precision highp float;
uniform vec3 color;
varying vec3 vNormal;
varying vec3 vPosWorld;

void main(void) {

    vec3 lightVec = normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    vec3 objectColor = dot(lightVec,vNormal)*color;

    gl_FragColor = vec4(objectColor,1.0);
}
