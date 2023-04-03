export default 
`#version 300 es \n\

uniform vec4 u_intersectionColor; \n\
uniform float u_intersectionWidth; \n\

bool inSensorShadow(vec3 coneVertexWC, vec3 pointWC) \n\
{ \n\
    // Diagonal matrix from the unscaled ellipsoid space to the scaled space. \n\
    vec3 D = czm_ellipsoidInverseRadii; \n\

    // Sensor vertex in the scaled ellipsoid space \n\
    vec3 q = D * coneVertexWC; \n\
    float qMagnitudeSquared = dot(q, q); \n\
    float test = qMagnitudeSquared - 1.0; \n\

    // Sensor vertex to fragment vector in the ellipsoid's scaled space \n\
    vec3 temp = D * pointWC - q; \n\
    float d = dot(temp, q); \n\

    // Behind silhouette plane and inside silhouette cone \n\
    return (d < -test) && (d / length(temp) < -sqrt(test)); \n\
} \n\

vec4 getIntersectionColor() \n\
{ \n\
    return u_intersectionColor; \n\
} \n\

float getIntersectionWidth() \n\
{ \n\
    return u_intersectionWidth; \n\
} \n\

vec2 sensor2dTextureCoordinates(float sensorRadius, vec3 pointMC) \n\
{ \n\
    // (s, t) both in the range [0, 1] \n\
    float t = pointMC.z / sensorRadius; \n\
    float s = 1.0 + (atan(pointMC.y, pointMC.x) / czm_twoPi); \n\
    s = s - floor(s); \n\

    return vec2(s, t); \n\
} \n\
`