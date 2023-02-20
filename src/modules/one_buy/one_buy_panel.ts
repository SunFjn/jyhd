///<reference path="../config/one_buy_cfg.ts"/>

/**秒杀活动面板*/
namespace modules.one_buy {
    import OneBuy = ui.OneBuyUI;
    import Image = Laya.Image;
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import ItemsFields = Configuration.ItemsFields;
    import one_buy = Configuration.one_buy;
    import one_buyFields = Configuration.one_buyFields;
    import OneBuyCfg = modules.config.OneBuyCfg;
    // import AvatarClip = modules.common.AvatarClip;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import PlayerModel = modules.player.PlayerModel;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import OneBuyRewardFields = Protocols.OneBuyRewardFields;
    import BaseItem = modules.bag.BaseItem;

    export class OneBuyPanel extends OneBuy {
        private pitchOn: number = -1;//-1为空，0为1元，1为3元，2为6元
        private secKillTopBtnArr: BtnGroup;//顶部按钮数组
        private btnSelects: Array<Image>;//选中框组
        private itemId: number;
        private stall: number;
        private textArr: Array<any>;
 
        private _btnClip1: CustomClip;        //按钮特效
        private _btnClip4: CustomClip;         //大秒杀按钮特效
        private _dayBase: BaseItem[];

        private getAwardState: number = 0;

        private _skeleton: Laya.Skeleton;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.secKillTopBtnArr = new BtnGroup();//[this.secKillTopBtn1,this.secKillTopBtn2,this.secKillTopBtn3];//顶部按钮
            this.secKillTopBtnArr.setBtns(this.secKillTopBtn1, this.secKillTopBtn2, this.secKillTopBtn3);

            this.btnSelects = [this.pitchOn1, this.pitchOn2, this.pitchOn3];//选中框

            //顶部三按钮选中数组当前选中值
            this.secKillTopBtnArr.selectedIndex = 0;
            //奖品数组
            this.textArr = [this.SBBTxte1, this.SBBTxte2, this.SBBTxte3, this.SBBTxte4];
            this._dayBase = [this.secBaseBtn1, this.secBaseBtn2, this.secBaseBtn3, this.secBaseBtn4];
            //领取按钮特效
            this.creatEffect();
            //充值档位
            this.stall = 0;
            this.initSk();
        }

        protected addListeners(): void {

            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ONEBUY_UPDATE, this, this.updateFuc);

            this.s_secKillBtn1.on(Event.CLICK, this, this.s_secKillHandler1);//小秒杀
            this.l_secKillBtn.on(Event.CLICK, this, this.l_secKillHandler);//大秒杀
            this.sureBtn1.on(Event.CLICK, this, this.surseHandler1);//领取

            this.secKillTopBtnArr.on(Event.CHANGE, this, this.selectSecKillHandler);//顶部三按钮

            this.addAutoListener(this.lastBtn, Laya.Event.CLICK, this, () => {//左切按钮
                if (this.pitchOn > 0) {
                    this.pitchOn--;
                    this.secKillTopBtnArr.selectedIndex = this.pitchOn;
                    this.selectSecKillHandler();
                }
                else if (this.pitchOn == 0) {
                    this.pitchOn = 2;
                    this.secKillTopBtnArr.selectedIndex = this.pitchOn;
                    this.selectSecKillHandler();
                }
                else {
                    return
                }
            });
            this.addAutoListener(this.nextBtn, Laya.Event.CLICK, this, () => {//右切按钮
                if (this.pitchOn < 2) {
                    this.pitchOn++;
                    this.secKillTopBtnArr.selectedIndex = this.pitchOn;
                    this.selectSecKillHandler();
                }
                else if (this.pitchOn == 2) {
                    this.pitchOn = 0;
                    this.secKillTopBtnArr.selectedIndex = this.pitchOn;
                    this.selectSecKillHandler();
                }
                else {
                    return
                }
            });
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.pitchOn = 0;
            this.secKillTopBtnArr.selectedIndex = 0;
            this.l_secKillBtn.disabled = false;
            this.updateLSKB();
            this.setPitchOn();
            //顶部三按钮红点
            this.setTopBtnRP();
        }
        private setTopBtnRP() {
            this.setTopBtnRP1();
            this.setTopBtnRP2();
            this.setTopBtnRP3();
        }
        private setTopBtnRP1() {
            let cfgArr = OneBuyModel.instance.awardNode;
            if (cfgArr[0][0]) {
                if (cfgArr[0][0][OneBuyRewardFields.grade] == 11 && cfgArr[0][0][OneBuyRewardFields.state] == 1) {
                    this.topBtnRP1.visible = true;
                }
                else {
                    this.topBtnRP1.visible = false;
                }
            }
        }
        private setTopBtnRP2() {
            let cfgArr = OneBuyModel.instance.awardNode;
            if (cfgArr[0][1]) {
                if (cfgArr[0][1][OneBuyRewardFields.grade] == 12 && cfgArr[0][1][OneBuyRewardFields.state] == 1) {
                    this.topBtnRP2.visible = true;
                }
                else {
                    this.topBtnRP2.visible = false;
                }
            }
        }
        private setTopBtnRP3() {
            let cfgArr = OneBuyModel.instance.awardNode;
            if (cfgArr[0][2]) {
                if (cfgArr[0][2][OneBuyRewardFields.grade] == 13 && cfgArr[0][2][OneBuyRewardFields.state] == 1) {
                    this.topBtnRP3.visible = true;
                }
                else {
                    this.topBtnRP3.visible = false;
                }
            }
        }

        //设置档位指向
        private setPitchOn() {
            let cfgArr = OneBuyModel.instance.awardNode;
            for (let i = 0; i < cfgArr[0].length; i++) {
                if (cfgArr[0][i][OneBuyRewardFields.grade] == 11) {
                    if (cfgArr[0][i][OneBuyRewardFields.state] == 1) {
                        this.pitchOn = 0;
                        this.secKillTopBtnArr.selectedIndex = 0;
                        return;
                    } else if (cfgArr[0][i][OneBuyRewardFields.state] == 2) {
                        if (cfgArr[0][i + 1][OneBuyRewardFields.state] != 2) {
                            this.pitchOn = 1;
                            this.secKillTopBtnArr.selectedIndex = 1;
                            return;
                        } else if (cfgArr[0][i + 2][OneBuyRewardFields.state] != 2) {
                            this.pitchOn = 2;
                            this.secKillTopBtnArr.selectedIndex = 2;
                            return;
                        } else {
                            return;
                        }
                    }
                } else if (cfgArr[0][i][OneBuyRewardFields.grade] == 12) {
                    if (cfgArr[0][i][OneBuyRewardFields.state] == 1) {
                        this.pitchOn = 1;
                        this.secKillTopBtnArr.selectedIndex = 1;
                        return;
                    } else if (cfgArr[0][i][OneBuyRewardFields.state] == 2) {
                        if (cfgArr[0][i + 1][OneBuyRewardFields.state] != 2) {
                            this.pitchOn = 2;
                            this.secKillTopBtnArr.selectedIndex = 2;
                            return;
                        } else {
                            return;
                        }
                    } else if (cfgArr[0][i][OneBuyRewardFields.grade] == 13) {
                        if (cfgArr[0][i][OneBuyRewardFields.state] == 1) {
                            this.pitchOn = 2;
                            this.secKillTopBtnArr.selectedIndex = 2;
                            return;
                        }
                    }
                }
            }
        }
        //后端更新回调
        private updateFuc() {
            this.setPitchOn();
            this.setTopBtnRP();
            this.awardPanel();
        }

        //更新大秒杀按钮状态
        private updateLSKB() {
            let cfgArr = OneBuyModel.instance.awardNode;
            for (let i = 0; i < cfgArr[0].length; i++) {
                if (cfgArr[0][i][OneBuyRewardFields.grade] == 12 || cfgArr[0][i][OneBuyRewardFields.grade] == 13) {
                    if (cfgArr[0][i][OneBuyRewardFields.state] == 1 || cfgArr[0][i][OneBuyRewardFields.state] == 2) {
                        this.l_secKillBtn.disabled = true;
                        this._btnClip4.visible = false;
                    }
                }
                else {
                    this.l_secKillBtn.disabled = false;
                    this._btnClip4.play();
                    this._btnClip4.visible = true;
                }
            }
        }

        private selectSecKillHandler() {
            if (this.secKillTopBtnArr.oldSelectedIndex >= 0) {
                this.btnSelects[this.secKillTopBtnArr.oldSelectedIndex].visible = false;
            }
            this.pitchOn = this.secKillTopBtnArr.selectedIndex;
            this.btnSelects[this.secKillTopBtnArr.selectedIndex].visible = true;
            // console.log("this.secKillTopBtnArr.selectedIndex = " +this.secKillTopBtnArr.selectedIndex);
            this.awardPanel();
        }

        private awardPanel() {
            this.updateLSKB();

            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            //11档
            if (this.pitchOn == 0) {
                this.itemId = OneBuyModel.instance.awardNode[0][0][OneBuyRewardFields.id];
                let _cfg = OneBuyCfg.instance.getArrDare(this.itemId);
                awardArr = _cfg[one_buyFields.reward];//grade
                this.s_secKillBtn1.label = RechargeCfg.instance.getRecharCfgByIndex(_cfg[one_buyFields.grade])[rechargeFields.price] + "元秒杀";
                this.originalCost.text = "原价" + _cfg[one_buyFields.originalPrice] + "元";
                this.priceImg.skin = "one_buy/txt_title_0.png";
                //this.awardModel.skin = "one_buy/icon_yyms_bx1.png";

                for (let i: int = 0; i < awardArr.length; i++) {
                    showIdArr.push(awardArr[i][ItemsFields.itemId]);
                }
                //this.itemId = this.cfg[0][one_buyFields.id];

                this.stall = _cfg[one_buyFields.grade];
                this.updateBaseItem(awardArr, showIdArr);
                this.controlBtns(this.itemId);
            }
            //12档
            else if (this.pitchOn == 1) {
                this.itemId = OneBuyModel.instance.awardNode[0][1][OneBuyRewardFields.id];
                let _cfg = OneBuyCfg.instance.getArrDare(this.itemId);
                awardArr = _cfg[one_buyFields.reward];
                this.s_secKillBtn1.label = RechargeCfg.instance.getRecharCfgByIndex(_cfg[one_buyFields.grade])[rechargeFields.price] + "元秒杀";
                this.originalCost.text = "原价" + _cfg[one_buyFields.originalPrice] + "元";
                this.priceImg.skin = "one_buy/txt_title_1.png";//one_buy/txt_yyms_3ylb.png
                //this.awardModel.skin = "one_buy/icon_yyms_bx2.png";

                for (let i: int = 0; i < awardArr.length; i++) {
                    showIdArr.push(awardArr[i][ItemsFields.itemId]);
                }
                //this.itemId = this.cfg[1][one_buyFields.id];
                this.stall = _cfg[one_buyFields.grade];
                this.updateBaseItem(awardArr, showIdArr);
                this.controlBtns(this.itemId);
            }
            //13档
            else if (this.pitchOn == 2) {
                this.itemId = OneBuyModel.instance.awardNode[0][2][OneBuyRewardFields.id];
                let _cfg = OneBuyCfg.instance.getArrDare(this.itemId);
                awardArr = _cfg[one_buyFields.reward];
                this.s_secKillBtn1.label = RechargeCfg.instance.getRecharCfgByIndex(_cfg[one_buyFields.grade])[rechargeFields.price] + "元秒杀";
                this.originalCost.text = "原价" + _cfg[one_buyFields.originalPrice] + "元";
                this.priceImg.skin = "one_buy/txt_title_2.png";
                //this.awardModel.skin = "one_buy/icon_yyms_bx3.png";

                for (let i: int = 0; i < awardArr.length; i++) {
                    showIdArr.push(awardArr[i][ItemsFields.itemId]);
                }
                //this.itemId = this.cfg[2][one_buyFields.id];
                this.itemId = OneBuyModel.instance.awardNode[0][2][OneBuyRewardFields.id];
                this.stall = _cfg[one_buyFields.grade];
                this.updateBaseItem(awardArr, showIdArr);
                this.controlBtns(this.itemId);
            }
        }

        private updateBaseItem(awardArr: Array<Items>, showIdArr: number[]) {
            let count: number = showIdArr.length;
            let baseX = 304;
            let baseInter = 72;
            let txtX = 301;
            let txtInter = 72;
            if (count == 3) {
                baseX = 312;
                baseInter = 100;
                txtX = 310;
                txtInter = 100;
            }
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    if (!this._dayBase[i].visible) {
                        this._dayBase[i].visible = true;
                    }
                    this.textArr[i].visible = true;
                    this._dayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                    this.textArr[i].text = CommonUtil.getNameByItemId(awardArr[i][ItemsFields.itemId]);
                    let itemQuality = CommonUtil.getItemQualityById(awardArr[i][ItemsFields.itemId]);
                    let textColor = CommonUtil.getColorByQuality(itemQuality);
                    this.textArr[i].color = textColor;

                    this._dayBase[i].x = baseX + baseInter * i;
                    this.textArr[i].x = txtX + txtInter * i;
                } else {
                    this._dayBase[i].visible = false;
                    this.textArr[i].visible = false;
                }
            }
        }
        //控制按钮显示
        private controlBtns(itemId: number) {
            if (OneBuyModel.instance.getAwardStateById(itemId) == 0) {
                this.sureBtn1.visible = false;
                this._btnClip1.visible = false;
                this.received1.visible = false;
                this.s_secKillBtn1.visible = true;
            }
            else if (OneBuyModel.instance.getAwardStateById(itemId) == 1) {
                this._btnClip1.play();
                this.sureBtn1.visible = true;
                this._btnClip1.visible = true;
                this.received1.visible = false;
                this.s_secKillBtn1.visible = false;
            }
            else if (OneBuyModel.instance.getAwardStateById(itemId) == 2) {
                this.sureBtn1.visible = false;
                this._btnClip1.visible = false;
                this.received1.visible = true;
                this.s_secKillBtn1.visible = false;
            }
            else {
 
            }
        }

        //特效
        private creatEffect() {
            this._btnClip1 = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn1.addChild(this._btnClip1);
            this._btnClip1.pos(-5, -15);
            this._btnClip1.scale(0.7, 0.7);

            this._btnClip4 = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.l_secKillBtn.addChild(this._btnClip4);
            this._btnClip4.pos(-10, -18);
            this._btnClip4.scale(1.25, 1.2);
        }

        //小秒杀按钮
        private s_secKillHandler1() {
            if (this.pitchOn == 0) {
                PlatParams.askPay(11, RechargeCfg.instance.getRecharCfgByIndex(11)[rechargeFields.price]);
            } else if (this.pitchOn == 1) {
                PlatParams.askPay(12, RechargeCfg.instance.getRecharCfgByIndex(12)[rechargeFields.price]);
            } else if (this.pitchOn == 2) {
                PlatParams.askPay(13, RechargeCfg.instance.getRecharCfgByIndex(13)[rechargeFields.price]);
            }
            this.awardPanel();
        }

        //大秒杀按钮
        private l_secKillHandler() {
            PlatParams.askPay(14, RechargeCfg.instance.getRecharCfgByIndex(14)[rechargeFields.price]);
            this.awardPanel();
        }
        //领取按钮1
        private surseHandler1() {

            let _cfg = OneBuyCfg.instance.getArrDare(this.itemId);
            let rewards: Array<Items> = _cfg[one_buyFields.reward];

            let items: Array<Item> = [];

            for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                let item: Items = rewards[i];
                items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
            }
            if (BagUtil.canAddItemsByBagIdCount(items)) {
                OneBuyCtrl.instance.getLoginRewardReward(this.stall);
            }
        }

        private initSk() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this._skeleton.name="SLY.sk"
            this._skeleton.scale(1.55, 1.55)
            this._skeleton.pos(150, 890);
            this.addChild(this._skeleton);
            this._skeleton.load("res/skeleton/other/SLY.sk");
        }

        public close(): void {
            super.close();
            this._btnClip1.stop();
            Laya.timer.clearAll(this);
        }
        public destroy(): void {
            if (this._skeleton) {
                this._skeleton.destroy()
            }
            super.destroy();
        }

    }
}