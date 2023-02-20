/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.pay_reward {
    import Point = Laya.Point;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import pay_reward_reward = Configuration.pay_reward_reward;
    import pay_reward_rewardFields = Configuration.pay_reward_rewardFields;

    export class PayRewardRankItem extends ui.PayRewardRankItemUI {
        private _startPos: Point;
        private _challengeClip: CustomClip;
        private _items: Array<BaseItem>;
        private _date: pay_reward_reward;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._challengeClip) {
                this._challengeClip.removeSelf();
                this._challengeClip.destroy();
                this._challengeClip = null;
            }
            if (this._items) {
                for (let index = 0; index < this._items.length; index++) {
                    let element = this._items[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._items.length = 0;
                this._items = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._startPos = new Point(151, 69);
            this._items = new Array<BaseItem>();
            this._items = [this.rewardBase1, this.rewardBase2, this.rewardBase3, this.rewardBase4];
            this.StatementHTML.color = "#3a5385";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "left";
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();
            // this.adaptiveaText();
        }

        public close(): void {
            super.close();
        }

        protected setData(value: pay_reward_reward): void {
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
            let rewardItems = this._date[pay_reward_rewardFields.reward];
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
            let condition = this._data[pay_reward_rewardFields.condition];
            let grade = this._data[pay_reward_rewardFields.grade];
            let caifu = PayRewardModel.instance.caifu;
            if (caifu >= condition) {
                this.StatementHTML.innerHTML = `财富值达到<span style='color:#e0b75f'>${condition}</span>可领取(<span style='color:#168a17'>${caifu}/${condition}</span>)`;
            } else {
                this.StatementHTML.innerHTML = `财富值达到<span style='color:#e0b75f'>${condition}</span>可领取(<span style='color:#ff3e3e'>${caifu}/${condition}</span>)`;
            }
            let state = PayRewardModel.instance.getRewardStart(grade);
            this.HasBroughtImg.visible = state == 2;
        }
    }
}