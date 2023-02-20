/** 战队列表面板 */

///<reference path="../common/custom_list.ts"/>

namespace modules.clan {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ClanListViewUI = ui.ClanListViewUI;
    import ClanListItemInfoFields = Protocols.ClanListItemInfoFields;
    import ClanListItemInfo = Protocols.ClanListItemInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CustomList = modules.common.CustomList;
    import AllClanList = Protocols.AllClanListReply;
    import AllClanListReplyFields = Protocols.AllClanListReplyFields;
    import AllClanListArr = Protocols.AllClanListArr;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import AllClanListFields = Protocols.AllClanListReplyFields;

    export class ClanListPanel extends ClanListViewUI {
        private _list: CustomList;
        private _curPage: number = 1;
        private _totalPage: number = 1;
        private _pageCount: number = 7;
        private _onlyNotFullClan: boolean = false;
        private _clanList: Array<ClanListItemInfo>;
        private _selectIndex: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 38;
            this._list.y = 125;
            this._list.width = 652;
            this._list.height = 816;
            this._list.hCount = 1;
            this._list.itemRender = ClanListItem;
            this._list.spaceY = 3;
            this.addChild(this._list);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();
            this.applyAllBtn.on(Event.CLICK, this, this.applyAllBtnHandler);
            this.createBtn.on(Event.CLICK, this, this.crateClanBtnHandler);
            this.addAutoListener(this.notFullBtn, LayaEvent.CLICK, this, this.notFullBtnHandler);
            this.addAutoListener(this.nextBtn, LayaEvent.CLICK, this, this.nextBtnHandler);
            this.addAutoListener(this.lastBtn, LayaEvent.CLICK, this, this.lastBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_ALL_CLAN_LIST, this, this.updateClanAllList);
        }

        protected onOpened(): void {
            super.onOpened();

            ClanCtrl.instance.getAllClanList();
            CustomList.showListAnim(modules.common.showType.HEIGHT,this._list);
        }

        //更新戰隊列表
        private updateClanAllList(isUpdateAppliedStatus: boolean = false): void {
            this._clanList = ClanModel.instance.allClanList;
            //显示未满员的战队，需要将未满员的战队提取出来从新复制给this._clanList
            if (this._onlyNotFullClan) {
                this._clanList = ClanModel.instance.notFullClanList;
            }
            //如果不是更新申请状态则 重置页码
            if (!isUpdateAppliedStatus) {
                this._curPage = 1;
            }
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
        //是否只显示未满人的战队
        private notFullBtnHandler(): void {
            this.notFullBtn.selected = !this.notFullBtn.selected;
            this._onlyNotFullClan = this.notFullBtn.selected;
            this.updateClanAllList();
        }
        //一键申请所有战队btn点击处理
        private applyAllBtnHandler(): void {
            let state = false;
            if (!this._clanList) return;
            this._clanList.forEach(clan => {
                let uuid = clan[ClanListItemInfoFields.uuid]
                let isApplied = ClanModel.instance.getIsAppliedClan(uuid);
                let canJoin = ClanModel.instance.canJoinClan(clan);
                /*0-加入 1-取消加入*/
                if (!isApplied && canJoin) {
                    let opt: number = 0;
                    ClanCtrl.instance.applyJoinClan([uuid, opt]);
                    state = true;
                }
            });
            if (!state) {
                SystemNoticeManager.instance.addNotice("没有合适的战队可以加入", true)
            }
        }
        //打开创建战队面板
        private crateClanBtnHandler(): void {
            ClanModel.instance.createClanOrCN = { isChangeName: false };
            WindowManager.instance.open(WindowEnum.CLAN_CREATE_ALERT);
        }

    }
}