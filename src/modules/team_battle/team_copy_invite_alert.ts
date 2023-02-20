/////<reference path="../$.ts"/>
/** 组队副本邀请弹框 */
namespace modules.teamBattle {
    import TeamCopyInviteAlertUI = ui.TeamCopyInviteAlertUI;
    import FactionMember = Protocols.FactionMember;
    import FactionModel = modules.faction.FactionModel;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import CustomList = modules.common.CustomList;
    import BtnGroup = modules.common.BtnGroup;

    export class TeamCopyInviteAlert extends TeamCopyInviteAlertUI {

        private _list: CustomList;
        private _btnGroup: BtnGroup;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 51;
            this._list.y = 110;
            this._list.width = 560;
            this._list.height = 522;
            this._list.hCount = 1;
            this._list.itemRender = TeamCopyInviteItem;
            this._list.spaceY = 5;
            this.addChild(this._list);

            this._btnGroup = new BtnGroup();
            this._btnGroup.canSelectHandler = Handler.create(this, this.canSelectHandler, null, false);
            this._btnGroup.setBtns(this.btnGroup_1, this.btnGroup_0);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.updateView);
            this._btnGroup.selectedIndex = 0;

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_CAN_INVITE_MEMBER_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            let index: number = this._btnGroup.selectedIndex;
            let datas: MemberInfo[] = [];

            if (index == 0) { //仙盟 
                let list: FactionMember[] = FactionModel.instance.memberList;
                let teamList: Protocols.TeamMember[] = TeamBattleModel.Instance.playerInfos;
                let mineId: number = PlayerModel.instance.actorId;
                for (let e of list) {
                    let id: number = e[FactionMemberFields.agentId];
                    if (id == mineId) continue;
                    let flag: boolean = false;
                    for (let ele of teamList) {
                        let thisId: number = ele[Protocols.TeamMemberFields.objId];
                        if (thisId == id) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag) continue;
                    let state: boolean = e[FactionMemberFields.state];
                    if (state) {
                        let occ: number = e[FactionMemberFields.occ];
                        let name: string = e[FactionMemberFields.name];
                        let fight: number = e[FactionMemberFields.fight];
                        let id: number = e[FactionMemberFields.agentId];
                        let headImg: number = e[FactionMemberFields.headImg];
                        datas.push([index, id, occ, name, fight, headImg]);
                    }
                }
                if (datas.length == 0) {
                    this.noTxt.text = `你的公会成员不在线`;
                    this.noBox.visible = true;
                } else {
                    this.noBox.visible = false;
                }
            } else { //好友 功能未开启

            }
            datas = datas.sort(this.sortByFight.bind(this));
            let pos: number = this._list.scrollPos;
            this._list.datas = datas;
            if (this._btnGroup.selectedIndex == this._btnGroup.oldSelectedIndex) {
                this._list.scrollPos = pos;
            } else {
                this._list.scrollPos = 0;
            }
        }

        private canSelectHandler(nextIndex: number): boolean {
            if (nextIndex == 1) {
                notice.SystemNoticeManager.instance.addNotice(`功能暂未开放,敬请期待`, true);
                return false;
            }
            return true;
        }

        private sortByFight(l: MemberInfo, r: MemberInfo): number {
            let lFight: number = l[MemberInfoFields.fight];
            let rFight: number = r[MemberInfoFields.fight];
            return rFight - lFight;
        }

        private btnHandler(): void {
            let index: number = this._btnGroup.selectedIndex;
            TeamBattleCtrl.instance.inviteJoinTeam(index, 0);
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy();
        }
    }
}