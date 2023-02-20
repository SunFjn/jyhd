///<reference path="../config/xianfu_animal_cfg.ts"/>
///<reference path="../effect/success_effect_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>

/** 仙府-家园 */
namespace modules.xianfu {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateXianFuInfo = Protocols.UpdateXianFuInfo;
    import UpgradeXianFuReply = Protocols.UpgradeXianFuReply;
    import UpgradeXianFuReplyFields = Protocols.UpgradeXianFuReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetBuildingInfo = Protocols.GetBuildingInfo;
    import UpdateBuildingInfo = Protocols.UpdateBuildingInfo;
    import GetBuildProduceAward = Protocols.GetBuildProduceAward;
    import GetBuildProduceAwardReply = Protocols.GetBuildProduceAwardReply;
    import GetBuildProduceAwardReplyFields = Protocols.GetBuildProduceAwardReplyFields;
    import MakeItem = Protocols.MakeItem;
    import MakeItemReply = Protocols.MakeItemReply;
    import MakeItemReplyFields = Protocols.MakeItemReplyFields;
    import UpdateProduceCoin = Protocols.UpdateProduceCoin;
    import GetSpiritAnimalTravel = Protocols.GetSpiritAnimalTravel;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import GetXianFuInfoReply = Protocols.GetXianFuInfoReply;
    import Travel = Protocols.Travel;
    import TravelReply = Protocols.TravelReply;
    import TravelReplyFields = Protocols.TravelReplyFields;
    import BuyTravelItem = Protocols.BuyTravelItem;
    import BuyTravelItemReply = Protocols.BuyTravelItemReply;
    import BuyTravelItemReplyFields = Protocols.BuyTravelItemReplyFields;
    import TravelFinish = Protocols.TravelFinish;
    import TravelFinishReply = Protocols.TravelFinishReply;
    import TravelFinishReplyFields = Protocols.TravelFinishReplyFields;
    import GetIllustratedHandbookReply = Protocols.GetIllustratedHandbookReply;
    import UpdateIllustratedHandbook = Protocols.UpdateIllustratedHandbook;
    import GetXianFuTaskListReply = Protocols.GetXianFuTaskListReply;
    import GetXianFuTaskAward = Protocols.GetXianFuTaskAward;
    import GetXianFuTaskAwardReply = Protocols.GetXianFuTaskAwardReply;
    import GetXianFuTaskAwardReplyFields = Protocols.GetXianFuTaskAwardReplyFields;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import GetTravelAward = Protocols.GetTravelAward;
    import GetTravelAwardReply = Protocols.GetTravelAwardReply;
    import GetTravelAwardReplyFields = Protocols.GetTravelAwardReplyFields;
    import xianFuEvent = Protocols.XianFuEvent;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import GetXianFuSkillListReply = Protocols.GetXianFuSkillListReply;
    import GetXianFuSkillListReplyFields = Protocols.GetXianFuSkillListReplyFields;
    import PromoteXianFuSkillReplyFields = Protocols.PromoteXianFuSkillReplyFields;
    import PromoteXianFuSkillReply = Protocols.PromoteXianFuSkillReply;
    import MakeItemFinishReplyFields = Protocols.MakeItemFinishReplyFields;
    import MakeItemFinishReply = Protocols.MakeItemFinishReply;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class XianfuCtrl extends BaseCtrl {
        private static _instance: XianfuCtrl;
        public static get instance(): XianfuCtrl {
            return this._instance = this._instance || new XianfuCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuInfoReply, this, this.getXianFuInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateXianFuInfo, this, this.updateXianFuInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpgradeXianFuReply, this, this.upgradeXianFuReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBuildingInfoReply, this, this.updateBuildingInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateBuildingInfo, this, this.updateBuildingInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetBuildProduceAwardReply, this, this.getBuildProduceAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.MakeItemReply, this, this.makeItemReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateProduceCoin, this, this.updateProduceCoin);
            Channel.instance.subscribe(SystemClientOpcode.GetSpiritAnimalTravelReply, this, this.updateSpiritAnimalTravel);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSpiritAnimalTravel, this, this.updateSpiritAnimalTravel);
            Channel.instance.subscribe(SystemClientOpcode.TravelReply, this, this.travelReply);
            Channel.instance.subscribe(SystemClientOpcode.BuyTravelItemReply, this, this.buyTravelItemReply);
            Channel.instance.subscribe(SystemClientOpcode.TravelFinishReply, this, this.travelFinishReply);
            Channel.instance.subscribe(SystemClientOpcode.GetIllustratedHandbookReply, this, this.getIllustratedHandbookReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateIllustratedHandbook, this, this.updateIllustratedHandbook);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuTaskListReply, this, this.updateXianFuTaskState);
            Channel.instance.subscribe(SystemClientOpcode.UpdateXianFuTaskState, this, this.updateXianFuTaskState);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuTaskAwardReply, this, this.getXianFuTaskAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTravelAwardReply, this, this.getTravelAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.XianFuEvent, this, this.xianFuEvent);
            Channel.instance.subscribe(SystemClientOpcode.UpdateXianFuFengShuiInfo, this, this.updateXianFuFengShuiInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuFengShuiInfoReply, this, this.updateXianFuFengShuiInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpgradeFengShuiDecorateReply, this, this.upgradeFengShuiDecorateReply);
            Channel.instance.subscribe(SystemClientOpcode.PromoteIllustratedHandbookReply, this, this.promoteIllustratedHandbookReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuMallReply, this, this.getXianFuMallReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuActivaAwardReply, this, this.getXianFuActivaAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXianFuSkillListReply, this, this.getXianFuSkillListReply);
            Channel.instance.subscribe(SystemClientOpcode.PromoteXianFuSkillReply, this, this.promoteXianFuSkillReply);
            Channel.instance.subscribe(SystemClientOpcode.MakeItemFinishReply, this, this.makeItemFinishReply);


            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.onLoginSuccess();
        }

        private onLoginSuccess(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuInfo, null);
            this.getIllustratedHandbook();
            this.getXianfuTaskList();
            this.getXianFuFengShuiInfo();
            this.requestBuildInfo();
            let ids: number[] = config.XianfuAnimalCfg.instance.ids;
            for (let i: int = 0, len: int = ids.length; i < len; i++) {
                XianfuCtrl.instance.getSpiritAnimalTravel([ids[i]]);
            }
            this.getXianFuSkillList();
        }

        private requestBuildInfo(): void {
            XianfuCtrl.instance.getBuildingInfo([0]);
            XianfuCtrl.instance.getBuildingInfo([1]);
            XianfuCtrl.instance.getBuildingInfo([2]);
            XianfuCtrl.instance.getBuildingInfo([3]);
            XianfuCtrl.instance.getBuildingInfo([4]);
        }

        //获取仙府-家园信息返回
        private getXianFuInfoReply(tuple: GetXianFuInfoReply): void {
            XianfuModel.instance.getXianFuInfoReply(tuple);
        }

        //更新仙府-家园信息
        private updateXianFuInfo(tuple: UpdateXianFuInfo): void {
            XianfuModel.instance.updateInfo(tuple);
        }

        /*更新仙府-家园产出的币*/
        private updateProduceCoin(tuple: UpdateProduceCoin): void {
            XianfuModel.instance.updateProduceCoin(tuple);
        }

        //获取图鉴
        public getIllustratedHandbook(): void {
            Channel.instance.publish(UserFeatureOpcode.GetIllustratedHandbook, null);
        }

        //获取图鉴返回
        private getIllustratedHandbookReply(tuple: GetIllustratedHandbookReply): void {
            XianfuModel.instance.getIllustratedHandbookReply(tuple);
        }

        //更新图鉴返回
        private updateIllustratedHandbook(tuple: UpdateIllustratedHandbook): void {
            XianfuModel.instance.updateIllustratedHandbook(tuple);
        }

        //激活图鉴
        public PromoteIllustratedHandbook(tuple: Protocols.PromoteIllustratedHandbook): void {
            Channel.instance.publish(UserFeatureOpcode.PromoteIllustratedHandbook, tuple);
        }

        //激活图鉴返回
        public promoteIllustratedHandbookReply(tuple: Protocols.PromoteIllustratedHandbookReply): void {
            let result: number = tuple[Protocols.PromoteIllustratedHandbookReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`图鉴升级成功`);
                GlobalData.dispatcher.event(CommonEventType.HAND_BOOK_UPDATE);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //仙府-家园事件更新
        private xianFuEvent(tuple: xianFuEvent): void {
            XianfuModel.instance.xianFuEvent(tuple);
        }

        //获取仙府-家园任务列表
        public getXianfuTaskList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuTaskList, null);
        }

        //获取仙府-家园任务列表返回
        public updateXianFuTaskState(tuple: GetXianFuTaskListReply): void {
            XianfuModel.instance.updateXianFuTaskState(tuple);
        }

        //领取任务奖励
        public getXianFuTaskAward(tuple: GetXianFuTaskAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuTaskAward, tuple);
        }

        //领取任务奖励返回
        private getXianFuTaskAwardReply(tuple: GetXianFuTaskAwardReply): void {
            let result: number = tuple[GetXianFuTaskAwardReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`领取成功`);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //领取活跃度奖励
        public getXianFuActivaAward(tuple: Protocols.GetXianFuActivaAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuActivaAward, tuple);
        }

        //领取活跃度奖励返回
        public getXianFuActivaAwardReply(tuple: Protocols.GetXianFuActivaAwardReply): void {
            let result: number = tuple[GetXianFuTaskAwardReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`活跃度奖励领取成功`);
            } else {
                // CommonUtil.noticeError(result);
                if (result == ErrorCode.XianFuActiveNotEnough) {
                    let arr: Protocols.Item[] = [];
                    let awards: number[] = XianfuModel.instance.taskActivesAward[XianfuModel.instance.selectTaskActiveAward];
                    for (let i: int = 0, len: int = awards.length; i < len; i += 2) {
                        arr.push([awards[i], awards[i + 1], 0, null]);
                    }
                    WindowManager.instance.open(WindowEnum.COMMON_ITEMS_ALERT, [arr, "奖励预览"]);
                }
            }
        }

        //仙府-家园升级
        public xianfuShengji(): void {
            Channel.instance.publish(UserFeatureOpcode.UpgradeXianFu, null);
        }

        //仙府-家园升级返回
        private upgradeXianFuReply(tuple: UpgradeXianFuReply): void {
            if (!tuple[UpgradeXianFuReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("家园升级成功");
                this.requestBuildInfo();
            } else {
                CommonUtil.noticeError(tuple[UpgradeXianFuReplyFields.result]);
            }
        }

        //获取仙府-家园风水信息
        public getXianFuFengShuiInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuFengShuiInfo, null);
        }

        //更新仙府-家园风水信息返回
        public updateXianFuFengShuiInfo(tuple: Protocols.UpdateXianFuFengShuiInfo): void {
            XianfuModel.instance.updateXianFuFengShuiInfo(tuple);
        }

        //获取建筑产出信息
        public getBuildingInfo(tuple: GetBuildingInfo): void {
            Channel.instance.publish(UserFeatureOpcode.GetBuildingInfo, tuple);
        }

        //获取建筑产出信息返回
        private updateBuildingInfo(tuple: UpdateBuildingInfo) {
            if (!tuple) return;
            XianfuModel.instance.getBuildingInfoReply(tuple);
        }

        //升级或激活物件
        public upgradeFengShuiDecorate(tuple: Protocols.UpgradeFengShuiDecorate): void {
            Channel.instance.publish(UserFeatureOpcode.UpgradeFengShuiDecorate, tuple);
        }

        //激活或激活物件返回
        private upgradeFengShuiDecorateReply(tuple: Protocols.UpgradeFengShuiDecorateReply): void {
            let result: number = tuple[Protocols.UpgradeFengShuiDecorateReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`升级成功`);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //购买游历所需道具
        public buyTravelItem(tuple: BuyTravelItem): void {
            Channel.instance.publish(UserFeatureOpcode.BuyTravelItem, tuple);
        }

        //购买游历所需道具返回
        private buyTravelItemReply(tuple: BuyTravelItemReply): void {
            let result: number = tuple[BuyTravelItemReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`购买游历道具成功`);
                WindowManager.instance.close(WindowEnum.XIANFU_PET_BUY_PROP_ALERT);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //获取仙府-家园神秘商店
        public getXianfuMall(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuMall, null);
        }

        //获取仙府-家园神秘商店返回
        public getXianFuMallReply(tuple: Protocols.GetXianFuMallReply): void {
            let result: number = tuple[Protocols.GetXianFuMallReplyFields.result];
            if (!result) {
                XianfuModel.instance.xianfuMallReply(tuple[Protocols.GetXianFuMallReplyFields.list]);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //提前结束游历
        public travelFinish(tuple: TravelFinish): void {
            Channel.instance.publish(UserFeatureOpcode.TravelFinish, tuple);
        }

        //提前结束游历返回
        private travelFinishReply(tuple: TravelFinishReply): void {
            let result: number = tuple[TravelFinishReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`游历已提前结束`);
                this.getSpiritAnimalTravel([XianfuAnimalCfg.instance.ids[XianfuModel.instance.selectPetIndex]]);
                WindowManager.instance.close(WindowEnum.XIANFU_PET_AT_ONCE_END_ALERT);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        //请求灵兽游历
        public travel(tuple: Travel): void {
            Channel.instance.publish(UserFeatureOpcode.Travel, tuple);
        }

        //灵兽游历返回
        public travelReply(tuple: TravelReply): void {
            if (!tuple[TravelReplyFields.result]) {
                this.getSpiritAnimalTravel([XianfuAnimalCfg.instance.ids[XianfuModel.instance.selectPetIndex]]);
                WindowManager.instance.close(WindowEnum.XIANFU_PET_READY_GO_ALERT);
            } else {
                CommonUtil.noticeError(tuple[TravelReplyFields.result]);
            }
        }

        //获取灵兽游历信息
        public getSpiritAnimalTravel(tuple: GetSpiritAnimalTravel): void {
            Channel.instance.publish(UserFeatureOpcode.GetSpiritAnimalTravel, tuple);
        }

        //更新灵兽游历信息
        private updateSpiritAnimalTravel(tuple: UpdateSpiritAnimalTravel): void {
            if (!tuple) return;
            XianfuModel.instance.updateSpiritAnimalTravel(tuple);
        }

        //领取灵兽游历奖励
        public getTravelAward(tuple: GetTravelAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetTravelAward, tuple);
        }

        //领取灵兽游历奖励返回
        private getTravelAwardReply(tuple: GetTravelAwardReply): void {
            let result: number = tuple[GetTravelAwardReplyFields.result];
            if (!result) {
                SystemNoticeManager.instance.addNotice(`领取成功`);
                WindowManager.instance.close(WindowEnum.XIANFU_PET_TRAVELING_ALERT);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        /** 炼制  建筑id 制作道具序号及份数*/
        public makeItem(tuple: MakeItem): void {
            Channel.instance.publish(UserFeatureOpcode.MakeItem, tuple);
        }

        //炼制返回
        public makeItemReply(tuple: MakeItemReply): void {
            if (tuple[MakeItemReplyFields.result]) {
                CommonUtil.noticeError(tuple[MakeItemReplyFields.result]);
            }
        }

        //领取建筑产出奖励
        public getBuildProduceAward(tuple: GetBuildProduceAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetBuildProduceAward, tuple);
        }

        //领取建筑产出奖励返回
        private getBuildProduceAwardReply(tuple: GetBuildProduceAwardReply): void {
            if (!tuple[GetBuildProduceAwardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            } else {
                CommonUtil.noticeError(tuple[GetBuildProduceAwardReplyFields.result]);
            }
        }

        private updateBag(): void {
            XianfuModel.instance.checkArticleRP();
        }

        //获取仙府-家园技能列表
        public getXianFuSkillList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuSkillList, null);
        }

        public getXianFuSkillListReply(tuple: GetXianFuSkillListReply): void {
            let list: number[] = tuple[GetXianFuSkillListReplyFields.skillList];
            XianfuModel.instance.skillList = list;
        }

        //提升或激活技能
        public promoteXianFuSkill(skillId: number): void {
            Channel.instance.publish(UserFeatureOpcode.PromoteXianFuSkill, [skillId]);
        }

        public promoteXianFuSkillReply(tuple: PromoteXianFuSkillReply): void {
            let code: number = tuple[PromoteXianFuSkillReplyFields.result];
            if (!code) {
                if ((XianfuModel.instance.selectSkill % 100 >> 0) == 0) {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong5.png");
                } else {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                }
            } else {
                CommonUtil.noticeError(code);
            }
        }

        public makeItemFinish(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.MakeItemFinish, [id]);
        }

        private makeItemFinishReply(tuple: MakeItemFinishReply): void {
            let code: number = tuple[MakeItemFinishReplyFields.result];
            CommonUtil.codeDispose(code, `炼制完成`);
        }

        public endSmelt(): void {
            let buildType: number = XianfuModel.instance.buildType;
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(buildType);
            let leisureCDTime: number = info[GetBuildingInfoReplyFields.time];
            let remianTime: number = Math.round((leisureCDTime - GlobalData.serverTime) / 1000);
            let mult: number = BlendCfg.instance.getCfgById(27015)[blendFields.intParam][0];
            let needCount: number = remianTime * mult;
            let haveCount: number = CommonUtil.getPropCountById(MoneyItemId.glod);
            let str: string = `立即结束可${CommonUtil.formatHtmlStrByColor(`#b15315`, `直接结束炼制`)},获得奖励!<br/>是否消耗<img src='${CommonUtil.getIconById(MoneyItemId.glod, true)}' width="40" height="40"/>${needCount}&nbsp;代币券立即结束?`;
            let handler: Handler;
            if (needCount > haveCount) {
                handler = Handler.create(CommonUtil, CommonUtil.goldNotEnoughAlert, [1]);
            } else {
                handler = Handler.create(XianfuCtrl.instance, XianfuCtrl.instance.makeItemFinish, [XianfuModel.instance.buildType]);
            }
            CommonUtil.alert(`提示`, str, [handler]);
        }

        public enterScene(): void {
            let funcId: number = ActionOpenId.xianFuEnter;
            if (!FuncOpenModel.instance.getFuncNeedShow(funcId)) {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(funcId), true);
                return;
            }
            if (scene.SceneUtil.currScene == SceneTypeEx.homestead) {
                // SystemNoticeManager.instance.addNotice("您已在该场景中", true);
                GlobalData.dispatcher.event(CommonEventType.XIANFU_REENTER);


            } else {
                XianfuModel.instance.panelType = 3;
                DungeonCtrl.instance.reqEnterScene(2241, 3);
            }
        }
    }
}