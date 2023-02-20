///<reference path="../config/xianfu_animal_cfg.ts"/>
///<reference path="../config/xianfu_cfg.ts"/>
/** 仙府-家园底部面板 */
namespace modules.xianfu {
    import XianfuBottomViewUI = ui.XianfuBottomViewUI;
    import Event = Laya.Event;
    import SceneHomesteadCfg = modules.config.SceneHomesteadCfg;
    import CustomClip = modules.common.CustomClip;

    export class XianfuBottomPanel extends XianfuBottomViewUI {

        private _recordWheel: number[];
        private _eventBtnTipImgTween: TweenJS;
        private _eventBtnTipImgEff: CustomClip;
        private _shouCi: boolean = true;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._shouCi = true;
            this.centerX = 0;
            this.bottom = 274;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;

            let tempArr: XianfuBottomItem[] = [this.item_0, this.item_1, this.item_2, /*this.item_3*/null, /*this.item_4*/null,
            this.item_5, this.item_6, this.item_7, this.item_8];

            for (let i: int = 0, len: int = tempArr.length; i < len; i++) {
                if (tempArr[i]) {
                    tempArr[i].type = i;
                }
            }

            this._recordWheel = [];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.eventBtn, Event.CLICK, this, this.eventCkickHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_XIANFU_AREA, this, this.updateBuildInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_XIANFU_AREA, this, this.updateEventBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_EVENT_UPDATE, this, this.updateEventBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_GATHER_END, this, this.continueGather);

        }

        protected removeListeners(): void {
            super.removeListeners();

            if (this._eventBtnTipImgTween) {
                this._eventBtnTipImgTween.stop();
                this._eventBtnTipImgTween = null;
            }
            if (this._eventBtnTipImgEff)
                this._eventBtnTipImgEff.stop();
        }

        public onOpened(): void {
            super.onOpened();
            this.updateBuildInfo();
            this.updateEventBtn();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private updateBuildInfo(): void {
            let panelType: number = XianfuModel.instance.panelType;
            this.JuLingTingBox.visible = this.LianZhiYaBox.visible = this.petBox.visible = false;
            if (panelType == 0) { // 农场  0聚灵厅 ----0药草园 1粮食园
                this.JuLingTingBox.visible = true;
            } else if (panelType == 1) { // 炼金室  index 1炼制崖 ----2炼丹炉 3炼器炉 4炼魂炉
                this.LianZhiYaBox.visible = true;
            } else if (panelType == 2) { // 游历 2灵兽阁
                this.petBox.visible = true;
            }
        }

        private updateEventBtn(): void {
            Laya.timer.clear(this, this.eventCkickHandler);
            if (this.checkSiteMate()) {
                let id: number = XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.eventId];
                this.eventBtn.skin = `xianfu/event_btn_${id}.png`;
                this.eventBtn.visible = true;

                if (this._shouCi) {
                    this.eventBtnTipImg.visible = true;
                    this.eventBtnTipImg.y = -99;
                    if (id == 2) {//魔兵入侵 2
                        this.eventBtnTipText.text = "点击击杀";
                    } else if (id == 3) {//boss入侵 3
                        this.eventBtnTipText.text = "点击击杀";
                    } else if (id == 4) {//灵脉爆发 采集物 4
                        this.eventBtnTipText.text = "点击采集";
                    } else if (id == 5) {//宝矿爆发 宝箱 5
                        this.eventBtnTipText.text = "点击采集";
                    }
                    this._eventBtnTipImgTween = TweenJS.create(this.eventBtnTipImg).to({ y: this.eventBtnTipImg.y - 20 },
                        1000).start().yoyo(true).repeat(99999999);
                    if (!this._eventBtnTipImgEff) {
                        this._eventBtnTipImgEff = modules.common.CommonUtil.creatEff(this.eventBtnBOX, `activityEnter`, 15);
                        this._eventBtnTipImgEff.visible = true;
                        this._eventBtnTipImgEff.play();
                        // this.eventBtnBOX.addChildAt(this._eventBtnTipImgEff, 0);
                        this._eventBtnTipImgEff.scale(1.2, 1.2);
                        this._eventBtnTipImgEff.pos(-2, -6);// (-2, -6);
                    } else {
                        this._eventBtnTipImgEff.visible = true;
                        this._eventBtnTipImgEff.play();
                    }
                    this._shouCi = false;
                }


            } else {
                this.eventBtn.visible = false;
                PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);

                this.eventBtnTipImg.visible = false;
                if (this._eventBtnTipImgTween) {
                    this._eventBtnTipImgTween.stop();
                }
                if (this._eventBtnTipImgEff) {
                    this._eventBtnTipImgEff.visible = false;
                    this._eventBtnTipImgEff.stop();
                }
                this._shouCi = true;
            }
        }


        private eventCkickHandler(): void {
            Laya.timer.clear(this, this.eventCkickHandler);
            let eventInfo: Protocols.XianFuEvent = XianfuModel.instance.xianfuEvent;
            let id: number = eventInfo[Protocols.XianFuEventFields.eventId];
            let fengshuiLv: number = XianfuModel.instance.fengshuiLv;
            let wheel: number = eventInfo[Protocols.XianFuEventFields.wheel]; //轮
            let cfg: Configuration.scene_homestead = SceneHomesteadCfg.instance.getCfgByLvAndWheel(fengshuiLv, wheel);
            this._recordWheel[id] = wheel;
            let targetId: number;
            if (id == 2) {//魔兵入侵 2
                PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
            } else if (id == 3) {//boss入侵 3
                PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
            } else if (id == 4) {//灵脉爆发 采集物 4
                targetId = cfg[Configuration.scene_homesteadFields.collect][1];
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, targetId);
            } else if (id == 5) {//宝矿爆发 宝箱 5
                targetId = cfg[Configuration.scene_homesteadFields.treasure][1];
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, targetId);
            }

            this.eventBtnTipImg.visible = false;
            if (this._eventBtnTipImgTween) {
                this._eventBtnTipImgTween.stop();
            }
            if (this._eventBtnTipImgEff) {
                this._eventBtnTipImgEff.visible = false;
                this._eventBtnTipImgEff.stop();
            }
        }

        //检测区域是否匹配 否则不进行显示获取寻路
        private checkSiteMate(): boolean {
            let event: Protocols.XianFuEvent = XianfuModel.instance.xianfuEvent;
            if (event && event[Protocols.XianFuEventFields.isOpen]) {
                let id: number = XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.eventId];
                if (id !== XianFuEvent.mall) {
                    let posId: number = XianfuModel.instance.areaId();
                    if (XianfuModel.instance.panelType == posId - 1) {
                        return true;
                    }
                }
            }
            this.eventBtn.visible = false;
        }

        private continueGather(): void {
            let event: Protocols.XianFuEvent = XianfuModel.instance.xianfuEvent;
            if (!event) return;
            let currWheel: number = event[Protocols.XianFuEventFields.wheel];
            let id: number = XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.eventId];
            if (currWheel > this._recordWheel[id]) {
                this._recordWheel[id] = currWheel;
                return;
            }
            if (!this.checkSiteMate()) {
                return;
            }
            Laya.timer.once(200, this, this.eventCkickHandler);
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            if (this._eventBtnTipImgEff) {
                this._eventBtnTipImgEff.removeSelf();
                this._eventBtnTipImgEff.destroy();
                this._eventBtnTipImgEff = null;
            }
        }


    }
}