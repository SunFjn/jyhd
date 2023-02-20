/** 创建/改名战队弹框*/
namespace modules.clan {
    import LayaEvent = modules.common.LayaEvent;
    import ClanCreateAlertUI = ui.ClanCreateAlertUI;
    import Image = Laya.Image;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import BtnGroup = modules.common.BtnGroup;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class ClanCreateAlert extends ClanCreateAlertUI {
        private _imgs: Array<Image>;
        private _imgGroup: BtnGroup;
        private _imgSpace: number;
        private _isChangeName: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._imgSpace = 120;
            this._imgs = [];
            for (let i: int = 0; i < 4; i++) {
                let img: Image = new Image();
                this._imgs.push(img);
                this.listBox.addChild(img);
                img.width = 101;
                img.height = 107;
                img.x = 20 + i * this._imgSpace;
            }

            this._imgGroup = new BtnGroup();
            this._imgGroup.setBtns(...this._imgs);
            this.listBox.width = this._imgs[3].x + this._imgs[3].width;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this._imgGroup, LayaEvent.CHANGE, this, this.selecetIconImg);
            this._imgGroup.selectedIndex = 0;
        }

        private selecetIconImg(): void {
            this.selectImg.x = this._imgGroup.selectedBtn.x - 2;
        }

        onOpened(): void {
            super.onOpened();
            this._isChangeName = ClanModel.instance.createClanOrCN.isChangeName;
            this.updateView();
        }

        private updateView(): void {
            for (let i: int = 0; i < 4; i++) {
                this._imgs[i].skin = `clan/totem_${i}.png`;
            }


            //判断是否为修改战队名字
            if (this.openData) {
                this.openData.flagIndex = parseInt(this.openData.flagIndex);
                this._isChangeName = this.openData.isChangeName;
            }
            if (this._isChangeName) {
                this.titleTxt.text = "战队改名";
                this.costTypeImg.skin = "common/shenghuyu.png";
                this.costTxt.text = "500";
                this.nameTxt.text = ClanModel.instance.myClanInfo[ClanInfoDataFields.name];
                let iconIndex: number = ClanModel.instance.myClanInfo[ClanInfoDataFields.flagIndex];
                this.selectImg.x = this._imgGroup.btns[iconIndex].x - 2;
            } else {
                this.titleTxt.text = "创建战队";
                this.costTypeImg.skin = "common/icon_tongyong_2.png";
                this.costTxt.text = "1000";
            }
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        //确认创建
        private okBtnHandler(): void {
            let content: string = this.nameTxt.text;
            if (!content) {
                SystemNoticeManager.instance.addNotice(`请先给战队起个名字`, true);
                return;
            } else if (!chat.ChatModel.instance.isValidContent(content)) {
                SystemNoticeManager.instance.addNotice(`包含非法字符`, true);
                return;
            } else if (content.length < 1 || content.length > 6) {
                SystemNoticeManager.instance.addNotice(`名字长度为1~6个字`, true);
                return;
            }
            //直接创建战队
            if (!this._isChangeName) {
                ClanCtrl.instance.createClan([content, this._imgGroup.selectedIndex]);
            }
            //修改战队名字和图腾
            else {
                ClanCtrl.instance.ChangeClanName([content, this._imgGroup.selectedIndex]);
            }
        }
    }
}