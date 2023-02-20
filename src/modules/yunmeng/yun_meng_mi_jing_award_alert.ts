///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BossJudgeAward = Protocols.BossJudgeAward;
    import BossJudgeAwardFields = Protocols.BossJudgeAwardFields;
    import LayaEvent = modules.common.LayaEvent;

    export class YunMengMiJingAwardAlert extends ui.YunMengMiJingAwardAlertUI {
        private _list: CustomList;
        private _duration: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 580;
            this._list.height = 128;
            this._list.hCount = 4;
            this._list.spaceX = 30;
            // this._list.spaceY = 10;
            //  30=  this._list.spaceX * (this._list.hCount );
            this._list.itemRender = YunMengItem;
            this._list.x = 46;
            this._list.y = 252;
            this.addChild(this._list);
            this.zOrder = 1;
        }

        public onOpened(): void {
            super.onOpened();
            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            // let html: string = "<span style='color:#ffffff;font-size: 26px'>您给予秘境BOSS</span>";
            // html += `<span style='color:#b15315;font-size: 26px'>【】</span>`;
            // html += "<span style='color:#ffffff;font-size: 26px'>最后一击,获得以下奖励</span>";
            this.recordHtml.style.fontFamily = "SimHei";
            this.recordHtml.style.align = "left";
            this.recordHtml.style.fontSize = 24;
            // this.recordHtml.innerHTML = html;
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
            this.closeBtn.on(LayaEvent.CLICK, this, this.isShowNextRewardHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.okBtn.off(LayaEvent.CLICK, this, this.isShowNextRewardHandler);
            this.closeBtn.off(LayaEvent.CLICK, this, this.isShowNextRewardHandler);
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
            let type = shuju[BossJudgeAwardFields.type];
            if (occ) {
                let cfg: MonsterRes = YunMengMiJingModel.instance.getCfgByid(occ);
                let nameStr = cfg[MonsterResFields.name];//
                let lvNum = `Lv.${cfg[MonsterResFields.level]}`;
                let str = `【${lvNum} ${nameStr} 】`;
                let html: string = "<span style='color:#585858;font-size:26px'>您给予秘境BOSS</span>";
                html += `<span style='color:#b15315;font-size: 26px'>${str}</span>`;
                html += "<span style='color:#585858;font-size: 26px'>最后一击,获得以下奖励</span>";
                this.recordHtml.innerHTML = html;
            }
            this._list.datas = items;
            let leng = this._list.datas.length;
            leng = leng > 4 ? 4 : leng;
            let chagndu = leng * 100 + (leng - 1) * this._list.spaceX;
            this._list.x = (this.width - chagndu) / 2;

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