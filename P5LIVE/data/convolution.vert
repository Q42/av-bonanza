// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying mat3 samplePositions;

// the size of a texel or 1.0 / width , 1.0 / height
uniform vec2 texelSize;

void main() {
  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  for(int i = -1; i < 2; i++) {
    for(int j = -1; j < 2; j++) {
        vec2 offset = vec2(i,j);
        samplePositions[i+1][j+1] = aTexCoord + texelSize * offset;
    }
  }

  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}