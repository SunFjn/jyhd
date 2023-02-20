/** 争夺战副本结算弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import ZhuluCopyFinishAlertUI = ui.ZhuluCopyFinishAlertUI;
    import CustomList = modules.common.CustomList;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import updateXuanhuoNumFields = Protocols.updateXuanhuoNumFields;
    import ClanModel = modules.clan.ClanModel
    import updateXuanhuoNum = Protocols.updateXuanhuoNum;
    import XuanhuoCopyJudgeAwardFields = Protocols.XuanhuoCopyJudgeAwardFields;
    import XuanhuoCopyJudgeAward = Protocols.XuanhuoCopyJudgeAward;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BagItem = modules.bag.BagItem;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    import TeamBattleCopyFinishReply = Protocols.TeamBattleCopyFinishReply;
    import TeamBattleCopyFinishReplyFields = Protocols.TeamBattleCopyFinishReplyFields;

    import TeamBattleRank = Protocols.TeamBattleRank;
    import TeamBattleRankFields = Protocols.TeamBattleRankFields;

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;


    export class ZhuluCopyFinishAlert extends ZhuluCopyFinishAlertUI {
        private _list: CustomList;
        private _listItem: CustomList;
        private _exitTime: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 157;
            this._list.width = 582;
            this._list.height = 241;
            this._list.hCount = 1;
            this._list.itemRender = ZhuluCopyFinishItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.close);
        }

        onOpened(): void {
            super.onOpened();
            this.showMyAwardData();
            this.showPersonAwardList();
            this._exitTime = 11;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
            DungeonCtrl.instance.reqEnterScene(0);
        }

        private loopHandler(): void {
            this._exitTime--;
            this.okBtn.label = `确定(${this._exitTime})`;

            if (this._exitTime == 0) {
                this.close();
            }
        }
        /**
           * 单场排名奖励
           */
        public getRankCfg(): Array<Array<[number, number]>> {
            let itmes: Array<Array<[number, number]>> = [[], [], []];
            let blendCfg = BlendCfg.instance.getCfgById(73005);
            if (blendCfg && blendCfg[blendFields.intParam].length > 0) {
                let rank = 0
                let count = 0
                let len = blendCfg[blendFields.intParam].length
                for (let index = 0; index < len; index += 2) {
                    itmes[rank].push([blendCfg[blendFields.intParam][index], blendCfg[blendFields.intParam][index + 1]])
                    count++;
                    if (count >= 2) {
                        count = 0;
                        rank++;
                    }
                }
            }
            return itmes;
        }

        //下方奖励数据展示
        private showMyAwardData() {
            let tuple: TeamBattleCopyFinishReply = ZhuLuModel.instance.teamBattleCopyFinishReply
            let rank = tuple[TeamBattleCopyFinishReplyFields.rank]
            let teamScore = tuple[TeamBattleCopyFinishReplyFields.teamScore]
            let itemDatas = teamScore > 0 ? this.getRankCfg()[rank] : [];
            let items: Array<BagItem> = [this.item1, this.item2];
            for (let i: int = 0; i < items.length; i++) {
                if (i >= itemDatas.length) {
                    items[i].visible = false;
                    continue;
                }
                items[i].visible = true;
                items[i].dataSource = [itemDatas[i][ItemsFields.itemId], itemDatas[i][ItemsFields.count], 0, null];
            }
        }

        //玩家排行奖励
        private showPersonAwardList(): void {
            let tuple: TeamBattleCopyFinishReply = ZhuLuModel.instance.teamBattleCopyFinishReply
            let HumanData = tuple[TeamBattleCopyFinishReplyFields.list]
            let datas = [];
            let count = 0
            for (const e of HumanData) {
                count++;
                datas.push([count, e[TeamBattleRankFields.name], e[TeamBattleRankFields.score]])
            }
            this._list.datas = datas;

            if (HumanData[0] && HumanData[0][TeamBattleRankFields.score] > 0) {
                this.myRankTxt.text = `【${HumanData[0][TeamBattleRankFields.name]}】积分最高获取胜利`
            } else {
                this.myRankTxt.text = `本场无人获得积分已轮空`
            }

        }

    }
}