/**单人boss单元项*/
///<reference path="../config/duobao_reward_cfg.ts"/>
///<reference path="../config/duobao_weight_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import duobao_reward = Configuration.duobao_reward;
    import duobao_rewardFields = Configuration.duobao_rewardFields;
    import Point = Laya.Point;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    export class RotaryTableSoaringRankItem extends ui.RotaryTableJiFenItemUI {
        private _startPos: Point;
        private _challengeClip: CustomClip;
        private _items: Array<BaseItem>;
        private _date: duobao_reward;
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._challengeClip) {
                this._challengeClip.removeSelf();
                this._challengeClip.destroy();
                this._challengeClip = null;
            }
            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
            this._startPos = new Point(151, 69);
            this._items = new Array<BaseItem>();
            this._items = [this.rewardBase1, this.rewardBase2, this.rewardBase3, this.rewardBase4];
            this.StatementHTML.color = "#2d2d2d";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "left";
        }
        protected addListeners(): void {
            super.addListeners();
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_UPDATE, this, this.showText);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected onOpened(): void {
            super.onOpened();
        }
        public close(): void {
            super.close();
        }
        protected setData(value: duobao_reward): void {
            super.setData(value);
            if (value) {
                this._date = value;
                this.updateUI();
            }
        }
        public updateUI() {
            this.showReward();
            this.showText();
        }
        /**
         * 顯示獎勵
         */
        public showReward() {
            for (let index = 0; index < this._items.length; index++) {
                let element = this._items[index];
                element.visible = false;
            }
            let rewardItems = this._date[duobao_rewardFields.reward];
            if (rewardItems) {
                for (let index = 0; index < rewardItems.length; index++) {
                    let element = rewardItems[index];
                    if (element) {
                        let itemId: number = element[ItemsFields.itemId];
                        let count: number = element[ItemsFields.count];
                        let bagItem: BaseItem = this._items[index];
                        if (bagItem) {
                            bagItem.dataSource = [itemId, count, 0, null];
                            bagItem.visible = true;
                        }
                    }
                }
            }
        }
        /**
         * 顯示文本 和是否已領取
         */
        public showText() {
            let condition = this._data[duobao_rewardFields.condition];
            let id = this._data[duobao_rewardFields.id];
            let caifu = RotaryTableSoaringModel.instance.score;
            if (caifu >= condition) {
                this.StatementHTML.innerHTML = `积分达到<span style='color:#168a17'>${condition}</span>可领取(<span style='color:#168a17'>${caifu}/${condition}</span>)`;
            } else {
                this.StatementHTML.innerHTML = `积分达到<span style='color:#168a17'>${condition}</span>可领取(<span style='color:#ff3e3e'>${caifu}/${condition}</span>)`;
            }
            let state = RotaryTableSoaringModel.instance.getRewardStart(id);
            this.HasBroughtImg.visible = state == 2;
        }
    }
}