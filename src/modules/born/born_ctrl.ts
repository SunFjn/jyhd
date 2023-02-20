namespace modules.born {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import EraReply = Protocols.EraReply;
    import EraReplyFields = Protocols.EraReplyFields;
    import GetEraInfoReply = Protocols.GetEraInfoReply;
    import CommonUtil = modules.common.CommonUtil;
    import FastEraReply = Protocols.FastEraReply;
    import FastEraReplyFields = Protocols.FastEraReplyFields;
    import DrawEraTaskReply = Protocols.DrawEraTaskReply;
    import DrawEraTaskReplyFields = Protocols.DrawEraTaskReplyFields;

    export class BornCtrl extends BaseCtrl {

        private static _instance: BornCtrl;
        public static get instance(): BornCtrl {
            return this._instance = this._instance || new BornCtrl();
        }

        public setup(): void {

            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetEraInfoReply, this, this.getEraInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateEraInfo, this, this.updateInfo);
            Channel.instance.subscribe(SystemClientOpcode.EraReply, this, this.errReply);
            Channel.instance.subscribe(SystemClientOpcode.FastEraReply, this, this.fastEraReply);
            Channel.instance.subscribe(SystemClientOpcode.DrawEraTaskReply, this, this.drawEraTaskReply);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, BornModel.instance, BornModel.instance.checkRP);
            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.getEraInfo();
        }

        public getEraInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetEraInfo, null);
        }

        private getEraInfoReply(tuple: GetEraInfoReply): void {
            if (!tuple) {
                throw new Error(`协议 ${SystemClientOpcode.GetEraInfoReply} 觉醒信息返回包为空`);
            }
            BornModel.instance.updateInfo(tuple);
        }

        private updateInfo(tuple: GetEraInfoReply): void {
            if (!tuple) {
                throw new Error(`协议 ${SystemClientOpcode.UpdateEraInfo} 觉醒信息更新包为空`);
            }
            BornModel.instance.updateInfo(tuple);
        }

        public era(): void {
            Channel.instance.publish(UserFeatureOpcode.Era, null);
        }
        private errReply(tuple: EraReply): void {
            let code: number = tuple[EraReplyFields.result];
            CommonUtil.codeDispose(code, `觉醒成功`);
        }

        public fastEra(): void {
            Channel.instance.publish(UserFeatureOpcode.FastEra, null);
        }
        public fastEraReply(tuple: FastEraReply): void {
            let code: number = tuple[FastEraReplyFields.result];
            if (!code) {
                WindowManager.instance.close(WindowEnum.BORN_ALERT);
            }
            CommonUtil.codeDispose(code, `使用成功`);
        }

        public drawEraTask(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.DrawEraTask, [id]);
        }
        public drawEraTaskReply(tuple: DrawEraTaskReply): void {
            let code: number = tuple[DrawEraTaskReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }
    }
}