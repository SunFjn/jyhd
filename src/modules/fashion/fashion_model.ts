///<reference path="../config/fashion_feed_cfg.ts"/>
///<reference path="../config/fashion_magic_show_cfg.ts"/>
///<reference path="../config/fashion_refine_cfg.ts"/>


/** 时装*/


namespace modules.fashion {
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FashionFeedCfg = modules.config.FashionFeedCfg;
    import fashion_feedFields = Configuration.fashion_feedFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import FashionMagicShowCfg = modules.config.FashionMagicShowCfg;
    import fashion_magicShow = Configuration.fashion_magicShow;
    import fashion_magicShowFields = Configuration.fashion_magicShowFields;
    import RefineInfo = Protocols.RefineInfo;
    import FashionRefineCfg = modules.config.FashionRefineCfg;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import fashion_refine = Configuration.fashion_refine;
    import fashion_refineFields = Configuration.fashion_refineFields;

    export class FashionModel {
        private static _instance: FashionModel;
        public static get instance(): FashionModel {
            return this._instance = this._instance || new FashionModel();
        }

        // 时装信息
        private _fashionInfo: UpdateFashionInfo;
        // 激活、升级幻化Id
        public addFashionMagicShowId: number;

        // 修炼类型
        public refineType:number;

        constructor() {

        }

        // 时装信息
        public get fashionInfo(): UpdateFashionInfo {
            return this._fashionInfo;
        }

        public set fashionInfo(value: UpdateFashionInfo) {
            this._fashionInfo = value;
            GlobalData.dispatcher.event(CommonEventType.FASHION_INFO_UPDATE);

            this.checkRP();
        }

        // 更换外观
        public changeMagicShow(showId: number): void {
            if (!this._fashionInfo) return;
            this._fashionInfo[UpdateFashionInfoFields.curShowId] = showId;
            GlobalData.dispatcher.event(CommonEventType.FASHION_INFO_UPDATE);
        }

        // 根据幻化ID获取幻化信息
        public getMagicShowInfoById(showId: number): MagicShowInfo {
            let info: MagicShowInfo;
            let arr: Array<MagicShowInfo> = this._fashionInfo[UpdateFashionInfoFields.showList];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (arr[i][MagicShowInfoFields.showId] === showId) {
                    info = arr[i];
                    break;
                }
            }
            return info;
        }

        // 检测红点
        public checkRP(): void {
            if (!this._fashionInfo || !BagModel.instance.bagInited) return;
            let feedLv: number = this._fashionInfo[UpdateFashionInfoFields.feedLevel];
            if (!feedLv) return;
            let items: Array<number> = FashionFeedCfg.instance.getCfgByLevel(feedLv)[fashion_feedFields.items];
            let count: number = BagModel.instance.getItemCountById(items[0]);        // 时装升级石
            RedPointCtrl.instance.setRPProperty("fashionShengJiMatRP", FashionFeedCfg.instance.getCfgByLevel(feedLv + 1) && count >= items[1]);
            let feedSkills: Array<SkillInfo> = this._fashionInfo[UpdateFashionInfoFields.feedSkillList];
            let flag: boolean = false;
            for (let i: int = 0, len: int = feedSkills.length; i < len; i++) {
                let skill: SkillInfo = feedSkills[i];
                if (skill[SkillInfoFields.point] > 0) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("fashionShengJiRP", flag);

            RedPointCtrl.instance.setRPProperty("fashionHuanHuaZhenPinRP", this.getRPByQuality(3));         // 珍品
            RedPointCtrl.instance.setRPProperty("fashionHuanHuaJiPinRP", this.getRPByQuality(4));           // 极品
            RedPointCtrl.instance.setRPProperty("fashionHuanHuaJuePinRP", this.getRPByQuality(5));          // 绝品
            RedPointCtrl.instance.setRPProperty("fashionHuanHuaDianchangRP", this.getRPByQuality(6));          // 典藏

            let typeArr: Array<int> = FashionRefineCfg.instance.typeArr;
            let refines: Array<RefineInfo> = this._fashionInfo[UpdateFashionInfoFields.refineList];
            flag = false;
            for (let i: int = 0, len: int = typeArr.length; i < len; i++) {
                let lv: int = 0;
                let type: int = typeArr[i];
                for (let j: int = 0, len1: int = refines.length; j < len1; j++) {
                    let refine: RefineInfo = refines[j];
                    if (type === refine[RefineInfoFields.type]) {
                        lv = refine[RefineInfoFields.level];
                        break;
                    }
                }
                let cfg: fashion_refine = FashionRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                if (PlayerModel.instance.level >= cfg[fashion_refineFields.humanLevel]) {
                    let count: number = BagModel.instance.getItemCountById(cfg[fashion_refineFields.items][0]);
                    if (count >= cfg[fashion_refineFields.items][1] && FashionRefineCfg.instance.getCfgByTypeAndLv(type, lv + 1)) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("fashionFuHunRP", flag);
        }

        // 根据品质获取幻化红点
        private getRPByQuality(quality: int): boolean {
            let cfgs: Array<fashion_magicShow> = FashionMagicShowCfg.instance.getCfgsByQuality(quality);
            let flag = false;
            for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                let cfg: fashion_magicShow = cfgs[i];
                let showId: number = cfg[fashion_magicShowFields.showId];
                let info: MagicShowInfo = this.getMagicShowInfoById(showId);
                if (info) {
                    cfg = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, info[MagicShowInfoFields.star]);
                }
                let nextCfg: fashion_magicShow = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, cfg[fashion_magicShowFields.level] + 1);
                let item: Array<number> = cfg[fashion_magicShowFields.items];
                let count: number = BagModel.instance.getItemCountById(item[0]);
                if (count >= item[1] && nextCfg) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItem(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.fashionMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = FashionMagicShowCfg.instance.haveItem(id);
            if (bollll) {
                let bollllll = this.getItemIdBayShowId(id);
                if (!bollllll) {
                    console.log("道具id 拥有 且 未激活 " + id);
                    return true;
                }
                else {
                    console.log("道具id 不属于外观 或 已激活 " + id);
                    return false;
                }
            }
            else {
                return false;
            }
        }
        //通过该道具的 道具id  判定 该外观 是否 激活
        public getItemIdBayShowId(id: number): boolean {
            let num = FashionMagicShowCfg.instance.getItemIdBayShowId(id);
            if (!num) {
                return false;
            }

            let shuju = this.getMagicShowInfoById(num);
            if (shuju) { //有代表激活了
                return true;
            }
            else {
                return false;
            }
        }
        public panDuanpingzhi(id: number): number {
            let num = FashionMagicShowCfg.instance.getpingZhiBayShowId(id);
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
                else if (num == 6) {
                    return 3;
                }
                else {
                    return -1;
                }
            }
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}