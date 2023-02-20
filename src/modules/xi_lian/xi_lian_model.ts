/** 锻造*/


namespace modules.xiLian {
    import XilianInfo = Protocols.XilianInfo;
    import Xilian = Protocols.Xilian;
    import XilianInfoFields = Protocols.XilianInfoFields;
    import XilianFields = Protocols.XilianFields;
    import TypeAttrFields = Protocols.TypeAttrFields;
    import XilianSlot = Protocols.XilianSlot;
    import XilianSlotFields = Protocols.XilianSlotFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class XiLianModel {
        private static _instance: XiLianModel;
        public static get instance(): XiLianModel {
            return this._instance = this._instance || new XiLianModel();
        }

        // 洗炼信息
        private _xiLianInfo: XilianInfo;
        // {部位-{编号-信息}}
        private _partTable: Table<Xilian>;

        constructor() {
            this._partTable = {};
        }

        // 洗炼信息
        public get xiLianInfo(): XilianInfo {
            return this._xiLianInfo;
        }

        public set xiLianInfo(value: XilianInfo) {
            this._xiLianInfo = value;
            let arr: Array<Xilian> = value[XilianInfoFields.xilians];
            if (!arr) return;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let info: Xilian = arr[i];
                let part: number = info[XilianFields.part];
                this._partTable[part] = info;
            }

            GlobalData.dispatcher.event(CommonEventType.XI_LIAN_INFO_UPDATE);

            this.checkRP();
        }

        // 更新洗炼
        public updateXiLian(info: XilianInfo): void {
            if (!this._xiLianInfo) return;
            this._xiLianInfo[XilianInfoFields.remianTimes] = info[XilianInfoFields.remianTimes];
            this._xiLianInfo[XilianInfoFields.xilianRiseLevel] = info[XilianInfoFields.xilianRiseLevel];
            this._xiLianInfo[XilianInfoFields.xilianRisePoint] = info[XilianInfoFields.xilianRisePoint];
            let arr: Array<Xilian> = this._xiLianInfo[XilianInfoFields.xilians];
            let partInfo: Xilian = info[XilianInfoFields.xilians][0];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (arr[i][XilianFields.part] === partInfo[XilianFields.part]) {
                    arr[i] = partInfo;
                }
            }
            this._partTable[partInfo[XilianFields.part]] = partInfo;
            GlobalData.dispatcher.event(CommonEventType.XI_LIAN_INFO_UPDATE);

            this.checkRP();
        }

        // 根据品质获取不小于该品质的属性总条数
        public getAttrCountByQuality(quality: number): number {
            let count: number = 0;
            if (this._xiLianInfo) {
                let arr: Array<Xilian> = this._xiLianInfo[XilianInfoFields.xilians];
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    let slots: Array<XilianSlot> = arr[i][XilianFields.slots];
                    for (let j: int = 0, len1: int = slots.length; j < len1; j++) {
                        if (slots[j][XilianSlotFields.attr][TypeAttrFields.color] >= quality) {
                            count++;
                        }
                    }
                }
            }
            return count;
        }

        // 根据部位获取部位洗炼信息
        public getInfoPyPart(part: int): Xilian {
            return this._partTable[part];
        }

        // 根据部位和编号获取对应的属性槽信息
        public getSlotInfoByPartAndSlot(part: int, slotNum: int): XilianSlot {
            let t: XilianSlot;
            let info: Xilian = this._partTable[part];
            if (part) {
                let slots: Array<XilianSlot> = info[XilianFields.slots];
                for (let i: int = 0, len: int = slots.length; i < len; i++) {
                    let slot: XilianSlot = slots[i];
                    if (slot[XilianSlotFields.num] === slotNum) {
                        t = slot;
                        break;
                    }
                }
            }
            return t;
        }

        // 根据部位获取对应的编号table
        // public getNumTableByPart(part:int):Table<Xilian>{
        //     return this._partTable[part];
        // }

        private checkRP(): void {
            RedPointCtrl.instance.setRPProperty("xiLianMaster", this._xiLianInfo[XilianInfoFields.xilianRisePoint]);
        }
    }
}