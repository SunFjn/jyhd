// namespace game.role.component.exterior {
//     import BatchLiteralElement = base.mesh.BatchLiteralElement;
//     import MapUtils = game.map.MapUtils;
//     import Point = Laya.Point;
//     import Vector3 = Laya.Vector3;
//     import CommonUtil = modules.common.CommonUtil;
//
//     export class PackageAvatarComponent extends RoleComponent {
//         private _element: BatchLiteralElement;
//
//         constructor(owner: Role) {
//             super(owner);
//         }
//
//         public setup(): void {
//             this._element = this.loadPackage(this.property.get("occ"), this.property.get("pos"));
//             GameCenter.instance.world.publish("addPackage", this._element);
//         }
//
//         public teardown(): void {
//             GameCenter.instance.world.publish("delPackage", this._element);
//         }
//
//         public destory(): void {
//
//         }
//
//         public get element(): base.mesh.BatchLiteralElement {
//             return this._element;
//         }
//
//         private loadPackage(occ: number, pos: Point): BatchLiteralElement {
//             let z = pos.y * MapDefinitions.PER_ROW_Z;
//             pos = MapUtils.getRealPosition(pos.x, pos.y);
//             let icon = this.getPackageIcon(occ);
//             let rateX = 150 / 512;
//             let rateY = 150 / 1024;
//             let element: BatchLiteralElement = {
//                 sizes: [100, 100],
//                 uvs: [(icon % 3) * rateX, Math.floor(icon / 3) * rateY, rateX, rateY],
//                 scale: new Vector3(1, 1, 1),
//                 offset: new Vector3(pos.x, -pos.y, z),
//                 alpha: 1
//             };
//
//             return element;
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
// //
// //         public enterPackage(id: number, item: number, pos: Point): void {
// //             let z = pos.y * MapDefinitions.PER_ROW_Z;
// //             MapUtils.getRealPosition(pos.x, pos.y, pos);
// //
// //             let icon = this.getPackageIcon(item);
// //             let rateX = 150 / 512;
// //             let rateY = 150 / 1024;
// //             let element: BatchLiteralElement = {
// //                 sizes: [100, 100],
// //                 uvs: [(icon % 3) * rateX, Math.floor(icon / 3) * rateY, rateX, rateY],
// //                 scale: new Vector3(1, 1, 1),
// //                 offset: new Vector3(pos.x, -pos.y, z),
// //                 alpha: 1
// //             };
// //             this.packageMesh.addElement(element);
// //             this._items[id] = [element, null, null];
// //
// //             let s = Sprite3D.load("assets/particle/package01.lh");
// //             if (s.loaded) {
// //                 let ss = s.clone();
// //                 ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
// //                 this._packageLayer.addChild(ss);
// //                 this._items[id][1] = ss;
// //             } else {
// //                 s.on(Laya.Event.HIERARCHY_LOADED, this, () => {
// //                     let info = this._items[id];
// //                     if (info == null) {
// //                         return;
// //                     }
// //                     let ss = s.clone();
// //                     ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
// //                     this._packageLayer.addChild(ss);
// //                     info[1] = ss;
// //                 });
// //             }
// //
// //             let color = CommonUtil.getItemQualityById(item);
// //             let url = "assets/particle/package04.lh";
// //             switch (color) {
// //                 case 3:
// //                     url = "assets/particle/package02.lh";
// //                 case 4:
// //                     url = "assets/particle/package03.lh";
// //                 case 5: {
// //                     let s = Sprite3D.load(url);
// //                     if (s.loaded) {
// //                         let ss = s.clone();
// //                         ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
// //                         this._packageLayer.addChild(ss);
// //                         this._items[id][2] = ss;
// //                     } else {
// //                         s.on(Laya.Event.HIERARCHY_LOADED, this, () => {
// //                             let info = this._items[id];
// //                             if (info == null) {
// //                                 return;
// //                             }
// //                             let ss = s.clone();
// //                             ss.transform.localPosition = new Vector3(pos.x, -pos.y, z);
// //                             this._packageLayer.addChild(ss);
// //                             info[2] = ss;
// //                         });
// //                     }
// //                 }
// //             }
// //         }
//     }
// }
