///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import CustomList = modules.common.CustomList;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class YunMengMiJingResultAlert extends ui.YunMengMiJingResultAlertUI {
        private _list: CustomList;
        private _timer: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 520;
            this._list.height = 289;
            this._list.hCount = 4;
            this._list.spaceX = 30;
            this._list.itemRender = YunMengItem;
            this._list.x = 70;
            this._list.y = 117;
            this.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            DungeonCtrl.instance.reqEnterScene(0);
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);
            if (value) {
                this._list.datas = value;
            }
            this._timer = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0] * 0.001;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Laya.Event.CLICK, this, this.close);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        private loopHandler(): void {
            this.okBtn.label = `确定(${this._timer})`;
            if (this._timer < 0) {
                this.close();
            }
            this._timer--;
        }
    }
}