precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

uniform float opacity;
uniform float xLineWidth;
uniform float xLineOffset;
uniform float yLineWidth;
uniform float yLineOffset;

void main() {

  vec2 uv = vTexCoord;

  float xmod = mod(vTexCoord.x, xLineOffset);
  float xscale = min(abs(xLineWidth - xmod), xLineWidth) / xLineWidth;
  float ymod = mod(vTexCoord.y, yLineOffset);
  float yscale = min(abs(yLineWidth - ymod), yLineWidth) / yLineWidth;
  float scale = max(opacity, xscale * yscale);

  gl_FragColor = vec4(texture2D(tex0, uv) * scale);
}