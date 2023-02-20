/////<reference path="../$.ts"/>
/** 仙府-家园熔炼熔炼结束弹框 */
namespace modules.xianfu {
    import XianfuSmeltEndAlertUI = ui.XianfuSmeltEndAlertUI;
    import PairFields = Protocols.PairFields;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import Event = Laya.Event;
    import BagUtil = modules.bag.BagUtil;
    import CommonUtil = modules.common.CommonUtil;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import Item = Protocols.Item;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;

    export class XianfuSmeltEndAlert extends XianfuSmeltEndAlertUI {

        private _items: Item[];
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();

            this.lineTxt.underline = true;
            this._items = [];

            this._list = new CustomList();
            this._list.spaceX = 15;
            this._list.vCount = 1;
            this._list.itemRender = BaseItem;
            this._list.scrollDir = 2;
            this._list.y = 165;
            this._list.height = 100;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, Event.CLICK, this, this.btnHandler);
            this.addAutoListener(this.lineTxt, Event.CLICK, this, this.lineTxtHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let buildType: number = XianfuModel.instance.buildType;
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(buildType);
            let buildLv: number = info[GetBuildingInfoReplyFields.level];
            let currCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(XianfuModel.instance.buildType, buildLv);
            let products: Array<Array<number>> = currCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let resultPairs: Protocols.Pair[] = info[GetBuildingInfoReplyFields.resultList];
            let tab: Table<number> = {};
            resultPairs.forEach((ele) => {
                let index: number = ele[PairFields.first];
                let result: number = ele[PairFields.second];
                if (!result) { //成功的
                    let itemId: number = products[index][0];
                    if (!tab[itemId]) {
                        tab[itemId] = 1;
                    } else {
                        tab[itemId] += 1;
                    }
                } else {
                    let itemId: number = products[index][5];
                    let count: number = products[index][6];
                    if (!tab[itemId]) {
                        tab[itemId] = count;
                    } else {
                        tab[itemId] += count;
                    }
                }
            });
            this._items.length = 0;
            for (let id in tab) {
                this._items.push([parseInt(id), tab[id], 0, null]);
            }
            let sumWidth: number = this._items.length * 100 + (this._items.length - 1) * this._list.spaceX;
            this._list.width = sumWidth > 520 ? 520 : sumWidth;
            CommonUtil.centerChainArr(this.width, [this._list]);
            this._list.datas = this._items;
        }

        private btnHandler(): void {
            if (BagUtil.canAddItemsByBagIdCount(this._items)) {
                XianfuCtrl.instance.getBuildProduceAward([XianfuModel.instance.buildType]);
                this.close();
            }
        }

        private lineTxtHandler(): void {
            let buildType: number = XianfuModel.instance.buildType;
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(buildType);
            let buildLv: number = info[GetBuildingInfoReplyFields.level];
            let currCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(XianfuModel.instance.buildType, buildLv);
            let products: Array<Array<number>> = currCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let resultPairs: Protocols.Pair[] = info[GetBuildingInfoReplyFields.resultList];
            let str: string = ``;
            resultPairs.forEach((ele, i) => {
                let index: number = ele[PairFields.first];
                let result: number = ele[PairFields.second];
                let itemId: number = result == 0 ? products[index][0] : products[index][5];
                let itemCount: number = result == 0 ? 1 : products[index][6];
                let color: string = result == 0 ? `#b15315` : `#ff3e3e`;
                let resultWord: string = result == 0 ? `炼制成功` : `炼制失败`;
                let name: string = CommonUtil.getNameByItemId(itemId);
                let nameColor: string = CommonUtil.getColorById(itemId);
                let tempStr: string = `第${i + 1}次炼制,${CommonUtil.formatHtmlStrByColor(color, resultWord)},获得${CommonUtil.formatHtmlStrByColor(nameColor, `${name}×${itemCount}`)}<br/>`;
                str += tempStr;
            });
            WindowManager.instance.open(WindowEnum.XIANFU_SMELT_DETAILS_ALERT, str);
        }
    }
}