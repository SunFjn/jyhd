///<reference path="../../../modules/config/skill_effect_cfg.ts"/>
///<reference path="../../../modules/config/monster_res_cfg.ts"/>
///<reference path="../../../modules/config/monster_cfg.ts"/>

namespace game.role.component {
    import MonsterResFields = Configuration.MonsterResFields;
    import SkillEffectFields = Configuration.SkillEffectFields;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import SkillEffectCfg = modules.config.SkillEffectCfg;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SkillCfg = modules.config.SkillCfg;
    import SceneUtil = modules.scene.SceneUtil;
    import MonsterCfg = modules.config.MonsterCfg;
    import monsterFields = Configuration.monsterFields;


    export class CombatComponent extends RoleComponent {
        private _target: Role;
        private _sprite: RoleAvatar;
        private _transform: Transform3D;
        // private _tween: TweenJS;
        private _cooldown: number;
        public owner: Role;

        constructor(owner: Role) {
            super(owner);
            this.owner = owner;
            this._cooldown = 0;
        }

        public setup(): void {
            this._sprite = this.property.get("avatar");
            this._transform = this.property.get("transform");
        }

        public teardown(): void {
            this.clearTarget();
        }

        public destory(): void {

        }

        public get target(): Role {
            return this._target;
        }

        public setTarget(target: Role): void {
            if (this._target == target) {
                return;
            }
            this.clearTarget();
            if (!this.testTarget(target)) {
                return;
            }
            this._target = target;
            if (this._target == null) {
                return;
            }
            this._target.on("death", this, this.clearTarget);
            this._target.on("leave", this, this.clearTarget);

            if (this.property.get("type") === RoleType.Master) {
                WindowManager.instance.open(WindowEnum.HEALTH_POINT_PANEL, target.id);
            }
        }

        public skipRevenge() {
            return this.owner.property.get("skipRevenge") || false;
        }

        private clearTarget(): void {
            if (this._target == null) {
                return;
            }
            this._target.off("death", this, this.clearTarget);
            this._target.off("leave", this, this.clearTarget);
            this._target = null;

            if (this.property.get("type") === RoleType.Master) {
                WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
            }
        }

        public isValidTarget(): boolean {
            return this.testTarget(this._target);
        }

        public testTarget(target: Role): boolean {
            /* ?????????????????? */
            if (target == null || !target.isValid) {
                return false;
            }
            /* ????????????????????? */
            if (target.property.get("status") == RoleState.DEATH) {
                return false;
            }
            //?????????????????????????????????????????????,??????????????????????????????????????????
            let isPet = false;
            if (this.owner.property.get("isPet")) {
                isPet = this.owner.property.get("isPet");
            }
            /* ????????????????????? */
            // ???????????? ???????????????????????????????????? 
            if (!isPet && target.property.get("delayDeath")) {
                return false;
            }

            /* ?????????????????????????????? */
            if (target.id == this.owner.id) {
                return false;
            }

            /* ??????????????????????????? */
            let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
            if (cfg[sceneFields.type] == SceneTypeEx.templeBoss ||
                cfg[sceneFields.type] == SceneTypeEx.homeBoss) {
                if (this.owner.property.get("factionId") && target.property.get("factionId") == this.owner.property.get("factionId")) {
                    return false;
                }
            }
            if (cfg[sceneFields.type] == SceneTypeEx.xuanhuoCopy) {
                if (this.owner.property.get("fightTeamId") && target.property.get("fightTeamId") == this.owner.property.get("fightTeamId")) {
                    return false;
                }
            }
            /* ???????????????????????? */
            let actorState = target.property.get("actorState") || 0;
            if (actorState & ActorState.wudi) {
                return false;
                if (cfg[sceneFields.type] == SceneTypeEx.xuanhuoCopy) {
                    // ?????????????????????????????? ???????????????????????? ????????????????????????
                } else {
                    return false;
                }
            }
            if (actorState & ActorState.unhurt) {
                return false;
            }

            /* ?????????????????? */
            return true;
        }

        public isValidRange(): boolean {
            if (!this.isValidTarget()) {
                return false;
            }
            let radius = 250;
            let property = this.target.property;
            if (property.get("type") == RoleType.Monster) {
                radius = MonsterResCfg.instance.getCfgById(property.get("occ"))[MonsterResFields.radius];
            }
            // console.log('????????????_chy:radiusradius', radius);
            let pos = this._transform.localPosition;
            let targetPos = property.get("transform").position;
            return MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, radius);
        }

        public testComfortable() {
            return null;
            // ???????????? ?????? ??????????????????
            let p = new Laya.Point();
            let radius = 250;
            let property = this.target.property;

            if (SceneUtil.singleScene) {
                radius = MonsterResCfg.instance.getCfgById(property.get("occ"))[MonsterResFields.radius];
                // let pos = this.owner.property.get("avatarSK").getSKPositon();
                // let targetPos = property.get("avatarSK").getSKPositon();
                let pos = this._transform.localPosition;
                let targetPos = property.get("transform").position;
                let direction = property.get("defaultSKDirection")  // ?????????????????? -1 ??????  1??????
                // 
                if (Math.abs(pos.y - targetPos.y) > 16 || Math.abs(pos.x - targetPos.x) < 200) {
                    if (!!direction) {
                        p.setTo(
                            targetPos.x - (radius + 30),
                            targetPos.y
                        )
                    } else {
                        p.setTo(
                            targetPos.x,
                            targetPos.y
                        )
                    }
                    return p;
                }

            }
            return null
        }

        private directionTo(x: number, y: number): void {
            let pos = this._transform.localPosition;
            x = pos.x - x;
            this._sprite.SKDirection = (x <= 0) ? 1 : -1;
        }

        private onCombatComplete = (): void => {
            this.owner.publish("combatComplete");
        };

        // ????????????????????????cd???
        public isCooldown(): boolean {
            return this._cooldown > Date.now();
        }

        // ????????????????????????????????????
        public combat(skill: number): void {
            if (!GlobalData.enableCombat) return;
            if (skill == -1 || !this.isValidTarget()) return;

            let info: Configuration.SkillEffect = SkillEffectCfg.instance.getCfgById(skill * 10000);
            if (info == null) throw new Error(`?????????????????????${skill}`);
            let now = Date.now();
            // ????????????????????????????????????
            let action = ActionType.attack_01
            if (info[SkillEffectFields.action] != "") action = <ActionType>info[SkillEffectFields.action];

            let actionTime: number = this._sprite.playAnim([AvatarAniBigType.clothes], action, false, true, () => {
                this.onCombatComplete();
            })

            // ?????????????????????????????????
            let roleid = this.property.get("id");
            let data = { roleid, myLocalPos: this._transform.localPosition };
            let targetPos = this._target.property.get("avatarSK").getSKPositon();
            let world: game.world.World = GameCenter.instance.world;

            // ????????????????????????????????????????????????
            this.directionTo(targetPos.x, targetPos.y);

            // 1.16 ???????????? ?????????????????? ???????????????????????????
            // // ?????????????????????????????????
            // this.missileAttackDelayHandle(info, skill);

            // ????????????
            this.shakeScreen(info, world);

            // 2D: ??????2D????????????,??????2D????????????!
            if (this._sprite._avaterSK) {
                this.doLaunchEffect(info, world, data, targetPos);
            }

            if (this.property.get("type") == RoleType.Master) {
                // ?????????????????????????????????????????????,????????????????????????????????????
                if (actionTime <= 0) {
                    actionTime += 2000;
                }
                this._cooldown = now + actionTime;
            } else {
                this._cooldown = now + 1500;
            }

            //?????????????????????????????????????????????,??????????????????????????????????????????
            if (this._target && !this._target.property.get("delayDeath")) {
                this.owner.publish("useSkill", this._target.id, skill, false);
            }
        }

        /**
         * ??????????????????:???????????????????????????
         * 
         * @param info ??????????????????
         * @param world ??????
         * @param data ??????????????????
         * @param targetPos ???????????????????????????
         */
        private doLaunchEffect(info: Configuration.SkillEffect, world: game.world.World, data: Object, targetPos: Laya.Point) {
            let pos = this._sprite._avaterSK.getSKPositon();
            let roletype = this.property.get("type");

            // ??????????????????
            let skillId = info[SkillEffectFields.self_fb];
            if (!isNaN(parseInt(skillId))) {
                world.publish("launchEffect", roletype, 0, skillId, pos, 0, this._sprite.SKDirection, data)
            }

            // ??????????????????
            skillId = info[SkillEffectFields.self_bg];
            if (!isNaN(parseInt(skillId))) {
                world.publish("launchEffect", roletype, 1, skillId, pos, 0, this._sprite.SKDirection, data)
            }

            // targetPos
            let _targetPos = new Laya.Point(targetPos.x, targetPos.y)
            roletype = this.property.get("type");

            // ??????????????????
            skillId = info[SkillEffectFields.target_fb];
            if (!isNaN(parseInt(skillId))) {
                world.publish("launchEffect", roletype, 0, skillId, _targetPos, 0, this._sprite.SKDirection, data)
            }

            // ??????????????????
            skillId = info[SkillEffectFields.target_bg];
            if (!isNaN(parseInt(skillId))) {
                world.publish("launchEffect", roletype, 1, skillId, _targetPos, 0, this._sprite.SKDirection, data)
            }

            // ?????????????????????????????????????????????????????????
            skillId = info[SkillEffectFields.missile];
            if (!isNaN(parseInt(skillId))) {
                let remote: boolean = false;
                try {
                    remote = this.property.get("petCurrentData")[1];
                } catch (error) {
                    console.error("petCurrentData:" + error);
                }
                // ????????????????????????
                if (remote) {
                    data["targetPos"] = _targetPos;
                    data["petid"] = this.property.get("petCurrentData")[0];
                    world.publish("launchEffect", roletype, 3, skillId, pos, 0, this._sprite.SKDirection, data)
                }
            }
        }

        /**
         * ?????????????????????????????????
         * @param info 
         * @param skill 
         */
        private missileAttackDelayHandle(info: Configuration.SkillEffect, skill: number) {

            if (!isNaN(parseInt(info[SkillEffectFields.missile]))) {
                setTimeout(() => {
                    if (this.isValidTarget()) {
                        this._target.publish("strike", this.owner, skill, false);  // ????????????????????????
                    }
                }, 500);
            } else {
                this._target.publish("strike", this.owner, skill, false);  // ????????????????????????
            }
        }

        /**
         *  ????????????
         */
        private shakeScreen(info: Configuration.SkillEffect, world: game.world.World) {
            if ((Math.floor(Math.random() * 100)) < info[SkillEffectFields.shake_rate]) { // ??????
                world.publish("shakeCamera", true, info[SkillEffectFields.shake_delay]);
            }
        }
    }
}