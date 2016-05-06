'use strict';
var present = require('present');

function Benchmark(fn, options = {}) {
	if (!fn) {
		throw new Error('No function specified');
	}

	this.maxTime = options.maxTime || this.maxTime;
	this.repetitions = options.repetitions || this.repetitions;
	return this.run(fn);
}

// default options
Benchmark.prototype.maxTime = 2000; // 2s
Benchmark.prototype.repetitions = 100;

Benchmark.prototype.run = function (fn) {
	// Try initial one, to be safe it works
	return new Promise(function (resolve, reject) {
		fn({resolve, reject});
		setTimeout(() => reject(), this.maxTime);
	}).then(() => {
		// Run actual performance tests
		return this.measure(fn, this.repetitions).then(accumulatedResults => accumulatedResults / this.repetitions);
	}, () => {
		console.log('You initial run took more than ', this.maxTime);
	});
};

Benchmark.prototype.measure = function (fn, repetitions) {
	return new Promise((resolve, reject) => {
		if (repetitions <= 0) {
			resolve(0);
			return;
		}

		this.singleTest(fn).then(initialResult => {
			this.measure(fn, repetitions - 1).then(accumulatedResults => {
				resolve(accumulatedResults + initialResult);
			});
		}, () => {
			console.log('Failed');
			reject();
		});
	});
};

Benchmark.prototype.singleTest = function (fn) {
	var initTime;
	return new Promise(function (resolve, reject) {
		initTime = present();
		fn({resolve, reject});
	}).then(function () {
		return present() - initTime;
	}).then(function (result) {
		return result;
	});
};

module.exports = Benchmark;
