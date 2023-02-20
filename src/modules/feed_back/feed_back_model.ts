/** 零元购数据*/
///<reference path="../red_point/red_point_ctrl.ts"/>
namespace modules.feed_back {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import UpdateFeedback = Protocols.UpdateFeedback;
    import UpdateFeedbackFields = Protocols.UpdateFeedbackFields;
    import GetFeedbackListReply = Protocols.GetFeedbackListReply;
    import GetFeedbackListReplyFields = Protocols.GetFeedbackListReplyFields;
    import Feedback = Protocols.Feedback;
    import FeedbackFields = Protocols.FeedbackFields;
    import blendFields = Configuration.blendFields;
    export class FeedBackModel {
        private static _instance: FeedBackModel;
        public static get instance(): FeedBackModel {
            return this._instance = this._instance || new FeedBackModel();
        }
        private _maxInputChar: number;
        private _minInputChar: number;
        private _cishu: number;
        private _Maxcishu: number;//最大可发次数
        private _listDate: Array<Feedback>
        public _type: number;     //	type = 0,			/*反馈类型 1：游戏BUG，2：投诉反馈，3：游戏建议，4：其它意见*/
        private _desStr: string;
        constructor() {
            this._maxInputChar = modules.config.BlendCfg.instance.getCfgById(44001)[blendFields.intParam][1];
            this._minInputChar = modules.config.BlendCfg.instance.getCfgById(44001)[blendFields.intParam][0];
            this._Maxcishu = modules.config.BlendCfg.instance.getCfgById(44002)[blendFields.intParam][0];
            if (modules.config.BlendCfg.instance.getCfgById(44003)) {
                this._desStr = modules.config.BlendCfg.instance.getCfgById(44003)[blendFields.stringParam][0];
            }
            else {
                this._desStr = ``;
            }

            this._cishu = 10;
            this._type = 1;
            this._listDate = new Array<Feedback>();
        }
        public get desStr(): string {
            return this._desStr ? this._desStr : `我们会尽快答复您提交的问题,感谢您的反馈与支持!<br/>客服工作时间:周一至周日8:00-23:00`;
        }
        public get maxInputChar(): number {
            return this._maxInputChar ? this._maxInputChar : 50;
        }
        public get minInputChar(): number {
            return this._minInputChar ? this._minInputChar : 5;
        }
        public get cishu(): number {
            return this._cishu
        }
        public get listDate(): Array<Feedback> {
            return this._listDate
        }
        public getInfo(value: GetFeedbackListReply) {
            this._listDate = value[GetFeedbackListReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.FEED_BACK_UPDATE);
            this.setRP();
        }
        public updateInfo(value: UpdateFeedback) {
            let info = value[UpdateFeedbackFields.info];
            this._listDate.push(info);
            GlobalData.dispatcher.event(CommonEventType.FEED_BACK_UPDATE);
            this.setRP();
        }
        public ChangeFeedbackState() {
            let ids = new Array<string>();
            if (this._listDate.length > 0) {
                for (var index = 0; index < this._listDate.length; index++) {
                    let element = this._listDate[index];
                    if (element) {
                        let uuid = element[FeedbackFields.uuid];
                        let state = element[FeedbackFields.state];
                        if (state == 0) {///*0:未看，1已看*/            
                            ids.push(uuid);
                        }
                    }
                }
                FeedBackCtrl.instance.ChangeFeedbackState(ids);
            }

        }
        public getgRadeRP(): boolean {
            if (this._listDate) {
                for (var index = 0; index < this._listDate.length; index++) {
                    let element = this._listDate[index];
                    if (element) {
                        let stateNum = element[FeedbackFields.state];
                        if (stateNum == 0) {///*0:未看，1已看*/            
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        public setRP() {
            let bolll = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.feedBack);
            let isHave = this.getgRadeRP();
            RedPointCtrl.instance.setRPProperty("feedBackRP", ((isHave) && bolll));
        }
    }
}