/** 半月礼数据*/


namespace modules.halfMonthGift {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import UpdateHalfMonthInfo = Protocols.UpdateHalfMonthInfo;
    import GiftState = Protocols.GiftState;
    import UpdateHalfMonthInfoFields = Protocols.UpdateHalfMonthInfoFields;
    import GiftStateFields = Protocols.GiftStateFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class HalfMonthGiftModel {

        private static _instance: HalfMonthGiftModel;
        public static get instance(): HalfMonthGiftModel {
            return this._instance = this._instance || new HalfMonthGiftModel();
        }

        // 半月礼信息
        private _halfMonthInfo: UpdateHalfMonthInfo;

        constructor() {
        }

        public get halfMonthInfo(): UpdateHalfMonthInfo {
            return this._halfMonthInfo;
        }

        public set halfMonthInfo(value: UpdateHalfMonthInfo) {
            this._halfMonthInfo = value;
            GlobalData.dispatcher.event(CommonEventType.HALF_MONTH_INFO_UPDATE);

            FuncOpenModel.instance.setActionOpen(ActionOpenId.halfMonth, value[UpdateHalfMonthInfoFields.openState]);

            this.checkRP();
        }

        private checkRP(): void {
            let flag: boolean = false;
            let day: number = this._halfMonthInfo[UpdateHalfMonthInfoFields.day];
            let arr: Array<GiftState> = this._halfMonthInfo[UpdateHalfMonthInfoFields.dayStates];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let stateInfo: GiftState = arr[i];
                if (day >= stateInfo[GiftStateFields.day] && stateInfo[GiftStateFields.state] === 0) { //有没领的
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("halfMonthGiftRP", flag);
        }

        // 根据索引获取数据（半月礼服务器发的天数也是1-7，这里直接用索引了）
        public getDataByIndex(index: number): GiftState {
            let info: GiftState;
            if (this._halfMonthInfo) {
                let arr: Array<GiftState> = this._halfMonthInfo[UpdateHalfMonthInfoFields.dayStates];
                info = arr[index];
            }
            return info;
        }
    }
}