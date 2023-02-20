// npc龙骨模型
namespace game.role.component {
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SceneModel = modules.scene.SceneModel;
    import SkeletonScaleFactor = game.role.SkeletonScaleFactor;
    import SkeletonScaleFactorFields = game.role.SkeletonScaleFactorFields;
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    export class NpcSKComponent extends SkeletonComponent {
        constructor(owner: Role) {
            super(owner);
            this.property.set("avatarSK", this);
            this._skeleAvatar = SkeletonAvatar.create(`Npc:${owner.property.get("name")}(${owner.property.get("id")})`);
            this._skeleAvatar.zOrder = 10;
        }

        public setup(): void {
            this._avatar = this.property.get("avatar");
            this.setAvatarAlphaVal();
            this._transform = this._avatar.transform;
            this.initConfig();
            GameCenter.instance.world.publish("addToLayer", LayerType.Npc, this._skeleAvatar);
        }

        private initConfig() {
            // spine动画 不同显示处理
            let cfg = NpcCfg.instance.getCfgById(this.property.get("occ"))
            let action = cfg[npcFields.action]

            if (action != "") {
                let type: ActionType = null
                type = <ActionType>action
                this.playAnim([AvatarAniBigType.clothes], ActionType.attack_01, true, false, null);
            }
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
        public reset(clothes: number, weapon: number, wing: number, immortals: number, aura: number, tianZhu: number, effect: number, guangHuan: number) {
            this._skeleAvatar.reset(clothes, -1, -1, -1, -1, -1, -1);
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


        public update(): void {
            let pos = this._transform.position;
            this._skeleAvatar.x = pos.x;
            this._skeleAvatar.y = -(pos.y + this._offsetY);

        }

        public teardown(): void {


        }

        public destory(): void {

        }

    }
}

