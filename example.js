var Benchmark = require('./dist/index.js');

var bench = new Benchmark(function (promise) {
	promise.resolve();
});

bench.then(function (result) {
	console.log('did result: ', result);
});
