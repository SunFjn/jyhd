///<reference path="../common/global_data.ts"/>
///<reference path="../config/faction_boss_award_cfg.ts"/>
///<reference path="../rename/rename_model.ts"/>

/** 仙盟 */
namespace modules.faction {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import TableUtils = utils.TableUtils;
    import GlobalData = modules.common.GlobalData;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import GetFactionInfoReply = Protocols.GetFactionInfoReply;
    import GetFactionInfoReplyFields = Protocols.GetFactionInfoReplyFields;
    import FactionInfo = Protocols.FactionInfo;
    import FactionJoin = Protocols.FactionJoin;
    import FactionInfoFields = Protocols.FactionInfoFields;
    import GetFactionRankListReply = Protocols.GetFactionRankListReply;
    import FactionRank = Protocols.FactionRank;
    import GetFactionRankListReplyFields = Protocols.GetFactionRankListReplyFields;
    import FactionRankShow = Protocols.FactionRankShow;
    import GetBoxInfoReply = Protocols.GetBoxInfoReply;
    import FactionBox = Protocols.FactionBox;
    import FactionBoxFields = Protocols.FactionBoxFields;
    import GetFactionCopyInfoReply = Protocols.GetFactionCopyInfoReply;
    import GetFactionCopyDataReply = Protocols.GetFactionCopyDataReply;
    import GetFactionTurnReply = Protocols.GetFactionTurnReply;
    import FactionTurnRecord = Protocols.FactionTurnRecord;
    import FactionBossAwardCfg = modules.config.FactionBossAwardCfg;
    import faction_boss_award = Configuration.faction_boss_award;
    import faction_boss_awardFields = Configuration.faction_boss_awardFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import faction_skill = Configuration.faction_skill;
    import faction_skillFields = Configuration.faction_skillFields;
    import ItemsFields = Configuration.ItemsFields;

    export const enum joinState {
        noFight,  //战力不足
        requesting,  //申请中
        canRequest,  //可申请
    }

    export class FactionModel {
        private static _instance: FactionModel;
        public static get instance(): FactionModel {
            return this._instance = this._instance || new FactionModel();
        }

        private _memberList: Array<FactionMember>;  //成员列表
        private _factionId: string;   //仙盟id
        private _factionList: Array<FactionInfo>;  //仙盟列表
        private _requestJoinList: Array<FactionJoin>;  //玩家请求列表(盟主视角)
        private _yetRequestTable: Table<boolean>;  //已经请求记录
        private _requestJoinStateTable: Table<joinState>;  //仙盟列表状态记录
        private _applyForPosList: Protocols.Pair[]; //成员职位申请列表
        private _rank: GetFactionRankListReply;
        private _baseInfo: GetFactionInfoReply;  //仙盟基本信息
        private _tabs: ActionOpenId[];
        private _shieldPanels: WindowEnum[];
        private _hurtAwardList: Array<number>; //伤害奖励列表
        private _skillList: Table<number>;     //技能列表
        private _mineBoxList: Array<FactionBox>;
        private _boxList: Array<FactionBox>;
        private _dialInfo: GetFactionTurnReply;

        public boxHelpList: Array<FactionBox>;
        public copyInfo: GetFactionCopyInfoReply; //仙盟副本信息
        public copyData: GetFactionCopyDataReply; //仙盟副本数据
        public hurt: number;  //伤害值
        public boxInfo: GetBoxInfoReply;   //宝箱相关信息
        public tempBox: FactionBox;
        public boxListF5Time: number;
        public turnList: Array<FactionTurnRecord>;
        public turnResult: number[];
        public isTipF5Alert: boolean = true;
        public tempPos: Laya.Point;

        private constructor() {
            this._tabs = [
                ActionOpenId.faction, ActionOpenId.factionMember, ActionOpenId.factionWeal, ActionOpenId.factionSkill
            ];

            this._shieldPanels = [
                WindowEnum.FACTION_PANEL, WindowEnum.FACTION_MEMBER_PANEL, WindowEnum.FACTION_SKILL_PANEL, WindowEnum.FACTION_WEAL_PANEL,
                WindowEnum.BAOZANG_LIST_PANEL, WindowEnum.BAOZANG_MINE_PANEL, WindowEnum.BAOZANG_HELP_LIST_PANEL,
                WindowEnum.FACTION_COPY_PANEL, WindowEnum.FACTION_TASK_PANEL,
            ];

            this._skillList = {};
        }

        public getFactionInfoReply(tuple: GetFactionInfoReply): void {
            this.baseInfo = tuple;
            this.factionId = tuple[GetFactionInfoReplyFields.uuid];
            this.memberList = tuple[GetFactionInfoReplyFields.member];
            GlobalData.dispatcher.event(CommonEventType.FACTION_INFO);
        }

        public set memberList(list: Array<FactionMember>) {
            this._memberList = list;
        }

        public get memberList(): Array<FactionMember> {
            return this._memberList ? this._memberList : [];
        }


        /**
         * name
         */
        public isTongXianMeng(otherId: number): boolean {

            for (let index = 0; index < this.memberList.length; index++) {
                let element = this.memberList[index];
                if (element) {
                    if (element[FactionMemberFields.agentId] == otherId) {
                        return true;
                    }
                }
            }
            return false;
        }
        public get bossInfo(): FactionMember {
            return this.getMemberByPost(FactionPosition.leader)[0];
        }

        public get deputyInfo(): FactionMember {
            return this.getMemberByPost(FactionPosition.deputyLeader)[0];
        }

        public get manageInfos(): FactionMember[] {
            return this.getMemberByPost(FactionPosition.huFa);
        }

        public get commonInfos(): FactionMember[] {
            return this.getMemberByPost(FactionPosition.member);
        }

        public getMemberByPost(post: FactionPosition): FactionMember[] {
            if (!this._memberList) return null;
            let arr: FactionMember[] = [];
            for (let i: int = 0, len: int = this._memberList.length; i < len; i++) {
                let currPost: number = this._memberList[i][FactionMemberFields.pos];
                if (currPost == post) {
                    if (post != FactionPosition.member && post != FactionPosition.huFa) {
                        return [this._memberList[i]];
                    } else {
                        arr.push(this._memberList[i]);
                    }
                }
            }
            return arr;
        }

        public getMemberById(id: number): FactionMember {
            for (let i: int = 0, len: int = this._memberList.length; i < len; i++) {
                let agentId: number = this._memberList[i][FactionMemberFields.agentId];
                if (id == agentId) {
                    return this._memberList[i];
                }
            }
        }

        public set factionId(uuid: string) {
            this._factionId = uuid;
            if (!this.factionId) { //未加入仙盟  关闭仙盟功能
                this.initRP();
                for (let e of this._tabs) {
                    FuncOpenModel.instance.setActionOpen(e, ActionOpenState.close);
                }
                FuncOpenModel.instance.setActionOpen(ActionOpenId.factionJoin, ActionOpenState.open);
                for (let e of this._shieldPanels) {
                    if (WindowManager.instance.getPanelById(e) &&
                        WindowManager.instance.isOpened(e)) {
                        WindowManager.instance.close(e);
                        WindowManager.instance.open(WindowEnum.FACTION_JOIN_PANEL);
                        break;
                    }
                }
                FactionCtrl.instance.getFactionApplyList();
                chat.ChatModel.instance.factionChatRecord.length = 0;
                chat.ChatModel.instance.noSeeMessage = false;
                GlobalData.dispatcher.event(CommonEventType.FACTION_MESSAGE_UPDATE);
            } else {  //加入仙盟  关闭加入仙盟功能
                FuncOpenModel.instance.setActionOpen(ActionOpenId.faction, ActionOpenState.open);
                FuncOpenModel.instance.setActionOpen(ActionOpenId.factionJoin, ActionOpenState.close);
                FuncOpenCtrl.instance.getActionState(...this._tabs);
            }
        }

        private initRP(): void {
            RedPointCtrl.instance.setRPProperty("factionApplyJoinRP", false);
            RedPointCtrl.instance.setRPProperty("factionHurtAwardRP", false);
            RedPointCtrl.instance.setRPProperty("factionPostApplyRP", false);
            RedPointCtrl.instance.setRPProperty("factionSkillRP", false);
            RedPointCtrl.instance.setRPProperty("factionDialRP", false);
            RedPointCtrl.instance.setRPProperty("helpBaozangListRP", false);
            RedPointCtrl.instance.setRPProperty("mineBaozangListRP", false);
        }

        public set baseInfo(tuple: GetFactionInfoReply) {
            this._baseInfo = tuple;
            let post: FactionPosition = this.post;
            if (post == FactionPosition.member) {
                WindowManager.instance.close(WindowEnum.FACTION_MEMBER_OPERA_ALERT);
            }
            this.checkSkillRP();
        }

        public get baseInfo(): GetFactionInfoReply {
            return this._baseInfo;
        }

        public get factionId(): string {
            return this._factionId == "" ? null : this._factionId;
        }

        public get post(): number {
            return this._baseInfo[GetFactionInfoReplyFields.pos];
        }

        public get fight(): number {
            return this._baseInfo[GetFactionInfoReplyFields.sumFight];
        }

        public get lv(): number {
            if (!this._baseInfo) return 0;
            return this._baseInfo[GetFactionInfoReplyFields.level];
        }

        public get exp(): number {
            return this._baseInfo[GetFactionInfoReplyFields.exp];
        }

        public get rank(): number {
            return this._baseInfo[GetFactionInfoReplyFields.rank];
        }

        public get contribution(): number {
            return this._baseInfo[GetFactionInfoReplyFields.contribution];
        }

        public get notice(): string {
            let str: string = this._baseInfo[GetFactionInfoReplyFields.notice];
            if (str == ``) {
                str = BlendCfg.instance.getCfgById(36037)[blendFields.stringParam][0];
            }
            return str;
        }

        public get title(): string {
            let str: string = this._baseInfo[GetFactionInfoReplyFields.title];
            if (str == `` || !str) {
                str = BlendCfg.instance.getCfgById(36038)[blendFields.stringParam][0];
            }
            return str;
        }

        public get name(): string {
            return this._baseInfo[GetFactionInfoReplyFields.name];
        }

        public get examine(): boolean {
            return this._baseInfo[GetFactionInfoReplyFields.examine];
        }

        public get limit(): number {
            return this._baseInfo[GetFactionInfoReplyFields.limitFight];
        }

        public get cd(): number {
            return this._baseInfo[GetFactionInfoReplyFields.cd];
        }

        public get bossIndex(): number {
            return this._baseInfo[GetFactionInfoReplyFields.bossIndex];
        }

        public get bossHp(): number {
            return this._baseInfo[GetFactionInfoReplyFields.bossHp];
        }

        public get copyManCount(): number {
            return this._baseInfo[GetFactionInfoReplyFields.count];
        }

        public set factionList(list: Array<FactionInfo>) {
            this._factionList = list;
            this._requestJoinStateTable = {};
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                let uUid: string = list[i][FactionInfoFields.uuid];
                let myFight: number = PlayerModel.instance.fight;
                let needFight: number = list[i][FactionInfoFields.fight];
                if (myFight < needFight) {
                    this._requestJoinStateTable[uUid] = joinState.noFight;
                } else {
                    this._requestJoinStateTable[uUid] = this._yetRequestTable[uUid] ? joinState.requesting : joinState.canRequest;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.FACTION_LIST);
        }

        public set rankList(tuple: GetFactionRankListReply) {
            this._rank = tuple;
            GlobalData.dispatcher.event(CommonEventType.FACTION_RANK_LIST);
        }

        public get ranklist(): Array<FactionRank> {
            let list: Array<FactionRank>;
            if (this._rank) {
                list = this._rank[GetFactionRankListReplyFields.list];
            }
            return list ? list : [];
        }

        /**
         * 获取名次信息 如果空表示该名次没有玩家
         * @param mingCi 名次
         */
        public getRanksByTypeAndMingCi(mingCi: number): FactionRank {
            let _date = this.ranklist;
            for (let index = 0; index < _date.length; index++) {
                let element = _date[index];
                if (element) {
                    if ((index + 1) == mingCi) {
                        return element;
                    }
                }
            }
            return null;
        }

        public get rankFirst(): FactionRankShow {
            return this._rank ? this._rank[GetFactionRankListReplyFields.show] : null;
        }

        public get factionList(): Array<FactionInfo> {
            return this._factionList;
        }

        public set requestJoinList(list: Array<FactionJoin>) {
            this._requestJoinList = list;
            RedPointCtrl.instance.setRPProperty("factionApplyJoinRP", list.length > 0);
            GlobalData.dispatcher.event(CommonEventType.FACTION_JOIN_LIST);
        }

        public get requestJoinList(): Array<FactionJoin> {
            return this._requestJoinList;
        }

        public setYetRequestList(list: Array<string>): void {
            this.yetRequestList = list;
            FactionCtrl.instance.getFactionList();
        }

        public updateYetRequestList(list: Array<string>): void {
            this.yetRequestList = list;
        }

        public set yetRequestList(list: Array<string>) {
            this._yetRequestTable = {};
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                this._yetRequestTable[list[i]] = true;
            }
        }

        public getStateByUuid(Uuid: string): boolean {
            return this._yetRequestTable[Uuid];
        }

        public getRequestJoinState(uUid: string): joinState {
            return this._requestJoinStateTable[uUid];
        }

        public set applyForPosList(list: Protocols.Pair[]) {
            this._applyForPosList = list;
            RedPointCtrl.instance.setRPProperty("factionPostApplyRP", list.length > 0);
            GlobalData.dispatcher.event(CommonEventType.FACTION_APPLY_POST_LIST);
        }

        public get applyForPosList(): Protocols.Pair[] {
            return this._applyForPosList;
        }

        public set boxList(list: Array<FactionBox>) {
            if (!list) return;
            this.tempBox = null;
            this._boxList = [];
            let flag: boolean = false;
            for (let e of list) {
                let state: FactionBoxState = e[FactionBoxFields.state];
                if (state == FactionBoxState.notOpen) {
                    this._boxList.push(e);
                } else if (e[FactionBoxFields.otherId] == PlayerModel.instance.actorId) {
                    this.tempBox = e;
                    flag = state == FactionBoxState.get;
                }
            }
            RedPointCtrl.instance.setRPProperty("helpBaozangListRP", flag);
        }

        public get boxList(): Array<FactionBox> {
            return this._boxList;
        }

        public set mineBoxList(list: Array<FactionBox>) {
            let flag: boolean = false;
            this._mineBoxList = [];
            // 我的列表  只有挖掘了的 和我自己正在挖掘的 放在我的列表里
            let myId: number = PlayerModel.instance.actorId;
            for (let e of list) {
                if (e[FactionBoxFields.agentId] == myId) {
                    let state: FactionBoxState = e[FactionBoxFields.state];
                    if (state != FactionBoxState.notOpen) {
                        this._mineBoxList.push(e);
                        if (state == FactionBoxState.get) {  //可以领取
                            if (!flag) {
                                flag = true;
                            }
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("mineBaozangListRP", flag);
        }

        public get mineBoxList(): Array<FactionBox> {
            return this._mineBoxList;
        }

        public sortByQuality(l: FactionBox, r: FactionBox): number {
            let lQuality: FactionBoxColor = l[FactionBoxFields.color];
            let rQuality: FactionBoxColor = r[FactionBoxFields.color];
            return lQuality > rQuality ? -1 : 1;
        }


        //可领取>已协助>未协助 同状态
        public sortByState(l: FactionBox, r: FactionBox): number {
            let lState: FactionBoxState = l[FactionBoxFields.state];
            let rState: FactionBoxState = r[FactionBoxFields.state];
            return lState > rState ? -1 : lState < rState ? 1 : FactionModel.instance.sortByQuality(l, r);
        }

        public sortByFightAndLv(l: FactionMember, r: FactionMember): number {
            let lFight: number = l[FactionMemberFields.fight];
            let rFight: number = r[FactionMemberFields.fight];
            return lFight > rFight ? -1 : lFight < rFight ? 1 : this.sortByLv(l, r);
        }

        public sortByLv(l: FactionMember, r: FactionMember): number {
            let lLv: number = l[FactionMemberFields.level];
            let rLv: number = r[FactionMemberFields.level];
            return lLv >= rLv ? -1 : 1;
        }

        public set hurtAwardList(list: Array<number>) {
            this._hurtAwardList = list;
            let damageValue: number = this.hurt;
            let cfg: faction_boss_award = FactionBossAwardCfg.instance.getCfgBylv(this.lv);
            if (!cfg) return;
            let values: number[] = cfg[faction_boss_awardFields.value];
            let len: number = values.length;
            for (let i: int = 0; i < len; i++) {
                if (list.indexOf(i) == -1 && damageValue >= values[i]) { //未领取并且可以领
                    RedPointCtrl.instance.setRPProperty("factionHurtAwardRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("factionHurtAwardRP", false);
        }

        public get hurtAwardList(): number[] {
            return this._hurtAwardList;
        }

        public set skillList(list: number[]) {
            TableUtils.clear(this._skillList);
            for (let e of list) {
                let pureId: number = CommonUtil.getSkillPureIdById(e);
                this._skillList[pureId] = e;
            }
            this.checkSkillRP();
            GlobalData.dispatcher.event(CommonEventType.FACTION_SKILL_LIST);
        }

        public get getShowSkillIds(): int[] {
            let ids: int[] = [];
            let pureIds: number[] = FactionSkillCfg.instance.pureIds;
            for (let e of pureIds) {
                let value: number = FactionModel.instance.getSkill(e);
                if (value) {
                    ids.push(value);
                } else {
                    ids.push(CommonUtil.getSkillIdByPureIdAndLv(e));
                }
            }
            return ids;
        }

        private checkSkillRP(): void {
            let record: int = -1;
            for (let skillId of this.getShowSkillIds) { //仙盟贡献要更新红点
                let cfg: faction_skill = FactionSkillCfg.instance.getCfgById(skillId);
                let nextCfg: faction_skill = FactionSkillCfg.instance.getCfgById(skillId + 1);
                if (!nextCfg) continue;
                let needLv: number = cfg[faction_skillFields.level];
                let itemCount: number = cfg[faction_skillFields.items][ItemsFields.count];
                if (this.lv >= needLv) {//等级足够
                    if (itemCount > record) {
                        record = itemCount;
                    }
                }
            }
            let myCount: number = this.contribution;
            RedPointCtrl.instance.setRPProperty("factionSkillRP", record == -1 ? false : myCount >= record);
        }

        public getSkill(pureId: number): number {
            return this._skillList[pureId];
        }

        public set dialInfo(tuple: GetFactionTurnReply) {  //仙盟密卷要更新转盘
            this._dialInfo = tuple;
            this.checkDialRP();
        }

        public checkDialRP(): void {
            if (!this._dialInfo) return;
            let freeCount: number = this._dialInfo[Protocols.GetFactionTurnReplyFields.freeCount];
            let getCount: number = this._dialInfo[Protocols.GetFactionTurnReplyFields.getCount];
            let needItemId: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][0];
            let needItemCount: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][1];
            let haveCount: number = CommonUtil.getPropCountById(needItemId);
            let flag: boolean = haveCount >= needItemCount || freeCount > 0 || getCount > 0;
            RedPointCtrl.instance.setRPProperty("factionDialRP", flag);
        }

        public get dialInfo(): GetFactionTurnReply {
            return this._dialInfo;
        }

        // 更新名字
        public updateName(): void {
            if (!this._memberList) return;
            let info: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (!info) return;
            let member: FactionMember = this.getMemberById(info[UpdateNameReplyFields.roleID]);
            if (member) member[FactionMemberFields.name] = info[UpdateNameReplyFields.name];
        }

        // 更新职业
        public updateOcc(): void {
            if (!this._memberList) return;
            let info: UpdateOccReply = RenameModel.instance.updateOccReply;
            if (!info) return;
            let member: FactionMember = this.getMemberById(info[UpdateOccReplyFields.roleID]);
            if (member) member[FactionMemberFields.occ] = info[UpdateOccReplyFields.occ];
        }
    }
}
