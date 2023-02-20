/////<reference path="../$.ts"/>
/** 仙盟领导ITEM */
namespace modules.faction {
    import GlobalData = modules.common.GlobalData;
    import FactionLeaderItemUI = ui.FactionLeaderItemUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;

    export class FactionLeaderItem extends FactionLeaderItemUI {

        private _post: FactionPosition;
        private _info: FactionMember;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.requestBtn, common.LayaEvent.CLICK, this, this.requestBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
        }

        public setData(info: FactionMember): void {
            this._info = info;
            if (!info) {
                this.vipBg.visible = this.vipMsz.visible = this.fightMsz.visible = this.nameTxt.visible = this.stateTxt.visible = this.headBox.visible = false;
                this.noImg.visible = true;
                let myPost: FactionPosition = FactionModel.instance.post;
                let resule: boolean = (myPost === FactionPosition.huFa && this._post === FactionPosition.huFa) || myPost === FactionPosition.deputyLeader;
                this.requestBtn.visible = !resule;
            } else {
                this.fightMsz.visible = this.nameTxt.visible = this.stateTxt.visible = this.headBox.visible = true;
                this.requestBtn.visible = this.noImg.visible = false;
                let vipLv: number = info[FactionMemberFields.vip];
                let vipf: number = info[FactionMemberFields.vipf];
                CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
                let name: string = info[FactionMemberFields.name];
                this.nameTxt.text = name;
                let occ: number = info[FactionMemberFields.occ];
                let headImg: number = info[FactionMemberFields.headImg];
                this.headImg.skin = `assets/icon/head/${  CommonUtil.getHeadUrl(occ + headImg)}`;
                this.fightMsz.text = "战力:" + info[FactionMemberFields.fight].toString();
                let state: boolean = info[FactionMemberFields.state];
                if (state) {
                    this.stateTxt.text = `在线`;
                    this.stateTxt.color = `#50ff28`;
                } else {
                    let lastTime: number = info[FactionMemberFields.loginTime];
                    let diffTime: number = GlobalData.serverTime - lastTime;
                    let time: string = CommonUtil.getTimeTypeAndTime(diffTime);
                    this.stateTxt.text = `${time}前`;
                    this.stateTxt.color = `#c6c6c6`;
                }
            }
        }

        public set post(post: FactionPosition) {
            this._post = post;
            if (post == FactionPosition.deputyLeader) { //副盟主
                this.postBgImg.skin = `faction/image_xm_fmz.png`;
            } else {
                this.postBgImg.skin = `faction/image_xm_hf.png`;
            }
        }

        private requestBtnHandler(): void {
            if (FactionModel.instance.post == FactionPosition.leader) {
                notice.SystemNoticeManager.instance.addNotice(`你已是会长，无法申请其他职位`, true);
                return;
            } else if (FactionModel.instance.post == FactionPosition.deputyLeader) {
                notice.SystemNoticeManager.instance.addNotice(`你已是副副会长，无法申请其他职位`, true);
                return;
            }
            FactionCtrl.instance.applyForPos(this._post);
        }

        // 更新名字
        private updateName(): void {
            if (!this._info) return;
            let nameInfo: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (nameInfo && nameInfo[UpdateNameReplyFields.roleID] === this._info[FactionMemberFields.agentId]) {
                this.nameTxt.text = nameInfo[UpdateNameReplyFields.name];
            }
        }

        // 更新职业
        private updateOcc(): void {
            if (!this._info) return;
            let occInfo: UpdateOccReply = RenameModel.instance.updateOccReply;
            if (occInfo && this._info[FactionMemberFields.agentId] === occInfo[UpdateOccReplyFields.roleID]) {
                this.headImg.skin = `assets/icon/head/${occInfo[UpdateOccReplyFields.occ]}.png`;
            }
        }
    }
}
