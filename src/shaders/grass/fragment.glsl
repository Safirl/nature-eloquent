varying vec2 vUv;
uniform sampler2D uGrassMapTexture;
uniform sampler2D uGrassAlphaMap;
uniform vec3 uDarkFactor;
void main() {
    vec3 finalColor = texture2D(uGrassMapTexture, vUv).rgb;
    float alpha = texture2D(uGrassAlphaMap, vUv).r;
    if(alpha < .9) {
        discard;
    }
    gl_FragColor = vec4(finalColor * uDarkFactor, alpha);
}