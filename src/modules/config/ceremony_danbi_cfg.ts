/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.ceremony_cash {
    import ceremony_danbi = Configuration.ceremony_danbi;
    import ceremony_danbiFields = Configuration.ceremony_danbiFields;

    export class CeremonyDanbiCfg {
        private static _instance: CeremonyDanbiCfg;
        public static get instance(): CeremonyDanbiCfg {
            return this._instance = this._instance || new CeremonyDanbiCfg();
        }

        private _tab: Table<ceremony_danbi>;
        private getArr: ceremony_danbi[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<ceremony_danbi> = GlobalData.getConfig("ceremony_single_pay");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][ceremony_danbiFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): ceremony_danbi {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfg(): ceremony_danbi[] {
            return this.getArr;
        }

    }
}