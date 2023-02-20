///<reference path="./faction_join_item.ts"/>
/** 加入仙盟面板 */
namespace modules.faction {
    import CommonEventType = modules.common.CommonEventType;
    import WindowManager = modules.core.WindowManager;
    import FactionJoinItem = modules.faction.FactionJoinItem;
    import CustomList = modules.common.CustomList;
    import FactionJoinViewUI = ui.FactionJoinViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import FactionInfo = Protocols.FactionInfo;
    import FactionInfoFields = Protocols.FactionInfoFields;

    export class FactionJoinPanel extends FactionJoinViewUI {

        private _list: CustomList;
        private _needVip: number;
        private _needProp: Items;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 55;
            this._list.y = 116;
            this._list.width = 610;
            this._list.height = 865;
            this._list.hCount = 1;
            this._list.itemRender = FactionJoinItem;
            this._list.spaceY = 5;
            this.addChild(this._list);

            this._needVip = BlendCfg.instance.getCfgById(36002)[blendFields.intParam][0];
            let arr: number[] = BlendCfg.instance.getCfgById(36001)[blendFields.intParam];
            this._needProp = [arr[0], arr[1]];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.creatBtn, common.LayaEvent.CLICK, this, this.creatBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_LIST, this, this.updateList);
        }

        public onOpened(): void {
            super.onOpened();
            FactionCtrl.instance.getFactionList();

            this.updateView();
            this.updateList();
        }

        private updateView(): void {
            let myViplv: number = vip.VipModel.instance.vipLevel;
            this.creatBtn.y = 1029;
            if (myViplv >= this._needVip) { //vip等级足够
                this.needVipLvTxt.visible = false;
                let needItemId: number = this._needProp[ItemsFields.itemId];
                let needItemNum: number = this._needProp[ItemsFields.count];
                let myItemNum: number = CommonUtil.getPropCountById(needItemId);
                if (myItemNum >= needItemNum) { //道具足够
                    this.propBox.visible = false;
                    this.creatBtn.y = 1045;
                } else {
                    this.propBox.visible = true;
                    this.propImg.skin = CommonUtil.getIconById(needItemId, true);
                    this.propTxt.text = CommonUtil.bigNumToString(needItemNum);
                    this.propTxt.color = myItemNum >= needItemNum ? `#168a17` : `#ff3e3e`;
                }
            } else {
                this.propBox.visible = false;
                this.needVipLvTxt.visible = true;
                this.needVipLvTxt.text = `需达到SVIP${this._needVip}`;
            }
        }

        private updateList(): void {
            let list: Array<FactionInfo> = FactionModel.instance.factionList;
            if (!list) return;
            list = list.sort(this.sortFunc.bind(this));
            this._list.datas = list;
            this.noImg.visible = this.noTxt.visible = !list.length;
        }

        private sortFunc(l: FactionInfo, r: FactionInfo): number {
            let lUuid: string = l[FactionInfoFields.uuid];
            let rUuid: string = r[FactionInfoFields.uuid];
            let lState: joinState = FactionModel.instance.getRequestJoinState(lUuid);
            let rState: joinState = FactionModel.instance.getRequestJoinState(rUuid);
            let lLv: number = l[FactionInfoFields.level];
            let rLv: number = r[FactionInfoFields.level];
            if (lLv > rLv) {
                return -1;
            } else if (lLv < rLv) {
                return 1;
            } else {
                if (lState > rState) {
                    return -1;
                } else if (lState < rState) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        private creatBtnHandler(): void {
            let myViplv: number = vip.VipModel.instance.vipLevel;
            if (myViplv < this._needVip) { //vip 不足
                let intNum = 0;
                if (modules.vip.VipModel.instance.vipLevel >= 1) {
                    intNum = WindowEnum.VIP_PANEL;
                }
                else {
                    intNum = WindowEnum.VIP_NEW_PANEL;
                }
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [intNum]);
                CommonUtil.alert("温馨提示", `您的SVIP等级不足,是否前往提升?`, [handler]);
                return;
            }
            let needItemId: number = this._needProp[ItemsFields.itemId];
            let needItemNum: number = this._needProp[ItemsFields.count];
            let myItemNum: number = PlayerModel.instance.getCurrencyById(needItemId);
            if (myItemNum == null) {
                myItemNum = bag.BagModel.instance.getItemCountById(needItemId);
            }
            if (myItemNum <= needItemNum) { //道具不足
                let propName: string = config.ItemMaterialCfg.instance.getItemCfgById(needItemId)[Configuration.item_materialFields.name];
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [WindowEnum.RECHARGE_PANEL]);
                CommonUtil.alert("温馨提示", `您的${propName}不足,是否前往提升?`, [handler]);
                return;
            }
            WindowManager.instance.open(WindowEnum.FACTION_CREATE_ALERT);
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}
