namespace modules.player_title {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetDesignationReplyFields = Protocols.GetDesignationReplyFields;
    import UpdateDesignationFields = Protocols.UpdateDesignationFields;
    import ActiveDesignationReplyFields = Protocols.ActiveDesignationReplyFields;
    import WearDesignationReplyFields = Protocols.WearDesignationReplyFields;
    import TakeoffDesignationReplyFields = Protocols.TakeoffDesignationReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;

    export class PlayerTitleCtrl extends BaseCtrl {
        private static _instance: PlayerTitleCtrl;
        public static get instance(): PlayerTitleCtrl {
            return this._instance = this._instance || new PlayerTitleCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetDesignationReply, this, this.GetDesignationReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDesignation, this, this.UpdateDesignation);
            Channel.instance.subscribe(SystemClientOpcode.ActiveDesignationReply, this, this.ActiveDesignationReply);
            Channel.instance.subscribe(SystemClientOpcode.WearDesignationReply, this, this.WearDesignationReply);
            Channel.instance.subscribe(SystemClientOpcode.TakeoffDesignationReply, this, this.TakeoffDesignationReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetDesignation();
        }
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.playerTitle) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.playerTitle)) {
                        PlayerTitleModel.instance.setRp();
                        return;
                    }
                }
            }
        }

        //????????????
        public GetDesignation(): void {
            // console.log("???????????? ??????...............    ");
            Channel.instance.publish(UserFeatureOpcode.GetDesignation, null);
        }

        //????????????
        public ActiveDesignation(id: number): void {
            // console.log("???????????? ??????...............:   " + id);
            PlayerTitleModel.instance._id = id;
            Channel.instance.publish(UserFeatureOpcode.ActiveDesignation, [id]);
        }

        //????????????
        public WearDesignation(id: number): void {
            // console.log("???????????? ??????...............:   " + id);
            Channel.instance.publish(UserFeatureOpcode.WearDesignation, [id]);
        }

        //????????????
        public TakeoffDesignation(id: number): void {
            // console.log("???????????? ??????...............:   " + id);
            Channel.instance.publish(UserFeatureOpcode.TakeoffDesignation, [id]);
        }

        /*???????????? ??????*/
        private GetDesignationReply(tuple: Protocols.GetDesignationReply): void {
            // console.log("???????????? ??????  ??????...............:   ", tuple);
            if (tuple) {
                PlayerTitleModel.instance._returnDtate = true;
                PlayerTitleModel.instance.AllDate = tuple[GetDesignationReplyFields.list];
            }
        }

        /*???????????? ??????*/
        private UpdateDesignation(tuple: Protocols.UpdateDesignation): void {
            // console.log("???????????? ??????  ??????...............:   ", tuple);
            if (tuple) {
                if (PlayerTitleModel.instance._returnDtate) {
                    if (PlayerTitleModel.instance.stateOne() == 0) {
                        // console.log("???????????? ??????????????????????????? ????????????????????????:   ", tuple);
                        for (let index = 0; index < tuple[UpdateDesignationFields.list].length; index++) {
                            let element = tuple[UpdateDesignationFields.list][index];
                            if (element) {
                                let id = element[Protocols.DesignationFields.id];
                                if (id == 10001) {
                                    let state = element[Protocols.DesignationFields.state];
                                    if (state == 3 || state == 4) {
                                        PlayerTitleModel.instance._id = id;
                                        // WindowManager.instance.openDialog(WindowEnum.PLAYER_TITLE_ALERT, PlayerTitleModel.instance._id);
                                    }
                                }
                            }
                        }
                    }
                }
                PlayerTitleModel.instance.AllDate = tuple[UpdateDesignationFields.list];
            }
        }

        /*???????????? ??????*/
        private ActiveDesignationReply(tuple: Protocols.ActiveDesignationReply): void {
            // console.log("???????????? ??????  ??????...............:   ", tuple);
            if (tuple[ActiveDesignationReplyFields.result] == 0) {
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_UPDATE);
                if (PlayerTitleModel.instance._id) {
                    // WindowManager.instance.openDialog(WindowEnum.PLAYER_TITLE_ALERT, PlayerTitleModel.instance._id);
                }
                SystemNoticeManager.instance.addNotice("????????????", false);
            } else {
                CommonUtil.noticeError(tuple[ActiveDesignationReplyFields.result]);
            }

        }

        /*???????????? ??????*/
        private WearDesignationReply(tuple: Protocols.WearDesignationReply): void {
            // console.log("???????????? ??????  ??????...............:   ", tuple);
            if (tuple[ActiveDesignationReplyFields.result] == 0) {
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_UPDATE);
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_NOW_REFRESH, 1);
                SystemNoticeManager.instance.addNotice("????????????", false);
            } else {
                CommonUtil.noticeError(tuple[WearDesignationReplyFields.result]);
            }
        }

        /*???????????? ??????*/
        private TakeoffDesignationReply(tuple: Protocols.TakeoffDesignationReply): void {
            // console.log("???????????? ??????  ??????...............:   ", tuple);
            if (tuple[ActiveDesignationReplyFields.result] == 0) {
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_UPDATE);
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_NOW_REFRESH, 2);
                SystemNoticeManager.instance.addNotice("????????????", false);
            } else {
                CommonUtil.noticeError(tuple[TakeoffDesignationReplyFields.result]);
            }
        }
    }
}