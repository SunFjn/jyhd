///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>
///<reference path="../bottom_tab/bottom_tab_config.ts"/>
///<reference path="../guide/guide_model.ts"/>
///<reference path="../common/skeleton_avatar.ts"/>


/**
 *  面板基类
 */


module modules.core {
    import Event = Laya.Event;
    import Layer = ui.Layer;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import TabInfo = ui.TabInfo;
    import BottomTabConfig = modules.bottomTab.BottomTabConfig;
    import Text = laya.display.Text;
    import EventInfo = ui.EventInfo;
    import EventDispatcher = Laya.EventDispatcher;
    import EventInfoField = ui.EventInfoField;
    import LongEventInfo = ui.LongEventInfo;
    import LongEventInfoField = ui.LongEventInfoField;
    import RedPointProperty = ui.RedPointProperty;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import Sprite = Laya.Sprite;
    import GuideModel = modules.guide.GuideModel;
    import Button = Laya.Button;
    import Image = Laya.Image;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class BaseView extends laya.ui.View {
        public closeBtn: Button | Image;
        public backBtn: Sprite;
        public titleTxt: Text;

        // 需要添加到的层ID
        public layer: Layer;
        // 是否被其它面板的打开所关闭
        public closeByOthers: boolean;
        // 面板ID
        public panelId: number;

        // 自动事件数组
        private _autoEvents: Array<EventInfo>;

        private _autoRedPointEvents: Sprite[];

        private _guideSprites: Array<Sprite>;

        // 是否已经打开
        private _isOpened: boolean;
        // 是否是被其它面板关闭
        private _isClosedByOthers: boolean;

        // 关闭时释放龙骨动画资源
        private _closeReleaseSkeleton: boolean;

        // 长按管理事件数组
        private _LongPressEvents: Array<LongEventInfo>;
        private _distributionId: number = CommonUtil.getRandomInt(1000, 9999)

        constructor() {
            super();
            this._closeReleaseSkeleton = true;
            this.on(Laya.Event.DISPLAY, this, this.displayHandler);
            this.on(Laya.Event.UNDISPLAY, this, this.undisplayHandler);

            // this.centerX = this.centerY = 0;
        }

        protected initialize(): void {
            super.initialize();
            if (this.titleTxt) {
                this.titleTxt.color = "#626d97";
                this.titleTxt.fontSize = 30;
                this.titleTxt.x = 284;
                this.titleTxt.y = 50;
                this.titleTxt.width = 160;
                this.titleTxt.align = "center";
            }
            if (this.closeBtn) {
                if (this.closeBtn.skin === "common/btn_tongyong_13.png") {
                    this.closeBtn.hitArea = new Laya.Rectangle(7, 11, 60, 60);
                }
                if (this.height === 1280 && this.width === 720) {
                    this.closeBtn.pos(653, 73);
                }
            }

            this.layer = Layer.UI_LAYER;
            this.closeByOthers = true;
        }

        private displayHandler(): void {
            this.addListeners();
            // GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            // this.resizeHandler();

            this.onOpened();
        }

        protected undisplayHandler(): void {
            this.removeListeners();
            // GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);

            this._isOpened = false;
        }

        protected addListeners(): void {
            if (this.closeBtn) this.closeBtn.on(Event.CLICK, this, this.close);
            if (this.backBtn) this.backBtn.on(Event.CLICK, this, this.close);
        }

        protected removeListeners(): void {
            if (this.closeBtn) this.closeBtn.off(Event.CLICK, this, this.close);
            if (this.backBtn) this.backBtn.off(Event.CLICK, this, this.close);
            this.removeAutoListeners();
            this.removeAutoRegisteRedPoint();
        }
        public _downX: number;
        public _downY: number;
        public _downTime: number;
        public _downTarget: Sprite;

        /**
         * 长按事件
         * @param dispatcher 组件
         * @param caller 作用域
         * @param listener 点击事件
         * @param listenerLong 长按事件 大于300毫秒
         */
        protected addLongPress(dispatcher: EventDispatcher, caller: any, listener: Function = null, listenerLong: Function = null): void {
            let key = ++this._distributionId
            let eventInfo: LongEventInfo = [dispatcher, key, caller, listener, listenerLong];
            this.addAutoListener(dispatcher, Event.MOUSE_DOWN, this, this._downHandler, [key]);
            this.addAutoListener(dispatcher, Event.MOUSE_UP, this, this._upHandler, [key]);
            if (!this._LongPressEvents) this._LongPressEvents = [];
            this._LongPressEvents.push(eventInfo);
        }


        private _downHandler(key: number, e: Event) {
            this._downX = this.mouseX;
            this._downY = this.mouseY;
            this._downTime = Browser.now();
            this._downTarget = e.currentTarget;
        }
        private _upHandler(key: number, e: Event) {
            if (this._downTarget !== e.currentTarget) return;
            // 偏移小于5且时间小于125才认为是单击
            let offsetX: number = this.mouseX - this._downX;
            let offsetY: number = this.mouseY - this._downY;
            let offsetT: number = Browser.now() - this._downTime;
            let even = this.getLongPress(key)
            if (!even) return;
            if (offsetX < 5 && offsetX > -5 && offsetY < 5 && offsetY > -5 && offsetT < 300) {
                if (even[LongEventInfoField.listener] != null) even[LongEventInfoField.listener].call(even[LongEventInfoField.caller])
            } else {
                if (even[LongEventInfoField.listenerLong] != null) even[LongEventInfoField.listenerLong].call(even[LongEventInfoField.caller])
            }
        }
        private getLongPress(key: number) {
            for (const k in this._LongPressEvents) {
                if (this._LongPressEvents[k][LongEventInfoField.key] == key) return this._LongPressEvents[k]
            }
            return null
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

        protected onOpened(): void {
            //console.log("切页调试4")
            this._isOpened = true;
            let tabInfo: TabInfo = BottomTabConfig.instance.getTabInfoByPanelId(this.panelId);
            if (tabInfo) {
                BottomTabCtrl.instance.openTabByPanel(this.panelId);
            }
            GlobalData.dispatcher.event(CommonEventType.PANEL_OPENED, this.panelId);
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

        }

        // protected resizeHandler(): void {
        // this.width = CommonConfig.viewWidth;
        // this.height = CommonConfig.viewHeight;
        // this.scaleX = this.scaleY = CommonConfig.viewScale;
        // }

        // 关闭面板时释放龙骨资源到对象池
        public set closeReleaseSkeleton(crs: boolean) {
            this._closeReleaseSkeleton = crs;
        }

        public get closeReleaseSkeleton(): boolean {
            return this._closeReleaseSkeleton;
        }

        // 关闭从WindowManager绕一下
        public close(): void {

            if (this._closeReleaseSkeleton) {
                let gid = this["$_GID"];
                SkeletonAvatar.clsoepPutAllShowSkeletonToPool(gid);
            }

            if (WindowManager.instance.isOpened(this.panelId)) {
                WindowManager.instance.close(this.panelId, null, true);
            }
            this.removeSelf();

            //console.log("切页调试5")
            let tabInfo: TabInfo = BottomTabConfig.instance.getTabInfoByPanelId(this.panelId);
            if (tabInfo) {
                BottomTabCtrl.instance.closeTab(this._isClosedByOthers);
            }
            GlobalData.dispatcher.event(CommonEventType.PANEL_CLOSED, this.panelId);
        }

        private closeByOtherPanel(): void {
            this._isClosedByOthers = true;
            this.close();
            this._isClosedByOthers = false;
        }

        // 注册引导翅膀
        protected regGuideSpr(id: GuideSpriteId, spr: Sprite): void {
            if (GuideSpriteId.BOTTOM_CashEquip_MONEY_BTN == id) {
                console.log('苏丹运行测试:', !spr, !this._guideSprites, spr, this._guideSprites);
            }
            if (!spr) return;
            if (!this._guideSprites) {
                this._guideSprites = [];
            }
            if (this._guideSprites.indexOf(spr) !== -1) return;
            this._guideSprites.push(spr);
            spr.on(Laya.Event.DISPLAY, this, this.guideSprDisplayHandler, [id, spr]);
            spr.on(Laya.Event.UNDISPLAY, this, this.guideSprUndisplayHandler, [id]);
        }

        // 显示出来时注册到引导数据中
        public guideSprDisplayHandler(id: GuideSpriteId, spr: Sprite): void {
            GuideModel.instance.registeUI(id, spr);
        }

        // 不显示时从引导数据中删除
        public guideSprUndisplayHandler(id: GuideSpriteId): void {
            GuideModel.instance.removeUI(id);
        }

        public destroy(destroyChild: boolean = true): void {
            // this.removeSelf();
            this.closeBtn = this.backBtn = null;
            this.titleTxt = null;
            if (this._autoEvents) {
                this.removeAutoListeners();
                this._autoEvents = null;
            }
            if (this._closeReleaseSkeleton) {
                let gid = this["$_GID"];
                SkeletonAvatar.deleteViewKeyValue(gid);
            }
            super.destroy(destroyChild);
            if (this._guideSprites) {
                for (let i: int = 0, len: int = this._guideSprites.length; i < len; i++) {
                    let spr: Sprite = this._guideSprites[i];
                    spr.off(Laya.Event.DISPLAY, this, this.guideSprDisplayHandler);
                    spr.off(Laya.Event.UNDISPLAY, this, this.guideSprUndisplayHandler);
                }
                this._guideSprites.length = 0;
                this._guideSprites = null;
            }
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
    }
}
