///<reference path="./faction_member_item.ts"/>
///<reference path="../rename/rename_model.ts"/>

/** 仙盟成员面板 */
namespace modules.faction {
    import FactionModel = modules.faction.FactionModel;
    import GlobalData = modules.common.GlobalData;
    import CommonUtil = modules.common.CommonUtil;
    import FactionLeaderItem = modules.faction.FactionLeaderItem;
    import FactionMemberItem = modules.faction.FactionMemberItem;
    import FactionMemberViewUI = ui.FactionMemberViewUI;
    import CustomList = modules.common.CustomList;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import UpdateOccReply = Protocols.UpdateOccReply;

    export class FactionMemberPanel extends FactionMemberViewUI {

        private _list: CustomList;
        private _hufas: FactionLeaderItem[];
        private _endY: number;
        private _commonInfos: FactionMember[];
        private _bossInfo: FactionMember;

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 0;
            this._list.y = 103;
            this._list.width = 720;
            this._list.height = 454;
            this._list.hCount = 1;
            this._list.itemRender = FactionMemberItem;
            this._list.spaceY = 1;
            this.selectBox_1.addChild(this._list);

            this._hufas = [this.huFa_0, this.huFa_1, this.huFa_2];
            this.huFa_0.post = FactionPosition.huFa;
            this.huFa_1.post = FactionPosition.huFa;
            this.huFa_2.post = FactionPosition.huFa;
            this.fuMeng.post = FactionPosition.deputyLeader;

            this._endY = 1135;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateMemberList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
        }


        public onOpened(): void {
            super.onOpened();

            this.updateView();
            this.updateMemberList();
            CustomList.showListAnim(modules.common.showType.ALPHA,this._list);
        }

        private updateView(): void {
            let bossInfo: FactionMember = FactionModel.instance.bossInfo;
            if (!bossInfo) return;
            this.bossInfo = bossInfo;
            let deputyInfo: FactionMember = FactionModel.instance.deputyInfo;
            this.fuMeng.setData(deputyInfo);
            let manageInfos: FactionMember[] = FactionModel.instance.manageInfos;
            let count: number = 0;
            let maxCount: number = 0;
            if (deputyInfo) {
                if (deputyInfo[FactionMemberFields.state]) {
                    count++;
                }
                maxCount++;
            }
            if (manageInfos) {
                //战力大到小 等级高到低
                manageInfos = manageInfos.sort(FactionModel.instance.sortByFightAndLv.bind(this));
                for (let e of manageInfos) {
                    if (e[FactionMemberFields.state]) {
                        count++;
                    }
                }
                maxCount += manageInfos.length;
            }

            for (let i: int = 0, len: int = this._hufas.length; i < len; i++) {
                this._hufas[i].setData(manageInfos[i]);
            }
        }

        private updateMemberList(): void {
            this._commonInfos = FactionModel.instance.commonInfos.concat();
            this._commonInfos = this._commonInfos.sort(this.sortFunc.bind(this));
            this._list.datas = this._commonInfos;
            let maxNum: number = this._commonInfos.length;
            let count: number = 0;
            for (let e of this._commonInfos) {
                if (e[FactionMemberFields.state]) {
                    count++;
                }
            }
            this.memberText.text = `成员(${count}/${maxNum})`;
        }

        private sortFunc(l: FactionMember, r: FactionMember): number {
            let lState: boolean = l[FactionMemberFields.state];
            let rState: boolean = r[FactionMemberFields.state];
            if (lState == rState) {
                let lFight: number = l[FactionMemberFields.fight];
                let rFight: number = r[FactionMemberFields.fight];
                if (lFight > rFight) {
                    return -1;
                } else if (lFight < rFight) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (lState) {
                return -1;
            } else if (rState) {
                return 1;
            } else {
                return 0;
            }
        }

        private set bossInfo(bossInfo: FactionMember) {
            this._bossInfo = bossInfo;
            let vipLv: number = bossInfo[FactionMemberFields.vip];
            let vipf: number = bossInfo[FactionMemberFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipMsz);
            let name: string = bossInfo[FactionMemberFields.name];
            this.nameTxt.text = name;
            let occ: number = bossInfo[FactionMemberFields.occ];
            let headImg: number = bossInfo[FactionMemberFields.headImg];
            this.headImg.skin = `assets/icon/head/${  CommonUtil.getHeadUrl(occ + headImg)}`;
            this.fightMsz.text = "战力:" + bossInfo[FactionMemberFields.fight].toString();
            let state: boolean = bossInfo[FactionMemberFields.state];
            if (state) {
                this.stateTxt.text = `在线`;
                this.stateTxt.color = `#00b70e`;
            } else {
                let lastTime: number = bossInfo[FactionMemberFields.loginTime];
                let diffTime: number = GlobalData.serverTime - lastTime;
                let time: string = CommonUtil.getTimeTypeAndTime(diffTime);
                this.stateTxt.text = `${time}前`;
                this.stateTxt.color = `#00b70e`;
            }
        }

        // 更新名字
        private updateName(): void {
            if (!this._bossInfo) return;
            let nameInfo: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (!nameInfo) return;
            if (this._bossInfo[FactionMemberFields.agentId] === nameInfo[UpdateNameReplyFields.roleID]) {
                this.nameTxt.text = nameInfo[UpdateNameReplyFields.name];
            }
        }

        // 更新职业
        private updateOcc(): void {
            if (!this._bossInfo) return;
            let occInfo: UpdateOccReply = RenameModel.instance.updateOccReply;
            if (!occInfo) return;
            if (this._bossInfo[FactionMemberFields.agentId] === occInfo[UpdateOccReplyFields.roleID]) {
                this.headImg.skin = `assets/icon/head/${occInfo[UpdateOccReplyFields.occ]}.png`;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._hufas = this.destroyElement(this._hufas);
            if (this._commonInfos) {
                this._commonInfos.length = 0;
                this._commonInfos = null;
            }
            super.destroy(destroyChild);
        }
    }
}