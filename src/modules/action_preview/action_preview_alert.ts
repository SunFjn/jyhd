/*活动列表*/
///<reference path="../config/action_preview_cfg.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../action_preview/action_preview_model.ts"/>
namespace modules.action_preview {
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    import AcitonPreviewCfg = modules.config.AcitonPreviewCfg;
    import action_previewFields = Configuration.action_previewFields;
    import actionPreviewModel = modules.action_preview.actionPreviewModel;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;

    export class ActionPreviewAlert extends ui.ActionPreviewAlertUI {
        private _list: CustomList;
        private _awardItems: Array<BaseItem>;
        private _challengeClip: CustomClip;
        private _nowIndex: number = 0;

        constructor() {
            super()
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 556;
            this._list.height = 542;
            this._list.hCount = 3;
            this._list.spaceX = 14;
            this._list.spaceY = 5;
            this._list.itemRender = ActionPreviewItem;
            this._list.x = 53;
            this._list.y = 67;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);
            this._awardItems = new Array<BaseItem>();
            this._awardItems = [this.rewrdBase1, this.rewrdBase2, this.rewrdBase3, this.rewrdBase4, this.rewrdBase5];

            this._challengeClip = new CustomClip();
            this.receiveBtn.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-5, -18, true);
            this._challengeClip.scale(1.08, 1.1);
            this._challengeClip.skin = "assets/effect/btn_light.atlas";
            this._challengeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._challengeClip.durationFrame = 5;
            actionPreviewModel.instance._selectedActionIndex = 0;//每次重置选中 下标
        }

        public onOpened(): void {
            super.onOpened();
            this.updateList();
            if (!this.getIsKeLingQuIndex()) {
                this._list.selectedIndex = 0;
                actionPreviewModel.instance._selectedActionIndex = 0;
                this._list.scrollToIndex(actionPreviewModel.instance._selectedActionIndex);
            }
        }

        public getIsKeLingQuIndex(): boolean {
            let id = actionPreviewModel.instance.getIsKeLingQuIndex();
            if (id != 0) {
                for (let index = 0; index < this._list.datas.length; index++) {
                    let element = this._list.datas[index];
                    if (element) {
                        if (element[action_previewFields.id] == id) {
                            this._list.selectedIndex = index;
                            actionPreviewModel.instance._selectedActionIndex = index;
                            this._list.scrollToIndex(actionPreviewModel.instance._selectedActionIndex);
                            return true;
                        }
                    }
                }
            }
            return false;

        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._challengeClip = this.destroyElement(this._challengeClip);
            this._awardItems = this.destroyElement(this._awardItems);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_UPDATE, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_AWARD_UPDATE, this, this.updateAward);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_UPDATE, this, this.scrollToIndex);
            this.addAutoListener(this.receiveBtn, LayaEvent.CLICK, this, this.receiveBtnHandler);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectHandler);
        }

        private selectHandler(): void {
            if (this._list.selectedIndex == -1) {
                return;
            }
        }

        public receiveBtnHandler() {
            actionPreviewCtrl.instance.getActionPreviesAward(actionPreviewModel.instance.selectedActionID);
        }

        private updateList(): void {
            this._list.datas = actionPreviewModel.instance.activityAllDate;
            this.updateAward();
        }

        private updateAward(): void {
            let _date = AcitonPreviewCfg.instance.getCfgById(actionPreviewModel.instance.selectedActionID);
            if (_date) {
                let actionID = _date[action_previewFields.id];
                let enterIcon = _date[action_previewFields.enterIcon];
                let icon = _date[action_previewFields.icon];
                let previewIcon = _date[action_previewFields.previewIcon];
                let award = _date[action_previewFields.award];
                let tips1 = _date[action_previewFields.tips1];
                this.actionImg.skin = `assets/icon/ui/get_way/${icon}.png`;
                let shuju = ActionOpenCfg.instance.getCfgById(actionID);
                this.actionText.text = shuju[action_openFields.name];
                this.actionInstructionsImg.skin = `assets/icon/ui/action_preview/${previewIcon}.png`;
                this.actionText2.text = tips1;
                let stateNum = actionPreviewModel.instance.getState(_date);
                this.actionText2.visible = stateNum == 1;
                this.receiveBtn.visible = stateNum == 2;
                // this.actionImg.gray = stateNum == 1;
                this.receiveTrueImg.visible = stateNum == 0;
                // this.actionBgImg.gray = stateNum == 1;
                if (stateNum == 2) {
                    this._challengeClip.play();
                    this._challengeClip.visible = true;
                } else {
                    this._challengeClip.stop();
                    this._challengeClip.visible = false;
                }
                this.showAward(award);
                // console.log("设置 奖励信息");
            }
        }

        /**
         * 确定上次选中的位置
         */
        public scrollToIndex() {
            if (!this.getIsKeLingQuIndex()) {
                if (actionPreviewModel.instance.selectedActionID) {
                    for (let index = 0; index < this._list.datas.length; index++) {
                        let element = this._list.datas[index];
                        if (element) {
                            if (element[action_previewFields.id] == actionPreviewModel.instance.selectedActionID) {
                                this._list.selectedIndex = index;
                                actionPreviewModel.instance._selectedActionIndex = index;
                                this._list.scrollToIndex(actionPreviewModel.instance._selectedActionIndex);
                                return;
                            }
                        }
                    }
                }
            }
        }

        public showAward(award: any) {
            if (award) {
                for (let index = 0; index < this._awardItems.length; index++) {
                    let element = this._awardItems[index];
                    element.visible = false;
                }
                let allAward = new Array<BaseItem>();
                for (let i: int = 0, len = award.length; i < len; i++) {
                    let itemId: number = award[i][ItemsFields.itemId];
                    let count: number = award[i][ItemsFields.count];
                    let bagItem = this._awardItems[i];
                    if (bagItem) {
                        bagItem.dataSource = [itemId, count, 0, null];
                        bagItem.visible = true;
                        allAward.push(bagItem);
                    }
                }
                let lengNum = allAward.length * 80 + (allAward.length - 1) * 10;
                let startPosX = (this.width - lengNum) / 2;
                for (let index = 0; index < allAward.length; index++) {
                    let element = allAward[index];
                    element.x = startPosX;
                    startPosX += (element.width * 0.8) + 10;
                }
            }
        }
    }
}