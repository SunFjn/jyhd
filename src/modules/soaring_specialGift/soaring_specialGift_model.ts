/////<reference path="../$.ts"/>
///<reference path="../config/soaring_single_pay_fs.ts"/>
/**
 * 特惠礼包 （封神榜）
 */
namespace modules.soaring_specialGift {

    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import DiscountGiftFSNode = Protocols.DiscountGiftFSNode;
    import DiscountGiftFSNodeFields = Protocols.DiscountGiftFSNodeFields;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetDiscountGiftFSInfoReply = Protocols.GetDiscountGiftFSInfoReply;
    import GetDiscountGiftFSInfoReplyFields = Protocols.GetDiscountGiftFSInfoReplyFields;
    /*更新数据*/
    import UpdateDiscountGiftFSInfo = Protocols.UpdateDiscountGiftFSInfo;
    import UpdateDiscountGiftFSInfoFields = Protocols.UpdateDiscountGiftFSInfoFields;
    import SoaringSpecialGiftCfg = modules.config.SoaringSpecialGiftCfg;
    import discount_gift_fsFields = Configuration.discount_gift_fsFields;
    import discount_gift_fs = Configuration.discount_gift_fs;
    import RedPiontCtrl = modules.redPoint.RedPointCtrl;

    export class SoaringSpecialGiftModel {
        private static _instance: SoaringSpecialGiftModel;
        public static get instance(): SoaringSpecialGiftModel {
            return this._instance = this._instance || new SoaringSpecialGiftModel();
        }

        private _isFirstOpen: boolean;
        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*当前活动类型*/
        private _cuyType: number;
        /*排行列表*/
        private _rewardList: Array<DiscountGiftFSNode>;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        private _endFlag: number;

        private constructor() {
            this._state = 0;
            this._cuyType = 1;
            this._rewardList = new Array<DiscountGiftFSNode>();
            this._restTm = 0;
            this._endFlag = 1;
            this._isFirstOpen = true;
        }

        public get state(): number {
            return this._state;
        }

        public get cuyType(): number {
            return this._cuyType;
        }

        public get rewardList(): Array<DiscountGiftFSNode> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }

        public get endFlag(): number {
            return this._endFlag;
        }

        //返回数据
        public getInfo(tuple: GetDiscountGiftFSInfoReply) {
            // this._state = tuple[UpdateDiscountGiftFSInfoFields.state];
            let fsInfo = tuple[GetDiscountGiftFSInfoReplyFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[GetDiscountGiftFSInfoReplyFields.nodeList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: DiscountGiftFSNode = _rewardList[index];
                    let id = element[DiscountGiftFSNodeFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_SPECIALGIFT_GETINFO);
            if (this._isFirstOpen) this.setRP();
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdateDiscountGiftFSInfo) {
            // this._state = tuple[UpdateDiscountGiftFSInfoFields.state];
            let fsInfo = tuple[UpdateDiscountGiftFSInfoFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[UpdateDiscountGiftFSInfoFields.nodeList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: DiscountGiftFSNode = _rewardList[index];
                    let id = element[DiscountGiftFSNodeFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_SPECIALGIFT_UPDATE);
        }

        public getState(data: DiscountGiftFSNode): number {
            let _state = 0;
            //特殊处理 特惠礼包默认都是可以点击购买的 只是点击的时候判断 代币券还有是否有附加条件
            if (data) {
                let id = data[DiscountGiftFSNodeFields.id];//档位
                let count = data[DiscountGiftFSNodeFields.count];//已领数量
                let shuju = SoaringSpecialGiftCfg.instance.getCfgById(id);
                if (shuju) {
                    let maxCount = shuju[discount_gift_fsFields.count];
                    if (maxCount > 0) {
                        if (count < maxCount) {
                            _state = 1;
                        } else if (count == maxCount) { //全部领取完毕 说明此档已全部领取
                            _state = 2;
                        }
                    }
                }
            } else {
                _state = 1;
            }
            return _state;
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._rewardList.length; index++) {
                let element = this._rewardList[index];
                if (element) {
                    let state = this.getState(element);
                    if (state == 1) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        //初始化封神特惠界面红点的显示与隐藏
        public setRP() {
            this._isFirstOpen = false;
            if (this.endFlag == 0) {
                let condition: number = 0;
                let useCount: number = 0;
                let datas: Array<discount_gift_fs> = SoaringSpecialGiftCfg.instance.getCfgByType(this.cuyType);
                for (let i = 0; i < datas.length; i++) {
                    let _DiscountGiftFSNode = this.rewardList[datas[i][discount_gift_fsFields.id]];
                    if (_DiscountGiftFSNode) {
                        useCount += _DiscountGiftFSNode[DiscountGiftFSNodeFields.count];//已领数量
                    }
                    condition += datas[i][discount_gift_fsFields.count];
                }
                if (condition - useCount > 0) RedPiontCtrl.instance.setRPProperty("soaringSpecialGiftRP",true);
            }       
        }
    }
}
