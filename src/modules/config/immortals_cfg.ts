namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import shenbing_feed = Configuration.shenbing_feed;
    import shenbing_refine = Configuration.shenbing_refine;
    import shenbing_magicShow = Configuration.shenbing_magicShow;
    import shenbing_feedFields = Configuration.shenbing_feedFields;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import shenbing_refineFields = Configuration.shenbing_refineFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import blendFields = Configuration.blendFields;

    export class ImmortalsCfg {
        private static _instance: ImmortalsCfg;
        public static get instance(): ImmortalsCfg {
            return this._instance = this._instance || new ImmortalsCfg();
        }

        private _dic1: Dictionary;
        private _table: Table<shenbing_feed>;
        private _skillTable: Table<Table<shenbing_feed>>;
        private _cfgs: Array<shenbing_feed>;
        // 纯技能ID数组（技能ID会随着等级改变而变化，这里只计纯粹的ID，不计等级）
        private _skillIds: Array<int>;

        private _dic2: Table<Table<shenbing_magicShow>>;  //幻化配置
        private _skinCfg: Dictionary;  //皮肤数量

        private _typeTable: Table<Table<shenbing_refine>>;
        private _typeLvArrTable: Table<Array<shenbing_refine>>;
        private _cfgs1: Array<shenbing_refine>;

        private _cfgs2: Array<shenbing_magicShow>;

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
            this._cfgs = GlobalData.getConfig("shenbing_feed");

            for (let i: int = 0; i < this._cfgs.length; i++) {
                this._dic1.set(this._cfgs[i][shenbing_feedFields.level], this._cfgs[i]);
                let cfg: shenbing_feed = this._cfgs[i];
                this._table[cfg[shenbing_feedFields.level]] = cfg;
                if (cfg[shenbing_feedFields.skill] && cfg[shenbing_feedFields.skill].length > 0) {
                    let skillId: number = modules.common.CommonUtil.getSkillPureIdById(cfg[shenbing_feedFields.skill][0]);
                    let table: Table<shenbing_feed> = this._skillTable[skillId];
                    if (!table) {
                        table = {};
                        this._skillIds.push(skillId);
                    }
                    table[cfg[shenbing_feedFields.skill][1]] = cfg;
                    this._skillTable[skillId] = table;
                }
            }

            this._dic2 = {};
            this._skinCfg = new Dictionary();
            this._cfgs2 = GlobalData.getConfig("shenbing_magicshow");
            this._huanhuaAttrIndices = [];

            for (let i: int = 0, len: int = this._cfgs2.length; i < len; i++) {
                if (!this._dic2[this._cfgs2[i][shenbing_magicShowFields.showId]])
                    this._dic2[this._cfgs2[i][shenbing_magicShowFields.showId]] = {};
                this._dic2[this._cfgs2[i][shenbing_magicShowFields.showId]][this._cfgs2[i][shenbing_magicShowFields.level]] = this._cfgs2[i];
                this._skinCfg.set(this._cfgs2[i][shenbing_magicShowFields.showId], this._cfgs2[i]);
            }


            this._huanhuaAttrIndices = BlendCfg.instance.getCfgById(22001)[blendFields.intParam];

            this._typeTable = {};
            this._typeLvArrTable = {};
            this._cfgs1 = GlobalData.getConfig("shenbing_refine");
            this._fuhunAttrIndices = [];

            for (let i: int = 0, len: int = this._cfgs1.length; i < len; i++) {
                let cfg: shenbing_refine = this._cfgs1[i];
                let type: int = cfg[shenbing_refineFields.type];
                if (!this._typeTable[type]) {
                    this._typeTable[type] = {};
                }
                this._typeTable[type][cfg[shenbing_refineFields.level]] = cfg;
                if (!this._typeLvArrTable[type]) {
                    this._typeLvArrTable[type] = new Array<shenbing_refine>();
                }
                this._typeLvArrTable[type].push(cfg);
            }

            this._fuhunAttrIndices = BlendCfg.instance.getCfgById(22002)[blendFields.intParam];

        }

        //根据类型获取皮肤配置数组 3~5
        public getSkinCfgByType(type: int): Array<shenbing_magicShow> {
            let _arr: Array<shenbing_magicShow> = new Array<shenbing_magicShow>();
            for (let i: int = 0, len: int = this._skinCfg.keys.length; i < len; i++) {
                if (this._skinCfg.get(this._skinCfg.keys[i])[shenbing_magicShowFields.quality] == type)
                    _arr.push(this._skinCfg.get(this._skinCfg.keys[i]));
            }
            return _arr;
        }

        //获取所有的皮肤ID 分为三个数组
        public getSkinsArr(): number[][] {
            let arr: number[][] = [];
            for (let j: int = 3; j < 6; j++) {
                let cfgArr: shenbing_magicShow[] = this.getSkinCfgByType(j);
                let ids: number[] = [];
                for (let i: int = 0, len: int = cfgArr.length; i < len; i++) {
                    ids.push(cfgArr[i][shenbing_magicShowFields.showId]);
                }
                arr.push(ids);
            }
            return arr;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[shenbing_magicShowFields.items][0]) {
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
                        if (id == element1[shenbing_magicShowFields.items][0]) {
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
                        if (id == element1[shenbing_magicShowFields.items][0]) {
                            return element1[shenbing_magicShowFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //根据ID和等级取幻化配置
        public getHuanhuaCfgByIdAndLev(id: int, lev: int): shenbing_magicShow {
            if (this._dic2[id] == null) {
                return null;
            }
            return this._dic2[id][lev];
        }

        //获取技能纯粹ID
        public get skillIds(): int[] {
            return this._skillIds;
        }

        public getShengjiLvTableBySkillId(skillId: int): Table<shenbing_feed> {
            return this._skillTable[skillId];
        }

        // 根据培养等级获取对应属性
        public getShengjiCfgByLv(level: number): shenbing_feed {
            let t: shenbing_feed = this._table[level];
            return t ? t : null;
        }

        //根据类型和等级获取附魂配置
        public getFuhunCfgByTypeAndLev(type: int, lev: int): shenbing_refine {
            return this._typeTable[type][lev];
        }

        // 根据类型和等级获取等级上限
        public getMaxFuhunLvByTypeAndLev(type: int, lev: int): int {
            let cfg: shenbing_refine = this.getFuhunCfgByTypeAndLev(type, lev);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[shenbing_refineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[shenbing_refineFields.level];
            }
            let arr: Array<shenbing_refine> = this._typeLvArrTable[type];
            let t: shenbing_refine;
            for (let i: int = lev + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][shenbing_refineFields.humanLevel] !== cfg[shenbing_refineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[shenbing_refineFields.level];
        }

        //寻找下一级可激活的技能
        public getShengjiSkillCfgByLev(lev: int): shenbing_feed {

            for (let i: int = lev, len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.skill].length != 0) {
                    let currlv: number = this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.level];
                    if (currlv == lev) continue;
                    return this._dic1.get(this._dic1.keys[i]);
                }
            }
        }

        //根据技能id获取激活等级
        public getActLevBySkillId(id: number): number {

            for (let i: int = 0, len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.skill][0] == id)
                    return this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.level];
            }
        }

        //根据技能id和等级获取升级等级
        public getUpLevBySkillIdAndSkillLev(id: int): number {

            for (let i: int = this.getActLevBySkillId(id), len: int = this._dic1.keys.length; i < len; i++) {
                if (this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.skill].length != 0 &&
                    this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.skill][0] - id == 1)
                    return this._dic1.get(this._dic1.keys[i])[shenbing_feedFields.level];
            }
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