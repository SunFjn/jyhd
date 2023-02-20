///<reference path="../assets/asset_pool_base.ts"/>
///<reference path="lwjs_avatar_parser.ts"/>

namespace base.mesh {
    import Unit = utils.Unit;

    interface AvatarDependency {
        loading: utils.collections.Set<string>;
        onComplete: (url: string, handle: number, res: any) => void;
        cache: Table<number>;
    }

    export class AvatarDataPool extends base.assets.AssetPoolBase {
        private static _instance: AvatarDataPool = new AvatarDataPool();

        public static get instance(): AvatarDataPool {
            return AvatarDataPool._instance;
        }

        public entityPack: Table<MeshElement>;

        protected constructor() {
            super("AvatarDataPool", 10 * Unit.MB);
        }

        public load(url: string, callback: (url: string, handle: number, res: AvatarData) => void): void {
            let entry = this.checkNeedLoad(url, callback, false);
            if (entry == null) {
                return;
            }

            if (entry.status == 0) {
                let config = this.entityPack[url];
                if (!config) {
                    this.onComplete(url, null, 0);
                    return;
                }

                this.initEntryArgs(entry, config);
                entry.status = 1;
            }
        }

        private initEntryArgs(entry: base.assets.AssetEntry, config: MeshElement) {
            let callback = (url: string, handle: number, res: any): void => {
                let args: AvatarDependency = entry.args;
                if (handle == 0) {
                    this.clearLoading(args);
                    this.onComplete(entry.url, null, 0);
                } else {
                    args.loading.del(url);
                    entry.assets.push(handle);
                    args.cache[url] = this._handlePool.lock(handle);
                    if (args.loading.isEmpty()) {
                        this.onResourceComplete(entry.url);
                    }
                }
            };

            let args: AvatarDependency = {
                loading: new utils.collections.Set<string>(),
                onComplete: callback,
                cache: {}
            };

            let path = config.geometry[0][0];
            MeshDataPool.instance.load(path, callback);
            args.loading.add(path);

            let group = config.group;
            if (group) {
                for (let name in group) {
                    let partGroup = group[name];
                    for (let alias in partGroup) {
                        let actions = partGroup[alias];
                        for (let action of actions) {
                            AnimationDataPool.instance.load(action[0], callback);
                            args.loading.add(action[0]);
                        }
                    }
                }
            }

            let children = config.children;
            if (children) {
                for (let element of children) {
                    let path = element.geometry[0][0];
                    MeshDataPool.instance.load(path, callback);
                    args.loading.add(path);
                }
            }

            entry.args = args;
        }

        private clearLoading(args: AvatarDependency) {
            for (let url of args.loading.values) {
                if (StringUtils.endsWith(url, ".mbd")) {
                    MeshDataPool.instance.cancel(url, args.onComplete);
                } else if (StringUtils.endsWith(url, ".abd")) {
                    AnimationDataPool.instance.cancel(url, args.onComplete);
                }
            }
            args.loading.clear();
        }

        public cancel(url: string, callback: (url: string, handle: number, res: AvatarData) => void): void {
            let entry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            this.clearLoading(entry.args);
            delete this._waitPool[url];
            base.assets.AssetEntry.freeEntry(entry);
        }

        private onResourceComplete(url: string): void {
            let entry = this._waitPool[url];
            let args: AvatarDependency = entry.args;
            this.onComplete(url, {
                config: this.entityPack[url],
                res: args.cache
            }, 1);
        }
    }
}
