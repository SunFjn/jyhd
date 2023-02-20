namespace modules.config {


    import Dictionary = Laya.Dictionary;
    import gemRefine = Configuration.gemRefine;
    import gemRefineFields = Configuration.gemRefineFields;
    import gemRise = Configuration.gemRise;
    import gemRiseFields = Configuration.gemRiseFields;

    export class StoneCfg {

        private static _instance: StoneCfg;

        public static get instance(): StoneCfg {
            return this._instance = this._instance || new StoneCfg();
        }

        private _upStone: Dictionary;  //仙石大师的配置
        private _idCfg: Dictionary;    //根据ID取的配置
        private _stoneMaxLv: number;
        private _maxLv: number;


        constructor() {
            this.init();
        }

        private init(): void {

            this._upStone = new Dictionary();
            this._idCfg = new Dictionary();

            let _arr: Array<gemRefine> = GlobalData.getConfig("gem_refine");

            for (let i: number = 0; i < _arr.length; i++) {
                this._idCfg.set(_arr[i][gemRefineFields.id], _arr[i]);
                if (!_arr[i][gemRefineFields.next_id]) this._stoneMaxLv = _arr[i][gemRefineFields.level];
            }

            let _upStoneArr: Array<gemRise> = GlobalData.getConfig("gem_rise");

            this._maxLv = 0;
            this._maxLv = _upStoneArr[_upStoneArr.length - 1][gemRiseFields.level];
            for (let i: number = 0; i < _upStoneArr.length; i++) {
                this._upStone.set(_upStoneArr[i][gemRiseFields.level], _upStoneArr[i]);
            }
        }

        //根据 id 取配置
        public getCfgById(id: number): gemRefine {
            return this._idCfg.get(id);
        }

        //获取仙石最大等级
        public get stoneMaxLv(): number {
            return this._stoneMaxLv;
        }

        //根据等级取仙石大师配置
        public getUpStoneByLev(lev: number): gemRise {
            return this._upStone.get(lev);
        }

        //获取仙石大师最大等级
        public get maxLv(): number {
            return this._maxLv;
        }
    }
}