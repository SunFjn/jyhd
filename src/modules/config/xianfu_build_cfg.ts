/////<reference path="../$.ts"/>
/** 仙府-家园建筑配置 */
namespace modules.config {
    import xianfu_build = Configuration.xianfu_build;
    import xianfu_buildFields = Configuration.xianfu_buildFields;

    export class XianfuBuildCfg {
        private static _instance: XianfuBuildCfg;
        public static get instance(): XianfuBuildCfg {
            return this._instance = this._instance || new XianfuBuildCfg();
        }

        private _tab: Table<Table<xianfu_build>>;
        private _tab2: Table<number>;
        private _tab3: Table<number[]>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._tab2 = {};
            this._tab3 = {};
            let arr: Array<xianfu_build> = GlobalData.getConfig("xianfu_build");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let ele: xianfu_build = arr[i];
                let buildId: number = ele[xianfu_buildFields.id];
                let lv: number = ele[xianfu_buildFields.level];
                if (!this._tab[buildId]) {
                    this._tab[buildId] = {};
                }
                this._tab[buildId][lv] = ele;
                this._tab2[buildId] = lv;

                //当前可以炼制的产物
                let products: Array<Array<number>> = ele[xianfu_buildFields.produce];
                if (!this._tab3[buildId]) {
                    this._tab3[buildId] = [];
                }
                for (let j: int = 0; j < products.length; j++) {
                    if (!this._tab3[buildId][j]) {
                        this._tab3[buildId][j] = arr[i][xianfu_buildFields.level];
                    }
                }
            }
        }

        public getCfgByIdAndLv(id: number, lv: number): xianfu_build {
            if(!this._tab[id]) return null;
            return this._tab[id][lv];
        }

        public getMaxLvById(id: number): number {
            return this._tab2[id];
        }

        //根据顺序获取炼制产物开启等级
        public getOpenLvByTypeAndIndex(buildId: number, index: number): number {
            return this._tab3[buildId][index];
        }
    }
}