/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.zhulu {
    import Event = Laya.Event;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import TeamPrepareCopyBottomViewUI = ui.TeamPrepareCopyBottomViewUI;
    import GetTeamPrepareCopyInfoReply = Protocols.GetTeamPrepareCopyInfoReply;
    import GetTeamPrepareCopyInfoReplyFields = Protocols.GetTeamPrepareCopyInfoReplyFields;

    export class TeamPrepareCopyBottomPanel extends TeamPrepareCopyBottomViewUI {
        constructor() {
            super();
        }
        private _time: number;
        protected initialize(): void {
            super.initialize();
            this.right = 7;
            this.bottom = 465;
            this._time = 0;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamPrepare_COPY_DATA, this, this.updateTime);
            this.addAutoListener(this.warBtn, Laya.Event.CLICK, this, this.openWar);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateTime();
            
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        private updateTime(): void {
            let info: GetTeamPrepareCopyInfoReply = ZhuLuModel.instance.prepareInfo;
            if (!info) return;
            this._time = info[GetTeamPrepareCopyInfoReplyFields.time];
            this.loopHandler();
        }

        private loopHandler(): void {
            if (this._time <= 0) {
                return;
            } else {
                this.timeText.text = CommonUtil.msToMMSS(this._time);
                this._time -= 1000;
            }
        }

        private openWar() {
            WindowManager.instance.open(WindowEnum.ZHULU_PANEL, { type: 'open' })
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}