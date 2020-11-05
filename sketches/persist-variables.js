// Persist variables example

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	// Restore variables
	restoreVariables(setVal);
	restoreVariables(setVal, "NAMESPACE");
	
	// Set variables
	storeVariable(1, 123);
	storeVariable(2, 456);
	storeVariable(1, 'abc', "NAMESPACE");
	storeVariable(2, 'def', "NAMESPACE");
}

function draw() {
	
}

function setVal(key, value) {
	console.log('set: ' + key + ' ' + value);
}

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
