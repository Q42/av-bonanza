precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

// the size of a texel or 1.0 / width , 1.0 / height
uniform vec2 texelSize;

uniform mat3 kernel;

void main() {

  vec2 uv = vTexCoord;

  vec3 totalColor = vec3(0.0);
  for(int i = 0; i < 3; i++){
    for(int j = 0; j < 3; j++) {
      vec2 texOffset = vec2((i-1) * texelSize.x, (j-1) * texelSize.y);
      vec3 col = texture2d(tex0, uv + texOffset) * kernel[i][j];
      totalColor += col;
    }
  }

  gl_FragColor = vec4(totalColor,1.0);
}