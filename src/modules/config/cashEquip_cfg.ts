namespace modules.cashEquip {
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    export class CashEquipCfg {
        private static _instance: CashEquipCfg;
        public static get instance(): CashEquipCfg {
            return this._instance = this._instance || new CashEquipCfg();
        }

        private _maps: Map<number, cash_Equip>;
        constructor() {
            this.init();
        }

        public init(): void {
            this._maps = new Map<number, cash_Equip>()
            let arr: Array<cash_Equip> = GlobalData.getConfig("cash_equip");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let itemId = arr[i][cash_EquipFields.itemId]
                let open = Number(arr[i][cash_EquipFields.open])
                if (open != 1)
                    this._maps.set(Number(itemId), arr[i])
            }
        }
        public getCfgId(id: number) {
            return this._maps.get(id) || null
        }
        public getCfg(): Array<cash_Equip> {
            let arr: Array<cash_Equip> = Array<cash_Equip>();
            this._maps.forEach((value, key) => {
                arr.push(value)
            })
            return arr
        }


    }
}