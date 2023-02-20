/*九霄令购买等级弹窗*/
namespace modules.jiuxiaoling {
    import Event = laya.events.Event;
    import JiuXiaoLingBuyLevelAlertUI = ui.JiuXiaoLingBuyLevelAlertUI;

    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import idCountFields = Configuration.idCountFields;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import JiuXiaoLingAwardCfg = modules.config.JiuXiaoLingAwardCfg;


    export class JiuXiaoLingBuyLevelAlert extends JiuXiaoLingBuyLevelAlertUI {
        constructor() {
            super();
        }

        private _input: NumInputCtrl;
        private _price: Array<any>;
        private _list: CustomList;
        private _list222: CustomList;


        protected initialize(): void {
            super.initialize();
            // this._price = new Array<any>();
            // 每级消费点券
            let upLevelConsume: number = BlendCfg.instance.getCfgById(68004)[blendFields.intParam][0];
            this._price = [0, upLevelConsume]

            this._input = new NumInputCtrl(this.numInput, this.addBtn, this.reduceBtn, this.addTenBtn, this.reduceTenBtn);

            this._list = new CustomList();
            this._list.width = 575;
            this._list.height = 160;
            this._list.spaceX = 5;
            this._list.hCount = 5;
            this._list.itemRender = BaseItem;
            this._list.x = 70;
            this._list.y = 140;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);

            this._list222 = new CustomList();
            this._list222.width = 575;
            this._list222.height = 190;
            this._list222.spaceX = 5;
            this._list222.hCount = 5;
            this._list222.itemRender = BaseItem;
            this._list222.x = 70;
            this._list222.y = 375;
            this._list222.zOrder = 10;
            this._list222.selectedIndex = -1;
            this.addChildAt(this._list222, 1);
        }

        public onOpened(): void {
            super.onOpened();
            this.calcParams();
            this.updateView();
        }


        protected addListeners(): void {
            super.addListeners();
            this._input.on(Event.CHANGE, this, this.inputHandler);
            this._input.addListeners();
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.buyHandler);

        }

        private calcParams(): void {

            // 最多能够购买的等级数量
            this._input.max = JiuXiaoLingAwardCfg.instance.level - JiuXiaoLingModel.instance.level;
            // 购买的默认输入初始值
            this._input.value = 10;

            console.log(JiuXiaoLingAwardCfg.instance.level, JiuXiaoLingModel.instance.level, this._input.max);
        }

        private inputHandler(): void {
            let num = this._input.value;

            this.totalPriceTxt.text = (num * this._price[idCountFields.count]).toString();

            // 修改奖励显示
            this.updateView();
        }

        private updateView(): void {
            let currentLevel: number = JiuXiaoLingModel.instance.level;
            let targetLevel: number = this._input.value + currentLevel;

            // 提示文本
            this.awardHintTxt.text = `升到${targetLevel}级可立刻获得以下奖励`;
            this.buyHintTxt.text = `购买${this._input.value}级升到${targetLevel}级`;

            let data1 = JiuXiaoLingModel.instance.getTargetAreaAwardList(0, currentLevel, targetLevel);
            let data2 = JiuXiaoLingModel.instance.getTargetAreaAwardList(1, currentLevel, targetLevel);

            this._list.datas = data1;
            this._list222.datas = data2;

        }

        //购买
        private buyHandler(): void {
            JiuXiaoLingCtrl.instance.BuyLevel([this._input.value]);
        }
    }
}