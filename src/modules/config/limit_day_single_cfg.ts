namespace modules.config {
    import limit_day_single = Configuration.limit_daysingle;
    import limit_day_singleFields = Configuration.limit_daysingleFields;
    import Items = Configuration.Items

    export class LimitDaySingleCfg {
        private static _instance: LimitDaySingleCfg;
        public static get instance(): LimitDaySingleCfg {
            return this._instance = this._instance || new LimitDaySingleCfg();
        }
        private _tab: Table<Array<limit_day_single[]>>;
        private maxday: number[];
        private _isContinued: number[];
        constructor() {
            this.maxday = new Array();
            this._isContinued = new Array();
            
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<limit_day_single> = GlobalData.getConfig("limit_xunbao_day_single_pay"); 
            let type_arr = new Array();
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let type = arr[i][limit_day_singleFields.type];
                let serverDay:number = arr[i][limit_day_singleFields.day];
                let isContinued:number = arr[i][limit_day_singleFields.isContinued];

                if(!type_arr[type]){
                    type_arr[type] = true;
                }

                let serverArr:Array<any> =[]
                serverArr.push(serverDay)
                if(typeof this.maxday[type] =="undefined"){
                    this.maxday[type] = 0;
                }
                if(this.maxday[type] <serverDay){
                    this.maxday[type] = serverDay;
                }
                if(isContinued!=0){
                    this._isContinued[type] = serverDay;
                }


                let reward :Array<Items> =arr[i][limit_day_singleFields.reward]
                // reward = arr[i][5]
                if(typeof this._tab[type] =="undefined"){
                    this._tab[type] = []
                }
                
                
                if(!this._tab[type][serverDay]){
                    this._tab[type][serverDay] = new Array<limit_day_single>();
                }
                
                this._tab[type][serverDay].push(arr[i]);

            }

            for(let type in type_arr){
                if(typeof this._isContinued[type] =="undefined"|| this._isContinued[type]==0){
                    this._isContinued[type] = this.maxday[type];
                }
            }

        }

        // 根据天数获取配置数组
        public getCfgsByServerDay(bigtype:number,isContinued: number): limit_day_single[] {
            
            if (isContinued > this.maxday[bigtype]) {        
            }
            
            return this._tab[bigtype][isContinued];
        }

        // 获取整个配置表
        public getcfgs(bigtype:number): limit_day_single[][] {
            return this._tab[bigtype];
        }

        // 获取当天数据

    }
}