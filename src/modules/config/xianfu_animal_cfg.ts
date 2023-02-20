/////<reference path="../$.ts"/>
/** 仙府-家园的宠物配置 */
namespace modules.config {
    import xianfu_animal = Configuration.xianfu_animal;
    import xianfu_animalFields = Configuration.xianfu_animalFields;

    export class XianfuAnimalCfg {
        private static _instance: XianfuAnimalCfg;
        public static get instance(): XianfuAnimalCfg {
            return this._instance = this._instance || new XianfuAnimalCfg();
        }

        //根据灵兽id和等级存数据
        private _tab: Table<Table<xianfu_animal>>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._ids = [];
            let arr: Array<xianfu_animal> = GlobalData.getConfig("xianfu_animal");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][xianfu_animalFields.id];
                let tab: Table<xianfu_animal> = this._tab[id];
                if (!tab) {
                    tab = {};
                }
                tab[arr[i][xianfu_animalFields.level]] = arr[i];
                this._tab[id] = tab;
            }
            for (let key in this._tab) {
                let id: number = parseInt(key);
                this._ids.push(id);
            }
        }


        // 根据ID和等级获取配置
        public getCfgByIdAndLv(id: int, lv: int): xianfu_animal {
            return this._tab[id][lv];
        }

        //获取所有的id列表
        public get ids(): number[] {
            return this._ids;
        }

    }
}