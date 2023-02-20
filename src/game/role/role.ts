namespace game.role {
    import Entity = base.ecs.Entity;
    import EntityComponent = base.ecs.EntityComponent;
    import SkeletonAvatar = modules.common.SkeletonAvatar;


    export type SkeletonScaleFactor = [AvatarAniBigType, number];
    export const enum SkeletonScaleFactorFields {
        AvatarAniBigType = 0,
        ScaleValue = 1
    }
    export type SkeletonPlaybackRateFactor = [AvatarAniBigType, number];
    export const enum SkeletonPlaybackRateFactorFields {
        type = 0,
        speed = 1
    }

    export class Role extends Entity<RoleMessage> {
        public readonly id: number;
        public readonly property: Property;

        constructor(id: number) {
            super();
            this.id = id;
            this.property = new Property();
            this.property.set("id", id);
        }
    }

    export abstract class RoleComponent extends EntityComponent<RoleMessage, Role> {
        public readonly property: Property;

        protected constructor(owner: Role) {
            super(owner);
            this.property = owner.property;
        }
    }

    /**
     * 龙骨动画组件 - 子类以多态形式呈现
     */
    export abstract class SkeletonComponent extends RoleComponent {
        protected _transform: Laya.Transform3D;
        protected _skeleAvatar: SkeletonAvatar;
        protected _avatar: RoleAvatar;
        protected _direction: -1 | 0 | 1 = 0;
        protected _offsetY: number = 10;

        protected constructor(owner: Role) {
            super(owner);
        }

        /**
         * 设置龙骨动画或3D模型的alpha，全局的
         * 所有有该组件的都会受到影响
         * 
         * @param val alpha值
         */
        protected setAvatarAlphaVal(val: number = 1) {
            
        }

        /**
         * 是否正在播放死亡动画
         */
        public get onDeathAnimation(): boolean {
            return this._skeleAvatar.onDeathAnimation;
        }

        /**
         * 获取龙骨的位置
         */
        public getSKPositon(): Laya.Point {
            return new Laya.Point(this._skeleAvatar.x, this._skeleAvatar.y);
        }

        /**
         * 获取当前播放的动画的名字
         */
        public get currentPlayAnim(): ActionType {
            return this._skeleAvatar.currentPlayAction;
        }

        /**
         * 清理并销毁龙骨动画组件
         */
        public clearSK(): void {
            this._skeleAvatar.destroy(true);
            this.destory();
        }

        /**
         * 设置龙骨组件隐藏显示
         */
        public set active(_active: boolean) {
            this._skeleAvatar.visible = _active;
        }

        /**
         * 获取龙骨组件隐藏显示
         */
        public get active(): boolean {
            return this._skeleAvatar.visible;
        }

        /**
         * 死亡并清理动画回调
         */
        public deadClearAllPlayAnimTimeout(): void {
            this._skeleAvatar.deadClearAllPlayAnimTimeout();
        }

        /**
         * 保持龙骨组件的方向与3d模型的方向（左右朝向）一致
         * 所有龙骨资源默认朝向都应为右（正向）
         */
        protected keepSameDirection() {
            let avatarDir = this._avatar.SKDirection;
            if (this._direction != avatarDir) {
                this._direction = avatarDir;
                this._skeleAvatar.direction = avatarDir;
            }
        }

        /**
         * 龙骨资源朝向设置
         * 所有龙骨资源默认朝向都应为右（正向）
         */
        public set direction(avatarDir: -1 | 1) {
            this._skeleAvatar.direction = avatarDir;
        }

        /**
         * 龙骨资源加载完成回调
         */
        public setLoadCompleteHandler(foo: Function) {
            this._skeleAvatar.loadCompleteHandler = foo;
        }

        /**
         * 设置2d龙骨动画
         * 
         * @param clothes 皮肤id
         * @param weapon 幻武id
         * @param wing 翅膀id
         * @param immortals 精灵id
         * @param aura 法阵id
         * @param tianZhu 神兽id
         * @param effect 特效id
         * @param guanHuan 光环id
         */
        public abstract reset(clothes: number, weapon: number, wing: number, immortals: number, aura: number, tianZhu: number, effect: number, guanHuan:number): void;

        /**
         * 播放龙骨动画
         * 
         * @param aniTypeArr 给哪些（数组中的）龙骨播放动画 值参考：AavatarAniBigType
         * @param actionType 动画类型
         * @param loop 是否循环
         * @param force 是否强制播放
         * @param callback 播放完的回调
         */
        public abstract playAnim(aniTypeArr: Array<AvatarAniBigType>, actionType: ActionType, loop: boolean, force: boolean, callback: Function, caller: any): number;

        /**
         * 设置龙骨的缩放
         * 
         * @param ssfs 给哪些（数组中的）龙骨播设置缩放和值
         */
        public abstract setScale(ssfs: Array<SkeletonScaleFactor>): void;

        /**
         * 设置动画播放速率
         * 
         * @param    rates    1为标准速率
         */
        public abstract setPlaybackRate(rates: Array<SkeletonPlaybackRateFactor>): void;

        /**
        * 添加对象到龙骨
        */
        public addChild(e: Laya.Sprite) {
            this._skeleAvatar.addChild(e)
        }
        /**
         * 更改默认播放动作
         * @param action  动作名
         */
        public setDefault(action: ActionType) {
            this._skeleAvatar.defaultPlayAnim = action
        }


    }
}