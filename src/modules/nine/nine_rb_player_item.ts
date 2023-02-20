/** 九天之巅右下玩家单元项*/


namespace modules.nine {
    import NineRBPlayerItemUI = ui.NineRBPlayerItemUI;
    import HumanShow = Protocols.HumanShow;
    import HumanShowFields = Protocols.HumanShowFields;
    import ActorShowFields = Protocols.ActorShowFields;

    export class NineRBPlayerItem extends NineRBPlayerItemUI {
        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();
            let human: HumanShow = this._data;
            PlayerModel.instance.selectTarget(SelectTargetType.Player, human[HumanShowFields.actorShow][ActorShowFields.objId]);
        }

        protected setData(value: any): void {
            super.setData(value);
            let human: HumanShow = value;
            this.nameTxt.text = human[HumanShowFields.actorShow][ActorShowFields.name];
            let rate: number = human[HumanShowFields.actorShow][ActorShowFields.fight] / PlayerModel.instance.fight;
            if (rate >= 3) {
                this.gradeTxt.text = "超强";
                this.gradeTxt.color = CommonUtil.getColorByQuality(4);
            } else if (rate >= 1.5) {
                this.gradeTxt.text = "强者";
                this.gradeTxt.color = CommonUtil.getColorByQuality(3);
            } else if (rate >= 0.8) {
                this.gradeTxt.text = "均等";
                this.gradeTxt.color = CommonUtil.getColorByQuality(2);
            } else {
                this.gradeTxt.text = "弱小";
                this.gradeTxt.color = CommonUtil.getColorByQuality(1);
            }
        }
    }
}