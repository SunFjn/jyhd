///<reference path="./clan_cfg.ts"/>
/** 战队面板 */
namespace modules.clan {
    import WindowManager = modules.core.WindowManager;
    import ClanViewUI = ui.ClanViewUI;
    import ClanInfoData = Protocols.GetMyClanInfoReply;
    import ClanBuildAndHalRefresh = Protocols.ClanBuildAndHalRefresh;
    import ClanBuildAndHalRefreshFiedls = Protocols.ClanBuildAndHalRefreshFiedls;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import CustomList = modules.common.CustomList;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ClanActorBaseAttrFields = Protocols.ClanActorBaseAttrFields;
    import ClanCfg = modules.config.ClanCfg;
    import clan = Configuration.clan;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import clanFields = Configuration.clanFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import BlendCfg = modules.config.BlendCfg;


    export class ClanPanel extends ClanViewUI {
        public _list: CustomList;
        public _hasJoinClan: boolean = true;
        private _bar: ProgressBarCtrl;

        protected initialize(): void {
            super.initialize();
            this.opView.visible = false;
            this._bar = new ProgressBarCtrl(this.expBarImg, this.expBarImg.width, this.expBarTxt);

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 40;
            this._list.y = 632;
            this._list.width = 635;
            this._list.height = 375;
            this._list.hCount = 1;
            this._list.itemRender = ClanMemberItem;
            this._list.spaceY = 1;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Update_My_Clan_Info, this, this.updateMyClanInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Open_Opreate_Member_View, this, this.openOpMemberView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_HALO_REFRESHTIME, this, this.updateClanRefreshTime);
            this.addAutoListener(this.closeOpBtn, common.LayaEvent.CLICK, this, this.closeOpBtnHandler, [1]);
            this.addAutoListener(this.kickBtn, common.LayaEvent.CLICK, this, this.kickBtnHandler);
            this.addAutoListener(this.exitBtn, common.LayaEvent.CLICK, this, this.exitBtnHandler);
            this.addAutoListener(this.ruleBtn, common.LayaEvent.CLICK, this, this.ruleBtnHandler);
            this.addAutoListener(this.dissolveBtn, common.LayaEvent.CLICK, this, this.dissolveBtnHandler);
            this.addAutoListener(this.cnBtn, common.LayaEvent.CLICK, this, this.changeNameBtnHandler);
            this.addAutoListener(this.impeachBtn, common.LayaEvent.CLICK, this, this.impeachBtnHandler);
            this.addAutoListener(this.applyListBtn, common.LayaEvent.CLICK, this, this.applyListBtnHandler);
            this.addAutoListener(this.clanListBtn, common.LayaEvent.CLICK, this, this.clanListBtnHandler);
            this.addAutoListener(this.privilegesBtn, common.LayaEvent.CLICK, this, this.privilegesBtnHandler);
            this.addAutoListener(this.buildBtn, common.LayaEvent.CLICK, this, this.buildBtnBtnHandler);
            this.addAutoListener(this.levelAwardBtn, common.LayaEvent.CLICK, this, this.levelAwardBtnHandler);
            this.addAutoListener(this.refreshBtn, common.LayaEvent.CLICK, this, this.refreshBtnHandler);
            this.addAutoListener(this.shopBtn, common.LayaEvent.CLICK, this, this.shopBtnHandler);

            this.addAutoRegisteRedPoint(this.shopRP, ["ClanShopRP"]);
            this.addAutoRegisteRedPoint(this.applyListRP, ["ClanApplyListRP"]);
            this.addAutoRegisteRedPoint(this.gradeAwardRP, ["ClanGradeAwardRP"]);
        }
        private wxIosPayShow(){
            this.shopBtn.visible = !Main.instance.isWXiOSPay;
        }

        public onOpened(): void {
            super.onOpened();
            this.updateClanRefreshTime();
            ClanCtrl.instance.getMyClanInfo();
            this.wxIosPayShow();
        }
        public updateClanRefreshTime(): void {
            let consume: Array<string> = ClanModel.instance.getRefreshHaloConsume();
            this.costImg.skin = consume[0];
            this.costTxt.text = consume[1];
        }
        //更新我的战队信息
        public updateMyClanInfo(): void {
            let data: ClanInfoData = ClanModel.instance.myClanInfo;
            //技能配置表
            let skill_info = SkillCfg.instance.getCfgById(data[ClanInfoDataFields.fightTeamSkillHalo]);
            let haloDesc: string = skill_info[skillFields.des];
            let lv = data[ClanInfoDataFields.level];
            let cfg: clan = ClanCfg.instance.getCfgByLv(lv);
            let maxNum: number = cfg[clanFields.memerLimit];
            let nextExp: number = cfg[clanFields.exp];
            //更新界面信息
            this.nameTxt.text = data[ClanInfoDataFields.name];
            this.numTxt.text = `人数：${data[ClanInfoDataFields.member].length}/${maxNum}`;
            this.levelTxt.text = `等级：${lv}`;
            this.haloTxt.text = haloDesc;

            this.expBarTxt.text = `${data[ClanInfoDataFields.exp]}/${nextExp}`;
            this.iconImg.skin = `clan/totem_${data[ClanInfoDataFields.flagIndex]}.png`;

            this._bar.maxValue = nextExp;
            this._bar.value = data[ClanInfoDataFields.exp];
            //设置战队成员数据
            this._list.datas = data[ClanInfoDataFields.member];
            //更新申请列表最低战力显示
            GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_JOIN_LIMIT);
        }
        //关闭操作玩家界面
        private closeOpBtnHandler(): void {
            this.opView.visible = false;
            this.removeStageListener();
        }
        //打开操作玩家面板
        public openOpMemberView(curSelectItemY: number) {
            let targetY = this._list.y + curSelectItemY + 72;
            let curItemPos: number = this._list.selectedData[ClanActorBaseAttrFields.pos];
            let myPos = ClanModel.instance.myClanInfo[ClanInfoDataFields.pos];
            this.opView.y = targetY;
            this.opView.x = 411;
            //我是队长
            if (myPos == 1) {
                if (curItemPos == 1) {
                    this.changeOpViewDisplay(140, ["dissolve", "cn"]);
                } else {
                    this.changeOpViewDisplay(88, ["kick"]);
                }
            }
            //我是普通成员 
            else {
                let isMe: boolean = PlayerModel.instance.actorId == this._list.selectedData[ClanActorBaseAttrFields.agentId];
                if (isMe) {
                    this.changeOpViewDisplay(88, ["exit"]);
                } else if (curItemPos == 1) {
                    this.changeOpViewDisplay(88, ["impeach"]);
                }
                else {
                    SystemNoticeManager.instance.addNotice(`没有权限操作其他玩家!`, true);
                }
            }
        }

        //改变操作玩家界面需要显示的按钮
        private changeOpViewDisplay(height: number, arr: Array<string>) {
            this.addStageListener();
            this.opView.visible = true;
            this.opView.height = height;
            this.kickBtn.visible = arr.indexOf("kick") != -1;
            this.exitBtn.visible = arr.indexOf("exit") != -1;
            this.dissolveBtn.visible = arr.indexOf("dissolve") != -1;
            this.cnBtn.visible = arr.indexOf("cn") != -1;
            this.impeachBtn.visible = arr.indexOf("impeach") != -1;
        }
        //战队改名
        private changeNameBtnHandler() {
            ClanModel.instance.createClanOrCN = { isChangeName: true };
            WindowManager.instance.open(WindowEnum.CLAN_CREATE_ALERT);
        }
        //踢出玩家出战队
        private kickBtnHandler() {
            let agentID: number = this._list.selectedData[ClanActorBaseAttrFields.agentId];
            let name: string = this._list.selectedData[ClanActorBaseAttrFields.name];
            let desc = `确定要踢玩家<span style='color:#ff3e3e'>${name}</span>出战队吗?`;
            this.opMemberTips(desc, () => { ClanCtrl.instance.kickMember([agentID]); });
        }
        //弹劾队长
        private impeachBtnHandler() {
            this.opMemberTips("确定要弹劾队长吗?", () => { console.log(",.........."); });
        }
        //退出战队
        private exitBtnHandler() {
            this.opMemberTips("确定要退出战队吗?", () => { ClanCtrl.instance.exitClan(); });
        }

        //解散战队
        private dissolveBtnHandler() {
            let uuid: string = ClanModel.instance.myClanInfo[ClanInfoDataFields.uuid];
            let word: string = `解散后该战队的数据将<span style='color:#ff3e3e'>全部清除且无法恢复</span>,是否继续?`;
            this.opMemberTips(word, () => { ClanCtrl.instance.dissolveClan([uuid]); });
        }
        //操作成员通用提示
        private opMemberTips(word: string, fun: Function) {
            let handler: Handler = Handler.create(this, fun);
            this.closeOpBtnHandler();
            CommonUtil.alert(`温馨提示`, word, [handler]);
        }
        private addStageListener(): void {
            Laya.stage.on(common.LayaEvent.MOUSE_DOWN, this, this.hideOpView);
        }
        private removeStageListener(): void {
            Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.hideOpView);
        }
        private hideOpView(e: Event) {
            if (e.target instanceof Laya.Button && e.target.parent.name == "opView") return;
            this.closeOpBtnHandler();
        }
        //打开战队申请列表
        public applyListBtnHandler(): void {
            let pos = ClanModel.instance.myClanInfo[ClanInfoDataFields.pos];
            if (pos == 0) {
                SystemNoticeManager.instance.addNotice("没有对应权限!", true);
            } else {
                WindowManager.instance.open(WindowEnum.CLAN_APPLY_LIST_ALERT);
            }
        }
        //打开战队列表
        public clanListBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CLAN_LIST_ALERT);
        }
        //打开战队特权弹窗
        public privilegesBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CLAN_PRIVILEGE_ALERT);
        }
        //打开战队建设弹窗
        public buildBtnBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CLAN_BUILD_ALERT);
        }
        //打开等级奖励
        public levelAwardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CLAN_GRADEAWARD_ALERT);
        }
        //战队规则按钮
        private ruleBtnHandler() {
            WindowManager.instance.open(WindowEnum.CLAN_RULE_ALERT);
        }
        //刷新战队光环
        private refreshBtnHandler() {
            WindowManager.instance.open(WindowEnum.CLAN_HALO_REFRESH_ALERT)
        }
        //商城面板
        private shopBtnHandler() {
            WindowManager.instance.openByActionId(ActionOpenId.ClanStore)
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            this._list = this.destroyElement(this._list);
        }
    }
}
