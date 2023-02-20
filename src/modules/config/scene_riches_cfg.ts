namespace modules.config {
    import Items = Configuration.Items;
    import scene_riches = Configuration.scene_riches;
    import scene_richesFields = Configuration.scene_richesFields;
    import Dictionary = Laya.Dictionary;

    /** 才氣值獎勵*/
    export class SceneRichesCfg {
        private static _instance: SceneRichesCfg;
        public static get instance(): SceneRichesCfg {
            return this._instance = this._instance || new SceneRichesCfg();
        }

        private _lvDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            let cfgs: Array<scene_riches> = GlobalData.getConfig("scene_riches");
            for (let i: int = 0, len = cfgs.length; i < len; i++) {
                let cfg: scene_riches = cfgs[i];
                this._lvDic.set(cfg[scene_richesFields.level], cfg);
            }
        }

        /**
         * 获取才氣值獎勵配置表长度
         */
        public getlvDicLeng(): number {
            return this._lvDic.keys.length;
        }

        /**
         * 根据任务等级和奖励类型 获取奖励
         * @param levelv  人物等级
         * @param type  奖励类型：0仙灵奖励 1仙法奖励
         */
        public get_reward(levelv: int, type: int): Array<Items> {
            if (type == 0) {
                if (this._lvDic.get(levelv) != undefined) {
                    return this._lvDic.get(levelv)[scene_richesFields.xianlingreward];
                } else {
                    let key: int = this._lvDic.keys[this._lvDic.keys.length - 1];
                    return this._lvDic.get(key)[scene_richesFields.xianlingreward];
                }
            } else {
                if (this._lvDic.get(levelv) != undefined) {
                    return this._lvDic.get(levelv)[scene_richesFields.xianfareward];
                } else {
                    let key: int = this._lvDic.keys[this._lvDic.keys.length - 1];
                    return this._lvDic.get(key)[scene_richesFields.xianfareward];
                }

            }

        }
    }
}