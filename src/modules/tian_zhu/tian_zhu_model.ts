///<reference path="../config/tian_zhu_feed_cfg.ts"/>
///<reference path="../config/tian_zhu_refine_cfg.ts"/>
///<reference path="../config/tian_zhu_magic_show_cfg.ts"/>


/** 时装*/



namespace modules.tianZhu {
    import UpdateTianZhuInfo = Protocols.UpdateTianZhuInfo;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import BagModel = modules.bag.BagModel;
    import TianZhuFeedCfg = modules.config.TianZhuFeedCfg;
    import tianzhu_feedFields = Configuration.tianzhu_feedFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import TianZhuRefineCfg = modules.config.TianZhuRefineCfg;
    import RefineInfo = Protocols.RefineInfo;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import tianzhu_refine = Configuration.tianzhu_refine;
    import tianzhu_refineFields = Configuration.tianzhu_refineFields;
    import tianzhu_magicShow = Configuration.tianzhu_magicShow;
    import TianZhuMagicShowCfg = modules.config.TianZhuMagicShowCfg;
    import tianzhu_magicShowFields = Configuration.tianzhu_magicShowFields;

    export class TianZhuModel {
        private static _instance: TianZhuModel;
        public static get instance(): TianZhuModel {
            return this._instance = this._instance || new TianZhuModel();
        }

        // 时装信息
        private _tianZhuInfo: UpdateTianZhuInfo;
        public addTianZhuMagicShowId: number;
        // 附魂类型
        public refineType:number;

        constructor() {

        }

        // 时装信息
        public get tianZhuInfo(): UpdateTianZhuInfo {
            return this._tianZhuInfo;
        }

        public set tianZhuInfo(value: UpdateTianZhuInfo) {
            this._tianZhuInfo = value;
            GlobalData.dispatcher.event(CommonEventType.TIAN_ZHU_INFO_UPDATE);

            this.checkRP();
        }

        // 更换外观
        public changeMagicShow(showId: number): void {
            if (!this._tianZhuInfo) return;
            this._tianZhuInfo[UpdateTianZhuInfoFields.curShowId] = showId;
            GlobalData.dispatcher.event(CommonEventType.TIAN_ZHU_INFO_UPDATE);
        }

        // 根据幻化ID获取幻化信息
        public getMagicShowInfoById(showId: number): MagicShowInfo {
            let info: MagicShowInfo;
            let arr: Array<MagicShowInfo> = this._tianZhuInfo[UpdateTianZhuInfoFields.showList];
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
            if (!this._tianZhuInfo || !BagModel.instance.bagInited) return;
            let feedLv: number = this._tianZhuInfo[UpdateTianZhuInfoFields.feedLevel];
            if (!feedLv) return;
            let items: Array<number> = TianZhuFeedCfg.instance.getCfgByLevel(feedLv)[tianzhu_feedFields.items];
            let count: number = BagModel.instance.getItemCountById(items[0]);        // 时装升级石
            RedPointCtrl.instance.setRPProperty("tianZhuShengJiMatRP", TianZhuFeedCfg.instance.getCfgByLevel(feedLv + 1) && count >= items[1]);
            let feedSkills: Array<SkillInfo> = this._tianZhuInfo[UpdateTianZhuInfoFields.feedSkillList];
            let flag: boolean = false;
            for (let i: int = 0, len: int = feedSkills.length; i < len; i++) {
                let skill: SkillInfo = feedSkills[i];
                if (skill[SkillInfoFields.point] > 0) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("tianZhuShengJiRP", flag);

            RedPointCtrl.instance.setRPProperty("tianZhuHuanHuaZhenPinRP", this.getRPByQuality(3));         // 珍品
            RedPointCtrl.instance.setRPProperty("tianZhuHuanHuaJiPinRP", this.getRPByQuality(4));           // 极品
            RedPointCtrl.instance.setRPProperty("tianZhuHuanHuaJuePinRP", this.getRPByQuality(5));          // 绝品

            let typeArr: Array<int> = TianZhuRefineCfg.instance.typeArr;
            let refines: Array<RefineInfo> = this._tianZhuInfo[UpdateTianZhuInfoFields.refineList];
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
                let cfg: tianzhu_refine = TianZhuRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                if (PlayerModel.instance.level >= cfg[tianzhu_refineFields.humanLevel]) {
                    let count: number = BagModel.instance.getItemCountById(cfg[tianzhu_refineFields.items][0]);
                    if (count >= cfg[tianzhu_refineFields.items][1] && TianZhuRefineCfg.instance.getCfgByTypeAndLv(type, lv + 1)) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("tianZhuFuHunRP", flag);
        }

        // 根据品质获取幻化红点
        private getRPByQuality(quality: int): boolean {
            let cfgs: Array<tianzhu_magicShow> = TianZhuMagicShowCfg.instance.getCfgsByQuality(quality);
            let flag = false;
            for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                let cfg: tianzhu_magicShow = cfgs[i];
                let showId: number = cfg[tianzhu_magicShowFields.showId];
                let info: MagicShowInfo = this.getMagicShowInfoById(showId);
                if (info) {
                    cfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, info[MagicShowInfoFields.star]);
                }
                let nextCfg: tianzhu_magicShow = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, cfg[tianzhu_magicShowFields.level] + 1);
                let item: Array<number> = cfg[tianzhu_magicShowFields.items];
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
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.tianZhuMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = TianZhuMagicShowCfg.instance.haveItem(id);
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
            let num = TianZhuMagicShowCfg.instance.getItemIdBayShowId(id);
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
            let num = TianZhuMagicShowCfg.instance.getpingZhiBayShowId(id);
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