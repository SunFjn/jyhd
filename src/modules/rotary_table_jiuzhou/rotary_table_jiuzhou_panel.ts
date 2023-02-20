///<reference path="../config/onhook_income_cfg.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../ranking_list/player_ranking_model.ts"/>
///<reference path="../pay_reward/pay_reward_model.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../pay_reward/pay_reward_ctrl.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/jz_duobao_reward_cfg.ts"/>
///<reference path="../config/jz_duobao_weight_cfg.ts"/>
namespace modules.rotary_table_jiuzhou {
    import JzDuobaoRewardCfg = modules.config.JzDuobaoRewardCfg;
    import JzDuobaoWeightCfg = modules.config.JzDuobaoWeightCfg;
    import jzduobao_weightFields = Configuration.jzduobao_weightFields;
    import jzduobao_rewardFields = Configuration.jzduobao_rewardFields;
    import PayRewardWeightNodeFields = Configuration.PayRewardWeightNodeFields;
    import Point = laya.maths.Point;
    import Event = Laya.Event;
    //本地数据 配置文件类型引用
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import PayRewardNoteSvrFields = Protocols.PayRewardNoteSvrFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendMode = Laya.BlendMode;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import JzduobaoNode = Configuration.JzduobaoNode;
    import JzduobaoNodeFields = Configuration.JzduobaoNodeFields;
    export class RotaryTableJiuZhouPanel extends ui.RotaryTableJiuZhouViewUI {
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
        public _htmlArrCangPos: Array<HtmlReward>;//全服记录修改
        private _bolll = false;//全服记录修改
        private _bolllPos = false;//全服记录修改
        private _index = 0;//全服记录修改
        private _index1 = 0;//全服记录修改
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._isReward = false;
            this.centerX = 0;
            this.centerY = 0;
            this._showItem = [
                this.item1,
                this.item2,
                this.item3,
                this.item4,
                this.item5,
                this.item6,
                this.item7,
                this.item8,
                this.item9,
                this.item10,
                this.item11,
                this.item12,
                this.item13,
                this.item14];
            this._proCtrl = new ProgressBarCtrl(this.blessImg, 339, this.blessTxt);
            this.initializeClip();
            this._sevTextArr = new Array<any>();
            this._sevStringArr = new Array<any>();
            // this.updateSeverList();
            this._clipArr = new Array<CustomClip>();
            for (let i = 0; i < this._showItem.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                //clip.blendMode = BlendMode.ADD;
                if (i == 0 || i == 4 || i == 7 || i == 11) {
                    let img = new Laya.Image();
                    img.skin = "pay_plate/frame_jzdb_zsk.png";
                    this._showItem[i].addChild(img);
                    img.visible = true;
                    img.pos(-4, -3);
                }
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
            this.StatementHTML.color = "#168a17";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "center";
        }
        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.caiQiReceiveBtn.on(Event.CLICK, this, this.caiQiReceiveBtnHandler);
            this.myRecordBtn.on(Event.CLICK, this, this.myRecordBtnHandler);
            this.rankBtn.on(Event.CLICK, this, this.rankBtnHandler);
            this.probabilityNotice.on(Event.CLICK, this, this.probabilityNoticeFun);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_RUNREPLY, this, this.PayRewardRunReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_OPENRECORD, this, this.openMyRecord);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_BROADCAST_LIST, this, this.updateSeverList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_SHOWHTML, this, this.showHtml);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE_JACKPOT, this, this.setCionNumText);
        }
        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.caiQiReceiveBtn.off(Event.CLICK, this, this.caiQiReceiveBtnHandler);
            this.myRecordBtn.off(Event.CLICK, this, this.myRecordBtnHandler);
            this.rankBtn.off(Event.CLICK, this, this.rankBtnHandler);
            this.probabilityNotice.off(Event.CLICK, this, this.probabilityNoticeFun);
            Laya.timer.clear(this, this.activityHandler);
        }
        public probabilityNoticeFun() {
            CommonUtil.alertHelp(74507);
        }
        public rankBtnHandler() {
            WindowManager.instance.open(WindowEnum.ROTARYTABLE_JIUZHOU_RANKAWARD_ALERT);
        }
        protected onOpened(): void {
            super.onOpened();
            this._bolll = false;
            this._bolllPos = false;
            this._index = 0;//全服记录修改
            this._index1 = 0;//全服记录修改
            RotaryTableJiuZhouCtrl.instance.GetDuobaoInfo();
            RotaryTableJiuZhouCtrl.instance.GetDuobaoServerBroadcast();
            let biLi = modules.config.BlendCfg.instance.getCfgById(41004)[Configuration.blendFields.intParam][0] * 100;
            this.StatementHTML.innerHTML = `抽奖一次抽成<span style='color:#b15315'>${biLi}%</span> 代币券注入奖池`;
            this.oneMoneytext.text = `${RotaryTableJiuZhouModel.instance._oneMoney}`;
            this.tenMoneytext.text = `${RotaryTableJiuZhouModel.instance._tenMoney}`;
            this._isAniIng = false;
            this._isUpdateBtnClick = true;
            this.updateUI();
        }
        /**
         * 刷新UI
         */
        public updateUI() {
            this.showReward();
            this.changproUI();
            // this.changDrawNum();
            let ingot = PlayerModel.instance.ingot;//玩家代币券
            if (ingot < RotaryTableJiuZhouModel.instance._oneMoney) {
                this.oneMoneytext.color = "#FF3e3e";
            }
            else {
                this.oneMoneytext.color = "#ffffff";
            }
            if (ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
                this.tenMoneytext.color = "#FF3e3e";
            }
            else {
                this.tenMoneytext.color = "#ffffff";
            }
            this.rankBtn.visible = true;
            Laya.timer.clear(this, this.activityHandler);
            this.setActivitiTime();
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.jzduobao);
            if (RotaryTableJiuZhouModel.instance.restTm >= GlobalData.serverTime &&
                isOpen && RotaryTableJiuZhouModel.instance.openState == 1) {
                this.activityText1.color = "#ffffff";
                this.activityText.visible = true;
                this.activityText1.text = "活动倒计时:";
                this.activityText1.x = 223;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                this.activityText1.x = 299;
            }
        }
        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(RotaryTableJiuZhouModel.instance.restTm)}`;
            if (RotaryTableJiuZhouModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#ffffff";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                this.activityText1.x = 299;
                Laya.timer.clear(this, this.activityHandler);
            }
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
                    let _html = new HtmlReward(382, 20, this._htmlArr);
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
                        _html.setText(232 + 8, 232, this.getSevStringArr());
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
            let svrList = RotaryTableJiuZhouModel.instance.svrBroadcastList;
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
                            var html: string = `<span style='color:#ffffff;'>天赐鸿福,</span>`;
                            html += `<span style='color:rgb(13,121,255);'>${name}</span>`;
                            html += `<span style='color:#ffffff;'>获得了</span>`;
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
         * 转盘抽奖返回
         */
        public PayRewardRunReply() {
            let isTen = false;//是否十连抽
            let noteList = RotaryTableJiuZhouModel.instance.getNoteList();
            if (noteList.length > 1) {
                // isTen = true;
                WindowManager.instance.open(WindowEnum.ROTARYTABLE_JIUZHOU_REWARD_ALERT, noteList);
            } else {
                //播放动画
                let start = new Point(300, 550);
                let arr = [noteList[0][0], start, this.height];
                // GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_EFFECT, [arr]);
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
            let openDay = modules.player.PlayerModel.instance.openDay;
            let _weightCfgs = JzDuobaoWeightCfg.instance.getDate(1);
            let weight = _weightCfgs;
            for (let i = 0; i < weight.length; i++) {
                let index: number = weight[i][JzduobaoNodeFields.index];
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
            this._maxSpeed = 10;//最快速度(11*每一檔增減的速度++)
            this._startSpeed = 130;//起始速度
            this._minSpeed = 130;//最慢速度
            this._quanNum = 3;//转几圈
            this._targetIdnex = targetIdnex;//目标位置
            this._nowTargetIdnex = 13;//当前位置
            this._startdnex = this._nowTargetIdnex;//起始位置
            this._isAniIng = true;
            this._isTen = isTen;
            Laya.timer.clear(this, this.ani);
            this.ani();
        }
        public ani() {
            let _weightCfgs = JzDuobaoWeightCfg.instance.getDate(1);
            let weight = _weightCfgs;
            let _length = weight.length - 1;
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
                        let noteList = RotaryTableJiuZhouModel.instance.getNoteList();
                        WindowManager.instance.open(WindowEnum.ROTARYTABLE_JIUZHOU_REWARD_ALERT, noteList);
                    } else {
                        if (this._arr) {
                            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_EFFECT, [this._arr]);
                            CommonUtil.delayedPutInBag();
                            let allItemId = RotaryTableJiuZhouModel.instance.getNoteListGj();//所有符合弹窗的奖励
                            if (allItemId.length > 0) {
                                WindowManager.instance.open(WindowEnum.TREASURE_GET_ALERT, allItemId);
                            }
                        }
                    }
                    return;
                } else {
                    Laya.timer.clear(this, this.ani);
                    if (this._targetIdnex > 0 && this._targetIdnex <= 7) {//这里只是判断目标位置 是否超过一半
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
            let _weightCfgs = JzDuobaoWeightCfg.instance.getDate(1);
            let weight = _weightCfgs;
            for (let i = 0; i < weight.length; i++) {
                let itemId: number = weight[i][JzduobaoNodeFields.itemId];
                let count: number = weight[i][JzduobaoNodeFields.count];
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
        /**
         * 改變財氣獎勵領取進度
         */
        public changproUI() {
            let openDay = modules.player.PlayerModel.instance.openDay;
            let getgRade: [number, number] = RotaryTableJiuZhouModel.instance.getgRade();
            let _JzDuobaoRewardCfg = JzDuobaoRewardCfg.instance.getDate(getgRade[0]);
            let condition = _JzDuobaoRewardCfg[jzduobao_rewardFields.condition];
            let conditionNUm = condition;
            let stateNUm = getgRade[1];
            this._proCtrl.maxValue = conditionNUm;
            this._proCtrl.value = RotaryTableJiuZhouModel.instance.score;
            if (stateNUm == 1) {
                this._isReward = true;
                this._prizeEffect.play();
                this._prizeEffect.visible = true;
            } else {
                this._isReward = false;
                this._prizeEffect.stop();
                this._prizeEffect.visible = false;
            }
            this.setCionNumText();
        }
        /**
         * 判断按钮特效
         */
        public changDrawNum() {
            let ingot = PlayerModel.instance.ingot;//玩家代币券
            if (ingot == 0) {
                this._oneBtnBtnClip.visible = false;
                this._oneBtnBtnClip.stop();
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else if (ingot > RotaryTableJiuZhouModel.instance._oneMoney && ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
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
                let ingot = PlayerModel.instance.ingot;//玩家代币券
                if (value == 0) {
                    if (ingot < RotaryTableJiuZhouModel.instance._oneMoney) {
                        CommonUtil.goldNotEnoughAlert();
                        return;
                    }
                } else {
                    if (ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
                        CommonUtil.goldNotEnoughAlert();
                        return;
                    }
                }
                if (!this._isAniIng) {
                    RotaryTableJiuZhouCtrl.instance.DuobaoRun(value);
                }
            } else {
                SystemNoticeManager.instance.addNotice("操作过于频繁", true);
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            this.close();
        }
        private chuang_isUpdateBtnClick() {
            this._isUpdateBtnClick = true;
        }
        /**
         * 领取财气奖励
         */
        public caiQiReceiveBtnHandler(): void {
            if (this._isReward) {
                RotaryTableJiuZhouCtrl.instance.GetDuobaoReward();
            } else {
                //打开财气值奖励界面
                // console.log("打开财气值奖励界面");
                WindowManager.instance.open(WindowEnum.ROTARYTABLE_JIUZHOU_RANK_ALERT, 0);
            }
        }
        /**
         * 请求我的抽奖记录
         */
        public myRecordBtnHandler() {
            RotaryTableJiuZhouCtrl.instance.GetDuobaoNotes();
        }
        /**
         * 打开我的抽奖记录弹窗
         */
        public openMyRecord() {
            if (RotaryTableJiuZhouModel.instance.PayRewardNoteList == undefined) {
                SystemNoticeManager.instance.addNotice("暂无记录", true);
                return;
            }
            if (RotaryTableJiuZhouModel.instance.PayRewardNoteList.length > 0) {
                WindowManager.instance.open(WindowEnum.ROTARYTABLE_JIUZHOU_MYRECORD_ALERT, 0);
            } else {
                SystemNoticeManager.instance.addNotice("暂无记录", true);
            }
        }
        public close(): void {
            super.close();
            Laya.timer.clear(this, this.ani);
            Laya.timer.clear(this, this.chuang_isUpdateBtnClick);
            Laya.timer.clear(this, this.updateList);
            this.desDoryArr();
            this._oneBtnBtnClip.stop();
            this._oneBtnBtnClip.visible = false;
            this._tenBtnBtnClip.stop();
            this._tenBtnBtnClip.visible = false;
            this._prizeEffect.stop();
            this._prizeEffect.visible = false;
            CommonUtil.delayedPutInBag();
            WindowManager.instance.close(WindowEnum.ROTARYTABLE_JIUZHOU_RANK_ALERT);
            WindowManager.instance.close(WindowEnum.ROTARYTABLE_JIUZHOU_MYRECORD_ALERT);
            WindowManager.instance.close(WindowEnum.ROTARYTABLE_JIUZHOU_REWARD_ALERT);
            WindowManager.instance.close(WindowEnum.ROTARYTABLE_JIUZHOU_RANKAWARD_ALERT);
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
        public setCionNumText() {
            let _jackPot = RotaryTableJiuZhouModel.instance.jackPot;
            this.cionNumText.text = `${_jackPot}`;
            this.setPox();
        }
        public setPox() {
            let _width = this.text1.width + this.img1.width + this.cionNumText.width;
            let posX = (this.width - _width) / 2;
            this.text1.x = posX;
            this.img1.x = this.text1.x + this.text1.width;
            this.cionNumText.x = this.img1.x + this.img1.width;
        }
        /**
         * 初始化特效
         */
        public initializeClip() {
            this._oneBtnBtnClip = new CustomClip();
            this._tenBtnBtnClip = new CustomClip();
            this.oneBtn.addChild(this._oneBtnBtnClip);
            this.tenBtn.addChild(this._tenBtnBtnClip);
            this._oneBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._oneBtnBtnClip.frameUrls = arr;
            this._oneBtnBtnClip.scale(1, 1, true);
            this._oneBtnBtnClip.pos(-6, -8, true);
            this._oneBtnBtnClip.visible = false;
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.scale(1, 1, true);
            this._tenBtnBtnClip.pos(-6, -8, true);
            this._tenBtnBtnClip.visible = false;
            this._prizeEffect = new CustomClip();
            this.addChildAt(this._prizeEffect, 19);
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.scale(1, 1, true);
            this._prizeEffect.pos(460, 800, true);
        }
    }
}
