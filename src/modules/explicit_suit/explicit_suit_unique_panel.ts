///<reference path="../config/exterior_suit_cfg.ts"/>
///<reference path="../config/exterior_suit_feed_cfg.ts"/>

/** 时装幻化面板*/


namespace modules.explicit {
    import ExplicitSuitViewUI = ui.ExplicitSuitViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import exterior_suit = Configuration.exterior_suit;
    import exterior_suit_Field = Configuration.exterior_suit_Field;
    import exterior_suit_feed_Field = Configuration.exterior_suit_feed_Field;
    import AutoSC_ShowSuitInfoFields = Protocols.AutoSC_ShowSuitInfoFields;
    import AutoSC_ShowSuitLevelFields = Protocols.AutoSC_ShowSuitLevelFields;
    import AutoSC_ShowSuitPosLevel = Protocols.AutoSC_ShowSuitPosLevel;
    import AutoSC_ShowSuitPosHallucinationID = Protocols.AutoSC_ShowSuitPosHallucinationID;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import Image = Laya.Image;
    import CustomList = modules.common.CustomList;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import ExteriorSuitCfg = modules.config.ExteriorSuitCfg;
    import ExteriorSuitFeedCfg = modules.config.ExteriorSuitFeedCfg;
    import ExteriorSuitClass = modules.config.ExteriorSuitClass;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import attr_item = Configuration.attr_item;
    import AttrUtil = modules.common.AttrUtil;
    import BagUtil = modules.bag.BagUtil;
    
    export class ExplicitSuitUniquePanel extends ExplicitSuitViewUI {
        private activeGbtnClip: CustomClip;
        private activeWbtnClip: CustomClip;
        private upBtnClip: CustomClip;

        private _attrNameTxts: Array<Laya.Text>;
        private _attrValuexts: Array<Laya.Text>;
        private _arrowImgs: Array<Image>;
        private _upAttrTxts: Array<Laya.Text>;

        private _list: CustomList;
        private _numDiff: number;
        private _itemId:number;
        private _activeCount:number;
        private _selectedIndex:number;//跳转选择
        private _skeletonClip: SkeletonAvatar;
        private _suitItems:ExplicitSuitItem[];

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._attrNameTxts.length = 0;
            this._attrNameTxts = null;
            this._attrValuexts.length = 0;
            this._attrValuexts = null;
            this._upAttrTxts.length = 0;
            this._upAttrTxts = null;
            this._arrowImgs.length = 0;
            this._arrowImgs = null;
            for (let index = 0; index < 3; index++) {
                this._suitItems[index].destroy();
            }
            this._suitItems = null;
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            this.activeGbtnClip = this.destroyElement(this.activeGbtnClip);
            this.activeWbtnClip = this.destroyElement(this.activeWbtnClip);
            this.upBtnClip = this.destroyElement(this.upBtnClip);
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._itemId = -1;
            this._activeCount = 0;
            this._selectedIndex = 0;
            this.centerX = 0;
            this.centerY = 0;

            this.sumAttrBtn.underline = true;
            this.noActImg.zOrder = 1;

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._attrValuexts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];


            let itemPoss = [[105,642],[320,642],[533,642]];
            this._suitItems = [];
            for (let index = 0; index < 3; index++) {
               let suitItem = new ExplicitSuitItem(); 
               suitItem.pos(itemPoss[index][0],itemPoss[index][1]);
               this.addChild(suitItem);
               suitItem.scale(0.8,0.8);
               this._suitItems.push(suitItem);
            }

        
            this._numDiff = 0;
            this.title_txt.skin = "explicit_suit/txt_jptz.png";

            this.creatEffect();
            this.initList();
        }

        protected onOpened(): void {
            super.onOpened();
            ExplicitSuitCtrl.instance.getSuitInfo();//进入页面重新请求数据
        }

        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            this._selectedIndex = value != null ? value:0;
            this._list.selectedIndex = this._selectedIndex;
        }

        protected addListeners(): void {
            super.addListeners();

            //this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.promoteBtn, LayaEvent.CLICK, this, this.promoteBtnFunc);
            this.addAutoListener(this.changeImg, LayaEvent.CLICK, this, this.changeShow);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectSkinItem);
            this.addAutoListener(this.activeBtn0, LayaEvent.CLICK, this, this.activeBtnHandler,[1]);
            this.addAutoListener(this.activeBtn1, LayaEvent.CLICK, this, this.activeBtnHandler,[2]);
            //this.addAutoListener(this.tzBtn, LayaEvent.CLICK, this, this.tzBtnHandler);
    
            this.addAutoListener(this.preBtn, common.LayaEvent.CLICK, this, this.pageUpHandler);
            this.addAutoListener(this.nextBtn, common.LayaEvent.CLICK, this, this.pageDownHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EXPLICIT_SUIT_UPDATE, this, this.updateSuitInfo);
        }

        private initList(){
           let data = ExteriorSuitCfg.instance.getCfgByClass(ExteriorSuitClass.unique)
           let items = [];
           for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    items.push(data[key]);
                }
           }
            this._list = new CustomList();
            this._list.spaceX = 0;
            this._list.scrollDir = 2;
            this._list.width = 600;
            this._list.height = 150;
            this._list.vCount = 1;
            this._list.itemRender = ExplicitSuitClassItem;
            this._list.x = 87;
            this._list.y = 1015;
            this._list.datas = items;
            this._list.scale(0.9,0.9);
            this.addChild(this._list);

            this.preBtn.visible = items.length > 4;
            this.nextBtn.visible = items.length > 4;
        }

        private updateSuitInfo(): void {
           this.selectSkinItem();
        }

        private selectSkinItem(): void {
            if (!this._list.selectedData) return;
            let modelCfg: exterior_suit = this._list.selectedData;
            let curShowSuitLevel = ExplicitSuitModel.instance.getShowSuitLevelInfo(modelCfg[exterior_suit_Field.id]);
            this._skeletonClip.reset(modelCfg[exterior_suit_Field.partsShowId][1],modelCfg[exterior_suit_Field.partsShowId][0],modelCfg[exterior_suit_Field.partsShowId][2]);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.78);
            this._skeletonClip.resetScale(AvatarAniBigType.weapon, 0.78);
            this._skeletonClip.resetScale(AvatarAniBigType.wing, 0.78);
            this.NameTxt.text = modelCfg[exterior_suit_Field.name];

            let showInfo = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posHallucinationID];
            let bCheck = ExteriorSuitCfg.instance.checkCfgByWCWId(showInfo[0],showInfo[1]-PlayerModel.instance.occ,showInfo[2],modelCfg[exterior_suit_Field.id]);//是否正在使用
            this.useImg.visible = bCheck && curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] > -1;
            this.jieMsz.visible = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] > -1;
            this.jieCharMsz.visible = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] > -1;
            //this.tzBtn.visible = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] > -1;
            
            //设置阶级居中
            this.jieMsz.value = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level].toString();
            let charNum: number = this.jieMsz.value.length;
            let charWidth: number = 22 * charNum + (this.atkMsz.spaceX) * (charNum - 1);
            let width = this.jieCharMsz.width + 5 + charWidth;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + charWidth + 5;

            this.setAttr(modelCfg[exterior_suit_Field.id]);
           
        }

        //设置属性加成列表
        private setAttr(suitId:number) :void {
            let curShowSuitLevel = ExplicitSuitModel.instance.getShowSuitLevelInfo(suitId);
            let suitFeedInfo = ExteriorSuitFeedCfg.instance.getCfgById(suitId);
            let suitInfo = ExteriorSuitCfg.instance.getCfgById(suitId);
            let curShowSuitPosLevel = ExplicitSuitModel.instance.getShowSuitPosLevelInfo(suitId);
            let showSuitPosHallucinationIDs:AutoSC_ShowSuitPosHallucinationID = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posHallucinationID];
            let curLevel = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level];
            this.atkMsz.value = curLevel > -2 ? suitFeedInfo[curLevel][exterior_suit_feed_Field.fighting].toString():"0";//战力
            let count = 0;//激活部件数量
            for (let index = 0,len = showSuitPosHallucinationIDs.length; index < len; index++) {
                if (curShowSuitPosLevel[1][index] != 0) {
                    count++;
                }
            }
            this._activeCount = count;
            this.changeImg.visible = count == 3 && !this.useImg.visible && curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] > -1;
            if (curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -2 || curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -1) {//-1高级形态激活，-2 高级形态激活和完美形态都没激活
                this.box1.visible = true;
                this.box2.visible = true;
                this.box3.visible = false;
                if (count <= 2) {
                    this.num_txt_0.text = count.toString() + "/2";
                }else{
                    this.num_txt_0.text = "2/2";
                }
                this.num_txt_1.text = count.toString() + "/3";
                this.activeBtn0.visible = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -2;
                this.activeBtn1.visible = true;
                this.activeGbtnClip.visible = this.activeBtn0.visible && count >=2;
                this.activeWbtnClip.visible = this.activeBtn1.visible && count == 3;
                this.activeBtn0.visible && count >=2 ? this.activeGbtnClip.play() : this.activeGbtnClip.stop();
                this.activeBtn1.visible && count == 3 ? this.activeWbtnClip.play() : this.activeWbtnClip.stop();
                this.activeImg0.visible = !this.activeBtn0.visible;
                this.activeImg1.visible = !this.activeBtn1.visible;
                this.activeImg0.skin = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -1 ? "common/txt_common_yjh.png": "common/txt_common_wjh.png";
                this.activeImg1.skin = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -1 && count == 3 ? "common/txt_common_yjh.png": "common/txt_common_wjh.png"

                let curAttr = suitFeedInfo[-1][exterior_suit_feed_Field.attrs][0];
                let attCfg: attr_item = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                let curAttrStr: string = Math.round(curAttr[attrFields.value]).toString();
                this.att_name_txt_0.text = attCfg[attr_itemFields.name] + ":";
                this.value_txt_0.text = curAttrStr;
                curAttr = suitFeedInfo[-1][exterior_suit_feed_Field.attrs][1];
                attCfg = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                curAttrStr = Math.round(curAttr[attrFields.value]).toString();
                this.att_name_txt_1.text = attCfg[attr_itemFields.name] + ":";
                this.value_txt_1.text = curAttrStr;

                curAttr = suitFeedInfo[0][exterior_suit_feed_Field.attrs][0];
                attCfg = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                curAttrStr = Math.round(curAttr[attrFields.value]).toString();
                this.att_name_txt_2.text = attCfg[attr_itemFields.name] + ":";
                this.value_txt_2.text = curAttrStr;
                curAttr = suitFeedInfo[0][exterior_suit_feed_Field.attrs][1];
                attCfg = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                curAttrStr = Math.round(curAttr[attrFields.value]).toString();
                this.att_name_txt_3.text = attCfg[attr_itemFields.name] + ":";
                this.value_txt_3.text = curAttrStr;
                this.noActImg.visible = true;
            }else{
                this.box1.visible = false;
                this.box2.visible = false;
                this.box3.visible = true;
                this.noActImg.visible = false;
                let nextCfg = suitFeedInfo[curLevel + 1];
                let nextAttrs = null;
                if (nextCfg) {
                    nextAttrs = nextCfg[exterior_suit_feed_Field.attrs];
                }
                let attrs = suitFeedInfo[curLevel][exterior_suit_feed_Field.attrs];
                for (let index = 0; index < 2; index++) {
                    let curAttr = attrs[index];
                    let attCfg: attr_item = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                    let isPercent: number = attCfg[attr_itemFields.isPercent];
                    let curAttrStr: string = curAttr ? isPercent ? AttrUtil.formatFloatNum(curAttr[attrFields.value]) + "%" : Math.round(curAttr[attrFields.value]).toString(): "0";
                    this._attrNameTxts[index].text = attCfg[attr_itemFields.name] + ":";
                    this._attrValuexts[index].text = curAttrStr;
                    if (nextAttrs) {
                        let nextAttr = nextAttrs[index];
                        this._upAttrTxts[index].visible = this._arrowImgs[index].visible = true;
                        let value: number = nextAttr[attrFields.value] - (curAttr ? curAttr[attrFields.value] : 0);
                        this._upAttrTxts[index].text = isPercent ? AttrUtil.formatFloatNum(value) + "%" : Math.round(value).toString();
                    } else {
                        this._upAttrTxts[index].visible = this._arrowImgs[index].visible = false;
                    }
                }

                //
                let curAttr = attrs[2];
                this._attrNameTxts[2].text = `[${suitInfo[exterior_suit_Field.name]}]套装全部外显属性`;
                if (curAttr) {
                    this._attrValuexts[2].text = AttrUtil.formatFloatNum(curAttr[attrFields.value]) + "%";
                } else {
                    this._attrValuexts[2].text = `${0}%`
                }
    
                if (nextAttrs) {
                    let nextAttr = nextAttrs[2];
                    this._upAttrTxts[2].visible = this._arrowImgs[2].visible = true;
                    let value: number = nextAttr[attrFields.value] - (curAttr ? curAttr[attrFields.value] : 0);
                    this._upAttrTxts[2].text = AttrUtil.formatFloatNum(value) + "%";
                } else {
                    this._upAttrTxts[2].visible = this._arrowImgs[2].visible = false;
                }

                //进阶条件
                let condCount = 0;
                let condition = suitFeedInfo[curLevel + 1] ? suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.condition]:[];
                if (condition.length) {
                    for (let index = 0,len = showSuitPosHallucinationIDs.length; index < len; index++) {
                        if (curShowSuitPosLevel[1][index] >= condition[1]) {
                            condCount++;
                        }
                    }
                    this._attrNameTxts[3].text = "进阶条件:";
                    this._attrValuexts[3].text = `[${suitInfo[exterior_suit_Field.name]}]全部外显达到${condition[1]}阶(${condCount}/3)`;
                }

                //消耗道具
                let items = suitFeedInfo[curLevel + 1] ? suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.items]:[];
                if (items.length) {
                    this.icon_img.skin = CommonUtil.getIconById(items[0]);
                    let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                    this._itemId = items[0];
                    //消耗道具 颜色判定修改
                    let colorStr = "#ff7462";
                    if (hasItemNum >= items[1]) {
                        colorStr = "#000000";
                    }
                    this.item_num.text = `${hasItemNum}/${items[1]}`;
                    this.item_num.color = colorStr
                    this._numDiff = hasItemNum - items[1];
                    this.upBtnClip.visible = this._numDiff >= 0 && condCount == 3;
                    this._numDiff >= 0 && condCount == 3 ? this.upBtnClip.play() : this.upBtnClip.stop();
                    this.icon_img.x = 292 - (this.item_num.textWidth - 37) / 2;
                    this.item_num.x = 339 - (this.item_num.textWidth - 37) / 2;
                }

                if (nextCfg) {
                    this.icon_img.visible = true;
                    this.promoteBtn.visible = true;
                    this.item_num.visible = true;
                } else{//满级
                    this.icon_img.visible = false;
                    this.promoteBtn.visible = false;
                    this.item_num.visible = false;
                    this.title_img_3.visible = this._attrNameTxts[3].visible = this._attrValuexts[3].visible = this._upAttrTxts[3].visible = this._arrowImgs[3].visible = false;
                }
            }

            //
            for (let index = 0; index < 4; index++) {
              this._attrValuexts[index].x =  this._attrNameTxts[index].x + this._attrNameTxts[index].textWidth + 10;
              this._arrowImgs[index].x =  this._attrValuexts[index].x + this._attrValuexts[index].textWidth + 10;
              this._upAttrTxts[index].x =  this._arrowImgs[index].x + this._arrowImgs[index].width + 10;
            }

            this.updateSuitItem(curShowSuitPosLevel,suitInfo);
        }

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 560)

            this.activeGbtnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.activeBtn0.addChild(this.activeGbtnClip);
            this.activeGbtnClip.pos(-10, -15);
            this.activeGbtnClip.scale(0.9, 0.9);
            this.activeGbtnClip.visible = false;
            this.activeGbtnClip.play();

            this.activeWbtnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.activeBtn1.addChild(this.activeWbtnClip);
            this.activeWbtnClip.pos(-10, -15);
            this.activeWbtnClip.scale(0.9, 0.9);
            this.activeWbtnClip.visible = false;
            this.activeWbtnClip.play();

            this.upBtnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.promoteBtn.addChild(this.upBtnClip);
            this.upBtnClip.pos(-10, -15);
            this.upBtnClip.scale(0.9, 0.9);
            this.upBtnClip.visible = false;
            this.upBtnClip.play();
        }

        private updateSuitItem(curShowSuitPosLevel:AutoSC_ShowSuitPosLevel,suitInfo:exterior_suit){
            for (let index = 0,len = curShowSuitPosLevel[1].length; index < len; index++) {
                this._suitItems[index].data = [suitInfo[exterior_suit_Field.partsShowId][index],index];
            }
        }

        //升级按钮
        private promoteBtnFunc(): void {
            let suitId = this._list.selectedData[exterior_suit_Field.id];
            if (this._numDiff >= 0) {
                ExplicitSuitCtrl.instance.upLevelSuit(suitId);
            } else {
                BagUtil.openLackPropAlert(this._itemId, -this._numDiff);
            }
        }

        //激活高级形态、完美形态
        private activeBtnHandler(tag:number){
            if ((tag == 1 && this._activeCount >= 2) || (tag == 2 && this._activeCount == 3)) {
                let modelCfg: exterior_suit = this._list.selectedData;
                ExplicitSuitCtrl.instance.activationSuit(modelCfg[exterior_suit_Field.id],tag);
            }else{
                 CommonUtil.noticeError(44214);
            }
        }
        //
        private changeShow(): void {
            let suitId = this._list.selectedData[exterior_suit_Field.id];
            ExplicitSuitCtrl.instance.hallAucinationSuit(suitId);
        }
        //套装属性
        private tzBtnHandler(){
            WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_ATTR_ALERT,[this._list.selectedData]);
        }
        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._list.scroll(-100);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._list.scroll(100);
        }
        // //关于
        // private openAbout(): void {
        //     CommonUtil.alertHelp(20048);
        // }
    }
}