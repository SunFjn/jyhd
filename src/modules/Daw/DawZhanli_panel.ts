/** 都爱玩 战力分红*/

namespace modules.daw {
    import DawZhanLiUI = ui.DawZhanLi1UI;

    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class DawZhanliPanel extends DawZhanLiUI {
        private _List: CustomList;
        private _skeletonClipL: SkeletonAvatar;
        private _skeletonClipR: SkeletonAvatar;
        private _skeletonClipMid: SkeletonAvatar;
        public destroy(): void {
            if (this._skeletonClipR) {
                this._skeletonClipR.removeSelf();
                this._skeletonClipR.destroy();
                this._skeletonClipR = null;
            }
            if (this._skeletonClipL) {
                this._skeletonClipL.removeSelf();
                this._skeletonClipL.destroy();
                this._skeletonClipL = null;
            }
            if (this._skeletonClipMid) {
                this._skeletonClipMid.removeSelf();
                this._skeletonClipMid.destroy();
                this._skeletonClipMid = null;
            }
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._List = new CustomList();
            this._List.scrollDir = 1;
            this._List.itemRender = DawZhanLiItem;
            this._List.vCount = 7;
            this._List.hCount = 1;
            this._List.width = 536;
            this._List.height = 630;
            this._List.spaceY = 4;
            this._List.x = 0;
            this._List.y = 0;
            this.list.addChild(this._List);
            this.createAvatar();

            this.layerPanel.addChild(this.firstInfoBOx);
            this.firstInfoBOx.pos(0,0)
            this.layerPanel.addChild(this.secondinfo);
            this.secondinfo.pos(0,135);
            this.layerPanel.addChild(this.thirdInfo);
            this.thirdInfo.pos(0,270);
            this.layerPanel.addChild(this.lastInfo);
            this.lastInfo.pos(0,405);
            this.layerPanel.vScrollBarSkin = "";
        }
        protected addListeners(): void {
            super.addListeners();
            this.btnTixian.on(Event.CLICK, this, DawData.ins.OpenTixian, [this.dialogId]);
            this.addAutoListener(this.btnimg, Event.CLICK, this, this.OpenList);
        }

        private createAvatar() {
            this._skeletonClipL = SkeletonAvatar.createShow(this, this);
            this._skeletonClipL.pos(190, 355, true);
            this._skeletonClipL.scale(0.4, 0.4);//统一进行一次缩放来控制大小
            this._skeletonClipL.zOrder = 5;

            this._skeletonClipR = SkeletonAvatar.createShow(this, this);
            this._skeletonClipR.pos(530, 355, true);
            this._skeletonClipR.scale(0.4, 0.4);//统一进行一次缩放来控制大小
            this._skeletonClipR.zOrder = 5;

            this._skeletonClipMid = SkeletonAvatar.createShow(this, this);
            this._skeletonClipMid.pos(360, 445, true);
            this._skeletonClipMid.scale(0.4, 0.4);//统一进行一次缩放来控制大小
            this._skeletonClipMid.zOrder = 5;
        }

        private OpenList() {
            WindowManager.instance.close(WindowEnum.Daw_UI_ZHANLI)
            WindowManager.instance.openDialog(WindowEnum.Daw_UI_ZHANLIList)
        }
        protected removeListeners(): void {
            super.removeListeners();


        }

        public setOpenParam(value): void {
            super.setOpenParam(value);

        }

        private count: number = 0
        onOpened(): void {
            super.onOpened();

            let s = this;
            this.rankname1.text = "暂无上榜"
            this.rankname2.text = "暂无上榜"
            this.rankname3.text = "暂无上榜"
            this.rankpowr1.text = "0"
            this.rankpowr2.text = "0"
            this.rankpowr3.text = "0"
            this.txtTime.text = "(还未开启)"
            this.txtmoney.text = "0元"
            var listinfo = []
            for (let index = 0; index < 10; index++) {
                listinfo.push({ tag: "" + (index + 1), name: "无人上榜", powr: "0" })
            }
            window['SDKNet']("api/game/bonus/rank", {}, (data) => {
                if (data.code == 200) {
                    this.txtmoney.text = (Number(data.data.bonus_money)).toFixed(0) + "元"
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
                                //console.error("计算周期已过")
                            }
                            break;
                        case 1:
                            this.txtTime.text = "(瓜分计算中)"
                            break;
                        case 2:
                            this.txtTime.text = "(瓜分结束 等待下一轮开启)"
                            break;
                    }



                    let arrData = CommonUtil.PHPArray(data.data.power_rank)
                    for (let index = 0; index < arrData.length; index++) {
                        arrData['tag'] = (index + 1).toString();
                    }


                    let len = arrData.length < 10 ? arrData.length : 10
                    for (let index = 0; index < len; index++) {
                        listinfo[index].name = arrData[index].role_name || "默认名字"
                        listinfo[index].powr = arrData[index].power || "0"
                    }
                    for (let index = 1; index < 4; index++) {
                        s['rankpowr' + index].text = "" + listinfo[index - 1].powr
                        s['rankname' + index].text = "" + listinfo[index - 1].name
                    }
                    let arr = []
                    for (let index = 3; index < 10; index++) {
                        arr.push(listinfo[index])
                    }
                    this._List.datas = arr
                }
            }, this)

            // 男主模型展示效果
            let showId = 1001;
            this._skeletonClipL.reset(showId);
            this._skeletonClipR.reset(showId);
            this._skeletonClipMid.reset(showId);
        }

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
            Laya.timer.clear(this, this.countTimer);
        }
    }
}