
/** 战队成员Item */
namespace modules.clan {
    import ClanMemberItemUI = ui.ClanMemberItemUI;
    import ClanActorBaseAttrFields = Protocols.ClanActorBaseAttrFields;
    import ClanActorBaseAttr = Protocols.ClanActorBaseAttr;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;

    export class ClanMemberItem extends ClanMemberItemUI {

        private _agendId: number;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.opBtn, common.LayaEvent.CLICK, this, this.opHandler, [1]);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: ClanActorBaseAttr): void {
            super.setData(value);
            let vipLv: number = value[ClanActorBaseAttrFields.vip];
            let vipf: number = value[ClanActorBaseAttrFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipLvMSZ);
            this.baseTxt.text = `${value[ClanActorBaseAttrFields.name]}`;
            let fight: string = CommonUtil.bigNumToString(value[ClanActorBaseAttrFields.fight]);
            this.fightTxt.text = `战力：${fight}`;
            this._agendId = value[ClanActorBaseAttrFields.agentId];
            this.headerFlag.visible = value[ClanActorBaseAttrFields.pos] == 1;
            this.gxTxt.text = value[ClanActorBaseAttrFields.contribution] + "";
            this.headerFlag.visible = value[ClanActorBaseAttrFields.pos] == 1;

            let state: boolean = value[ClanActorBaseAttrFields.state];
            if (state) {
                this.stateTxt.text = `在线`;
                this.stateTxt.color = `#29a319`;
            } else {
                let lastTime: number = value[ClanActorBaseAttrFields.loginTime];
                if (lastTime == 0) {
                    this.stateTxt.text = `离线`;
                } else {
                    let diffTime: number = GlobalData.serverTime - lastTime;
                    diffTime = diffTime < 0 ? 0 : diffTime;
                    let time: string = CommonUtil.getTimeTypeAndTime(diffTime);
                    this.stateTxt.text = `${time}前在线`;
                }
            }

            let occ: number = value[ClanActorBaseAttrFields.occ];
            let headImg: number = value[ClanActorBaseAttrFields.headImg];
            // this.headImg.skin = `assets/icon/head/${occ}.png`;
            this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(headImg + occ)}`;
        }


        //打开操作玩家
        private opHandler(): void {
            let yAxis: number = this.y;
            GlobalData.dispatcher.event(CommonEventType.Open_Opreate_Member_View, yAxis);
        }
    }
}