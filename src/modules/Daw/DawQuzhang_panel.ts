/** 都爱玩 区长分红*/

namespace modules.daw {
    import DawQuZhang1UI = ui.DawQuZhang1UI;

    import Event = Laya.Event;// 事件
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class DawQuzhangPanel extends DawQuZhang1UI {

        private _skeletonClip: SkeletonAvatar;
        public destroy(): void {
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.createAvatar();

        }
        private createAvatar() {
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 450, true);
            this._skeletonClip.scale(0.5, 0.5);//统一进行一次缩放来控制大小
            this._skeletonClip.zOrder = 5;
        }

        protected addListeners(): void {
            super.addListeners();
            this.btnTixian.on(Event.CLICK, this, DawData.ins.OpenTixian, [this.dialogId]);
        }


        onOpened(): void {
            super.onOpened();
            this.txtName.text = "区长:数据加载中..."
            this.txtMy.text = "数据加载中..."
            this.txtMoney.text = "数据加载中..."

            // 主播服展示差异化修改
            let current_server_num: number = modules.login.LoginModel.instance.selectedServer.server_num;
            let current_platform: number = window["dawSDK"].current_platform;

            window['SDKNet']("api/game/bonus/rank", {}, (data) => {
                if (data.code == 200) {
                    this.txtMoney.text = (Number(data.data.bonus_money)).toFixed(0) + "元"
                    let _time = Number(data.data.bonus_time) * 1000
                    let _status = Number(data.data.bonus_status)
                    switch (_status) {
                        case 0:
                            if (_time - (new Date()).valueOf() > 0) {
                                this.count = _time - (new Date()).valueOf();
                                Laya.timer.loop(1000, this, this.countTimer);
                                this.countTimer();
                            } else {
                                this.txtTime.text = "(瓜分计算中)"
                            }
                            break;
                        case 1:
                            this.txtTime.text = "(瓜分计算中)"
                            break;
                        case 2:
                            this.txtTime.text = "(瓜分结束 等待下一轮开启)"
                            break;
                    }
                    this.txtMy.text = (Number(data.data.master.recharge_mony)) + "元"
                    this.scheduleText.text = "瓜分规则：全服区长扶持基数+当前区每三日充值" + data.data.master.proportion
                    if (!data.data.master.role || data.data.master.role.lenght == 0) {
                        this.txtMoney.text = (Number(data.data.bonus_money) + 3200).toFixed(0) + "元"
                        this.txtName.text = "区长:暂无区长"
                        this.showImg.visible = true;
                    } else {
                        this.txtName.text = "区长:" + data.data.master.role.role_name
                        this.showImg.visible = false;
                    }

                    // 主播服展示差异化修改
                    if (current_platform == 3 && current_server_num == 1) {
                        this.showImg.visible = false;
                        this.txtName.text = "区长:" + PlayerModel.instance.roleName;
                        this.getSetQuZhangAmout();
                    }
                }
            }, this)

            // 男主模型展示效果
            let showId = 1001;
            this._skeletonClip.reset(showId);
        }

        /**
         * 设置区长瓜分金额
         */
        private getSetQuZhangAmout() {
            let openDay: number = PlayerModel.instance.openDay;
            let amount: number = -1;
            let lastUpdateDay: number | string = Laya.LocalStorage.getItem("DAW_QUZHANG_LAST_UPDATE_DAY");
            let amountSaved: number | string = Laya.LocalStorage.getItem("DAW_QUZHANG_SAVED_AMOUNT");
            if (lastUpdateDay == "" || lastUpdateDay == undefined) lastUpdateDay = 1;

            // 3天一更新金额
            let needUpdate: boolean = (openDay % 3 == 0 && lastUpdateDay < openDay);

            if (needUpdate || amountSaved == "" || amountSaved == undefined) {
                amount = CommonUtil.getRandomInt(800, 1000);
                Laya.LocalStorage.setItem("DAW_QUZHANG_LAST_UPDATE_DAY", openDay.toString());
                Laya.LocalStorage.setItem("DAW_QUZHANG_SAVED_AMOUNT", amount.toString());
            } else {
                amount = +amountSaved;
            }

            this.txtMoney.text = amount + "元";
        }

        private count: number = 0;
        private countTimer() {
            this.count -= 1000;
            if (this.count <= 0) {
                this.txtTime.text = "(正在计算)"
                Laya.timer.clear(this, this.countTimer);
            } else {
                this.txtTime.text = "(倒计时:" + CommonUtil.showTimeFormat(this.count) + ")"
            }
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
    }
}