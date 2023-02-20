///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../config/money_cat_cfg.ts"/>
///<reference path="money_cat_item.ts"/>

namespace modules.money_cat {
    import Event = Laya.Event;
    import CustomClip = common.CustomClip;
    import CustomList = modules.common.CustomList;
    import MoneyCatCfg = modules.config.MoneyCatCfg;
    import money_cat = Configuration.money_cat;
    import MoneyCatFields = Configuration.money_catFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendCfg = config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class MoneyCatAlert extends ui.MoneyCatAlertUI {
        constructor() {
            super();
        }

        private _list: CustomList;
        private _getBtnEff: CustomClip;  //按钮粒子效果

        protected initialize(): void {
            super.initialize();
            //按钮粒子效果
            this._getBtnEff = CommonUtil.creatEff(this.getBtn, "btn_light", 15);
            this._getBtnEff.pos(-5, -22);
            this._getBtnEff.scaleY = 1.3;

            this.wayToGet.underline = true;
            let items: Array<number> = BlendCfg.instance.getCfgById(49001)[blendFields.intParam];
            this.baseItem.dataSource = [items[0], items[1], 0, null];     //招财猫Item显示
            this._list = new CustomList();
            this._list.width = 550;
            this._list.height = 460;
            this._list.x = 65;
            this._list.y = 232;
            this._list.itemRender = MoneyCatItem;
            this.addChildAt(this._list, 2);
        }

        public destroy(): void {
            super.destroy();
            if (this._getBtnEff) {
                this._getBtnEff.destroy();
                this._getBtnEff = null;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, Event.CLICK, this, this.getBtnHandler);        //一键激活
            this.addAutoListener(this.wayToGet, Event.CLICK, this, this.wayToGetHandler);        //获取途径
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.update);       //画面刷新事件
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();
            this.update();
        }

        private update(): void {
            //显示隐藏获取途径
            this.wayToGet.visible = MoneyCatModel.instance.actived == -1;

            let actived: number = MoneyCatModel.instance.actived;      //已激活的猫
            let canActive: number = MoneyCatModel.instance.canActived;   //可激活的猫

            //按钮特效
            if (actived != -1 && actived < canActive) {
                this._getBtnEff.visible = true;
                this._getBtnEff.play();
            }
            else {
                this._getBtnEff.visible = false;
            }

            let dats: Array<MoneyCatItemValue> = [];
            let len: number = MoneyCatCfg.instance.arr.length;
            let arr: Array<money_cat> = MoneyCatCfg.instance.arr;


            let sum: number = 0;       //代币券总数
            for (let i = 1; i < len; ++i) {
                if (arr[i][MoneyCatFields.era] <= actived) {
                    sum += arr[i][MoneyCatFields.award][0][1];
                }
                else {
                    break;
                }
            }
            this.money.text = sum.toString() + "代币券";       //代币券显示

            //招财猫下标从1开始
            for (let i = 1; i < len; ++i) {
                if (arr[i][MoneyCatFields.era] <= actived) {
                    dats.push([arr[i][MoneyCatFields.era], MoneyCatItemValueState.actived]);
                }
                else if (arr[i][MoneyCatFields.era] <= canActive) {
                    dats.push([arr[i][MoneyCatFields.era], MoneyCatItemValueState.canActive]);
                }
                else {
                    dats.push([arr[i][MoneyCatFields.era], MoneyCatItemValueState.unActive]);
                }
            }
            this._list.datas = dats;
        }

        //一键激活
        private getBtnHandler(): void {
            if (MoneyCatModel.instance.actived == -1) {
                this.wayToGetHandler();     //如果还没购买或激活，将跳转到购买页面
            }
            else if (MoneyCatModel.instance.actived < MoneyCatModel.instance.canActived) {
                MoneyCatCtrl.instance.activeMoneyCat();
            }
            else if (MoneyCatModel.instance.actived == MoneyCatCfg.instance.arr[MoneyCatCfg.instance.arr.length - 1][MoneyCatFields.era]) {
                SystemNoticeManager.instance.addNotice("已领取完全部招财代币券", false);      //系统提示
            }
            else {
                SystemNoticeManager.instance.addNotice("未达到领取条件", true);      //系统提示
            }
        }

        //获取途径
        private wayToGetHandler(): void {
            //如果已首充
            // if(FirstPayModel.instance.giveState){
            WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);      //招财仙猫购买页面
            // }
            // else{
            //     WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);      //首充页面
            // }
        }
    }
}