/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
namespace modules.kunlun {
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import Pair = Protocols.Pair;

    export class KunLunModel {
        private static _instance: KunLunModel;
        public static get instance(): KunLunModel {
            return this._instance = this._instance || new KunLunModel();
        }

        private _time: number = 0;/*已在场景内逗留时间  毫秒*/
        private _buffTime: number = 0;/*buff剩余时间  毫秒*/
        private _count: number = 0;/*已抓取肥皂次数*/
        private _le: number = 0;	/*肥皂区域长度*/
        private _start: number = 0;/*起始位置*/
        private _result: number = 0;	/*抓取结果  0没抓到  1抓到*/
        private _gameMaxNum: number = 0;//捡肥皂最大次数
        private _MaxLengNum: number = 0;//肥皂区总长度
        private _speedNum: number = 0;//肥皂移动速度 毫秒
        private _maxSwimmingTime: number = 0;//最大泡澡时间 毫秒
        private _buffMaxTime: number = 0;//buff持续时间 单位毫秒
        private _awardList: Array<Pair>;
        public _all_Item: Array<Item>;
        public _overType: number = 1;//结算类型 
        public _isShowBuff: boolean = false;//结算类型 
        constructor() {
            this._all_Item = new Array<Item>();
            this.gameMaxNum = BlendCfg.instance.getCfgById(30002)[blendFields.intParam][0];//捡肥皂最大次数
            this.MaxLengNum = BlendCfg.instance.getCfgById(30004)[blendFields.intParam][0];//肥皂区总长度
            this.speedNum = BlendCfg.instance.getCfgById(30009)[blendFields.intParam][0];//肥皂移动速度 毫秒
            this._maxSwimmingTime = BlendCfg.instance.getCfgById(30001)[blendFields.intParam][0];//场景内逗留时间上限 单位毫秒
            this.buffMaxTime = BlendCfg.instance.getCfgById(30006)[blendFields.intParam][0];//buff持续时间 单位毫秒
        }

        /**
         * buff持续时间 单位毫秒
         */
        public get buffMaxTime(): number {
            return this._buffMaxTime;
        }

        public set buffMaxTime(value: number) {
            this._buffMaxTime = value;
        }

        /**
         * 掉落的道具
         */
        public get awardList(): Array<Pair> {
            return this._awardList;
        }

        public set awardList(value: Array<Pair>) {
            this._awardList = value;
        }

        /**
         * /场景内逗留时间上限 单位毫秒
         */
        public get maxSwimmingTime(): int {
            return this._maxSwimmingTime;
        }

        public set maxSwimmingTime(value: int) {
            this._maxSwimmingTime = value;
        }

        /**
         * 肥皂移动速度(多少毫秒移动1)
         */
        public get speedNum(): int {
            return this._speedNum;
        }

        public set speedNum(value: int) {
            this._speedNum = value;
        }

        /**
         * 肥皂区总长度
         */
        public get MaxLengNum(): int {
            return this._MaxLengNum;
        }

        public set MaxLengNum(value: int) {
            this._MaxLengNum = value;
        }

        /**
         * 捡肥皂最大次数
         */
        public get gameMaxNum(): int {
            return this._gameMaxNum;
        }

        public set gameMaxNum(value: int) {
            this._gameMaxNum = value;
        }

        /**
         * 已在场景内逗留时间
         */
        public get time(): int {
            return this._time;
        }

        public set time(value: int) {
            this._time = value;
        }

        /**
         * buff剩余时间
         */
        public get buffTime(): int {
            return this._buffTime;
        }

        public set buffTime(value: int) {
            this._buffTime = value;
        }

        /**
         * 已抓取肥皂次数
         */
        public get count(): int {
            return this._count;
        }

        public set count(value: int) {
            this._count = value;
        }

        /**
         * 肥皂区域长度
         */
        public get le(): int {
            return this._le;
        }

        public set le(value: int) {
            this._le = value;
        }

        /**
         * 起始位置
         */
        public get startPos(): int {
            return this._start;
        }

        public set startPos(value: int) {
            this._start = value;
        }

        /**
         * 抓取结果  0没抓到  1抓到
         */
        public get result(): int {
            return this._result;
        }

        public set result(value: int) {
            this._result = value;
        }
    }
}