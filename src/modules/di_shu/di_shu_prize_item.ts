//选择终极大奖
namespace modules.dishu {
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import AutoSC_DiShuTimateList = Protocols.AutoSC_DiShuTimateList;
    import AutoSC_DiShuTimateListFields = Protocols.AutoSC_DiShuTimateListFields;

    export class DishuPrizeItem extends ui.DishuItemUI {
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            //负责按钮等控件的事件的监听
            super.addListeners();
        }

        protected removeListeners(): void {
            //负责取消按钮等控件监听的事件
            super.removeListeners();
        }

        //设置任务列表信息
        protected setData(value: AutoSC_DiShuTimateList): void {
            // console.log(value)
            this.item.needTip = false;
            this.item.dataSource = [value[AutoSC_DiShuTimateListFields.Item][ItemsFields.itemId], value[AutoSC_DiShuTimateListFields.Item][ItemsFields.count], 0, null];
            this.item._numTxt.text = `剩余：${value[AutoSC_DiShuTimateListFields.Num]}`;
            this.item._numTxt.y = 105;
            this.item._numTxt.align = "center";
            this.item._numTxt.color = value[AutoSC_DiShuTimateListFields.Num] > 0 ? "#09a709" : "#a70909";
            this.item._numTxt.visible = true;
            this.item._numTxt.stroke = 0;
        }
    }
}
