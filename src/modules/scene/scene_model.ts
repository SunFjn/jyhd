/** 场景数据*/
///<reference path="../config/scene_cfg.ts"/>

namespace modules.scene {
    import EnterScene = Protocols.EnterScene;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import ItemShow = Protocols.ItemShow;
    import MonsterShow = Protocols.MonsterShow;
    import HumanShow = Protocols.HumanShow;
    import NpcShow = Protocols.NpcShow;
    import BroadcastEnterScreen = Protocols.BroadcastEnterScreen;
    import BroadcastLeaveScreen = Protocols.BroadcastLeaveScreen;
    import BroadcastEnterScreenFields = Protocols.BroadcastEnterScreenFields;
    import ItemShowFields = Protocols.ItemShowFields;
    import MonsterShowFields = Protocols.MonsterShowFields;
    import HumanShowFields = Protocols.HumanShowFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import NpcShowFields = Protocols.NpcShowFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import BroadcastLeaveScreenFields = Protocols.BroadcastLeaveScreenFields;
    import Point = Laya.Point;



    export class SceneModel {
        private static _instance: SceneModel;

        public static get instance(): SceneModel {
            return this._instance = this._instance || new SceneModel();
        }

        /** 道具列表*/
        private _items: Array<ItemShow>;
        /** 怪物列表*/
        private _monsters: Array<MonsterShow>;
        /** 玩家列表*/
        private _humans: Array<HumanShow>;
        /** NPC列表*/
        private _npcs: Array<NpcShow>;
        /** 所有角色table*/
        private _allRoleTable: Table<[SearchType, ItemShow | MonsterShow | HumanShow | NpcShow]>;

        // 角色内容
        // private _roleContexts:Array<RoleContext>;

        // 场景
        private _enterScene: EnterScene;

        // 是否正在天关副本
        public isInMission: boolean = false;

        // 是否慢放
        public isSlow: boolean = false;
        //首充小弹窗 记录的时间戳
        public _lastTime: number;//上次弹的时间戳
        public _isshibai: boolean;//是否失败退出副本
        public _isshibaiShowFP: boolean;//失败
        public _isshouci: boolean;//是否首次满足条件
        public _isshouciLv: boolean;//是否首次满足等级条件
        private _move: Laya.Image;

        private constructor() {
            this._items = [];
            this._monsters = [];
            this._humans = [];
            this._npcs = [];
            this._allRoleTable = {};
            this._lastTime = GlobalData.serverTime;
            this._isshouci = false;
            this._isshouciLv = false;

            // this._move = new Laya.Image('assets/image/bullet/1.png')
            // this._move.top = 0
            // this._move.bottom = 0
            // this._move.left = 0
            // this._move.right = 0
            // this._move.alpha = 0
            // // GameCenter.instance.world.publish("addToLayer", LayerType.Foreground, this._move)
            // LayerManager.instance.getLayerById(ui.Layer.BOTTOM_LAYER).addChild(this._move);
            // this._move.on(Laya.Event.MOUSE_DOWN, this, this.click)


        }
        // private click(e: Event) {
        //     let pointX = Laya.MouseManager.instance.mouseX;
        //     let pointY = Laya.MouseManager.instance.mouseY;
        //     GameCenter.instance.world.publish("stageClick", pointX, pointY);
        // }


        // 场景更新
        public get enterScene(): EnterScene {
            return this._enterScene;
        }

        public set enterScene(value: EnterScene) {
            this._enterScene = value;
            GlobalData.dispatcher.event(CommonEventType.SCENE_ENTER);
        }

        // 玩家列表
        public get humans(): Array<HumanShow> {
            return this._humans;
        }

        public set humans(value: Array<HumanShow>) {
            this._humans = value;
        }

        public get monsters(): Array<MonsterShow> {
            return this._monsters;
        }

        // 玩家内容
        // public get roleContexts():Array<RoleContext>{
        //     return this._roleContexts;
        // }
        // public set roleContexts(value:Array<RoleContext>){
        //     this._roleContexts = value;
        // }

        // 入屏
        public enterSceneHandler(value: BroadcastEnterScreen): void {
            let items: Array<ItemShow> = value[BroadcastEnterScreenFields.items];
            if (items != null && items.length > 0) {
                for (let item of items) {
                    this._items.push(item);
                    this._allRoleTable[item[ItemShowFields.objId]] = [SearchType.item, item];
                }
                GlobalData.dispatcher.event(CommonEventType.SCENE_ADD_ITEMS);
            }

            let monsters: Array<MonsterShow> = value[BroadcastEnterScreenFields.monsters];
            if (monsters != null && monsters.length > 0) {
                for (let monster of monsters) {
                    this._monsters.push(monster);
                    this._allRoleTable[monster[MonsterShowFields.objId]] = [SearchType.monster, monster];
                }
                GlobalData.dispatcher.event(CommonEventType.SCENE_ADD_MONSTERS);
            }

            let humans: Array<HumanShow> = value[BroadcastEnterScreenFields.humans];
            if (humans != null && humans.length > 0) {
                let aliveMan = false;
                for (let human of humans) {
                    this._humans.push(human);
                    this._allRoleTable[human[HumanShowFields.actorShow][ActorShowFields.objId]] = [SearchType.actor, human];
                }
                GlobalData.dispatcher.event(CommonEventType.SCENE_ADD_HUMANS);
            }

            let npcs: Array<NpcShow> = value[BroadcastEnterScreenFields.npcs];
            if (npcs != null && npcs.length > 0) {
                for (let npc of npcs) {
                    this._npcs.push(npc);
                    this._allRoleTable[npc[NpcShowFields.objId]] = [SearchType.npc, npc];
                }
                GlobalData.dispatcher.event(CommonEventType.SCENE_ADD_NPCS);
            }
        }

        // 离屏
        public leaveSceneHandler(value: BroadcastLeaveScreen): void {
            let objIds: Array<number> = value[BroadcastLeaveScreenFields.objIds];
            let itemFlag: boolean = false;
            let monsterFlag: boolean = false;
            let humanFlag: boolean = false;
            let npcFlag: boolean = false;
            for (let i: int = 0, len: int = objIds.length; i < len; i++) {
                let objId: number = objIds[i];
                let t: [SearchType, ItemShow | MonsterShow | HumanShow | NpcShow] = this._allRoleTable[objId];
                if (t) {
                    if (t[0] === SearchType.item) {
                        for (let j: int = 0, len1: int = this._items.length; j < len1; j++) {
                            if (objId === this._items[j][ItemShowFields.objId]) {
                                this._items.splice(j, 1);
                                itemFlag = true;
                                break;
                            }
                        }
                    } else if (t[0] === SearchType.monster) {
                        for (let j: int = 0, len1: int = this._monsters.length; j < len1; j++) {
                            if (objId === this._monsters[j][MonsterShowFields.objId]) {
                                this._monsters.splice(j, 1);
                                monsterFlag = true;
                                break;
                            }
                        }
                    } else if (t[0] === SearchType.actor) {
                        for (let j: int = 0, len1: int = this._humans.length; j < len1; j++) {
                            if (objId === this._humans[j][HumanShowFields.actorShow][ActorShowFields.objId]) {
                                this._humans.splice(j, 1);
                                humanFlag = true;
                                break;
                            }
                        }
                    } else if (t[0] === SearchType.npc) {
                        for (let j: int = 0, len1: int = this._npcs.length; j < len1; j++) {
                            if (objId === this._npcs[j][NpcShowFields.objId]) {
                                this._npcs.splice(j, 1);
                                npcFlag = true;
                                break;
                            }
                        }
                    }
                    delete this._allRoleTable[objId];
                }
            }
            if (itemFlag) {
                GlobalData.dispatcher.event(CommonEventType.SCENE_REMOVE_ITEMS);
            }
            if (monsterFlag) {
                GlobalData.dispatcher.event(CommonEventType.SCENE_REMOVE_MONSTERS);
            }
            if (humanFlag) {
                GlobalData.dispatcher.event(CommonEventType.SCENE_REMOVE_HUMANS);
            }
            if (npcFlag) {
                GlobalData.dispatcher.event(CommonEventType.SCENE_REMOVE_NPCS);
            }
        }

        // 根据角色ID获取角色信息
        public getRoleByObjId(objId: number): [SearchType, ItemShow | MonsterShow | HumanShow | NpcShow] {
            return this._allRoleTable[objId];
        }

        // 当前是否为挂机场景
        public get isHangupScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.common;
        }

        // 每日必做场景
        public get isEveryDayCopyScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            let isCopyScene = false;
            switch (type) {
                case SceneTypeEx.xianqiCopy:
                case SceneTypeEx.petCopy:
                case SceneTypeEx.shenbingCopy:
                case SceneTypeEx.wingCopy:
                case SceneTypeEx.fashionCopy:
                case SceneTypeEx.tianzhuCopy:
                case SceneTypeEx.xilianCopy:
                case SceneTypeEx.copperCopy:
                case SceneTypeEx.zqCopy:
                case SceneTypeEx.guangHuanCopy:
                    isCopyScene = true;
                    break;
                default:
                    break;
            }
            return isCopyScene;
        }

        // 事件场景
        public get isEventScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            let isEventScene = false;
            switch (type) {
                case SceneTypeEx.adventrueMonster:
                case SceneTypeEx.adventrueBoss:
                case SceneTypeEx.adventruePK:
                    isEventScene = true;
                    break;
                default:
                    break;
            }
            return isEventScene;
        }

        // 姻缘场景
        public get isMarryScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.marryCopy;
        }

        // 宗门场景
        public get isFactonScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.faction;
        }


        // 当前是否为组队副本
        public get isTeamCopyScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.teamCopy;
        }

        // 当前是否为首领场景
        public get isMultiBossBossScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.multiBoss;
        }
        // 当前是否为三界首领场景
        public get isCrossBossScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            return type == SceneTypeEx.crossBoss;
        }

        // 当前是否追击修正方向场景
        public get isDirectCurrectScene(): boolean {
            let type = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
            let isScene = false;
            switch (type) {
                case SceneTypeEx.cloudlandCopy:
                case SceneTypeEx.homeBoss:
                case SceneTypeEx.templeBoss:
                case SceneTypeEx.nineCopy:
                case SceneTypeEx.xuanhuoCopy:
                    isScene = true;
                    break;
                default:
                    break;
            }
            return isScene;
        }

        // 传送门坐标
        public get transformDoorPos(): Laya.Point {
            let pos = SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.transformDoorPos][0];
            return new Point(pos[0], pos[1]);
        }

        //获得当前场景地图特效动画名
        public get sceneEffectName(): string {
            return SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.sceneEffect];
        }

        //获得当前场景
        public get currentScene(): SceneTypeEx {
            return SceneCfg.instance.getCfgById(this._enterScene[EnterSceneFields.mapId])[sceneFields.type];
        }

    }
}