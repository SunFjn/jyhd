/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.daw {
    import DawZhanLiListUI = ui.DawZhanLiList1UI;

    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧

    export class DawZhanliListPanel extends DawZhanLiListUI {
        private _List: CustomList;
        constructor() {
            super();

        }

        public destroy(): void {

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._List = new CustomList();
            this._List.scrollDir = 1;
            this._List.itemRender = DawZhanLiItem2;
            // this._List.vCount = 7;
            this._List.hCount = 1;
            this._List.width = 531;
            this._List.height = 514;
            this._List.spaceY = 5;
            this._List.x = 0;
            this._List.y = 0;
            this.list.addChild(this._List);


        }

        protected addListeners(): void {
            super.addListeners();

        }


        protected removeListeners(): void {
            super.removeListeners();

        }

        onOpened(): void {
            super.onOpened();
            let s = this;
            this.txtTime.text = "(还未开启)"
            this.txtmoney.text = "0元"
            var listinfo = []
            for (let index = 0; index < 10; index++) {
                listinfo.push({ tag: "" + (index + 1), name: "无人上榜", powr: "0" })
            }
            // window['WuxiantaoNet']("/api/jiuzhou/getTotalpowerbonus", {}, (data) => {
            //     if (data.code == 200) {
            //         this.txtTime.text = data.data.bonus_time == "" ? "奖池未结算" : "(发放时间:" + data.data.bonus_time + ")"
            //         this.txtmoney.text = "" + data.data.price + "元"
            //         let arr = data.data.content
            //         for (let index = 0; index < arr.length; index++) {
            //             arr[index]['tag'] = "" + (index + 1)
            //         }
            //         this._List.datas = arr
            //     }
            // }, this)


            window['SDKNet']("api/game/bonus/rank", {}, (data) => {
                if (data.code == 200) {
                    this.txtTime.text = !data.data.last_bonus.bonus_time ? "奖池未结算" : "(发放时间:" + CommonUtil.getDate(data.data.last_bonus.bonus_time + "000") + ")"
                    this.txtmoney.text = !data.data.last_bonus.power_money ? "0元" : "" + Number(data.data.last_bonus.power_money) + "元"
                    let arr = CommonUtil.PHPArray(data.data.last_bonus.power_description)
                    for (let index = 0; index < arr.length; index++) {
                        arr[index]['tag'] = "" + (index + 1)
                    }
                    this._List.datas = arr
                }
            }, this)

        }



        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }







        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
    }
}


