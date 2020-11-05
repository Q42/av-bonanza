precision mediump float;

varying vec2 redCoord;
varying vec2 greenCoord;
varying vec2 blueCoord;

// our texture coming from p5
uniform sampler2D tex0;

void main() {
  vec3 colors = vec3(1.0);

  colors.r = texture2D(tex0, redCoord).r;
  colors.g = texture2D(tex0, greenCoord).g;
  colors.b = texture2D(tex0, blueCoord).b;

  gl_FragColor = vec4(colors,1.0);
}