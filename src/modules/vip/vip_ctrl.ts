/**vip控制器 */


namespace modules.vip {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import GetVipInfoReply = Protocols.GetVipInfoReply;
    import UpdateVipInfo = Protocols.UpdateVipInfo;
    import GetVipRewardReply = Protocols.GetVipRewardReply;
    import GetVipRewardReplyFields = Protocols.GetVipRewardReplyFields;
    import UpdatePrivilege = Protocols.UpdatePrivilege;
    import GetPrivilegeReply = Protocols.GetPrivilegeReply;
    import GetPrivilegeReplyFields = Protocols.GetPrivilegeReplyFields;
    import UpdatePrivilegeFields = Protocols.UpdatePrivilegeFields;
    import GetVipDayRewardReply = Protocols.GetVipDayRewardReply;
    import GetVipDayRewardReplyFields = Protocols.GetVipDayRewardReplyFields;
    import GetCumulateSuperVipReply = Protocols.GetCumulateSuperVipReply;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetVipInfoReplyFields = Protocols.GetVipInfoReplyFields;
    import UpdateVipInfoFields = Protocols.UpdateVipInfoFields;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PrivilegeData = Protocols.PrivilegeData;
    import PrivilegeDataFields = Protocols.PrivilegeDataFields;
    import SceneModel = modules.scene.SceneModel;
    import SceneCfg = modules.config.SceneCfg;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    export class VipCtrl extends BaseCtrl {
        private static _instance: VipCtrl;

        public static get instance(): VipCtrl {
            return this._instance = this._instance || new VipCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            //获取VIP信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetVipInfoReply, this, this.getVipInfoReply);
            //更新VIP信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateVipInfo, this, this.updateVipInfo);
            //请求领取返回
            Channel.instance.subscribe(SystemClientOpcode.GetVipRewardReply, this, this.getVipRewardReply);
            //获取对应的特权次数
            Channel.instance.subscribe(SystemClientOpcode.UpdatePrivilege, this, this.updatePrivilege);
            Channel.instance.subscribe(SystemClientOpcode.GetPrivilegeReply, this, this.getPrivilegeReply);
            Channel.instance.subscribe(SystemClientOpcode.GetVipDayRewardReply, this, this.getVipDayRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetCumulateSuperVipReply, this, this.getCumulateSuperVipReply);
            //玩家登陆后获取数据
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.redPointControl);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            GlobalData.dispatcher.on(CommonEventType.VIPF_UPDATE, this, VipModel.instance.setActionOpen);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getPrivilege();
            this.getVIPInfo();
            this.getSuperVIPInfo();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.vip) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vip)) {
                        VipModel.instance.setActionOpen();
                        VipModel.instance.checkHasRP();
                        return;
                    }
                }
            }
        }

        private getPrivilege(): void {
            Channel.instance.publish(UserFeatureOpcode.GetPrivilege, null);
        }

        public getVipDayReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetVipDayReward, null);
        }

        private getVIPInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetVipInfo, null);
        }
        
        private getSuperVIPInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.SuperVipStatusRequest, null);
        }

        private redPointControl(): void {
            VipModel.instance.checkHasRP();
        }

        //超级vip状态返回
        private getCumulateSuperVipReply(tuple: GetCumulateSuperVipReply): void {
            VipModel.instance.setSuperVipStatus(tuple);
        }

        //领取vip每日奖励返回
        private getVipDayRewardReply(tuple: GetVipDayRewardReply): void {
            let result = tuple[GetVipDayRewardReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {

            }
        }

        //获取VIP信息返回
        private getVipInfoReply(tuple: GetVipInfoReply): void {
            VipModel.instance.initVipInfo(tuple);
        }

        //更新vip信息
        private updateVipInfo(tuple: UpdateVipInfo): void {
            if (modules.vip.VipModel.instance.vipLevel != tuple[UpdateVipInfoFields.grade]) {
                this.showVipAndSvipUpItem();
            }
            VipModel.instance.updateVipInfo(tuple);
        }
        public showVipAndSvipUpItem() {
            modules.vip_new.VipNewModel.instance.isUp = true;
            let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            if (type === SceneTypeEx.common) {
                if (!modules.scene.SceneModel.instance.isInMission) {
                    WindowManager.instance.open(WindowEnum.VIP_SVIP_UP_ALERT);
                    modules.vip_new.VipNewModel.instance.isUp = false;

                }
            }
        }
        //请求领取数据
        public getVipReward(level: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetVipReward, [level]);
        }

        //领取返回
        private getVipRewardReply(tuple: GetVipRewardReply): void {
            let result = tuple[GetVipRewardReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                GlobalData.dispatcher.event(CommonEventType.VIP_GET_REWARD);
            }
        }

        private getPrivilegeReply(tuple: GetPrivilegeReply) {
            VipModel.instance.setPrivilegeInfo(tuple[GetPrivilegeReplyFields.privileList]);
        }

        private updatePrivilege(tuple: UpdatePrivilege) {
            VipModel.instance.updatePrivilegeInfo(tuple[UpdatePrivilegeFields.privileList]);
        }
    }
}