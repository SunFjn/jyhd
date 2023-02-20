/////<reference path="../$.ts"/>
/** 仙丹 */
namespace modules.xianDan {
    import GetXianDanInfoReply = Protocols.GetXianDanInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import OneKeyUseXianDanReply = Protocols.OneKeyUseXianDanReply;
    import OneKeyUseXianDanReplyFields = Protocols.OneKeyUseXianDanReplyFields;
    import XianDanCfg = modules.config.XianDanCfg;
    import GetXianDanListReply = Protocols.GetXianDanListReply;
    import GetXianDanListReplyFields = Protocols.GetXianDanListReplyFields;

    export class XianDanCtrl extends BaseCtrl {
        private static _instance: XianDanCtrl;
        public static get instance(): XianDanCtrl {
            return this._instance = this._instance || new XianDanCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetXianDanInfoReply, this, this.getXianDanInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXianDanListReply, this, this.getXianDanListReply);
            Channel.instance.subscribe(SystemClientOpcode.OneKeyUseXianDanReply, this, this.oneKeyUseXianDanReply);

            GlobalData.dispatcher.on(CommonEventType.MAGIC_POSITION_UPDATE, XianDanModel.instance, XianDanModel.instance.checkRP);
            GlobalData.dispatcher.on(CommonEventType.VIP_UPDATE, XianDanModel.instance, XianDanModel.instance.checkRP);
            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
         */
        public requsetAllData(): void {
            this.getXianDanInfo();
            this.getXianDanList();
        }

        public getXianDanInfo(): void {
            let sIds: number[] = XianDanCfg.instance.sIds;
            for (let id of sIds) {
                Channel.instance.publish(UserFeatureOpcode.GetXianDanInfo, [id]);
            }
        }
        private getXianDanInfoReply(tuple: GetXianDanInfoReply): void {
            XianDanModel.instance.updateInfo(tuple);
        }

        public getXianDanList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianDanList, null);
        }
        public getXianDanListReply(tuple: GetXianDanListReply): void {
            XianDanModel.instance.items = tuple[GetXianDanListReplyFields.idList];
        }

        public oneKeyUseXianDan(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.OneKeyUseXianDan, [type]);
        }

        private oneKeyUseXianDanReply(tuple: OneKeyUseXianDanReply): void {
            let code: number = tuple[OneKeyUseXianDanReplyFields.result];
            CommonUtil.codeDispose(code, `使用成功`);
        }
    }
}