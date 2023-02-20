/** 宠物资源配置*/

namespace modules.config {
    import PetRes = Configuration.PetRes;
    import PetResFields = Configuration.PetResFields;

    export class PetResCfg {
        private static _instance: PetResCfg;
        public static get instance(): PetResCfg {
            return this._instance = this._instance || new PetResCfg();
        }

        private _table: Table<PetRes>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr = GlobalData.getConfig("pet_res");

            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];
                this._table[item[PetResFields.id]] = item;
            }

        }

        // 根据宠物ID获取配置
        public getCfgById(id: int): PetRes {
            return this._table[id];
        }
    }
}