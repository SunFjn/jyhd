///<reference path="../rune_copy/rune_copy_model.ts"/>


namespace modules.rune {
    import RuneInlayItemUI = ui.RuneInlayItemUI;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import SystemNoticeManager = notice.SystemNoticeManager;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import runeRefineFields = Configuration.runeRefineFields;
    import ItemsFields = Configuration.ItemsFields;

    export class RunePit extends RuneInlayItemUI {

        private _type: number;
        private _needUnlockLayer: number;
        private _isUnlock: boolean;  //是否解锁  false是未解锁
        private _isCanInlay: boolean;  //是否可以镶嵌

        protected initialize(): void {
            super.initialize();

            this._needUnlockLayer = -1;
            this._isCanInlay = this._isUnlock = false;
        }

        protected onOpened(): void {
            super.onOpened();

            this.initView();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_INALY_SELECT, this, this.clickHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.initView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_UPDATE, this, this.initView);
        }

        private initView(): void {
            let pitType: number = 0;
            if (this._type > 8) pitType = 1;
            let tips: Array<string> = RuneModel.instance.tips;
            let intArr: string[] = tips[this._type - 1].split("#");
            this._needUnlockLayer = parseInt(intArr[intArr.length - 1]);

            let currLayer: number = RuneCopyModel.instance.finishLv;
            //已解锁
            if (currLayer >= this._needUnlockLayer) {
                this.addBtn.visible = this._isUnlock = true;
                this.iconImg.gray = this.dotImg.visible = this.lockImg.visible = false;
                let runeItems: Item[] = RuneModel.instance.canInlayRunes(pitType);
                let currInlayId: number = RuneModel.instance.slots[this._type];
                let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId);
                let nextCfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId + 1);
                let currType: number = CommonUtil.getStoneTypeById(currInlayId);
                //首先要筛选出其他玉荣槽镶嵌了哪些类型的玉荣
                //收集其他玉荣槽镶嵌过的类型
                let othersType: Table<number> = pitType == 0 ? RuneModel.instance.commonPitTypeRecode : RuneModel.instance.specialPitTypeRecode;
                let currCopyLv: number = RuneCopyModel.instance.finishLv;
                let currQuality: number = CommonUtil.getItemQualityById(currInlayId);
                //未镶嵌玉荣
                if (!currInlayId) {
                    if (this._type < 9) {
                        this.iconImg.skin = ``;
                    } else {
                        let id: ItemId = this.specialId;
                        let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                        let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                        this.iconImg.skin = `assets/icon/item/${dimCfg[item_runeFields.ico]}.png`;
                        this.iconImg.gray = true;
                    }
                    //是否能镶嵌玉荣
                    this._isCanInlay = false;
                    for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                        let id: number = runeItems[i][ItemFields.ItemId];
                        let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                        let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                        let needUnLockLv: number = dimCfg[item_runeFields.layer];
                        if (currCopyLv < needUnLockLv) continue;
                        let type: number = CommonUtil.getStoneTypeById(id);
                        if (othersType[type]) continue;//遇到相同类型跳过
                        this._isCanInlay = this.dotImg.visible = true;
                        break;
                    }
                    this.lvBox.visible = false;
                } else {  //已经镶嵌玉荣
                    //可以替换成更高级的
                    this.lvBox.visible = true;
                    this.dotImg.visible = this.addBtn.visible = false;
                    this.lvTxt.text = `Lv.${currInlayId % 10000}`;

                    let dimId: number = (currInlayId * 0.0001 >> 0) * 10000;  //模糊Id
                    let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                    this.iconImg.skin = `assets/icon/item/${dimCfg[item_runeFields.ico]}.png`;

                    for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                        let id: number = runeItems[i][ItemFields.ItemId];
                        let type: number = CommonUtil.getStoneTypeById(id);
                        if (othersType[type] && type != currType) continue;  //其他槽镶嵌过类型 跳过
                        dimId = (id * 0.0001 >> 0) * 10000;  //模糊Id
                        dimCfg = config.ItemRuneCfg.instance.getCfgById(dimId);
                        let needUnLockLv: number = dimCfg[item_runeFields.layer];
                        let quality: number = CommonUtil.getItemQualityById(id);
                        if (currLayer < needUnLockLv || quality < currQuality) continue;  //未解锁或者品质低 跳过
                        //如果品质高可以替换
                        let lv: number = id % 10000;
                        let currlv: number = currInlayId % 10000;
                        if (type == currType) {
                            if ((quality == currQuality && lv > currlv) || quality > currQuality) {  //相同类型 品质相同等级高或者 品质高
                                this.dotImg.visible = true;
                                return;
                            }
                        }
                    }
                }
                if (nextCfg) { //有下一级
                    let currExp: number = RuneModel.instance.exp;
                    let needExp: number = cfg[runeRefineFields.refineItem][ItemsFields.count];
                    this.dotImg.visible = currExp >= needExp;
                }
            } else {
                this.lvBox.visible = this.dotImg.visible = this.addBtn.visible = this._isUnlock = false;
                this.lockImg.visible = true;
            }
        }


        private clickHandler(index: number): void {
            if (index !== this._type - 1) return;
            let currInlayId: number = RuneModel.instance.slots[this._type];
            if (this._isUnlock && currInlayId) {  //解锁了有玉荣
                this.frameImg.visible = true;
                RuneModel.instance.currClickPit = RuneModel.instance.pitchRune = this._type;
            } else if (this._isUnlock && !currInlayId) { //解锁了没有玉荣
                if (this._isCanInlay) {
                    WindowManager.instance.open(WindowEnum.RUNE_BAG_ALERT, RuneModel.instance.currClickPit);
                } else {
                    if (this._type < 9) {
                        SystemNoticeManager.instance.addNotice(`无玉荣可镶嵌`, true);
                    } else {
                        let id: ItemId = this.specialId;
                        WindowManager.instance.open(WindowEnum.PROP_ALERT, [id, 1, 0, null]);
                    }
                }
            } else {
                SystemNoticeManager.instance.addNotice(`通关未央幻境${this._needUnlockLayer}关开启`, true);
            }
        }

        private get specialId(): number {
            let tNum: number = RuneModel.instance.getOtherSpecial;
            let id: ItemId;
            if (!tNum) {
                id = this._type == 9 ? RuneRefineCfg.instance.yang : RuneRefineCfg.instance.yin;
            } else {
                id = tNum;
            }
            return id;
        }

        public set type(index: number) {
            this._type = index;
        }
    }
}