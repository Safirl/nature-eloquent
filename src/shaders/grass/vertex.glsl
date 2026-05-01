vec3 localPos = transformed;
localPos . x *= .5 ;
localPos . y += .5 ;

// vec2 dir = normalize(uCameraPosition.xz - aGlobalPosition.xz);

// float angle = atan(dir.x, dir.y);

// float s = sin(angle);
// float c = cos(angle);
// mat3 rotY = mat3(
//         c, 0.0, -s,
//         0.0, 1.0, 0.0,
//         s, 0.0, c
//     );
// transformedNormal = transformedNormal;
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
