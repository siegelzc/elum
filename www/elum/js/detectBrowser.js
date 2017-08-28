var browser = 'unknown';
try {
	var e;
	var f = e.width;
} catch (e) {
	var err = e.toString();
	if (err.search('not an object') !== -1){
		browser = 'safari';
	} else if (err.search('Cannot read') !== -1){
		browser = 'chrome';
	} else if (err.search('e is undefined') !== -1){
		browser = 'firefox';
	} else if (err.search('Unable to get property \'width\' of undefined or null reference') !== -1){
		if (!(false || !!document.documentMode) && !!window.StyleMedia){
			browser = 'edge';
		} else {
			browser = 'IE';
		}
	} else if (err.search('cannot convert e into object') !== -1){
		browser = 'opera';
	} else {
		browser = undefined;
	}
}