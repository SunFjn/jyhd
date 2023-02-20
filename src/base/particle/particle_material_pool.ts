///<reference path="../assets/asset_pool_base.ts"/>
///<reference path="../textures/lwjs_texture_2d.ts"/>
///<reference path="snowflake/snowflake_particle_material.ts"/>

namespace base.mesh {
    import AssetEntry = base.assets.AssetEntry;
    import AssetPoolBase = base.assets.AssetPoolBase;
    import SnowflakeParticleMaterial = base.particle.snowflake.SnowflakeParticleMaterial;
    import LayaTexture2D = base.textures.LayaTexture2D;

    export class ParticleMaterialPool extends AssetPoolBase {
        private static _instance = new ParticleMaterialPool();

        public static get instance(): ParticleMaterialPool {
            return ParticleMaterialPool._instance;
        }

        private _textureCache: Table<number>;

        protected constructor() {
            super("ParticleMaterialPool", 10);
            this._textureCache = {};
        }

        public load(url: string, callback: (url: string, handle: number, res: SnowflakeParticleMaterial) => void): void {
            let entry: AssetEntry = this.checkNeedLoad(url, callback, false);
            if (entry == null) {
                return;
            }

            if (entry.status == 0) {
                entry.status = 1;
                let data = Laya.Loader.preLoadedMap[url];
                if (data) {
                    this.onMaterilLmatLoaded(url, data);
                } else {
                    ResourcePool.instance.load(url, this.onConfigComplete, 60);
                }
            }
        }

        private onConfigComplete = (url: string, handle: number, res: ArrayBuffer): void => {
            let bytes = new Laya.Byte(res);
            let data = JSON.parse(bytes.readUTFBytes());
            Laya.Loader.preLoadedMap[url] = data;
            this.onMaterilLmatLoaded(url, data);
        };

        private onMaterilLmatLoaded(url: string, res: any): void {
            let entry = this._waitPool[url];
            let materialBasePath = Laya.URL.getPath(url);
            let urls: Array<any> = [];
            let urlMap: Table<string> = {};
            let customProps = res.customProps;
            let formatSubUrl;
            let version = res.version;
            if (version) {
                switch (version) {
                    case "LAYAMATERIAL:01":
                    case "LAYAMATERIAL:02":
                        let textures = res.props.textures;
                        if (textures) {
                            for (let i = 0, n = textures.length; i < n; i++) {
                                let tex = textures[i];
                                let path = tex.path;
                                if (path) {
                                    let extenIndex = path.length - 4;
                                    if (path.indexOf(".exr") == extenIndex || path.indexOf(".EXR") == extenIndex)
                                        path = path.substr(0, extenIndex) + ".png";
                                    formatSubUrl = Laya3D.formatRelativePath(materialBasePath, path);
                                    urls.push({url: formatSubUrl, params: tex.params});
                                    urlMap[path] = formatSubUrl;
                                }
                            }
                        }
                        break;
                    default :
                        throw new Error("Laya3D:unkonwn version.");
                }
            } else {
                let diffuseTexture = customProps.diffuseTexture.texture2D;
                if (diffuseTexture) {
                    formatSubUrl = Laya3D._getMaterialTexturePath(diffuseTexture, null, materialBasePath);
                    urls.push(formatSubUrl);
                    urlMap[diffuseTexture] = formatSubUrl;
                }
                if (customProps.normalTexture) {
                    let normalTexture = customProps.normalTexture.texture2D;
                    if (normalTexture) {
                        formatSubUrl = Laya3D._getMaterialTexturePath(normalTexture, null, materialBasePath);
                        urls.push(formatSubUrl);
                        urlMap[normalTexture] = formatSubUrl;
                    }
                }
                if (customProps.specularTexture) {
                    let specularTexture = customProps.specularTexture.texture2D;
                    if (specularTexture) {
                        formatSubUrl = Laya3D._getMaterialTexturePath(specularTexture, null, materialBasePath);
                        urls.push(formatSubUrl);
                        urlMap[specularTexture] = formatSubUrl;
                    }
                }
                if (customProps.emissiveTexture) {
                    let emissiveTexture = customProps.emissiveTexture.texture2D;
                    if (emissiveTexture) {
                        formatSubUrl = Laya3D._getMaterialTexturePath(emissiveTexture, null, materialBasePath);
                        urls.push(formatSubUrl);
                        urlMap[emissiveTexture] = formatSubUrl;
                    }
                }
                if (customProps.ambientTexture) {
                    let ambientTexture = customProps.ambientTexture.texture2D;
                    if (ambientTexture) {
                        formatSubUrl = Laya3D._getMaterialTexturePath(ambientTexture, null, materialBasePath);
                        urls.push(formatSubUrl);
                        urlMap[ambientTexture] = formatSubUrl;
                    }
                }
                if (customProps.reflectTexture) {
                    let reflectTexture = customProps.reflectTexture.texture2D;
                    if (reflectTexture) {
                        formatSubUrl = Laya3D._getMaterialTexturePath(reflectTexture, null, materialBasePath);
                        urls.push(formatSubUrl);
                        urlMap[reflectTexture] = formatSubUrl;
                    }
                }
            }

            for (let info of urls) {
                let params = null;
                let url = info;
                if (typeof info != "string") {
                    url = info.url;
                    params = info.params;
                }

                let handle = this._textureCache[url];
                if (handle == 0 || handle == null) {
                    let texture = LayaTexture2D.load(url, 600, params);
                    texture._addReference();
                    this._textureCache[url] = handle = this._handlePool.alloc(url, texture, this.onTextureDestroy);
                } else {
                    this._handlePool.lock(handle);
                }
                entry.assets.push(handle);
            }
            let material = new SnowflakeParticleMaterial();
            material.onAsynLoaded(url, [res, urlMap], null);
            material._setUrl(url);
            Laya.loader.cacheRes(url, material);
            this.onResourceComplete(url, material);
        }

        protected onTextureDestroy = (url: string, res: any): void => {
            delete this._textureCache[url];
            res._removeReference();
        };

        public cancel(url: string, callback: (url: string, handle: number, res: SnowflakeParticleMaterial) => void): void {
            let entry: AssetEntry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            ResourcePool.instance.cancel(url, this.onConfigComplete);
            delete this._waitPool[url];
            AssetEntry.freeEntry(entry);
        }

        protected doRecover = (entry: AssetEntry): void => {
            let res: SnowflakeParticleMaterial = entry.res;
            res.destroy();
        };

        private onResourceComplete = (url: string, res: SnowflakeParticleMaterial): void => {
            if (res == null) {
                this.onComplete(url, null, 0);
            } else {
                this.onComplete(url, res, 1);
            }
        };
    }
}
