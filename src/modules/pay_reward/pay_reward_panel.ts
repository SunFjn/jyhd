///<reference path="../config/onhook_income_cfg.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../ranking_list/player_ranking_model.ts"/>
///<reference path="../pay_reward/pay_reward_model.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../pay_reward/pay_reward_ctrl.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
/** 充值抽奖 面板*/
namespace modules.pay_reward {
    import PayRewardViewUI = ui.PayRewardViewUI;
    import Point = laya.maths.Point;
    import Event = Laya.Event;
    //本地数据 配置文件类型引用
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import PayRewardWeightNodeFields = Configuration.PayRewardWeightNodeFields;
    import PayRewardCfg = modules.config.PayRewardCfg;
    import payRewardWeightCfg = modules.config.payRewardWeightCfg;
    import PayRewardModel = modules.pay_reward.PayRewardModel;
    import PayRewardCtrl = modules.pay_reward.PayRewardCtrl;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import PayRewardNoteSvrFields = Protocols.PayRewardNoteSvrFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendMode = Laya.BlendMode;
    import LayaEvent = modules.common.LayaEvent;

    export class PayRewardPanel extends PayRewardViewUI {
        private _showItem: Array<BaseItem>;
        private _proCtrl: ProgressBarCtrl;
        /**是否有可領取的才氣質獎勵 */
        private _isReward: boolean;
        /**按钮流光特效 */
        private _oneBtnBtnClip: CustomClip;
        /**按钮流光特效 */
        private _tenBtnBtnClip: CustomClip;
        /**奖品特效 */
        private _prizeEffect: CustomClip;
        //全服记录相关
        private severListLen: number;
        private _sevTextArr: Array<any>;
        private _sevStringArr: Array<any>;
        private _clipArr: Array<CustomClip>;


        private _maxSpeed: number;//最快速度
        private _minSpeed: number;//最慢速度
        private _startSpeed: number;//起始速度
        private _quanNum: number;//转几圈
        private _targetIdnex: number;//目标位置
        private _nowTargetIdnex: number;//当前位置
        private _startdnex: number;//起始位置
        private _isAniIng: boolean = false;//是否正在动画
        private _isTen: boolean = false;//是否十连抽
        private _arr: Array<number>;//单次抽奖 结果
        //因为加了动画 还是要坐下cd
        private _isUpdateBtnClickNum = 500;//刷新按钮CD
        private _isUpdateBtnClick = true;//刷新按钮是否可点击

        public _htmlArr: Array<HtmlReward>;//全服记录修改
        private _bolll = false;//全服记录修改
        private _bolllPos = false;//全服记录修改
        private _index = 0;//全服记录修改
        private _index1 = 0;//全服记录修改
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._oneBtnBtnClip) {
                this._oneBtnBtnClip.removeSelf();
                this._oneBtnBtnClip.destroy();
                this._oneBtnBtnClip = null;
            }
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            if (this._prizeEffect) {
                this._prizeEffect.removeSelf();
                this._prizeEffect.destroy();
                this._prizeEffect = null;
            }
            if (this._showItem) {
                for (let index = 0; index < this._showItem.length; index++) {
                    let element = this._showItem[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._showItem.length = 0;
                this._showItem = null;
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
            this._proCtrl.destroy();
            this._proCtrl = null;
        }

        protected initialize(): void {
            super.initialize();
            this._isReward = false;
            this.centerX = 0;
            this.centerY = 0;
            this._showItem = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6, this.item7, this.item8, this.item9, this.item10, this.item11, this.item12];
            this._proCtrl = new ProgressBarCtrl(this.blessImg, 380, this.blessTxt);
            this.initializeClip();
            this._sevTextArr = new Array<any>();
            this._sevStringArr = new Array<any>();
            this.severListLen = 7;
            for (let i = 0; i < this.severListLen; i++) {
                let text = new laya.html.dom.HTMLDivElement();
                text.width = 282
                text.style.height = 25;
                text.pos(0, i * 25);
                text.style.fontFamily = "SimHei";
                // text.style.align = "center";
                text.style.fontSize = 20;
                this._sevTextArr.push(text);
                this.severPanel.addChild(text);
            }
            this.updateSeverList();

            this._clipArr = new Array<CustomClip>();
            for (let i = 0; i < this._showItem.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                //clip.blendMode = BlendMode.ADD;
                // 临时屏蔽effect3动画特效
                // if (i == 0 || i == 6) {
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

        }

        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.caiQiReceiveBtn.on(Event.CLICK, this, this.caiQiReceiveBtnHandler);
            this.myRecordBtn.on(Event.CLICK, this, this.myRecordBtnHandler);
            this.probabilityNotice.on(Event.CLICK, this, this.probabilityNoticeFun);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_UPDATE, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_RUNREPLY, this, this.PayRewardRunReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_OPENRECORD, this, this.openMyRecord);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_BROADCAST_LIST, this, this.updateSeverList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_SHOWHTML, this, this.showHtml);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.caiQiReceiveBtn.off(Event.CLICK, this, this.caiQiReceiveBtnHandler);
            this.myRecordBtn.off(Event.CLICK, this, this.myRecordBtnHandler);
            this.probabilityNotice.off(Event.CLICK, this, this.probabilityNoticeFun);
        }

        public probabilityNoticeFun() {
            CommonUtil.alertHelp(74506);
        }

        protected onOpened(): void {
            super.onOpened();
            this._bolll = false;
            this._bolllPos = false;
            this._index = 0;//全服记录修改
            this._index1 = 0;//全服记录修改

            this._isAniIng = false;
            this._isUpdateBtnClick = true;
            PayRewardCtrl.instance.getPayRewardInfo();
            PayRewardCtrl.instance.GetPayRewardServerBroadcast();
            this.showReward();
            this.changproCtrl();
            this.changDrawNum();
            // for (let i = 0; i < this._showItem.length; i++) {
            //     this._clipArr[i].play();
            // }


        }


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
                    let _html = new HtmlReward(417, 20, this._htmlArr);
                    this.severPanel.addChild(_html);
                    _html.name = "数据：" + index;
                    this._htmlArr.push(_html);
                }
            }
        }
        //全服记录修改
        public showHtml() {
            if (this._sevStringArr) {
                if (this._sevStringArr.length > 0) {
                    let _html: HtmlReward = null;
                    this.setARR();
                    _html = this._htmlArr[this._index];
                    this._index = this._index + 1;
                    this._index = this._index > (this._htmlArr.length - 1) ? 0 : this._index;
                    if (_html) {
                        // console.log("_html.name:" + _html.name)
                        _html.setText(126 + 8, 126, this.getSevStringArr());
                        if (!this._bolllPos) {
                            this._bolllPos = true;
                            Laya.timer.clear(this, this.updateList);
                            Laya.timer.frameLoop(1, this, this.updateList);
                        }
                    }
                }
            }
        }
        //全服记录修改
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
            let svrList = PayRewardModel.instance.svrBroadcastList;

            if (svrList != undefined) {
                if (svrList.length > 0) {
                    if (this._sevStringArr.length > 0) {
                        this._sevStringArr.length = 0;
                    }
                    svrList.reverse();//最新的数据在后面 翻转下
                    for (let i = 0; i < 10; i++) {
                        if (svrList[i]) {
                            let name = svrList[i][PayRewardNoteSvrFields.name];
                            let itemId = svrList[i][PayRewardNoteSvrFields.itemId];
                            let itemName = modules.common.CommonUtil.getNameByItemId(itemId);
                            let count = svrList[i][PayRewardNoteSvrFields.count];
                            let itemColor = modules.common.CommonUtil.getColorById(itemId);
                            var html: string = "<span style='color:#585858;'>天赐鸿福,</span>";
                            html += `<span style='color:rgb(13,121,255);'>${name}</span>`;
                            html += "<span style='color:#585858;'>获得了</span>";
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

        /**
         * 刷新UI
         */
        public updateUI() {
            this.changproCtrl();
            this.changDrawNum();
        }

        /**
         * 转盘抽奖返回
         */
        public PayRewardRunReply() {
            let isTen = false;//是否十连抽
            let noteList = PayRewardModel.instance.getNoteList();
            if (noteList.length > 1) {
                // isTen = true;
                WindowManager.instance.open(WindowEnum.PAYREWARD_ALERT, noteList);
            } else {
                //播放动画
                let start = new Point(300, 350);
                let arr = [noteList[0][0], start, this.height];
                // GlobalData.dispatcher.event(CommonEventType.PAY_REWARD_EFFECT, [arr]);
                this._arr = arr;
                if (this.disibleAnimationCheckBox.selected) {
                    GlobalData.dispatcher.event(CommonEventType.PAY_REWARD_EFFECT, [this._arr]);
                    CommonUtil.delayedPutInBag();
                } else {
                    let leatReward = noteList[noteList.length - 1];//取到最后一个抽到的奖励 显示抽取定位
                    let grade = leatReward[2];
                    this.showInSmoking(grade, isTen);
                }
            }

        }

        /**
         * 显示抽中了哪个
         */
        public showInSmoking(grade: number, isTen: boolean) {
            let targetIdnex = 0;
            let _weightCfgs = payRewardWeightCfg.instance.getWeightCfgs();
            for (let i = 0; i < _weightCfgs.length; i++) {
                let index: number = _weightCfgs[i][PayRewardWeightNodeFields.index];
                let bagItem: BaseItem = this._showItem[i];
                if (bagItem) {
                    if (grade == index) {
                        targetIdnex = index - 1;
                        break;
                    } else {

                    }
                }
            }
            this.startAni(targetIdnex, isTen);
        }

        /**
         * 开始播放 抽奖动画
         * @param targetIdnex 目标位置
         * @param isTen 是否十连抽
         */
        public startAni(targetIdnex: number, isTen: boolean = false) {
            let _weightCfgs = payRewardWeightCfg.instance.getWeightCfgs();
            this._maxSpeed = 10;//最快速度(11*每一檔增減的速度++)
            this._startSpeed = 130;//起始速度
            this._minSpeed = 130;//最慢速度
            this._quanNum = 3;//转几圈
            this._targetIdnex = targetIdnex;//目标位置
            this._nowTargetIdnex = 5;//当前位置
            this._startdnex = this._nowTargetIdnex;//起始位置
            this._isAniIng = true;
            this._isTen = isTen;
            Laya.timer.clear(this, this.ani);
            this.ani();
        }

        public ani() {
            let _weightCfgs = payRewardWeightCfg.instance.getWeightCfgs();
            let _length = _weightCfgs.length - 1;
            this._nowTargetIdnex += 1;
            this._nowTargetIdnex = this._nowTargetIdnex > _length ? 0 : this._nowTargetIdnex;//下标不能超过最大下标
            if (this._nowTargetIdnex === this._startdnex) {//一圈
                this._quanNum -= 1;
            }
            let bagItem: BaseItem = this._showItem[this._nowTargetIdnex];
            if (bagItem) {
                // bagItem.addChild(this.xuanZhonImg);
                let x = bagItem.width / 2 + bagItem.x;
                let y = bagItem.height / 2 + bagItem.y;
                this.xuanZhonImg.pos(x, y);
                this.xuanZhonImg.visible = true;
            }

            if (this._quanNum > 0) {
                this._startSpeed -= 10;
                this._startSpeed = this._startSpeed < this._maxSpeed ? this._maxSpeed : this._maxSpeed;
                Laya.timer.clear(this, this.ani);
                Laya.timer.once(this._startSpeed, this, this.ani);
            } else if (this._quanNum == 0) {//最后一圈 减速
                this._startSpeed += 10;
                this._startSpeed = this._startSpeed > this._minSpeed ? this._minSpeed : this._startSpeed;
                Laya.timer.clear(this, this.ani);
                Laya.timer.once(this._startSpeed, this, this.ani);
            } else {  //中間的次數 保持最大速度
                if (this._nowTargetIdnex === this._targetIdnex) {
                    Laya.timer.clear(this, this.ani);
                    // console.log("抽奖动画结束...");
                    this._isAniIng = false;
                    if (this._isTen) {
                        let noteList = PayRewardModel.instance.getNoteList();
                        WindowManager.instance.open(WindowEnum.PAYREWARD_ALERT, noteList);
                    } else {
                        if (this._arr) {
                            GlobalData.dispatcher.event(CommonEventType.PAY_REWARD_EFFECT, [this._arr]);
                            CommonUtil.delayedPutInBag();
                        }
                    }
                    return;
                } else {
                    Laya.timer.clear(this, this.ani);
                    if (this._targetIdnex > 6 && this._targetIdnex <= _length) {//这里只是判断目标位置 是否超过一半
                        this._startSpeed += 20;
                    } else {
                        this._startSpeed += 10;
                    }
                    Laya.timer.once(this._startSpeed, this, this.ani);
                }
            }
        }

        /**
         * 展示奖励
         */
        public showReward() {
            let _weightCfgs = payRewardWeightCfg.instance.getWeightCfgs();
            for (let i = 0; i < _weightCfgs.length; i++) {
                let itemId: number = _weightCfgs[i][PayRewardWeightNodeFields.itemId];
                let count: number = _weightCfgs[i][PayRewardWeightNodeFields.count];
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
            this.instructionsText.text = `每充值${payRewardWeightCfg.instance.money}元可免费抽奖一次`;
        }

        /**
         * 改變財氣獎勵領取進度
         */
        public changproCtrl() {
            let gfffff = PayRewardModel.instance.rewardList;
            let getgRade: [number, number] = PayRewardModel.instance.getgRade();
            let conditionNUm = PayRewardCfg.instance.get_condition(getgRade[0]);
            let stateNUm = getgRade[1];
            this._proCtrl.maxValue = conditionNUm;
            this._proCtrl.value = PayRewardModel.instance.caifu;
            if (stateNUm == 1) {
                this._isReward = true;
                this._prizeEffect.play();
                this._prizeEffect.visible = true;
            } else {
                this._isReward = false;
                this._prizeEffect.stop();
                this._prizeEffect.visible = false;
            }
        }

        /**
         * 改變剩餘抽獎次數
         */
        public changDrawNum() {
            let drawNum = PayRewardModel.instance.rewardCount;
            let colorStr = "#ff3e3e";
            drawNum == 0 ? colorStr = "#ff3e3e" : colorStr = "#168a17";
            this.drawNum.color = colorStr;
            this.drawNum.text = `${drawNum}`;
            let wight = this.Text1.textWidth + this.drawNum.textWidth + this.Text2.textWidth;
            let X = (this.width - wight) / 2;
            this.Text1.x = X;
            this.drawNum.x = this.Text1.x + this.Text1.textWidth;
            this.Text2.x = this.drawNum.x + this.drawNum.textWidth;
            if (drawNum == 0) {
                this._oneBtnBtnClip.visible = false;
                this._oneBtnBtnClip.stop();
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else if (drawNum > 0 && drawNum < 10) {
                this._oneBtnBtnClip.visible = true;
                this._oneBtnBtnClip.play();
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else {
                this._oneBtnBtnClip.visible = true;
                this._oneBtnBtnClip.play();
                this._tenBtnBtnClip.visible = true;
                this._tenBtnBtnClip.play();
            }
        }

        private xunBaoHandler(value: number): void {
            if (this._isUpdateBtnClick) {
                this._isUpdateBtnClick = false;
                Laya.timer.once(this._isUpdateBtnClickNum, this, this.chuang_isUpdateBtnClick);
                /*抽奖标记(0抽一次 1抽10次)*/
                let drawNum = PayRewardModel.instance.rewardCount;
                if (value == 0) {
                    if (drawNum == 0) {
                        SystemNoticeManager.instance.addNotice("抽奖次数不足", true);
                        return;
                    }
                } else {
                    if (drawNum < 10) {
                        SystemNoticeManager.instance.addNotice("抽奖次数不足", true);
                        return;
                    }
                }
                if (!this._isAniIng) {
                    PayRewardCtrl.instance.payRewardRun(value);
                }
            } else {
                SystemNoticeManager.instance.addNotice("操作过于频繁", true);
            }
        }

        private chuang_isUpdateBtnClick() {
            this._isUpdateBtnClick = true;
        }

        /**
         * 领取财气奖励
         */
        public caiQiReceiveBtnHandler(): void {
            if (this._isReward) {
                PayRewardCtrl.instance.getPayRewardReward();
            } else {
                //打开财气值奖励界面
                // console.log("打开财气值奖励界面");
                WindowManager.instance.open(WindowEnum.PAYREWARDRANK_ALERT, 0);
            }
        }

        /**
         * 我的抽奖记录
         */
        public myRecordBtnHandler() {
            PayRewardCtrl.instance.getPayRewardNotes();
        }

        /**
         * 打开我的抽奖记录弹窗
         */
        public openMyRecord() {
            if (PayRewardModel.instance.PayRewardNoteList == undefined) {
                SystemNoticeManager.instance.addNotice("暂无记录", true);
                return;
            }
            if (PayRewardModel.instance.PayRewardNoteList.length > 0) {
                WindowManager.instance.open(WindowEnum.PAYREWARDMYRECORD_ALERT, 0);
            } else {
                SystemNoticeManager.instance.addNotice("暂无记录", true);
            }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.updateList);
            Laya.timer.clear(this, this.ani);
            Laya.timer.clear(this, this.chuang_isUpdateBtnClick);
            this.desDoryArr();
            this._oneBtnBtnClip.stop();
            this._oneBtnBtnClip.visible = false;
            this._tenBtnBtnClip.stop();
            this._tenBtnBtnClip.visible = false;
            this._prizeEffect.stop();
            this._prizeEffect.visible = false;
            CommonUtil.delayedPutInBag();
        }


        /**
         * 初始化特效
         */
        public initializeClip() {
            this._oneBtnBtnClip = new CustomClip();
            this._tenBtnBtnClip = new CustomClip();
            this.addChild(this._oneBtnBtnClip);
            this.addChild(this._tenBtnBtnClip);
            this._oneBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._oneBtnBtnClip.frameUrls = arr;
            this._oneBtnBtnClip.pos(this.oneBtn.x - 3, this.oneBtn.y - 20, true);
            this._oneBtnBtnClip.scale(1.0, 1.3, true);
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.pos(this.tenBtn.x - 3, this.tenBtn.y - 20, true);
            this._tenBtnBtnClip.scale(1.0, 1.3, true);
            this._prizeEffect = new CustomClip();
            this.addChildAt(this._prizeEffect, 19);
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.pos(440, 780, true);
            this._prizeEffect.scale(1, 1, true);
        }
    }
}
