precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexUV;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUv;
varying vec3 vFromPointToCameraNormalized;

void main(void) {

    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
    vNormal=normalize((normalMatrix*vec4(aVertexNormal,1.0)).xyz);       //la normal en coordenadas de mundo
    vUv = aVertexUV.xy;

    vec4 viewPos = viewMatrix*vec4(aVertexPosition, 1.0);
    vFromPointToCameraNormalized = normalize(vec3(viewPos) / viewPos.w);

    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
}
