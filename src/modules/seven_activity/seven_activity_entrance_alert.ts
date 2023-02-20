/** 七日活动宣传入口弹窗 */

namespace modules.seven_activity {
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SevenActivityEntranceAlertUI = ui.SevenActivityEntranceAlertUI;
    import SevenActivityTaskCfg = modules.config.SevenActivityTaskCfg;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    export class SevenActivityEntranceAlert extends SevenActivityEntranceAlertUI {
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 2);
            this._skeletonClip.centerX = 0;
            this._skeletonClip.centerY = 160;
            this._skeletonClip.scaleX = this._skeletonClip.scaleY = 0.7;
            this._skeletonClip.zOrder = 2;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.goBtn, Laya.Event.CLICK, this, this.goBtnHandler);

            this.addAutoRegisteRedPoint(this.rpImg, ["sevenActivityRP", "demonOrderGiftRP"]);
        }

        public onOpened(): void {
            super.onOpened();
            let ts: number = SevenActivityTaskCfg.instance.getFinalReward();
            // 这里的id动态获取
            let rewardId = (CommonUtil.getItemCfgById(ts) as item_material)[item_materialFields.showId];
            this._skeletonClip.reset(rewardId);
        }

        public close(): void {
            super.close();
        }

        public destroy(): void {
            this._skeletonClip = this.destroyElement(this._skeletonClip);
        }

        //参与活动
        private goBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.SEVENACTIVITY_VIEW);
            this.close();
        }
    }
}