/** 战队争夺战右下玩家单元项*/


namespace modules.zhulu {
    import TeamBattleRBPlayerItemUI = ui.TeamBattleRBPlayerItemUI;
    import HumanShow = Protocols.HumanShow;
    import HumanShowFields = Protocols.HumanShowFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import GameCenter = game.GameCenter;

    export class TeamBattleRBPlayerItem extends TeamBattleRBPlayerItemUI {
        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();

            if (WindowManager.instance.isOpened(WindowEnum.Transport_PANEL)) {
                SystemNoticeManager.instance.addNotice("正在运输!", true);
                return;
            }
            let human: HumanShow = this._data;

            let role = GameCenter.instance.getRole(human[HumanShowFields.actorShow][ActorShowFields.objId]);
            if (role) {
                let actorState = role.property.get("actorState") || 0;
                if (actorState & ActorState.wudi || actorState & ActorState.unhurt) {
                    SystemNoticeManager.instance.addNotice("目标当前幽灵状态", true);
                    return
                }
            }
            if (ZhuLuModel.instance.ghost) {
                SystemNoticeManager.instance.addNotice("幽灵状态不可攻击!", true);
                return
            }




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