# Still using console.time ?

Looking for a reliable way to accurately test performance of your code ? Well `node-measure` is the answer (More accurate than console.time).

## Features

- Results have 6 digits of decimal precision.
- Returns the time taken for a label unlike showing output into console directly.
- Can return output into formatted seconds/miliseconds or raw nanoseconds.
- Auto-calibrates and subtracts processing delay for more accurate result.
- Extra functions for easier performance measuring.

## Usage

```js
import { Measure } from 'node-measure';
// const { Measure } = require('node-measure');
const m = new Measure();
```

- ### m.startTimer(`label`)

  > Similar to `console.time(label)`

  Starts a timer with the `label` provided. If not provided, `default` label will be used.

- ### m.endTimer(`label`, `simplified`)

  > Similar to `console.timeEnd(label)`, but...

  It returns the time elapsed since the timer with that label was started, which can be saved into a variable, unlike outputting results into the console directly. `simplified` parameter is optional and is `true` by default. If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.


```js
m.startTimer();
// some code
const end = m.endTimer();
console.log(end);
```

Multiple timers can be created using unique labels.



## Tools to test performance of your code

These functions are completely promise-based.

> Note : `simplified` parameter is optional and is `true` by default. If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.

- ### m.measure(`callback`, `simplified`)

  ```js
  m.measure(async () => {
  	// some code to test
  }).then(results => console.log(results));
  ```

  Takes a function callback as input and returns time taken by the code inside to execute.

  

- ### m.measureAvg(`iterations`, `callback`, `simplified`)

  ```js
  m.measureAvg(5, async () => {
  	// some code to test
  }).then(results => console.log(results));
  ```

  Takes a function callback as input and runs it repetitively for the number of `iterations` provided and returns `avgTimeTaken` (Average time taken by the callback to execute) and `tests` (Array of time taken by each test).

  

- ### m.batchMeasureAvg(`iterations`, `array_of_callbacks`, `simplified`)

  ```js
  m.batchMeasureAvg(5, [
  	async () => {
  		// some code to test
  	},
  	async () => {
  		// some more code to test
  	}
  ]).then(results => console.log(results));
  ```

  Takes an array of function callbacks as input and runs each callback repetitively for the number of `iterations` provided and returns an array of results containing `avgTimeTaken` (Average time taken by a callback to execute) and `tests` (array of time taken by each test).



## License

`node-measure` is available under the [MIT license](https://opensource.org/licenses/MIT). See [LICENSE](https://github.com/tr1ckydev/node-measure/blob/main/LICENSE) for the full license text.
