/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
namespace modules.day_drop_treasure {
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class DayDropTreasureModel {
        private static _instance: DayDropTreasureModel;
        public static get instance(): DayDropTreasureModel {
            return this._instance = this._instance || new DayDropTreasureModel();
        }

        private _xianFaId: number = 0;
        private _xianLingId: number = 0;
        private _maxNum: number = 0;
        private _updateTime: number = 0;
        private _gatherCount: number = 0;
        private _nextRefreshTime: number = 0;
        private _closeNum: number = 0;

        public _firstJoin: boolean = true;

        constructor() {
            this.xianLingId = BlendCfg.instance.getCfgById(28001)[blendFields.intParam][0];
            this.xianFaId = BlendCfg.instance.getCfgById(28001)[blendFields.intParam][1];
            this.maxNum = BlendCfg.instance.getCfgById(28002)[blendFields.intParam][0];
            this.updateTime = BlendCfg.instance.getCfgById(28004)[blendFields.intParam][0];
        }

        /**
         * 仙法ID
         */
        public get xianFaId(): int {
            return this._xianFaId;
        }

        public set xianFaId(value: int) {
            this._xianFaId = value;
        }

        /**
         * 仙灵ID
         */
        public get xianLingId(): int {
            return this._xianLingId;
        }

        public set xianLingId(value: int) {
            this._xianLingId = value;
        }

        /**
         * 采集上限
         */
        public get maxNum(): int {
            return this._maxNum;
        }

        public set maxNum(value: int) {
            this._maxNum = value;
        }

        /**
         * 刷新时间
         */
        public get updateTime(): int {
            return this._updateTime;
        }

        public set updateTime(value: int) {
            this._updateTime = value;
        }

        /**
         * 采集数量
         */
        public get gatherCount(): int {
            return this._gatherCount;
        }

        public set gatherCount(value: int) {
            this._gatherCount = value;
        }

        /**
         * 下一波刷新时间戳
         */
        public get nextRefreshTime(): int {
            return this._nextRefreshTime;
        }

        public set nextRefreshTime(value: int) {
            this._nextRefreshTime = value;
        }

        /**
         * 副本关闭时间
         */
        public get closeNum(): int {
            return this._closeNum;
        }

        public set closeNum(value: int) {
            this._closeNum = value;
        }

        /**
         * 是否采集已达到上限
         */
        public getGatherCountIsMax(): boolean {
            return this.gatherCount >= DayDropTreasureModel.instance.maxNum
        }
    }
}