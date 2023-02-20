/**
 * 活动排行 - 接口
 */
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCrossOpcode = Protocols.UserCrossOpcode;
    import LimitXunbaoRankInfoReply = Protocols.LimitXunbaoRankInfoReply;
    import GetLimitXunbaoInfoReply = Protocols.GetLimitXunbaoInfoReply;
    import GetFishInfoFields = Protocols.GetFishInfoFields;
    enum rankType {
        own = 0,
        service = 1
    }
    export class LimitRankCtrl extends BaseCtrl {

        constructor() {
            super();
        }
        private static _instance: LimitRankCtrl;
        public static get instance(): LimitRankCtrl {
            return this._instance = this._instance || new LimitRankCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.LimitXunbaoRankInfoReply, this, this.LimitXunbaoRankInfoReply);
            // Channel.instance.subscribe(SystemClientOpcode.GetLimitXunbaoInfoReply, this, this.GetFishInfoReply);
            // for (let i = 1; i < 4; i++) {
            //     this.getLoginInfo(i);
            // }
        
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.GetLimitXunbaoRankInfo(LimitBigType.fish);
        }

        //获取数据
        // public getLoginInfo(i: GetFishInfoFields.type): void {
        //     // console.log('vtz:0x' + UserFeatureOpcode.GetLimitXunbaoInfo.toString(16) + '-获取数据', i);
        //     Channel.instance.publish(UserFeatureOpcode.GetLimitXunbaoInfo, [i]);
        // }
        // /*返回数据*/
        // private GetFishInfoReply(tuple: GetLimitXunbaoInfoReply) {
        //     // console.log('vtz:0x' + SystemClientOpcode.GetLimitXunbaoInfoReply.toString(16) + '-tuple', tuple);
        //     LimitRankModel.instance.updateInfo(tuple);
        // }

        public GetLimitXunbaoRankInfo(bigtype: number): void {
            // console.log('研发测试_chy:GetLimitXunbaoRankInfo');
            Channel.instance.publish(UserCrossOpcode.GetLimitXunbaoRankInfo, [bigtype, rankType.own]);
        }
        private LimitXunbaoRankInfoReply(tuple: LimitXunbaoRankInfoReply) {
            // console.log('研发测试_chy:LimitXunbaoRankInfoReply');
            // console.log('研发测试_chy:LimitXunbaoRankInfoReply', tuple);
            LimitRankModel.instance.setRankInfo(tuple)
        }
    }

}