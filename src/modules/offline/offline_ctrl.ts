namespace modules.Offline {

    import BaseCtrl = modules.core.BaseCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GuideModel = modules.guide.GuideModel;

    export class OfflineCtrl extends BaseCtrl {
        private static _instance: OfflineCtrl;
        public static get instance(): OfflineCtrl {
            return this._instance = this._instance || new OfflineCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            //获取离线收益
            Channel.instance.subscribe(SystemClientOpcode.GetOutlineInfoReply, this, this.getOutlineInfoReply);
           
            // GlobalData.dispatcher.on(CommonEventType.GUIDE_CUR_UPDATE, this, this.checkGuide);
            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetOutlineInfo, null);
            this.checkGuide();
        }

        private checkGuide(): void {
            if (GuideModel.instance.curGuide) {
                WindowManager.instance.close(WindowEnum.OFFLINE_PROFIT_ALERT);
            }
        }

        private getOutlineInfoReply(tuple: Protocols.GetOutlineInfoReply) {
            if (GuideModel.instance.curGuide) return;
            let blendCfg: Configuration.blend = BlendCfg.instance.getCfgById(BlenId.outlineTime);
            OfflineModel.instance.getOutlineInfoReply(tuple);
            let timeNum = blendCfg[Configuration.blendFields.intParam][1];
            // console.log("离线时间：" + tuple[Protocols.GetOutlineInfoReplyFields.tm]);
            // console.log("离线时间必须大于timeNum：" + timeNum);
            if (tuple[Protocols.GetOutlineInfoReplyFields.tm] > timeNum) {
                WindowManager.instance.openDialog(WindowEnum.OFFLINE_PROFIT_ALERT);
            }
        }
    }
}