/** 哥布林王国右下面板*/

///<reference path="../notice/drop_notice_panel.ts"/>
namespace modules.kunlun {
    import KunLunGainViewUI = ui.KunLunGainViewUI;
    import Layer = ui.Layer;
    import Item = Protocols.Item;
    import DropNoticePanel = modules.notice.DropNoticePanel;
    import TweenGroup = utils.tween.TweenGroup;

    export class KunLunGainPanel extends KunLunGainViewUI {
        private _incomes: Array<Item>;
        private _panels: Array<DropNoticePanel> = new Array<DropNoticePanel>();
        private _tweenGroup: TweenGroup;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.closeByOthers = false;
            this.layer = Layer.MAIN_UI_LAYER;
            this._incomes = new Array<Item>();
            this._tweenGroup = new TweenGroup();
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.KUNLUN_SHOUYI, this, this.incomeUpdate);
            Laya.timer.loop(300, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.KUNLUN_SHOUYI, this, this.incomeUpdate);
            Laya.timer.clear(this, this.loopHandler);
        }

        public close(): void {
            this._tweenGroup.removeAll();
            super.close();
            this._incomes.length = 0;
            for (let panels of this._panels) {
                panels.destroy(true);
            }
            this._panels.length = 0;
        }

        public destroy(destroyChild: boolean = true): void {
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            this._panels = this.destroyElement(this._panels);
            super.destroy(destroyChild);
        }

        private incomeUpdate(): void {
            let income: Array<Item> = KunLunModel.instance._all_Item;
            if (!income) return;
            for (var index = 0; index < income.length; index++) {
                var element = income[index];
                this._incomes.push(element);
            }
        }

        private loopHandler(): void {
            if (!this._incomes || this._incomes.length === 0) {
                return;
            }
            let income: Item = this._incomes.shift();
            let panel = this._panels.shift() || new DropNoticePanel();
            panel.setItem(income);
            this.addChild(panel);
            panel.pos(0, this.height / 2);
            panel.visible = true;
            TweenJS.create(panel, this._tweenGroup).to({y: panel.y - 110}, 700).chain(
                TweenJS.create(panel, this._tweenGroup).to({y: panel.y - 180, alpha: 0.6}, 300).onComplete((): void => {
                    panel.visible = false;
                    panel.removeSelf();
                    panel.alpha = 1;
                    panel.setItem(null);
                    this._panels.push(panel);
                })
            ).start();
        }
    }
}