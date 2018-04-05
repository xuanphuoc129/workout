export class Untils{
    public static MONTHSTRING = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    public static DAYINMONTHS = [31,28,31,30,31,30,31,31,30,31,30,31];
    public static DAY_OF_WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    public static getMonthString(date : Date): string{
        return this.MONTHSTRING[date.getMonth()];
    }

    /**
     * getMonthNameEnglish
     */
    public static getMonthNameEnglish(month) : string{
        return this.MONTHSTRING[month - 1];
    }

    public static getDayInMonth(month, year): number{
        let monthNumber = month;
        let yearNumber = year;
        if(yearNumber % 4 == 0 && monthNumber == 2){
            return this.DAYINMONTHS[monthNumber -1] + 1;
        }else{
            return this.DAYINMONTHS[monthNumber -1];
        }
    }

    public static getDayOfWeek(date: Date) : string{
        if(date.getDay() == 0){
            return this.DAY_OF_WEEK[6];
        }else{
            return this.DAY_OF_WEEK[date.getDay()-1];
        }
    }

    public static convertDateString(year: number,month: number,date: number) : string{
        return year +"-"+ (month > 9 ? "" : "0") + month +"-"+ (date > 9 ? "" : "0") + date;
    }

    public static createDateString(year: number,month,date): string{
        return year + (month > 9 ? "" : "0") + month + (date > 9 ? "" : "0") + date;
    }
    
}