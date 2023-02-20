namespace modules.sprint_rank {
    import sprint_rank = Configuration.sprint_rank;
    import sprint_rankFields = Configuration.sprint_rankFields;
    import GetWayCfg = modules.config.GetWayCfg;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import discountGiftModel = modules.discountGift.discountGiftModel;
    import SprintRankTaskNode = Protocols.SprintRankTaskNode;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;

    export class SprintItem extends ui.SprintItemUI {
        // private static _instance: SprintItem;
        // public static get instance(): SprintItem {
        //     return this._instance = this._instance || new SprintItem();
        // }
        private _getWayId: number;//途径ID
        private _: number;//途径ID
        private _rankCfg: sprint_rank;
        private _eff: CustomClip;
        private _rp: Laya.Image;
        private _taskList: Array<SprintRankTaskNode>;
        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            this._sourceBtn.on(Event.CLICK, this, this.openSourcePlane1);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this._sourceBtn.off(Event.CLICK, this, this.openSourcePlane1);
        }

        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }

        public setData(value: any): void {
            super.setData(value);
            if (value) {
                this._getWayId = value.id;
                let getWayCfg: Configuration.get_way;
                getWayCfg = GetWayCfg.instance.getCfgById(this._getWayId);
                if (getWayCfg) {
                    this._sourceBtn.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
                    this._sourceBtnBg.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
                    this._desTxt.text = getWayCfg[Configuration.get_wayFields.desc];
                }
                this._rankCfg = SprintRankCfg.instance.getCfgsByGrade(value.type, 0);
                let getWayId = this._rankCfg[sprint_rankFields.getWayId];
                if(this._getWayId == getWayId[1]) {
                    let curCount = discountGiftModel.instance.curCount;
                    let maxCount = discountGiftModel.instance.maxCount;
                    if (maxCount - curCount > 0) {
                        this._taskList = SprintRankTaskModel.instance.taskList;
                        if(this._taskList && this._taskList[value.type]) {
                            let endFlag = this._taskList[value.type][SprintRankTaskNodeFields.endFlag];
                            if(endFlag == 0) {
                                this._eff.play();
                                this._eff.visible = true;                      
                                if(SprintRankTaskModel.instance._isFristOpen && !this._rp) {                                   
                                    this.setRP();
                                }
                            }
                        }
                    }else{
                        this._eff.visible = false;
                    }
                }
            }
        }

        private openSourcePlane1(): void {
            this.getOpenPlaneId();
        }

        public getOpenPlaneId(): void {
            let getWayCfg: Configuration.get_way = GetWayCfg.instance.getCfgById(this._getWayId);
            let openPlane: Array<number> = getWayCfg[Configuration.get_wayFields.params];
            let idNum = openPlane[0];
            //判断是不是没有面板的功能
            // let windowInfo: ui.WindowInfo = GlobalData.getWindowConfigByFuncId(idNum);
            // if (!windowInfo) {
            //     if (idNum == ActionOpenId.swimming
            //         || idNum == ActionOpenId.riches
            //         || idNum == ActionOpenId.xianFuEnter) {
            //         idNum = ActionOpenId.actionList
            //     }
            // }
            //取消红点
            let getWayId = this._rankCfg[sprint_rankFields.getWayId];
            if(this._getWayId == getWayId[1] && this._rp) {
                SprintRankTaskModel.instance._isFristOpen = false;
                this._rp.destroy();
            }
            WindowManager.instance.openByActionId(idNum);
            // this.close();
        }

        private setRP(){
            this._rp = new Laya.Image();
            this.addChild(this._rp);
            this._rp.skin = "common/image_common_xhd.png";
            this._rp.x = this._sourceBtn.x + 73;
        }

        private createEffect() {
            this._eff = new CustomClip();
            this._sourceBtn.addChild(this._eff);
            this._eff.frameUrls = ["left_top/eff_0.png", "left_top/eff_2.png", "left_top/eff_4.png", "left_top/eff_6.png",
                "left_top/eff_8.png", "left_top/eff_10.png", "left_top/eff_12.png", "left_top/eff_14.png"];
            this._eff.durationFrame = 7;
            this._eff.play();
            this._eff.pos(1,1,true);
            this._eff.scale(1.2,1.2);
            this._eff.loop = true;
            this._eff.visible = false;
        }
    }
}