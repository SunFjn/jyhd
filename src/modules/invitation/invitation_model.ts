///<reference path="../config/soaring_rush_buy_fs.ts"/>
namespace modules.invitation {
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetInviteGiftReply = Protocols.GetInviteGiftReply;
    import GetInviteGiftReplyFields = Protocols.GetInviteGiftReplyFields;
    import blendFields = Configuration.blendFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class InvitationModel {
        private static _instance: InvitationModel;
        public static get instance(): InvitationModel {
            return this._instance = this._instance || new InvitationModel();
        }

        //*剩余次数*/
        private _times: number;
        /*冷却限制*/
        private _cold: number;
        /*领取状态*/
        private _state: number;

        public _maxNum: number;
        public _awardAee: Array<Array<number>>;
        private constructor() {
            this._state = 0;
            this._cold = 0;
            this._times = 0;
            this._maxNum = modules.config.BlendCfg.instance.getCfgById(45001)[blendFields.intParam][0];
            this._awardAee = new Array<Array<number>>();
            let jiangLi = modules.config.BlendCfg.instance.getCfgById(45003)[blendFields.intParam];
            let ind = 0;
            let key = 0;
            for (let index = 0; index < jiangLi.length; index++) {
                let element = jiangLi[index];
                if (!this._awardAee[key]) {
                    this._awardAee[key] = new Array<number>();
                }
                this._awardAee[key][ind] = element;
                ind++;
                if (ind == 2) {
                    ind = 0;
                    key++;
                }
            }
        }

        public get state(): number {
            return this._state;
        }

        public get cold(): number {
            return this._cold;
        }

        public get times(): number {
            return this._times;
        }
        //返回数据
        public getInfo(tuple: GetInviteGiftReply) {
            this._state = tuple[GetInviteGiftReplyFields.state];
            this._times = tuple[GetInviteGiftReplyFields.times];
            this._cold = tuple[GetInviteGiftReplyFields.cold] + GlobalData.serverTime;
            GlobalData.dispatcher.event(CommonEventType.INVITATION_UPDATE);
            this.setRP();
        }
        public getIsLingQu(): boolean {
            let bolll = false;
            if (this._state == 1) {
                bolll = true;
            }
            return bolll;
        }
        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.invitationEnter);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("invitationRP", bolll && isLingQu);
        }
    }
}
