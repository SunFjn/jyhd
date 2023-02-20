/////<reference path="../$.ts"/>
/** 成员操作item */
namespace modules.faction {
    import CommonEventType = modules.common.CommonEventType;
    import GlobalData = modules.common.GlobalData;
    import FactionMemberOperaItemUI = ui.FactionMemberOperaItemUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import Point = Laya.Point;

    export class FactionMemberOperaItem extends FactionMemberOperaItemUI {

        private _info: FactionMember;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        public setData(info: FactionMember): void {
            this._info = info;
            let vipLv: number = info[FactionMemberFields.vip];
            let vipf: number = info[FactionMemberFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
            this.nameTxt.text = info[FactionMemberFields.name];
            let fight: string = CommonUtil.bigNumToString(info[FactionMemberFields.fight]);
            this.fightTxt.text = fight;
            this.contributeTxt.text = info[FactionMemberFields.weekContribution].toString();
            let postIndex: number = FactionUtil.post.indexOf(info[FactionMemberFields.pos]);
            this.postTxt.text = FactionUtil.postNames[postIndex];
        }

        private btnHandler(): void {
            FactionModel.instance.tempPos = this.localToGlobal(new Point(0, 0));
            GlobalData.dispatcher.event(CommonEventType.FACTION_SHOW_OPERA_PANEL, [this._info]);
        }
    }
}
