///<reference path="../dungeon/dungeon_model.ts"/>


/** 日常副本面板*/


namespace modules.dailyDungeon {
    import DailyDungeonUI = ui.DailyDungeonUI;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import DungeonModel = modules.dungeon.DungeonModel;
    import BagModel = modules.bag.BagModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import LayaEvent = modules.common.LayaEvent;
    export class DailyDungeonPanel extends DailyDungeonUI {

        private _btnGroup: BtnGroup;
        private _list: CustomList;

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.towerBtn, this.dailyBtn, this.runeCopyBtn);

            this._list = new CustomList();
            this._list.hCount = 1;
            this._list.spaceY = 0;
            this._list.itemRender = DailyDungeonItem;
            this._list.width = 705;
            this._list.zOrder = 10;
            this._list.height = 680;
            this._list.pos(7, 130, true);
            this.addChildAt(this._list, 10);

            this.regGuideSpr(GuideSpriteId.BIG_TOWER_TAB_BTN, this.towerBtn);
            this.regGuideSpr(GuideSpriteId.DAILY_DUNGEON_TAB_BTN, this.dailyBtn);
            this.regGuideSpr(GuideSpriteId.RUNE_COPY_TAB_BTN, this.runeCopyBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBtnHandler);
            this.addAutoListener(this.oneKeyTzBtn, LayaEvent.CLICK, this, this.oneKeyTzBtnHandler);
            this.addAutoListener(this.oneKeySdBtn, LayaEvent.CLICK, this, this.oneKeySdBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YIJIAN_SAODANG_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_TIMES_UPDATE, this, this.showUI);
            this.addAutoRegisteRedPoint(this.bigTowerRP, ["bigTowerRP"]);
            this.addAutoRegisteRedPoint(this.dailyDungeonRP, ["dailyDungeonRP"]);
            this.addAutoRegisteRedPoint(this.runeCopyRP, ["runeCopyRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1;
            modules.dungeon.DungeonCtrl.instance.getCopyTimes();
            this.showUI();
        }

        public showUI() {
            // 可挑战的副本>可扫荡的副本>不可扫荡的副本，同状态按配置的顺序从上往下排
            let shuju = [
                [SCENE_ID.scene_copper_copy, ActionOpenId.copperCopy, 0],
                [SCENE_ID.scene_zq_copy, ActionOpenId.zqCopy, 1],
                [SCENE_ID.scene_xianqi_copy, ActionOpenId.rideCopy, 2],
                [SCENE_ID.scene_pet_copy, ActionOpenId.petCopy, 3],
                [SCENE_ID.scene_shenbing_copy, ActionOpenId.shenbingCopy, 4],
                [SCENE_ID.scene_wing_copy, ActionOpenId.wingCopy, 5],
                [SCENE_ID.scene_fashion_copy, ActionOpenId.fashionCopy, 6],
                [SCENE_ID.scene_xilian_copy, ActionOpenId.xilianCopy, 7],
                [SCENE_ID.scene_tianzhu_copy, ActionOpenId.tianzhuCopy, 8],
                //[SCENE_ID.scene_guanghuan_copy, ActionOpenId.guanghuanCopy, 9]
            ];
            shuju.sort(this.sortList.bind(this));
            this._list.datas = shuju;
            CustomList.showListAnim(modules.common.showType.HEIGHT, this._list);
        }
        public sortList(A: Array<number>, B: Array<number>): number {
            let stateA = modules.dungeon.DungeonModel.instance.getStateById(A[0]);
            let stateB = modules.dungeon.DungeonModel.instance.getStateById(B[0]);
            let IDA = A[2];
            let IDB = B[2];
            let actionOpenIdA = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(A[1]);
            let actionOpenIdB = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(B[1]);

            if ((actionOpenIdA && actionOpenIdB) || (!actionOpenIdA && !actionOpenIdB)) {
                if (stateA == stateB) {
                    return IDA > IDB ? 1 : -1;
                }
                else {
                    return stateA > stateB ? -1 : 1;
                }
            }
            else {
                if (actionOpenIdA && !actionOpenIdB) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        }

        private changeBtnHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.BIG_TOWER);
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.RUNE_COPY_PANEL);
            }
        }
        public oneKeyTzBtnHandler() {
            let shuju = DungeonModel.instance.getSdMoneyOrCishu(2); //
            if (modules.zhizun.ZhizunModel.instance.state == 1) {
                if (shuju[0] != 0) {
                    // let str = `<span style='color:#2a2a2a'>将</span>
                    //         <span style='color:#FF3e3e'>剩余的挑战次数</span>
                    //         <span style='color:#2a2a2a'>全部一键挑战</span>
                    //         <span style='color:#2a2a2a'>,是否确定挑战?</span>`;
                    // CommonUtil.alert('温馨提示', str, [Handler.create(this, this.TzBtnHandler)], [null], true);
                    this.TzBtnHandler();
                }
                else {
                    // CommonUtil.alert('温馨提示', "当前无可一键挑战副本");
                    if (shuju[1]) {
                        SystemNoticeManager.instance.addNotice("副本每个难度需要挑战成功一次后才能一键挑战", true);
                    }
                    else {
                        SystemNoticeManager.instance.addNotice("挑战次数不足", true);
                    }
                }

            }
            else {
                let str = `<span style='color:#2a2a2a'>激活</span>
                            <span style='color:#e0b75f'>【至尊特权】</span>
                            <span style='color:#2a2a2a'> 可开启一键挑战特权,是否前往激活</span>`;
                CommonUtil.alert('温馨提示', str, [Handler.create(this, this.openZHIZUN_PANEL)], [null], true);
            }
        }
        public oneKeySdBtnHandler() {
            let shuju = DungeonModel.instance.getSdMoneyOrCishu(1); //
            if (modules.zhizun.ZhizunModel.instance.state == 1) {
                if (shuju[0] != 0) {
                    let str = `<span style='color:#2a2a2a'>将</span>
                                <span style='color:#FF3e3e'> 剩余的扫荡次数 </span>
                                <span style= 'color:#2a2a2a'> 全部一键扫荡需要消耗 </span>
                                <img src= "common/icon_tongyong_2.png"/>
                                <span style='color:#2a2a2a'> ${shuju[0]}</span>
                                <span style= 'color:#2a2a2a'>,是否确定扫荡?</span>`;
                    CommonUtil.alert('温馨提示', str, [Handler.create(this, this.SdBtnHandler)], [null], true);
                }
                else {
                    // CommonUtil.alert('温馨提示', "当前无可一键扫荡副本");
                    if (shuju[1]) {
                        SystemNoticeManager.instance.addNotice("挑战副本成功后可扫荡", true);
                    }
                    else {
                        SystemNoticeManager.instance.addNotice("扫荡次数不足", true);
                    }
                }
            }
            else {
                let str = `<span style='color:#2a2a2a'>激活</span>
                            <span style='color:#e0b75f'>【至尊特权】</span>
                            <span style='color:#2a2a2a'>可开启一键扫荡特权,是否前往激活</span>`;
                CommonUtil.alert('温馨提示', str, [Handler.create(this, this.openZHIZUN_PANEL)], [null], true);
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }
        private openZHIZUN_PANEL(): void {
            WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
        }
        private TzBtnHandler(): void {
            DungeonCtrl.instance.oneKeyChallengeShilianCopy();//一键挑战试炼副本
        }
        private SdBtnHandler(): void {
            let shuju = DungeonModel.instance.getSdMoneyOrCishu(1);
            let num = PlayerModel.instance.getCurrencyById(MoneyItemId.glod);
            if (num == null) {
                num = BagModel.instance.getItemCountById(MoneyItemId.glod);
            }
            if (num >= shuju[0]) {
                DungeonCtrl.instance.oneKeySweepShilianCopy();//一键扫荡试炼副本
            }
            else {
                CommonUtil.goldNotEnoughAlert();
            }
        }
    }
}