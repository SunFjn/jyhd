///<reference path="../base/ecs/entity.ts"/>
///<reference path="world/component/camera_component.ts"/>
///<reference path="world/component/layer_component.ts"/>
///<reference path="world/component/effect_component.ts"/>
///<reference path="world/component/shadow_component.ts"/>
///<reference path="world/component/package_component.ts"/>
///<reference path="world/component/literal_component.ts"/>
///<reference path="world/component/hud_component.ts"/>



///<reference path="role/role.ts"/>

///<reference path="role/component/exterior/avatar_component.ts"/>
///<reference path="role/component/exterior/monster_avatar_component.ts"/>
///<reference path="role/component/exterior/npc_avatar_component.ts"/>
///<reference path="role/component/exterior/swimsuit_avatar_component.ts"/>
///<reference path="role/component/title_component.ts"/>
///<reference path="role/component/skill_component.ts"/>
///<reference path="role/component/locomotor_component.ts"/>
///<reference path="role/component/combat_component.ts"/>
///<reference path="role/component/swimsuit_head_component.ts"/>
///<reference path="role/component/brain/human_brain_component.ts"/>
///<reference path="role/component/brain/home_boss_brain_component.ts"/>
///<reference path="role/component/brain/pet_brain_component.ts"/>
///<reference path="role/component/brain/common_brain_component.ts"/>
///<reference path="role/component/brain/top_brain_component.ts"/>
///<reference path="role/component/brain/xuanhuo_component.ts"/>
///<reference path="role/component/brain/attack_brain_component.ts"/>
///<reference path="role/component/brain/garden_brain_component.ts"/>
///<reference path="role/component/brain/battle_brain_component.ts"/>
///<reference path="role/component/brain/gather_brain_component.ts"/>
///<reference path="role/component/feature_component.ts"/>
///<reference path="role/component/pet_proxy_component.ts"/>
///<reference path="role/component/super_pet_proxy_component.ts"/>
///<reference path="../modules/yunmeng/yun_meng_mi_jing_model.ts"/>
///<reference path="role/component/brain/advenge_brain_component.ts"/>
///<reference path="../modules/sheng_yu/sheng_yu_boss_model.ts"/>
///<reference path="role/component/brain/temple_boss_brain_component.ts"/>
///<reference path="role/component/avatar_sk_component.ts"/>
///<reference path="role/component/monster_sk_component.ts"/>
///<reference path="role/component/npc_sk_component.ts"/>
///<reference path="role/component/brain/teamBattle_component.ts"/>
///<reference path="../modules/zhulu/zhulu_model.ts"/>

namespace game {
    import Entity = base.ecs.Entity;
    import MessageDispatcher = base.ecs.MessageDispatcher;
    import sceneFields = Configuration.sceneFields;
    import MapUtils = game.map.MapUtils;
    import CommonBrainComponent = game.role.component.brain.CommonBrainComponent;
    import HomeBossBrainComponent = game.role.component.brain.HomeBossBrainComponent;
    import HumanBrainComponent = game.role.component.brain.HumanBrainComponent;
    import CombatComponent = game.role.component.CombatComponent;
    import AvatarComponent = game.role.component.exterior.AvatarComponent;
    import MonsterAvatarComponent = game.role.component.exterior.MonsterAvatarComponent;
    import LocomotorComponent = game.role.component.LocomotorComponent;
    import PetProxyComponent = game.role.component.PetProxyComponent;
    import SkillComponent = game.role.component.SkillComponent;
    import TitleComponent = game.role.component.TitleComponent;
    import AvatarSKComponent = game.role.component.AvatarSKComponent;
    import MonsterSKComponent = game.role.component.MonsterSKComponent;
    import NpcSKComponent = game.role.component.NpcSKComponent;
    import SwimsuitHeadomponent = game.role.component.SwimsuitHeadomponent;
    import Role = game.role.Role;
    import CameraComponent = game.world.component.CameraComponent;
    import HUDComponent = game.world.component.HUDComponent;
    import LayerComponent = game.world.component.LayerComponent;
    import EffectComponent = game.world.component.EffectComponent;
    import LiteralComponent = game.world.component.LiteralComponent;


    import PackageComponent = game.world.component.PackageComponent;
    import ShadowComponent = game.world.component.ShadowComponent;
    import World = game.world.World;
    import WorldMessage = game.world.WorldMessage;
    import SceneCfg = modules.config.SceneCfg;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import NpcAvatarComponent = game.role.component.exterior.NpcAvatarComponent;


    import TopBrainComponent = game.role.component.brain.TopBrainComponent;
    import XuanhuoComponent = game.role.component.brain.XuanhuoComponent;
    import AttackBrainComponent = game.role.component.brain.AttackBrainComponent;
    import GardenBrainComponent = game.role.component.brain.GardenBrainComponent;
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    import FeatureComponent = game.role.component.FeatureComponent;
    import BattleBrainComponent = game.role.component.brain.BattleBrainComponent;
    import BossHomeModel = modules.bossHome.BossHomeModel;
    import Pos = Protocols.Pos;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import ShengYuBossModel = modules.sheng_yu.ShengYuBossModel;
    import SceneUtil = modules.scene.SceneUtil;
    import SwimsuitAvatarComponent = game.role.component.exterior.SwimsuitAvatarComponent;
    import SuperPetProxyComponent = game.role.component.SuperPetProxyComponent;
    import GatherBrainComponent = game.role.component.brain.GatherBrainComponent;
    import TempleBossBrainComponent = game.role.component.brain.TempleBossBrainComponent;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import Texture = Laya.Texture;
    import List = utils.collections.List;

    import SkillEffectCfg = modules.config.SkillEffectCfg;
    import SkillEffectFields = Configuration.SkillEffectFields;

    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;

    import ZhuLuModel = modules.zhulu.ZhuLuModel;
    import TeamBattleComponent = game.role.component.brain.TeamBattleComponent;
    type delayLeaveData = [number, number];
    type UseSkillData = [number, [number, number]];
    const enum UseSkillDataFields {
        time = 0,           // 延迟时间
        send,               // 发送信息
    }
    const enum delayLeaveDataFields {
        objId = 0,           // 对象ID
        time,                // 延迟判断
    }


    const enum SkillRetentionFields {
        skill = 0, // 技能大类 
        type,  // 目标type
        hurts, // 伤害段数
        duration, // 持续时间
        pos, // 发生坐标
    }
    type SkillRetention = [string, number, number, number, Point];
    interface GameMessage {
    }

    export class GameCenter extends MessageDispatcher<GameMessage> {
        private static _instance: GameCenter;

        public static get instance(): GameCenter {
            if (this._instance == null) {
                this._instance = new GameCenter();
            }
            return this._instance;
        }
        private readonly _roles: Table<Role>;
        private _world: World;
        private _leaveList: List<delayLeaveData>
        private _leaveCopy: List<delayLeaveData>
        // 玩家自己
        public _master: Role;

        private _useSkillList: List<UseSkillData>
        private _swapList: List<UseSkillData>

        private _skillRetentionList: List<SkillRetention>
        private _skillRetentionCopy: List<SkillRetention>

        private constructor() {
            super();
            this._roles = {};
            this._leaveList = new List<delayLeaveData>();
            this._leaveCopy = new List<delayLeaveData>();

            this._useSkillList = new List<UseSkillData>();
            this._swapList = new List<UseSkillData>();

            this._skillRetentionList = new List<SkillRetention>();
            this._skillRetentionCopy = new List<SkillRetention>();

            this.createWorld();
        }

        public get world(): game.world.World {
            return this._world;
        }

        /**
         * 创建角色
        */
        public createRole(id: number, type: RoleType): Role {
            if (this._roles[id] != null) {
                throw new Error(`重复进入${id}`);
            }

            let role = new Role(id);
            role.property.set("type", type);
            this._roles[id] = role;
            return role;
        }

        /**
         * 获取角色
        */
        public getRole(id: number): Role {
            return this._roles[id];
        }

        public correctMonsterPos() {
            let rolePos = GameCenter.instance._master.property.get("transform").localPosition;
            let real = MapUtils.getPosition(rolePos.x, -rolePos.y)
            let count: number = Math.floor(real.x / MapUtils.cols);

            for (let id in this._roles) {
                let role = this._roles[id];
                let property = role.property;
                if (property.get("type") == RoleType.Monster) {
                    let pos = property.get("pos")
                    if (pos.x < real.x) {
                        // pos.x = real.x 
                        // role.property.set("pos", pos)
                        DungeonCtrl.instance.reqEnterScene(0, 1);
                        break;
                    }


                }
            }

        }


        public findNearbyRole(x: number, y: number, radius: number, type: RoleType, occ: number = 0, key: number = 0): Role {
            let min = Number.MAX_VALUE;
            let result: Role = null;
            radius *= radius;
            for (let id in this._roles) {
                let role = this._roles[id];
                if (key != 0 && key == role.id) {
                    continue;
                }

                let property = role.property;
                // delayDeath 目标延迟死亡 
                if (property.get("type") != type || property.get("status") == RoleState.DEATH || property.get("delayDeath")) {
                    continue;
                }

                if (occ != 0 && property.get("occ") != occ) {
                    continue;
                }

                let actorState = property.get("actorState") || 0;
                if (actorState & ActorState.wudi) {
                    continue;
                }

                let p = property.get("transform").localPosition;
                let dx = x - p.x;
                let dy = y - p.y;
                let distance = dx * dx + dy * dy;
                if (distance < min && distance < radius) {
                    result = role;
                    min = distance;
                }
            }
            return result;
        }

        public findNearbyPos(x: number, y: number, radius: number, type: RoleType, occ: number = 0): Array<string> {
            radius *= radius;
            let result: Array<string> = []
            for (let id in this._roles) {
                let role = this._roles[id];

                let property = role.property;

                if (property.get("type") != type || property.get("status") == RoleState.DEATH) {
                    continue;
                }

                if (occ != 0 && property.get("occ") != occ) {
                    continue;
                }

                let actorState = property.get("actorState") || 0;
                if (actorState & ActorState.wudi) {
                    continue;
                }

                let p = property.get("transform").localPosition;
                let real = MapUtils.getPosition(p.x, -p.y)

                if (MapUtils.testDistance(x, y, real.x, real.y, radius)) {
                    result.push(id);
                }
            }
            return result;
        }

        public filterNearbyRole(x: number, y: number, radius: number, type: RoleType, filter: (role: Role) => boolean): Role {
            let min = Number.MAX_VALUE;
            let result: Role = null;
            radius *= radius;
            for (let id in this._roles) {
                let role = this._roles[id];

                let property = role.property;
                if (property.get("type") != type || property.get("status") == RoleState.DEATH || property.get("delayDeath")) {
                    continue;
                }

                if (!filter(role)) {
                    continue;
                }

                let p = property.get("transform").localPosition;
                let dx = x - p.x;
                let dy = y - p.y;
                let distance = dx * dx + dy * dy;
                if (distance < min && distance < radius) {
                    result = role;
                    min = distance;
                }
            }

            return result;
        }

        public enterScene(): void {
            Laya.timer.clear(this, this.onUpdate);
            Laya.timer.frameLoop(1, this, this.onUpdate);
        }

        public leaveScene(): void {
            Laya.timer.clear(this, this.onUpdate);

            this.clearDelayLeave();
            for (let id in this._roles) {
                this._roles[id].destory();
                delete this._roles[id];
            }



            this._world.publish("follow", null);
        }
        public clearDelayLeave() {
            // 切换场景立即删除
            while (!this._leaveList.isEmpty) {
                let e = this._leaveList.shift();
                let role = this._roles[e[delayLeaveDataFields.objId]];
                if (!role) continue;
                let sk: role.SkeletonComponent = role.property.get("avatarSK");
                if (sk == null || sk == undefined) continue;
                this.doDelRole(sk, role, e[delayLeaveDataFields.objId]);
            }
            // 删除延迟发送技能消息
            while (!this._useSkillList.isEmpty) {
                this._useSkillList.shift()
            }
            for (let id in this._roles) {
                let role = this._roles[id];
                if (role != null) {
                    let sk: role.SkeletonComponent = role.property.get("avatarSK");
                    if (sk == null || sk == undefined) continue;
                    if (sk.onDeathAnimation) this.doDelRole(sk, role, parseInt(id));
                }

            }
        }

        public leaveRole(id: number): void {
            let now = Date.now();
            let role = this._roles[id];
            // if (role != null) {
            //     role.property.set("destroyed", true);
            //     role.destory();
            //     delete this._roles[id];
            // }
            if (role != null) {
                let sk: role.SkeletonComponent = role.property.get("avatarSK");
                if (sk == null || sk == undefined) {
                    // console.log(role.property.get("name"), role.property.get("id"), "无龙骨动画组件，不用销毁！");
                    role.property.set("destroyed", true);
                    role.destory();
                    delete this._roles[id];
                } else {
                    if (SceneUtil.singleScene && role.property.get("delayDeath")) {
                        this._leaveList.unshift([id, now + 50])
                    } else {
                        // 播放完死亡动画后再移除
                        if (sk.onDeathAnimation) {
                            // console.log("定时播放后移除！");
                            setTimeout(this.doDelRole.bind(this, sk, role, id), 2000);
                        } else {
                            // console.log("直接删除");
                            this.doDelRole(sk, role, id);
                        }
                    }


                }
            }
        }





        /**
         * 删除角色
         * @param sk 龙骨组件
         * @param role 角色
         * @param id 角色id
         */
        private doDelRole(sk: role.SkeletonComponent, role: Role, id: number) {
            if (sk == null) return;
            sk.clearSK();
            sk = null;
            role.property.set("destroyed", true);
            role.destory();
            delete this._roles[id];
        }

        public enterRole(id: number): void {
            let role = this._roles[id];
            if (role == null) {
                throw new Error();
            }

            if (role.isEnter) {
                throw new Error();
            }

            switch (role.property.get("type")) {
                case RoleType.Master: {
                    this._master = role;
                    this.enterMaster(role);
                    break;
                }
                case RoleType.Player: {
                    this.enterPlayer(role);
                    break;
                }
                // case RoleType.Package: {
                //     this.enterPackage(role);
                //     break;
                // }
                case RoleType.Monster: {
                    this.enterMonster(role);
                    break;
                }
                case RoleType.Npc: {
                    this.enterNpc(role);
                    break;
                }
                default: {
                    throw new Error();
                }
            }

            let pos = role.property.get("pos");
            role.enter();
            role.publish("setCoordinate", pos.x, pos.y);
            if (role.property.get("type") == RoleType.Master) {
                this._world.publish("enterMaster", role);
                this._world.publish("follow", role.getComponent(LocomotorComponent));
            }
        }

        private onUpdate(): void {
            this._world.update();
            for (let id in this._roles) {
                this._roles[id].update();
            }
            this.checkUseSkill();
            this.checkLeave();
        }

        private enterMaster(result: Role): void {
            let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
            if (cfg[sceneFields.type] != SceneTypeEx.swimming) {
                result.addComponent(AvatarComponent, LayerType.Master);
                result.addComponent(TitleComponent, 7);
            } else {
                result.addComponent(SwimsuitAvatarComponent, LayerType.Master);
                result.addComponent(SwimsuitHeadomponent, 7);
            }

            // 2D: 横版2D代码片段,加载2D龙骨资源!
            result.addComponent(AvatarSKComponent, true);

            result.addComponent(LocomotorComponent, true, cfg[sceneFields.sprintType] != 0, 600, 600);
            result.addComponent(SkillComponent, [
                80010001,
                80020001,
                // 80030001,
                // 80040001,
                // 80050001,
                // 80060001,
                // 80070001,
                // 80080001,
                // 80090001,
            ]);
            result.addComponent(CombatComponent);
            switch (cfg[sceneFields.type]) {
                case SceneTypeEx.homeBoss: {
                    let model = BossDungeonModel.instance;
                    result.addComponent(HomeBossBrainComponent, (): Pos => {
                        return BossDungeonModel.instance.selectTargetPos;
                    }, model.getBossOnwer.bind(model));
                    break;
                }
                case SceneTypeEx.homestead: {
                    result.addComponent(SuperPetProxyComponent);
                    result.addComponent(GardenBrainComponent);
                    break;
                }
                case SceneTypeEx.nineCopy: {
                    result.addComponent(TopBrainComponent);
                    break;
                }
                case SceneTypeEx.teamPrepare: {
                    result.addComponent(GardenBrainComponent);
                }
                case SceneTypeEx.teamBattleCopy: {
                    let model = ZhuLuModel.instance;
                    result.addComponent(TeamBattleComponent, (): Pos => {
                        let pos = model.movePos
                        if (pos[0] == 0 || pos[1] == 0) return null
                        return pos;
                    });
                    break;
                }
                case SceneTypeEx.xuanhuoCopy: {
                    // result.addComponent(XuanhuoComponent);
                    let model = BossDungeonModel.instance;
                    result.addComponent(XuanhuoComponent, (): Pos => {
                        return model.selectTargetPos;
                    }, (targetId: number): number => {
                        return PlayerModel.instance.selectTargetId;
                    });
                    break;
                }
                case SceneTypeEx.teamChiefCopy: {
                    result.addComponent(AttackBrainComponent);
                }


                case SceneTypeEx.tiantiCopy: {
                    result.addComponent(BattleBrainComponent);
                    break;
                }
                case SceneTypeEx.richesCopy: {
                    result.addComponent(GatherBrainComponent);
                    break;
                }
                case SceneTypeEx.cloudlandCopy: {
                    let model = YunMengMiJingModel.instance;
                    result.addComponent(HomeBossBrainComponent, (): Pos => {
                        return model.selectTargetPos;
                    }, (occ: number): number => {
                        return 0;
                    });
                    break;
                }
                case SceneTypeEx.templeBoss: {
                    let model = BossDungeonModel.instance;
                    result.addComponent(TempleBossBrainComponent, (): Pos => {
                        return model.selectTargetPos;
                    }, (occ: number): number => {
                        return 0;
                    });
                    break;
                }
                case SceneTypeEx.adventruePK: {
                    // result.addComponent(AdvengeBrainComponent);
                    result.addComponent(BattleBrainComponent);
                    break;
                }
                case SceneTypeEx.fairy: {
                    result.addComponent(BattleBrainComponent);
                    break;
                }
                case SceneTypeEx.arenaCopy: {
                    result.addComponent(BattleBrainComponent);
                    break;
                }
                default: {
                    result.addComponent(HumanBrainComponent);
                    break;
                }
            }
            //因为宠物逻辑以来玩家，所以放在后面
            if (cfg[sceneFields.type] != SceneTypeEx.swimming && cfg[sceneFields.type] != SceneTypeEx.homestead && !modules.rename.SetCtrl.instance.isHideSelfPet) {
                result.addComponent(PetProxyComponent);
            }
            result.on("useSkill", this, this.useSkill);
        }

        private enterPlayer(result: Role): void {
            let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
            if (cfg[sceneFields.type] != SceneTypeEx.swimming) {
                result.addComponent(AvatarComponent, LayerType.Player);
                result.addComponent(TitleComponent, 3);
            } else {
                result.addComponent(SwimsuitAvatarComponent, LayerType.Player);
                result.addComponent(SwimsuitHeadomponent, 3);
            }

            // 2D: 横版2D代码片段,加载2D龙骨资源!
            result.addComponent(AvatarSKComponent, false);

            result.addComponent(LocomotorComponent, false);
            result.addComponent(CombatComponent);
            result.addComponent(CommonBrainComponent);
            if (cfg[sceneFields.type] != SceneTypeEx.swimming && !modules.rename.SetCtrl.instance.isHideOtherPalyerAllExtents) {
                result.addComponent(PetProxyComponent);
            }
        }

        private enterMonster(result: Role): void {
            result.addComponent(MonsterAvatarComponent, LayerType.Monster);

            // 2D: 横版2D代码片段,加载2D龙骨资源!
            result.addComponent(MonsterSKComponent);
            result.addComponent(TitleComponent, 0);
            result.addComponent(LocomotorComponent, false);
            result.addComponent(CombatComponent);
            result.addComponent(CommonBrainComponent);
        }

        // private enterPackage(result: Role): void {
        //     result.addComponent(PackageAvatarComponent);
        //     result.addComponent(PackageBrainComponent);
        // }

        private enterNpc(result: Role): void {
            result.addComponent(NpcAvatarComponent, LayerType.Npc);
            result.addComponent(NpcSKComponent);
            result.addComponent(LocomotorComponent, false);

            let tuple = NpcCfg.instance.getCfgById(result.property.get("occ"));
            if (tuple == null) {
                throw new Error(`NPC类型${result.property.get("occ")}不存在！`);
            }

            let name = tuple[npcFields.name];
            if (name != null && name != "" && tuple[npcFields.hide] != 1) {
                result.property.set("name", name);
                result.addComponent(TitleComponent, 1);
            }

            let funId = tuple[npcFields.funId] || 0;
            if (funId != 0) {
                result.addComponent(FeatureComponent)
            }
        }
        // 可以用来转换坐标 但是不能直接add 无法管理
        public getWorldLayer(id: LayerType) {
            return this._world.getComponent(LayerComponent).getLayerById(id);
        }

        private createWorld(): void {
            let world = new Entity<WorldMessage>();
            let camera = world.addComponent(CameraComponent, Laya.stage.height);
            world.addComponent(LayerComponent, camera.sprite, Laya.stage.width, Laya.stage.height);
            world.addComponent(ShadowComponent, "assets/image/shadow.png");
            world.addComponent(PackageComponent, "assets/image/image.png");
            world.addComponent(LiteralComponent);
            world.addComponent(HUDComponent);
            world.addComponent(EffectComponent);



            // world.addComponent(MapMoveComponent);



            world.enter();
            this._world = world;
        }

        /**
         * 
         * @param id 目标id
         * @param skill 技能大类
         * @param direct 直接执行
         * @returns 
         */
        private useSkill(id: number, skill: number, direct: boolean): void {
            let target = GameCenter.instance.getRole(id)
            if (target == null) return;
            Channel.instance.publish(UserMapOpcode.PlaySkill, [id, skill]);
            return
            // let now = Date.now();
            // let info = SkillEffectCfg.instance.getCfgById(skill * 10000);
            // let hurts = info[SkillEffectFields.hurts].length
            // let duration = hurts > 0 ? info[SkillEffectFields.hurts][hurts - 1] : 0

            // let targetPos = target.property.get("avatarSK").getSKPositon();
            // let type = target.property.get("type");
            // let skillId = PlayerModel.instance.getInfoBySkill(id);
            // let cfg = SkillCfg.instance.getCfgById(skillId)
            // // 第一次 是通知广播转发播放技能
            // Channel.instance.publish(UserMapOpcode.PlaySkill, [direct ? id : 0, skill]);
            // if (direct) return;
            // // 存储技能 等待动画的攻击帧响应
            // let check = [
            //     skill, // 技能大类 
            //     type,  // 目标type
            //     duration, // 持续时间
            //     targetPos, // 目标坐标
            //     cfg[skillFields.rangeType], /*范围类型 1:自身周围 2:目标周围 */
            //     cfg[skillFields.radius],    /*半径(像素): -1:全图 */
            //     cfg[skillFields.randomCount],   /*随机个数 -1:全部 */
            // ]



        }


        private skillResponse(id: number) {
            if (this._skillRetentionList.isEmpty) return;
            let is = false
            let data = null
            do {
                let skill = this._skillRetentionList.shift();
                if (parseInt(skill[SkillRetentionFields.skill]) == id)
                    data = [
                        skill[SkillRetentionFields.pos].x,
                        skill[SkillRetentionFields.pos].y,
                        skill[SkillRetentionFields.type],
                        skill[SkillRetentionFields.skill],


                    ]
                this._skillRetentionCopy.unshift(skill)
            } while (!this._skillRetentionList.isEmpty);
            this._skillRetentionList.swap(this._skillRetentionCopy);

            if (data == null) return;
            // this.findNearbyPos(data[0], data[1],)

        }

        // 检测持续时间是否过期
        private checkSkillRetention() {
            if (this._skillRetentionList.isEmpty) return;
            let now = Date.now();
            do {
                let skill = this._skillRetentionList.shift();
                if (!(now >= skill[SkillRetentionFields.duration])) this._skillRetentionCopy.unshift(skill)
            } while (!this._skillRetentionList.isEmpty);
            this._skillRetentionList.swap(this._skillRetentionCopy);
        }

        private checkUseSkill() {
            if (this._useSkillList.isEmpty) return;
            let now = Date.now();
            do {
                let skill = this._useSkillList.shift();
                let del = false;
                if (now >= skill[UseSkillDataFields.time]) {
                    Channel.instance.publish(UserMapOpcode.PlaySkill, skill[UseSkillDataFields.send]);
                    del = true
                }
                if (!del) this._swapList.unshift(skill)
            } while (!this._useSkillList.isEmpty);
            this._useSkillList.swap(this._swapList);
        }



        private checkLeave() {
            if (this._leaveList.isEmpty) return;
            let now = Date.now();
            do {
                let e = this._leaveList.shift();
                let del = false;
                if (now >= e[delayLeaveDataFields.time]) {
                    let role = this._roles[e[delayLeaveDataFields.objId]];
                    if (!role) continue;
                    if (!role.property.get("delayDeath")) {
                        // 可以离屏了
                        this.leaveRole(e[delayLeaveDataFields.objId])
                        del = true
                    } else {
                        // 继续延迟
                        e[delayLeaveDataFields.time] = now + 50
                    }
                }
                if (!del) this._leaveCopy.unshift(e)
            } while (!this._leaveList.isEmpty);
            this._leaveList.swap(this._leaveCopy);
        }

        //根据设置更新玩家宠物
        public updateSetRolePetComponent() {
            let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
            for (let id in this._roles) {
                let role = this._roles[id];
                let property = role.property;
                if (property.get("status") == RoleState.DEATH || property.get("delayDeath")) {
                    continue;
                }
                if (property.get("type") == RoleType.Master) {
                    if (modules.rename.SetCtrl.instance.isHideSelfPet && role.getComponent(PetProxyComponent)) {
                        role.removeComponent(PetProxyComponent);
                    } else if ((!modules.rename.SetCtrl.instance.isHideSelfPet || !modules.rename.SetCtrl.instance.isHideSelfPetSkillEffect)
                        && !role.getComponent(PetProxyComponent)
                        && cfg[sceneFields.type] != SceneTypeEx.swimming) {
                        role.addComponent(PetProxyComponent);
                    }
                    continue;
                } else if (property.get("type") == RoleType.Player) {
                    if (modules.rename.SetCtrl.instance.isHideOtherPalyerAllExtents && role.getComponent(PetProxyComponent)) {
                        role.removeComponent(PetProxyComponent);
                    } else if ((!modules.rename.SetCtrl.instance.isHideOtherPalyerAllExtents || !modules.rename.SetCtrl.instance.isHideOtherPalyerAllEffects)
                        && !role.getComponent(PetProxyComponent)
                        && cfg[sceneFields.type] != SceneTypeEx.swimming) {
                        role.addComponent(PetProxyComponent);
                    }
                    continue;
                }

            }
        }

    }
}
