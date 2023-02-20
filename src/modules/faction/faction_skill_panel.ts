///<reference path="../config/faction_skill_cfg.ts"/>
/** 技能面板 */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import CommonEventType = modules.common.CommonEventType;
    import BtnGroup = modules.common.BtnGroup;
    import FactionSkillCfg = modules.faction.FactionSkillCfg;
    import FactionSkillViewUI = ui.FactionSkillViewUI;
    import CustomList = modules.common.CustomList;

    export class FactionSkillPanel extends FactionSkillViewUI {

        private _list: CustomList;
        private _btnGroup: BtnGroup;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 40;
            this._list.y = 320;
            this._list.width = 720;
            this._list.height = 700;
            this._list.hCount = 2;
            this._list.itemRender = FactionSkillItem;
            this._list.spaceY = 10;
            this._list.spaceX = 10;
            this.addChildAt(this._list, 3);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_SKILL_LIST, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateCurrency);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.updateView);
            this._btnGroup.selectedIndex = 0;

            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.aboutBtnHandler);

            this.addAutoRegisteRedPoint(this.wealRPImg, ["factionDialRP"]);
            this.addAutoRegisteRedPoint(this.skillRPImg, ["factionSkillRP"]);
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getFactionSkillList();

            this.updateView();
            CustomList.showListAnim(modules.common.showType.HEIGHT,this._list);
        }

        private updateView(): void {
            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.FACTION_WEAL_PANEL);
                return;
            }
            this.updateCurrency();
        }

        private updateList(): void {
            let ids: number[] = FactionModel.instance.getShowSkillIds;
            this._list.datas = ids;
            this._list.scrollPos = this._list.scrollPos;
        }

        private updateCurrency(): void {
            let id: number = MoneyItemId.factionContribute;
            let num: number = FactionModel.instance.contribution;
            this.iconImg.skin = CommonUtil.getIconById(id, true);
            this.countTxt.text = `贡献:${num}`;
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20054);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy(destroyChild);
        }
    }
}