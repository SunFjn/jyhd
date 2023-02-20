///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../zerobuy/zero_buy_model.ts"/>
/** 零元购*/
namespace modules.zerobuy {
    import BaseCtrl = modules.core.BaseCtrl;
    import ZerobuyModel = modules.zerobuy.ZerobuyModel;
    import GetZeroBuyInfoReply = Protocols.GetZeroBuyInfoReply;
    import GetZeroBuyInfoReplyFields = Protocols.GetZeroBuyInfoReplyFields;
    import UpdateZeroBuyInfo = Protocols.UpdateZeroBuyInfo;
    import UpdateZeroBuyInfoFields = Protocols.UpdateZeroBuyInfoFields;
    import GetZeroBuyRewardReply = Protocols.GetZeroBuyRewardReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetZeroBuyBuyReply = Protocols.GetZeroBuyBuyReply;
    import GetZeroBuyBuyReplyFields = Protocols.GetZeroBuyBuyReplyFields;
    import GetZeroBuyRewardReplyFields = Protocols.GetZeroBuyRewardReplyFields;
    export class ZerobuyCtrl extends BaseCtrl {
        private static _instance: ZerobuyCtrl;
        public static get instance(): ZerobuyCtrl {
            return this._instance = this._instance || new ZerobuyCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetZeroBuyInfoReply, this, this.getZeroBuyInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateZeroBuyInfo, this, this.updateZeroBuyInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetZeroBuyRewardReply, this, this.getZeroBuyRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetZeroBuyBuyReply, this, this.GetZeroBuyBuyReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getZeroBuyInfo();
        }


        /** 获取零元购数据 请求*/
        public getZeroBuyInfo() {
            // console.log("获取零元购数据 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetZeroBuyInfo, null);
        }

        /** 获取零元购 领取奖励*/
        public getZeroBuyReward(grade: number) {
            // console.log("获取零元购 领取奖励 grade: " + grade);
            Channel.instance.publish(UserFeatureOpcode.GetZeroBuyReward, [grade]);
        }
        public GetZeroBuyBuy(grade: number) {
            // console.log("购买 grade: " + grade);
            Channel.instance.publish(UserFeatureOpcode.GetZeroBuyBuy, [grade]);
        }

        /** 返回数据 请求*/
        public getZeroBuyInfoReply(tuple: GetZeroBuyInfoReply): void {
            // console.log("零元购 返回数据...............:   ", tuple);
            ZerobuyModel.instance.zeroBuyState = tuple[GetZeroBuyInfoReplyFields.state];
            // ZerobuyModel.instance.totalMoney = tuple[GetZeroBuyInfoReplyFields.totalMoney];
            ZerobuyModel.instance.zeroBuyReward = tuple[GetZeroBuyInfoReplyFields.rewardList];
            ZerobuyModel.instance.zeroBuyExtraReward = tuple[GetZeroBuyInfoReplyFields.extraRewardList];
            GlobalData.dispatcher.event(CommonEventType.ZERO_BUY_UPDATE);
        }

        /** 更新数据*/
        private updateZeroBuyInfo(tuple: UpdateZeroBuyInfo): void {
            // console.log("零元购 更新 数据回调...............:   ", tuple);
            ZerobuyModel.instance.zeroBuyState = tuple[UpdateZeroBuyInfoFields.state];
            // ZerobuyModel.instance.totalMoney = tuple[UpdateZeroBuyInfoFields.totalMoney];
            ZerobuyModel.instance.zeroBuyReward = tuple[UpdateZeroBuyInfoFields.rewardList];
            ZerobuyModel.instance.zeroBuyExtraReward = tuple[UpdateZeroBuyInfoFields.extraRewardList];
            GlobalData.dispatcher.event(CommonEventType.ZERO_BUY_UPDATE);
        }

        /** 领取奖励返回*/
        private getZeroBuyRewardReply(tuple: GetZeroBuyRewardReply): void {
            // console.log("零元购 领取奖励返回...............:   ", tuple);
            let code: number = tuple[GetZeroBuyRewardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }
        // /** 领取奖励返回*/
        private GetZeroBuyBuyReply(tuple: GetZeroBuyBuyReply): void {
            // console.log("购买返回...............:   ", tuple);
            let code: number = tuple[GetZeroBuyBuyReplyFields.result];
            CommonUtil.codeDispose(code, `购买成功`);
            this.getZeroBuyInfo();
        }
    }
}