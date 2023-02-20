///<reference path="../config/equip_suit_cfg.ts"/>

/** 装备套装 */
namespace modules.equipSuit {
    import EquipSuit = Protocols.EquipSuit;
    import EquipSuitFields = Protocols.EquipSuitFields;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import equip_suitFields = Configuration.equip_suitFields;
    import WindowInfoFields = ui.WindowInfoFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Item = Protocols.Item;
    import equip_suit = Configuration.equip_suit;
    import ItemFields = Protocols.ItemFields;

    export const enum LightState {
        can,
        cant,
        yet,
    }

    export class EquipSuitModel {
        private static _instance: EquipSuitModel;
        public static get instance(): EquipSuitModel {
            return this._instance = this._instance || new EquipSuitModel();
        }

        public ids: number[];  //已激活的套装id
        private _lightParts: EquipSuit[]; //未激活套装的点亮部位
        private _states: Table<boolean>;
        private _rps: Array<keyof ui.RedPointProperty>;

        public selectId: number;
        public selectPart: EquipCategory;
        public parts: EquipCategory[]; //装备部位  从左到右
        public lightIndexs: Array<Pair<number, number>>;

        constructor() {
            this.parts = [
                EquipCategory.weapon, EquipCategory.hats, EquipCategory.clothes, EquipCategory.hand,
                EquipCategory.shoes, EquipCategory.belt, EquipCategory.necklace, EquipCategory.bangle
            ];
            this._rps = [
                "equipSuitRP_0", "equipSuitRP_1", "equipSuitRP_2", "equipSuitRP_3", "equipSuitRP_4",
                "equipSuitRP_5", "equipSuitRP_6", "equipSuitRP_7", "equipSuitRP_8", "equipSuitRP_9",
                "equipSuitRP_10", "equipSuitRP_11", "equipSuitRP_12", "equipSuitRP_13", "equipSuitRP_14"
            ];
            this.lightIndexs = [];
        }

        public set lightParts(list: EquipSuit[]) {
            this._lightParts = list;
            this.minOpenFuncId();
        }

        public get lightParts(): EquipSuit[] {
            return this._lightParts;
        }

        public minOpenFuncId(): void {
            this._states = {};
            let ids: number[] = EquipSuitCfg.instance.ids;
            if (!this.ids) return;
            this._states[ids[0]] = true;
            for (let i: int = 1, len: int = ids.length; i < len; i++) {
                let id: number = ids[i];
                let requestId: number = EquipSuitCfg.instance.getCfgById(id)[equip_suitFields.condition];
                this._states[id] = !(this.ids.indexOf(requestId) == -1);
                let tId: number = id / 10 >> 0;
                let sIds: number[] = EquipSuitCfg.instance.getIdsBybClass(tId);
                let sIndex: number = sIds.indexOf(id);
                let tIndex: number = EquipSuitCfg.instance.bClassIds.indexOf(tId);
                let panelId: number = EquipSuitUtil.panels[tIndex];
                let funcId: number = modules.core.WindowConfig.instance.getWindowConfigById(panelId)[WindowInfoFields.funcId];
                if (!this._states[id] && !sIndex) { //功能没开且属于第一个  那就是功能大页签
                    FuncOpenModel.instance.setActionOpen(funcId, ActionOpenState.show);
                } else if (this._states[id] && !sIndex) {
                    FuncOpenModel.instance.setActionOpen(funcId, ActionOpenState.open);
                }
            }
        }

        private getIsMeet(id: number, part: number): boolean {
            if (!this._lightParts || !this._lightParts.length) return false;
            for (let ele of this._lightParts) {
                let tempId: number = ele[EquipSuitFields.id];
                if (tempId == id) {
                    let parts: number[] = ele[EquipSuitFields.light];
                    for (let t of parts) {
                        if (t == part) {
                            return true;
                        }
                    }
                }
            }
        }

        public getState(id: number): boolean {
            return this._states[id];
        }

        public lightPartsById(id: number): number[] {
            for (let e of this._lightParts) {
                let thisId: number = e[EquipSuitFields.id];
                if (id == thisId) return e[EquipSuitFields.light];
            }
            return null;
        }

        public checkRP(): void {
            let flag: boolean[] = [];
            this.lightIndexs.length = 0;
            if (!this.ids) return;
            let ids: int[] = [];
            if (!this.ids.length) {
                ids = [EquipSuitCfg.instance.ids[0]];
            } else {
                for (let id of this.ids) {
                    let tIds: int[] = EquipSuitCfg.instance.getActiveIdsByYetId(id);
                    ids.push(...tIds);
                }
            }
            for (let id of ids) {
                let index: number = this.ids.indexOf(id);
                if (index == -1) {//未激活  是否有能点亮的
                    for (let i: int = 0, len: int = this.parts.length; i < len; i++) {
                        let part: EquipCategory = this.parts[i];
                        let myEquip: Item = PlayerModel.instance.getEquipByPart(part);
                        if (!myEquip) continue;
                        let isMeet: boolean = this.getIsMeet(id, part);
                        let isCanMeetLight: boolean = this.compareResult(myEquip[ItemFields.ItemId], id);
                        if (isCanMeetLight && !isMeet) {  //可以点亮  并且没点亮
                            let indexs: Pair<number, number> = this.getIndexsById(id);
                            let tIndex: int = indexs.first;
                            flag[tIndex] = true;
                            this.lightIndexs.push(indexs);
                            break;
                        }
                    }
                }
            }
            this._rps.forEach((ele, index) => {
                if (flag[index]) {
                    redPoint.RedPointCtrl.instance.setRPProperty(ele, true);
                } else {
                    redPoint.RedPointCtrl.instance.setRPProperty(ele, false);
                }
            });
        }

        public getIndexsById(id: int): Pair<number, number> {
            if (EquipSuitCfg.instance.ids.indexOf(id) === -1 || id == null) {
                throw new Error(`套装id为${id},配置不存在!`);
            }
            let tId: number = id / 10 >> 0;
            let tIndex: number = EquipSuitCfg.instance.bClassIds.indexOf(tId);
            let sIds: number[] = EquipSuitCfg.instance.getIdsBybClass(tId);
            let sIndex: number = sIds.indexOf(id);
            return {
                first: tIndex, second: sIndex
            };
        }

        public compareResult(myEquipId: ItemId, suitId: number): boolean {
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(suitId);
            let condition: number[] = cfg[equip_suitFields.light];
            /*点亮条件 阶数#品质#星级*/
            let stage: number = condition[0];
            let myStage: number = CommonUtil.getStageById(myEquipId);
            if (myStage < stage) return false;
            let quality: number = condition[1];
            let myQuality: number = CommonUtil.getItemQualityById(myEquipId);
            if (myQuality < quality) return false;
            let star: number = condition[2] - 1;
            let myStar: number = CommonUtil.getStarById(myEquipId);
            if (myStar < star) return false;
            return true;
        }

        /**筛选出要开启的面板 返回值为大小类id索引 */
        public get panelIndex(): Pair<number, number> {
            if (!this.ids) return;
            let ids: number[] = EquipSuitCfg.instance.ids;
            let index: number = 0;
            tag: for (let i: int = 0, len: int = ids.length; i < len; i++) {
                let id: number = ids[i];
                if (this.ids.indexOf(id) == -1) { //此套装未激活
                    index = i;
                    break;
                }
                for (let e of this._lightParts) {
                    let thisId: number = e[EquipSuitFields.id];
                    if (thisId == id) {
                        index = i;
                        break tag;
                    }
                }
            }
            let id: int = ids[index];
            return this.getIndexsById(id);
        }

        public getLightCountById(id: number): number {
            let index: number = EquipSuitModel.instance.ids.indexOf(id);
            if (index == -1) {
                let list: EquipSuit[] = EquipSuitModel.instance.lightParts;
                if (!list || !list.length) return 0;
                for (let e of list) {
                    let tempId: number = e[EquipSuitFields.id];
                    if (id == tempId) {
                        let arr: number[] = e[EquipSuitFields.light];
                        return arr.length;
                    }
                }
            } else {
                return 8;
            }
            return 0;
        }
    }
}
