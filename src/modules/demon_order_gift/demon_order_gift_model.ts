namespace modules.demonOrderGift {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import DemonOrderGiftState = Protocols.DemonOrderGiftState;
    import DemonOrderGiftStateFields = Protocols.DemonOrderGiftStateFields;

    export class DemonOrderGiftModel {
        private static _instance: DemonOrderGiftModel;
        public static get instance(): DemonOrderGiftModel {
            return this._instance = this._instance || new DemonOrderGiftModel();
        }

        public DemonOrderGiftInfoReply: Protocols.GetDemonOrderGiftInfoReply;
        public DemonOrderGiftRewardReply: Protocols.GetDemonOrderGiftRewardReply;
        public DemonOrderGiftExtraRewardReply: Protocols.GetDemonOrderGiftExtraRewardReply;
        private flag: number;
        private isgold: boolean = false;

        public getDemonOrderGiftInfoReply(tuple: Protocols.GetDemonOrderGiftInfoReply): void {
            this.DemonOrderGiftInfoReply = tuple;

            this.flag = tuple[Protocols.GetDemonOrderGiftInfoReplyFields.buy];
            this.isHavegold(tuple[Protocols.GetDemonOrderGiftInfoReplyFields.awardStates]);
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY);
        }

        public getDemonOrderGiftRewardReply(tuple: Protocols.GetDemonOrderGiftRewardReply): void {
            this.DemonOrderGiftRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY);
        }

        public getDemonOrderGiftExtraRewardReply(tuple: Protocols.GetDemonOrderGiftExtraRewardReply): void {
            this.DemonOrderGiftExtraRewardReply = tuple;
        }

        private isHavegold(isReward: Array<DemonOrderGiftState>): void {
            this.isgold = false;
            if (!isReward || isReward.length == 0) return;
            // console.log('isreward', isReward);

            let arrLength = 7;
            for (let i = 0; i < arrLength; i++) {
                const el = isReward[i];
                // console.log("el[DemonOrderGiftStateFields.state1", el[DemonOrderGiftStateFields.state1], el[DemonOrderGiftStateFields.state2]);

                if (el[DemonOrderGiftStateFields.state1] == 1) {
                    this.isgold = true;
                }
                if (el[DemonOrderGiftStateFields.state2] == 1 && this.flag == 1) {
                    this.isgold = true;
                }
            }

            RedPointCtrl.instance.setRPProperty("demonOrderGiftRP", this.isgold);
        }

        public get flagInfo() {
            return this.flag;
        }

        public get isRedPoint() {
            return this.isgold;
        }

        public get extraReward() {
            return this.DemonOrderGiftExtraRewardReply;
        }

        public deleteString(item: string, drop: string) {
            return item.split(drop).join("");
        }

        // item组去重复
        private distinctArrayByCustom(arrayList) {
            // 解构去掉引用关系，相当于复制了一份
            // arrayList = [arrayList];

            let tab = {};
            let arr = [];
            for (let index = 0; index < arrayList.length; index++) {
                const element = arrayList[index];
                const key = element[0];
                if (tab.hasOwnProperty(key)) {
                    tab[key][1] = tab[key][1] + element[1];
                } else {
                    tab[key] = element;
                }
            }

            for (const key in tab) {
                if (Object.prototype.hasOwnProperty.call(tab, key)) {
                    const element = tab[key];
                    arr.push(element);
                }
            }

            return arr;
        }

        //获取领取的等级奖励列表
        public getFilterAwardList(arr:any[]): any {
            return this.distinctArrayByCustom(arr);
        }
    }
}