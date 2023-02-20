/** 掉落提示面板*/


///<reference path="../common/common_util.ts"/>

namespace modules.notice {
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;
    import Image = Laya.Image;
    import Sprite = Laya.Sprite;
    import Text = Laya.Text;
    import CommonUtil = modules.common.CommonUtil;
    import ItemFields = Protocols.ItemFields;
    import item_rune = Configuration.item_rune;
    import runeRefine = Configuration.runeRefine;
    import item_runeFields = Configuration.item_runeFields;

    export class TipsNoticePanel extends Sprite {
        private _bg: Image;
        private _txt: Text;
        private _getTxt: Text;
        private _icon: Image;

        constructor() {
            super();

            this._bg = new Image();
            this._bg.skin = "common_sg/txtbg_common_tipsbg.png";
            this._bg.sizeGrid = "10,90,10,90";
            this.addChild(this._bg);
            this._bg.width = 400;
            this._bg.height = 42;

            // this._icon = new Image();
            // this.addChild(this._icon);
            // this._icon.width = 40;
            // this._icon.height = 40;
            // this._icon.x = 150;
            // this._icon.centerY = 0;

            this._getTxt = new Text();
            this.addChild(this._getTxt);
            this._getTxt.height = 24;
            this._getTxt.width = 200;
            this._getTxt.pos(-110, 7, true);
            this._getTxt.text = ``;
            this._getTxt.color = `#f3081a`;
            this._getTxt.align = "right"
            this._txt = new Text();
            this.addChild(this._txt);
            this._txt.height = 24;
            this._txt.y = 7;
            this._txt.x = 90;
            this._txt.color = `#ffffff`;
            this.width = 400;
            this.height = 42;
            // modules.notice.SystemNoticeManager.instance.addNotice( `<span style="color:#f3081a">${666}</span>${7777}！`, false);
        }

        public setTxt(item: [string, string]): void {
            if (item != null) {
                this._getTxt.text = item[0];
                this._txt.text = item[1];
            } else {
                this._getTxt.text = ""
                this._txt.text = ""
            }


        }

        // public setItem(item: Protocols.Item): void {
        //     if (item != null) {
        //         let itemId: int = item[Protocols.ItemFields.ItemId];
        //         let itemCfg: item_material | item_equip | item_stone | runeRefine = CommonUtil.getItemCfgById(itemId);
        //         let itemType = CommonUtil.getItemTypeById(itemId);
        //         switch (itemType) {
        //             case ItemMType.Material:
        //             case ItemMType.Giftbag:
        //             case ItemMType.Consume:
        //             case ItemMType.MagicWeapon:
        //                 this._txt.text = ` ${itemCfg[item_materialFields.name]}x${item[ItemFields.count]}`;
        //                 this._icon.skin = CommonUtil.getIconById(itemId);
        //                 break;
        //             case ItemMType.Unreal:
        //                 this._txt.text = ` ${itemCfg[item_materialFields.name]}x${item[ItemFields.count]}`;
        //                 this._icon.skin = CommonUtil.getIconById(itemId);
        //                 break;
        //             case ItemMType.Equip:
        //                 this._txt.text = ` ${itemCfg[item_equipFields.name]}x${item[ItemFields.count]}`;
        //                 this._icon.skin = CommonUtil.getIconById(itemId);
        //                 break;
        //             case ItemMType.Stone:
        //                 this._txt.text = ` ${itemCfg[item_stoneFields.name]}x${item[ItemFields.count]}`;
        //                 this._icon.skin = CommonUtil.getIconById(itemId);
        //                 break;
        //             case ItemMType.Rune:
        //                 let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
        //                 let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
        //                 let icon:string = dimCfg[item_runeFields.ico];
        //                 this._txt.text = ` ${dimCfg[Configuration.item_runeFields.name]}x${item[ItemFields.count]}`;
        //                 this._icon.skin = `assets/icon/item/${icon}.png`;
        //                 break;
        //         }
        //         let quality: int = CommonUtil.getItemQualityById(itemId);
        //         this._txt.color = CommonUtil.getColorByQuality(quality);
        //     } else {
        //         this._txt.text = "";
        //         this._icon.skin = "";
        //     }

        // }
    }
}