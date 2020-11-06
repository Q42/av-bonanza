precision mediump float;

// lets grab texcoords just for fun
varying mat3 samplePositions;

// our texture coming from p5
uniform sampler2D tex0;

uniform mat3 kernel;

void main() {

  vec3 totalColor = vec3(0.0);
  for(int i = 0; i < 3; i++){
    for(int j = 0; j < 3; j++) {
      vec3 col = texture2d(tex0, samplePositions[i][j]) * kernel[i][j];
      totalColor += col;
    }
  }

  gl_FragColor = vec4(totalColor,1.0);
}