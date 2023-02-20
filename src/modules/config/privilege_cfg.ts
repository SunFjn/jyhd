//特权
namespace modules.config {

    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import PrivilegeParam = Configuration.PrivilegeParam;
    import PrivilegeParamFields = Configuration.PrivilegeParamFields;

    export class PrivilegeCfg {
        private static _instance: PrivilegeCfg;
        public static get instance(): PrivilegeCfg {
            return this._instance = this._instance || new PrivilegeCfg();
        }

        private _table: Table<privilege>;
        private _powerTable: Table<Table<PrivilegeNode>>;
        private _costTable: Table<Table<PrivilegeParam>>;

        private _maxLevel: number;
        private _maxLevelNew: number;
        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._powerTable = {};
            this._costTable = {};
            this._maxLevel = 0;
            this._maxLevelNew = 0;
            let attrs: Array<privilege> = GlobalData.getConfig("privilege");
            for (let i: number = 0, len: number = attrs.length; i < len; i++) {
                let cfg: privilege = attrs[i];
                let level = cfg[privilegeFields.type];
                this._table[level] = cfg;
                //node
                let power: Table<PrivilegeNode> = this._powerTable[level];
                if (!power) {
                    power = {};
                }
                let nodesArr: Array<PrivilegeNode> = cfg[privilegeFields.nodes];
                if (nodesArr && nodesArr.length > 0) {
                    for (let i = 0; i < nodesArr.length; i++) {
                        let type = nodesArr[i][PrivilegeNodeFields.type];
                        power[type] = nodesArr[i];
                    }
                    this._powerTable[level] = power;
                }
                //消耗价格
                let costs: Table<PrivilegeParam> = this._costTable[level];
                if (!costs) {
                    costs = {};
                }
                let costArr: Array<PrivilegeParam> = cfg[privilegeFields.params];
                if (costArr && costArr.length > 0) {
                    for (let i = 0; i < costArr.length; i++) {

                        if (costArr[i] != null) {
                            let type = costArr[i][PrivilegeParamFields.type];
                            costs[type] = costArr[i];
                        }
                    }
                    this._costTable[level] = costs;
                }

                if (level < 100 && level > this._maxLevel && level < 50) {
                    this._maxLevel = level;
                }
                if (level < 100 && level > this._maxLevelNew && level >= 50) {
                    this._maxLevelNew = level;
                }
            }
        }

        //根据类型获取配置信息
        public getCfgByType(type: number): privilege {
            return this._table[type];
        }

        //获取最高svip等级
        public getVipMaxLevel(): number {
            return this._maxLevel;
        }
        //获取最高vip等级
        public getVipFMaxLevel(): number {
            return this._maxLevelNew;
        }

        //根据vip等级和类型获取信息(对应月卡101)
        public getVipInfoByLevel(level: number, type: number): PrivilegeNode {
            if (this._powerTable[level])
                return this._powerTable[level][type];
        }


        //根据VIP等级跟类型获取花费
        public getCostByLevel(level: number, type: number) {
            if (this._costTable[level]) {
                return this._costTable[level][type];
            }
        }

        //根据收益功能获取开启等级
        public getOpenFuncByType(type: Privilege, lv: number = 0): number {
            let result: Configuration.PrivilegeNode = this.getVipInfoByLevel(lv, type);
            if (!result) {
                return this.getOpenFuncByType(type, ++lv);
            }
            return lv;
        }

        //获取购买次数的下一等级
        public getNextLevel(lv: number, type: number): number {
            let nextLv: number;
            let node = this.getVipInfoByLevel(lv, type);
            let count: number;
            node == null ? count = 0 : count = node[PrivilegeNodeFields.param1];
            for (let i = lv; i <= this._maxLevel; i++) {
                let nextNode = this.getVipInfoByLevel(i, type);
                if (nextNode == null) continue;
                let nextCount = nextNode[PrivilegeNodeFields.param1];
                if (nextCount > count) {
                    nextLv = i;
                    return nextLv;
                }
            }
        }

        //获取购买次数要求的最小最大等级
        public getMinLvMaxLvByType(type: number): Array<number> {
            let minLv: number;
            let maxLv: number;
            let maxCount: number = 0;
            for (let i = 0; i <= this._maxLevel; i++) {
                let node = this.getVipInfoByLevel(i, type);
                if (node == null) continue;
                let count = node[PrivilegeNodeFields.param1];
                if (minLv == null && count > 0) {
                    minLv = i;
                }
                if (count > maxCount) {
                    maxCount = count;
                    maxLv = i;
                }
            }
            return [minLv, maxLv];
        }
        /**
         * 根据vip等级和副本类型  获取下一个可提升 副本次数的 vip等级 及 与我现在可挑战次数的差值
         * @param level vip等级
         * @param type  副本对应的nodes 参数中的类型
         */
        public getCopyCiShuByLevelAndType(level: number, type: number): Array<number> {
            let node = this.getVipInfoByLevel(level, type);
            let nodeCishuNum = node ? node[1] : 0;
            for (var index = level; index <= 15; index++) {
                let node1 = this.getVipInfoByLevel(index, type);
                let node1CishuNum = node1 ? node1[1] : 0;
                if (node1CishuNum > nodeCishuNum) {
                    let chazhi = node1CishuNum - nodeCishuNum;
                    return [index, chazhi];
                }
            }
            return null;
        }
    }
}