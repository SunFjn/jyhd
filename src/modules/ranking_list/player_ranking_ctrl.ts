namespace modules.rankingList {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserCenterOpcode = Protocols.UserCenterOpcode;

    export class PlayerRankingCtrl extends BaseCtrl {

        private static _instance: PlayerRankingCtrl;
        public static get instance(): PlayerRankingCtrl {
            return this._instance = this._instance || new PlayerRankingCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetRankReply, this, this.getRankReply);
            Channel.instance.subscribe(SystemClientOpcode.GetActorRankShowReply, this, this.getActorRankShowRely);
            Channel.instance.subscribe(SystemClientOpcode.GetActorRankDataReply, this, this.getActorRankDataReply);
        }

        // 请求排行
        public getRank(type: RankType): void {
            Channel.instance.publish(UserCenterOpcode.GetRank, [type]);
        }

        private getRankReply(tuple: Protocols.GetRankReply): void {
            // console.log("请求排行回调.............." + tuple);
            // console.log("请求排行回调");
            PlayerRankingModel.instance.getRankReply(tuple);
        }

        // 请求排行榜外观
        public getActorRankShow(actorId: number): void {
            Channel.instance.publish(UserCenterOpcode.GetActorRankShow, [actorId]);
        }

        private getActorRankShowRely(tuple: Protocols.GetActorRankShowReply): void {
            PlayerRankingModel.instance.getActorRankShowRely(tuple);
        }

        // 获取角色排行榜数据
        public getActorRankData(actorId: number, type: RankType): void {
            Channel.instance.publish(UserCenterOpcode.GetActorRankData, [[[actorId, type]]]);
        }

        private getActorRankDataReply(tuple: Protocols.GetActorRankDataReply): void {
            PlayerRankingModel.instance.getActorRankDataReply(tuple);
        }
    }
}