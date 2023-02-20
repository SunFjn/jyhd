///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>


/** 签到道具单元项*/

namespace modules.compose {
    import Image = laya.ui.Image;
    import BaseItem = modules.bag.BaseItem;


    export class ComposeItem extends BaseItem {
        public _starArray: Array<Image>;
        public _itemType: number;

        protected initialize(): void {
            super.initialize();
            // this._starArray=[this.starImg1,this.starImg2,this.starImg3,this.starImg4];
            this._nameTxt.visible = false;
            this.needTip = true;

        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.BAG_CHANGE_NUM, this, this.changeNumHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.BAG_CHANGE_NUM, this, this.changeNumHandler);
        }

        private changeNumHandler(uid: number): void {
            if (this._itemData && this._itemData[Protocols.ItemFields.uid] === uid) {
                this._numTxt.text = this._itemData[Protocols.ItemFields.count].toString();
            }
        }

        public setData(value: any): void {
            if (value.length > 1 || value == null) {
                super.setDataSource(value)
            } else {
                super.setDataSource([value, 0, 0, null])
            }
        }
    }
}