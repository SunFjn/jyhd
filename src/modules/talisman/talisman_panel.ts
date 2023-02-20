///<reference path="../common/btn_group.ts"/>
///<reference path="../common/progress_bar_ctrl.ts"/>
///<reference path="../config/talisman_cfg.ts"/>
///<reference path="../config/talisman_cfg.ts"/>

/** 法术面板 */

namespace modules.talisman {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import BtnGroup = modules.common.BtnGroup;
    import TalismanViewUI = ui.TalismanViewUI;
    import TalismanCfg = modules.config.TalismanCfg;
    import amuletRefineFields = Configuration.amuletRefineFields;
    import AmuletRefineInfo = Protocols.AmuletRefineInfo;
    import CustomList = modules.common.CustomList;
    import AmuletRefineFields = Protocols.AmuletRefineFields;
    import AmuletRiseFields = Protocols.AmuletRiseFields;
    import amuletRiseFields = Configuration.amuletRiseFields;
    import AmuletRefineInfoFields = Protocols.AmuletRefineInfoFields;
    import BagModel = modules.bag.BagModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Image = laya.ui.Image;
    import amuletRefine = Configuration.amuletRefine;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import AttrUtil = modules.common.AttrUtil;
    import attr_itemFields = Configuration.attr_itemFields;
    import CustomClip = modules.common.CustomClip;

    type TalismanStateInfo = [AmuletRefineInfo, TalismanState];

    export class TalismanPanel extends TalismanViewUI {

        // 按钮组
        private _btnGroup: BtnGroup;

        private _itemsArray: Array<any>;

        private _upClip: CustomClip;
        // 属性
        private _list0: CustomList;

        private _showIds0: Array<any>;

        private _listMibao: CustomList;
        private _showIds: Array<any>;

        private _culLevel: number;
        private itemId: number;

        private _dotArr: Array<Image>;

        private _maxLevel: number;
        private _isZhiDing: number;//是否有指定打开的界面(封神榜相关跳转到圣物界面  固定跳到 第三个)

        private _nowNum: number = 0;
        private _allNum: number = 0;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._listMibao) {
                this._listMibao.removeSelf();
                this._listMibao.destroy();
                this._listMibao = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._list0) {
                this._list0.removeSelf();
                this._list0.destroy();
                this._list0 = null;
            }
            if (this._upClip) {
                this._upClip.removeSelf();
                this._upClip.destroy();
                this._upClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.qualityLv1Btn, this.qualityLv2Btn, this.qualityLv3Btn, this.qualityLv4Btn);

            this._maxLevel = 50;
            this._culLevel = 0;

            this._upClip = new CustomClip();
            this.upBtn.addChildAt(this._upClip, 0);
            this._upClip.pos(-5, -15, true);
            this._upClip.scale(1, 1.15);
            this._upClip.skin = "assets/effect/btn_light.atlas";
            this._upClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._upClip.durationFrame = 5;
            this._upClip.play();
            this._upClip.visible = true;

            this._itemsArray = new Array<any>();
            this._showIds0 = new Array<any>();
            this._showIds = new Array<any>();

            this._listMibao = new CustomList();
            this._listMibao.width = 507;
            this._listMibao.height = 380;
            this._listMibao.hCount = 3;
            this._listMibao.spaceX = 10;
            this._listMibao.spaceY = 2;
            this._listMibao.itemRender = TalismanItem;
            this._listMibao.x = 182;
            this._listMibao.y = 360
            this.addChild(this._listMibao);

            this._list0 = new CustomList();
            this._list0.width = 512;
            this._list0.height = 120;
            this._list0.hCount = 1;
            this._list0.spaceY = 6;
            this._list0.itemRender = ItemText;
            this._list0.x = 160;
            this._list0.y = 924;
            this.addChild(this._list0);


            this._dotArr = [this.redDot1, this.redDot2, this.redDot3, this.redDot4];
            for (let i = 0; i < this._dotArr.length; i++) {
                this._dotArr[i].visible = false;
            }
        }

        protected onOpened(): void {
            super.onOpened();

            this.getItem();
            if (this._isZhiDing) {
                this._btnGroup.selectedIndex = this._isZhiDing;
                this._isZhiDing = null;
            } else {
                this.openFirst();
            }


        }

        public close(): void {
            super.close();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._isZhiDing = value;

        }

        // 添加按钮回调
        protected addListeners(): void {
            super.addListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeMagicHandler);
            this.upBtn.on(Event.CLICK, this, this.upBtnHandler);
            this.lhsxBtn.on(Event.CLICK, this, this.lhsxBtnHandler);
            // this._btnGroup.selectedIndex = 0;
            GlobalData.dispatcher.on(CommonEventType.UPDATE_AMULET_INFO_REPLAY, this, this.updateItem);
            GlobalData.dispatcher.on(CommonEventType.GET_AMULET_INFO_REPLAY, this, this.getItem);
            GlobalData.dispatcher.on(CommonEventType.BAG_ADD_ITEM, this, this.updateItem);
            GlobalData.dispatcher.on(CommonEventType.REFINE_AMULET_REPLAY, this, this.amuletInfoReplay);
            this.addAutoListener(this._listMibao, LayaEvent.SELECT, this, this.selectHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MIBAO_SELECTED_ATTR, this, this.UpdateNowRefreshData);
        }

        private selectHandler(event: Event): void {
            // console.log("选择的数据:::", this._listMibao.selectedData);
        }

        private UpdateNowRefreshData(cfg: any): void {
            // console.log("选择的数据222:::", cfg);

            let rise = TalismanModel.instance.getAmuletRise();
            let refine = TalismanModel.instance.getAmuletRefine();

            let itemId = this.itemId = cfg[amuletRefineFields.id];
            let items = TalismanModel.instance.GetAmuletById(itemId);
            let level: number;
            if (items != null) {
                level = items[AmuletRefineInfoFields.level]
            } else {
                level = 0;
            }
            if (level > 0) {
                this.upBtn.label = "升级"
            } else {
                this.upBtn.label = "激活"
            }
            this.item.dataSource = [itemId, 1, 0, null];
            // this.fullChange(false);
            this.talismaLevel.text = cfg[item_materialFields.name];
            this.levelTxt.text = "LV." + level;
            let cccfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, level);
            let widt: number = 330;
            let num: number = cccfg[amuletRefineFields.items][1];
            let count = BagModel.instance.getItemCountById(itemId) + BagModel.instance.getItemCountById(cccfg[amuletRefineFields.universalId]);
            if (num != null) {
                this, this.upBtn.visible = true;
                this.nowExp.text = count.toString() + "/" + num;
                if (count / num >= 1) {
                    this.expPro.width = widt;
                    this.clipStop(true);
                    // console.log("clip show!!!!");

                } else {
                    this.expPro.width = widt * (count / num);
                    // console.log("clip close!!!!");
                    this.clipStop(false);
                }
            } else {
                this.nowExp.text = "已满级";
                // this.nowExp.color="#00ad35"
                this.expPro.width = widt;
                // this.fullChange(true);
                // this.upBtn.visible=false;
                // this.getTalisman.visible=false;
                this.clipStop(false);
                // console.log("clip close!!!!");
            }
            this.setNormalAttrs(level);
            // this.setRiseAttrs(level);

            this._nowNum = num;
            this._allNum = count;
        }

        private clipStop(bool: boolean) {
            if (bool != false) {
                this._upClip.play();
                this._upClip.visible = true;
            } else {
                this._upClip.stop();
                this._upClip.visible = false;
            }
        }
        private lhsxBtnHandler() {
            WindowManager.instance.openDialog(WindowEnum.TALISMAN_DIALOG, this.itemId);
        }
        private upBtnHandler() {
            if (this._nowNum > this._allNum) {
                SystemNoticeManager.instance.addNotice("圣物数量不足", true);
                return;
            }
            TalismanModel.instance._itemId = this.itemId;
            Channel.instance.publish(UserFeatureOpcode.RefineAmulet, [this.itemId]);
        }
        private setNormalAttrs(level: number) {
            this._showIds0.length = 0;
            let cfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, level);
            let nextCfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, level + 1);
            let curAttrs: Array<attr> = cfg[amuletRefineFields.attrs];
            let nextAttrs: Array<attr> = nextCfg ? nextCfg[amuletRefineFields.attrs] : null;
            let attrs: Array<attr> = nextAttrs || curAttrs;
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let curAttrValue: number = curAttrs[i] ? curAttrs[i][attrFields.value] : 0;
                let attrName: string = attrCfg[attr_itemFields.name];
                let isPercent: number = attrCfg[attr_itemFields.isPercent];
                let curAttrStr: string = isPercent ? AttrUtil.formatFloatNum(curAttrValue) + "%" : Math.round(curAttrValue) + "";
                let arr: Array<string>;
                if (nextCfg) {
                    let nextAttrValue: number = nextAttrs[i] ? nextAttrs[i][attrFields.value] : 0;
                    let nextAttrStr: string = isPercent ? AttrUtil.formatFloatNum(nextAttrValue) + "%" : Math.round(nextAttrValue) + "";
                    arr = [attrName + " " + curAttrValue, attrName + "" + nextAttrValue, "#00ad35"];
                } else {
                    arr = [attrName + " " + curAttrValue, "", "#00ad35"];
                }
                this._showIds0.push(arr)
            }
            // 修为值
            let arr: Array<string>;
            if (nextCfg) {
                arr = ["修为值" + " " + cfg[amuletRefineFields.cultivation], "修为值" + " " + nextCfg[amuletRefineFields.cultivation], "#00ad35"];
            } else {
                arr = ["修为值" + " " + cfg[amuletRefineFields.cultivation], "", "#00ad35"];
            }
            this._showIds0.push(arr);
            this._list0.datas = this._showIds0;
        }


        // 删除按钮回调
        protected removeListeners(): void {
            super.removeListeners();
            this._btnGroup.off(Event.CHANGE, this, this.changeMagicHandler);
            this.upBtn.off(Event.CLICK, this, this.upBtnHandler);
            this.lhsxBtn.off(Event.CLICK, this, this.lhsxBtnHandler);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_AMULET_INFO_REPLAY, this, this.updateItem);
            GlobalData.dispatcher.off(CommonEventType.GET_AMULET_INFO_REPLAY, this, this.getItem);
            GlobalData.dispatcher.off(CommonEventType.BAG_ADD_ITEM, this, this.updateItem);
            GlobalData.dispatcher.off(CommonEventType.REFINE_AMULET_REPLAY, this, this.amuletInfoReplay);
        }

        private amuletInfoReplay() {
            let result = TalismanModel.instance.RefineAmuletReplay;
            switch (result[0]) {
                case ErrorCode.ItemNotEnough: {
                    SystemNoticeManager.instance.addNotice("圣物数量不足", true);
                }
                    break;
                case ErrorCode.AmuletNotAddLevel: {
                    SystemNoticeManager.instance.addNotice("圣物已满级", false);
                }
                    break;
                case 0: {
                    if (result[1] == 1) {
                        if (TalismanModel.instance._itemId) {
                            WindowManager.instance.openDialog(WindowEnum.TALISMAN_GET_ALERT, TalismanModel.instance._itemId);
                            TalismanModel.instance._itemId = 0;
                        }

                    } else {
                        SystemNoticeManager.instance.addNotice("升级成功", false);
                    }
                }
                    break;
            }
        }

        public getItem(): void {
            let rise = TalismanModel.instance.getAmuletRise();
            let riseLevel = rise[AmuletRiseFields.level];
            this._culLevel = riseLevel;
            this.updateItem();
        }

        public updateItem(): void {
            let rise = TalismanModel.instance.getAmuletRise();
            let riseLevel = rise[AmuletRiseFields.level];
            let riseCultivation = rise[AmuletRiseFields.cultivation];
            let refine = TalismanModel.instance.getAmuletRefine();
            let cfg = TalismanCfg.instance.getRiseCfgByLevel(riseLevel);
            let nextRisecultivation = cfg[amuletRiseFields.cultivation];
            let widt: number = 238;
            if (riseLevel > this._culLevel) {
                WindowManager.instance.openDialog(WindowEnum.TALISMAN_UP_ALERT, riseLevel);
                this._culLevel = riseLevel;
            }
            if (riseLevel > 0) {
                this.expLevel.skin = `assets/icon/ui/amulet/${riseLevel}.png`;
            }
            if (riseCultivation / nextRisecultivation >= 1) {
                this.expText.text = "已满阶";
                this.proImg.width = widt;
            } else {
                this.expText.text = riseCultivation + "/" + nextRisecultivation;
                this.proImg.width = widt * (riseCultivation / nextRisecultivation);
            }

            this.magicUpLimit.text = cfg[amuletRiseFields.maxSkillLevel].toString();
            this.magicAttack.text = "+" + (cfg[amuletRiseFields.skillDamage] * 100).toFixed() + "%";
            this.powerNum.value = refine[AmuletRefineFields.fighting].toString();

            this._showIds.length = 0;

            for (let i = 0; i < this._itemsArray.length; i++) {
                let itemCfg = this._itemsArray[i];
                let id = this._itemsArray[i][amuletRefineFields.id];
                let level = this._itemsArray[i][amuletRefineFields.level];
                let arr1: TalismanStateInfo;
                let count = BagModel.instance.getItemCountById(id) + BagModel.instance.getItemCountById(itemCfg[amuletRefineFields.universalId]);
                let num = itemCfg[amuletRefineFields.items][1];
                if (level == 0) {
                    if (num != null && count >= num) {
                        arr1 = [itemCfg, TalismanState.active];
                    } else {
                        arr1 = [itemCfg, TalismanState.withouract];
                    }
                } else if (level == this._maxLevel) {
                    arr1 = [itemCfg, TalismanState.maxlevel];
                } else {
                    if (num != null && count >= num) {
                        arr1 = [itemCfg, TalismanState.up];
                    } else {
                        arr1 = [itemCfg, TalismanState.cantup];
                    }
                }
                this._showIds.push(arr1);
            }
            this._showIds.sort((l: TalismanStateInfo, r: TalismanStateInfo): number => {
                if (l[1] == r[1]) {
                    return l[0][AmuletRefineInfoFields.level] > r[0][AmuletRefineInfoFields.level] ? -1 : 1;
                }
                return l[1] > r[1] ? -1 : 1;
            });
            this.setRedDot();
            this._listMibao.datas = this._showIds;
        }

        private setRedDot(): void {
            let redDotArr = TalismanModel.instance.getRedDot();
            for (let i = 0; i < redDotArr.length; i++) {
                this._dotArr[i].visible = redDotArr[i];
            }
        }

        private openFirst(): void {
            let redDotArr = TalismanModel.instance.getRedDot();
            let first: number;
            for (let i = 0; i < redDotArr.length; i++) {
                if (redDotArr[i] == true) {
                    first = i;
                    break;
                }
            }
            if (first != null) {
                this._btnGroup.selectedIndex = first;
            } else {
                this._btnGroup.selectedIndex = 0;
            }
        }

        // 切换圣物
        private changeMagicHandler(): void {
            this._itemsArray = TalismanModel.instance.getAmuletRefineQualityArray(this._btnGroup.selectedIndex);
            this.getItem();
        }

    }
}
