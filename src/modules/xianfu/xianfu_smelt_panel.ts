///<reference path="../config/xianfu_build_cfg.ts"/>
/** 仙府的炼丹熔炼面板 */
namespace modules.xianfu {
    import XianfuSmeltViewUI = ui.XianfuSmeltViewUI;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import CommonUtil = modules.common.CommonUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;

    export class XianfuSmeltPanel extends XianfuSmeltViewUI {
        private _bar: ProgressBarCtrl;
        private _btnGroup: BtnGroup;
        private _list: CustomList;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this._bar = new ProgressBarCtrl(this.progress, this.progress.width, this.barText);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btn_0, this.btn_1, this.btn_2, this.btn_3, this.btn_4);

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.x = 40;
            this._list.y = 472;
            this._list.width = 640;
            this._list.height = 660;
            this._list.spaceX = 13;
            this._list.itemRender = XianfuSmeltListItem;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.attrBtn, common.LayaEvent.CLICK, this, this.attrBtnHandler);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.setMax);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_WIND_WATER_UPTATE, this, this.setCfgLimit);
        }

        //滑动列表控制btn组的选中状态
        private listRolling() {
            this._list.scrollCallback = () => {
                let currind = Math.floor(this._list.curIndex / 8);
                this.updateBtnSkin(currind);
            }
        }

        private changeHandler() {
            let index: number = this._btnGroup.selectedIndex;
            // 颜色和皮肤变更
            this.updateBtnSkin(index);
            this.updateView();
            // this._list.scrollToIndex(index * 8);
        }

        private updateBtnSkin(index: number) {
            for (let i = 0; i < this._btnGroup.btns.length; i++) {
                (this._btnGroup.btns[i] as Laya.Button).skin = "xian_dan/btn_select_0.png";
                this[`lable_${i}`].color = "#251308";
            }
            (this._btnGroup.btns[index] as Laya.Button).skin = "xian_dan/btn_select_1.png";
            this[`lable_${index}`].color = "#8E4122";
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
            this.updateView();
            this.changeHandler();
            // this.listRolling()
        }

        private setCfgLimit(): void {
        }

        private setMax(): void {
        }

        private updateView(): void {
            //2炼丹炉 3炼器炉 4炼魂炉
            let buildType: number = XianfuModel.instance.buildType;
            let buildLv: number = XianfuModel.instance.getBuildInfo(buildType)[GetBuildingInfoReplyFields.level];
            let arr: Array<xianfu_build> = GlobalData.getConfig("xianfu_build");
            // let name = arr[buildLv][xianfu_buildFields.name];
            // this.nameTxt.text = `LV.${buildLv}` + name;
            this.nameImg.skin=`xianfu/image_lv${buildLv}.png`

            // 0解锁炼制丹药id# 1炼制所得到经验# 2消耗道具id# 3消耗道具数量 # 4概率 # 5失败产物ID # 6失败产物数量# 7炼制所需时间

            // 处理进度条
            let build: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(2);
            if (!build) return;
            let lv: number = build[GetBuildingInfoReplyFields.level];
            let cfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(2, lv);
            let needExp: number = cfg[xianfu_buildFields.exp];
            let currExp: number = build[GetBuildingInfoReplyFields.exp];
            this._bar.maxValue = needExp ? needExp : currExp;
            this._bar.value = currExp;

            // 传入列表数据
            let maxLv: number = XianfuBuildCfg.instance.getMaxLvById(buildType);
            let buildCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(buildType, maxLv);
            let products: Array<Array<number>> = buildCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let items: Array<[Item, number, number, number]> = [];
            let initial = this._btnGroup.selectedIndex * 8
            for (let i: int = initial, len: int = initial + 8 >= products.length ? products.length : initial + 8; i < len; i++) {
                items.push([[products[i][0], 1, 0, null], i, products[i][7], products[i][2]]);
            }
            this._list.datas = items;
        }

        private attrBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.XIANFU_DANLU_ATTR_ALERT);
        }

        public destroy(): void {
            super.destroy();
            this._list = this.destroyElement(this._list);
            this._bar = this.destroyElement(this._bar);
        }
    }
}