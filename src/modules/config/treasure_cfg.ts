namespace modules.config {

    import xunbao_weightFields = Configuration.xunbao_weightFields;
    import Dictionary = laya.utils.Dictionary;
    import xunbao_weight = Configuration.xunbao_weight;
    import xunbao_operFields = Configuration.xunbao_operFields;
    import xunbao_oper = Configuration.xunbao_oper;
    import xunbao_exchange = Configuration.xunbao_exchange;
    import xunbao_exchangeFields = Configuration.xunbao_exchangeFields;
    import TableUtils = utils.TableUtils;
    import XunbaoNode = Configuration.XunbaoNode;
    import XunbaoNodeFields = Configuration.XunbaoNodeFields;

    export class TreasureCfg {
        private static _instance: TreasureCfg;
        public static get instance(): TreasureCfg {
            return this._instance = this._instance || new TreasureCfg();
        }

        private _treasureW: Table<xunbao_weight[]>;
        private _treasureO: Table<xunbao_oper[]>;
        private _typeDicW: Dictionary;
        private _typeDicO: Dictionary;
        private _exchangeTab: Table<xunbao_exchange[]>;
        private _exchangeCfgTab: Dictionary;

        // private _
        constructor() {
            this.init();
        }

        private init() {
            this._treasureW = {};
            this._treasureO = {};

            this._typeDicW = new Dictionary();
            this._typeDicO = new Dictionary();
            this._exchangeTab = {};
            this._exchangeCfgTab = new Dictionary();

            let cfgs = GlobalData.getConfig("xunbao_weight");
            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let cfg = cfgs[i];
                let type = cfg[xunbao_weightFields.type];
                if (this._treasureW[type] == null) {
                    this._treasureW[type] = [cfg];
                } else {
                    this._treasureW[type].push(cfg);
                }
                this._typeDicW.set(type, this._treasureW[type]);
            }

            let operCfgs = GlobalData.getConfig("xunbao_oper");
            for (let i: number = 0, len = operCfgs.length; i < len; i++) {
                let cfg = operCfgs[i];
                let type = cfg[xunbao_operFields.type];
                if (this._treasureO[type] == null) {
                    this._treasureO[type] = [cfg];
                } else {
                    this._treasureO[type].push(cfg);
                }
                this._typeDicO.set(type, this._treasureO[type]);
            }

            let exchangeCfgs = GlobalData.getConfig("xunbao_exchange");
            for (let i = 0; i < exchangeCfgs.length; i++) {
                let exchangeCfg = exchangeCfgs[i];
                let type = exchangeCfg[xunbao_exchangeFields.type];
                if (this._exchangeTab[type] != null) {
                    this._exchangeTab[type].push(exchangeCfg);
                } else {
                    this._exchangeTab[type] = [exchangeCfg]
                }
                this._exchangeCfgTab.set(exchangeCfg[xunbao_exchangeFields.id], exchangeCfg);
            }
        }

        public getXunbaoType() {
            let typeArr: Array<number> = new Array<number>();
            let cfgArr = TableUtils.values(this._treasureW);
            for (let i = 0; i < cfgArr.length; i++) {
                let cfgs = cfgArr[i];
                let type = cfgs[0][xunbao_weightFields.type];
                typeArr.push(type);
            }
            return typeArr;
        }

        public getItemShow(type: number): Array<xunbao_weight> {
            let cfgs: Array<xunbao_weight> = this._typeDicW.get(type);
            return cfgs;
        }

        public getItemConditionByGrad(type: number, grad: number): Array<any> {
            if (this._typeDicO.get(type)) {
                let cfg: xunbao_oper = this._typeDicO.get(type)[grad];
                return cfg[xunbao_operFields.condition];
            }
            return null;
        }

        /**
         * 获取第一次 奖励
         * @param type   探索类型 0装备 1巅峰 2至尊 3仙符
         * @param grad  抽奖档次 0 1次 1 10次 2 50次
         */
        public getfirstRewardByGrad(type: number, grad: number = 2): Array<any> {
            let cfg: xunbao_oper = this._typeDicO.get(type)[grad];
            return cfg[xunbao_operFields.firstReward];
        }

        public getBestIdByType(type: number): Array<number> {
            let cfgs: Array<xunbao_weight> = TreasureCfg.instance.getItemShow(type);
            let bestArr = new Array<XunbaoNode>();
            let bestIdArr = new Array<any>();
            for (let i = 0; i < cfgs.length; i++) {
                bestArr = bestArr.concat(cfgs[i][xunbao_weightFields.weights]);
            }
            for (let i = 0; i < bestArr.length; i++) {
                if (bestArr[i][XunbaoNodeFields.itemGrade] > 1) {
                    bestIdArr.push(bestArr[i][XunbaoNodeFields.itemId]);
                }
            }
            return bestIdArr;
        }

        //根据道具唯一Id获取兑换配置
        public getCfgByitemId(itemId: number): xunbao_exchange {
            return this._exchangeCfgTab.get(itemId);
        }

        //根据类型获取兑换配置;
        public getCfgsByType(type: number): Array<xunbao_exchange> {
            let shuju: Array<xunbao_exchange> = this._exchangeTab[type];
            if (shuju) {
                shuju.sort(this.shortWeightCfgs);
            }
            return shuju;
        }

        /**
         * short
         */
        public shortWeightCfgs(A: xunbao_exchange, B: xunbao_exchange): number {
            let indexA = A[xunbao_exchangeFields.sort];
            let indexB = B[xunbao_exchangeFields.sort];
            let returnNum = 1;
            indexA > indexB ? returnNum = -1 : returnNum = 1;
            return returnNum;
        }

        //获取兑换的所有类型
        public getExchangeType() {
            let typeArr: Array<number> = new Array<number>();
            let cfgArr = TableUtils.values(this._exchangeTab);
            for (let i = 0; i < cfgArr.length; i++) {
                let cfgs = cfgArr[i];
                let type = cfgs[0][xunbao_exchangeFields.type];
                typeArr.push(type);
            }
            return typeArr;
        }
    }
}
