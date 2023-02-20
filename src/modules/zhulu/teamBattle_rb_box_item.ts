/** 战队逐鹿 争夺战 右下玩家单元项*/


namespace modules.zhulu {
    import TeamBattleRBBoxItemUI = ui.TeamBattleRBBoxItemUI;
    import NpcShow = Protocols.NpcShow;
    import NpcShowFields = Protocols.NpcShowFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import NpcCfg = modules.config.NpcCfg;
    import npc = Configuration.npc;
    import npcFields = Configuration.npcFields;
    import PosFields = Configuration.PosFields;
    import scene_copy_teamBattle = Configuration.scene_copy_teamBattle;
    import scene_copy_teamBattleFields = Configuration.scene_copy_teamBattleFields;
    import GameCenter = game.GameCenter;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    export class TeamBattleRBBoxItem extends TeamBattleRBBoxItemUI {
        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();

            let cfg: scene_copy_teamBattle = this._data;
            // let tuple = NpcCfg.instance.getCfgById(cfg[scene_copy_teamBattleFields.id])
            // if (tuple == null) return;
            // let npcPos = tuple[npcFields.pos];
            // if (npcPos == null) return;
            if (WindowManager.instance.isOpened(WindowEnum.Transport_PANEL)) {
                SystemNoticeManager.instance.addNotice("正在运输!", true);
                return;
            }
            PlayerModel.instance.selectTarget(SelectTargetType.Npc, cfg[scene_copy_teamBattleFields.id]);
            // let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            // let pos = role.property.get('pos')
            // let isTransfer = MapUtils.testDistance(pos.x, pos.y, npcPos[0], npcPos[1], 50)
            // if (isTransfer) {
            //     console.log('研发测试_chy:在区域内',);

            // } else {
            //     console.log('研发测试_chy:在区域外',);
            //     PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
            //     if (WindowManager.instance.isOpened(WindowEnum.Transfer_PANEL)) {
            //         SystemNoticeManager.instance.addNotice("正在传送!", true);
            //         return;
            //     }

            //     WindowManager.instance.open(WindowEnum.Transfer_PANEL, cfg[scene_copy_teamBattleFields.id])
            // }


        }

        protected setSelected(value: boolean): void {
            this.isSelect.visible = value
            super.setSelected(value);

        }
        private _pos: Point = { x: 0, y: 0 }
        protected setData(value: scene_copy_teamBattle): void {
            super.setData(value);
            let cfg: scene_copy_teamBattle = value;
            this.nameTxt.text = cfg[scene_copy_teamBattleFields.name]
            // PlayerModel.instance.pkMode
            // let rate: number = human[HumanShowFields.actorShow][ActorShowFields.fight] / PlayerModel.instance.fight;
            let npc = NpcCfg.instance.getCfgById(cfg[scene_copy_teamBattleFields.id]);
            if (npc != null) this._pos = { x: npc[npcFields.pos][PosFields.x], y: npc[npcFields.pos][PosFields.y] }
            cfg[scene_copy_teamBattleFields.score] < 20 ? this.icon.scale(0.7, 0.7) : this.icon.scale(1, 1)

        }
        public checkDistance() {
            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role == null) return
            let p = role.property.get('avatar').transform.position;
            let real = MapUtils.getPosition(p.x, -p.y)
            let distance = MapUtils.getDistance(this._pos.x, this._pos.y, real.x, real.y)
            if (distance >= 200) {
                this.gradeTxt.text = "较远";
                this.gradeTxt.color = CommonUtil.getColorByQuality(4);
            } else if (distance >= 100) {
                this.gradeTxt.text = "中等";
                this.gradeTxt.color = CommonUtil.getColorByQuality(3);
            } else {
                // this.gradeTxt.text = "较近";
                // this.gradeTxt.color = CommonUtil.getColorByQuality(2);
                this.gradeTxt.text = "较近";
                this.gradeTxt.color = CommonUtil.getColorByQuality(1);
            }
        }
    }
}