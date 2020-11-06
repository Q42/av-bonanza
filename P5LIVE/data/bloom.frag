precision mediump float;

// texcoords from the vertex shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform sampler2D tex1;

// the mouse value between 0 and 1
uniform float bloomAmount;

uniform float xLineWidth;
uniform float xLineOffset;
uniform float yLineWidth;
uniform float yLineOffset;

void main() {

  vec2 uv = vTexCoord;

  // get the camera and the blurred image as textures
  vec4 cam = texture2D(tex0, uv);
  vec4 blur = texture2D(tex1, uv);

  // calculate an average color for the blurred image
  // this is essentially the same as saying (blur.r + blur.g + blur.b) / 3.0;
  float avg = dot(blur.rgb, vec3(0.33333));

  float xmod = mod(vTexCoord.x, xLineOffset);
  float xscale = min(abs(xLineWidth - xmod), xLineWidth) / xLineWidth;
  float ymod = mod(vTexCoord.y, yLineOffset);
  float yscale = min(abs(yLineWidth - ymod), yLineWidth) / yLineWidth;
  float pixelScale = xscale * yscale;

  // mix the blur and camera together according to how bright the blurred image is
  // use the mouse to control the bloom
  vec4 bloom = cam + blur * clamp(avg*bloomAmount, 0.0, 1.0) + bloomAmount * pixelScale * blur;

  gl_FragColor = bloom;
}