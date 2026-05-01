vec3 finalColor = texture2D(uGrassMapTexture, vUv).rgb;
float alpha = texture2D(uGrassAlphaMap, vUv).r;
if ( alpha < .9 ) {
    discard ;
}
diffuseColor *= vec4(finalColor*uDarkFactor, alpha);
