/////<reference path="../$.ts"/>
/** 我的宝藏 */
namespace modules.faction {
    import BaozangMineViewUI = ui.BaozangMineViewUI;
    import CustomList = modules.common.CustomList;
    import FactionBox = Protocols.FactionBox;

    export class BaozangMinePanel extends BaozangMineViewUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 40;
            this._list.y = 185;
            this._list.width = 636;
            this._list.height = 940;
            this._list.hCount = 1;
            this._list.itemRender = BaozangItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_LIST_UPDATE, this, this.updateList);
        }


        public onOpened(): void {
            super.onOpened();

            this.updateList();
        }

        private updateList(): void {
            let list: Array<FactionBox> = FactionModel.instance.mineBoxList;
            if (!list) return;
            this.noBox.visible = !(list.length > 0);
            list = list.concat().sort(FactionModel.instance.sortByState.bind(this));
            let datas: [FactionBox, BAOZANG_ITEM_TYPE][] = [];
            for (let e of list) {
                datas.push([e, BAOZANG_ITEM_TYPE.MINE]);
            }
            this._list.datas = datas;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}
