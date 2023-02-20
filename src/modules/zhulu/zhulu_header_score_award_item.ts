///<reference path="../config/teamFightFor_boss_award_cfg.ts"/>
/**逐鹿首领战boss伤害奖励item */
namespace modules.zhulu {
    import ZhuLuHeaderDamageAwardItemUI = ui.ZhuLuHeaderDamageAwardItemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    import fightTeam_score_award = Configuration.fightTeam_score_award;
    import fightTeam_score_awardFields = Configuration.fightTeam_score_awardFields;

    import teamFightForScoreAwardCfg = modules.config.teamFightForScoreAwardCfg;


    export class ZhuLuHeaderScoreAwardItem extends ZhuLuHeaderDamageAwardItemUI {
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


            this._index = value[0];
            let state: operaState = value[1];


            let cfg: fightTeam_score_award = teamFightForScoreAwardCfg.instance.getCfg(this._index);
            this.scheduleTxt.text = `${CommonUtil.bigNumToString(ZhuLuModel.instance.score)}/${CommonUtil.bigNumToString(cfg[fightTeam_score_awardFields.condition])}`;
            this.descTxt.text = cfg[fightTeam_score_awardFields.describe]
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
            let itemData: Items = cfg[fightTeam_score_awardFields.items][0];
            this.item1.dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            let cfg: fightTeam_score_award = teamFightForScoreAwardCfg.instance.getCfg(this._index);
            ZhuLuCtrl.instance.GetTeamChiefScoreAward(cfg[fightTeam_score_awardFields.taskId]);
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