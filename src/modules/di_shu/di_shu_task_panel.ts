///<reference path="../common/btn_group.ts"/>

namespace modules.dishu {
    import Event = laya.events.Event;
    import CustomList = modules.common.CustomList;
    import BtnGroup = modules.common.BtnGroup;
    // import di_shu_cfg= Configuration.di_shu_cfg ;
    // import di_shu_cfgFields= Configuration.di_shu_cfgFields ;

    export class DishuTaskPanel extends ui.DishuTaskViewUI {

        private _btnGroup: BtnGroup;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.grBtn, this.qmBtn);

            this._list = new CustomList();
            this._list.itemRender = DishuTaskItem;
            this._list.vCount = 1;
            this._list.width = 705;
            this._list.height = 906;
            this._list.x = 5;
            this.itemPanel.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.btnGroupUpdate);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_TASK_UPDATE, this, this.btnGroupUpdate);
            this.addAutoRegisteRedPoint(this.grRP, ["DishuTaskOpenRP"]);
            this.addAutoRegisteRedPoint(this.qmRP, ["DishuTaskServerRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            this.setItem();
        }

        private setItem() {
            this._btnGroup.selectedIndex = 0;
        }

        private btnGroupUpdate(): void {
            DishuModel.instance.tabSelectIndex = this._btnGroup.selectedIndex;

            this._list.datas = DishuModel.instance.getTaskList();
            if (DishuModel.instance.tabSelectIndex == 0) {
                this.grImg.visible = true;
            } else {
                this.grImg.visible = false;
            }
            this.qmImg.visible = !this.grImg.visible;
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