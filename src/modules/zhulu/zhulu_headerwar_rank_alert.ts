/** 逐鹿首领战积分排行 */

///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuHeaderWarRankAlertUI = ui.ZhuLuHeaderWarRankAlertUI;
    import CustomList = modules.common.CustomList;
    import xuanhuoAchievementShow = Protocols.xuanhuoAchievementShow;
    import BtnGroup = modules.common.BtnGroup;
    import GetTeamChiefRankListReply = Protocols.GetTeamChiefRankListReply;
    import GetTeamChiefRankListReplyFields = Protocols.GetTeamChiefRankListReplyFields;

    export class ZhuLuHeaderWarRankAlert extends ZhuLuHeaderWarRankAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }
        private _btnGroup: BtnGroup;
        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 103;
            this._list.width = 582;
            this._list.height = 480;
            this._list.hCount = 1;
            this._list.itemRender = ZhuLuHeaderWarRankItem;
            this._list.spaceY = 0;
            this.addChild(this._list);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.personBtn, this.clanBtn);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_HEADERWAR_SCORE_RANK, this, this.updateView);

            this.addAutoListener(this.personBtn, Laya.Event.CLICK, this, this.updateView);
            this.addAutoListener(this.clanBtn, Laya.Event.CLICK, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0
            //请求数据
            ZhuLuCtrl.instance.getHeaderWarRankInfo();
        }

        //更新界面
        private updateView(): void {
            (<Laya.Button>this._btnGroup.selectedBtn).selected = true;
            // 判断个人排个还是战队排行
            let showUserInfo: boolean = this._btnGroup.selectedIndex == 0
            this.infoTxt.text = showUserInfo ? "玩家名称" : "战队名称";
            this.myRank1Txt.text = showUserInfo ? "我的排名:" : "战队排名:";
            this.myRank2Txt.text = showUserInfo ? "我的积分:" : "战队积分:";

            let rank = ZhuLuModel.instance.chiefRankList[GetTeamChiefRankListReplyFields.rank][showUserInfo ? 0 : 1]
            this.myRank1Txt.text += rank[0] == 0 ? '未上榜' : rank[0]
            this.myRank2Txt.text += rank[1]
            // 获取排名数据
            let datas = ZhuLuModel.instance.chiefRankList[showUserInfo ? 1 : 2]
            let list = [];
            // 列表赋值
            for (let index = 0; index < datas.length; index++) {
                list.push([(index + 1), datas[index][0], datas[index][1]])
            }
            this._list.datas = list;
        }

    }
}