///<reference path="../../../../../modules/nine/nine_model.ts"/>


namespace game.role.component.brain.behavior {
    import sceneFields = Configuration.sceneFields;
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import SceneCfg = modules.config.SceneCfg;
    import PlayerModel = modules.player.PlayerModel;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import NineModel = modules.nine.NineModel;
    import NineCopyFields = Protocols.NineCopyFields;

    export class DeathAction extends Action {
        private _waitRevive: boolean;
        private readonly _context: Property;
        // private _timeout: number;
        private _owner: Role;

        constructor(owner: Role) {
            super("DeathAction");
            this._waitRevive = false;
            this._context = owner.property;
            this._owner = owner;
        }

        protected onEnter(): boolean {
            let success = this._context.get("status") == RoleState.DEATH;
            if (success) {
                this._owner.on("reviveReply", this, this.reviveReply);
                let tuple = SceneCfg.instance.getCfgById(MapUtils.currentID);
                let reviveTime = tuple[sceneFields.reliveTime];
                if (tuple[sceneFields.type] === SceneTypeEx.homeBoss) {
                    if (!WindowManager.instance.isOpened(WindowEnum.LEAVE_SCENCE_ALERT)) {
                        WindowManager.instance.openDialog(WindowEnum.LEAVE_SCENCE_ALERT, PlayerModel.instance.playerDeadTuple);
                    }
                }
                else if (tuple[sceneFields.type] === SceneTypeEx.templeBoss) {
                    if (!WindowManager.instance.isOpened(WindowEnum.LEAVE_SCENCE_ALERT)) {
                        WindowManager.instance.openDialog(WindowEnum.LEAVE_SCENCE_ALERT, PlayerModel.instance.playerDeadTuple);
                    }
                }
                else if (tuple[sceneFields.type] === SceneTypeEx.nineCopy) {     // 九天之巅
                    // 判断剩余次数，大于0才需要弹框
                    if (NineModel.instance.nineCopy[NineCopyFields.remainTimes] > 0) {
                        WindowManager.instance.open(WindowEnum.NINE_KILLED_ALERT, PlayerModel.instance.playerDeadTuple);
                    }
                } else if (tuple[sceneFields.type] === SceneTypeEx.arenaCopy) {      // 竞技场

                } else if (tuple[sceneFields.type] === SceneTypeEx.xuanhuoCopy) {      // 玄火副本 提示击杀者和玄火之力
                    WindowManager.instance.openDialog(WindowEnum.XUANHUO_REVIVE_ALERT);
                } else if (reviveTime) {
                    WindowManager.instance.openDialog(WindowEnum.REVIVE_ALERT);
                } else {
                    Channel.instance.publish(UserMapOpcode.ReqRevive, null);
                }
                this._waitRevive = true;
                this._context.get("avatar").playAnim([AvatarAniBigType.clothes], ActionType.SIWANG, false, true);
                // this._timeout = Date.now() + 1000;
            }
            return success;
        }

        protected onUpdate(): BehaviorStatus {
            // if (this._timeout > Date.now()) {
            //     return BehaviorStatus.Running;
            // }
            return this._waitRevive ? BehaviorStatus.Running : BehaviorStatus.Success;
        }

        protected onExit(): void {
            this._waitRevive = false;
            this._owner.off("reviveReply", this, this.reviveReply);
        }

        private reviveReply(result: number): void {
            if (result == 0) {
                this._context.set("status", RoleState.IDLE);
                this._waitRevive = false;
            } else if (DEBUG) {
                CommonUtil.noticeError(result);
            }
        }
    }
}