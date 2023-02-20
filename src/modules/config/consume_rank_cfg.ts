namespace modules.config {
    import consume_rank=Configuration.consume_rank;
    import consume_rankFields=Configuration.consume_rankFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import PairFields = Configuration.PairFields;
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    

    export class ConsumeRankCfg{
        private static _instance: ConsumeRankCfg;
        public static get instance(): ConsumeRankCfg {
            return this._instance = this._instance || new ConsumeRankCfg();
        }

        private _dataArr:Array<consume_rank>;
        private _day:number;
        private _index:number = 0;
        private _cdTime:number = 0;

        public get dataArr():Array<consume_rank>{
            return this._dataArr;
        }
        

        public get index():number{
            return this._index;
        }

        public setIndex(index:number):number{
            return this._index;
        }

        public get cdTime():number{
            return this._cdTime;
        }

        constructor(){
            this.init();
        }
        
        private init():void{
            this._dataArr = GlobalData.getConfig("consume_rank");
            this._day = modules.config.BlendCfg.instance.getCfgById(40005)[blendFields.intParam][0];
            this._cdTime = modules.config.BlendCfg.instance.getCfgById(40003)[blendFields.intParam][0];
        }

        public get day():number{
            return this._day;
        }
        
        public getCfgByRank(rank:number):consume_rank{//根据排名获取数据
            for(let i=0;i<this._dataArr.length;++i){
                if(rank + 1<=this._dataArr[i][consume_rankFields.scope][PairFields.second]){
                    return this._dataArr[i];
                }
            }
        }
    }
}