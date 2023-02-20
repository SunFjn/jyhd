/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.zhulu {
    import Event = Laya.Event;
    import Layer = ui.Layer;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import TeamBattleCrossTopViewUI = ui.TeamBattleCrossTopViewUI;
    import GetTeamBattleCopyTimeReply = Protocols.GetTeamBattleCopyTimeReply;
    import GetTeamBattleCopyTimeReplyFields = Protocols.GetTeamBattleCopyTimeReplyFields;
    import UpdateTeamBattleInfo = Protocols.UpdateTeamBattleInfo;
    import UpdateTeamBattleInfoFields = Protocols.UpdateTeamBattleInfoFields;


    import copyTeamBattleInfo = Protocols.copyTeamBattleInfo;
    import copyTeamBattleInfoFields = Protocols.copyTeamBattleInfoFields;



    export class TeamBattleCrossTopView extends TeamBattleCrossTopViewUI {
        constructor() {
            super();
        }
        private _time: number = 0;
        private _rebornTime: number = 0;
        private _teamNameArr: Array<Laya.Text>;
        private _scoreArr: Array<Laya.Text>;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.top = 120;
            this.closeByOthers = false;
            this.layer = Layer.MAIN_UI_LAYER;
            this._teamNameArr = [this.teamNameTxt1, this.teamNameTxt2, this.teamNameTxt3]
            this._scoreArr = [this.scoreTxt1, this.scoreTxt2, this.scoreTxt3]

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_COPY_DATA, this, this.updateTime);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_SCORE_UPDATA_DATA, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_REBORN_UPDATA, this, this.updateReborn);


            Laya.timer.loop(1000, this, this.loopHandler);


        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            for (let index = 0; index < this._teamNameArr.length; index++) {
                this._teamNameArr[index].text = '轮空'
                this._scoreArr[index].text = '积分0/0'
            }
            this.updateTime();
            this.updateUI();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        private updateReborn(t: number) {
            this._rebornTime = t;
            ZhuLuModel.instance.ghost = true
        }



        private updateTime(): void {
            let info: GetTeamBattleCopyTimeReply = ZhuLuModel.instance.battleInfo;
            if (!info) return;
            this._time = info[GetTeamBattleCopyTimeReplyFields.time];
            this.loopHandler();
        }

        private loopHandler(): void {
            this.tipImg.visible = this._rebornTime > 0
            if (this._rebornTime > 0) {
                this.tipsTimeTxt.text = CommonUtil.msToMMSS(this._rebornTime);
                this._rebornTime -= 1000;
            } else {
                ZhuLuModel.instance.ghost = false
            }
            if (this._time <= 0) {
                return;
            } else {
                this.countDown.text = CommonUtil.msToMMSS(this._time);
                this._time -= 1000;
            }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        public updateUI() {
            if (!ZhuLuModel.instance._scoreInfo) return;
            let list = ZhuLuModel.instance.scoreInfo[UpdateTeamBattleInfoFields.list]
            for (const e of list) {
                let index = e[copyTeamBattleInfoFields.index]
                this._teamNameArr[index].text = e[copyTeamBattleInfoFields.name]
                this._scoreArr[index].text = `积分${e[copyTeamBattleInfoFields.score]}/${e[copyTeamBattleInfoFields.maxScore]}`
            }


        }

    }
}
