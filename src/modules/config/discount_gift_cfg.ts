namespace modules.config {

    import Items = Configuration.Items;
    import discount_gift = Configuration.discount_gift;
    import discount_giftFields = Configuration.discount_giftFields;
    import Dictionary = Laya.Dictionary;

    /** 特惠礼包配置*/
    export class DiscountGiftCfg {
        private static _instance: DiscountGiftCfg;
        public static get instance(): DiscountGiftCfg {
            return this._instance = this._instance || new DiscountGiftCfg();
        }

        private _discountGift: Table<discount_gift[]>;
        private _typeDicDiscountGift: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {

            this._discountGift = {};
            this._typeDicDiscountGift = new Dictionary();

            //let cfgs: Array<discount_gift> = GlobalData.getConfig("discount_gift");
            let cfgs = GlobalData.getConfig("discount_gift");
            // console.log("-------------------cfgs: "+cfgs);
            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let cfg = cfgs[i];
                let type = cfg[discount_giftFields.type];
                if (this._discountGift[type] == null) {
                    this._discountGift[type] = [cfg];
                } else {
                    this._discountGift[type].push(cfg);
                }

                this._typeDicDiscountGift.set(type, this._discountGift[type]);
            }
            //  console.log("--------------------: "+this._typeDicDiscountGift);
        }

        /**获取礼包名称，根据从服务器得到活动类型来取*/
        public getName(date: int): string {
            if (date == 0) {
                // console.log("特惠礼包活动未开启");
                return "";
            }
            let type = this._typeDicDiscountGift.get(date);
            //console.log("--------------------type: "+type.get);
            let ty = type[0][discount_giftFields.name];
            return ty;
        }

        /** * 获取活动持续时间 */
        public getLastTime(date: int): number {
            let type = this._typeDicDiscountGift.get(date);
            return type[0][discount_giftFields.endTm];
        }

        public empty() {

        }

        /**获取礼包道具内容,根据唯一ID*/
        public getGifts(type: int, ID: int): Array<Items> {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            // console.log("获取礼包内容 : ");
            let giftArray: Array<Items> = new Array<Items>();
            /*            for(let i:number=0,len=data.length;i<len;i++){             
                giftArray.push(data[i]);         
            }*/
            for (let da of data) {
                //console.log(da); 
                if (da[discount_giftFields.id] == ID) {
                    for (let daa of da[discount_giftFields.items]) {
                        giftArray.push(daa);
                    }
                }
            }
            return giftArray;
        }

        /**获取道具折扣区间对应的购买数*/
        public getZhekouQujian(type: int): Array<number> {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            // console.log("道具折扣区间内容 : ");
            let zhekouArray: Array<number> = new Array<number>();

            for (let da of data) {
                //console.log(da); 
                zhekouArray.push(da[discount_giftFields.section][1]);
            }
            return zhekouArray;
        }

        /**获取自己折扣对应的最大购买数*/
        public getThisMaxBuyNum(type: int, id: int): number {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            //console.log("道具折扣区间内容 : ");
            for (let da of data) {
                let t = da[discount_giftFields.id];
                if (t == id) {
                    return da[discount_giftFields.section][1];
                }

            }
        }

        /**获取自己折扣index 0 1 2*/
        public getIndexBuyNum(type: int, id: int): int {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);

            for (let index: int = 0; index < data.length; index++) {
                let t = data[index][discount_giftFields.id];
                if (t == id) {
                    return index;
                }

            }
        }

        /**获取自己折扣对应的最小购买数*/
        public getThisMinBuyNum(type: int, id: int): number {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            //console.log("道具折扣区间内容 : ");
            for (let da of data) {
                let t = da[discount_giftFields.id];
                if (t == id) {
                    return da[discount_giftFields.section][0];
                }

            }
        }

        /**获取类型折扣对应的最大购买数*/
        public getTypeMaxBuyNum(type: int): number {

            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            // console.log("道具折扣区间内容 : ");
            return data[data.length - 1][discount_giftFields.section][1];


        }

        /**获取Next折扣最大购买次数*/
        public getNextMaxCanBuy(type: int, id: int): number {
            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return
            }
            let data = this._typeDicDiscountGift.get(type);
            // console.log("道具折扣区间内容 : ");
            let backNum = -1;
            for (let da of data) {
                let t = da[discount_giftFields.id];
                if (t == id + 1) {
                    backNum = da[discount_giftFields.section][1];
                    return backNum;
                }
            }

        }

        /**获取道具折扣数*/
        public getZhekou(type: int): Array<number> {
            if (this._typeDicDiscountGift.indexOf(type) < 0) {
                // console.log('不包含这个key');
                return;
            }
            let data = this._typeDicDiscountGift.get(type);
            // console.log("道具折扣折扣数 : ");
            let zhekouArray: Array<number> = new Array<number>();

            for (let da of data) {
                //console.log(da); 
                zhekouArray.push(da[discount_giftFields.onsale]);
            }
            return zhekouArray;
        }

        /**获取当前原价跟实价跟当前折扣*/
        public getOriAndRealPrice(type: int, id: int): Array<number> {
            // console.log('vtz:type',type);
            // console.log('vtz:this._typeDicDiscountGift',this._typeDicDiscountGift);
            let data = this._typeDicDiscountGift.get(type);
            // console.log("获取当前原价跟实价 : ");
            let OriAndReal: Array<number> = new Array<number>();
            // if (data) {
                for (let da of data) {
                    let t = da[discount_giftFields.id];
                    if (t == id) {
                        OriAndReal.push(da[discount_giftFields.originalPrice]);
                        OriAndReal.push(da[discount_giftFields.realPrice]);
                        OriAndReal.push(da[discount_giftFields.onsale]);
                    }
                }
            // }
            return OriAndReal;
        }

        /**获取Next折扣原价跟实价跟当前折扣*/
        public getNextOriAndRealPrice(type: int, id: int): Array<number> {
            let data = this._typeDicDiscountGift.get(type);
            // console.log("获取当前原价跟实价 : ");
            let OriAndReal: Array<number> = new Array<number>();
            for (let da of data) {
                let t = da[discount_giftFields.id];
                if (t == id + 1) {
                    OriAndReal.push(da[discount_giftFields.originalPrice]);
                    OriAndReal.push(da[discount_giftFields.realPrice]);
                    OriAndReal.push(da[discount_giftFields.onsale]);
                }
            }
            return OriAndReal;
        }


        /**获取Next折扣*/
        public getNextZhekou(type: int, id: int): number {
            let data = this._typeDicDiscountGift.get(type);
            // console.log("获取当前原价跟实价 : ");
            for (let da of data) {
                let t = da[discount_giftFields.id];
                if (t == id + 1) {
                    return da[discount_giftFields.onsale]
                } else {
                    return null;
                }
            }

        }

        private mfun() {

        }

    }
}