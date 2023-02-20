///<reference path="../../../modules/common/skeleton_avatar.ts"/>

// 玩家龙骨模型
namespace game.role.component {
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class AvatarSKComponent extends SkeletonComponent {
        private _locomotor: LocomotorComponent;
        public _isMaster: boolean = false;
        private _debugTxt: Laya.Label = null;
        private _debug: boolean = true;
        constructor(owner: Role, isMaster: boolean = false) {
            super(owner);
            this.property.set("avatarSK", this);
            this._skeleAvatar = SkeletonAvatar.create(this.property.get("name") + "-" + this.property.get("id"));
            this._skeleAvatar.zOrder = 100 + (isMaster ? 10 : 0);

            // 玩家自己
            if (isMaster) {
                this._skeleAvatar.SkeleType = RoleType.Master;
            }else if (this.property.get("type") == RoleType.Player) {
                this._skeleAvatar.SkeleType = RoleType.Player;
            }
            this._isMaster = isMaster
           // this._debugTxt = this.initLabel();

        }

        public setup(): void {
            this._avatar = this.property.get("avatar");
            this.setAvatarAlphaVal();
            // this._transform = this._avatar.title.transform;
            this._transform = this._avatar.transform;
            if (this._isMaster) {
                GameCenter.instance.world.publish("addToLayer", LayerType.Master, this._skeleAvatar);
            } else {
                GameCenter.instance.world.publish("addToLayer", LayerType.Player, this._skeleAvatar);
            }
            this._debugTxt && this._debugTxt.on(Laya.Event.CLICK, this, this.debugDetailed)

            // this.reset();
        }

        // 设置缩放
        public setScale(ssfs: Array<SkeletonScaleFactor>): void {
            for (let index = 0; index < ssfs.length; index++) {
                const ssf = ssfs[index];
                let aniBigType = ssf[SkeletonScaleFactorFields.AvatarAniBigType];
                let scale = ssf[SkeletonScaleFactorFields.ScaleValue];
                this._skeleAvatar.resetScale(aniBigType, scale);
            }
        }

        // 设置动画播放速率
        public setPlaybackRate(rates: Array<SkeletonScaleFactor>): void {
            for (let index = 0; index < rates.length; index++) {
                const rate = rates[index];
                this._skeleAvatar.resetPlaybackRate(rate[SkeletonPlaybackRateFactorFields.type], rate[SkeletonPlaybackRateFactorFields.speed]);
            }
        }

        // 设置龙骨动画
        public reset(clothes: number, weapon: number, wing: number, immortals: number, aura: number, tianZhu: number, effect: number, guanHuan:number) {
            this._skeleAvatar.reset(clothes, weapon, wing, immortals, 0, tianZhu,guanHuan);
            this._skeleAvatar.resetOffset(AvatarAniBigType.immortals, -90, 190);
            // this._skeleAvatar.resetScale(AvatarAniBigType.immortals, 0.1);
            this._skeleAvatar.playAnim(AvatarAniBigType.immortals, ActionType.PAO);
        }

        // 播放动画
        public playAnim(aniTypeArr: Array<AvatarAniBigType>, actionType: ActionType, loop: boolean = true, force: boolean = false, callback: Function = null): number {
            // 法阵(鬼神之力)播放动画
            this._skeleAvatar.playAnim(AvatarAniBigType.tianZhuBack, actionType, loop, true);
            this._skeleAvatar.playAnim(AvatarAniBigType.tianZhuFront, actionType, loop, true);
            // 时装播放动画
            return this._skeleAvatar.playAnim(AvatarAniBigType.clothes, actionType, loop, force, callback);
        }


        public teardown(): void {
            this._debugTxt && this._debugTxt.off(Laya.Event.CLICK, this, this.debugDetailed)
            this.delLabel()
        }

        public destory(): void {
            this.delLabel()
        }
        private updateTime: number = 0
        // 同步位置和角色方向
        public update(): void {
            let pos = this._transform.position;
            this._skeleAvatar.x = pos.x;
            this._skeleAvatar.y = -(pos.y + this._offsetY);

            // 保存和修改龙骨的方向
            this.keepSameDirection();
            let t = GlobalData.serverTime
            if (this._debugTxt && t - this.updateTime > 50 && !!this.property) {
                !this._locomotor && (this._locomotor = this.owner.getComponent(LocomotorComponent))
                let real = MapUtils.getPosition(pos.x, -pos.y);
                let despos = this.property.get('desPos')
                // let debug = this.property.get('debug') || [[0, 0], [0, 0], [0, 0]]

                if (this._debug) {
                    this._debugTxt.text = `
                    id:  ${this.property.get('id')}
                    pos: x ${real.x} y ${real.y}
                    pixel: x ${Math.ceil(pos.x)} y ${Math.ceil(-pos.y)}
                    depos: x ${despos.x} y ${despos.y}
                    speed: x ${Math.ceil(this._locomotor.speed)}
                    `;
                } else {
                    this._debugTxt.text = `点我详细信息`
                }


                // this._debugTxt.pos(pos.x - 50 - this._debugTxt.width / 2, -(pos.y + this._offsetY) - 200)
                this._debugTxt.pos(pos.x - 50 - this._debugTxt.width / 2, 1100)
            }
        }
        private delLabel() {
            if (this._debugTxt != null) {
                this._debugTxt.removeSelf();
                this._debugTxt = null;
            }
        }

        private debugDetailed() {
            this._debug = !this._debug
        }
        private initLabel(size: number = 30, stroke: number = 2, strokeColor: string = "#ffe270"): Laya.Label {
            let result = new Laya.Label();
            result.fontSize = size;
            result.font = "SimHei";
            result.stroke = stroke;
            result.leading = 2
            result.strokeColor = strokeColor;
            result.zOrder = 999
            GameCenter.instance.world.publish("addToLayer", LayerType.Literal, result);
            return result;
        }


    }
}
