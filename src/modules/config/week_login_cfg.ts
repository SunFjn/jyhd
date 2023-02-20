/////<reference path="../$.ts"/>
/** 登录豪礼 */
namespace modules.config {
    import Dictionary       = laya.utils.Dictionary;
    import week_login       = Configuration.week_login;
    import week_loginFields = Configuration.week_loginFields;
    import login_reward     = Configuration.login_reward;

    export class WeekLoginCfg {
        private static _instance: WeekLoginCfg;
        public static get instance(): WeekLoginCfg {
            return this._instance = this._instance || new WeekLoginCfg();
        }

       private _tab:Table<week_login>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let cfgs: Array<week_login> = GlobalData.getConfig("week_login");

            for(let e of cfgs){
                let id:number = e[week_loginFields.id];
                this._tab[id]= e;
            }
        }

        public getArrDare(id:number):week_login{
           return this._tab[id];
        }
    }
}