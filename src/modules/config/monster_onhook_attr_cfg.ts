/** 天关怪物属性增强配置*/

namespace modules.config {
    import monster_onhook_attr = Configuration.monster_onhook_attr;
    import monster_onhook_attrFields = Configuration.monster_onhook_attrFields;
    export class MonsterOnhookAttrCfg {
        private static _instance: MonsterOnhookAttrCfg;
        public static get instance(): MonsterOnhookAttrCfg {
            return this._instance = this._instance || new MonsterOnhookAttrCfg();
        }

        private _table: Table<monster_onhook_attr>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<monster_onhook_attr> = GlobalData.getConfig("monster_onhook_attr");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][monster_onhook_attrFields.level]] = arr[i];
            }
        }

        // 根据天关等级获取怪物属性
        public getMonsterById(level: number): monster_onhook_attr {
            return this._table[level];
        }
    }
}