#include ../utils/noise.glsl;

uniform vec3 uCameraPosition;
uniform float uTime;
uniform float uWindStrength;
uniform float uWindFrequency;
uniform float uWindScale;
uniform float uHeight;
uniform float uHeightRandomness;

attribute vec3 aGlobalPosition;

varying vec2 vUv;

mat3 grassRotY;
