// namespace game {
//     import BatchAtlasMaterial = base.materials.BatchAtlasMaterial;
//     import LiteralAtlasMaterial = base.materials.LiteralAtlasMaterial;
//     import BatchLiteralElement = base.mesh.BatchLiteralElement;
//     import BatchLiteralhMesh = base.mesh.BatchLiteralhMesh;
//     import BatchMesh = base.mesh.BatchMesh;
//     import ParticlePool = base.particle.ParticlePool;
//     import LayaTexture2D = base.textures.LayaTexture2D;
//     import MapSpriteLayer = game.map.MapSpriteLayer;
//     import MapUtils = game.map.MapUtils;
//     import Master = game.role.Master;
//     import Monster = game.role.Monster;
//     import Pet = game.role.Pet;
//     import Player = game.role.Player;
//     import Role = game.role.Role;
//     import RoleContext = game.role.RoleContext;
//     import Camera = Laya.Camera;
//     import EventDispatcher = Laya.EventDispatcher;
//     import MeshSprite3D = Laya.MeshSprite3D;
//     import Point = Laya.Point;
//     import Rectangle = Laya.Rectangle;
//     import Scene = Laya.Scene;
//     import Sprite = Laya.Sprite;
//     import Sprite3D = Laya.Sprite3D;
//     import Transform3D = Laya.Transform3D;
//     import Vector3 = Laya.Vector3;
//     import Vector4 = Laya.Vector4;
//     import CommonUtil = modules.common.CommonUtil;
//     import TableUtils = utils.TableUtils;
//
//     interface RoleClass {
//         [RoleType.Monster]: Monster
//     }
//
//     export class GameScene extends EventDispatcher {
//         get roles(): Table<game.role.Role> {
//             return this._roles;
//         }
//
//         private static _instance: GameScene;
//
//         public static get instance(): GameScene {
//             if (this._instance == null) {
//                 this._instance = new GameScene();
//             }
//             return this._instance;
//         }
//
//         private _id: number;
//         private _root: Scene;
//         private _camera: Camera;
//         /** 地图层 */
//         private _mapLayer: MapSpriteLayer;
//         /** 背景层 */
//         private _backgroundLayer: Sprite3D;
//         /** 怪物层 */
//         private _monsterLayer: Sprite3D;
//         /** NPC层 */
//         private _npcLayer: Sprite3D;
//         /** 玩家角色层 */
//         private _roleLayer: Sprite3D;
//         /** 主角层 */
//         private _masterLayer: Sprite3D;
//         /** 采集物,机关层 */
//         private _apparatusLayer: Sprite3D;
//         /** 掉落层 */
//         private _packageLayer: Sprite3D;
//         /** 前景层 */
//         private _foregroundLayer: Sprite3D;
//
//         public _textLayer: Sprite;
//
//         private _isSetup: boolean;
//
//         private _items: Table<[BatchLiteralElement, Sprite3D, Sprite3D]>;
//         private _pets: Table<Pet>;
//         private _roles: Table<Role>;
//
//         private _transform: Transform3D;
//
//         public readonly shadowMesh: BatchMesh;
//         public readonly literalMesh: BatchLiteralhMesh;
//         public readonly packageMesh: BatchLiteralhMesh;
//
//         private _cameraTween: TweenJS;
//         private _cameraPos: Vector3;
//
//         private constructor() {
//             super();
//             this._isSetup = false;
//             this._roles = {};
//             this._items = {};
//             this._pets = {};
//
//             this.shadowMesh = new BatchMesh(60);
//             this.literalMesh = new BatchLiteralhMesh();
//             this.packageMesh = new BatchLiteralhMesh();
//             this._id = 0;
//         }
//
//         public get id(): number {
//             return this._id;
//         }
//
//         public get root(): Scene {
//             return this._root;
//         }
//
//         // public showMonsterEffect(url: string, pos: Vector3): void {
//         //     let particle: Laya.Sprite3D = Laya.Sprite3D.load(url);
//         //     particle.on(Laya.Event.HIERARCHY_LOADED, this, () => {
//         //         particle.transform.localPosition = new Laya.Vector3(pos.x, pos.y + 100, -500);
//         //         RoleUtils.projectionRotateY(particle.transform, 0);
//         //
//         //         this._root.timerOnce(300, this, () => {
//         //             particle.removeSelf();
//         //             particle.destroy(true);
//         //         });
//         //     });
//         //     this._foregroundLayer.addChild(particle);
//         // }
//
//         public showForegroundEffect(url: string, pos: Vector3, direction: number): void {
//             ParticlePool.instance.showAndDelayClear(url, pos, direction, 5000, this._foregroundLayer);
//         }
//
//         public showBackgroundEffect(url: string, pos: Vector3, direction: number): void {
//             ParticlePool.instance.showAndDelayClear(url, pos, direction, 5000, this._backgroundLayer);
//         }
//
//         public setup(width: number, height: number): void {
//             this._root = new Scene();
//
//             this.initCamera(height);
//             this.initLayer(width, height);
//             this.initShadow();
//             this.initLiteral();
//             this.initPackage();
//             Laya.stage.addChildAt(this._root, 0);
//             this._textLayer = new Sprite();
//             Laya.stage.addChildAt(this._textLayer, 1);
//
//             this._isSetup = true;
//         }
//
//         public open(id: number): void {
//             this._mapLayer.once(Laya.Event.COMPLETE, this, this.onMapLayerComplete);
//             this._mapLayer.setup(id);
//             this._id = id;
//         }
//
//         public close(): void {
//             let roles = TableUtils.values(this._roles);
//             for (let role of roles) {
//                 this.leaveRole(role.context.id);
//             }
//             let pets = TableUtils.values(this._pets);
//             for (let pet of pets) {
//                 this.leavePet(pet.context.id);
//             }
//             let items = TableUtils.keys(this._items);
//             for (let id of items) {
//                 this.leaveRole(parseInt(id));
//             }
//
//             this.literalMesh.clear();
//             this.packageMesh.clear();
//             this.shadowMesh.clear();
//         }
//
//         public toDeath(source: number, isDead: boolean): void {
//             let attacker = this._roles[source];
//             if (attacker != null)
//                 attacker.toDeath(isDead);
//         }
//
//         public attackTo(source: number, target: number, skill: number, isPet: boolean): void {
//             let attacker = isPet ? this._pets[source] : this._roles[source];
//             let sufferer = this._roles[target];
//             if (attacker != null && sufferer != null)
//                 attacker.attackTo(sufferer, skill);
//         }
//
//         public showHurt(source: number, target: number, skill: number, type: TipsFlags, damage: number): void {
//             let attacker = this._roles[source];
//             let sufferer = this._roles[target];
//             if (sufferer != null)
//                 sufferer.showHurt(attacker, skill, type, damage);
//         }
//
//         public updateRolePath(id: number, start: Point, end: Point): void {
//             let role = this._roles[id];
//             if (role == null) {
//                 return;
//             }
//             role.setCoordinate(start.x, start.y);
//             role.setMovePath(end);
//         }
//
//         private getPackageIcon(id: number): number {
//             let result = 0;
//             let type = CommonUtil.getItemTypeById(id);
//             if (type == ItemMType.Equip) {
//                 switch (CommonUtil.getPartById(id)) {
//                     case EquipCategory.weapon: {
//                         result = 1;
//                         break;
//                     }
//                     case EquipCategory.hats: {
//                         result = 2;
//                         break;
//                     }
//                     case EquipCategory.clothes: {
//                         result = 3;
//                         break;
//                     }
//                     case EquipCategory.hand: {
//                         result = 4;
//                         break;
//                     }
//                     case EquipCategory.shoes: {
//                         result = 5;
//                         break;
//                     }
//                     case EquipCategory.belt: {
//                         result = 6;
//                         break;
//                     }
//                     case EquipCategory.necklace: {
//                         result = 7;
//                         break;
//                     }
//                     case EquipCategory.bangle: {
//                         result = 8;
//                         break;
//                     }
//                     case EquipCategory.ring: {
//                         result = 9;
//                         break;
//                     }
//                     case EquipCategory.jude: {
//                         result = 10;
//                         break;
//                     }
//                 }
//             } else if (type == ItemMType.Unreal) {
//                 switch (CommonUtil.getPartById(id)) {
//                     case UnrealCategory.money: {
//                         result = 11;
//                         break;
//                     }
//                     case UnrealCategory.coin: {
//                         result = 12;
//                         break;
//                     }
//                     case UnrealCategory.energy: {
//                         result = 13;
//                         break;
//                     }
//                 }
//             }
//
//             return result;
//         }
//
//         public enterPackage(id: number, item: number, pos: Point): void {
//             let z = pos.y * MapDefinitions.PER_ROW_Z;
//             MapUtils.getRealPosition(pos.x, pos.y, pos);
//
//             let icon = this.getPackageIcon(item);
//             let rateX = 150 / 512;
//             let rateY = 150 / 1024;
//             let element: BatchLiteralElement = {
//                 sizes: [100, 100],
//                 uvs: [(icon % 3) * rateX, Math.floor(icon / 3) * rateY, rateX, rateY],
//                 scale: new Vector3(1, 1, 1),
//                 offset: new Vector3(pos.x, -pos.y, z),
//                 alpha: 1
//             };
//             this.packageMesh.addElement(element);
//             this._items[id] = [element, null, null];
//
//             let s = Sprite3D.load("assets/particle/package01.lh");
//             if (s.loaded) {
//                 let ss = s.clone();
//                 ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
//                 this._packageLayer.addChild(ss);
//                 this._items[id][1] = ss;
//             } else {
//                 s.on(Laya.Event.HIERARCHY_LOADED, this, () => {
//                     let info = this._items[id];
//                     if (info == null) {
//                         return;
//                     }
//                     let ss = s.clone();
//                     ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
//                     this._packageLayer.addChild(ss);
//                     info[1] = ss;
//                 });
//             }
//
//             let color = CommonUtil.getItemQualityById(item);
//             let url = "assets/particle/package04.lh";
//             switch (color) {
//                 case 3:
//                     url = "assets/particle/package02.lh";
//                 case 4:
//                     url = "assets/particle/package03.lh";
//                 case 5: {
//                     let s = Sprite3D.load(url);
//                     if (s.loaded) {
//                         let ss = s.clone();
//                         ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
//                         this._packageLayer.addChild(ss);
//                         this._items[id][2] = ss;
//                     } else {
//                         s.on(Laya.Event.HIERARCHY_LOADED, this, () => {
//                             let info = this._items[id];
//                             if (info == null) {
//                                 return;
//                             }
//                             let ss = s.clone();
//                             ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
//                             this._packageLayer.addChild(ss);
//                             info[2] = ss;
//                         });
//                     }
//                 }
//             }
//         }
//
//         public enterPet(context: RoleContext, start: Point, end: Point, angle: number): void {
//             if (this._pets[context.id] != null) {
//                 throw new Error("重复入屏：" + context.id);
//             }
//
//             let pet: Pet = new Pet(context);
//             pet.setCoordinate(start.x, start.y);
//             pet.setMovePath(end);
//             pet.sprite.direction = angle;
//             this._pets[context.id] = pet;
//             pet.enterScene(this);
//             this._monsterLayer.addChild(pet.sprite);
//         }
//
//         public leavePet(id: number): void {
//             if (this._pets[id] != null) {
//                 this._pets[id].sprite.removeSelf();
//                 this._pets[id].leaveScene(this);
//                 delete this._pets[id];
//             }
//         }
//
//         public enterRole(context: RoleContext, start: Point, end: Point, angle: number, isDead: boolean): void {
//             if (this._roles[context.id] != null) {
//                 throw new Error("重复入屏：" + context.id);
//             }
//
//             let role: Role = null;
//             switch (context.type) {
//                 case RoleType.Monster: {
//                     role = new Monster(context);
//                     this._monsterLayer.addChild(role.sprite);
//                     break;
//                 }
//                 case RoleType.Master: {
//                     let master = new Master(context);
//                     this._transform = master.sprite.transform;
//                     role = master;
//                     this._masterLayer.addChild(role.sprite);
//                     break;
//                 }
//                 case RoleType.Player: {
//                     role = new Player(context);
//                     this._roleLayer.addChild(role.sprite);
//                     break;
//                 }
//             }
//             role.setCoordinate(start.x, start.y);
//             role.setMovePath(end);
//             role.sprite.direction = angle - 90;
//             this._roles[context.id] = role;
//             role.enterScene(this);
//             role.toDeath(isDead);
//         }
//
//         public leaveRole(id: number): void {
//             if (this._items[id] != null) {
//                 this.packageMesh.removeElement(this._items[id][0]);
//                 if (this._items[id][1] != null) {
//                     this._items[id][1].removeSelf();
//                     this._items[id][1].destroy(true);
//                 }
//
//                 if (this._items[id][2] != null) {
//                     this._items[id][2].removeSelf();
//                     this._items[id][2].destroy(true);
//                 }
//                 delete this._items[id];
//                 return;
//             }
//
//             let role = this._roles[id];
//             if (role == null) {
//                 return;
//             }
//             delete this._roles[id];
//
//             role.sprite.removeSelf();
//             role.leaveScene(this);
//             let type = role.context.type;
//             role.toDeath();
//         }
//
//         public onResize(width: number, height: number): void {
//             if (!this._isSetup) {
//                 return;
//             }
//
//             this._camera.orthographicVerticalSize = height;
//             this._mapLayer.target = this._camera.transform;
//             this._mapLayer.viewport = new Rectangle(0, 0, width, height);
//         }
//
//         private onMapLayerComplete(): void {
//             this._root.frameLoop(1, this, this.onUpdate);
//             this.event(Laya.Event.OPEN);
//         }
//
//         private initCamera(orthographicVerticalSize: number): void {
//             let camera = new Camera(0, MapDefinitions.CAMERA_NEAR, MapDefinitions.CAMERA_FAR);
//             camera.clearColor = new Vector4(0, 0, 0, 1);
//             camera.orthographic = true;
//             camera.orthographicVerticalSize = orthographicVerticalSize;
//             camera.transform.position = new Vector3(0, 0, 0);
//             camera.useOcclusionCulling = false;
//             camera.removeAllLayers();
//             camera.addLayer(Laya.Layer.getLayerByNumber(0));
//             this._root.addChild(camera);
//             this._camera = camera;
//             this._cameraPos = new Vector3(0, 0, 0);
//         }
//
//         public shakeCamera(isPlayer: boolean, delay: number): void {
//             if (this._cameraTween != null && this._cameraTween.isPlaying) {
//                 return;
//             }
//
//             let x = this._camera.transform.position.x;
//             let y = this._camera.transform.position.y;
//             this._cameraPos.elements.set(this._camera.transform.position.elements);
//             let offsetX = 7;
//             let offsetY = 7;
//             let duration = 30;
//             this._cameraTween = TweenJS
//                 .create(this._cameraPos)
//                 .repeat(1)
//                 .yoyo(true)
//                 .to({x: x + (offsetX * 2), y: y + (offsetY * 2)}, duration)
//                 .onUpdate(() => {
//                     this._camera.transform.position = this._cameraPos;
//                 })
//                 .combine(true)
//                 .chain(
//                     TweenJS
//                         .create(this._cameraPos)
//                         .repeat(1)
//                         .yoyo(true)
//                         .to({x: x + (offsetX * 2), y: y + (offsetY * 2)}, duration)
//                         .onUpdate(() => {
//                             this._camera.transform.position = this._cameraPos;
//                         })
//                         .combine(true)
//                 );
//             this._cameraTween.delay(delay).start();
//         }
//
//         private initLayer(width: number, height: number): void {
//             this._mapLayer = this.createLayer(LayerDepth.MAP_LAYER_Z, MapSpriteLayer, this._camera, new Rectangle(0, 0, width, height));
//             this._backgroundLayer = this.createLayer(LayerDepth.BACKGROUND_LAYER_Z, Sprite3D);
//             this._roleLayer = this.createLayer(LayerDepth.ROLE_LAYER_Z, Sprite3D);
//             this._masterLayer = this.createLayer(LayerDepth.MASTER_LAYER_Z, Sprite3D);
//             this._npcLayer = this.createLayer(LayerDepth.NPC_LAYER_Z, Sprite3D);
//             this._apparatusLayer = this.createLayer(LayerDepth.APPARATUS_LAYER_Z, Sprite3D);
//             this._monsterLayer = this.createLayer(LayerDepth.MONSTER_LAYER_Z, Sprite3D);
//             this._packageLayer = this.createLayer(LayerDepth.PACKAGE_LAYER_Z, Sprite3D);
//             this._foregroundLayer = this.createLayer(LayerDepth.FOREGROUND_LAYER_Z - 100000, Sprite3D);
//         }
//
//         private createLayer<T extends any[], R extends Sprite3D>(depth: LayerDepth, builder: new(...args: T) => R, ...args: T): R {
//             let result = new builder(...args);
//             result.transform.localPosition = new Vector3(0, 0, -depth);
//             this._root.addChild(result);
//             return result;
//         }
//
//         private initShadow(): void {
//             let sprite = new MeshSprite3D(this.shadowMesh);
//             let material = new BatchAtlasMaterial();
//             material.diffuseTexture = LayaTexture2D.load("assets/image/shadow.png");
//             sprite.meshRender.material = material;
//             this._backgroundLayer.addChild(sprite);
//         }
//
//         private initLiteral(): void {
//             let sprite = new MeshSprite3D(this.literalMesh);
//             let material = new LiteralAtlasMaterial();
//             material.diffuseTexture = LayaTexture2D.load("assets/image/image.png");
//             sprite.meshRender.material = material;
//             this._root.addChild(sprite);
//         }
//
//         private initPackage(): void {
//             let sprite = new MeshSprite3D(this.packageMesh);
//             let material = new LiteralAtlasMaterial();
//             material.diffuseTexture = LayaTexture2D.load("assets/image/image.png");
//             sprite.meshRender.material = material;
//             this._packageLayer.addChild(sprite);
//         }
//
//         private onUpdate(): void {
//             if (this._transform != null) {
//                 if (this._cameraTween == null || !this._cameraTween.isPlaying) {
//                     let pos = this._transform.localPosition;
//                     this._mapLayer.updateCamera(pos.x, pos.y + 200, Laya.timer.delta / 1000);
//                     pos = this._camera.transform.position;
//                     this._textLayer.x = -(pos.x - (Laya.stage.width / 2));
//                     this._textLayer.y = pos.y + (Laya.stage.height / 2);
//                 }
//             }
//
//             for (let i in this._roles) {
//                 this._roles[i].breathe();
//             }
//
//             for (let i in this._pets) {
//                 this._pets[i].breathe();
//             }
//         }
//
//         public findRole<T extends keyof RoleClass>(type: T, occ: number = 0): RoleClass[T] {
//
//             for (let i in this._roles) {
//                 let role = this._roles[i];
//                 if (role.context.type != type || (role.status & RoleState.DEATH) != 0) {
//                     continue;
//                 }
//                 if (occ != 0 && role.context.occ != occ) {
//                     continue;
//                 }
//
//                 return <RoleClass[T]>role;
//             }
//
//             return null;
//         }
//
//         public findNearbyRole<T extends keyof RoleClass>(x: number, y: number, type: T, occ: number = 0, radius: number = 0): RoleClass[T] {
//             let min = Number.MAX_VALUE;
//             let result: Role = null;
//             radius *= radius;
//             for (let i in this._roles) {
//                 let role = this._roles[i];
//                 if (role.context.type != type || (role.status & RoleState.DEATH) != 0) {
//                     continue;
//                 }
//                 if (occ != 0 && role.context.occ != occ) {
//                     continue;
//                 }
//                 let p = role.transform.localPosition;
//                 let dx = x - p.x;
//                 let dy = y - p.y;
//                 let distance = dx * dx + dy * dy;
//                 if (distance < min && distance < radius) {
//                     result = role;
//                     min = distance;
//                 }
//             }
//
//             return <RoleClass[T]>result;
//         }
//
//         public getPet(id: number): Pet {
//             return this._pets[id];
//         }
//     }
// }