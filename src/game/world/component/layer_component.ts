///<reference path="../../../base/ecs/entity_component.ts"/>
///<reference path="../../../base/particle/particle_pool.ts"/>
///<reference path="../../map/map_sprite_layer.ts"/>
///<reference path="../../role/role.ts"/>

namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import ParticlePool = base.particle.ParticlePool;
    import MapSpriteLayer = game.map.MapSpriteLayer;
    import Rectangle = Laya.Rectangle;
    import Scene = Laya.Scene;
    import Sprite = Laya.Sprite;
    import Image = Laya.Image;
    import Sprite3D = Laya.Sprite3D;
    import Vector3 = Laya.Vector3;
    import MathUtils = utils.MathUtils;
    import RoleUtils = game.misc.RoleUtils;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SkeletonPlaybackRateFactor = role.SkeletonPlaybackRateFactor;
    import SkeletonPlaybackRateFactorFields = role.SkeletonPlaybackRateFactorFields;


    type EntityType = [Sprite, LayerType, number, number]
    const enum EntityTypeFields {
        entity = 0,     // 对象
        layer,          // 层级
        x,
        y
    }

    export class LayerComponent extends EntityComponent<WorldMessage, World> {
        private _camera: Sprite3D;                  // 相机
        private _root: Scene;                       // 3D层 现在 只有地图层
        private _map: Sprite                        // 新2D版地图层 
        private _entitys: Table<Array<Sprite>>;

        private _layerDic: Table<Sprite>;

        // 结构 
        // 背景层/
        // 怪物层/NPC层/玩家角色层/主角层/采集,机关/
        // 
        // 
        // 
        //
        // 掉落物
        // 称号层
        // 前景层
        // 飘血层
        // 装饰层(新增 高于所有地图类型层 低于UI层  放入装饰物 生命周期无限  销毁触发 切换场景)

        /** 地图层 */
        private _mapLayer: MapSpriteLayer;
        // 都以2D实现
        /** 背景层 */
        private _backgroundLayer: Sprite;
        /** 怪物层 */
        private _monsterLayer: Sprite;
        /** NPC层 */
        private _npcLayer: Sprite;
        /** 玩家角色层 */
        private _playerLayer: Sprite;
        /** 主角层 */
        private _masterLayer: Sprite;
        /** 采集物,机关层 */
        private _apparatusLayer: Sprite;
        /** 掉落层 */
        private _packageLayer: Sprite;
        /** 称号层 */
        private _titleLayer: Sprite;
        /** 前景层 */
        private _foregroundLayer: Sprite;
        /** 飘血层 */
        private _literalLayer: Sprite;
        /** 装饰层 前景 */
        private _foregroundDecorate: Sprite;
        /** 装饰层 后景 */
        private _backgroundDecorate: Sprite;

        // Map结构 仅直观观看用 
        // private catalogue = [
        //     'Map',// 地图
        //     'BackgroundDecorate', // 后景装饰 高宽等于视域
        //     [
        //         'Background',// 后景层
        //         [   // 公用一层
        //             'Monster',
        //             'Player',
        //             'Master',
        //             'Apparatus',
        //             'Npc',
        //         ],
        //         'Package', // 掉落物
        //         'Title',    // 标题
        //         'Foreground',   // 前景
        //         'Literal',  // 飘血
        //     ],
        //     'ForegroundDecorate', // 前景装饰
        //     'Hud' // 拓展层 [ 喊话气泡 ]
        // ]

        constructor(owner: World, camera: Sprite3D, width: number, height: number) {

            super(owner);
            this._camera = camera;
            this._root = new Scene();
            this._root.name = "ROOT层";
            this._root.addChild(camera);
            this._map = new Sprite();
            this._map.name = "2D地图层";

            Laya.stage.addChildAt(this._root, StageType.Map3D);
            Laya.stage.addChildAt(this._map, StageType.Map2D);

            this.initLayer(width, height);

            this._entitys = {};


            this.initLayer(width, height);

            this._entitys = {};
            this._foregroundLayer.name = "前景层";
            this._foregroundDecorate.name = "装饰层-前景";
            this._backgroundDecorate.name = "装饰层-后景";
            this._packageLayer.name = "掉落层";
            this._playerLayer.name = "玩家角色层";
            this._monsterLayer.name = "怪物层";
            this._titleLayer.name = "称号层";
            this._mapLayer.name = "地图层";
            this._backgroundLayer.name = "背景层";
            this._apparatusLayer.name = "采集物,机关层";
            this._masterLayer.name = "主角层";
            // this._masterLayer.visible = false;
        }



        public setup(): void {
            this.owner
                .on("enterScene", this, this.enterScene)
                .on("leaveScene", this, this.leaveScene)
                .on("stageResize", this, this.stageResize)
                .on("addToLayer", this, this.addToLayer)
                .on("addToRootLayer", this, this.addToRootLayer)
                .on("setPlayRate", this, this.setPlayRate)
                // .on("setTransformDoorActive", this, this.setTransformDoorActive)
                .on("stageClick", this, this.stageClick);

        }

        public teardown(): void {
            this.owner
                .off("enterScene", this, this.enterScene)
                .off("leaveScene", this, this.leaveScene)
                .off("stageResize", this, this.stageResize)
                .off("addToLayer", this, this.addToLayer)
                .off("addToRootLayer", this, this.addToRootLayer)
                .off("setPlayRate", this, this.setPlayRate)
                // .off("setTransformDoorActive", this, this.setTransformDoorActive)
                .off("stageClick", this, this.stageClick);
            this._mapLayer.off(Laya.Event.COMPLETE, this, this.onMapLayerComplete);
            this.leaveScene();

        }

        public onUpdate(): void {
            // 怪物层/NPC层/玩家角色层/主角层/采集,机关
            let keys = [LayerType.Monster, LayerType.Npc, LayerType.Player, LayerType.Master, LayerType.Apparatus]
            let entitys: EntityType[] = [];
            for (let i = 0; i < keys.length; i++) {
                if (!this._entitys[keys[i]]) continue;
                for (const entity of this._entitys[keys[i]]) {
                    if (!entity.parent) continue;
                    let x = entity.x
                    let y = entity.y
                    switch (keys[i]) {
                        case LayerType.Master:
                            y += 48
                            break;
                    }
                    entitys.push([entity, keys[i], x, y])
                }
            }
            let zOrder = 0; entitys.sort((a, b) => a[EntityTypeFields.y] - b[EntityTypeFields.y])
            for (const entityData of entitys) {
                let z = ++zOrder;
                let entity = entityData[EntityTypeFields.entity]
                if (z != entity.zOrder) entity.zOrder = z
            }
        }



        public destory(): void {

        }

        public get mapLayer(): MapSpriteLayer {
            return this._mapLayer;
        }

        private enterScene(id: number): void {
            // 加载地图监听
            this._mapLayer.once(Laya.Event.COMPLETE, this, this.onMapLayerComplete);
            // 设置地图
            this._mapLayer.setup(id);

            Laya.timer.clear(this, this.onUpdate);
            Laya.timer.frameLoop(1, this, this.onUpdate);
        }

        private leaveScene(): void {
            Laya.timer.clear(this, this.onUpdate);
            this._mapLayer.close();

        }
        public get map2D(): Laya.Sprite {
            return this._map;
        }

        private onMapLayerComplete(): void {
            this.owner.publish("loadMapComplete");
        }

        private stageResize(width: number, height: number): void {
            this._mapLayer.target = this._camera.transform;
            this._mapLayer.viewport = new Rectangle(0, 0, width, height);
            this.resize(width, height);
        }

        private addToRootLayer(type: number, sprite: Sprite3D): void {
            switch (type) {
                case LayerType.Root: {
                    this._root.addChild(sprite);
                    break;
                }
                default: {
                    throw new Error(`未知的层${type}`);
                }
            }
        }
        /**
         * 按图层设置播放速率
         * @param types 
         * @param rates 
         */
        private setPlayRate(types: number[], rates: Array<SkeletonPlaybackRateFactor>): void {
            let keys = types
            let entitys = [];
            console.log('研发测试_chy:typestypes', types, rates);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i]
                if (!this._entitys[key]) continue;
                for (const entity of this._entitys[key]) {
                    if (!entity.parent) continue;
                    if (entity.constructor.name == 'SkeletonAvatar') entitys.push(entity);
                }
            }
            console.log('研发测试_chy:调整速率数量', entitys.length);
            for (const entity of entitys) {
                for (const key in rates) {
                    let rate = rates[key];
                    (<SkeletonAvatar>entity).resetPlaybackRate(rate[SkeletonPlaybackRateFactorFields.type], rate[SkeletonPlaybackRateFactorFields.speed]);
                }
            }
            // 样例
            // GameCenter.instance.world.publish("setPlayRate",
            //     [LayerType.Foreground, LayerType.Foreground],
            //     [[AvatarAniBigType.clothes, 0.1], [AvatarAniBigType.clothes, 0.1]]
            // )
        }


        private addToLayer(type: number, sprite: Sprite): void {
            if (!this._entitys[type]) this._entitys[type] = [];
            this._entitys[type].push(sprite);
            switch (type) {
                case LayerType.Background: {
                    this._backgroundLayer.addChild(sprite);
                    break;
                }
                case LayerType.Monster: {
                    this._monsterLayer.addChild(sprite);
                    break;
                }
                case LayerType.Npc: {
                    this._npcLayer.addChild(sprite);
                    break;
                }
                case LayerType.Player: {
                    this._playerLayer.addChild(sprite);
                    break;
                }
                case LayerType.Master: {
                    this._masterLayer.addChild(sprite);
                    break;
                }
                case LayerType.Apparatus: {
                    this._apparatusLayer.addChild(sprite);
                    break;
                }
                case LayerType.Package: {
                    this._packageLayer.addChild(sprite);
                    break;
                }
                case LayerType.Title: {
                    this._titleLayer.addChild(sprite);
                    break;
                }
                case LayerType.Foreground: {
                    this._foregroundLayer.addChild(sprite);
                    break;
                }
                case LayerType.Literal: {
                    this._literalLayer.addChild(sprite);
                    break;
                }
                case LayerType.ForegroundDecorate: {
                    this._foregroundDecorate.addChild(sprite);
                    break;
                }
                case LayerType.BackgroundDecorate: {
                    this._backgroundDecorate.addChild(sprite);
                    break;
                }
                case LayerType.Root: {
                    console.error(`错误添加层级${type}`)
                    // this._root.addChild(sprite);
                    return;
                    break;
                }
                default: {
                    throw new Error(`未知的层${type}`);
                    return;
                }
            }

        }


        private initLayer(width: number, height: number): void {
            this._layerDic = {};
            this._mapLayer = this.createLayer(LayerDepth.MAP_LAYER_Z, MapSpriteLayer, this._camera.transform, new Rectangle(0, 0, width, height));
            this._backgroundLayer = this.createLayer2D(Sprite);
            // this._backgroundLayer.mouseEnabled = false
            this._monsterLayer = this._apparatusLayer = this._npcLayer = this._masterLayer = this._playerLayer = this.createLayer2D(Sprite);
            this._playerLayer.mouseEnabled = false


            // this._masterLayer = this.createLayer2D(Sprite);
            // this._npcLayer = this.createLayer2D(Sprite);
            // this._apparatusLayer = this.createLayer2D(Sprite);
            // this._monsterLayer = this.createLayer2D(Sprite);
            this._packageLayer = this.createLayer2D(Sprite);
            this._packageLayer.mouseEnabled = false
            this._titleLayer = this.createLayer2D(Sprite);
            this._titleLayer.mouseEnabled = false
            this._foregroundLayer = this.createLayer2D(Sprite);
            this._foregroundLayer.mouseEnabled = false
            this._literalLayer = this.createLayer2D(Sprite);
            this._literalLayer.mouseEnabled = false
            this._literalLayer.name = "文字层";
            this._backgroundDecorate = this.createLayer2DEx(Sprite);
            this._foregroundDecorate = this.createLayer2DEx(Sprite);


            this._layerDic[LayerType.Background] = this._backgroundLayer;
            this._layerDic[LayerType.Monster] = this._monsterLayer;
            this._layerDic[LayerType.Apparatus] = this._apparatusLayer;
            this._layerDic[LayerType.Npc] = this._npcLayer;
            this._layerDic[LayerType.Master] = this._masterLayer;
            this._layerDic[LayerType.Player] = this._playerLayer;
            this._layerDic[LayerType.BackgroundDecorate] = this._backgroundDecorate;
            this._layerDic[LayerType.ForegroundDecorate] = this._foregroundDecorate;
            this._layerDic[LayerType.Literal] = this._literalLayer;
            this._layerDic[LayerType.Foreground] = this._foregroundLayer;
            this._layerDic[LayerType.Title] = this._titleLayer;
            this._layerDic[LayerType.Package] = this._packageLayer;

            Laya.stage.addChildAt(this._backgroundDecorate, StageType.BackgroundDecorate);
            Laya.stage.addChildAt(this._foregroundDecorate, StageType.ForegroundDecorate);
            // 结构 
            // 背景层/
            // 怪物层/NPC层/玩家角色层/主角层/采集,机关/
            // 
            // 
            // 
            //
            // 掉落物
            // 称号层
            // 前景层
            // 飘血层
            // 装饰层(新增 高于所有地图类型层 低于UI层  放入装饰物 生命周期无限  销毁触发 切换场景)
            this.resize(CommonConfig.viewWidth, CommonConfig.viewHeight);

            // this.testCode();
        }

        private testCode() {
            let skele = new Laya.Skeleton();
            skele.visible = true;
            skele.scale(0.2, 0.2);
            skele.load("res/skeleton/test/attack_04.sk", Laya.Handler.create(this, (skele) => {
                skele.play(0, true);
                window["skele04"] = skele;
            }));
            this._foregroundLayer.addChild(skele);
            skele.pos(400, 1600);
        }

        public resize(width: number, height: number): void {
            this._foregroundDecorate.size(CommonConfig.viewWidth, CommonConfig.viewHeight);
            this._foregroundDecorate.scale(CommonConfig.viewScale, CommonConfig.viewScale, true);
            this._backgroundDecorate.size(CommonConfig.viewWidth, CommonConfig.viewHeight);
            this._backgroundDecorate.scale(CommonConfig.viewScale, CommonConfig.viewScale, true);
            this._mapLayer.resize();
        }
        private createLayer<T extends any[], R extends Sprite3D>(depth: LayerDepth, builder: new (...args: T) => R, ...args: T): R {
            let result = new builder(...args);
            result.transform.localPosition = new Vector3(0, 0, -depth);
            this._root.addChild(result);
            return result;
        }
        private createLayer2D<T extends any[], R extends Sprite>(builder: new (...args: T) => R, ...args: T): R {
            let result = new builder(...args);
            this._map.addChild(result);
            return result;
        }
        private createLayer2DEx<T extends any[], R extends Sprite>(builder: new (...args: T) => R, ...args: T): R {
            let result = new builder(...args);
            return result;
        }


        public stageClick(x, y) {
            let type = CommonUtil.getMapType();
            if ([SceneTypeEx.homestead].indexOf(type) == -1) return;
            let p = this._playerLayer.globalToLocal(new Laya.Point(x, y))
            PlayerModel.instance.autoAi = false
            PlayerModel.instance.customizePoint = MapUtils.getPosition(p.x, p.y)
        }



        // 根据层ID获取层
        public getLayerById(id: LayerType): Sprite {
            return this._layerDic[id] || null;
        }
    }
}