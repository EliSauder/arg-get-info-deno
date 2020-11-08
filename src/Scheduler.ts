export class Scheduler {

    private callback:() => void;
    private refreshRate:number;
    private timeoutId:undefined|number;
    private isStarted:boolean;

    constructor(task:() => void, refreshRate:number) {
        this.isStarted = false;
        this.refreshRate = refreshRate  * 60 * 1000;
        this.callback = task;
    }

    run():void {
        this.isStarted = true;

        console.log(new Date().toISOString() + ": Running task");

        this.callback();

        console.log(new Date().toISOString() + ": Task completed");
        console.log(new Date().toISOString() + ": Creating timeout to run in " + this.refreshRate + "ms");

        this.timeoutId = setTimeout(() => {
            this.run();
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