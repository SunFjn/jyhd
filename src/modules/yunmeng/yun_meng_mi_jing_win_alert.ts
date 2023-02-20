///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import FirstWinViewUI = ui.FirstWinViewUI;
    import blendFields = Configuration.blendFields;
    import BlendCfg = modules.config.BlendCfg;
    import CustomList = modules.common.CustomList;
    import LayaEvent = modules.common.LayaEvent;
    import BossJudgeAward = Protocols.BossJudgeAward;
    import BossJudgeAwardFields = Protocols.BossJudgeAwardFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import Item = Protocols.Item;

    export class YunMengMiJingWinAlert extends FirstWinViewUI {
        private _list: CustomList;
        private _duration: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 560;
            this._list.height = 122;
            this._list.hCount = 4;
            this._list.spaceX = 24;
            this._list.itemRender = YunMengItem;
            this._list.x = 120;
            this._list.y = 775;
            this.addChild(this._list);
            this.recordHtml.visible = true;
            this.tipTxt.text = `最后一击: `;
            this.desTxt.text = `给予BOSS最后一击可获得最后一击宝箱`;
        }

        public onOpened(): void {
            super.onOpened();
            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.recordHtml.style.fontFamily = "SimHei";
            this.recordHtml.style.align = "left";
            this.recordHtml.style.fontSize = 24;
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this.overCloseHandler();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        public overCloseHandler() {
            Laya.timer.clear(this, this.loopHandler);
            if (this.isShowNextReward()) {
                if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_WIN_ALERT)) {
                    if (!WindowManager.instance.isOpened(WindowEnum.YUNMENGMIJING_AWARD_ALERT)) {
                        let shuju = YunMengMiJingModel.instance.allBossJudgeAward;
                        if (shuju) {
                            if (shuju.length > 1) {
                                let items: Array<Item> = shuju[BossJudgeAwardFields.items];
                                let occ = shuju[BossJudgeAwardFields.occ];
                                let type = shuju[BossJudgeAwardFields.type];
                                if (type == 1) {
                                    GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_JUDGE_AWARD_FINALLY, [shuju]);
                                } else if (type == 3) {
                                    GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_JUDGE_AWARD_UPDATE, [shuju]);
                                }
                            }
                        }
                    }
                }
            }
        }

        public setOpenParam(value: BossJudgeAward): void {
            super.setOpenParam(value);
            if (value) {
                if (value.length > 1) {
                    this.ShowRewardParam(value);
                }
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.okBtn.on(LayaEvent.CLICK, this, this.isShowNextRewardHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.okBtn.off(LayaEvent.CLICK, this, this.isShowNextRewardHandler);
            Laya.timer.clear(this, this.loopHandler);
        }

        public isShowNextRewardHandler() {
            this.close();
        }

        /**
         * 是否有下一个boss奖励显示
         */
        public isShowNextReward(): boolean {
            if (YunMengMiJingModel.instance.getAllBossJudgeAward.length > 0) {
                return true;
            }
            return false;
        }

        public ShowRewardParam(shuju: BossJudgeAward) {
            Laya.timer.clear(this, this.loopHandler);
            let items: Array<Item> = shuju[BossJudgeAwardFields.items];
            let occ = shuju[BossJudgeAwardFields.occ];
            let actorOcc: number = shuju[BossJudgeAwardFields.actorOcc];
            let name: string = shuju[BossJudgeAwardFields.name];
            this.headImg.skin = `assets/icon/head/${actorOcc}.png`;
            this.nameTxt.text = name;
            modules.common.CommonUtil.centerChainArr(this.width, [this.tipTxt, this.nameTxt]);
            let type = shuju[BossJudgeAwardFields.type];
            let cfg: MonsterRes = YunMengMiJingModel.instance.getCfgByid(occ);
            let nameStr = cfg[MonsterResFields.name];//
            let lvNum = `Lv.${cfg[MonsterResFields.level]}`;
            let str = `【${lvNum}${nameStr}】`;
            let html: string = "<span style='color:#ffffff;font-size:24px'>秘境BOSS</span>";
            html += `<span style='color:#b15315;font-size: 24px'>${str}</span>`;
            html += "<span style='color:#ffffff;font-size: 24px'>参与击杀奖励</span>";
            this.recordHtml.innerHTML = html;
            this._list.datas = items;
            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.loopHandler();
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
    }
}