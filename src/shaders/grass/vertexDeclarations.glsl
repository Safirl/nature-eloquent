#include ../utils/noise.glsl;

uniform vec3 uCameraPosition;
uniform float uTime;
uniform float uWindStrength;
uniform float uWindFrequency;
uniform float uWindScale;

attribute vec3 aGlobalPosition;

varying vec2 vUv;

mat3 grassRotY;
