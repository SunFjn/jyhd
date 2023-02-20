namespace modules.rune {
    import RuneResolveAlertUI = ui.RuneResolveAlertUI;
    import CustomList = modules.common.CustomList;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import Button = Laya.Button;
    import Event = Laya.Event;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import runeRefineFields = Configuration.runeRefineFields;
    import idCountFields = Configuration.idCountFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import IMsg = Protocols.IMsg;
    import TableUtils = utils.TableUtils;

    export class RuneResolveAlert extends RuneResolveAlertUI {

        private _list: CustomList;
        private _tab: Table<boolean>;
        private _resolveRecordArr: number[];
        private _resolveBtnArr: Array<Button>;
        private _resolveCDTime: number;

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._resolveBtnArr = this.destroyElement(this._resolveBtnArr);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 558;
            this._list.height = 574;
            this._list.hCount = 2;
            this._list.spaceY = 5;
            this._list.spaceX = 4;
            this._list.itemRender = RuneResolveItem;
            this._list.x = 50;
            this._list.y = 116;
            this.addChild(this._list);

            this._resolveRecordArr = RuneModel.instance.rflags;
            this._resolveBtnArr = [this.pitchBtn_0, this.pitchBtn_1, this.pitchBtn_2, this.pitchBtn_3, this.pitchBtn_4];
            for (let i: int = 0, len: int = this._resolveRecordArr.length; i < len; i++) {
                this._resolveBtnArr[this._resolveRecordArr[i]].selected = true;
            }
            this._resolveCDTime = 0;


            this.propImg.skin = CommonUtil.getIconById(91740001, true);
            this.runeChipImg.skin = CommonUtil.getIconById(13250008, true);
        }

        protected addListeners(): void {
            super.addListeners();
            Laya.timer.loop(1000, this, this.loopHandler);

            for (let i: int = 0, len: int = this._resolveBtnArr.length; i < len; i++) {
                this.addAutoListener(this._resolveBtnArr[i], Event.CLICK, this, this.resolveTypeCheck, [i]);
            }
            this.addAutoListener(this.oneKeyBtn, Event.CLICK, this, this.oneKeyBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, "updateResolveItems", this, this.updateResolveItems);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_RESOLVE_SUCCEED, this, this.startKeepCDTime);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            this._resolveCDTime = null;

            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.initView();
            CustomList.showListAnim(modules.common.showType.HEIGHT, this._list);
        }

        private startKeepCDTime(): void {
            this._resolveCDTime = BlendCfg.instance.getCfgById(23003)[blendFields.intParam][0] + 1;
            this.initView();
        }

        private loopHandler(): void {
            if (this._resolveCDTime <= 1) {
                return;
            } else {
                this._resolveCDTime -= 1000;
            }
        }

        private resolveTypeCheck(index: int): void {
            this._resolveBtnArr[index].selected = !this._resolveBtnArr[index].selected;

            let result: boolean = this._resolveBtnArr[index].selected;
            if (result) { //选中  是否记录过
                let len: number = this._resolveRecordArr.length;
                if (!len) this._resolveRecordArr.push(index);
                else {
                    for (let i: int = 0; i < len; i++) {
                        if (this._resolveRecordArr[i] == index) break;
                        if (i == len - 1) {
                            this._resolveRecordArr.push(index);
                            break;
                        }
                    }
                }
            } else {  //取消选中
                for (let i: int = 0, len: int = this._resolveRecordArr.length; i < len; i++) {
                    if (this._resolveRecordArr[i] == index) {
                        this._resolveRecordArr.splice(i, 1);
                        break;
                    }
                }
            }
            RuneModel.instance.rflags = this._resolveRecordArr;
            TableUtils.clear(RuneModel.instance.resolveList);
            GlobalData.dispatcher.event("setCheck");
            RuneCtrl.instance.setResolveRuneFlag([this._resolveRecordArr]);
            this.updateResolveItems();
            if ((index == 0) && this._resolveBtnArr[index].selected) {
                RuneCtrl.instance.autoResolveRune();
            }
        }

        private initView(): void {

            this._tab = {};
            //所有已经镶嵌过的类型
            for (let key in RuneModel.instance.commonPitTypeRecode) {
                this._tab[key] = !!RuneModel.instance.commonPitTypeRecode[key];
            }
            for (let key in RuneModel.instance.specialPitTypeRecode) {
                this._tab[key] = !!RuneModel.instance.specialPitTypeRecode[key];
            }

            //玉荣仓库列表
            let runeItems: Array<Protocols.Item> = [];
            let tItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            for (let item of tItems) {
                let itemId: ItemId = item[ItemFields.ItemId];
                let count: int = item[ItemFields.count];
                let uId: Uid = item[ItemFields.uid];
                let iMsg: IMsg = item[ItemFields.iMsg];
                //是否是精华玉荣
                if (CommonUtil.getStoneTypeById(itemId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                    runeItems.push(item);
                } else {
                    for (let i: int = 0; i < count; i++) {
                        runeItems.push([itemId, 1, uId, iMsg]);
                    }
                }
            }
            runeItems = runeItems.sort(this.sortFunc.bind(this));
            RuneModel.instance.resolveList = {};
            this._list.datas = runeItems;
            this.updateResolveItems();
        }

        private updateResolveItems(): void {
            let num: number = 0;
            let num_runeChip: number = 0;
            let tab: Table<number> = RuneModel.instance.resolveList;
            for (let key in tab) {
                let runeUid: number = parseInt(key);
                let runeId: number = BagModel.instance.getItemByBagIdUid(BagId.rune, runeUid)[ItemFields.ItemId];
                let bagCount: number = BagModel.instance.getItemByBagIdUid(BagId.rune, runeUid)[ItemFields.count];
                let isSpecial: boolean = CommonUtil.getStoneTypeById(runeId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId;
                let count: number = isSpecial ? bagCount : tab[key];
                if (tab[key]) {
                    let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(runeId);
                    if (cfg[runeRefineFields.resolveItems][0]) {
                        num += cfg[runeRefineFields.resolveItems][0][idCountFields.count] * count;
                    }
                    if (cfg[runeRefineFields.resolveItems][1]) {
                        num_runeChip += cfg[runeRefineFields.resolveItems][1][idCountFields.count] * count;
                    }
                }
            }
            this.propTxt.text = num.toString();
            this.runeChipTxt.text = num_runeChip.toString();
        }

        private sortFunc(a: Item, b: Item): number {
            //首先区分是否是已经镶嵌属性
            //未镶嵌的属性 按品质从高到低 等级从大到小
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            let aType: number = CommonUtil.getStoneTypeById(aItemId);
            let bType: number = CommonUtil.getStoneTypeById(bItemId);

            //精华玉荣排在后面
            if (aType === config.ItemRuneCfg.instance.resolveRuneSubTypeId && bType === config.ItemRuneCfg.instance.resolveRuneSubTypeId) { //都是精华玉荣
                if (aQuality > bQuality) {
                    return -1;
                } else if (aQuality < bQuality) {
                    return 1;
                } else {
                    if (aItemId > bItemId) {
                        return -1;
                    } else if (aItemId < bItemId) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else if (aType !== config.ItemRuneCfg.instance.resolveRuneSubTypeId && bType !== config.ItemRuneCfg.instance.resolveRuneSubTypeId) {  //都不是精华玉荣
                let aIsHave: boolean = this._tab[aType];
                let bIsHave: boolean = this._tab[bType];

                if (!aIsHave && bIsHave) {  //未镶嵌排在前面
                    return -1;
                } else if (aIsHave && !bIsHave) {
                    return 1;
                } else {   //两个都未镶嵌 或者 已经镶嵌
                    if (aQuality > bQuality) {
                        return -1;
                    } else if (aQuality < bQuality) {
                        return 1;
                    } else {
                        if (aItemId > bItemId) {
                            return -1;
                        } else if (aItemId < bItemId) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else if (aType === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                return 1;
            } else if (bType === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                return -1;
            }
        }

        private oneKeyBtnHandler(): void {
            if (this._resolveCDTime > 1) {
                SystemNoticeManager.instance.addNotice(`冷却中，请${Math.floor(this._resolveCDTime / 1000)}s后再试`, true);
                return;
            }
            let pairs: Protocols.Pair[] = [];
            let specialRuneIds: number[] = [];
            let isHaveSpecialRune: boolean;
            let tab: Table<number> = RuneModel.instance.resolveList;
            for (let key in tab) {
                if (tab[key]) {
                    let uId: Uid = parseInt(key);
                    let count: int = tab[key];
                    pairs.push([uId, count]);
                    let itemId: ItemId = BagModel.instance.getItemByBagIdUid(BagId.rune, uId)[ItemFields.ItemId];
                    if (CommonUtil.getStoneTypeById(itemId) >= 90) {
                        specialRuneIds.push(itemId);
                        isHaveSpecialRune = true;
                    }
                }
            }
            if (isHaveSpecialRune) {
                //弹出提示框
                WindowManager.instance.open(WindowEnum.RUNE_HINT_RESOLVE_ALERT, [pairs, specialRuneIds]);
            } else {
                RuneCtrl.instance.resolveRune(pairs);
            }
        }
    }
}