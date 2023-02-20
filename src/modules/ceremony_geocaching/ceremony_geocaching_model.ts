///<reference path="../config/ceremony_geocaching_cfg.ts"/>
///<reference path="./ceremony_geocaching_score_award_cfg.ts"/>
/*庆典探索数据模型*/
namespace modules.ceremony_geocaching {
    import ceremonyGeocachingRank = Configuration.ceremonyGeocachingRank;
    import ceremonyGeocachingRankFields = Configuration.ceremonyGeocachingRankFields;
    import Items = Configuration.Items;
    import CeremonyGeocachingScoreAwardCfg = modules.config.CeremonyGeocachingScoreAwardCfg;
    import CeremonyGeocachingRankCfg = modules.config.CeremonyGeocachingRankCfg;
    import CelebrationHuntInfoReply = Protocols.CelebrationHuntInfoReply;
    import CelebrationHuntInfoReplyFields = Protocols.CelebrationHuntInfoReplyFields;
    import CelebrationHuntRunReply = Protocols.CelebrationHuntRunReply;
    import CelebrationHuntRunReplyFields = Protocols.CelebrationHuntRunReplyFields;
    import CelebrationHuntGetScoreRewardReply = Protocols.CelebrationHuntGetScoreRewardReply;
    import CelebrationHuntScoreReward = Protocols.CelebrationHuntScoreReward;
    import CelebrationHuntScoreRewardFields = Protocols.CelebrationHuntScoreRewardFields;
    import CelebrationHuntScoreRewardShowFields = Protocols.CelebrationHuntScoreRewardShowFields;
    import CelebrationHuntScoreRewardShow = Protocols.CelebrationHuntScoreRewardShow;
    import CelebrationHuntRankInfoReply = Protocols.CelebrationHuntRankInfoReply;
    import CelebrationHuntRankInfoReplyFields = Protocols.CelebrationHuntRankInfoReplyFields;
    import CelebrationHuntRankInfoFields = Protocols.CelebrationHuntRankInfoFields;
    import XunbaoNote2 = Protocols.XunbaoNote2;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ceremonyGeocachingScoreAward = Configuration.ceremonyGeocachingScoreAward;
    import ceremonyGeocachingScoreAwardFields = Configuration.ceremonyGeocachingScoreAwardFields;

    import BagModel = modules.bag.BagModel;

    export class CeremonyGeocachingModel {
        private static _instance: CeremonyGeocachingModel;
        public static get instance(): CeremonyGeocachingModel {
            return this._instance = this._instance || new CeremonyGeocachingModel();
        }
        private constructor() {
        }

        private _leaderAward: Items;
        private _rankList: Array<ceremonyGeocachingRank>;
        private _luckDrawList: Array<Array<number>>;
        private _currentScoreList: Array<CelebrationHuntScoreReward>;
        private _personGetedList: Array<XunbaoNote2>;
        private _endTime: number;
        private _currentScore: number;
        private _currentScorePos: number;
        private _canGeted: boolean;
        private _myRank: string;

        // 设置基本信息
        public setBaseInfo(tuple: CelebrationHuntInfoReply): void {
            this._currentScore = tuple[CelebrationHuntInfoReplyFields.score];
            this._currentScoreList = tuple[CelebrationHuntInfoReplyFields.rewardList];
            this._personGetedList = tuple[CelebrationHuntInfoReplyFields.noteList];
            this._endTime = tuple[CelebrationHuntInfoReplyFields.endTm] + GlobalData.serverTime;

            if (this._currentScoreList.length == 0) {
                console.log("服务器数据错误或活动过期！-- 找皮皮虾");
                return;
            }

            // 计算当前可领取的档次
            this.calcNotGetedScorePos();

            // 派发事件通知
            GlobalData.dispatcher.event(CommonEventType.OS_CEREMONY_GEOCACHING_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.OS_CEREMONY_SELF_BROADCAST_LIST);
        }

        // 计算当前未领取的所在的积分档次
        public calcNotGetedScorePos() {
            let array = this._currentScoreList;
            let curPos = array[0][CelebrationHuntScoreRewardFields.id];
            let rpStatus = false;
            let isLast = true;

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                const needNext = element[CelebrationHuntScoreRewardFields.state] == 2;
                const rp = element[CelebrationHuntScoreRewardFields.state] == 1;
                if (rp) {
                    rpStatus = true;
                }

                // 最后一级则不取下一个id的数据
                if (needNext && index < array.length - 1 && array[index + 1][CelebrationHuntScoreRewardFields.state] != 2) {
                    let nextEle = array[index + 1];
                    curPos = nextEle[CelebrationHuntScoreRewardFields.id];
                    const rp2 = nextEle[CelebrationHuntScoreRewardFields.state] == 1;
                    if (rp2) {
                        rpStatus = true;
                    }
                    isLast = false;
                    break;
                }
            }

            // 是否为最后一级且领取完成
            if (isLast && array[array.length - 1][CelebrationHuntScoreRewardFields.state] == 2) curPos = array[array.length - 1][CelebrationHuntScoreRewardFields.id];

            // 可领取红点
            this.setGetScoreRP(rpStatus);

            // 可抽取红点
            let count = BagModel.instance.getItemCountById(15650001);
            this.setGanDrawRP(count >= 1);

            // 获取当前档次的积分
            this._currentScorePos = CeremonyGeocachingScoreAwardCfg.instance.getTaskScoreByID(curPos);
        }

        // 设置可领取积分奖励的红点
        public setGetScoreRP(status: boolean) {
            this._canGeted = status;
            RedPointCtrl.instance.setRPProperty("ceremonyGeocachingGetedRP", status);
        }
        // 设置可以抽取红点
        public setGanDrawRP(status: boolean) {
            RedPointCtrl.instance.setRPProperty("ceremonyGeocachingCanDraw", status);
        }

        // 获取积分奖励榜列表
        public getScoreAwardList(): Array<CelebrationHuntScoreRewardShow> {
            let list: Array<CelebrationHuntScoreRewardShow> = new Array<CelebrationHuntScoreRewardShow>();
            let array = this._currentScoreList;

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                let id: number = element[CelebrationHuntScoreRewardFields.id];
                let green: boolean = element[CelebrationHuntScoreRewardFields.state] >= 1;
                let color: string = green ? "#168a17" : "red";
                let item_cfg: ceremonyGeocachingScoreAward = CeremonyGeocachingScoreAwardCfg.instance.getTaskCfgByID(id);
                let condition: number = item_cfg[ceremonyGeocachingScoreAwardFields.condition];
                let items: Items = item_cfg[ceremonyGeocachingScoreAwardFields.items][0];
                let desc: string = `<div style="width:500px;height:25px; fontSize:21; color:black"><span>积分达到</span><span style="color:#168a17;">${condition}</span><span>可领取</span><span style="color:${color};">(${this._currentScore}/${condition})</span></div>`;

                list.push([id, desc, items]);
            }

            return list;
        }

        // 是否可领取积分奖励
        public get canGeted(): boolean {
            return this._canGeted;
        }

        // 当前积分
        public get score(): number {
            return this._currentScore;
        }

        // 当前所在档次的积分
        public get scorePos(): number {
            return this._currentScorePos;
        }

        // 结束时间
        public get endTime(): number {
            return this._endTime;
        }

        // 个人抽奖记录
        public get personGetedList(): Array<XunbaoNote2> {
            return this._personGetedList;
        }

        // 积分奖励列表
        public get currentScoreList(): Array<CelebrationHuntScoreReward> {
            return this._currentScoreList;
        }

        // 获取排行榜玩家和奖励
        public get rankList(): Array<ceremonyGeocachingRank> {
            return this._rankList;
        }

        // 获取我的排名
        public get myRank(): string {
            return this._myRank;
        }

        // 获取榜首奖励
        public get leaderAwrd(): Items {
            this._leaderAward = CeremonyGeocachingRankCfg.instance.getLeaderAwardCfgByDays(PlayerModel.instance.openDay);

            return this._leaderAward;
        }

        // 设置排行榜玩家和奖励
        public setRankList(tuple: CelebrationHuntRankInfoReply): void {
            let datas: Array<ceremonyGeocachingRank> = new Array<ceremonyGeocachingRank>();
            let cfgs: Table<ceremonyGeocachingRank> = CeremonyGeocachingRankCfg.instance.getAllItemCfgByDays(PlayerModel.instance.openDay);
            let index: number = 1;
            let list = tuple[CelebrationHuntRankInfoReplyFields.nodeList];
            let myId: number = PlayerModel.instance.actorId;
            this._myRank = "未上榜";

            for (const key in cfgs) {
                if (Object.prototype.hasOwnProperty.call(cfgs, key)) {
                    let userName: string;
                    let score: number;
                    let objId: number;

                    const data_cfg = cfgs[key];

                    // 说明有玩家在该排行的位置
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        if (item[CelebrationHuntRankInfoFields.rank] == index) {
                            userName = item[CelebrationHuntRankInfoFields.name];
                            score = item[CelebrationHuntRankInfoFields.param];
                            objId = item[CelebrationHuntRankInfoFields.objId];
                            // 是否为我自己
                            if (myId == objId) this._myRank = item[CelebrationHuntRankInfoFields.rank].toString();
                            break;
                        }
                    }

                    data_cfg[ceremonyGeocachingRankFields.name] = userName;
                    data_cfg[ceremonyGeocachingRankFields.score] = score;
                    datas.push(data_cfg);
                    index++;
                }
            }
            this._rankList = datas;
            //派发事件通知
            GlobalData.dispatcher.event(CommonEventType.OS_CEREMONY_GEOCACHING_RANK_UPDATE);
        }

        // 设置抽奖列表
        public setLuckyDrawList(tuple: CelebrationHuntRunReply): void {
            this._luckDrawList = tuple[CelebrationHuntRunReplyFields.list];
        }
        // 获取抽奖列表
        public getLuckyDrawList(): Array<Array<number>> {
            return this._luckDrawList;
        }


    }
}