///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
/** */
namespace modules.day_drop_treasure {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import DayDropTreasureModel = modules.day_drop_treasure.DayDropTreasureModel;
    //获取天降财宝信息返回
    import GetRichesInfoReply = Protocols.GetRichesInfoReply;
    import GetRichesInfoReplyFields = Protocols.GetRichesInfoReplyFields;
    //更新天降财宝信息
    import UpdateRichesInfo = Protocols.UpdateRichesInfo;
    import UpdateRichesInfoFields = Protocols.UpdateRichesInfoFields;
    //更新天降财宝副本数据
    import UpdateRichesCopy = Protocols.UpdateRichesCopy;
    import UpdateRichesCopyFields = Protocols.UpdateRichesCopyFields;

    export class DayDropTreasureCtrl extends BaseCtrl {
        private static _instance: DayDropTreasureCtrl;
        public static get instance(): DayDropTreasureCtrl {
            return this._instance = this._instance || new DayDropTreasureCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetRichesInfoReply, this, this.GetRichesInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRichesInfo, this, this.UpdateRichesInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRichesCopy, this, this.UpdateRichesCopy);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getPayRewardInfo();
        }

        /** 获取天降财宝信息 请求*/
        public getPayRewardInfo() {
            // console.log("获取天降财宝信息 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetRichesInfo, null);
        }

        /** 获取天降财宝信息返回*/
        private GetRichesInfoReply(tuple: GetRichesInfoReply): void {
            // console.log("获取天降财宝信息返回...............:   ", tuple);
            DayDropTreasureModel.instance.gatherCount = tuple[GetRichesInfoReplyFields.gatherCount];
            GlobalData.dispatcher.event(CommonEventType.DAY_DROP_TREASURE_GATHERCOUNT_UPDATE);
        }

        /** 更新天降财宝信息*/
        private UpdateRichesInfo(tuple: UpdateRichesInfo): void {
            // console.log("更新天降财宝信息...............:   ", tuple);
            DayDropTreasureModel.instance.gatherCount = tuple[UpdateRichesInfoFields.gatherCount];
            GlobalData.dispatcher.event(CommonEventType.DAY_DROP_TREASURE_GATHERCOUNT_UPDATE);
        }

        /** 更新天降财宝副本数据*/
        private UpdateRichesCopy(tuple: UpdateRichesCopy): void {
            // console.log("更新天降财宝副本数据...............:   ", tuple);
            DayDropTreasureModel.instance.nextRefreshTime = tuple[UpdateRichesCopyFields.nextRefreshTime];
            DayDropTreasureModel.instance.closeNum = tuple[UpdateRichesCopyFields.close];
            GlobalData.dispatcher.event(CommonEventType.DAY_DROP_TREASURE_UADATETIME_UPDATE);
        }
    }
}