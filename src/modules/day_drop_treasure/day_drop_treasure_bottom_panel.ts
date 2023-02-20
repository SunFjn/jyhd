/** 天降圣物右边UI */


namespace modules.day_drop_treasure {
    import Event = Laya.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import DayDropTreasureModel = modules.day_drop_treasure.DayDropTreasureModel;
    import DayDropTreasureBottomViewUI = ui.DayDropTreasureBottomViewUI;
    import NpcCtrl = modules.npc.NpcCtrl;
    import NpcModel = modules.npc.NpcModel;
    import GameCenter = game.GameCenter;
    import Role = game.role.Role;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class DayDropTreasureBottomPanel extends DayDropTreasureBottomViewUI {
        constructor() {
            super();
        }

        private _xianLingTipsImgTween: TweenJS;
        private _xianFaTipsImgTween: TweenJS;
        private _occ: number = 0;
        private _xianLingTipsImgEff: CustomClip;
        private _xianFaTipsImgEff: CustomClip;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.bottom = 219;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.xianLingEarningsBtn, LayaEvent.CLICK, this, this.xianLingEarningsBtnHandler);
            this.addAutoListener(this.xianFaEarningsBtn, LayaEvent.CLICK, this, this.xianFaEarningsBtnHandler);
            this.addAutoListener(this.xianFaBtn, LayaEvent.CLICK, this, this.xianFaBtnHandler);
            this.addAutoListener(this.xianLingBtn, LayaEvent.CLICK, this, this.xianLingBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_DROP_TREASURE_UADATETIME_UPDATE, this, this.gatherEndUpdateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_GATHER_END, this, this.gatherEndHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_DROP_TREASURE_CAIJILOSE, this, this.caijiLose);
        }

        protected removeListeners(): void {
            super.removeListeners();
            if (this._xianLingTipsImgTween) {
                this._xianLingTipsImgTween.stop();
                this._xianLingTipsImgTween = null;
            }
            if (this._xianFaTipsImgTween) {
                this._xianFaTipsImgTween.stop();
                this._xianFaTipsImgTween = null;
            }
            if (this._xianLingTipsImgEff)
                this._xianLingTipsImgEff.stop();
            if (this._xianFaTipsImgEff)
                this._xianFaTipsImgEff.stop();
        }

        public onOpened(): void {
            super.onOpened();
            this.xianLingTipsImg.visible = true;
            this.xianFaTipsImg.visible = true;
            this.xianLingTipsImg.y = -109;
            this.xianFaTipsImg.y = -109;
            this._xianLingTipsImgTween = TweenJS.create(this.xianLingTipsImg).to({ y: this.xianLingTipsImg.y - 20 },
                1000).start().yoyo(true).repeat(99999999);
            this._xianFaTipsImgTween = TweenJS.create(this.xianFaTipsImg).to({ y: this.xianFaTipsImg.y - 20 },
                1000).start().yoyo(true).repeat(99999999);
            this._occ = 0;

            if (!this._xianLingTipsImgEff) {
                this._xianLingTipsImgEff = CommonUtil.creatEff(this.xianLingBtn, `activityEnter`, 15);
                this._xianLingTipsImgEff.visible = true;
                this._xianLingTipsImgEff.play();
                // this.xianLingBtn.addChildAt(this._xianLingTipsImgEff, 1);
                this._xianLingTipsImgEff.scale(1.7, 1.7);
                this._xianLingTipsImgEff.pos(-4, -4);

            }
            if (!this._xianFaTipsImgEff) {
                this._xianFaTipsImgEff = CommonUtil.creatEff(this.xianFaBtn, `activityEnter`, 15);
                this._xianFaTipsImgEff.visible = true;
                this._xianFaTipsImgEff.play();
                // this.xianLingBtn.addChildAt(this._xianFaTipsImgEff, 1);
                this._xianFaTipsImgEff.scale(1.7, 1.7);
                this._xianFaTipsImgEff.pos(-4, -4);
            }
        }

        /**
         * 采集失败返回如果 归属不是自己  继续找下一个
         */
        public caijiLose(id: number) {
            // console.log("天财降宝 采集返回 不成功：     " + id);
            if (id == ErrorCode.CannotGatherNotOwn) {
                if (!NpcModel.instance.isGathering) {
                    Laya.timer.clear(this, this.anginGatherEndHandler);
                    Laya.timer.once(500, this, this.anginGatherEndHandler);
                }
            }

        }

        private gatherEndUpdateHandler(): void {
            if (!NpcModel.instance.isGathering) {
                Laya.timer.clear(this, this.anginGatherEndHandler);
                Laya.timer.once(500, this, this.anginGatherEndHandler);
            }
        }

        public anginGatherEndHandler() {
            if (!NpcModel.instance.isGathering) {
                this.gatherEndHandler();
            }
        }

        // 采集结束处理
        private gatherEndHandler(): void {
            // 采集结束自己采集相同类型的
            if (!DayDropTreasureModel.instance.getGatherCountIsMax()) {
                if (this._occ != 0) {
                    if (this._occ === DayDropTreasureModel.instance.xianFaId) {
                        Laya.timer.once(100, this, this.xianFaBtnHandler.bind(this));
                        // console.log("继续采集1：  ");
                    } else if (this._occ === DayDropTreasureModel.instance.xianLingId) {
                        Laya.timer.once(100, this, this.xianLingBtnHandler.bind(this));
                        // console.log("继续采集2：  ");
                    }
                }
            } else {
                this._occ = 0;
            }
        }

        /**
         * 点击任意采集按钮后 隐藏提示按钮
         */
        public disTipsImg() {
            this.xianLingTipsImg.visible = false;
            this.xianFaTipsImg.visible = false;
            if (this._xianLingTipsImgTween) {
                this._xianLingTipsImgTween.stop();
            }
            if (this._xianFaTipsImgTween) {
                this._xianFaTipsImgTween.stop();
            }
            if (this._xianLingTipsImgEff) {
                this._xianLingTipsImgEff.visible = false;
                this._xianLingTipsImgEff.stop();
            }
            if (this._xianFaTipsImgEff) {
                this._xianFaTipsImgEff.visible = false;
                this._xianFaTipsImgEff.stop();
            }
        }

        public xianFaBtnHandler(): void {
            this.disTipsImg();
            Laya.timer.clear(this, this.selectTarget);
            if (DayDropTreasureModel.instance.getGatherCountIsMax()) {
                SystemNoticeManager.instance.addNotice("本次活动宝箱采集数量已达到上限", true);
                this._occ = 0;
                return;
            }
            if (NpcModel.instance.isGathering) {      // 正在采集时判断是否切换采集
                // 正在采集同类型时点击不处理，采集不同类型时点击中断采集
                let role: Role = GameCenter.instance.getRole(NpcModel.instance.triggeredNpcId);
                let occ: number = role ? role.property.get("occ") : 0;
                if (occ === DayDropTreasureModel.instance.xianFaId) {
                    return;
                } else if (occ === DayDropTreasureModel.instance.xianLingId) {
                    NpcCtrl.instance.gatherInterrupt();
                } else {
                    NpcCtrl.instance.gatherInterrupt();
                }
            }
            // else {
            this._occ = DayDropTreasureModel.instance.xianFaId;
            // console.log("仙灵采集:   " + NpcModel.instance.isGathering);
            Laya.timer.once(300, this, this.selectTarget);
            // }
        }

        public xianLingBtnHandler(): void {
            this.disTipsImg();
            Laya.timer.clear(this, this.selectTarget);
            if (DayDropTreasureModel.instance.getGatherCountIsMax()) {
                SystemNoticeManager.instance.addNotice("本次活动宝箱采集数量已达到上限", true);
                this._occ = 0;
                return;
            }
            if (NpcModel.instance.isGathering) {      // 正在采集时判断是否切换采集
                // 正在采集同类型时点击不处理，采集不同类型时点击中断采集
                let role: Role = GameCenter.instance.getRole(NpcModel.instance.triggeredNpcId);
                let occ: number = role ? role.property.get("occ") : 0;
                if (occ === DayDropTreasureModel.instance.xianLingId) {
                    return;
                } else if (occ === DayDropTreasureModel.instance.xianFaId) {
                    NpcCtrl.instance.gatherInterrupt();
                } else {
                    NpcCtrl.instance.gatherInterrupt();
                }
            }
            // else {
            this._occ = DayDropTreasureModel.instance.xianLingId;
            // console.log("仙发采集:   " + NpcModel.instance.isGathering);
            Laya.timer.once(300, this, this.selectTarget);
            // }
        }

        public selectTarget() {
            PlayerModel.instance.selectTarget(SelectTargetType.Npc, this._occ);
        }


        public xianLingEarningsBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_REWARD_ALERT, 0);
        }

        /**
         * 奖励预览
         */
        public xianFaEarningsBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_REWARD_ALERT, 1);
        }

        public close(): void {
            super.close();
            Laya.timer.clearAll(this);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            this._xianLingTipsImgEff = this.destroyElement(this._xianLingTipsImgEff);
            this._xianFaTipsImgEff = this.destroyElement(this._xianFaTipsImgEff);
        }
    }
}