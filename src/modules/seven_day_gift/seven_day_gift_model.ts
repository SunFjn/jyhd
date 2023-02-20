/** 七日礼数据*/


namespace modules.sevenDayGift {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import UpdateSevenDay = Protocols.UpdateSevenDay;
    import UpdateSevenDayFields = Protocols.UpdateSevenDayFields;
    import GiftState = Protocols.GiftState;
    import GiftStateFields = Protocols.GiftStateFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class SevenDayGiftModel {

        private static _instance: SevenDayGiftModel;
        public static get instance(): SevenDayGiftModel {
            return this._instance = this._instance || new SevenDayGiftModel();
        }

        // 七日礼信息
        private _sevenDayInfo: UpdateSevenDay;

        constructor() {
        }

        public get sevenDayInfo(): UpdateSevenDay {
            return this._sevenDayInfo;
        }

        public set sevenDayInfo(value: UpdateSevenDay) {
            this._sevenDayInfo = value;
            GlobalData.dispatcher.event(CommonEventType.SEVEN_DAY_INFO_UPDATA);

            this.checkRP();
        }

        private checkRP(): void {
            let flag: boolean = false;
            if(FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.sevenDay)){
                let day: number = this._sevenDayInfo[UpdateSevenDayFields.day];
                let arr: Array<GiftState> = this._sevenDayInfo[UpdateSevenDayFields.dayStates];
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    let stateInfo: GiftState = arr[i];
                    if (day >= stateInfo[GiftStateFields.day] && stateInfo[GiftStateFields.state] === 0) { //有没领的
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("sevenDayGiftRP", flag);
        }

        // 根据索引获取数据（半月礼服务器发的天数也是1-7，这里直接用索引了）
        public getDataByIndex(index: number): GiftState {
            let info: GiftState;
            if (this._sevenDayInfo) {
                let arr: Array<GiftState> = this._sevenDayInfo[UpdateSevenDayFields.dayStates];
                info = arr[index];
            }
            return info;
        }
    }
}