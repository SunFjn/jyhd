/////<reference path="../$.ts"/>
/** 首领战副本底部面板 */
namespace modules.zhulu {
    import CommonUtil = modules.common.CommonUtil;
    import GlobalData = modules.common.GlobalData;
    import TeamChiefCopyBottomViewUI = ui.TeamChiefCopyBottomViewUI;
    import GetTeamChiefCopyInfoReply = Protocols.GetTeamChiefCopyInfoReply;
    import GetTeamChiefCopyInfoReplyFields = Protocols.GetTeamChiefCopyInfoReplyFields;

    export class TeamChiefCopyBottomPanel extends TeamChiefCopyBottomViewUI {

        private _time: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.bottom = 300;

            this._time = 0;
            this.closeByOthers = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamChief_HURT_INFO, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamChief_COPY_DATA, this, this.updateTime);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {

            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
            this.updateTime();
        }

        private updateView(): void {
            let value: number = ZhuLuModel.instance.hurt;
            if (value == null) return;
            let str: string = CommonUtil.bigNumToString(value);
            this.txt.text = `累计伤害:${str}`;
        }

        private updateTime(): void {
            let info: GetTeamChiefCopyInfoReply = ZhuLuModel.instance.copyInfo;
            if (!info) return;
            this._time = info[GetTeamChiefCopyInfoReplyFields.time];
            this.loopHandler();
        }

        private loopHandler(): void {
            if (this._time <= 0) {
                return;
            } else {
                this.timeTxt.text = CommonUtil.msToMMSS(this._time);
                this._time -= 1000;
            }
        }
    }
}