/** 玄火排行列表 */

///<reference path="../common/custom_list.ts"/>
///<reference path="./xuanhuo_rankaward_cfg.ts"/>

namespace modules.xuanhuo {
    import XuanHuoRankAwardAlertUI = ui.XuanHuoRankAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;

    export class XuanHuoRankAwardAlert extends XuanHuoRankAwardAlertUI {
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
            this._list.height = 471;
            this._list.hCount = 1;
            this._list.itemRender = XuanHuoRankAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
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

        //玩家排行奖励
        private showPersonAwardList(): void {
            this.titleTxt.text="个人排行奖励"
            let datas: Array<xuanhuoRankAward> = XuanHuoModel.instance.getRnakAwardByType(0);
            this._list.datas = datas;
            this.personBtn.selected = true;
            this.clanBtn.selected = false;
        }

        //战队排行奖励
        private showClanAwardList(): void {
            this.titleTxt.text="战队排行奖励"
            let datas: Array<xuanhuoRankAward> = XuanHuoModel.instance.getRnakAwardByType(1);
            this._list.datas = datas;
            this.personBtn.selected = false;
            this.clanBtn.selected = true;
        }
    }
}