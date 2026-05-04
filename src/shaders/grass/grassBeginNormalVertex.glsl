vec2 dir = normalize(uCameraPosition.xz - aGlobalPosition.xz);

float angle = atan(dir.x, dir.y);

float s = sin(angle);
float c = cos(angle);
mat3 grassRotY = mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
transformedNormal = normalMatrix * vec3(0.0, 0.0, 1.0);
