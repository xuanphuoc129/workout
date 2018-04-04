import { Untils } from "../untils";

export class Exercise {
    /**id của bài tập */
    id: string;
    /**tên của bài tập */
    name: string;
    /**icon của bài tập */
    icon: string;
    /**danh sách các stick man của bài tập */
    stickman: Array<string>;
    /**màu sắc của bài tập */
    color: string;
    constructor(data?: any) {
        this.setDefault();
        if(data)this.parse(data);
    }

    private setDefault() {
        this.id = "";
        this.name = "";
        this.icon = "";
        this.stickman = [];
        this.color = "";
    }

    parse(data){
        if(data.id)this.id = data.id;
        if(data.name)this.name = data.name;
        if(data.icon)this.icon = data.icon;
        if(data.stickman)this.stickman = data.stickman;
        if(data.color)this.color = data.color;
    }

}

export class Exercises {
    /**id của bài tập */
    id: string;
    /**tên của bài tập */
    name: string;
    /**danh sách các động tác */
    exerciseList: Array<Exercise>;
    /**danh sách id các động tác */
    exerciseListIDs: Array<string>;
    /**bộ đếm thời gian */
    timer: Time;
    /**icon của bài tập */
    icon: string;
    /**Loại bài tập 1-cardio  2-yoga */
    type: number;
    /**level 1 basic 2 medium 3 high*/
    level : number;
    constructor(data?: any) {
        this.setDefault();
        if (data) this.parse(data);
    }

    private setDefault() {
        this.id = "";
        this.name = "Exercise Name";
        this.exerciseList = [];
        this.exerciseListIDs = [];
        this.timer = new Time();
        this.icon = "";
        this.type = -1;
        this.level = 0;
    }
    public parse(data: any) {
        // console.log("data",data);
        
        if(data.id)this.id = data.id;
        if(data.name)this.name = data.name;
        if(data.exerciseList){
            data.exerciseList.forEach(element => {
                this.exerciseList.push(new Exercise(element));
            });
        }
        if(data.exerciseListIDs)this.exerciseListIDs = data.exerciseListIDs;
        if(data.timer)this.timer = new Time(data.timer);
        if(data.icon)this.icon = data.icon;
        if(data.type)this.type = data.type;
        if(data.level)this.level = data.level;
    }

    getTotalExercise(): number{
        if(!this.exerciseList)return 0;
        return this.exerciseList.length;
    }

    getTotalTimeString():string{
        var totalTime = this.getTotalTime();
        if(totalTime == 0) return "00'00''";
        var minutes = Math.floor(totalTime/60);
        var second = totalTime - minutes * 60;
        return (minutes  > 9 ? "" : "0") + minutes+"'"+(second > 9 ? "" : "0") + second + "''";
    }

    getTotalTime() : number{
        var numberAction = this.getTotalExercise();
        if(numberAction == 0)return 0;
        var totalTime = this.timer.reps * ( (numberAction*this.timer.work) + (numberAction-1)*this.timer.rest) + (this.timer.reps - 1) * this.timer.break;
        return totalTime;
    }

    setTime(timer : Time){
        this.timer = timer;
    }
}

export class Time {
    /**Thời gian thực hiện 1 động tác */
    work: number;
    /**Thời gian nghỉ giữa các dong tac */
    rest: number;
    /**Số lần lặp lại của 1 động tác */
    reps: number;
    /**Thời gian nghỉ giữa các hiep*/
    break: number;
    /**Thoi gian delay khi bat dau hoac tam dung */
    delay: number;
    constructor(data?: any) {
        this.reset();
        if (data) this.parse(data);
    }

    reset() {
        this.work = 10;
        this.rest = 5;
        this.reps = 2;
        this.break = 3;
        this.delay = 5;
    }

    parse(data) {
        if(data.work)this.work = data.work;
        if(data.rest)this.rest = data.rest;
        if(data.reps)this.reps = data.reps;
        if(data.break)this.break = data.break;
        if(data.delay)this.delay = data.delay;
    }
    getTotalTime(): number{
        return this.work + this.break + this.rest;
    }
}