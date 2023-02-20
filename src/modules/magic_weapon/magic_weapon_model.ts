///<reference path="../config/ride_refine_cfg.ts"/>
///<reference path="../config/ride_feed_cfg.ts"/>
///<reference path="../config/ride_magicShow_cfg.ts"/>
///<reference path="../config/ride_rank_cfg.ts"/>
///<reference path="../illusion/illusion_model.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
/** 精灵数据*/
namespace modules.magicWeapon {
    import Dictionary = Laya.Dictionary;
    import GetRideInfoReply = Protocols.GetRideInfoReply;
    import GetRideInfoReplyFields = Protocols.GetRideInfoReplyFields;
    import PetFeed = Protocols.PetFeed;
    import PetRank = Protocols.PetRank;
    import PetMagicShow = Protocols.PetMagicShow;
    import PetRefine = Protocols.PetRefine;
    import UpdateRideInfo = Protocols.UpdateRideInfo;
    import UpdateRideInfoFields = Protocols.UpdateRideInfoFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import PetMagicShowFields = Protocols.PetMagicShowFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import PetRankFields = Protocols.PetRankFields;
    import FeedRideReply = Protocols.FeedRideReply;
    import FeedRideReplyFields = Protocols.FeedRideReplyFields;
    import PetFeedFields = Protocols.PetFeedFields;
    import RankRideReply = Protocols.RankRideReply;
    import RankRideReplyFields = Protocols.RankRideReplyFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import RideFeedCfg = modules.config.RideFeedCfg;
    import rideFeed = Configuration.rideFeed;
    import rideFeedFields = Configuration.rideFeedFields;
    import BagModel = modules.bag.BagModel;
    import PetRefineFields = Protocols.PetRefineFields;
    import RefineInfo = Protocols.RefineInfo;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import RideRefineCfg = modules.config.RideRefineCfg;
    import rideRefine = Configuration.rideRefine;
    import rideRefineFields = Configuration.rideRefineFields;
    import RideMagicShowCfg = modules.config.RideMagicShowCfg;
    import rideMagicShow = Configuration.rideMagicShow;
    import rideMagicShowFields = Configuration.rideMagicShowFields;
    import PlayerModel = modules.player.PlayerModel;
    import RideRankCfg = modules.config.RideRankCfg;
    import rideRank = Configuration.rideRank;
    import rideRankFields = Configuration.rideRankFields;
    //法阵相关
    import PetFazhen = Protocols.PetFazhen;
    import PetFazhenFields = Protocols.PetFazhenFields;
    import RideFazhenCfg = modules.config.RideFazhenCfg;
    import ride_fazhen = Configuration.ride_fazhen;
    import ride_fazhenFields = Configuration.ride_fazhenFields;
    import RedPointProperty = ui.RedPointProperty;
    import TypesAttr = Protocols.TypesAttr;

    export class MagicWeaponModel {
        private static _instance: MagicWeaponModel;
        public static get instance(): MagicWeaponModel {
            return this._instance = this._instance || new MagicWeaponModel();
        }

        private _feed: PetFeed;
        private _rank: PetRank;
        private _magicShow: PetMagicShow;
        private _refine: PetRefine;

        private _showTable: Table<MagicShowInfo>;


        //宠物法阵相关
        // fazhenId = 0,			/*当前使用的法阵id，0表示没使用*/
        // fazhenList = 1,			/*法阵列表*/
        // fighting = 2,			/*战力*/
        // attr = 3			/*幻化总属性*/
        private _fazhenId: number;
        private _fazhen: PetFazhen;
        private _fighting: number;
        private _attr: Array<TypesAttr>;
        private _dic2: Dictionary;  //幻化列表数据
        public _huanhuaActId: number;  //记录激活的幻化ID
        public _bollTips: boolean;//本次登录是否提示玩家勾选
        public _bollZiDong: boolean;//本次登录的自动购买勾选状态
        constructor() {
            this._dic2 = new Dictionary();
            this._huanhuaActId = -1
            this._bollTips = false;
            this._bollZiDong = false;
        }

        //法阵相关
        public get fazhenId(): int {
            return this._fazhenId;
        }

        public set fazhenId(value: int) {
            this._fazhenId = value;
        }

        public get fighting(): int {
            return this._fighting;
        }

        public set fighting(value: int) {
            this._fighting = value;
        }

        public get attr(): Array<TypesAttr> {
            return this._attr;
        }

        public set attr(value: Array<TypesAttr>) {
            this._attr = value;
        }

        /**
         * 初始化法阵数据
         */
        public InitializeFaZhen(fazhen: PetFazhen) {
            this._fazhen = fazhen;
            // console.log("灵器法阵数据：   ", this._fazhen);
            this._dic2.clear();
            let _arr2: Array<MagicShowInfo> = this._fazhen[PetFazhenFields.fazhenList];
            for (let i: int = 0, len: int = _arr2.length; i < len; i++) {
                this._dic2.set(_arr2[i][MagicShowInfoFields.showId], _arr2[i]);
            }
            this.fazhenId = this._fazhen[PetFazhenFields.fazhenId];
            this.fighting = this._fazhen[PetFazhenFields.fighting];
            this._attr = this._fazhen[PetFazhenFields.attr];

        }

        public get huanhuaList(): Dictionary {
            return this._dic2;
        }

        /**
         * 判断如果升级成功星级是 说明是激活  弹出激活成功弹窗
         */
        public popActivateAlert(): void {
            if (this._dic2.get(this._huanhuaActId) == undefined) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 8]);
            } else if (this._dic2.get(this._huanhuaActId)[MagicShowInfoFields.star] == 1) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 8]);
            }
        }

        //..检测幻化列表红点
        public huanhuaRedPoint(): void {

            let idArr3: Array<ride_fazhen> = RideFazhenCfg.instance.getSkinCfgByType(3);
            let idArr4: Array<ride_fazhen> = RideFazhenCfg.instance.getSkinCfgByType(4);
            let idArr5: Array<ride_fazhen> = RideFazhenCfg.instance.getSkinCfgByType(5);

            this.qualityType(3, idArr3);
            this.qualityType(4, idArr4);
            this.qualityType(5, idArr5);
        }

        private qualityType(type: number, arr: Array<ride_fazhen>): void {

            for (let i: int = 0, len: int = arr.length; i < len; i++) {

                let star = 0;
                let id = arr[i][ride_fazhenFields.showId];

                if (this._dic2.get(id))
                    star = this._dic2.get(id)[MagicShowInfoFields.star];

                let result: boolean = this.judge(id, star);

                if (result) {
                    RedPointCtrl.instance.setRPProperty(this.judgeType(type), result);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty(this.judgeType(type), false);

        }

        private judge(id: number, starLev: number): boolean {
            let result: boolean = false;
            let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev);
            let nextCfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev + 1);
            let count: int = cfg[ride_fazhenFields.items][1];
            let itemId: int = cfg[ride_fazhenFields.items][0];

            if (!nextCfg) return false;
            if (starLev == 0) {
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    result = true;
                } else {
                    result = false;
                }
            } else {
                result = BagModel.instance.getItemCountById(itemId) >= count;
            }
            return result;
        }

        private judgeType(type: number): keyof RedPointProperty {
            return type == 3 ? "weaponFazhenJipinRP" : type == 4 ? "weaponFazhenZhenpinRP" : "weaponFazhenJuepinRP";
        }

        // 培养
        public get feed(): PetFeed {
            return this._feed;
        }

        // 进阶
        public get rank(): PetRank {
            return this._rank;
        }

        // 修炼
        public get refine(): PetRefine {
            return this._refine;
        }

        /** 获取精灵返回*/
        public getRideInfoReply(tuple: GetRideInfoReply): void {
            this._feed = tuple[GetRideInfoReplyFields.feed];
            this._rank = tuple[GetRideInfoReplyFields.rank];
            this.magicShow = tuple[GetRideInfoReplyFields.magicShow];
            this._refine = tuple[GetRideInfoReplyFields.refine];
            // this.currShowId = tuple[GetRideInfoReplyFields.curShowId];
            //法阵相关
            this.InitializeFaZhen(tuple[GetRideInfoReplyFields.fazhen]);
            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);

            this.checkRedPoint();
        }

        /** 更新精灵信息*/
        public updateRideInfo(tuple: UpdateRideInfo): void {
            this._feed = tuple[UpdateRideInfoFields.feed];
            this.rank = tuple[UpdateRideInfoFields.rank];
            this.magicShow = tuple[UpdateRideInfoFields.magicShow];
            this._refine = tuple[UpdateRideInfoFields.refine];
            // this.currShowId = tuple[UpdateRideInfoFields.curShowId];
            //法阵相关
            this.InitializeFaZhen(tuple[UpdateRideInfoFields.fazhen]);
            GlobalData.dispatcher.event(CommonEventType.WEAPONFZHUANHUA_UPDATA);

            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
            this.checkRedPoint();
        }

        public set rank(info: PetRank) {
            let star: number = info[PetRankFields.star];
            if (star % 10 == 1 && star > (this._rank ? this._rank[PetRankFields.star] : 0) && star != 1) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [illusion.IllusionModel.instance.rideMagicShowId, 5]);
            }
            this._rank = info;
        }

        // 精灵培养返回
        public feedRideReply(value: FeedRideReply): void {
            this._feed[PetFeedFields.level] = value[FeedRideReplyFields.level];
            this._feed[PetFeedFields.exp] = value[FeedRideReplyFields.exp];
            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
            this.checkRedPoint();
        }

        // 精灵升阶返回
        public rankRideReply(value: RankRideReply): void {
            // this._rank[PetRankFields.star] = star;
            this._rank[PetRankFields.blessing] = value[RankRideReplyFields.blessing];
            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
            this.checkRedPoint();
        }

        public get magicShow(): PetMagicShow {
            return this._magicShow;
        }

        public set magicShow(value: PetMagicShow) {
            this._magicShow = value;
            this._showTable = this._showTable || {};
            if (value) {
                let shows: Array<MagicShowInfo> = this._magicShow[PetMagicShowFields.showList];
                for (let i: int = 0, len = shows.length; i < len; i++) {
                    this._showTable[shows[i][MagicShowInfoFields.showId]] = shows[i];
                }
            }
        }

        // 根据showID获取showInfo
        public getShowInfoById(showId: int): MagicShowInfo {
            return this._showTable[showId];
        }

        /**
         *判断是否有这个ID
         */
        public IShave(ID: number) {
            if (ID == 4001) {//默认的ID
                return true;
            }
            for (var index = 0; index < this.magicShow.length; index++) {
                let shows: Array<MagicShowInfo> = this._magicShow[PetMagicShowFields.showList];
                for (let i: int = 0, len = shows.length; i < len; i++) {
                    if (shows[i][MagicShowInfoFields.showId] == ID) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 检测红点
        public checkRedPoint(): void {
            //法阵相关
            this.huanhuaRedPoint();
            let flag: boolean = false;
            if (this._feed && this._feed[PetFeedFields.skillList]) {
                for (let i: int = 0, len: int = this._feed[PetFeedFields.skillList].length; i < len; i++) {
                    let skill: SkillInfo = this._feed[PetFeedFields.skillList][i];
                    if (skill[SkillInfoFields.point] > 0) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("weaponFeedSkillRP", flag);

            flag = false;
            if (this._rank && this._rank[PetRankFields.skillList]) {
                for (let i: int = 0, len: int = this._rank[PetRankFields.skillList].length; i < len; i++) {
                    let skill: SkillInfo = this._rank[PetRankFields.skillList][i];
                    if (skill[SkillInfoFields.point] > 0) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("weaponRankSkillRP", flag);

            this.updateBag();
        }

        public updateBag(): void {
            // 判断培养材料是否满足
            if (this.feed) {
                let lv: number = this.feed[PetFeedFields.level];
                if (!lv) return;
                let exp: number = this.feed[PetFeedFields.exp];
                let cfg: rideFeed = RideFeedCfg.instance.getPetFeedCfgByLv(lv);
                let nextCfg: rideFeed = RideFeedCfg.instance.getPetFeedCfgByLv(lv + 1);
                if (!nextCfg) {
                    RedPointCtrl.instance.setRPProperty("weaponFeedMatRP", false);
                } else {
                    let needExp: number = cfg[rideFeedFields.exp] - exp;
                    let itemInfo: Array<number> = cfg[rideFeedFields.items];
                    let needCount: number = Math.ceil(needExp / itemInfo[2]);
                    let resule: boolean = BagModel.instance.getItemCountById(itemInfo[0]) >= needCount;
                    RedPointCtrl.instance.setRPProperty("weaponFeedMatRP", resule);
                }
            }

            //判断进阶材料是否满足
            if (this.rank) {
                let lv: number = this.rank[PetRankFields.star];
                if (lv == -1) return;
                let exp: number = this.rank[PetRankFields.blessing];
                let cfg: rideRank = RideRankCfg.instance.getPetRankCfgBySt(lv);
                let nextCfg: rideRank = RideRankCfg.instance.getPetRankCfgBySt(lv + 1);
                if (!nextCfg) {
                    RedPointCtrl.instance.setRPProperty("weaponRankMatRP", false);
                } else {
                    let needExp: number = cfg[rideRankFields.blessing] - exp;
                    let itemInfo: Array<number> = cfg[rideRankFields.items];
                    let needCount: number = Math.ceil(needExp / itemInfo[2]);
                    RedPointCtrl.instance.setRPProperty("weaponRankMatRP", BagModel.instance.getItemCountById(itemInfo[0]) >= needCount);
                }
            }

            // 判断修炼材料是否满足
            if (this._refine) {
                let arr: Array<RefineInfo> = this._refine[PetRefineFields.list];
                let flag: boolean = false;
                for (let j: int = 0; j < 4; j++) {
                    let lv: int = 0;
                    let type: int = j;
                    for (let i: int = 0, len: int = arr.length; i < len; i++) {
                        let info: RefineInfo = arr[i];
                        if (info[RefineInfoFields.type] === j) {
                            lv = info[RefineInfoFields.level];
                            break;
                        }
                    }
                    let cfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(j, lv);
                    let item: Array<number> = cfg[rideRefineFields.items];
                    if (BagModel.instance.getItemCountById(item[0]) >= item[1] &&
                        cfg[rideRefineFields.humanLevel] < PlayerModel.instance.level
                        && lv != RideRefineCfg.instance.getMaxLvByLv(type, lv)) {
                        flag = true;
                        break;
                    }
                }
                RedPointCtrl.instance.setRPProperty("weaponRefineMaterialRP", flag);
            }

            //判断幻化材料是否满足
            if (this._magicShow) {
                let showIds: Array<int> = RideMagicShowCfg.instance.getShowIds();
                for (let i: int = 0, len: int = showIds.length; i < len; i++) {
                    let lv: number = 0;
                    if (this._showTable[showIds[i]]) {
                        lv = this._showTable[showIds[i]][MagicShowInfoFields.star];
                    }
                    let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv);
                    let nextCfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv + 1);
                    let consumableId: number = cfg[rideMagicShowFields.items][0];
                    let needNum: number = cfg[rideMagicShowFields.items][1];
                    let hasNum: number = BagModel.instance.getItemCountById(consumableId);
                    if (hasNum >= needNum && nextCfg) {
                        RedPointCtrl.instance.setRPProperty("weaponIllusionRP", true);
                        return;
                    }
                }
                RedPointCtrl.instance.setRPProperty("weaponIllusionRP", false);
            }


        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItem(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.rideFazhen);
            if (!ifOpen) {
                return false;
            }
            let bollll = RideFazhenCfg.instance.haveItem(id);
            if (bollll) {
                let bollllll = this.getItemIdBayShowId(id);
                if (!bollllll) {
                    // console.log("道具id 拥有 且 未激活 " + id);
                    return true;
                }
                else {
                    // console.log("道具id 不属于外观 或 已激活 " + id);
                    return false;
                }
            }
            else {
                return false;
            }
        }
        //通过该道具的 道具id  判定 该外观 是否 激活
        public getItemIdBayShowId(id: number): boolean {
            let num = RideFazhenCfg.instance.getItemIdBayShowId(id);
            if (!num) {
                return false;
            }
            let shuju = this._dic2.get(num);
            if (shuju) { //有代表激活了
                return true;
            }
            else {
                return false;
            }
        }
        public panDuanpingzhi(id: number): number {
            let num = RideFazhenCfg.instance.getpingZhiBayShowId(id);
            if (!num) {
                return -1;
            }
            else {
                if (num == 3) {
                    return 0;
                }
                else if (num == 4) {
                    return 1;
                }
                else if (num == 5) {
                    return 2;
                }
                else {
                    return -1;
                }
            }
        }
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItemHh(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.rideMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = RideMagicShowCfg.instance.haveItem(id);
            if (bollll) {
                let bollllll = this.getItemIdBayShowIdHh(id);
                if (!bollllll) {
                    // console.log("道具id 拥有 且 未激活 " + id);
                    return true;
                }
                else {
                    // console.log("道具id 不属于外观 或 已激活 " + id);
                    return false;
                }
            }
            else {
                return false;
            }
        }
        //通过该道具的 道具id  判定 该外观 是否 激活
        public getItemIdBayShowIdHh(id: number): boolean {
            let num = RideMagicShowCfg.instance.getItemIdBayShowId(id);
            if (!num) {
                return false;
            }
            let shuju = this._dic2.get(num);
            if (shuju) { //有代表激活了
                return true;
            }
            else {
                return false;
            }
        }
        public panDuanpingzhiHh(id: number): number {
            let num = RideMagicShowCfg.instance.getpingZhiBayShowId(id);
            if (!num) {
                return -1;
            }
            else {
                if (num == 3) {
                    return 0;
                }
                else if (num == 4) {
                    return 1;
                }
                else if (num == 5) {
                    return 2;
                }
                else {
                    return -1;
                }
            }
        }

        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
    }
}