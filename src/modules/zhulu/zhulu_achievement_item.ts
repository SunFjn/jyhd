
/**逐鹿成就item */
namespace modules.zhulu {
    import ZhuLuAchieventmentItemUI = ui.ZhuLuAchieventmentItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import zhuluAchievementShow = Protocols.zhuluAchievementShow;
    import zhuluAchievementShowFields = Protocols.zhuluAchievementShowFields;

    import zhuluAchievementAward = Configuration.zhuluAchievementAward;
    import zhuluAchievementAwardFields = Configuration.zhuluAchievementAwardFields;

    import ZhuLuAchievementCfg = modules.config.ZhuLuAchievementCfg;

    export class ZhuLuAchieventmentItem extends ZhuLuAchieventmentItemUI {
        private _btnClip: CustomClip;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);

        }

        protected initialize(): void {
            super.initialize();


            this._btnClip = CommonUtil.creatEff(this.getBtn, `btn_light`, 15);
            this._btnClip.pos(-5, -18);
            this._btnClip.scaleY = 1.2;
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.visible = true;
            this._btnClip.play();
        }

        public close(): void {
            super.close();
            this._btnClip.stop();
        }

        protected setData(value: zhuluAchievementShow): void {
            super.setData(value);

            let taskID: number = value[zhuluAchievementShowFields.taskId];
            let status: number = value[zhuluAchievementShowFields.status];
            let current: number = value[zhuluAchievementShowFields.current];

            let cfg: zhuluAchievementAward = ZhuLuAchievementCfg.instance.getConfigByTaskId(taskID);



            let condition: number = cfg[zhuluAchievementAwardFields.condition];
            let itemData: Items = cfg[zhuluAchievementAwardFields.items];

            this.scheduleTxt.text = `(${current}/${condition})`;
            this.scheduleTxt.color = (current >= condition) ? "#168a17" : "#8a3116";
            this.descTxt.text = cfg[zhuluAchievementAwardFields.describe];

            // this.wjhBtn.visible = status == 0;
            this.getBtn.visible = status == 1;
            this.ylqBtn.visible = status == 2;
            this.item.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            // let data: ClanGetLevelReward = [this._data[xuanhuoAchievementFields.taskId]];
            let taskID: number = this._data[zhuluAchievementShowFields.taskId];
            ZhuLuCtrl.instance.GetAchievementTaskAward(taskID);
        }


        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}
