/**成就升级配置 */


namespace modules.config {
    import xianwei_rise = Configuration.xianwei_rise;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import Items = Configuration.Items;

    export class XianweiRiseCfg {
        private static _instance: XianweiRiseCfg;
        public static get instance(): XianweiRiseCfg {
            return this._instance = this._instance || new XianweiRiseCfg();
        }

        constructor() {
            this.init();
        }

        private _tab: Table<xianwei_rise>;
        private _ids: number[];

        private init(): void {
            this._tab = {};
            this._ids = [];
            let arr: Array<xianwei_rise> = GlobalData.getConfig("xianwei_rise");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][xianwei_riseFields.id];
                this._tab[id] = arr[i];
                this._ids.push(id);
            }
        }

        /**
        * @param lv 等级
        * @param dir 0当前配置 -1上一级配置 1下一级配置
        */
        public getXianweiRiseByLevel(lv: number, dir: number = 0): xianwei_rise {
            if (!dir) {
                return this._tab[lv];
            } else {
                let index: number = this._ids.indexOf(lv);
                if (index !== -1) {
                    let tempIndex: number = dir === 1 ? index + 1 : index - 1;
                    let tempLv: number = this._ids[tempIndex];
                    if (tempLv) {
                        return this._tab[tempLv];
                    }
                }
            }
        }

        public getNextAwardCfgByLv(lv: number): xianwei_rise {
            lv = (Math.floor(lv / 100) + 1) * 100 + 1;
            return this._tab[lv];
            // let index: number = this._ids.indexOf(lv);
            // if (index == -1) return null;
            // let reward: Items = this._tab[lv][xianwei_riseFields.reward][0];
            // if (!reward) {
            //     return this.getNextAwardCfgByLv(this._ids[index + 1]);
            // } else {
            //     return this._tab[lv];
            // }
        }

        public get ids(): number[] {
            return this._ids;
        }

        public get maxLv(): number {
            return this._ids[this._ids.length - 1];
        }

        public get minLv(): number {
            return this._ids[0];
        }

        public getSideId(lv: number, dir: number): number {
            let index: number = this._ids.indexOf(lv);
            if (index !== -1) {
                let tempIndex: number = dir === 1 ? index + 1 : index - 1;
                let tempLv: number = this._ids[tempIndex];
                if (tempLv) {
                    return tempLv;
                }
            }
        }
    }
}
