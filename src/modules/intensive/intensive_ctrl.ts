namespace modules.intensive {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetStrongInfoReply = Protocols.GetStrongInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RefineStrongReply = Protocols.RefineStrongReply;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import RefineStrongOfAllReply = Protocols.RefineStrongOfAllReply;
    import RiseStrongReply = Protocols.RiseStrongReply;
    import RefineStrongOfAllReplyFields = Protocols.RefineStrongOfAllReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class IntensiveCtrl extends BaseCtrl {

        private static _instance: IntensiveCtrl;
        public static get instance(): IntensiveCtrl {
            return this._instance = this._instance || new IntensiveCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetStrongInfoReply, this, this.infoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateStrongInfo, this, this.infoReply);
            Channel.instance.subscribe(SystemClientOpcode.RefineStrongReply, this, this.upGradeReply);
            Channel.instance.subscribe(SystemClientOpcode.RefineStrongOfAllReply, this, this.oneKeyUpGradeReply);
            Channel.instance.subscribe(SystemClientOpcode.RiseStrongReply, this, this.masterReply);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIPS, this, this.updateEquip);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateEquip);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetStrongInfo, null);
        }

        //更新
        private infoReply(tuple: GetStrongInfoReply): void {
            IntensiveModel.instance.updateValue(tuple);
        }

        //强化
        public upGrade(part: number): void {
            Channel.instance.publish(UserFeatureOpcode.RefineStrong, [part]);
        }

        //强化返回
        private upGradeReply(tuple: RefineStrongReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("强化成功");
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong12.png");
                GlobalData.dispatcher.event(CommonEventType.INTENSIVE_SUCCESS, 0);
                IntensiveModel.instance.setDotDis();
            } else
                CommonUtil.noticeError(tuple[0]);
        }

        //一键强化
        public oneKeyUpGrade(): void {
            Channel.instance.publish(UserFeatureOpcode.RefineStrongOfAll, null);
        }

        //一键强化返回
        private oneKeyUpGradeReply(tuple: RefineStrongOfAllReply): void {

            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("强化成功");
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong12.png");
                IntensiveModel.instance.setDotDis();
                GlobalData.dispatcher.event(CommonEventType.INTENSIVE_SUCCESS, [tuple[RefineStrongOfAllReplyFields.parts]]);
            } else
                CommonUtil.noticeError(tuple[0]);

        }

        //升级大师和神匠
        private masterReply(tuple: RiseStrongReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("升阶成功");
                IntensiveModel.instance.setDotDis();
                GlobalData.dispatcher.event(CommonEventType.UPGRADE_SUCCESS);
            } else
                CommonUtil.noticeError(tuple[0]);
        }

        //更新背包
        private updateBag(): void {
            IntensiveModel.instance.setDotDis();
        }

        //更新金币
        private updateMoney(): void {
            IntensiveModel.instance.setDotDis();
        }

        //更新装备事件
        private updateEquip(): void {
            IntensiveModel.instance.setDotDis();
        }
    }
}
