vec3 localPos = transformed;
localPos . x *= .5 ;
localPos . y += .5 ;

vec3 finalPosition = grassRotY * localPos;
finalPosition += aGlobalPosition;
float heightFactor = uv.y; //Changing later
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
