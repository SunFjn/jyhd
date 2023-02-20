///<reference path="./zhulu_war_rank_cfg.ts"/>
///<reference path="../config/teamFightFor_boss_award_cfg.ts"/>
///<reference path="./zhulu_achievement_cfg.ts"/>


/** 逐鹿model */
namespace modules.zhulu {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import ZhuLuAchievementCfg = modules.config.ZhuLuAchievementCfg;
    import ZhuLuWarRankCfg = modules.config.ZhuLuWarRankCfg;
    import ZhuLuAchievementReplyFields = Protocols.ZhuLuAchievementReplyFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import zhuluWarRankAward = Configuration.zhuluWarRankAward;
    import zhuluWarRankAwardFields = Configuration.zhuluWarRankAwardFields;
    import zhuluAchievementShow = Protocols.zhuluAchievementShow;
    import zhuluAchievementShowFields = Protocols.zhuluAchievementShowFields;
    import zhuluHeaderDamageAwardShowFields = Protocols.zhuluHeaderDamageAwardShowFields;
    import zhuluHeaderDamageAwardShow = Protocols.zhuluHeaderDamageAwardShow;
    import ZhuLuAchievementReply = Protocols.GetAchievementInfoReply;
    import GetAchievementInfoReplyFields = Protocols.GetAchievementInfoReplyFields;

    import zhuluAchievementAward = Configuration.zhuluAchievementAward;
    import fightTeam_boss_awardFields = Configuration.fightTeam_boss_awardFields;
    import fightTeam_boss_award = Configuration.fightTeam_boss_award;

    import fightTeam_score_award = Configuration.fightTeam_score_award;
    import fightTeam_score_awardFields = Configuration.fightTeam_score_awardFields;

    import TeamFightForBossAwardCfg = modules.config.teamFightForBossAwardCfg;
    import teamFightForScoreAwardCfg = modules.config.teamFightForScoreAwardCfg;

    import Pos = Protocols.Pos;
    import Point = Laya.Point;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetTeamChiefCopyInfoReply = Protocols.GetTeamChiefCopyInfoReply;
    import GetTeamPrepareCopyInfoReply = Protocols.GetTeamPrepareCopyInfoReply;
    import GetTeamBattleCopyTimeReply = Protocols.GetTeamBattleCopyTimeReply;


    import GetTeamChiefRankListReply = Protocols.GetTeamChiefRankListReply;
    import GetTeamChiefRankListReplyFields = Protocols.GetTeamChiefRankListReplyFields;

    import TeamChiefRank = Protocols.TeamChiefRank;
    import TeamChiefRankFields = Protocols.TeamChiefRankFields;

    import GetTeamBattleCopyInfoReply = Protocols.GetTeamBattleCopyInfoReply;
    import GetTeamBattleCopyInfoReplyFields = Protocols.GetTeamBattleCopyInfoReplyFields;

    import teamBattleCopyInfo = Protocols.teamBattleCopyInfo;
    import teamBattleCopyInfoFields = Protocols.teamBattleCopyInfoFields;

    import teamBattleCopyNodeInfo = Protocols.teamBattleCopyNodeInfo;
    import teamBattleCopyNodeInfoFields = Protocols.teamBattleCopyNodeInfoFields;

    import FightTeamInfo = Protocols.FightTeamInfo;
    import FightTeamInfoFields = Protocols.FightTeamInfoFields;


    import TeamBattleCopyFinishReply = Protocols.TeamBattleCopyFinishReply;
    import TeamBattleCopyFinishReplyFields = Protocols.TeamBattleCopyFinishReplyFields;

    import UpdateTeamBattleInfo = Protocols.UpdateTeamBattleInfo;
    import UpdateTeamBattleInfoFields = Protocols.UpdateTeamBattleInfoFields;

    import ScoreNoticeManager = modules.notice.ScoreNoticeManager;
    import ScoreNoticeType = ui.ScoreNoticeType;

    import GetTeamBattleWorshipInfoReply = Protocols.GetTeamBattleWorshipInfoReply;
    import GetTeamBattleWorshipInfoReplyFields = Protocols.GetTeamBattleWorshipInfoReplyFields;

    export enum copyState {
        NOT = 0,    // 未开启
        LIST = 1,   // 入围名单公示
        DOINGVS27,  // 27进9 进行
        DOINGVS9,   // 9进3 进行
        DOINGVS3,   // 3进1 进行
        GRANT,      // 发放奖励
        NULL,       // 人数不足 轮空
        CLOSE,      // 活动结束
        END,        // 长度
    }

    export const enum victoryInfoFields {
        victory = 0,
        list = 1,
    }
    export const enum teamInfoFields {
        name = 0,
        flagIndex = 1,			/*旗帜下标*/
    }

    export class ZhuLuModel {
        private static _instance: ZhuLuModel;
        public static get instance(): ZhuLuModel {
            return this._instance = this._instance || new ZhuLuModel();
        }

        private _achievementList: Array<zhuluAchievementShow>;
        private _headerWarDamageAwardList: Array<zhuluHeaderDamageAwardShow>;
        public WorshipInfo: GetTeamBattleWorshipInfoReply = ['虚位以待', '虚位以待', 0, 0, false];


        private constructor() {

            this._battleInfo = [];
            this._battleInfo.push(new Map<number, [string, Array<[Uuid, number]>]>())
            this._battleInfo.push(new Map<number, [string, Array<[Uuid, number]>]>())
            this._battleInfo.push(new Map<number, [string, Array<[Uuid, number]>]>())



        }


        /**
         * 获取成就数据列表
        */
        public get achievementList(): any {
            return this._achievementList;
        }

        /**
         * 设置成就数据列表
        */
        public set achievementList(tuple: ZhuLuAchievementReply) {
            this._achievementList = tuple[GetAchievementInfoReplyFields.taskList];
            //派发事件，更新界面
            GlobalData.dispatcher.event(CommonEventType.UPDATE_ZHULU_ACHIEVEMENT_VIEW);
            for (const key in this._achievementList) {
                if (this._achievementList[key][Protocols.AchievementNodeFields.state] == 1) {
                    RedPointCtrl.instance.setRPProperty("ZhuluCjAwardeRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("ZhuluCjAwardeRP", false);
        }


        /*获取逐鹿【争夺战，巅峰战】排行奖励*/
        public getWarRankAwardByType(type: number): any {
            let data: Array<zhuluWarRankAward> = ZhuLuWarRankCfg.instance.getAllConfigByType(type);

            // 争夺战直接返回
            if (type == 1) {
                return data;
            }
            //巅峰战需要处理数据
            else {
                data.forEach((element, index) => {
                    element[zhuluWarRankAwardFields.rank] = (index + 1).toString();
                });
                return data;
            }
        }

        // 场景内
        public hurt: number;  //伤害值
        private _hurtAwardList: Array<number>; //伤害奖励列表

        public score: number;  //积分值
        private _scoreAwardList: Array<number>; //积分奖励列表

        public _copyInfo: GetTeamChiefCopyInfoReply; //首领战 副本信息
        public battleInfo: GetTeamBattleCopyTimeReply; //争夺战 副本信息
        public prepareInfo: GetTeamPrepareCopyInfoReply; //准备场景 副本信息
        public chiefRankList: GetTeamChiefRankListReply = [0, [], [], [[0, 0], [0, 0]]]; //首领战 排名和状态信息
        public showChiefRankList: Array<TeamChiefRank> = [];
        private _movePos: Pos = [0, 0];

        public get movePos() {
            return this._movePos;
        }
        public set movePos(pos: Pos) {
            if (pos[0] != 0 && pos[1] != 0) {
                WindowManager.instance.open(WindowEnum.Transport_PANEL)
            } else {
                WindowManager.instance.close(WindowEnum.Transport_PANEL)
            }
            this._movePos = pos;
        }

        public setChiefRankList(tuple: GetTeamChiefRankListReply) {
            this.chiefRankList[GetTeamChiefRankListReplyFields.status] = tuple[GetTeamChiefRankListReplyFields.status]
            this.chiefRankList[GetTeamChiefRankListReplyFields.obj] = tuple[GetTeamChiefRankListReplyFields.obj]
            this.chiefRankList[GetTeamChiefRankListReplyFields.team] = tuple[GetTeamChiefRankListReplyFields.team]
            this.chiefRankList[GetTeamChiefRankListReplyFields.obj].sort((a, b) => { return b[1] - a[1] });
            this.chiefRankList[GetTeamChiefRankListReplyFields.team].sort((a, b) => { return b[1] - a[1] });
            this.chiefRankList[GetTeamChiefRankListReplyFields.rank] = tuple[GetTeamChiefRankListReplyFields.rank]
            GlobalData.dispatcher.event(CommonEventType.UPDATE_HEADERWAR_SCORE_RANK);
        }


        public set hurtAwardList(list: Array<number>) {
            this._hurtAwardList = list;
            let damageValue: number = this.hurt;
            let cfg = TeamFightForBossAwardCfg.instance.getAllCfg();
            if (!cfg) return;
            for (const k in cfg) {
                let values: number = cfg[k][fightTeam_boss_awardFields.condition];
                if (list.indexOf(cfg[k][fightTeam_boss_awardFields.taskId]) == -1 && damageValue >= values) { //未领取并且可以领
                    RedPointCtrl.instance.setRPProperty("ZhuluDamageRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("ZhuluDamageRP", false);
        }
        public get hurtAwardList(): number[] {
            return this._hurtAwardList;
        }

        public set scoreAwardList(list: Array<number>) {
            this._scoreAwardList = list;
            let scoreValue: number = this.score;
            let cfg = teamFightForScoreAwardCfg.instance.getAllCfg();
            if (!cfg) return;
            for (const k in cfg) {
                let values: number = cfg[k][fightTeam_score_awardFields.condition];
                if (list.indexOf(cfg[k][fightTeam_score_awardFields.taskId]) == -1 && scoreValue >= values) { //未领取并且可以领
                    RedPointCtrl.instance.setRPProperty("ZhuluScoreRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("ZhuluScoreRP", false);
        }

        public get scoreAwardList(): number[] {
            return this._scoreAwardList;
        }
        public ghost: boolean = false;
        public _status: number = 0;
        public _copyStatis: number = 0;
        public _copyTime: Array<number> = [];
        public _teamBattleCopyFinishInfo: TeamBattleCopyFinishReply;
        public _scoreInfo: UpdateTeamBattleInfo;
        public _battleInfo: Array<Map<number, [string, Array<[Uuid, number]>]>>
        public eliminate: boolean = false; // 

        // enum copyState {
        //     NOT = 0,    // 未开启
        //     LIST = 1,   // 入围名单公示
        //     DOINGVS27,  // 27进9 进行
        //     DOINGVS9,   // 9进3 进行
        //     DOINGVS3,   // 3进1 进行
        //     GRANT,      // 发放奖励
        //     CLOSE,      // 活动结束
        //     NULL = 99,  // 人数不足 轮空
        // }
        public setBattleinfo(tuple: GetTeamBattleCopyInfoReply) {
            this.eliminate = true;
            let status = tuple[GetTeamBattleCopyInfoReplyFields.status]
            if (this._status != status && status == copyState.GRANT) {
                ZhuLuCtrl.instance.GetTeamBattleWorshipInfo();
            }
            this._status = status
            this._copyStatis = tuple[GetTeamBattleCopyInfoReplyFields.copyStatus]

            console.log('研发测试_chy:更新状态', this._status, this._copyStatis);
            let t = GlobalData.serverTime
            for (let index = 0; index < 3; index++) {
                this._copyTime[copyState.DOINGVS27 + index] = 0
                this._battleInfo[index].clear();
                let map = this._battleInfo[index]
                let battleNode = tuple[GetTeamBattleCopyInfoReplyFields.copy][index][teamBattleCopyInfoFields.node]
                let count = 0;

                for (let i = 0; i < battleNode.length; i++) {
                    let battle = new Array<[Uuid, number]>()
                    for (const e of battleNode[i][teamBattleCopyNodeInfoFields.node]) {
                        // 在当前阶段战斗找到id等于战队id
                        if (status == copyState.DOINGVS27 + index && e[FightTeamInfoFields.uuid] == modules.clan.ClanModel.instance.ClanId) {
                            this.eliminate = false;
                        }
                        battle.push(!e ? null : [e[FightTeamInfoFields.name], e[FightTeamInfoFields.flagIndex]])
                    }
                    map.set(count++, [battleNode[i][teamBattleCopyNodeInfoFields.victory], battle])
                }
                this._copyTime[copyState.DOINGVS27 + index] = tuple[GetTeamBattleCopyInfoReplyFields.copy][index][teamBattleCopyInfoFields.time][1]
            }

            console.log('研发测试_chy:this._copyTime', this._copyTime);
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_COPY_UPDATA_DATA);
        }
        public set teamBattleCopyFinishReply(tuple: TeamBattleCopyFinishReply) {
            this._teamBattleCopyFinishInfo = tuple
            WindowManager.instance.openDialog(WindowEnum.TEAMPBATTLE_COPY_BATTLE_FINISH_PANEL)
        }
        public get teamBattleCopyFinishReply() {
            return this._teamBattleCopyFinishInfo
        }
        public openChiefCopyFinish() {
            WindowManager.instance.openDialog(WindowEnum.TEAMPBATTLE_COPY_CHIEF_FINISH_PANEL)
        }



        public set scoreInfo(tuple: UpdateTeamBattleInfo) {
            this._scoreInfo = tuple
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_SCORE_UPDATA_DATA);
        }

        public get scoreInfo() {
            return this._scoreInfo;
        }

        public addScore(num: number) {
            ScoreNoticeManager.instance.addNotice(ScoreNoticeType.teamBattle, num);
        }

        public set copyInfo(tuple: GetTeamChiefCopyInfoReply) {
            this._copyInfo = tuple
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_COPY_DATA);
        }
        public get copyInfo() {
            return this._copyInfo
        }



    }
}
