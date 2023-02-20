/////<reference path="../$.ts"/>
/** 资源找回panel */
namespace modules.resBack {
    import ResBackViewUI = ui.ResBackViewUI;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Retrieve = Protocols.Retrieve;
    import TableUtils = utils.TableUtils;

    export class ResBackPanel extends ResBackViewUI {

        private _btnGroup: BtnGroup;
        private _list_1: CustomList;
        private _list_2: CustomList;

        protected initialize(): void {
            super.initialize();

            this.centerY = this.centerX = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_1, this.btnGroup_2);

            this._list_1 = CustomList.create('v', 48, 130, 625, 856, ResBackItem1);
            this.addChild(this._list_1);
            this._list_2 = CustomList.create('v', 48, 130, 625, 856, ResBackItem2);
            this.addChild(this._list_2);

            let vipLv: int = BlendCfg.instance.getCfgById(55001)[blendFields.intParam][0];
            this.desTxt.text = `SVIP${vipLv}可享受半价找回优惠`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.selectView);
            this.addAutoListener(this.ruleBtn, common.LayaEvent.CLICK, this, this.ruleBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RETRIEVE_LILIAN_UPDATE, this, this.lilianUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RETRIEVE_RES_UPDATE, this, this.resUpdate);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnGroup.selectedIndex = 0;
        }

        private selectView(): void {
            let index: number = this._btnGroup.selectedIndex;
            if (index == 0) {
                this._list_1.visible = true;
                this._list_2.visible = false;
                this.resUpdate();
            } else {
                this._list_1.visible = false;
                this._list_2.visible = true;
                this.lilianUpdate();
            }
        }

        private lilianUpdate(): void {
            if(this._btnGroup.selectedIndex !== 1)return;
            let values: Array<Retrieve> = TableUtils.values(ResBackModel.instance.getLilian());
            this._list_1.datas = values;
        }

        private resUpdate(): void {
            if(this._btnGroup.selectedIndex !== 0)return;
            let values: Array<Retrieve> = TableUtils.values(ResBackModel.instance.getRes());
            this._list_2.datas = values;
        }

        private ruleBtnHandler(): void {
            CommonUtil.alertHelp(20065);
        }

        public destroy(): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._list_1 = this.destroyElement(this._list_1);
            this._list_2 = this.destroyElement(this._list_2);
            super.destroy();
        }
    }
}