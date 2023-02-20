/////<reference path="../$.ts"/>
///<reference path="../rename/rename_model.ts"/>

/** 仙盟成员Item */
namespace modules.faction {
    import FactionMemberItemUI = ui.FactionMemberItemUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateNameReply = Protocols.UpdateNameReply;

    export class FactionMemberItem extends FactionMemberItemUI {
        private _info:FactionMember;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
        }

        public setData(info: FactionMember): void {
            this._info = info;
            let vipLv: number = info[FactionMemberFields.vip];
            let vipf: number = info[FactionMemberFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
            this.nameTxt.text = info[FactionMemberFields.name];
            let fight: string = CommonUtil.bigNumToString(info[FactionMemberFields.fight]);
            this.fightTxt.text = `${fight}`;
            this.contributeTxt.text = `${info[FactionMemberFields.weekContribution]}`;
            let state: boolean = info[FactionMemberFields.state];
            if (state) {
                this.stateTxt.text = `在线`;
            } else {
                let lastTime: number = info[FactionMemberFields.loginTime];
                if (lastTime == 0) {
                    this.stateTxt.text = `离线`;
                } else {
                    let diffTime: number = GlobalData.serverTime - lastTime;
                    diffTime = diffTime < 0 ? 0 : diffTime;
                    let time: string = CommonUtil.getTimeTypeAndTime(diffTime);
                    this.stateTxt.text = `${time}前`;
                }
            }
        }

        // 更新名字
        private updateName():void{
            if(!this._info) return;
            let nameInfo:UpdateNameReply = RenameModel.instance.updateNameReply;
            if(!nameInfo) return;
            if(this._info[FactionMemberFields.agentId] === nameInfo[UpdateNameReplyFields.roleID]){
                this.nameTxt.text = nameInfo[UpdateNameReplyFields.name];
            }
        }
    }
}