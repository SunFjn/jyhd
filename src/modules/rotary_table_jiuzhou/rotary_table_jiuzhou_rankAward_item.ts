///<reference path="../config/jz_duobao_rank_cfg.ts"/>
namespace modules.rotary_table_jiuzhou {
    import JzDuobaoRankCfg = modules.config.JzDuobaoRankCfg;
    import jzduobao_rank = Configuration.jzduobao_rank;
    import jzduobao_rankFields = Configuration.jzduobao_rankFields;
    import PayRewardWeightNodeFields = Configuration.PayRewardWeightNodeFields;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import DuobaoRankInfo = Protocols.DuobaoRankInfo;
    import DuobaoRankInfoFields = Protocols.DuobaoRankInfoFields;
    export class RotaryTableJiuZhouRankAwardItem extends ui.RotaryTableItemUI {
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
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_MYLIST, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_QULIST, this, this.showUI);
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
            if (RotaryTableJiuZhouModel.instance._nowIndex == 0) {
                this.showMylist();
            }
            else if (RotaryTableJiuZhouModel.instance._nowIndex == 1) {
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
            let InfoDate: DuobaoRankInfo = RotaryTableJiuZhouModel.instance._myNodeList[this._paiMing];
            let dangci = 0;
            let shuju = null;
            dangci = JzDuobaoRankCfg.instance.getGradeByRank(0, this._paiMing);
            shuju = JzDuobaoRankCfg.instance.getDate(0, dangci);
            //这里根据 名次 去拿对应的奖励和上榜条件
            if (shuju) {
                let rewards = shuju[jzduobao_rankFields.reward];
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
                this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${shuju[jzduobao_rankFields.condition]}</span>积分`;
            }
        }
        public showQulist(): void {
            this.afterthired.value = `${this._paiMing}`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let InfoDate: DuobaoRankInfo = RotaryTableJiuZhouModel.instance._quNodeList[this._paiMing];
            let dangci = 0;
            let shuju = null;
            dangci = JzDuobaoRankCfg.instance.getGradeByRank(1, this._paiMing);
            shuju = JzDuobaoRankCfg.instance.getDate(1, dangci);
            //这里根据 名次 去拿对应的奖励和上榜条件
            if (shuju) {
                let rewards = shuju[jzduobao_rankFields.reward];
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
                this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${shuju[jzduobao_rankFields.condition]}</span>积分`;
            }
        }
        public close(): void {
            super.close();
        }
    }
}
