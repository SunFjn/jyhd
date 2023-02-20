/////<reference path="../$.ts"/>
/** 仙府-家园旅行配置 */
namespace modules.config {
    import xianfu_travel = Configuration.xianfu_travel;
    import xianfu_travelFields = Configuration.xianfu_travelFields;

    export class XianfuTravelCfg {
        private static _instance: XianfuTravelCfg;
        public static get instance(): XianfuTravelCfg {
            return this._instance = this._instance || new XianfuTravelCfg();
        }

        private _tab: Table<xianfu_travel>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._ids = [];
            let arr: Array<xianfu_travel> = GlobalData.getConfig("xianfu_travel");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xianfu_travelFields.rangeId]] = arr[i];
                this._ids.push(arr[i][xianfu_travelFields.rangeId]);
            }
        }

        // 根据ID获取配置
        public getCfgById(rangeId: int): xianfu_travel {
            return this._tab[rangeId];
        }

        public get ids(): number[] {
            return this._ids;
        }
    }
}