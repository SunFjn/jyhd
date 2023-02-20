/*活动列表*/
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
///<reference path="../kunlun/kunlun_model.ts"/>
namespace modules.kunlun {
    import Event = Laya.Event;
    import KunLunModel = modules.kunlun.KunLunModel;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import CommonUtil = modules.common.CommonUtil;

    export class KunLunBuffPanel extends ui.KunLunBuffViewUI {
        private _Time: number = 0;//当前剩余泡澡时间 毫秒
        private _BUFFTime: number = 0;//当前剩余泡澡时间 毫秒
        constructor() {
            super()
        }

        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 572;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        public onOpened(): void {
            super.onOpened();
            // this.buffImg.skin = `assets/icon/buff/${410010}.png`;
            // this.visible = false;
            this.shengyuTime();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_UPDATE, this, this.shengyuTime);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_STATE_UPDATE, this, this.shengyuTime);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_GETDROPRECORD, this, this.showReawad);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.shengyuTime);
            this.getBtn.on(Event.CLICK, this, this.getBtnHandler);
            this.buffImg.on(Event.CLICK, this, this.showBuffTipsAlert);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.getBtn.off(Event.CLICK, this, this.getBtnHandler);
            this.buffImg.off(Event.CLICK, this, this.showBuffTipsAlert);
            Laya.timer.clear(this, this.loopHandler);
        }

        private getBtnHandler(): void {
            KunLunCtrl.instance.GetInCopyAward();
        }

        /**
         * showBuffTipsAlert
         */
        public showBuffTipsAlert() {
            WindowManager.instance.open(WindowEnum.KUNLUN_TIP_ALERT, 0);
        }

        /**
         * show
         */
        public showReawad() {
            WindowManager.instance.open(WindowEnum.KUNLUN_REWARD_ALERT, KunLunModel.instance.awardList);
        }

        private shengyuTime(): void {
            Laya.timer.clear(this, this.loopHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        private loopHandler(): void {

            //活动剩余时间
            let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.swimming);
            if (states != undefined) {
                let stateNum = states[CopySceneStateFields.time];
                this.timeText1.text = `${CommonUtil.timeStampToHHMMSS(stateNum)}`;
            }
            if (KunLunModel.instance.time != undefined) {
                this.timeText2.text = `${CommonUtil.timeStampToMMSS(KunLunModel.instance.time)}`;
            }
            if (KunLunModel.instance.buffTime != undefined) {
                this.timeText.text = `${CommonUtil.timeStampToMMSS(KunLunModel.instance.buffTime)}`;
                let offset: number = KunLunModel.instance.buffTime - GlobalData.serverTime;
                this.buffImg.visible = offset > 0;
                this.timeText.visible = offset > 0;
            } else {
                this.buffImg.visible = false;
                this.timeText.visible = false;
            }

        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}