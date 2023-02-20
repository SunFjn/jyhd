namespace modules.commonAlert {
    import PropAlertUI = ui.PropAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import item_stone = Configuration.item_stone;
    import item_materialFields = Configuration.item_materialFields;
    import GetWayCfg = modules.config.GetWayCfg;
    import item_stoneFields = Configuration.item_stoneFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import item_rune = Configuration.item_rune;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefine = Configuration.runeRefine;
    import runeRefineFields = Configuration.runeRefineFields;
    import idCount = Configuration.idCount;
    import idCountFields = Configuration.idCountFields;
    // import AvatarClip = modules.common.AvatarClip;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import CommonUtil = modules.common.CommonUtil;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import Rectangle = Laya.Rectangle;
    import LayaEvent = modules.common.LayaEvent;
    import Event = Laya.Event;
    export class PropAlert extends PropAlertUI {

        private _baseItem: BaseItem;
        private _sourceBtns: Array<Laya.Image>;
        private _sourceBtnY: number;
        private _sourceBtnBg: Array<Laya.Image>;
        private _desTxt: Array<laya.display.Text>;
        private _recordFuncIds: number[];
        // private _modelClip: AvatarClip;
        private _skeleClip: SkeletonAvatar;
        // private _modelClipTween: TweenJS;
        private _modelShowImgTween: TweenJS;
        private _modelClipY = 260;//模型位置
        private _lastY: number = 0;
        private _h: number = 500;
        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
                this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            }
            this.addAutoListener(this.descTxt, LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this.addAutoListener(this.descTxt, LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);
        }
        protected removeListeners(): void {
            super.removeListeners();
            // if (this._modelClipTween) {
            //     this._modelClipTween.stop();
            // }
            if (this._modelShowImgTween) {
                this._modelShowImgTween.stop();
            }

            this._skeleClip = this.destroyElement(this._skeleClip);
            // this._modelClip = this.destroyElement(this._modelClip);
        }
        private downHandler(): void {
            this._lastY = this.descTxt.mouseY;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offsetY: number = e.delta * -8;
            this.scrollY(offsetY);
        }
        private moveHandler(): void {
            let offsetY: number = this._lastY - this.descTxt.mouseY;
            this.scrollY(offsetY);
            this._lastY = this.descTxt.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }
        private scrollY(offsetY: number): void {
            if (this.descTxt.height < this._h) return;
            let rect: Rectangle = this.descTxt.scrollRect;
            rect.y = rect.y + offsetY;
            if (rect.y < 0) rect.y = 0;
            else if (rect.y > this.descTxt.height - this._h) {
                rect.y = this.descTxt.height - this._h;
            }
            this.descTxt.scrollRect = rect;
        }

        protected initialize(): void {
            super.initialize();

            this._baseItem = new BaseItem();
            this.addChild(this._baseItem);
            this._baseItem.pos(48, 79, true);
            this._baseItem.nameVisible = false;
            this._baseItem.needTip = false;
            this.descTxt.color = "#ffffff";
            this.descTxt.style.fontFamily = "SimHei";
            this.descTxt.style.fontSize = 22;
            this._sourceBtns = new Array<Laya.Image>();
            this._sourceBtnBg = new Array<Laya.Image>();
            this._desTxt = new Array<laya.display.Text>();
            for (let i: number = 0; i < 4; i++) {
                this._sourceBtns[i] = new Laya.Image();
                this._sourceBtns[i].mouseEnabled = true;
                this._sourceBtnBg[i] = new Laya.Image();
                this._desTxt[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._desTxt[i]);
            }
            this._recordFuncIds = [];
            this.zOrder = 1;
            this._h = 500;
            this.descTxt.scrollRect = new Rectangle(0, 0, this.descTxt.width, this._h);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.initializeModelClip();
            this.item = value;
            if (this.descTxt.scrollRect) {
                this.descTxt.scrollRect.setTo(0, 0, this.descTxt.width, this._h);
            }
        }

        public set item(value: Protocols.Item) {
            this.removeChildSource();
            let itemId: number = value[Protocols.ItemFields.ItemId];
            let num: number = 0;
            if (itemId == MoneyItemId.zq || itemId == MoneyItemId.copper || itemId == MoneyItemId.glod || itemId == MoneyItemId.exp || itemId == MoneyItemId.bind_gold || itemId == MoneyItemId.clanCoin) {
                num = PlayerModel.instance.getCurrencyById(itemId);
            }
            else if (itemId == MoneyItemId.lingqi) {
                //    private _treasureInfos: number[]; //0药草值 1财富值 2仙府任务次数 3风水值
                num = modules.xianfu.XianfuModel.instance.treasureInfos(0);
            }
            else if (itemId == MoneyItemId.fugui) {
                num = modules.xianfu.XianfuModel.instance.treasureInfos(1);
            }
            else if (CommonUtil.getItemSubTypeById(itemId) == 21) {
                num = modules.xianfu.XianfuModel.instance.handBookRes.get(itemId);
                num = num ? num : 0;
            }
            else {
                num = BagModel.instance.getItemCountById(itemId);
            }
            this.numTxt.text = "拥有数量：" + num.toString();
            this._baseItem.dataSource = value;
            this._baseItem._numTxt.visible = false;
            let itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(itemId);
            let type: number = CommonUtil.getItemTypeById(itemId);
            let isStone: boolean = type === ItemMType.Stone;
            // this.nameTxt.color = CommonUtil.getColorById(itemId);
            //.....新增 道具品质背景图
            this.qualityImg.skin = CommonUtil.getBgImgById(itemId);  // getBgImgById  
            let quality: int = CommonUtil.getItemQualityById(itemId);
            this.qualityImg1.visible = this.qualityImg2.visible = this.qualityImg3.visible = quality == 6;
            //.....
            this.descTxt.style.height = 0;
            this.descTxt.style.leading = 10;
            let arr: Array<number> = [];
            if (type == ItemMType.Rune) {
                let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                let lv: number = itemId % 10000;
                let dimCfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                this.nameTxt.text = dimCfg[item_runeFields.name];
                this.levelTxt.text = `等级：${lv}`;
                let needunLockLv: number = dimCfg[item_runeFields.layer];

                let attrs: Array<attr> = (<runeRefine>itemCfg)[runeRefineFields.attrs];
                let str: string = "";
                for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                    let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                    let attrValue: number = attrs[i][attrFields.value];
                    let attrValueStr: string = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                    str += `<br/>${attrCfg[attr_itemFields.name]} ${attrValueStr}`;
                }

                let hintStr: string = ``;
                if (CommonUtil.getStoneTypeById(itemId) === ItemRuneCfg.instance.resolveRuneSubTypeId) {
                    let getItems: Array<idCount> = <Array<idCount>>itemCfg[runeRefineFields.resolveItems];
                    let getNum: number = 0;
                    for (let i: int = 0, len: int = getItems.length; i < len; i++) {
                        getNum += getItems[i][idCountFields.count];
                    }
                    hintStr = `分解获得的玉荣精华+${getNum}`;
                    this.descTxt.innerHTML = `<span style='color:#FFEC7C'>${hintStr}</span>`;
                } else {
                    if (!needunLockLv) {
                        hintStr = `默认解锁`;
                    } else {
                        hintStr = `未央幻境${needunLockLv}层解锁`;
                    }
                    this.descTxt.innerHTML = `类型:玉荣,镶嵌后可为主角增加以下属性${str}<br/><span style='color:#FFEC7C'>${hintStr}</span>`;
                }
                arr = dimCfg[item_runeFields.itemSourceId];
            } else {
                this.nameTxt.text = itemCfg[isStone ? item_stoneFields.name : item_materialFields.name].toString();
                this.descTxt.innerHTML = isStone ? (<item_stone>itemCfg)[item_stoneFields.des] : (<item_material>itemCfg)[item_materialFields.des];
                this.levelTxt.text = isStone ? "" : `使用等级：${itemCfg[item_materialFields.useLvl]}`;
                arr = <Array<number>>itemCfg[isStone ? item_stoneFields.itemSourceId : item_materialFields.itemSourceId];
            }

            if (Main.instance.isWXiOSPay) {
                let _arr = new Array();
                for (let i: number = 0, len: number = arr.length; i < len; i++) {
                    // wxios需要隐藏
                    if (Main.instance.isWXiOSPayFunId.indexOf(arr[i]) >= 0) {
                        break;
                    }
                    _arr.push(arr[i]);
                }
                arr = _arr;
            }
            this._recordFuncIds = arr;


            let showId: number = 0;
            let isMove: number = 0;
            let isModel: number = 0;
            // showId = 22,			/*模型ID/图片ID*/
            // isMove = 23,			/*展示模型、图片 是否 上下动  0否 1是*/
            // isModel = 24,			/*是否模型(0模型1特效2图片)*/
            // item_material | item_equip | item_stone | runeRefine
            let typeNum: int = CommonUtil.getItemTypeById(itemId);
            if (itemCfg) {
                if (type === ItemMType.Equip) {
                    showId = (<item_equip>itemCfg)[item_equipFields.showId];
                    isMove = (<item_equip>itemCfg)[item_equipFields.isMove];
                    isModel = (<item_equip>itemCfg)[item_equipFields.isModel];
                } else if (type === ItemMType.Stone) {
                    showId = (<item_stone>itemCfg)[item_stoneFields.showId];
                    isMove = (<item_stone>itemCfg)[item_stoneFields.isMove];
                    isModel = (<item_stone>itemCfg)[item_stoneFields.isModel];
                } else if (type === ItemMType.Rune) {
                    // showId = (<runeRefine>itemCfg)[runeRefineFields.showId];
                    // isMove = (<runeRefine>itemCfg)[runeRefineFields.isMove];
                    // isModel = (<runeRefine>itemCfg)[runeRefineFields.isModel];
                } else {
                    showId = (<item_material>itemCfg)[item_materialFields.showId];
                    isMove = (<item_material>itemCfg)[item_materialFields.isMove];
                    isModel = (<item_material>itemCfg)[item_materialFields.isModel];
                }
            }

            if (!showId) {
                showId = 0;
                isMove = 0;
                isModel = 0;
            }
            // showId = 1;// 2011  5010  3010 4011 4013
            // isMove = 1;
            // isModel = 2;
            if (showId != 0) {
                let type: number = Math.floor(showId * 0.001);
                if (type === 90) {     // 9时装
                    showId += PlayerModel.instance.occ;
                }
                this.showMode(showId, isMove, isModel);
            } else {
                //his._modelClip = this.destroyElement(this._modelClip);
                this._skeleClip = this.destroyElement(this._skeleClip);
                // if (this._modelClipTween) {
                //     this._modelClipTween.stop();
                // }
                if (this._modelShowImgTween) {
                    this._modelShowImgTween.stop();
                }
            }


            this.setPositionImage(this.descTxt, arr, showId != 0);


            let getWayCfg: Configuration.get_way;
            for (let i: number = 0, len: number = arr.length; i < len; i++) {
                this.addChild(this._sourceBtnBg[i]);
                this.addChild(this._sourceBtns[i]);
                getWayCfg = GetWayCfg.instance.getCfgById(arr[i]);
                this._sourceBtns[i].pos(30 + (500 - 158 * len + 42 * (len - 1)) * 0.5 + i * 116, this._sourceBtnY);
                this._sourceBtns[i].skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
                this._sourceBtnBg[i].skin = `assets/icon/ui/get_way/btn_ydrk_bg.png`;
                this._sourceBtns[i].addChild(this._desTxt[i]);
                this._sourceBtnBg[i].pos(this._sourceBtns[i].x, this._sourceBtns[i].y);
                this._desTxt[i].pos(-12, 70);
                this._desTxt[i].width = 120;
                this._desTxt[i].text = getWayCfg[Configuration.get_wayFields.desc];
            }
        }

        private removeChildSource(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this._sourceBtns[i].skin = "";
                    this._sourceBtnBg[i].skin = "";
                    this._desTxt[i].text = "";
                    this.removeChild(this._sourceBtns[i]);
                    this.removeChild(this._sourceBtnBg[i]);
                    this.removeChild(this._desTxt[i]);
                }
            }
            this.levelTxt.y = 87;
            this.modelShowBox.visible = false;
        }

        public getOpenPlaneId(index: number): void {
            WindowManager.instance.close(WindowEnum.MANUAL_GIFT_ALERT);
            WindowManager.instance.close(WindowEnum.XIANFU_PET_TRAVELING_ALERT);
            WindowManager.instance.close(WindowEnum.XIANFU_PET_READY_GO_ALERT);
            WindowManager.instance.close(WindowEnum.PAYREWARDRANK_ALERT);
            let id: number = this._recordFuncIds[index];
            PropAlertUtil.clickHandler(id);
        }

        private setPositionImage(descTxt: laya.html.dom.HTMLDivElement, arr: Array<number>, isHaveMoule: boolean = false): void {
            if (arr.length != 0) {
                this.getSourceImg.visible = true;
                this.getSourceTxt.visible = true;
                let desHeight = descTxt.height > this._h ? this._h : descTxt.height;
                this.getSourceImg.y = descTxt.y + desHeight + 3;
                this.getSourceTxt.y = descTxt.y + desHeight + 3;
                //首先确定 模型展示box位置
                this.modelShowBox.y = this.getSourceImg.y + this.getSourceImg.height + 100 + 20;
                let heightnNum = 0;
                if (isHaveMoule) {
                    heightnNum = this.modelShowBox.height;
                }
                this._sourceBtnY = this.getSourceImg.y + this.getSourceImg.height + 20;
                if (isHaveMoule) {
                    this.bgImage.height = this._sourceBtnY + 100 + heightnNum;
                } else {
                    this.bgImage.height = this._sourceBtnY + 100 + 36 + heightnNum;
                }

                this.height = this.bgImage.height;
                this.qualityImg1.height = this.height + 6;

            } else {
                this.getSourceTxt.visible = false;
                this.getSourceImg.visible = false;
                //首先确定 模型展示box位置
                let desHeight = descTxt.height > this._h ? this._h : descTxt.height;
                this.modelShowBox.y = descTxt.y + desHeight + 26;
                let heightnNum = 0;
                if (isHaveMoule) {
                    heightnNum = this.modelShowBox.height + 20;
                }
                if (isHaveMoule) {
                    this.bgImage.height = descTxt.y + desHeight + 10 + heightnNum;
                } else {
                    this.bgImage.height = descTxt.y + desHeight + 26 + heightnNum;
                }

                this.height = this.bgImage.height;
                this.qualityImg1.height = this.height + 6;
            }
            this.clickTxt.y = this.height;
            this.modelShowBox.visible = isHaveMoule;//是否显示  显示模型box 块
        }

        public destroy(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this._sourceBtns[i].destroy(true);
                    this._sourceBtnBg[i].destroy(true);
                    this._desTxt[i].destroy(true);
                }
                this._sourceBtns = this._sourceBtnBg = this._desTxt = null;
            }
            // this._modelClip = this.destroyElement(this._modelClip);
            this._skeleClip = this.destroyElement(this._skeleClip);
            super.destroy();
        }


        public showMode(showId: number, isMove: number, isModel: number) {
            // if (this._modelClipTween) {
            //     this._modelClipTween.stop();
            // }
            if (this._modelShowImgTween) {
                this._modelShowImgTween.stop();
            }
            this.modelShowImg.visible = false;
            this._skeleClip.scale(1, 1)
            if (isModel == 0) {//模型
                this.setAvatar(showId);

                let typeN = Math.floor(showId / 1000);
                switch (typeN) {
                    case 11:
                        this._skeleClip.reset(0, 0, 0, 0, 0, showId);
                        break;
                    case 5:
                        this._skeleClip.reset(showId);
                        break;
                    default:
                        this._skeleClip.scale(0.5, 0.5)
                        this._skeleClip.reset(showId);
                        break;
                }
                // this._modelClip = this.destroyElement(this._modelClip);
            } else if (isModel == 1) {//特效
                // this._modelClip.reset(0, 0, 0, 0, showId);
                this._skeleClip = this.destroyElement(this._skeleClip);
            } else if (isModel == 2) {//图片
                this.modelShowImg.visible = true;
                this.modelShowImg.skin = `assets/icon/ui/get_way/${2}.png`;
            }
            if (isModel == 0 || isModel == 1) {
                let typeNum = Math.floor(showId / 1000);
                this._modelClipY = 260;
                if (isModel == 1) {
                    if (typeNum == 9 || typeNum == 10) {//法阵
                        this._modelClipY = 210;
                    }
                } else if (isModel == 0) {
                    if (typeNum == 2) {  //灵宠
                        this._modelClipY = 260;
                    } else if (typeNum == 3) {//仙翼
                        this._modelClipY = 260;
                    } else if (typeNum == 4) {//精灵
                        this._modelClipY = 260;
                    } else if (typeNum == 5) {//神兵
                        this._modelClipY = 260;
                    } else if (typeNum == 90) { //时装
                        this._modelClipY = 260;
                    } else if (typeNum == 11) { //灵珠
                        // if (this._modelClip) {
                        //     this._modelClip.setActionType(ActionType.SHOW);
                        // }
                        this._modelClipY = 380;
                    } else {
                        this._modelClipY = 260;
                    }
                }
                // this._modelClip.y = this._modelClipY;
                this._skeleClip.y = this._modelClipY;
                if (isMove == 1) {
                    // this._modelClip.y = this._modelClipY;
                    // this._modelClipTween = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 10 },
                    // 1000).start().yoyo(true).repeat(99999999);
                }
            } else {
                this.modelShowImg.centerY = -43;
                if (isMove == 1) {
                    this._modelShowImgTween = TweenJS.create(this.modelShowImg).to({ centerY: this.modelShowImg.centerY - 10 },
                        1000).start().yoyo(true).repeat(99999999);
                }
                console.log("是图片 尚未处理");
            }
        }

        /**
         * 初始化模型
         */
        public initializeModelClip() {
            // if (!this._modelClip) {
            //     this._modelClip = AvatarClip.create(1024, 1024, 800);
            //     this.modelShowBox.addChildAt(this._modelClip, 1);
            //     this._modelClip.pos(250, this._modelClipY, true);
            //     this._modelClip.anchorX = 0.5;
            //     this._modelClip.anchorY = 0.5;
            //     this._modelClip.zOrder = 100;
            //     // this._modelClip.mouseEnabled = false;
            // }
            if (!this._skeleClip) {
                this._skeleClip = SkeletonAvatar.createShow(this, this.modelShowBox);
                this._skeleClip.pos(250, this._modelClipY, true);
                this._skeleClip.zOrder = 110;
            }
        }

        /**
         * 设置 并显示模型
         * @param showId
         */
        private setAvatar(showId: number): void {
            let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // this._modelClip.avatarRotationY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 180;
            // this._modelClip.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale] * 768 / 1280) : 1;
            // this._modelClip.avatarRotationX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._modelClip.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._modelClip.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
        }
    }
}