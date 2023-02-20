///<reference path="../common/common_event_type.ts"/>
///<reference path="../config/intensive_cfg.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/equipment_zhuhun_cfg.ts"/>
///<reference path="../config/equipment_shihun_cfg.ts"/>
namespace modules.equipment_zu_hun {

    import CommonEventType = modules.common.CommonEventType;
    import GetZhuhunInfoReply = Protocols.GetZhuhunInfoReply;
    import Dictionary = Laya.Dictionary;
    import GetZhuhunInfoReplyFields = Protocols.GetZhuhunInfoReplyFields;
    import UpdateZhuhunInfo = Protocols.UpdateZhuhunInfo;
    import UpdateZhuhunInfoFields = Protocols.UpdateZhuhunInfoFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    import ZhuhunGrids = Protocols.ZhuhunGrids;
    import ZhuhunGridsFields = Protocols.ZhuhunGridsFields;
    import ShihunGrids = Protocols.ShihunGrids;
    import ShihunGridsFields = Protocols.ShihunGridsFields;

    import EquipmentZhuHunCfg = modules.config.EquipmentZhuHunCfg;
    import zhuhunFields = Configuration.zhuhunFields;
    import EquipmentShiHunCfg = modules.config.EquipmentShiHunCfg;
    import shihunFields = Configuration.shihunFields;
    import Items = Configuration.Items;

    export class EquipmentZuHunModel {
        private _atkNum: number;
        private _zhuhunList: Array<ZhuhunGrids>;
        private _shihunList: Array<ShihunGrids>;
        public _materialItemID: Items;//当前选中的材料
        public _consumptionMaterialItem: Array<Items>;
        public _allPart: Array<int>;//当前已穿戴的装备部位
        public _currPart: number;
        public _isjinjie: boolean;

        constructor() {
            this._atkNum = 0;
            this._isjinjie = false;
            this._zhuhunList = new Array<ZhuhunGrids>();
            this._shihunList = new Array<ShihunGrids>();
            this._consumptionMaterialItem = EquipmentZhuHunCfg.instance.getItems();
            this._materialItemID = this._consumptionMaterialItem[0];
        }

        private static _instance: EquipmentZuHunModel;
        public static get instance(): EquipmentZuHunModel {
            return this._instance = this._instance || new EquipmentZuHunModel();
        }

        public getValue(tuple: GetZhuhunInfoReply) {
            this._atkNum = tuple[GetZhuhunInfoReplyFields.fighting];  //总战力
            let zhuhunList = tuple[GetZhuhunInfoReplyFields.zhuhunList];
            let shihunList = tuple[GetZhuhunInfoReplyFields.shihunList];
            for (let index = 0; index < zhuhunList.length; index++) {
                let element = zhuhunList[index];
                let part = element[ZhuhunGridsFields.part];
                this._zhuhunList[part] = element;
            }
            for (let index = 0; index < shihunList.length; index++) {
                let element = shihunList[index];
                let part = element[ZhuhunGridsFields.part];
                this._shihunList[part] = element;
            }
            this.setRp();
            GlobalData.dispatcher.event(CommonEventType.EQUIPMENT_ZUHUN_UPDATE);
        }

        public updateValue(tuple: UpdateZhuhunInfo) {
            this._atkNum = tuple[UpdateZhuhunInfoFields.fighting];  //总战力
            let zhuhunList = tuple[UpdateZhuhunInfoFields.zhuhunList];
            let shihunList = tuple[UpdateZhuhunInfoFields.shihunList];

            let jieNum = 0;
            let jieNum1 = 0;
            if (this._zhuhunList[EquipmentZuHunModel.instance._currPart]) {
                jieNum = this._zhuhunList[EquipmentZuHunModel.instance._currPart][ZhuhunGridsFields.level];
            }


            for (let index = 0; index < zhuhunList.length; index++) {
                let element = zhuhunList[index];
                let part = element[ZhuhunGridsFields.part];
                this._zhuhunList[part] = element;
            }
            for (let index = 0; index < shihunList.length; index++) {
                let element = shihunList[index];
                let part = element[ZhuhunGridsFields.part];
                this._shihunList[part] = element;
            }
            if (this._zhuhunList[EquipmentZuHunModel.instance._currPart]) {
                jieNum1 = this._zhuhunList[EquipmentZuHunModel.instance._currPart][ZhuhunGridsFields.level];
            }

            if (jieNum != jieNum1) {
                // GlobalData.dispatcher.event(CommonEventType.EQUIPMENT_ZUHUN_UP, [0]);
                this._isjinjie = true;
            }
            this.setRp();
            GlobalData.dispatcher.event(CommonEventType.EQUIPMENT_ZUHUN_UPDATE);
        }

        public get atkNum(): number {
            return this._atkNum;
        }

        public get zhuhunList(): Array<ZhuhunGrids> {
            return this._zhuhunList;
        }

        public get shihunList(): Array<ShihunGrids> {
            return this._shihunList;
        }

        private sortZhuhunList(A: ZhuhunGrids, B: ZhuhunGrids) {

        }

        /**
         * 获取当前背包里面 该类型的道具能提供的总经验
         */
        public getConsumptionExp(type: number): number {
            let num = BagModel.instance.getItemCountById(this._consumptionMaterialItem[type][0]);
            let exp = this._consumptionMaterialItem[type][1];
            let allExp = num * exp;
            return allExp;
        }

        /**
         * 获取当前背包里面 该类型的道具的数量
         */
        public getConsumptionNum(type: number): number {
            let num = BagModel.instance.getItemCountById(this._consumptionMaterialItem[type][0]);
            return num;
        }

        /**
         * 获取 当前选中的材料 背包里个数
         */
        public getmaterialItemNum(): number {
            let num = BagModel.instance.getItemCountById(this._materialItemID[0]);
            return num;
        }

        /**
         * 获取 当前选中的材料 提供的总经验
         */
        public getmaterialItemExp(): number {
            let num = BagModel.instance.getItemCountById(this._materialItemID[0]);
            let exp = this._materialItemID[1];
            let allExp = num * exp;
            return allExp;
        }

        public getWhetherToMeet(level: number, buwei: Array<number>): boolean {
            let gHArr = buwei;
            for (let index = 0; index < gHArr.length; index++) {
                let element = gHArr[index];
                let shuju = this._zhuhunList[element];
                if (!shuju) {
                    return false;
                } else {
                    if (shuju[ZhuhunGridsFields.level] < level) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * 获取当前装备 能否铸魂
         * @param Part
         */
        public getCanUpZhuHun(Part: number): boolean {
            let bolll = false;
            let exp1 = EquipmentZuHunModel.instance.getConsumptionExp(0);
            let exp2 = EquipmentZuHunModel.instance.getConsumptionExp(1);
            let exp3 = EquipmentZuHunModel.instance.getConsumptionExp(2);

            let num1 = EquipmentZuHunModel.instance.getConsumptionNum(0);
            let num2 = EquipmentZuHunModel.instance.getConsumptionNum(1);
            let num3 = EquipmentZuHunModel.instance.getConsumptionNum(2);
            if (num1 + num2 + num3 <= 0) {
                return bolll;
            }
            let getmaterialExp = exp1 + exp2 + exp3;
            let element = EquipmentZuHunModel.instance.zhuhunList[Part];
            if (element) {
                let level = element[ZhuhunGridsFields.level];
                let part = element[ZhuhunGridsFields.part];
                let exp = element[ZhuhunGridsFields.exp];
                let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
                level = level > maxValue ? maxValue : level;//判断最大等级防止越界
                let shuju = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
                let maxExp = shuju[zhuhunFields.exp];
                let needExp = maxExp - exp;

                if (getmaterialExp >= needExp && maxValue > level) {
                    bolll = true;
                }
            }

            return bolll;
        }

        /**
         * * 获取当前小类 是否能 噬魂
         */
        public getCanUpShiHun(sClassType: number): boolean {
            let bolll = false;
            let shuju = EquipmentZuHunModel.instance.shihunList[sClassType];
            let dates = null;
            if (!shuju) {
                shuju = [sClassType, 0];
            }
            let sClass = shuju[ShihunGridsFields.sClass];
            let level = shuju[ShihunGridsFields.level];

            let maxLv = EquipmentShiHunCfg.instance.getMaxLevelByPart(sClass);//最大等级
            let maxSihunLv = EquipmentShiHunCfg.instance.getMaxLevelByPart(sClass);//当前能达到的最大等级
            level = level > maxSihunLv ? maxSihunLv : level;//判断最大等级防止越界
            let equipmentShiDate = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level);
            let items = equipmentShiDate[shihunFields.items];
            let parts = equipmentShiDate[shihunFields.parts];
            let maxZhuhunLv = equipmentShiDate[shihunFields.maxZhuhunLv];
            let isOpen = EquipmentZuHunModel.instance.getWhetherToMeet(maxZhuhunLv, parts);
            if (isOpen) {
                if (level < maxLv) {
                    let num = BagModel.instance.getItemCountById(items[0]);
                    if (num > 0) {
                        bolll = isOpen;
                    }
                }
            }
            return bolll;
        }

        public setRp() {
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) {
                RedPointCtrl.instance.setRPProperty("equipmentZuHunRP", false);
                return;
            }
            for (let index = 1; index <= 10; index++) {
                let isHave = equipsDic.keys[index];
                if (isHave) {
                    if (this.getCanUpZhuHun(index)) {
                        RedPointCtrl.instance.setRPProperty("equipmentZuHunRP", true);
                        return;
                    }
                }
            }
            if (this.zhuhunList.length == 0) {
                RedPointCtrl.instance.setRPProperty("equipmentZuHunRP", false);
                return;
            }
            for (let index = 1; index <= 6; index++) {
                if (this.getCanUpShiHun(index)) {
                    RedPointCtrl.instance.setRPProperty("equipmentZuHunRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("equipmentZuHunRP", false);
        }
    }
}
