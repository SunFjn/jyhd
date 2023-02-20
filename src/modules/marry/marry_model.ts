/**
 * 姻缘数据
*/
///<reference path="../effect/success_effect_ctrl.ts"/>
namespace modules.marry {
    import GetMarryInfoReply = Protocols.GetMarryInfoReply;
    import GetMarryInfoReplyFields = Protocols.GetMarryInfoReplyFields;
    import MarryMember = Protocols.MarryMember;
    import MarryMemberFields = Protocols.MarryMemberFields;
    import MarryWallInfo = Protocols.MarryWallInfo;
    import GetMarryRingInfoReply = Protocols.GetMarryRingInfoReply;
    import GetMarryRingInfoReplyFields = Protocols.GetMarryRingInfoReplyFields;
    import MarryRingFeedFields = Protocols.MarryRingFeedFields;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import BagModel = modules.bag.BagModel; // 背包
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import MarryKeepsakeFeed = Protocols.MarryKeepsakeFeed;
    import MarryKeepsakeFeedFields = Protocols.MarryKeepsakeFeedFields;
    import MarryKeepsakeGrade = Protocols.MarryKeepsakeGrade;
    import MarryKeepsakeGradeFields = Protocols.MarryKeepsakeGradeFields;
    import GetMarryKeepsakeInfoReply = Protocols.GetMarryKeepsakeInfoReply;
    import GetMarryKeepsakeInfoReplyFields = Protocols.GetMarryKeepsakeInfoReplyFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;

    import MarryDollFeed = Protocols.MarryDollFeed;
    import MarryDollFeedFields = Protocols.MarryDollFeedFields;

    import MarryDollGrade = Protocols.MarryDollGrade;
    import MarryDollGradeFields = Protocols.MarryDollGradeFields;

    import MarryCopyMonsterWare = Protocols.MarryCopyMonsterWare;
    import MarryCopyMonsterWareFields = Protocols.MarryCopyMonsterWareFields;


    import MarryDollRefine = Protocols.MarryDollRefine;
    import MarryDollRefineFields = Protocols.MarryDollRefineFields;


    import FeedSkillType = ui.FeedSkillType;
    import FeedAttrType = ui.FeedAttrType;

    import item_materialFields = Configuration.item_materialFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    import marry_ringFields = Configuration.marry_ringFields;


    import GetMarryCopyTimesReply = Protocols.GetMarryCopyTimesReply;
    import GetMarryCopyTimesReplyFields = Protocols.GetMarryCopyTimesReplyFields;

    import UpdateMarryCopyTimes = Protocols.UpdateMarryCopyTimes;
    import UpdateMarryCopyTimesFields = Protocols.UpdateMarryCopyTimesFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;


    import MarryCopyTimes = Protocols.MarryCopyTimes;
    import MarryCopyTimesFields = Protocols.MarryCopyTimesFields;

    import TypesAttr = Protocols.TypesAttr;
    import TypesAttrFields = Protocols.TypesAttrFields;

    import GetMarryTaskInfoReply = Protocols.GetMarryTaskInfoReply;
    import GetMarryTaskInfoReplyFields = Protocols.GetMarryTaskInfoReplyFields;

    import UpdateMarryTask = Protocols.UpdateMarryTask;
    import UpdateMarryTaskFields = Protocols.UpdateMarryTaskFields;

    import MarryTaskNode = Protocols.MarryTaskNode;
    import MarryTaskFields = Protocols.MarryTaskFields;

    import marry_keepsakeFields = Configuration.marry_keepsakeFields;
    import marry_keepsake_gradeFields = Configuration.marry_keepsake_gradeFields;

    import marry_dollFields = Configuration.marry_dollFields;
    import marry_doll_gradeFields = Configuration.marry_doll_gradeFields;
    import marry_doll_refineFields = Configuration.marry_doll_refineFields;
    import marry_intimacyFields = Configuration.marry_intimacyFields;

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;
    enum RpType {
        taskDay = 0,//每日任务
        taskLifetime = 1,//终身任务
        reward = 2,//甜蜜度奖励
    }
    export class MarryModel {
        private static _instance: MarryModel;
        public static get instance(): MarryModel {
            return this._instance = this._instance || new MarryModel();
        }

        constructor() {
            this._skipWave = 0;
            this._timeState = false;
            this._doneWave = 0;
            this._isMaxWave = false;
            this.showfighting = Array<[number, Array<TypesAttr>]>();
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.testingRP);
        }
        private updateTime: number = (new Date()).valueOf()
        public testingRP() {
            if (this.getfuncOpen() && (new Date()).valueOf() - this.updateTime > 5000) {
                this.updateTime = (new Date()).valueOf()
                RedPointCtrl.instance.setRPProperty("marryKeepsakeRP", this.getKeepsakeRP());
                RedPointCtrl.instance.setRPProperty("marryChildrenRP", this.getDollRP());
                RedPointCtrl.instance.setRPProperty("marryRP", this.getMarryRP());
                RedPointCtrl.instance.setRPProperty("marryRingRP", this.getRingRP());
                RedPointCtrl.instance.setRPProperty("marryTaskRP", this.getTaskRP());
            }
        }

        public getfuncOpen() {
            return modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.marry);
        }
        private _init: boolean = false
        private _currWave: number;
        private _doneWave: number;
        private _timeState: boolean;
        private _skipWave: number;
        private _isMaxWave: boolean;
        //获取当前波数
        public get currWave(): number {
            return this._currWave;
        }

        //获取完成波数
        public get doneWave(): number {
            return this._doneWave;
        }

        //获取是否计时
        public get timeState(): boolean {
            return this._timeState;
        }

        //获取要跳转的波数
        public get skipWave(): number {
            return this._skipWave;
        }

        //获取是否达到最大波数
        public get isMaxWave(): boolean {
            return this._isMaxWave;
        }

        //更新怪物波数和计时状态
        public updataWave(tuple: MarryCopyMonsterWare): void {
            this._currWave = tuple[MarryCopyMonsterWareFields.curWare];
            this._doneWave = tuple[MarryCopyMonsterWareFields.finishWare];
            this._timeState = tuple[MarryCopyMonsterWareFields.state];
            this._skipWave = tuple[MarryCopyMonsterWareFields.jumpWare];
            this._isMaxWave = this._currWave >= tuple[MarryCopyMonsterWareFields.maxWare];
            GlobalData.dispatcher.event(CommonEventType.MARRY_BATTLE_LEVEL_UPDATE);
        }

        private _copyNum: number;
        private _copyMaxNum: number;
        //获取副本剩余次数
        public get copyNum(): number {
            return this._copyNum;
        }
        //获取副本最大
        public get copyMaxNum(): number {
            return this._copyMaxNum;
        }
        public setCopyInfo(value: MarryCopyTimes) {
            this._copyNum = value[MarryCopyTimesFields.remainTimes]
            this._copyMaxNum = value[MarryCopyTimesFields.totalTimes]
            GlobalData.dispatcher.event(CommonEventType.MARRY_COPY_UPDATE);
        }

        //是否拥有伴侣
        public isHave: boolean = false
        public intimacyLevel: number = 0
        public intimacyExp: number = 0
        public intimacyDay: number = 0
        public intimacyer: MarryMember;//姻缘对象信息

        //返回甜蜜度等级
        public getIntimacyLevel(): number {
            return this.intimacyLevel;
        }
        //返回甜蜜度经验
        public getIntimacyExp(): number {
            return this.intimacyExp;
        }
        //返回结缘天数
        public getIntimacyDay(): number {
            return this.intimacyDay;
        }

        //姻缘墙列表信息
        public _wallList: Array<MarryWallInfo> = [];

        public get wallList(): Array<MarryWallInfo> {
            return this._wallList;
        }

        public set wallList(value: Array<MarryWallInfo>) {
            this._wallList = value;
            GlobalData.dispatcher.event(CommonEventType.MARRY_WALL_UPDATE);
        }

        private _ringExp: number = 0;
        //返回义戒经验
        public getRingExp(): number {
            return this._ringExp;
        }
        private _ringLevel: number = 0;

        //返回义戒等级
        public getRingLevel(): number {
            return this._ringLevel;
        }


        //计算姻缘首页战力
        public getPower(): number {
            return 0;
        }
        //返回甜蜜度领取状态
        public rewardMap: Map<number, number> = new Map<number, number>()
        public getRewardStatus(level: number): boolean {
            if (!this.rewardMap.has(level)) return false;
            return true;
        }

        public setRewardMap(list: Array<number>) {
            this.rewardMap = new Map<number, number>();
            list.forEach(k => {
                this.rewardMap.set(k, 1)
            })
            let lv: number = MarryModel.instance.getMinRewardLevel() + 1;
            let cfg = MarryCfg.instance.getLevelCfg(lv)
            this.rpData[RpType.reward] = cfg && lv <= MarryModel.instance.getIntimacyLevel()
        }
        public getMinRewardLevel(): number {
            //获取奖励列表最小等级
            let arr = []
            this.rewardMap.forEach((v, k) => {
                arr.push(k)
            })
            arr.sort(function compare(a, b) { return b - a; });
            // ** console.log('研发测试_chy:  this.rewardMap', this.rewardMap, arr);
            return arr.length > 0 ? arr[0] : 0;
        }


        //技能等级MAP  前提是技能纯粹ID不重复
        public skillMap: Map<number, [number, number]> = new Map<number, [number, number]>()
        public getSkillLevel(id): number {
            if (!this.skillMap.has(id)) return 0
            return this.skillMap.get(id)[0] || 0;
        }
        public getSkillPoint(id): number {
            if (!this.skillMap.has(id)) return 0
            return this.skillMap.get(id)[1] || 0;
        }
        // 信物等级Map
        public keepsakeMap: Map<number, number> = new Map<number, number>()
        public setKeepsakeLevel(tuple: MarryKeepsakeFeed) {
            this.keepsakeMap = new Map<number, number>()
            tuple[MarryKeepsakeFeedFields.feedList].forEach(e => {
                this.keepsakeMap.set(e[MagicShowInfoFields.showId], e[MagicShowInfoFields.star])
            });
            this.showfighting[FeedAttrType.XinWu] = [tuple[MarryKeepsakeFeedFields.fighting], tuple[MarryKeepsakeFeedFields.attr]]
            GlobalData.dispatcher.event(CommonEventType.MARRY_Keepsake_UPDATE);
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryKeepsakeRP", this.getKeepsakeRP());
        }
        public getKeepsakeLevel(id: number): number {
            if (!this.keepsakeMap.has(id)) return 0;
            return this.keepsakeMap.get(id);
        }

        // 信物阶级Map
        public keepsakeMap2: Map<number, number> = new Map<number, number>()
        public setKeepsakeLevel2(tuple: MarryKeepsakeGrade) {
            this.keepsakeMap2 = new Map<number, number>()
            this.coupleGradeMap = new Map<number, number>()
            this.heartLevelMap = new Map<number, number>()
            tuple[MarryKeepsakeGradeFields.gradeList].forEach(e => {
                this.keepsakeMap2.set(e[MagicShowInfoFields.showId], e[MagicShowInfoFields.star])
            });

            tuple[MarryKeepsakeGradeFields.coupleGradeList].forEach(e => {
                this.coupleGradeMap.set(e[MagicShowInfoFields.showId], e[MagicShowInfoFields.star])
            });
            tuple[MarryKeepsakeGradeFields.heartLevel].forEach(e => {
                this.heartLevelMap.set(e[MagicShowInfoFields.showId], e[MagicShowInfoFields.star])
            });

            let skills = tuple[MarryKeepsakeGradeFields.gradeSkillList]
            skills.forEach(e => {
                this.skillMap.set(
                    CommonUtil.getSkillPureIdById(e[SkillInfoFields.skillId]),
                    [e[SkillInfoFields.level], e[SkillInfoFields.point]]
                )
            })

            this.showfighting[FeedAttrType.XinWuUp] = [tuple[MarryKeepsakeGradeFields.fighting], tuple[MarryKeepsakeGradeFields.attr]]
            GlobalData.dispatcher.event(CommonEventType.MARRY_Keepsake_GRADE_UPDATE);
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryKeepsakeRP", this.getKeepsakeRP());
        }
        public getKeepsakeLevel2(id: number): number {
            if (!this.keepsakeMap2.has(id)) return 0;
            return this.keepsakeMap2.get(id);
        }
        public getcoupleGradeLevel(id: number): number {
            if (!this.coupleGradeMap.has(id)) return 0;
            return this.coupleGradeMap.get(id);
        }
        public getheartLevelLevel(id: number): number {
            if (!this.heartLevelMap.has(id)) return 0;
            return this.heartLevelMap.get(id);
        }
        // 队友进阶列表
        public coupleGradeMap: Map<number, number> = new Map<number, number>()
        // 心有灵犀等级
        public heartLevelMap: Map<number, number> = new Map<number, number>()


        // 仙娃等级 等级 经验
        public DollMap: Map<number, [number, number]> = new Map<number, [number, number]>()
        public setDollLevel(tuple: MarryDollFeed) {
            this.DollMap = new Map<number, [number, number]>()
            // ** console.log('研发测试_chy: tuple[MarryDollFeedFields.feedList]', tuple[MarryDollFeedFields.feedList], tuple);
            //等级
            tuple[MarryDollFeedFields.feedList].forEach(e => {
                this.DollMap.set(e[0], [e[1], 0])
            });
            //经验
            tuple[MarryDollFeedFields.expList].forEach(e => {
                if (this.DollMap.has(e[0])) {
                    let item = this.DollMap.get(e[0])
                    item[1] = e[1]
                    this.DollMap.set(e[0], item)
                }
            });

            let skills = tuple[MarryDollFeedFields.skillList]
            // ** console.log('研发测试_chy:skills', skills);

            skills.forEach(e => {
                this.skillMap.set(
                    CommonUtil.getSkillPureIdById(e[SkillInfoFields.skillId]),
                    [e[SkillInfoFields.level], e[SkillInfoFields.point]]
                )
            })

            this.showfighting[FeedAttrType.doll] = [tuple[MarryDollFeedFields.fighting], tuple[MarryDollFeedFields.attr]]
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryChildrenRP", this.getDollRP());
            GlobalData.dispatcher.event(CommonEventType.MARRY_DOLL_UPDATE);


        }
        public getDollLevel(id: number): number {
            if (!this.DollMap.has(id)) return 0;
            return this.DollMap.get(id)[0];
        }
        public getDollExp(id: number): number {
            if (!this.DollMap.has(id)) return 0;
            return this.DollMap.get(id)[1];
        }
        //获取仙娃总仙龄
        public getDollTotalLv(): number {

            let count = 0
            this.DollMap.forEach((v, k) => {
                count += v[0]
            })
            return count

        }

        // 仙娃阶级
        public DollClassMap: Map<number, number> = new Map<number, number>()
        public setDollClassLevel(tuple: MarryDollGrade) {
            this.DollClassMap = new Map<number, number>();
            //等级
            tuple[MarryDollGradeFields.gradeList].forEach(e => {
                this.DollClassMap.set(e[0], e[1])
            });
            let skills = tuple[MarryDollGradeFields.skillList]
            skills.forEach(e => {
                this.skillMap.set(
                    CommonUtil.getSkillPureIdById(e[SkillInfoFields.skillId]),
                    [e[SkillInfoFields.level], e[SkillInfoFields.point]]
                )
            })
            this.showfighting[FeedAttrType.dollUp] = [tuple[MarryDollGradeFields.fighting], tuple[MarryDollGradeFields.attr]]
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryChildrenRP", this.getDollRP());
            GlobalData.dispatcher.event(CommonEventType.MARRY_DOLL_GRADE_UPDATE);

        }

        public getDollClassLevel(id: number): number {
            if (!this.DollClassMap.has(id)) return 0;
            return this.DollClassMap.get(id);
        }

        // 仙娃进补
        public DollEatMap: Map<number, number> = new Map<number, number>()

        public setDollEatLevel(tuple: MarryDollRefine) {
            this.DollEatMap = new Map<number, number>()
            //等级
            tuple[MarryDollRefineFields.list].forEach(e => {
                this.DollEatMap.set(e[0], e[1])
            });
            this.showfighting[FeedAttrType.eat] = [tuple[MarryDollRefineFields.fighting], tuple[MarryDollRefineFields.attr]]
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryChildrenRP", this.getDollRP());
            GlobalData.dispatcher.event(CommonEventType.MARRY_DOLL_EAT_UPDATE);


        }

        public getDollEatLevel(id: number): number {
            if (!this.DollEatMap.has(id)) return 0;
            return this.DollEatMap.get(id);
        }


        public showfighting: Array<[number, Array<TypesAttr>]>;

        // 当前出战的仙娃
        public curDoll: number = 0;

        // 任务
        public dayTaskMap: Map<number, [number, number, number, number]> = new Map<number, [number, number, number, number]>()
        public lifetimeTaskMap: Map<number, [number, number, number, number]> = new Map<number, [number, number, number, number]>()

        private _ringId: number = 0;
        public get ringId(): number {
            return this._ringId || 0;
        }
        private rpData: boolean[] = []
        public setTask(tuple: GetMarryTaskInfoReply) {
            this.dayTaskMap = new Map<number, [number, number, number, number]>()
            this.lifetimeTaskMap = new Map<number, [number, number, number, number]>()
            let dayRP = false
            let lifetimeRP = false
            tuple[GetMarryTaskInfoReplyFields.dailyList].forEach(e => {
                this.dayTaskMap.set(e[MarryTaskFields.id], [
                    e[MarryTaskFields.state], // 领取状态 0
                    e[MarryTaskFields.progress], // 总进度 1
                    e[MarryTaskFields.selfProgress], // 自己进度 2
                    e[MarryTaskFields.otherProgress]// 对方进度 3
                ])
                if (e[MarryTaskFields.state] == 1) dayRP = true
            })
            tuple[GetMarryTaskInfoReplyFields.lifelongList].forEach(e => {
                this.lifetimeTaskMap.set(e[MarryTaskFields.id], [
                    e[MarryTaskFields.state], // 领取状态 0
                    e[MarryTaskFields.progress], // 总进度 1
                    e[MarryTaskFields.selfProgress], // 自己进度 2
                    e[MarryTaskFields.otherProgress] // 对方进度 3
                ])
                if (e[MarryTaskFields.state] == 1) lifetimeRP = true
            })
            this._ringId = tuple[GetMarryTaskInfoReplyFields.marryRingId]
            this.rpData[RpType.taskDay] = dayRP
            this.rpData[RpType.taskLifetime] = lifetimeRP
            if (this.getfuncOpen() && this.isHave) RedPointCtrl.instance.setRPProperty("marryRP", this.getMarryRP());
            if (this.getfuncOpen() && this.isHave) RedPointCtrl.instance.setRPProperty("marryTaskRP", this.getTaskRP());

            GlobalData.dispatcher.event(CommonEventType.MARRY_TASK_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.MARRY_INFO_UPDATE);
        }

        public updateTask(tuple: UpdateMarryTask) {
            if (!tuple) return
            let taskId = tuple[UpdateMarryTaskFields.task][MarryTaskFields.id]
            let item = tuple[UpdateMarryTaskFields.task]
            if (this.dayTaskMap.has(taskId)) {

                this.dayTaskMap.set(
                    item[MarryTaskFields.id], [
                    item[MarryTaskFields.state], // 领取状态 0
                    item[MarryTaskFields.progress], // 总进度 1
                    item[MarryTaskFields.selfProgress], // 自己进度 2
                    item[MarryTaskFields.otherProgress] // 对方进度 3
                ])

            } else if (this.lifetimeTaskMap.has(taskId)) {

                this.lifetimeTaskMap.set(
                    item[MarryTaskFields.id], [
                    item[MarryTaskFields.state], // 领取状态 0
                    item[MarryTaskFields.progress], // 总进度 1
                    item[MarryTaskFields.selfProgress], // 自己进度 2
                    item[MarryTaskFields.otherProgress] // 对方进度 3
                ])

 
            } else {
                // 没找到id 重新请求列表
                MarryCtrl.instance.GetMarryTaskInfo();
                return;
            }

            let dayArr = this.getDayTaskValue()
            for (const key in dayArr) {
                if (dayArr[key][MarryTaskFields.state] == 1) {
                    this.rpData[RpType.taskDay] = true
                    break
                }
            }

            let lifetimeArr = this.getLifetimeTaskValue()
            for (const key in lifetimeArr) {
                if (lifetimeArr[key][MarryTaskFields.state] == 1) {
                    this.rpData[RpType.taskLifetime] = true
                    break
                }
            }
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryTaskRP", this.getTaskRP());
            GlobalData.dispatcher.event(CommonEventType.MARRY_TASK_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.MARRY_INFO_UPDATE);
        }
        public getTask(id: number, type: number) {

            if (type == 1) {
                return this.dayTaskMap.get(id) || null
            } else {
                return this.lifetimeTaskMap.get(id) || null
            }
        }



        public getDayTask() {
            let arr = []
            this.dayTaskMap.forEach((v, k) => {
                arr.push(k)
            })
            return arr;
        }
        public getLifetimeTask() {
            let arr = []
            this.lifetimeTaskMap.forEach((v, k) => {
                arr.push(k)
            })
            return arr;
        }

        public setInfo(tule: GetMarryInfoReply): void {
            // ** console.log('研发测试_chy:tule', tule);
            let have = tule[GetMarryInfoReplyFields.uuid] != ""
            if (this._init && this.isHave != have) {
                MarryCtrl.instance.GetMarryRingInfo()
                MarryCtrl.instance.GetMarryDollInfo()
                MarryCtrl.instance.GetMarryKeepsakeInfo()
                MarryCtrl.instance.GetMarryTaskInfo()
            }

            this.isHave = have


            if (this.isHave) {
                //已结缘
                tule[GetMarryInfoReplyFields.member].forEach(e => {
                    if (e[MarryMemberFields.agentId] != PlayerModel.instance.actorId) {
                        this.intimacyer = e;
                    }
                })
                // ** console.log('研发测试_chy:', this.intimacyLevel, tule[GetMarryInfoReplyFields.level], tule[GetMarryInfoReplyFields.level] > this.intimacyLevel, this.intimacyLevel > 0);
                if (this.intimacyLevel > 0 && tule[GetMarryInfoReplyFields.level] > this.intimacyLevel) {
                    // ** console.log('研发测试_chy: 姻缘等级提升',);
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                }
                this.intimacyLevel = tule[GetMarryInfoReplyFields.level] || 0
                this.intimacyExp = tule[GetMarryInfoReplyFields.exp] || 0
                this.intimacyDay = CommonUtil.calculateDay(tule[GetMarryInfoReplyFields.marryTime]) || 0
            }

            if (this.getfuncOpen() && this.isHave) RedPointCtrl.instance.setRPProperty("marryRP", this.getMarryRP());

            GlobalData.dispatcher.event(CommonEventType.MARRY_INFO_UPDATE);
            this._init = true
        }
        public setSkillMap(skills) {
            // ** console.log('研发测试_chy:skills', skills);
            skills.forEach(e => {
                this.skillMap.set(
                    CommonUtil.getSkillPureIdById(e[SkillInfoFields.skillId]),
                    [e[SkillInfoFields.level], e[SkillInfoFields.point]]
                )
            })
        }
        public setRingInfo(tule: GetMarryRingInfoReply): void {
            // ** console.log('研发测试_chy:GetMarryRingInfoReply tule', tule);
            this._ringExp = tule[GetMarryRingInfoReplyFields.feed][MarryRingFeedFields.exp] || 0;
            if (this._ringLevel > 0 && tule[GetMarryRingInfoReplyFields.feed][MarryRingFeedFields.level] > this._ringLevel) {
                // ** console.log('研发测试_chy: 姻缘义戒等级提升',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            }
            this._ringLevel = tule[GetMarryRingInfoReplyFields.feed][MarryRingFeedFields.level] || 0;

            let skills = tule[GetMarryRingInfoReplyFields.feed][MarryRingFeedFields.skillList]
            this.setSkillMap(skills)
            this.showfighting[FeedAttrType.yiJie] = [tule[GetMarryRingInfoReplyFields.feed][MarryRingFeedFields.fighting], []]
            if (this.getfuncOpen()) RedPointCtrl.instance.setRPProperty("marryRingRP", this.getRingRP());
            GlobalData.dispatcher.event(CommonEventType.MARRY_RING_UPDATE);
        }
        public getRingRP() {
            //红点检测
            let isUp: boolean = false
            let isUp2: boolean = false
            let skill = MarryRingCfg.instance.getAllSkill()
            for (let i: int = 0, len = skill.length; i < len; i++) {
                let lv = MarryModel.instance.getSkillLevel(skill[i])
                let id = CommonUtil.getSkillIdByPureIdAndLv(skill[i], lv > 0 ? lv : 1);
                isUp = MarryModel.instance.getUpLevelStart(FeedSkillType.yiJie, lv, id) == 1
                if (isUp) break;
            }
            let lv = this.getRingLevel()
            let ringNextCfg = MarryRingCfg.instance.getLevelCfg(lv + 1)
            if (ringNextCfg) {
                isUp2 = this.getItemCountById(ringNextCfg[marry_ringFields.items][0]) > 0
            }
            return isUp || isUp2 || this.getCopyRP();
        }

        public getUpLevelStart(type: number, lv: number, skillId: number) {
            let isUp: boolean = false
            let pureId: int = CommonUtil.getSkillPureIdById(skillId);

            if (type == FeedSkillType.yiJie) {
                if (lv == 0) {
                    isUp = MarryModel.instance.getRingLevel() >= MarryRingCfg.instance.getSkillOpen(pureId)
                } else {
                    let item = MarryRingCfg.instance.getSkillCfg(pureId, lv);
                    if (MarryRingCfg.instance.getSkillCfg(pureId, lv + 1))
                        isUp = MarryModel.instance.getItemCountById(item[ItemsFields.ItemId]) >= item[ItemsFields.count]
                }

            }
            if (type == FeedSkillType.yiJieEx) {
                if (lv == 0) {
                    isUp = MarryModel.instance.getSkillPoint(pureId) > 0
                } else {
                    let item = MarryRingCfg.instance.getSkillCfg(pureId, lv);
                    if (MarryRingCfg.instance.getSkillCfg(pureId, lv + 1))
                        isUp = MarryModel.instance.getItemCountById(item[ItemsFields.ItemId]) >= item[ItemsFields.count]
                }

            } else if (type === FeedSkillType.XinWuUp) {
                if (lv == 0) {
                    let item = MarryKeepsakeCfg.instance.getSkillOpen(pureId)
                    // ** console.log('研发测试_chy:item', item, MarryModel.instance.getKeepsakeLevel2(item[0]), item[1]);
                    isUp = MarryModel.instance.getKeepsakeLevel2(item[0]) >= item[1]
                } else {
                    let item = MarryKeepsakeCfg.instance.getSkillCfg(pureId, lv);
                    if (MarryKeepsakeCfg.instance.getSkillCfg(pureId, lv + 1)) {
                        isUp = MarryModel.instance.getItemCountById(item[ItemsFields.ItemId]) >= item[ItemsFields.count]
                    }
                }
            } else if (type === FeedSkillType.doll) {
                let levelCfg = MarryDollCfg.instance.getSkillCfg(pureId)
                if (lv == 0) {
                    isUp = MarryModel.instance.getDollLevel(levelCfg[1][0]) >= levelCfg[1][1]
                } else if (levelCfg[lv + 1]) {
                    isUp = MarryModel.instance.getDollLevel(levelCfg[lv + 1][0]) >= levelCfg[lv + 1][1]
                }
            } else if (type === FeedSkillType.dollUp) {
                let levelCfg = MarryDollCfg.instance.getSkillCfg(pureId)
                if (lv == 0) {
                    isUp = MarryModel.instance.getDollClassLevel(levelCfg[1][0]) >= levelCfg[1][2]
                } else if (levelCfg[lv + 1]) {
                    isUp = MarryModel.instance.getDollClassLevel(levelCfg[lv + 1][0]) >= levelCfg[lv + 1][2]
                }
            }


            return isUp ? 1 : 0
        }



        public getItemCountById(id: number) {
            return BagModel.instance.getItemCountById(id)
        }

        public materialsMeet(items: Array<Items>) {
            for (const key in items) {
                let id = items[key][ItemsFields.ItemId]
                let count = items[key][ItemsFields.count]
                if (MoneyItemId.glod == id) {

                    if (PlayerModel.instance.ingot < count)
                        return false
                } else if (this.getItemCountById(id) < count) {

                    return false
                }
            }
            return true

        }

        public openAttr(title: string, type: number) {
            let attrTag = []
            let attr = MarryModel.instance.showfighting[type][1]
            if (attr)
                attr.forEach(e => {
                    attrTag.push(e[0])
                })
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                [title,
                    MarryModel.instance.showfighting[type][0],
                    attr,
                    attrTag
                ]);
        }
        public getfighting(type: number) {
            if (type == FeedAttrType.view) {
                let fighting = 0
                fighting += this.getfighting(FeedAttrType.yiJie)
                fighting += this.getfighting(FeedAttrType.XinWu)
                fighting += this.getfighting(FeedAttrType.XinWuUp)
                fighting += this.getfighting(FeedAttrType.doll)
                fighting += this.getfighting(FeedAttrType.dollUp)
                fighting += this.getfighting(FeedAttrType.eat)
                return fighting
            }
            let arr = MarryModel.instance.showfighting[type]
            if (!arr) return 1
            return arr[0]



        }

        public getRingCount() {
            let cfg: Array<number> = BlendCfg.instance.getCfgById(70111)[blendFields.intParam];
            let count = 0;
            for (let i = 0; i < cfg.length; i++) {
                count += this.getItemCountById(cfg[i])
            }
            return count

        }

        //RP===============
        public getCopyRP(): boolean {
            return this._copyNum > 0
        }

        public getKeepsakeRP() {

            if (this.getKeepsakeRP_level()) return true;
            if (this.getKeepsakeRP_grade()) return true;

            return false
        }
        public getKeepsakeRP_level() {
            // 检查升级材料
            let arr = MarryKeepsakeCfg.instance.getAllItems()
            for (const key in arr) {
                let itemId = arr[key]
                let lv = MarryModel.instance.getKeepsakeLevel(itemId);
                let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv)
                let nextcfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv + 1)
                if (!nextcfg) continue;
                let items = cfg[marry_keepsakeFields.items]
                if (items.length > 0 && this.materialsMeet(items)) return true

            }
            return false
        }
        public getKeepsakeRP_grade() {
            // 检查进阶
            let arr2 = MarryKeepsakeCfg.instance.getAllgrade()
            for (const key in arr2) {
                let itemId = arr2[key]
                let lv = MarryModel.instance.getKeepsakeLevel2(itemId);
                let cfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv)
                let nextcfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv + 1)
                if (!nextcfg) continue;
                let items = cfg[marry_keepsake_gradeFields.items]
                if (items.length > 0 && this.materialsMeet([items])) return true
            }
            return false
        }

        public getDollRP() {
            if (this.getDollRP_level()) return true;

            if (this.getDollRP_grade()) return true;

            if (this.getDollRP_eat()) return true;


            return false
        }
        public getDollRP_level() {
            //检查激活
            let arr = MarryDollCfg.instance.getAllItems()
            for (const key in arr) {
                let itemId = arr[key]
                let lv = MarryModel.instance.getDollLevel(itemId);
                if (lv == 0) continue;
                let cfg = MarryDollCfg.instance.getItemCfg(itemId, lv)
                let nextcfg = MarryDollCfg.instance.getItemCfg(itemId, lv + 1)
                if (!nextcfg) continue;
                if (MarryModel.instance.materialsMeet([cfg[marry_dollFields.items]])) return true;


                let skills: number[] = MarryDollCfg.instance.getAllSkill(itemId, 1);
                for (let i: int = 0, len = skills.length; i < len; i++) {
                    let skillLv = MarryModel.instance.getSkillLevel(skills[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(skills[i], skillLv > 0 ? skillLv : 1);
                    if (MarryModel.instance.getUpLevelStart(FeedSkillType.doll, lv, id) == 1) return true
                }

                skills = MarryDollCfg.instance.getAllSkill(itemId, 2);
                for (let i: int = 0, len = skills.length; i < len; i++) {
                    let skillLv = MarryModel.instance.getSkillLevel(skills[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(skills[i], skillLv > 0 ? skillLv : 1);
                    if (MarryModel.instance.getUpLevelStart(FeedSkillType.doll, lv, id) == 1) return true
                }
            }

            return false
        }

        public getDollRP_grade() {
            let arr = MarryDollCfg.instance.getAllItems()
            for (const key in arr) {
                let itemId = arr[key]
                let lv = MarryModel.instance.getDollClassLevel(itemId);
                let nextcfg = MarryDollCfg.instance.getGradeCfg(itemId, lv + 1)
                if (!nextcfg) continue;
                let items = nextcfg[marry_doll_gradeFields.items]
                if (MarryModel.instance.materialsMeet([items])) return true;
                let skills: number[] = MarryDollCfg.instance.getAllSkill(itemId, 3);
                for (let i: int = 0, len = skills.length; i < len; i++) {
                    let skillLv = MarryModel.instance.getSkillLevel(skills[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(skills[i], skillLv > 0 ? skillLv : 1);
                    if (MarryModel.instance.getUpLevelStart(FeedSkillType.dollUp, lv, id) == 1) return true
                }
            }
            return false
        }



        public getDollRP_eat() {
            let eatArr = MarryDollCfg.instance.getEatAll();
            let total = MarryModel.instance.getDollTotalLv();
            for (const key in eatArr) {
                let lv = MarryModel.instance.getDollEatLevel(eatArr[key]);
                let cfg = MarryDollCfg.instance.getEatCfg(eatArr[key], MarryModel.instance.getDollEatLevel(eatArr[key]))
                if (cfg[marry_doll_refineFields.doollLevel] > total) continue;
                if (lv >= cfg[marry_doll_refineFields.level]) continue;
                if (MarryModel.instance.materialsMeet([cfg[marry_doll_refineFields.items]])) return true;
            }

            return false
        }

        public getMarryRP() {
            if (this.getTaskRP()) return true;
            if (this.getRewardRP()) return true;
            if (this.getFeedRP()) return true;
            return false
        }

        public getFeedRP() {
            let intimacyLevel: number = MarryModel.instance.getIntimacyLevel(); // 甜蜜度等级
            let nextCfg = MarryCfg.instance.getLevelCfg(intimacyLevel + 1)
            if (nextCfg) {
                if (MarryModel.instance.getItemCountById(nextCfg[marry_intimacyFields.items][0]) > 0) return true;
            }
            // 增加判断如果没结婚就不显示红点
            if (!this.isHave) {
                return false;
            }
            return false
        }
        public getRewardRP() {
            //获取现在领取了奖励的等级
            return this.rpData[RpType.reward] || false
        }

        // 获取marryring下的marrygift事件是否开启
        public getMarryGiftVisible() {
            return FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.marryGift);
        }

        public getTaskRP() {
            //任务检测
            if (this.getTaskRP_day()) return true;
            if (this.getTaskRP_lifetime()) return true;

            return false
        }
        public getTaskRP_day() {
            //任务检测
            return this.rpData[RpType.taskDay] || false
        }
        public getTaskRP_lifetime() {
            return this.rpData[RpType.taskLifetime] || false
        }
        public getDayTaskValue() {
            let arr = []
            this.dayTaskMap.forEach((v, k) => {
                arr.push(v)
            })
            return arr;
        }
        public getLifetimeTaskValue() {
            let arr = []
            this.lifetimeTaskMap.forEach((v, k) => {
                arr.push(v)
            })
            return arr;
        }
    }



}