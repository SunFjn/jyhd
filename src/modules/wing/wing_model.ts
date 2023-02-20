///<reference path="../exercise/exercise_model.ts"/>

namespace modules.wing {
    import GetWingInfoReply = Protocols.GetWingInfoReply;
    import GetWingInfoReplyFields = Protocols.GetWingInfoReplyFields;
    import Dictionary = Laya.Dictionary;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import RefineInfo = Protocols.RefineInfo;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import wing_refine = Configuration.wing_refine;
    import wing_refineFields = Configuration.wing_refineFields;
    import shenbing_refineFields = Configuration.shenbing_refineFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import wing_feedFields = Configuration.wing_feedFields;
    import wing_magicShow = Configuration.wing_magicShow;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import RedPointProperty = ui.RedPointProperty;
    import WingCfg = modules.config.WingCfg;
    import TypesAttr = Protocols.TypesAttr;

    export class WingModel {
        private static _instance: WingModel;
        public static get instance(): WingModel {
            return this._instance = this._instance || new WingModel();
        }

        private _dic1: Dictionary;  //升级列表数据
        private _dic2: Dictionary;  //幻化列表数据
        private _dic3: Dictionary;  //附魂列表数据
        private _proValue: Table<Array<TypesAttr>>;  //总属性
        private _otherValue: Table<number>;  //其他数据
        private _idArr: number[];
        public _huanhuaActId: number;  //记录激活的幻化ID

        private _feedSkills: Array<SkillInfo>;

        constructor() {
            this._dic1 = new Dictionary();
            this._dic2 = new Dictionary();
            this._dic3 = new Dictionary();
            this._otherValue = {};
            this._proValue = {};
            this._huanhuaActId = -1;
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

        public saveData(tuple: GetWingInfoReply): void {
            this._feedSkills = tuple[GetWingInfoReplyFields.feedSkillList];

            this._dic1.clear();
            this._dic2.clear();
            this._dic3.clear();
            this._idArr = [];

            this._otherValue["升级战力"] = tuple[GetWingInfoReplyFields.feedFighting];
            this._otherValue["幻化战力"] = tuple[GetWingInfoReplyFields.magicShowFighting];
            this._otherValue["附魔战力"] = tuple[GetWingInfoReplyFields.refineFighting];
            this._otherValue["升级等级"] = tuple[GetWingInfoReplyFields.feedLevel];
            this._otherValue["幻化id"] = tuple[GetWingInfoReplyFields.curShowId];

            this._proValue["幻化总属性"] = tuple[GetWingInfoReplyFields.magicShowAttr];
            this._proValue["附魔总属性"] = tuple[GetWingInfoReplyFields.refineAttr];

            let _arr1: Array<SkillInfo> = tuple[GetWingInfoReplyFields.feedSkillList];
            let _arr2: Array<MagicShowInfo> = tuple[GetWingInfoReplyFields.showList];
            let _arr3: Array<RefineInfo> = tuple[GetWingInfoReplyFields.refineList];

            for (let i: int = 0, len: int = _arr1.length; i < len; i++) {
                this._dic1.set(_arr1[i][SkillInfoFields.skillId], _arr1[i]);
                this._idArr.push(_arr1[i][SkillInfoFields.skillId]);
            }
            this._idArr = this._idArr.sort(modules.common.CommonUtil.smallToBigSort.bind(this));

            for (let i: int = 0, len: int = _arr2.length; i < len; i++) {
                this._dic2.set(_arr2[i][MagicShowInfoFields.showId], _arr2[i]);
            }

            for (let i: int = 0, len: int = _arr3.length; i < len; i++) {
                this._dic3.set(_arr3[i][RefineInfoFields.type], _arr3[i]);
            }
            this.setHuanhuaId(tuple[GetWingInfoReplyFields.curShowId]);
            GlobalData.dispatcher.event(CommonEventType.WING_UPDATE);
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
                let refine: RefineInfo = WingModel.instance.getFuhunListByType(i);
                let cfg: wing_refine, nextCfg: wing_refine;
                if (!refine) {
                    cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(i, 0);
                    nextCfg = WingCfg.instance.getFuhunCfgByTypeAndLev(i, 1);
                } else {
                    cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(i, refine[RefineInfoFields.level]);
                    nextCfg = WingCfg.instance.getFuhunCfgByTypeAndLev(i, refine[RefineInfoFields.level] + 1);
                }

                let itemId: int = cfg[wing_refineFields.items][0];
                let count: int = cfg[wing_refineFields.items][1];
                let b: boolean = false;

                if (nextCfg) {
                    b = (BagModel.instance.getItemCountById(itemId) >= count) && cfg[shenbing_refineFields.humanLevel] <= PlayerModel.instance.level;
                    if (b) {
                        RedPointCtrl.instance.setRPProperty("wingFuhunRP", b);
                        return;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("wingFuhunRP", false);
        }

        //..检测升级红点
        public shengjiRedPoint(): void {

            if (!this._otherValue["升级等级"]) return;
            let cfg = WingCfg.instance.getShengjiCfgByLv(this._otherValue["升级等级"]);
            if (!cfg) {
                return;
            }
            let nextCfg = WingCfg.instance.getShengjiCfgByLv(this._otherValue["升级等级"] + 1);
            let hasItemNum: int = BagModel.instance.getItemCountById(cfg[wing_feedFields.items][0]);
            let needNum: int = cfg[wing_feedFields.items][1];

            for (let i: int = 0, len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[SkillInfoFields.point] > 0) {
                    RedPointCtrl.instance.setRPProperty("wingShengjiRP", true);
                    return;
                }
            }

            if (!nextCfg) {
                RedPointCtrl.instance.setRPProperty("wingShengjiRP", false);
                return;
            }

            if (hasItemNum >= needNum) {
                RedPointCtrl.instance.setRPProperty("wingShengjiRP", true);
                return;
            }
            RedPointCtrl.instance.setRPProperty("wingShengjiRP", false);
        }

        //..检测幻化列表红点
        public huanhuaRedPoint(): void {

            let idArr3: Array<wing_magicShow> = WingCfg.instance.getSkinCfgByType(3);
            let idArr4: Array<wing_magicShow> = WingCfg.instance.getSkinCfgByType(4);
            let idArr5: Array<wing_magicShow> = WingCfg.instance.getSkinCfgByType(5);
            let idArr6: Array<wing_magicShow> = WingCfg.instance.getSkinCfgByType(6);

            this.qualityType(3, idArr3);
            this.qualityType(4, idArr4);
            this.qualityType(5, idArr5);
            this.qualityType(6, idArr6);
        }

        private qualityType(type: number, arr: Array<wing_magicShow>): void {

            for (let i: int = 0, len: int = arr.length; i < len; i++) {

                let star = 0;
                let id = arr[i][wing_magicShowFields.showId];

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

            let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(id, starLev);
            let nextCfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(id, starLev + 1);
            let count: int = cfg[wing_magicShowFields.items][1];
            let itemId: int = cfg[wing_magicShowFields.items][0];

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
                return "wingHuanhuaJipinRP";
            }else if (type == 4) {
                return "wingHuanhuaZhenpinRP";
            }else if (type == 5) {
                return "wingHuanhuaJuepinRP";
            }else{
                return "wingHuanhuaDianchangRP";
            }
        }

        public get otherValue(): Table<number> {
            return this._otherValue;
        }

        public setHuanhuaId(id: int): void {
            this._otherValue["幻化id"] = id;
            GlobalData.dispatcher.event(CommonEventType.XYCHANGE_HUANHUA);
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
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._huanhuaActId, 2]);
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        //通过该道具的 道具id  判定 该外观 是否 未激活
        public haveItem(id: number): boolean {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.wingMagicShow);
            if (!ifOpen) {
                return false;
            }
            let bollll = WingCfg.instance.haveItem(id);
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
            let num = WingCfg.instance.getItemIdBayShowId(id);
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
            let num = WingCfg.instance.getpingZhiBayShowId(id);
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