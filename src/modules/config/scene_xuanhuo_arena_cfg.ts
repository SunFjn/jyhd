/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import scene_xuanhuo_arena = Configuration.scene_xuanhuo_arena;
    import scene_xuanhuo_arenaFields = Configuration.scene_xuanhuo_arenaFields;
    import Items = Configuration.Items;
    import Dictionary = Laya.Dictionary;
    export class ClasSsceneXuanhuoBossCfg {
        private static _instance: ClasSsceneXuanhuoBossCfg;
        public static get instance(): ClasSsceneXuanhuoBossCfg {
            return this._instance = this._instance || new ClasSsceneXuanhuoBossCfg();
        }

        private _tab: Table<Array<scene_xuanhuo_arena>>;
        private _cfgs: scene_xuanhuo_arena[];
        private _cengDictionary: Dictionary;//层
        constructor() {

            this.init();
        }

        private init(): void {
            this._tab = {};
            this._cengDictionary = new Dictionary();
            let arr: Array<scene_xuanhuo_arena> = GlobalData.getConfig("scene_xuanhuo_arena");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: scene_xuanhuo_arena = arr[i];
                if (cfg) {
                    let level: number = cfg[scene_xuanhuo_arenaFields.level];
                    this._cengDictionary.set(level, level);
                    if (!this._tab[level]) {
                        this._tab[level] = [];
                    }
                    this._tab[level].push(cfg);
                }

            }
        }
        // 根据类型获取配置数组
        public getCfgsByGrade(level: number, grade: number): scene_xuanhuo_arena {
            let shuju = this._tab[level]
            return shuju[grade];
        }
        public getInfoByGrade(level: number): Array<scene_xuanhuo_arena> {
            return this._tab[level];
        }
        public getBossInfoByGrade(level: number): Array<scene_xuanhuo_arena> {
            let shuju: Array<scene_xuanhuo_arena> = this._tab[level];
            let dateInfo = new Array<scene_xuanhuo_arena>();
            if (shuju) {
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    if (element) {
                        let occ = element[scene_xuanhuo_arenaFields.occ];
                        let typeNum = occ.toString();
                        if (typeNum) {
                            if (typeNum[2] == '2') {
                                dateInfo.push(element);
                            }
                        }

                    }
                }
            }
            return dateInfo;
        }
        public getXiaoGuaiInfoByGrade(level: number): Array<scene_xuanhuo_arena> {
            let shuju: Array<scene_xuanhuo_arena> = this._tab[level];
            let dateInfo = new Array<scene_xuanhuo_arena>();
            if (shuju) {
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    if (element) {
                        let occ = element[scene_xuanhuo_arenaFields.occ];
                        let typeNum = occ.toString().substring(1, 2);
                        if (typeNum) {
                            if (typeNum[2] == '1') {
                                dateInfo.push(element);
                            }
                        }
                    }
                }
            }
            return dateInfo;
        }
        // 配置数组
        public get cfgs(): scene_xuanhuo_arena[] {
            return this._cfgs;
        }
        public getCengDictionaryKeys(): Array<number> {
            return this._cengDictionary.keys;
        }
    }
}
