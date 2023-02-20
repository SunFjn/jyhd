///<reference path="../config/xianfu_cfg.ts"/>
///<reference path="../config/scene_homestead_cfg.ts"/>
///<reference path="../config/xianfu_skill_cfg.ts"/>
///<reference path="../config/xianfu_build_cfg.ts"/>

/** 仙府-家园model */
namespace modules.xianfu {
    import UpdateXianFuInfo = Protocols.UpdateXianFuInfo;
    import UpdateXianFuInfoFields = Protocols.UpdateXianFuInfoFields;
    import xianfu = Configuration.xianfu;
    import XianfuNode = Configuration.XianfuNode;
    import xianfuFields = Configuration.xianfuFields;
    import XianfuNodeFields = Configuration.XianfuNodeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import UpdateBuildingInfo = Protocols.UpdateBuildingInfo;
    import XianfuCfg = modules.config.XianfuCfg;
    import UpdateProduceCoin = Protocols.UpdateProduceCoin;
    import UpdateProduceCoinFields = Protocols.UpdateProduceCoinFields;
    import GetXianFuInfoReply = Protocols.GetXianFuInfoReply;
    import GetXianFuInfoReplyFields = Protocols.GetXianFuInfoReplyFields;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import UpdateIllustratedHandbook = Protocols.UpdateIllustratedHandbook;
    import Dictionary = Laya.Dictionary;
    import UpdateIllustratedHandbookFields = Protocols.UpdateIllustratedHandbookFields;
    import UpdateXianFuTaskState = Protocols.UpdateXianFuTaskState;
    import XianFuTask = Protocols.XianFuTask;
    import UpdateXianFuTaskStateFields = Protocols.UpdateXianFuTaskStateFields;
    import XianFuTaskFields = Protocols.XianFuTaskFields;
    import SceneHomesteadCfg = modules.config.SceneHomesteadCfg;
    import Item = Protocols.Item;
    import DropNoticeManager = modules.notice.DropNoticeManager;
    import xianfu_skill = Configuration.xianfu_skill;
    import XianfuSkillCfg = modules.config.XianfuSkillCfg;
    import xianfu_skillFields = Configuration.xianfu_skillFields;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;

    export class XianfuModel {
        private static _instance: XianfuModel;
        public static get instance(): XianfuModel {
            return this._instance = this._instance || new XianfuModel();
        }

        private _lv: number;
        private _fengshuiLv: number;  //风水等级
        private _fengshuiResList: number[]; //激活的风水物件列表
        private _buildInfo: Table<GetBuildingInfoReply>;//0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
        private _panelType: number;  // 农场 0聚灵厅 炼金室 1炼制崖 游历 2灵兽阁
        private _treasureInfos: number[]; //0药草值 1财富值 2仙府-家园任务次数 3风水值
        private _petInfos: Table<UpdateSpiritAnimalTravel>;
        private _activeGrade: number[];  //活跃值已经领取的档位
        private _taskInfos: Array<XianFuTask>;//仙府-家园任务列表
        private _taskSchedule: number; // 任务活跃值
        private _handBookList: Table<number>;//已经激活的图鉴列表
        private _handBookRes: Dictionary; //图鉴碎片
        private _xianfuEvents: Protocols.XianFuEvent;  //仙府-家园事件
        private _xianfuMallList: number[];  //商店列表
        private _handbookRPStrs: Array<keyof ui.RedPointProperty>;  //手书红点数组
        private _resListRPStrs: Array<keyof ui.RedPointProperty>;  //物件红点
        private _selectTaskActiveAward: number;  //任务活跃度奖励
        private _maxRuningCount: number;  //宠物每日最大游历次数
        private _skillList: number[]; //技能列表

        public maxOutput: number[]; //最大产出 时间或者份数 对应建筑ID
        public stageOutput: number[]; //阶段产出时间  多长时间后可以收获
        public intervalOutPutTime: number[]; //间隔产出时间
        public buildType: number;  //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
        public selectPetIndex: number;  // 0  1  2  3
        public selectSite: number; //宠物游历选中的地点 1234
        public selectBuyProp: number;  //选中购买的道具 0 罗盘 1 护身符
        public taskActivesValue: number[]; //任务活跃值
        public taskActivesAward: number[][]; //任务活跃奖励
        public eventIds: number[];   //触发小管家ids
        public successAddValue: number = 0; //炼制合成加成的成功几率
        public maxRuningCountAddValue: number = 0; //每日可游历最大次数
        public dailySmeltTimeAddValue: number = 0;  //开炉一次增加最大炼制次数
        public smeltConsumeReduceValue: number = 0;  //风水减少消耗
        public travelConsumeReduceValue: number = 0;//游历减少消耗
        public travelExpAddValue: number = 0;//游历经验增加比例
        public selectSkill: number;

        private constructor() {
            this._lv = 0;
            this._fengshuiLv = 0;
            this._panelType = 0;
            this._taskSchedule = 0;
            this._buildInfo = {};
            this._petInfos = {};
            this.maxOutput = [];
            this.stageOutput = [];
            this.intervalOutPutTime = [];
            this._treasureInfos = [];
            this._activeGrade = [];
            this._taskInfos = [];
            this._xianfuMallList = [];
            this._fengshuiResList = [];
            this._handBookList = {};
            this._handBookRes = new Dictionary();

            this._maxRuningCount = BlendCfg.instance.getCfgById(27007)[blendFields.intParam][0];
            let value: number[] = BlendCfg.instance.getCfgById(27001)[blendFields.intParam];
            this.maxOutput[0] = value[2];
            this.stageOutput[0] = value[1];
            this.intervalOutPutTime[0] = value[1];
            this.maxOutput[1] = value[5];
            this.stageOutput[1] = value[4];
            this.intervalOutPutTime[1] = value[4];
            value = BlendCfg.instance.getCfgById(27002)[blendFields.intParam];
            this.maxOutput[2] = value[1];
            this.maxOutput[3] = value[3];
            this.maxOutput[4] = value[5];
            value = BlendCfg.instance.getCfgById(27004)[blendFields.intParam];
            this.intervalOutPutTime[2] = value[0];
            this.intervalOutPutTime[3] = value[0];
            this.intervalOutPutTime[4] = value[0];
            this.taskActivesValue = [];
            this.taskActivesAward = [];
            let taskActives: string[] = BlendCfg.instance.getCfgById(27011)[blendFields.stringParam];

            for (let i: int = 0, len: int = taskActives.length; i < len; i++) {
                let list = taskActives[i].substr(1, taskActives[i].length - 2).split("#");
                let id: number = parseInt(list[0]);
                this.taskActivesValue[i] = id;
                if (!this.taskActivesAward[i]) {
                    this.taskActivesAward[i] = [];
                }
                for (let j: int = 1; j < list.length; j++) {
                    this.taskActivesAward[i].push(parseInt(list[j]));
                }
            }

            this.buildType = -1;
            this.selectSite = -1;
            this.selectBuyProp = -1;
            this._handbookRPStrs = ["xianfuBlueHandBookRP", "xianfuVioletHandBookRP", "xianfuOrangeHandBookRP", "xianfuRedHandBookRP"];
            this._resListRPStrs = ["xianfuArticleRP_0", "xianfuArticleRP_1", "xianfuArticleRP_2"];
            this.eventIds = [];
        }

        //更新数值
        public updateProduceCoin(tuple: UpdateProduceCoin): void {
            this._treasureInfos[0] = tuple[UpdateProduceCoinFields.lingqi];
            this._treasureInfos[1] = tuple[UpdateProduceCoinFields.riches];
            this._treasureInfos[3] = tuple[UpdateProduceCoinFields.fengShui];
            this._treasureInfos[4] = tuple[UpdateProduceCoinFields.accLingqi];
            this._treasureInfos[5] = tuple[UpdateProduceCoinFields.accRiches];
            this._taskSchedule = tuple[UpdateProduceCoinFields.active];
            GlobalData.dispatcher.event(CommonEventType.XIANFU_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.XIANFU_BUILD_UPDATE);
            this.checkShengjiRP();
        }

        //仙府-家园信息返回
        public getXianFuInfoReply(tuple: GetXianFuInfoReply): void {
            this._lv = tuple[GetXianFuInfoReplyFields.level];
            this._treasureInfos[0] = tuple[GetXianFuInfoReplyFields.lingqi];
            this._treasureInfos[1] = tuple[GetXianFuInfoReplyFields.riches];
            this._treasureInfos[2] = tuple[GetXianFuInfoReplyFields.taskCount];
            this._treasureInfos[3] = tuple[GetXianFuInfoReplyFields.fengShui];
            this._treasureInfos[4] = tuple[GetXianFuInfoReplyFields.accLingqi];
            this._treasureInfos[5] = tuple[GetXianFuInfoReplyFields.accRiches];
            this._taskSchedule = tuple[GetXianFuInfoReplyFields.active];
            this._activeGrade = tuple[GetXianFuInfoReplyFields.activeIndex];
            GlobalData.dispatcher.event(CommonEventType.XIANFU_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.XIANFU_BUILD_UPDATE);
            this.checkShengjiRP();
            this.checkTaskRP();
        }

        //更新仙府-家园升级
        public updateInfo(tuple: UpdateXianFuInfo) {
            this._lv = tuple[UpdateXianFuInfoFields.level];
            this._treasureInfos[2] = tuple[UpdateXianFuInfoFields.taskCount];
            this._activeGrade = tuple[UpdateXianFuInfoFields.activeIndex];
            GlobalData.dispatcher.event(CommonEventType.XIANFU_UPDATE);
            this.checkShengjiRP();
            this.checkTaskRP();
            if (XianfuCfg.instance.PetOpenLv[this._lv]) {
                XianfuCtrl.instance.getSpiritAnimalTravel([XianfuCfg.instance.PetOpenLv[this._lv]]);
            }
        }

        //建筑信息
        public getBuildingInfoReply(tuple: UpdateBuildingInfo): void {
            let id: number = tuple[GetBuildingInfoReplyFields.id];
            this._buildInfo[id] = tuple;
            this.checkAllRPEvent();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_BUILD_UPDATE);
        }

        //仙府-家园风水信息
        public updateXianFuFengShuiInfo(tuple: Protocols.UpdateXianFuFengShuiInfo): void {
            this._fengshuiLv = tuple[Protocols.UpdateXianFuFengShuiInfoFields.level];
            let arr: number[] = tuple[Protocols.UpdateXianFuFengShuiInfoFields.decorateList];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let itemId: number = this._fengshuiResList[i] = arr[i];
                let currCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(itemId);
                let nextCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(itemId + 1);
                this.fengshuiAddAttr(currCfg, nextCfg);
            }
            this.checkArticleRP();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_WIND_WATER_UPTATE);
        }

        //仙府-家园事件更新
        public xianFuEvent(tuple: Protocols.XianFuEvent): void {
            this._xianfuEvents = tuple;
            if (tuple[Protocols.XianFuEventFields.eventId] == XianFuEvent.mall) {
                XianfuCtrl.instance.getXianfuMall();
            }
            this.checkAllRPEvent();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_EVENT_UPDATE);
        }

        //灵兽游历信息
        public updateSpiritAnimalTravel(tuple: UpdateSpiritAnimalTravel): void {
            this._petInfos[tuple[UpdateSpiritAnimalTravelFields.id]] = tuple;
            this.checkAllRPEvent();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_PET_UPDATE);
        }

        //仙府-家园任务列表
        public updateXianFuTaskState(tuple: UpdateXianFuTaskState): void {
            this._taskInfos = tuple[UpdateXianFuTaskStateFields.taskList];
            this.checkTaskRP();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_TASK_UPDATE);
        }

        //仙府-家园技能更新
        public set skillList(list: number[]) {
            this._skillList = list;
            GlobalData.dispatcher.event(CommonEventType.XIANFU_SKILL_UPDATE);
            this.checkShengjiRP();
        }

        public get skillList(): number[] {
            return this._skillList;
        }

        //仙府-家园商店列表
        public xianfuMallReply(tuple: number[]): void {
            this._xianfuMallList = tuple;
        }

        //小管家红点事件推送
        public checkAllRPEvent(): void {
            // 0、神秘商人事件触发及进行中。
            // 1、魔兵入侵事件触发及进行中。
            // 2、魔将突袭事件触发及进行中。
            // 3、灵脉爆发事件触发及进行中。
            // 4、宝矿爆发事件触发及进行中。
            // 5、农场 聚灵厅有收益达到上限时。
            // 6、炼金室 炼制崖有收获可领时。
            // 7、炼制崖有炉子闲置且该炉子有炼制次数时（未开启不算）。
            // 8、游历 灵兽阁有灵兽游历可收获时。
            // 9、灵兽阁有灵兽休息且有游历次数时（未开启不算）。
            let tempEventIds: number[] = [];
            RedPointCtrl.instance.setRPProperty("xianfuEventRP", false);

            //仙府-家园外优先出神秘商人外的事件
            let eventId: number = this.checkEventRP();
            if (eventId == XianFuEvent.mall) {
                tempEventIds.push(eventId - 1);
            } else if (eventId !== XianFuEvent.none) {
                if (this.eventIds.indexOf(eventId - 1) !== -1) {
                    RedPointCtrl.instance.setRPProperty("xianfuEventRP", true);
                    return;
                }
                tempEventIds.push(eventId - 1);
                this.eventIds = tempEventIds;
                RedPointCtrl.instance.setRPProperty("xianfuEventRP", true);
                GlobalData.dispatcher.event(CommonEventType.XIANFU_ALL_RP_EVENT);
                return;
            }

            //类型5
            if (this.julingEvent) {
                tempEventIds.push(this.julingEvent);
            }
            //类型6
            if (this.lianzhiEvent) {
                tempEventIds.push(this.lianzhiEvent);
            }
            //类型7
            if (this.lianzhiHaveTime) {
                tempEventIds.push(this.lianzhiHaveTime);
            }
            //类型8
            if (this.petEvent) {
                tempEventIds.push(this.petEvent);
            }
            //类型9 灵兽阁有灵兽休息且有游历次数时（未开启不算）
            if (this.petHaveTime) {
                tempEventIds.push(this.petHaveTime);
            }
            RedPointCtrl.instance.setRPProperty("xianfuEventRP", tempEventIds.length > 0);

            for (let i: int = 0, len: int = tempEventIds.length; i < len; i++) {
                let id: number = tempEventIds[i];
                if (this.eventIds.indexOf(id) == -1) {
                    this.eventIds = tempEventIds;
                    GlobalData.dispatcher.event(CommonEventType.XIANFU_ALL_RP_EVENT);
                    return;
                }
            }
            this.eventIds = tempEventIds;
        }

        //仙府-家园事件检测
        public checkEventRP(): number {
            let event: Protocols.XianFuEvent = this._xianfuEvents;
            if (event && event[Protocols.XianFuEventFields.isOpen]) {
                let eventId: number = event[Protocols.XianFuEventFields.eventId];   //事件id
                return eventId;
            }
            return XianFuEvent.none;
        }

        /**聚灵厅有收益达到上限时 类型5*/
        public get julingEvent(): number {
            for (let i: int = 0; i < 2; i++) {
                if (!this._buildInfo[i]) continue;
                let state: number = this._buildInfo[i][GetBuildingInfoReplyFields.state];
                if (state == 3) {
                    return 5;
                }
            }
            return null;
        }

        /**炼制崖有收获可领时 类型6 */
        public get lianzhiEvent(): number {
            for (let i: int = 2; i < 5; i++) {
                if (!this._buildInfo[i]) continue;
                let state: number = this._buildInfo[i][GetBuildingInfoReplyFields.state];
                if (state == 2) {
                    return 6;
                }
            }
            return null;
        }

        /**炼制崖有炉子闲置且该炉子有炼制次数时（未开启不算）  并且消耗品足够 类型7 */
        public get lianzhiHaveTime(): number {
            for (let i: int = 2; i < 5; i++) {
                if (!this._buildInfo[i]) continue;
                let state: number = this._buildInfo[i][GetBuildingInfoReplyFields.state];
                if (state == 0) {
                    let buildLv: number = this.getBuildInfo(i)[GetBuildingInfoReplyFields.level];
                    let buildCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(i, buildLv);
                    if (!buildCfg) continue;
                    let products: Array<Array<number>> = buildCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
                    for (let ele of products) {
                        let needItemId: number = ele[2];
                        let needItemNum: number = ele[3];
                        let haveNum: number = CommonUtil.getPropCountById(needItemId);
                        if (haveNum >= needItemNum) {
                            return 7;
                        }
                    }
                }
            }
            return null;
        }

        /**灵兽阁有灵兽游历可收获时 类型8 */
        public get petEvent(): number {
            for (let key in this._petInfos) {
                let state: number = this._petInfos[key][UpdateSpiritAnimalTravelFields.state];
                if (state == 2) {
                    return 8;
                }
            }
            return null;
        }

        /**灵兽阁有灵兽休息且有游历次数时（未开启不算）并且消耗品足够 类型9  */
        public get petHaveTime(): number {
            for (let key in this._petInfos) {
                let state: number = this._petInfos[key][UpdateSpiritAnimalTravelFields.state];
                if (state == 0) {
                    let yetTime: number = this._petInfos[key][UpdateSpiritAnimalTravelFields.travelCount];
                    let residueTime: number = this._maxRuningCount - yetTime;
                    if (residueTime > 0) {
                        let siteIds: number[] = config.XianfuTravelCfg.instance.ids;
                        for (let i: int = 0, len: int = siteIds.length; i < len; i++) {
                            let travelCfg: Configuration.xianfu_travel = config.XianfuTravelCfg.instance.getCfgById(siteIds[i]);
                            let consume: Configuration.Items = travelCfg[Configuration.xianfu_travelFields.consume];
                            let needNum: number = Math.floor(consume[Configuration.ItemsFields.count] * (1 - XianfuModel.instance.travelConsumeReduceValue * 0.01));
                            let haveNum: number = this._treasureInfos[1];
                            if (haveNum >= needNum) {
                                return 9;
                            }
                        }
                    }
                }
            }
            return null;
        }

        //获取图鉴返回
        public getIllustratedHandbookReply(tuple: Protocols.GetIllustratedHandbookReply): void {
            let list: Array<Protocols.Pair> = tuple[Protocols.GetIllustratedHandbookReplyFields.list];
            let resList: Array<Protocols.Pair> = tuple[Protocols.GetIllustratedHandbookReplyFields.resList];
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                let id: number = list[i][Protocols.PairFields.first];
                let num: number = list[i][Protocols.PairFields.second];
                this._handBookList[id] = num;
            }
            for (let i: int = 0, len: int = resList.length; i < len; i++) {
                let id: number = resList[i][Protocols.PairFields.first];
                let currNum: number = resList[i][Protocols.PairFields.second];
                this._handBookRes.set(id, currNum);
            }
            this.checkHandBookRP();
            GlobalData.dispatcher.event(CommonEventType.HAND_BOOK_UPDATE);
        }

        //图鉴更新
        public updateIllustratedHandbook(tuple: UpdateIllustratedHandbook): void {
            let list: Array<Protocols.Pair> = tuple[UpdateIllustratedHandbookFields.list];
            let resList: Array<Protocols.Pair> = tuple[UpdateIllustratedHandbookFields.resList];
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                let id: number = list[i][Protocols.PairFields.first];
                let num: number = list[i][Protocols.PairFields.second];
                this._handBookList[id] = num;
            }
            let arr: Array<Item> = new Array<Item>();
            for (let i: int = 0, len: int = resList.length; i < len; i++) {
                let id: number = resList[i][Protocols.PairFields.first];
                let currNum: number = resList[i][Protocols.PairFields.second];
                let hasNum: number = this._handBookRes.get(id);
                if (hasNum == null) hasNum = 0;
                if (currNum - hasNum > 0) {
                    arr.push([id, currNum - hasNum, 0, null]);
                }
                this._handBookRes.set(id, currNum);
            }
            DropNoticeManager.instance.addItems(arr);
            this.checkHandBookRP();
            GlobalData.dispatcher.event(CommonEventType.HAND_BOOK_UPDATE);
        }

        /**升级红点检测 */
        public checkShengjiRP(): boolean {
            if (!this._lv) return;
            if (this._skillList && !this._skillList.length) { //一个都未激活
                if (this._lv >= XianfuSkillCfg.instance.firstLv) {
                    RedPointCtrl.instance.setRPProperty("xianfuShengjiRP", true);
                    return true;
                }
            } else if (this._skillList) {
                for (let id of this._skillList) {
                    let nextCfg: xianfu_skill = XianfuSkillCfg.instance.getCfgBySkillId(id + 1);
                    let skillNeedLv: number = nextCfg ? nextCfg[xianfu_skillFields.level] : null;
                    if (nextCfg && this._lv >= skillNeedLv) {
                        RedPointCtrl.instance.setRPProperty("xianfuShengjiRP", true);
                        return true;
                    }
                }
            }
            let nextCfgs: Array<xianfu> = XianfuCfg.instance.getCfgByLv(this._lv + 1);
            if (!nextCfgs) {
                RedPointCtrl.instance.setRPProperty("xianfuShengjiRP", false);
                return false;
            }
            let currCfg: xianfu = XianfuCfg.instance.getCfgByLv(this._lv)[0];
            let taskInfos: Array<XianfuNode> = currCfg[xianfuFields.nodes];
            for (let i: int = 0, len: int = taskInfos.length; i < len; i++) {
                let taskType: number = taskInfos[i][XianfuNodeFields.type];
                let maxValue: number = taskInfos[i][XianfuNodeFields.value];
                if (this._treasureInfos[taskType] < maxValue) {
                    RedPointCtrl.instance.setRPProperty("xianfuShengjiRP", false);
                    return false;
                }
            }
            RedPointCtrl.instance.setRPProperty("xianfuShengjiRP", true);
            return true;
        }

        /**任务红点检测 */
        public checkTaskRP(): boolean {
            for (let i: int = 0, len: int = this._taskInfos.length; i < len; i++) {
                let state: number = this._taskInfos[i][XianFuTaskFields.state];
                if (state == 1) {
                    RedPointCtrl.instance.setRPProperty("xianfuTaskRP", true);
                    return true;
                }
            }
            for (let i: int = 0, len: int = this.taskActivesValue.length; i < len; i++) {
                if (XianfuModel.instance.taskSchedule >= XianfuModel.instance.taskActivesValue[i] &&
                    XianfuModel.instance.activeGrade.indexOf(i) == -1) {  //等于-1就是没领
                    RedPointCtrl.instance.setRPProperty("xianfuTaskRP", true);
                    return true;
                }
            }
            RedPointCtrl.instance.setRPProperty("xianfuTaskRP", false);
            return false;
        }

        //仙府-家园图鉴红点
        private checkHandBookRP(): void {
            for (let i: int = 0; i < 4; i++) {
                RedPointCtrl.instance.setRPProperty(this._handbookRPStrs[i], false);
                let ids: Table<number> = config.XianfuHandBookCfg.instance.getIdsByType(i);
                for (let key in ids) {
                    let id: number = ids[key];
                    let level = this._handBookList[id];
                    if (!level) level = 0;
                    let itemCfg: Configuration.xianfu_illustrated_handbook = config.XianfuHandBookCfg.instance.getCfgByIdAndLv(id, level);
                    let nextCfg: Configuration.xianfu_illustrated_handbook = config.XianfuHandBookCfg.instance.getCfgByIdAndLv(id, level + 1);
                    let needItemId = itemCfg[Configuration.xianfu_illustrated_handbookFields.items][Configuration.ItemsFields.itemId];
                    let needItemNum = itemCfg[Configuration.xianfu_illustrated_handbookFields.items][Configuration.ItemsFields.count];
                    let hasItemNum = this._handBookRes.get(needItemId);
                    if (hasItemNum >= needItemNum && nextCfg) {
                        RedPointCtrl.instance.setRPProperty(this._handbookRPStrs[i], true);
                        break;
                    }
                }
            }
        }

        //仙府-家园物件激活红点
        public checkArticleRP(): boolean {
            let flag: boolean = false;
            for (let j: int = 0; j < 3; j++) {
                let ids: number[] = config.XianfuDecorateCfg.instance.getIdsByBigType(j);
                let fengshuiResList: Array<number> = XianfuModel.instance.fengshuiResList;
                for (let i: int = 0, len: int = fengshuiResList.length; i < len; i++) {
                    let id: number = fengshuiResList[i];
                    for (let j: int = 0; j < ids.length; j++) {
                        if (ids[j] / 100 >> 0 == id / 100 >> 0) {
                            ids[j] = id;
                        }
                    }
                }
                RedPointCtrl.instance.setRPProperty(this._resListRPStrs[j], false);
                for (let i: int = 0, len: int = ids.length; i < len; i++) {
                    let needItemId: number = config.XianfuDecorateCfg.instance.getCfgById(ids[i])[Configuration.xianfu_decorateFields.items][0];
                    let needNum: number = config.XianfuDecorateCfg.instance.getCfgById(ids[i])[Configuration.xianfu_decorateFields.items][1];
                    let hasNum: number = bag.BagModel.instance.getItemCountById(needItemId);
                    let nextCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(ids[i] + 1);
                    if (hasNum >= needNum && nextCfg) {
                        RedPointCtrl.instance.setRPProperty(this._resListRPStrs[j], true);
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        }

        public get lv(): number {
            return this._lv;
        }

        public get fengshuiLv(): number {
            return this._fengshuiLv;
        }

        public get fengshuiResList(): Array<number> {
            return this._fengshuiResList;
        }

        public get taskSchedule(): number {
            return this._taskSchedule;
        }

        public get taskInfos(): XianFuTask[] {
            return this._taskInfos;
        }

        public get handBook(): Table<number> {
            return this._handBookList;
        }

        public get xianfuEvent(): Protocols.XianFuEvent {
            return this._xianfuEvents;
        }

        public get handBookRes(): Dictionary {
            return this._handBookRes;
        }

        /** 0药草值 1财富值=粮食 2仙府-家园任务次数 3风水值*/
        public treasureInfos(type: number): number {
            return this._treasureInfos[type];
        }

        public getBuildInfo(type: number): GetBuildingInfoReply {
            return this._buildInfo[type];
        }

        public set panelType(type: number) {
            this._panelType = type;
        }

        public get panelType(): number {
            return this._panelType;
        }

        public set selectTaskActiveAward(index: number) {
            this._selectTaskActiveAward = index;
        }

        public get selectTaskActiveAward(): number {
            return this._selectTaskActiveAward;
        }

        public get activeGrade(): number[] {
            return this._activeGrade;
        }

        public get xianfuMallIds(): number[] {
            return this._xianfuMallList;
        }

        public getPetInfos(id: number): UpdateSpiritAnimalTravel {
            return this._petInfos[id];
        }

        public get maxRuningCount(): number {
            return this._maxRuningCount + this.maxRuningCountAddValue;
        }

        public getAllPetInfos(): Table<UpdateSpiritAnimalTravel> {
            return this._petInfos;
        }

        //刷怪点的区域Id  0小怪 1BOSS
        public areaId(): number {
            if (!this._xianfuEvents) {
                return -1;
            }
            let id: number = this._xianfuEvents[Protocols.XianFuEventFields.eventId];
            let wheel: number = this._xianfuEvents[Protocols.XianFuEventFields.wheel]; //轮
            let ware: number = this._xianfuEvents[Protocols.XianFuEventFields.ware]; //波
            let cfg: Configuration.scene_homestead = SceneHomesteadCfg.instance.getCfgByLvAndWheel(this._fengshuiLv, wheel);
            let posId: number = -1;
            if (id == XianFuEvent.Intrusion) {//魔兵入侵 2
                posId = cfg[Configuration.scene_homesteadFields.monster][ware - 1][4];
            } else if (id == XianFuEvent.boss) {//boss入侵 3
                posId = cfg[Configuration.scene_homesteadFields.bossOcc][ware - 1][2];
            } else if (id == XianFuEvent.collect) {//灵脉爆发 采集物 4
                posId = cfg[Configuration.scene_homesteadFields.collect][6];
            } else if (id == XianFuEvent.treasure) {//宝矿爆发 宝箱 5
                posId = cfg[Configuration.scene_homesteadFields.collect][6];
            }
            return posId;
        }

        //图鉴工具
        public getHandbookStateById(id: number): number {
            let level = XianfuModel.instance.handBook[id];
            if (!level) level = 0;
            let itemCfg: Configuration.xianfu_illustrated_handbook = config.XianfuHandBookCfg.instance.getCfgByIdAndLv(id, level);
            let state: number;
            let needItemId = itemCfg[Configuration.xianfu_illustrated_handbookFields.items][Configuration.ItemsFields.itemId];
            let needItemNum = itemCfg[Configuration.xianfu_illustrated_handbookFields.items][Configuration.ItemsFields.count];
            let hasItemNum = XianfuModel.instance.handBookRes.get(needItemId);
            if (!level) {  //未激活
                if (hasItemNum && hasItemNum >= needItemNum) {
                    state = TalismanState.active; //可激活
                } else {
                    state = TalismanState.withouract;  //未激活
                }
            } else if (level >= config.XianfuHandBookCfg.instance.maxLv) {
                state = TalismanState.maxlevel; //已满级
            } else {
                if (hasItemNum && hasItemNum >= needItemNum) {
                    state = TalismanState.up;//可升级
                } else {
                    state = TalismanState.cantup; //不能升级
                }
            }
            return state;
        }

        //仙府-家园风水属性加成工具
        private fengshuiAddAttr(cfg: Configuration.xianfu_decorate, nextCfg: Configuration.xianfu_decorate): void {
            if (!nextCfg) { //没有下一级
                nextCfg = cfg;
            }
            let type: number = nextCfg[Configuration.xianfu_decorateFields.type];
            let param: number[] = cfg[Configuration.xianfu_decorateFields.param];
            let currValue: number = param[0]; //当前值
            if (!currValue) currValue = 0;
            if (type == 1) { //对所有建筑制作减少消耗%
                this.smeltConsumeReduceValue = currValue;
            } else if (type == 2) {  //所有炼制成功率提升X%
                this.successAddValue = currValue;
            } else if (type == 3) {  //开炉一次炼制次数上限增加X次%
                this.dailySmeltTimeAddValue = currValue;
            } else if (type == 4) { //所有灵兽游历花费减少X%
                this.travelConsumeReduceValue = currValue;
            } else if (type == 5) { //所有灵兽游历经验增加X%
                this.travelExpAddValue = currValue;
            } else if (type == 6) { //所有灵兽游历次数增加X次%
                this.maxRuningCountAddValue = currValue;
            }
        }


        public getType0AttAddStr(addType: number, buildId: number, value: number, param: number[]): string {
            let str: string;
            if (addType == 1) {//固定点
                str = `每秒${buildId ? `出产` : `产药`}收益增加${value}点`;
            } else if (addType == 2) {//百分点
                str = `每秒${buildId ? `出产` : `产药`}收益增加${value}%`;
            } else if (addType == 3) {//暴击概率
                str = `每秒${buildId ? `出产` : `产药`}有${value}%概率${param[3]}倍暴击`;
            }
            return str;
        }

        public getAttAddStr(type: number, value: number): string {
            let str: string;
            if (type == 1) { //对所有建筑制作减少消耗%
                str = `炼制消耗药草值减少${value}%`;
            } else if (type == 2) {  //所有炼制成功率提升X%
                str = `所有炼制成功率提升${value}%`;
            } else if (type == 3) {  //开炉一次炼制次数上限增加X次%
                str = `开炉一次炼制次数上限增加${value}次`;
            } else if (type == 4) { //所有灵兽游历花费减少X%
                str = `所有灵兽游历花费减少${value}%`;
            } else if (type == 5) { //所有灵兽游历经验增加X%
                str = `所有灵兽游历经验增加${value}%`;
            } else if (type == 6) { //所有灵兽游历次数增加X次%
                str = `所有灵兽游历次数增加${value}次`;
            }
            return str;
        }

        public xianfuEventIsOpen(): boolean {
            if (this.xianfuEvent) {
                return this._xianfuEvents[Protocols.XianFuEventFields.isOpen]
            } else {
                return false
            }

        }

        public _transmit: () => {};

    }
}
