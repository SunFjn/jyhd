///<reference path="../config/teamFightFor_boss_award_cfg.ts"/>
/**逐鹿首领战boss伤害奖励item */
namespace modules.zhulu {
    import ZhuLuHeaderDamageAwardItemUI = ui.ZhuLuHeaderDamageAwardItemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    import fightTeam_boss_awardFields = Configuration.fightTeam_boss_awardFields;
    import fightTeam_boss_award = Configuration.fightTeam_boss_award;
    import teamFightForBossAwardCfg = modules.config.teamFightForBossAwardCfg;


    export class ZhuLuHeaderDamageAwardItem extends ZhuLuHeaderDamageAwardItemUI {
        private _btnClip: CustomClip;
        private _index: number;


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);

        }

        public onOpened(): void {
            super.onOpened();


        }

        public close(): void {
            super.close();

        }

        protected initialize(): void {
            super.initialize();
            this._btnClip = CommonUtil.creatEff(this.getBtn, `btn_light`, 15);
            this._btnClip.pos(-5, -18);
            this._btnClip.scaleY = 1.2;
        }

        protected setData(value: [number, operaState]): void {
            super.setData(value);
            // let current: number = value[zhuluHeaderDamageAwardShowFields.current];
            //let condition: number = value[zhuluHeaderDamageAwardShowFields.condition];
            //let status: number = value[zhuluHeaderDamageAwardShowFields.status];
            //let itemData: Items = value[zhuluHeaderDamageAwardShowFields.Items][0];

            //this.scheduleTxt.text = `(${current}/${condition})`;
            //this.scheduleTxt.color = (current >= condition) ? "#168a17" : "#8a3116";
            //this.descTxt.text = value[zhuluHeaderDamageAwardShowFields.desc];

            //this.wjhBtn.visible = status == 0;
            // this.getBtn.visible = status == 1;
            // this.ylqBtn.visible = status == 2;

            // this.item1.dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];


            this._index = value[0];
            let state: operaState = value[1];


            let cfg: fightTeam_boss_award = teamFightForBossAwardCfg.instance.getCfg(this._index);
            this.scheduleTxt.text = `${CommonUtil.bigNumToString(ZhuLuModel.instance.hurt)}/${CommonUtil.bigNumToString(cfg[fightTeam_boss_awardFields.condition])}`;
            this.descTxt.text = cfg[fightTeam_boss_awardFields.describe]
            this._btnClip.stop();
            this._btnClip.visible = this.getBtn.visible = this.ylqBtn.visible = false;
            if (state == operaState.can) {
                this._btnClip.visible = this.getBtn.visible = true;
                this._btnClip.play();
            } else if (state == operaState.cant) { //不能领
                this.ylqBtn.visible = true;
                this.ylqBtn.skin = `common/txt_commmon_wdc.png`;
                // this.ylqBtn.skin = ``;
            } else {
                this.ylqBtn.visible = true;
                this.ylqBtn.skin = `common/txt_commmon_ylq.png`;
            }
            let itemData: Items = cfg[fightTeam_boss_awardFields.items][0];
            this.item1.dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            let cfg: fightTeam_boss_award = teamFightForBossAwardCfg.instance.getCfg(this._index);
            ZhuLuCtrl.instance.GetTeamChiefHurtAward(cfg[fightTeam_boss_awardFields.taskId]);
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