/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import limit_xunbao_cumulative_task_cfg = Configuration.limit_xunbao_cumulative_task_cfg;
    import limit_xunbao_cumulative_task_cfgField = Configuration.limit_xunbao_cumulative_task_cfgField;

    export class LimitReapCfg {
        private static _instance: LimitReapCfg;
        public static get instance(): LimitReapCfg {
            return this._instance = this._instance || new LimitReapCfg();
        }
        private _tab: Table<Array<limit_xunbao_cumulative_task_cfg>>;
        private _smallTab: Table<Array<limit_xunbao_cumulative_task_cfg>>;

        private _cfgs: limit_xunbao_cumulative_task_cfg[];
        private _smallType: number
        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._smallTab = {};

            let arr: Array<limit_xunbao_cumulative_task_cfg> = GlobalData.getConfig("limit_xunbao_cumulative_task");

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: limit_xunbao_cumulative_task_cfg = arr[i];
                this._smallType = cfg[limit_xunbao_cumulative_task_cfgField.smallType];
                let type = cfg[limit_xunbao_cumulative_task_cfgField.type];
                let smallType = cfg[limit_xunbao_cumulative_task_cfgField.smallType];


                if (!this._tab[type]) {
                    this._tab[type] = [];
                }
                if (!this._tab[smallType]) {
                    this._tab[smallType] = [];
                }
                if (smallType == 0) {
                    this._tab[type].push(arr[i]);
                } else {
                    this._tab[smallType].push(arr[i]);

                }
            }


        }

        // 获取da配置数组
        public getCfgsByType(type: number, smallType: number): limit_xunbao_cumulative_task_cfg[] {

            if (smallType == 0) {
                return this._tab[type]
            } else {
                return this._tab[smallType];
            }
        }

        // 获取配置数组
        public get cfgs(): Array<limit_xunbao_cumulative_task_cfg> {
            return this._cfgs;
        }
        // 获取配置数组
        public get smallType(): number {
            return this._smallType;
        }

        //通过小类获取数据
        public getDataBySmallType(smallType: number): limit_xunbao_cumulative_task_cfg[] {
            return this._tab[smallType];
        }

        /**
         * 根据 id 获取 Condition（条件）
         */
        public getCondition(type: number, smallType: number, id: number): number {
            let arr: limit_xunbao_cumulative_task_cfg[];
            if (smallType == 0) {
                arr = this._tab[type]
            } else {
                arr = this._tab[smallType];
            }
            // console.log('vtz:type', type);
            // console.log('vtz:smallType', smallType);
            // console.log('vtz:this._tab', this._tab);
            // console.log('vtz:arr', arr);
            // console.log('vtz:id', id);
            for (let key in arr) {
                // console.log('vtz:arr[key][limit_xunbao_cumulative_task_cfgField.id]', arr[key][limit_xunbao_cumulative_task_cfgField.id]);
                if (arr[key][limit_xunbao_cumulative_task_cfgField.id] == id || id == 0) {
                    // console.log('vtz:arr[key][limit_xunbao_cumulative_task_cfgField.condition];', arr[key][limit_xunbao_cumulative_task_cfgField.condition]);
                    return arr[key][limit_xunbao_cumulative_task_cfgField.condition];
                }
            }
            return 0;
        }

        /**
         * 第1条id
         */
        public getLeastId(type: number, smallType: number, id: number): number {
            let arr: limit_xunbao_cumulative_task_cfg[];
            if (smallType == 0) {
                arr = this._tab[type]
            } else {
                arr = this._tab[smallType];
            }
            for (let key in arr) {
                    return arr[key][limit_xunbao_cumulative_task_cfgField.id];
            }
            return 0;
        }

    }
}