// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 samplePositions[14];

// which way to blur, vec2(1.0, 0.0) is horizontal, vec2(0.0, 1.0) is vertical
uniform vec2 direction;

// the size of a texel or 1.0 / width , 1.0 / height
uniform vec2 texelSize;

void main() {
  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // these offsets were also pulled from the link above
	float gOffsets[7];
		gOffsets[0] = 0.66293;
		gOffsets[1] = 2.47904;
		gOffsets[2] = 4.46232;
		gOffsets[3] = 6.44568;
		gOffsets[4] = 8.42917;
		gOffsets[5] = 10.41281;
		gOffsets[6] = 12.39664;

  for(int i = 0; i < 7; i++) {
	vec2 offset = texelSize * direction * gOffsets[i];
    samplePositions[i] = aTexCoord.xy - offset;
    samplePositions[i+7] = aTexCoord.xy + offset;
  }

  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}