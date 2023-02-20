namespace modules.stone {
    import StonePitUI = ui.StonePitUI;
    import StoneCfg = modules.config.StoneCfg;
    import gemRefineFields = Configuration.gemRefineFields;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import PlayerModel = modules.player.PlayerModel;

    export class StonePit extends StonePitUI {

        // 0 vip  1234 青龙 白虎 朱雀 玄武
        private _type: number;
        private _equipsCount: number;

        protected initialize(): void {
            super.initialize();
            this._equipsCount = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, common.LayaEvent.CLICK, this, this.openStoneListAlert);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.STONE_UPDATA, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.equipInitedHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.equipInitedHandler();
        }

        private updateView(): void {

            let currEqiup: number = StoneModel.instance.currEqiup;
            let stoneId: number = StoneModel.instance.getValueByPart().get(currEqiup * 10 + this._type);

            this.arrImg.visible = this.redImg.visible = false;
            this.hintTxt.text = "";

            if (!stoneId)   //没有宝石
            {
                this.addImg.visible = true;
                this.txtBgImg.visible = false;
                this.iconImg.skin = null;
                if (!this._type && StoneModel.instance.vipIsOpen) {
                    if (BagModel.instance.getItemsByBagId(BagId.stoneType).length > 0) {
                        this.redImg.visible = true;
                        this.hintTxt.text = "可镶嵌";
                    }
                } else if (!this._type && !StoneModel.instance.vipIsOpen) {
                    this.addImg.visible = false;
                } else {               //非 vip
                    if (StoneModel.instance.getStonesByType(this._type).length > 0) {
                        this.redImg.visible = true;
                        this.hintTxt.text = "可镶嵌";
                    }
                }
                this.nameTxt.text = "";
            } else {             //有宝石的时候
                this.iconImg.skin = CommonUtil.getIconById(stoneId);
                this.addImg.visible = false;
                this.nameTxt.text = StoneCfg.instance.getCfgById(stoneId)[gemRefineFields.name].toString();
                this.nameTxt.color = CommonUtil.getColorById(stoneId);
                this.txtBgImg.visible = true;
                //如果能替换成高级石头
                let stones: Array<Item> = null;
                if (!this._type && StoneModel.instance.vipIsOpen) {
                    stones = BagModel.instance.getItemsByBagId(BagId.stoneType).concat();
                } else {
                    stones = StoneModel.instance.getStonesByType(StoneCfg.instance.getCfgById(stoneId)[gemRefineFields.type]);
                }
                if (stones)
                    stones = stones.sort(StoneModel.instance.sortStones);
                for (let i: int = 0; i < stones.length; i++) {
                    //如果有高等级的
                    if (StoneCfg.instance.getCfgById(stones[i][ItemFields.ItemId])[gemRefineFields.level] > StoneCfg.instance.getCfgById(stoneId)[gemRefineFields.level]) {
                        this.redImg.visible = true;
                        this.hintTxt.text = "可替换";
                        return;
                    }
                }

                //如果能合成升级
                if (StoneCfg.instance.getCfgById(stoneId)[gemRefineFields.level] != StoneCfg.instance.stoneMaxLv) {
                    if (BagModel.instance.getItemCountById(stoneId) + 1 >= StoneCfg.instance.getCfgById(stoneId)[gemRefineFields.refine_count]) {
                        this.arrImg.visible = true;
                        this.hintTxt.text = "可升级";
                    }
                }
            }
        }

        private openStoneListAlert(): void {

            if (!this._equipsCount) return;

            StoneModel.instance.currStonePic = this._type;
            if (!this._type)       //背包有多余宝石
            {
                let _num: number = 0;
                for (let i: int = 1; i < 5; i++) {
                    if (StoneModel.instance.getStonesByType(i).length > 0)
                        _num++;
                }

                if (_num <= 0) {
                    SystemNoticeManager.instance.addNotice("无徽章可替换", true);
                    return;
                }
            } else {
                if (StoneModel.instance.getStonesByType(this._type).length <= 0) {
                    SystemNoticeManager.instance.addNotice("无徽章可替换", true);
                    return;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SELECT_PIT);
        }

        // 装备数据初始化
        private equipInitedHandler(): void {
            this._equipsCount = PlayerModel.instance.equipsDic.keys.length;
        }

        public set type(_type: number) {
            this._type = _type;
            if (this._type == 1 || this._type == 3) {
                this.nameTxt.anchorX = 0;
                this.nameTxt.x = -6;
                this.nameTxt.align = "left";
            } else if (this._type == 2 || this._type == 4) {
                this.nameTxt.anchorX = 1;
                this.nameTxt.x = this.width + 4;
                this.nameTxt.align = "right";
            } else {
                this.bgImg.visible = false;
                this.txtBgImg.skin = `stone/txtbg_xs_bg1.png`;
            }
        }
    }
}