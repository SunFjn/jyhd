///<reference path="../config/money_cat_cfg.ts"/>
namespace modules.money_cat{
    import MoneyCatCfg = modules.config.MoneyCatCfg;
    import money_cat = Configuration.money_cat;
    import money_catFields = Configuration.money_catFields;
    export const enum MoneyCatItemValueFields {
		era = 0,			/*觉醒重数*/
		state = 1,			/*激活状态*/
	}
    export const enum MoneyCatItemValueState {
		unActive = 0,			/*未激活*/
		canActive = 1,			/*可激活*/
        actived = 2,              /*已激活*/
	}
    export type MoneyCatItemValue = [number,number]
    export class MoneyCatItem extends ui.MoneyCatItemUI{
        constructor(){
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.goldImg.skin="assets/icon/item/1_s.png";
        }

        public destroy():void{
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        protected setData(value: MoneyCatItemValue): void {
            let cfg:money_cat = MoneyCatCfg.instance.getCfgByEra(value[money_catFields.era]);
            this.valueTxt.text=`觉醒达到${Math.floor(cfg[money_catFields.era]/100)}阶${cfg[money_catFields.era]%100}段可获得`;
            this.valueText.text = `X${cfg[money_catFields.award][0][1]}`;
            switch(value[MoneyCatItemValueFields.state]){
                case MoneyCatItemValueState.actived:
                    this.stateTxt.text="已激活";
                    this.stateTxt.color="#232323";
                    this.valueTxt.color="#232323";
                    this.valueText.color="#232323";
                break;
                case MoneyCatItemValueState.canActive:
                    this.stateTxt.text="可激活";
                    this.stateTxt.color="#0f81f5";
                    this.valueTxt.color="#0f81f5";
                    this.valueText.color="#0f81f5";
                break;
                case MoneyCatItemValueState.unActive:
                    this.stateTxt.text="未激活";
                    this.stateTxt.color="#232323";
                    this.valueTxt.color="#232323";
                    this.valueText.color="#232323";
                break;
            }
        }

    }
}