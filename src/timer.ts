import { hrtime } from 'process';
export class Timer {
    private i: bigint = BigInt(0);
    start(): void { this.i = hrtime.bigint(); }
    stop(): bigint { return hrtime.bigint() - this.i; }
}