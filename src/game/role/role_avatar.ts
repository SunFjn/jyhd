///<reference path="../misc/role_utils.ts"/>


namespace game.role {
    import Sprite3D = Laya.Sprite3D;

    export class RoleAvatar extends Sprite3D {
        protected _SKDirection: -1 | 1;
        protected _direction: number;
        protected _fighting: boolean;
        private _clothes: number;
        private _weapon: number;
        private _wing: number;
        private _immortals: number;
        private _aura: number;
        private _tianZhu: number;
        private _xianTong: number;

        private _owner: Role;
        public _avaterSK: SkeletonComponent;
        public readonly title: Sprite3D;

        constructor(owner: Role = null) {
            super();
            this._owner = owner;
            this._fighting = false;
            this._clothes = this._weapon = this._wing = this._immortals = this._aura = this._tianZhu = 0;

            this.title = new Sprite3D();
            this._direction = 0;
            this._SKDirection = 1;
        }

        public reset(body: string, id: number = 0) {
            if (this._owner) {
                this._avaterSK = this._owner.property.get("avatarSK");

                let defaultDir = this._owner.property.get("defaultSKDirection");
                if (defaultDir) {
                    this.SKDirection = defaultDir;
                }
            }
            this.addChild(this.title);
        }


        // -1为镜像（左边） 1为正向（右边）
        public get SKDirection(): -1 | 1 {
            return this._SKDirection;
        }
        public set SKDirection(val: -1 | 1) {
            this._SKDirection = val;
        }

        public get clothes(): number {
            return this._clothes;
        }

        public set clothes(value: number) {
            this._clothes = value;
        }

        public get xianTong(): number {
            return this._xianTong;
        }

        public set xianTong(value: number) {
            this._xianTong = value;
        }

        public get immortals(): number {
            return this._immortals;
        }

        public get haveImmortals(): boolean {
            return this._immortals != 0 && this._immortals != -1;
        }

        public set immortals(value: number) {
            this._immortals = value;
        }

        public get wing(): number {
            return this._wing;
        }

        public set wing(value: number) {
            this._wing = value;
        }

        public get weapon(): number {
            return this._weapon;
        }

        public set weapon(value: number) {
            this._weapon = value;
        }

        public get aura(): number {
            return this._aura;
        }

        public set aura(value: number) {
            this._aura = value;
        }

        public get tianZhu(): number {
            return this._tianZhu;
        }

        public set tianZhu(value: number) {
            this._tianZhu = value;
        }

        /**
         * 
         * @param aniTypeArr 
         * @param actionType 
         * @param loop 
         * @param force 
         * @param callback 回调函数 
         * @param caller 执行域
         */
        public playAnim(aniTypeArr: Array<AvatarAniBigType>, actionType: ActionType, loop: boolean = true, force: boolean = false, callback: Function = null, caller: any = null): number {
            if (this._avaterSK) {
                return this._avaterSK.playAnim(aniTypeArr, actionType, loop, force, callback, caller);
            } else {
                return 0;
            }
        }

        /**
         * 死亡时清理超时动画
         */
        public deadClearAllPlayAnimTimeout(): void {
            if (this._avaterSK) {
                this._avaterSK.deadClearAllPlayAnimTimeout();
            }
        }

        /**
         * 获取当前播放的动画的名字
         */
        public get currentPlayAnim(): ActionType {
            if (this._avaterSK) {
                return this._avaterSK.currentPlayAnim;
            }
            return ActionType.NONE;
        }

        public get fighting(): boolean {
            return this._fighting;
        }

        public set fighting(value: boolean) {
            this._fighting = value;
        }

        public destroy(destroyChild?: boolean): void {
            super.destroy(destroyChild);
            // 移除龙骨动画组件
            if (this._avaterSK) {
                this._avaterSK.clearSK();
                this._avaterSK = null;
            }
        }

    }
}
