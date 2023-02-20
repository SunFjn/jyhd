/** 加入战队最低战力设置弹框*/
namespace modules.clan {
    import LayaEvent = modules.common.LayaEvent;
    import ClanJoinLimitSetAlertUI = ui.ClanJoinLimitSetAlertUI;
    import CustomList = modules.common.CustomList;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class ClanJoinLimitSetAlert extends ClanJoinLimitSetAlertUI {
        public _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
        }


        onOpened(): void {
            super.onOpened();
            this.inputTxt.text = (parseInt(ClanModel.instance.myClanInfo[ClanInfoDataFields.limitFight]) / 10000) + "";
        }


        //确定
        private okBtnHandler(): void {
            //校验数据
            let content = this.inputTxt.text;
            if (!content || content.length <= 0) {
                SystemNoticeManager.instance.addNotice(`加入战队最低战力不能为空`, true);
                return;
            }
            //请求
            this.opMemberTips("确认修改加入战队最低战力吗?", () => {
                ClanCtrl.instance.setJoinClanLimit([parseInt(content) * 10000]);
            })
        }

        //修改提示
        private opMemberTips(word: string, fun: Function) {
            let handler: Handler = Handler.create(this, fun);
            CommonUtil.alert(`温馨提示`, word, [handler]);
        }

    }
}