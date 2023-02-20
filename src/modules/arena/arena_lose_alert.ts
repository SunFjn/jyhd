/** 竞技场失败结算弹框 */


namespace modules.arena {
    import ArenaLoseAlertUI = ui.ArenaLoseAlertUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import LayaEvent = modules.common.LayaEvent;
    import ArenaJudgeAward = Protocols.ArenaJudgeAward;
    import ArenaJudgeAwardFields = Protocols.ArenaJudgeAwardFields;
    import Items = Configuration.Items;
    import arenaFields = Configuration.arenaFields;
    import ItemsFields = Configuration.ItemsFields;
    import FailureStrongerCfg = modules.config.FailureStrongerCfg;
    import failure_stronger = Configuration.failure_stronger;
    import failure_strongerFields = Configuration.failure_strongerFields;
    import Image = Laya.Image;
    import get_way = Configuration.get_way;
    import GetWayCfg = modules.config.GetWayCfg;
    import get_wayFields = Configuration.get_wayFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import DungeonModel = modules.dungeon.DungeonModel;
    import tips = Configuration.tips;
    import TipCfg = modules.config.TipCfg;
    import tipsFields = Configuration.tipsFields;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;

    export class ArenaLoseAlert extends ArenaLoseAlertUI {
        private _duration: number;
        private _wayBgs: Array<Image>;
        private _wayIcons: Array<Image>;
        private _wayNames: Array<Laya.Text>;
        private _speCfg: tips;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this._wayBgs = [this.wayBg1, this.wayBg2, this.wayBg3, this.wayBg4];
            this._wayIcons = [this.wayIcon1, this.wayIcon2, this.wayIcon3, this.wayIcon4];
            this._wayNames = [this.wayName1, this.wayName2, this.wayName3, this.wayName4];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            this.addAutoListener(this.wayBg1, LayaEvent.CLICK, this, this.wayClickHandler, [0]);
            this.addAutoListener(this.wayBg2, LayaEvent.CLICK, this, this.wayClickHandler, [1]);
            this.addAutoListener(this.wayBg3, LayaEvent.CLICK, this, this.wayClickHandler, [2]);
            this.addAutoListener(this.wayBg4, LayaEvent.CLICK, this, this.wayClickHandler, [3]);
            this.addAutoListener(this.gotoBtn, LayaEvent.CLICK, this, this.gotoHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TIPBIANQIANG_UPDATE, this, this.updateSpe);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        onOpened(): void {
            super.onOpened();
            this.updateJudge();
            this.updateStrongWay();

            DungeonCtrl.instance.getTipsPriorInfo();
        }

        private updateJudge(): void {
            let judge: ArenaJudgeAward = ArenaModel.instance.arenaJudgeAward;
            if (!judge) return;
            let curRank: number = judge[ArenaJudgeAwardFields.curRank];
            this.curRankTxt.text = `${curRank}`;
            let awards: Array<Items> = ArenaCfg.instance.getCfgByRank(curRank)[arenaFields.failItems];
            this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [awards[1][ItemsFields.itemId], awards[1][ItemsFields.count], 0, null];
            if(judge[ArenaJudgeAwardFields.gold]){
                this.item3.visible = true;
                this.item3.dataSource = [90140001, judge[ArenaJudgeAwardFields.gold], 0, null];
                this.item1.x = 161;
                this.item2.x = 307;
            }
            else{
                this.item3.visible = false;
                this.item1.x = 237;
                this.item2.x = 396;
            }
            //this.item2.dataSource = [awards[2][ItemsFields.itemId], awards[2][ItemsFields.count], 0, null];

        }

        private updateStrongWay(): void {
            let cfg: failure_stronger = FailureStrongerCfg.instance.getCfgByLevel(PlayerModel.instance.level);
            let arr: Array<number> = cfg[failure_strongerFields.strongSourceId];
            for (let i: int = 0, len: int = this._wayBgs.length; i < len; i++) {
                let wayCfg: get_way = GetWayCfg.instance.getCfgById(arr[i]);
                if (wayCfg) {
                    this._wayBgs[i].skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
                    this._wayIcons[i].skin = `assets/icon/ui/get_way/${wayCfg[get_wayFields.icon]}.png`;
                    this._wayNames[i].text = wayCfg[get_wayFields.desc];
                }
            }
            let speId: number = cfg[failure_strongerFields.specialStrongId];
            if (speId) {
                this.speImg.skin = `assets/icon/ui/get_way/${GetWayCfg.instance.getCfgById(speId)[get_wayFields.icon]}.png`;
            }
        }

        private updateSpe(): void {
            this._speCfg = TipCfg.instance.getCfgByType(DungeonModel.instance.tipType);
            if (this._speCfg) {
                this.gotoBtn.visible = true;
                this.speImg.visible = true;
                this.speImg.skin = "assets/icon/ui/failure_stronger/" + this._speCfg[tipsFields.ImgId] + ".jpg";
            } else {
                this.gotoBtn.visible = false;
                this.speImg.visible = false;
            }
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            DungeonCtrl.instance.reqEnterScene(0);
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }

        private wayClickHandler(index: int, e: Laya.Event): void {
            let cfg: failure_stronger = FailureStrongerCfg.instance.getCfgByLevel(PlayerModel.instance.level);
            let arr: Array<number> = cfg[failure_strongerFields.strongSourceId];
            let wayCfg: get_way = GetWayCfg.instance.getCfgById(arr[index]);
            this.close();
            // WindowManager.instance.openByActionId(wayCfg[get_wayFields.params][0]);
            // 放入面板栈中（在退出场景后打开）
            BottomTabCtrl.instance.addPanelByFunc(wayCfg[get_wayFields.params][0]);
        }

        private gotoHandler(): void {
            this.close();
            // WindowManager.instance.openByActionId(this._speCfg[tipsFields.gotoParams]);
            BottomTabCtrl.instance.addPanelByFunc(this._speCfg[tipsFields.gotoParams]);
        }

        destroy(): void {
            this._wayBgs = null;
            this._wayIcons = null;
            this._wayNames = null;
            super.destroy();
        }
    }
}
