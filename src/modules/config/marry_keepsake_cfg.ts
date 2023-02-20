namespace modules.marry {
    import Items = Configuration.Items;
    import attr = Configuration.attr;
    import marry_keepsake = Configuration.marry_keepsake;
    import marry_keepsakeFields = Configuration.marry_keepsakeFields;

    import marry_keepsake_grade = Configuration.marry_keepsake_grade;
    import marry_keepsake_gradeFields = Configuration.marry_keepsake_gradeFields;
    import marry_keepsake_skill = Configuration.marry_keepsake_skill;
    import marry_keepsake_skillFields = Configuration.marry_keepsake_skillFields;


    export class MarryKeepsakeCfg {
        private static _instance: MarryKeepsakeCfg;
        public static get instance(): MarryKeepsakeCfg {
            return this._instance = this._instance || new MarryKeepsakeCfg();
        }
        private _cfg: Table<marry_keepsake>;
        // typeId = 0,			/*类型ID*/
        // level = 1,			/*等级*/
        // items = 2,			/*消耗道具 道具ID#道具数量*/
        // attrs = 3,			/*属性 [id#value]#[id#value]*/
        // fighting = 4,		/*战力*/
        private map: Map<number, Array<[number, number, Array<Items>, Array<attr>, number]>>
        // typeId = 0,			/*类型ID*/
        // level = 1,			/*等级*/
        // items = 2,			/*消耗道具 道具ID#道具数量*/
        // attrs = 3,			/*属性 [id#value]#[id#value]*/
        // fighting = 4,		/*战力*/
        // skill = 5,			/*技能开启*/
        private gradeMap: Map<number, Array<[number, number, Items, Array<attr>, number, number, [number, number]]>>
        //索引 纯粹ID 参数 分类 开启等级
        private gradeSkill: Map<number, [number, number]>
        // 物品ID 
        private gradeMinds: Map<number, Array<[number, number]>>
        private skillLevel: Map<number, Array<Items>>
        constructor() {
            this.init();
        }

        private init(): void {
            this._cfg = {};
            let arr = GlobalData.getConfig("marry_keepsake");
            this.map = new Map<number, Array<[number, number, Array<Items>, Array<attr>, number]>>();
            for (let i: int = 0; i < arr.length; i++) {
                let cfg: marry_keepsake = arr[i];
                let typeId = cfg[marry_keepsakeFields.typeId]
                let level = cfg[marry_keepsakeFields.level]
                let fighting = cfg[marry_keepsakeFields.fighting]
                let attrs = cfg[marry_keepsakeFields.attrs]
                let _items = cfg[marry_keepsakeFields.items]
                let data = this.map.get(typeId) || Array<[number, number, Array<Items>, Array<attr>, number]>()
                data.push([typeId, level, _items, attrs, fighting])
                this.map.set(typeId, data)
            }

            let gradeArr = GlobalData.getConfig("marry_keepsake_grade");
            this.gradeMinds = new Map<number, Array<[number, number]>>();
            this.gradeMap = new Map<number, Array<[number, number, Items, Array<attr>, number, number, [number, number]]>>();
            this.gradeSkill = new Map<number, [number, number]>();
            for (let i: int = 0; i < gradeArr.length; i++) {
                let cfg: marry_keepsake_grade = gradeArr[i];
                let typeId = cfg[marry_keepsake_gradeFields.typeId]
                let level = cfg[marry_keepsake_gradeFields.level]
                let fighting = cfg[marry_keepsake_gradeFields.fighting]
                let attrs = cfg[marry_keepsake_gradeFields.attrs]
                let _items = cfg[marry_keepsake_gradeFields.items]
                let skill = cfg[marry_keepsake_gradeFields.skill]
                let sskill = cfg[marry_keepsake_gradeFields.sskill]

                let data = this.gradeMap.get(typeId) || Array<[number, number, Items, Array<attr>, number, number, [number, number]]>()
                data.push([typeId, level, _items, attrs, fighting, skill, sskill])
                this.gradeMap.set(typeId, data)
                if (skill > 0)
                    this.gradeSkill.set(skill, [typeId, level])
                if (sskill.length > 0) {
                    let minds = this.gradeMinds.get(typeId) || Array<[number, number]>()
                    minds[sskill[0]] = [sskill[1], level]
                    this.gradeMinds.set(typeId, minds)
                }

            }


            this.skillLevel = new Map<number, Array<Items>>();

            let skillLevel = GlobalData.getConfig("marry_keepsake_skill");
            for (let i: int = 0; i < skillLevel.length; i++) {
                let cfg: marry_keepsake_skill = skillLevel[i];
                let typeId = cfg[marry_keepsake_skillFields.typeId]
                let level = cfg[marry_keepsake_skillFields.level]
                let items = cfg[marry_keepsake_skillFields.items]
                let item = new Array<Items>()
                if (this.skillLevel.has(typeId)) item = this.skillLevel.get(typeId)
                item[level] = items
                this.skillLevel.set(typeId, item);
            }




        }

        //获取等级配置
        public getLevelCfg(level: number): marry_keepsake {
            return this._cfg[level];
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

        //获取gradeMap所有物品索引
        public getAllgrade(): Array<number> {
            let arr: Array<number> = [];
            this.gradeMap.forEach((value, key) => {
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

        //获取gradeMap物品等级配置
        public getGradeMapItemCfg(id: number, level: number) {
            if (!this.gradeMap.has(id)) return null;
            let item = this.gradeMap.get(id)
            return item[level] || null;
        }

        public getGradeSkill(showId: number): Array<number> {
            let arr = new Array<number>();
            this.gradeSkill.forEach((value, skillId) => {
                if (showId == value[0])
                    arr.push(skillId)
            });
            return arr;

        }

        //获取技能开启等级
        public getSkillOpen(skill: number) {
            return this.gradeSkill.get(skill) || null
        }

        //获取技能升级材料配置
        public getSkillCfg(skill: number, level: number): Items {
            if (!this.skillLevel.has(skill)) return null
            return this.skillLevel.get(skill)[level] || null
        }
        // 获取心有灵犀配置
        public getMinds(typeId: number, level: number) {
            return this.gradeMinds.get(typeId)[level] || null

        }

    }
}