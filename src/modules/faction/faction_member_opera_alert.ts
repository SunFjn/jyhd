///<reference path="./faction_member_opera_item.ts"/>
///<reference path="./faction_apply_post_item.ts"/>
///<reference path="./faction_member_opera_panel.ts"/>
/** 成员操作alert */
namespace modules.faction {
    import FactionMemberOperaPanel = modules.faction.FactionMemberOperaPanel;
    import FactionApplyPostItem = modules.faction.FactionApplyPostItem;
    import BtnGroup = modules.common.BtnGroup;
    import FactionMemberOperaItem = modules.faction.FactionMemberOperaItem;
    import FactionMemberOperaAlertUI = ui.FactionMemberOperaAlertUI;
    import CustomList = modules.common.CustomList;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import Event = Laya.Event;

    export class FactionMemberOperaAlert extends FactionMemberOperaAlertUI {

        private _operalist: CustomList;
        private _askList: CustomList;
        private _btnGroup: common.BtnGroup;
        private _panel: FactionMemberOperaPanel;

        protected initialize(): void {
            super.initialize();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1);

            this._operalist = new CustomList();
            this._operalist.scrollDir = 1;
            this._operalist.x = 36;
            this._operalist.y = 173;
            this._operalist.width = 590;
            this._operalist.height = 377;
            this._operalist.hCount = 1;
            this._operalist.itemRender = FactionMemberOperaItem;
            this._operalist.spaceY = 5;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.updateView);
            this._btnGroup.selectedIndex = 0;

            this.addAutoListener(this.operaBtn, common.LayaEvent.CLICK, this, this.operaBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, common.LayaEvent.CLICK, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_SHOW_OPERA_PANEL, this, this.showOperaPanel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_APPLY_POST_LIST, this, this.updateApplyList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateMemberList);

            this.addAutoListener(Laya.stage, common.LayaEvent.MOUSE_DOWN, this, this.hidePanel);

            this.addAutoRegisteRedPoint(this.applyRPImg, ["factionPostApplyRP"]);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            if (this._btnGroup.selectedIndex == 0) {
                this.txtShow = 0;
                this.updateMemberList();
            } else {
                this.txtShow = 1;
                FactionCtrl.instance.getApplyForPosList();
                this.updateApplyList();
            }
        }

        private updateMemberList(): void {
            if (this._btnGroup.selectedIndex == 1) return;
            this.operaBtn.visible = true;
            this.bgImg.height = 480;
            if (this._askList) {
                this._askList.removeSelf();
            }
            this.addChildAt(this._operalist, 5);
            let list: FactionMember[] = [];
            if (FactionModel.instance.post == FactionPosition.leader) {
                if (FactionModel.instance.deputyInfo) {
                    list.push(FactionModel.instance.deputyInfo);
                }
                this.screen(list);
            } else {
                this.screen(list);
            }
            if (list.length > 0) {
                this.noBox.visible = false;
            } else {
                this.noBox.visible = true;
                this.noTxt.text = `暂无其他成员`;
                this.noBox.y = 120;
            }
            this._operalist.datas = list;
        }

        private updateApplyList(): void {
            if (this._btnGroup.selectedIndex == 0) return;
            let list: Protocols.Pair[] = FactionModel.instance.applyForPosList;
            if (!list) return;
            if (list.length > 0) {
                this.noBox.visible = false;
            } else {
                this.noBox.visible = true;
                this.noTxt.text = `暂时无人申请`;
                this.noBox.y = 175;
            }
            if (!this._askList) {
                this._askList = new CustomList();
                this._askList.scrollDir = 1;
                this._askList.x = 50;
                this._askList.y = 173;
                this._askList.width = 590;
                this._askList.height = 470;
                this._askList.hCount = 1;
                this._askList.itemRender = FactionApplyPostItem;
                this._askList.spaceY = 5;
            }
            this.addChild(this._askList);
            this._operalist.removeSelf();
            this.operaBtn.visible = false;
            this.bgImg.height = 560;
            let datas: [FactionPosition, FactionMember][] = [];
            for (let e of list) {
                let id: number = e[Protocols.PairFields.first];
                let data: FactionMember = FactionModel.instance.getMemberById(id);
                let post: FactionPosition = e[Protocols.PairFields.second];
                datas.push([post, data]);
            }
            datas = datas.sort(this.askSort.bind(this));
            this._askList.datas = datas;
        }

        private screen(list: FactionMember[]): void {
            let arr: FactionMember[] = [];
            arr = FactionModel.instance.manageInfos.concat();
            if (arr.length > 1) {
                arr = arr.sort(this.sortFunc.bind(this));
            }
            list.push(...arr);
            arr = FactionModel.instance.commonInfos.concat();
            if (arr.length > 1) {
                arr = arr.sort(this.sortFunc.bind(this));
            }
            list.push(...arr);
        }

        public askSort(l: [FactionPosition, FactionMember], r: [FactionPosition, FactionMember]): number {
            let lPost: FactionPosition = l[0];
            let rPost: FactionPosition = r[0];
            return lPost < rPost ? -1 : lPost > rPost ? 1 : this.sortByFight(l, r);
        }

        public sortByFight(l: [FactionPosition, FactionMember], r: [FactionPosition, FactionMember]): number {
            let lFight: number = l[1][FactionMemberFields.fight];
            let rFight: number = r[1][FactionMemberFields.fight];
            return lFight > rFight ? -1 : 1;
        }

        private sortFunc(l: FactionMember, r: FactionMember): number {
            let lContribution: number = l[FactionMemberFields.weekContribution];
            let rContribution: number = r[FactionMemberFields.weekContribution];
            if (lContribution > rContribution) {
                return -1;
            } else if (lContribution < rContribution) {
                return 1;
            } else {
                let lFight: number = l[FactionMemberFields.fight];
                let rFight: number = r[FactionMemberFields.fight];
                if (lFight > rFight) {
                    return -1;
                } else if (lFight < rFight) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        private showOperaPanel(info: FactionMember): void {
            if (!this._panel) {
                this._panel = new FactionMemberOperaPanel();
            }
            this.addChild(this._panel);
            let posY = this.globalToLocal(FactionModel.instance.tempPos, true).y;
            this._panel.y = posY;
            this._panel.setOpenParam(info);
        }

        private hidePanel(e: Event): void {
            if (e.target instanceof Laya.Button && e.target.parent instanceof FactionMemberOperaItem) return;
            if (e.target instanceof FactionMemberOperaPanel || (e.target instanceof Laya.Button && e.target.parent instanceof FactionMemberOperaPanel)) return;
            if (this._panel) {
                this._panel.removeSelf();
            }
        }

        private set txtShow(index: number) {
            this.fightTxt.x = index ? 310 : 266;
            this.contributeTxt.visible = !index;
            this.postTxt.x = index ? 430 : 468;
            this.operaTxt.x = index ? 530 : 552;
        }

        private operaBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FACTION_POST_LIMITS_ALERT);
        }

        public destroy(): void {
            this._operalist = this.destroyElement(this._operalist);
            this._askList = this.destroyElement(this._askList);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._panel = this.destroyElement(this._panel);
            super.destroy();
        }

        public close(): void {
            WindowManager.instance.open(WindowEnum.FACTION_MANAGE_PANEL);
            super.close();
        }
    }
}
