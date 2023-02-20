/**圣物激活弹窗*/


namespace modules.treasure {
    import CustomClip = modules.common.CustomClip;
    import Event = laya.events.Event;
    import item_rune = Configuration.item_rune;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;

    export class TreasureGetAlert extends ui.TreasureGetAlertUI {
        private treasureId: number;
        private upClip: CustomClip;
        private num: number = 10;
        private allItemId: Array<number>;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this.upClip) {
                this.upClip.removeSelf();
                this.upClip.destroy();
                this.upClip = null;
            }

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this.upClip = new CustomClip();
            this.addChildAt(this.upClip, 0);
            this.upClip.pos(266, 335, true);
            this.upClip.anchorX = 0.5;
            this.upClip.anchorY = 0.5;
            this.upClip.scale(2, 2);
            this.upClip.skin = "assets/effect/state.atlas";
            this.upClip.frameUrls = ["state/0.png", "state/1.png", "state/2.png", "state/3.png", "state/4.png", "state/5.png", "state/6.png", "state/7.png"];
            this.upClip.durationFrame = 5;
            this.upClip.play();
            this.upClip.visible = true;
        }

        /**
         * 修改了 这个弹出的方式 传数组
         * @param value
         */
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.num = 10;
            this.btn.label = `确定(${this.num})`;
            this.allItemId = new Array<number>();//所有符合弹窗的奖励
            this.allItemId = value;
            this.treasureId = this.allItemId.shift();
            if (this.treasureId) {
                this.treasureItem.dataSource = [this.treasureId, 0, 0, null];
                // this.treasureItem.nameVisible=true;
                if (modules.common.CommonUtil.getItemTypeById(this.treasureId) == ItemMType.Rune) {
                    let dimId: number = (this.treasureId * 0.0001 >> 0) * 10000;  //模糊Id
                    let dimCfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);

                    this.treasureName.text = `${dimCfg[item_runeFields.name]} Lv.${this.treasureId % 10000}`;
                } else {
                    this.treasureName.text = this.treasureItem._nameTxt.text;
                }
                this.upClip.play();
                Laya.timer.loop(1000, this, this.btnClose);
            }

        }

        protected addListeners(): void {
            super.addListeners();
            this.btn.on(Event.CLICK, this, this.close);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.btn.off(Event.CLICK, this, this.close);
        }

        private btnClose(): void {
            this.num--;
            this.btn.label = `确定(${this.num})`;
            if (this.num <= 0) {
                Laya.timer.clear(this, this.btnClose);
                this.close();
            }
        }

        public onOpened(): void {
            super.onOpened();

        }

        public close(): void {
            super.close();
            GlobalData.dispatcher.event(CommonEventType.DIAL_UPDATE);
            this.upClip.stop();
            Laya.timer.clear(this, this.btnClose);
            if (this.allItemId.length > 0) {
                WindowManager.instance.openDialog(WindowEnum.TREASURE_GET_ALERT, this.allItemId);
                // this.setOpenParam(this.allItemId);
            }
        }
    }
}