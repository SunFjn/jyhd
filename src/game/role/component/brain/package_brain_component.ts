// namespace game.role.component.brain {
//     import PackageAvatarComponent = game.role.component.exterior.PackageAvatarComponent;
//     import BatchLiteralElement = base.mesh.BatchLiteralElement;
//     import Vector3 = Laya.Vector3;
//     import MathUtils = utils.MathUtils;
//
//     const enum PackageBrainStep {
//         Wait,
//         MoveTo
//     }
//
//     export class PackageBrainComponent extends RoleComponent {
//         private _step: PackageBrainStep;
//         private _target: Role;
//         private _timeout: number;
//         private _startTime: number;
//         private _element: BatchLiteralElement;
//         private _pos: Vector3;
//
//         constructor(owner: Role) {
//             super(owner);
//             this._pos = new Vector3();
//         }
//
//         public setup(): void {
//             this._step = PackageBrainStep.Wait;
//             this._target = GameCenter.instance.getRole(PlayerModel.instance.actorId);
//             this._timeout = Date.now() + 1000;
//             this._element = this.owner.getComponent(PackageAvatarComponent).element;
//             this._pos.elements.set(this._element.offset.elements);
//         }
//
//         public teardown(): void {
//         }
//
//         public destory(): void {
//
//         }
//
//         public update(): void {
//             switch (this._step) {
//                 case PackageBrainStep.Wait: {
//                     if (Date.now() > this._timeout) {
//                         this._step = PackageBrainStep.MoveTo;
//                         this._startTime = Date.now();
//                     }
//                     break;
//                 }
//                 case PackageBrainStep.MoveTo: {
//                     let rate = (Date.now() - this._startTime) / 800;
//                     let s = MathUtils.lerp(1, 0.5, rate);
//                     let pos = this._target.property.get("transform").localPosition;
//                     this._element.scale.reset(s, s, s);
//                     this._element.offset.x = MathUtils.lerp(this._pos.x, pos.x, rate);
//                     this._element.offset.y = MathUtils.lerp(this._pos.y, pos.y + 150, rate);
//                     this._element.offset.z = MathUtils.lerp(this._pos.z, pos.z, rate);
//                     if (rate >= 1) {
//                         this.owner.leave();
//                     }
//                     break;
//                 }
//             }
//         }
//     }
// }
