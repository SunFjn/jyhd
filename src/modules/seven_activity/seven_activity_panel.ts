/** 七日活动主界面 */

namespace modules.seven_activity {
    import SevenActivityViewUI = ui.SevenActivityViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import CustomList = modules.common.CustomList;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import seven_activityItem = Configuration.seven_activityItem;
    import seven_activityItemFields = Configuration.seven_activityItemFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CustomClip = modules.common.CustomClip;

    export class SevenActivityPanel extends SevenActivityViewUI {
        private _list: CustomList;
        private _taskList: CustomList;
        private _bar: ProgressBarCtrl;
        private _items: Array<BagItem>
        private _geteds: Array<Laya.Image>
        private _showBGs: Array<Laya.Image>
        private _activityTime: number = 0;
        private _finalRewardBtnClip: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._bar = new ProgressBarCtrl(this.barImg, this.barImg.width);
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5];
            this._geteds = [this.geted1, this.geted2, this.geted3, this.geted4, this.geted5];
            this._showBGs = [this.showBG1, this.showBG2, this.showBG3, this.showBG4, this.showBG5];
            this.timeTxt.text = BlendCfg.instance.getCfgById(62002)[blendFields.stringParam][0];

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 152;
            this._list.height = 640;
            this._list.hCount = 1;
            this._list.spaceY = 0;
            this._list.selectedIndex = 0;
            this._list.itemRender = SevenActivityDayItem;
            this._list.x = 14;
            this._list.y = 476;
            this.addChild(this._list);

            this._taskList = new CustomList();
            this._taskList.scrollDir = 1;
            this._taskList.width = 540;
            this._taskList.height = 640;
            this._taskList.hCount = 1;
            this._taskList.vCount = 1;
            this._taskList.spaceY = 3;
            this._taskList.pos(160, 472);
            this._taskList.itemRender = SevenActivityTaskItem;
            this.addChild(this._taskList);

            // 大奖光效
            this.initializeClip1();
        }

        public initializeClip1() {
            this._finalRewardBtnClip = new CustomClip();
            this._finalRewardBtnClip.skin = "assets/effect/ok_state.atlas";
            this._finalRewardBtnClip.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._finalRewardBtnClip.durationFrame = 5;
            this._finalRewardBtnClip.loop = true;
            this.item5.addChild(this._finalRewardBtnClip);
            this._finalRewardBtnClip.zOrder = -1;
            this._finalRewardBtnClip.pos(-130, -130, true);
            this._finalRewardBtnClip.scale(1.4, 1.4, true);
        }

        protected addListeners(): void {
            super.addListeners();
            // this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);

            this.addAutoListener(this._list, Event.SELECT, this, this.selectTypeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEVEN_ACTIVITY_UPDATE, this, this.updateHandler);

            // this.addAutoRegisteRedPoint(this.achievementRPImg, ["XHMainAchievementRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this.isShowFirstPayBtnClip();
            SevenActivityCtrl.instance.getBaseData();
        }

        public isShowFirstPayBtnClip() {
            if (this._finalRewardBtnClip) {
                this._finalRewardBtnClip.visible = true;
                this._finalRewardBtnClip.play();
            }
        }

        // 左侧选择天
        protected selectTypeHandler(): void {
            if (this._list.selectedData[4]) {
                CommonUtil.noticeError(44110);
                return;
            }
            if (!this._list.selectedData) {
                this._list.selectedIndex = SevenActivityModel.instance.currentDay - 1;
                this._list.selectedData = SevenActivityModel.instance.currentDay - 1;
            }
            // 派发事件 通知选择的item
            GlobalData.dispatcher.event(CommonEventType.SEVEN_ACTIVITY_UPDATE_DAY_ITEM, this._list.selectedIndex);

            let day: number = this._list.selectedData[0];
            this._taskList.datas = SevenActivityModel.instance.getSelectDayTasks(day);
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.activityHandler);
            if (this._finalRewardBtnClip) {
                this._finalRewardBtnClip.visible = false;
                this._finalRewardBtnClip.stop();
            }
        }

        //帮助面板
        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(62003);
        }

        // 更新任务和天数数据
        private updateHandler(): void {
            this.setActivitiTime();
            this._list.datas = SevenActivityModel.instance.dayChooiceList;
            this._list.selectedIndex = SevenActivityModel.instance.currentDay - 1;
            this._taskList.datas = SevenActivityModel.instance.getDefaultDayTasks();

            // 任务总的进度
            let totalProcess = SevenActivityModel.instance.getTotolProcess();
            this._bar.maxValue = 571;
            this._bar.value = 571 * (totalProcess[0] as number) / 100;
            this.currentNum.text = totalProcess[0];

            // 设置顶部奖励
            let topItems: Array<seven_activityItem> = SevenActivityModel.instance.getBigAwardGetedList();
            for (let i: int = 0; i < topItems.length; i++) {
                let taskId: number = topItems[i][seven_activityItemFields.id];
                let id: number = topItems[i][seven_activityItemFields.items][0][ItemsFields.ItemId];
                let count: number = topItems[i][seven_activityItemFields.items][0][ItemsFields.count];
                let status: number = topItems[i][seven_activityItemFields.status];
                this._items[i].dataSource = [id, count, 0, null];
                this._items[i]._nameTxt.visible = false;//该界面的奖品去掉名字
                // 根据状态来设置点击事件和已领取按钮的点击 0未达成 1可领取 2已领取
                switch (status) {
                    case 0:
                        this._geteds[i].visible = false;
                        this._showBGs[i].skin = "seven_activity/normalBg.png"
                        this._items[i].needTip = true;
                        this._items[i].clickHandleEvent = null;
                        this._items[i].rpImg.visible = false;
                        break;
                    case 1:
                        this._geteds[i].visible = false;
                        this._showBGs[i].skin = "seven_activity/normalBg.png"
                        this._items[i].needTip = false;
                        this._items[i].rpImg.visible = true;
                        this._items[i].clickHandleEvent = () => {
                            // 领取请求
                            SevenActivityCtrl.instance.getAward([8, taskId]);
                        };
                        break;
                    case 2:
                        this._geteds[i].visible = true;
                        this._showBGs[i].skin = "seven_activity/common_b_03.png"
                        this._items[i].needTip = true;
                        this._items[i].rpImg.visible = false;
                        this._items[i].clickHandleEvent = null;
                        break;

                }
            }
            // this.reUpdateRedPoint();
        }

        reUpdateRedPoint() {
            let tempBoo = false;
            for (let i = 0; i < this._list.items.length; i++) {
                if (this._list.datas[i].imgrp) {
                    console.log("有红点");
                    tempBoo = true;
                }
            }
            RedPointCtrl.instance.setRPProperty("sevenActivityRP", tempBoo);
        }

        // 设置并开始展示倒计时
        private setActivitiTime(): void {
            // 拿到活动结束时间
            this._activityTime = SevenActivityModel.instance.endTime;

            if (this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.timeTxt.color = "#cc0000";
                this.timeTxt.text = "活动已经结束";
            }
        }

        private activityHandler(): void {
            if (this._activityTime == -1) {
                this.timeTxt.color = "#83ef74";
                this.timeTxt.text = "至活动结束";
            } else if (this._activityTime > GlobalData.serverTime) {
                this.timeTxt.color = "#83ef74";
                this.timeTxt.text = "活动倒计时:" + `${modules.common.CommonUtil.timeStampToDayHourMinSecond(this._activityTime)}`;
            } else {
                this.timeTxt.color = "#cc0000";
                this.timeTxt.text = "活动已经结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._taskList = this.destroyElement(this._taskList);
            if (this._finalRewardBtnClip) {
                this._finalRewardBtnClip.removeSelf();
                this._finalRewardBtnClip.destroy();
                this._finalRewardBtnClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}