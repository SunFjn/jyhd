/** 哥布林王国胜利结算面板*/


namespace modules.dailyDungeon {
    import CoinWinViewUI = ui.CoinWinViewUI;
    import Event = Laya.Event;
    import UpdateIncomeRecord = Protocols.UpdateIncomeRecord;
    import Income = Protocols.Income;
    import UpdateIncomeRecordFields = Protocols.UpdateIncomeRecordFields;
    import IncomeFields = Protocols.IncomeFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import LayaEvent = modules.common.LayaEvent;

    export class CoinWinPanel extends CoinWinViewUI {
        private _duration: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.closeOnSide = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_UPDATE_INCOME_RECORD, this, this.recordUpdate);

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this.recordImg.visible = false;

            // this.incomeUpdate();
            this.recordUpdate();

            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.loopHandler();

            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (mapId === SCENE_ID.scene_copper_copy) {
                this.coinImg1.skin = this.coinImg2.skin = "common/icon_tongyong_1.png";
            } else if (mapId === SCENE_ID.scene_zq_copy) {
                this.coinImg1.skin = this.coinImg2.skin = "common/icon_tongyong_10.png";
            }
        }

        // private incomeUpdate():void{
        //     let income:BroadcastCopyIncome = DungeonModel.instance.broadcastCopyIncome;
        //     if(!income) return;
        // }

        private recordUpdate(): void {
            let record: UpdateIncomeRecord = DungeonModel.instance.updateIncomeRecord;
            if (!record) return;

            let curIncome: Income = record[UpdateIncomeRecordFields.curIncome];
            // curIncome[IncomeFields.type]
            this.coinTxt1.text = Math.ceil(curIncome[IncomeFields.param]) + "";
            let recIncome: Income = record[UpdateIncomeRecordFields.recordMaxIncome];
            this.coinTxt2.text = Math.ceil(recIncome[IncomeFields.param]) + "";
            this.recordImg.visible = curIncome[IncomeFields.param] > recIncome[IncomeFields.param];
        }

        public close(type?: string, showEffect?: boolean): void {
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
    }
}