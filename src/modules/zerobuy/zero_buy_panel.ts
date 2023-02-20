///<reference path="../config/onhook_income_cfg.ts"/>
///<reference path="../config/skill_cfg.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../ranking_list/player_ranking_model.ts"/>
///<reference path="../config/zero_buy_cfg.ts"/>
///<reference path="../zerobuy/zero_buy_model.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
/** 零元购 面板*/
namespace modules.zerobuy {
    import ZerobuyViewUI = ui.ZerobuyViewUI;
    import Event = Laya.Event;
    //本地数据 配置文件类型引用
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import zero_buy = Configuration.zero_buy;
    import zero_buyFields = Configuration.zero_buyFields;
    //服务器数据 配置文件类型引用
    //需要的模块
    import ZerobuyModel = modules.zerobuy.ZerobuyModel;
    import ZeroBuyCfg = modules.config.ZeroBuyCfg;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import BtnGroup = modules.common.BtnGroup;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ZerobuyCtrl = modules.zerobuy.ZerobuyCtrl;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class ZerobuyPanel extends ZerobuyViewUI {
        /**充值档次 状态图地址数据 */
        private _switchBtnSkin: Array<string>;
        /**切换充值类型按钮组 */
        private _scienceTabGroup: BtnGroup;
        private _scienceImgs: Array<Laya.Image>;
        /**切换充值类型按钮组  选中下标 */
        private _scienceSelectIndex: number;
        /**按钮流光特效 */
        private _btnClip: CustomClip;
        /**零元购数据 */
        private _zeroBuyCfg: zero_buy;
        /**左边所有奖励显示 */
        private _awardItemLefts: Array<BaseItem>;
        /**右边所有奖励显示 */
        private _awardItemRight: Array<BaseItem>;
        private _ISGroup: boolean;
        private _nowIdex: number;
        private _maxIdex: number;
        /**选中的 真实档次 */
        private _selectedIdex: number;//
        /**用于记录切页操作每个按钮对应的真实档次ID*/
        private _gradeNum: Array<number>;//   
        /**所有档次按钮 */
        private _AllSwitchBtn: Array<Laya.Button>;
        /**所有档次红点*/
        private _AllDotImg: Array<Laya.Image>;

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._ISGroup = true;
            this._gradeNum = new Array<number>();
            this._scienceTabGroup = new BtnGroup();
            this._scienceTabGroup.setBtns(this.switchBtn1, this.switchBtn2, this.switchBtn3, this.switchBtn4);
            this._scienceImgs = [this.switchImg1, this.switchImg2, this.switchImg3, this.switchImg4];
            this._AllSwitchBtn = [this.switchBtn1, this.switchBtn2, this.switchBtn3, this.switchBtn4];
            this._AllDotImg = [this.dotImg_1, this.dotImg_2, this.dotImg_3, this.dotImg_4];
            this._awardItemLefts = [this.cumulateBase1, this.cumulateBase2, this.cumulateBase3, this.cumulateBase4, this.cumulateBase5, this.cumulateBase6];
            this._awardItemRight = [this.cumulateBase7];
            this._switchBtnSkin = new Array<string>();
            this._switchBtnSkin.push("zerobuy/btn_0yg_yq_1.png");//选中状态图
            this._switchBtnSkin.push("zerobuy/btn_0yg_yq_0.png");//未选择状态图
            this.initializeClip();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._scienceTabGroup, Event.CHANGE, this, this.changeswitchBtnTabHandler);
            this.addAutoListener(this.some_moneyBtn, Event.CLICK, this, this.receiveBtnHandler, [0]);
            this.addAutoListener(this.receiveBtn, Event.CLICK, this, this.receiveBtnHandler, [1]);
            this.addAutoListener(this.lastBtn, Event.CLICK, this, this.lastBtnHandler);
            this.addAutoListener(this.nextBtn, Event.CLICK, this, this.nextBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZERO_BUY_UPDATE, this, this.showReceive);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_1, ["zeroBuyOneRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_2, ["zeroBuyTwoRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_3, ["zeroBuyThreeRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_4, ["zeroBuyFourRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            RedPointCtrl.instance.retireRedPoint(this.dotImg_1);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_2);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_3);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_4);
        }

        public onOpened(): void {
            super.onOpened();
            ZerobuyCtrl.instance.getZeroBuyInfo();
            this.setCanReceive();
            this.set_gradeNum();
            this.showSwitchBtnText();
            this.showWitchBtn();
            this.changeReward();
            this.showReceive();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        /**
         * 判断并设置默认显示的档位
         */
        public setCanReceive() {
            let lengNum = ZeroBuyCfg.instance.getlvDicLeng();//
            this.switchBtn1.visible = lengNum >= 1;
            this.switchBtn2.visible = lengNum >= 2;
            this.switchBtn3.visible = lengNum >= 3;
            this.switchBtn4.visible = lengNum >= 4;
            this._nowIdex = 0;
            this._maxIdex = (lengNum - 4) > 0 ? (lengNum - 4) : 0;
            this.nextBtn.visible = false;
            this.lastBtn.visible = false;
            let MaxlengNum = (lengNum <= 4 ? lengNum : 4);
            let w: number = MaxlengNum * 160 + (MaxlengNum - 1) * 0;
            let offset: number = (this.width - w >> 1) + 0;
            for (let i: int = 0, len = MaxlengNum; i < len; i++) {
                // this._AllSwitchBtn[i].x = offset + i * 160;
                this._AllDotImg[i].x = offset + i * 160 + 126
            }
            for (var index = 0; index < lengNum; index++) {
                let stateLeft = ZerobuyModel.instance.getZeroBuyRewardState(index);
                let stateRight = ZerobuyModel.instance.getZeroBuyExtraRewardState(index);
                if (stateLeft == 1 || stateRight == 1) { //按顺序判断（就是从左到右）
                    this._selectedIdex = index;
                    this._nowIdex = index;
                    //兼容下 如果要求不止四个情况  要确定当前的_nowIdex 也就是确定切页的状态
                    if (this._nowIdex >= this._maxIdex) {
                        this._nowIdex = this._maxIdex;
                    }
                    return;
                }
            }
            this._selectedIdex = 0;
        }

        private set_gradeNum(): void {
            this._ISGroup = false;
            let lengNum = ZeroBuyCfg.instance.getlvDicLeng();//以本地数据为准
            if (lengNum > 4) {
                if (this._nowIdex <= 0) {
                    this._nowIdex = 0;
                    this.lastBtn.visible = false;
                    this.nextBtn.visible = true;
                } else if (this._nowIdex >= this._maxIdex) {
                    this._nowIdex = this._maxIdex;
                    this.lastBtn.visible = true;
                    this.nextBtn.visible = false;
                } else {
                    this.lastBtn.visible = true;
                    this.nextBtn.visible = true;
                }
            }
            for (var index = 0; index < 4; index++) {
                this._gradeNum[index] = this._nowIdex + index;
            }
            this.getHasSelectedIdex();
        }

        public lastBtnHandler() {
            this._nowIdex--;
            this.set_gradeNum();
            this.updateUI();
        }

        public nextBtnHandler() {
            this._nowIdex++;
            this.set_gradeNum();
            this.updateUI();
        }

        /**
         * 点击切页后刷新界面
         */
        public updateUI() {
            this.showSwitchBtnText();
            this.updateAllRP();
        }

        /**
         * 更新红点
         */
        public updateAllRP() {
            // console.log("更新红点");
            for (var index = 0; index < this._gradeNum.length; index++) {
                var element = this._gradeNum[index];
                let rewardState: number = ZerobuyModel.instance.getZeroBuyRewardState(element);
                let extraRewardState: number = ZerobuyModel.instance.getZeroBuyExtraRewardState(element);
                if (index == 0) {
                    RedPointCtrl.instance.setRPProperty("zeroBuyOneRP", extraRewardState == 1);
                } else if (index == 1) {
                    RedPointCtrl.instance.setRPProperty("zeroBuyTwoRP", extraRewardState == 1);
                } else if (index == 2) {
                    RedPointCtrl.instance.setRPProperty("zeroBuyThreeRP", extraRewardState == 1);
                } else if (index == 3) {
                    RedPointCtrl.instance.setRPProperty("zeroBuyFourRP", extraRewardState == 1);
                }
            }
        }

        /**
         * 获取真实的档次ID
         */
        public getScienceSelectIndex(): number {
            return this._gradeNum[this._scienceSelectIndex];
        }

        /**
         * 获取当前真实 档次数组有没有选中的档次ID
         */
        public getHasSelectedIdex(): boolean {
            for (var index = 0; index < this._gradeNum.length; index++) {
                var element = this._gradeNum[index];
                if (element == this._selectedIdex) {
                    this._scienceTabGroup.selectedIndex = index;
                    return true;
                }
            }
            this._scienceTabGroup.selectedIndex = -1;
            return false;
        }

        /** 充值 档次 切换*/
        private changeswitchBtnTabHandler(): void {
            if (!this._ISGroup) {
                this.changXuanZhon();
                this._ISGroup = true;
                return;
            }
            switch (this._scienceTabGroup.selectedIndex) {
                case 0:     // 1 档次
                    this._scienceSelectIndex = 0;
                    break;
                case 1:     // 2 档次
                    this._scienceSelectIndex = 1;
                    break;
                case 2:     //3 档次
                    this._scienceSelectIndex = 2;
                    break;
                case 3:     //3 档次
                    this._scienceSelectIndex = 3;
                    break;
            }
            this._selectedIdex = this.getScienceSelectIndex();
            // console.log("当前真实档次__selectedIdex  : " + this._selectedIdex);
            this.showWitchBtn();
            this.changeReward();
            this.showReceive();
        }

        /** 根据表数据 显示 档次按钮的 充值金额(只在初始化和有切页的时候点击切页去变化他)*/
        public showSwitchBtnText() {
            // console.log("根据表数据 显示 档次按钮的 充值金额");
            this.switchImg1.skin = `zerobuy/txt_0yg_xllb.png`;
            this.switchImg2.skin = `zerobuy/txt_0yg_fhlb.png`;
            this.switchImg3.skin = `zerobuy/txt_0yg_jbsz.png`;
            this.switchImg4.skin = `zerobuy/txt_0yg_wmxl.png`;
        }

        /**
         * 改变选中状态 （如果美术给的按钮图是两个状态的整图就没必要用这个）
         */
        public changXuanZhon() {
            this._scienceTabGroup.selectedIndex == 0 ? this.switchBtn1.skin = this._switchBtnSkin[0] : this.switchBtn1.skin = this._switchBtnSkin[1];
            this._scienceTabGroup.selectedIndex == 1 ? this.switchBtn2.skin = this._switchBtnSkin[0] : this.switchBtn2.skin = this._switchBtnSkin[1];
            this._scienceTabGroup.selectedIndex == 2 ? this.switchBtn3.skin = this._switchBtnSkin[0] : this.switchBtn3.skin = this._switchBtnSkin[1];
            this._scienceTabGroup.selectedIndex == 3 ? this.switchBtn4.skin = this._switchBtnSkin[0] : this.switchBtn4.skin = this._switchBtnSkin[1];
        }

        /** 根据选中下标显示 三个充值档次按钮*/
        public showWitchBtn() {
            this.changXuanZhon();
            let dayNum = ZeroBuyCfg.instance.get_restDay(this._selectedIdex);
            let RewardNum = ZeroBuyCfg.instance.get_extraReward(this._selectedIdex);
            let moneyNum = ZeroBuyCfg.instance.get_money(this._selectedIdex);
            let countNum = RewardNum[0][ItemsFields.count];
            let _string = "zerobuy/txt_0yg_" + 1 + ".png";
            switch (this._selectedIdex) {
                case 0:
                    _string = "zerobuy/txt_0yg_" + 1 + ".png";
                    break;
                case 1:
                    _string = "zerobuy/txt_0yg_" + 2 + ".png";
                    break;
                default:
                    _string = "zerobuy/txt_0yg_" + 3 + ".png";
                    break;
            }
            this.instructionsImg.skin = _string;
        }

        /** 根据档次改变奖励的 显示*/
        public changeReward() {
            // console.log("根据档次改变奖励的 显示");
            let dayNum = ZeroBuyCfg.instance.get_restDay(this._selectedIdex);
            this.remainingdaytext.text = `第${dayNum}天登录可以领取`;
            this._zeroBuyCfg = ZeroBuyCfg.instance.get_zero_buy(this._selectedIdex);
            let itemArrLeft: Array<Items> = this._zeroBuyCfg[zero_buyFields.reward];
            let itemArrRight: Array<Items> = this._zeroBuyCfg[zero_buyFields.extraReward];
            //隐藏左边奖励
            for (var index = 0; index < this._awardItemLefts.length; index++) {
                var element = this._awardItemLefts[index];
                element.visible = false;
            }
            //隐藏右边奖励
            for (var index = 0; index < this._awardItemRight.length; index++) {
                var element = this._awardItemRight[index];
                element.visible = false;
            }
            //根据配置表显示左边奖励
            if (!itemArrLeft || itemArrLeft.length === 0) return;
            for (let i: int = 0, len = itemArrLeft.length; i < len; i++) {
                let itemId: number = itemArrLeft[i][ItemsFields.itemId];
                let count: number = itemArrLeft[i][ItemsFields.count];
                let bagItem = this._awardItemLefts[i];
                if (bagItem) {
                    bagItem.dataSource = [itemId, count, 0, null];
                    bagItem.visible = true;
                }
            }
            //根据配置表显示右边奖励
            if (!itemArrRight || itemArrRight.length === 0) return;
            for (let i: int = 0, len = itemArrRight.length; i < len; i++) {
                let itemId: number = itemArrRight[i][ItemsFields.itemId];
                let count: number = itemArrRight[i][ItemsFields.count];
                let bagItem = this._awardItemRight[i];
                if (bagItem) {
                    bagItem.dataSource = [itemId, count, 0, null];
                    bagItem.visible = true;
                }
            }
        }

        /** 根据服务器数据 显示当前档位的 状态*/
        public showReceive() {
            /*状态(0不可领 1可领取 2已领取)*/
            // console.log("根据服务器数据 显示当前档位的 状态");
            let stateLeft = ZerobuyModel.instance.getZeroBuyRewardState(this._selectedIdex);
            let stateRight = ZerobuyModel.instance.getZeroBuyExtraRewardState(this._selectedIdex);
            //算出要充多少钱
            let xianyu = ZeroBuyCfg.instance.get_money(this._selectedIdex);
            let dayNum1 = ZeroBuyCfg.instance.get_restDay(this._selectedIdex);
            this.xianYuClip.value = xianyu.toString();
            this.dayClip.value = dayNum1.toString();
            // let remainingMoney = - ZerobuyModel.instance.totalMoney;
            this.some_moneyBtn.visible = stateLeft == 0 && stateRight == 0;//充钱只在第一档奖励是0的情况显示
            this.receiveBtn.visible = stateLeft == 1 || (stateLeft == 2 && stateRight != 2);

            let isPlayer = stateLeft == 1 || stateRight == 1;
            if (isPlayer) {
                this._btnClip.play();
                this._btnClip.visible = true;
            } else {
                this._btnClip.stop();
                this._btnClip.visible = false;
            }

            this.HasBroughtImg_1.visible = stateLeft == 2;
            this.HasBroughtImg_2.visible = stateRight == 2;
            this.remainingdaytext.visible = (stateRight == 0);
            //这里判断 如果满足了普通领取条件 不管领了没有领 都要显示服务器给的剩余天数
            if (stateLeft != 0) {
                let dayNum = ZerobuyModel.instance.getZeroBuyExtraRewardRestTm(this._selectedIdex);
                this.remainingdaytext.text = `剩余${dayNum}天可以领取`;
                if (dayNum == 0) {
                    this.remainingdaytext.visible = false;
                }
            }
            this.updateAllRP();
        }

        /** 领取*/
        public receiveBtnHandler(type: number) {
            let stateLeft = ZerobuyModel.instance.getZeroBuyRewardState(this._selectedIdex);
            let stateRight = ZerobuyModel.instance.getZeroBuyExtraRewardState(this._selectedIdex);
            let itemArrLeft: Array<Items> = this._zeroBuyCfg[zero_buyFields.reward];
            let itemArrRight: Array<Items> = this._zeroBuyCfg[zero_buyFields.extraReward];
            if (type == 0) {
                let xianyu = ZeroBuyCfg.instance.get_money(this._selectedIdex);
                if (modules.zxian_yu.ZXianYuModel.instance.xianyu >= xianyu) {
                    let items: Array<Item> = [];
                    for (let i: int = 0, len: int = itemArrLeft.length; i < len; i++) {
                        let item: Items = itemArrLeft[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        ZerobuyCtrl.instance.GetZeroBuyBuy(this._selectedIdex);
                    }
                }
                else {
                    BagUtil.openLackPropAlert(modules.zxian_yu.ZXianYuModel.instance.id, 1);
                }

            }
            else if (type == 1) {
                if (stateRight == 0) {
                    SystemNoticeManager.instance.addNotice("未到可领取时间", true);
                }
                else {
                    let items: Array<Item> = [];
                    for (let i: int = 0, len: int = itemArrRight.length; i < len; i++) {
                        let item: Items = itemArrLeft[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        ZerobuyCtrl.instance.getZeroBuyReward(this._selectedIdex);
                    }
                }
            }
        }
        /**
         * 初始化特效
         */
        public initializeClip() {
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.pos(246, 402, true);
            this._btnClip.scale(1.23, 1.1, true);
        }
        public close(): void {
            super.close();
            this._btnClip.visible = false;
            this._btnClip.stop();
        }
        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }
    }
}