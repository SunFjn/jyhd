///<reference path="../config/treasure_cfg.ts"/>
/**圣物探索面板*/
///<reference path="../config/store_cfg.ts"/>
/// <reference path="../store/store_model.ts" />

namespace modules.treasure {
    import CustomList = modules.common.CustomList;
    import Event = laya.events.Event;
    import TreasureCfg = modules.config.TreasureCfg;
    import xunbao_weightFields = Configuration.xunbao_weightFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RunXunbaoReplyFields = Protocols.RunXunbaoReplyFields;
    import XunbaoNoteFields = Protocols.XunbaoNoteFields;
    import BtnGroup = modules.common.BtnGroup;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import CustomClip = modules.common.CustomClip;
    import BlendMode = Laya.BlendMode;
    import Point = laya.maths.Point;
    import Label = laya.ui.Label;
    import Image = laya.ui.Image;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import StoreCfg = modules.config.StoreCfg;
    import mallFields = Configuration.mallFields;
    import MallNodeFields = Protocols.MallNodeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import StoreModel = modules.store.StoreModel;

    export class TreasureTalismanPanel extends ui.TreasureTalismanViewUI {
        private _sevTextArr: Array<any>;
        private _sevStringArr: Array<any>;
        private severListLen: number;

        private _personalList: CustomList;

        private _moveItemArr: Array<TreasureTalismanItem>;
        private _moveItemDatas: Array<number>;
        private _moveDataLen: number;


        private _showItem: Array<any>;
        private _btnGroup: BtnGroup;
        private _costNumArr: Array<Label>;
        private _costImgArr: Array<Image>;
        private _buttonList: CustomList;
        private _clipArr: Array<CustomClip>;
        private _shouChouBiDeImgTween: TweenJS;
        private _maxBless: number;
        private _type: number;
        private _tenBtnBtnClip: CustomClip;
        private _isShowWuShiChou: boolean;
        public destroy(destroyChild: boolean = true): void {
            this._personalList = this.destroyElement(this._personalList);
            this._buttonList = this.destroyElement(this._buttonList);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._clipArr = this.destroyElement(this._clipArr);
            this._tenBtnBtnClip = this.destroyElement(this._tenBtnBtnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._maxBless = 360;
            this._isShowWuShiChou = false;

            this._type = 4;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.severList, this.selfList);

            this._showItem = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6, this.item7, this.item8, this.item9, this.item10, this.item11, this.item12, this.item13, this.item14];

            this._buttonList = new CustomList();
            this._buttonList.scrollDir = 2;
            this._buttonList.vCount = 1;
            this._buttonList.itemRender = TreasureButtonItem;
            this._buttonList.spaceX = -23;
            this._buttonList.width = 670;
            this._buttonList.height = 100;
            this._buttonList.x = 44;
            this._buttonList.y = 1090;
            this.addChildAt(this._buttonList, 25);
            // 装备 圣物 巅峰 至尊
            //装备0 巅峰1 至尊2 圣物4
            this._buttonList.datas = TreasureModel.instance._xunBaoListIndex;
            // this._buttonList.datas = TreasureCfg.instance.getXunbaoType();
            // this._buttonList.selectedIndex = 0;

            this._personalList = new CustomList();
            this._personalList.itemRender = TreasureItemText;
            this._personalList.hCount = 1;
            this._personalList.spaceY = 8;
            this._personalList.width = 500;
            this._personalList.height = 112;
            this._personalList.x = 0;
            this._personalList.y = 0;
            this.selfPanel.addChild(this._personalList);
            this.initializeClip();

            this._sevTextArr = new Array<any>();
            this._sevStringArr = new Array<any>();

            this.severListLen = 4;
            for (let i = 0; i < this.severListLen; i++) {
                let text = new laya.html.dom.HTMLDivElement();
                text.width = 499;
                text.style.height = 20;
                text.pos(0, i * 28);
                this._sevTextArr.push(text);
                this.severPanel.addChild(text);
            }


            this._moveItemDatas = BlendCfg.instance.getCfgById(15002)[blendFields.intParam];
            this._moveItemArr = new Array<TreasureTalismanItem>();
            this._moveDataLen = 6;
            for (let i = 0; i < 6; i++) {
                let item = new TreasureTalismanItem();
                item.pos(12 + i * 124, 0);
                item.data = this._moveItemDatas[i];
                this._moveItemArr.push(item);
                this.itemPanel.addChild(item);
            }


            this._clipArr = new Array<CustomClip>();
            for (let i = 0; i < 4; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                // clip.blendMode = BlendMode.ADD;
                // 临时屏蔽effect3动画特效
                // if (i < 3 && i > 0) {
                //     this._showItem[i].addChild(clip);
                //     clip.pos(-75, -75, true);
                //     clip.skin = "assets/effect/item_effect3.atlas";
                //     for (let i = 1; i < 16; i++) {
                //         let str = `item_effect3/${i}.jpg`;
                //         urlArr.push(str);
                //     }
                // } else {
                this._showItem[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                // for (let i = 0; i < 16; i++) {
                for (let i = 0; i < 8; i++) {
                    let str = `item_effect2/${i}.png`;
                    urlArr.push(str);
                }
                // }
                clip.frameUrls = urlArr;
                clip.durationFrame = 6;
                // clip.play();
                clip.visible = false;
                clip.name = "clip";
                this._clipArr.push(clip);
            }

            this._costNumArr = [this.oneCount, this.tenCount, this.fiftyCount];
            this._costImgArr = [this.oneCountImg, this.tenCountImg, this.fiftyCountImg];


            this.regGuideSpr(GuideSpriteId.TREASURE_TALISMAN_BTN, this.oneBtn);
            this.regGuideSpr(GuideSpriteId.TREASURE_EQUIP_TAB_BTN, this._buttonList.items[0]);
            this.regGuideSpr(GuideSpriteId.TREASURE_TALISMAN_TAB_BTN, this._buttonList.items[1]);
            this.regGuideSpr(GuideSpriteId.TREASURE_DIANFENG_TAB_BTN, this._buttonList.items[2]);
            this.regGuideSpr(GuideSpriteId.TREASURE_ZHIZUN_TAB_BTN, this._buttonList.items[3]);
        }

        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            if (value != null) {
                this._buttonList.selectedData = value;
            } else {
                this._buttonList.selectedData = 4;
            }
            this.selectHandler();
        }

        private selectHandler(): void {
            let type = this._buttonList.selectedData;
            if (type != this._type) {
                switch (type) {
                    case 0: {
                        WindowManager.instance.open(WindowEnum.TREASURE_PANEL, this._buttonList.selectedData);
                    }
                        break;
                    case 1: {
                        WindowManager.instance.open(WindowEnum.TREASURE_DIANFENG_PANEL, this._buttonList.selectedData);
                    }
                        break;
                    case 2: {
                        WindowManager.instance.open(WindowEnum.TREASURE_ZHIZUN_PANEL, this._buttonList.selectedData);
                    }
                        break;
                    case 3: {
                        WindowManager.instance.open(WindowEnum.TREASURE_RUNE_PANEL, this._buttonList.selectedData);
                    } break;
                    case 4: {
                        WindowManager.instance.open(WindowEnum.TREASURE_TALISMAN_PANEL, this._buttonList.selectedData);
                    }
                        break;
                }
            } else {
                let cfg = TreasureCfg.instance.getItemShow(this._type)[0];
                let showItems = cfg[xunbao_weightFields.showItem];
                for (let i = 0; i < this._showItem.length; i++) {
                    let itm = [showItems[i], 0, 0, null];
                    this._showItem[i].dataSource = itm;
                    if (i < 4) {
                        this._showItem[i].nameVisible = true;

                        this._showItem[i].isbtnClipIsPlayer = false;
                        let _clip: CustomClip = this._showItem[i].getChildByName("clip") as CustomClip;
                        _clip.play();
                        _clip.visible = true;
                    }
                }
                this.updateCost();
            }
        }

        private updateCost(): void {
            let bollll = false;
            switch (this._type) {
                case 0:
                    bollll = StoreModel.instance.dontShowTreasure;
                    break;
                case 4:
                    bollll = StoreModel.instance.dontShowTalisman;
                    break;
                case 3:
                    bollll = StoreModel.instance.dontShowFuWen;
                    break;
                case 2:
                    bollll = StoreModel.instance.dontShowZhiZun;
                    break;
                case 1:
                    bollll = StoreModel.instance.dontShowDianFeng;
                    break;
            }
            for (let i = 0; i < this._costNumArr.length; i++) {
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, i);
                this._costImgArr[i].skin = CommonUtil.getIconById(condition[idCountFields.id]);
                this._costImgArr[i].scale(0.4, 0.4);
                let cost = condition[idCountFields.count];
                let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
                this._costNumArr[i].text = count + "/" + cost;
                if (count >= cost) {
                    this._costNumArr[i].color = "#2d2d2d";
                } else {
                    if (bollll) {
                        this._costImgArr[i].skin = `common/icon_tongyong_2.png`;
                        this._costNumArr[i].color = "#2d2d2d";
                        this._costImgArr[i].scale(1, 1);
                        let mallCfg: Configuration.mall = CommonUtil.getMallByItemId(condition[idCountFields.id]);
                        if (mallCfg) {
                            let xianjia = mallCfg[Configuration.mallFields.realityPrice][1];
                            let chaNum = cost - count;
                            let moneyNum = chaNum * xianjia;
                            this._costNumArr[i].text = `${moneyNum}`;
                            if (modules.player.PlayerModel.instance.ingot >= moneyNum) {
                                this._costNumArr[i].color = "#2d2d2d";
                            } else {
                                this._costNumArr[i].color = "#E6372E";
                            }
                        }
                    } else {
                        this._costNumArr[i].color = "#E6372E";
                    }
                }
            }
            TreasureModel.instance.panduianRp();
            this.showShouChouBiDeImg();
            this._buttonList.datas = TreasureModel.instance._xunBaoListIndex;
        }

        private getSeverList(): void {
            Channel.instance.publish(UserCenterOpcode.GetXunbaoServerBroadcast, [this._type]);
        }

        private updateList(): void {
            for (let i = 0; i < this._sevTextArr.length; i++) {
                this._sevTextArr[i].y -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                if (this._sevTextArr[i].y <= -10) {
                    this._sevTextArr[i].y = 102;
                    if (this.severListLen < this._sevStringArr.length) {
                        this.severListLen++;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    } else {
                        this.severListLen = 1;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    }
                }
            }
        }

        public updateShowItemList(): void {
            for (let i = 0; i < this._moveItemArr.length; i++) {
                this._moveItemArr[i].x -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                if (this._moveItemArr[i].x <= -112) {
                    this._moveItemArr[i].x = 632;
                    if (this._moveDataLen < this._moveItemDatas.length) {
                        this._moveDataLen++;
                        this._moveItemArr[i].data = this._moveItemDatas[this._moveDataLen - 1];
                    } else {
                        this._moveDataLen = 1;
                        this._moveItemArr[i].data = this._moveItemDatas[this._moveDataLen - 1];
                    }
                }
            }
        }

        private changeList(): void {
            switch (this._btnGroup.selectedIndex) {
                case 0: {
                    this.severPanel.visible = true;
                    this.selfPanel.visible = false;
                }
                    break;
                case 1: {
                    this.severPanel.visible = false;
                    this.selfPanel.visible = true;
                }
                    break;
            }
        }

        private updateSeverList() {
            let svrList = TreasureModel.instance.getSvrBroadcast(this._type);
            // if(svrList==null){
            //     svrList=TreasureModel.instance.getSvrBroadcast(0);
            // }
            // let svrList=TreasureModel.instance.getSvrBroadcast(0);

            if (svrList != null) {
                if (svrList.length > 0) {
                    if (this._sevStringArr.length > 0) {
                        this._sevStringArr.length = 0;
                    }
                    for (let i = 0; i < svrList.length; i++) {
                        let name = svrList[i][XunbaoNoteFields.name];
                        let itemId = svrList[i][XunbaoNoteFields.itemId];
                        let itemName = CommonUtil.getNameByItemId(itemId);
                        let itemColor = CommonUtil.getColorById(itemId);
                        var html: string = "<span style='color:#ffffff;font-size: 20px'>天赐鸿福,</span>";
                        html += `<span style='color:rgb(13,121,255);font-size: 20px;'>${name}</span>`;
                        html += "<span style='color:#ffffff;font-size: 20px'>获得了</span>";
                        html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
                        this._sevStringArr.push(html);
                    }
                }

            }
        }

        private updateSelfList() {
            let ap = TreasureModel.instance.getSelfBroadcast(this._type);
            if (ap != null) {
                if (ap.length > 0) {
                    this._personalList.datas = ap;
                    this._personalList.scrollTo(this._personalList.datas.length * 28);
                }
            }
        }

        public timeStampToMMSS(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;

            if (offset <= 0) {
                str = "00:00:00";
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                let hour: int = minute / 60 >> 0;
                let day: int = hour / 24 >> 0;
                sec = sec % 60;
                minute = minute % 60;
                hour = hour % 24;
                str = day + "天" + hour + "时" + minute + "分";
            }
            return str;
        }

        private shengyuTime(): void {
            Laya.timer.clear(this, this.updateTime);
            Laya.timer.loop(1000, this, this.updateTime);
            this.updateTime();
        }

        private updateTime(): void {
            let time = TreasureModel.instance.restTime;
            this.time.text = this.timeStampToMMSS(time);
            if (time < GlobalData.serverTime) {
                this.Img1.visible = false;
                this.time.visible = false;
                this.artImg.y = 140;
                this.Text1.y = 140;
            } else {
                this.Img1.visible = true;
                this.time.visible = true;
                this.artImg.y = 168;
                this.Text1.y = 168;
            }
        }

        private xunBaoHandler(value: any): void {
            //condition没有用枚举 
            // if (value) {
            //     if (this._cdFlag) {
            //         SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
            //         return;
            //     }
            //     this._cdFlag = true;
            //     Laya.timer.once(500, this, this.setFlag);
            // }
            let bollll = false;
            switch (this._type) {
                case 0:
                    bollll = StoreModel.instance.dontShowTreasure;
                    break;
                case 4:
                    bollll = StoreModel.instance.dontShowTalisman;
                    break;
                case 3:
                    bollll = StoreModel.instance.dontShowFuWen;
                    break;
                case 2:
                    bollll = StoreModel.instance.dontShowZhiZun;
                    break;
                case 1:
                    bollll = StoreModel.instance.dontShowDianFeng;
                    break;
            }
            if (bollll) {
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, value);
                let cost = condition[idCountFields.count];
                let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
                let isMianFei = TreasureModel.instance.fistMianFei(this._type);
                if (count >= cost || (isMianFei && value == 0)) {
                    //直接发送抽奖请求
                    //如果数量足够，直接探索
                    TreasureCtrl.instance.runXunbao(this._type, value, true);
                    return;
                } else {
                    let mallCfg: Configuration.mall = CommonUtil.getMallByItemId(condition[idCountFields.id]);
                    if (mallCfg) {
                        let xianjia = mallCfg[Configuration.mallFields.realityPrice][1];
                        let chaNum = cost - count;
                        let moneyNum = chaNum * xianjia;
                        if (modules.player.PlayerModel.instance.ingot >= moneyNum) {
                            //直接发送抽奖请求
                            TreasureCtrl.instance.runXunbao(this._type, value, true);
                            return;
                        } else {
                            CommonUtil.goldNotEnoughAlert();
                        }
                    }
                }
            } else {//改之前的逻辑并不想动
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, value);/*消耗道具 道具ID#道具数量*/
                let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);   //拥有道具的数量
                let maxNum = condition[1];//消耗道具数量
                let conditionId = condition[0];//消耗道具ID
                maxNum = maxNum ? maxNum : 1;
                //如果数量足够，直接探索
                let isMianFei = TreasureModel.instance.fistMianFei(this._type);
                if (count >= maxNum || (isMianFei && value == 0)) {
                    TreasureCtrl.instance.runXunbao(this._type, value);
                    return;
                }
                let shortcutBuy: number = ItemMaterialCfg.instance.getItemCfgById(conditionId)[item_materialFields.shortcutBuy];
                let malldata: Configuration.mall = StoreCfg.instance.getCfgByitemId(shortcutBuy);
                let need: number = maxNum - count;     //需要购买的数量
                //装备0 巅峰1 至尊2 圣物4
                switch (this._type) {
                    case 0:
                        if (StoreModel.instance.dontShowTreasure) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 4:
                        if (StoreModel.instance.dontShowTalisman) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;
                    case 3:
                        if (StoreModel.instance.dontShowFuWen) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;
                    case 2:
                        if (StoreModel.instance.dontShowZhiZun) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 1:
                        if (StoreModel.instance.dontShowDianFeng) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;
                }
            }
        }

        // private xunBaoHandler(value: any): void {
        //     //condition没有用枚举
        //     let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, value);/*消耗道具 道具ID#道具数量*/
        //     let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
        //     let maxNum = condition[1];//消耗道具数量
        //     let conditionId = condition[0];//消耗道具ID
        //     maxNum = maxNum ? maxNum : 1;
        //     if (count < maxNum) {
        //         if (conditionId) {
        //             this.showStoreAlert(conditionId);
        //         }
        //     } else {
        //         TreasureCtrl.instance.runXunbao(this._type, value);
        //     }
        // }

        /**
         * 钥匙不够 显示快捷购买界面
         */
        public showStoreAlert(ID: number) {
            let shortcutBuy: number = ItemMaterialCfg.instance.getItemCfgById(ID)[item_materialFields.shortcutBuy];
            let malldata: Configuration.mall = StoreCfg.instance.getCfgByitemId(shortcutBuy);
            let limitBuy = malldata[mallFields.limitBuy];
            //判断数量
            let _limitCount = limitBuy[idCountFields.count];
            let _nowCount = 0;
            let _id = malldata[mallFields.id];
            let limit = modules.store.StoreModel.instance.getLimitById(_id);
            if (limit != null) {
                _nowCount = limit[MallNodeFields.limitCount];
            }
            let count = _limitCount - _nowCount;//剩余可购买数
            WindowManager.instance.openDialog(WindowEnum.STORE_ALERT, [malldata, count]);
        }

        private xunBaoReply(): void {
            let reply = TreasureModel.instance.runXunbaoReply;
            if (reply[RunXunbaoReplyFields.result] == 0) {
                Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [this._type]);
                this.getSeverList();
                let type = reply[RunXunbaoReplyFields.type];
                let items = reply[RunXunbaoReplyFields.items];
                // let cfgs:Array<xunbao_weight>=TreasureCfg.instance.getItemShow(type);
                if (items.length == 1) {
                    let start = new Point(300, 350);
                    // let item=[items,0,0,null];
                    let arr = [items, start, this.height];
                    GlobalData.dispatcher.event(CommonEventType.XUNBAO_EFFECT, [arr]);
                }
                if (items.length > 1) {
                    WindowManager.instance.open(WindowEnum.TREASURE_ALERT, [items, this._type]);
                }
                let bestIdArr = TreasureCfg.instance.getBestIdByType(type);
                let allItemId = new Array<number>();//所有符合弹窗的奖励
                for (let i = 0; i < items.length; i++) {
                    if (bestIdArr.indexOf(items[i]) >= 0) {
                        allItemId.push(items[i]);
                    }
                }
                if (allItemId.length > 0) {
                    WindowManager.instance.open(WindowEnum.TREASURE_GET_ALERT, allItemId);
                }
            } else {
                CommonUtil.noticeError(reply[RunXunbaoReplyFields.result]);
            }
            this._buttonList.datas = TreasureModel.instance._xunBaoListIndex;
        }

        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.fiftyBtn.on(Event.CLICK, this, this.xunBaoHandler, [2]);
            this._buttonList.on(Event.CLICK, this, this.selectHandler);

            this._btnGroup.on(Event.CHANGE, this, this.changeList);
            this._btnGroup.selectedIndex = 0;
            this.closeBtn1.on(Event.CLICK, this, this.closeBtn1Handler);
            this.probabilityNotice.on(Event.CLICK, this, this.probabilityNoticeFun);
            GlobalData.dispatcher.on(CommonEventType.RUN_XUNBAO_REPLY, this, this.xunBaoReply);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_XUNBAOINFO, this, this.showShouChouBiDeImg);
            GlobalData.dispatcher.on(CommonEventType.SEVER_BROADCAST_LIST, this, this.updateSeverList);
            GlobalData.dispatcher.on(CommonEventType.SELF_BROADCAST_LIST, this, this.updateSelfList);
            GlobalData.dispatcher.on(CommonEventType.TIME_LEFT, this, this.shengyuTime);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateCost);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_XUNBAOUI, this, this.updateCost);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.fiftyBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this._buttonList.off(Event.CLICK, this, this.selectHandler);

            this._btnGroup.off(Event.CHANGE, this, this.changeList);
            this.closeBtn1.off(Event.CLICK, this, this.closeBtn1Handler);
            this.probabilityNotice.off(Event.CLICK, this, this.probabilityNoticeFun);
            GlobalData.dispatcher.off(CommonEventType.RUN_XUNBAO_REPLY, this, this.xunBaoReply);
            GlobalData.dispatcher.off(CommonEventType.SEVER_BROADCAST_LIST, this, this.updateSeverList);
            GlobalData.dispatcher.off(CommonEventType.SELF_BROADCAST_LIST, this, this.updateSelfList);
            GlobalData.dispatcher.off(CommonEventType.TIME_LEFT, this, this.shengyuTime);
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.updateCost);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_XUNBAOINFO, this, this.showShouChouBiDeImg);
            GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);

            if (this._shouChouBiDeImgTween) {
                this._shouChouBiDeImgTween.stop();
            }
        }
        //监听下 购买返回事件 成功了就关闭界面
        private puchaseReply() {
            let result = modules.store.StoreModel.instance.PurchaseReply[BuyMallItemReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.close(WindowEnum.STORE_ALERT);
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this._isShowWuShiChou = false;
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [0]);
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [1]);
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [2]);
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [3]);
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [4]);
            this.getSeverList();
            this.updateCost();
            for (let i = 0; i < 4; i++) {
                this._clipArr[i].play();
            }
            this.shengyuTime();
            this.showShouChouBiDeImg();
            Laya.timer.frameLoop(1, this, this.updateList);
            Laya.timer.loop(10000, this, this.getSeverList);
            Laya.timer.frameLoop(1, this, this.updateShowItemList);
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.updateTime);
            Laya.timer.clear(this, this.getSeverList);
            Laya.timer.clear(this, this.updateShowItemList);
        }

        public initializeClip() {
            this._tenBtnBtnClip = new CustomClip();
            this.oneBtn.addChild(this._tenBtnBtnClip);
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.scale(0.83, 1, true);
            this._tenBtnBtnClip.pos(-6, -16, true);
        }

        /**
         * 判断并显示首抽必得界面
         */
        public showShouChouBiDeImg() {
            let isMianFei = TreasureModel.instance.fistMianFei(this._type);
            if (isMianFei) {
                this._tenBtnBtnClip.visible = true;
                this._tenBtnBtnClip.play();
                this.oneBtn.label = `免费`;
            } else {
                this.oneBtn.label = `探索一次`;
                this._tenBtnBtnClip.stop();
                this._tenBtnBtnClip.visible = false;
            }

            let shuju = [0, 1, 2];
            for (var index = 0; index < shuju.length; index++) {
                var element = shuju[index];
                let firstReward: Array<Items> = TreasureCfg.instance.getfirstRewardByGrad(this._type, element);
                let fistFlag = TreasureModel.instance.getfistFlag(this._type);
                if (fistFlag == 0 && !this._isShowWuShiChou) {//是否首次 50抽了
                    if (firstReward) {
                        if (firstReward.length > 0) {
                            let item: Items = firstReward[0];
                            this.shouChouReward.dataSource = [item[ItemsFields.itemId], 0, 0, null];
                            this.shouChouBiDeImg.y = 778;
                            switch (element) {
                                case 0:
                                    this.shouChouBiDeImg.x = 70;
                                    break;
                                case 1:
                                    this.shouChouBiDeImg.x = 280;
                                    break;
                                case 2:
                                    this.shouChouBiDeImg.x = 481;
                                    break;
                                default:
                                    break;
                            }
                            if (this._shouChouBiDeImgTween) {
                                this._shouChouBiDeImgTween.stop();
                            }
                            this.shouChouBiDeImg.y = 778;
                            this._shouChouBiDeImgTween = TweenJS.create(this.shouChouBiDeImg).to({ y: this.shouChouBiDeImg.y - 10 },
                                1000).start().yoyo(true).repeat(99999999);
                            this.shouChouBiDeImg.visible = true;
                            return;
                        }
                    }
                }
            }
            if (this._shouChouBiDeImgTween) {
                this._shouChouBiDeImgTween.stop();
            }
            this.shouChouBiDeImg.visible = false;


        }

        private probabilityNoticeFun() {
            CommonUtil.alertHelp(74502);
        }

        public closeBtn1Handler() {
            if (this._shouChouBiDeImgTween) {
                this._shouChouBiDeImgTween.stop();
            }
            this.shouChouBiDeImg.visible = false;
            this._isShowWuShiChou = true;

        }
    }
}
