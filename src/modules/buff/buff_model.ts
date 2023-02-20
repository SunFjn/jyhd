namespace modules.buff {
    import Buff = Protocols.Buff;
    import UpdateBuffListFields = Protocols.UpdateBuffListFields;
    import BuffOper = Protocols.BuffOper;
    import BuffOperFields = Protocols.BuffOperFields;
    import BuffFields = Protocols.BuffFields;

    export class BuffModel {
        private static _instance: BuffModel;
        public static get instance(): BuffModel {
            return this._instance = this._instance || new BuffModel();
        }

        private _buffs: Array<Buff>;

        constructor() {
            this._buffs = new Array<Buff>();
        }

        public updateBuffList(tuple: Protocols.UpdateBuffList) {
            if (!tuple) return;
            for (let i: int = 0, len: int = tuple[UpdateBuffListFields.opers].length; i < len; i++) {
                let oper: BuffOper = tuple[UpdateBuffListFields.opers][i];
                let buffs: Array<Buff> = oper[BuffOperFields.buffs];
                if (oper[BuffOperFields.type] === 1) {        // 1添加 2删除
                    this._buffs.push(...oper[BuffOperFields.buffs]);
                } else if (oper[BuffOperFields.type] === 2) {
                    for (let j: int = 0, len1: int = buffs.length; j < len1; j++) {
                        for (let k: int = 0, len2: int = this._buffs.length; k < len2; k++) {
                            if (buffs[j][BuffFields.unique] === this._buffs[k][BuffFields.unique]) {
                                this._buffs.splice(k, 1);
                                break;
                            }
                        }
                    }
                }
            }
            if (tuple[UpdateBuffListFields.opers].length == 0) {
                this._buffs.length = 0;
            }
            GlobalData.dispatcher.event(CommonEventType.UPDATE_BUFF_LIST);
        }


        // BUFF列表
        public get buffs(): Array<Buff> {
            return this._buffs;
        }
    }
}