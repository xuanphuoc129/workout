export class Users{
    /**Tên hiển thị facebook */
    facebook: string;
    /**Tên hiển thị google */
    google: string;
    /**1 vn 2 english */
    language: number;
    /**notificaion */
    notification: {
        vibration: boolean;
        alarm : boolean;
        sound: boolean;
    };
    /**physic */
    physic: {
        height: number;
        weight: number;
    }
    arraycommentvn : Array<string> = ["Gầy","Bình thường","Béo","Béo cấp độ 1","Béo cấp độ 2","Béo cấp độ 3"];
    arraycommentes : Array<string> = ["Thin","Normal","Fat","Fat level 1","Fat level 2","Fat level 3"];
    arraycomment : Array<string> ;
    constructor(){
        this.facebook = "Not connected";
        this.google = "Not connected";
        this.language = 2;
        this.notification = {
            vibration : true,
            alarm: true,
            sound: true
        };
        this.physic = {
            height: 170,
            weight: 60
        };
        this.arraycomment = this.arraycommentes;
        // this.updateUser();
    }

    parse(data){
        if(data.facebook)this.facebook = data.facebook;
        if(data.google)this.google = data.google;
        if(data.language)this.language = data.language;
        if(data.notificaion)this.notification = data.notificaion;
        if(data.physic)this.physic = data.physic;
        this.updateUser();
    }

    updateUser(){
        if(this.language == 1){
            this.arraycomment = this.arraycommentvn;
            if(this.facebook == "Not connected")this.facebook = "Chưa kết nối";
            if(this.google == "Not connected")this.google = "Chưa kết nối";
        }else{
            if(this.facebook == "Chưa kết nối")this.facebook = "Not connected";
            if(this.google == "Chưa kết nối")this.google = "Not connected";
            this.arraycomment = this.arraycommentes;
        }
    }

    getMBI(): number{
        return parseFloat((this.physic.weight * 10000 / (this.physic.height * this.physic.height)).toFixed(2));
    }

    getComment(): string{
        var index = this.getPositionMBI();
        return this.arraycomment[index];
    }

    mbi_rray: Array<number> = [18.5,24.9,29.9,34.9,39.9];
    mbi_string: Array<string> = ["0 - 18.5", "18.5 - 24.9", "25 - 29.9", "30 - 34.9", "35 - 39.9" , "40 - 99"];
    getPositionMBI() : number{
        var index  = -1;
        var mbi = this.getMBI();
        for(let i = 0; i< this.mbi_rray.length; i++){
            if(mbi < this.mbi_rray[i]){
                index = i;
                break;
            }
        }
        if(index > -1){
            return index;
        }else{
            return 5;
        }
    }

    getBaseOnMBI(): number{
        return this.mbi_rray[this.getPositionMBI()]+ 0.1;
    }

    getMBIString() : string{
        var index = this.getPositionMBI();
        return this.mbi_string[index];
    }

    getKGUP(): number{
        var index = this.getPositionMBI();
        if(index == 5){
            return 9999;
        }
        var mbiup = this.mbi_rray[index] + 0.1;
        var weightup = parseFloat( ((this.physic.height * this.physic.height) * mbiup / 10000).toFixed(2));
        return weightup;
    }
}