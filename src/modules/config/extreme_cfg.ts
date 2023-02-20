namespace modules.extreme {
    import zhizun_feed = Configuration.zhizun_feed;
    import attr = Configuration.attr;
    import zhizun_feedFields = Configuration.zhizun_feedFields;
    import SkillInfoFields = Protocols.SkillInfoFields
    export class ExtremeCfg {
        private static _instance: ExtremeCfg;
        public static get instance(): ExtremeCfg {
            return this._instance = this._instance || new ExtremeCfg();
        }
        private _cfgs: Array<zhizun_feed>;
        private _table: Map<number, Map<number, zhizun_feed>>;
        // private _skillIds: Map<number, number>
        // 顶层索引 type 次级索引 技能处理ID  数组 [需要ID,等级,战斗力]
        private _skillIds: Map<number, Map<number, Array<[number, number, number]>>>



        // id,[id,lv,[需要类别id,等级],战斗力]
        private _skillTable: Map<number, Map<number, Array<[number, number, number]>>>
        //想类别找到等级 类别 


        constructor() {
            this.init();
        }

        private init(): void {
            // id = 0,				/*培养ID*/
            // level = 1,			/*培养等级*/
            // items = 2,			/*消耗道具 道具ID#道具数量*/
            // skill = 3,			/*技能 技能id#等级#战力*/
            // fighting = 4,		/*战力*/
            // attrs = 5,			/*属性 [id#value]#[id#value]*/
            //----------------------升级
            this._table = new Map<number, Map<number, zhizun_feed>>();
            this._skillTable = new Map<number, Map<number, Array<[number, number, number]>>>()
            this._skillIds = new Map<number, Map<number, Array<[number, number, number]>>>()
            this._cfgs = GlobalData.getConfig("zhizhun_feed");
            for (let i: int = 0; i < this._cfgs.length; i++) {
                let cfg: zhizun_feed = this._cfgs[i];
                let type = cfg[zhizun_feedFields.id]
                let level = cfg[zhizun_feedFields.level]
                let item: Map<number, zhizun_feed> = this._table.get(type) || new Map<number, zhizun_feed>();
                let skillItem: Map<number, Array<[number, number, number]>> = this._skillTable.get(type) || new Map<number, Array<[number, number, number]>>();
                this._skillTable.set(type, skillItem)
                this._table.set(type, item)
                let skillInfo = skillItem.get(level) || Array<[number, number, number]>()
                let zhizunInfo = item.get(level) || [0, 0, new Array<number>(), new Array<[number, number, number]>(), 0, new Array<attr>()]

                item.set(level, zhizunInfo)
                zhizunInfo[zhizun_feedFields.id] = type
                zhizunInfo[zhizun_feedFields.level] = level
                zhizunInfo[zhizun_feedFields.items] = cfg[zhizun_feedFields.items]
                zhizunInfo[zhizun_feedFields.skill] = cfg[zhizun_feedFields.skill]
                if (cfg[zhizun_feedFields.skill] && cfg[zhizun_feedFields.skill].length > 0) {
                    cfg[zhizun_feedFields.skill].forEach((value: [number, number, number], key) => {
                        skillInfo.push(value)
                        let skillId = modules.common.CommonUtil.getSkillPureIdById(value[SkillInfoFields.skillId])
                        if (!this._skillIds.has(type)) this._skillIds.set(type, new Map<number, Array<[number, number, number]>>())
                        let item = this._skillIds.get(type).get(skillId) || new Array<[number, number, number]>();
                        this._skillIds.get(type).set(skillId, item)
                        item[value[SkillInfoFields.level]] = [type, level, value[SkillInfoFields.point]]
                    });
                }

                zhizunInfo[zhizun_feedFields.fighting] = cfg[zhizun_feedFields.fighting]
                zhizunInfo[zhizun_feedFields.attrs] = cfg[zhizun_feedFields.attrs]
            }
        }

        public getSkillUp(id: number, level: number, type: number) {
            let skillId = modules.common.CommonUtil.getSkillPureIdById(id)
            if (!this._skillIds.has(type)) return null
            if (!this._skillIds.get(type).has(skillId)) return null
            let info = this._skillIds.get(type).get(skillId)[level] || null
            return info
        }


        public getInfo(type: number, level: number) {
            if (!this._table.has(type)) return null;
            if (!this._table.get(type).has(level)) return null;
            return this._table.get(type).get(level)
        }

    }
}