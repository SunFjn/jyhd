/////<reference path="../$.ts"/>
/** 仙盟管理选项面板 */
namespace modules.faction {
    import WindowManager = modules.core.WindowManager;
    import FactionManageViewUI = ui.FactionManageViewUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import Event = Laya.Event;

    export class FactionManagePanel extends FactionManageViewUI {

        private _btns: Laya.Box[];
        private _allBtns: Laya.Box[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._allBtns = [this.box_0, this.box_1, this.box_2, this.box_3, this.box_4,
            this.box_5, this.box_6];

            this.centerX = 0;
            this.centerY = 230;
        }

        protected addListeners(): void {
            super.addListeners();
            for (let i: int = 0, len: int = this._allBtns.length; i < len; i++) {
                this.addAutoListener(this._allBtns[i], common.LayaEvent.CLICK, this, this.btnsHandler, [i]);
            }
            this.addAutoRegisteRedPoint(this.rpImg_0, ["factionApplyJoinRP"]);
            this.addAutoRegisteRedPoint(this.rpImg_1, ["factionPostApplyRP"]);

            this.addStageListener();
        }
        protected removeListeners(): void {

            Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private addStageListener(): void {
            Laya.stage.on(common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);
        }

        private hidePanel(e: Event): void {
            if (e.target instanceof Laya.Button && e.target.parent instanceof FactionPanel) return;
            if (!(e.target instanceof FactionManagePanel) &&
                !(e.target instanceof Laya.Box)) {
                WindowManager.instance.close(WindowEnum.FACTION_MANAGE_PANEL);
            }
        }

        private updateView(): void {
            //根据职位筛选显示的内容
            if (FactionModel.instance.post == FactionPosition.leader) { //盟主都显示
                this._btns = [this.box_0, this.box_1, this.box_2, this.box_3, this.box_4, this.box_6];
            } else if (FactionModel.instance.post == FactionPosition.deputyLeader) { //副盟主不显示解散仙盟
                this._btns = [this.box_0, this.box_1, this.box_2, this.box_3,
                this.box_5, this.box_6];
            } else if (FactionModel.instance.post == FactionPosition.huFa) { // 入盟申请 卸任职位 退出仙盟
                this._btns = [this.box_0, this.box_5, this.box_6];
            } else {
                this._btns = [this.box_6];
            }
            for (let e of this._allBtns) {
                e.visible = false;
            }
            for (let i: int = 0, len: int = this._btns.length; i < len; i++) {
                this._btns[i].pos(42 + (i % 4) * 151, 24 + Math.floor(i / 4) * 136);
                this._btns[i].visible = true;
            }
        }

        private btnsHandler(index: number): void {
            let handler: Handler;
            let backHandler: Handler;
            let word: string;
            switch (index) {
                case 0: //入盟申请列表
                    WindowManager.instance.open(WindowEnum.FACTION_ASK_ALERT);
                    break;
                case 1://人员管理
                    WindowManager.instance.open(WindowEnum.FACTION_MEMBER_OPERA_ALERT);
                    break;
                case 2://修改公告
                    WindowManager.instance.open(WindowEnum.FACTION_SET_NOTICE_ALERT);
                    break;
                case 3://修改宣传语
                    WindowManager.instance.open(WindowEnum.FACTION_SET_TITLE_ALERT);
                    break;
                case 4: //解散仙盟
                    word = `解散后该公会的数据将<span style='color:#ff3e3e'>全部清除且无法恢复</span>,是否继续?`;
                    handler = Handler.create(this, () => {
                        FactionCtrl.instance.dissolution();
                    });
                    backHandler = Handler.create(this, this.addStageListener);
                    Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);
                    CommonUtil.alert(`温馨提示`, word, [handler], [backHandler, null, true]);
                    break;
                case 5://卸任职位
                    let playerId: number = PlayerModel.instance.actorId;
                    let info: FactionMember = FactionModel.instance.getMemberById(playerId);
                    let post: number = info[FactionMemberFields.pos];
                    let postIndex: number = FactionUtil.post.indexOf(post);
                    let postName: string = FactionUtil.postNames[postIndex];
                    word = `卸任后,将<span style='color:#ff3e3e'>失去</span>该职位的所有<span style='color:#ff3e3e'>权限</span>,是否确定<span style='color:#ff3e3e'>卸任【${postName}】职位</span>?`;
                    handler = Handler.create(FactionCtrl.instance, FactionCtrl.instance.SetPosition, [[playerId, FactionPosition.member]]);
                    backHandler = Handler.create(this, this.addStageListener);
                    Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);
                    CommonUtil.alert(`卸任官职`, word, [handler], [backHandler]);
                    break;
                case 6://退出仙盟
                    if (FactionModel.instance.post == FactionPosition.leader) {
                        notice.SystemNoticeManager.instance.addNotice(`需将会长转移给其他公会成员方可退出公会`, true);
                    } else {
                        word = `退出公会后,我的宝藏将<span style='color:#ff3e3e'>全部清空</span>,是否确定<span style='color:#ff3e3e'>退出该公会</span>?`;
                        handler = Handler.create(FactionCtrl.instance, FactionCtrl.instance.exitFaction);
                        backHandler = Handler.create(this, this.addStageListener);
                        Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);
                        CommonUtil.alert(`退出公会`, word, [handler], [backHandler]);
                    }
                    break;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._allBtns) {
                for (let e of this._allBtns) {
                    e.removeSelf();
                    e.destroy();
                }
                this._allBtns = null;
            }
            if (this._btns) {
                for (let e of this._btns) {
                    e.removeSelf();
                    e.destroy();
                }
                this._btns = null;
            }
            super.destroy(destroyChild);
        }
    }
}
