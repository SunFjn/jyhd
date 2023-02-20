namespace base.materials {
    export class MaterialInitializer {
        private static _step: number = 0;
        private static _callbacks: Array<Function> = [];
        private static _declareShaders: Table<[string, Table<number>, Table<[number, number]>]> = {};

        public static declareShader(name: string, attributeMap: Table<number>, uniformMap: Table<[number, number]>): void {
            let path = `res/shader/${name}`;
            MaterialInitializer._declareShaders[path] = [name, attributeMap, uniformMap];
        }

        public static setup(callback?: Function): void {
            switch (this._step) {
                case 0: {
                    MaterialInitializer._step = 1;
                    if (callback != null) {
                        MaterialInitializer._callbacks.push(callback);
                    }

                    let counter = 0;
                    let cache: Table<string> = {};

                    let onComplete = (url: string, handle: number, buffer: ArrayBuffer) => {
                        --counter;
                        if (buffer != null) {
                            let bytes = new Laya.Byte(buffer);
                            cache[url] = bytes.readUTFBytes();
                        }

                        if (counter > 0) {
                            return;
                        }
                        MaterialInitializer._step = 2;
                        let declareShaders = MaterialInitializer._declareShaders;
                        for (let path in declareShaders) {
                            let args = declareShaders[path];
                            Laya.ShaderCompile3D.add(
                                Laya.Shader3D.nameKey.add(args[0]),
                                cache[`${path}.vert`],
                                cache[`${path}.frag`],
                                args[1],
                                args[2]);
                        }

                        for (let callback of MaterialInitializer._callbacks) {
                            callback();
                        }
                        MaterialInitializer._declareShaders = null;
                        MaterialInitializer._callbacks.length = 0;
                    };

                    // 加载Shader资源
                    for (let path in MaterialInitializer._declareShaders) {
                        counter += 2;
                        ResourcePool.instance.load(`${path}.vert`, onComplete);
                        ResourcePool.instance.load(`${path}.frag`, onComplete);
                    }
                    break;
                }
                case 1: {
                    if (callback != null) {
                        MaterialInitializer._callbacks.push(callback);
                    }
                    break;
                }
                case 2: {
                    if (callback != null) {
                        callback();
                    }
                    break;
                }
            }
        }
    }
}