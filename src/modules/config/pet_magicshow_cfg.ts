/** 幻化配置*/


namespace modules.config {
    import petMagicShow = Configuration.petMagicShow;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import Dictionary = Laya.Dictionary;
    import blendFields = Configuration.blendFields;

    export class PetMagicShowCfg {
        private static _instance: PetMagicShowCfg;

        public static get instance(): PetMagicShowCfg {
            return this._instance = this._instance || new PetMagicShowCfg();
        }

        private _showDic: Dictionary;
        private _attrIndices: number[];
        private _skinCfg: Dictionary;  //皮肤数量
        constructor() {
            this.init();
        }

        private init(): void {

            this._showDic = new Dictionary();
            this._attrIndices = [];
            this._skinCfg = new Dictionary();
            let arr: Array<petMagicShow> = GlobalData.getConfig("pet_magicshow");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: petMagicShow = arr[i];
                this._skinCfg.set(cfg[petMagicShowFields.showId], cfg);
                let lvDic: Dictionary = this._showDic.get(cfg[petMagicShowFields.showId]);
                if (!lvDic) {
                    lvDic = new Dictionary();
                    this._showDic.set(cfg[petMagicShowFields.showId], lvDic);
                }
                lvDic.set(cfg[petMagicShowFields.star], cfg);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22006)[blendFields.intParam];
        }

        // 获取外观id数组
        public getShowIds(): Array<number> {
            return this._showDic.keys;
        }

        // 根据外观ID和等级获取配置
        public getCfgByIdAndLv(id: int, lv: int): petMagicShow {
            if (this._showDic.get(id) == null) {
                return null;
            }
            return this._showDic.get(id).get(lv);
        }

        // 根据外观ID获取字典
        public getCfgsById(id: int): Dictionary {
            return this._showDic.get(id);
        }

        //筛选出显示属性
        public get attrIndices(): int[] {
            return this._attrIndices;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[petMagicShowFields.items][0]) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * 通过 道具id  获取 外观id
         */
        public getItemIdBayShowId(id: number): number {
            for (let index = 0; index < this._skinCfg.keys.length; index++) {
                let element = this._skinCfg.keys[index]; //key 就是showid
                if (element) {
                    let element1 = this._skinCfg.get(element);
                    if (element1) {
                        if (id == element1[petMagicShowFields.items][0]) {
                            return element;
                        }
                    }
                }
            }
            return null;
        }
        public getpingZhiBayShowId(id: number): number {
            for (let index = 0; index < this._skinCfg.keys.length; index++) {
                let element = this._skinCfg.keys[index]; //key 就是showid
                if (element) {
                    let element1 = this._skinCfg.get(element);
                    if (element1) {
                        if (id == element1[petMagicShowFields.items][0]) {
                            return element1[3];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}