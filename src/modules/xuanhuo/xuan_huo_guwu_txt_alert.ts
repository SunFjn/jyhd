/** 通用文本弹框*/


namespace modules.xuanhuo {
    import Event = Laya.Event;
    import XuanhuoGuwuAlertUI = ui.XuanhuoGuwuAlertUI;
    import Handler = Laya.Handler;
    import LayaEvent = modules.common.LayaEvent;
    import NoMoreNoticeId = ui.NoMoreNoticeId;
    import GetXuanhuoCopyDataReply = Protocols.GetXuanhuoCopyDataReply;
    import GetXuanhuoCopyDataReplyFields = Protocols.GetXuanhuoCopyDataReply;
    import GetXuanhuoCopyReplyFields = Protocols.GetXuanhuoCopyReplyFields;
    
    export class XuanhuoGWTips extends XuanhuoGuwuAlertUI {

        private _okHandler: Handler;
        private _cancelHandler: Handler;

        private _minHWithBtn: number;
        private _minHWithoutBtn: number;
        private _hasBtn: boolean;

        private _noticeId: NoMoreNoticeId;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, LayaEvent.CLICK, this, this.okHandler);
        }

        private okHandler(): void {
            this.close();


            let myPropCount: number = common.CommonUtil.getPropCountById(this.itemID);
            console.log(this.itemID, myPropCount, this.needItemCount)
            if (myPropCount >= this.needItemCount) {
                XuanHuoCtrl.instance.sendAllInspire();
            } else {
                // CommonUtil.goldNotEnoughAlert();
                WindowManager.instance.openDialog(WindowEnum.LACK_PROP_ALERT, [94150001, 1, false]);
            }
        }

        private itemID: number = 0
        private needItemCount: number = 0
        public setOpenParam(value): void {
            super.setOpenParam(value);
            console.log(value)
            this.NumTXT.text = value.content;
            this.descTXT.text = value.content1;
            this.TimeTxT.text = value.content2;
            this.needItemCount = value.needItemCount;
            this.itemID = value.itemID;

            // this.contentTxt.innerHTML = value[0];
            this.updateHandler();
        }

        private _info: GetXuanhuoCopyDataReply;

        private updateHandler(): void {
            let data: GetXuanhuoCopyDataReply = XuanHuoModel.instance.copyData;
            if (!data) return;
            // console.log("datadata", data, GlobalData.serverTime)
            this._info = data
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        private loopHandler(): void {
            if (this._info[GetXuanhuoCopyReplyFields.reEnterTime] < GlobalData.serverTime) {
                this.btn.visible = true
                this.tips1TXT.visible = false;
                this.tips2TXT.visible = false;
                this.Ttxt.visible = false;
                Laya.timer.clear(this, this.loopHandler);
            } else {
                this.btn.visible = false
                this.tips1TXT.visible = true;
                this.tips2TXT.visible = true;
                this.Ttxt.visible = true;
                this.Ttxt.text = `${Math.ceil((this._info[GetXuanhuoCopyReplyFields.reEnterTime] - GlobalData.serverTime) * 0.001)}`;
            }
        }
    }
}