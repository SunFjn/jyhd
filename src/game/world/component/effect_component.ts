///<reference path="../../../base/ecs/entity_component.ts"/>
///<reference path="../../../modules/common/skeleton_effect.ts"/>
///<reference path="../../misc/role_utils.ts"/>
///<reference path="../../../utils/math_utils.ts"/>
///<reference path="../../../base/particle/particle_pool.ts"/>
/**
 * 技能特效组件
 * */
namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import SkeletonEffect = modules.common.SkeletonEffect;
    import PetRes = Configuration.PetRes;
    import PetResFields = Configuration.PetResFields;
    import Skeleton = Laya.Skeleton;
    import Image = Laya.Image;
    import Layer = ui.Layer;

    export class EffectComponent extends EntityComponent<WorldMessage, World> {
        private _index: number;
        private _current_effects: Array<SkeletonEffect>;
        private _death: Image;
        private _warning: Laya.Image;

        private _door: Skeleton;
        private _doorDecorate: Skeleton;
        private _doorCount: number;
        private _transitionAnimMask: Image;         //过渡动画蒙层
        private _transitionAnimMaskTwee: TweenJS;

        constructor(owner: World) {
            super(owner);
            this._index = 0;
            GlobalData.effectComponent = this;
            this._current_effects = new Array<SkeletonEffect>();
            this._death = new Image("assets/image/deathtex.png")
            this._death.visible = false
            this._death.pivotX = 240;
            this._death.pivotY = 240;
         
            this._doorCount = 0;
            this._door = new Laya.Skeleton();
            this._doorDecorate = new Laya.Skeleton();
            this._door.visible = false;
            this._doorDecorate.visible = false;
            this._doorDecorate.zOrder = 999;
            this._door.load("res/skeleton/other/portalA_2.sk", Laya.Handler.create(this, () => {
                this._doorCount++;
            }));
            this._doorDecorate.load("res/skeleton/other/portalA_1.sk", Laya.Handler.create(this, () => {
                this._doorCount++;
            }));

            this._warning = new Laya.Image("assets/image/warningtex.png")
            this._warning.visible = false;
            this._warning.name = "Boss Warning";
        }

        public setup(): void {
            this.owner
                .on("launchEffect", this, this.launchEffect)
                .on("leaveScene", this, this.leaveScene)
                .on("updateTianguan", this, this.leaveScene)
                .on("removeDeadSkillEffect", this, this.removeDeadSkillEffect)
                .on("playBossdeath", this, this.playBossdeath)
                .on("setTransformDoorActive", this, this.setTransformDoorActive)
                .on("playWarning", this, this.playWarning)
            GlobalData.dispatcher.on(CommonEventType.SKILL_EFFECT_RECYCLE, this, this.recoverSkeleComponent);
            this.owner.publish("addToLayer", LayerType.Foreground, this._death);
            this.initTransitionAnimMask();
            LayerManager.instance.addToMainUILayer(this._warning);
            this._transitionAnimMask.on(Laya.Event.CLICK, this, this.transitionAnimMaskHandler);
        }

        /**
        * 将龙骨组件放回对象池,龙骨资源回收
        */
        private recoverSkeleComponent(skeletonEffect: SkeletonEffect) {
            let index: number = this._current_effects.indexOf(skeletonEffect);
            if (index != -1) {
                this._current_effects.splice(index, 1);
            }
            // console.log("未实时回收特效剩余：", this._current_effects.length);

            skeletonEffect.visible = false;
            skeletonEffect.putAllSkeletonToPool();
            skeletonEffect.removeSelf();
            Laya.Pool.recover("SKELETON_EFFECT_COM", skeletonEffect);
        }

        /**
         * 离屏时清理技能
         */
        private leaveScene(): void {
            for (let effect of this._current_effects) {
                this.recoverSkeleComponent(effect)
            }
            this._current_effects.length = 0;
            this._warning.visible = false;
        }

        /**
         * 角色死亡时清理对应的技能特效
         */
        private removeDeadSkillEffect(deadroleid: number): void {
            for (let effect of this._current_effects) {
                if (effect.ownerid == deadroleid) {
                    // console.log("角色死亡,清理技能特效: 死亡角色id", deadroleid,"特效id:", effect.skillid);
                    this.recoverSkeleComponent(effect)
                }
            }
        }

        /**
         * 获取一个龙骨组件item
         */
        private getSkeletonItem(): SkeletonEffect {
            let skeletonEffect: SkeletonEffect = Laya.Pool.getItemByCreateFun("SKELETON_EFFECT_COM",
                () => {
                    return SkeletonEffect.create(`Skill Effect${this._index++}`);
                });

            skeletonEffect.visible = true;
            return skeletonEffect;
        }

        public teardown(): void {
            this.owner
                .off("launchEffect", this, this.launchEffect)
                .off("leaveScene", this, this.leaveScene)
                .off("updateTianguan", this, this.leaveScene)
                .off("removeDeadSkillEffect", this, this.removeDeadSkillEffect)
                .off("playBossdeath", this, this.playBossdeath)
                .off("setTransformDoorActive", this, this.setTransformDoorActive)
                .off("playWarning", this, this.playWarning)
            GlobalData.dispatcher.off(CommonEventType.SKILL_EFFECT_RECYCLE, this, this.recoverSkeleComponent);
            this._transitionAnimMask.off(Laya.Event.CLICK, this, this.transitionAnimMaskHandler);
        }

        public destory(): void {

        }

        /**
         * 加载并播放特效
         * 
         * @param type 类型 0背景 1前景 2投掷物
         * @param id 技能id
         * @param pos 位置
         * @param direction 方向
         */
        private launchEffect(roleRype: RoleType, type: number, id: string, pos: Laya.Point, direction: number, skDirection: -1 | 1, data: any = null): void {
            if (!modules.rename.SetCtrl.instance.isPlaySkillEffect(roleRype,data["petid"] != undefined)) {//根据玩家设置是否能够播放技能特效
                return;
            }
            // 执行
            let idInt = parseInt(id);
            let skeletonEffect: SkeletonEffect = this.getSkeletonItem();
            skeletonEffect.direction = skDirection;
            if (!skeletonEffect) {
                console.error("技能特效节点获取失败!!!");
                return;
            }
            skeletonEffect.skillid = idInt;
            skeletonEffect.ownerid = !data ? 0 : data.roleid;

            switch (type) {
                case 0: // 前景
                    GameCenter.instance.world.publish("addToLayer", LayerType.Foreground, skeletonEffect);
                    skeletonEffect.pos(pos.x, pos.y)
                    break;
                case 1: // 后景
                    GameCenter.instance.world.publish("addToLayer", LayerType.Background, skeletonEffect);
                    skeletonEffect.pos(pos.x, pos.y)
                    break;
                // case 2: {   //  未实装测试 10-25 10:37
                //     GameCenter.instance.world.publish("addToLayer", LayerType.Foreground, skeletonEffect);
                //     let l = 4000;
                //     let angle = RoleUtils.projectionYawPitchRoll(direction);
                //     let x = pos.x - l * Math.sin(angle.x);
                //     let y = pos.y + l * Math.sin(angle.y);
                //     skeletonEffect.frameLoop(1, skeletonEffect, function (this: SkeletonEffect) {
                //         let pos = { x: this.x, y: this.y };
                //         let dx = x - pos.x;
                //         let dy = y - pos.y;
                //         let dd = Math.sqrt(dx * dx + dy * dy);
                //         let delta = (800 * Laya.timer.delta / 1000) / dd;
                //         this.x = MathUtils.lerp(pos.x, x, delta);
                //         this.y = MathUtils.lerp(pos.y, y, delta);
                //     });
                //     break;
                // }
                case 3: {// 宠物攻击
                    let petId = data.petid;
                    let petData: PetRes = modules.config.PetResCfg.instance.getCfgById(petId);
                    let customEffectID: number = petData[PetResFields.effectId];
                    // 自定义特效id
                    if (!!customEffectID) idInt = customEffectID;

                    GameCenter.instance.world.publish("addToLayer", LayerType.Foreground, skeletonEffect);
                    let emitY = pos.y - petData[PetResFields.attack_point_Y] - 500;
                    let imgPos: Laya.Point = new Laya.Point(pos.x - 100, emitY - petData[PetResFields.bullet_offset_y] - 50);
                    let tempPos: Laya.Point = new Laya.Point(data.targetPos.x, data.targetPos.y - 240);
                    let bulletSpeed = 300 * petData[PetResFields.attack_speed] * this.calcSpeedRate(pos, tempPos);

                    skeletonEffect.pos(pos.x + petData[PetResFields.attack_point_X], emitY);

                    setTimeout(() => {
                        let image = Laya.Pool.getItemByCreateFun("fashewu", function () { return new Laya.Image(); });
                        image.pos(imgPos.x, imgPos.y);
                        image.skin = `assets/image/bullet/${petData[PetResFields.bullet_name]}`

                        image.visible = true;
                        GameCenter.instance.world.publish("addToLayer", LayerType.Foreground, image);
                        TweenJS.create(image).to({ x: tempPos.x, y: tempPos.y }, bulletSpeed).onComplete(() => {
                            image.visible = false;
                            image.removeSelf();
                            Laya.Pool.recover("fashewu", image);
                        }).start();
                    }, 300);
                    break;
                }
            }
            skeletonEffect.resetAndPlay(idInt);
            this._current_effects.push(skeletonEffect)
            // skeletonEffect.timerOnce(5000, skeletonEffect, this.recoverSkeleComponent) 5秒超时回收  按需添加
        }

        /**
         * 计算速度速率
         */
        private calcSpeedRate(p1: Laya.Point, p2: Laya.Point) {
            let base = 420;
            let curDis = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
            let rate = curDis / base;
            // console.log("rate:", rate);
            return rate;
        }


        private playBossdeath(pos: Laya.Point) {
            this._death.scale(2, 2);
            this._death.pos(pos.x, pos.y, true);
            this._death.visible = true;
            this._death.zOrder = 999;
            TweenJS.create(this._death)
                .combine(true)
                .to({ scaleX: 1.7, scaleY: 1.7 }, 800)
                .chain(
                    TweenJS.create(this._death)
                        .to({ scaleX: 5, scaleY: 5 }, 500)
                )
                .onComplete((e: Laya.Image) => {
                    e.visible = false;
                })
                .start();

        }
        private playWarning(bool: boolean) {
            if (bool) {
                this._warning.size(CommonConfig.viewWidth, CommonConfig.viewHeight)
                this._warning.alpha = 0.3
                this._warning.visible = true
                TweenJS.create(this._warning)
                    .combine(true)
                    .to({ alpha: 0.7 }, 240)
                    .chain(
                        TweenJS.create(this._warning)
                            .to({ alpha: 0.3 }, 240)
                            .combine(true)
                            .chain(
                                TweenJS.create(this._warning)
                                    .to({ alpha: 0.7 }, 240)
                                    .combine(true)
                                    .chain(
                                        TweenJS.create(this._warning)
                                            .to({ alpha: 0.3 }, 240)
                                            .combine(true)
                                            .chain(
                                                TweenJS.create(this._warning)
                                                    .to({ alpha: 0.7 }, 240)
                                                    .combine(true)
                                                    .chain(
                                                )
                                            )
                                    )
                            )
                    )
                    .onComplete((e: Laya.Image) => {
                        TweenJS.create(this._warning)
                            .combine(true)
                            .to({ alpha: 0 }, 450)
                            .start();
                    })
                    .start();

            } else {
                this._warning.visible = false;
            }

        }


        /**
           * 设置传送门显示/隐藏
           * 
           * @param active true 显示 false 隐藏
           * @param pos 传送门位置
           */
        private setTransformDoorActive(active: boolean, pos: Laya.Point = null) {
            // console.log(active ? "芝麻开门!" : "芝麻关门!");
            if (this._doorCount < 2) { // 小于2未加载完成
                return;
            } else if (this._doorCount == 2) {
                this._doorCount++;
                GameCenter.instance.getWorldLayer(LayerType.Background).addChild(this._door) // 地图显示 不需要层级控制
                GameCenter.instance.getWorldLayer(LayerType.Foreground).addChild(this._doorDecorate) // 地图显示 不需要层级控制
            }


            if (active) {
                this._door.pos(pos.x * 16, pos.y * 16);
                this._door.visible = true;
                this._door.play(0, true, true);
                this._doorDecorate.pos(pos.x * 16, pos.y * 16);
                this._doorDecorate.visible = true;
                this._doorDecorate.play(0, true, true);
            } else {
                this._door.visible = false;
                this._door.stop();
                this._doorDecorate.visible = false;
                this._doorDecorate.stop();
                this.playTransitionAnimMask(null);
            }

        }

        private initTransitionAnimMask() {
            this._transitionAnimMask = new Image();
            this._transitionAnimMask.sizeGrid = "7,5,7,5,1";
            this._transitionAnimMask.skin = "common/block0.png";
            this._transitionAnimMask.size(Laya.stage.width, Laya.stage.height);
            this._transitionAnimMask.left = 0;
            this._transitionAnimMask.top = 0;
            this._transitionAnimMask.bottom = 0;
            this._transitionAnimMask.right = 0;
            this._transitionAnimMask.pos(0, 0);
            this._transitionAnimMask.scale(2, 2);
            this._transitionAnimMask.mouseEnabled = true;
            this._transitionAnimMask.zOrder = 999;
            LayerManager.instance.getLayerById(Layer.MAIN_UI_LAYER).addChild(this._transitionAnimMask)
            this._transitionAnimMask.visible = false;
        }


        private playTransitionAnimMask(callBack: Function) {
            if (this._transitionAnimMaskTwee) {
                this._transitionAnimMaskTwee.stop();
            }
            this._transitionAnimMask.visible = true;
            this._transitionAnimMask.alpha = 1;
            this._transitionAnimMaskTwee = TweenJS.create(this._transitionAnimMask).to({ alpha: 0 }, 300)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    this._transitionAnimMask.visible = false;
                    if (callBack) {
                        callBack();
                    }
                }).start()

        }

        private transitionAnimMaskHandler() {
            this._transitionAnimMask.visible = false;
        }
    }
}