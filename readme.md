# performance-benchmarking [![Build Status](https://travis-ci.org/DanielMSchmidt/performance-benchmarking.svg?branch=master)](https://travis-ci.org/DanielMSchmidt/performance-benchmarking)

> Performance test your async code with ease


## Motivation

I wrote this library after trying to use [Benchmark.js](https://benchmarkjs.com/) and failing to use it with async code. What this module does is best to be seen in `./example.js`, but shortly summarized it gives you the option to create new Benchmark objects, which wrap your actual test.
Within the test you have an object at your hand, which you may resolve or reject, depending on if your tests fails or performs correctly. What happens under the hood is:

- your test is performed once to see if it exeeds the `maxTime`.
- If not your tests are executed `repetitions` times and you get the results (for now mean time).

It depends highliy on promises, so it will be easy for you to chain the result and bend it to your needs.

## Install

```
$ npm install --save performance-benchmarking
```


## Usage

```js
var Benchmark = require('performance-benchmarking');

var bench = new Benchmark(function (promise) {
	promise.resolve();
});

bench.then(function (result) {
	console.log('Mean time: ', result);
});

```


## API

### Benchmark(function, [options])

#### constructor
Params:

#### function

Params: ```js{ resolve, reject }```

The function to be performance tested

#### options

Type: ```Object```

May take the following keys:

- maxTime (```integer```): longest time inital test may take in ms.
- repetitions (```integer```): amount of repetitions to do for the test

#### options

##### maxTime

Type: `integer`

The time in ms the inital test may take at longest in order not to fail. May be set via prototype on exported object or like this:

```js
var bench = new Benchmark(..., { maxTime: 2000 });
```

Default is 2000ms.

##### repetitions

Type: `integer`

The amount of repetitions the test may take. They are all performed in serial.

```js
var bench = new Benchmark(..., { repetitions: 100 });
```

Default is 100.


## License

MIT © [Daniel Schmidt](http://danielmschmidt.de)
