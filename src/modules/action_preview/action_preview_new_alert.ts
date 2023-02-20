/*活动列表*/
///<reference path="../config/action_preview_cfg.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../action_preview/action_preview_model.ts"/>
namespace modules.action_preview {
    import Point = laya.maths.Point;
    import action_preview = Configuration.action_preview;
    import action_previewFields = Configuration.action_previewFields;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;

    export class ActionPreviewNewAlert extends ui.ActionPreviewNewAlertUI {
        private _date: action_preview;

        public onOpened(): void {
            super.onOpened();
            this.closeOnSide = false;
        }

        public close(): void {
            super.close();
            if (this._date) {
                // let start = new Point(this.actionImg.x, this.actionImg.y);
                Point.TEMP.setTo(0, 0);
                this.actionImg.localToGlobal(Point.TEMP);

                let he = this.height;
                let arr = [this._date, Point.TEMP, he];
                GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_EFFECT, [arr]);
            }
        }

        public setOpenParam(value: action_preview): void {
            super.setOpenParam(value);
            Laya.timer.clear(this, this.itemEffect);
            if (value) {
                this._date = value;
                let actionID = value[action_previewFields.id];
                let icon = value[action_previewFields.icon];
                let shuju = ActionOpenCfg.instance.getCfgById(actionID);
                this.actionText.text = shuju[action_openFields.name];
                this.actionImg.skin = `assets/icon/ui/get_way/${icon}.png`;
            }
            Laya.timer.once(1500, this, this.itemEffect);
        }

        /**
         * name
         */
        public itemEffect() {
            this.close();
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.itemEffect);
        }
    }
}