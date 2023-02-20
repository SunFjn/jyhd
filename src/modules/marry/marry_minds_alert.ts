/** 姻缘信物 心有灵犀*/


namespace modules.marry {

    import MarryMindsAlertUI = ui.MarryMindsAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    export class MarryMindsAlert extends MarryMindsAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();


        }

        protected addListeners(): void {
            super.addListeners();

        }


        protected removeListeners(): void {
            super.removeListeners();


        }



        public setOpenParam(value): void {
            super.setOpenParam(value);
            //[name,level,typeid]
            // { _name: name, _itemId: itemId, _lv: MarryModel.instance.getheartLevelLevel(itemId) });
            let name = value._name
            let itemId = value._itemId
            let lv = value._lv
            let cfg = MarryKeepsakeCfg.instance.getMinds(itemId, lv)
            let nextCfg = MarryKeepsakeCfg.instance.getMinds(itemId, lv + 1)
            this.titleTXt.text = "心有灵犀·" + lv + "阶"
            this.powerNum.value = "0"

            if (!cfg) {
                this.currentTxt.text = "当前阶段 "
                this.curLvDesc.text = "无"
            } else {
                this.currentTxt.text = "当前阶段 双方【" + name + "】都到达" + cfg[1] + "阶"
                this.curLvDesc.text = name + "进阶属性 +" + cfg[0] + "%"
            }

            if (!nextCfg) {
                this.currentTxt.text = "下一阶段 已满级"
                this.nextLvDesc.text = "无"
                this.conditionTxt.text = ""
            } else {
                this.nextTxt.text = "下一个阶段 双方【" + name + "】都到达" + nextCfg[1] + "阶"
                this.nextLvDesc.text = name + "进阶属性 +" + nextCfg[0] + "%"
                let count = 0
                count += MarryModel.instance.getKeepsakeLevel2(itemId) > nextCfg[1] ? 1 : 0
                count += MarryModel.instance.getcoupleGradeLevel(itemId) > nextCfg[1] ? 1 : 0
                this.conditionTxt.text = "(" + count + "/2)"
            }
            this.conditionTxt.x = this.nextTxt.width + 5

        }
        onOpened(): void {
            super.onOpened();

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}