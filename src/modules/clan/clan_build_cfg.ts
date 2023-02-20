/** 战队建设配置 */
namespace modules.config {

    import clan_build = Configuration.clan_build;
    import clan_buildFields = Configuration.clan_buildFields;

    export class ClanBuildCfg {
        private static _instance: ClanBuildCfg;
        public static get instance(): ClanBuildCfg {
            return this._instance = this._instance || new ClanBuildCfg();
        }

        private _tab: Table<clan_build>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<clan_build> = GlobalData.getConfig("fight_team_build");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][clan_buildFields.id]] = arr[i];
            }
        }

        //获取所有数据 
        public getAllConfig(): Table<clan_build> {
            return this._tab;
        }

    }
}