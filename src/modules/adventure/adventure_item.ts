///<reference path="../config/adventure_child_cfg.ts"/>
///<reference path="../config/adventure_task_cfg.ts"/>


/** 奇遇单元项*/


namespace modules.adventure {
    import AdventureItemUI = ui.AdventureItemUI;
    import AdventureEventFields = Protocols.AdventureEventFields;
    import AdventureEvent = Protocols.AdventureEvent;
    import adventure_child = Configuration.adventure_child;
    import AdventureChildCfg = modules.config.AdventureChildCfg;
    import adventure_childFields = Configuration.adventure_childFields;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import adventure_task = Configuration.adventure_task;
    import AdventureTaskCfg = modules.config.AdventureTaskCfg;
    import adventure_taskFields = Configuration.adventure_taskFields;
    import TaskNodeFields = Configuration.TaskNodeFields;
    import UpdateAdventureEvent = Protocols.UpdateAdventureEvent;
    import UpdateAdventureEventFields = Protocols.UpdateAdventureEventFields;
    import weightItem = Configuration.weightItem;
    import weightItemFields = Configuration.weightItemFields;
    import WindowInfo = ui.WindowInfo;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import WindowInfoFields = ui.WindowInfoFields;
    import PanelType = ui.PanelType;

    export class AdventureItem extends AdventureItemUI {
        private _items: Array<BaseItem>;
        private _numStrs: Array<string>;

        protected initialize(): void {
            super.initialize();

            this._items = [this.item1, this.item2, this.item3, this.item4];
            this.taskDescTxt.color = "#50ff28";
            this.taskDescTxt.style.wordWrap = true;
            this.taskDescTxt.style.fontFamily = "SimHei";
            this.taskDescTxt.style.fontSize = 22;

            this._numStrs = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.btnClickHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_EVENT_UPDATE, this, this.updateEvent);

            this.regGuideSpr(GuideSpriteId.ADVENTURE_ITEM0_GOTO_BTN, this.btn);
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            this._items = this.destroyElement(this._items);
            super.destroy(destroyChild);
        }

        private btnClickHandler(): void {
            let e: AdventureEvent = this._data;
            let key: number = e[AdventureEventFields.key];
            let type: number = e[AdventureEventFields.id];
            if (type === 0) {           //0好赌  1仙女  2PK  3BOSS  4洞府  5袋子
                WindowManager.instance.open(WindowEnum.FINGER_GUESS_ALERT, e);
            } else if (type === 1) {
                if (e[AdventureEventFields.state] === 1) {        // 0不可领奖，1可领奖
                    AdventureCtrl.instance.getAdventureAward(key);
                } else {
                    let taskId: number = e[AdventureEventFields.taskId];
                    if (taskId === 0) {      // 接受考验
                        AdventureCtrl.instance.challenge(e);
                    } else {      // 前往
                        let actionId: ActionOpenId = AdventureTaskCfg.instance.getCfgById(taskId)[adventure_taskFields.skipActionId];
                        if (actionId === 0) return;
                        let windowInfo: WindowInfo = GlobalData.getWindowConfigByFuncId(actionId);
                        console.log("1")
                        if (!windowInfo) SystemNoticeManager.instance.addNotice("找不到功能id:" + actionId + "对应的面板信息", true);

                        else {
                            let windowId = windowInfo[WindowInfoFields.panelId];
                            WindowManager.instance.open(windowId);
                        }
                    }
                }
            } else if (type === 2) {
                AdventureCtrl.instance.challenge(e);
            } else if (type === 3) {
                AdventureCtrl.instance.challenge(e);
            } else if (type === 4) {
                AdventureCtrl.instance.challenge(e);
            } else if (type === 5) {
                if (e[AdventureEventFields.param] === 0) {
                    AdventureCtrl.instance.challenge(e);
                }

                // 临时代码，倒计时结束不管领奖状态直接领
                else if(e[AdventureEventFields.param] < GlobalData.serverTime){
                    AdventureCtrl.instance.getAdventureAward(key);
                }

                // 临时注释，服务器数据有问题，这里直接用倒计时判断先
                // if (e[AdventureEventFields.state] === 1) {
                //     AdventureCtrl.instance.getAdventureAward(key);
                // }
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            let e: AdventureEvent = value;
            let cfg: adventure_child = AdventureChildCfg.instance.getCfgById(e[AdventureEventFields.child]);
            this.bgImg.skin = `assets/icon/ui/adventure/${cfg[adventure_childFields.baseId]}.png`;
            this.titleImg.skin = `assets/icon/ui/adventure/${cfg[adventure_childFields.icon]}.png`;

            let len: int = 0;
            let awardIndices: Array<number> = e[AdventureEventFields.awardIndex];
            let type: number = e[AdventureEventFields.id];
            if (type === 0) awardIndices = null;     // 猜拳特殊处理，外面显示tipsaward
            if (awardIndices && awardIndices.length > 0) {
                let realAwards: Array<weightItem> = cfg[adventure_childFields.award];
                len = awardIndices.length;
                let w: number = len > 0 ? len * 72 : 0;
                for (let i: int = 0; i < len; i++) {
                    let index: int = awardIndices[i];
                    this._items[i].dataSource = [realAwards[index][weightItemFields.itemId], realAwards[index][weightItemFields.count], 0, null];
                    this._items[i].visible = true;
                    this._items[i].x = 15 + (284 - w) * 0.5 + i * 72;
                }
            } else {
                let awards: Array<Items> = cfg[adventure_childFields.tipsAward];
                len = awards.length;
                let w: number = len > 0 ? len * 72 : 0;
                for (let i: int = 0; i < len; i++) {
                    this._items[i].dataSource = [awards[i][ItemsFields.itemId], awards[i][ItemsFields.count], 0, null];
                    this._items[i].visible = true;
                    this._items[i].x = 15 + (284 - w) * 0.5 + i * 72;
                }
            }

            for (let i: int = len, len1 = this._items.length; i < len1; i++) {
                this._items[i].visible = false;
            }

            this.resetVisible();
            if (type === 0) {           //0好赌  1仙女  2PK  3BOSS  4洞府  5袋子
                this.btn.label = "小赌怡情";
                this.btn.visible = true;
            } else if (type === 1) {
                this.btn.visible = true;
                if (e[AdventureEventFields.state] === 1) {        // 0不可领奖，1可领奖
                    this.btn.label = "领取奖励";
                } else {
                    this.btn.label = e[AdventureEventFields.taskId] === 0 ? "接受考验" : "前往";
                }
                let taskId: number = e[AdventureEventFields.taskId];
                if (taskId !== 0) {
                    this.taskBg1.visible = this.taskDescTxt.visible = true;
                    let taskCfg: adventure_task = AdventureTaskCfg.instance.getCfgById(taskId);
                    let str: string = taskCfg[adventure_taskFields.describe];
                    let needCount: number = taskCfg[adventure_taskFields.nodes][0][TaskNodeFields.param][0];
                    let count: number = e[AdventureEventFields.param];       // 当前任务进度
                    let index: number = e[AdventureEventFields.taskCount];       // 当前考验索引
                    this.taskDescTxt.innerHTML = `考验${this._numStrs[index]}：${str}<span style="color:${count < needCount ? "#FF3E3D" : "#50ff28"}">(${count}/${needCount})</span>`;
                }
            } else if (type === 2) {
                this.bg1.visible = this.revengeTxt.visible = e[AdventureEventFields.param] > 0;
                this.revengeTxt.text = `${e[AdventureEventFields.param]}倍复仇`;
                this.btn.label = "前往应战";
                this.btn.visible = true;
            } else if (type === 3) {
                this.bg1.visible = this.revengeTxt.visible = e[AdventureEventFields.param] > 0;
                this.revengeTxt.text = `${e[AdventureEventFields.param]}倍复仇`;
                this.btn.label = "前往击杀";
                this.btn.visible = true;
            } else if (type === 4) {
                this.btn.label = "探索一番";
                this.btn.visible = true;
            } else if (type === 5) {
                let t: number = e[AdventureEventFields.param];
                if (t === 0) {
                    this.btn.label = "解除封印";
                    this.btn.visible = true;
                } else if (t < GlobalData.serverTime) {
                    this.btn.visible = true;
                    this.btn.label = "领取奖励";
                } else {      // CD中
                    this.btn.visible = false;
                    this.cdBg1.visible = this.cdDescTxt.visible = this.cdTxt.visible = true;
                    Laya.timer.loop(1000, this, this.loopHandler);
                    this.loopHandler();
                }
            }
        }

        private loopHandler(): void {
            let restTime: number = this._data[AdventureEventFields.param] - GlobalData.serverTime;
            if (restTime >= 0) {
                this.cdTxt.text = CommonUtil.msToMMSS(restTime);
            } else {
                Laya.timer.clear(this, this.loopHandler);
                this.btn.visible = true;
                this.btn.label = "领取奖励";
                this.cdBg1.visible = this.cdDescTxt.visible = this.cdTxt.visible = false;
            }
        }

        // 重设显示
        private resetVisible(): void {
            this.bg1.visible = this.revengeTxt.visible = false;
            this.btn.visible = false;
            this.taskBg1.visible = this.taskDescTxt.visible = false;
            this.cdBg1.visible = this.cdDescTxt.visible = this.cdTxt.visible = false;
        }

        // 更新事件
        private updateEvent(value: UpdateAdventureEvent): void {
            // 0更新事件，1删除事件
            if (!this._data || value[UpdateAdventureEventFields.operation] === 1) return;
            let event: AdventureEvent = value[UpdateAdventureEventFields.event];
            if (this._data[AdventureEventFields.key] === event[AdventureEventFields.key]) {
                this.data = event;
            }
        }
    }
}