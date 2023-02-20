///<reference path="../config/adventure_child_cfg.ts"/>


/** 猜拳弹框*/


namespace modules.adventure {
    import FingerGuessAlertUI = ui.FingerGuessAlertUI;
    import Button = Laya.Button;
    import AdventureEvent = Protocols.AdventureEvent;
    import AdventureEventFields = Protocols.AdventureEventFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import UpdateAdventureEvent = Protocols.UpdateAdventureEvent;
    import UpdateAdventureEventFields = Protocols.UpdateAdventureEventFields;
    import Items = Configuration.Items;
    import adventure_child = Configuration.adventure_child;
    import adventure_childFields = Configuration.adventure_childFields;
    import AdventureChildCfg = modules.config.AdventureChildCfg;
    import ItemsFields = Configuration.ItemsFields;
    import weightItem = Configuration.weightItem;
    import weightItemFields = Configuration.weightItemFields;
    import ScoreNoticeManager = modules.notice.ScoreNoticeManager;
    import ScoreNoticeType = ui.ScoreNoticeType;

    export class FingerGuessAlert extends FingerGuessAlertUI {
        private _event: AdventureEvent;
        private _result: number;
        private _count: int;
        private _fingerImgs: Array<string>;
        private _selectType: number;
        private _randomIndex: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;

            this.myHeadImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(PlayerModel.instance.selectHead + PlayerModel.instance.occ)}`;

            this._count = 0;
            this._fingerImgs = ["adventure/image_qy_qt.png", "adventure/image_qy_jd.png", "adventure/image_qy_b.png"];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.rockBtn, Laya.Event.CLICK, this, this.selectHandler, [this.rockBtn]);
            this.addAutoListener(this.scissorsBtn, Laya.Event.CLICK, this, this.selectHandler, [this.scissorsBtn]);
            this.addAutoListener(this.paperBtn, Laya.Event.CLICK, this, this.selectHandler, [this.paperBtn]);
            this.addAutoListener(this.resultBtn, Laya.Event.CLICK, this, this.resultHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_EVENT_UPDATE, this, this.updateEvent);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._event = value;
        }

        public onOpened(): void {
            super.onOpened();
            this.selectedImg.visible = false;
            this.equalImg.visible = false;
            this.myFingerImg.visible = this.otherFingerImg.visible = true;
            this.myFingerImg.skin = this.otherFingerImg.skin = this._fingerImgs[0];
            this.myResultImg.visible = this.otherResultImg.visible = false;
            this.rockBtn.mouseEnabled = this.scissorsBtn.mouseEnabled = this.paperBtn.mouseEnabled = true;
            this.selectBox.visible = true;
            this.resultTxt.visible = this.resultBtn.visible = false;

            if (this._event) {
                let cfg: adventure_child = AdventureChildCfg.instance.getCfgById(this._event[AdventureEventFields.child]);
                let awards: Array<Items> = cfg[adventure_childFields.tipsAward];
                let realAwards: Array<weightItem> = cfg[adventure_childFields.award];
                let awardIndices: Array<number> = this._event[AdventureEventFields.awardIndex];
                if (awardIndices && awardIndices.length > 0) {
                    this.item.dataSource = [realAwards[awardIndices[0]][weightItemFields.itemId], realAwards[awardIndices[0]][weightItemFields.count], 0, null];
                } else {
                    this.item.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
                }
            }
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            if (this._event && this._result === 0) {
                AdventureCtrl.instance.getAdventureAward(this._event[AdventureEventFields.key]);
            } else if (this._result === 1) {
                ScoreNoticeManager.instance.addNotice(ScoreNoticeType.adventurePoint, AdventureModel.instance.adventurePoint);
            }
            Laya.timer.clear(this, this.frameHandler);
        }

        private selectHandler(btn: Button): void {
            // this.selectedImg.pos(btn.x - 13, btn.y - 18, true);
            this.selectedImg.x = btn.x - 23.5;
            this.selectedImg.visible = true;
            AdventureCtrl.instance.challenge(this._event);
            this.rockBtn.mouseEnabled = this.scissorsBtn.mouseEnabled = this.paperBtn.mouseEnabled = false;
            this._selectType = btn === this.rockBtn ? 0 : btn === this.scissorsBtn ? 1 : 2;
        }

        private resultHandler(): void {
            this.close();
            // if(!this._event) return;
            // if(this._result === 0){         // 0胜利，1失败，2平
            //     AdventureCtrl.instance.getAdventureAward(this._event[AdventureEventFields.key]);
            // }else if(this._result === 1){
            //     this.close();
            // }
        }

        // 更新事件
        private updateEvent(value: UpdateAdventureEvent): void {
            // 0更新事件，1删除事件
            let event: AdventureEvent = value[UpdateAdventureEventFields.event];
            if (event[AdventureEventFields.key] === this._event[AdventureEventFields.key]) {       // 0猜拳
                this._result = value[UpdateAdventureEventFields.result];
                // 播放特效
                Laya.timer.frameLoop(4 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 0.5 : 1), this, this.frameHandler);
                this.myFingerImg.visible = this.otherFingerImg.visible = true;
                this._count = 0;
                this._randomIndex = Math.random() * 3 >> 0;
                this.frameHandler();
            }
        }

        private frameHandler(): void {
            let index: int = (this._randomIndex + this._count) % 3;
            this.myFingerImg.skin = this._fingerImgs[index];
            this.otherFingerImg.skin = this._fingerImgs[index + 1 === 3 ? 0 : index + 1];
            this._count++;
            if (this._count > 30) {
                Laya.timer.clear(this, this.frameHandler);
                // 显示结果
                this.myFingerImg.skin = this._fingerImgs[this._selectType];
                if (this._result === 0) {         // 0胜利，1失败，2平
                    this.otherFingerImg.skin = this._fingerImgs[this._selectType + 1] || this._fingerImgs[0];
                    this.myResultImg.skin = "adventure/image_qy_sl.png";
                    this.otherResultImg.skin = "adventure/image_qy_sb.png";
                    this.myResultImg.visible = this.otherResultImg.visible = true;
                    this.equalImg.visible = false;
                    this.selectBox.visible = false;
                    this.resultTxt.visible = this.resultBtn.visible = true;
                    this.resultBtn.label = "领取奖励";
                    this.resultTxt.text = "恭喜您获得胜利";
                    this.resultTxt.color = "#ffec7c";
                } else if (this._result === 1) {
                    this.otherFingerImg.skin = this._fingerImgs[this._selectType - 1] || this._fingerImgs[2];
                    this.myResultImg.skin = "adventure/image_qy_sb.png";
                    this.otherResultImg.skin = "adventure/image_qy_sl.png";
                    this.myResultImg.visible = this.otherResultImg.visible = true;
                    this.equalImg.visible = false;
                    this.selectBox.visible = false;
                    this.resultTxt.visible = this.resultBtn.visible = true;
                    this.resultBtn.label = "离开";
                    this.resultTxt.text = "很遗憾，您输了！";
                    this.resultTxt.color = "#eaf8ff";
                } else if (this._result === 2) {
                    this.otherFingerImg.skin = this._fingerImgs[this._selectType];
                    this.myResultImg.visible = this.otherResultImg.visible = false;
                    this.equalImg.visible = true;
                    // 平局可以重新选
                    this.rockBtn.mouseEnabled = this.scissorsBtn.mouseEnabled = this.paperBtn.mouseEnabled = true;
                    this.selectBox.visible = true;
                    this.resultTxt.visible = this.resultBtn.visible = false;
                } else {
                    throw new Error("不存在的事件状态:" + this._result);
                }
            }
        }
    }
}