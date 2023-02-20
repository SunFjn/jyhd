/** 战队申请列表弹框*/
namespace modules.clan {
    import LayaEvent = modules.common.LayaEvent;
    import ClanApplyListAlertUI = ui.ClanApplyListAlertUI;
    import CustomList = modules.common.CustomList;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import ClanApplyListMemberAttr = Protocols.ClanApplyListMemberAttr;
    import ClanApplyListMemberAttrFields = Protocols.ClanApplyListMemberAttrFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;


    export class ClanApplyListAlert extends ClanApplyListAlertUI {
        public _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 38;
            this._list.y = 126;
            this._list.width = 585;
            this._list.height = 345;
            this._list.hCount = 1;
            this._list.itemRender = ClanApplyListItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.agreeAllBtn, LayaEvent.CLICK, this, this.agreeAllBtnHandler);
            this.addAutoListener(this.rejectAllBtn, LayaEvent.CLICK, this, this.rejectAllBtnHandler);
            this.addAutoListener(this.setLimitBtn, LayaEvent.CLICK, this, this.setLimitBtnHandler);
            this.addAutoListener(this.autoAgreeBtn, LayaEvent.CLICK, this, this.selectAutoAgreeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_APPLY_LIST, this, this.updateClanApplyList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_JOIN_LIMIT, this, this.updateLimitText);
        }


        onOpened(): void {
            super.onOpened();
            let needAudit: boolean = ClanModel.instance.myClanInfo[ClanInfoDataFields.auditStatus];
            this.autoAgreeBtn.selected = !needAudit;
            this.updateLimitText();

            ClanCtrl.instance.getAllClanApplyList();
        }

        //自动审批修改
        private selectAutoAgreeHandler(): void {
            this.autoAgreeBtn.selected = !this.autoAgreeBtn.selected;
            //是否需要审批
            let state: boolean = !this.autoAgreeBtn.selected;
            ClanCtrl.instance.changeAuditState([state]);
        }
        //更新申请列表的数据
        private updateClanApplyList(): void {
            let datas: Array<ClanApplyListMemberAttr> = ClanModel.instance.clanApplyList;
            this.havenoTxt.visible = datas.length == 0;
            this._list.datas = datas;
        }
        //更新最低战力
        private updateLimitText(): void {
            let limit: number = parseInt(ClanModel.instance.myClanInfo[ClanInfoDataFields.limitFight]);
            let fight: string = CommonUtil.bigNumToString(limit);
            this.limitTxt.text = (limit == 0 ? "无限制" : (fight));
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        //设置最低战力
        private setLimitBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CLAN_JOIN_LIMIT_ALERT);
        }
        //一键同意
        private agreeAllBtnHandler(): void {
            this.qucikHandleApplyList(1, "同意");
        }
        //一键拒绝
        private rejectAllBtnHandler(): void {
            this.qucikHandleApplyList(0, "拒绝");
        }

        qucikHandleApplyList(op: number, desc: string) {
            if (op != 0 && op != 1) {
                SystemNoticeManager.instance.addNotice(`参数错误`, true);
                return;
            }
            let datas: Array<ClanApplyListMemberAttr> = ClanModel.instance.clanApplyList;
            if (datas.length == 0) {
                SystemNoticeManager.instance.addNotice(`没有任何需要处理的申请`, true);
                return;
            }

            let handler: Handler = Handler.create(this, () => {
                datas.forEach(apply_data => {
                    let agentID = apply_data[ClanApplyListMemberAttrFields.agentId];
                    let result = op;
                    ClanCtrl.instance.auditMemberJoinClan([agentID, result]);
                });
            });
            CommonUtil.alert(`温馨提示`, `确认${desc}所有申请吗?`, [handler]);
        }
    }
}