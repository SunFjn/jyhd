namespace modules.xianfu {
    import XianfuSmeltListItemUI = ui.XianfuSmeltListItemUI
    import Item = Protocols.Item;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import item_materialFields = Configuration.item_materialFields;

    export class XianfuSmeltListItem extends XianfuSmeltListItemUI {

        private _index: number;
        private _state: boolean;
        private _datas: Item;

        protected initialize(): void {
            super.initialize();
        }

        public setData(value: any): void {
            value = value as [Item, number, number];
            let item: Item = value[0];
            this._datas = value[0];
            let itemId = item[Protocols.ItemFields.ItemId];
            let itemCfg = CommonUtil.getItemCfgById(itemId);
            let index: number = value[1];
            this._index = index;
            let buildType: number = XianfuModel.instance.buildType;
            //当前建筑等级
            let buildLv: number = XianfuModel.instance.getBuildInfo(buildType)[GetBuildingInfoReplyFields.level];
            let cfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(buildType, buildLv);
            let products: Array<Array<number>> = cfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let len: number = products.length;
            this._state = index < len;
            this.levelImg.visible = this.refiningBtn.gray = !this._state;
            this.levelTxt.value = `${XianfuBuildCfg.instance.getOpenLvByTypeAndIndex(XianfuModel.instance.buildType, this._index)}`
            this.lockImg.visible = false
            // ${XianfuBuildCfg.instance.getOpenLvByTypeAndIndex(XianfuModel.instance.buildType, this._index)}级解锁
            this.refiningBtn.label = this._state ? "炼制" : ``;

            this.timeCost.text = CommonUtil.formatTime(value[2]).toString();
            this.itemCostIcon.skin = CommonUtil.getIconById(value[3]);
            this.nameTxt.text = itemCfg[item_materialFields.name].toString();
            this.descTxt.color = "#7a592c";
            this.descTxt.style.fontFamily = "SimHei";
            this.descTxt.style.fontSize = 22;
            this.descTxt.innerHTML = itemCfg[item_materialFields.des].toString();
            this.item.dataSource = item;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.refiningBtn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        private btnHandler() {
            if (!this._state) {
                SystemNoticeManager.instance.addNotice(`丹炉达到${XianfuBuildCfg.instance.getOpenLvByTypeAndIndex(XianfuModel.instance.buildType, this._index)}级解锁`, true);
            } else {
                WindowManager.instance.open(WindowEnum.XIANFU_SMELT_ALERT, [this._index, this._datas]);
            }
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
        }


    }
}