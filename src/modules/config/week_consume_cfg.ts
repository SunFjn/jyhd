namespace modules.config {
    import week_consume = Configuration.week_consume;
    import week_consumeFields = Configuration.week_consumeFields;
    export class WeekConsumeCfg{

        private static _instance: WeekConsumeCfg;
        public static get instance(): WeekConsumeCfg {
            return this._instance = this._instance || new WeekConsumeCfg();
        }

        private _table:Table<week_consume>

        public constructor(){
            this.init();
        }

        private init():void{
            this._table = {};
            let arr:Array<week_consume>=GlobalData.getConfig("week_consume");
            for(let i = 0;i<arr.length;++i){
                this._table[arr[i][week_consumeFields.id]]=arr[i];
            }
        }

        public getCfgByID(id:number):week_consume{
            return this._table[id];
        }
    }
}