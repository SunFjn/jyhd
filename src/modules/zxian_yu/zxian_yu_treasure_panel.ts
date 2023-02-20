///<reference path="../config/treasure_cfg.ts"/>
/**探索面板*/
///<reference path="../config/store_cfg.ts"/>
/// <reference path="../store/store_model.ts" />
/// <reference path="../config/yu_ge_cfg.ts" />
namespace modules.zxian_yu {
    import CustomList = modules.common.CustomList;
    import Event = laya.events.Event;
    import List = laya.ui.List;
    import TreasureCfg = modules.config.TreasureCfg;
    import yuGeCfg = modules.config.yuGeCfg;
    import xunbao_weightFields = Configuration.xunbao_weightFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RunXunbaoReplyFields = Protocols.RunXunbaoReplyFields;
    import XunbaoNoteFields = Protocols.XunbaoNoteFields;
    import XunbaoNote = Protocols.XunbaoNote;
    import BtnGroup = modules.common.BtnGroup;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import CustomClip = modules.common.CustomClip;
    import BlendMode = Laya.BlendMode;
    import Point = laya.maths.Point;
    import Label = laya.ui.Label;
    import Image = laya.ui.Image;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import Button = laya.ui.Button;
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
    import SystemNoticeManager = notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import StoreModel = modules.store.StoreModel;
    import BaseItem = modules.bag.BaseItem;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import PayRewardNoteSvrFields = Protocols.PayRewardNoteSvrFields;
    //个人记录
    class itemText extends ItemRender {
        private text: laya.html.dom.HTMLDivElement;

        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();

            this.text = new laya.html.dom.HTMLDivElement();
            this.text.width = 487;
            this.height = 20;
            this.addChild(this.text);
        }

        protected setData(value: XunbaoNote): void {
            let name = value[XunbaoNoteFields.name];
            let itemId = value[XunbaoNoteFields.itemId];
            let itemColor = CommonUtil.getColorById(itemId);
            let itemName = CommonUtil.getNameByItemId(itemId);

            var html: string = "<span style='color:#3a5385;font-size: 20px'>天赐鸿福,</span>";
            html += `<span style='color:rgb(13,121,255);font-size: 20px;'>[${name}]</span>`;
            html += "<span style='color:#3a5385;font-size: 20px'>获得了</span>";
            html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
            this.text.innerHTML = html;
            this.visible = true;
        }
    }
    export class ZXianYuTreasurePanel extends ui.ZXianYuTreasureViewUI {
        //全服记录相关变量
        private _sevStringArr: Array<any>;
        public _htmlArr: Array<HtmlReward>;
        private _bolll = false;
        private _bolllPos = false;
        private _index = 0;
        private _index1 = 0;
        //
        private _btnGroup: BtnGroup;
        private _jiLubtnGroup: BtnGroup;
        private _cdFlag: boolean;
        private _proCtrl: ProgressBarCtrl;
        private _showItem: Array<BaseItem>;
        private _fuYuanshowItem: Array<BaseItem>;
        private _fuYuanshowImg: Array<Image>;
        private _clipArr: Array<CustomClip>;
        public _type: number;
        private _personalList: CustomList;
        /**奖品特效 */
        private _prizeEffect: CustomClip;
        /**是否有可領取的才氣質獎勵 */
        private _isReward: boolean;
        private sp: Laya.Sprite;
        constructor() {
            super();

        }

        protected initialize(): void {
            super.initialize();
            this._type = 5;
            this._isReward = false;
            this.centerX = 0;
            this.centerY = 0;
            //全服记录相关变量初始化
            this._bolll = false;
            this._bolllPos = false;
            this._index = 0;//全服记录修改
            this._index1 = 0;//全服记录修改
            this._sevStringArr = new Array<any>();
            //
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.qiFuBtn, this.cangKuBtn);
            this._jiLubtnGroup = new BtnGroup();
            this._jiLubtnGroup.setBtns(this.severList, this.selfList);
            // this._proCtrl = new ProgressBarCtrl(this.blessImg, 443, this.blessTxt);
            this._showItem = [
                this.item1,
                this.item2,
                this.item3,
                this.item4,
                this.item5,
                this.item6,
                this.item7,
                this.item8,
                this.item9
            ];
            this._fuYuanshowItem = [
                this.item10,
                this.item11,
                this.item12,
                this.item13,
                this.item14
            ];
            this._fuYuanshowImg = [
                this.ylqImg1,
                this.ylqImg2,
                this.ylqImg3,
                this.ylqImg4,
                this.ylqImg5
            ];
            this._clipArr = new Array<CustomClip>();
            for (let i = 0; i < this._showItem.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                //clip.blendMode = BlendMode.ADD;
                // if (i == 0 || i == 4 || i == 7 || i == 11) {
                //     this._showItem[i].addChild(clip);
                //     clip.pos(-75, -75, true);
                //     clip.skin = "assets/effect/item_effect3.atlas";
                //     for (let i = 1; i < 16; i++) {
                //         let str = `item_effect3/${i}.jpg`;
                //         urlArr.push(str);
                //     }
                // }
                // else {
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
            for (let i = 0; i < this._fuYuanshowItem.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                // clip.blendMode = BlendMode.ADD;
                // if (i == 0 || i == 4 || i == 7 || i == 11) {
                //     this._fuYuanshowItem[i].addChild(clip);
                //     clip.pos(-75, -75, true);
                //     clip.skin = "assets/effect/item_effect3.atlas";
                //     for (let i = 1; i < 16; i++) {
                //         let str = `item_effect3/${i}.jpg`;
                //         urlArr.push(str);
                //     }
                // }
                // else {
                this._fuYuanshowItem[i].addChild(clip);
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

            this._personalList = new CustomList();
            this._personalList.itemRender = itemText;
            this._personalList.hCount = 1;
            this._personalList.spaceY = 8;
            this._personalList.width = 500;
            this._personalList.height = 112;
            this.selfPanel.addChild(this._personalList);
            this._personalList.x = 0;
            this._personalList.y = 0;
            this.initializeClip();
            this.sp = new Laya.Sprite();
            this.sp.visible = false;
            this.sp._renderType = this.lingQuJinDuMaskImg._renderType;
            this.blessImg.addChild(this.sp);
            this.blessImg.mask = this.sp;

        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.btnGroupHandler);
            this.addAutoListener(this._jiLubtnGroup, Event.CHANGE, this, this.jiLubtnGroupHandler);
            this.addAutoListener(this.oneBtn, Event.CLICK, this, this.xunBaoHandler, [0]);
            this.addAutoListener(this.tenBtn, Event.CLICK, this, this.xunBaoHandler, [1]);
            this.addAutoListener(this.fiftyBtn, Event.CLICK, this, this.xunBaoHandler, [2]);
            this.addAutoListener(this.lingQuBtn, Event.CLICK, this, this.lingQuBtnHandler);
            this.addAutoListener(this.allRewardBtn, Event.CLICK, this, this.allRewardBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEVER_BROADCAST_LIST, this, this.updateSeverList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELF_BROADCAST_LIST, this, this.updateSelfList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU__SHOWHTML, this, this.showHtml);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUN_XUNBAO_REPLY, this, this.xunBaoReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_XUNBAOINFO, this, this.setItemNum);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.setItemNum);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_FUYUAN_UPDATE, this, this.setJinDu);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            // "zxianYuBagPanelRP": boolean;     // 点券背包红点
            // "zxianYuPanelRP": boolean;     // 点券红点
            // "zxianYuStorePanelRP": boolean;     // 点券商店红点
            // "zxianYuTreasurePanelRP": boolean;     // 点券抽奖红点
            modules.redPoint.RedPointCtrl.instance.registeRedPoint(this.qiFuRpImg, ["zxianYuTreasurePanelRP"]);
            modules.redPoint.RedPointCtrl.instance.registeRedPoint(this.cangKuImg, ["zxianYuBagPanelRP"]);

        }
        protected removeListeners(): void {
            super.removeListeners();
            modules.redPoint.RedPointCtrl.instance.retireRedPoint(this.qiFuRpImg);
            modules.redPoint.RedPointCtrl.instance.retireRedPoint(this.cangKuImg);
        }
        protected onOpened(): void {
            super.onOpened();
            this._bolll = false;
            this._bolllPos = false;
            this._index = 0;//全服记录修改
            this._index1 = 0;//全服记录修改
            //
            this._btnGroup.selectedIndex = 0;
            this._jiLubtnGroup.selectedIndex = 0;
            this._cdFlag = false;
            this.showReward();
            this.showFuYuanReward();
            this.setItemNum();
            this.getShuJu();
            ZXianYuCtrl.instance.GetXianYuInfo();
            ZXianYuCtrl.instance.GetXianYuFuYuInfo();
            this.setActionPreviewPos();
        }
        public setOpenParam(value: number): void {
            super.setOpenParam(value);
        }
        /**
         * getShuJu
         */
        public getShuJu() {
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [this._type]);
            Channel.instance.publish(UserCenterOpcode.GetXunbaoServerBroadcast, [this._type]);
        }
        /**
      * 存储对应功能预览 对应的飞入点
      */
        public setActionPreviewPos() {
            this.callLater(this.setPosActionPreview);
        }

        public setPosActionPreview() {
            Point.TEMP.setTo(this.cangKuBtn.width / 2, this.cangKuBtn.height / 2);
            let pos = this.cangKuBtn.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.xianyuCangKu, pos);
        }
        private btnGroupHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {

            } else if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.ZXIANYU_BAG_PANEL);
                this._btnGroup.selectedIndex = 0;
            }
        }
        private jiLubtnGroupHandler(): void {
            if (this._jiLubtnGroup.selectedIndex === 0) {
                this.severPanel.visible = true;
                this.selfPanel.visible = false;
            } else if (this._jiLubtnGroup.selectedIndex === 1) {
                this.severPanel.visible = false;
                this.selfPanel.visible = true;
            }
        }


        private allRewardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZXIANYU_ALL_AREARD_ALERT);
        }

        private xunBaoHandler(value: any): void {
            if (this._cdFlag) {
                SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                return;
            }
            this._cdFlag = true;
            Laya.timer.once(500, this, this.setFlag);
            let oneNum = ZXianYuModel.instance.oneNum;//第一档抽奖所需点券数量
            let twoNum = ZXianYuModel.instance.twoNum;//第二档抽奖所需点券数量
            let threeNum = ZXianYuModel.instance.threeNum;//第三档抽奖所需点券数量
            let bolll = false;
            // let count = modules.player.PlayerModel.instance.copper;
            let count = ZXianYuModel.instance.xianyu;
            switch (value) {
                case 0:
                    bolll = count >= oneNum;
                    break;
                case 1:
                    bolll = count >= twoNum;
                    break;
                case 2:
                    bolll = count >= threeNum;
                    break;
                default:
                    break;
            }
            if (bolll) {
                //发消息
                modules.treasure.TreasureCtrl.instance.runXunbao(this._type, value);
            }
            else {
                //给提示
                BagUtil.openLackPropAlert(modules.zxian_yu.ZXianYuModel.instance.id, 1);
                // CommonUtil.alert('温馨提示', '点券不足，是否前往充值界面充值？', [Handler.create(this, this.openRecharge)]);
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.ZXIANYU_PANEL);
        }
        /**
         * 抽奖放回
         */
        private xunBaoReply(): void {

            let reply = modules.treasure.TreasureModel.instance.runXunbaoReply;
            if (reply[RunXunbaoReplyFields.result] == 0) {
                this.getShuJu();
                let type = reply[RunXunbaoReplyFields.type];
                let items = reply[RunXunbaoReplyFields.items];
                // let cfgs:Array<xunbao_weight>=TreasureCfg.instance.getItemShow(type);
                if (items.length == 1) {
                    let start = new Point(300, 350);
                    // let item=[items,0,0,null];
                    let arr = [items, start, this.height];
                    GlobalData.dispatcher.event(CommonEventType.ZXIANYU_EFFECT, [arr]);
                }
                if (items.length > 1) {
                    WindowManager.instance.open(WindowEnum.ZXIANYU_ALERT, [items, this._type]);
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

        }
        private setFlag(): void {
            this._cdFlag = false;
        }
        /**
         * 设置道具数量
         */
        private setItemNum(): void {
            // this.oneCountImg.skin = this.tenCountImg.skin = this.fifityCountImg.skin = CommonUtil.getIconById(ZXianYuModel.instance.id);
            let oneNum = ZXianYuModel.instance.oneNum;//第一档抽奖所需点券数量
            let twoNum = ZXianYuModel.instance.twoNum;//第二档抽奖所需点券数量
            let threeNum = ZXianYuModel.instance.threeNum;//第三档抽奖所需点券数量
            // let count = modules.player.PlayerModel.instance.copper;
            let count = ZXianYuModel.instance.xianyu;
            this.oneCount.text = `${count}/${oneNum}`;
            this.tenCount.text = `${count}/${twoNum}`;
            this.fiftyCount.text = `${count}/${threeNum}`;
            if (oneNum <= count) {
                this.oneCount.color = "#ffffff";
            }
            else {
                this.oneCount.color = "#FF3e3e";
            }
            if (twoNum <= count) {
                this.tenCount.color = "#ffffff";
            }
            else {
                this.tenCount.color = "#FF3e3e";
            }
            if (threeNum <= count) {
                this.fiftyCount.color = "#ffffff";
            }
            else {
                this.fiftyCount.color = "#FF3e3e";
            }
            //适配
            let W = this.oneCountImg.width + this.oneCount.width;
            let pox = (this.oneCountBox.width - W) / 2;
            this.oneCountImg.x = pox;
            this.oneCount.x = this.oneCountImg.x + this.oneCountImg.width;

            let W1 = this.tenCountImg.width + this.tenCount.width;
            let pox1 = (this.tenCountBox.width - W1) / 2;
            this.tenCountImg.x = pox1;
            this.tenCount.x = this.tenCountImg.x + this.tenCountImg.width;

            let W2 = this.fifityCountImg.width + this.fiftyCount.width;
            let pox2 = (this.fiftyCountBox.width - W2) / 2;
            this.fifityCountImg.x = pox2;
            this.fiftyCount.x = this.fifityCountImg.x + this.fifityCountImg.width;
        }
        private lingQuBtnHandler(): void {
            let shuju = ZXianYuModel.instance.getFuYuanAward();
            if (shuju) {
                ZXianYuCtrl.instance.GetFuYuanAward(shuju[1]);
            }

        }
        public setJinDu() {
            let shuju = ZXianYuModel.instance.getFuYuanAward();
            if (shuju) {
                let conditionNUm = shuju[0];
                this.blessTxt.text = `${ZXianYuModel.instance.fuyu}/${conditionNUm}`;
                let bili = ZXianYuModel.instance.fuyu / conditionNUm;
                bili = bili > 1 ? 1 : bili;
                this.lingQuJinDuMaskImg.height = this.lingQuJinDuMaskImg.width * bili;
                if (ZXianYuModel.instance.fuyu >= conditionNUm) {
                    this._isReward = true;
                    // this._prizeEffect.play();
                    this.fuYuanRpImg.visible = true;
                } else {
                    this._isReward = false;
                    // this._prizeEffect.stop();
                    this.fuYuanRpImg.visible = false;
                }
                for (let index = 0; index < this._fuYuanshowImg.length; index++) {
                    let element = this._fuYuanshowImg[index];
                    element.visible = index < shuju[1];
                }
            }
            this.drawSomething();
        }
        private drawSomething(): void {

            let conditionNUm = ZXianYuModel.instance.getMaxVlaue();

            let bili = ZXianYuModel.instance.fuyu / conditionNUm;

            bili = bili > 1 ? 1 : bili;
            let jindu = 180 * bili;
            this.sp.graphics.clear();
            //画圆
            this.sp.graphics.drawPie(200, 198, 180, 180, 180 + jindu, "#ff0000");
        }
        /**
         * 展示奖励
         */
        public showReward() {
            for (let index = 0; index < this._showItem.length; index++) {
                let element = this._showItem[index];
                if (element) {
                    element.visible = false;
                }
            }
            let _weightCfgs = TreasureCfg.instance.getItemShow(this._type)[0];
            let weight = _weightCfgs[xunbao_weightFields.showItem];
            for (let i = 0; i < weight.length; i++) {
                let itemId: number = weight[i];
                let count: number = 1;
                let bagItem: BaseItem = this._showItem[i];
                if (bagItem) {
                    bagItem.dataSource = [itemId, count, 0, null];
                    bagItem.visible = true;
                    bagItem.isbtnClipIsPlayer = false;
                    let _clip: CustomClip = bagItem.getChildByName("clip") as CustomClip;
                    _clip.play();
                    _clip.visible = true;
                }
            }
        }
        //展示福缘奖励
        public showFuYuanReward() {
            for (let index = 0; index < this._fuYuanshowItem.length; index++) {
                let element = this._fuYuanshowItem[index];
                if (element) {
                    element.visible = false;
                }
            }
            let idx = 0;
            let weight = ZXianYuModel.instance.taskActivesAward;
            for (let i = 0; i < weight.length; i++) {
                if (weight[i]) {
                    let element = weight[i];
                    for (let index = 0; index < element.length; index += 2) {
                        let itemId: number = element[index];
                        let count: number = element[index + 1];

                        let bagItem: BaseItem = this._fuYuanshowItem[idx];
                        if (bagItem) {
                            bagItem.dataSource = [itemId, count, 0, null];
                            bagItem.visible = true;
                            bagItem.isbtnClipIsPlayer = false;
                            let _clip: CustomClip = bagItem.getChildByName("clip") as CustomClip;
                            _clip.play();
                            _clip.visible = true;
                            idx++;
                        }

                    }
                }
            }
        }
        //····································全服记录相关····································
        public desDoryArr() {
            if (this._htmlArr) {
                for (var index = 0; index < this._htmlArr.length; index++) {
                    var element = this._htmlArr[index];
                    if (element) {
                        element.closeTimer();
                        element.visible = false;
                        element.removeSelf();
                        element.destroy();
                    }
                }
                this._htmlArr.length = 0;
                this._htmlArr = null;
            }
        }
        public setARR() {
            if (!this._htmlArr) {
                this._htmlArr = new Array<HtmlReward>();
                for (let index = 0; index < 20; index++) {
                    let _html = new HtmlReward(487, 20, this._htmlArr);
                    this.severPanel.addChild(_html);
                    _html.name = "数据：" + index;
                    this._htmlArr.push(_html);
                }
            }

        }
        public showHtml() {
            if (this._sevStringArr) {
                if (this._sevStringArr.length > 0) {
                    let _html: HtmlReward = null;
                    this.setARR();
                    _html = this._htmlArr[this._index];
                    this._index = this._index + 1;
                    this._index = this._index > (this._htmlArr.length - 1) ? 0 : this._index;
                    if (_html) {
                        _html.setText(112 + 8, 112, this.getSevStringArr());
                        if (!this._bolllPos) {
                            this._bolllPos = true;
                            Laya.timer.clear(this, this.updateList);
                            Laya.timer.frameLoop(1, this, this.updateList);
                        }
                    }
                }
            }
        }
        public getSevStringArr(): string {
            let str = "";
            str = this._sevStringArr[this._index1];
            this._index1 = this._index1 + 1;
            this._index1 = this._index1 > (this._sevStringArr.length - 1) ? 0 : this._index1;
            return str;
        }
        private updateList(): void {
            for (let index = 0; index < this._htmlArr.length; index++) {
                let element = this._htmlArr[index];
                if (element) {
                    element.updateList();
                }
            }
        }
        /**
         * 显示更新全服记录数据
         */
        private updateSeverList() {
            let svrList = modules.treasure.TreasureModel.instance.getSvrBroadcast(this._type);
            if (svrList != undefined) {
                if (svrList.length > 0) {
                    if (this._sevStringArr.length > 0) {
                        this._sevStringArr.length = 0;
                    }
                    svrList.reverse();//最新的数据在后面 翻转下
                    for (let i = 0; i < 10; i++) {
                        if (svrList[i]) {
                            let name = svrList[i][XunbaoNoteFields.name];
                            let itemId = svrList[i][XunbaoNoteFields.itemId];
                            let itemName = modules.common.CommonUtil.getNameByItemId(itemId);
                            let count = 1;
                            let itemColor = modules.common.CommonUtil.getColorById(itemId);
                            var html: string = `<span style='color:#3a5385;'>天赐鸿福,</span>`;
                            html += `<span style='color:rgb(13,121,255);'>[${name}]</span>`;
                            html += `<span style='color:#3a5385;'>获得了</span>`;
                            html += `<span style='color:${itemColor};'>${itemName}*${count}</span>`;
                            this._sevStringArr.push(html);
                        }
                    }
                    //全服记录修改
                    if (this._sevStringArr.length > 0 && !this._bolll) {
                        this._bolll = true;
                        this.showHtml();
                    }
                }
            }
        }
        //···················································个人记录···········································
        private updateSelfList() {
            let ap = modules.treasure.TreasureModel.instance.getSelfBroadcast(this._type);
            this._personalList.datas = ap;
            this._personalList.scrollTo(this._personalList.datas.length * 28);
        }
        public initializeClip() {
            // this._prizeEffect = new CustomClip();
            // this.addChildAt(this._prizeEffect, 19);
            // this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            // this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
            //     "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            // this._prizeEffect.durationFrame = 5;
            // this._prizeEffect.loop = true;
            // this._prizeEffect.scale(1, 1, true);
            // this._prizeEffect.pos(500, 540, true);
        }
        public close(): void {
            super.close();
            Laya.timer.clear(this, this.updateList);
            this.desDoryArr();
            Laya.timer.clear(this, this.setFlag);
            this.setFlag();
            // this._prizeEffect.stop();
            // this._prizeEffect.visible = false;
        }
        public destroy(destroyChild: boolean = true): void {
            // if (this._prizeEffect) {
            //     this._prizeEffect.removeSelf();
            //     this._prizeEffect.destroy();
            //     this._prizeEffect = null;
            // }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._jiLubtnGroup) {
                this._jiLubtnGroup.destroy();
                this._jiLubtnGroup = null;
            }
            if (this._clipArr) {
                for (let index = 0; index < this._clipArr.length; index++) {
                    let element = this._clipArr[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._clipArr.length = 0;
                this._clipArr = null;
            }
            super.destroy(destroyChild);
            // this._proCtrl.destroy();
            // this._proCtrl = null;
        }
    }
}