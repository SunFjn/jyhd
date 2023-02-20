/** 现金装备-奇珍异宝 概率弹窗*/


namespace modules.cashEquip {

    import CashEquipProbabilityAlertUI = ui.CashEquipProbabilityAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧


    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class CashEquipProbabilityAlert extends CashEquipProbabilityAlertUI {


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
            this._list.scrollDir = 2;
            this._list.width = 500;
            this._list.height = 800;
            this._list.vCount = 10;
            this._list.hCount = 2;
            this._list.itemRender = CashEquipProbabilityItem;
            this._list.x = 80;
            this._list.y = 150;
            this._list.spaceX = 20
            this._list.spaceY = 5
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();



        }

        protected removeListeners(): void {
            super.removeListeners();


        }




        public setOpenParam(value): void {
            super.setOpenParam(value);
            let type = value[0]
            let arr = BlendCfg.instance.getCfgById(type)[blendFields.intParam];
            let datas: Array<[number, number]> = Array<[number, number]>();
            for (let i = 0; i < arr.length; i += 2) {
                datas.push([arr[i], arr[i + 1]])
            }
            this._list.datas = datas
        }
        onOpened(): void {
            super.onOpened();


        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}