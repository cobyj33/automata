precision mediump float;
uniform vec2 gridPosition;
uniform vec4 gridColor;
uniform vec2 cellSize;
uniform float gridLineWidth;

float modI(float a,float b) {
    float m = a - floor( (a + 0.5) / b ) * b;
    return floor( m + 0.5 );
}

float trunc(float num) {
    if (num > 0.0) {
        return floor(num);
    } else if (num < 0.0) {
        return ceil(num);
    }
    return 0.0;
}

float remainder(float dividend, float divisor) {
    return dividend - (trunc(dividend / divisor) * divisor);
}

float getDecimal(float num) {
    return abs(num - trunc(num));
}

bool closeTo(float num, float desired, float range) {
    return num >= (desired - range) && num <= (desired + range);
}

void main() {
    const float ACCURACY = 1.0;
    vec2 position = gridPosition + gl_FragCoord.xy;
    vec2 offset = vec2(remainder(position.x, cellSize.x), remainder(position.y, cellSize.y));
    
    if ( closeTo( offset.x, 0.0, ACCURACY) || closeTo( offset.y, 0.0, ACCURACY)  ) {
        gl_FragColor = gridColor;
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    // gl_FragColor = vec4(offset.xy, 1.0, 1.0);
}