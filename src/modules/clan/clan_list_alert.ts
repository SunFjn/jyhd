/** 战队排行列表弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.clan {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ClanListAlertUI = ui.ClanListAlertUI;
    import ClanListItemInfo = Protocols.ClanListItemInfo;
    import CustomList = modules.common.CustomList;
    import AllClanListReplyFields = Protocols.AllClanListReplyFields;


    export class ClanListAlert extends ClanListAlertUI {
        private _list: CustomList;
        private _curPage: number = 1;
        private _totalPage: number = 1;
        private _pageCount: number = 7;
        private _clanList: Array<ClanListItemInfo>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 38;
            this._list.y = 121;
            this._list.width = 595;
            this._list.height = 890;
            this._list.hCount = 1;
            this._list.itemRender = ClanListAlertItem;
            this._list.spaceY = 6;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.nextBtn, LayaEvent.CLICK, this, this.nextBtnHandler);
            this.addAutoListener(this.lastBtn, LayaEvent.CLICK, this, this.lastBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_ALL_CLAN_LIST, this, this.updateClanAllList);
        }

        onOpened(): void {
            super.onOpened();

            ClanCtrl.instance.getAllClanList();
        }

        //更新戰隊列表
        private updateClanAllList(): void {
            this._clanList = ClanModel.instance.allClanList;
            //重置页码
            this._curPage = 1;
            //总页数 每页7条数据
            this._totalPage = Math.ceil(this._clanList.length / this._pageCount);
            if (this._totalPage == 0) this._totalPage = 1;
            //展示页码
            this.pageTxt.text = `${this._curPage}/${this._totalPage}`;
            //获取前7条数据
            let curPageData = this.getClanListDataByPage(this._curPage);
            //TODO
            this._list.datas = curPageData;
        }
        //下一页数据
        private nextBtnHandler(): void {
            this._curPage++;
            if (this._curPage > this._totalPage) {
                this._curPage--;
                return;
            }
            //展示页码
            this.pageTxt.text = `${this._curPage}/${this._totalPage}`;
            //获取7条数据
            let curPageData = this.getClanListDataByPage(this._curPage);
            //TODO
            this._list.datas = curPageData;
        }
        //上一页数据
        private lastBtnHandler(): void {
            this._curPage--;
            if (this._curPage <= 0) {
                this._curPage = 1;
                return;
            }
            //展示页码
            this.pageTxt.text = `${this._curPage}/${this._totalPage}`;
            //获取7条数据
            let curPageData = this.getClanListDataByPage(this._curPage);
            //TODO
            this._list.datas = curPageData;
        }

        //根据页数获取要显示的列表的数据
        private getClanListDataByPage(curPage: number) {
            let len = this._clanList.length;
            let startIndex = (curPage - 1) * this._pageCount;
            let result = [];

            for (let index = startIndex; index < startIndex + this._pageCount; index++) {
                if (index < len) {
                    const ele = this._clanList[index];
                    result.push(ele);
                } else {
                    break;
                }
            }
            return result;
        }


    }
}