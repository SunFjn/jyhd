/** 玄火副本结算弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.xuanhuo {
    import XuanHuoCopySettlementAlertUI = ui.XuanHuoCopySettlementAlertUI;
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

    export class XuanHuoCopySettlementAlert extends XuanHuoCopySettlementAlertUI {
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
            this._list.itemRender = XuanHuoCopyISettlementtem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.clanBtn, common.LayaEvent.CLICK, this, this.showClanAwardList);
            this.addAutoListener(this.personBtn, common.LayaEvent.CLICK, this, this.showPersonAwardList);
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

        //下方奖励数据展示
        private showMyAwardData() {
            let awards: XuanhuoCopyJudgeAward = XuanHuoModel.instance.xuanhuoCopySettlementData;

            this.changeTxt.text = `转换战队币:${awards[XuanhuoCopyJudgeAwardFields.exNum]}`;
            this.myXuanhuoTxt.text = `拥有玄火:${XuanHuoModel.instance.score[updateXuanhuoNumFields.score]}`;

            let itemDatas = awards[XuanhuoCopyJudgeAwardFields.items];

            let items: Array<BagItem> = [this.item1, this.item2, this.item3, this.item4];
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
            this.showNameTxt.text = "玩家名称";
            this.xuanhuoTxt.text = XuanHuoModel.instance.score[updateXuanhuoNumFields.score] + "";

            let HumanData: Array<[number, number, string, boolean]> = XuanHuoModel.instance.getCopyHumanData()
            let data: Array<[number, number, string, boolean, number]> = new Array<[number, number, string, boolean, number]>();
            // let myRank = "未上榜"
            HumanData.forEach((value, key) => {
                data.push([value[0], value[1], value[2], value[3], (key + 1)])
                // if (value[0] == PlayerModel.instance.actorId) {
                // myRank = '' + (key + 1)
                // }
            });

            // this.myRankTxt.text = "我的排名：" + myRank
            this.myRankTxt.text = "我的排名：" + XuanHuoModel.instance.xuanhuoCopySettlementData[XuanhuoCopyJudgeAwardFields.selfRank];

            this._list.datas = data;
            console.log("玩家排行奖励列表：", data);

            this.personBtn.selected = true;
            this.clanBtn.selected = false;
        }

        //战队排行奖励
        private showClanAwardList(): void {
            this.showNameTxt.text = "战队名称";
            let TeamData: Array<[string, number, string, boolean]> = XuanHuoModel.instance.getCopyTeamData()
            let data: Array<[string, number, string, boolean, number]> = new Array<[string, number, string, boolean, number]>();
            // let myRank = "未上榜"
            TeamData.forEach((value, key) => {
                data.push([value[0], value[1], value[2], value[3], (key + 1)])
                console.log(value[0], ClanModel.instance.ClanId)
                if (value[0] == ClanModel.instance.ClanId) {
                    // myRank = '' + (key + 1)
                    this.xuanhuoTxt.text = value[2];
                }
            });
            // this.myRankTxt.text = "战队排名：" + myRank
            this.myRankTxt.text = "战队排名：" + XuanHuoModel.instance.xuanhuoCopySettlementData[XuanhuoCopyJudgeAwardFields.teamRank];
            this._list.datas = data;
            console.log("战队排行奖励列表：", data);

            this.personBtn.selected = false;
            this.clanBtn.selected = true;
        }
    }
}