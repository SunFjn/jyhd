/** 圣物单元项 */


namespace modules.talisman {
    import amuletRefineFields = Configuration.amuletRefineFields;
    import item_equip = Configuration.item_equip;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import item_stone = Configuration.item_stone;

    import Event = laya.events.Event;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import TalismanCfg = modules.config.TalismanCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import AmuletRefineInfoFields = Protocols.AmuletRefineInfoFields;

    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import AmuletRise = Protocols.AmuletRise;
    import AmuletRefine = Protocols.AmuletRefine;
    import item_rune = Configuration.item_rune;
    import runeRefine = Configuration.runeRefine;
    import GuideModel = modules.guide.GuideModel;
    import CommonUtil = modules.common.CommonUtil;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import amuletRefine = Configuration.amuletRefine;

    export class TalismanAlert extends ui.TalismanAlertUI {
        private itemId: number;
        private level: number;
        private cfg: item_equip | item_material | item_stone | item_rune | runeRefine;
        private _list: CustomList;
        private _list1: CustomList;
        private _showIds: Array<any>;
        private _showIds1: Array<any>;
        private _upClip: CustomClip;
        private culativation: number;
        private rise: AmuletRise;
        private refine: AmuletRefine;
        private normalheight: number;
        private fullheight: number;

        private _nowNum: number = 0;
        private _allNum: number = 0;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._list1) {
                this._list1.removeSelf();
                this._list1.destroy();
                this._list1 = null;
            }
            if (this._upClip) {
                this._upClip.removeSelf();
                this._upClip.destroy();
                this._upClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._showIds1 = new Array<any>();
            this.normalheight = 803;
            this.fullheight = 700;

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

            this._list = new CustomList();
            this._list.width = 512;
            this._list.height = 100;
            this._list.hCount = 1;
            this._list.spaceY = 6;
            this._list.itemRender = ItemText;
            this._list.x = 83;
            this._list.y = 226;
            this.addChild(this._list);

            this._list1 = new CustomList();
            // this._list1.scrollDir = 2;
            this._list1.width = 512
            ;
            this._list1.height = 270;
            this._list1.hCount = 1;
            this._list1.spaceY = 6;
            this._list1.itemRender = ItemText;
            this._list1.x = 83;
            this._list1.y = 381;
            this.addChild(this._list1);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateAddItem();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.itemId = value;
            TalismanModel.instance._itemId = value;
            this.cfg = CommonUtil.getItemCfgById(this.itemId);
            let quality: int = CommonUtil.getItemQualityById(this.itemId);
            if (quality > 5) quality = 5;
            if (!this.cfg) throw new Error("不存在的道具ID：" + this.itemId);
            this.talismanBg.skin = `common/dt_tongyong_${quality}.png`;
            // this.talismaName.text = this.cfg[item_materialFields.name].toString();
            this.talismanIcon.skin = CommonUtil.getIconById(this.itemId);
            this.updateAddItem();
        }

        protected addListeners(): void {
            super.addListeners();
            this.upBtn.on(Event.CLICK, this, this.upBtnHandler);
            // GlobalData.dispatcher.on(CommonEventType.REFINE_AMULET_REPLAY, this, this.amuletInfoReplay);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_AMULET_INFO_REPLAY, this, this.updateAddItemCh);
            this.addAutoListener(this.getTalisman, Event.CLICK, this, this.getTalismanHandler);

            GuideModel.instance.registeUI(GuideSpriteId.TALISMAN_ALERT_UP_BTN, this.upBtn);
            GuideModel.instance.registeUI(GuideSpriteId.TALISMAN_ALERT_CLOSE_BTN, this.closeBtn);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.upBtn.off(Event.CLICK, this, this.upBtnHandler);
            // GlobalData.dispatcher.off(CommonEventType.REFINE_AMULET_REPLAY, this, this.amuletInfoReplay);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_AMULET_INFO_REPLAY, this, this.updateAddItemCh);

            GuideModel.instance.removeUI(GuideSpriteId.TALISMAN_ALERT_UP_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.TALISMAN_ALERT_CLOSE_BTN);
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
                        WindowManager.instance.openDialog(WindowEnum.TALISMAN_GET_ALERT, this.itemId);
                    } else {
                        SystemNoticeManager.instance.addNotice("升级成功", false);
                    }
                }
                    break;
            }
        }

        private updateAddItemCh() {
            let isCloseWin = this.updateAddItem();
            if (isCloseWin) {
                this.close();
            }
        }

        private updateAddItem(): boolean {
            let isCloseWin = false;//升级返回后 是否关闭界面
            this.rise = TalismanModel.instance.getAmuletRise();
            this.refine = TalismanModel.instance.getAmuletRefine();

            let items = TalismanModel.instance.GetAmuletById(this.itemId);
            if (items != null) {
                this.level = items[AmuletRefineInfoFields.level]
            } else {
                this.level = 0;
            }
            if (this.level > 0) {
                this.upBtn.label = "升级"
            } else {
                this.upBtn.label = "激活"
            }
            
            this.fullChange(false);
            this.talismaLevel.text = this.cfg[item_materialFields.name].toString();
            this.levelTxt.text = "LV." + this.level;
            let cfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, this.level);
            let widt: number = 212;
            let num: number = cfg[amuletRefineFields.items][1];
            let count = BagModel.instance.getItemCountById(this.itemId) + BagModel.instance.getItemCountById(cfg[amuletRefineFields.universalId]);
            if (num != null) {
                this, this.upBtn.visible = true;
                this.nowExp.text = count.toString() + "/" + num;
                if (count / num >= 1) {
                    this.expPro.width = widt;
                    this.clipStop(true);
                } else {
                    this.expPro.width = widt * (count / num);
                    this.clipStop(false);
                    isCloseWin = true;
                }
            } else {
                this.nowExp.text = "已满级";
                // this.nowExp.color="#00ad35"
                this.expPro.width = widt;
                this.fullChange(true);
                // this.upBtn.visible=false;
                // this.getTalisman.visible=false;
                this.clipStop(false);
                isCloseWin = true;
            }
            this.setNormalAttrs();
            this.setRiseAttrs(this.level);
            this._nowNum = num;
            this._allNum = count;
            return isCloseWin;
        }

        private fullChange(bool: boolean) {
            if (bool == true) {
                this.upBtn.visible = false;
                this.getTalisman.visible = false;
                this.bg.height = this.fullheight;
                this.arrowImg.visible = false;
                this.height = this.fullheight;
            } else {
                this.upBtn.visible = true;
                this.getTalisman.visible = true;
                this.bg.height = this.normalheight;
                this.arrowImg.visible = true;
                this.height = this.normalheight;
            }
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

        private setNormalAttrs() {
            this._showIds.length = 0;
            let cfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, this.level);
            let nextCfg = TalismanCfg.instance.getCfgByIdLevel(this.itemId, this.level + 1);
            let curAttrs:Array<attr> = cfg[amuletRefineFields.attrs];
            let nextAttrs:Array<attr> = nextCfg ? nextCfg[amuletRefineFields.attrs] : null;
            let attrs:Array<attr> = nextAttrs || curAttrs;
            for(let i:int = 0, len:int = attrs.length; i < len; i++){
                let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let curAttrValue:number = curAttrs[i] ? curAttrs[i][attrFields.value] : 0;
                let attrName:string = attrCfg[attr_itemFields.name];
                let isPercent:number = attrCfg[attr_itemFields.isPercent];
                let curAttrStr:string = isPercent ? AttrUtil.formatFloatNum(curAttrValue) + "%" : Math.round(curAttrValue) + "";
                let arr:Array<string>;
                if(nextCfg){
                    let nextAttrValue:number = nextAttrs[i] ? nextAttrs[i][attrFields.value] : 0;
                    let nextAttrStr:string = isPercent ? AttrUtil.formatFloatNum(nextAttrValue) + "%" : Math.round(nextAttrValue) + "";
                    arr = [attrName + " " + curAttrValue, attrName + "" + nextAttrValue, "#00ad35"];
                }else{
                    arr = [attrName + " " + curAttrValue, "", "#00ad35"];
                }
                this._showIds.push(arr)
            }
            // 修为值
            let arr:Array<string>;
            if(nextCfg){
                arr = ["修为值" + " " + cfg[amuletRefineFields.cultivation], "修为值" + " " + nextCfg[amuletRefineFields.cultivation], "#00ad35"];
            }else{
                arr = ["修为值" + " " + cfg[amuletRefineFields.cultivation], "", "#00ad35"];
            }
            this._showIds.push(arr);
            this._list.datas = this._showIds;
        }

        private setRiseAttrs(lv: number) {
            this._showIds1.length = 0;
            for (let j = 0; j < 50; j++) {
                let cfg:amuletRefine = TalismanCfg.instance.getCfgByIdLevel(this.itemId, j);
                let nextcfg:amuletRefine = TalismanCfg.instance.getCfgByIdLevel(this.itemId, j + 1);
                let curAttrs:Array<attr> = cfg[amuletRefineFields.r_attrs];
                let nextAttrs:Array<attr> = nextcfg[amuletRefineFields.r_attrs];
                for(let i:int = 0, len:int = nextAttrs.length; i < len; i++){
                    let att:attr = AttrUtil.getAttrByType(nextAttrs[i][attrFields.type], curAttrs);
                    let curValue:number = att ? att[attrFields.value] : 0;
                    let nextValue:number = nextAttrs[i][attrFields.value];
                    let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(nextAttrs[i][attrFields.type]);
                    if(nextValue - curValue > 0){
                        let nowvalueStr: string = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(nextValue) + "%" : Math.round(nextValue) + "";
                        let level = nextcfg[amuletRefineFields.level];
                        let lvstr: string = "";
                        if (lv < level) {
                            lvstr = level + "级激活";
                        }
                        let arr:Array<string> = [attrCfg[attr_itemFields.name] + " " + nowvalueStr, lvstr, "#ab2800"];
                        this._showIds1.push(arr);
                    }
                }
            }
            this._list1.datas = this._showIds1;
        }

        private upBtnHandler() {
            if (this._nowNum > this._allNum) {
                SystemNoticeManager.instance.addNotice("圣物数量不足", true);
                return;
            }
            Channel.instance.publish(UserFeatureOpcode.RefineAmulet, [this.itemId]);
        }

        // 获取圣物
        private getTalismanHandler(): void {
            //圣物探索
            WindowManager.instance.openByActionId(ActionOpenId.xunbaoTalisman);

            this.close();
        }
    }
}