import { Time, Exercises } from "./exercises";

export class WorkOut extends Time {
    /**So hien thi khi dem */
    timing: number;
    /**So hiep da hoan thanh */
    repsDone: number;
    /**So dong tac da hoan thanh */
    setDone: number;
    /**Thoi gian da troi qua*/
    time_now: number;
    /** */
    timer: any;
    /**Số động tác*/
    set: number;
    /**Trang thái đang đếm hay không */
    isRunning: boolean;
    /**Funtion được gọi trở lại ở page workout */
    callback: any;
    /**Kiểu đồng hồ đang đếm: -1 trạng thái sẵn sàng chạy bộ delay 0 là workout 1 là break &&  2 rest */
    type: number;
    /**Tên bài tập */
    text: string;
    /**bài tập đang được chạy */
    exercise: Exercises;
    /**stick man của bài tập */
    icons: Array<string> = [];
    /*time được lưu lại khi  ở trạng thái pause*/
    saveTime: number;
    /**trạn thái đếm được lưu lại */
    saveType: number;
    /**Text đang được lưu lại */
    saveText: string;
    constructor(data?: any) {
        super();
        this.timing = 0;
        this.repsDone = 0;
        this.setDone = 0;
        this.time_now = 0;
        this.set = 0;
        this.type = 0;
        this.isRunning = false;
        this.saveType = 0;
        this.exercise = new Exercises();
        this.text = "Workout";
        this.icons = [];
        if (data) this.parse(data);
    }

    setExercise(exercise: Exercises) {
        this.exercise = exercise;
        if (this.exercise.exerciseList.length > 0 && this.exercise.exerciseList[0].stickman.length > 0) this.icons = this.exercise.exerciseList[0].stickman;
        if (this.exercise.exerciseList.length > 0) this.text = this.exercise.exerciseList[this.setDone].name;
    }
    getTimeNowString(): string {
        var minutes = Math.floor(this.time_now / 60);
        var second = this.time_now - minutes * 60;
        return (minutes > 9 ? "" : "0") + minutes + "'" + (second > 9 ? "" : "0") + second + "''";
    }

    runBreak() {
        this.callback(2);
        this.setDone = 0;
        this.setTiming(this.break);
        this.type = 1;
        this.text = "Break";
        this.startCountTime();
    }

    runRest() {
        this.callback(2);
        this.setTiming(this.rest);
        this.type = 2;
        this.text = "Rest";
        this.startCountTime();
    }

    runWork() {
        this.callback(-1);
        this.setTiming(this.work);
        this.type = 0;
        this.text = this.exercise.exerciseList[this.setDone].name;
        this.startCountTime();
    }

    runDelay() {
        this.saveTime = this.timing;
        this.saveType = this.type;
        this.saveText = this.text;
        this.setTiming(this.delay);
        this.type = -1;
        this.text = "Ready To Go";
        this.startCountTime();
    }
    isFirst: boolean = true;
    startCountTime() {
        this.isRunning = true;
        this.timer = setInterval(() => {
            if (this.timing == 0) {
                this.stopCountTime();
                if (this.type == -1) {
                    this.callback(-1);
                    this.setTiming(this.saveTime);
                    this.text = this.saveText;
                    this.type = this.saveType;
                    this.startCountTime();
                    return;
                }
                if (this.setDone < this.set && (this.type == 0 || this.type == -1)) {
                    this.setDone++;
                    if (this.setDone == this.set) {
                        if (this.repsDone < this.reps) {
                            this.repsDone++;
                            if (this.repsDone == this.reps) {
                                //Kết thúc bài đếm
                                if (this.callback) this.callback("done");this.callback =null;
                                return;
                            }
                            //Chuyển trạng thái break
                            this.runBreak();
                            return;
                        }
                    }
                    // kết thúc 1 động tác và chuyển trạng thái nghỉ
                    if (this.exercise.exerciseList[this.setDone].stickman.length > 0) this.icons = this.exercise.exerciseList[this.setDone].stickman;
                    this.runRest();
                    return;
                }
                // Chạy bộ đếm cho động tác hiện tại
                if (this.type > 0 || this.type == -1) {
                    this.runWork();
                    return;
                }
            }
            this.timing--;
            this.callback(1);
            if (this.type > -1) this.time_now++;
        }, 1000);
    }

    stopCountTime() {
        this.isRunning = false;
        if (this.timer) clearInterval(this.timer);
    }

    setTiming(time: number) {
        this.timing = time;
    }
}