///<reference path="../config/privilege_cfg.ts"/>

/**VIP数据 */
namespace modules.vip {

    import GetVipInfoReply = Protocols.GetVipInfoReply;
    import GetVipInfoReplyFields = Protocols.GetVipInfoReplyFields;
    import UpdateVipInfo = Protocols.UpdateVipInfo;
    import UpdateVipInfoFields = Protocols.UpdateVipInfoFields;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PrivilegeData = Protocols.PrivilegeData;
    import PrivilegeDataFields = Protocols.PrivilegeDataFields;

    import GetCumulateSuperVipTaskFields = Protocols.GetCumulateSuperVipTaskFields;
    import GetCumulateSuperVipTask = Protocols.GetCumulateSuperVipTask;
    import GetCumulateSuperVipReplyFields = Protocols.GetCumulateSuperVipReplyFields;
    import GetCumulateSuperVipReply = Protocols.GetCumulateSuperVipReply;

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    export class VipModel {

        private static _instance: VipModel;
        public static get instance(): VipModel {
            return this._instance = this._instance || new VipModel();
        }

        public maxVipLevel: number;
        public haveNum: number;
        public needNum: number;
        public vipLevel: number;
        public dayRewardState: boolean;
        public vipRange: Array<number>;
        public _superVipStatus: GetCumulateSuperVipReply;

        private rewardList: Array<number>;
        private privilegeInfo: Array<PrivilegeData>;
        private privilegeInfoDic: Table<PrivilegeData>;

        constructor() {
            this.privilegeInfo = new Array<PrivilegeData>();
            this.privilegeInfoDic = {};
            this.vipLevel = 0;
        }

        public initVipInfo(tuple: GetVipInfoReply): void {
            this.rewardList = new Array<number>();
            this.maxVipLevel = PrivilegeCfg.instance.getVipMaxLevel();
            this.vipLevel = tuple[GetVipInfoReplyFields.grade];
            this.dayRewardState = tuple[GetVipInfoReplyFields.dayRewardState];
            this.haveNum = tuple[GetVipInfoReplyFields.curExp];
            this.rewardList = tuple[GetVipInfoReplyFields.rewardList];
            this.setNeedNum();
            this.checkHasRP();
            this.setActionOpen();
            this.setPrivilegeRange();
            GlobalData.dispatcher.event(CommonEventType.VIP_UPDATE);
        }

        public updateVipInfo(tuple: UpdateVipInfo): void {

            this.vipLevel = tuple[UpdateVipInfoFields.grade];
            this.haveNum = tuple[UpdateVipInfoFields.curExp];
            this.rewardList = tuple[UpdateVipInfoFields.rewardList];
            this.dayRewardState = tuple[UpdateVipInfoFields.dayRewardState];
            this.setNeedNum();
            this.checkHasRP();
            this.setActionOpen();
            GlobalData.dispatcher.event(CommonEventType.VIP_UPDATE);
        }
        public setActionOpen() {
            // let vipNewLevel = modules.vip_new.VipNewModel.instance.getVipLevelTrue();
            // let _openState = (vipNewLevel >= 10 || this.vipLevel >= 1) ? ActionOpenState.open : ActionOpenState.close;
            // modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.vip, _openState);
        }

        //检测超级vip红点
        private checkAchievementRP(): void {
            // let t1: GetCumulateSuperVipTask = this._superVipStatus[GetCumulateSuperVipReplyFields.dayTotalMoney];
            // let t2: GetCumulateSuperVipTask = this._superVipStatus[GetCumulateSuperVipReplyFields.totalMoney];
            // let t1_achieved: boolean = t1[GetCumulateSuperVipTaskFields.build] >= t1[GetCumulateSuperVipTaskFields.quota];
            // let t2_achieved: boolean = t2[GetCumulateSuperVipTaskFields.build] >= t2[GetCumulateSuperVipTaskFields.quota];

            RedPointCtrl.instance.setRPProperty("theSuperVipRP", this._superVipStatus[GetCumulateSuperVipReplyFields.getState] == 1);
        }

        //设置超级vip进度状态
        public setSuperVipStatus(statusData: GetCumulateSuperVipReply): void {
            this._superVipStatus = statusData;

            //红点检测
            this.checkAchievementRP();

            //派发事件，更新界面
            GlobalData.dispatcher.event(CommonEventType.SUPERVIP_STATUS_INFO_CHANGE);
        }

        //获取超级vip进度状态
        public getSuperVipStatus(): GetCumulateSuperVipReply {
            return this._superVipStatus;
        }

        //设置需要数量
        private setNeedNum(): void {
            this.needNum = this.getVipCfgByLevel(this.vipLevel)[privilegeFields.exp];
        }

        //获取表数据
        public getVipCfgByLevel(level: number): privilege {
            return PrivilegeCfg.instance.getCfgByType(level);
        }

        //检测是否有数据
        public checkHasRP(): void {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vip)) {
                this.checkReward();
            }
        }

        //判断是否能有奖励
        private checkReward(): void {
            let isLingQu = false;
            for (let i = 1; i <= this.vipLevel; i++) {
                if (this.checkCanReceive(i) == 1) {
                    isLingQu = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("vipRP", ((isLingQu || !VipModel.instance.dayRewardState) && VipModel.instance.vipLevel > 0));
        }

        //检测是否可领
        public checkCanReceive(level: number): number {  //0前往,1可领，2已领
            if (level <= this.vipLevel) {
                if (this.rewardList && this.rewardList.length > 0) {
                    for (let i = 0; i < this.rewardList.length; i++) {
                        if (level == this.rewardList[i]) {
                            return 2;
                        }
                    }
                }
                return 1;
            } else {
                return 0;
            }
        }

        //可以领取的最小数值
        public getCanGetAward(): number {
            for (let i = 1; i < this.maxVipLevel; i++) {
                if (this.checkCanReceive(i) != 2) {
                    return i;
                }
            }
            return this.maxVipLevel;
        }

        public setPrivilegeInfo(value: Array<PrivilegeData>): void {
            this.privilegeInfo = value;
            for (let i = 0; i < this.privilegeInfo.length; i++) {
                let id = this.privilegeInfo[i][PrivilegeDataFields.id];
                let data: PrivilegeData = this.privilegeInfo[i];
                this.privilegeInfoDic[id] = data;
            }
            GlobalData.dispatcher.event(CommonEventType.UPDATE_PRIVILEGE);
        }

        public updatePrivilegeInfo(value: Array<PrivilegeData>): void {
            this.privilegeInfo = value;
            for (let i = 0; i < this.privilegeInfo.length; i++) {
                let id = this.privilegeInfo[i][PrivilegeDataFields.id];
                let data: PrivilegeData = this.privilegeInfo[i];
                this.privilegeInfoDic[id] = data;
            }
            GlobalData.dispatcher.event(CommonEventType.UPDATE_PRIVILEGE);
        }

        public getPrivilegeInfoById(id: number): PrivilegeData {
            return this.privilegeInfoDic[id]
        }

        //设置svip可查看范围配置
        private setPrivilegeRange() {
            this.vipRange = BlendCfg.instance.getCfgById(60001)[blendFields.intParam]; //从表中获取数据
        }

        //获取svip可查看范围配置
        public getPrivilegeRange(): number {
            if (this.vipRange && this.vipLevel >= 0) {
                return this.vipRange[this.vipLevel];
            }
            return 0;
        }
    }
}
