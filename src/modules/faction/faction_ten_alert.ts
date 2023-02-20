/////<reference path="../$.ts"/>
/** 抽奖十次弹框 */
namespace modules.faction {
    import FactionTenAlertUI = ui.FactionTenAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;

    export class FactionTenAlert extends FactionTenAlertUI {

        private _items: Array<BaseItem>;
        private _flag: boolean;

        protected initialize(): void {
            super.initialize();

            this._items = [];
            for (let i: int = 0; i < 10; i++) {
                let item: BaseItem = new BaseItem();
                item.pos(45 + (i % 5) * 115, 75 + Math.floor(i / 5) * 108);
                this.addChild(item);
                this._items.push(item);
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tenBtn, common.LayaEvent.CLICK, this, this.tenBtnHandler);
        }

        public setOpenParam(indexs: number[]): void {
            super.setOpenParam(indexs);

            let params: number[] = BlendCfg.instance.getCfgById(36033)[blendFields.intParam];
            let itemDatas: Item[] = [];
            for (let i: int = 0, len: int = params.length; i < len; i += 3) {
                itemDatas.push([params[i], params[i + 1], 0, null]);
            }
            for (let i: int = 0, len: int = indexs.length; i < len; i++) {
                this._items[i].dataSource = itemDatas[indexs[i]];
            }

            let needItemId: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][0];
            let needItemCount: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][1];
            let haveCount: number = CommonUtil.getPropCountById(needItemId);
            this.propImg.skin = CommonUtil.getIconById(needItemId, true);
            this.propTxt.text = `${haveCount}/${needItemCount * 10}`;
            this.propTxt.color = haveCount >= needItemCount * 10 ? `#168a17` : `#ff3e3e`;
            this._flag = haveCount >= needItemCount * 10;
        }

        private tenBtnHandler(): void {
            if (this._flag) {
                FactionCtrl.instance.factionTurn(10);
                this.close();
            } else {
                let needItemId: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][0];
                bag.BagUtil.openLackPropAlert(needItemId, 1);
            }
        }

        public destroy(): void {
            this._items = this.destroyElement(this._items);
            super.destroy();
        }
    }
}
