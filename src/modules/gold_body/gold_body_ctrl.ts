/**
 * 金身控制器
 * */


namespace modules.goldBody {
    import CommonUtil = modules.common.CommonUtil;
    import BaseCtrl = modules.core.BaseCtrl;
    import GetSoulInfoReply = Protocols.GetSoulInfoReply;
    import GetSoulInfoReplyFields = Protocols.GetSoulInfoReplyFields;
    import RiseSoulReplyFields = Protocols.RiseSoulReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class GoldBodyCtrl extends BaseCtrl {
        private static _instance: GoldBodyCtrl;

        public static get instance(): GoldBodyCtrl {
            return this._instance = this._instance || new GoldBodyCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            // 金身信息获取
            Channel.instance.subscribe(SystemClientOpcode.GetSoulInfoReply, this, this.getSoulInfoReply);
            // 金身信息更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateSoulInfo, this, this.updateSoulInfo);
            // 金身修炼
            Channel.instance.subscribe(SystemClientOpcode.RefineSoulReply, this, this.refineSoulReply);
            // 不败金身修炼
            Channel.instance.subscribe(SystemClientOpcode.RiseSoulReply, this, this.riseSoulReply);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.redPointControl);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.redPointControl);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getSoulInfo();
        }

        // 获取金身信息
        public getSoulInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSoulInfo, null);
        }

        //控制金身外部红点
        private redPointControl(): void {
            GoldBodyModel.instance.checkRefineCanTraining();
        }

        // 返回金身信息
        private getSoulInfoReply(tuple: GetSoulInfoReply): void {
            GoldBodyModel.instance.dataInit(tuple[GetSoulInfoReplyFields.refine], tuple[GetSoulInfoReplyFields.rise], tuple[GetSoulInfoReplyFields.attr]);
        }

        // 金身更新
        private updateSoulInfo(tuple: Protocols.UpdateSoulInfo): void {
            GoldBodyModel.instance.updateSoulInfo(tuple);
        }

        /**
         * 请求金身修炼
         * @type 修炼的金身类型
         */
        public refineSoul(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.RefineSoul, [type]);
        }

        // 返回金身修炼
        private refineSoulReply(tuple: Protocols.RefineSoulReply): void {
            let result = tuple[Protocols.RefineSoulReplyFields.result];
            // console.log("result", result);
            
            if (result != 0)
                CommonUtil.noticeError(result);
        }

        /**
         * 请求不败金身修炼
         */
        public riseSoul(): void {
            Channel.instance.publish(UserFeatureOpcode.RiseSoul, null);
        }

        // 返回不败金身修炼
        private riseSoulReply(tuple: Protocols.RiseSoulReply): void {
            let result: number = tuple[RiseSoulReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                this.redPointControl();
            }
        }
    }
}