/** 宠物胜利结算面板*/


namespace modules.dailyDungeon {
    import PetWinViewUI = ui.PetWinViewUI;
    import Event = Laya.Event;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import BroadcastCopyStarFields = Protocols.BroadcastCopyStarFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import LayaEvent = modules.common.LayaEvent;

    export class PetWinPanel extends PetWinViewUI {
        private _duration: number;
        private _bagItems: Array<BagItem>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._bagItems = new Array<BagItem>();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.loopHandler();

            let star: int = DungeonModel.instance.broadcastCopyStar ? DungeonModel.instance.broadcastCopyStar[BroadcastCopyStarFields.curStar] : 3;
            this.star1.skin = star >= 1 ? "dungeon/zs_shilian_4.png" : "dungeon/zs_shilian_5.png";
            this.star2.skin = star >= 2 ? "dungeon/zs_shilian_4.png" : "dungeon/zs_shilian_5.png";
            this.star3.skin = star >= 3 ? "dungeon/zs_shilian_4.png" : "dungeon/zs_shilian_5.png";
        }

        public setOpenParam(value: any[]): void {
            super.setOpenParam(value);

            if (!value) return;
            // console.log("结算胜利。。。。。" + value);
            console.log('vtz:this._bagItems',this._bagItems);
            for (let i: int = 0, len: int = this._bagItems.length; i < len; i++) {
                this._bagItems[i].removeSelf();
            }
            let items: Array<Protocols.Item> = value[0];
            let itemsSource: number[] = value[1];
            let offset: number = 512 - items.length * 110;
            if (items.length > 0) offset -= (items.length - 1) * 30;
            offset *= 0.5;
            // console.log('vtz:this._bagItems', this._bagItems);
            for (let i: int = 0, len = items.length; i < len; i++) {
                let bagItem: BagItem = this._bagItems[i];
                if (!bagItem) {
                    bagItem = new BagItem();
                    this._bagItems.push(bagItem);
                }
                bagItem.dataSource = items[i];
                // console.log('vtz:itemsSource', itemsSource);
                if (typeof itemsSource != "undefined" && itemsSource) {
                    if (itemsSource[i] == 312) {
                        let icon = new Laya.Image;
                        icon.skin = "win/kfIcon.png"
                        bagItem.addChild(icon);
                        icon.pos(72, -17);
                    } else if (itemsSource[i] == 344) {
                        let icon = new Laya.Image;
                        icon.skin = "win/zkIcon.png"
                        bagItem.addChild(icon);
                        icon.pos(72, -17);
                    } else if (itemsSource[i] == 359) {
                        let icon = new Laya.Image;
                        icon.skin = "win/cjIcon.png"
                        bagItem.addChild(icon);
                        icon.pos(72, -17);
                    }
                }
                this.addChild(bagItem);
                bagItem.pos(i * 140 + offset, 634);
            }
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

            DungeonCtrl.instance.reqEnterScene(0);
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }

        public destroy(): void {
            if (this._bagItems) {
                for (let e of this._bagItems) {
                    e.destroy();
                }
                this._bagItems = null;
            }
            super.destroy();
        }
    }
}