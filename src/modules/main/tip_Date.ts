///<reference path="../config/scene_cfg.ts"/>

/** 主界面控制器*/
namespace modules.main {
    import BaseCtrl = modules.core.BaseCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class tipDateCtrl extends BaseCtrl {
        private static _instance: tipDateCtrl;
        public static get instance(): tipDateCtrl {
            return this._instance = this._instance || new tipDateCtrl();
        }

        private _tab1: Table<Array<Array<number>>>;

        constructor() {
            super();
            this.Initialize();
        }

        public setup(): void {

        }

        public Initialize() {
            this._tab1 = {};
            let HuoQuDate = BlendCfg.instance.getCfgById(39001)[blendFields.intParam];
            let ind = 1;
            let key = 0;
            for (let index = 0; index < HuoQuDate.length; index++) {
                let element = HuoQuDate[index];
                if (ind == 1) {
                    if (!this._tab1[1]) {
                        this._tab1[1] = new Array<Array<number>>();
                    }
                    if (!this._tab1[1][element]) {
                        key = element;
                        this._tab1[1][key] = new Array<number>();

                    }

                }
                this._tab1[1][key].push(element);
                ind++;
                ind = ind === 5 ? 1 : ind;
            }


            HuoQuDate = BlendCfg.instance.getCfgById(39002)[blendFields.intParam];
            ind = 1;
            key = 0;
            for (let index = 0; index < HuoQuDate.length; index++) {
                let element = HuoQuDate[index];
                if (ind == 1) {
                    if (!this._tab1[2]) {
                        this._tab1[2] = new Array<Array<number>>();
                    }
                    if (!this._tab1[2][element]) {
                        key = element;
                        this._tab1[2][key] = new Array<number>();
                    }

                }
                this._tab1[2][key].push(element);
                ind++;
                ind = ind === 5 ? 1 : ind;
            }


        }

        public getDateByPartAndLevel(sClass: number, level: number): Array<number> {
            let dates = this._tab1[sClass][level];
            return dates;
        }
    }
}