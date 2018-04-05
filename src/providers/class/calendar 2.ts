import { Diary } from "./diary";
import { Untils } from "../untils";
import { Exercises } from "./exercises";

export class Day{
    /**id cua ngay dang namthangngay */
    id: string;
    /**Ngày trong tháng */
    dayNumber : number;
    /**Danh sách các bài tập đã hoàn thành */
    diary : Diary;
    /**Có tập hay không */
    isWorkout : boolean;

    constructor(){
        this.id = "";
        this.dayNumber = 0;
        this.diary = new Diary();
        this.isWorkout = false;
    }

    parse(data){
        if(data.id)this.id = data.id;
        if(data.dayNumber) this.dayNumber = data.dayNumber;
        if(data.diary) this.diary = data.diary;
        if(data.isWorkout) this.isWorkout = data.isWorkout;
        if(this.diary.exercises.length > 0)this.isWorkout = true;
    }
}

export class Calendar{
    /**Tháng trong năm */
    month: number;
    /**Tên năm */
    year: number;
    /**Danh sách ngày trong tháng */
    days: Array<Day>;

    constructor(month ?: number, year ?:number){
        this.month = 0;
        this.year = 0;
        this.days = [];
        for (let index = 0; index < 42; index++) {
            this.days.push(null);
        }
        if(month && year)this.getDayInMonth(month,year);
    }

    getDayInMonth(month: number, year: number){
        if(year == 0 || month == 0)return;
        this.month = month;
        this.year = year;
        let startDate = new Date(year + "-" + (month > 9 ? "" : "0") + month + "-" + "01");
        
        let index = startDate.getDay() - 1;
        if(index == -1){
            index = 6;
        }
        let maxDate = Untils.getDayInMonth(month,year);
        for(let i = 1; i <= maxDate; i++){
            let newDay = new Day();
            newDay.dayNumber = i;
            newDay.id = year + "" + (month > 9 ? "" : "0") + month + "" + (i > 9 ? "" : "0") + i;
            this.days[index] = newDay;
            index++;
        }

        if(this.days[35]==null){
            this.days.splice(35,41);
        }

    }
}