namespace modules.marry {
    import Items = Configuration.Items;
    import attr = Configuration.attr;
    import marry_doll = Configuration.marry_doll;
    import marry_dollFields = Configuration.marry_dollFields;
    import marry_doll_grade = Configuration.marry_doll_grade;
    import marry_doll_gradeFields = Configuration.marry_doll_gradeFields;
    import marry_doll_skill = Configuration.marry_doll_skill;
    import marry_doll_skillFields = Configuration.marry_doll_skillFields;
    import marry_doll_refine = Configuration.marry_doll_refine;
    import marry_doll_refineFields = Configuration.marry_doll_refineFields;


    export class MarryDollCfg {
        private static _instance: MarryDollCfg;
        public static get instance(): MarryDollCfg {
            return this._instance = this._instance || new MarryDollCfg();
        }

        // typeId = 0,			/*类型ID*/
        // level = 1,			/*等级*/
        // exp = 2,			/*经验*/
        // items = 3,			/*消耗道具 [道具ID#道具数量]#[道具ID#道具数量]*/
        // fighting = 4,		/*战力*/
        // attrs = 5,			/*属性 [id#value]#[id#value]*/
        private map: Map<number, Array<marry_doll>>;
        private gradeMap: Map<number, Array<marry_doll_grade>>;

        //纯粹ID为key
        //存储属性 仙娃ID age order type
        // typeId = 0,			/*类型ID*/
        // skillId = 1,		/*技能ID*/
        // age = 2,			/*仙龄限制*/
        // order = 3,			/*阶数限制*/
        // type = 4,			/*类别*/
        private SkillMap: Map<number, Array<[number, number, number, number]>>;
        private EatMap: Map<number, Array<marry_doll_refine>>;
        constructor() {
            this.init();
        }

        private init(): void {
            let arr = GlobalData.getConfig("marry_doll");
            this.map = new Map<number, Array<marry_doll>>();
            for (let i: int = 0; i < arr.length; i++) {
                let cfg: marry_doll = arr[i];
                let typeId = cfg[marry_dollFields.typeId]
                let level = cfg[marry_dollFields.level]
                let fighting = cfg[marry_dollFields.fighting]
                let attrs = cfg[marry_dollFields.attrs]
                let _items = cfg[marry_dollFields.items]
                let exp = cfg[marry_dollFields.exp]
                let data = this.map.get(typeId) || Array<marry_doll>()
                data[level] = [typeId, level, exp, _items, fighting, attrs]
                this.map.set(typeId, data)
            }



            let grade = GlobalData.getConfig("marry_doll_grade");
            this.gradeMap = new Map<number, Array<marry_doll_grade>>();
            for (let i: int = 0; i < grade.length; i++) {
                let cfg: marry_doll_grade = grade[i];
                let typeId = cfg[marry_doll_gradeFields.typeId]
                let level = cfg[marry_doll_gradeFields.level]
                let fighting = cfg[marry_doll_gradeFields.fighting]
                let attrs = cfg[marry_doll_gradeFields.attrs]
                let item = cfg[marry_doll_gradeFields.items]
                let getWay = cfg[marry_doll_gradeFields.getWay]
                let data = this.gradeMap.get(typeId) || Array<marry_doll_grade>()
                data[level] = [typeId, level, item, attrs, fighting, getWay]
                this.gradeMap.set(typeId, data)
            }

            let skills = GlobalData.getConfig("marry_doll_skill");
            this.SkillMap = new Map<number, Array<[number, number, number, number]>>();
            for (let i: int = 0; i < skills.length; i++) {
                let cfg: marry_doll_skill = skills[i];
                let typeId = cfg[marry_doll_skillFields.typeId]
                let type = cfg[marry_doll_skillFields.type]
                let age = cfg[marry_doll_skillFields.age]
                let order = cfg[marry_doll_skillFields.order]
                let skillId = CommonUtil.getSkillPureIdById(cfg[marry_doll_skillFields.skillId])
                let skillLv = CommonUtil.getSkillLvById(cfg[marry_doll_skillFields.skillId])

                let data = this.SkillMap.get(skillId) || new Array<[number, number, number, number]>()
                this.SkillMap.set(skillId, data)
                data[skillLv] = [typeId, age, order, type]
            }


            let refine = GlobalData.getConfig("marry_doll_refine");
            this.EatMap = new Map<number, Array<marry_doll_refine>>();
            for (let i: int = 0; i < refine.length; i++) {
                let cfg: marry_doll_refine = refine[i];
                let typeId = cfg[marry_doll_refineFields.typeId]
                let level = cfg[marry_doll_refineFields.level]
                let fighting = cfg[marry_doll_refineFields.fighting]
                let attrs = cfg[marry_doll_refineFields.attrs]
                let item = cfg[marry_doll_refineFields.items]
                let doollLevel = cfg[marry_doll_refineFields.doollLevel]
                let data = this.EatMap.get(typeId) || Array<marry_doll_refine>()
                data[level] = cfg
                this.EatMap.set(typeId, data)
            }
        }


        //获取所有物品索引
        public getAllItems(): Array<number> {
            let arr: Array<number> = [];
            this.map.forEach((value, key) => {
                if (arr.indexOf(key) == -1)
                    arr.push(key);
            }
            )
            return arr;
        }


        //获取物品等级配置
        public getItemCfg(id: number, level: number) {
            if (!this.map.has(id)) return null;
            let item = this.map.get(id)
            return item[level] || null;

        }

        //获取物品等级配置
        public getGradeCfg(id: number, level: number) {
            if (!this.gradeMap.has(id)) return null;
            let item = this.gradeMap.get(id)
            return item[level] || null;
        }

        public getAllSkill(showId: number, type: number): Array<number> {

            let arr = new Array<number>();
            this.SkillMap.forEach((value, key) => {
                if (value.length > 0 && value[1][0] == showId && value[1][3] == type) {
                    arr.push(key);
                }
            })
            return arr;
        }
        public getSkillCfg(Skill: number) {
            if (!this.SkillMap.has(Skill)) return []
            return this.SkillMap.get(Skill)
        }

        public getEatCfg(type: number, level: number) {
            if (!this.EatMap.has(type)) return null;
            let index = ""
            let item = this.EatMap.get(type)
            for (const key in item) {
                if (item[key][marry_doll_refineFields.level] < level) {
                    index = key
                } else {
                    if (item[key][marry_doll_refineFields.level] == level) {
                        continue;
                    } else {
                        return item[key];
                    }
                }
            }
            return index != "" ? item[index] : null;
        }


        public getEatAll() {
            let arr = [];
            this.EatMap.forEach((v, k) => {
                if (arr.indexOf(k) == -1)
                    arr.push(k)
            })
            return arr;

        }


    }
}