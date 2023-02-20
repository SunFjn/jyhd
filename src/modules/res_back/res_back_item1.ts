/////<reference path="../$.ts"/>
/** 资源找回item 1*/
namespace modules.resBack {
    import ResBackItem_1UI = ui.ResBackItem_1UI;
    import BaseItem = modules.bag.BaseItem;
    import Retrieve = Protocols.Retrieve;
    import RetrieveFields = Protocols.RetrieveFields;
    import retrieve_res = Configuration.retrieve_res;
    import RetrieveCfg = modules.config.RetrieveCfg;
    import retrieve_resFields = Configuration.retrieve_resFields;
    import Item = Protocols.Item;

    export class ResBackItem1 extends ResBackItem_1UI {

        private _items: BaseItem[];
        private _info:Retrieve;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK,ResBackModel.instance,ResBackModel.instance.backHandler);
        }

        public setData(value: Retrieve): void {
            this._info = value;
            let id:int = value[RetrieveFields.id];
            let cfg:retrieve_res = RetrieveCfg.instance.getResCfgById(id);
            if(!cfg){
                throw new Error(`资源找回id为${id},配置为空!`);
            }
            if(!this._items){
                this._items =[];
                let items:Item[] = CommonUtil.formatItemData(cfg[retrieve_resFields.awardsTips]) ;
                for(let ele of items) {
                    let item:BaseItem  = new BaseItem();
                    item.dataSource = ele;
                    this.addChild(item);
                    this._items.push(item);
                }
            }
            this.nameTxt.text = cfg[retrieve_resFields.name];
            let count:int  = value[RetrieveFields.times];
            this.countTxt.text = `可找回${count}`;
            this.numTxt.text = `${value[RetrieveFields.gold]}`;
        }

        public destroy(): void {
            this._items = this.destroyElement(this._items);
            super.destroy();
        }
    }
}