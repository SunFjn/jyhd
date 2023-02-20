/**vip控制器 */


namespace modules.vip_new {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemClientOpcode = Protocols.SystemClientOpcode;

    import GetVipFInfoReply = Protocols.GetVipFInfoReply;
    import UpdateVipFInfo = Protocols.UpdateVipFInfo;
    import GetVipFRewardReply = Protocols.GetVipFRewardReply;
    import GetVipFRewardReplyFields = Protocols.GetVipFRewardReplyFields;

    import CommonUtil = modules.common.CommonUtil;
    import GetVipFInfoReplyFields = Protocols.GetVipFInfoReplyFields;
    import UpdateVipFInfoFields = Protocols.UpdateVipFInfoFields;

    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import SceneModel = modules.scene.SceneModel;
    import SceneCfg = modules.config.SceneCfg;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class VipNewCtrl extends BaseCtrl {
        private static _instance: VipNewCtrl;

        public static get instance(): VipNewCtrl {
            return this._instance = this._instance || new VipNewCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            //获取VIP信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetVipFInfoReply, this, this.GetVipFInfoReply);
            //更新VIP信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateVipFInfo, this, this.UpdateVipFInfo);
            //请求领取返回
            Channel.instance.subscribe(SystemClientOpcode.GetVipFRewardReply, this, this.GetVipFRewardReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetVipFInfo();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.vipF) {
                    if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vipF)) {
                        VipNewModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public GetVipFInfo(): void {
            // console.log("VIPF 请求数据...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetVipFInfo, null);
        }
        //请求领取数据
        public GetVipFReward(level: number): void {
            // console.log("VIPF 领取奖励...............:   " + level);
            Channel.instance.publish(UserFeatureOpcode.GetVipFReward, [level]);
        }

        //获取VIP信息返回
        private GetVipFInfoReply(tuple: GetVipFInfoReply): void {
            // console.log("VIPF 获取VIP信息返回...............:   ", tuple);
            VipNewModel.instance.initVipInfo(tuple);
        }

        //更新vip信息
        private UpdateVipFInfo(tuple: UpdateVipFInfo): void {
            console.log("VIPF 更新vip信息...............:   ", tuple);
            if (modules.vip_new.VipNewModel.instance.vipLevel != tuple[UpdateVipFInfoFields.grade] && modules.vip.VipModel.instance.vipLevel == 0) {
                this.showVipAndSvipUpItem();
            }
            VipNewModel.instance.UpdateVipFInfo(tuple);
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
        //领取返回
        private GetVipFRewardReply(tuple: GetVipFRewardReply): void {
            let result = tuple[GetVipFRewardReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                GlobalData.dispatcher.event(CommonEventType.VIPF_GET_REWARD);
            }
        }
    }
}