/////<reference path="../$.ts"/>
///<reference path="../config/soaring_rank_cfg.ts"/>
///<reference path="../config/soaring_rank_task_cfg.ts"/>
/** 描述 */
namespace modules.soaring_rank {
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;

    export class SoaringRankItem extends ui.SoaringRankItemUI {
        private _taskBase: Array<BaseItem>;
        private _paiMing: number = 1;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.reward1, this.reward2, this.reward3];
            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "left";
        }

        protected addListeners(): void {
            super.addListeners();
            //这里绑定 更新 事件
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.showUI);
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
            this.afterthired.value = `${this._paiMing}`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let FeishengRankInfoDate: FeishengRankInfo = SoaringRankModel.instance.nodeList[this._paiMing];
            let grade = 0;
            if (FeishengRankInfoDate) {
                grade = FeishengRankInfoDate[FeishengRankInfoFields.grade];
                if (!grade) {
                    grade = SoaringRankCfg.instance.getGradeByRank(this._paiMing);
                }
            } else {
                grade = SoaringRankCfg.instance.getGradeByRank(this._paiMing);
            }
            let shuju = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, grade);
            //这里根据 名次 去拿对应的奖励和上榜条件
            let rewards = shuju[feisheng_rankFields.reward];
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            if (FeishengRankInfoDate) {//如果当前名次有玩家数据
                this.playername.visible = true;
                this.playername.text = FeishengRankInfoDate[FeishengRankInfoFields.name];
                this.notplaylisttxt.visible = false;
                this.StatementHTML.innerHTML = `积分:<span style='color:#168a17'>${FeishengRankInfoDate[FeishengRankInfoFields.param]}</span>`;
            } else {
                this.playername.visible = false;
                this.notplaylisttxt.visible = true;
                this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${shuju[feisheng_rankFields.condition]}</span>积分`;
            }
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(): void {
            super.close();
        }
    }
}
