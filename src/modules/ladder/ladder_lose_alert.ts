/** 天梯失败结算面板*/

///<reference path="../common_alert/lack_prop_alert.ts"/>
///<reference path="../config/tips_cfg.ts"/>
namespace modules.ladder {
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import LadderLoseAlertUI = ui.LadderLoseAlertUI;
    import Event = Laya.Event;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import GetWayCfg = modules.config.GetWayCfg;
    import FailureStrongerCfg = modules.config.FailureStrongerCfg;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import TipCfg = modules.config.TipCfg;
    import tips = Configuration.tips;
    import tipsFields = Configuration.tipsFields;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;

    export class LadderLoseAlert extends LadderLoseAlertUI {
        private _duration: number;

        private _level: number;
        private _sourceBtn: Array<Laya.Image>;
        private _type: number;
        private _specialId: number;
        private _sourceBtnBg: Array<Laya.Image>;
        private _desTxts: Array<laya.display.Text>;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._sourceBtn = new Array<Laya.Image>();
            this._level = PlayerModel.instance.level;
            // this._specialImg = new Laya.Image();
            this._sourceBtnBg = new Array<Laya.Image>();
            this._desTxts = new Array<laya.display.Text>();
            // this.addChild(this._specialImg);
            this.addChild(this.gotoBtn);
            for (let i: number = 0; i < 4; i++) {
                this._sourceBtn[i] = new Laya.Image();
                this._sourceBtn[i].mouseEnabled = true;
                this._sourceBtnBg[i] = new Laya.Image();
                this._desTxts[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._desTxts[i]);
            }

            this._list = new CustomList();
            this._list.spaceX = 20;
            this._list.vCount = 1;
            this._list.itemRender = BaseItem;
            this._list.scrollDir = 2;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.okBtn.on(Event.CLICK, this, this.close);
            this._sourceBtn[0].on(Event.CLICK, this, this.openSourcePlane1);
            this._sourceBtn[1].on(Event.CLICK, this, this.openSourcePlane2);
            this._sourceBtn[2].on(Event.CLICK, this, this.openSourcePlane3);
            this._sourceBtn[3].on(Event.CLICK, this, this.openSourcePlane4);
            this.gotoBtn.on(Event.CLICK, this, this.gotoPlane);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TIPBIANQIANG_UPDATE, this, this.updateTipUI);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.okBtn.off(Event.CLICK, this, this.close);
            this._sourceBtn[0].off(Event.CLICK, this, this.openSourcePlane1);
            this._sourceBtn[1].off(Event.CLICK, this, this.openSourcePlane2);
            this._sourceBtn[2].off(Event.CLICK, this, this.openSourcePlane3);
            this._sourceBtn[3].off(Event.CLICK, this, this.openSourcePlane4);
            this.gotoBtn.off(Event.CLICK, this, this.gotoPlane);
            Laya.timer.clear(this, this.loopHandler);
        }

        /**
         *更新变强提示UI
         */
        public updateTipUI() {
            if (modules.dungeon.DungeonModel.instance.tipType == 0) {
                this.gotoBtn.visible = false;
                this.TipsImg.visible = false;
                return
            } else {
                let shuju: tips = TipCfg.instance.getCfgByType(modules.dungeon.DungeonModel.instance.tipType);
                if (shuju) {
                    this.gotoBtn.visible = true;
                    this.TipsImg.visible = true;
                    this.TipsImg.skin = "assets/icon/ui/failure_stronger/" + shuju[tipsFields.ImgId] + ".jpg";
                } else {
                    this.TipsImg.skin = "";
                }
            }
        }

        public setOpenParam(value: any): void {
            if (!value) {
                return;
            }
            let items: Array<Item> = value;
            this._list.size(items.length <= 4 ? items.length * 120 - 20 : 460, 100);
            this._list.pos(46 + (460 - this._list.width) * 0.5, 492, true);
            this._list.datas = items;
        }

        public onOpened(): void {
            super.onOpened();

            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.loopHandler();
            this.setDate();
            DungeonCtrl.instance.getTipsPriorInfo();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

            DungeonCtrl.instance.reqEnterScene(0);
        }

        private gotoPlane(): void {
            // let funcId: number = GetWayCfg.instance.getCfgById(this._specialId)[Configuration.get_wayFields.params][0];
            // this.openPlane(funcId);
            if (modules.dungeon.DungeonModel.instance.tipType != 0) {
                let shuju: tips = TipCfg.instance.getCfgByType(modules.dungeon.DungeonModel.instance.tipType);
                if (shuju) {
                    let gotoParams = shuju[tipsFields.gotoParams];
                    // WindowManager.instance.openByActionId(gotoParams);
                    BottomTabCtrl.instance.addPanelByFunc(gotoParams);
                    this.close();
                }
            }
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }

        private setDate(): void {
            this.removeChildSource();
            this._level = PlayerModel.instance.level;
            let failure: Configuration.failure_stronger = FailureStrongerCfg.instance.getCfgByLevel(this._level);
            let strongSourceId: Array<number> = failure[Configuration.failure_strongerFields.strongSourceId];
            //strongSourceId.sort();
            //strongSourceId.reverse();
            this.bigToSmall(strongSourceId);
            //变强途径
            let strongWayCfg: Configuration.get_way;
            for (let i: number = 0, len: number = strongSourceId.length; i < len; i++) {
                this.addChild(this._sourceBtnBg[i]);
                this.addChild(this._sourceBtn[i]);
                strongWayCfg = GetWayCfg.instance.getCfgById(strongSourceId[i]);
                this._sourceBtn[i].pos(46 + (512 - 158 * len + 42 * (len - 1)) * 0.5 + i * 116, 690);
                this._sourceBtn[i].skin = `assets/icon/ui/get_way/${strongWayCfg[Configuration.get_wayFields.icon]}.png`;
                this._sourceBtnBg[i].skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
                this._sourceBtnBg[i].pos(this._sourceBtn[i].x, this._sourceBtn[i].y);
                this._sourceBtn[i].addChild(this._desTxts[i]);
                this._desTxts[i].pos(6, 70);
                this._desTxts[i].text = strongWayCfg[Configuration.get_wayFields.desc];
            }
            //特殊途径
            this._specialId = failure[Configuration.failure_strongerFields.specialStrongId];
            if (this._specialId != 0) {
                strongWayCfg = GetWayCfg.instance.getCfgById(this._specialId);
                // this._specialImg.skin = `assets/icon/ui/get_way/${strongWayCfg[Configuration.get_wayFields.icon]}.png`;
                // this._specialImg.pos(26, 824);
            }

        }

        private openSourcePlane1(): void {
            this._type = 1;
            this.getOpenPlaneId();
        }


        private openSourcePlane2(): void {
            this._type = 2;
            this.getOpenPlaneId();
        }

        private openSourcePlane3(): void {
            this._type = 3;
            this.getOpenPlaneId();
        }

        private openSourcePlane4(): void {
            this._type = 4;
            this.getOpenPlaneId();
        }

        public getOpenPlaneId(): void {
            let failure: Configuration.failure_stronger = FailureStrongerCfg.instance.getCfgByLevel(this._level);
            let strongSourceId: Array<number> = failure[Configuration.failure_strongerFields.strongSourceId];
            //strongSourceId.sort();
            //strongSourceId.reverse();
            this.bigToSmall(strongSourceId);
            let funcId: number = GetWayCfg.instance.getCfgById(strongSourceId[this._type - 1])[Configuration.get_wayFields.params][0];
            this.openPlane(funcId);

        }

        private openPlane(funcId: number): void {
            if (funcId === 0) {
                this.close();
            } else {
                if (FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    // WindowManager.instance.openByActionId(funcId);
                    BottomTabCtrl.instance.addPanelByFunc(funcId);
                    this.close();
                } else {
                    SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(funcId), true);
                }
            }

        }

        private bigToSmall(arr: Array<number>): Array<number> {
            for (let i: number = 0, len: number = arr.length; i < len - 1; i++) {
                for (let j: number = 0; j < arr.length - i - 1; j++) {
                    if (arr[j] < arr[j + 1]) {
                        let temp: number = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            return arr;
        }

        private removeChildSource(): void {
            if (this._sourceBtn != null) {
                for (let i: number = 0; i < this._sourceBtn.length; i++) {
                    this.removeChild(this._sourceBtn[i]);
                    this.removeChild(this._sourceBtnBg[i]);
                    this.removeChild(this._desTxts[i]);
                }
            }
        }

        public destroy(): void {
            if (this._sourceBtn != null) {
                for (let i: number = 0; i < this._sourceBtn.length; i++) {
                    this._sourceBtn[i].destroy(true);
                    this._sourceBtnBg[i].destroy(true);
                    this._desTxts[i].destroy(true);
                }
                this._sourceBtn = this._sourceBtnBg = this._desTxts = null;
            }
            super.destroy();
        }
    }
}