///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_copy_cloudland.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import SceneCopyCloudlandCfg = modules.config.SceneCopyCloudlandCfg;
    import BossJudgeAward = Protocols.BossJudgeAward;

    export class YunMengMiJingBossPanel extends ui.YunMengMiJingBossViewUI {
        private _list: CustomList;
        private _listState: boolean = true;
        private _xianLingTipsImgTween: TweenJS;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.right = 6;
            this.bottom = 227;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._list = new CustomList();
            this._list.width = 356;
            this._list.height = 174;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.itemRender = YunMengMiJingBossItem;
            this._list.x = 12;
            this._list.y = 45;
            this._list.selectedIndex = -1;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.expandBtn.on(Event.CLICK, this, this.expandBtnHandler);
            this._list.on(Event.SELECT, this, this.selectHandler);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateMyRecord);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YUNMENGMIJING_JUDGE_AWARD_UPDATE, this, this.showBossJudgeAward);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YUNMENGMIJING_JUDGE_AWARD_FINALLY, this, this.showBossJudgeAwardFinally);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YUNMENGMIJING_CLICK, this, this.disTipsImg);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.expandBtn.off(Event.CLICK, this, this.expandBtnHandler);
            this._list.off(Event.SELECT, this, this.selectHandler);
            if (this._xianLingTipsImgTween) {
                this._xianLingTipsImgTween.stop();
                this._xianLingTipsImgTween = null;
            }
        }

        public onOpened(): void {
            super.onOpened();
            this._list.selectedIndex = -1;
            this.updateMyRecord();
            this.tipImg.visible = true;
            if (this._xianLingTipsImgTween) {
                this._xianLingTipsImgTween.stop();
            }
            this._xianLingTipsImgTween = TweenJS.create(this.tipImg).to({ y: this.tipImg.y - 20 },
                1000).start().yoyo(true).repeat(99999999);
        }
        public disTipsImg() {
            this.tipImg.visible = false;
            if (this._xianLingTipsImgTween) {
                this._xianLingTipsImgTween.stop();
            }
        }
        public showBossJudgeAwardFinally(award: BossJudgeAward) {
            if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_WIN_ALERT)) {
                if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_AWARD_ALERT)) {
                    if (!award) {//在没有界面的情况下 是没有数据的 这时候手动取一次数据
                        award = YunMengMiJingModel.instance.allBossJudgeAward;
                    }
                    if (award) {
                        WindowManager.instance.openDialog(WindowEnum.YUNMENGMIJING_AWARD_ALERT, award);
                    }
                }
                // if (WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_AWARD_ALERT)) {
                //     if (WindowManager.instance.getDialogById(WindowEnum.YUNMENGMIJING_AWARD_ALERT)) {
                //         WindowManager.instance.getDialogById(WindowEnum.YUNMENGMIJING_AWARD_ALERT).setOpenParam(award);
                //     }
                // } else {
                //     WindowManager.instance.openDialog(WindowEnum.YUNMENGMIJING_AWARD_ALERT, award);
                // }
            }

        }

        public showBossJudgeAward(award: BossJudgeAward) {
            if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_AWARD_ALERT)) {
                if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_WIN_ALERT)) {
                    if (!award) {//在没有界面的情况下 是没有数据的 这时候手动取一次数据
                        award = YunMengMiJingModel.instance.allBossJudgeAward;
                    }
                    if (award) {
                        WindowManager.instance.openDialog(WindowEnum.YUNMENGMIJING_WIN_ALERT, award);
                    }
                }
            }
        }

        private selectHandler(): void {
            if (this._list.selectedIndex == -1) {
                return;
            }
            // console.log("list 点击选择的位置： " + this._list.selectedIndex);
        }

        public expandBtnHandler(): void {
            if (this._listState) {
                this._listState = false;
            } else {
                this._listState = true;
            }
            this.changUI();
        }

        /**
         * 改变展示大小
         */
        public changUI() {
            if (this._listState) {
                this.bgImg.height = 230;
                this.bgImg.y = 0;
                this._list.height = 174;
                this._list.y = 45;
                this.titleText.y = 12;
                this.expandBtn.y = 19;
                this.expandBtn.skin = "common/btn_tonyong_28.png";
            } else {
                this.bgImg.height = 95;
                this.bgImg.y = 135;
                this._list.height = 41;
                this._list.y = 178;
                this.titleText.y = 145;
                this.expandBtn.y = 152;
                this.expandBtn.skin = "common/btn_tonyong_29.png";
            }
            this.updateMyRecord();
        }

        public updateMyRecord(): void {
            //测试数据
            this._list.datas = SceneCopyCloudlandCfg.instance.occAll;
        }

        public close(): void {
            super.close();
            //退出时清楚 boss结算数据
            YunMengMiJingModel.instance.getAllBossJudgeAward.length = 0;
        }
    }
}