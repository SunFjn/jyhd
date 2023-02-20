namespace modules.config {

    import xiangyao = Configuration.xiangyao;
    import xiangyaoFields = Configuration.xiangyaoFields;

    export class DailyDemonCfg {
        private static _instance: DailyDemonCfg;
        public static get instance(): DailyDemonCfg {
            return this._instance = this._instance || new DailyDemonCfg();
        }

        private _tab: Array<Table<Table<xiangyao>>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = [{}, {}];

            let arr: Array<xiangyao> = GlobalData.getConfig("xiangyao");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let table: Table<xiangyao> = this._tab[arr[i][xiangyaoFields.type]][arr[i][xiangyaoFields.eraLevel]];
                if (table == null) {
                    table = {};
                }
                table[arr[i][xiangyaoFields.grade]] = arr[i];
                this._tab[arr[i][xiangyaoFields.type]][arr[i][xiangyaoFields.eraLevel]] = table;
            }
        }

        //根据觉醒等级和档次获取BOSS配置
        public getBossCfgByEraLvAndGrade(eraLv: number, grade: number): xiangyao {
            if (this._tab[XiangyaoType.boss][eraLv] == null) {
                return this.getBossCfgByEraLvAndGrade(--eraLv, grade);
            }
            return this._tab[XiangyaoType.boss][eraLv][grade];
        }

        //根据觉醒等级和档次获取小怪配置
        public getLittleCfgByEraLvAndGrade(eraLv: number, grade: number): xiangyao {
            if (this._tab[XiangyaoType.monster][eraLv] == null) {
                return this.getLittleCfgByEraLvAndGrade(--eraLv, grade);
            }
            return this._tab[XiangyaoType.monster][eraLv][grade];
        }
    }
}