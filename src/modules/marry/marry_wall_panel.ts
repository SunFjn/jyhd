/**
 * 姻缘面板
 */
namespace modules.marry {
    import MarryWallViewUI = ui.MarryWallViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import LayaEvent = modules.common.LayaEvent;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;

    export class MarryWallPanel extends MarryWallViewUI {

        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private _List: CustomList;

        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.serviceBtn, this.crossBtn);


            this._List = new CustomList();
            this._List.scrollDir = 1;
            this._List.itemRender = MarryCoupleItem;

            this._List.vCount = 7;

            this._List.hCount = 1;

            this._List.width = 640;
            this._List.height = 700;
            this._List.x = 10;
            this._List.y = 20;
            this.list.addChild(this._List)

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);
            this.addAutoListener(this.searchBtn, LayaEvent.CLICK, this, this.openDialog, [WindowEnum.MARRY_Search_Alert]);
            this.addAutoListener(this.releasedBtn, LayaEvent.CLICK, this, this.openDialog, [WindowEnum.MARRY_Released_Alert]);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_WALL_UPDATE, this, this.setList);
        }
        private openTips() {
            CommonUtil.alertHelp(70002)
        }
        private openDialog(id: number) {
            WindowManager.instance.openDialog(id);
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1
            MarryCtrl.instance.GetMarryWallList('')



        }

        private setList() {
            this._List.datas = MarryModel.instance.wallList;
        }

        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        public close(): void {
            super.close();
        }


    }
}