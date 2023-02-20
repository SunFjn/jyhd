/** 仙府-家园配置 */
namespace modules.config {
    import xianfu = Configuration.xianfu;
    import xianfuFields = Configuration.xianfuFields;

    export class XianfuCfg {
        private static _instance: XianfuCfg;
        public static get instance(): XianfuCfg {
            return this._instance = this._instance || new XianfuCfg();
        }

        private _tab: Table<Array<xianfu>>;
        private _tab1: Table<Table<xianfu>>;
        private _tab3: Table<xianfu>;
        private _tab5: Table<number>;
        private _tab6: Table<xianfu>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._tab1 = {};
            this._tab3 = {};
            this._tab5 = {};
            this._tab6 = {};
            let arr: Array<xianfu> = GlobalData.getConfig("xianfu");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let buildId = arr[i][xianfuFields.buildId];
                let buildLv = arr[i][xianfuFields.buildLevel];
                let tempArr: Array<xianfu> = this._tab[arr[i][xianfuFields.level]];
                if (!tempArr) {
                    tempArr = [];
                }
                tempArr.push(arr[i]);
                this._tab[arr[i][xianfuFields.level]] = tempArr;

                let tempTab: Table<xianfu> = this._tab1[buildId];
                if (!tempTab) {
                    tempTab = {};
                }
                tempTab[buildLv] = arr[i];
                this._tab1[buildId] = tempTab;

                this._tab3[buildId] = arr[i];

                if (arr[i][xianfuFields.animalId]) {
                    this._tab5[arr[i][xianfuFields.level]] = arr[i][xianfuFields.animalId];
                    this._tab6[arr[i][xianfuFields.animalId]] = arr[i];
                }
            }
        }

        // 根据仙府-家园等级获取配置
        public getCfgByLv(lv: int): Array<xianfu> {
            return this._tab[lv];
        }

        //根据建筑id和解锁等级获取配置
        public getCfgByBuildIdAndLv(id: number, lv: number): xianfu {
            return this._tab1[id][lv];
        }

        //获取每种建筑的顶级配置
        public getMaxLvCfgById(id: number): xianfu {
            return this._tab3[id];
        }

        //灵兽的开启等级
        public get PetOpenLv(): Table<number> {
            return this._tab5;
        }

        //根据灵兽ID获取配置
        public getCfgByPetId(petId: number): xianfu {
            return this._tab6[petId];
        }
    }
}