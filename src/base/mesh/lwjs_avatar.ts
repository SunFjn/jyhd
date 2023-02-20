///<reference path="lwjs_avatar_parser.ts"/>
///<reference path="../materials/avatar_material.ts"/>
///<reference path="../textures/lwjs_texture_2d.ts"/>

namespace base.mesh {
    import HandlePool = base.assets.HandlePool;

    export class LwjsAvatar extends Laya.MeshSprite3D {
        public static load(url: string): LwjsAvatar {
            let av = new LwjsAvatar();
            av._setUrl(url);
            av.active = false;
            av._loaded = false;
     
            AvatarDataPool.instance.load(url, av.onResourceComplete);
            return av;
        }

        protected _handle: number;
        protected _animation: SkeletonAnimation;
        protected _partChildren: Table<LwjsAvatar>;
        protected _geometryOffsets: Table<[string, Float32Array]>;
        private readonly _mounts: Array<[string, Laya.Sprite3D]>;

        constructor() {
            super();
            this._mounts = [];
            this._handle = 0;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._handle != 0) {
                HandlePool.instance.free(this._handle);
                this._handle = 0;
            } else {
                AvatarDataPool.instance.cancel(this.url, this.onResourceComplete);
            }
            super.destroy(destroyChild);
        }

        public get partChildren(): Table<LwjsAvatar> {
            return this._partChildren;
        }

        public bindTo(name: string, child: Laya.Sprite3D): void {
            for (let tuple of this._mounts) {
                if (tuple[1] == child) {
                    tuple[0] = name;
                    return;
                }
            }
            this._mounts.push([name, child]);
            this.addChild(child);

            if (this._geometryOffsets != null) {
                let tuple = this._geometryOffsets[name];
                if (tuple != null) {
                    let maxtrix = child.transform.localMatrix;
                    maxtrix.elements.set(tuple[1]);
                    child.transform.localMatrix = maxtrix;
                }
            }
        }

        public unbindTo(child: Laya.Sprite3D): void {
            for (let i = 0, size = this._mounts.length; i < size; ++i) {
                let tuple = this._mounts[i];
                if (tuple[1] == child) {
                    ArrayUtils.removeAt(this._mounts, i);
                    this.removeChild(child);
                    return;
                }
            }
        }

        public unbindAll(): void {
            for (let i = 0, size = this._mounts.length; i < size; ++i) {
                this.removeChild(this._mounts[i][1]);
            }
            this._mounts.length = 0;
        }

        public get animation(): SkeletonAnimation {
            return this._animation;
        }

        private onResourceComplete = (url: string, handle: number, res: AvatarData): void => {
            if (handle == 0) {
                if (DEBUG) {
                    throw new Error(`不存在的模型：${url}`);
                } else {
                    return;
                }
            }

            HandlePool.instance.lock(handle);
            this._handle = handle;
            let config = res.config;
            let cache = res.res;
            this.parseCustomProps(config, "main", cache);

            let children = config.children;
            if (children != null) {
                for (let i = 0, length = children.length; i < length; ++i) {
                    let element = children[i];
                    let child = new LwjsAvatar();
                    child._loaded = true;
                    // child.event(Laya.Event.HIERARCHY_LOADED, child);
                    child.parseCustomProps(element, element.name, cache);
                    this.bindTo(element.parent[1], child);
                    this._partChildren[element.name] = child;
                }
            }

            if (this._animation) {
                this._animation.mounts = this._mounts;
            }
            this.active = true;
            this._loaded = true;
            this.event(Laya.Event.HIERARCHY_LOADED, this);
        };

        private parseCustomProps(config: MeshElement, part: string, res: Table<any>) {
            this.name = config.name;
            let mesh: MeshData = res[config.geometry[0][0]];
            let geometry: GeometryMesh;
            let material: base.materials.CustomMaterial;
            if (mesh.skeleton == null) {
                geometry = new GeometryMesh(mesh.vb[0], mesh.ib[0]);
                material = new base.materials.AvatarMaterial();
            } else {
                let skinnedGeometry = new SkinnedGeometryMesh(mesh.vb[0], mesh.ib[0], mesh.skeleton.boneParentIndexs.length);
                material = new base.materials.AvatarSkinnedMaterial();
                this._animation = new SkeletonAnimation(mesh, skinnedGeometry);
                geometry = skinnedGeometry;
            }
            this._geometryOffsets = mesh.geometryOffsets;
            if (this._geometryOffsets != null) {
                for (let mount of this._mounts) {
                    let tuple = this._geometryOffsets[mount[0]];
                    if (tuple != null) {
                        let maxtrix = mount[1].transform.localMatrix;
                        maxtrix.elements.set(tuple[1]);
                        mount[1].transform.localMatrix = maxtrix;
                    }
                }
            }

            let textureUrl = config.geometry[0][2][0];
            material.diffuseTexture = base.textures.LayaTexture2D.load(textureUrl);
            material.cull = Laya.BaseMaterial.CULL_FRONT;
            this.meshRender.sharedMaterials = [material];
            this.meshFilter.sharedMesh = geometry;


            let group = config.group;
            for (let name in group) {
                let partGroup = group[name];
                if (partGroup) {
                    let action = partGroup[part];
                    if (action) {
                        this._animation.addClip(name, res[action[0][0]]);
                    }
                }
            }
        }
    }
}

// namespace base.mesh {
//     import HandlePool = base.assets.HandlePool;
//     import AvatarMaterial = base.materials.AvatarMaterial;
//     import AvatarSkinnedMaterial = base.materials.AvatarSkinnedMaterial;
//     import CustomMaterial = base.materials.CustomMaterial;
//     import LayaTexture2D = base.textures.LayaTexture2D;
//     import BaseMaterial = Laya.BaseMaterial;
//     import MeshSprite3D = Laya.MeshSprite3D;
//     import Sprite3D = Laya.Sprite3D;
//     import DDSTexture2D = textures.DDSTexture2D;
//
//     type GeometryElement = [string, string, [string, string, boolean, boolean, number]];
//
//     interface JsonElement {
//         name: string;
//         geometry?: Array<GeometryElement>;
//         skeleton?: [string, string];
//     }
//
//     interface ChildrenElement extends JsonElement {
//         parent?: [string, string];
//     }
//
//     interface MeshElement extends JsonElement {
//         children?: Array<ChildrenElement>;
//         group?: Table<Table<Array<[string, string]>>>;
//     }
//
//     export class LwjsAvatar extends MeshSprite3D {
//         public static entityPack: Table<MeshElement>;
//
//         public static load(url: string): LwjsAvatar {
//             let av = new LwjsAvatar();
//             av.active = false;
//             av._loaded = false;
//             if (LwjsAvatar.entityPack[url] == null) {
//                 throw new Error(`不存在的模型：${url}`);
//             }
//             av.parseMeshELement(LwjsAvatar.entityPack[url]);
//             return av;
//         }
//
//         protected _handles: Array<number>;
//         protected _animation: SkeletonAnimation;
//         protected _partChildren: Table<LwjsAvatar>;
//         protected _waitCounter: number = 0;
//         protected _actionSet: Table<Array<string>>;
//         protected _geometryOffsets: Table<[string, Float32Array]>;
//         private readonly _mounts: Array<[string, Sprite3D]>;
//         private _urls: Table<any>;
//
//         constructor() {
//             super();
//             this._mounts = [];
//             this._handles = [];
//             this._urls = {};
//         }
//
//         public destroy(destroyChild: boolean = true): void {
//             if (this._urls) {
//                 for (let url in this._urls) {
//                     let callback = this._urls[url];
//                     if (StringUtils.endsWith(url, ".mbd")) {
//                         MeshDataPool.instance.cancel(url, callback);
//                     } else if (StringUtils.endsWith(url, ".abd")) {
//                         AnimationDataPool.instance.cancel(url, callback);
//                     }
//                 }
//                 this._urls = null;
//             }
//
//             if (this._handles != null) {
//                 for (let handle of this._handles) {
//                     HandlePool.instance.free(handle);
//                 }
//                 this._handles = null;
//             }
//
//             super.destroy(destroyChild);
//         }
//
//         public get partChildren(): Table<LwjsAvatar> {
//             return this._partChildren;
//         }
//
//         public bindTo(name: string, child: Sprite3D): void {
//             for (let tuple of this._mounts) {
//                 if (tuple[1] == child) {
//                     tuple[0] = name;
//                     return;
//                 }
//             }
//             this._mounts.push([name, child]);
//             this.addChild(child);
//
//             if (this._geometryOffsets != null) {
//                 let tuple = this._geometryOffsets[name];
//                 if (tuple != null) {
//                     let maxtrix = child.transform.localMatrix;
//                     maxtrix.elements.set(tuple[1]);
//                     child.transform.localMatrix = maxtrix;
//                 }
//             }
//         }
//
//         public unbindTo(child: Sprite3D): void {
//             for (let i = 0, size = this._mounts.length; i < size; ++i) {
//                 let tuple = this._mounts[i];
//                 if (tuple[1] == child) {
//                     ArrayUtils.removeAt(this._mounts, i);
//                     this.removeChild(child);
//                     return;
//                 }
//             }
//         }
//
//         public unbindAll(): void {
//             for (let i = 0, size = this._mounts.length; i < size; ++i) {
//                 this.removeChild(this._mounts[i][1]);
//             }
//             this._mounts.length = 0;
//         }
//
//         public get animation(): SkeletonAnimation {
//             return this._animation;
//         }
//
//         protected parseMeshELement(element: MeshElement): void {
//             this.name = element.name;
//             this._waitCounter = 1;
//             let url = element.geometry[0][0];
//             let callback = (url: string, handle: number, res: any): void => {
//                 if (handle == 0) {
//                     if (DEBUG) {
//                         throw new Error(`模型文件${url}不存在。`);
//                     } else {
//                         return;
//                     }
//                 }
//                 delete this._urls[url];
//                 this.onGeometryComplete(element, "main", null, handle, res);
//             };
//             this._urls[url] = callback;
//             MeshDataPool.instance.load(url, callback);
//         }
//
//         protected onParentLoaded(url: string, element: ChildrenElement, params: Array<[string, string]>): void {
//             this.name = element.name;
//             this._waitCounter = 1;
//             url = element.geometry[0][0];
//             let callback = (url: string, handle: number, res: any): void => {
//                 if (handle == 0) {
//                     if (DEBUG) {
//                         throw new Error(`模型文件${url}不存在。`);
//                     } else {
//                         return;
//                     }
//                 }
//                 delete this._urls[url];
//                 this.onGeometryComplete(element, this.name, params, handle, res);
//             };
//             this._urls[url] = callback;
//             MeshDataPool.instance.load(url, callback);
//         }
//
//         protected checkComplete(): void {
//             if (--this._waitCounter > 0) {
//                 return;
//             }
//
//             if (this._destroyed) {
//                 return;
//             }
//
//             if (this._animation) {
//                 this._animation.mounts = this._mounts;
//             }
//             this.active = true;
//             this._loaded = true;
//             this.event(Laya.Event.HIERARCHY_LOADED, this);
//         }
//
//         protected onGeometryComplete(element: MeshElement, alias: string, actions: Array<[string, string]>, handle: number, mesh: MeshData): void {
//             if (this._destroyed) {
//                 return;
//             }
//
//             HandlePool.instance.lock(handle);
//             this._handles.push(handle);
//
//             let geometry: GeometryMesh;
//             let material: CustomMaterial;
//             if (mesh.skeleton == null) {
//                 geometry = new GeometryMesh(mesh.vb[0], mesh.ib[0]);
//                 material = new AvatarMaterial();
//             } else {
//                 let skinnedGeometry = new SkinnedGeometryMesh(mesh.vb[0], mesh.ib[0], mesh.skeleton.boneParentIndexs.length);
//                 material = new AvatarSkinnedMaterial();
//                 this._animation = new SkeletonAnimation(mesh, skinnedGeometry);
//                 geometry = skinnedGeometry;
//             }
//             this._geometryOffsets = mesh.geometryOffsets;
//             if (this._geometryOffsets != null) {
//                 for (let mount of this._mounts) {
//                     let tuple = this._geometryOffsets[mount[0]];
//                     if (tuple != null) {
//                         let maxtrix = mount[1].transform.localMatrix;
//                         maxtrix.elements.set(tuple[1]);
//                         mount[1].transform.localMatrix = maxtrix;
//                     }
//                 }
//             }
//
//             let textureUrl = element.geometry[0][2][0];
//             if (textureUrl.lastIndexOf(".dds") != -1) {
//                 material.diffuseTexture = DDSTexture2D.load(textureUrl);
//             } else if (textureUrl.lastIndexOf(".jpg") != -1) {
//                 material.diffuseTexture = LayaTexture2D.load(textureUrl);
//             } else if (textureUrl.lastIndexOf(".png") != -1) {
//                 material.diffuseTexture = LayaTexture2D.load(textureUrl);
//             }
//             material.cull = BaseMaterial.CULL_FRONT;
//             this.meshRender.sharedMaterials = [material];
//             this.meshFilter.sharedMesh = geometry;
//
//             let group = element.group;
//             let partGroup: Table<Array<[string, string]>> = {};
//             if (mesh.skeleton != null && group != null) {
//                 this._actionSet = {};
//                 for (let name in group) {
//                     let obj = group[name];
//                     let actions = this._actionSet[name] = new Array<string>();
//                     for (let alias in obj) {
//                         if (alias === "main") {
//                             this._waitCounter++;
//                             let url = obj[alias][0][0];
//                             let callback = (url: string, handle: number, res: AnimationData): void => {
//                                 if (handle == 0) {
//                                     if (DEBUG) {
//                                         throw new Error(`动作文件${url}不存在。`);
//                                     } else {
//                                         return;
//                                     }
//                                 }
//
//                                 if (this._destroyed) {
//                                     return;
//                                 }
//                                 delete this._urls[url];
//                                 HandlePool.instance.lock(handle);
//                                 this._handles.push(handle);
//                                 if (mesh.skeleton.boneParentIndexs.length != (res.numJoints)) {
//                                     throw new Error(`${url}骨骼数量对不上, ${mesh.skeleton.boneParentIndexs.length}:${res.numJoints}`);
//                                 }
//                                 this._animation.addClip(name, res);
//                                 this.checkComplete();
//                             };
//                             this._urls[url] = callback;
//                             AnimationDataPool.instance.load(url, callback);
//                         } else {
//                             if (partGroup[alias]) {
//                                 partGroup[alias].push([name, obj[alias][0][0]]);
//                             } else {
//                                 partGroup[alias] = [[name, obj[alias][0][0]]];
//                             }
//                             actions.push(alias);
//                         }
//                     }
//                 }
//             } else if (actions != null) {
//                 for (let i = 0; i < actions.length; ++i) {
//                     this._waitCounter++;
//                     let name = actions[i][0];
//                     let url = actions[i][1];
//                     let callback = (url: string, handle: number, res: AnimationData): void => {
//                         if (handle == 0) {
//                             if (DEBUG) {
//                                 throw new Error(`动作文件${url}不存在。`);
//                             } else {
//                                 return;
//                             }
//                         }
//
//                         if (this._destroyed) {
//                             return;
//                         }
//                         delete this._urls[url];
//                         HandlePool.instance.lock(handle);
//                         this._handles.push(handle);
//                         this._animation.addClip(name, res);
//                         this.checkComplete();
//                     };
//                     this._urls[url] = callback;
//                     AnimationDataPool.instance.load(url, callback);
//                 }
//             }
//
//             let children = element.children;
//             if (children != null) {
//                 this._partChildren = {};
//                 let length = children.length;
//                 for (let i = 0; i < length; ++i) {
//                     ++this._waitCounter;
//                     let child = new LwjsAvatar();
//                     child._loaded = false;
//                     child.onParentLoaded(this.url, children[i], partGroup[children[i].name]);
//                     child.once(Laya.Event.HIERARCHY_LOADED, this, this.checkComplete);
//                     this.bindTo(children[i].parent[1], child);
//                     this._partChildren[children[i].name] = child;
//                 }
//             }
//
//             this.checkComplete();
//         }
//     }
// }
