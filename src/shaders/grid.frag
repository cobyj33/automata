precision mediump float;
uniform vec2 offset;
uniform vec4 gridColor;
uniform vec2 cellSize;
uniform float gridLineWidth;

float modI(float a,float b) {
    float m = a - floor( (a + 0.5) / b ) * b;
    return floor( m + 0.5 );
}

bool closeTo(float num, float desired, float range) {
    return num >= (desired - range) && num <= (desired + range);
}

void main() {
    const float ACCURACY = 0.0001;
    
    if ( closeTo( modI((gl_FragCoord.x - offset.x), cellSize.x), 0.0, ACCURACY) || closeTo( modI((gl_FragCoord.y - offset.y), cellSize.y), 0.0, ACCURACY)  ) {
        gl_FragColor = gridColor;
    } else {
        gl_FragColor = vec4(0, 0, 0, 0);
    }
}