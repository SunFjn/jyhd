/**
 * name
 */

///<reference path="../guide/guide_model.ts"/>
///<reference path="../common/skeleton_avatar.ts"/>

module modules.core {
    import Button = Laya.Button;
    import Event = Laya.Event;
    import Image = Laya.Image;
    import EventDispatcher = Laya.EventDispatcher;
    import EventInfo = ui.EventInfo;
    import EventInfoField = ui.EventInfoField;
    import Sprite = Laya.Sprite;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import RedPointProperty = ui.RedPointProperty;
    import GuideModel = modules.guide.GuideModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class BaseDialog extends laya.ui.Dialog {
        public bgImg: Image;
        public closeBtn: Button;
        // 点边框是否关闭
        public closeOnSide: boolean;

        // 弹框ID
        public dialogId: number;

        // 自动事件数组
        private _autoEvents: Array<EventInfo>;

        //是否需要点击的CD时间
        public clickCD: boolean;

        //打开对话框时附带的参数
        protected openParam: any;

        // 是否已经打开
        private _isOpened: boolean;

        private _autoRedPointEvents: Sprite[];

        private _guideSprites: Array<Sprite> = [];
        private _guideSpritesInfo: Array<[number, Sprite]> = [];

        // 关闭时释放龙骨动画资源
        private _closeReleaseSkeleton: boolean;

        constructor() {
            super();

            this._closeReleaseSkeleton = true;
            // this.hitTestPrior = false;

            this.on(Laya.Event.DISPLAY, this, this.displayHandler);
            this.on(Laya.Event.UNDISPLAY, this, this.undisplayHandler);

            this.anchorX = this.anchorY = 0.5;

            this.isModal = true;
        }

        private displayHandler(): void {
            this.addListeners();
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            this.resizeHandler();
        }

        private undisplayHandler(): void {
            this.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);

            this._isOpened = false;
        }

        protected addListeners(): void {
            if (this.closeBtn) this.closeBtn.on(Event.CLICK, this, this.close);
            for (let i = 0; i < this._guideSpritesInfo.length; i++) {
                this.guideSprDisplayHandler(this._guideSpritesInfo[i][0], this._guideSpritesInfo[i][1])
            }
        }

        protected removeListeners(): void {
            if (this.closeBtn) this.closeBtn.off(Event.CLICK, this, this.close);
            this.removeAutoListeners();
            for (let i = 0; i < this._guideSpritesInfo.length; i++) {
                this.guideSprUndisplayHandler(this._guideSpritesInfo[i][0])
            }
        }

        // 添加自动移除侦听（面板关闭时会自动移除，不用手动在removeListeners里移除）
        protected addAutoListener(dispatcher: EventDispatcher, type: string, caller: any, listener: Function, args?: any[]): void {
            let eventInfo: EventInfo = [dispatcher, type, caller, listener];
            eventInfo[EventInfoField.dispatcher].on(eventInfo[EventInfoField.type], eventInfo[EventInfoField.caller], eventInfo[EventInfoField.listener], args);
            if (!this._autoEvents) this._autoEvents = [];
            this._autoEvents.push(eventInfo);
        }

        protected removeAutoListeners(): void {
            if (!this._autoEvents) return;
            for (let i: int = 0, len: int = this._autoEvents.length; i < len; i++) {
                let eventInfo: EventInfo = this._autoEvents[i];
                eventInfo[EventInfoField.dispatcher].off(eventInfo[EventInfoField.type], eventInfo[EventInfoField.caller], eventInfo[EventInfoField.listener]);
            }
            this._autoEvents.length = 0;

        }

        //添加红点自动移除监听
        protected addAutoRegisteRedPoint(img: Sprite, propertyNames: Array<keyof RedPointProperty>) {
            RedPointCtrl.instance.registeRedPoint(img, propertyNames);
            let eventInfo: Sprite = img;
            if (!this._autoRedPointEvents) this._autoRedPointEvents = [];
            this._autoRedPointEvents.push(eventInfo);
        }

        protected removeAutoRegisteRedPoint(): void {
            if (!this._autoRedPointEvents) return;
            for (let i: int = 0, len: int = this._autoRedPointEvents.length; i < len; i++) {
                let img: Sprite = this._autoRedPointEvents[i];
                RedPointCtrl.instance.retireRedPoint(img);
            }
            this._autoRedPointEvents.length = 0;
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = true;
            // if (this.bgImg) {
            //     this.hitArea = new Rectangle(this.bgImg.x, this.bgImg.y, this.bgImg.width, this.bgImg.height);
            // }
            this.clickCD = false;
        }

        // 注册引导翅膀 对Sprite添加监听 被销毁时触发清除引导
        protected regGuideSpr(id: GuideSpriteId, spr: Sprite): void {
            if (!spr) return;
            if (!this._guideSprites) {
                this._guideSprites = [];
            }
            if (!this._guideSpritesInfo) {
                this._guideSpritesInfo = [];
            }
            if (this._guideSprites.indexOf(spr) !== -1) return;
            this._guideSprites.push(spr);
            this._guideSpritesInfo.push([id, spr])
            spr.on(Laya.Event.DISPLAY, this, this.guideSprDisplayHandler, [id, spr]);
            spr.on(Laya.Event.UNDISPLAY, this, this.guideSprUndisplayHandler, [id]);
        }

        // 显示出来时注册到引导数据中
        private guideSprDisplayHandler(id: GuideSpriteId, spr: Sprite): void {
            GuideModel.instance.registeUI(id, spr);
        }

        // 不显示时从引导数据中删除
        protected guideSprUndisplayHandler(id: GuideSpriteId): void {
            GuideModel.instance.removeUI(id);
        }

        // 设置打开面板时的参数
        public setOpenParamInterface(value: any): void {
            this.setOpenParam(value);
            if (this._isOpened) {     // 如果面板是已经打开的，调用一下打开接口来刷新数据
                this.onOpened();
            }
        }

        // 设置打开面板时的参数
        protected setOpenParam(value: any): void {
            this.openParam = value;
        }

        public onOpened(ani: boolean = true): void {
            super.onOpened();

            // 新增弹窗统一弹出效果
            if (ani) {
                this.showTime();
            }
            this._isOpened = true;
            if (this.clickCD) {
                this.closeOnSide = false;
                Laya.timer.once(1000, this, this.cdEndHandler);
            }
            GlobalData.dispatcher.event(CommonEventType.PANEL_OPENED, this.dialogId);
        }

        /** 弹出时动画效果*/
        private showTime() {
            let offsetY = this.y;
            this.y = offsetY + 17;
            this.alpha = 0;
            TweenJS.create(this).to({ alpha: 1 }, 300)
                .easing(utils.tween.easing.circular.InOut)
                .start()
            TweenJS.create(this).to({ y: offsetY }, 200)
                .delay(100)
                .easing(utils.tween.easing.circular.InOut)
                .start()
        }

        private cdEndHandler(): void {
            this.closeOnSide = true;
        }

        // 关闭面板时释放龙骨资源到对象池
        public set closeReleaseSkeleton(crs: boolean) {
            this._closeReleaseSkeleton = crs;
        }

        public get closeReleaseSkeleton(): boolean {
            return this._closeReleaseSkeleton;
        }

        public close(type?: string, showEffect?: boolean): void {
            Laya.timer.clear(this, this.cdEndHandler);
            if (this._closeReleaseSkeleton) {
                let gid = this["$_GID"];
                SkeletonAvatar.clsoepPutAllShowSkeletonToPool(gid);
            }
            if (WindowManager.instance.isOpened(this.dialogId)) {
                WindowManager.instance.close(this.dialogId, null, true);
            }
            super.close(type, showEffect);
            GlobalData.dispatcher.event(CommonEventType.PANEL_CLOSED, this.dialogId);
        }

        protected resizeHandler(): void {
            // this.width = CommonConfig.viewWidth;
            // this.height = CommonConfig.viewHeight;
            // this.scaleX = this.scaleY = CommonConfig.viewScale;
        }

        protected destroyElement(e: Destroyable | Array<Destroyable>): null {
            if (e instanceof Array) {
                if (e) {
                    for (let i = 0, len = e.length; i < len; ++i) {
                        e[i] && e[i].destroy(true);
                    }
                    e.length = 0;
                }
            } else {
                e && e.destroy(true);
            }
            return null;
        }

        public destroy(): void {
            this.bgImg = null;
            if (this._autoEvents) {
                this.removeAutoListeners();
                this._autoEvents = null;
            }
            if (this._closeReleaseSkeleton) {
                let gid = this["$_GID"];
                SkeletonAvatar.deleteViewKeyValue(gid);
            }
            super.destroy(true);
            if (this._guideSprites) {
                for (let i: int = 0, len: int = this._guideSprites.length; i < len; i++) {
                    let spr: Sprite = this._guideSprites[i];
                    spr.off(Laya.Event.DISPLAY, this, this.guideSprDisplayHandler);
                    spr.off(Laya.Event.UNDISPLAY, this, this.guideSprUndisplayHandler);
                }
                this._guideSprites.length = 0;
                this._guideSprites = null;
                this._guideSpritesInfo.length = 0;
                this._guideSpritesInfo = null;
            }
        }
    }
}
