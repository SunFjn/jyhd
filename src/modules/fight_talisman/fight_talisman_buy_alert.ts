namespace modules.fight_talisman {
    import CustomClip = common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import fight_talismanFields = Configuration.fight_talismanFields;
    import RechargeCfg = config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import BlendCfg = config.BlendCfg;
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    import ItemsFields = Configuration.ItemsFields;
    import FightTalismanCfg = modules.config.FightTalismanCfg;
    import fight_talisman = Configuration.fight_talisman;

    export class FightTalismanBuyAlert extends ui.FightTalismanBuyAlertUI {
        constructor() {
            super();
        }

        private _getBtnEff: CustomClip;  //按钮粒子效果
        private items: Array<BaseItem>;

        protected initialize(): void {
            super.initialize();

            //按钮粒子效果
            this._getBtnEff = CommonUtil.creatEff(this.getBtn, "btn_light", 15);
            this._getBtnEff.pos(-10, -18);
            this._getBtnEff.scale(1.16, 1.08);
            this._getBtnEff.visible = true;
            this._getBtnEff.play();


            let rewardItemID: number = RechargeCfg.instance.getRecharCfgByIndex(5)[rechargeFields.reward][0][ItemsFields.itemId];
            let itemType: number = CommonUtil.getItemTypeById(rewardItemID);
            if (itemType == ItemMType.Unreal) {
                this.rewardItemImg.skin = CommonUtil.getIconById(rewardItemID, true);
            } else {
                this.rewardItemImg.skin = CommonUtil.getIconById(rewardItemID, false);
            }
            // console.log("INITTIMES"); ONCE
        }

        public destroy(): void {
            if (this._getBtnEff) {
                this._getBtnEff.destroy();
                this._getBtnEff = null;
            }
            this.items = this.destroyElement(this.items);

            super.destroy();
        }

        /**
         * 自动计算item居中排序
         * @param num item组的数量
         * @param posY item的y的值
         * @param scaleItem item的缩放
         */
        private itemsCalcul(num: number, posY: number, scaleItem: number = 1) {
            this.items = this.destroyElement(this.items);
            this.items = [];
            let widH = scaleItem * 100
            let mLength = widH * num + 7 * (num - 1);
            let splice = (mLength - widH) / 2;
            for (let i = 0; i < num; i++) {
                let item: BaseItem = this.items[i];
                if (!item) {
                    item = new BaseItem();
                }
                let itemX = (widH + 7) * i;
                item.y = posY;
                this.addChild(item);
                item.scale(scaleItem, scaleItem);
                item.centerX = itemX - splice;
                this.items[i] = item;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, Laya.Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.getDoubleBtn, Laya.Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.update);       //画面刷新事件
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();
            this._getBtnEff.play();
            this.update();
        }

        private update(): void {
            // 根据不同的激活情况弹出不同类型的弹窗
            this.typeChanged();

            this.returnTxt.text = `${RechargeCfg.instance.getRecharCfgByIndex(5)[rechargeFields.reward][0][ItemsFields.count]}`;
            let select = FightTalismanModel.instance.selected + 1 == 4 ? 3 : FightTalismanModel.instance.selected + 1
            if (FightTalismanModel.instance.currMedalType() !== select) {
                if (FightTalismanModel.instance.actived == -1) {
                    this.getBtn.visible = true;
                    this.getBtn.label = "领取";

                } else {
                    this.getBtn.visible = true;
                    this.getBtn.label = `${RechargeCfg.instance.getRecharCfgByIndex(5)[rechargeFields.price]}元投资`;
                }
            } else {
                this.getBtn.visible = true;
                this._getBtnEff.play();
                this.getBtn.label = `${RechargeCfg.instance.getRecharCfgByIndex(5)[rechargeFields.price]}元投资`;
            }
        }

        private getBtnHandler(): void {
            //state为true是已购买，是已领取用已激活重数是否为-1来判断
            let currType = FightTalismanModel.instance.currMedalType();
            let selected = FightTalismanModel.instance.selected;
            let stateType = FightTalismanModel.instance.allState[selected];
            let activeType = FightTalismanModel.instance.allActived[selected]

            // 如果满足购买（true）但未激活（-1）时，则点击激活
            console.log("买了", FightTalismanModel.instance.allState, FightTalismanModel.instance.allActived, selected);
            if (stateType == true && activeType == -1) {
                FightTalismanCtrl.instance.activeTalisman(selected);
                this.close()
            } else {
                let price: number = RechargeCfg.instance.getRecharCfgByIndex(5)[rechargeFields.price];
                switch (currType) {
                    case 1:
                        PlatParams.askPay(5, price);        //购买野兽勋章
                        break;
                    case 2:
                        price = RechargeCfg.instance.getRecharCfgByIndex(501)[rechargeFields.price];
                        PlatParams.askPay(501, price);        //购买祝福勋章
                        break;
                    case 3:
                        price = RechargeCfg.instance.getRecharCfgByIndex(502)[rechargeFields.price];
                        PlatParams.askPay(502, price);        //购买觉醒&图腾勋章
                        break;
                    default:
                        console.log("错误的弹窗类型:", currType);
                        this.close();
                        break;
                }
            }
        }

        /** 根据不同的激活情况弹出不同类型的弹窗 */
        private typeChanged() {
            let currType = FightTalismanModel.instance.currMedalType();
            let arr: Array<number>;

            // 可以都点开弹窗时，激活类型弹窗改为点击的对应类型弹窗
            if ((FightTalismanModel.instance.currMedalType() !== FightTalismanModel.instance.selected + 1) && FightTalismanModel.instance.actived == -1) {
                currType = FightTalismanModel.instance.selected + 1;
            }
            // this.medalName.text = FightTalismanCfg.instance.getCfgByEraAId(currType, 0)[fight_talismanFields.name];
            this.iconType.skin = `fight_talisman_and_money_cat/image_xz${currType}.png`;
            this.iconTypeBg.skin = `fight_talisman_and_money_cat/img_buy${currType}.png`;
            this.singleMedal.visible = (currType == 3 || currType == 4) ? false : true;
            this.doubleMedal.visible = (currType == 3 || currType == 4) ? true : false;

            if (currType == 3 || currType == 4) {
                arr = BlendCfg.instance.getCfgById(49004)[blendFields.intParam];
                this.icon3.dataSource = [arr[0], arr[1], 0, null]
                this.icon4.dataSource = [arr[2], arr[3], 0, null]

                this.itemsCalcul(6, 920, 0.8);
                for (let i = 2; i < 8; ++i) {
                    if (!arr[i * 2]) { break; }
                    this.items[i - 2].dataSource = [arr[i * 2], arr[i * 2 + 1], 0, null];
                }
            } else if (currType == 1) {
                arr = BlendCfg.instance.getCfgById(49002)[blendFields.intParam];
                this.iconSingle.dataSource = [arr[0], arr[1], 0, null]

                this.itemsCalcul(5, 920, 0.8);
                for (let i = 1; i < 6; ++i) {
                    if (!arr[i * 2]) { break; }
                    this.items[i - 1].dataSource = [arr[i * 2], arr[i * 2 + 1], 0, null];
                }
            } else if (currType == 2) {
                arr = BlendCfg.instance.getCfgById(49003)[blendFields.intParam];
                this.iconSingle.dataSource = [arr[0], arr[1], 0, null]

                this.itemsCalcul(6, 920, 0.8);
                for (let i = 1; i < 7; ++i) {
                    if (!arr[i * 2]) { break; }
                    this.items[i - 1].dataSource = [arr[i * 2], arr[i * 2 + 1], 0, null];
                }
            }
        }
    }
}