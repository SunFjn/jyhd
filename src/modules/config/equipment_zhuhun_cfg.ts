namespace modules.config {

    import zhuhun = Configuration.zhuhun;
    import zhuhunFields = Configuration.zhuhunFields;
    import Items = Configuration.Items;

    export class EquipmentZhuHunCfg {
        private static _instance: EquipmentZhuHunCfg;
        public static get instance(): EquipmentZhuHunCfg {
            return this._instance = this._instance || new EquipmentZhuHunCfg();
        }

        private _tab: Table<Array<zhuhun>>;
        private _Dates: Array<zhuhun>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._Dates = new Array<zhuhun>();
            this._Dates = GlobalData.getConfig("zhuhun");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                let part = element[zhuhunFields.part];
                let level = element[zhuhunFields.level];
                if (!this._tab[part]) {
                    this._tab[part] = new Array<zhuhun>();
                }
                this._tab[part][level] = element;
            }
        }

        /**
         * 通过部位 和等级 获取配置
         */
        public getDateByPartAndLevel(part: number, level: number): zhuhun {
            let dates = this._tab[part][level];
            return dates;
        }

        public getMaxLevelByPart(part: number): number {
            let dates = this._tab[part];
            let maxLevel = dates[dates.length - 1][zhuhunFields.level];
            return maxLevel;
        }

        /**
         * 获取消耗的材料
         */
        public getItems(): Array<Items> {
            let dates = this._Dates[0];
            let items = dates[zhuhunFields.items];
            return items;
        }
    }
}
