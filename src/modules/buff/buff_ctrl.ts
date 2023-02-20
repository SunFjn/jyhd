namespace modules.buff {
    import BaseCtrl = modules.core.BaseCtrl;
    import Buff = Protocols.Buff;
    import BuffFields = Protocols.BuffFields;

    export class BuffCtrl extends BaseCtrl {
        private static _instance: BuffCtrl;
        public static get instance(): BuffCtrl {
            return this._instance = this._instance || new BuffCtrl();
        }

        constructor() {
            super();

        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.UpdateBuffList, this, this.updateBuffList);
        }

        private updateBuffList(tuple: Protocols.UpdateBuffList): void {
            BuffModel.instance.updateBuffList(tuple);
        }
    }
}