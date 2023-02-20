namespace modules.treasure {
    import TreasureCfg = modules.config.TreasureCfg;
    import Image = laya.ui.Image;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import Button = laya.ui.Button;

    export class TreasureButtonItem extends ItemRender {
        private btn: Button;
        private redRP: Image;

        protected initialize(): void {
            super.initialize();
            this.btn = new Button();
            this.btn.skin = "common/btn_tongyong_1.png";
            this.btn.stateNum = 2;
            this.btn.labelFont = "SimHei";
            this.btn.labelSize = 26;
            this.btn.labelColors = "#c9724b, #ffffff";
            this.addChild(this.btn);
            // let w = this.width * 0.8;
            // let h = this.height * 0.8;
            this.scale(0.8, 0.8);
            // this.width = w;
            // this.height = h;
            this.redRP = new Image("common/image_common_xhd.png");
            this.redRP.pos(128, 1);
            this.redRP.visible = true;
            this.btn.addChild(this.redRP);
        }

        protected setData(value: any): void {
            super.setData(value);
            let type = value;
            switch (type) {
                case 0:
                    this.btn.label = "神器探索";
                    let condition0 = TreasureCfg.instance.getItemConditionByGrad(0, 0);/*消耗道具 道具ID#道具数量*/
                    let count0 = BagModel.instance.getItemCountById(condition0[idCountFields.id]);
                    this.redRP.visible = ((count0 > 0 || TreasureModel.instance.fistMianFei(0)) && TreasureModel.instance.getKaiQi(0));
                    break;
                case 1:
                    this.btn.label = "晋升探索";//		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
                    let condition1 = TreasureCfg.instance.getItemConditionByGrad(1, 0);/*消耗道具 道具ID#道具数量*/
                    let count1 = BagModel.instance.getItemCountById(condition1[idCountFields.id]);
                    this.redRP.visible = ((count1 > 0 || TreasureModel.instance.fistMianFei(1)) && TreasureModel.instance.getKaiQi(1));
                    break;
                case 2:
                    this.btn.label = "进阶探索";
                    let condition2 = TreasureCfg.instance.getItemConditionByGrad(2, 0);/*消耗道具 道具ID#道具数量*/
                    let count2 = BagModel.instance.getItemCountById(condition2[idCountFields.id]);
                    this.redRP.visible = ((count2 > 0 || TreasureModel.instance.fistMianFei(2)) && TreasureModel.instance.getKaiQi(2));
                    break;
                case 3:
                    this.btn.label = "未央探索";
                    let condition3 = TreasureCfg.instance.getItemConditionByGrad(3, 0);/*消耗道具 道具ID#道具数量*/
                    let count3 = BagModel.instance.getItemCountById(condition3[idCountFields.id]);
                    this.redRP.visible = ((count3 > 0 || TreasureModel.instance.fistMianFei(3)) && TreasureModel.instance.getKaiQi(3));
                    break;
                case 4:
                    this.btn.label = "洞穴探索"; // 圣物探索
                    let condition4 = TreasureCfg.instance.getItemConditionByGrad(4, 0);/*消耗道具 道具ID#道具数量*/
                    let count4 = BagModel.instance.getItemCountById(condition4[idCountFields.id]);
                    this.redRP.visible = ((count4 > 0 || TreasureModel.instance.fistMianFei(4)) && TreasureModel.instance.getKaiQi(4));
                    break;
            }
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.btn.selected = value;
        }
    }
}