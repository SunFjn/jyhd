namespace modules.stone {

    import stoneDialogUI = ui.StoneDialogUI;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import StoneCfg = modules.config.StoneCfg;
    import gemRefineFields = Configuration.gemRefineFields;
    import BagModel = modules.bag.BagModel;
    import Text = Laya.Text;
    import gemRefine = Configuration.gemRefine;
    import BaseItem = modules.bag.BaseItem;
    import ItemFields = Protocols.ItemFields;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;

    export class StoneDialog extends stoneDialogUI {

        private _list: CustomList;
        private _nameArr: Array<Text>;
        private _valueArr: Array<Text>;
        private _isUpGrade: boolean;

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._nameArr = this.destroyElement(this._nameArr);
            this._valueArr = this.destroyElement(this._valueArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {

            super.initialize();
            this.scale(0.8, 0.8);

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 337;
            this._list.height = 300;
            this._list.hCount = 1;
            this._list.itemRender = StoneItem;
            this._list.x = 38;
            this._list.y = 122;
            this.addChild(this._list);

            this._nameArr = new Array<Text>();
            this._valueArr = new Array<Text>();
            this._nameArr[0] = this.nameTxt_1;
            this._nameArr[1] = this.nameTxt_2;
            this._valueArr[0] = this.valueTxt_1;
            this._valueArr[1] = this.valueTxt_2;

            this._isUpGrade = false;

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(Laya.stage,common.LayaEvent.MOUSE_DOWN,this, this.stageClickHandler);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.BAG_UPDATE,this, this.updataBagValue);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.STONE_UPDATA,this, this.isUpGrade);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.DESTORY_DIA,this, this.close);
        }

        private stageClickHandler(e: Event): void {
            if (!(e.target instanceof BaseItem) && !(e.target instanceof StoneItem) && e.target !== this._list && e.target !== this) {
                this.close();
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            if (value == 0 || value == 1 || value == 3)
                this.pos(395, 700);
            else
                this.pos(26, 700);
            let id: number = StoneModel.instance.getValueByPart().get(StoneModel.instance.currEqiup * 10 + StoneModel.instance.currStonePic);
            let cfg: gemRefine = StoneCfg.instance.getCfgById(id);

            if (cfg) {
                let attrs:Array<attr> = cfg[gemRefineFields.attrs];
                for(let i:int = 0, len:int = attrs.length; i < len; i++){
                    let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                    let attrValue:number = attrs[i][attrFields.value];
                    this._nameArr[i].text = attrCfg[attr_itemFields.name];
                    this._valueArr[i].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                    if(i === 2) break;
                }
            } else {
                this._valueArr[0].text = "0";
                this._valueArr[1].text = "0";
            }

            this.isUpGrade();
        }

        //更新数据
        public updataBagValue(): void {

            // 数据[ 选中的装备 , 宝石数据 ]
            let arr: Array<Item> = new Array<Item>();

            if (StoneModel.instance.currStonePic == 0) {
                arr = BagModel.instance.getItemsByBagId(BagId.stoneType).concat();
            } else {
                for (let i: int = 0; i < StoneModel.instance.getStonesByType(StoneModel.instance.currStonePic).length; i++) {
                    arr.push(StoneModel.instance.getStonesByType(StoneModel.instance.currStonePic)[i]);
                }
            }
            arr = arr.sort(StoneModel.instance.sortStones);

            if (this._isUpGrade) {
                let _id: number = StoneModel.instance.getValueByPart().get(StoneModel.instance.currEqiup * 10 + StoneModel.instance.currStonePic);
                let nextId: number = StoneCfg.instance.getCfgById(_id)[gemRefineFields.next_id];
                arr.unshift([nextId, 0, 0, null]);
            }

            this._list.datas = arr;
        }

        //判断是否要升级
        private isUpGrade(): void {

            this._isUpGrade = false;

            let _id: number = StoneModel.instance.getValueByPart().get(StoneModel.instance.currEqiup * 10 + StoneModel.instance.currStonePic);
            if (_id) {
                this.attsBox.visible = true;
                this.tipTxt.visible = false;

                if (StoneCfg.instance.getCfgById(_id)[gemRefineFields.level] != StoneCfg.instance.stoneMaxLv &&
                    BagModel.instance.getItemCountById(_id) + 1 >= StoneCfg.instance.getCfgById(_id)[gemRefineFields.refine_count]) {
                    this._isUpGrade = true;
                }

                if (this._isUpGrade) {
                    //如果能替换成高级石头
                    let stones: Array<Item> = null;
                    if (StoneModel.instance.currStonePic == 0 && StoneModel.instance.vipIsOpen) {
                        stones = BagModel.instance.getItemsByBagId(BagId.stoneType).concat();
                    } else {
                        stones = StoneModel.instance.getStonesByType(StoneCfg.instance.getCfgById(_id)[gemRefineFields.type]).concat();
                    }
                    stones = stones.sort(StoneModel.instance.sortStones);
                    for (let i: int = 0; i < stones.length; i++) {
                        //如果有高等级的
                        if (StoneCfg.instance.getCfgById(stones[i][ItemFields.ItemId])[gemRefineFields.level] > StoneCfg.instance.getCfgById(_id)[gemRefineFields.level]) {
                            this._isUpGrade = false;
                            break;
                        }
                    }
                }
                StoneModel.instance.virtualStone = this._isUpGrade;
            } else {
                this.attsBox.visible = false;
                this.tipTxt.visible = true;
            }

            this.hintTxt.visible = this._isUpGrade;

            this.updataBagValue();
        }
    }
}