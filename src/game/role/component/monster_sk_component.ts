// 怪物龙骨模型
namespace game.role.component {
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SceneModel = modules.scene.SceneModel;
    import SkeletonScaleFactor = game.role.SkeletonScaleFactor;
    import SkeletonScaleFactorFields = game.role.SkeletonScaleFactorFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;

    export class MonsterSKComponent extends SkeletonComponent {
        protected _Sync: boolean = true;
        private _debugTxt: Laya.Label = null;
        private _debug: boolean = false;
        constructor(owner: Role) {
            super(owner);
            this.property.set("avatarSK", this);
            this._skeleAvatar = SkeletonAvatar.create(`Monster:${owner.property.get("name")}(${owner.property.get("id")})`);
            this._skeleAvatar.zOrder = 10;
            // this._debugTxt = this.initLabel();
        }

        public setup(): void {
            this._avatar = this.property.get("avatar");
            this.setAvatarAlphaVal();
            // this._transform = this._avatar.title.transform;
            this._transform = this._avatar.transform;
            GameCenter.instance.world.publish("addToLayer", LayerType.Monster, this._skeleAvatar);
            this._debugTxt && this._debugTxt.on(Laya.Event.MOUSE_OVER, this, this.debugDetailed)
            // this.reset();
        }
        public hit() {
            let direction = this._direction;
            let p = this._transform.position
            this._Sync = false
            let type = 2
            switch (type) {
                case 1: // 击退
                    this.repel(50)
                    break;
                case 2: // 浮空
                    this.levitation(100)
                    break;
                default:
                    break;
            }

        }
        /**
         * 击退效果
         * @param targetX 击退距离
         */
        private repel(targetX) {
            let x = this._skeleAvatar.x
            TweenJS.create(this._skeleAvatar)
                .to({
                    x: x + targetX
                }, 130)
                .onComplete(this.restComplete.bind(this))
                .start()
        }
        private birthPos: Laya.Point = new Laya.Point();
        private _levitationTween: TweenJS = null;
        private _levitationBackTween: TweenJS = null;
        /**
         * 浮空效果
         * @param targetY 浮空高度
         */
        private levitation(targetY) {
            let d = Math.ceil(Math.abs(targetY) / 50 * 120)
            if (!this.property.get("levitation")) {
                this.birthPos.setTo(
                    this._skeleAvatar.x,
                    this._skeleAvatar.y
                )
            } else {
                if (this._levitationTween) TweenJS.recover(this._levitationTween)
                if (this._levitationBackTween) TweenJS.recover(this._levitationBackTween)
            }
            this.property.set("levitation", true);
            let y = this._skeleAvatar.y
            this._levitationTween = TweenJS.create(this._skeleAvatar)
                .to({
                    y: y - targetY
                }, d)
                .onComplete(this.levitationBack.bind(this))
                .start()
        }
        // 浮空后回落计算
        private levitationBack() {
            // 回落时间计算  每Y轴 50像素 回落需要X毫秒
            let d = Math.ceil(Math.abs(this.birthPos.y - this._skeleAvatar.y) / 50 * 120)
            if (d > 300) d = 300
            this._levitationBackTween = TweenJS.create(this._skeleAvatar)
                .to({ y: this.birthPos.y }, d)
                .onComplete(this.restbirthPos.bind(this))
                .start()
        }





        // 恢复至初始坐标
        private restbirthPos() {
            let pos = this._transform.position;
            pos.x = this.birthPos.x
            pos.y = -(this.birthPos.y + this._offsetY)
            this._transform.position = pos
            this.property.set("levitation", false);
            this._Sync = true
            this._levitationTween = null;
            this._levitationBackTween = null;
        }




        // 重置坐标完成
        private restComplete() {
            let pos = this._transform.position;
            pos.x = this._skeleAvatar.x
            pos.y = -(this._skeleAvatar.y + this._offsetY)
            this._transform.position = pos
            this._Sync = true
            // 击退可能需要发送坐标同步
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
        public reset(clothes: number, weapon: number, wing: number, immortals: number, aura: number, tianZhu: number, effect: number,guangHuan: number) {
            this._skeleAvatar.reset(clothes, -1, -1, -1, -1, -1,-1);
            // this._skeleAvatar.resetOffset(AavatarAniBigType.clothes, 50);

            // 怪物方向 -- 弃用，默认会与玩家相对
            // if (SceneModel.instance.isHangupScene && !SceneModel.instance.isInMission) {
            //     // 天关计算怪物与主角的方向
            //     if (SceneModel.instance.isInMission) {

            //     }
            //     // 挂机场景怪物默认方向面向左侧
            //     else {
            //         this._skeleAvatar.direction = -1;
            //     }
            // }
        }

        // 播放动画
        public playAnim(aniTypeArr: Array<AvatarAniBigType>, actionType: ActionType, loop: boolean = true, force: boolean = false, callback: Function = null): number {
            if (!this._skeleAvatar) return -1;
            // 动画配套操作(攻击=角色+幻武)
            for (let index = 0; index < aniTypeArr.length; index++) {
                const aniType = aniTypeArr[index];
                // 同时播放多个动画，只需要一个动画有回调即可
                return this._skeleAvatar.playAnim(aniType, actionType, loop, force, index == 0 ? callback : null);
            }
        }


        public teardown(): void {
            this._debugTxt && this._debugTxt.off(Laya.Event.CLICK, this, this.debugDetailed)
            this.delLabel()
        }

        public destory(): void {
            this.delLabel()
        }
        protected updateTime: number = 0
        // 同步位置和角色方向
        public update(): void {
            let pos = this._transform.position;
            if (this._Sync) {
                this._skeleAvatar.x = pos.x;
                this._skeleAvatar.y = -(pos.y + this._offsetY);
            }


            // 保存和修改龙骨的方向
            this.keepSameDirection();
            let t = GlobalData.serverTime
            if (this._debugTxt && t - this.updateTime > 50 && !!this.property) {
                this.updateTime = t
                let p = GameCenter.instance._master.property.get('transform').position
                let real = MapUtils.getPosition(pos.x, -pos.y);
                let despos = this.property.get('desPos')
                let radius = 250;
                let property = this.property;
                if (property.get("type") == RoleType.Monster) {
                    radius = MonsterResCfg.instance.getCfgById(property.get("occ"))[MonsterResFields.radius];
                }
                let debug = this.property.get('debug') || [[0, 0], [0, 0], [0, 0]]
                if (this.property.get('status') != RoleState.DEATH && pos.x < p.x) this._debug = true
                if (this._debug) {
                    this._debugTxt.text =
                        `
                id:  ${this.property.get('id')}
                radius:  ${radius}
                distance: ${Math.ceil(MapUtils.getDistance(pos.x, pos.y, p.x, p.y))}
                pos: x ${real.x} y ${real.y}
                pixel: x ${pos.x} y ${-pos.y}
                depos: x ${despos.x} y ${despos.y}
                speed: x ${this.property.get('speed')}
                Spos: x ${debug[0][0]} y ${debug[0][1]}
                SpixelPos: x ${debug[1][0]} y ${debug[1][1]}
                sdesPos: x ${debug[2][0]} y ${debug[2][1]}
                `;
                } else {
                    this._debugTxt.text = `点我详细信息`
                }

                // this._debugTxt.pos(pos.x - 50 - this._debugTxt.width / 2, -(pos.y + this._offsetY) - 400)
                this._debugTxt.pos(pos.x - 50 - this._debugTxt.width / 2, 1100)
            }

        }
        private debugDetailed() {
            this._debug = !this._debug
        }
        private delLabel() {
            if (this._debugTxt != null) {
                this._debugTxt.removeSelf();
                this._debugTxt = null;
            }
        }
        private initLabel(size: number = 30, stroke: number = 2, strokeColor: string = "#ffe270"): Laya.Label {
            let result = new Laya.Label();
            result.fontSize = size;
            result.font = "SimHei";
            result.stroke = stroke;
            result.leading = 2
            result.zOrder = 999
            result.strokeColor = CommonUtil.randomColor();
            GameCenter.instance.world.publish("addToLayer", LayerType.Literal, result);
            return result;
        }
    }
}

