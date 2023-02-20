namespace game.role.component {
    import NpcCfg = modules.config.NpcCfg;
    import Transform3D = Laya.Transform3D;
    import MapUtils = game.map.MapUtils;
    import npcFields = Configuration.npcFields;

    export class FeatureComponent extends RoleComponent {
        private _distance: number;
        private _transform: Transform3D;
        private _hasOpen: boolean;

        constructor(owner: Role) {
            super(owner);
        }

        public setup(): void {
            let tuple = NpcCfg.instance.getCfgById(this.property.get("occ"));
            this._distance = tuple[npcFields.distance] || 0;
            this._transform = GameCenter.instance.getRole(PlayerModel.instance.actorId).property.get("transform");
            this._hasOpen = false;
            if (this._distance != 0) {
                if (this.property.get("own") != 0 && this.property.get("own") != PlayerModel.instance.actorId) {
                    return;
                }
                this.testDistance();
                this.property.get("avatar").timerLoop(100, this, this.testDistance);
            }


            this.owner.on("trigger", this, this.onTrigger);
        }

        public teardown(): void {
            if (this._hasOpen) {
                WindowManager.instance.close(WindowEnum.GATHER_PANEL);
                this._hasOpen = false;
            }
            this.property.get("avatar").clearTimer(this, this.testDistance);
            this.owner.off("trigger", this, this.onTrigger);
        }

        public testDistance(): void {
            let pos = this._transform.localPosition;
            let targetPos = this.property.get("transform").localPosition;
            if (MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, this._distance)) {
                if (!this._hasOpen) {
                    WindowManager.instance.open(WindowEnum.GATHER_PANEL, this.owner.id);
                    this._hasOpen = true;
                }
            } else {
                if (this._hasOpen) {
                    WindowManager.instance.close(WindowEnum.GATHER_PANEL);
                    this._hasOpen = false;
                }
            }
        }

        public destory(): void {
        }

        private onTrigger(): void {
            GlobalData.dispatcher.event(CommonEventType.PLAYER_TRIGGER_NPC, this.owner.id);
        }
    }
}