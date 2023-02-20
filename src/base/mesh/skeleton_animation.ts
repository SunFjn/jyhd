namespace base.mesh {
    export class AnimationClip {
        private readonly _skinnedData: Float32Array;
        private _children: Array<[string, Laya.Sprite3D]>;
        private readonly _skeleton: Skeleton;
        private readonly _name: string;
        private readonly _clip: AnimationData;
        private readonly _skeletonClip: SkeletonClip;
        private _progress: number;
        private _cursor: uint;

        constructor(name: string, clip: AnimationData, skeleton: Skeleton, skinnedData: Float32Array, children: Array<[string, Laya.Sprite3D]>) {
            this._clip = clip;
            this._name = name;
            this._progress = -1;
            this._cursor = 0;
            this._skinnedData = skinnedData;
            this._children = children;
            this._skeleton = skeleton;
            this._skeletonClip = skeleton.getSkeletonClip(clip);
        }

        public reset(): void {
            this._progress = 0;
            this._cursor = 0;
            this._clip.getSkinnedData(this._cursor, this._skeleton, this._skinnedData);
            this.updateAttachment();
        }

        public get mounts(): Array<[string, Laya.Sprite3D]> {
            return this._children;
        }

        public set mounts(value: Array<[string, Laya.Sprite3D]>) {
            if (this._children == value) {
                return;
            }
            this._children = value;
            this.updateAttachment();
        }

        public get duration(): number {
            return this._clip.numFrames * this._clip.framerate;
        }

        public get progress(): number {
            return this._progress;
        }

        public set progress(value: number) {
            let numFrames = this._clip.numFrames;
            this._progress = value;
            let rate = value - Math.floor(value);
            let index = (rate == 0 && value != 0) ? (numFrames - 1) : Math.floor(rate * numFrames);
            if (this._cursor == index) {
                return;
            }
            this._cursor = index;
            this._clip.getSkinnedData(this._cursor, this._skeleton, this._skinnedData);
            this.updateAttachment();
        }

        private updateAttachment() {
            if (this._children && this._skeletonClip) {
                let t: Laya.Transform3D;
                for (let tuple of this._children) {
                    t = tuple[1].transform;
                    t.localMatrix = this._skeletonClip.getDummyMatrix(this._cursor, tuple[0], t.localMatrix);
                }
            }
        }
    }

    export class SkeletonAnimation {
        private readonly _skinnedData: Float32Array;
        private readonly _skeleton: Skeleton;
        private readonly _clips: Table<AnimationClip>;
        private _mounts: Array<[string, Laya.Sprite3D]>;

        constructor(data: MeshData, geometry: SkinnedGeometryMesh) {
            this._skinnedData = geometry.skinnedData;
            this._skeleton = data.skeleton;
            this._clips = {};

        }

        public get mounts(): Array<[string, Laya.Sprite3D]> {
            return this._mounts;
        }

        public set mounts(value: Array<[string, Laya.Sprite3D]>) {
            if (this._mounts == value) {
                return;
            }
            this._mounts = value;
            for (let key in this._clips) {
                this._clips[key].mounts = value;
            }
        }

        public addClip(name: string, clip: AnimationData) {
            this._clips[name] = new AnimationClip(name, clip, this._skeleton, this._skinnedData, this._mounts);
        }

        public getAnimationClip(name: string): AnimationClip {
            return this._clips[name];
        }
    }
}
