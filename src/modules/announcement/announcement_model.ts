/** 零元购数据*/

///<reference path="../red_point/red_point_ctrl.ts"/>
namespace modules.announcement {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetNoticeReply = Protocols.GetNoticeReply;
    import GetNoticeReplyFields = Protocols.GetNoticeReplyFields;
    import ExchangeCdkeyReply = Protocols.ExchangeCdkeyReply;
    import ExchangeCdkeyReplyFields = Protocols.ExchangeCdkeyReplyFields;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    export class AnnouncementModel {
        private static _instance: AnnouncementModel;
        public static get instance(): AnnouncementModel {
            return this._instance = this._instance || new AnnouncementModel();
        }
        private _maxInputChar: number;
        private _minInputChar: number;
        private _noticeStr: string;
        private _cdkeyReply:Array<Item>;
        constructor() {
            this._maxInputChar = 20;
            this._minInputChar = 6;
        }
        public get maxInputChar(): number {
            return this._maxInputChar ? this._maxInputChar : 50;
        }
        public get minInputChar(): number {
            return this._minInputChar ? this._minInputChar : 5;
        }
        public get noticeStr(): string {
            return this._noticeStr ? this._noticeStr : "";
        }
        public get cdkeyReply():Array<Item>{
            return this._cdkeyReply?this._cdkeyReply:[];
        }
        public getInfo(value: GetNoticeReply) {
            this._noticeStr = value[GetNoticeReplyFields.notice];
            GlobalData.dispatcher.event(CommonEventType.ANNOUNCEMENT_UPDATE);
            //this.setRP();
        }
        public getCdkeyReply(value:ExchangeCdkeyReply){
            this._cdkeyReply = value[ExchangeCdkeyReplyFields.items];
            GlobalData.dispatcher.event(CommonEventType.ANNOUNCEMENT_BACK);
        }
        public getgRadeRP(): boolean {
            // if (this._listDate) {
            //     for (var index = 0; index < this._listDate.length; index++) {
            //         let element = this._listDate[index];
            //         if (element) {
            //             let stateNum = element[FeedbackFields.state];
            //             if (stateNum == 0) {///*0:未看，1已看*/            
            //                 return true;
            //             }
            //         }
            //     }
            // }
            return false;
        }
        public setRP() {
            let bolll = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.announcement);
            let isHave = this.getgRadeRP();
            RedPointCtrl.instance.setRPProperty("announcementRP", ((isHave) && bolll));
        }
    }
}