/** 神器配置*/


namespace modules.config {
    import shenqi = Configuration.shenqi;
    import shenqiFields = Configuration.shenqiFields;
    import blendFields = Configuration.blendFields;

    export class ShenqiCfg {

        private static _instance: ShenqiCfg;
        public static get instance(): ShenqiCfg {
            return this._instance = this._instance || new ShenqiCfg();
        }

        private _arr: Array<shenqi>;        //神器配置
        private _count: number;              //配置表长度
        private _attrIndices: Array<int>;    //属性索引
        private _showIDTable:Table<shenqi>;  //根据外观ID索引

        public get arr(): Array<shenqi> {
            return this._arr;
        }

        public get count() {
            return this._count;
        }

        public get attrIndices(): Array<int> {
            return this._attrIndices;
        }

        constructor() {
            this.init();
        }

        private init(): void {
            this._arr = GlobalData.getConfig("shenqi");
            this._count = this._arr.length;

            this._attrIndices = BlendCfg.instance.getCfgById(22016)[blendFields.intParam];

            this._showIDTable={};
            for(let i = 0;i< this._arr.length;++i){
                this._showIDTable[this._arr[i][shenqiFields.showID]]=this._arr[i];
            }
        }

        public getCfgById(id: number): shenqi {
            return this._arr[id];
        }

        public getCfgByShowId(showID: number): shenqi {
            return this._showIDTable[showID];
        }
    }
}