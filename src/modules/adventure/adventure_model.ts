///<reference path="../notice/score_notice_manager.ts"/>


/** 奇遇*/


namespace modules.adventure {
    import AdventureEvent = Protocols.AdventureEvent;
    import UpdateAdventureEvent = Protocols.UpdateAdventureEvent;
    import UpdateAdventureEventFields = Protocols.UpdateAdventureEventFields;
    import AdventureEventFields = Protocols.AdventureEventFields;
    import Item = Protocols.Item;
    import ScoreNoticeManager = modules.notice.ScoreNoticeManager;
    import ScoreNoticeType = ui.ScoreNoticeType;
    import Sprite = Laya.Sprite;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import adventure_exchange = Configuration.adventure_exchange;
    import adventure_exchangeFields = Configuration.adventure_exchangeFields;
    import ItemFields = Protocols.ItemFields;

    export class AdventureModel {
        private static _instance: AdventureModel;
        public static get instance(): AdventureModel {
            return this._instance = this._instance || new AdventureModel();
        }

        // 正在进行中的事件列表
        private _eventList: Array<AdventureEvent>;
        // 下一次事件触发时间戳
        private _nextTriggerTime: number;
        // 探险次数
        private _yunLi: number;
        // 奇遇点
        private _point: number = -1;
        // 兑换提醒列表
        private _hintList: Array<number>;

        // 奇遇探索副本中下方掉落道具统计
        private _dropItems: Array<Item>;
        // 奇遇探索副本掉落道具统计更新
        private _dropItemsUpdated: boolean;

        // 是否有新的奇遇事件
        private _hasNewEvent: boolean = false;

        // 奇遇提示飞入的目标
        public flyTarget: Sprite;

        //猜拳领取标记
        private _flag: boolean;
        public adventurePoint: int;

        constructor() {
            this._dropItems = [];
            this._flag = false;
        }

        // 正在进行中的事件列表
        public get eventList(): Array<AdventureEvent> {
            return this._eventList;
        }

        public set eventList(value: Array<AdventureEvent>) {
            if (this._eventList) {
                if (value.length > this._eventList.length) {        // 新加奇遇事件
                    this.hasNewEvent = true;
                    AdventureNoticeManager.instance.addNotice();
                }
            }
            this._eventList = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_EVENT_LIST_UPDATE);
            this.checkRP();
        }

        // 是否有新的奇遇事件
        public get hasNewEvent(): boolean {
            return this._hasNewEvent;
        }

        public set hasNewEvent(value: boolean) {
            if (value === this._hasNewEvent) return;
            this._hasNewEvent = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_HAS_NEW_EVENT_UPDATE);
        }

        // 下一次事件触时间戳
        public get nextTriggerTime(): number {
            return this._nextTriggerTime;
        }

        public set nextTriggerTime(value: number) {
            this._nextTriggerTime = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_NEXT_TRIGGER_TIME_UPDATE);
        }

        // 运力
        public get yunLi(): number {
            return this._yunLi;
        }

        public set yunLi(value: number) {
            this._yunLi = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_YUNLI_UPDATE);
            this.checkRP();
        }

        // 奇遇
        public get point(): number {
            return this._point;
        }

        public set point(value: number) {
            if (value > this._point && this._point !== -1) {
                let point: int = value - this._point;
                if (this._flag) { //不播
                    this.adventurePoint = point;
                } else {
                    ScoreNoticeManager.instance.addNotice(ScoreNoticeType.adventurePoint, point);
                }
            }
            this._flag = false;
            this._point = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_POINT_UPDATE);
            this.checkShopRP();
        }

        // 兑换提醒列表
        public get hintList(): Array<number> {
            return this._hintList;
        }

        public set hintList(value: Array<number>) {
            this._hintList = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_HINT_LIST_UPDATE);
            this.checkShopRP();
        }

        // 更新单个奇遇事件
        public updateAdventureEvent(value: UpdateAdventureEvent): void {
            if (!this._eventList) return;
            for (let i: int = 0, len: int = this._eventList.length; i < len; i++) {
                if (this._eventList[i][AdventureEventFields.key] === value[UpdateAdventureEventFields.event][AdventureEventFields.key]) {
                    // 0更新 1删除
                    if (value[UpdateAdventureEventFields.operation] === 1) {
                        this._eventList.splice(i, 1);
                        GlobalData.dispatcher.event(CommonEventType.ADVENTURE_EVENT_LIST_UPDATE);
                        if (value[UpdateAdventureEventFields.result] == 1) {
                            this._flag = true;
                        }
                    } else if (value[UpdateAdventureEventFields.operation] === 0) {
                        this._eventList[i] = value[UpdateAdventureEventFields.event];
                        if (value[UpdateAdventureEventFields.result] == 1) {
                            this._flag = true;
                        }
                    }
                    GlobalData.dispatcher.event(CommonEventType.ADVENTURE_EVENT_UPDATE, [value]);
                    break;
                }
            }
            this.checkRP();
        }

        // 奇遇探索副本中下方掉落道具统计数组
        public get dropItems(): Array<Item> {
            return this._dropItems;
        }

        // 添加掉落
        public addDropItem(value: Item): void {
            let itemId: number = value[ItemFields.ItemId];
            let maxCount: number = modules.common.CommonUtil.getOverlapByItemId(itemId);
            let count: number = value[ItemFields.count];
            for (let i: int = 0, len: int = this._dropItems.length; i < len; i++) {
                let item: Item = this._dropItems[i];
                if (item[ItemFields.ItemId] === itemId) {
                    let rest: number = maxCount - item[ItemFields.count];
                    if (rest >= count) {     // 格子够
                        item[ItemFields.count] += count;
                        count = 0;
                        break;
                    } else {      // 不够找下一个合并
                        item[ItemFields.count] = maxCount;
                        count -= rest;
                    }
                }
            }
            if (count > 0) {
                value[ItemFields.count] = count;
                this._dropItems.push(value);
            }
        }

        // 奇遇探索副本中掉落道具统计更新
        public set dropItemsUpdated(value: boolean) {
            this._dropItemsUpdated = value;
            GlobalData.dispatcher.event(CommonEventType.ADVENTURE_DROP_ITEMS_UPDATE);
        }

        // 检测奇遇红点
        private checkRP(): void {
            if (this.yunLi > 0 && this._eventList && this._eventList.length > 0) {
                RedPointCtrl.instance.setRPProperty("adventureRP", true);
            } else {
                RedPointCtrl.instance.setRPProperty("adventureRP", false);
            }
        }

        // 检测奇遇兑换红点
        private checkShopRP(): void {
            let flag: boolean = false;
            let cfgs: Array<adventure_exchange> = AdventureExchangeCfg.instance.cfgs;
            if (this._hintList && cfgs && cfgs.length > 0) {
                for (let i: int = 0, len: int = this._hintList.length; i < len; i++) {
                    for (let j: int = 0, len1: int = cfgs.length; j < len1; j++) {
                        if (this._hintList[i] === cfgs[j][adventure_exchangeFields.id]) {
                            if (this._point >= cfgs[j][adventure_exchangeFields.condition][1]) {
                                flag = true;
                                break;
                            }
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("adventureShopRP", flag);
        }
    }
}