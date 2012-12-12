(function(util){
// UTILS for simple benchmarking and doing live updates to code
// @author: Josh Weinstein josher19 on github

/**
 * wrap a Function `fn` with `that` context. 
 * Send results to console log if `Math.random() < perc`.
 * Record callCount, lastResults, and lastCall arguments on wrapped function.
 * @param {Function} fn - function to be wrapped
 * @param {Object} that - optional context for `this` when function is called
 * @param {number} perc - optional percentage of logging results to console.log. 1.0 => always, 0.0 or undefined => never
 * @Returns wrapped function
 * 
 * Usage:
 * orig_getTan2 = getTan2
 * getTan2 = obj.getTan2 = wrap(getTan2, obj);
 * orig_getTan2 == getTan2.unwrap; // => true
 * // ... use getTan2 normally ..
 * getTan2.callCount; // number of times wrapped function was called
 * getTan2.lastResults; // results returned last time function was called
 * getTan2.lastCall; // [arguments, this, context]
 * getTan2.apply(getTan2.lastCall[2] || getTan2.lastCall[1], getTan2.lastCall[0]);
 * getTan2.redo(); // re-run with last arguments and context
 * JSON.stringify(getTan2.redo()) == JSON.stringify(getTan2.lastResults); // usually true for deterministic functions
 * // ... when done: ...
 * obj.getTan2 = obj.getTan2.unwrap || obj.getTan2;
 * 
 * // Can also see how well getTan2 ordering is optimized by wrapping Math.abs and checking callCounts.
 * Math.abs = wrap(Math.abs);
 * Math.abs.callCount=0; 
 * timer(getTan2, 1000, getTan2.lastCall[0]); // < 5ms
 * Math.abs.callCount; // between 1000 and 6000 depending on position and radius
 * 
 */
util.wrap = function wrap(fn,that,perc) { 
    var wrapped = function() { wrapped.lastCall = [arguments,this,that]; if (perc && Math.random() < perc) console.log(arguments); wrapped.callCount += 1; return wrapped.lastResults = fn.apply(that || this,arguments); }; 
    wrapped.callCount = 0; 
    wrapped.unwrap=fn.unwrap || fn; 
    wrapped.redo = function() { return fn.apply(wrapped.lastCall[2] || wrapped.lastCall[1] || that || this, wrapped.lastCall[0]); }; 
    return wrapped;
}

/**
 * Time a function with given args and context. 
 * @param {Function} fn function to run
 * @param {number} cnt count of how many times to run it
 * @param {Argument or Array} args arguments to function
 * @param {object} context what `this` applies to in the function
 * @Returns time in milliseconds
 * 
 * Usage:
 * var cast = scene.objects[1].cast;
 * scene.objects[1].cast = wrap(castFix, scene.objects[1]); 
 * castFix == scene.objects[1].cast.unwrap; // true
 * // now use it
 * var that = scene.objects[1].cast.lastCall[2]; // or scene.objects[1]
 * var args = scene.objects[1].cast.lastCall[0];
 * timer(castFix, 3000, args, that) / timer(cast, 3000, args, that) * 100; // should be < 100 if faster
 */
util.timer = function timer(fn, cnt, args, context) { 
    if (null==cnt) cnt=3000; 
    var tstart = new Date(); 
    while(--cnt >= 0) fn.apply(context, args); 
    return new Date() - tstart; 
}

}(this));
