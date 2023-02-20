namespace modules.config {
    import wing_feed = Configuration.wing_feed;
    import wing_feedFields = Configuration.wing_feedFields;
    import Dictionary = Laya.Dictionary;
    import wing_magicShow = Configuration.wing_magicShow;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import wing_refine = Configuration.wing_refine;
    import wing_refineFields = Configuration.wing_refineFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import blendFields = Configuration.blendFields;

    export class WingCfg {
        private static _instance: WingCfg;
        public static get instance(): WingCfg {
            return this._instance = this._instance || new WingCfg();
        }

        private _dic1: Dictionary;
        private _table: Table<wing_feed>;
        private _skillTable: Table<Table<wing_feed>>;
        private _cfgs: Array<wing_feed>;
        // 纯技能ID数组（技能ID会随着等级改变而变化，这里只计纯粹的ID，不计等级）
        private _skillIds: Array<int>;
        private _showDic: Dictionary;

        private _typeTable: Table<Table<wing_refine>>;
        private _typeLvArrTable: Table<Array<wing_refine>>;
        private _cfgs1: Array<wing_refine>;

        private _skinCfg: Dictionary;  //皮肤数量

        private _huanhuaAttrIndices: int[];
        private _fuhunAttrIndices: int[];

        constructor() {
            this.init();
        }

        private init(): void {

            //----------------------升级
            this._table = {};
            this._skillTable = {};
            this._skillIds = new Array<int>();
            this._dic1 = new Dictionary();
            this._cfgs = GlobalData.getConfig("wing_feed");

            for (let i: int = 0; i < this._cfgs.length; i++) {
                this._dic1.set(this._cfgs[i][wing_feedFields.level], this._cfgs[i]);
                let cfg: wing_feed = this._cfgs[i];
                this._table[cfg[wing_feedFields.level]] = cfg;
                if (cfg[wing_feedFields.skill] && cfg[wing_feedFields.skill].length > 0) {
                    let skillId: number = modules.common.CommonUtil.getSkillPureIdById(cfg[wing_feedFields.skill][0]);
                    let table: Table<wing_feed> = this._skillTable[skillId];
                    if (!table) {
                        table = {};
                        this._skillIds.push(skillId);
                    }
                    table[cfg[wing_feedFields.skill][1]] = cfg;
                    this._skillTable[skillId] = table;
                }
            }

            //----------------------幻化
            this._showDic = new Dictionary();
            this._skinCfg = new Dictionary();

            let arr: Array<wing_magicShow> = GlobalData.getConfig("wing_magicshow");

            this._huanhuaAttrIndices = [];

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: wing_magicShow = arr[i];
                let lvDic: Dictionary = this._showDic.get(cfg[wing_magicShowFields.showId]);
                if (!lvDic) {
                    lvDic = new Dictionary();
                    this._showDic.set(cfg[wing_magicShowFields.showId], lvDic);
                }
                lvDic.set(cfg[wing_magicShowFields.level], cfg);
                this._skinCfg.set(arr[i][wing_magicShowFields.showId], arr[i]);
            }

            this._huanhuaAttrIndices = BlendCfg.instance.getCfgById(22003)[blendFields.intParam];


            //----------------------历练
            this._typeTable = {};
            this._typeLvArrTable = {};
            this._cfgs1 = GlobalData.getConfig("wing_refine");

            this._fuhunAttrIndices = [];

            for (let i: int = 0, len: int = this._cfgs1.length; i < len; i++) {
                let cfg: wing_refine = this._cfgs1[i];
                let type: int = cfg[wing_refineFields.type];
                if (!this._typeTable[type]) {
                    this._typeTable[type] = {};
                }
                this._typeTable[type][cfg[wing_refineFields.level]] = cfg;
                if (!this._typeLvArrTable[type]) {
                    this._typeLvArrTable[type] = new Array<wing_refine>();
                }
                this._typeLvArrTable[type].push(cfg);
            }

            this._fuhunAttrIndices = BlendCfg.instance.getCfgById(22004)[blendFields.intParam];
        }

        public get shengjiCfgs(): Array<wing_feed> {
            return this._cfgs;
        }

        public get shengjiSkillIds(): Array<int> {
            return this._skillIds;
        }

        // 根据等级获取对应属性
        public getShengjiCfgByLv(level: number): wing_feed {
            let t: wing_feed = this._table[level];
            return t ? t : null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getShengjiLvTableBySkillId(skillId: int): Table<wing_feed> {
            return this._skillTable[skillId];
        }

        //寻找下一级可激活的技能
        public getShengjiSkillCfgByLev(lev: int): wing_feed {

            for (let i: int = lev, len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[wing_feedFields.skill].length != 0) {
                    let currLv: number = this._dic1.get(this._dic1.keys[i])[wing_feedFields.level];
                    if (currLv == lev) continue;
                    return this._dic1.get(this._dic1.keys[i]);
                }
            }
        }

        // 获取幻化外观id数组
        public getHuanhuaShowIds(): Array<int> {
            return this._showDic.keys;
        }

        // 根据幻化外观ID和等级获取配置
        public getHuanhuaCfgByIdAndLv(id: int, lv: int): wing_magicShow {
            if (this._showDic.get(id) == null) {
                return null;
            }
            return this._showDic.get(id).get(lv);
        }

        //根据类型获取皮肤配置数组 3~5
        public getSkinCfgByType(type: int): Array<wing_magicShow> {
            let _arr: Array<wing_magicShow> = new Array<wing_magicShow>();
            for (let i: int = 0, len: int = this._skinCfg.keys.length; i < len; i++) {
                if (this._skinCfg.get(this._skinCfg.keys[i])[wing_magicShowFields.quality] == type)
                    _arr.push(this._skinCfg.get(this._skinCfg.keys[i]));
            }
            return _arr;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[wing_magicShowFields.items][0]) {
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
                        if (id == element1[wing_magicShowFields.items][0]) {
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
                        if (id == element1[wing_magicShowFields.items][0]) {
                            return element1[wing_magicShowFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // 根据类型和等级获取历练配置
        public getFuhunCfgByTypeAndLev(type: int, lv: int): wing_refine {
            return this._typeTable[type][lv];
        }

        // 根据类型和等级获取等级上限
        public getMaxFuhunLvByTypeAndLev(type: int, lv: int): int {
            let cfg: wing_refine = this.getFuhunCfgByTypeAndLev(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[wing_refineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[wing_refineFields.level];
            }
            let arr: Array<wing_refine> = this._typeLvArrTable[type];
            let t: wing_refine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][wing_refineFields.humanLevel] !== cfg[wing_refineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[wing_refineFields.level];
        }

        //筛选出幻化属性
        public get huanhuaAttrIndices(): int[] {
            return this._huanhuaAttrIndices;
        }

        //筛选出历练属性
        public get fuhunAttrIndices(): int[] {
            return this._fuhunAttrIndices;
        }
    }
}