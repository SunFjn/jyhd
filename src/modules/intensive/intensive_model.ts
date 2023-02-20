///<reference path="../common/common_event_type.ts"/>
///<reference path="../config/intensive_cfg.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>

namespace modules.intensive {

    import CommonEventType = modules.common.CommonEventType;
    import GetStrongInfoReply = Protocols.GetStrongInfoReply;
    import Dictionary = Laya.Dictionary;
    import GetStrongInfoReplyFields = Protocols.GetStrongInfoReplyFields;
    import StrongGridsFields = Protocols.StrongGridsFields;
    import BagModel = modules.bag.BagModel;
    import IntensiveCfg = modules.config.IntensiveCfg;
    import PlayerModel = modules.player.PlayerModel;
    import strongRefineFields = Configuration.strongRefineFields;
    import ItemsFields = Configuration.ItemsFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class IntensiveModel {

        private _dic: Dictionary;
        private _value: Array<[number, boolean]>;
        private _atkNum: number;
        private _levSum: number;  //强化总等级
        private _keyArr: Array<[number, number]>;  //按照等级排序
        private _partArr: number[]; //存储装备情况

        constructor() {
            this._dic = new Dictionary();
            this._value = new Array<[number, boolean]>();
            this._keyArr = new Array<[number, number]>();
            this._partArr = [];
        }

        private static _instance: IntensiveModel;
        public static get instance(): IntensiveModel {
            return this._instance = this._instance || new IntensiveModel();
        }

        public updateValue(tuple: GetStrongInfoReply) {

            this._dic.clear();
            this._keyArr.length = 0;
            this._atkNum = tuple[GetStrongInfoReplyFields.fighting];  //总战力

            // 0强化大师  1强化神匠
            this._value[0] = [tuple[GetStrongInfoReplyFields.riseLevel], tuple[GetStrongInfoReplyFields.risePoint]];
            this._value[1] = [tuple[GetStrongInfoReplyFields.rise2Level], tuple[GetStrongInfoReplyFields.rise2Point]];

            let _arr = tuple[GetStrongInfoReplyFields.list];

            this._levSum = 0;
            //存储部位和等级
            for (let i: int = 0, len: int = _arr.length; i < len; i++) {
                this._dic.set(_arr[i][StrongGridsFields.part], _arr[i][StrongGridsFields.level]);
                this._keyArr.push(_arr[i]);
                this._levSum += _arr[i][StrongGridsFields.level];
            }

            this._keyArr = this._keyArr.sort(this.sortFunc.bind(this));
            GlobalData.dispatcher.event(CommonEventType.INTENSIVE_UPDATE);
            this.setDotDis();
        }

        public get levState(): Array<[number, boolean]> {
            return this._value;
        }

        public get partLev(): Dictionary {
            return this._dic;
        }

        public get atkNum(): number {
            return this._atkNum;
        }

        public get levSum(): number {
            return this._levSum;
        }

        public getKeysArr(index: int): number {
            return this._keyArr[index][0];
        }

        public setDotDis() {
            this.updateEquip();
            this.judge();
        }

        public getComProCount(lev: int): number {

            let _count: int = 0;

            for (let i: int = 1, len: int = this._dic.keys.length; i <= len; i++) {
                if (this._dic.get(i) >= lev)
                    _count++;
            }
            return _count;
        }

        private sortFunc(a: [number, number], b: [number, number]): number {
            if (a[1] < b[1]) return -1;
            else if (a[1] > b[1]) return 1;
            else return 0;
        }

        private judge(): void {

            let _stoneNum = BagModel.instance.getItemCountById(10120001);
            let _moneyNum = PlayerModel.instance.copper;

            if (this._partArr.length == 0) {
                RedPointCtrl.instance.setRPProperty("intensiveRP", false);
                return;
            }

            //强化大师或者强化神匠可以升级的
            if (this._value.length == 0) return;
            if (this._value[0][1]) {
                RedPointCtrl.instance.setRPProperty("intensiveRP", true);
                return;
            }
            if (this._value[1][1]) {
                RedPointCtrl.instance.setRPProperty("intensiveRP", true);
                return;
            }

            //可以强化的
            for (let i: int = 0, len: int = this._partArr.length; i < len; i++) {
                //任意部位可以强化
                let _cfg = IntensiveCfg.instance.getCfgByPart(this._partArr[i], this._dic.get(this._partArr[i]));

                if (_cfg[strongRefineFields.items][0] && (_cfg[strongRefineFields.items][0][ItemsFields.count] <= _stoneNum &&
                    _cfg[strongRefineFields.copper] <= _moneyNum)) {
                    RedPointCtrl.instance.setRPProperty("intensiveRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("intensiveRP", false);
        }

        public updateEquip(): void {

            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic) return;
            for (let i: int = 0, len = equipsDic.keys.length; i < len; i++) {
                this._partArr[i] = equipsDic.keys[i];
            }
        }
    }
}