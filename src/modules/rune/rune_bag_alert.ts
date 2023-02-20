namespace modules.rune {
    import RuneBagAlertUI = ui.RuneBagAlertUI;
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;

    export class RuneBagAlert extends RuneBagAlertUI {

        private _list: CustomList;
        private _recordTab: Table<number>;
        private _index: number;

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 555;
            this._list.height = 562;
            this._list.hCount = 1;
            this._list.spaceY = 5;
            this._list.itemRender = RuneBagItem;
            this._list.x = 53;
            this._list.y = 114;
            this.addChild(this._list);

            this._recordTab = {};
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getWayBtn, common.LayaEvent.CLICK, this, this.getWayHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.upDateView();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._index = value as number;
        }

        private upDateView(): void {

            let arr: Array<Protocols.Item> = [];
            let recordTab: Table<boolean> = {};
            let recordInlayTab: Table<boolean> = {};

            //玉荣仓库列表
            RuneModel.instance.currPitType = this._index;
            let runeItems: Array<Protocols.Item> = RuneModel.instance.canInlayRunes(RuneModel.instance.currPitType);
            let items: Item[] = BagModel.instance.getItemsByBagId(BagId.rune);
            this.capacityTxt.text = `容量: ${items ? items.length : 0}/${BlendCfg.instance.getCfgById(10008)[blendFields.intParam][0]}`;
            this._recordTab = RuneModel.instance.currPitType == 0 ? RuneModel.instance.commonPitTypeRecode : RuneModel.instance.specialPitTypeRecode;
            for (let key in this._recordTab) {
                recordInlayTab[this._recordTab[key]] = true;
            }

            for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                let itemId: number = runeItems[i][ItemFields.ItemId];
                //过滤其他部位已经镶嵌的玉荣 和重复玉荣
                if ((recordInlayTab[itemId] != null) || recordTab[itemId]) {
                    continue;
                }
                recordTab[itemId] = true;
                arr.push(runeItems[i]);
            }

            runeItems = arr.sort(this.runeTypeSort.bind(this));

            let currInalyId: number = RuneModel.instance.slots[this._index];
            if (currInalyId) {
                runeItems.unshift([currInalyId, 0, 0, null]);
            }
            this._list.datas = runeItems;
        }

        //玉荣排序  先排类型  再排品质 再排等级
        private runeTypeSort(a: Item, b: Item): number {

            let currCopyLv: number = RuneCopyModel.instance.finishLv;
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aDimId: number = (aItemId * 0.0001 >> 0) * 10000;  //模糊Id
            let aDimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(aDimId);
            let aNeedUnLockLv: number = aDimCfg[item_runeFields.layer];
            let bDimId: number = (bItemId * 0.0001 >> 0) * 10000;  //模糊Id
            let bDimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(bDimId);
            let bNeedUnLockLv: number = bDimCfg[item_runeFields.layer];
            let aIsUnlock: boolean = currCopyLv >= aNeedUnLockLv;
            let bIsUnlock: boolean = currCopyLv >= bNeedUnLockLv;
            let aType: number = CommonUtil.getStoneTypeById(aItemId);
            let bType: number = CommonUtil.getStoneTypeById(bItemId);
            let aLv: number = a[ItemFields.ItemId] % 10000;
            let bLv: number = b[ItemFields.ItemId] % 10000;
            let currInlayType: number = CommonUtil.getStoneTypeById(RuneModel.instance.slots[this._index]);
            let aNoSameType: boolean = aType !== currInlayType;
            let bNoSameType: boolean = bType !== currInlayType;
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            if (this._recordTab[aType] && aNoSameType && this._recordTab[bType] && bNoSameType) {  //都不能镶嵌
                if (aQuality > bQuality) {
                    return -1;
                } else if (aQuality < bQuality) {
                    return 1;
                } else {  //品质相同 排等级
                    if (aLv > bLv) {
                        return -1;
                    } else if (aLv < bLv) {
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
            } else if (this._recordTab[bType] && bNoSameType) {  //b 不能镶嵌
                return -1;
            } else if (this._recordTab[aType] && aNoSameType) {  // a 不能镶嵌
                return 1;
            } else { //都没镶嵌过
                if (!aIsUnlock && !bIsUnlock) {  //都没解锁
                    if (aQuality > bQuality) {
                        return -1;
                    } else if (aQuality < bQuality) {
                        return 1;
                    } else {  //品质相同 排等级
                        if (aLv > bLv) {
                            return -1;
                        } else if (aLv < bLv) {
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
                } else if (!aIsUnlock) {  //a没解锁
                    return 1;
                } else if (!bIsUnlock) {//b没解锁
                    return -1;
                } else {    //都解锁了  判断类型 同类型排前面
                    if (aNoSameType && bNoSameType) { //a和b都不是相似类型
                        if (aQuality > bQuality) {
                            return -1;
                        } else if (aQuality < bQuality) {
                            return 1;
                        } else {  //品质相同 排等级
                            if (aLv > bLv) {
                                return -1;
                            } else if (aLv < bLv) {
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
                    } else if (aNoSameType) {   //a 不是相似类型
                        return 1;
                    } else if (bNoSameType) {   //b 不是相似类型
                        return -1;
                    } else {   //a 和 b 都是相似类型
                        if (aQuality > bQuality) {
                            return -1;
                        } else if (aQuality < bQuality) {
                            return 1;
                        } else {  //品质相同 排等级
                            if (aLv > bLv) {
                                return -1;
                            } else if (aLv < bLv) {
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
                    }
                }
            }
        }

        private getWayHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_COPY_PANEL);
        }
    }
}