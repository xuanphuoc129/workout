import { Exercises } from "./exercises";

export class Diary{
    /**ngay thuc hien*/
    date: string;
    /**Id cua exercise tap trong ngay */
    exercises: Array<Exercises>;

    constructor(data ?: any){
        this.date = "";
        this.exercises = [];
        if(data)this.parse(data);
    }

    parse(data){
        if(data.date)this.date = data.date;
        if(data.exercises){
            data.exercises.forEach(element => {
                this.exercises.push(new Exercises(element));
            });
        }
    }

}