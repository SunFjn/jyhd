
///<reference path="../config/prevent_fool_cfg.ts"/>
namespace modules.prevent_fool_question {
    import PreventFoolCfg = modules.config.PreventFoolCfg;
    import prevent_fool = Configuration.prevent_fool;
    import preventFoolFields = Configuration.prevent_foolFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetPreventFoolReplyFields = Protocols.GetPreventFoolReplyFields;
    import GetPreventFoolReply = Protocols.GetPreventFoolReply;
    import AnswerPreventFoolReply = Protocols.AnswerPreventFoolReply;
    export class PreventFoolModel {
        private static _instance: PreventFoolModel;
        public static get instance(): PreventFoolModel {
            return this._instance = this._instance || new PreventFoolModel();
        }

        public preventFoolReply: GetPreventFoolReply;
        public answerReply: AnswerPreventFoolReply;

        public getPreventFoolReply(tuple: GetPreventFoolReply): void {
            // console.log(`诈骗id --->${tuple[GetPreventFoolReplyFields.id]}`);
            this.preventFoolReply = tuple;
            //判断防骗是否完成答卷，是移除
            if (this.preventFoolReply[preventFoolFields.id] > PreventFoolCfg.instance.maxLen) {
                FuncOpenModel.instance.setActionOpen(ActionOpenId.preventFool, ActionOpenState.close);
            }
            GlobalData.dispatcher.event(CommonEventType.PREVENTFOOL_UPDATE);
            this.checkRP();
        }
        public getAnswerReply(tuple: Protocols.AnswerPreventFoolReply): void {
            this.answerReply = tuple;

            GlobalData.dispatcher.event(CommonEventType.PREVENTFOOL_ANSWER_UPDATE);
        }

        public get id(): int {
            if (!this.preventFoolReply) return -1;
            return this.preventFoolReply[GetPreventFoolReplyFields.id];
        }

        private checkRP(): void {
            let flag: boolean = true;
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.preventFool)) {
                if (this.preventFoolReply[preventFoolFields.id] <= 10 && this.preventFoolReply) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            RedPointCtrl.instance.setRPProperty("preventFoolRP", flag);
        }

        //完成全部答题或不存在
        public completeQuestion(): boolean {
            if (this.preventFoolReply[preventFoolFields.id] > PreventFoolCfg.instance.maxLen || !this.preventFoolReply) {
                return true;
            }
            return false;
        }
    }
}