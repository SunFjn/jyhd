/** 玄火数量排行列表 */

///<reference path="../common/custom_list.ts"/>
///<reference path="./xuanhuo_rankaward_cfg.ts"/>

namespace modules.xuanhuo {
    import XuanHuoRankCopyAlertUI = ui.XuanHuoRankCopyAlertUI;
    import CustomList = modules.common.CustomList;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import updateXuanhuoNumFields = Protocols.updateXuanhuoNumFields;
    import ClanModel = modules.clan.ClanModel
    import updateXuanhuoNum = Protocols.updateXuanhuoNum;
    export class XuanHuoRankCopyAlert extends XuanHuoRankCopyAlertUI {
        private _list: CustomList;

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
            this._list.height = 420;
            this._list.hCount = 1;
            this._list.itemRender = XuanHuoRankCopyItem;
            this._list.spaceY = 0;
            this.addChild(this._list);


            this.StatementHTML.color = "#ec7f09";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 20;
            this.StatementHTML.style.valign = "middle";
            this.StatementHTML.style.lineHeight = 26;
            this.StatementHTML.mouseEnabled = false;
            this.StatementHTML.width = 400
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.clanBtn, common.LayaEvent.CLICK, this, this.showClanAwardList);
            this.addAutoListener(this.personBtn, common.LayaEvent.CLICK, this, this.showPersonAwardList);


        }

        onOpened(): void {
            super.onOpened();
            this.showPersonAwardList();
        }

        private setNum(num) {
            this.StatementHTML.innerHTML = `玄火数量：<img src="assets/icon/item/xuanhuo_huo.png" width="20" height="20"/>` + num;
        }
        //玩家排行奖励
        private showPersonAwardList(): void {
            this.showNameTxt.text = "玩家名称";
            this.StatementHTML.x = 400
            this.setNum(XuanHuoModel.instance.score[updateXuanhuoNumFields.score])
            this.roleNumTxt.visible = false

            this.descTxt.text = "根据玩家拥有玄火数量进行排名"
            // let datas: Array<xuanhuoRankAward> = XuanHuoModel.instance.getRnakAwardByType(0);




            let HumanData: Array<[number, number, string, boolean]> = XuanHuoModel.instance.getCopyHumanData()
            let data: Array<[number, number, string, boolean, number]> = new Array<[number, number, string, boolean, number]>();
            let myRank = "未上榜"
            HumanData.forEach((value, key) => {
                data.push([value[0], value[1], value[2], value[3], (key + 1)])
                if (value[0] == PlayerModel.instance.actorId) {
                    myRank = '' + (key + 1)
                }
            });

            this.myRankTxt.text = "我的排名：" + myRank

            this._list.datas = data;
            this.personBtn.selected = true;
            this.clanBtn.selected = false;
            console.log(data)
        }

        //战队排行奖励
        private showClanAwardList(): void {
            this.showNameTxt.text = "战队名称";
            this.StatementHTML.x = 270
            this.roleNumTxt.visible = true;

            let num = XuanHuoModel.instance.CopyTeamLenght
            let max = ClanModel.instance.ClanMemberNum
            this.roleNumTxt.text = `参与人数：${num}/${max}`

            this.descTxt.text = "根据战队所有成员拥有玄火数量进行排名"
            // let datas: Array<xuanhuoRankAward> = XuanHuoModel.instance.getRnakAwardByType(1);
            // this._list.datas = datas;

            let TeamData: Array<[string, number, string, boolean]> = XuanHuoModel.instance.getCopyTeamData()
            let data: Array<[string, number, string, boolean, number]> = new Array<[string, number, string, boolean, number]>();
            let myRank = "未上榜"
            TeamData.forEach((value, key) => {
                data.push([value[0], value[1], value[2], value[3], (key + 1)])
                console.log(value[0], ClanModel.instance.ClanId)
                if (value[0] == ClanModel.instance.ClanId) {
                    myRank = '' + (key + 1)
                    this.setNum(value[2])
                }
            });
            this.myRankTxt.text = "战队排名：" + myRank
            this._list.datas = data;




            this.personBtn.selected = false;
            this.clanBtn.selected = true;
        }
    }
}