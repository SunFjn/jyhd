///<reference path="../common_alert/equip_alert_util.ts"/>
///<reference path="../config/attr_item_cfg.ts"/>
///<reference path="../common/attr_util.ts"/>
///<reference path="../config/get_way_cfg.ts"/>

/** 装备穿戴弹框*/
namespace modules.commonAlert {

    import item_equip = Configuration.item_equip;
    import equip_attr_pool = Configuration.equip_attr_pool;
    import Item = Protocols.Item;
    import Text = laya.display.Text;
    import HTMLDivElement = laya.html.dom.HTMLDivElement;
    import Image = Laya.Image;
    import ItemAttrPoolCfg = modules.config.ItemAttrPoolCfg;
    import EquipAlertUI = ui.EquipAlertUI;
    import CommonUtil = modules.common.CommonUtil;
    import IMsgFields = Protocols.IMsgFields;
    import ItemFields = Protocols.ItemFields;
    import BaseItem = modules.bag.BaseItem;
    import TypeAttr = Protocols.TypeAttr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import TypeAttrFields = Protocols.TypeAttrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import LayaEvent = modules.common.LayaEvent;
    import Rectangle = Laya.Rectangle;
    import attr = Configuration.attr;
    import strongRefineFields = Configuration.strongRefineFields;
    import attrFields = Configuration.attrFields;
    import zhuhunFields = Configuration.zhuhunFields;
    import AttrUtil = modules.common.AttrUtil;
    import GetWayCfg = modules.config.GetWayCfg;

    export class EquipBaseAlert extends EquipAlertUI {

        private _contrastElementArr: Array<any>;
        private _item: BaseItem;
        private _baseAttrTxts: Array<Text>;
        public bestAttrTxts: Array<Text>;
        private _intensiveTxts: Array<Text>;
        private _stoneImgs: Array<Image>;
        private _myStoneImgs: Array<Image>;

        public baseAttrImgs: Array<Image>;
        public myBestAttrTxts: Array<Text>;
        public myBaseAttrTxts: Array<Text>;

        public _bestAttrLastY: number;
        public _bestAttrInitY: number;
        public myEquip: Item;
        private _sourceBtns: Array<Laya.Image>;
        private _sourceBtnBg: Array<Laya.Image>;
        private _decTex: Array<laya.display.Text>;

        protected _maxConH: number = 600;
        private _lastPos: number = 0;

        protected initialize(): void {
            super.initialize();

            this._contrastElementArr = [
                this.contrastBox, this.myEquipBgImg, this.myEquipBgTxt, this.myStoneBgImg,
                this.myStoneBgTxt, this.myStoneTxt, this.myRankTxt,
                this.myXiLianBg, this.myXiLianTxt, this.myXiLianAttrTxt,
                this.myZhuHunBg, this.myZhuHunTxt, this.myZhuHunAttrTxt,
            ];

            this._item = new BaseItem();
            this.addChild(this._item);
            this._item.pos(37, 74, true); // 37, 55
            this._item.nameVisible = false;
            this._item.needTip = false;

            this._baseAttrTxts = [this.baseAttrTxt_0, this.baseAttrTxt_1];
            this._intensiveTxts = [this.intenTxt_0, this.intenTxt_1];
            this.baseAttrImgs = [this.baseAttrImg_0, this.baseAttrImg_1];
            this.myBaseAttrTxts = [this.myBaseAttrTxt_0, this.myBaseAttrTxt_1];
            this.bestAttrTxts = [];
            this.myBestAttrTxts = [];
            this._stoneImgs = [];
            this._myStoneImgs = [];

            for (let i: int = 0; i < 5; i++) {
                let img: Image = new Image();
                img.x = 65;
                img.anchorX = 0.5;
                img.anchorY = 0.5;
                this.stoneBox.addChild(img);
                this._stoneImgs.push(img);

                img = new Image();
                img.x = 375;
                img.anchorX = 0.5;
                img.anchorY = 0.5;
                this.stoneBox.addChild(img);
                this._myStoneImgs.push(img);
            }

            this.stoneTxt.color = this.myStoneTxt.color = "#cbcade";
            this.stoneTxt.style.fontFamily = this.myStoneTxt.style.fontFamily = "SimHei";
            this.stoneTxt.style.fontSize = this.myStoneTxt.style.fontSize = 22;
            this.stoneTxt.style.lineHeight = this.myStoneTxt.style.lineHeight = 35;
            this.stoneTxt.style.wordWrap = this.myStoneTxt.style.wordWrap = false;
            this.stoneTxt.mouseEnabled = this.myStoneTxt.mouseEnabled = false;
            // this.myStoneTxt.innerHTML = "未穿戴";

            this._bestAttrInitY = 40;

            this.xiLianAttrTxt.style.wordWrap = this.myXiLianAttrTxt.style.wordWrap = false;
            this.xiLianAttrTxt.style.fontSize = this.myXiLianAttrTxt.style.fontSize = 22;
            this.xiLianAttrTxt.style.lineHeight = this.myXiLianAttrTxt.style.lineHeight = 30;

            this.zhuHunAttrTxt.style.wordWrap = this.myZhuHunAttrTxt.style.wordWrap = false;
            this.zhuHunAttrTxt.style.fontSize = this.myZhuHunAttrTxt.style.fontSize = 22;
            this.zhuHunAttrTxt.style.lineHeight = this.myZhuHunAttrTxt.style.lineHeight = 30;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.conBox, LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this.addAutoListener(this.conBox, LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);

        }

        private downHandler(): void {
            this._lastPos = this.conBox.mouseY;
            Laya.stage.on(LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(LayaEvent.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Laya.Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset);
        }

        private moveHandler(): void {
            let offset: number = this._lastPos - this.conBox.mouseY;
            this.scroll(offset);
            this._lastPos = this.conBox.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(LayaEvent.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        //基本信息
        public setBaseInfo(itemData: Item): void {
            this._item.dataSource = itemData;
            let itemId: number = itemData[ItemFields.ItemId];
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);

            let score: number;
            let sumScore: number;

            let iMsg: Protocols.IMsg = itemData[ItemFields.iMsg];
            if (iMsg) {
                if (iMsg[Protocols.IMsgFields.strongLvl]) {
                    this.nameTxt.text = itemCfg[Configuration.item_equipFields.name] + " +" + itemData[ItemFields.iMsg][IMsgFields.strongLvl].toString();
                } else {
                    this.nameTxt.text = itemCfg[Configuration.item_equipFields.name];
                }
                score = iMsg[Protocols.IMsgFields.baseScore];
                sumScore = iMsg[Protocols.IMsgFields.totalScore];
            } else {
                this.nameTxt.text = itemCfg[Configuration.item_equipFields.name];
                score = itemCfg[Configuration.item_equipFields.notGeneratedScore][0];
                sumScore = score;
            }
            this.nameTxt.color = '#ffffff';//CommonUtil.getColorById(itemId);
            //.....新增 道具品质背景图
            this.qualityImg.skin = CommonUtil.getBgImgById(itemId);  // getBgImgById  
            let quality: int = CommonUtil.getItemQualityById(itemId);
            this.qualityImg1.visible = this.qualityImg2.visible = this.qualityImg3.visible = quality == 6;
            //.....
            this.scoreTxt.text = score.toString();
            this.sumScoreTxt.text = sumScore.toString();

            let ear: number = itemCfg[Configuration.item_equipFields.era];
            let needLv: number = itemCfg[Configuration.item_equipFields.wearLvl];
            if (ear) {
                this.lvTxt.text = `${needLv}(${CommonUtil.numToUpperCase(ear)}阶)`;
            } else {
                this.lvTxt.text = `${needLv}`;
            }
        }

        //基本属性
        public setBaseAttr(itemData: Item): void {
            let itemId: number = itemData[ItemFields.ItemId];
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
            let baseAttrs: Configuration.attr[] = itemCfg[Configuration.item_equipFields.baseAttr];
            let part: number = CommonUtil.getPartById(itemId);
            let intensiveLv: number = itemData[ItemFields.iMsg] ? itemData[ItemFields.iMsg][IMsgFields.strongLvl] : 0;
            let strongcfg: Configuration.strongRefine = config.IntensiveCfg.instance.getCfgByPart(part, intensiveLv);
            let attrs: Array<attr> = strongcfg[strongRefineFields.attrs];
            for (let i: number = 0; i < baseAttrs.length; i++) {
                let type: number = baseAttrs[i][Configuration.attrFields.type];
                let value: number = baseAttrs[i][Configuration.attrFields.value];
                let attrItem: attr_item = AttrItemCfg.instance.getCfgById(type);
                this._baseAttrTxts[i].text = attrItem[attr_itemFields.name] + ": " + value.toString();
                let flag: boolean = false;
                for (let j: int = 0, len = attrs.length; j < len; j++) {
                    if (type === attrs[j][attrFields.type]) {
                        flag = true;
                        this._intensiveTxts[i].text = `(强化+${attrs[j][attrFields.value]})`;
                        break;
                    }
                }
                this._intensiveTxts[i].visible = flag;
            }
        }

        //极品属性值
        public setBestAttr(iMsg: Protocols.IMsg, type?: string): number {
            let txts: Text[] = type ? this.myBestAttrTxts : this.bestAttrTxts;
            for (let i: int = 0, len: int = txts.length; i < len; i++) {
                txts[i].visible = false;
            }
            let count: number = 0;
            if (!iMsg) return count;
            if (iMsg[IMsgFields.orangeAttr] && iMsg[IMsgFields.orangeAttr].length > 0) {
                this.setBestAttrByColor(iMsg[IMsgFields.orangeAttr], count, type, txts);
                count += iMsg[IMsgFields.orangeAttr].length;
            }
            if (iMsg[IMsgFields.purpleAttr] && iMsg[IMsgFields.purpleAttr].length > 0) {
                this.setBestAttrByColor(iMsg[IMsgFields.purpleAttr], count, type, txts);
                count += iMsg[IMsgFields.purpleAttr].length;
            }
            if (iMsg[IMsgFields.blueAttr] && iMsg[IMsgFields.blueAttr].length > 0) {
                this.setBestAttrByColor(iMsg[IMsgFields.blueAttr], count, type, txts);
                count += iMsg[IMsgFields.blueAttr].length;
            }
            return count;
        }

        //设置极品属性值文本颜色
        public setBestAttrByColor(attr: Array<Protocols.extendAttr>, count: number, type: string, txts: Text[]): void {
            for (let i: number = 0; i < attr.length; i++) {
                let attId: number = attr[i][Protocols.extendAttrFields.id];
                let attrCfg: equip_attr_pool = ItemAttrPoolCfg.instance.getCfgById(attId);
                let quality = attrCfg[Configuration.equip_attr_poolFields.quality];
                if (!txts[count]) {
                    let txt: Text = new Text();
                    txt.fontSize = 22;
                    txt.font = "SimHei";
                    txts[count] = txt;
                    this.bestAttrBox.addChild(txt);
                }
                txts[count].color = CommonUtil.getColorByQuality(quality);
                txts[count].pos(type ? 370 : 44, this._bestAttrInitY + 30 * count);
                txts[count].text = attrCfg[Configuration.equip_attr_poolFields.name];
                txts[count].visible = true;
                this._bestAttrLastY = txts[count].y + txts[count].height;
                count++;
            }
        }

        public setStoneAttr(iMsg: Protocols.IMsg, type?: string): void {
            if (!iMsg) {
                this._myStoneImgs.forEach((img) => {
                    img.visible = false;
                });
                this.myStoneTxt.innerHTML = "";
                return;
            }
            let gemGrids: Protocols.GemGrids = iMsg[Protocols.IMsgFields.gems];
            let stones: Protocols.GemGrid[] = gemGrids[Protocols.GemGridsFields.gems];
            let stoneInfos: number[] = this.setStoneInfos(stones);
            this.setStoneTxts(stoneInfos, type);
        }

        private setStoneInfos(stones: Protocols.GemGrid[]): number[] {
            let stoneInfos: number[] = [null, null, null, null, null];
            for (let i: int = 0, len: int = stones.length; i < len; i++) {
                let pit: number = stones[i][Protocols.GemGridFields.number]; //槽位
                let id: number = stones[i][Protocols.GemGridFields.itemId];
                stoneInfos[pit] = id;
            }
            stoneInfos.push(stoneInfos.shift());
            return stoneInfos;
        }

        private setStoneTxts(stoneInfos: number[], type?: string): void {
            let imgs: Image[] = type ? this._myStoneImgs : this._stoneImgs;
            let txt: HTMLDivElement = type ? this.myStoneTxt : this.stoneTxt;
            let str: string = ``;
            let flags: boolean[] = [];
            let initY: number = 68;
            for (let i: int = 0, len: int = stoneInfos.length; i < len; i++) {
                let stoneId: number = stoneInfos[i];
                if (stoneId) {
                    flags[i] = true;
                    let stoneCfg: Configuration.item_stone = config.ItemStoneCfg.instance.getItemCfgById(stoneId);
                    imgs[i].skin = CommonUtil.getIconById(stoneId);
                    imgs[i].scale(0.5, 0.5);
                    if (!imgs[i - 1]) {  //第一个
                        imgs[i].y = initY;
                    } else {
                        if (!flags[i - 1]) { //没有仙石
                            imgs[i].y = imgs[i - 1].y + 35;
                        } else {
                            imgs[i].y = imgs[i - 1].y + 105;
                        }
                    }
                    let name: string = stoneCfg[Configuration.item_stoneFields.name];
                    let color: string = CommonUtil.getColorById(stoneId);
                    str += `<span style='color:${color}'>${name}</span><br/>`;
                    let des: string = stoneCfg[Configuration.item_stoneFields.des];
                    des = this.sliceStr(des);
                    str += `${des}<br/>`;
                } else {
                    flags[i] = false;
                    let vipStr: string = ``;
                    if (i == stoneInfos.length - 1) {
                        let needVip: number = config.PrivilegeCfg.instance.getOpenFuncByType(Privilege.gemGridOpen);
                        let currVip: number = vip.VipModel.instance.vipLevel;
                        if (currVip >= needVip) {
                            vipStr = ``;
                        } else {
                            vipStr = `<span style='color:#C96300'>SVIP${needVip}开启</span>`;
                        }
                    }
                    imgs[i].skin = `common/dt_tips_01.png`;
                    imgs[i].scale(1, 1);
                    if (!imgs[i - 1]) {
                        imgs[i].y = initY;
                    } else {
                        if (!flags[i - 1]) { //没有仙石
                            imgs[i].y = imgs[i - 1].y + 35;
                        } else {
                            imgs[i].y = imgs[i - 1].y + 105;
                        }
                    }
                    str += `未镶嵌${vipStr}<br/>`;
                }
            }
            txt.innerHTML = str;
        }

        public setRank(itemId: number): void {
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
            let des: string = itemCfg[Configuration.item_equipFields.des];
            this.rankTxt.text = des;
            if (this.myEquip) {
                itemCfg = config.ItemEquipCfg.instance.getItemCfgById(this.myEquip[ItemFields.ItemId]);
                des = itemCfg[Configuration.item_equipFields.des];
                this.myRankTxt.text = des;
            } else {
                this.myRankTxt.text = `未穿戴`;
            }
            let _h = this.elseBox.y + this.elseBox.height + 60;
            if (this.soureBox.visible) {
                _h += this.soureBox.height;
            }
            this.height = this.bgImg.height = _h;
            this.backTxt.y = this.height + 40;
            this.qualityImg1.height = this.height + 6;
        }

        private sliceStr(str: string): string {
            let newStr: string = "";
            for (let i: number = 0, len: number = str.length; i < len; i++) {
                if (str[i] === "+") {
                    newStr += ":";
                } else if (str[i] === "；") {
                    newStr += "<br/>";
                } else {
                    newStr += str[i];
                }
            }
            return newStr;
        }

        // 洗炼属性，返回洗炼属性box的高度
        public setXiLian(attrs: Array<TypeAttr>, isMy: boolean = false): number {
            this.xiLianBox.visible = true;
            let txt: HTMLDivElement = isMy ? this.myXiLianAttrTxt : this.xiLianAttrTxt;
            let str: string = "";
            let count: int = 0;
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attr: TypeAttr = attrs[i];
                if (!attr) continue;
                count++;
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attr[TypeAttrFields.type]);
                let attrValue: number = attr[TypeAttrFields.value];
                let attrValueStr: string = attrCfg[attr_itemFields.isPercent] ? (attrValue * 100).toFixed(2) + "%" : Math.round(attrValue) + "";
                let color: string = CommonUtil.getColorByQuality(attr[TypeAttrFields.color] - 1);
                str += `<span color="${color}">${attrCfg[attr_itemFields.name]}+${attrValueStr}</span>`;
                str += i === len - 1 ? "" : "<br/>";
            }
            if (count === 0) {
                this.xiLianBox.visible = false;
                txt.innerHTML = str;
                return 1;
            } else {
                txt.innerHTML = str;
                txt.style.height = txt.contextHeight;
                return txt.y + txt.height;
            }
        }

        /**
         * 铸魂属性
         */
        public setZhuHun(itemData: Item, isMy: boolean = false): number {
            this.zhuHunBox.visible = true;
            let count: int = 0;
            let str: string = "";
            if (itemData) {
                let itemId: number = itemData[ItemFields.ItemId];
                let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
                let baseAttrs: Configuration.attr[] = itemCfg[Configuration.item_equipFields.baseAttr];
                let part: number = CommonUtil.getPartById(itemId);
                let zhuhunLvl: number = itemData[ItemFields.iMsg] ? itemData[ItemFields.iMsg][IMsgFields.zhuhunLvl] : 0;
                zhuhunLvl = zhuhunLvl ? zhuhunLvl : 0;
                let maxLv = modules.config.EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);
                zhuhunLvl = zhuhunLvl > maxLv ? maxLv : zhuhunLvl;
                if (zhuhunLvl > 0) {
                    let zhuHunCfg = modules.config.EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, zhuhunLvl);
                    if (zhuHunCfg) {
                        let attrs: Array<attr> = zhuHunCfg[zhuhunFields.attrs];
                        count = attrs.length;
                        for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                            let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                            let attrValue: number = attrs[i][attrFields.value];
                            let attrValueStr: string = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                            str += `<span color="#cbcade">${attrCfg[attr_itemFields.name]}:${attrValueStr}</span><br/>`
                        }
                    }
                }
            }
            if (count === 0) {
                this.zhuHunBox.visible = false;
                return 1;
            } else {
                let txt: HTMLDivElement = isMy ? this.myZhuHunAttrTxt : this.zhuHunAttrTxt;
                txt.innerHTML = str;
                txt.style.height = txt.contextHeight;
                return txt.y + txt.height;
            }
        }
        private _sourceBtnArr: Array<number>;
        /**
         * 设置来源
         * @param itemData 道具信息
         * @author VTZ
         */
        public setSource(itemData: Item) {
            if (itemData) {
                let itemId: number = itemData[ItemFields.ItemId];
                let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
                let itemSourceIds: Array<number> = itemCfg[Configuration.item_equipFields.itemSourceId];
                this._sourceBtnBg = [];
                this._sourceBtns = [];
                this._decTex = [];
                this._sourceBtnArr = []
                for (let i: number = 0; i < 5; i++) {
                    this._sourceBtns[i] = new Laya.Image();
                    this._sourceBtnBg[i] = new Laya.Image();
                    this._decTex[i] = new laya.display.Text();
                    PropAlertUtil.setDesTxt(this._decTex[i]);
                    this._sourceBtns[i].mouseEnabled = true;
                    if (i >= itemSourceIds.length) continue;
                    // this._sourceBtnBg[i].addChild(this._sourceBtns[i]);
                    this.getWayBtn(this._sourceBtns[i], itemSourceIds[i], itemSourceIds.length, i, this._sourceBtnBg[i]);
                    this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
                }
                this._sourceBtnArr = itemSourceIds
                return this._sourceBtnBg;
            }

        }
        private getOpenPlaneId(index: number): void {
            let id: number = this._sourceBtnArr[index];
            PropAlertUtil.clickHandler(id);
        }
        private getWayBtn(img: Laya.Image, arr: number, len: number, n: number, image: Laya.Image): void {
            let getWayCfg: Configuration.get_way;
            image.addChild(img);
            getWayCfg = GetWayCfg.instance.getCfgById(arr);
            image.pos(30 + (588 - 158 * len + 42 * (len - 1)) * 0.5 + n * 116, 45);
            img.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
            image.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
            // image.pos(img.x, img.y);
            img.addChild(this._decTex[n]);
            this._decTex[n].pos(6, 70);
            this._decTex[n].text = getWayCfg[Configuration.get_wayFields.desc];
        }

        public destroy(): void {

            if (this._contrastElementArr) {
                for (let e of this._contrastElementArr) {
                    e.destroy(true);
                }
                this._contrastElementArr = null;
            }
            if (this._item) {
                this._item.destroy(true);
                this._item = null;
            }
            if (this._baseAttrTxts) {
                for (let e of this._baseAttrTxts) {
                    e.destroy(true);
                }
                this._baseAttrTxts = null;
            }
            if (this.bestAttrTxts) {
                for (let e of this.bestAttrTxts) {
                    e.destroy(true);
                }
                this.bestAttrTxts = null;
            }
            if (this._stoneImgs) {
                for (let e of this._stoneImgs) {
                    e.destroy(true);
                }
                this._stoneImgs = null;
            }
            if (this._myStoneImgs) {
                for (let e of this._myStoneImgs) {
                    e.destroy(true);
                }
                this._myStoneImgs = null;
            }
            if (this._intensiveTxts) {
                for (let e of this._intensiveTxts) {
                    e.destroy(true);
                }
                this._intensiveTxts = null;
            }
            if (this.baseAttrImgs) {
                for (let e of this.baseAttrImgs) {
                    e.destroy(true);
                }
                this.baseAttrImgs = null;
            }
            if (this.myBestAttrTxts) {
                for (let e of this.myBestAttrTxts) {
                    e.destroy(true);
                }
                this.myBestAttrTxts = null;
            }
            if (this.myBaseAttrTxts) {
                for (let e of this.myBaseAttrTxts) {
                    e.destroy(true);
                }
                this.myBaseAttrTxts = null;
            }

            this._sourceBtns = this.destroyElement(this._sourceBtns);
            this._sourceBtnBg = this.destroyElement(this._sourceBtnBg);
            this._decTex = this.destroyElement(this._decTex);

            this.myEquip = null;
            super.destroy();
        }

        public get itemData(): Item {
            return this._item.itemData;
        }

        public set isNeedContrast(b: boolean) {
            for (let i: int = 0, len: int = this._contrastElementArr.length; i < len; i++) {
                let node: Laya.Sprite = this._contrastElementArr[i];
                node.visible = b;
            }
        }

        // 设置con的高度
        public setConHeight(value: number): number {
            this.conBox.height = value;
            let h: number = value > this._maxConH ? this._maxConH : value;
            let rect: Rectangle = this.conBox.scrollRect;
            if (!rect) rect = new Rectangle(0, 0, this.conBox.width, h);
            else rect.setTo(0, 0, this.conBox.width, h);
            this.conBox.scrollRect = rect;
            this.conBox.mouseEnabled = value > this._maxConH;
            return h;
        }

        // 滚动偏移（相对于当前滚动位置的偏移）
        public scroll(offset: number): void {
            let rect: Rectangle = this.conBox.scrollRect;
            rect.y = rect.y + offset;
            if (rect.y < 0) rect.y = 0;
            else if (rect.y > this.conBox.height - this._maxConH) {
                rect.y = this.conBox.height - this._maxConH;
            }
            this.conBox.scrollRect = rect;
        }
    }
}