
///<reference path="./clan_cfg.ts"/>
///<reference path="./clan_build_cfg.ts"/>
///<reference path="./clan_gradeaward_cfg.ts"/>
/** 戰隊业务模型 */
namespace modules.clan {
    import MyClanInfo = Protocols.GetMyClanInfoReply;
    import MyClanGradeAwardGetStatusFields = Protocols.MyClanGradeAwardGetStatusFields;
    import ClanApplyList = Protocols.ClanApplyListReply;
    import AllClanList = Protocols.AllClanListReply;
    import ClanListItemInfoFields = Protocols.ClanListItemInfoFields;
    import AllClanListReplyFields = Protocols.AllClanListReplyFields;
    import ClanActorBaseAttrFields = Protocols.ClanActorBaseAttrFields;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import ClanApplyListReplyFields = Protocols.ClanApplyListReplyFields;
    import ClanActorBaseAttr = Protocols.ClanActorBaseAttr;
    import ClanApplyListMemberAttrFields = Protocols.ClanApplyListMemberAttrFields;
    import ClanApplyListMemberAttr = Protocols.ClanApplyListMemberAttr;
    import ClanListItemInfo = Protocols.ClanListItemInfo;
    import ClanBuildListFiedls = Protocols.ClanBuildListFiedls;
    import ClanGradeLevelList = Protocols.ClanGradeLevelList;
    import ClanBuildAndHalRefresh = Protocols.ClanBuildAndHalRefresh;
    import ClanUpdateFightTeamCoin = Protocols.ClanUpdateFightTeamCoin;
    import ClanUpdateFightTeamCoinFields = Protocols.ClanUpdateFightTeamCoinFields;
    import ClanBuildAndHalRefreshFiedls = Protocols.ClanBuildAndHalRefreshFiedls;

    import clan_gradeAward = Configuration.clan_gradeAward;
    import clan_gradeAwardFields = Configuration.clan_gradeAwardFields;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import clan_build = Configuration.clan_build;
    import clan_buildFields = Configuration.clan_buildFields;
    import clan_buildDesc = Configuration.clan_buildDesc;
    import clan_buildDescFields = Configuration.clan_buildDescFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import clan = Configuration.clan;
    import clanFields = Configuration.clanFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    import ClanGradeAwardCfg = modules.config.ClanGradeAwardCfg;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import ClanBuildCfg = modules.config.ClanBuildCfg;
    import ClanCfg = modules.config.ClanCfg;
    import BlendCfg = modules.config.BlendCfg;

    export class ClanModel {
        private _myClanInfo: MyClanInfo;
        private _clanApplyList: Array<ClanApplyListMemberAttr>;
        private _allClanList: Array<ClanListItemInfo>;
        private _createClanOrCN: any;
        private _myAppliedList: Array<string>;
        private _clanBuildInfo: Array<clan_buildDesc>;
        private _gradeAwardData: Array<clan_gradeAward>;
        private _hasJoinClan: boolean = false;
        private _haloStagingId: number;   //光环暂存id
        private _buildListAndHalresfresh: ClanBuildAndHalRefresh;
        private _clanCoin: ClanUpdateFightTeamCoin;

        private static _instance: ClanModel;
        public static get instance(): ClanModel {
            return this._instance = this._instance || new ClanModel();
        }

        private constructor() {

        }
        public get ClanId(): string {
            if (!this._myClanInfo) return ""
            return this._myClanInfo[ClanInfoDataFields.uuid] || ""
        }
        public get ClanMemberNum(): number {
            if (!this._myClanInfo) return 0
            return this._myClanInfo[ClanInfoDataFields.member].length || 0
        }
        public get ClanMember() {
            if (!this._myClanInfo) return []
            return this._myClanInfo[ClanInfoDataFields.member] || []
        }
        /**
         * name
         */
        public isSameMember(otherId: number): boolean {
            let memberList = this.ClanMember
            for (const key in memberList) {
                if (memberList[key] && memberList[key][1] == otherId) return true;
            }
            return false;
        }

        //设置战队基本信息
        public set myClanInfo(data: MyClanInfo) {
            //判断是否加入了战队
            let uuid: string = data[ClanInfoDataFields.uuid];
            let member: Array<ClanActorBaseAttr> = data[ClanInfoDataFields.member];
            this._hasJoinClan = !(uuid == "" && member == null);

            //将战队成员列表中的老板的数据整到第一个位置来
            if (this._hasJoinClan) {
                data[ClanInfoDataFields.member].sort((a, b) => {
                    if (a[ClanActorBaseAttrFields.pos] == 1) {
                        return -1;
                    }
                })
            } else {
                RedPointCtrl.instance.setRPProperty("ClanGradeAwardRP", false);
                RedPointCtrl.instance.setRPProperty("ClanShopRP", false);
                RedPointCtrl.instance.setRPProperty("ClanApplyListRP", false);
                return;
            }
            this._myClanInfo = data;

            GlobalData.dispatcher.event(CommonEventType.Update_My_Clan_Info);
        }
        public get myClanInfo(): MyClanInfo {
            return this._myClanInfo;
        }

        //更新战队等级奖励数据
        public updateClanGradeAwardData(data: any) {
            // if (data.length == 0) return;
            let rpState: boolean = false; //红点状态
            //配置
            let award_cfg: Table<clan_gradeAward> = ClanGradeAwardCfg.instance.getAllConfig();
            //组合参数
            let array: Array<clan_gradeAward> = [];
            let index = 0;
            for (const key in award_cfg) {
                let cfg = award_cfg[key];
                let level: number = cfg[clan_gradeAwardFields.level];
                let award: Array<Items> = cfg[clan_gradeAwardFields.award];
                let status: number = index < data.length ? data[index][1] : 0;//0等级 1状态 状态为1处于激活状态
                //只要有1个有处于可领取状态的需要显示红点 
                if (status == 1) rpState = true;
                array.push([level, award, status]);
                index++;
            }
            this._gradeAwardData = array;
            this.checkAwardRP(rpState);
            GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_GRADE_AWARD);
        }
        public get gradeAwardData(): Array<clan_gradeAward> {
            return this._gradeAwardData;
        }
        //检测是否有未领取的等级奖励红点
        private checkAwardRP(state: boolean) {
            RedPointCtrl.instance.setRPProperty("ClanGradeAwardRP", state);
        }

        //更新战队建设剩余可捐献数据
        public uodateClanBuildInfo(list: any) {
            //配置
            let build_cfg: Table<clan_build> = ClanBuildCfg.instance.getAllConfig();
            // let list: Array<Items> = data;
            //组合参数
            let array: Array<clan_buildDesc> = [];
            for (const key in build_cfg) {
                let remainCount = -1;
                list.forEach(id_count => {
                    if (id_count[0] == parseInt(key)) {
                        remainCount = id_count[1];
                    }
                });

                let single_cfg: clan_build = build_cfg[key];
                let donateID: number = single_cfg[clan_buildFields.price][ItemsFields.itemId];
                let itemcfg: item_material = ItemMaterialCfg.instance.getItemCfgById(donateID);

                let reward: Array<Items> = single_cfg[clan_buildFields.reward];
                let sortId: number = single_cfg[clan_buildFields.sortId];
                let id: number = single_cfg[clan_buildFields.id];
                let donateName = itemcfg[item_materialFields.name];
                let preice: Items = single_cfg[clan_buildFields.price];
                let limitBuy: Array<number> = single_cfg[clan_buildFields.limitBuy];
                let desc = "";
                reward.forEach((__item, index) => {
                    let __id: number = __item[ItemsFields.itemId];
                    let __itemcfg: item_material = ItemMaterialCfg.instance.getItemCfgById(__id);
                    let __name: string = __itemcfg[item_materialFields.name];
                    let __count: number = __item[ItemsFields.count];
                    desc += `${__name}+${__count}`
                    if (index < reward.length - 1) {
                        desc += ",";
                    }
                });

                let tempArr: clan_buildDesc = [preice, desc, donateName, limitBuy, sortId, remainCount, id];
                array.push(tempArr);
            }

            this._clanBuildInfo = array;
            // console.log(this._clanBuildInfo);

            GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_BUILD_REMAIN);
        }

        //战队币和光环刷新次数
        public get buildListAndHalresfresh(): ClanBuildAndHalRefresh {
            return this._buildListAndHalresfresh;
        }
        //战队币和光环刷新次数
        public set buildListAndHalresfresh(data: ClanBuildAndHalRefresh) {
            this._buildListAndHalresfresh = data;

            if (!this._clanCoin) {
                this._clanCoin = [data[ClanBuildAndHalRefreshFiedls.clanCoin]];
            }

            GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_HALO_REFRESHTIME);
        }

        //获取光环刷新消耗物品
        public getRefreshHaloConsume(): Array<string> {
            let time: number = this._buildListAndHalresfresh[ClanBuildAndHalRefreshFiedls.refreshTime];
            let blendcfg = BlendCfg.instance.getCfgById(61008)[3];//[[90140001#500]#[94150001#200]]
            if (time >= blendcfg.length) {
                time = blendcfg.length - 1;
            }
            let retdata = [];
            let itemArrStr = blendcfg[time];
            // 分割参数
            let itemArr = itemArrStr.replace("[", "").replace("]", "").split('#');
            if (parseInt(itemArr[0]) == 90140001) {
                retdata.push("common/icon_tongyong_2.png");
            } else {
                retdata.push("common/shenghuyu.png");
            }
            retdata.push(itemArr[1]);
            console.log(retdata);

            return retdata;
        }

        //光环刷新暂存id
        public get haloStagingId(): number {
            return this._haloStagingId;
        }
        //光环刷新暂存id
        public set haloStagingId(id: number) {
            this._haloStagingId = id;
        }

        //获取战队建设剩余可捐献数据
        public get clanBuildInfo(): any {
            return this._clanBuildInfo;
        }

        //是否加入了战队
        public get hasJoinClan(): boolean {
            return this._hasJoinClan;
        }

        //战队申请列表数据
        public setSlanApplyList(datalist: ClanApplyList) {
            let datas: Array<ClanApplyListMemberAttr> = datalist[ClanApplyListReplyFields.list];

            this._clanApplyList = datas;
            this.checkApplyListRP();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_APPLY_LIST);
        }
        public get clanApplyList(): Array<ClanApplyListMemberAttr> {
            return this._clanApplyList;
        }
        checkApplyListRP() {
            let state: boolean = this._clanApplyList.length > 0;
            RedPointCtrl.instance.setRPProperty("ClanApplyListRP", state);
        }

        //更新已经申请过的战队的列表id
        public set myAppliedList(data: Array<string>) {
            this._myAppliedList = data;
            GlobalData.dispatcher.event(CommonEventType.UPDATE_ALL_CLAN_LIST, false);
        }

        //获取是否已经加过该战队的状态
        public getIsAppliedClan(uuid: string): boolean {
            if (this._myAppliedList) {
                let state: boolean = false;
                this._myAppliedList.forEach(_uid => { if (_uid == uuid) state = true; });
                return state;
            }
            return false;
        }
        //判断是否能加入战队，根据战力
        public canJoinClan(clanInfo: ClanListItemInfo): boolean {
            let uuid = clanInfo[ClanListItemInfoFields.uuid]
            let fightLimit = clanInfo[ClanListItemInfoFields.fightLimit];
            let level = clanInfo[ClanListItemInfoFields.level];
            let memberNum = clanInfo[ClanListItemInfoFields.memberNum];
            let maxNum = ClanCfg.instance.getCfgByLv(level)[clanFields.memerLimit];
            //是否满员
            if (memberNum == maxNum) return false;

            let myFight = PlayerModel.instance.fight;
            if (myFight > fightLimit) {
                return true;
            }
            let list = this._allClanList[AllClanListReplyFields.list];
            //战力是否
            if (this._allClanList && list) {
                let state: boolean = false;
                list.forEach(clan_uuid => {
                    if (clan_uuid == uuid && myFight > fightLimit) {
                        state = true;
                    }
                });
                return state;
            }
            return false;
        }

        //所有战队列表数据
        public setAllClanList(data: AllClanList) {
            let clanList = data[AllClanListReplyFields.list];
            //根据等级排序
            clanList.sort((a, b) => {
                return b[ClanListItemInfoFields.level] - a[ClanListItemInfoFields.level];
            })
            //保存
            this._allClanList = clanList;
            GlobalData.dispatcher.event(CommonEventType.UPDATE_ALL_CLAN_LIST, true);
        }
        //获取未满员的战队列表
        public get notFullClanList(): Array<ClanListItemInfo> {
            let data: Array<ClanListItemInfo> = new Array<ClanListItemInfo>();
            //判断是否满员并插入数据
            this._allClanList.forEach(list => {
                let maxNum = ClanCfg.instance.getCfgByLv(list[ClanListItemInfoFields.level])[clanFields.memerLimit];
                if (list[ClanListItemInfoFields.memberNum] < maxNum) {
                    data.push(list);
                }
            });
            return data;
        }
        public get allClanList(): Array<ClanListItemInfo> {
            return this._allClanList;
        }

        //创建战队或修改战队名字参数
        public set createClanOrCN(data: any) {
            this._createClanOrCN = data;
        }
        public get createClanOrCN(): any {
            return this._createClanOrCN;
        }

    }
}
