/**单人boss单元项*/

///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.activity_all {
    import Event = laya.events.Event;
    import Point = Laya.Point;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import activity_allFields = Configuration.activity_allFields;
    import activity_all = Configuration.activity_all;
    import ActivityAllModel = modules.activity_all.ActivityAllModel;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BaseItem = modules.bag.BaseItem;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class ActivityAllItem extends ui.ActivityAllItemUI {
        private _startPos: Point;
        private _interval: number;
        private _imgWidth: number;
        private _spaceX: number;
        private _cfg: Array<any>;
        private _challengeCount: number;
        private _resurrectiontime: number;
        private _count: number;
        private _scale: number;
        private _challengeClip: CustomClip;
        private _items: Array<BaseItem>;
        private _instructionsID: number;
        private _actionOpenId: number;
        private _state: number;//当前活动状态
        private _isHaveDouble: number;//是否双倍活动
        private _date: activity_all;

        protected initialize(): void {
            super.initialize();
            this._startPos = new Point(151, 69);
            this._imgWidth = 100;
            this._spaceX = 20;
            this._interval = 103;
            this._cfg = new Array<any>();
            this._resurrectiontime = null;
            this._challengeCount = null;
            this._scale = 0.8;
            this._items = new Array<BaseItem>();
            this._items = [this.rewardBase1, this.rewardBase2, this.rewardBase3, this.rewardBase4];
            this._challengeClip = new CustomClip();
            this.challengeBtn.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-6, -16, true);
            this._challengeClip.scale(0.98, 1);
            this._challengeClip.skin = "assets/effect/btn_light.atlas";
            this._challengeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._challengeClip.durationFrame = 5;
        }

        protected addListeners(): void {
            super.addListeners();
            this.instructionsBtn.on(Event.CLICK, this, this.instructionsBtnHandler);
            this.challengeBtn.on(Event.CLICK, this, this.challengeBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.instructionsBtn.off(Event.CLICK, this, this.instructionsBtnHandler);
            this.challengeBtn.off(Event.CLICK, this, this.challengeBtnHandler);
        }

        public close(): void {
            super.close();
            this._challengeClip.stop();
        }

        public destroy(destroyChild: boolean = true): void {
            this._challengeClip = this.destroyElement(this._challengeClip);
            this._items = this.destroyElement(this._items);
            super.destroy(destroyChild);
        }

        public InitializeUI() {
            this.timeText.text = "";
            this.timeText1.text = "";
            this.instructionsText.text = "";
            this.instructionsText1.text = "";
            this.timeText3.text = "";
            this.timeText.visible = false;
            this.timeText1.visible = false;
            this.instructionsText.visible = false;
            this.instructionsText1.visible = false;
            this.timeText3.visible = false;
            for (var index = 0; index < this._items.length; index++) {
                var element = this._items[index];
                if (element) {
                    element.visible = false;
                }
            }
        }

        protected setData(activity_all: any): void {
            super.setData(activity_all);
            this.InitializeUI();
            this._date = activity_all;
            this._instructionsID = this._date[activity_allFields.instructionsID];
            this._actionOpenId = this._date[activity_allFields.actionOpenId];
            this._isHaveDouble = this._date[activity_allFields.isHaveDouble];
            let nameID: number = this._date[activity_allFields.nameID];
            let bgID: number = this._date[activity_allFields.bgID];
            let isHaveDouble: number = this._date[activity_allFields.isHaveDouble];
            let instructionsStr: string = this._date[activity_allFields.instructionsStr];
            let instructionsOtherStr: string = this._date[activity_allFields.instructionsOtherStr];
            if (instructionsOtherStr == "") {
                if (instructionsStr != "") {
                    let STR = instructionsStr.split("#");
                    this.instructionsText.text = STR[0];
                    this.timeText.text = STR[1];
                    this.instructionsText.visible = true;
                    this.timeText.visible = true;
                }
            } else {
                if (instructionsStr != "") {
                    let STR = instructionsStr.split("#");
                    this.instructionsText.text = STR[0];
                    this.timeText.text = STR[1];
                    this.instructionsText.visible = true;
                    this.timeText.visible = true;
                }
                if (instructionsOtherStr != "") {
                    let STR = instructionsOtherStr.split("#");
                    this.instructionsText1.text = STR[0];
                    this.timeText1.text = STR[1];
                    this.instructionsText1.visible = true;
                    this.timeText1.visible = true;
                }
            }
            // 合并背景和字
            // let strSkin = "assets/icon/ui/activity_all/" + bgID + ".png";
            // this.BGImg.skin = strSkin;
            this.nameImg.skin = "assets/icon/ui/activity_all/" + nameID + ".png";
            //显示奖励
            let reward: Array<Items> = this._date[activity_allFields.reward];
            if (reward) {
                for (let i: int = 0, len = reward.length; i < len; i++) {
                    let itemId: number = reward[i][ItemsFields.itemId];
                    let count: number = reward[i][ItemsFields.count];
                    let bagItem: BaseItem = this._items[i];
                    if (bagItem) {
                        bagItem.dataSource = [itemId, count, 0, null];
                        bagItem.visible = true;
                    }
                }
            }
            //读取开启条件
            this.OpenConditionText.text = FuncOpenModel.instance.getFuncOpenTipById(this._actionOpenId);
            this.updateTxtePos();
            this.UpdateUI();
        }

        /**
         * 根据状态 改变UI显示
         */
        public UpdateUI() {
            this._state = ActivityAllModel.instance.getState(this._data);
            this.challengeBtn.visible = (this._state == 2 || this._state == 3 || this._state == 4);
            this.overImg.visible = this._state == 0;
            this.OpenConditionText.visible = this._state == 1;

            this._actionOpenId = this._date[activity_allFields.actionOpenId];
            if (this._actionOpenId == ActionOpenId.xianFuEnter) {
                if (modules.xianfu.XianfuModel.instance.xianfuEventIsOpen()) {
                    this._challengeClip.play();
                    this._challengeClip.visible = true;
                    this.jXImg.visible = true;
                    this.sBImg.visible = false;
                } else {
                    this._challengeClip.stop();
                    this._challengeClip.visible = false;
                    this.jXImg.visible = false;
                    this.sBImg.visible = false;
                }
            } else {

                if (this._state == 4) {
                    this._challengeClip.play();
                    this._challengeClip.visible = true;
                    this.jXImg.visible = true;
                    this.sBImg.visible = false;
                } else {
                    this._challengeClip.stop();
                    this._challengeClip.visible = false;
                    this.jXImg.visible = false;
                    this.sBImg.visible = false;
                }
            }

        }

        //活动说明
        private instructionsBtnHandler(): void {
            if (this._instructionsID != undefined) {
                CommonUtil.alertHelp(this._instructionsID);
            }
        }

        //前往
        private challengeBtnHandler(): void {
            if (this._state == 0) {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(this._actionOpenId), true);
                return;
            }
            let gotoType = this._data[activity_allFields.gotoType];
            let gotoParams = this._data[activity_allFields.gotoParams];
            if (gotoType == 1) {
                WindowManager.instance.openByActionId(gotoParams);
            } else if (gotoType == 2) {
                // if (this._state == 4) {
                if (gotoParams == SCENE_ID.scene_homestead) {
                    if (scene.SceneUtil.isCommonScene) {
                        xianfu.XianfuModel.instance.panelType = 3;
                        DungeonCtrl.instance.reqEnterScene(2241, 3);
                    } else if (scene.SceneUtil.currScene == SceneTypeEx.homestead) {
                        SystemNoticeManager.instance.addNotice("您已在该场景中", true);
                    }
                } else {
                    DungeonCtrl.instance.reqEnterScene(gotoParams);
                }
                // }
                // else {
                //     SystemNoticeManager.instance.addNotice("活动未开始", true);
                // }
            }
        }

        /**
         * 适配所有说明文本位置
         */
        public updateTxtePos() {
            this.timeText.x = this.instructionsText.x + this.instructionsText.width;
            this.timeText1.x = this.instructionsText1.x + this.instructionsText1.width;
        }
    }
}
