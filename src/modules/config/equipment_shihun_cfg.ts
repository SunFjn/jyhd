namespace modules.config {

    import shihun = Configuration.shihun;
    import shihunFields = Configuration.shihunFields;

    export class EquipmentShiHunCfg {
        private static _instance: EquipmentShiHunCfg;
        public static get instance(): EquipmentShiHunCfg {
            return this._instance = this._instance || new EquipmentShiHunCfg();
        }

        private _tab1: Table<Array<shihun>>;
        private _tab2: Table<Array<number>>;
        private _tab3: Table<Array<number>>;
        private _Dates: Array<shihun>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._tab2 = {};
            this._tab3 = {};
            this._Dates = new Array<shihun>();
            this._Dates = GlobalData.getConfig("shihun");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                let tClass = element[shihunFields.tClass];
                let sClass = element[shihunFields.sClass];
                let level = element[shihunFields.level];

                let maxZhuhunLv = element[shihunFields.maxZhuhunLv];


                if (!this._tab1[sClass]) {
                    this._tab1[sClass] = new Array<shihun>();
                }
                this._tab1[sClass][level] = element;
            }

            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                let tClass = element[shihunFields.tClass];
                let sClass = element[shihunFields.sClass];
                let level = element[shihunFields.level];

                let maxZhuhunLv = element[shihunFields.maxZhuhunLv];

                if (!this._tab2[sClass]) {
                    this._tab2[sClass] = new Array<number>();
                }
                let levelUP = level + 1;
                let levelMax = this.getMaxLevelByPart(sClass);
                levelUP = levelUP > levelMax ? levelMax : levelUP;
                this._tab2[sClass][maxZhuhunLv] = levelUP;
            }


            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                let tClass = element[shihunFields.tClass];
                let sClass = element[shihunFields.sClass];
                let level = element[shihunFields.level];
                let maxZhuhunLv = element[shihunFields.maxZhuhunLv];
                let keyLevel = this._tab2[sClass][maxZhuhunLv];
                if (!this._tab3[sClass]) {
                    this._tab3[sClass] = new Array<number>();
                }
                this._tab3[sClass][level] = keyLevel;
            }

        }

        /**
         * 通过 大类 小类 和等级 获取配置
         */
        public getDateByPartAndLevel(sClass: number, level: number): shihun {
            let dates = this._tab1[sClass][level];
            return dates;
        }

        /**
         * 获取该类型的 开启等级
         * @param sClass
         */
        public getOpenLvByPartAndLevel(sClass: number): number {
            let dates = this._tab1[sClass][0];
            return dates[shihunFields.maxZhuhunLv];
        }

        public getMaxLevelByPartAndLevel(sClass: number, level: number): number {
            let dates = this._tab3[sClass][level];
            return dates;
        }

        public getMaxLevelByPart(sClass: number): number {
            let dates = this._tab1[sClass];
            let maxLevel = dates[dates.length - 1][shihunFields.level];
            return maxLevel;
        }
    }
}
