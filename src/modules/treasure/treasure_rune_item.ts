///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
/** 背包道具单元项*/
namespace modules.treasure {
    import ItemFields = Protocols.ItemFields;
    import BaseItem = modules.bag.BaseItem;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import BagUtil = modules.bag.BagUtil;

    export class TreasureRuneItem extends BaseItem {
        private textObj: Laya.Text;
        constructor() {
            super();
            this.height = 122;
        }

        protected initialize(): void {
            super.initialize();
            this.nameVisible = true;
            this.needTip = true;
            let img = new Laya.Image();
            img.skin = `treasure/iconbg_xb_hd.png`;
            this.addChildAt(img, 0);
            // let x = (this.width - img.width) / 2
            // let y = (this.height - img.height) / 2
            img.scale(0.95, 0.95)
            img.pos(2, 0);

            this.textObj = new Laya.Text();
            this.textObj.font = "SimHei";
            this.textObj.fontSize = 22;
            this.textObj.color = `#3a5385`;
            this.textObj.align = `center`;
            this.textObj.width = 184;
            this.textObj.height = 24;
            this.addChild(this.textObj);
            this.textObj.pos(-42, 98);
        }

        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setDataSource(value: Protocols.Item) {
            value = [value[ItemFields.ItemId], 0, 0, null];
            super.setDataSource(value);
            this._nameTxt.visible = false;
            this._qualityBg.visible = false;
            this.isbtnClipIsPlayer = false;
            let shuju = CommonUtil.getFuWenNameAndLv(value[ItemFields.ItemId]);
            this.textObj.text = `${shuju[0]} Lv.${shuju[1]}`;
            this.textObj.color = this._nameTxt.color;
        }

        public destroy(): void {
            super.destroy(true);
        }
    }
}