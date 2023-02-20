/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
/** 天降圣物采集界面 */
namespace modules.day_drop_treasure {
    import DayDropTreasureModel = modules.day_drop_treasure.DayDropTreasureModel;
    import DayDropTreasureRightViewUI = ui.DayDropTreasureRightViewUI;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import CommonUtil = modules.common.CommonUtil;

    export class DayDropTreasureRightPanel extends DayDropTreasureRightViewUI {
        constructor() {
            super();
        }

        private _uptadetimer: number = 0;
        private _closeTimer: number = 0;

        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 464;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_DROP_TREASURE_GATHERCOUNT_UPDATE, this, this.setValueTxt1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();
            DayDropTreasureCtrl.instance.getPayRewardInfo();
            this.setValueTxt1();
            this.updateTime();
            this.loopHandler();
            this.adaptiveaText();
        }

        private loopHandler(): void {
            this.valueTxt.text = `${CommonUtil.timeStampToS(DayDropTreasureModel.instance.nextRefreshTime)}秒`;
            //活动剩余时间
            let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.richesCopy);
            if (states != undefined) {
                let stateNum = states[CopySceneStateFields.time];
                this.valueTxt2.text = `${CommonUtil.timeStampToHHMMSS(stateNum)}`;
            }
        }

        /**
         *更新时间
         */
        public updateTime() {
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        /**
         * 设置已采集的数量
         */
        public setValueTxt1() {
            let value = DayDropTreasureModel.instance.gatherCount;
            if (value >= DayDropTreasureModel.instance.maxNum) {
                value = DayDropTreasureModel.instance.maxNum;
                this.valueTxt1.color = "#ff3e3e";
            } else {
                this.valueTxt1.color = "#55ff28";
            }
            this.valueTxt1.text = `${value}/${DayDropTreasureModel.instance.maxNum}`
        }

        /**
         *適配文本
         */
        public adaptiveaText() {
            this.valueTxt.x = this.nameTxt.x + this.nameTxt.width;
            this.valueTxt1.x = this.nameTxt1.x + this.nameTxt1.width;
            this.valueTxt2.x = this.nameTxt2.x + this.nameTxt2.width;
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }
    }
}