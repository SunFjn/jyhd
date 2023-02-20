/** GM 地图编辑器 块级展示*/


namespace modules.gm {

    import GM_MapGridAlertUI = ui.GM_MapGridAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;



    export class GM_MapGridAlert extends GM_MapGridAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 640;
            this._list.height = 640;
            this._list.vCount = 32;
            this._list.hCount = 32;
            this._list.itemRender = GM_MapGridItem;
            this._list.x = this.bgImg.x;
            this._list.y = this.bgImg.y;
            this._list.spaceY = 0
            this._list.spaceX = 0
            this.addChild(this._list);



        }

        protected addListeners(): void {
            super.addListeners();


            this._list.on(Event.SELECT, this, this.selectHandler);
            this.a4Btn.on(Event.CLICK, this, this.setAllClose);
            this.a5Btn.on(Event.CLICK, this, this.setAllOpen);
            this.a6Btn.on(Event.CLICK, this, this.setAllReverse);

        }
        private selectHandler(): void {

            let value = !(GM_MapModel.instance._map[this._list.selectedData.index] == 0)
            GM_MapModel.instance._map[this._list.selectedData.index] = value ? 0 : 15
            let items: Array<GM_MapGridItem> = this._list.items as Array<GM_MapGridItem>
            items[this._list.selectedIndex].setVl(value)





        }
        protected removeListeners(): void {
            super.removeListeners();


        }



        private _index: number = 0;
        public setOpenParam(value): void {
            super.setOpenParam(value);
            let data = value[0]

            this.bgImg.skin = data.skin == '' ? data.url + "" + data.y + "_" + data.x + ".jpg" : data.skin
            let i = data.tag
            this._index = i
            let arr = []
            console.log('研发测试_chy:地图', '点击选择data', data);
    
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    arr.push({ index: 32 * data.hCount * y + x + i, x: x, y: y, _x: x + data._x, _y: y + data._y })
                }
            }
            this._list.datas = arr


        }


        // 设置所有关闭
        public setAllClose(): void {
            let i = this._index
            let items: Array<GM_MapGridItem> = this._list.items as Array<GM_MapGridItem>
            let arr = []
            let ii = 0
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    GM_MapModel.instance._map[items[ii].getIndex()] = 15
                    items[ii].setopen()
                    ii++
                    i++;

                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有关闭", false);
        }

        //设置所有开启
        public setAllOpen(): void {
            let i = this._index
            let items: Array<GM_MapGridItem> = this._list.items as Array<GM_MapGridItem>
            let arr = []
            let ii = 0
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    GM_MapModel.instance._map[items[ii].getIndex()] = 0
                    items[ii].setopen()
                    ii++
                    i++;

                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有开启", false);
        }




        //设置所有取反
        public setAllReverse(): void {
            let i = this._index
            let items: Array<GM_MapGridItem> = this._list.items as Array<GM_MapGridItem>
            let arr = []
            let ii = 0
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    GM_MapModel.instance._map[items[ii].getIndex()] = GM_MapModel.instance._map[items[ii].getIndex()] == 0 ? 15 : 0
                    items[ii].setopen()
                    ii++
                    i++;

                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有取反", false);

        }





        onOpened(): void {
            super.onOpened();

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}