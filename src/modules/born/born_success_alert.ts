/////<reference path="../$.ts"/>
/** 觉醒成功弹框 */
namespace modules.born {
    import BornSuccessAlertUI = ui.BornSuccessAlertUI;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import era = Configuration.era;
    import ItemsFields = Configuration.ItemsFields;
    import CommonUtil = modules.common.CommonUtil;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;

    export class BornSuccessAlert extends BornSuccessAlertUI {

        private _duration: number;

        constructor() {
            super();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }
        public onOpened(): void {
            super.onOpened();

            this._duration = 10000;
            this.loopHandler();
            this.updateView();
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
            }
            this.timeTxt.text = `${this._duration / 1000}秒后自动关闭`;
            this._duration -= 1000;
        }

        private updateView(): void {
            let lv: number = BornModel.instance.lv;
            let lastLv: number = BornCfg.instance.getCfgByLv(lv, -1)[eraFields.level];
            let cfg: era = BornCfg.instance.getCfgByLv(lv);

            this.setPrizes(cfg);
            if (!lastLv) {
                this.noImg.visible = true;
                this.lastLvBox.visible = false;
            } else {
                this.noImg.visible = false;
                this.lastLvBox.visible = true;
            }
            this.lastLvMsz.value = BornModel.instance.formatLv(lastLv);
            this.lvMsz.value = BornModel.instance.formatLv(lv);
            this.attTxt.text = cfg[eraFields.attack].toString();
            this.defTxt.text = cfg[eraFields.defense].toString();
            this.hpTxt.text = cfg[eraFields.hp].toString();
        }

        private setPrizes(cfg: era): void {

            let prizes: Items[] = cfg[eraFields.items];
            if (prizes.length) {
                let skillId: number = prizes[0][ItemsFields.itemId];
                let skillIcon: string = CommonUtil.getIconById(skillId);
                this.skillImg.skin = skillIcon;
                let skillName: string = CommonUtil.getNameByItemId(skillId);
                this.skillNameTxt.text = `${skillName}`;

                let propId: number = prizes[1][ItemFields.ItemId];
                let propData: Item = [propId, prizes[1][ItemFields.count], 0, null];
                this.propImg.dataSource = propData;
                let propName: string = CommonUtil.getNameByItemId(propId);
                this.propNameTxt.text = propName;
                this.skillBox.visible = this.propBox.visible = true;
                this.btn.y = 580;
                CommonUtil.centerChainArr(this.width, [this.skillBox, this.propBox],35);
            } else {
                this.skillBox.visible = this.propBox.visible = false;
                this.btn.y = 415;
            }
            this.timeTxt.y = this.btn.y + 80;
            this.bgImg.height = this.timeTxt.y - 55;
            this.height = this.bgImg.height + 120;
            this.tipTxt.y = this.height + 50;
        }
    }
}