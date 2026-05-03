vec3 localPos = transformed;
localPos . x *= .5 ;
float rand = max(.6, random(aGlobalPosition.xz));
float height = uHeight * uHeightRandomness * rand;
localPos . y *= height;
localPos . y += .5 * height;

vec3 finalPosition = grassRotY * localPos;
finalPosition += aGlobalPosition;
float heightFactor = uv.y * 1.3; //Changing later (tipness strength)
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
