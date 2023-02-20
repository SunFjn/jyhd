/////<reference path="../$.ts"/>
/** 请求职位item */
namespace modules.faction {
    import FactionAskItemUI = ui.FactionAskItemUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;


    export class FactionApplyPostItem extends FactionAskItemUI {

        private _agendId: number;
        private _post: FactionPosition;

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.passBtn, common.LayaEvent.CLICK, this, this.btnHandler, [1]);
            this.addAutoListener(this.refuseBtn, common.LayaEvent.CLICK, this, this.btnHandler, [0]);
        }

        public setData(info: [FactionPosition, FactionMember]): void {
            /*玩家id:申请的职位*/
            this._post = info[0];
            let postIndex: number = FactionUtil.post.indexOf(this._post);
            this.lvTxt.text = FactionUtil.postNames[postIndex];
            let data: FactionMember = info[1];
            this._agendId = data[FactionMemberFields.agentId];
            let vipLv: number = data[FactionMemberFields.vip];
            let vipf: number = data[FactionMemberFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
            this.nameTxt.text = data[FactionMemberFields.name];
            let fight: string = CommonUtil.bigNumToString(data[FactionMemberFields.fight]);
            this.fightTxt.text = fight;
        }

        private btnHandler(result: number): void {
            FactionCtrl.instance.applyForPosResult([this._agendId, this._post, result]);
        }
    }
}