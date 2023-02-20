namespace modules.config {
    import limit_pack=Configuration.limit_pack;
    import limit_packFields=Configuration.limit_packFields;

    export class LimitPackCfg{
        private static _instance:LimitPackCfg;
        public static get instance():LimitPackCfg{
            return this._instance=this._instance||new LimitPackCfg();
        }

        private _cfg:Table<limit_pack>;

        constructor(){
            this.init();
        }

        private init():void{
            this._cfg={};
            let arr: Array<limit_pack> = GlobalData.getConfig("limit_pack");
            for(let i=0;i<arr.length;++i){
                this._cfg[arr[i][limit_packFields.level]]=arr[i];
            }
        }

        public getCfgByLevel(level:number):limit_pack{
            return this._cfg[level];
        }
    }
}