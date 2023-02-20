/**单人boss面板*/
///<reference path="../config/scene_temple_boss_cfg.ts"/>
///<reference path="../config/scene_copy_cloudland.ts"/>


namespace modules.sheng_yu {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import BtnGroup = modules.common.BtnGroup;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;


    type BossStateInfo = [number, BossState];
    export class ShengYuBossPanel extends ui.ShengYuBossViewUI {
        private _list: CustomList;
        private _btnGroup: BtnGroup;

        constructor() {
            super()
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.universeBossBtn, this.shengYuBossBtn, this.bossHomeBtn);

            this._list = new CustomList();
            this._list.width = 720;
            this._list.height = 950;
            this._list.hCount = 1;
            this._list.spaceY = -1;
            this._list.itemRender = ShengYuBossItem;
            this._list.x = 0;
            this._list.y = 100;
            this.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
            ShenYuBossCtrl.instance.GetStrength();
            this.showDrawNum();
            let cengList = ClasSsceneTempleBossCfg.instance.getCengDictionaryKeys();
            cengList.sort(this.sortFunc.bind(this));
            ShengYuBossModel.instance._moRengCeng = cengList[0];
            this._list.datas = cengList;
            GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_OPENONE);
            CustomList.showListAnim(modules.common.showType.HEIGHT,this._list);
        }

        private sortFunc(a: number, b: number): number {
            let aState = this.getState(a);
            let bState = this.getState(b);
            if (aState == 1 && 1 == bState) {
                return a < b ? 1 : -1;
            }
            else if (aState == 0 && 0 == bState) {
                return a < b ? -1 : 1;
            }
            else {
                return aState < bState ? 1 : -1;
            }
        }

        public getState(ceng: number): number {
            let lev = modules.born.BornModel.instance.lv;
            let _datas = ClasSsceneTempleBossCfg.instance.getCfgsByGrade(ceng, 0);
            let eraCondition = _datas[scene_temple_bossFields.eraLevel];//限制的 觉醒等级
            if (lev >= eraCondition) {
                return 1;
            }
            return 0;
        }


        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._btnGroup.selectedIndex = 1;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.addBtn, Event.CLICK, this, this.addBtnHandler);
            this.addAutoListener(this.ziDongBtn, Event.CLICK, this, this.ziDongBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_OPENUPDATE, this, this.updateOpenList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_UPDATE, this, this.showDrawNum);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_ZIDONG_UPDATE, this, this.showZiDongBtn);


            RedPointCtrl.instance.registeRedPoint(this.threeWorldsRP, ["threeWorldsRP"]);
            RedPointCtrl.instance.registeRedPoint(this.bossHomeRP, ["bossHomeRP"]);
            RedPointCtrl.instance.registeRedPoint(this.shengYuBossRP, ["shenYuBossRP"]);
        }
        protected removeListeners(): void {
            super.removeListeners();
            RedPointCtrl.instance.retireRedPoint(this.threeWorldsRP);
            RedPointCtrl.instance.retireRedPoint(this.bossHomeRP);
            RedPointCtrl.instance.retireRedPoint(this.shengYuBossRP);
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.THREE_WORLDS_PANEL);
                this._btnGroup.selectedIndex = 1;
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.BOSS_HOME_PANEL);
                this._btnGroup.selectedIndex = 1;
            }
        }

        private addBtnHandler(): void {
            ShengYuBossModel.instance.addHandler();
        }
        private ziDongBtnHandler(): void {
            if (ShengYuBossModel.instance._bollZiDong) {
                ShenYuBossCtrl.instance.SetStrength(0);
            }
            else {
                let TiLiDanNum = modules.bag.BagModel.instance.getItemCountById(ShengYuBossModel.instance.itemId);
                if (TiLiDanNum > 0) {
                    ShenYuBossCtrl.instance.SetStrength(1);
                }
                else {
                    modules.notice.SystemNoticeManager.instance.addNotice("背包中没有魔界抗疲劳秘药", true);
                }
            }
        }
        public showZiDongBtn() {
            if (ShengYuBossModel.instance._bollZiDong) {
                this.ziDongBtn.selected = true;
            }
            else {
                this.ziDongBtn.selected = false;
            }
        }
        //13640002
        private showDrawNum(): void {
            let totalCiShu = ShengYuBossModel.instance.maxTiLi;
            let remainTimes = ShengYuBossModel.instance.stength;
            let tiliLimit = ShengYuBossModel.instance.tiliLimit;
            
            this.drawNum.text = `${remainTimes}/${totalCiShu + tiliLimit}`;
            let colorStr = "#ff3e3e";
            remainTimes == 0 ? colorStr = "#ff3e3e" : colorStr = "#168a17";
            this.drawNum.color = colorStr;
            this.showZiDongBtn();
        }
        public updateOpenList() {
            //这个不刷新数据  只刷新 list 排版
            this._list.relayout();
        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            super.destroy(destroyChild);
        }
    }
}