uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;
varying vec3 vPosition;


void main() {
    float h = normalize(vPosition).y;
    h = h * .5 + .5;

    vec3 finalColor = vec3(0.);
    // finalColor = smoothstep(color0, color1, h);
    finalColor = mix(color2, color1, smoothstep(0.1, 0.5, h));
    finalColor = mix(finalColor, color0, smoothstep(0.5, .7, h));

    // gl_FragColor = vec4(col, 1.0);
    gl_FragColor = vec4(finalColor, 1.);
}