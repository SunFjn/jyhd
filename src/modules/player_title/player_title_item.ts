/**单人boss单元项*/
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/designation_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.player_title {
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    import designationProtocols = Protocols.Designation;
    import designationFieldsProtocols = Protocols.DesignationFields;

    export class PlayerTitleItem extends ui.PlayerTitleItemUI {
        private isOpen: boolean = false;
        private _nameTextArry: Array<Laya.Text>;
        private _valueTextArry: Array<Laya.Text>;
        private _hight: number;
        private _challengeClip: CustomClip;
        private _designationDate: designation;//表数据
        private _designationProtocolsDate: designationProtocols;//服务器数据
        constructor() {
            super();
            this._hight = this.height;
        }

        protected initialize(): void {
            super.initialize();
            this._nameTextArry = [
                this.nameText1, this.valueText1,
                this.nameText2, this.valueText2,
                this.nameText3, this.valueText3,
                this.nameText4, this.valueText4,
                this.nameText5, this.valueText5,
                this.nameText6, this.valueText6,
                this.nameText7, this.valueText7,
                this.nameText8, this.valueText8
            ];
            // this._nameTextArry = [this.valueText1, this.valueText2, this.valueText3, this.valueText4, this.valueText5, this.valueText6];
            this._challengeClip = new CustomClip();
            this.AllBtn.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-6, -8, true);
            this._challengeClip.scale(1, 1);
            this._challengeClip.skin = "assets/effect/btn_light.atlas";
            this._challengeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._challengeClip.durationFrame = 5;
            this._challengeClip.loop = true;
            this._challengeClip.visible = false;

        }

        protected addListeners(): void {
            super.addListeners();
            this.OpenBtn.on(Event.CLICK, this, this.OpenBtnHandler);
            this.AllBtn.on(Event.CLICK, this, this.AllBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_UPDATE, this, this.UpdateUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.OpenBtn.off(Event.CLICK, this, this.OpenBtnHandler);
            this.AllBtn.off(Event.CLICK, this, this.AllBtnHandler);
            Laya.timer.clear(this, this.loopHandler);
        }

        protected onOpened(): void {
            super.onOpened();

        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._challengeClip) {
                this._challengeClip.removeSelf();
                this._challengeClip.destroy();
                this._challengeClip = null;
            }
            super.destroy(destroyChild);
        }

        public InitializeUI() {
        }

        protected setData(activity_all: designation): void {
            super.setData(activity_all);
            this.isOpen = false;
            this.OpenBtn.skin = "common/btn_common_arrow_sjt4.png";
            this.height = this._hight;
            this.bonusesBox.visible = false;
            // this.isJHImg.height = this.height;
            if (!activity_all) {
                return;
            }
            this._designationDate = activity_all;
            this.UpdateUI();
        }
        private OpenBtnHandlerClose() {
            this.isOpen = false;
            this.OpenBtn.skin = "common/btn_common_arrow_sjt4.png";
            this.height = this._hight;
            this.bonusesBox.visible = false;
            PlayerTitleModel.instance.setItemAttrOpenNode(this._designationDate[designationFields.type], undefined);
        }

        public OpenBtnHandler(): void {
            let attrTips = this._designationDate[designationFields.attrTips];
            if (!attrTips) {
                if (attrTips.length == 0) {
                    SystemNoticeManager.instance.addNotice("无属性加成或配置出错", true);
                    return
                }
            }
            if (this.isOpen) {
                this.OpenBtnHandlerClose();
            } else {
                if (PlayerTitleModel.instance.getItemAttrOpenNode(this._designationDate[designationFields.type]) != undefined) {
                    PlayerTitleModel.instance.getItemAttrOpenNode(this._designationDate[designationFields.type]).OpenBtnHandlerClose();
                }
                PlayerTitleModel.instance.setItemAttrOpenNode(this._designationDate[designationFields.type], this);
                this.isOpen = true;
                this.OpenBtn.skin = "common/btn_common_arrow_sjt3.png";
                let leng: number = <number>(attrTips.length / 2);//该称号 属性个数
                leng = Math.round(leng);
                let lineNum = Math.round(leng / 2);//两个一行 算出多少行
                let zengJiaLeng = 0;
                if (lineNum == 0) {
                    lineNum = 1;
                } else {
                    if ((lineNum * 2) < leng) {
                        lineNum = lineNum + 1;
                    }
                }
                zengJiaLeng = 50 * lineNum + 60;
                if (this._designationDate[designationFields.type] == 3) {
                    zengJiaLeng += 200;
                    this.upLevelBtn.visible = true;
                    this.levelUpCostImg.skin = `assets/icon/ui/designation/up/${this._designationDate[designationFields.src]}.png`;
                }

                this.height = this._hight + zengJiaLeng;
                this.bonusesBox.height = zengJiaLeng;
                this.bonusesBox.visible = true;
            }
            // this.isJHImg.height = this.height;
            // this.BGImg.height = this.height;

            this.setArr(attrTips);
        }

        /**
         * 设置属性 并且重新刷新 list（抛出刷新事件）
         */
        public setArr(attrTips: any) {
            if (attrTips) {
                for (let index = 0; index < this._nameTextArry.length; index++) {
                    let element = this._nameTextArry[index];
                    element.visible = false;
                }
                for (let index = 0; index < attrTips.length; index++) {
                    let element = attrTips[index];
                    if (this._nameTextArry[index]) {
                        this._nameTextArry[index].text = element;
                        this._nameTextArry[index].visible = true;
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_OPENUPDATE);
        }

        private _addNotice(condition) {
            if (condition) {
                SystemNoticeManager.instance.addNotice(condition, true);
            } else {
                SystemNoticeManager.instance.addNotice("条件不满足", true);
            }
        }

        public AllBtnHandler() {
            let condition = this._designationDate[designationFields.condition];
            if (!this._designationProtocolsDate) {
                this._addNotice(condition);
                return;
            }
            let state = this._designationProtocolsDate[designationFieldsProtocols.state];
            let id = this._designationDate[designationFields.id];
            //称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中
            switch (state) {
                case designationFieldsProtocols.state:
                    // PlayerTitleCtrl.instance.ActiveDesignation(id);
                    this._addNotice(condition);
                    break;
                case designationFieldsProtocols.endTime:
                    PlayerTitleCtrl.instance.ActiveDesignation(id);
                    break;
                case designationFieldsProtocols.value:
                    PlayerTitleCtrl.instance.WearDesignation(id);
                    break;
                case designationFieldsProtocols.total:
                    PlayerTitleCtrl.instance.TakeoffDesignation(id);
                    break;
                default:
                    break;
            }

        }

        /**
         * 根据状态改变 AllBtn 和  ui 显示
         */
        public UpdateUI() {
            let src = this._designationDate[designationFields.src];
            let condition = this._designationDate[designationFields.condition];
            let showProgress = this._designationDate[designationFields.showProgress];///*是否显示进度 0/1*/
            let limitTime = this._designationDate[designationFields.limitTime];///*是否显示进度 0/1*/
            let id = this._designationDate[designationFields.id];

            this.playerTitleImg.skin = `assets/icon/ui/designation/${src}.png`;
            this._designationProtocolsDate = PlayerTitleModel.instance.AllDate[id];
            this.isJHImg.visible = true;

            this.AllBtn.skin = "common/btn_tongyong_18.png";
            this.AllBtn.labelColors = "#465460,#465460,#465460,#465460";
            this.AllBtn.label = "激活";
            this.timeText2.color = "#ff3e3e";
            this.timeText2.text = condition;
            this._challengeClip.stop();
            this._challengeClip.visible = false;
            this.timeText3.visible = false;
            this.nowBox.visible = false;
            this.upLevelBtn.visible = false;
            this.timeText3.padding = [0, 0, 0, 0];
            if (this.isOpen) {
                this.OpenBtnHandlerClose();
            }
            if (!condition) {
                this.jinduText.visible = false;
            }

            if (!this._designationProtocolsDate) {
                // 未拥有
                return;
            }
            // this.jinduText.visible = false;
            // this.timeText2.visible = false;
            this.timeText2.color = "#168a17";
            let state = this._designationProtocolsDate[designationFieldsProtocols.state];
            // let endTime = this._designationProtocolsDate[designationFieldsProtocols.endTime];
            let value = this._designationProtocolsDate[designationFieldsProtocols.value];
            let total = this._designationProtocolsDate[designationFieldsProtocols.total];
            //称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中
            if (state == designationFieldsProtocols.state) {//未达到条件
                this.timeText2.color = "#ff3e3e";
            } else if (state == designationFieldsProtocols.endTime) {//达到条件 可激活
                this.AllBtn.skin = "common/btn_tongyong_6.png";
                this.AllBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                this.AllBtn.label = "激活";
            } else if (state == designationFieldsProtocols.value) {//达到条件 已激活
                this.AllBtn.skin = "common/btn_tongyong_6.png";
                this.AllBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                this.AllBtn.label = "穿戴";
            } else if (state == designationFieldsProtocols.total) {//已穿戴
                this.AllBtn.skin = "common/btn_tongyong_18.png";
                this.AllBtn.labelColors = "#465460,#465460,#465460,#465460";
                this.AllBtn.label = "卸下";
            }
            if (state == designationFieldsProtocols.endTime) {
                this._challengeClip.play();
                this._challengeClip.visible = true;
            }

            this.isJHImg.visible = state == designationFieldsProtocols.state;
            this.nowBox.visible = state == designationFieldsProtocols.total;

            if (showProgress == 1) {
                this.timeText2.text = `${condition}(${CommonUtil.bigNumToString(value, true)}/${CommonUtil.bigNumToString(total, false)})`;
            } else {
                this.timeText2.text = condition;
            }

            if (state == designationFieldsProtocols.value || state == designationFieldsProtocols.total) {
                this.timeText3.visible = true;
            }
            Laya.timer.clear(this, this.loopHandler);
            if (limitTime == 0) {
                this.timeText3.text = "永久有效";
                this.timeText3.padding = [0, 0, 0, 140];
            } else {
                this.loopHandler();
                Laya.timer.loop(1000, this, this.loopHandler);
            }
        }

        public timeStampToMMSS(ms: number): Array<int> {
            let str: Array<int> = [0, 0, 0];
            let offset: number = ms - GlobalData.serverTime;

            if (offset <= 0) {
                str = [0, 0, 0];
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                let hour: int = minute / 60 >> 0;
                let day: int = hour / 24 >> 0;
                sec = sec % 60;
                minute = minute % 60;
                hour = hour % 24;
                // str = day + "天" + hour + "时" + minute + "分";
                str = [day, hour, minute];
            }
            return str;
        }

        private loopHandler(): void {
            if (!this._designationProtocolsDate) {
                return;
            }
            let endTime = this._designationProtocolsDate[designationFieldsProtocols.endTime];
            let str = this.timeStampToMMSS(endTime)[0];
            let str1 = this.timeStampToMMSS(endTime)[1];
            let str2 = this.timeStampToMMSS(endTime)[2];
            str = str == 0 ? 1 : str;
            if (str === 0 && str1 === 0 && str2 === 0) {
                Laya.timer.clear(this, this.loopHandler);
                this.timeText3.text = `过期时间:${0}天`;
                return;
            }
            this.timeText3.text = `过期时间:${str}天`;
        }
    }
}
