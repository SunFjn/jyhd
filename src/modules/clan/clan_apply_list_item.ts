
/** 战队成员Item */
namespace modules.clan {
    import ClanApplyListItemUI = ui.ClanApplyListItemUI;
    import ClanActorBaseAttrFields = Protocols.ClanActorBaseAttrFields;
    import ClanActorBaseAttr = Protocols.ClanActorBaseAttr;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import ClanAudit = Protocols.ClanAudit;
    import ClanApplyListMemberAttrFields = Protocols.ClanApplyListMemberAttrFields;
    import ClanApplyListMemberAttr = Protocols.ClanApplyListMemberAttr;

    export class ClanApplyListItem extends ClanApplyListItemUI {

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.agreeBtn, common.LayaEvent.CLICK, this, this.agreeBtnHandler, [1]);
            this.addAutoListener(this.rejectBtn, common.LayaEvent.CLICK, this, this.rejectBtnHandler, [1]);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: ClanApplyListMemberAttr): void {
            super.setData(value);
            let vipLv: number = value[ClanApplyListMemberAttrFields.vip];
            let vipf: number = value[ClanApplyListMemberAttrFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipLvMSZ);
            this.baseTxt.text = `${value[ClanApplyListMemberAttrFields.name]}`;
            let fight: string = CommonUtil.bigNumToString(value[ClanApplyListMemberAttrFields.fight]);
            this.fightTxt.text = `战力：${fight}`;

            let occ: number = value[ClanApplyListMemberAttrFields.occ];
            let head: number = value[ClanApplyListMemberAttrFields.headImg];
            this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(head + occ)}`;
            // this.headImg.skin = `assets/icon/head/1.png`;
        }


        //同意
        private agreeBtnHandler(): void {
            let agentID = this._data[ClanApplyListMemberAttrFields.agentId];
            let result = 1;
            ClanCtrl.instance.auditMemberJoinClan([agentID, result]);
        }
        //拒绝
        private rejectBtnHandler(): void {
            let agentID = this._data[ClanApplyListMemberAttrFields.agentId];
            let result = 0;
            ClanCtrl.instance.auditMemberJoinClan([agentID, result]);
        }
    }
}