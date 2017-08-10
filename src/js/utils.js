// NPM modules

/**
 * Create a SVG tansform for a given translation.
 */
function makeTranslate(x, y) {
	return "translate("+[x,y]+")"
}

/**
 * Use any string to generate a CSS class or id name.
 */
function classify(str) {
	return str.toLowerCase()
		.replace(/\s+/g, '-')		 // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-')	 // Replace multiple - with single -
		.replace(/^-+/, '')			 // Trim - from start of text
		.replace(/-+$/, '');			// Trim - from end of text
}

/**
 * Throttle a function call.
 */
function throttle(fn, threshold, scope) {
	threshold || (threshold = 250);
	var last,
		deferTimer;
	return function() {
		var context = scope || this;

		var now = +new Date(),
			args = arguments;
		if (last && now < last + threshold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
};

module.exports = {
	makeTranslate: makeTranslate,
	classify: classify,
	throttle: throttle
}
