/**组队副本奖励面板 */


namespace modules.teamBattle {
    import TeamBattleAwardViewUI = ui.TeamBattleAwardViewUI;
    import Event = Laya.Event;
    import BagItem = modules.bag.BagItem;
    import Layer = ui.Layer;
    import scene_copy_team = Configuration.scene_copy_team;
    import SceneCopyTeamCfg = modules.config.SceneCopyTeamCfg;
    import Items = Configuration.Items;
    import scene_copy_teamFields = Configuration.scene_copy_teamFields;
    import ItemsFields = Configuration.ItemsFields;
    import BaseItem = modules.bag.BaseItem;

    export class TeamBattleAwardPanel extends TeamBattleAwardViewUI {
        constructor() {
            super();
        }

        private _showNum: number;
        private _showAward: Array<BaseItem>;
        private _showY: number;
        private _starX: number;
        private _interX: number;
        private _isShow: boolean;
        private _awardCount: number;

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 470;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this._showNum = 3;
            this._starX = -90;
            this._showY = 7;
            this._interX = 103;
            this._showAward = new Array<BagItem>();
            this._awardCount = 0;
            this.initAward();
        }

        private initAward(): void {
            for (let i = 0; i < this._showNum; i++) {
                this._showAward[i] = new BagItem();
                this.addChild(this._showAward[i]);
                let x = this._starX - i * this._interX;
                this._showAward[i].pos(x, this._showY);
                this._showAward[i].visible = false;
                this._showAward[i].needTip = true;
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this.bgImg.visible = this._isShow = false;
            this.awardUpdate();
            this.levelName.text = `第1波`;
            this.updataShowAward();
        }

        protected addListeners(): void {
            super.addListeners();
            this.awardBoxBtn.on(Event.CLICK, this, this.isShowAward);
            GlobalData.dispatcher.on(CommonEventType.TEAM_BATTLE_LEVEL_UPDATE, this, this.awardUpdate);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.awardBoxBtn.off(Event.CLICK, this, this.isShowAward);
            GlobalData.dispatcher.off(CommonEventType.TEAM_BATTLE_LEVEL_UPDATE, this, this.awardUpdate);
        }

        //显示获得的奖励
        private awardUpdate(): void {
            let cfg: scene_copy_team = SceneCopyTeamCfg.instance.getCfgByWare(TeamBattleModel.Instance.currWave);
            if (!cfg) return;
            let awardArr: Array<Items> = cfg[scene_copy_teamFields.award];
            this._awardCount = awardArr.length;
            for (let i: int = 0, len: int = this._showAward.length; i < len; i++) {
                if (awardArr.length > i) {  //显示的
                    this._showAward[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                }
            }
            this.levelName.text = `第${TeamBattleModel.Instance.currWave}波`;
            this.updataShowAward();
        }

        //控制显示
        private isShowAward(): void {
            this._isShow = !this._isShow;
            this.bgImg.visible = this._isShow;

            this.updataShowAward();
        }

        private updataShowAward(): void {

            for (let i = 0; i < this._showNum; i++) {
                if (this._awardCount > i) {
                    this._showAward[i].visible = this._isShow;
                } else {
                    this._showAward[i].visible = false;
                }
            }
        }
    }
}