namespace  modules.config{
    import one_buy = Configuration.one_buy;
    import one_buyFields = Configuration.one_buyFields;

    export class OneBuyCfg{
        private _tab:Table<one_buy>;
        private getTab: Array<one_buy>;
        private static _instance: OneBuyCfg;
        public static get instance(): OneBuyCfg {
            return this._instance = this._instance || new OneBuyCfg();
        }

        constructor() {
            this.init();
        }
        private init(): void {
            this._tab = {};
            let arr: Array<one_buy> = GlobalData.getConfig("one_buy");
            this.getTab = arr;
            for(let e of arr){
                let id:number = e[one_buyFields.id];
                this._tab[id]= e;
            }
        }
        public getArrDare(id:number):one_buy{
            return this._tab[id];
        }
        public getArrByLevel(level:number):Array<one_buy>{
            let arr :Array<one_buy> = [];
            //let arr: Array<one_buy> = GlobalData.getConfig("one_buy");

            for (let i = 0;i<this.getTab.length;i++){
                if(level>=this.getTab[i][one_buyFields.level][0]&&level<=this.getTab[i][one_buyFields.level][1]){
                    let a0 = this.getTab[i][one_buyFields.level][0];
                    let a1 = this.getTab[i][one_buyFields.level][1];
                    let a2 = this.getTab[i][i];
                    arr.push(this.getTab[i]);
                }
            }

            // console.log("this.arr = " + arr);
            return arr;
        }
    }
}