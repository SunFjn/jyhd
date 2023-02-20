namespace modules.recharge {
    import RechargeInfo = Protocols.RechargeInfo;
    import RechargeDayClear = Protocols.RechargeDayClear;
    import RechargeDayClearFields = Protocols.RechargeDayClearFields;
    import GetRechargeInfoReplyFields = Protocols.GetRechargeInfoReplyFields;
    import RechargeInfoFields = Protocols.RechargeInfoFields;
    import UpdateRechargeInfoFields = Protocols.UpdateRechargeInfoFields;

    export class RechargeModel {
        private static _instance: RechargeModel;
        public rechargeInfoReply: Protocols.GetRechargeInfoReply;
        public updateRecharge: Protocols.UpdateRechargeInfo;
        public type: number;
        private _rechargeTable: Table<number>;
        private _svipSaleBuyTable: Table<boolean>;
        private _svipSaleCanBuyStatusTable: Table<boolean>;
        public _ischouzhi: boolean
        public static get instance(): RechargeModel {
            return this._instance = this._instance || new RechargeModel();
        }

        constructor() {
            this._rechargeTable = {};
            this._ischouzhi = false;
        }


        public getRechargeInfoReply(tuple: Protocols.GetRechargeInfoReply): void {
            this.rechargeInfoReply = tuple;
            this.type = 0;

            let arr: Array<RechargeInfo> = tuple[GetRechargeInfoReplyFields.rechargeList];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let info: RechargeInfo = arr[i];
                this._rechargeTable[info[RechargeInfoFields.index]] = info[RechargeInfoFields.count];
                this._ischouzhi = true;
            }

            let svip_arr: Array<RechargeDayClear> = tuple[GetRechargeInfoReplyFields.rechargeDay];
            // svip秒杀的当日各档位充值状态
            this._svipSaleBuyTable = { 181: false, 182: false, 183: false, 184: false };
            for (let i = 0; i < svip_arr.length; i++) {
                let val = svip_arr[i][RechargeDayClearFields.count] == 1;
                let key = svip_arr[i][RechargeDayClearFields.index];

                this._svipSaleBuyTable[key] = val;
            }
            console.log("tuple:", tuple);
            console.log("this._svipSaleBuyTable:", this._svipSaleBuyTable);

            GlobalData.dispatcher.event(CommonEventType.UPDATE_RECHARGE_INFO);

        }

        /**
         * 获取svip秒杀当前档位今日购买状态
         * @param shfit 档位
         * @returns 
         */
        public getSVipSaleBuyStatus(shfit: number): boolean {
            return this._svipSaleBuyTable[shfit];
        }

        /**
         * 是否已经购买过其中一个档位
         * @returns 
         */
        public get alreadyBuyAnyoneShift(): boolean {
            let state: boolean = this._svipSaleBuyTable[181] || this._svipSaleBuyTable[182] || this._svipSaleBuyTable[183] || this._svipSaleBuyTable[184];

            return state;
        }

        /**
         * 获取是否能够满足购买当前档位的状态
         * @param shfit 档位
         * @returns 
         */
        public getSVipSaleCanBuyStatus(shfit: number): boolean {

            // svip秒杀购买条件没有固定的统一的条件,暂时写死 
            this._svipSaleCanBuyStatusTable = {
                181: modules.vip.VipModel.instance.vipLevel >= 4,
                182: modules.vip.VipModel.instance.vipLevel >= 6,
                183: modules.vip.VipModel.instance.vipLevel >= 8,
                184: modules.vip.VipModel.instance.vipLevel >= 8,
            }

            return this._svipSaleCanBuyStatusTable[shfit];
        }

        public updateRechargeInfo(tuple: Protocols.UpdateRechargeInfo): void {
            this.updateRecharge = tuple;
            this.type = 0;
            this._ischouzhi = true;
            this._rechargeTable[tuple[UpdateRechargeInfoFields.index]] = tuple[UpdateRechargeInfoFields.count];
            GlobalData.dispatcher.event(CommonEventType.UPDATE_RECHARGE_INFO);
        }

        // 根据充值档位获取充值次数
        public getRechargeCountByIndex(index: number): number {
            return this._rechargeTable[index];
        }

    }
}