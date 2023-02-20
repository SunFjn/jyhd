/** 邮件控制器*/

namespace modules.email {
    import BaseCtrl = modules.core.BaseCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetEmailCountReply = Protocols.GetEmailCountReply;
    import GetEmailCountReplyFields = Protocols.GetEmailCountReplyFields;
    import GetEmailsReply = Protocols.GetEmailsReply;
    import UpdateEmailsState = Protocols.UpdateEmailsState;
    import GetEmailsAttachReply = Protocols.GetEmailsAttachReply;
    import UpdateDelEmails = Protocols.UpdateDelEmails;
    import UpdateAddEmails = Protocols.UpdateAddEmails;
    import DelEmailsReply = Protocols.DelEmailsReply;

    export class EmailCtrl extends BaseCtrl {
        private static _instance: EmailCtrl;
        public static get instance(): EmailCtrl {
            return this._instance = this._instance || new EmailCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 邮件批量id信息获取返回
            Channel.instance.subscribe(SystemClientOpcode.GetEmailCountReply, this, this.getEmailCountReply);
            // 邮件具体信息获取返回
            Channel.instance.subscribe(SystemClientOpcode.GetEmailsReply, this, this.getEmailsReply);
            // 邮件状态更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateEmailsState, this, this.updateEmailsState);
            // 批量获取邮件附件返回
            Channel.instance.subscribe(SystemClientOpcode.GetEmailsAttachReply, this, this.getEmailsAttachReply);
            // 批量删除邮件返回
            Channel.instance.subscribe(SystemClientOpcode.UpdateDelEmails, this, this.oneKeyDeleteReply);
            // 增加邮件信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateAddEmails, this, this.updateAddEmail);
            // 删除邮件回应
            Channel.instance.subscribe(SystemClientOpcode.DelEmailsReply, this, this.delEmailsReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.requestEmailCount();
        }

        //请求获取邮件uuid
        private requestEmailCount() {
            Channel.instance.publish(UserCenterOpcode.GetEmailCount, null)
        }

        //邮件uuid回复
        private getEmailCountReply(tuple: GetEmailCountReply) {
            EmailModel.instance.emailUuidUpdate(false, tuple[GetEmailCountReplyFields.uuids]);
        }

        /**
         * 请求获取邮件信息
         */
        public GetEmails(uuid: Array<string>) {
            Channel.instance.publish(UserCenterOpcode.GetEmails, [uuid]);
        }

        //获得对应邮件的信息
        private getEmailsReply(tuple: GetEmailsReply) {
            EmailModel.instance.emailListUpdate(tuple);
        }

        // 阅读邮件，请求服务器更改状态,前端先改变状态
        public readEmail(emailUid: string): void {
            Channel.instance.publish(UserCenterOpcode.ReadEmails, [emailUid]);
            EmailModel.instance.emailStateChange(emailUid);
        }

        //邮件状态更新
        private updateEmailsState(tuple: UpdateEmailsState) {
            EmailModel.instance.emailChangeAttach(tuple);
        }

        /**
         * 请求领取附件
         */
        public getAward(uuid: string): void {
            Channel.instance.publish(UserCenterOpcode.GetEmailsAttachOnce, [uuid]);
        }

        /**
         * 请求一键领取附件
         */
        public getAwardAll(): void {
            Channel.instance.publish(UserCenterOpcode.GetEmailsAttachAll, null);
        }

        //获取邮件附件返回
        private getEmailsAttachReply(tuple: GetEmailsAttachReply) {
            EmailModel.instance.getAttach = false;
            let result = tuple[Protocols.GetEmailsAttachReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
                EmailModel.instance.isChoose = false;
            }
        }

        /**
         * 请求一键删除
         */
        public oneKeyDelete(): void {
            Channel.instance.publish(UserCenterOpcode.DelEmails, null);
        }

        //一键删除返回结果，更新uuid列表并显示
        private oneKeyDeleteReply(tuple: UpdateDelEmails): void {
            EmailModel.instance.emailDeleteChange(tuple);
        }

        //删除邮件返回结果，与一键删除相同
        private delEmailsReply(tuple: DelEmailsReply): void {
            let result = tuple[Protocols.DelEmailsReplyFields.result];
            EmailModel.instance.deleteEmail = false;
            if (result != 0) {
                CommonUtil.noticeError(result);
            }
        }

        //游戏中增加邮件
        private updateAddEmail(tuple: UpdateAddEmails) {
            EmailModel.instance.addUuidAndEmailData(tuple);
        }
    }
}