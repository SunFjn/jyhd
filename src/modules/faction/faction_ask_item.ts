/////<reference path="../$.ts"/>
/** 请求入盟item */
namespace modules.faction {
    import FactionAskItemUI = ui.FactionAskItemUI;
    import FactionJoin = Protocols.FactionJoin;
    import FactionJoinFields = Protocols.FactionJoinFields;


    export class FactionAskItem extends FactionAskItemUI {

        private _agendId: number;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.passBtn, common.LayaEvent.CLICK, this, this.btnHandler, [1]);
            this.addAutoListener(this.refuseBtn, common.LayaEvent.CLICK, this, this.btnHandler, [0]);
        }

        public setData(info: FactionJoin): void {
            let vipLv: number = info[FactionJoinFields.vip];
            let vipf: number = info[FactionJoinFields.vipf];
            CommonUtil.setSVIPandVIP(vipf,vipLv, this.vipBg, this.vipMsz);
            this.nameTxt.text = info[FactionJoinFields.name];
            let fight: string = CommonUtil.bigNumToString(info[FactionJoinFields.fight]);
            this.fightTxt.text = fight;
            this.lvTxt.text = `${info[FactionJoinFields.level]}`;
            this._agendId = info[FactionJoinFields.agentId];
        }

        private btnHandler(result: number): void {
            FactionCtrl.instance.examine([this._agendId, result]);
        }
    }
}