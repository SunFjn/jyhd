///<reference path="../config/pet_feed_cfg.ts"/>
///<reference path="../config/pet_rank_cfg.ts"/>
///<reference path="../config/pet_refine_cfg.ts"/>
///<reference path="../config/pet_magicShow_cfg.ts"/>
///<reference path="../illusion/illusion_model.ts"/>
///<reference path="../config/pet_fazhen_cfg.ts"/>
/**
 * 宠物数据
 */
namespace modules.magicPet {
    import Dictionary = Laya.Dictionary;
    import PetFeed = Protocols.PetFeed;
    import PetFeedFields = Protocols.PetFeedFields;
    import PetMagicShow = Protocols.PetMagicShow;
    import PetRank = Protocols.PetRank;
    import PetRankFields = Protocols.PetRankFields;
    import PetRefine = Protocols.PetRefine;
    import SkillInfo = Protocols.SkillInfo;
    import UpdatePetInfoFields = Protocols.UpdatePetInfoFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import PetMagicShowFields = Protocols.PetMagicShowFields;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import RefineInfo = Protocols.RefineInfo;
    import PetRefineFields = Protocols.PetRefineFields;
    import PetRefineCfg = modules.config.PetRefineCfg;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import petRefine = Configuration.petRefine;
    import petRefineFields = Configuration.petRefineFields;
    import BagModel = modules.bag.BagModel;
    import petFeed = Configuration.petFeed;
    import PetFeedCfg = modules.config.PetFeedCfg;
    import petFeedFields = Configuration.petFeedFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PetMagicShowCfg = modules.config.PetMagicShowCfg;
    import petMagicShow = Configuration.petMagicShow;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import PlayerModel = modules.player.PlayerModel;
    import PetRankCfg = modules.config.PetRankCfg;
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;
    //法阵相关
    import PetFazhen = Protocols.PetFazhen;
    import PetFazhenFields = Protocols.PetFazhenFields;
    import PetFazhenCfg = modules.config.PetFazhenCfg;
    import pet_fazhen = Configuration.pet_fazhen;
    import pet_fazhenFields = Configuration.pet_fazhenFields;
    import RedPointProperty = ui.RedPointProperty;
    import TypesAttr = Protocols.TypesAttr;

    export class MagicPetModel {
        private static _instance: MagicPetModel = new MagicPetModel();
        public static get instance(): MagicPetModel {
            return this._instance = this._instance || new MagicPetModel();
        }

        // 培养技能列表
        public feedSkills: Array<Protocols.SkillInfo>;
        // 进阶技能列表
        public upgradeSkills: Array<SkillInfo>;

        public _curExp: number; // 当前培养经验值
        public _curLv: number;  // 当前培养等级

        public _star: number;   // 当前进阶星级
        public _blessing: number;// 当前祝福值

        public feed: PetFeed;       // 培养
        public rank: PetRank;       // 进阶
        public _refine: PetRefine; // 修炼列表/总属性

        private _magicShow: PetMagicShow;// 幻化信息
        private _showTable: Table<MagicShowInfo>;
        /** 面板类型，0精灵，1宠物*/
        public panelType: int;


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

        public dataInit(feed: PetFeed, rank: PetRank, refine: PetRefine, fazhen: PetFazhen, magicShow: PetMagicShow) {
            this._curExp = feed[Protocols.PetFeedFields.exp];
            this._curLv = feed[Protocols.PetFeedFields.level];
            this.feedSkills = feed[Protocols.PetFeedFields.skillList];
            // 初始化进阶数据
            this._star = rank[Protocols.PetRankFields.star];
            this._blessing = rank[Protocols.PetRankFields.blessing];
            this.upgradeSkills = rank[PetRankFields.skillList];

            this.feed = feed;
            this.rank = rank;
            this._refine = refine;
            this.magicShow = magicShow;

            //法阵相关
            this.InitializeFaZhen(fazhen);

            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_INITED);

            this.checkRedPoint();
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
            // console.log("宠物法阵数据：   ", this._fazhen);
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
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 7]);
            } else if (this._dic2.get(this._huanhuaActId)[MagicShowInfoFields.star] == 1) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 7]);
            }
        }

        //..检测幻化列表红点
        public huanhuaRedPoint(): void {

            let idArr3: Array<pet_fazhen> = PetFazhenCfg.instance.getSkinCfgByType(3);
            let idArr4: Array<pet_fazhen> = PetFazhenCfg.instance.getSkinCfgByType(4);
            let idArr5: Array<pet_fazhen> = PetFazhenCfg.instance.getSkinCfgByType(5);

            this.qualityType(3, idArr3);
            this.qualityType(4, idArr4);
            this.qualityType(5, idArr5);
        }

        private qualityType(type: number, arr: Array<pet_fazhen>): void {

            for (let i: int = 0, len: int = arr.length; i < len; i++) {

                let star = 0;
                let id = arr[i][pet_fazhenFields.showId];

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
            let cfg = PetFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev);
            let nextCfg = PetFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev + 1);
            let count: int = cfg[pet_fazhenFields.items][1];
            let itemId: int = cfg[pet_fazhenFields.items][0];

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
            return type == 3 ? "magicPetFazhenJipinRP" : type == 4 ? "magicPetFazhenZhenpinRP" : "magicPetFazhenJuepinRP";
        }


        //...............................................


        // 更新宠物
        public updatePetInfo(tuple: Protocols.UpdatePetInfo): void {
            // 激活/升级技能
            let petFeed: PetFeed = tuple[UpdatePetInfoFields.feed];
            this._curExp = petFeed[Protocols.PetFeedFields.exp];
            this._curLv = petFeed[Protocols.PetFeedFields.level];
            this.feedSkills = petFeed[PetFeedFields.skillList];

            let rank: PetRank = tuple[UpdatePetInfoFields.rank];
            let star: number = rank[Protocols.PetRankFields.star];
            if (star % 10 == 1 && star > this._star && star != 1) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [illusion.IllusionModel.instance.magicShowId, 6]);
            }
            this._star = rank[Protocols.PetRankFields.star];

            this._blessing = rank[Protocols.PetRankFields.blessing];
            this.upgradeSkills = rank[PetRankFields.skillList];

            this.feed = petFeed;
            this.rank = rank;
            this._refine = tuple[UpdatePetInfoFields.refine];
            this.magicShow = tuple[UpdatePetInfoFields.magicShow];


            //法阵相关
            this.InitializeFaZhen(tuple[UpdatePetInfoFields.fazhen]);
            GlobalData.dispatcher.event(CommonEventType.FZHUANHUA_UPDATA);


            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
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

        // 培养
        public feedPet(lv: number, exp: number): void {
            this._curExp = exp;
            this._curLv = lv;
            this.feed[PetFeedFields.exp] = exp;
            this.feed[PetFeedFields.level] = lv;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
        }

        // 进阶
        public rankPet(tuple: Protocols.RankPetReply): void {
            let blessing: number = tuple[Protocols.RankPetReplyFields.blessing];
            this._blessing = blessing;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
        }

        // 修炼
        public refinePet(result: number): void {
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
        }

        // 检测红点
        public checkRedPoint(): void {
            this.huanhuaRedPoint();
            let flag: boolean = false;

            if (!this.feedSkills) return;
            for (let i: int = 0, len: int = this.feedSkills.length; i < len; i++) {
                let skill: SkillInfo = this.feedSkills[i];
                if (skill[SkillInfoFields.point] > 0) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("petFeedSkillRP", flag);

            flag = false;
            for (let i: int = 0, len: int = this.upgradeSkills.length; i < len; i++) {
                let skill: SkillInfo = this.upgradeSkills[i];
                if (skill[SkillInfoFields.point] > 0) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("petRankSkillRP", flag);

            this.updateBag();
        }

        public updateBag(): void {
            // 判断培养材料是否满足
            if (this.feed) {
                let lv: number = this.feed[PetFeedFields.level];
                if (!lv) return;
                let exp: number = this.feed[PetFeedFields.exp];
                let cfg: petFeed = PetFeedCfg.instance.getPetFeedCfgByLv(lv);
                let nextCfg: petFeed = PetFeedCfg.instance.getPetFeedCfgByLv(lv + 1);
                if (!nextCfg) {
                    RedPointCtrl.instance.setRPProperty("petFeedMatRP", false);
                } else {
                    let needExp: number = cfg[petFeedFields.exp] - exp;
                    let itemInfo: Array<number> = cfg[petFeedFields.items];
                    let needCount: number = Math.ceil(needExp / itemInfo[2]);
                    RedPointCtrl.instance.setRPProperty("petFeedMatRP", BagModel.instance.getItemCountById(itemInfo[0]) >= needCount);
                }
            }

            //判断进阶材料是否满足
            if (this.rank) {
                let lv: number = this.rank[PetRankFields.star];
                if (lv == -1) return;
                let exp: number = this.rank[PetRankFields.blessing];
                let cfg: petRank = PetRankCfg.instance.getPetRankCfgBySt(lv);
                let nextCfg: petRank = PetRankCfg.instance.getPetRankCfgBySt(lv + 1);
                if (!nextCfg) {
                    RedPointCtrl.instance.setRPProperty("petRankMatRP", false);
                } else {
                    let needExp: number = cfg[petRankFields.blessing] - exp;
                    let itemInfo: Array<number> = cfg[petRankFields.items];
                    let needCount: number = Math.ceil(needExp / itemInfo[2]);
                    RedPointCtrl.instance.setRPProperty("petRankMatRP", BagModel.instance.getItemCountById(itemInfo[0]) >= needCount);
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
                    let cfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(j, lv);
                    let item: Array<number> = cfg[petRefineFields.items];
                    if (BagModel.instance.getItemCountById(item[0]) >= item[1] &&
                        cfg[petRefineFields.humanLevel] < PlayerModel.instance.level
                        && lv != PetRefineCfg.instance.getMaxLvByLv(type, lv)) {
                        flag = true;  //还得判断满级啊 哥
                        break;
                    }
                }
                RedPointCtrl.instance.setRPProperty("petRefineMaterialRP", flag);
            }

            //判断幻化材料是否满足
            if (this._magicShow) {
                let showIds: Array<int> = PetMagicShowCfg.instance.getShowIds();
                for (let i: int = 0, len: int = showIds.length; i < len; i++) {
                    let lv: number = 0;
                    if (this._showTable[showIds[i]]) {
                        lv = this._showTable[showIds[i]][MagicShowInfoFields.star];
                    }
                    let cfg: petMagicShow = PetMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv);
                    let nextCfg: petMagicShow = PetMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv + 1);
                    let consumableId: number = cfg[petMagicShowFields.items][0];
                    let needNum: number = cfg[petMagicShowFields.items][1];
                    let hasNum: number = BagModel.instance.getItemCountById(consumableId);

                    if (hasNum >= needNum && nextCfg) {
                        RedPointCtrl.instance.setRPProperty("petIllusionRP", true);
                        return;
                    }
                }
                RedPointCtrl.instance.setRPProperty("petIllusionRP", false);
            }

        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItem(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.petFazhen);
            if (!ifOpen) {
                return false;
            }
            let bollll = PetFazhenCfg.instance.haveItem(id);
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
            let num = PetFazhenCfg.instance.getItemIdBayShowId(id);
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
            let num = PetFazhenCfg.instance.getpingZhiBayShowId(id);
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
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.petMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = PetMagicShowCfg.instance.haveItem(id);
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
            let num = PetMagicShowCfg.instance.getItemIdBayShowId(id);
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
            let num = PetMagicShowCfg.instance.getpingZhiBayShowId(id);
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