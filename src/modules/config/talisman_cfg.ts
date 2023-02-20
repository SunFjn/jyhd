/** 圣物配置*/


namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import amuletRefine = Configuration.amuletRefine;
    import amuletRefineFields = Configuration.amuletRefineFields;
    import amuletRise = Configuration.amuletRise;
    import amuletRiseFields = Configuration.amuletRiseFields;


    export class TalismanCfg {
        private static _instance: TalismanCfg;
        public static get instance(): TalismanCfg {
            return this._instance = this._instance || new TalismanCfg();
        }

        private _talismanCfgs: Array<any>;
        private _talismanLvCfgs: Array<any>;
        private _talismanIdCfgs: Array<any>;

        private _lvDic: Dictionary;//等级字典
        // private _idDic:Dictionary;//ID字典
        private _sqDic: Dictionary;//品质字典

        private _riseDic: Dictionary;


        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            this._sqDic = new Dictionary();
            this._riseDic = new Dictionary();

            this._talismanCfgs = new Array<any>();
            this._talismanLvCfgs = new Array<any>();
            this._talismanIdCfgs = new Array<any>();


            let refineCfgs: Array<any> = GlobalData.getConfig("amulet_refine");
            for (let i: number = 0, len = refineCfgs.length; i < len; i++) {
                let vfg = refineCfgs[i];
                let color = vfg[amuletRefineFields.color];
                let level = vfg[amuletRefineFields.level];
                this._talismanIdCfgs[i] = vfg[amuletRefineFields.id];
                // let indices = new Dictionary();
                // for (let j = 0; j < this._talismanIdCfgs[i].length; j++) {
                //     indices.set(j, this._talismanIdCfgs[i][j]);
                // }
                if (level == 0) {
                    if (this._talismanCfgs[color] == null) {
                        this._talismanCfgs[color] = [vfg];
                    } else {
                        this._talismanCfgs[color].push(vfg);
                    }
                }
                if (this._talismanLvCfgs[level] == null) {
                    this._talismanLvCfgs[level] = [vfg];
                } else {
                    this._talismanLvCfgs[level].push(vfg);
                }
            }

            for (let i = 0; i < this._talismanCfgs.length; i++) {
                this._sqDic.set(i, this._talismanCfgs[i]);
            }
            for (let i = 0; i < this._talismanLvCfgs.length; i++) {
                this._lvDic.set(i, this._talismanLvCfgs[i]);
            }

            let riseCfgs = GlobalData.getConfig("amulet_rise");
            for (let i: number = 0, len = riseCfgs.length; i < len; i++) {
                let vfg = riseCfgs[i];
                this._riseDic.set(vfg[amuletRiseFields.level], vfg);

            }
        }

        //根据修为等级获取修为配置
        public getRiseCfgByLevel(lv: int): amuletRise {
            return this._riseDic.get(lv)
        }

        // 根据ID跟等级获取圣物升级配置
        public getCfgByQuality(lv: int): Array<amuletRefine> {
            return this._sqDic.get(lv);
        }

        //根据ID等级获取圣物升级配置
        public getCfgByIdLevel(id: int, level: int): amuletRefine {
            let idLevelCfg: amuletRefine;
            let cfgs = this._lvDic.get(level);
            if (cfgs != null) {
                for (let i = 0; i < cfgs.length; i++) {
                    let cfg = cfgs[i];
                    if (cfg[amuletRefineFields.id] == id) {
                        idLevelCfg = cfg;
                    }
                }
            }
            return idLevelCfg ? idLevelCfg : null;
        }
    }
}