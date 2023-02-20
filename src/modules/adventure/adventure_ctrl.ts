/** 奇遇*/


namespace modules.adventure {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetAdventureInfoReplyFields = Protocols.GetAdventureInfoReplyFields;
    import GetAdventureInfoReply = Protocols.GetAdventureInfoReply;
    import UpdateAdventureInfoFields = Protocols.UpdateAdventureInfoFields;
    import UpdateAdventureInfo = Protocols.UpdateAdventureInfo;
    import BuyYumliReply = Protocols.BuyYumliReply;
    import BuyYumliReplyFields = Protocols.BuyYumliReplyFields;
    import ChallengeReply = Protocols.ChallengeReply;
    import ChallengeReplyFields = Protocols.ChallengeReplyFields;
    import GetAdventureAwardReply = Protocols.GetAdventureAwardReply;
    import GetAdventureAwardReplyFields = Protocols.GetAdventureAwardReplyFields;
    import GetAdventureHintReply = Protocols.GetAdventureHintReply;
    import GetAdventureHintReplyFields = Protocols.GetAdventureHintReplyFields;
    import UpdateAdventureEvent = Protocols.UpdateAdventureEvent;
    import AdventureExchangeReply = Protocols.AdventureExchangeReply;
    import AdventureExchangeReplyFields = Protocols.AdventureExchangeReplyFields;
    import WindowInfo = ui.WindowInfo;
    import WindowInfoFields = ui.WindowInfoFields;
    import PanelType = ui.PanelType;
    import CommonUtil = modules.common.CommonUtil;
    import AdventureEvent = Protocols.AdventureEvent;
    import AdventureEventFields = Protocols.AdventureEventFields;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import scene = Configuration.scene;
    import SceneCfg = modules.config.SceneCfg;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BagUtil = modules.bag.BagUtil;

    export class AdventureCtrl extends BaseCtrl {
        private static _instance: AdventureCtrl;
        public static get instance(): AdventureCtrl {
            return this._instance = this._instance || new AdventureCtrl();
        }

        public setup(): void {
            // 获取奇遇信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetAdventureInfoReply, this, this.getAdventureInfoReply);
            // 更新奇遇信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateAdventureInfo, this, this.updateAdventureInfo);
            // 购买探险次数返回
            Channel.instance.subscribe(SystemClientOpcode.BuyYumliReply, this, this.buyYunliReply);
            // 挑战返回
            Channel.instance.subscribe(SystemClientOpcode.ChallengeReply, this, this.challengeReply);
            // 领取奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetAdventureAwardReply, this, this.getAdventureAwardReply);
            // 获取勾选列表返回
            Channel.instance.subscribe(SystemClientOpcode.GetAdventureHintReply, this, this.getAdventureHintReply);
            // 更新单个奇遇事件
            Channel.instance.subscribe(SystemClientOpcode.UpdateAdventureEvent, this, this.updateAdventureEvent);
            // 奇遇兑换返回
            Channel.instance.subscribe(SystemClientOpcode.AdventureExchangeReply, this, this.adventureExchangeReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getAdventureInfo();
            this.getAdventureHint();
        }

        // 获取奇遇信息
        public getAdventureInfo(): void {
            // console.log("获取奇遇信息................");
            Channel.instance.publish(UserFeatureOpcode.GetAdventureInfo, null);
        }

        // 获取奇遇信息返回
        private getAdventureInfoReply(value: GetAdventureInfoReply): void {
            // console.log("获取奇遇信息返回...................." + value);
            AdventureModel.instance.eventList = value[GetAdventureInfoReplyFields.eventList];
            AdventureModel.instance.nextTriggerTime = value[GetAdventureInfoReplyFields.nextTriggerTime];
            AdventureModel.instance.yunLi = value[GetAdventureInfoReplyFields.yunli];
            AdventureModel.instance.point = value[GetAdventureInfoReplyFields.point];
        }

        // 更新奇遇信息
        private updateAdventureInfo(value: UpdateAdventureInfo): void {
            // console.log("更新奇遇信息......................" + value);
            AdventureModel.instance.eventList = value[UpdateAdventureInfoFields.eventList];
            AdventureModel.instance.nextTriggerTime = value[UpdateAdventureInfoFields.nextTriggerTime];
            AdventureModel.instance.yunLi = value[UpdateAdventureInfoFields.yunli];
            AdventureModel.instance.point = value[UpdateAdventureInfoFields.point];
        }

        // 购买运力
        public buyYunLi(): void {
            // console.log("购买运力................");
            Channel.instance.publish(UserFeatureOpcode.BuyYumli, null);
        }

        // 购买运力返回
        private buyYunliReply(value: BuyYumliReply): void {
            // console.log("购买运力返回..............." + value);
            CommonUtil.noticeError(value[BuyYumliReplyFields.result]);
        }

        // 挑战
        public challenge(e: AdventureEvent): void {
            // console.log("挑战..............." + key);
            let type:number = e[AdventureEventFields.id];
            // 2PK  3BOSS  4洞府
            if(type === 2 || type === 3 || type === 4){
                if (TeamBattleModel.Instance.isHaveRoom) {
                    TeamBattleCtrl.instance.teamWaitingHandler();
                    return;
                }

                let cfg: scene = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId]);
                if (cfg[sceneFields.type] !== 0 || scene.SceneModel.instance.isInMission) {
                    SystemNoticeManager.instance.addNotice("副本中不可切换到其它副本", true);
                    return;
                }

                if (!BagUtil.checkNeedSmeltTip()) {
                    Channel.instance.publish(UserFeatureOpcode.Challenge, [e[AdventureEventFields.key]]);
                }
            }else {
                Channel.instance.publish(UserFeatureOpcode.Challenge, [e[AdventureEventFields.key]]);
            }
        }

        // 挑战返回
        public challengeReply(value: ChallengeReply): void {
            // console.log("挑战返回..............." + value);
            CommonUtil.noticeError(value[ChallengeReplyFields.code]);
        }

        // 领取奖励（宝箱和任务）
        public getAdventureAward(key: number): void {
            // console.log("领取奖励................." + key);
            Channel.instance.publish(UserFeatureOpcode.GetAdventureAward, [key]);
        }

        // 领取奖励返回
        private getAdventureAwardReply(value: GetAdventureAwardReply): void {
            // console.log("领取奖励返回................" + value);
            CommonUtil.noticeError(value[GetAdventureAwardReplyFields.code]);
        }

        // 获取勾选兑换列表
        public getAdventureHint(): void {
            // console.log("获取勾选列表.................");
            Channel.instance.publish(UserFeatureOpcode.GetAdventureHint, null);
        }

        // 获取勾选兑换列表返回
        public getAdventureHintReply(value: GetAdventureHintReply): void {
            // console.log("获取勾选列表返回..................." + value);
            AdventureModel.instance.hintList = value[GetAdventureHintReplyFields.hintList];
        }

        // 勾选探索兑换提醒列表(需要发送整个列表，服务器只做存储转发)
        public setAdventureHint(ids: Array<number>): void {
            // console.log("设置勾选列表.............." + ids);
            Channel.instance.publish(UserFeatureOpcode.setAdventureHint, [ids]);
        }

        // 更新单个奇遇事件
        public updateAdventureEvent(value: UpdateAdventureEvent): void {
            // console.log("更新单个奇遇事件................." + value);
            AdventureModel.instance.updateAdventureEvent(value);
        }

        // 奇遇兑换
        public adventureExchange(id: number): void {
            // console.log("奇遇兑换..............." + id);
            Channel.instance.publish(UserFeatureOpcode.AdventureExchange, [id]);
        }

        // 奇遇兑换返回
        private adventureExchangeReply(value: AdventureExchangeReply): void {
            // console.log("奇遇兑换返回.................." + value);
            CommonUtil.noticeError(value[AdventureExchangeReplyFields.code]);
        }
    }
}