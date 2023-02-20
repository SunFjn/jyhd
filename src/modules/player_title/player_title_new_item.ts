/**称号单元项*/
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/designation_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.player_title {
    import LayaEvent = modules.common.LayaEvent;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    import designationProtocols = Protocols.Designation;
    import designationFieldsProtocols = Protocols.DesignationFields;

    export class PlayerTitleNewItem extends ui.PlayerTitleNewItemUI {
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

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.selectBtn, LayaEvent.CLICK, this, this.selectBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_NOW_REFRESH, this, this.UpdateNowRefreshUI);
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();

        }

        private selectBtnHandler(): void {
            if (this.selectBtn.selected) {
                PlayerTitleModel.instance.nowTitleData = this._data;
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_NOW_REFRESH);
            }
        }

        // 0-刷新，1-穿戴 2-卸下
        private UpdateNowRefreshUI(type: number = 0): void {
            let nowData: designation = PlayerTitleModel.instance.nowTitleData;
            if (type == 1) {
                if (nowData[designationFields.id] == this._data[designationFields.id]) {
                    this.nowBox.visible = true;
                } else {
                    this.nowBox.visible = false;
                }
                return;
            } else if (type == 2) {
                if (this.nowBox.visible) this.nowBox.visible = false;
                return;
            }
            if (nowData[designationFields.id] != this._data[designationFields.id]) {
                this.selectBtn.selected = false;
                this.selectBtn.mouseEnabled = true;
            } else {
                this.selectBtn.mouseEnabled = false;
            }
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
            if (!activity_all) {
                return;
            }

            try {
                this._designationDate = activity_all;
                let src = this._designationDate[designationFields.src];
                let id = this._designationDate[designationFields.id];
                let level = this._designationDate[designationFields.level];
                this._designationProtocolsDate = PlayerTitleModel.instance.AllDate[id];
                if (this._designationProtocolsDate == null) {
                    this._designationProtocolsDate = [id, 1, 0, 0, 4];
                }
                let state = this._designationProtocolsDate[designationFieldsProtocols.state];

                this.playerTitleImg.skin = `assets/icon/ui/designation/${src}.png`;
                /*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
                this.nowBox.visible = state == 4;
                this.gray = this.isJHImg.visible = state == 1;
                this.rpImg.visible = state == 2;

                this.gradeImg.skin = `common/xiyou${level}.png`;

                // 当前激活并使用的称号
                if (this.nowBox.visible) {
                    PlayerTitleModel.instance.nowTitleData = activity_all;
                    GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_NOW_REFRESH);
                    this.selectBtn.selected = true;
                } else {
                    this.selectBtn.selected = false;
                }
            }
            // 不存在的称号
            catch (error) {
                this.playerTitleImg.skin = "";
                console.log("称号名称:", this._designationDate[designationFields.name], "图标id:", this._designationDate[designationFields.src], "id:", this._designationDate[designationFields.id], this._designationProtocolsDate);
            }
        }

    }
}
