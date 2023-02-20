///<reference path="./xuanhuo_rankaward_cfg.ts"/>
///<reference path="./xuanhuo_get_award_cfg.ts"/>
///<reference path="./xuanhuo_achievementaward_cfg.ts"/>
// src\game\game_center.ts
/** 玄火model */
namespace modules.xuanhuo {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import XuanHuoRankAwardCfg = modules.config.XuanHuoRankAwardCfg;
    import XuanHuoAchievementCfg = modules.config.XuanHuoAchievementCfg;
    import XuanHuoGetAwardCfg = modules.config.XuanHuoGetAwardCfg;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import XuanHuoAchievementListReplyFields = Protocols.XuanHuoAchievementListReplyFields;
    import xuanhuoAchievementShowFields = Protocols.xuanhuoAchievementShowFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import xuanhuoAchievementShow = Protocols.xuanhuoAchievementShow;
    import xuanhuoGetAwardShowFields = Protocols.xuanhuoGetAwardShowFields;
    import xuanhuoGetAwardShow = Protocols.xuanhuoGetAwardShow;
    import XuanHuoAchievementListReply = Protocols.XuanHuoAchievementListReply;
    import XuanHuoGetAwardReply = Protocols.XuanHuoGetAwardReply;
    import XuanHuoGetAwardReplyFields = Protocols.XuanHuoGetAwardReplyFields;
    import xuanhuoAchievementFields = Configuration.xuanhuoAchievementFields;
    import xuanhuoAchievement = Configuration.xuanhuoAchievement;
    import xuanhuoGetAwardFields = Configuration.xuanhuoGetAwardFields;
    import xuanhuoGetAward = Configuration.xuanhuoGetAward;
    import XuanhuoCopy = Protocols.XuanhuoCopy;
    import GetXuanhuoCopyDataReply = Protocols.GetXuanhuoCopyDataReply;
    import updateXuanhuoNumFields = Protocols.updateXuanhuoNumFields;
    import updateXuanhuoNum = Protocols.updateXuanhuoNum;
    import ScoreNoticeManager = modules.notice.ScoreNoticeManager;
    import ScoreNoticeType = ui.ScoreNoticeType;
    import GetXuanhuoCopyDataReplyFields = Protocols.GetXuanhuoCopyDataReplyFields;
    import BroadcastDead = Protocols.BroadcastDead;
    import XuanhuoPowerFields = Protocols.XuanhuoPowerFields;
    import XuanhuoHumanDataFields = Protocols.XuanhuoHumanDataFields;
    import XuanhuoHumanData = Protocols.XuanhuoHumanData;
    import XuanhuoTeamData = Protocols.XuanhuoTeamData;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import XuanhuoCopyJudgeAward = Protocols.XuanhuoCopyJudgeAward;
    import XuanhuoCopyJudgeAwardFields = Protocols.XuanhuoCopyJudgeAwardFields;
    import BossDungenModel = modules.bossDungeon.BossDungeonModel;
    import ScoreNoticeInfo = ui.ScoreNoticeInfo;
    import Pos = Protocols.Pos;
    import Point = Laya.Point;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class XuanHuoModel {
        private static _instance: XuanHuoModel;
        public static get instance(): XuanHuoModel {
            return this._instance = this._instance || new XuanHuoModel();
        }
        public _defeatInfo: BroadcastDead;
        public _copyData: GetXuanhuoCopyDataReply = [0, [0, 0], 0, 0, 0]; //玄火副本数据
        private _XuanhuoCopy: XuanhuoCopy;   // 玄火个人数据
        private _achievementList: Array<xuanhuoAchievementShow>;
        private _xuanhuoGetAwardList: Array<xuanhuoGetAwardShow>;
        private _xuanhuoCopySettlementData: XuanhuoCopyJudgeAward;
        public selectTargetPos: Pos;  //需要移动到的点
        public actionTween: boolean = false;  //跑动动画执行
        private _updateTime: number = 0;
        /**
         *
         *
         * @type {Map<number, [number, string, number, boolean]>}
         * [玩家ID, 玩家名字, 玄火数量, 是否火神]
         * @memberof XuanHuoModel
         */
        public CopyHumanData: Map<number, [number, string, number, boolean, string]>;
        public CopyTeamData: Map<string, [string, string, number, boolean]>;
        public CopyTeamLenght: number = 0
        public retainMax: number = 0
        public vulcanId: number = 0
        // 积分
        private _score: updateXuanhuoNum = [0, 0, 0];
        public _isDummy: boolean = false;//是否是待机状态

        private constructor() {
            this.CopyHumanData = new Map<number, [number, string, number, boolean, string]>();
            this.CopyTeamData = new Map<string, [string, string, number, boolean]>();
        }

        public setCopyHumanData(value: XuanhuoCopyNumData) {
            // [玩家ID, 玩家名字, 玄火数量, 是否火神]
            // [队伍ID, 队伍名字, 玄火数量, 是否火神]
            let data = value
            let objData = data[0]
            let teamData = data[1]
            // objId = 0,			/*玩家ID*/
            // name = 1,			/*名字*/
            // num = 2,			/*玄火数量*/

            // teamId = 0,			/*队伍id*/
            // teamName = 1,		/*队伍名字*/
            // Num = 2,			/*玄火数量*/

            if (objData.length > 0) {
                this.CopyHumanData.clear()
                objData.forEach((obj: XuanhuoHumanData) => {
                    let objId = obj[0]
                    if (!this.CopyHumanData.has(objId)) this.CopyHumanData.set(objId, [0, "", 0, false, ""])
                    let item = this.CopyHumanData.get(objId)
                    item[0] = obj[0]
                    item[1] = obj[1]
                    item[2] = obj[2]
                    item[4] = obj[3]
                    // this.CopyHumanData.set(item[0], item)
                });
            }
            if (teamData.length > 0) {
                this.CopyTeamData.clear()
                teamData.forEach((team: XuanhuoTeamData) => {
                    let teamId = team[0]
                    if (!this.CopyTeamData.has(teamId)) this.CopyTeamData.set(teamId, ["", "", 0, false])
                    let item = this.CopyTeamData.get(teamId)
                    item[0] = team[0]
                    item[1] = team[1]
                    item[2] = team[2]
                    this.CopyTeamData.set(item[0], item)
                });
            }

            this.CopyTeamLenght = data[2]
            // console.log("设置玄火副本内 玄火数量", this.CopyHumanData, this.CopyTeamData)
        }
        public getCopyHumanData() {
            let data = []
            this.CopyHumanData.forEach((value, key) => {
                if (value[2] > 0) {
                    data.push([key, value[1], value[2], value[3]])
                }

            })
            data.sort((a, b) => b[2] - a[2])
            return data;
        }
        public getHumanNum(objId) {
            if (this.CopyHumanData.has(objId)) {
                return this.CopyHumanData.get(objId)[2]
            }
            return 0;
        }
        public getCopyTeamData() {
            let data = []
            this.CopyTeamData.forEach((value, key) => {
                if (value[2] > 0) {
                    data.push([key, value[1], value[2], value[3]])
                }

            })
            data.sort((a, b) => b[2] - a[2])
            return data;
        }

        public get defeatInfo(): BroadcastDead {
            return this._defeatInfo;
        }

        public set defeatInfo(value: BroadcastDead) {
            this._defeatInfo = value;
        }

        public get XuanhuoCopy(): XuanhuoCopy {
            return this._XuanhuoCopy;
        }

        public set XuanhuoCopy(value: XuanhuoCopy) {
            this._XuanhuoCopy = value;
            GlobalData.dispatcher.event(CommonEventType.XUANHUO_COPY_INFO_UPDATE);
        }
        public get copyData() {
            return this._copyData;
        }
        public getPowerLevel() {
            let level = this._copyData[GetXuanhuoCopyDataReplyFields.xuanhuoPower][XuanhuoPowerFields.level] || 0
            return level
        }

        public set copyData(value) {
            this._copyData = value;
            this.retainMax = value[GetXuanhuoCopyDataReplyFields.xuanhuoFloorsNum]
            if (this._copyData[GetXuanhuoCopyDataReplyFields.onlineTime] > -1) {
                if (!this._TimingRequest) {
                    this._TimingRequest = true
                    Laya.timer.loop(500, this, this.TimingRequest);
                }
            } else {
                this._TimingRequest = false
                Laya.timer.clear(this, this.TimingRequest);
            }
            GlobalData.dispatcher.event(CommonEventType.Xuanhuo_SCORE_UPDATE);
            XuanHuoModel.instance.vulcanId = this.copyData[GetXuanhuoCopyDataReplyFields.vulcanId]
            GlobalData.dispatcher.event(CommonEventType.XUANHUO_COPY_VULCAN_UPDATE);


        }
        private _TimingRequest: boolean = false;
        private TimingRequest() {
            /* 场景内时间增加 */
            this._copyData[GetXuanhuoCopyDataReplyFields.onlineTime] += 500

            /* 检查玄火之力清除 */
            if (this._copyData[GetXuanhuoCopyDataReplyFields.xuanhuoPower][1] != 0 &&
                this._copyData[GetXuanhuoCopyDataReplyFields.xuanhuoPower][1] < GlobalData.serverTime) {
                //调整玄火展示
                this._copyData[GetXuanhuoCopyDataReplyFields.xuanhuoPower][0] = 0
                this._copyData[GetXuanhuoCopyDataReplyFields.xuanhuoPower][1] = 0
                GlobalData.dispatcher.event(CommonEventType.Xuanhuo_SCORE_UPDATE);
            }

            /* 10秒请求一次信息 */
            if (this._copyData[GetXuanhuoCopyDataReplyFields.onlineTime] % (10 * 1000) < 1000) {
                XuanHuoCtrl.instance.getInfoCopy()
            }

            /* 玄火+ Tips 500毫秒检查一次 */
            if (this.scoreData.length > 0 && ScoreNoticeManager.instance.queueLenght() == 0 && !ScoreNoticeManager.instance.isPlaying()) {
                let num = 0
                this.scoreData.forEach((value) => {
                    num += value[1]
                })
                this.scoreData = new Array<ScoreNoticeInfo>();
                ScoreNoticeManager.instance.addNotice(ScoreNoticeType.Xuanhuo, num);
            }


        }

        /**
         * 获取战队玄火玩家(战队)排名奖励信息
         * @param type 0=玩家排行奖励 1=战队排行奖励
        */
        public getRnakAwardByType(type: number): Array<xuanhuoRankAward> {
            let rankAwards: Table<xuanhuoRankAward>;
            if (type == 0) {
                rankAwards = XuanHuoRankAwardCfg.instance.getAllPersonConfig();
            } else {
                rankAwards = XuanHuoRankAwardCfg.instance.getAllClanConfig();
            }
            let array: Array<xuanhuoRankAward> = new Array<xuanhuoRankAward>();

            for (const rank in rankAwards) {
                const data = rankAwards[rank];
                let index = parseInt(rank);
                //4-5名 6-10名 11-20名奖励重叠，只显示 4 6 11的奖励
                if (index == 5) continue;
                if (index >= 7 && index <= 10) continue;
                if (index >= 12 && index <= 20) continue;
                array.push(data)
            }

            return array;
        }

        private scoreData: Array<ScoreNoticeInfo> = new Array<ScoreNoticeInfo>();
        // 积分
        public get score(): updateXuanhuoNum {
            return this._score;
        }
        //设置玄火积分
        public set score(value: updateXuanhuoNum) {
            if (value[updateXuanhuoNumFields.addScore]) {
                // SystemNoticeManager.instance.addNotice(`本层积分+${value[UpdateScoreFields.addScore]}`);
                this.scoreData.push([ScoreNoticeType.Xuanhuo, value[updateXuanhuoNumFields.addScore]])
            }
            this.retainMax = value[updateXuanhuoNumFields.retain]
            this._score = value;
            if (!this.CopyHumanData.has(PlayerModel.instance.actorId)) this.CopyHumanData.set(PlayerModel.instance.actorId, [0, "", 0, false, ""])
            let item = this.CopyHumanData.get(PlayerModel.instance.actorId)
            item[2] = value[updateXuanhuoNumFields.score]


            let teamId = item[4]
            if (this.CopyTeamData.has(teamId)) {
                let team = this.CopyTeamData.get(teamId)
                team[2] += value[updateXuanhuoNumFields.addScore]
            }
            GlobalData.dispatcher.event(CommonEventType.Xuanhuo_SCORE_UPDATE);
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
        public set achievementList(value: XuanHuoAchievementListReply) {
            let needShowRP: boolean = false;
            let datas: Array<xuanhuoAchievementShow> = new Array<xuanhuoAchievementShow>();
            let curTypesDataArr = value[XuanHuoAchievementListReplyFields.type];
            let stateList = this.getAchievementMaxTaskArr(value[XuanHuoAchievementListReplyFields.list]);
            let allTypesFirstData = XuanHuoAchievementCfg.instance.getAllTypesTabAtFirstData();
            let length = stateList.length;
            for (const type in allTypesFirstData) {
                let curTypeCfg = allTypesFirstData[type];
                let taskId = -1;
                let status = 0;
                let current = this.getAchievementCurrent(curTypesDataArr, type);
                //遍历的statelist的内容
                for (let i = length - 1; i >= 0; i--) {
                    const __taskId = stateList[i][0];
                    const __status = stateList[i][1];
                    const taskCfg = XuanHuoAchievementCfg.instance.getConfigByTaskId(__taskId);
                    if (taskCfg[xuanhuoAchievementFields.type] == parseInt(type)) {
                        curTypeCfg = taskCfg;
                        taskId = __taskId;
                        status = __status;
                        if (status == 1) needShowRP = true;
                    }
                }

                let desc: string = curTypeCfg[xuanhuoAchievementFields.describe];
                let condition: number = curTypeCfg[xuanhuoAchievementFields.condition];
                let _items: Items = curTypeCfg[xuanhuoAchievementFields.items];
                //加入到datas中
                datas.push([taskId, desc, current, condition, status, _items]);
            }
            datas.sort((a, b) => {
                return a[4] == 1 ? -1 : 0;
            })
            this._achievementList = datas;
            this.checkAchievementRP(needShowRP);
            //派发事件，更新界面
            GlobalData.dispatcher.event(CommonEventType.Update_XUANHUO_ACHIEVEMENT_VIEW);
        }

        //获取当前成就是实时完成度
        private getAchievementCurrent(curTypesDataArr, type) {
            type = parseInt(type);
            let current = 0;

            for (let index = 0; index < curTypesDataArr.length; index++) {
                if (curTypesDataArr[index][0] == type) {
                    current = curTypesDataArr[index][1];
                }
            }

            return current;
        }

        //获取每一类任务需要显示的那一条任务
        private getAchievementMaxTaskArr(stateList) {
            let tempTable = {};

            for (let index = 0; index < stateList.length; index++) {
                const element = stateList[index];
                const type = parseInt((element[0] / 10000) + "");
                if (tempTable[type] == null) {
                    tempTable[type] = element;
                } else {
                    //如果有未领取的状态则显示未领取的
                    if (tempTable[type][0] <= element[0] && tempTable[type][1] != 1) {
                        tempTable[type] = element;
                    }
                }
            }
            let tempArr = [];
            for (const type in tempTable) {
                const element = tempTable[type];
                const taskId = element[0];
                //检测是否需要加载下一个任务
                if (element[1] == 2) {
                    let lastObj = XuanHuoAchievementCfg.instance.getCurrentTypeNextData(taskId);
                    // 最后一个任务且状态为2则不处理，其他的都需要加载下一任务且状态为0
                    if (!lastObj.isLast) {
                        tempTable[type] = [lastObj.nextTaskId, 0]
                    }
                }

                tempArr.push(tempTable[type]);
            }

            return tempArr;
        }

        //检测成就红点
        private checkAchievementRP(needShowRP: boolean) {
            RedPointCtrl.instance.setRPProperty("XHMainAchievementRP", needShowRP);
        }

        /**
         * 获取玄火获取奖励数据列表
        */
        public get xuanhuoGetAwardList(): any {
            return this._xuanhuoGetAwardList;
        }

        /**
         * 设置玄火获取奖励数据列表
        */
        public set xuanhuoGetAwardList(value: XuanHuoGetAwardReply) {
            let datas: Array<xuanhuoGetAwardShow> = new Array<xuanhuoGetAwardShow>();

            let all_cfg: Table<xuanhuoGetAward> = XuanHuoGetAwardCfg.instance.getAllConfig();

            let current: number = value[XuanHuoGetAwardReplyFields.xuanhuoNum];
            let list: Array<number> = value[XuanHuoGetAwardReplyFields.list];
            let index: number = 0;

            for (const key in all_cfg) {
                const single_cfg: xuanhuoGetAward = all_cfg[key];
                let taskId: number = single_cfg[xuanhuoGetAwardFields.taskId];
                let desc: string = single_cfg[xuanhuoGetAwardFields.describe];
                let condition: number = single_cfg[xuanhuoGetAwardFields.condition];
                let _items: Array<Items> = single_cfg[xuanhuoGetAwardFields.items];
                let status: number = 0;

                if (list.length > index) {
                    status = list[index];
                }

                datas.push([taskId, desc, current, condition, status, _items]);
                index++;
            }
            datas.sort((a, b) => {
                return a[xuanhuoGetAwardShowFields.status] - b[xuanhuoGetAwardShowFields.status];
            })
            datas.sort((a, b) => {
                if (a[xuanhuoGetAwardShowFields.status] == 1) return -1;
            })

            this._xuanhuoGetAwardList = datas;
            //派发事件，更新界面
            GlobalData.dispatcher.event(CommonEventType.Update_XUANHUO_GET_AWARD_VIEW);
        }
        public playerType: number = 0
        //设置选择的目标
        public setSelectTarget(id: number, isBoss: boolean): void {
            let model = PlayerModel.instance;
            if (id == -1) {
                model.selectTarget(SelectTargetType.Monster, -1);
                // console.log("没有BOSS可以打了,打小怪");
                GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
            } else {
                this._isDummy = false;
                if (isBoss) {
                    if (DungeonModel.instance.getBossInfoById(id)) {

                        BossDungeonModel.instance.selectTargetPos = DungeonModel.instance.getBossInfoById(id)[BossInfoFields.pos];
                        // console.log("  BossDungeonModel.instance.selectTargetPos", BossDungeonModel.instance.selectTargetPos)
                        BossDungeonModel.instance.selectLastBoss = id;
                        model.selectTarget(SelectTargetType.Monster, id);
                    }
                    else {
                        modules.notice.SystemNoticeManager.instance.addNotice(`BOSS: ${id} 拿不到信息`, true);
                    }
                    GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
                }
                else {
                    // console.log("打玩家");
                    XuanHuoModel.instance.selectTargetPos = [0, 0]
                    XuanHuoCtrl.instance.getreqSearchObj(id)
                    // model.selectTarget(SelectTargetType.Player, id);

                }
            }
        }

        /**
         * 玄火副本结算数据获取
        */
        public get xuanhuoCopySettlementData(): any {
            return this._xuanhuoCopySettlementData;
        }

        /**
         * 玄火副本结算数据设置
        */
        public set xuanhuoCopySettlementData(data: XuanhuoCopyJudgeAward) {
            this._xuanhuoCopySettlementData = data;
        }

    }

}
