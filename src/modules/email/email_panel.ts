/** 邮件面板*/


///<reference path="../common/custom_list.ts"/>


namespace modules.email {
    import Event = Laya.Event;
    import EmailViewUI = ui.EmailViewUI;
    import Handler = Laya.Handler;
    import CustomList = modules.common.CustomList;
    import EmailFields = Protocols.EmailFields;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class EmailPanel extends EmailViewUI {
        private _list: CustomList;
        private _selectIndex: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = EmailItem;
            this._list.vCount = 6;
            this._list.hCount = 1;
            this._list.width = 710;
            this._list.height = 885;
            this._list.x = 0;
            this._list.y = 0;
            this.itemPanel.addChild(this._list);
            this.centerX = 0;
            this.centerY = 0;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.deleteBtn, LayaEvent.CLICK, this, this.deletePopUp);
            this.addAutoListener(this.getBtn, LayaEvent.CLICK, this, this.getHandler);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EMAIL_LIST_UPDATE, this, this.updateView);
        }

        protected onOpened(): void {
            super.onOpened();
            //EmailModel.instance.oneEmail = false;
            EmailModel.instance.isChoose = false;
            this.updateView();
        }

        private updateView(): void {
            let showNum = EmailModel.instance.emailShowNum;
            if (EmailModel.instance.hasEmail) {
                this.emailTxt.visible = this.countTxt.visible = this.getBtn.visible = this._list.visible = this.deleteBtn.visible = true;
                let pos = this._list.scrollPos;
                let shuju = EmailModel.instance.emailA1Data.concat(EmailModel.instance.emailB1Data, EmailModel.instance.emailA2Data, EmailModel.instance.emailB2Data, EmailModel.instance.emailA3Data);
                this._list.datas = shuju;
                if (shuju) {
                    this.zanWuImg.visible = shuju.length == 0;
                } else {
                    this.zanWuImg.visible = true;
                }
                //if (EmailModel.instance.oneEmail) {
                this._list.scroll(pos);
                //    EmailModel.instance.oneEmail = false;
                // }
                let hasNum = EmailModel.instance.emailDataShow.length;
                this.countTxt.text = `${hasNum}/${showNum}`;
                if (hasNum >= showNum)
                    this.countTxt.color = "#ff0000";
                else
                    this.countTxt.color = "#499b49";
            } else {
                this.zanWuImg.visible = true;
                this.emailTxt.visible = this.countTxt.visible = this.getBtn.visible = this._list.visible = this.deleteBtn.visible = false;
            }
        }

        private deletePopUp(): void {
            let handler:Handler = Handler.create(this, this.deleteHandler);
            modules.common.CommonUtil.alert("提示", "是否删除所有已读邮件？<br/><span>(不删除含有附件的邮件)</span>", [handler]);
        }

        private deleteHandler(): void {
            if (!EmailModel.instance.deleteEmail) {
                EmailCtrl.instance.oneKeyDelete();
                EmailModel.instance.deleteEmail = true;
            }
        }

        private getHandler(): void {

            let flag: boolean = false;

            tag: for (let i: int = 0; i < this._list.datas.length; i++) {
                let len = this._list.datas[i][EmailFields.items].length;
                for (let j: int = 0; j < len; j++) {
                    let id: number = this._list.datas[i][EmailFields.items][j][ItemFields.ItemId];
                    if (id === ItemMType.Equip) {
                        flag = true;
                        break tag;
                    }
                }
            }

            // let restNum = BagModel.instance.getBagEnoughById(1);
            // let isShow: boolean = !(restNum > BlendCfg.instance.getCfgByTypeAndId(10007)[blendFields.intParam][0]);

            if (flag && BagUtil.checkNeedSmeltTip()) {
                // CommonUtil.alert("温馨提示","装备背包格子不足，是否一键熔炼", true, Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt));
            } else {
                if (!EmailModel.instance.getAttach) {
                    EmailCtrl.instance.getAwardAll();
                    EmailModel.instance.getAttach = true;
                }
            }
        }

        private selectHandler(): void {
            this._selectIndex = this._list.selectedIndex;
        }
    }
}