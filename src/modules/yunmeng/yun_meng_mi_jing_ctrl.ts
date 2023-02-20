///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../pay_reward/pay_reward_model.ts"/>
///<reference path="../kunlun/kunlun_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
/** */
namespace modules.yunmeng {
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    /*获取数据*/
    // User -> Feature GetSceneState       获取场景状态
    // System -> Client BroadcasSceneState 广播场景状态
    // System -> Client GetSceneStateReply 获取场景状态返回
    // User -> Feature GetCloudland        获取云梦秘境
    // System -> Client GetCloudlandReply  获取云梦秘境返回
    // System -> Client UpdateCloudland    更新云梦秘境
    // UpdateDropRecord 更掉落记录
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import GetCloudlandReply = Protocols.GetCloudlandReply;
    import GetCloudlandReplyFields = Protocols.GetCloudlandReplyFields;
    import UpdateCloudland = Protocols.UpdateCloudland;
    import UpdateCloudlandFields = Protocols.UpdateCloudlandFields;
    import UpdateDropRecord = Protocols.UpdateDropRecord;
    import CloudlandTimesFields = Protocols.CloudlandTimesFields;
    import BossJudgeAward = Protocols.BossJudgeAward;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class YunMengMiJingCtrl extends BaseCtrl {
        private static _instance: YunMengMiJingCtrl;
        public static get instance(): YunMengMiJingCtrl {
            return this._instance = this._instance || new YunMengMiJingCtrl();
        }

        private destin: Point;

        constructor() {
            super();
            this.destin = new Point(180, 60);
        }

        public setup(): void {
            // 云梦秘境 
            Channel.instance.subscribe(SystemClientOpcode.GetCloudlandReply, this, this.GetCloudlandReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCloudland, this, this.UpdateCloudland);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDropRecord, this, this.UpdateDropRecord);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.updateRP);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
            Channel.instance.subscribe(SystemClientOpcode.BossJudgeAward, this, this.BossJudgeAward);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.GetCloudland();
        }


        /** 获取云梦秘境 请求*/
        public GetCloudland() {
            // console.log("获取云梦秘境 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetCloudland, null);
        }

        /** 获取云梦秘境返回*/
        private GetCloudlandReply(tuple: GetCloudlandReply): void {
            // console.log("获取云梦秘境返回 返回数据...............:   ", tuple);
            YunMengMiJingModel.instance.totalTimes = tuple[GetCloudlandReplyFields.times][CloudlandTimesFields.totalTimes];
            YunMengMiJingModel.instance.remainTimes = tuple[GetCloudlandReplyFields.times][CloudlandTimesFields.remainTimes];
            YunMengMiJingModel.instance.buyTimes = tuple[GetCloudlandReplyFields.times][CloudlandTimesFields.buyTimes];
            YunMengMiJingModel.instance.addTimes = tuple[GetCloudlandReplyFields.times][CloudlandTimesFields.addTimes];
            this.updateRP();
        }

        /** 更新云梦秘境*/
        private UpdateCloudland(tuple: UpdateCloudland): void {
            // console.log("更新云梦秘境 返回数据...............:   ", tuple);
            YunMengMiJingModel.instance.totalTimes = tuple[UpdateCloudlandFields.times][CloudlandTimesFields.totalTimes];
            YunMengMiJingModel.instance.remainTimes = tuple[UpdateCloudlandFields.times][CloudlandTimesFields.remainTimes];
            YunMengMiJingModel.instance.buyTimes = tuple[UpdateCloudlandFields.times][CloudlandTimesFields.buyTimes];
            YunMengMiJingModel.instance.addTimes = tuple[UpdateCloudlandFields.times][CloudlandTimesFields.addTimes];
            this.updateRP();
        }

        /** 更新云梦秘境掉落记录*/
        private UpdateDropRecord(tuple: UpdateDropRecord): void {
            // console.log("更新云梦秘境掉落记录 返回数据...............:   ", tuple);
            YunMengMiJingModel.instance.ItemDate = tuple[UpdateCloudlandFields.times];
        }

        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.cloudlandCopy) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.cloudlandCopy)) {
                        this.updateRP();
                        return;
                    }
                }
            }
        }

        private updateRP(): void {
            RedPointCtrl.instance.setRPProperty("yunMengBossRP", YunMengMiJingModel.instance.getState());
            YunMengMiJingModel.instance.showDrawNum();
        }

        /** BOSS结算奖励*/
        private BossJudgeAward(tuple: BossJudgeAward): void {
            // console.log("更新云梦秘境BOSS结算奖励...............:   ", tuple);
            YunMengMiJingModel.instance.allBossJudgeAward = tuple;
        }
    }
}