//连充豪礼
namespace modules.dishu {
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import di_shu_cfg = Configuration.di_shu_cfg;
    import di_shu_cfgFields = Configuration.di_shu_cfgFields;
    import di_shu_rank_cfg = Configuration.di_shu_rank_cfg;
    import di_shu_rank_cfgFields = Configuration.di_shu_rank_cfgFields;
    import RankUserBaseInfo = Protocols.RankUserBaseInfo;
    import RankUserBaseInfoList = Protocols.RankUserBaseInfoList;
    import RankUserBaseInfoFields = Protocols.RankUserBaseInfoFields;

    export class DishuRankItem extends ui.DishuRankItemUI {
        private _cfg: di_shu_rank_cfg;
        private _itemDay: number;
        private _grade: number;
        private _state: number = 0;
        private _btnClip: CustomClip;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        private _showItem: Array<BaseItem>;
        protected initialize(): void {
            super.initialize();
            this._showItem = [
                this.continueBase1,
                this.continueBase2,
                this.continueBase3,
                this.continueBase4,
            ]

        }

        protected addListeners(): void {
            //负责按钮等控件的事件的监听
            super.addListeners();

        }

        protected removeListeners(): void {
            //负责取消按钮等控件监听的事件
            super.removeListeners();

        }

        public onOpened(): void {
        }
        // private _rank: number = 0
        //设置任务列表信息
        protected setData(value: di_shu_rank_cfg): void {

            this._cfg = value;
            // console.log('研发测试_gyy:this._cfg', this._cfg);
            // console.log('研发测试_gyy:DishuModel.instance.rankInfo', DishuModel.instance.rankInfo);
            // 有人上榜
            if (typeof DishuModel.instance.rankInfo != "undefined" && typeof DishuModel.instance.rankInfo[this._cfg[di_shu_rank_cfgFields.index]] != "undefined") {
                let api_info: RankUserBaseInfo = DishuModel.instance.rankInfo[this._cfg[di_shu_rank_cfgFields.index]];
                // 判断是不是自己
                // console.log('研发测试_gyy:PlayerModel.instance.actorId',PlayerModel.instance.actorId);
                // console.log('研发测试_gyy:api_info[RankUserBaseInfoFields.objId]',api_info[RankUserBaseInfoFields.objId]);
                if (PlayerModel.instance.actorId == api_info[RankUserBaseInfoFields.objId]) {
                    DishuModel.instance.myRankCallback(api_info[RankUserBaseInfoFields.rank]);
                }
                this.nameTxt.text = api_info[RankUserBaseInfoFields.name];
                this.numTxt.text = api_info[RankUserBaseInfoFields.param] as any as string;
                this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(api_info[RankUserBaseInfoFields.occ])}` || null;
            } else {
                this.nameTxt.text = "虚位以待...";
                this.numTxt.text = `至少${this._cfg[di_shu_rank_cfgFields.TaskCondition]}层`;
                this.headImg.skin = null;
            }

            // 设置道具
            let awardArr: Array<Items> = [];
            awardArr = this._cfg[di_shu_rank_cfgFields.RankingAwds];
            let DayBase: modules.bag.BaseItem[] = [];
            DayBase.push(this.continueBase1);
            DayBase.push(this.continueBase2);
            DayBase.push(this.continueBase3);
            DayBase.push(this.continueBase4);
            for (let i: int = 0; i < this._showItem.length; i++) {
                if (i < awardArr.length) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }

            // 设置排名序号
            this.twoImage.visible = false;
            this.threeImg.visible = false;
            this.otherBox.visible = false;
            switch (this._cfg[di_shu_rank_cfgFields.index]) {
                case 0:
                    break;
                case 2:
                    this.twoImage.visible = true;
                    break;
                case 3:
                    this.threeImg.visible = true;
                    break;

                default:
                    this.otherBox.visible = true;
                    this.afterthired.value = this._cfg[di_shu_rank_cfgFields.index] as any as string;
                    break;
            }
        }
    }
}
