/* 
    连充豪礼
*/
namespace modules.config {
    import xunbao_continue_pay = Configuration.xunbao_continue_pay;
    import xunbao_continue_payFields = Configuration.xunbao_continue_payFields;

    export class LimitLinkCfg {
        private static _instance: LimitLinkCfg;
        public static get instance(): LimitLinkCfg {
            return this._instance = this._instance || new LimitLinkCfg();
        }

        private _tab: Table<Array<Array<xunbao_continue_pay>>>;
        private _cfgs: xunbao_continue_pay[];
        private _grade: Array<Array<number>>;
        // private _serverDay: Array<Array<number>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<xunbao_continue_pay> = GlobalData.getConfig("limit_xunbao_continue_pay"); 
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: xunbao_continue_pay = arr[i];
                let type: number = cfg[xunbao_continue_payFields.type];
                let grade: number = cfg[xunbao_continue_payFields.grade];
                let money: number = cfg[xunbao_continue_payFields.money];
                // let _serverDay: number = cfg[xunbao_continue_payFields.serverDay];

                if (!this._grade) {
                    this._grade = [];
                    this._grade[type] = [];
                    this._grade[type][grade] = money;
                } else if (!this._grade[type]) {
                    this._grade[type] = [];
                    this._grade[type][grade] = money;
                } else if (!this._grade[type][grade]) {
                    this._grade[type][grade] = money;
                }

                if (!this._tab[type]) {
                    this._tab[type] = [];
                }

                if (!this._tab[type][grade]) {
                    this._tab[type][grade] = [];
                }
                this._tab[type][grade].push(arr[i]);
            }
        }

        // 根据档位获取配置数组
        public getCfgsByTypeGrade(type: xunbao_continue_pay[xunbao_continue_payFields.type], grade: xunbao_continue_pay[xunbao_continue_payFields.grade]): xunbao_continue_pay[] {
            let shuju = this._tab[type][grade];
            return shuju;
        }

        // 根据类型获取所有档位和金额
        public getGradeByType(type: xunbao_continue_pay[xunbao_continue_payFields.type]): Array<number> {
            if (typeof this._grade[type] == "undefined") {
                return [];
            }
            return this._grade[type];
        }

        // 配置数组
        public get cfgs(): xunbao_continue_pay[] {
            return this._cfgs;
        }
        // 配置数组
        // public get serverDay(): number{
        //     return this._serverDay;
        // }
    }
}