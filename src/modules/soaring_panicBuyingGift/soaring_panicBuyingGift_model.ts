///<reference path="../config/soaring_rush_buy_fs.ts"/>
/**
 * 抢购礼包 （封神榜）
 */
namespace modules.soaring_panicBuyingGift {
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetRushBuyFSInfoReply = Protocols.GetRushBuyFSInfoReply;
    import GetRushBuyFSInfoReplyFields = Protocols.GetRushBuyFSInfoReplyFields;
    /*更新数据*/
    import UpdateRushBuyFSInfo = Protocols.UpdateRushBuyFSInfo;
    import UpdateRushBuyFSInfoFields = Protocols.UpdateRushBuyFSInfoFields;
    import SoaringPanicBuyingGiftCfg = modules.config.SoaringPanicBuyingGiftCfg;
    import rush_buy_fs = Configuration.rush_buy_fs;
    import rush_buy_fsFields = Configuration.rush_buy_fsFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import RedPiontCtrl = modules.redPoint.RedPointCtrl;
    import Utils = laya.utils.Utils;
    import Unit = utils.Unit;

    export class SoaringPanicBuyingGiftModel {
        private stopCountRandom: number;
        private static _instance: SoaringPanicBuyingGiftModel;
        public static get instance(): SoaringPanicBuyingGiftModel {
            return this._instance = this._instance || new SoaringPanicBuyingGiftModel();
        }
        private outTime: number = 0;
        private inTime: number = 0;
        private _isFirstOpen: boolean;
        //*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*总数量*/
        private _totalCount: number;
        /*购买数量*/
        private _count: number;

        /*当前活动类型*/
        private _cuyType: number;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        private _endFlag: number;
        /*偽-剩余可购买总数*/
        private _totalCountRandom: number;
        /*玩家id*/
        private _playerId: number;

        private _Datas: rush_buy_fs;

        private timerIsRun: boolean = false;
        private buyTimeIsRum: boolean = false;

        private constructor() {
            this._state = 0;
            this._cuyType = 1;
            this._count = 0;
            this._totalCount = 0;
            this._restTm = 0;
            this._endFlag = 1;
            this._isFirstOpen = true;
            Laya.timer.loop(1000, this, this.timeOut);
        }

        public get state(): number {
            return this._state;
        }

        public get cuyType(): number {
            return this._cuyType;
        }

        public get count(): number {
            return this._count;
        }

        public get totalCount(): number {
            return this._totalCount;
        }

        public get restTm(): number {
            return this._restTm;
        }

        public get endFlag(): number {
            return this._endFlag;
        }

        public get totalCountRandom(): number {
            return this._totalCountRandom;
        }

        //返回数据
        public getInfo(tuple: GetRushBuyFSInfoReply) {
            // this._state = tuple[GetRushBuyFSInfoReplyFields.state];
            let a = SoaringPanicBuyingGiftModel.instance.restTm;
            this._count = tuple[GetRushBuyFSInfoReplyFields.count];
            this._totalCount = tuple[GetRushBuyFSInfoReplyFields.totalCount];
            let fsInfo = tuple[GetRushBuyFSInfoReplyFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            this.inTime = GlobalData.serverTime;

            this._playerId = PlayerModel.instance.actorId;

            this.dateUpdate();
            if (this._isFirstOpen) this.setRP();
        }
        //todo 面板开启
        public openPanel(){
            this.outTime = GlobalData.serverTime;
            let now: number = (GlobalData.serverTime - new Date(GlobalData.serverTime).getTimezoneOffset() * 60 * 1000) / 24 / 60 / 60 / 1000;
            if(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelOutTime}`)&&localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelOutTime}`).length>0){
                let outTime: number = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelOutTime}`));
                let outDay = Math.floor((outTime - new Date(outTime).getTimezoneOffset() * 60 * 1000) / 24 / 60 / 60 / 1000);
                let nowDay = Math.floor(now);
                if (nowDay - outDay >= 1) {
                    localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelOutTime}`, `${this.outTime}`);
                    this.removeItem();
                    this.dateUpdate();
                }
            }else{
                localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelOutTime}`, `${this.outTime}`);
            }
        }
        //数据更新
        public dateUpdate() {
            let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
            if (!localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`)) {
                this.dealCount();
            } else {
                if (!localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelNotBuy}`)) {
                    this.creatNotBuy();
                    this._totalCountRandom = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`));
                    if (this._totalCountRandom <= this.stopCountRandom) {
                        this._totalCountRandom = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`));
                    } else {
                        if (!this.timerIsRun) {
                            this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
                            let param = this._Datas ? this._Datas[rush_buy_fsFields.count] - SoaringPanicBuyingGiftModel.instance.count : 1;
                            if (param == 0) {
                                let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
                                if (!this.buyTimeIsRum) {
                                    this.timerIsRun = false;
                                    Laya.timer.clear(this, this.minusCount);
                                    Laya.timer.loop(intervalTime, this, this.isBuyThenMinus);
                                }
                            } else {
                                this.buyTimeIsRum = false;
                                Laya.timer.clear(this, this.isBuyThenMinus);
                                Laya.timer.loop(intervalTime, this, this.minusCount);
                            }
                        }
                    }
                } else {
                    this.stopCountRandom = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelNotBuy}`));
                    this._totalCountRandom = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`));
                    if (this._totalCountRandom <= this.stopCountRandom) {
                        this._totalCountRandom = parseInt(localStorage.getItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`));
                    } else {
                        if (!this.timerIsRun) {
                            this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
                            let param = this._Datas ? this._Datas[rush_buy_fsFields.count] - SoaringPanicBuyingGiftModel.instance.count : 1;
                            if (param == 0) {
                                let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
                                if (!this.buyTimeIsRum) {
                                    this.timerIsRun = false;
                                    Laya.timer.clear(this, this.minusCount);
                                    Laya.timer.loop(intervalTime, this, this.isBuyThenMinus);
                                }
                            } else {
                                this.buyTimeIsRum = false;
                                Laya.timer.clear(this, this.isBuyThenMinus);
                                Laya.timer.loop(intervalTime, this, this.minusCount);
                            }
                        }
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_UPDATE);
        }
        //未购买停止随机数
        private creatNotBuy() {
            //未购买是停止扣除区间最小数
            let stopCountMin = BlendCfg.instance.getCfgById(57004)[blendFields.intParam][0];
            //未购买是停止扣除区间最大数
            let stopCountMax = BlendCfg.instance.getCfgById(57004)[blendFields.intParam][1];
            //未购买是停止扣除(随机数)
            this.stopCountRandom = Math.floor(Math.random() * (stopCountMax - stopCountMin) + stopCountMin);
            localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelNotBuy}`, `${this.stopCountRandom}`);
        }
        public isBuy() {
            this._totalCountRandom -= 1;

            localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
            GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_COUNT_UPDATE);
            //扣除次数时间间隔(ms)
            this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
            let param = this._Datas ? this._Datas[rush_buy_fsFields.count] - SoaringPanicBuyingGiftModel.instance.count : 1;
            if (param == 0) {
                let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
                if (!this.buyTimeIsRum) {
                    this.timerIsRun = false;
                    Laya.timer.clear(this, this.minusCount);
                    Laya.timer.loop(intervalTime, this, this.isBuyThenMinus);
                }
            }
        }
        private isBuyThenMinus() {
            //每次扣除次数随机区间最小数
            let minMinusNum = BlendCfg.instance.getCfgById(57003)[blendFields.intParam][0];
            //可购买区间最大数
            let maxMinusNum = BlendCfg.instance.getCfgById(57003)[blendFields.intParam][1];

            this.buyTimeIsRum = true;
            if (this._totalCountRandom > 0) {
                this._totalCountRandom -= Math.floor(Math.random() * (maxMinusNum - minMinusNum) + minMinusNum);
                this._totalCountRandom = this._totalCountRandom < 0 ? 0 : this._totalCountRandom;
                localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
                GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_COUNT_UPDATE);
            } else {
                localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
                this.buyTimeIsRum = false;
                Laya.timer.clear(this, this.isBuyThenMinus);
            }
        }
        //伪可购买数量处理
        private dealCount() {
            //可购买区间最小数
            let minNum = BlendCfg.instance.getCfgById(57001)[blendFields.intParam][0];
            //可购买区间最大数
            let maxNum = BlendCfg.instance.getCfgById(57001)[blendFields.intParam][1];
            //扣除次数时间间隔(ms)
            let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
            this.creatNotBuy();
            //可购买数
            this._totalCountRandom = Math.floor(Math.random() * (maxNum - minNum) + minNum);

            localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
            if (!this.timerIsRun) {
                this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
                let param = this._Datas ? this._Datas[rush_buy_fsFields.count] - SoaringPanicBuyingGiftModel.instance.count : 1;
                if (param == 0) {
                    let intervalTime = BlendCfg.instance.getCfgById(57002)[blendFields.intParam][0];
                    if (!this.buyTimeIsRum) {
                        this.timerIsRun = false;
                        Laya.timer.clear(this, this.minusCount);
                        Laya.timer.loop(intervalTime, this, this.isBuyThenMinus);
                    }
                } else {
                    this.buyTimeIsRum = false;
                    Laya.timer.clear(this, this.isBuyThenMinus);
                    Laya.timer.loop(intervalTime, this, this.minusCount);
                }
            }
        }
        private minusCount() {
            //每次扣除次数随机区间最小数
            let minMinusNum = BlendCfg.instance.getCfgById(57003)[blendFields.intParam][0];
            //可购买区间最大数
            let maxMinusNum = BlendCfg.instance.getCfgById(57003)[blendFields.intParam][1];

            this.timerIsRun = true;
            if (this._totalCountRandom > this.stopCountRandom) {
                let a = this._totalCountRandom;
                let b = Math.floor(Math.random() * (maxMinusNum - minMinusNum) + minMinusNum);
                if (this._totalCountRandom - Math.floor(Math.random() * (maxMinusNum - minMinusNum) + minMinusNum) >= this.stopCountRandom) {
                    this._totalCountRandom -= Math.floor(Math.random() * (maxMinusNum - minMinusNum) + minMinusNum);
                    this._totalCountRandom = this._totalCountRandom < 0 ? 0 : this._totalCountRandom;
                    localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
                    GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_COUNT_UPDATE);
                } else {
                    localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
                    this.timerIsRun = false;
                    Laya.timer.clear(this, this.minusCount);
                }
            } else {
                localStorage.setItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`, `${this._totalCountRandom}`);
                this.timerIsRun = false;
                Laya.timer.clear(this, this.minusCount);
            }
        }
        //条件删除本地缓存
        //todo timeout
        private timeOut() {
            let b = GlobalData.serverTime;
            let now: number = (GlobalData.serverTime - new Date(GlobalData.serverTime).getTimezoneOffset() * 60 * 1000) / 24 / 60 / 60 / 1000;
            let day = common.CommonUtil.formatTime(GlobalData.serverTime);
            let next = Math.ceil(now);
            let nextMs = next * 24 * 60 * 60 * 1000;
            let realyTime = nextMs + new Date(nextMs).getTimezoneOffset() * 60 * 1000;
            let delta_T = realyTime - GlobalData.serverTime;
            let a = utils.Unit.hour;
            if (delta_T <= 2000) {
                this.removeItem();
            }
        }
        private removeItem() {
            localStorage.removeItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModel}`);
            localStorage.removeItem(`${this._playerId}${localStorageStrKey.SoaringPanicBuyingGiftModelNotBuy}`);
            Laya.timer.clear(this, this.minusCount);
            Laya.timer.clear(this, this.isBuyThenMinus);
            //todo
            this.timerIsRun = false;
            this.buyTimeIsRum = false;
            GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_COUNT_UPDATE);
            GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_NEXT_DAY_UPDATE);
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdateRushBuyFSInfo) {
            // this._state = tuple[UpdateRushBuyFSInfoFields.state];
            if (tuple) {
                this._count = tuple[UpdateRushBuyFSInfoFields.count];
                this._totalCount = tuple[UpdateRushBuyFSInfoFields.totalCount];
                let fsInfo = tuple[UpdateRushBuyFSInfoFields.fsInfo];
                this._endFlag = fsInfo[FSRankInfoFields.endFlag];
                this._cuyType = fsInfo[FSRankInfoFields.type];
                this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
                GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_UPDATE);
                GlobalData.dispatcher.event(CommonEventType.SOARING_PANICBUYINGGIFT_NEXT_DAY_UPDATE);
                //this.setRP();
            }
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = true;
            let shuju = SoaringPanicBuyingGiftCfg.instance.getCfgById(this._cuyType);
            if (shuju) {
                let count = shuju[rush_buy_fsFields.count];
                let totalCount = shuju[rush_buy_fsFields.totalCount];
                if (this.totalCount == 0) {//如果全服数量没有了
                    bolll = false;
                } else {
                    if (count == this.count) {//如果个人购买数量达到上限
                        bolll = false;
                    }
                }
            } else {
                bolll = false;
            }
            return bolll;
        }

        //初始化封神抢购界面红点的显示与隐藏
        private setRP() {
            this._isFirstOpen = false;
            if (this.endFlag == 0) {
                let datas: rush_buy_fs = SoaringPanicBuyingGiftCfg.instance.getCfgById(this.cuyType);
                if (datas) {
                    let count = datas[rush_buy_fsFields.count];
                    if (count != this.count) RedPiontCtrl.instance.setRPProperty("soaringPanicBuyingGifRP", true);
                }
                else {
                    RedPiontCtrl.instance.setRPProperty("soaringPanicBuyingGifRP", false);
                }
            }
        }
    }
}
