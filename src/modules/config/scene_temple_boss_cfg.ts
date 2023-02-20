/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import Items = Configuration.Items;
    import Dictionary = Laya.Dictionary;
    export class ClasSsceneTempleBossCfg {
        private static _instance: ClasSsceneTempleBossCfg;
        public static get instance(): ClasSsceneTempleBossCfg {
            return this._instance = this._instance || new ClasSsceneTempleBossCfg();
        }

        private _tab: Table<Array<scene_temple_boss>>;
        private _cfgs: scene_temple_boss[];
        private _cengDictionary: Dictionary;//层
        constructor() {

            this.init();
        }

        private init(): void {
            this._tab = {};
            this._cengDictionary = new Dictionary();
            let arr: Array<scene_temple_boss> = GlobalData.getConfig("scene_temple_boss");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: scene_temple_boss = arr[i];
                if (cfg) {
                    let level: number = cfg[scene_temple_bossFields.level];
                    this._cengDictionary.set(level, level);
                    if (!this._tab[level]) {
                        this._tab[level] = [];
                    }
                    this._tab[level].push(cfg);
                }

            }
        }
        // 根据类型获取配置数组
        public getCfgsByGrade(level: number, grade: number): scene_temple_boss {
            let shuju = this._tab[level]
            return shuju[grade];
        }
        public getInfoByGrade(level: number): Array<scene_temple_boss> {
            return this._tab[level];
        }
        public getBossInfoByGrade(level: number): Array<scene_temple_boss> {
            let shuju: Array<scene_temple_boss> = this._tab[level];
            let dateInfo = new Array<scene_temple_boss>();
            if (shuju) {
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    if (element) {
                        let occ = element[scene_temple_bossFields.occ];
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
        public getXiaoGuaiInfoByGrade(level: number): Array<scene_temple_boss> {
            let shuju: Array<scene_temple_boss> = this._tab[level];
            let dateInfo = new Array<scene_temple_boss>();
            if (shuju) {
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    if (element) {
                        let occ = element[scene_temple_bossFields.occ];
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
        public get cfgs(): scene_temple_boss[] {
            return this._cfgs;
        }
        public getCengDictionaryKeys(): Array<number> {
            return this._cengDictionary.keys;
        }
    }
}
