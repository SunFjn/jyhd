///<reference path="../config/guanghuan_feed_cfg.ts"/>
///<reference path="../config/guanghuan_magic_show_cfg.ts"/>
///<reference path="../config/guanghuan_refine_cfg.ts"/>


/** 时装*/


namespace modules.guanghuan {
    import UpdateGuangHuanInfo = Protocols.UpdateGuangHuanInfo;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import UpdateGuangHuanInfoFields = Protocols.UpdateGuangHuanInfoFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GuangHuanFeedCfg = modules.config.GuangHuanFeedCfg;
    import guanghuan_feedFields = Configuration.guanghuan_feedFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import GuangHuanMagicShowCfg = modules.config.GuangHuanMagicShowCfg;
    import guanghuan_magicShow = Configuration.guanghuan_magicShow;
    import guanghuan_magicShowFields = Configuration.guanghuan_magicShowFields;
    import RefineInfo = Protocols.RefineInfo;
    import GuangHuanRefineCfg = modules.config.GuangHuanRefineCfg;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import guanghuan_refine = Configuration.guanghuan_refine;
    import guanghuan_refineFields = Configuration.guanghuan_refineFields;

    export class GuangHuanModel {
        private static _instance: GuangHuanModel;
        public static get instance(): GuangHuanModel {
            return this._instance = this._instance || new GuangHuanModel();
        }

        // 光环信息
        private _guangHuanInfo: UpdateGuangHuanInfo;
        // 激活、升级幻化Id
        public addGuangHuanMagicShowId: number;

        // 修炼类型
        public refineType:number;

        constructor() {

        }

        // 时装信息
        public get guangHuanInfo(): UpdateGuangHuanInfo {
            return this._guangHuanInfo;
        }
        public set guangHuanInfo(value: UpdateGuangHuanInfo) {
            this._guangHuanInfo = value;
            GlobalData.dispatcher.event(CommonEventType.GUANGHUAN_INFO_UPDATE);
            this.checkRP();
        }
    
        // 更换外观
        public changeMagicShow(showId: number): void {
            if (!this._guangHuanInfo) return;
            this._guangHuanInfo[UpdateGuangHuanInfoFields.curShowId] = showId;
            GlobalData.dispatcher.event(CommonEventType.GUANGHUAN_INFO_UPDATE);
        }

        // 根据幻化ID获取幻化信息
        public getMagicShowInfoById(showId: number): MagicShowInfo {
            let info: MagicShowInfo;
            let arr: Array<MagicShowInfo> = this._guangHuanInfo[UpdateGuangHuanInfoFields.showList];
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
            if (!this._guangHuanInfo || !BagModel.instance.bagInited) return;
            let feedLv: number = this._guangHuanInfo[UpdateGuangHuanInfoFields.feedLevel];
            if (!feedLv) return;
            let items: Array<number> = GuangHuanFeedCfg.instance.getCfgByLevel(feedLv)[guanghuan_feedFields.items];
            let count: number = BagModel.instance.getItemCountById(items[0]);        // 时装升级石
            RedPointCtrl.instance.setRPProperty("guanghuanShengJiMatRP", GuangHuanFeedCfg.instance.getCfgByLevel(feedLv + 1) && count >= items[1]);
            let feedSkills: Array<SkillInfo> = this._guangHuanInfo[UpdateGuangHuanInfoFields.feedSkillList];
            let flag: boolean = false;
            for (let i: int = 0, len: int = feedSkills.length; i < len; i++) {
                let skill: SkillInfo = feedSkills[i];
                if (skill[SkillInfoFields.point] > 0) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("guanghuanShengJiRP", flag);
            RedPointCtrl.instance.setRPProperty("guanghuanHuanHuaZhenPinRP", this.getRPByQuality(3));         // 珍品
            RedPointCtrl.instance.setRPProperty("guanghuanHuanHuaJiPinRP", this.getRPByQuality(4));           // 极品
            RedPointCtrl.instance.setRPProperty("guanghuanHuanHuaJuePinRP", this.getRPByQuality(5));          // 绝品
            //RedPointCtrl.instance.setRPProperty("guanghuanHuanHuaDianchangRP", this.getRPByQuality(6));       // 典藏

            let typeArr: Array<int> = GuangHuanRefineCfg.instance.typeArr;
            let refines: Array<RefineInfo> = this._guangHuanInfo[UpdateGuangHuanInfoFields.refineList];
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
                let cfg: guanghuan_refine = GuangHuanRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                if (PlayerModel.instance.level >= cfg[guanghuan_refineFields.humanLevel]) {
                    let count: number = BagModel.instance.getItemCountById(cfg[guanghuan_refineFields.items][0]);
                    if (count >= cfg[guanghuan_refineFields.items][1] && GuangHuanRefineCfg.instance.getCfgByTypeAndLv(type, lv + 1)) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("guanghuanFuHunRP", flag);
        }

        // 根据品质获取幻化红点
        private getRPByQuality(quality: int): boolean {
            let cfgs: Array<guanghuan_magicShow> = GuangHuanMagicShowCfg.instance.getCfgsByQuality(quality);
            let flag = false;
            for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                let cfg: guanghuan_magicShow = cfgs[i];
                let showId: number = cfg[guanghuan_magicShowFields.showId];
                let info: MagicShowInfo = this.getMagicShowInfoById(showId);
                if (info) {
                    cfg = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, info[MagicShowInfoFields.star]);
                }
                let nextCfg: guanghuan_magicShow = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, cfg[guanghuan_magicShowFields.level] + 1);
                let item: Array<number> = cfg[guanghuan_magicShowFields.items];
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
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.guangHuan);
            if (!ifOpen) {
                return false;
            }
            let bollll = GuangHuanMagicShowCfg.instance.haveItem(id);
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
            let num = GuangHuanMagicShowCfg.instance.getItemIdBayShowId(id);
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
            let num = GuangHuanMagicShowCfg.instance.getpingZhiBayShowId(id);
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