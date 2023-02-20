///<reference path="../config/privilege_cfg.ts"/>

/**VIP数据 */
namespace modules.vip_new {

    import GetVipFInfoReply = Protocols.GetVipFInfoReply;
    import GetVipFInfoReplyFields = Protocols.GetVipFInfoReplyFields;
    import UpdateVipFInfo = Protocols.UpdateVipFInfo;
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
    export class VipNewModel {

        private static _instance: VipNewModel;
        public static get instance(): VipNewModel {
            return this._instance = this._instance || new VipNewModel();
        }

        public maxVipLevel: number;
        public haveNum: number;
        public needNum: number;
        public vipLevel: number;
        private rewardList: Array<number>;
        public isUp: boolean;
        constructor() {
            this.maxVipLevel = PrivilegeCfg.instance.getVipFMaxLevel();
            this.haveNum = 0;
            this.needNum = 0;
            this.vipLevel = 50;
            this.isUp = false;
        }

        public initVipInfo(tuple: GetVipFInfoReply): void {
            this.rewardList = new Array<number>();
            this.vipLevel = tuple[GetVipFInfoReplyFields.grade];
            this.haveNum = tuple[GetVipFInfoReplyFields.curExp];
            this.rewardList = tuple[GetVipFInfoReplyFields.rewardList];
            this.setNeedNum();
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.VIPF_UPDATE);

        }

        public UpdateVipFInfo(tuple: UpdateVipFInfo): void {
       
            this.vipLevel = tuple[UpdateVipFInfoFields.grade];
            this.haveNum = tuple[UpdateVipFInfoFields.curExp];
            this.rewardList = tuple[UpdateVipFInfoFields.rewardList];
            this.setNeedNum();
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.VIPF_UPDATE);
        }


        /**
         * 获取真实的vip等级
         */
        public getVipLevelTrue(): number {
            return this.vipLevel - 50;
        }
        public getLevelTrue(lv: number): number {
            let lvd = lv - 50;
            lvd = lvd < 0 ? 0 : lvd;
            return lvd;
        }
        //设置需要数量
        private setNeedNum(): void {
            if (this.getVipCfgByLevel(this.vipLevel)) {
                this.needNum = this.getVipCfgByLevel(this.vipLevel)[privilegeFields.exp];
            }
            else {
                this.needNum = 0;
            }
        }

        //获取表数据
        public getVipCfgByLevel(level: number): privilege {
            return PrivilegeCfg.instance.getCfgByType(level);
        }
        public setRP() {
            let bolll = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vipF);
            let isHave = this.checkReward();
            RedPointCtrl.instance.setRPProperty("vipNewRP", ((isHave) && bolll));
        }
        //判断是否能有奖励
        private checkReward(): boolean {
            for (let i = 51; i <= this.vipLevel; i++) {
                if (this.checkCanReceive(i) == 1) {
                    return true;
                }
            }
            return false;
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
            for (let i = 51; i < this.maxVipLevel; i++) {
                if (this.checkCanReceive(i) != 2) {
                    return i;
                }
            }
            return this.maxVipLevel;
        }
    }
}
