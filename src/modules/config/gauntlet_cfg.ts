/** 辅助装备*/


namespace modules.config{
    import gauntlet = Configuration.gauntlet;
    import gauntletFields = Configuration.gauntletFields;

    export class GauntletCfg {
        private static _instance:GauntletCfg;
        public static get instance():GauntletCfg{
            return this._instance = this._instance || new GauntletCfg();
        }

        private _table:Table<gauntlet>;

        constructor(){
            this.init();
        }

        private init():void{
            this._table = {};
            let arr:Array<gauntlet> = GlobalData.getConfig("gauntlet");
            for(let i:int = 0, len:int = arr.length; i < len; i++){
                this._table[arr[i][gauntletFields.id]] = arr[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(id:number):gauntlet{
            return this._table[id];
        }
    }
}