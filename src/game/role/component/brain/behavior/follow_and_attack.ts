namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;

    const enum petCurrentFields {
        id = 0,
        isRemote = 1,
        radius = 2,
        attack_radius = 3
    }

    /**
     * 仙娃宠物寻路和攻击触发ai
     */
    export class FollowAndAttack extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;

        private readonly _leader: CombatComponent;
        private readonly _leaderLocomotor: LocomotorComponent;
        private readonly _leaderTransform: Transform3D;
        private readonly _sprite: RoleAvatar;
        private readonly _property: Property;
        private readonly _roleType: RoleType;
        private _isInitPos = false;

        /** 当前宠物/仙娃实时数据 */
        private _currentData: [number, boolean, number, number];

        /**
         * 宠物/仙娃跟随和攻击 - 属性读配置表
         * 
         * @param owner 自己属性
         * @param leader 主人
         */
        constructor(owner: Role, leader: Role, roleType: RoleType) {
            super("PetFollowAndAttack");
            this._roleType = roleType;
            this._property = owner.property;
            this._currentData = owner.property.get("petCurrentData");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");
            this._leader = leader.getComponent(CombatComponent);
            this._leaderLocomotor = leader.getComponent(LocomotorComponent);
            this._leaderTransform = leader.property.get("transform");
            this._sprite = owner.property.get("avatar");
        }

        
        /**
         * 检测宠物仙娃配置信息
         */
        private checkHaveData() {
            if (this._currentData == null || this._currentData == undefined) {
                this.updateCurrentData();
            }
            return (this._currentData != null && this._currentData != undefined);
        }

        /**
         * 更新宠物仙娃配置信息
         */
        private updateCurrentData() {
            switch (this._roleType) {
                case RoleType.Doll:
                    console.log("读取仙娃配置...");
                    this._currentData = this._property.get("dollCurrentData");
                    break;
                case RoleType.Pet:
                    this._currentData = this._property.get("petCurrentData");
                    break;
            }
         
        }

        protected onEnter(): boolean {
            this.updateCurrentData();
            return !this.isValidRange() || this._leader.isValidTarget();
        }
        
        protected onUpdate(): BehaviorStatus {
            if (!this.checkHaveData()) {
                return BehaviorStatus.Failure;
            }
            // if (this._leader.property.get("status") == RoleState.DEATH) {
            //     return BehaviorStatus.Failure;
            // }

            if (!this._isInitPos && this._leaderTransform.localPosition.x > 0) {//初始化宠物位置
                let leaderPos = this._leaderTransform.localPosition;
                let desPos:Laya.Vector3 = new Laya.Vector3(leaderPos.x,leaderPos.y,leaderPos.z);
                this._transform.localPosition = desPos;
                this._isInitPos = true;
            }

            if (!this.isValidRange()) {
                if (!this._locomotor.running()) {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                    let targetPos = this._leaderLocomotor.getNextPos()
                    let leaderPos = this._leaderTransform.localPosition;
                    let coords: Laya.Point;
                
                    if (!this._leader.target) {
                        //到达目标之前宠物不能跑到角色前面
                        if ((targetPos.x > leaderPos.x)&&(this._transform.localPosition.x > leaderPos.x)) {
                            return BehaviorStatus.Running;
                        }
                        coords = MapUtils.getPosition(targetPos.x, -targetPos.y);
                    }else if(this._currentData[petCurrentFields.isRemote]){
                        coords = MapUtils.getPosition(leaderPos.x, -leaderPos.y);
                    } else {
                        let monsterPos = this._leader.target.property.get("pos");
                        coords = new Laya.Point(monsterPos.x, monsterPos.y);
                    }

                    this._locomotor.moveToCoordinate(coords);
                }
                return BehaviorStatus.Running;
            } else {

                if (this._combat.isCooldown()) {
                    return BehaviorStatus.Running;
                }
    
                if (!this._leader.target) {
                    return BehaviorStatus.Failure;
                }
                // if (!this._leader.isValidRange()) {
                //     return BehaviorStatus.Failure;
                // }

                this._locomotor.stop();
                this._combat.setTarget(this._leader.target);
                let skillId = this._skill.selectSkill(); 

                // 宠物技能暂时关闭
                if(skillId!=4001){
                    this._combat.combat(skillId);
                }
              
                return BehaviorStatus.Running;
            }

            return BehaviorStatus.Failure;
        }

        protected onExit(): void {
            this._locomotor.stop();
        }

        private isValidRange(): boolean {
            if (!this.checkHaveData()) return;
            let pos = this._transform.localPosition;
            let targetPos = this._leaderTransform.localPosition;

            // 远程宠物/仙娃与玩家判断距离
            if (this._currentData[petCurrentFields.isRemote] || !this._leader.target) {
                return MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, this._currentData[petCurrentFields.radius]);
            }
            // 近程的与怪物判断距离
            else {
                let monsterPos = this._leader.target.property.get("pos");
                // console.log(pos, monsterPos);
                return MapUtils.testDistance(pos.x, pos.y, monsterPos.x * MapUtils.cellWidth, -monsterPos.y * MapUtils.cellHeight, this._currentData[petCurrentFields.attack_radius]);
            }
        }
    }
}