///<reference path="snowflake/snowflake_particle_bundle.ts"/>

/**
 * 暂定待删除 22-12-17
 */
namespace base.particle {
    import SnowflakeParticleBundle = base.particle.snowflake.SnowflakeParticleBundle;
    import HeapElement = utils.collections.HeapElement;
    import Heap = utils.collections.Heap;

    interface CacheEntry extends HeapElement {
        url: string;
        timeout: number;
        bundles: Array<SnowflakeParticleBundle>;
    }

    export class ParticlePool {
        private static _instance: ParticlePool;

        public static get instance(): ParticlePool {
            if (this._instance == null) {
                this._instance = new ParticlePool();
            }
            return this._instance;
        }

        private readonly _cache: Table<CacheEntry>;
        private readonly _cacheQueue: Heap<CacheEntry>;
        private readonly _cacheTime: number;

        private constructor() {
            this._cache = {};
            this._cacheTime = 60 * 1000;
            this._cacheQueue = new Heap<CacheEntry>(
                function (l: CacheEntry, r: CacheEntry) {
                    return l.timeout < r.timeout;
                });
            Laya.timer.loop(1000, this, this.doRecover);
        }

        private doRecover(): void {
            let now = Date.now();
            while (!this._cacheQueue.isEmtry()) {
                let e = this._cacheQueue.top;
                if (e.timeout > now) {
                    break;
                }
                this._cacheQueue.pop();
                delete this._cache[e.url];
                for (let bundle of e.bundles) {
                    bundle.dispose();
                }
            }
        }

        public loadParticle(url: string): SnowflakeParticleBundle {
            // 禁用该功能 全改为2d
            console.log("banned load particle:", url);
            return null;
            // let entry = this._cache[url];
            // if (entry != null && entry.bundles.length != 0) {
            //     entry.timeout = Date.now() + this._cacheTime;
            //     this._cacheQueue.updateElement(entry);
            //     let result = entry.bundles.pop();
            //     let matrix = result.transform.localMatrix;
            //     matrix.identity();
            //     result.transform.localMatrix = matrix;
            //     matrix = result.transform.worldMatrix;
            //     matrix.identity();
            //     result.transform.worldMatrix = matrix;
            //     return result;

            // }
            // return SnowflakeParticleBundle.load(url);
        }

        public destoryParticle(bundle: SnowflakeParticleBundle): void {
            let url = bundle.url;
            let entry = this._cache[url];
            if (entry == null) {
                this._cache[url] = entry = {
                    url: url,
                    pointer: 0,
                    timeout: Date.now() + this._cacheTime,
                    bundles: [bundle]
                };
                this._cacheQueue.push(entry);
            } else {
                entry.timeout = Date.now() + this._cacheTime;
                this._cacheQueue.updateElement(entry);
                entry.bundles.push(bundle);
            }
        }
    }
}