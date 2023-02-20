///<reference path="../../../libs/LayaAir.d.ts"/>
namespace modules.rotary_table_jiuzhou {
    import Point = laya.maths.Point;
    import List = laya.ui.List;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    export class RotaryTableJiuZhouRewardAlert extends ui.RotaryTableRewardAlertUI {
        private _list: List;
        private _showIds: Array<any>;
        /**按钮流光特效 */
        private _tenBtnBtnClip: CustomClip;
        /**按钮流光特效 */
        private _oneBtnBtnClip: CustomClip;
        constructor() {
            super();
        }
        public destroy(): void {
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            if (this._oneBtnBtnClip) {
                this._oneBtnBtnClip.removeSelf();
                this._oneBtnBtnClip.destroy();
                this._oneBtnBtnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.width = 565;
            this._list.height = 259;
            this._list.repeatX = 5;
            // list.repeatY = 6;
            this._list.spaceX = 16.25;
            this._list.spaceY = 8;
            this._list.itemRender = BagItem;
            this._list.x = 48;
            this._list.y = 70;
            this.addChild(this._list);
            this.initializeClip();
        }
        public onOpened(): void {
            super.onOpened();
            this.oneMoneytext.text = `${RotaryTableJiuZhouModel.instance._oneMoney}`;
            this.tenMoneytext.text = `${RotaryTableJiuZhouModel.instance._tenMoney}`;
            // this.changDrawNum();
            CommonUtil.delayedPutInBag();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._tenBtnBtnClip.stop();
            this._tenBtnBtnClip.visible = false;
            CommonUtil.delayedPutInBag();
        }
        public playEffect(value: any): void {
            let effectItems = value;
            for (let i = 0; i < effectItems.length; i++) {
                let x = this._list.cells[i].x + this._list.cells[i].width / 2;
                let y = this._list.cells[i].y + this._list.cells[i].height / 2;
                let start = new Point(x, y);
                let arr = [effectItems[i][0], start, this.height];
                GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_EFFECT, [arr]);
            }
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._showIds.length = 0;
            for (let i = 0; i < value.length; i++) {
                let itemId: number = value[i][0];
                let count: number = value[i][1];
                let arr = [itemId, count, 0, null];
                this._showIds.push(arr);
            }
            this._list.array = this._showIds;
            this._list.scrollTo(0);
            this.playEffect(value);
            let allItemId = RotaryTableJiuZhouModel.instance.getNoteListGj();//所有符合弹窗的奖励
            if (allItemId.length > 0) {
                WindowManager.instance.open(WindowEnum.TREASURE_GET_ALERT, allItemId);
            }
            let ingot = PlayerModel.instance.ingot;//玩家代币券
            if (ingot < RotaryTableJiuZhouModel.instance._oneMoney) {
                this.oneMoneytext.color = "#FF3e3e";
            }
            else {
                this.oneMoneytext.color = "#2d2d2d";
            }
            if (ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
                this.tenMoneytext.color = "#FF3e3e";
            }
            else {
                this.tenMoneytext.color = "#2d2d2d";
            }
        }
        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE, this, this.changDrawNum);
        }
        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
        }
        private xunBaoHandler(value: number): void {
            let ingot = PlayerModel.instance.ingot;//玩家代币券
            if (value == 0) {
                if (ingot < RotaryTableJiuZhouModel.instance._oneMoney) {
                    CommonUtil.goldNotEnoughAlert();
                    return;
                }
                RotaryTableJiuZhouCtrl.instance.DuobaoRun(value);
                this.close();
            } else {
                if (ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
                    CommonUtil.goldNotEnoughAlert();
                    return;
                }
                RotaryTableJiuZhouCtrl.instance.DuobaoRun(value);
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            this.close();
        }
        /**
         * 判断按钮特效
         */
        public changDrawNum() {
            let ingot = PlayerModel.instance.ingot;//玩家代币券
            if (ingot == 0) {
                this._oneBtnBtnClip.visible = false;
                this._oneBtnBtnClip.stop();
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else if (ingot > RotaryTableJiuZhouModel.instance._oneMoney && ingot < RotaryTableJiuZhouModel.instance._tenMoney) {
                this._oneBtnBtnClip.visible = true;
                this._oneBtnBtnClip.play();
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else {
                this._oneBtnBtnClip.visible = true;
                this._oneBtnBtnClip.play();
                this._tenBtnBtnClip.visible = true;
                this._tenBtnBtnClip.play();
            }
        }
        /**
         * 初始化特效
         */
        public initializeClip() {
            this._oneBtnBtnClip = new CustomClip();
            this._tenBtnBtnClip = new CustomClip();
            this.oneBtn.addChild(this._oneBtnBtnClip);
            this.tenBtn.addChild(this._tenBtnBtnClip);
            this._oneBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._oneBtnBtnClip.frameUrls = arr;
            this._oneBtnBtnClip.scale(1, 1, true);
            this._oneBtnBtnClip.pos(-6, -8, true);
            this._oneBtnBtnClip.visible = false;
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.scale(1, 1, true);
            this._tenBtnBtnClip.pos(-6, -8, true);
            this._tenBtnBtnClip.visible = false;
        }
    }
}