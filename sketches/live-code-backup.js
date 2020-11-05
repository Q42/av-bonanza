let c;

let bgHue = 0;
let bgSaturation = 0;
let bgBrightness = 0;
let bgOpacity = 0;
let animationSpeed = 0;

function preload() {
	loadShaders();
}

function setup() {
	// frameRate(60);
	
	restoreVariables(mapMidiToValue, "MIDI");
	restoreVariables(mapCacheToValue, "APP");
	
	// Setup
	createCanvas(windowWidth, windowHeight, WEBGL);
	c = createGraphics(windowWidth, windowHeight);
	
	setupShaders();
	
	// Sync color mode with MIDI values
	c.colorMode(HSB, 127);

	// Default draw style
	c.fill(255);
	c.strokeWeight(0);
	
	// Center all draws
	c.translate(width / 2, height / 2);
}

function draw() {
	// Fade trail
	c.background(bgHue, bgSaturation, bgBrightness, bgOpacity);

	// Generated chasing dots
	const now = Date.now() / 100;
	for(let i = 1; i <= 24; i++) {
		drawStep(i / (8 / animationSpeed), i / (8 / animationSpeed), 3, now);
	}
	
	applyShaders();
}


//**************************************
// ANIMATION SHIZZLE
//**************************************

function drawStep(xSpeed, ySpeed, pulseSpeed, timestamp) {
	let oscX = sin(timestamp * 0.01 * xSpeed) * height * .4;
	let oscY = cos(timestamp * 0.01 * ySpeed) * height * .4;
	let radius = positiveModulate(sin(timestamp * 0.01 * pulseSpeed)) * 10 + 10;
	
	c.ellipse(oscX, oscY, radius, radius);
}

function positiveModulate(value) {
	return (value + 1) / 2;
}

//**************************************
// SHADER SHIZZLE
//**************************************

let rgbShader, scanLineShader, blurHShader, blurVShader, bloomShader;
let prePass, scanLinePass, rgbPass, blurPass1, blurPass2, bloomPass;
let xOffset = 0.001;
let yOffset = 0;
let xLineWidth = 0.0008;
let xLineOffset = 0.002;
let yLineWidth = 0.0015;
let yLineOffset = 0.01;
let bloomAmount = 5;

function loadShaders() {
	rgbShader = loadShader('/data/rgbSplit.vert', '/data/rgbSplit.frag');
	scanLineShader = loadShader('/data/shader.vert', '/data/scanlines.frag');
	blurHShader = loadShader('/data/blur.vert', '/data/blur.frag');
	blurVShader = loadShader('/data/blur.vert', '/data/blur.frag');
	bloomShader = loadShader('/data/shader.vert', '/data/bloom.frag')
}

function setupShaders() {
	prePass = createGraphics(1 / xLineOffset, 1 / yLineOffset, WEBGL);
	scanLinePass = createGraphics(windowWidth, windowHeight, WEBGL);
	rgbPass = createGraphics(windowWidth, windowHeight, WEBGL);
	blurPass1 = createGraphics(windowWidth / 16, windowHeight / 16, WEBGL);
	blurPass2 = createGraphics(windowWidth / 16, windowHeight / 16, WEBGL);
	bloomPass = createGraphics(windowWidth, windowHeight, WEBGL);
	
	prePass.noStroke();
	rgbPass.noStroke();
	blurPass1.noStroke();
	blurPass2.noStroke();
	bloomPass.noStroke();
	scanLinePass.noStroke();
	noStroke();
}

function applyShaders() {
	prePass.image(c, -prePass.width/2, -prePass.height/2, prePass.width, prePass.height);
	
	scanLineShader.setUniform('tex0', prePass);
	scanLineShader.setUniform('xLineWidth', xLineWidth);
	scanLineShader.setUniform('yLineWidth', yLineWidth);
	scanLineShader.setUniform('xLineOffset', xLineOffset);
	scanLineShader.setUniform('yLineOffset', yLineOffset);
	scanLinePass.shader(scanLineShader);
	scanLinePass.rect(0, 0, width, height);
	
	rgbShader.setUniform('tex0', scanLinePass);
	rgbShader.setUniform('xOffset', xOffset);
	rgbShader.setUniform('yOffset', yOffset);
	
	rgbPass.shader(rgbShader);
	rgbPass.rect(0, 0, width, height);
	
	blurHShader.setUniform('tex0', rgbPass);
	blurHShader.setUniform('texelSize', [1.0/width, 1.0/height]);
	blurHShader.setUniform('direction', [1.0, 0.0]);
	blurPass1.shader(blurHShader);
	blurPass1.rect(0, 0, blurPass1.width, blurPass1.height);
	
	blurVShader.setUniform('tex0', blurPass1);
	blurVShader.setUniform('texelSize', [1.0/width, 1.0/height]);
	blurVShader.setUniform('direction', [0.0, 1.0]);
	blurPass2.shader(blurVShader);
	blurPass2.rect(0, 0, blurPass2.width, blurPass2.height);
	
	bloomShader.setUniform('tex0', rgbPass);
	bloomShader.setUniform('tex1', blurPass2);
	bloomShader.setUniform('mouseX', bloomAmount);

	bloomPass.shader(bloomShader);
	bloomPass.rect(0, 0, width, height);
	
	image(bloomPass, -width/2, -height/2, width, height);
}

//**************************************
// MIDI sharing SHIZZLE
//**************************************

// My stuff

const midiSlider1 = 0;
const midiSlider2 = 1;
const midiSlider3 = 2;
const midiSlider4 = 3;
const midiSlider8 = 7;
const midiR1 = 64;
const midiKnob1 = 16;
const midiKnob2 = 17;
const midiKnob3 = 18;
const midiKnob4 = 19;
const midiKnob5 = 20;
const midiKnob6 = 21;
const midiKnob7 = 22;
const midiKnob8 = 23;

function mapMidiToValue(key, value) {
	switch(parseInt(key)) {
		case midiKnob1:
			xOffset = value / 127 / 100;
			break;
		case midiKnob2:
			yOffset = value / 127 / 100;
			break;
		case midiKnob3:
			bloomAmount = (value / 127 * 5) - 1;
			break;
		case midiSlider1:
			bgHue = value;
			break;
		case midiSlider2:
			bgSaturation = value;
			break;
		case midiSlider3:
			bgBrightness = value;
			break;
		case midiSlider4:
			bgOpacity = value;
			break;
		case midiR1:
			c.background(0);
			break;
		case midiKnob8:
			animationSpeed = value / 127 * 20
			break;
	}
	
	// store new values
	if(typeof key == "number") {
		storeVariable(key, value, "MIDI");
	}
}

// Generated

function parseData(obj) {
	// print(obj) // debug incoming message

	// parse only 'midi' data
	if(obj.type && obj.type == 'midi') {
		let mm = obj; // midimessage
		if(mm.note !== undefined) {
			switch (mm.note.type) {
				case 'noteon':
					noteOn(mm.note);
					break;
				case 'noteoff':
					noteOff(mm.note);
					break;
			}
		} else if(mm.pitch !== undefined) {
			pitchBend(mm.pitch);
		} else if(mm.control !== undefined) {
			controlChange(mm.control);
		}

		// optionally listen to midiMessages from others on your local gear!
		getData(obj); // ignored by those without syncData active
	} else if(obj.type && obj.type == 'latency') {
		getData(obj);
	}
}

function noteOn(note) { 
	// use note.type, .channel, .name, .number, .octave, .velocity
	// let x = map(note.number, 0, 128, 0, width);
	// let h = map(note.velocity, 0, 128, 0, height);
	// c.noStroke();
	// c.fill(note.velocity * 2);
	// c.rectMode(CENTER);
	// c.rect(x, height / 2, width / 128, h);
	
	mapMidiToValue(note.number, note.velocity)
}

function noteOff(note) {
	// use note.type, .channel, .name, .number, .octave, .velocity
}

function pitchBend(pitch) {
	// use pitch.type, .channel, .value
	// console.log(pitch.value);
}

function controlChange(control) {
	// use control.type, .channel, .controllerNumber, .controllerName, .value
	mapMidiToValue(control.controllerNumber, control.value);
}

function midiToFreq(noteNumber) {
	return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

//**************************************
// CACHE SHIZZLE
//**************************************

function mapCacheToValue(key, value) {
	switch(key) {
		case "frameCount":
			frameCount = parseInt(value);
			break;
	}
}

function restoreVariables(method, namespace = "") {
	const cache = getCache(namespace);
	Object.entries(cache)
		.forEach(([key, value]) => method(key, value));
}

function storeVariable(key, value, namespace = "") {
	const { cacheType, cacheKey } = getCacheRef(namespace);
	const cache = getCache(namespace);
	
	cacheType[cacheKey] = JSON.stringify({
		...cache,
		[key]: value
	});
}

function getCache(namespace = "") {
	const { cacheType, cacheKey } = getCacheRef(namespace);
	return cacheType[cacheKey]
	  ? JSON.parse(cacheType[cacheKey])
	  : {};
}

function getCacheRef(namespace = "") {
	const urlParams = new URLSearchParams(window.location.search);
	const prefix = "bonanza-cache";
	const key = `${prefix}${namespace ? '-' + namespace : ''}`;
	
	if(urlParams.has('cc')) {
		return {
			cacheType: localStorage,
			cacheKey: `${key}-${urlParams.get('cc')}`
		};
	}
	
	return {
		cacheType: sessionStorage,
		cacheKey: key
	};
}