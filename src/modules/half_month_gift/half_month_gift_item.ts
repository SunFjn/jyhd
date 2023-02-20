namespace modules.halfMonthGift {

    import SevenGiftItemUI = ui.SevenGiftItemUI;
    import Image = Laya.Image;
    import seven_dayFields = Configuration.seven_dayFields;
    import seven_day = Configuration.seven_day;
    import ItemsFields = Configuration.ItemsFields;
    import CommonUtil = modules.common.CommonUtil;
    import Text = Laya.Text;
    import item_materialFields = Configuration.item_materialFields;
    import item_material = Configuration.item_material;

    export class HalfMonthGiftItem extends SevenGiftItemUI {

        //道具图标
        public _icon: Image;
        //道具品质背景
        private _qualityBg: Image;
        //数量
        private _numTxt: Text;
        //道具数据配置
        private _itemCfg: item_material;
        //名字
        private _name: string;

        constructor() {
            super();
        }

        protected initialize(): void {

            super.initialize();

            this.dotImg.visible = true;
            this.receiveImg.visible = false;

            this._qualityBg = new Image();
            this.addChildAt(this._qualityBg, 0);

            this._icon = new Image();
            this.addChildAt(this._icon, 1);

            this._numTxt = new Text();
            this.addChild(this._numTxt);
            this._numTxt.width = 95;
            this._numTxt.align = "right";
            this._numTxt.fontSize = 24;
            this._numTxt.color = "#ffffff";
            this._numTxt.stroke = 3;
            this._numTxt.strokeColor = "#424242";
            this._numTxt.pos(18, 140, true);

            this.addChild(this.receiveImg);
        }

        //设置资源
        public setDataSource(value: seven_day, index: int): void {

            if (value == null) {
                this._icon.skin = "";
                this._numTxt.text = "";
                this._name = "";
                this._qualityBg.skin = `common/dt_tongyong_0.png`;
            } else {
                let itemId: int = value[seven_dayFields.award][index][ItemsFields.itemId];

                this._itemCfg = CommonUtil.getItemCfgById(itemId) as item_material;

                let quality: int = CommonUtil.getItemQualityById(itemId);

                this._icon.skin = CommonUtil.getIconById(itemId);

                this._qualityBg.skin = `common/dt_tongyong_${quality}.png`;

                this._name = this._itemCfg[item_materialFields.name];

                if (value[seven_dayFields.award][index][ItemsFields.count] != 1) {
                    let num: string = CommonUtil.bigNumToString(value[seven_dayFields.award][index][ItemsFields.count]);
                    this._numTxt.text = num;
                } else
                    this._numTxt.text = "";
            }

            this._icon.pos(21, 70);
            this._qualityBg.pos(21, 70);

        }

        //设置第七个
        public setSevenItem(): void {

            this.frameImg.width = 307;
            this.frameImg.height = 196;
            this._numTxt.pos(93, 140, true);

            for (let i: int = 0; i < this._childs.length; i++) {
                let _child_: Image = <Image>this.getChildAt(i);
                if (_child_ == this.dotImg) {
                    _child_.x = 181;
                    continue;
                }
                _child_.centerX = 0;
            }
        }

        //设置上面三个
        public setTopItem(): void {

            if (this.frameImg) {
                this.frameImg.destroy();
                this.dotImg.destroy();
                this.receiveImg.destroy();
            }

            this._qualityBg.pos(0, 0);
            this._icon.centerX = 0;
            this._icon.centerY = 0;
            this._qualityBg.addChild(this._icon);
            this._qualityBg.addChild(this._numTxt);
            this._qualityBg.scale(0.8, 0.8);
            this._numTxt.pos(-24, 65);
            this._numTxt.scale(1.25, 1.25);
            this.width = 100;
            this.height = 100;
            this.anchorX = 0.5;
            this.anchorY = 0.5;
        }

        public set selected(value: boolean) {
            this.frameImg.visible = value;
        }

    }
}
