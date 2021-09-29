import { Timer } from './timer.js';

interface MeasureAverage {
    avgTimeTaken: number | string,
    tests: (number | string)[]
}

export class Measure {
    private delay = BigInt(0);
    private timers: Map<string, Timer> = new Map();
    constructor() {
        let total = BigInt(0);
        const t = new Timer();
        let i = 4;
        while (i !== 0) {
            t.start();
            total += t.stop();
            i--;
        }
        this.delay = (total / BigInt(5));
    }
    /**
     * Starts a timer with the `label` provided.
     * @param label A unique timer identifier. If not provided, `default` label will be used.
     */
    public startTimer(label = "default") {
        if (this.timers.has(label)) {
            console.warn(`Warning: \`${label}\` label already exists.`);
        } else {
            const t = new Timer();
            t.start();
            this.timers.set(label, t);
        }
    }
    /**
     * It returns the time elapsed since the timer with that label was started.
     * @param label A unique timer identifier. If not provided, `default` label will be used.
     * @param simplified If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.
     * @returns 
     */
    public endTimer(label = "default", simplified = true): number | string | undefined {
        const t = this.timers.get(label);
        if (!t) {
            console.warn(`Warning: \`${label}\` label does not exist.`);
        } else {
            this.timers.delete(label);
            const diff = Number(t.stop() - this.delay);
            return simplified ? simplify(diff) : diff;
        }
    }
    /**
     * Measures time taken for the callback to execute.
     * @param callback The function to measure.
     * @param simplified If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.
     * @returns According to simplified param.
     */
    async measure(callback: Function, simplified = true): Promise<number | string> {
        if (!callback) throw "No callback provided";
        const t = new Timer();
        t.start();
        await callback();
        const diff = Number(t.stop() - this.delay);
        return simplified ? simplify(diff) : diff;
    }
    /**
     * Measures time taken for the callback to execute for the number of iterations provided.
     * @param iterations Number of times to repetetively test the code.
     * @param callback The function to measure.
     * @param simplified If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.
     * @returns `avgTimeTaken`(Average time taken by the callback to execute) and `tests` (Array of time taken by each test).
     */
    async measureAvg(iterations: number, callback: Function, simplified = true): Promise<MeasureAverage> {
        const tests: (number | string)[] = [];
        let total = 0;
        let i = iterations;
        while (i !== 0) {
            const test = await this.measure(callback, false) as number;
            tests.push(simplified ? simplify(test) : test);
            total += test;
            i--;
        }
        return {
            avgTimeTaken: simplified
                ? simplify(total / iterations)
                : (total / iterations).toFixed(6),
            tests
        };
    }
    /**
     * Measures time taken for each callback in the array to execute for the number of iterations provided.
     * @param iterations Number of times to repetetively test the code.
     * @param arr Array of callback functions.
     * @param simplified If it's true it returns the time elapsed in form of human-readable seconds or milliseconds accordingly, else returns in raw nanoseconds.
     * @returns Array of `avgTimeTaken`(Average time taken by the callback to execute) and `tests` (Array of time taken by each test) for each callback.
     */
    async batchMeasureAvg(iterations: number, arr: Function[], simplified = true): Promise<MeasureAverage[]> {
        const tests: MeasureAverage[] = [];
        for (const callback of arr) {
            const result = await this.measureAvg(iterations, callback, simplified);
            tests.push(result);
        }
        return tests;
    }
}

function simplify(diff: number): string {
    const ms = diff / 1_000_000;
    const s = diff / 1_000_000_000;
    return s >= 1
        ? s.toFixed(6) + "s"
        : ms.toFixed(6) + "ms";
}