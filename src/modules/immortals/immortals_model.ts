namespace modules.immortals {
    import GetShenbingInfoReply = Protocols.GetShenbingInfoReply;
    import GetShenbingInfoReplyFields = Protocols.GetShenbingInfoReplyFields;
    import SkillInfo = Protocols.SkillInfo;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import RefineInfo = Protocols.RefineInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import Dictionary = Laya.Dictionary;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagModel = modules.bag.BagModel;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import RedPointProperty = ui.RedPointProperty;
    import shenbing_magicShow = Configuration.shenbing_magicShow;
    import shenbing_refine = Configuration.shenbing_refine;
    import shenbing_refineFields = Configuration.shenbing_refineFields;
    import PlayerModel = modules.player.PlayerModel;
    import shenbing_feedFields = Configuration.shenbing_feedFields;
    import UpdateShenbingInfo = Protocols.UpdateShenbingInfo;
    import TypesAttr = Protocols.TypesAttr;

    export class ImmortalsModel {
        private static _instance: ImmortalsModel;
        public static get instance(): ImmortalsModel {
            return this._instance = this._instance || new ImmortalsModel();
        }

        private _dic1: Dictionary;  //升级列表数据
        private _dic2: Dictionary;  //幻化列表数据
        private _dic3: Dictionary;  //附魂列表数据
        private _proValue: Table<Array<TypesAttr>>;  //总属性
        private _otherValue: Table<number>;  //其他数据
        private _idArr: number[];
        public _huanhuaActId: number;  //记录激活的幻化ID

        // 幻武
        private _immortalsInfo: UpdateShenbingInfo;

        private _feedSkills: Array<SkillInfo>;

        public _inactiveIetm: Array<number>;//未被激活的外观id 数组
        constructor() {
            this._dic1 = new Dictionary();
            this._dic2 = new Dictionary();
            this._dic3 = new Dictionary();
            this._otherValue = {};
            this._proValue = {};
            this._huanhuaActId = -1;
            this._inactiveIetm = new Array<number>();
        }

        //feedLevel = 0,			/*培养等级*/
        //feedSkillList = 1,			/*技能列表*/
        //feedFighting = 2,			/*战力*/
        //curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
        //showList = 4,			/*幻化列表*/
        //magicShowFighting = 5,			/*战力*/
        //magicShowAttr = 6,			/*幻化总属性*/
        //refineList = 7,			/*修炼列表*/
        //refineFighting = 8,			/*战力*/
        //refineAttr = 9,			/*修炼总属性*/

        public saveData(tuple: GetShenbingInfoReply): void {
            this._feedSkills = tuple[GetShenbingInfoReplyFields.feedSkillList];

            this._otherValue["升级战力"] = tuple[GetShenbingInfoReplyFields.feedFighting];
            this._otherValue["幻化战力"] = tuple[GetShenbingInfoReplyFields.magicShowFighting];
            this._otherValue["附魔战力"] = tuple[GetShenbingInfoReplyFields.refineFighting];
            this._otherValue["升级等级"] = tuple[GetShenbingInfoReplyFields.feedLevel];
            this._otherValue["幻化id"] = tuple[GetShenbingInfoReplyFields.curShowId];

            this._proValue["幻化总属性"] = tuple[GetShenbingInfoReplyFields.magicShowAttr];
            this._proValue["附魔总属性"] = tuple[GetShenbingInfoReplyFields.refineAttr];

            this._dic1.clear();
            this._dic2.clear();
            this._dic3.clear();
            this._idArr = [];

            let _arr1: Array<SkillInfo> = tuple[GetShenbingInfoReplyFields.feedSkillList];
            let _arr2: Array<MagicShowInfo> = tuple[GetShenbingInfoReplyFields.showList];
            let _arr3: Array<RefineInfo> = tuple[GetShenbingInfoReplyFields.refineList];

            for (let i: int = 0, len: int = _arr1.length; i < len; i++) {
                this._dic1.set(_arr1[i][SkillInfoFields.skillId], _arr1[i]);
                this._idArr.push(_arr1[i][SkillInfoFields.skillId]);
            }
            this._idArr = this._idArr.sort(CommonUtil.smallToBigSort.bind(this));

            for (let i: int = 0, len: int = _arr2.length; i < len; i++) {
                this._dic2.set(_arr2[i][MagicShowInfoFields.showId], _arr2[i]);
            }

            for (let i: int = 0, len: int = _arr3.length; i < len; i++) {
                this._dic3.set(_arr3[i][RefineInfoFields.type], _arr3[i]);
            }
            this.setHuanhuaId(tuple[GetShenbingInfoReplyFields.curShowId]);
            GlobalData.dispatcher.event(CommonEventType.SBHUANHUA_UPDATA);
            GlobalData.dispatcher.event(CommonEventType.SHENBING_UPDATE);

            this.shengjiRedPoint();
            this.huanhuaRedPoint();
            this.fuhunRedPoint();
        }

        public get feedSkills(): Array<SkillInfo> {
            return this._feedSkills;
        }

        //..检测附魂红点
        public fuhunRedPoint(): void {

            for (let i: int = 0, len: int = 4; i < len; i++) {
                let refine: RefineInfo = ImmortalsModel.instance.getFuhunListByType(i);
                let cfg: shenbing_refine, nextCfg: shenbing_refine;
                if (!refine) {
                    cfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(i, 0);
                    nextCfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(i, 1);
                } else {
                    cfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(i, refine[RefineInfoFields.level]);
                    nextCfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(i, refine[RefineInfoFields.level] + 1);
                }

                let itemId: int = cfg[shenbing_refineFields.items][0];
                let count: int = cfg[shenbing_refineFields.items][1];
                let b: boolean = false;

                if (nextCfg) {
                    b = (BagModel.instance.getItemCountById(itemId) >= count) && cfg[shenbing_refineFields.humanLevel] <= PlayerModel.instance.level;
                    if (b) {
                        RedPointCtrl.instance.setRPProperty("immortalsFuhunRP", b);
                        return;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("immortalsFuhunRP", false);
        }

        //..检测升级红点
        public shengjiRedPoint(): void {

            if (!this._otherValue["升级等级"]) return;
            let cfg = ImmortalsCfg.instance.getShengjiCfgByLv(this._otherValue["升级等级"]);
            let nextCfg = ImmortalsCfg.instance.getShengjiCfgByLv(this._otherValue["升级等级"] + 1);
            let hasItemNum: int = BagModel.instance.getItemCountById(cfg[shenbing_feedFields.items][0]);
            let needNum: int = cfg[shenbing_feedFields.items][1];

            for (let i: int = 0, len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[SkillInfoFields.point] > 0) {
                    RedPointCtrl.instance.setRPProperty("immortalsShengjiRP", true);
                    return;
                }
            }

            if (!nextCfg) {
                RedPointCtrl.instance.setRPProperty("immortalsShengjiRP", false);
                return;
            }

            if (hasItemNum >= needNum) {
                RedPointCtrl.instance.setRPProperty("immortalsShengjiRP", true);
                return;
            }
            RedPointCtrl.instance.setRPProperty("immortalsShengjiRP", false);
        }

        //..检测幻化列表红点
        public huanhuaRedPoint(): void {

            let idArr3: Array<shenbing_magicShow> = ImmortalsCfg.instance.getSkinCfgByType(3);
            let idArr4: Array<shenbing_magicShow> = ImmortalsCfg.instance.getSkinCfgByType(4);
            let idArr5: Array<shenbing_magicShow> = ImmortalsCfg.instance.getSkinCfgByType(5);
            let idArr6: Array<shenbing_magicShow> = ImmortalsCfg.instance.getSkinCfgByType(6);

            this.qualityType(3, idArr3);
            this.qualityType(4, idArr4);
            this.qualityType(5, idArr5);
            this.qualityType(6, idArr6);
        }

        private qualityType(type: number, arr: Array<shenbing_magicShow>): void {

            for (let i: int = 0, len: int = arr.length; i < len; i++) {

                let star = 0;
                let id = arr[i][shenbing_magicShowFields.showId];

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

            let cfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev);
            let nextCfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(id, starLev + 1);
            let count: int = cfg[shenbing_magicShowFields.items][1];
            let itemId: int = cfg[shenbing_magicShowFields.items][0];

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
            if (type == 3) {
                return "immortalsHuanhuaJipinRP";
            }else if (type == 4) {
                return "immortalsHuanhuaZhenpinRP";
            }else if (type == 5) {
                return "immortalsHuanhuaJuepinRP";
            }else{
                return "immortalsHuanhuaDianchangRP";
            }
        }

        public get otherValue(): Table<number> {
            return this._otherValue;
        }

        public setHuanhuaId(id: int): void {
            this._otherValue["幻化id"] = id;
            GlobalData.dispatcher.event(CommonEventType.SBCHANGE_HUANHUA);
        }

        public get skillList(): Dictionary {
            return this._dic1;
        }

        public get huanhuaList(): Dictionary {
            return this._dic2;
        }

        public getFuhunListByType(type: int): RefineInfo {
            return this._dic3.get(type);
        }

        public get keysArr(): number[] {
            return this._idArr;
        }

        public get attr(): Table<Array<TypesAttr>> {
            return this._proValue;
        }

        public popActivateAlert(): void {
            if (this._dic2.get(this._huanhuaActId)[MagicShowInfoFields.star] == 1) {
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 1]);
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItem(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.shenbingMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = ImmortalsCfg.instance.haveItem(id);
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
            let num = ImmortalsCfg.instance.getItemIdBayShowId(id);
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
            let num = ImmortalsCfg.instance.getpingZhiBayShowId(id);
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