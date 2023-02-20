/**组队副本上方面板 */
namespace modules.teamBattle {
    import TeamBattleTopViewUI = ui.TeamBattleTopViewUI;
    import Layer = ui.Layer;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class TeamBattleTopPanel extends TeamBattleTopViewUI {
        constructor() {
            super();
        }

        private _totalTime: number;
        private _noticeTime: number;
        private _skipTime: number;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.top = 256;
            this.closeByOthers = false;
            this.layer = Layer.MAIN_UI_LAYER;
        }

        protected onOpened(): void {
            super.onOpened();
            this._totalTime = SceneCfg.instance.getCfgById(2091)[sceneFields.limitTime];
            this._skipTime = BlendCfg.instance.getCfgById(10707)[blendFields.intParam][0];
            this._noticeTime = this._skipTime;
            this.totalTimeLoop();
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.TEAM_BATTLE_LEVEL_UPDATE, this, this.updataWaveShow);

            Laya.timer.loop(1000, this, this.totalTimeLoop);

        }

        protected removeListeners(): void {

            GlobalData.dispatcher.off(CommonEventType.TEAM_BATTLE_LEVEL_UPDATE, this, this.updataWaveShow);

            Laya.timer.clear(this, this.totalTimeLoop);
            Laya.timer.clear(this, this.noticeUpdate);

            super.removeListeners();
        }

        //更新波次
        private updataWaveShow(): void {

            this.levelShowNum.value = TeamBattleModel.Instance.currWave.toString();

            //波数居中
            let charNum: number = this.levelShowNum.value.length;
            let numMszWidth = 36 * (charNum) + this.levelShowNum.spaceX * charNum;

            let sumWidth: number = this.levelShow1.width + 5 + numMszWidth + 5 + this.levelShow2.width;
            let initX: number = (this.width - sumWidth) / 2;
            this.levelShow1.x = initX;
            this.levelShowNum.x = this.levelShow1.x + this.levelShow1.width + 5;
            this.levelShow2.x = this.levelShowNum.x + numMszWidth + 5;

            this.waveBox.visible = true;

            Laya.timer.once(2000, this, this.hiddenWave);

            if (TeamBattleModel.Instance.timeState) {  //显示跳转提示
                this.tipBox.visible = true;
                this._noticeTime = this._skipTime;
                Laya.timer.loop(1000, this, this.noticeUpdate);
                this.noticeUpdate();
            } else {
                this.tipBox.visible = false;
            }
        }

        private hiddenWave(): void {
            this.waveBox.visible = false;
        }

        //设置提示的显示
        private noticeUpdate(): void {

            if (this._noticeTime <= 0) {
                this.tipBox.visible = false;
                Laya.timer.clear(this, this.noticeUpdate);
                return;
            }

            if (TeamBattleModel.Instance.isMaxWave) {
                this.tipBox.visible = false;
                this.maxTipTxt.visible = true;
            } else {
                this.maxTipTxt.visible = false;

                this.noticeTimeShow.text = (this._noticeTime / 1000).toString();
                this.noticeLevelShow.text = (TeamBattleModel.Instance.skipWave + TeamBattleModel.Instance.currWave).toString();

                let sumWidth: number = this.noticeTimeShow.width + 5 + this.noticeShow.width + 5 + this.noticeLevelShow.width + 5 + this.guanTxt.width;
                let initX: number = (this.width - sumWidth) / 2;
                this.noticeTimeShow.x = initX;
                this.noticeShow.x = this.noticeTimeShow.x + this.noticeTimeShow.width + 5;
                this.noticeLevelShow.x = this.noticeShow.x + this.noticeShow.width + 5;
                this.guanTxt.x = this.noticeLevelShow.x + this.noticeLevelShow.width + 5;

                this._noticeTime -= 1000;
            }
        }

        //总时间倒计时
        private totalTimeLoop(): void {
            if (this._totalTime === 0) {
                Laya.timer.clear(this, this.totalTimeLoop);
                this.close();
                return;
            }
            this.countDown.text = modules.common.CommonUtil.msToMMSS(this._totalTime);
            this._totalTime -= 1000;
        }
    }
}
