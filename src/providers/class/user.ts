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
            height: 1,
            weight: 1
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
        var mbi = this.getMBI();
        if(mbi< 18.5)return this.arraycomment[0];
        if(mbi < 24.9 && mbi >= 18.5)return this.arraycomment[1];
        if(mbi < 29.9 && mbi >=25)return this.arraycomment[2];
        if(mbi < 34.9 && mbi >=30)return this.arraycomment[3];
        if(mbi < 39.9 && mbi >=35)return this.arraycomment[4];
        if(mbi > 40)return this.arraycomment[5];
        return "";
    }

}