precision mediump float;

// texcoords from the vertex shader
varying vec2 samplePositions[14];

// our texture coming from p5
uniform sampler2D tex0;

// gaussian blur filter modified from Filip S. at intel 
// https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms

void main() {

  vec3 colOut = vec3( 0.0 );

  // these weights were pulled from the link above
	float gWeights[7];
	    gWeights[0] = 0.10855;
	    gWeights[1] = 0.13135;
	    gWeights[2] = 0.10406;
	    gWeights[3] = 0.07216;
	    gWeights[4] = 0.04380;
	    gWeights[5] = 0.02328;
	    gWeights[6] = 0.01083;

  for (int i = 0; i < 7; i++) {
      vec3 col = texture2D( tex0, samplePositions[i] ).xyz + texture2D( tex0, samplePositions[i+7] ).xyz; 

      // multiply col by the gaussian weight value from the array
      col *= gWeights[i];

      // add it all up
      colOut +=  col;   
  }

  gl_FragColor = vec4(colOut, 1.0);
}