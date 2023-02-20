///<reference path="../common/common_util.ts"/>
/**九霄令奖励item */
namespace modules.jiuxiaoling {
    import JiuXiaoLingAwardItemUI = ui.JiuXiaoLingAwardItemUI;

    import Items = Configuration.Items;
    import BagUtil = modules.bag.BagUtil;
    import ItemsFields = Configuration.ItemsFields;
    import jiuXiaoLingAward = Configuration.jiuXiaoLingAward;
    import jiuXiaoLingAwardFields = Configuration.jiuXiaoLingAwardFields;


    export class JiuXiaoLingAwardItem extends JiuXiaoLingAwardItemUI {
        private jxl_id: number;
        private jxjl_id: number;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.get1Btn, common.LayaEvent.CLICK, this, this.getAllAward);
            this.addAutoListener(this.get2Btn, common.LayaEvent.CLICK, this, this.getAllAward);

        }

        protected initialize(): void {
            super.initialize();
        }

        // 1表示普通奖励 2表示九霄金令奖励
        protected setData(value: any): void {
            super.setData(value);

            let isBuy: boolean = JiuXiaoLingModel.instance.isBuy;
            let awards = value[jiuXiaoLingAwardFields.award];
            let gold_award = value[jiuXiaoLingAwardFields.gold_award];

            // 0-未达成 1-可领取 2-已领取
            let state: number = value[jiuXiaoLingAwardFields.status];
            let stateG: number = value[jiuXiaoLingAwardFields.status_G];

            // 等级领取提示
            this.hintTxt.text = `${value[jiuXiaoLingAwardFields.level]}级可领`;

            // 按钮和获取状态显示
            this.noAward1.visible = awards.length == 0;
            this.noAward2.visible = gold_award.length == 0;
            this.item1.visible = awards.length != 0;
            this.item2.visible = gold_award.length != 0;

            this.get1Btn.visible = state == 1 && awards.length != 0;
            this.get2Btn.visible = isBuy && stateG == 1 && gold_award.length != 0;
            this.geted1Img.visible = state == 2;
            this.geted2Img.visible = stateG == 2;

            // 奖励item显示
            if (awards.length != 0) {
                this.jxl_id = awards[0][ItemsFields.itemId];
                this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            }

            // 九霄令未达成则灰色显示
            this.item1.grayMask.visible = state == 0;
            // 没有购买九霄金令则灰色显示
            this.item2.grayMask.visible = !isBuy || stateG == 0;

            if (gold_award.length != 0) {
                this.jxjl_id = gold_award[0][ItemsFields.itemId];
                this.item2.dataSource = [gold_award[0][ItemsFields.itemId], gold_award[0][ItemsFields.count], 0, null];
            }
            this.item1.setRPImgActive(state == 1);
            this.item2.setRPImgActive(isBuy && stateG == 1);
        }

        // 领取所有的能领取的奖励
        protected getAllAward(): void {
            JiuXiaoLingCtrl.instance.GetLevelAward()
        }
    }
}