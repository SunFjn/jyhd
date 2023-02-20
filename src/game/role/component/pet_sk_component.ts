// 宠物龙骨模型
namespace game.role.component {
    import PetResCfg = modules.config.PetResCfg;
    import PetRes = Configuration.PetRes;
    import PetResFields = Configuration.PetResFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class PetSKComponent extends SkeletonComponent {
        constructor(owner: Role, isMaster: boolean = false) {
            super(owner);
            this.property.set("avatarSK", this);
            this._skeleAvatar = SkeletonAvatar.create(`Pet:${owner.property.get("name")}(${owner.property.get("id")})`);
            this._skeleAvatar.zOrder = 90 + (isMaster ? 9 : 0);

            this._skeleAvatar.SkeleType = RoleType.Pet;
        }

        public setup(): void {
            this._avatar = this.property.get("avatar");
            this.setAvatarAlphaVal();
            // this._transform = this._avatar.title.transform;
            this._transform = this._avatar.transform;
            GameCenter.instance.world.publish("addToLayer", LayerType.Player, this._skeleAvatar);

            // this.reset();
        }

        // 设置龙骨动画
        public reset(clothes: number, weapon: number, wing: number, immortals: number, aura: number, tianZhu: number, effect: number, guangHuan: number) {
            // 宠物数据
            let cfg: PetRes = modules.config.PetResCfg.instance.getCfgById(clothes);
            let isRemote: boolean = cfg[PetResFields.pet_type] == 1;
            let radius: number = cfg[PetResFields.radius];
            let attack_radius: number = cfg[PetResFields.attack_radius];

            // 更新宠物的数据
            this.property.set("petCurrentData", [clothes, isRemote, radius, attack_radius]);

            this._skeleAvatar.reset(clothes, -1, -1, -1, aura, -1,-1);
            this._skeleAvatar.resetOffset(AvatarAniBigType.clothes, -20, 40);
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

        // 播放动画
        public playAnim(aniTypeArr: Array<AvatarAniBigType>, actionType: ActionType, loop: boolean = true, force: boolean = false, callback: Function = null): number {
            return this._skeleAvatar.playAnim(aniTypeArr[0], actionType, loop, force, callback);
        }


        public teardown(): void {


        }

        public destory(): void {

        }

        // 同步位置和角色方向
        public update(): void {
            let pos = this._transform.position;
            this._skeleAvatar.x = pos.x;
            this._skeleAvatar.y = -(pos.y + this._offsetY);

            // 保存和修改龙骨的方向
            this.keepSameDirection();
        }


        private hurt(id: number, skill: uint, damage: uint, flags: TipsFlags): void {

        }


    }
}
