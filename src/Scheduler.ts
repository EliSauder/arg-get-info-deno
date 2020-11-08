import { difference } from "https://deno.land/std@0.76.0/datetime/mod.ts";

export class Scheduler {

    private callback:() => Promise<unknown>;
    private refreshRate:number;
    private timeoutId:undefined|number;
    private isStarted:boolean;

    constructor(task:() => Promise<unknown>, refreshRate:number) {
        this.isStarted = false;
        this.refreshRate = refreshRate  * 60 * 1000;
        this.callback = task;
    }

    async run() {
        this.isStarted = true;

        const startTime = new Date();

        console.log(startTime.toISOString() + ": Running task");

        await this.callback();

        const finishTime = new Date();
        const duration = difference(finishTime, startTime, {units: ["minutes", "seconds", "milliseconds"]});

        console.log(finishTime + ": Task completed - Duration (m:s:ms): " + duration.minutes + ":" + duration.seconds + ":" + duration.milliseconds);
        console.log(finishTime + ": Creating timeout to run in " + this.refreshRate + "ms");

        this.timeoutId = setTimeout(async () => {
            await this.run();
        }, this.refreshRate);
    }

    stop():void {
        if (!this.isStarted) {
            console.log(new Date().toISOString() + ": Task is already stopped");
            return;
        } 

        console.log(new Date().toISOString() + "Stopping task");
        clearTimeout(this.timeoutId);
        this.isStarted = false;
    }

    changeRefreshRate(rateMin:number):void {
        this.refreshRate = rateMin * 60 * 1000;
        clearTimeout(this.timeoutId);
        if (this.isStarted === true) {
            this.run();
        }
    }
}