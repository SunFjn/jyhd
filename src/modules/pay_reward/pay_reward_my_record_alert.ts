///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.pay_reward {
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import PayRewardNote = Protocols.PayRewardNote;
    import PayRewardModel = modules.pay_reward.PayRewardModel;

    export class PayRewardMyRecordAlert extends ui.PayRewardMyRecordAlertUI {
        private _list: CustomList;
        private _pos: Point;
        private _type: number;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._pos = new Point(60, 70);
            this._list = new CustomList();
            this._list.width = 530;
            this._list.height = 340;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.itemRender = PayRewardMyRecordItem;
            this._list.x = 67;
            this._list.y = 109;
            this.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.updateMyRecord();
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public updateMyRecord(): void {
            let PayRewardNoteList: Array<PayRewardNote> = PayRewardModel.instance.PayRewardNoteList;
            this._list.datas = PayRewardNoteList;
        }
    }
}
