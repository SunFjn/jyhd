//奖励预览
namespace modules.dishu {
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    export class DishuItem extends ui.DishuItemUI {
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
        protected setData(value: Items): void {
            this.item.needTip = true;
            this.item.dataSource = [value[ItemsFields.itemId], value[ItemsFields.count], 0, null];
        }
    }
}
