///<reference path="../config/rune_collect_cfg.ts"/>

namespace modules.rune {
    import RuneCollectViewUI = ui.RuneCollectViewUI;
    import Event = Laya.Event;
    import CustomList = modules.common.CustomList;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import RuneCollectGradeInfo = Protocols.RuneCollectGradeInfo;
    import RuneCollectGradeInfoFields = Protocols.RuneCollectGradeInfoFields;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import RuneCollectCfg = modules.config.RuneCollectCfg;
    import rune_collect_grade = Configuration.rune_collect_grade;
    import rune_collect_gradeFields = Configuration.rune_collect_gradeFields;
    import CustomClip = modules.common.CustomClip;

    export class RuneCollectPanel extends RuneCollectViewUI {
        private _list: CustomList;
        private _current_selected_id: number;
        private _money_enough: boolean;
        private _view_item_ids: Array<number>;
        private _waveClip: CustomClip;
        private _tween: TweenJS;
        // 波浪进度
        private _wavePro: number;

        protected initialize(): void {
            super.initialize();
            this._view_item_ids = [];
            this.centerX = this.centerY = 0;
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = RuneCollectItem;
            this._list.hCount = 3;
            this._list.width = 624;
            this._list.height = 491;
            this._list.x = 52;
            this._list.y = 280;
            this._list.spaceY = 2;
            this.addChild(this._list);


            this._waveClip = new CustomClip();
            this.box_wave.addChildAt(this._waveClip, 0);
            this._waveClip.skin = "assets/effect/wave.atlas";
            this._waveClip.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png", "wave/5.png", "wave/6.png", "wave/7.png"];
            this._waveClip.durationFrame = 5;
            this._waveClip.play();
            this._waveClip.pos(0, 124, true);
        }

        protected onOpened(): void {
            super.onOpened();
            this._waveClip.play();
            RuneCtrl.instance.getRuneCollectInfoReq();
        }

        public close() {
            super.close();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn_help, Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.cur_icon, Event.CLICK, this, this.showItemInfoDialog, [0]);
            this.addAutoListener(this.uplevel_icon, Event.CLICK, this, this.showItemInfoDialog, [1]);
            this.addAutoListener(this.btn_upLevel, Event.CLICK, this, this.upLevelHandler);
            this.addAutoListener(this.box_process, Event.CLICK, this, this.showJieHandler);
            this.addAutoListener(this.btn_dismantle, Event.CLICK, this, this.dismantleHandler);
            this.addAutoListener(this._list, Event.SELECT, this, this.selectItemHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COLLECT_UPDATE_INFO, this, this.updataView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COLLCET_REFRESH_ITEM_DATA, this, this.updataSingleData);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_UPDATE_SP_INFO, this, this.updateSPRPStatus);
        }

        /**
         * 收集专家可升阶的红点
         */
        private updateSPRPStatus(): void {
            let cur = RuneModel.instance.collcetProcess[0];
            let need = RuneModel.instance.collcetProcess[1];
            this.rp_sp.visible = cur >= need;
            if(RuneModel.instance.isCollectMaxed) {
                this.rp_sp.visible = false
            }
        }

        /**
         * 刷新选择的item的数据
         */
        private updataSingleData(): void {
            this._list.updateSelectedData = RuneModel.instance.currentCollectItemData;
            // 更新选择的数据
            this.selectItemHandler();

            // 更新波浪进度
            // let cur = RuneModel.instance.collcetProcess[0];
            // let total = RuneModel.instance.collcetProcess[1];

            // this._waveClip.y = (cur / total) * 125;
            // this._tween && this._tween.stop();
            // this._tween = TweenJS.create(this).to({ wavePro: (cur / total) }, (1 - (cur / total)) * 500).start();

            this.refreshPrecess();
        }

        /**
         * 刷新进度条
         * 
         * @param opend 是否是打开面板时
         * @returns 
         */
        private refreshPrecess(opend: boolean = false) {
            // 更新波浪进度
            let cur = RuneModel.instance.collcetProcess[0];
            let total = RuneModel.instance.collcetProcess[1];
            let collect_jieji = RuneModel.instance.collcetLevel;

            this.txt_jieji.text = `收集专家 ${collect_jieji}阶`;
            this.txt_jieji_exp.text = `${cur}/${total}`;
            if(RuneModel.instance.isCollectMaxed) {
                this.txt_jieji_exp.text = "已满级";
            }

            if (opend) {
                this.wavePro = cur / total;
                return;
            }
            // this._waveClip.y = (cur / total) * 125;
            this._tween && this._tween.stop();
            this._tween = TweenJS.create(this).to({ wavePro: (cur / total) }, (1 - (cur / total)) * 500).start();
        }

        // 设置波浪进度
        public get wavePro(): number {
            return this._wavePro;
        }

        public set wavePro(value: number) {
            if (value <= 0) value = 0;
            if (value >= 1) value = 1;
            this._wavePro = value;
            this._waveClip.y = (1 - value) * 125;

        }


        private updataView(): void {
            this.refreshPrecess(true);

            // 收集箱列表更新
            this._list.datas = RuneModel.instance.collcetList;

            // 默认选择第一个
            this._list.selectedIndex = 0;
        }

        /**
         * 查看玉荣的属性
         * 
         * @param type 
         */
        private showItemInfoDialog(type: number) {
            let view_id: number = this._view_item_ids[type];

            // -1 表示已经达到最大等级，没有升级材料显示
            if (view_id == -1) {
                return;
            }

            WindowManager.instance.open(WindowEnum.PROP_ALERT, [view_id, 1, 0, null]);
        }

        /**
         * 选择item
         */
        private selectItemHandler(): void {
            GlobalData.dispatcher.event(CommonEventType.RUNE_COLLECT_UPDATE_SELECT_SMALL_HANDLER, this._list.selectedIndex);
            let curItemData: RuneCollectGradeInfo = this._list.selectedData;

            let id: number = curItemData[RuneCollectGradeInfoFields.id];
            let stars: number = curItemData[RuneCollectGradeInfoFields.stars];
            let grade: number = curItemData[RuneCollectGradeInfoFields.grade];
            let rune: item_rune = modules.config.ItemRuneCfg.instance.getCfgById(id);
            let level = curItemData[RuneCollectGradeInfoFields.level];
            this._current_selected_id = id;

            // 当前选择的玉荣属性赋值
            this.cur_icon.skin = `assets/icon/item/${rune[item_runeFields.ico]}.png`;
            this.txt_curExp.text = `${rune[item_runeFields.name]} ${grade}阶`;
            this.level_star_1.visible = stars >= 1;
            this.level_star_2.visible = stars >= 2;
            this.level_star_3.visible = stars >= 3;

            // 当前等级加成
            let runeData: rune_collect_grade = RuneCollectCfg.instance.getCfgByIdLevel(id, level);
            let runeAttr = AttrItemCfg.instance.getCfgById(runeData[rune_collect_gradeFields.attrs][0][0]);
            let attName = runeAttr[attr_itemFields.name];
            let runeVal: string | number = runeData[rune_collect_gradeFields.attrs][0][1];
            let calcRuneVal = runeVal;
            runeVal = runeAttr[attr_itemFields.isPercent] ? modules.common.AttrUtil.formatFloatNum(runeVal) + "%" : Math.round(runeVal) + "";;
            let cur_attr_desc = `${attName}: ${runeVal}`;
            this.txt_curAttr.text = cur_attr_desc;
            this.powerNum.value = runeData[rune_collect_gradeFields.fighting] + "";
            this.box_power.visible = runeData[rune_collect_gradeFields.fighting] > 0;

            // 下一等级级加成
            let nextRuneData: rune_collect_grade = RuneCollectCfg.instance.getNextCfgByIdLevel(id, level);
            if (nextRuneData) {
                let nextRuneAttr = AttrItemCfg.instance.getCfgById(nextRuneData[rune_collect_gradeFields.attrs][0][0]);
                // 下一级减去上一级的属性为新增的属性
                let nextRuneVal: string | number = nextRuneData[rune_collect_gradeFields.attrs][0][1] - calcRuneVal;
                nextRuneVal = nextRuneAttr[attr_itemFields.isPercent] ? modules.common.AttrUtil.formatFloatNum(nextRuneVal) + "%" : Math.round(nextRuneVal) + "";
                this.txt_nextAttr.text = nextRuneVal;
                this.btn_upLevel.gray = false;
                this.btn_upLevel.mouseEnabled = true;
                this.btn_upLevel.label = "升级";
            } else {
                this.txt_nextAttr.text = "已满级";
                this.btn_upLevel.label = "已满级";
                this.btn_upLevel.gray = true;
                this.btn_upLevel.mouseEnabled = false;
            }
            if(RuneModel.instance.isCollectMaxed) {
                this.txt_jieji_exp.text = "已满级";
            }

            let need_item_id = -1;

            // 升级消耗
            let refineItem = runeData[rune_collect_gradeFields.refineItem];
            if ((refineItem as Array<number>).length != 0 && nextRuneData) {
                let upLevelID = refineItem[0];
                let nextRune = modules.config.ItemRuneCfg.instance.getCfgById(id);
                let upLevelConsume = refineItem[1];

                let total_count = RuneModel.instance.getRuneCountByDimID(upLevelID);

                this.uplevel_icon.skin = `assets/icon/item/${nextRune[item_runeFields.ico]}.png`;
                this.txt_consume.text = `${total_count}/${upLevelConsume}`
                this.txt_consume.color = upLevelConsume <= total_count ? "#ffefcf" : "red";
                this._money_enough = upLevelConsume <= total_count;
                this.rp_uplevel.visible = upLevelConsume <= total_count;
                need_item_id = upLevelID + 1;
                this.txt_consume.visible = true;
            } else {
                this.txt_consume.visible = false;
                this.rp_uplevel.visible = false;
                this.uplevel_icon.skin = `assets/icon/item/${rune[item_runeFields.ico]}.png`;
            }

            this._view_item_ids = [id + (level || 1), need_item_id]
        }

        /**
         * 帮助界面
         */
        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(20073);
        }

        /**
         * 升级当前玉荣
         */
        private upLevelHandler(): void {
            if (!this._money_enough) {
                let curItemData: RuneCollectGradeInfo = this._list.selectedData;
                let need_id: number = curItemData[RuneCollectGradeInfoFields.id];
                modules.bag.BagUtil.openLackPropAlert(need_id, 1);
                return;
            }

            RuneCtrl.instance.runeCollectUpLevelReq([this._current_selected_id]);
        }

        /**
         * 拆解当前玉荣
         */
        private dismantleHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_DISMANTLE_ALERT, this._list.selectedData);
        }


        /**
         * 收集专家弹窗
         */
        private showJieHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_COLLECT_LEVEL_ALERT);
        }



        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            if (this._waveClip) {
                this._waveClip.removeSelf();
                this._waveClip.destroy();
                this._waveClip = null;
            }

            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
        }

    }
}