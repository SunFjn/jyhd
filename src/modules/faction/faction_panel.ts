///<reference path="./faction_manage_panel.ts"/>
/** 仙盟面板 */
namespace modules.faction {
    import FactionCtrl = modules.faction.FactionCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import WindowManager = modules.core.WindowManager;
    import FactionViewUI = ui.FactionViewUI;
    import FactionMember = Protocols.FactionMember;
    import FactionMemberFields = Protocols.FactionMemberFields;
    import faction = Configuration.faction;
    import FactionCfg = modules.config.FactionCfg;
    import factionFields = Configuration.factionFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import CustomList = modules.common.CustomList;

    export class FactionPanel extends FactionViewUI {

        private _bar: ProgressBarCtrl;
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._bar = new ProgressBarCtrl(this.expBarImg, this.expBarImg.width, this.expBarTxt);

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 9;
            this._list.y = 516;
            this._list.width = 703;
            this._list.height = 504;
            this._list.hCount = 1;
            this._list.itemRender = FactionFuncEnterItem;
            this._list.spaceY = 3;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.operaBtn, common.LayaEvent.CLICK, this, this.operaBtnHandler);
            this.addAutoListener(this.rankImg, common.LayaEvent.CLICK, this, this.rankImgHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateView);

            this.addAutoRegisteRedPoint(this.rpImg, ["factionApplyJoinRP", "factionPostApplyRP"]);
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getBoxInfo();
            FactionCtrl.instance.getFactionCopyInfo();
            this.updateView();
            this.updateList();
            CustomList.showListAnim(modules.common.showType.HEIGHT,this._list);
        }

        private updateList(): void {
            this._list.datas = [`baozang`, `zhuxian`, null, null];
        }

        public close(): void {
            super.close();
            WindowManager.instance.close(WindowEnum.FACTION_MANAGE_PANEL);
        }

        private updateView(): void {
            let boss: FactionMember = FactionModel.instance.bossInfo;
            if(boss){
                this.bossTxt.text = `${boss[FactionMemberFields.name]}`;
            }
            let fight: string = CommonUtil.bigNumToString(FactionModel.instance.fight);
            this.fightTxt.text = `${fight}`;
            let lv: number = FactionModel.instance.lv;
            this.lvMsz.value = lv.toString();
            let cfg: faction = FactionCfg.instance.getCfgByLv(lv);
            let maxNum: number = cfg[factionFields.memerLimit];
            let currNum: number = FactionModel.instance.memberList.length;
            this.numTxt.text = `${currNum}/${maxNum}`;
            this._bar.maxValue = cfg[factionFields.exp];
            let currExp: number = FactionModel.instance.exp;
            this._bar.value = currExp;
            this.rankTxt.text = `${FactionModel.instance.rank}`;
            this.contributeTxt.text = `${FactionModel.instance.contribution}`;
            this.noticeTxt.text = FactionModel.instance.notice;
            this.nameTxt.text = FactionModel.instance.name;
        }

        private operaBtnHandler(): void {
            if (WindowManager.instance.getPanelById(WindowEnum.FACTION_MANAGE_PANEL) && WindowManager.instance.isOpened(WindowEnum.FACTION_MANAGE_PANEL)) {
                WindowManager.instance.close(WindowEnum.FACTION_MANAGE_PANEL);
                return;
            }
            WindowManager.instance.open(WindowEnum.FACTION_MANAGE_PANEL);
        }

        private rankImgHandler(): void {
            WindowManager.instance.open(WindowEnum.RANKING_LIST_PANEL, RankType.faction);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._bar = this.destroyElement(this._bar);
            super.destroy(destroyChild);
        }
    }
}
