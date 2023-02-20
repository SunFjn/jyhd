///<reference path="../config/fight_talisman_cfg.ts"/>
namespace modules.fight_talisman {
    import FightTalismanCfg = modules.config.FightTalismanCfg;
    import fight_talisman = Configuration.fight_talisman;
    import attrFields = Configuration.attrFields;
    import fight_talismanFields = Configuration.fight_talismanFields;
    import CustomClip = modules.common.CustomClip;
    export const enum FightTalismanItemValueFields {
        era = 0,			/*觉醒重数*/
        state = 1,			/*激活状态*/
    }
    export const enum FightTalismanItemValueState {
        unActive = 0,			/*未激活*/
        canActive = 1,			/*可激活*/
        actived = 2,              /*已激活*/
    }
    export const enum FightAttrType {
        attack = 0,         /*攻击力*/
        blood = 1,         /*血量*/
    } 
    export type FightTalismanItemValue = [number, number]
    export class FightTalismanItem extends ui.FightTalismanItemUI {
        constructor() {
            super();
        }
        private _taskClip: CustomClip;
        protected initialize(): void {
            super.initialize();
           
        }

        public destroy(): void {
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

        }

        private initEff() {
            this._taskClip = new CustomClip();
            this._taskClip.skin = "assets/effect/task.atlas";
            this._taskClip.frameUrls = ["task/0.png", "task/1.png", "task/2.png", "task/3.png", "task/4.png",
                "task/5.png", "task/6.png", "task/7.png"];
            this._taskClip.durationFrame = 7;
            this._taskClip.loop = true;
            this._taskClip.x = -12;
            this._taskClip.y = -6;
            this._taskClip.centerX = 0;
            this._taskClip.mouseEnabled = false;
            this._taskClip.scale(1.55, 1.3)
            this.addChild(this._taskClip);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._taskClip = this.destroyElement(this._taskClip);
        }

        protected setData(value: FightTalismanItemValue): void {
            let cfg: fight_talisman = FightTalismanCfg.instance.getCfgByEraAId(FightTalismanModel.instance.selected + 1, value[FightTalismanItemValueFields.era]);
            this.initEff();
            if (cfg[fight_talismanFields.era] == 0) {
                this.valueTxt.text = "激活勋章可激活";
            }
            else {
                this.valueTxt.text = `${Math.floor(cfg[fight_talismanFields.era] / 100)}阶${cfg[fight_talismanFields.era] % 100}段可激活`;
            }

            this.fightValue.text = cfg[fight_talismanFields.fighting].toString();
            this.attackValue.text = cfg[fight_talismanFields.attrs][FightAttrType.attack][attrFields.value].toString();
            this.bloodValue.text = cfg[fight_talismanFields.attrs][FightAttrType.blood][attrFields.value].toString();
            
            this._taskClip.stop();
            this._taskClip.visible = false;
            switch (value[FightTalismanItemValueFields.state]) {
                case FightTalismanItemValueState.actived:
                    // this.stateTxt.text = "已激活";
                    this.stateImg.skin = "fight_talisman_and_money_cat/txt_yjh.png";
                    this.turnGray(false);
                    break;
                case FightTalismanItemValueState.canActive:
                    // this.stateTxt.text = "可激活";
                    this.stateImg.skin = "fight_talisman_and_money_cat/txt_ydc.png";
                    this._taskClip.play();
                    this._taskClip.visible = true;
                    this.turnGray(false);
                    break;
                case FightTalismanItemValueState.unActive:
                    // this.stateTxt.text = "未激活";
                    this.stateImg.skin = "fight_talisman_and_money_cat/txt_wdc.png";
                    this.turnGray(true);
                    break;
            }
        }

        private turnGray(gray: boolean) {
            this.fightBg.gray = gray;
            this.fightIcon.gray = gray;
            this.bloodIcon.gray = gray;
            this.attackIcon.gray = gray;
            this.titleBg.gray = gray;
            if (!gray) {
                this.fightValue.color =  "#e07a51";
                this.attackValue.color = this.bloodValue.color = "#87c7ea";
            } else {
                this.fightValue.color =  "#969696";
                this.attackValue.color = this.bloodValue.color = "#b5b5b5";
            }
        }

    }
}