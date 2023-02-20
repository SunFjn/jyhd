/** 奇遇面板*/


namespace modules.adventure {
    import AdventureViewUI = ui.AdventureViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import AdventureEvent = Protocols.AdventureEvent;

    export class AdventurePanel extends AdventureViewUI {
        private _items: Array<AdventureItem>;

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this.descTxt.text = BlendCfg.instance.getCfgById(29005)[blendFields.stringParam][0];
            this._items = [this.item1, this.item2, this.item3, this.item4];
            this.item1.index = 0;
            this.item2.index = 1;
            this.item3.index = 2;
            this.item4.index = 3;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_EVENT_LIST_UPDATE, this, this.updateEventList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_YUNLI_UPDATE, this, this.updateYunLi);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateEventList();
            this.updateYunLi();
            AdventureModel.instance.hasNewEvent = false;
        }

        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(20034);
        }

        // 更新事件列表
        private updateEventList(): void {
            let events: Array<AdventureEvent> = AdventureModel.instance.eventList;
            let eventsLen: int = events ? events.length : 0;
            for (let i: int = 0, len: int = eventsLen; i < len; i++) {
                if (this._items[i]) {
                    this._items[i].data = events[i];
                    this.addChild(this._items[i]);
                }
            }
            for (let i: int = eventsLen, len: int = this._items.length; i < len; i++) {
                this._items[i].removeSelf();
            }
            this.noQiYuBox.visible = eventsLen <= 0;
        }

        // 更新运力
        private updateYunLi(): void {
            let yunLi: number = AdventureModel.instance.yunLi || 0;
            this.currencyTxt.text = `探险次数:${yunLi}/${BlendCfg.instance.getCfgById(29004)[blendFields.intParam][0]}`;
            this.currencyTxt.width = this.currencyTxt.textWidth;
            let offsetX: number = (720 - this.currencyTxt.width - 209) * 0.5;
            this.currencyTxt.x = offsetX;
            this.resetDescTxt.x = offsetX + this.currencyTxt.width;
        }

        public destroy(destroyChild: boolean = true): void {
            this._items = this.destroyElement(this._items);
            super.destroy(destroyChild);
        }
    }
}