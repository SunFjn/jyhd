namespace modules.rename {
    import head = Configuration.head;
    import attr = Configuration.attr;
    import headFields = Configuration.headFields;
    export class HeadCfg {
        private static _instance: HeadCfg;
        public static get instance(): HeadCfg {
            return this._instance = this._instance || new HeadCfg();
        }

        private _cfgs: Map<number, Array<head>>;
        // 顶层索引 id 头像id 次级索引 阶级  数组 [需要ID,等级,战斗力]



        constructor() {
            this.init();
        }

        private init(): void {
            //----------------------升级
            this._cfgs = new Map<number, Array<head>>();
            let config: Array<head> = GlobalData.getConfig("head");
            for (let i: int = 0; i < config.length; i++) {
                let cfg: head = config[i];
                let id = cfg[headFields.id]
                let level = cfg[headFields.level]
                let item = this._cfgs.get(id) || new Array<head>()
                this._cfgs.set(id, item);
                item[level] = cfg;
            }
        }

        //获取等级配置
        public getLevelConfig(id: number, level: number) {
            if (!this._cfgs.has(id)) return null;
            return this._cfgs.get(id)[level] || null;

        }
        //获取所有头像id
        public getAllHeadId() {
            let arr = [];
            this._cfgs.forEach((value, key) => {
                arr.push(key)
            })
            return arr
        }



    }
}