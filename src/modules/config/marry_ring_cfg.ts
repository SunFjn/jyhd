namespace modules.marry {
    import Items = Configuration.Items;
    import attr = Configuration.attr;
    import marry_ring = Configuration.marry_ring;
    import marry_ringFields = Configuration.marry_ringFields;
    import marry_ring_skill = Configuration.marry_ring_skill;
    import marry_ring_skillFields = Configuration.marry_ring_skillFields;


    export class MarryRingCfg {
        private static _instance: MarryRingCfg;
        public static get instance(): MarryRingCfg {
            return this._instance = this._instance || new MarryRingCfg();
        }
        // level = 0,			/*等级*/
        // items = 1,			/*消耗道具 道具ID#道具数量*/
        // attrs = 2,			/*属性 [id#value]#[id#value]*/
        // fighting = 3,			/*战力*/
        // skill = 4,			/*技能 [技能id#等级#战力]#[技能id#等级#战力]*/
        private map: Map<number, marry_ring>
        private skill: Map<number, number>
        private skillLevel: Map<number, Array<Items>>
        constructor() {
            this.init();
        }

        private init(): void {

            let arr = GlobalData.getConfig("marry_ring");
            this.map = new Map<number, marry_ring>();
            this.skill = new Map<number, number>();
            // for (let i = 0; i < arr.length; ++i) {
            //     this._cfg[arr[i][marry_ringFields.level]] = arr[i];
            // }
            for (let i: int = 0; i < arr.length; i++) {
                let cfg: marry_ring = arr[i];
                let level = cfg[marry_ringFields.level]
                let fighting = cfg[marry_ringFields.fighting]
                let attrs = cfg[marry_ringFields.attrs]
                let skill = cfg[marry_ringFields.skill]
                let _items = cfg[marry_ringFields.items]
                let exp = cfg[marry_ringFields.exp]
                this.map.set(level, [level, exp, _items, attrs, fighting, skill])
                if (skill > 0)
                    this.skill.set(skill, level)
            }

            this.skillLevel = new Map<number, Array<Items>>();

            let skillLevel = GlobalData.getConfig("marry_ring_skill");
            for (let i: int = 0; i < skillLevel.length; i++) {
                let cfg: marry_ring_skill = skillLevel[i];
                let typeId = cfg[marry_ring_skillFields.typeId]
                let level = cfg[marry_ring_skillFields.level]
                let items = cfg[marry_ring_skillFields.items]
                let item = new Array<Items>()
                if (this.skillLevel.has(typeId)) item = this.skillLevel.get(typeId)
                item[level] = items
                this.skillLevel.set(typeId, item);
            }


        }
        //获取等级配置
        public getLevelCfg(level: number): marry_ring {
            return this.map.get(level);
        }
        public getAllSkill(): Array<number> {
            let arr = new Array<number>();
            this.skill.forEach((level, skillId) => {
                arr.push(skillId)
            });
            return arr;
        }
        //获取技能开启等级
        public getSkillOpen(skill: number) {
            return this.skill.get(skill) || 1
        }
        //获取技能升级材料配置
        public getSkillCfg(skill: number, level: number): Items {
            if (!this.skillLevel.has(skill)) return [0, 0]
            return this.skillLevel.get(skill)[level] || [0, 0]
        }






    }
}