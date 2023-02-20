/**
 * 通用选取数量弹窗
 * @param <amountParam>
*/
namespace modules.fish {
    import CustomList = modules.common.CustomList; // List
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RunLimitXunbaoReplyFields = Protocols.RunLimitXunbaoReplyFields;

    export class FishGainAlert extends ui.FishGainAlertUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private p_height: number;
        private bg_height: number;
        private lin: number;

        protected initialize(): void {
            super.initialize();

            this.p_height = this.height;
            this.bg_height = this.bgImg.height;
            this.lin = 16750001;
            this.priceImg.skin = CommonUtil.getIconById(this.lin, true);

            this._list = new CustomList();
            this._list.itemRender = modules.bag.BaseItem;
            this._list.hCount = 5;
            this._list.y = 140;
            this._list.spaceX = 15;
            this._list.spaceX = 15;
            this._list.width = 100;
            this._list.height = 100;

            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public setOpenParam(value: Protocols.RunLimitXunbaoReply): void {
            super.setOpenParam(value);
            let _d = [];
            let item_arr = value[RunLimitXunbaoReplyFields.items];
            this.titText.text = FishModel.instance.type_tit[value[RunLimitXunbaoReplyFields.type] - 1] + "钓场";

            // 合并重复
            for (let i = 0; i < item_arr.length; i++) {
                if (typeof _d[item_arr[i][ItemsFields.itemId]] == "undefined") {
                    _d[item_arr[i][ItemsFields.itemId]] = item_arr[i][ItemsFields.count];
                } else {
                    _d[item_arr[i][ItemsFields.itemId]] = Number(_d[item_arr[i][ItemsFields.itemId]]) + Number(item_arr[i][ItemsFields.count]);
                }
            }
            let _v = [];
            for (let k in _d) {
                if (this.lin as any as string == k) {
                    this.countTxt.text = String(_d[k]);
                } else {
                    _v.push([Number(k), _d[k]]);
                }
            }
            // 适应显示
            let _length = _v.length;
            if (_length > 5) {
                this._list.width = 560;
                this._list.x = 50;
            } else if (_length == 1) {
                this._list.width = 100;
                this._list.x = 280;
            } else {
                this._list.width = (_length - 1) * 15 + _length * 100;
                this._list.x = (660 - this._list.width) / 2;
            }
            let hc = Math.ceil(_length / 5);
            this._list.height = hc * 100;
            this.height = this.p_height + this._list.height;
            this.bgImg.height = this.bg_height + this._list.height;

            this._list.datas = _v;
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(): void {
            super.close();
        }


    }
}