'use strict';
// TODO: add browser support
var Performance = require('microtime');

function Benchmark(fn, options = {}) {
	if (!fn) {
		throw new Error('No function specified');
	}

	this.maxTime = options.maxTime;
	this.repetitions = options.repetitions;
	return this.run(fn);
}

// default options
Benchmark.prototype.maxTime = 2000; // 2s
Benchmark.prototype.repetitions = 100;

Benchmark.prototype.run = function (fn) {
	// Try initial one, to be safe it works
	const promise = new Promise(function (resolve, reject) {
		fn({resolve, reject});
		setTimeout(() => reject(), this.maxTime);
	});

	promise.then(() => {
		// Run actual performance tests
		return this.measure(fn, this.repetitions);
	}, () => {
		console.log('You initial run took more than ', this.maxTime);
	});

	return promise;
};

Benchmark.prototype.measure = function (fn, repetitions) {
	var initTime;
	console.log(repetitions);
	return new Promise(function (resolve, reject) {
		initTime = Performance.now();
		fn({resolve, reject});
	}).then(function () {
		return Performance.now() - initTime;
	}).then(function (result) {
		console.log('result: ', result);
	});
};

module.exports = Benchmark;
