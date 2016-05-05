var Benchmark = require('./dist/index.js');

var promise = new Benchmark(function (promise) {
	promise.resolve();
});

promise.then(function (result) {
	console.log('did result: ', result);
});
