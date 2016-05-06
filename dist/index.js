'use strict';
var present = require('present');

function Benchmark(fn, options) {
	if ( options === void 0 ) options = {};

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
	var this$1 = this;

	return new Promise(function (resolve, reject) {
		fn({resolve: resolve, reject: reject});
		setTimeout(function () { return reject(); }, this.maxTime);
	}).then(function () {
		// Run actual performance tests
		return this$1.measure(fn, this$1.repetitions).then(function ( accumulatedResults ) { return accumulatedResults / this$1.repetitions; });
	}, function () {
		console.log('You initial run took more than ', this$1.maxTime);
	});
};

Benchmark.prototype.measure = function (fn, repetitions) {
	var this$1 = this;

	return new Promise(function (resolve, reject) {
		if (repetitions <= 0) {
			resolve(0);
			return;
		}

		this$1.singleTest(fn).then(function ( initialResult ) {
			this$1.measure(fn, repetitions - 1).then(function ( accumulatedResults ) {
				resolve(accumulatedResults + initialResult);
			});
		}, function () {
			console.log('Failed');
			reject();
		});
	});
};

Benchmark.prototype.singleTest = function (fn) {
	var initTime;
	return new Promise(function (resolve, reject) {
		initTime = present();
		fn({resolve: resolve, reject: reject});
	}).then(function () {
		return present() - initTime;
	}).then(function (result) {
		return result;
	});
};

module.exports = Benchmark;

