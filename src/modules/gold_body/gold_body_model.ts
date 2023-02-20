/** 金身数据 */


///<reference path="../config/gold_body_cfg.ts"/>
///<reference path="../config/gold_body_unbeaten_cfg.ts"/>
///<reference path="../func_open/func_open_model.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>

namespace modules.goldBody {

    import soulRefine = Configuration.soulRefine;
    import soulRise = Configuration.soulRise;
    import soulRefineFields = Configuration.soulRefineFields;
    import GoldBodyRefineCfg = modules.config.GoldBodyRefineCfg;
    import GoldBodyUnbeatenCfg = modules.config.GoldBodyUnbeatenCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import PlayerModel = modules.player.PlayerModel;
    import UpdateSoulInfoFields = Protocols.UpdateSoulInfoFields;
    import SoulRise = Protocols.SoulRise;
    import SoulRiseFields = Protocols.SoulRiseFields;
    import SoulRefine = Protocols.SoulRefine;
    import SoulRefineFields = Protocols.SoulRefineFields;
    import SoulRefineInfo = Protocols.SoulRefineInfo;
    import SoulRefineInfoFields = Protocols.SoulRefineInfoFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import TypesAttr = Protocols.TypesAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    import ActorBaseAttr = Protocols.ActorBaseAttr;

    export class GoldBodyModel {
        private static _instance: GoldBodyModel = new GoldBodyModel();
        public static get instance(): GoldBodyModel {
            return this._instance;
        }

        // 金身修炼配置数据
        public _refine: SoulRefine;

        // 不败金身修炼数据
        public _rise: SoulRise;

        //金身总属性显示数据
        public _attr: Array<TypesAttr>;

        //金身选择项,用于红点选择
        public selectIndex: number = 0;

        //金身升级需要的金钱
        private _costNum: Array<number>;

        //装备套装对应的名称
        // private _refineTypeNames = ["无垢体", "琼玉体", "琉璃体", "菩提体", "金刚体", "归元体", "通玄体", "不灭体"];
        private _refineTypeNames = ["戾龙套装", "怒灵套装", "智慧套装", "大地套装", "守夜套装", "生命套装", "战争套装", "控魂套装"];//,"摩羯套装","天马套装"
        /**
         * 各个套装的装备显示id
         */
        public _equipIds: number[][] = [[50165012, 50165022, 50165032, 50165042, 50165052, 50165062, 50165072, 50165082, 50165092, 50165102],
        [50265012, 50265022, 50265032, 50265042, 50265052, 50265062, 50265072, 50265082, 50265092, 50265102],
        [50365012, 50365022, 50365032, 50365042, 50365052, 50365062, 50365072, 50365082, 50365092, 50365102],
        [50465012, 50465022, 50465032, 50465042, 50465052, 50465062, 50465072, 50465082, 50465092, 50465102,],
        [50565012, 50565022, 50565032, 50565042, 50565052, 50565062, 50565072, 50565082, 50565092, 50565102,],
        [50665012, 50665022, 50665032, 50665042, 50665052, 50665062, 50665072, 50665082, 50665092, 50665102,],
        [50765012, 50765022, 50765032, 50765042, 50765052, 50765062, 50765072, 50765082, 50765092, 50765102,],
        [50865012, 50865022, 50865032, 50865042, 50865052, 50865062, 50865072, 50865082, 50865092, 50865102]]
        //金身升级
        public isLevelUp: boolean;
        /**
         * 套装字体描边颜色
         */
        public suitColors = ["#b12121", "#b12121", "#c10be6", "#23242a", "#d65313", "#d65313", "#1dab6d", "#347fab"]
        constructor() {

        }

        /**
         * 初始化需要的数据
         */
        public dataInit(refine: SoulRefine, rise: SoulRise, attr: Array<TypesAttr>) {
            this._refine = refine;
            this._rise = rise;
            this._attr = attr;
            this.isLevelUp = false;
            this._costNum = new Array<number>();
            this.updateCostNum();
            this._refineTypeNames=[]
            for (let i = 0; i <8; i++) {
                let cfg: soulRefine =this.getAttrByIdAndLevel(i, i);
                this._refineTypeNames.push(cfg[2])
                
            }    
            GlobalData.dispatcher.event(CommonEventType.GOLD_BODY_INITED);
        }

        /**
         * 金身信息更新
         */
        public updateSoulInfo(tuple: Protocols.UpdateSoulInfo): void {
            this._refine = tuple[UpdateSoulInfoFields.refine];
            this._rise = tuple[UpdateSoulInfoFields.rise];
            this._attr = tuple[UpdateSoulInfoFields.attr];
            this.updateCostNum();
            GlobalData.dispatcher.event(CommonEventType.GOLD_BODY_UPDATE);
        }

        //金身升级需要消耗的金钱数量
        private updateCostNum(): void {
            let infos: Array<SoulRefineInfo> = this._refine[SoulRefineFields.list];
            let t: number = 0;
            for (let i = 0; i < this._refineTypeNames.length; i++) {
                // if (infos && t < infos.length && i == infos[t][SoulRefineInfoFields.type]) {
                //     let soulLevel = infos[t][SoulRefineInfoFields.level];
                //     let info: soulRefine = this.getAttrByIdAndLevel(i, soulLevel);
                //     this._costNum[i] = info[soulRefineFields.copper];
                //     t++;
                // }
                // else {
                //     let info: soulRefine = this.getAttrByIdAndLevel(i, 0);
                //     this._costNum[i] = info[soulRefineFields.copper];
                // }
                let level = this.getNowLvById(i);
                let info: soulRefine = this.getAttrByIdAndLevel(i, level);
                this._costNum[i] = info[soulRefineFields.copper];
            }
        }

        /**
         * 金身部分根据id和等级来获得属性
         */
        public getAttrByIdAndLevel(goldBodyId: number, goldBodyLevel: number): soulRefine {
            let t: soulRefine = GoldBodyRefineCfg.instance.getCfgByTypeAndLv(goldBodyId, goldBodyLevel);
            return t ? t : null;
        }

        /**
         * 不败金身部分根据等级来获得属性
         */
        public getAttrByLevel(level: number): soulRise {
            let t: soulRise = GoldBodyUnbeatenCfg.instance.getCfgByLv(level);
            return t ? t : null;
        }

        /**
         * 不败金身部分检测是否达到最大等级
         */
        public checkIsRiseMax(level: number): boolean {
            let max: number = GoldBodyUnbeatenCfg.instance.getMaxLvByLv();
            if (level < max)
                return false;
            else
                return true
        }

        /**
         * 金身检测某个类型是否达到最大等级
         */
        public checkIsRefineMax(type: number, level: number): boolean {
            let max: number = GoldBodyRefineCfg.instance.getMaxLvByType(type);
            if (level < max)
                return false;
            else
                return true
        }

        /**
         * 页签部分根据id来获得对应的名字
         */
        public getNameById(id: number): string {
            return this._refineTypeNames[id];
        }
 

        /**
         * 页签部分根据id来获得对应等级
         */
        public getInfoById(id: number): number {
            let allInfos: Array<SoulRefineInfo> = this._refine[SoulRefineFields.list];
            let soulLevel: number = 1;
            let bigLevel: number = 0;
            if (allInfos.length > 0) {
                for (let i = 0; i < allInfos.length; i++) {
                    if (id == allInfos[i][SoulRefineInfoFields.type]) {
                        soulLevel = allInfos[i][SoulRefineInfoFields.level];
                        let lift = soulLevel % 10;
                        if (soulLevel == 0) {
                            bigLevel = 1;
                        } else if (lift == 0) {
                            bigLevel = Math.floor(soulLevel / 10);
                        } else {
                            bigLevel = Math.floor(soulLevel / 10) + 1;
                        }
                        break;
                    }
                }
            }
            return bigLevel;
        }

        /**
         * 判断金身是否开启,最大的判断
         */
        // public checkGoldBodyIsOpen(showTips: boolean): boolean {
        //     if (showTips) {
        //          SystemNoticeManager.instance.addNotice("功能未开启", true);
        //     }
        //     if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.soul) == ActionOpenState.open) {
        //         return true;
        //     }
        //     return false;
        // }

        /**
         * 根据id来检测该页签是否开放
         */
        public checkOpenById(id: number, showTips: boolean): boolean {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let transformLv: number = attr[ActorBaseAttrFields.eraLvl];
            let transformNum: number = attr[ActorBaseAttrFields.eraNum];
            let level: number = this.getAttrByIdAndLevel(id, 0)[soulRefineFields.promoteLevel];//获得最低等级的开启限制
            let fir: int = Math.floor(level / 100);
            let sec: int = level % 100;
            if (transformLv > fir) {  //觉醒等级大于限制等级
                return true;
            } else if (transformLv == fir && transformNum >= sec) {  //等级等于限制等级时
                return true;
            } else if (showTips) {
                SystemNoticeManager.instance.addNotice(`主角${fir}阶${sec}段开启`);
            }
            return false;
        }

        public getNowLvById(id: number): number {
            let infos: Array<SoulRefineInfo> = [];
            if (this._refine) {
                infos = this._refine[SoulRefineFields.list];
            }
            let level: number = 0;
            if (infos && infos.length > 0) {
                for (let i = 0; i < infos.length; i++) {
                    if (id == infos[i][SoulRefineInfoFields.type]) {
                        level = infos[i][SoulRefineInfoFields.level];
                    }
                }
            }
            return level;
        }

        /**
         * 根据id和等级判断是否达到金身的条件限制,包括最大等级判断
         */
        public checkIsFitCondition(id: number): boolean {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let transformLv: number = attr[ActorBaseAttrFields.eraLvl];
            let transformNum: number = attr[ActorBaseAttrFields.eraNum];
            let infos: Array<SoulRefineInfo> = [];
            if (this._refine) {
                infos = this._refine[SoulRefineFields.list];
            }
            let level: number = 0;//获得最低等级的开启限制
            let hasInfo: boolean = false;
            if (infos && infos.length > 0) {
                for (let i = 0; i < infos.length; i++) {
                    if (id == infos[i][SoulRefineInfoFields.type] && !this.checkIsRefineMax(id, infos[i][SoulRefineInfoFields.level])) {
                        let cfg = this.getAttrByIdAndLevel(id, infos[i][SoulRefineInfoFields.level] + 1);
                        if (!cfg) {
                            return false;
                        } else {
                            cfg = this.getAttrByIdAndLevel(id, infos[i][SoulRefineInfoFields.level]);
                            level = cfg[soulRefineFields.promoteLevel];
                            hasInfo = true;
                        }
                        break;
                    }
                }
            }
            if (!hasInfo) {
                level = this.getAttrByIdAndLevel(id, 1)[soulRefineFields.promoteLevel];
            }
            let fir: int = Math.floor(level / 100);
            let sec: int = level % 100;
            if (transformLv > fir) {  //觉醒等级大于限制等级
                return true;
            } else if (transformLv == fir && transformNum >= sec) { //等级等于限制等级时
                return true;
            }
            return false;
        }

        /**
         * 根据id判断金身是否能修炼中金钱的判断
         */
        public checkCanTrainingById(id: number): boolean {
            if (this._costNum && this._costNum[id] <= PlayerModel.instance.copper) {
                return true
            }
            return false;
        }
        public checkMoneyById(id: number): number {
            if (this._costNum && this._costNum[id] && this._costNum[id] <= PlayerModel.instance.copper) {
                return this._costNum[id]
            }
            return 1;
        }
        /**
         * 判断不败金身是否可修炼
         */
        public checkRiseCanTraining(): boolean {
            if (this._rise) {
                return this._rise[SoulRiseFields.point];
            }
            return false;
        }

        /**
         * 根据金身&不败金身是否可修炼，角色界面金身红点调用，开放/等级/金钱
         */
        public checkRefineCanTraining(): boolean {
            let moneyNum = 0;
            this.selectIndex = 0;
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soul)) {  //功能开放
                for (let i = 0; i < this._refineTypeNames.length; i++) {
                    if (this.checkOpenById(i, false)) {   //页签开放
                        if (this.checkIsFitCondition(i)) { //达到升到下一级条件（并且能升级）
                            if (this.checkCanTrainingById(i)) {   //判断金钱是否足够
                                let qian = this.checkMoneyById(i);
                                if (moneyNum == 0) {
                                    this.selectIndex = i;
                                    moneyNum = qian;
                                }
                                if (qian < moneyNum) {
                                    moneyNum = qian;
                                    this.selectIndex = i;
                                }
                            }
                        }
                    }
                }
            }
            if (moneyNum == 1 || moneyNum == 0) {
                this.selectIndex = 0;
            }
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soul)) {  //功能开放
                for (let i = 0; i < this._refineTypeNames.length; i++) {
                    if (this.checkOpenById(i, false)) {   //页签开放
                        if (this.checkIsFitCondition(i)) { //达到升到下一级条件（并且能升级）
                            if (this.checkCanTrainingById(i)) {   //判断金钱是否足够
                                RedPointCtrl.instance.setRPProperty("goldBodyRP", true);
                                return true;
                            }
                        }
                    }
                }
            }
            if (this.checkRiseCanTraining()) {
                if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soul)) {
                    RedPointCtrl.instance.setRPProperty("goldBodyRP", true);
                }
                this.selectIndex == 0;
                return true;
            }
            RedPointCtrl.instance.setRPProperty("goldBodyRP", false);
            return false;
        }
    }
}