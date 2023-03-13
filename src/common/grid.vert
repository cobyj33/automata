attribute vec2 aPos;
uniform vec2 resolution;

void main() {
    vec2 normalized = aPos / resolution;
    vec2 doubled = normalized * 2.0;
    vec2 clip = doubled - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0, 1);
}