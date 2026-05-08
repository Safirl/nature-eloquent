vec3 localPos = transformed;
localPos . x *= .5 ;
float rand = max(.6, random(aGlobalPosition.xz));
float height = uHeight * uHeightRandomness * rand;
localPos . y *= height;
localPos . y += .5 * height;

vec3 finalPosition = grassRotY * localPos;
finalPosition += aGlobalPosition;

// float dist = length(aGlobalPosition.xz - uCameraPosition.xz);
// float visibility = 1.0 - smoothstep(uRenderDistance * 0.85, uRenderDistance, dist);

// // Shrink blade above terrain to zero when out of range — degenerate triangles skip rasterization
// float bladeHeight = finalPosition.y - aGlobalPosition.y;
// finalPosition.y = aGlobalPosition.y + bladeHeight * visibility;

float heightFactor = uv.y * 1.3;
float noise = cnoise(vec3(
            aGlobalPosition.x * uWindScale,
            aGlobalPosition.z * uWindScale,
            uTime * uWindFrequency
        ));
float windStrength = noise * uWindStrength * heightFactor;
finalPosition . x += windStrength;
finalPosition . z += windStrength;
transformed = finalPosition;

vUv = uv;
