/////<reference path="../$.ts"/>
/** 战队配置 */
namespace modules.config {
    import clan = Configuration.clan;
    import clanFields = Configuration.clanFields;

    export class ClanCfg {
        private static _instance: ClanCfg;
        public static get instance(): ClanCfg {
            return this._instance = this._instance || new ClanCfg();
        }

        private _tab: Table<clan>;
        private _lvs: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._lvs = [];
            let arr: Array<clan> = GlobalData.getConfig("fight_team");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][clanFields.level]] = arr[i];
            }
            for (let ele of arr) {
                let lv: number = ele[clanFields.level];
                // console.log(lv, this._lvs);

                this._lvs.push(lv);
            }
        }

        //根据等级取配置 dir 方向 -1 前一个 1 下一个
        public getCfgByLv(lv: int, dir?: int): clan {
            if (!dir) {
                return this._tab[lv];
            } else {
                let index: number = this._lvs.indexOf(lv);
                index = dir == 1 ? ++index : --index;
                let tempLv: number = this._lvs[index];
                //如果超出了等级则返回当前等级的数据
                return tempLv == null ? this._tab[lv] : this._tab[tempLv];
            }
        }

        //根据当前等级取下一等级
        public getNextLv(lv: int): int {
            let index: int = this._lvs.indexOf(lv);
            if (index !== -1) {
                let nextLv: number = this._lvs[index + 1];
                //如果超出了等级则返回当前等级
                return nextLv ? nextLv : lv;
            }
        }

    }
}