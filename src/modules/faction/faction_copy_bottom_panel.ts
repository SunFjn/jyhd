/////<reference path="../$.ts"/>
/** 仙盟副本底部面板 */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import GlobalData = modules.common.GlobalData;
    import FactionCopyBottomViewUI = ui.FactionCopyBottomViewUI;
    import GetFactionCopyInfoReply = Protocols.GetFactionCopyInfoReply;
    import GetFactionCopyInfoReplyFields = Protocols.GetFactionCopyInfoReplyFields;

    export class FactionCopyBottomPanel extends FactionCopyBottomViewUI {

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

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_HURT_INFO, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_COPY_INFO, this, this.updateTime);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);

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
            let value: number = FactionModel.instance.hurt;
            if (value == null) return;
            let str: string = CommonUtil.bigNumToString(value);
            this.txt.text = `本日累计挑战伤害:${str}`;
        }

        private updateTime(): void {
            let info: GetFactionCopyInfoReply = FactionModel.instance.copyInfo;
            if (!info) return;
            this._time = info[GetFactionCopyInfoReplyFields.time];
            this.loopHandler();
        }

        private btnHandler(): void {
            let id: number = config.BlendCfg.instance.getCfgById(36035)[Configuration.blendFields.intParam][0];
            let count: number = bag.BagModel.instance.getItemCountById(id);
            if (count > 0) {
                WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, [[id, count, 0, null], true]);
            } else {
                bag.BagUtil.openLackPropAlert(id, 1);
            }
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