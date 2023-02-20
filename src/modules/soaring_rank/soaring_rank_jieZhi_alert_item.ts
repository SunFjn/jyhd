/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.soaring_rank {
    import Point = Laya.Point;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import PayRewardModel = modules.pay_reward.PayRewardModel;
    import PayRewardNote = Protocols.PayRewardNote;
    import PayRewardNoteFields = Protocols.PayRewardNoteFields;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    /*历史记录返回数据*/
    import GetSprintRankBeforeReply = Protocols.GetSprintRankBeforeReply;
    import GetSprintRankBeforeReplyFields = Protocols.GetSprintRankBeforeReplyFields;
    export class SoaringRankJieZhiItem extends ui.SoaringRankJieZhiItemUI {
        private _mingCi: number;
        private _type: number;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
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

        protected setData(value: Array<any>): void {
            super.setData(value);
            if (value) {
                this._mingCi = value[0];
                this._type = value[1];
                let itemColor = ``;
                let nameStr = `没有玩家上榜`;
                if (this._type == 0) {
                    let shuju = modules.sprint_rank.SprintRankModel.instance._LiShiNodeListByObjRank[this._mingCi];
                    if (shuju) {
                        nameStr = shuju[FeishengRankInfoFields.name];
                    }
                }
                else {
                    let shuju = modules.soaring_rank.SoaringRankModel.instance._LiShiNodeListByObjRank[this._mingCi];
                    if (shuju) {
                        nameStr = shuju[FeishengRankInfoFields.name];
                    }
                }
                if (this._mingCi <= 3) {
                    itemColor = `#ff3e3e`;
                }
                else {
                    itemColor = `#ea8706`;
                }
                var html: string = `<span style='color:${itemColor};font-size: 24px'>第  ${this._mingCi}  名:${nameStr}</span>`;
                this.recordHtml.style.fontFamily = "SimHei";
                this.recordHtml.style.align = "left";
                this.recordHtml.innerHTML = html;
            }
        }
    }
}