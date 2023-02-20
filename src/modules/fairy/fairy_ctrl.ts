/////<reference path="../$$.ts"/>
/** 护送仙女协议处理 */
namespace modules.fairy {
    import WindowManager = modules.core.WindowManager;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserChatOpcode = Protocols.UserChatOpcode;
    import GetFairyInfoReply = Protocols.GetFairyInfoReply;
    import RefreshFairyReply = Protocols.RefreshFairyReply;
    import RefreshFairyReplyFields = Protocols.RefreshFairyReplyFields;
    import InterceptFairyReply = Protocols.InterceptFairyReply;
    import InterceptFairyReplyFields = Protocols.InterceptFairyReplyFields;
    import GetFairyLogReply = Protocols.GetFairyLogReply;
    import EscortFairyReply = Protocols.EscortFairyReply;
    import EscortFairyReplyFields = Protocols.EscortFairyReplyFields;
    import SelectFairyReply = Protocols.SelectFairyReply;
    import SelectFairyReplyFields = Protocols.SelectFairyReplyFields;
    import GetFairyAwardReply = Protocols.GetFairyAwardReply;
    import GetFairyAwardReplyFields = Protocols.GetFairyAwardReplyFields;
    import UpdateFairyLog = Protocols.UpdateFairyLog;
    import CommonUtil = modules.common.CommonUtil;

    export class FairyCtrl extends BaseCtrl {
        private static _instance: FairyCtrl;
        public static get instance(): FairyCtrl {
            return this._instance = this._instance || new FairyCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetFairyInfoReply, this, this.updateFairyInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFairyInfo, this, this.updateFairyInfo);
            Channel.instance.subscribe(SystemClientOpcode.RefreshFairyReply, this, this.refreshFairyReply);
            Channel.instance.subscribe(SystemClientOpcode.InterceptFairyReply, this, this.interceptFairyReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFairyLogReply, this, this.getFairyLogReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFairyLog, this, this.updateFairyLog);
            Channel.instance.subscribe(SystemClientOpcode.EscortFairyReply, this, this.escortFairyReply);
            Channel.instance.subscribe(SystemClientOpcode.SelectFairyReply, this, this.selectFairyReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFairyAwardReply, this, this.getFairyAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFairyEscortListReply, this, this.getFairyEscortListReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateOtherFairyInfo, this, this.updateOtherFairyInfo);

            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getFairyInfo();
        }

        //获取仙女信息
        public getFairyInfo(): void {
            // console.log("获取仙女信息................" + GlobalData.serverTime + "    " + Browser.now());
            Channel.instance.publish(UserFeatureOpcode.GetFairyInfo, null);
        }

        //获取仙女信息返回
        private updateFairyInfo(tuple: GetFairyInfoReply): void {
            // console.log("获取仙女信息返回................" + "    " + Browser.now());
            // console.log("获取仙女信息返回..结束时间戳................" +tuple[GetFairyInfoReplyFields.endTime]);
            // console.log("获取仙女信息返回..服务器时间戳................" +GlobalData.serverTime );
            // console.log("获取仙女信息返回..时间差................" +(tuple[GetFairyInfoReplyFields.endTime]-GlobalData.serverTime));
            FairyModel.instance.getFairyInfoReply(tuple);
        }

        /**请求仙女护送列表 */
        public getFairyEscortList(): void {
            // console.log("请求仙女护送列表................" + GlobalData.serverTime + "    " + Browser.now());
            Channel.instance.publish(UserChatOpcode.GetFairyEscortList, [PlayerModel.instance.actorId, 0]);
        }

        //请求仙女护送列表返回
        public getFairyEscortListReply(tuple: Protocols.GetFairyEscortListReply): void {
            // let list:Array<Protocols.FairyEscore> = tuple[Protocols.GetFairyEscortListReplyFields.escortList];
            // for(let i:int=0;i<list.length;i++){
            //     console.log(`玩家${list[i][Protocols.FairyEscoreFields.name]}`);
            //     console.log(`仙女id----${list[i][Protocols.FairyEscoreFields.id]}`);
            // }
            // console.log(`-------------------分割----------------`);
            // console.log(`                                           `);
            // console.log("请求仙女护送列表返回................" + GlobalData.serverTime + "    " + Browser.now() + "    " + tuple);
            FairyModel.instance.getFairyEscortListReply(tuple);
        }

        /**刷新仙女 */
        public refreshFairy(): void {
            Channel.instance.publish(UserFeatureOpcode.RefreshFairy, null);
        }

        //刷新仙女返回
        public refreshFairyReply(tuple: RefreshFairyReply): void {
            let code: number = tuple[RefreshFairyReplyFields.code];
            if (!code) {
                SystemNoticeManager.instance.addNotice(`刷新成功`);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //获取仙女护送日志
        public getFairyLog(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFairyLog, null);
        }

        //获取仙女护送日志返回
        public getFairyLogReply(tuple: GetFairyLogReply): void {
            FairyModel.instance.getFairyLogReply(tuple);
        }

        //刷新仙女护送日志
        public updateFairyLog(tuple: UpdateFairyLog): void {
            FairyModel.instance.updateFairyLog(tuple);
            if (WindowManager.instance.isOpened(WindowEnum.FAIRY_PANEL) &&
                tuple[Protocols.UpdateFairyLogFields.log][Protocols.FairyLogFields.result]) {
                WindowManager.instance.open(WindowEnum.FAIRY_HOLD_SUCCEED_ALERT);
            }
        }

        /**获取其他仙女面板信息 自身id 平台id  查看的目标id*/
        public getFairyPanelInfo(tuple: Protocols.GetFairyPanelInfo): void {
            Channel.instance.publish(UserChatOpcode.GetFairyPanelInfo, tuple);
        }

        /**关闭其他仙女面板信息 自身id  查看的目标id*/
        public delFairyPanelInfoRecord(tuple: Protocols.DelFairyPanelInfoRecord): void {
            Channel.instance.publish(UserChatOpcode.DelFairyPanelInfoRecord, tuple);
        }

        //更新面板信息
        public updateOtherFairyInfo(tuple: Protocols.UpdateOtherFairyInfo): void {
            FairyModel.instance.updateOtherFairyInfo(tuple);
        }

        /** 护送仙女*/
        public escortFairy(): void {
            // console.log("请求护送仙女................" + GlobalData.serverTime + "    " + Browser.now());
            Channel.instance.publish(UserFeatureOpcode.EscortFairy, null);

        }
        //护送仙女返回
        public escortFairyReply(tuple: EscortFairyReply): void {
            let code: number = tuple[EscortFairyReplyFields.code];
            if (!code) {
                SystemNoticeManager.instance.addNotice(`开始护送`);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        /** 拦截仙女*/
        public interceptFairy(tuple: Protocols.InterceptFairy): void {
            Channel.instance.publish(UserFeatureOpcode.InterceptFairy, tuple);
        }

        //拦截仙女返回
        private interceptFairyReply(tuple: InterceptFairyReply): void {
            let code: number = tuple[InterceptFairyReplyFields.code];
            if (!code) {
                SystemNoticeManager.instance.addNotice(`开始拦截`);
                WindowManager.instance.close(WindowEnum.FAIRY_SEND_ALERT);
                WindowManager.instance.close(WindowEnum.FAIRY_PANEL);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        /** 选择最好的那个仙女*/
        public selectBestFairy(): void {
            Channel.instance.publish(UserFeatureOpcode.SelectFairy, null);
        }

        //选择最好的那个仙女返回
        private selectFairyReply(tuple: SelectFairyReply): void {
            let code: number = tuple[SelectFairyReplyFields.code];
            if (!code) {
                SystemNoticeManager.instance.addNotice(`选择最高品质仙女`);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //领取仙女护送奖励
        public getFairyAward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFairyAward, null);
        }

        //领取仙女护送奖励返回
        public getFairyAwardReply(tuple: GetFairyAwardReply): void {
            let code: number = tuple[GetFairyAwardReplyFields.code];
            if (!code) {
                SystemNoticeManager.instance.addNotice(`领取奖励成功`);
            } else {
                CommonUtil.noticeError(code);
            }
        }
    }
}