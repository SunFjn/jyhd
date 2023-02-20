
namespace modules.announcement {
    import Item = Protocols.Item;

    export class AnnouncementAlert extends modules.commonAlert.CommonItemsAlert{
        private timeRemaining:number;
        private itemArr : Array<Item>;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._aniList
        }
        protected addListeners(): void {
            super.addListeners();
        }
        public onOpened(): void {
            super.onOpened();
            this.timeRemaining = 5;
            this.successfulActivation();
        }
        private successfulActivation(){
            this.setTipsText(true,"成功兑换激活码,获得以下奖励");
            this.setSureBtn(true,`确定(${this.timeRemaining})`);
            this.setList();
            this.itemArr = AnnouncementModel.instance.cdkeyReply;
            super.setOpenParam([this.itemArr,"激活码奖励",true]);
            Laya.timer.loop(1000,this,this.closeTime);
        }
        private closeTime(){
            this.timeRemaining--;
            this.setSureBtn(true,`确定(${this.timeRemaining})`);
            if (this.timeRemaining ==0 ){
                Laya.timer.clear(this,this.closeTime);
                super.close();
            }
        }
        private setList(){
            this._list.scrollDir = 1;
            this._list.hCount = 4;
            this._list.vCount = 3;
        }
        private setTipsText(show:boolean,text?:string){
            if(show){
                this.tipsText.visible = true;
                this.tipsText.text  = text;
            }else{
                this.tipsText.visible = false;
            }
        }
        private setSureBtn(show:boolean,text?:string){
            if(show){
                this.sureBtn.visible = true;
                this.sureBtn.label  = text;
            }else{
                this.sureBtn.visible = false;
            }
        }

    }
}