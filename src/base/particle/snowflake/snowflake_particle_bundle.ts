///<reference path="../particle_material_pool.ts"/>
///<reference path="../particle_mesh_pool.ts"/>

namespace base.particle.snowflake {
    import Matrix4x4 = Laya.Matrix4x4;
    import Quaternion = Laya.Quaternion;
    import Sprite3D = Laya.Sprite3D;
    import Vector3 = Laya.Vector3;
    import ParticleMaterialPool = base.mesh.ParticleMaterialPool;
    import HandlePool = base.assets.HandlePool;
    import ParticleMeshPool = base.mesh.ParticleMeshPool;

    const enum PlayStatus {
        Playing = 0,
        Stopped = 1,
        Paused = 2
    }

    interface BundleEntry {
        counter: number;
        elements: Array<[Matrix4x4, SnowflakeBundle]>;
        innerResouMap: Table<string>;
    }

    export class SnowflakeParticleBundle extends Sprite3D {
        public static config: Table<SnowflakeBundle> = {};
        private _status: PlayStatus;
        private _assets: Array<number>;
        private _entry: BundleEntry;

        public static load(url: string): SnowflakeParticleBundle {
            let result = new SnowflakeParticleBundle();
            result._loaded = false;
            result._setUrl(url);

            let config = SnowflakeParticleBundle.config[url];
            if (config != null) {
                result.parseConfig(config);
            } else {
                ResourcePool.instance.load(url, result.onResourceComplete);
            }
            return result;
        }

        constructor() {
            super();
            this._assets = [];
        }

        get status(): PlayStatus {
            return this._status;
        }

        public play(): void {
            this._status = PlayStatus.Playing;
        }

        public stop(): void {
            this._status = PlayStatus.Stopped;
        }

        public pause(): void {
            this._status = PlayStatus.Paused
        }

        public resume(): void {
            this._status = PlayStatus.Playing;
        }

        private parseConfig(config: SnowflakeBundle): void {
            let elements: Array<[Matrix4x4, SnowflakeBundle]> = [];
            if (config.type == SnowflakeBundleType.Sprite3D) {
                if (config.props) {
                    this.isStatic = config.props.isStatic;
                    this.name = config.props.name;
                } else {
                    this.isStatic = false;
                    this.name = this.url;
                }
                for (let child of config.child) {
                    this.combineMatrix(null, child, elements);
                }
            }

            this.loadDependency(elements);
        };

        private onResourceComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            let config: SnowflakeBundle = JSON.parse((new Laya.Byte(buffer)).readUTFBytes());
            this.parseConfig(config);
        };

        private loadDependency(elements: Array<[Matrix4x4, SnowflakeBundle]>): void {
            this._entry = {
                counter: 0,
                elements: elements,
                innerResouMap: {}
            };

            let innerResouMap: Table<string> = this._entry.innerResouMap;
            let path, url;
            let root = "assets/particle/";

            let counter = 0;
            for (let element of elements) {
                let customProps = element[1].customProps;

                if (customProps.material) {
                    path = customProps.material.path;
                    url = root + path;
                    if (innerResouMap[path] == null) {
                        innerResouMap[path] = url;
                        ++counter;
                        ParticleMaterialPool.instance.load(url, this.onBundleComplete);
                    }
                }

                if (customProps.materialPath) {
                    path = customProps.materialPath;
                    url = root + path;
                    if (innerResouMap[path] == null) {
                        innerResouMap[path] = url;
                        ++counter;
                        ParticleMaterialPool.instance.load(url, this.onBundleComplete);
                    }
                }

                if (customProps.texturePath) {
                    path = customProps.texturePath;
                    url = root + path;
                    if (innerResouMap[path] == null) {
                        innerResouMap[path] = url;
                        ++counter;
                        ParticleMaterialPool.instance.load(url, this.onBundleComplete);
                    }
                }

                if (customProps.meshPath) {
                    path = customProps.meshPath;
                    url = root + path;
                    if (innerResouMap[path] == null) {
                        innerResouMap[path] = url;
                        ++counter;
                        ParticleMeshPool.instance.load(url, this.onBundleComplete);
                    }
                }
            }
            this._entry.counter = counter;
        }

        private onBundleComplete = (url: string, handle: number, res: any): void => {
            if (!this._entry) {
                return;
            }

            HandlePool.instance.lock(handle);
            this._assets.push(handle);

            if (--this._entry.counter > 0) {
                return;
            }

            let elements = this._entry.elements;
            let innerResouMap = this._entry.innerResouMap;
            for (let i = 0, length = elements.length; i < length; ++i) {
                let element = elements[i];
                let node = new SnowflakeParticle3D();
                node.name = element[1].props ? element[1].props.name : `${this.name}#${i}`;
                node.init(element[0], innerResouMap, element[1]);
                this.addChild(node);
            }
            this._entry = null;
            this._loaded = true;
            this.event(Laya.Event.HIERARCHY_LOADED, this);
        };

        private combineMatrix(parent: Matrix4x4, config: SnowflakeBundle, result: Array<any>): void {
            let matrix = this.extractMatrix(config.customProps);
            if (parent != null) {
                Matrix4x4.multiply(parent, matrix, matrix);
            }

            if (config.type == SnowflakeBundleType.MyShuriKenParticle3D || config.type == null) {
                result.push([matrix, config]);
            }

            if (config.child) {
                for (let child of config.child) {
                    this.combineMatrix(matrix, child, result);
                }
            }
        }

        private extractMatrix(props: SnowflakeCustomProps): Matrix4x4 {
            let matrix = new Matrix4x4();
            if (props) {
                let translate = new Vector3(0, 0, 0);
                let rotation = new Quaternion(0, 0, 0, 1);
                let scale = new Vector3(1, 1, 1);

                if (props.translate) {
                    translate.elements.set(props.translate);
                    let elements = translate.elements;
                    elements[0] *= 100;
                    elements[1] *= 100;
                    elements[2] *= 100;
                }

                if (props.rotation) {
                    rotation.elements.set(props.rotation);
                }

                if (props.scale) {
                    scale.elements.set(props.scale);
                }

                Matrix4x4.createAffineTransformation(translate, rotation, scale, matrix);
            } else {
                matrix.identity();
            }

            return matrix;
        }

        public destroy(destroyChild?: boolean): void {
            this.removeSelf();
            this.offAll();
            this.timer.clearAll(this);
            ParticlePool.instance.destoryParticle(this);
        }

        public dispose(): void {
            if (this._entry != null) {
                let innerResouMap = this._entry.innerResouMap;
                for (let key in innerResouMap) {
                    let url = innerResouMap[key];
                    if (StringUtils.endsWith(url, ".lmat")) {
                        ParticleMaterialPool.instance.cancel(url, this.onBundleComplete);
                    } else if (StringUtils.endsWith(url, ".lm")) {
                        ParticleMeshPool.instance.cancel(url, this.onBundleComplete);
                    }
                }
                this._entry = null;
            } else if (!this.loaded) {
                ResourcePool.instance.cancel(this.url, this.onResourceComplete);
            }

            if (this._assets) {
                for (let handle of this._assets) {
                    HandlePool.instance.free(handle);
                }
                this._assets = null;
            }
            super.destroy(true);
        }
    }
}