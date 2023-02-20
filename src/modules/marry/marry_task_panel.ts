/**
 * 姻缘任务面板
 */
namespace modules.marry {
    import MarryTaskViewUI = ui.MarryTaskViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import LayaEvent = modules.common.LayaEvent;

    export class MarryTaskPanel extends MarryTaskViewUI {

        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private _ListDay: CustomList;
        private _ListLifetime: CustomList;
        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.dayBtn, this.taskBtn);

            this._ListDay = new CustomList();
            this._ListDay.scrollDir = 1;
            this._ListDay.itemRender = MarryTaskDayItem;
            this._ListDay.vCount = 7;
            this._ListDay.hCount = 1;
            this._ListDay.width = 620;
            this._ListDay.height = 870;
            this._ListDay.x = 10;
            this._ListDay.y = 20;
            this._ListDay.spaceY = 5
            this.list.addChild(this._ListDay)

            this._ListLifetime = new CustomList();
            this._ListLifetime.scrollDir = 1;
            this._ListLifetime.itemRender = MarryTaskLifetimeItem;
            this._ListLifetime.vCount = 7;
            this._ListLifetime.hCount = 1;
            this._ListLifetime.width = 620;
            this._ListLifetime.height = 870;
            this._ListLifetime.x = 10;
            this._ListLifetime.y = 20;
            this._ListLifetime.spaceY = 5
            this.list.addChild(this._ListLifetime)
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.dayBtn, LayaEvent.CLICK, this, this.sele, [0]);
            this.addAutoListener(this.taskBtn, LayaEvent.CLICK, this, this.sele, [1]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_TASK_UPDATE, this, this.selectHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0
            this.selectHandler()

        }
        private sele(index: number) {
            this._btnGroup.selectedIndex = index
            this.selectHandler()
        }


        private selectHandler(): void {
            let index = this._btnGroup.selectedIndex
            if (index == 0) {
                this._ListDay.visible = true
                this._ListLifetime.visible = false
                this._ListDay.datas = MarryModel.instance.getDayTask()
            } else {
                this._ListDay.visible = false
                this._ListLifetime.visible = true
                this._ListLifetime.datas = this.getSortLifeTime();
            }
            this.function1RP.visible = MarryModel.instance.getTaskRP_day()
            this.function2RP.visible = MarryModel.instance.getTaskRP_lifetime()
        }

        private getSortLifeTime() {
            let temp = MarryModel.instance.getLifetimeTask();
            let arr0 = [];
            let arr1 = [];
            let arr2 = [];
            for (let m = 0; m < temp.length; m++) {
                let cfg = MarryModel.instance.getTask(temp[m], 2)
                if (cfg[0] == 0) {
                    arr0.push(temp[m]);
                } else if (cfg[0] == 1) {
                    arr1.push(temp[m]);
                } else {
                    arr2.push(temp[m]);
                }
            }
            arr0 = arr1.concat(arr0);
            arr0 = arr0.concat(arr2);
            return arr0;
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