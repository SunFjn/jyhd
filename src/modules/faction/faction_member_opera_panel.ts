/////<reference path="../$.ts"/>
/** 成员操作面板 */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import FactionCtrl = modules.faction.FactionCtrl;
    import FactionMemberOperaViewUI = ui.FactionMemberOperaViewUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;

    export class FactionMemberOperaPanel extends FactionMemberOperaViewUI {

        private _info: FactionMember;
        private _btns: Laya.Button[];

        protected initialize(): void {
            super.initialize();
            this.centerX = 60;
        }

        public setOpenParam(info: FactionMember): void {
            super.setOpenParam(info);

            this._info = info;  // width 12
            this.nameTxt.text = `${info[FactionMemberFields.name]}`;
            let vipLv: number = info[FactionMemberFields.vip];
            let vipf: number = info[FactionMemberFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
            let targetPost: FactionPosition = info[FactionMemberFields.pos];
            this.btn_0.visible = this.btn_1.visible = this.btn_2.visible = this.btn_3.visible = false;
            let posts: FactionPosition[];
            let names: string[];
            if (FactionModel.instance.post == FactionPosition.leader) { //盟主视角
                this._btns = [this.btn_0, this.btn_1, this.btn_2, this.btn_3];
                if (targetPost == FactionPosition.deputyLeader) {// 目标是副盟主
                    names = [`优秀会员`, `会员`, `转移会长`, `踢出公会`];
                    posts = [FactionPosition.huFa, FactionPosition.member, FactionPosition.leader, null];
                } else if (targetPost == FactionPosition.huFa) {
                    names = [`优秀会员`, `会员`, `转移会长`, `踢出公会`];
                    posts = [FactionPosition.deputyLeader, FactionPosition.member, FactionPosition.leader, null];
                } else {
                    names = [`副会长`, `优秀会员`, `转移会长`, `踢出公会`];
                    posts = [FactionPosition.deputyLeader, FactionPosition.huFa, FactionPosition.leader, null];
                }
            } else if (FactionModel.instance.post == FactionPosition.deputyLeader) { //副盟主视角
                this._btns = [this.btn_0, this.btn_2];
                if (targetPost == FactionPosition.huFa) {
                    names = [`会员`, `踢出公会`];
                    posts = [FactionPosition.member, null];
                } else {
                    names = [`优秀会员`, `踢出公会`];
                    posts = [FactionPosition.huFa, null];
                }
            }
            for (let i: int = 0, len: int = this._btns.length; i < len; i++) {
                this._btns[i].y = 80 + i * 50;
                this._btns[i].label = names[i];
                this._btns[i].visible = true;
                this.addAutoListener(this._btns[i], common.LayaEvent.CLICK, this, this.btnHandler, [posts[i]]);
            }
            this.bgImg.height = this.height = this._btns[this._btns.length - 1].y + this._btns[this._btns.length - 1].height + 20;
        }

        private btnHandler(post: FactionPosition): void {
            let id: number = this._info[FactionMemberFields.agentId];
            let name: string = this._info[FactionMemberFields.name];
            if (post == FactionPosition.leader) { //转移盟主
                let handler: Handler = Handler.create(FactionCtrl.instance, FactionCtrl.instance.SetPosition, [[id, post]]);
                let word: string = `转移后您将<span style='color:#ff3e3e'>失去公会控制权</span>,是否将会长转移给<span style='color:#ffec7c'>${name}</span>?`;
                CommonUtil.alert(`转移会长`, word, [handler], []);
            } else if (post == null) {  //踢出仙盟
                let handler: Handler = Handler.create(FactionCtrl.instance, FactionCtrl.instance.kick, [[id]]);
                let word: string = `是否确定将<span style='color:#b15315'>${name}</span><span style='color:#ff3e3e'>踢出公会</span>?`;
                CommonUtil.alert(`踢出公会`, word, [handler], []);
            } else {
                FactionCtrl.instance.SetPosition([id, post]);
            }
            this.close();
        }

        public destroy(destroyChild: boolean = true): void {
            this._btns = this.destroyElement(this._btns);
            super.destroy(destroyChild);
        }
    }
}
