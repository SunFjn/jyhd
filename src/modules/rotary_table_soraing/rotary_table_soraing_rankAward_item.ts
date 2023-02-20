///<reference path="../config/duobao_rank_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import DuobaoRankCfg = modules.config.DuobaoRankCfg;
    import duobao_rank = Configuration.duobao_rank;
    import duobao_rankFields = Configuration.duobao_rankFields;
    import PayRewardWeightNodeFields = Configuration.PayRewardWeightNodeFields;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import DuobaoRankInfo = Protocols.DuobaoRankInfo;
    import DuobaoRankInfoFields = Protocols.DuobaoRankInfoFields;
    export class RotaryTableSoaringRankAwardItem extends ui.RotaryTableItemUI {
        private _taskBase: Array<BaseItem>;
        private _paiMing: number = 1;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.reward1, this.reward2, this.reward3];
            this.StatementHTML.color = "#2d2d2d";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "left";
        }
        protected addListeners(): void {
            super.addListeners();
            //这里绑定 更新 事件
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_MYLIST, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_QULIST, this, this.showUI);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected setData(value: any): void {
            super.setData(value);
            this._paiMing = value;
            this.showUI();
        }
        public showUI() {
            this.oneImage.visible = this._paiMing == 1;
            this.twoImage.visible = this._paiMing == 2;
            this.threeImg.visible = this._paiMing == 3;
            this.otherBox.visible = this._paiMing > 3;
            if (RotaryTableSoaringModel.instance._nowIndex == 0) {
                this.showMylist();
            }
            else if (RotaryTableSoaringModel.instance._nowIndex == 1) {
                this.showQulist();
            }
        }
        public onOpened(): void {
            super.onOpened();
        }
        public showMylist(): void {
            this.afterthired.value = `${this._paiMing}`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let InfoDate: DuobaoRankInfo = RotaryTableSoaringModel.instance._myNodeList[this._paiMing];
            let dangci = 0;
            let shuju = null;
            dangci = DuobaoRankCfg.instance.getGradeByRank(0, this._paiMing);
            shuju = DuobaoRankCfg.instance.getDate(0, RotaryTableSoaringModel.instance.param, dangci);
            //这里根据 名次 去拿对应的奖励和上榜条件
            if (shuju) {
                let rewards = shuju[duobao_rankFields.reward];
                for (var index = 0; index < rewards.length; index++) {
                    let element = rewards[index];
                    let _taskBase: BaseItem = this._taskBase[index];
                    if (_taskBase) {
                        _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                        _taskBase.visible = true;
                    }
                }
            }
            if (InfoDate) {//如果当前名次有玩家数据
                this.playername.visible = true;
                this.playername.text = InfoDate[DuobaoRankInfoFields.name];
                this.notplaylisttxt.visible = false;
                this.StatementHTML.innerHTML = `积分:<span style='color:#168a17'>${InfoDate[DuobaoRankInfoFields.param]}</span>`;
            } else {
                this.playername.visible = false;
                this.notplaylisttxt.visible = true;
                this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${shuju[duobao_rankFields.condition]}</span>积分`;
            }
        }
        public showQulist(): void {
            this.afterthired.value = `${this._paiMing}`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let InfoDate: DuobaoRankInfo = RotaryTableSoaringModel.instance._quNodeList[this._paiMing];
            let dangci = 0;
            let shuju = null;
            dangci = DuobaoRankCfg.instance.getGradeByRank(1, this._paiMing);
            shuju = DuobaoRankCfg.instance.getDate(1, RotaryTableSoaringModel.instance.param, dangci);
            //这里根据 名次 去拿对应的奖励和上榜条件
            if (shuju) {
                let rewards = shuju[duobao_rankFields.reward];
                for (var index = 0; index < rewards.length; index++) {
                    let element = rewards[index];
                    let _taskBase: BaseItem = this._taskBase[index];
                    if (_taskBase) {
                        _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                        _taskBase.visible = true;
                    }
                }
            }
            if (InfoDate) {//如果当前名次有玩家数据
                this.playername.visible = true;
                this.playername.text = `${InfoDate[DuobaoRankInfoFields.name]}服`
                this.notplaylisttxt.visible = false;
                this.StatementHTML.innerHTML = `积分:<span style='color:#168a17'>${InfoDate[DuobaoRankInfoFields.param]}</span>`;
            } else {
                this.playername.visible = false;
                this.notplaylisttxt.visible = true;
                this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${shuju[duobao_rankFields.condition]}</span>积分`;
            }
        }
        public close(): void {
            super.close();
        }
    }
}
