///<reference path="../common/common_util.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../vip/vip_model.ts"/>

/** 基本道具格子*/


namespace modules.bag {
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import item_material = Configuration.item_material;
    import BlendMode = Laya.BlendMode;
    import item_materialFields = Configuration.item_materialFields;
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;
    import Image = Laya.Image;
    import CommonUtil = modules.common.CommonUtil;
    import item_rune = Configuration.item_rune;
    import runeRefine = Configuration.runeRefine;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import CustomClip = modules.common.CustomClip;
    import ColorFilter = Laya.ColorFilter;

    export class BaseItem extends ui.BaseItemUI {
        // [key:string]:any;
        // sprite与层的对应字典
        // private static _spriteLayerDic: Dictionary;

        protected _starArray: Array<Image>;
        //
        // protected _levelTxt:Text;
        private _btnClip: CustomClip;
        // 道具数据
        protected _itemData: Protocols.Item;
        // 道具配置数据
        protected _itemCfg: item_equip | item_material | item_stone | runeRefine | item_rune;

        protected _itemType: int;

        private _numSet: boolean;

        private _valueDisplay: boolean;

        public needTip: boolean;

        public _clickHandleEvent: Function = null;

        // 装备灰色滤镜
        public _grayFilter: boolean;

        // private _signature: string;

        constructor() {
            super();
            this.width = this.height = 100;
            // this._signature = new Error().stack;
        }

        // 获取sprite与层的对应字典
        // public static get spriteLayerDic(): Dictionary {
        //     if (!BaseItem._spriteLayerDic) {
        //         BaseItem._spriteLayerDic = new Dictionary();
        //         BaseItem._spriteLayerDic.set("_qualityBg", 0);
        //         BaseItem._spriteLayerDic.set("_icon", 1);
        //         BaseItem._spriteLayerDic.set("_nameTxt", 2);
        //         BaseItem._spriteLayerDic.set("_numTxt", 2);
        //         BaseItem._spriteLayerDic.set("_levelTxt", 2);
        //         BaseItem._spriteLayerDic.set("_numTxt", 2);
        //
        //     }
        //     return BaseItem._spriteLayerDic;
        // }
        protected initialize(): void {
            super.initialize();

            this._starArray = [this.starImg1, this.starImg2, this.starImg3, this.starImg4];
            this._valueDisplay = true;
            this._nameTxt.visible = false;
            this.upImg.visible = false;
            this.maskImg.visible = false;
            this.needTip = true;
            this.grayFilter = false;
            this.rpImg.visible = false;
        }

        /**
         * 是否播放自帶特效
         */
        public set isbtnClipIsPlayer(value: boolean) {
            if (this._btnClip) {
                if (value) {
                    this._btnClip.visible = true;
                    this._btnClip.play();
                } else {
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                }
            }
        }

        protected onOpened(): void {
            super.onOpened();
            if (this._btnClip && this._btnClip.visible) {
                this._btnClip.play();
            }
        }

        public get clip(): CustomClip {
            return this._btnClip;
        }

        /**
         * 设置特效  如果没有配表道具需要item_effect 开头的道具特效 可以直接调用这个 配合isbtnClipIsPlayer播放
         * @param customClipName  特效名字 （1开始  特效路径:H:\proj\client\bin\assets\effect  item_effect开头的都是道具特效 ）
         * @param layer 0 第一种特效放在道具图标和道具底图之间   1第二种是放在图标的最上层。
         */
        public setCustomClip(customClipId: number = 0, layer: number = 0): boolean {
            let bolll = false;//防止出错
            if (customClipId && customClipId != 0) {
                if (this._btnClip) { //不删除的话 重新赋值的时候 会出现上一个特效没有加载完就切换了另一个特效的问题
                    this._btnClip.removeSelf();
                    this._btnClip.destroy();
                    this._btnClip = null;
                }
                // 临时做处理 effect3
                customClipId == 3 ? customClipId = 2 : customClipId;
                // 
                let strName = `item_effect${customClipId}`;
                let urlArr = new Array<string>();
                let leng = this.getCustomClipLeng(customClipId);
                if (leng != 0) {
                    if (customClipId == 3) {
                        for (let i = 0; i < leng; i++) {
                            let str = `${strName}/${i}.jpg`;
                            urlArr.push(str);
                        }
                    } else {
                        for (let i = 0; i < leng; i++) {
                            let str = `${strName}/${i}.png`;
                            urlArr.push(str);
                        }
                    }
                    if (!this._btnClip) {
                        this._btnClip = new CustomClip();
                        //this._btnClip.blendMode = BlendMode.ADD;
                        this._btnClip.scale(1, 1);
                        this.addChildAt(this._btnClip, 3);
                        this._btnClip.skin = `assets/effect/${strName}.atlas`;
                        this._btnClip.frameUrls = urlArr;
                        this._btnClip.durationFrame = 6;
                        this._btnClip.loop = true;
                        this._btnClip.pos(-14, -22);
                        this._btnClip.visible = false;
                    } else {
                        this._btnClip.stop();
                        this._btnClip.visible = false;
                        this._btnClip.skin = `assets/effect/${strName}.atlas`;
                        this._btnClip.frameUrls = urlArr;
                    }
                    if (layer == 1) {
                        let layerNum = this.getChildIndex(this.gradeImg) + 1;
                        this.addChildAt(this._btnClip, layerNum);
                    } else {
                        let layerNum = this.getChildIndex(this._icon) - 1;
                        this.addChildAt(this._btnClip, layerNum);
                    }
                    this.setPosByCustomClipId(customClipId);
                    bolll = true;
                }
            }
            return bolll;//
        }

        /**
         * 设置特效位置
         * @param customClipId
         */
        public setPosByCustomClipId(customClipId: number) {
            if (this._btnClip) {
                switch (customClipId) {
                    case 1:
                        this._btnClip.pos(-10, -10);
                        break;
                    case 2:
                        this._btnClip.pos(-14, -22);
                        break;
                    case 3:
                        this._btnClip.pos(-75, -75);
                        break;
                    default:
                        break;
                }
            }
        }

        /**
         * 根据特效名称获取 特效长度
         */
        public getCustomClipLeng(customClipId: number): number {
            let leng = 0;
            switch (customClipId) {
                case 1:
                    leng = 16;
                    break;
                case 2:
                    // leng = 16;
                    leng = 8;
                    break;
                case 3:
                    leng = 16;
                    break;
                default:
                    break;
            }
            return leng;
        }


        /*设置红点激活状态*/
        public setRPImgActive(active: boolean) {
            this.rpImg.visible = active;
        }

        protected clickHandler(): void {
            if (this.needTip) {

                if (this._itemData == null) {
                    return;
                }

                BagUtil.openBagItemTip(this._itemData);
                //    CommonUtil.openBagItemTip(this._itemData, 4);
            }
        }

        // 当点击item没有提示时，但是又有点击事件处理则在这里赋值
        public set clickHandleEvent(foo: Function) {
            this._clickHandleEvent = foo;
        }

        public set dataSource(value: Protocols.Item) {
            this.setDataSource(value);
        }

        protected setData(value: any): void {
            super.setData(value);
            this.setDataSource(value);
        }

        public setClip(value: boolean) {
            if (value) {
                this._btnClip.play();
                this._btnClip.visible = true;
            } else {
                if (!this._btnClip) return;
                this._btnClip.stop();
                this._btnClip.visible = false;
            }

        }

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this.destroyElement(this._starArray);
            this.removeSelf();
            super.destroy(destroyChild);
        }

        protected setDataSource(value: Protocols.Item): void {
            this.rpImg.visible = false;
            if (value == null) {
                this._itemData = null;
                this._qualityBg.skin = "";
                this._icon.skin = "";
                this._numTxt.text = "";
                this._nameTxt.text = "";
                this._levelTxt.visible = false;
                this.lvImg.visible = false;
                this.gradeImg.visible = false;
                this._qualityBg.skin = `assets/icon/quality_bg/iconbg_0.png`;
                for (let i = 0; i < this._starArray.length; i++) {
                    this._starArray[i].visible = false;
                }
                this.pieceImg.visible = false;
                this.upImg.visible = false;
                this.maskImg.visible = false;
                if (this._btnClip) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
            } else {
                this._itemData = value;
                let itemId: int = value[Protocols.ItemFields.ItemId];
                let quality: int = CommonUtil.getItemQualityById(itemId);
                if (quality > 6) quality = 6;
                this._qualityBg.skin = `assets/icon/quality_bg/iconbg_${quality}.png`;
                // this._icon.skin = `assets/icon/item/${itemId}.png`;
                if (!this._numSet) {
                    // this._numTxt.text = value[Protocols.ItemFields.count].toString();
                    this._numTxt.text = CommonUtil.bigNumToString(value[Protocols.ItemFields.count]);
                    // console.log ("装备数量",CommonUtil.bigNumToString(value[Protocols.ItemFields.count]))
                    this._numTxt.visible = value[Protocols.ItemFields.count] > 1;
                    if (CommonUtil.getItemSubTypeById(itemId) == 52) {
                        this._numTxt.visible = true;
                    }
                }
                let level = (itemId * 0.00001 >> 0) % 100;
                this._levelTxt.value = level.toString();

                this._nameTxt.color = CommonUtil.getColorByQuality(quality);

                this._itemCfg = CommonUtil.getItemCfgById(itemId);
                if (!this._itemCfg) throw new Error("不存在的道具ID：" + itemId);
                this._itemType = CommonUtil.getItemTypeById(itemId);
                let customClipId = 0;
                let layerNum = 0;
                let xingJiNum = 0;
                let xingXing = 0;
                switch (this._itemType) {
                    case ItemMType.Material:
                    case ItemMType.Giftbag:
                    case ItemMType.Consume:
                    case ItemMType.MagicWeapon:
                    case ItemMType.Unreal:
                        this._nameTxt.text = this._itemCfg[item_materialFields.name].toString();
                        this._icon.skin = CommonUtil.getIconById(itemId);
                        this.pieceImg.visible = this._itemCfg[item_materialFields.isPiece] === 1;
                        customClipId = (this._itemCfg as item_material)[item_materialFields.customClipId];
                        layerNum = (this._itemCfg as item_material)[item_materialFields.layerNum];
                        xingJiNum = (this._itemCfg as item_material)[item_materialFields.xingJiNum];
                        break;
                    case ItemMType.Equip:
                        this._nameTxt.text = this._itemCfg[item_equipFields.name].toString();
                        this._icon.skin = CommonUtil.getIconById(itemId);
                        this.pieceImg.visible = false;
                        customClipId = (this._itemCfg as item_equip)[item_equipFields.customClipId];
                        layerNum = (this._itemCfg as item_equip)[item_equipFields.layerNum];
                        xingJiNum = (this._itemCfg as item_equip)[item_equipFields.xingJiNum];
                        break;
                    case ItemMType.Stone:
                        this._nameTxt.text = this._itemCfg[item_stoneFields.name].toString();
                        this._icon.skin = CommonUtil.getIconById(itemId);
                        this.pieceImg.visible = false;
                        customClipId = (this._itemCfg as item_stone)[item_stoneFields.customClipId];
                        layerNum = (this._itemCfg as item_stone)[item_stoneFields.layerNum];
                        xingJiNum = (this._itemCfg as item_stone)[item_stoneFields.xingJiNum];
                        break;
                    case ItemMType.Rune:
                        let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                        let cfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                        this._nameTxt.text = cfg[item_runeFields.name];
                        this._icon.skin = CommonUtil.getIconById(itemId);
                        this.pieceImg.visible = false;
                        customClipId = cfg[item_runeFields.customClipId];
                        layerNum = cfg[item_runeFields.layerNum];
                        xingJiNum = cfg[item_runeFields.xingJiNum];
                        break;
                }

                // 大于6个字的文本进行缩放
                if (this._nameTxt.text.length >= 6) {
                    this._nameTxt.fontSize = 15;
                } else if (this._nameTxt) {
                    this._nameTxt.fontSize = 18;
                }

                xingXing = (this._itemCfg as item_equip)[item_equipFields.xingXingShow];
                this.isbtnClipIsPlayer = this.setCustomClip(customClipId, layerNum);
                if (xingJiNum != 0 && xingJiNum) {
                    this.gradeImg.skin = `common/xiyou${xingJiNum}.png`;
                    this.gradeImg.visible = true;
                }
                else {
                    this.gradeImg.visible = false;
                }
                if (this._itemType == ItemMType.Equip) {
                    this.setLevel(itemId, this._valueDisplay);
                } else if (xingXing > 0) {
                    this.setXingLevel(itemId, true);
                } else {
                    this.setLevel(itemId, false);
                }
                this._icon.size(90, 90);
                this._icon.pos(4, 4, true);
            }
        }

        public get itemData(): Protocols.Item {
            return this._itemData;
        }

        public setNum(value: string = "", color: string = "#ffffff"): void {
            this._numSet = true;
            this._numTxt.visible = true;
            this._numTxt.text = value;
            this._numTxt.color = color;
        }

        public numPos(x: int, y: int, size: int, align: string = null, stroke: int = null): void {
            this._numTxt.x = x;
            this._numTxt.y = y;
            this._numTxt.fontSize = size;
            if (align) {
                this._numTxt.align = align;
            }
            if (stroke != null) {
                this._numTxt.stroke = stroke;
            }
        }

        public setLevel(value: number, bool: boolean): void {
            let start = (value * 0.001 >> 0) % 10;
            for (let i = 0; i < this._starArray.length; i++) {
                if (i < start - 1) {
                    this._starArray[i].visible = bool;
                } else {
                    this._starArray[i].visible = false;
                }
            }
            this._levelTxt.visible = bool;
            this.lvImg.visible = bool;
        }
        public setXingLevel(Level: number, bool: boolean): void {
            for (let i = 0; i < this._starArray.length; i++) {
                if (i <= Level - 1) {
                    this._starArray[i].visible = bool;
                } else {
                    this._starArray[i].visible = false;
                }
            }
            this._levelTxt.visible = false;
            this.lvImg.visible = false;
        }

        public set nameVisible(value: boolean) {
            this._nameTxt.visible = value;
        }

        public set nameColor(value: string) {
            this._nameTxt.color = value;
        }

        public set upImgVisible(value: boolean) {
            this.upImg.visible = value;
        }

        public namePos(x: int, y: int, size: int) {
            this._nameTxt.x = x;
            this._nameTxt.y = y;
            this._nameTxt.fontSize = size;
        }

        public set valueDisplay(b: boolean) {
            this._valueDisplay = b;
        }

        /**
         * 设置灰色遮罩
         * @author VTZ vvtz@qq.com
         */
        public set grayFilter(b: boolean) {
            this._grayFilter = b;
            if (b) {
                //颜色矩阵
                var grayMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
                //创建一个颜色滤镜对象，灰图
                var grayFilter: ColorFilter = new ColorFilter(grayMat);
                this._qualityBg.filters = this.frameImg.filters = this._icon.filters = [grayFilter]
            } else {
                this._qualityBg.filters = this.frameImg.filters = this._icon.filters = []
            }
        }

    }
}
