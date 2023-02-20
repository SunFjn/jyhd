///<reference path="../../base/materials/unlit_material.ts"/>
///<reference path="../../base/textures/lwjs_texture_2d.ts"/>
///<reference path="../misc/view_bounds.ts"/>
///<reference path="map_utils.ts"/>
///<reference path="../../base/mesh/tile_atlas_mesh.ts"/>
///<reference path="../../modules/config/scene_cfg.ts"/>
///<reference path="../../utils/math_utils.ts"/>
///<reference path="../../base/textures/texture_pool.ts"/>
///<reference path="../../utils/collections/list.ts"/>


namespace game.map {
    import scene = Configuration.scene;
    import sceneFields = Configuration.sceneFields;
    import MapPathFields = Configuration.MapPathFields;
    import LayaEvent = modules.common.LayaEvent;
    import LayaTexture2D = base.textures.LayaTexture2D;
    import TexturePool = base.textures.TexturePool;
    import HandlePool = base.assets.HandlePool;
    import SceneModel = modules.scene.SceneModel;
    import SceneUtil = modules.scene.SceneUtil;

    class TileEntry {
        private static _freeEntry: utils.collections.List<TileEntry> = new utils.collections.List<TileEntry>();
        private static _handlePool: base.assets.HandlePool = base.assets.HandlePool.instance;
        public url: string;
        public handle: number;
        public index: number;
        public texture: Laya.BaseTexture;

        public static allocEntry(): TileEntry {
            let result = this._freeEntry.shift() || new TileEntry();
            result.handle = 0;
            return result;
        }

        public static freeEntry(entry: TileEntry): void {
            entry.url = "";
            TileEntry._handlePool.free(entry.handle);
            entry.handle = 0;
            entry.texture = null;
            this._freeEntry.unshift(entry);
        }
    }

    export class MapSpriteLayer extends Laya.Sprite3D {
        private _mapId: number;
        private _single: boolean;
        private _width: number;
        private _height: number;
        private _splitWidth: number;
        private _splitHeight: number;
        private _rows: number;
        private _cols: number;
        private _viewBounds: misc.ViewBounds;
        private _backgroundBounds: misc.ViewBounds;
        private _viewArea: Laya.Rectangle;
        private _tilePath: string;
        private _backgroundPath: string;
        private readonly _visualBlocks: Array<Laya.MeshSprite3D>;
        private readonly _visualBackgroundBlocks: Array<Laya.MeshSprite3D>;
        private readonly _backgroundLayer: Laya.Sprite3D;
        private readonly _tileMesh: base.mesh.TileAtlasMesh;
        private readonly _bgTileMesh: base.mesh.TileAtlasMesh;
        private _target: Laya.Transform3D;
        private readonly _bgTransform3D: Laya.Transform3D;
        private _flags: Uint8Array;
        private readonly _offsetMatrix4x4: Laya.Matrix4x4;
        private readonly _offsetVector3: Laya.Vector3;
        private readonly _formats: [string, number, string, number, string];
        private _small: Laya.BaseTexture;
        private _group: Table<TileEntry>;

        private _checkCount: number;
        private _totalCount: number;
        private _loadCount: number;
        public static current_map_id: number;
        public static mapClos: number;
        public static hookSceneMapCount: number;

        // private _decorate: Laya.Image;

        constructor(target: Laya.Transform3D, viewport: Laya.Rectangle) {
            super();
            this._viewBounds = new misc.ViewBounds(true);
            this._viewBounds.viewport = viewport;
            this._viewArea = new Laya.Rectangle();
            this._visualBlocks = new Array<Laya.MeshSprite3D>();
            this._backgroundBounds = new misc.ViewBounds(true);
            this._backgroundBounds.viewport = viewport;

            this._visualBackgroundBlocks = new Array<Laya.MeshSprite3D>();
            this._backgroundLayer = new Laya.Sprite3D();
            this._bgTransform3D = this._backgroundLayer.transform;
            this.addChild(this._backgroundLayer);

            this._splitWidth = this._splitHeight = 512;
            //固定资源，不会释放
            this._tileMesh = new base.mesh.TileAtlasMesh(this._splitWidth, this._splitHeight);
            this._tileMesh.lock = true;
            this._bgTileMesh = new base.mesh.TileAtlasMesh(DesignConstant.BackgroundSplitSize, DesignConstant.BackgroundSplitSize);
            this._bgTileMesh.lock = true;

            this._offsetMatrix4x4 = new Laya.Matrix4x4();
            this._offsetVector3 = new Laya.Vector3(0, 0, 0);
            this._formats = ["", 0, "_", 0, ""];
            this._target = target;
            this._checkCount = 0;
            this._loadCount = 0;
            this._mapId = 0;

            this._group = {};

            // this._decorate = new Laya.Image();
        }

        public resize(): void {
            // this._decorate.bottom = 0;
            // this._decorate.centerX = 0;
            // this._decorate.width = CommonConfig.viewWidth;
        }

        public get target(): Laya.Transform3D {
            return this._target;
        }

        public set target(value: Laya.Transform3D) {
            this._target = value;
        }

        public setup(id: number): void {
            // id = 1001;
            let config: scene = modules.config.SceneCfg.instance.getCfgById(id);
            if (config == null) {
                throw new Error(`场景${id}不存在`);
            }
            let res = config[sceneFields.res];
            this._tilePath = "assets/map/" + res + "/main/";
            this._backgroundPath = "assets/map/" + res + "/bg/";
            this._mapId = id;
            MapSpriteLayer.current_map_id = id;
            // 挂机场景计数
            MapSpriteLayer.hookSceneMapCount = 0;
            if (DEBUG) {
                console.log("进入场景：", id);
            }
            // this._decorate.skin = id == 1001 ? "assets/map/decorate/qianjing_01_1.png" : ''
            let url: string = `assets/map/${res}/main/info.bin`;
            let content = MapUtils.configs[res];
            if (content == null) {
                ResourcePool.instance.load(url, this.onConfigComplete, 0, false, false, 1);
            } else {
                this.onConfigComplete(url, 0, content.buffer);
            }
            // GameCenter.instance.world.publish("addToLayer", LayerType.Decorate, this._decorate);
        }

        public close(): void {
            if (this._small) {
                this._small._removeReference();
                this._small = null;
            }
            this.clearLayerTiles(this._visualBackgroundBlocks);
            this.clearLayerTiles(this._visualBlocks);
            for (let url in this._group) {
                let entry = this._group[url];
                if (!entry.handle) {
                    TexturePool.instance.cancel(url, this.onTileComplete);
                }
                TileEntry.freeEntry(entry);
            }
            this._group = {};
            // this._decorate.removeSelf();
        }

        public get viewport(): Laya.Rectangle {
            return this._viewBounds.viewport;
        }

        public set viewport(value: Laya.Rectangle) {
            this._viewBounds.viewport = value;
            this._backgroundBounds.viewport = value;
            if (!this._mapId) {
                return;
            }

            this.updateBackgroundArea();
            this.updateViewArea();
        }

        private onConfigComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            if (buffer == null) {
                throw new Error(`场景文件${url}不存在`);
            }

            this._small = LayaTexture2D.load(`${this._tilePath}small.jpg`);
            this._small._addReference();

            let bytes = new DataView(buffer);

            let offset = 0;
            let id = bytes.getInt16(offset, true);
            offset += 2;
            this._width = bytes.getInt16(offset, true);
            offset += 2;
            this._height = bytes.getInt16(offset, true);
            offset += 2;
            this._splitWidth = bytes.getInt16(offset, true);
            offset += 2;
            this._splitHeight = bytes.getInt16(offset, true);
            offset += 2;
            this._rows = this._height / this._splitHeight;
            this._cols = this._width / this._splitWidth;
            MapSpriteLayer.mapClos = this._cols;
            this._single = false;

            let flags = new Uint8Array(buffer, offset, this._rows * this._cols);
            offset += flags.byteLength;
            this._flags = flags;
            MapUtils.setData(this._mapId, buffer, offset, this._width, this._height);
            this._single = modules.config.MapPathCfg.instance.getCfgById(this._mapId.toString())[MapPathFields.hasBg] != 1;

            this._viewBounds.reset(0, 0, this._width, this._height, this._splitWidth, this._splitHeight);
            this._viewArea.setTo(0, 0, 0, 0);
            this._tileMesh.reset(this._splitWidth, this._splitHeight);

            this._checkCount = 1;
            this._loadCount = 0;
            this._backgroundBounds.reset(0, 0, DesignConstant.BackgroundWidth, DesignConstant.BackgroundHeight, DesignConstant.BackgroundSplitSize, DesignConstant.BackgroundSplitSize);
            if (this._single) {
                this.clearLayerTiles(this._visualBackgroundBlocks);
            }
            this.updateBackgroundArea();

            let coords = ArrayUtils.random(modules.config.SceneCfg.instance.getCfgById(this._mapId)[sceneFields.entryPos]);
            let pos = MapUtils.getRealPosition(coords[0], coords[1]);
            this.update(pos.x, -pos.y, true);

            this._checkCount += this._loadCount;
            this._totalCount = this._checkCount;
            this.checkComplete();
        };

        private checkComplete(): void {
            updateTotalProgress(-1);
            showProgressInterface(1, 1, (this._totalCount - this._checkCount) / this._totalCount, "正在加载场景......");
            if (--this._checkCount <= 0) {
                this.event(LayaEvent.COMPLETE);
            }
        }

        public update(x: number, y: number, force: boolean = false): void {
            this._viewBounds.updateOffset(x, y);

            if (this._viewBounds.force || force) {
                x = this._viewBounds.offsetX;
                y = this._viewBounds.offsetY;
                let pos = this._target.position;
                let isHangupScene: boolean = SceneModel.instance.isHangupScene;
                let isXianFu: boolean = SceneUtil.isXianfu;
                // 获取玩家的方向给摄像机向相对偏移值
                // if (GameCenter.instance._master && GameCenter.instance._master.property.get("goAhead") == -1) {
                //     x -= 30;
                // } else {
                //     x += 30;
                // }

                pos.x = x;
                if (isHangupScene) {
                    pos.y = -1300;
                } else {
                    pos.y += 200;
                    pos.y = y;
                }
                if (isXianFu) {
                    let type = SceneUtil.xianfuPanelType;
                    switch (type) {
                        case 0:
                            pos.y = -1456;
                            break;
                        case 1:
                            pos.y = -3504;
                            break;
                        case 2:
                            pos.y = -5552;
                            break;
                        case 3:
                            pos.y = -7580;
                            break;
                    }
                    // 12 pro分辨率下限制
                    // case 0:
                    //     pos.y = -1056;
                    //     break;
                    // case 1:
                    //     pos.y = -3204;
                    //     break;
                    // case 2:
                    //     pos.y = -5252;
                    //     break;
                    // case 3:
                    //     pos.y = -7580;
                    //     break;
                }


                this._target.position = pos;
                pos = this._bgTransform3D.localPosition;
                let w = this._backgroundBounds.width > this._backgroundBounds.viewport.width ? this._backgroundBounds.width : this._backgroundBounds.viewport.width;
                let h = this._backgroundBounds.height > this._backgroundBounds.viewport.height ? this._backgroundBounds.height : this._backgroundBounds.viewport.height;
                pos.reset((x - w / 2) | 0, (y + h / 2) | 0, -1);

                if (isHangupScene) pos.y = 50;
                this._bgTransform3D.localPosition = pos;
                this.updateViewArea();
            }
        }

        // 更新地图背景
        private updateBackgroundArea() {
            if (this._single) {
                return;
            }
            this._backgroundBounds.updateOffset(DesignConstant.BackgroundWidth / 2, -DesignConstant.BackgroundHeight / 2);
            let rect = this._backgroundBounds.viewArea;
            let blocks = this._visualBackgroundBlocks;
            this.calcBlocks(rect, blocks, this._bgTileMesh, this._backgroundLayer, false);
            this._loadCount += this.updateLayerTiles(rect);
            this.activeTextureMaterial(rect, blocks);
        }

        protected updateViewArea(): void {
            let rect = this._viewBounds.viewArea;

            if (this._viewArea.equals(rect)) {
                return;
            }

            let blocks = this._visualBlocks;
            this.calcBlocks(rect, blocks, this._tileMesh, this, true);
            this.updateViewLayerTiles(rect, this._viewArea);
            this.activeTextureMaterial(rect, blocks);

            this._viewArea.copyFrom(rect);
        }

        private calcBlocks(rect: Laya.Rectangle, blocks: Array<Laya.MeshSprite3D>, mesh: base.mesh.TileAtlasMesh, layer: Laya.Sprite3D, enableBlend: boolean): void {
            const total = rect.width * rect.height;
            const count = (total + 7) >> 3;

            const size = blocks.length;
            for (let i = size; i < count; ++i) {
                let sprite = new Laya.MeshSprite3D(mesh);
                sprite.meshRender.sharedMaterial = new base.materials.MultiTextureMaterial(enableBlend);
                blocks.push(sprite);
                layer.addChild(sprite);
            }

            for (let i = 0; i < size; ++i) {
                blocks[i].active = true;
            }
        }

        private clearLayerTiles(blocks: Array<Laya.MeshSprite3D>): void {
            for (let i = 0, length = blocks.length; i < length; ++i) {
                let sprite = blocks[i];
                if (sprite.active) {
                    let material = <base.materials.MultiTextureMaterial>sprite.meshRender.sharedMaterial;
                    for (let j = 0; j < 8; ++j) {
                        material.setTextureAt(j + 1, null);
                    }
                    sprite.active = false;
                }
            }
        }

        // 加载地图背景
        private updateLayerTiles(rect: Laya.Rectangle): number {
            const formats = this._formats;
            formats[0] = this._backgroundPath;
            const matrix = this._offsetMatrix4x4;
            const offset = this._offsetVector3;
            const cols: int = rect.right;
            const rows: int = rect.bottom;
            const halfSplitSize: int = DesignConstant.BackgroundSplitSize / 2;
            let index: int = 0;
            let result = 0;
            for (let row = rect.y; row < rows; ++row) {
                for (let col = rect.x; col < cols; ++col) {
                    if (DEBUG) {
                        if (col >= this._cols || row >= this._rows) {
                            throw new Error("叫技术来看");
                        }
                    }
                    let i = index >> 3;
                    let j = index % 8;
                    index++;
                    let sprite = this._visualBackgroundBlocks[i];
                    let material = <base.materials.MultiTextureMaterial>sprite.meshRender.sharedMaterial;
                    formats[1] = row;
                    formats[3] = col;
                    formats[4] = ".jpg";
                    let texture = LayaTexture2D.load(formats.join(""));
                    if (!texture.loaded) {
                        ++result;
                        texture.once(LayaEvent.ERROR, this, this.checkComplete);
                        texture.once(LayaEvent.LOADED, this, this.checkComplete);
                    }
                    material.setTextureAt(j + 1, texture);
                    offset.elements[0] = col * DesignConstant.BackgroundSplitSize + halfSplitSize;
                    offset.elements[1] = -(row * DesignConstant.BackgroundSplitSize + halfSplitSize);
                    Laya.Matrix4x4.createTranslate(offset, matrix);
                    material.offsetMatrix.set(matrix.elements, 16 * j);
                }
            }
            return result;
        }

        // 获取地图图片后缀
        private getImgSuffix(type: number): string {
            switch (type) {
                case 1: return ".til";
                case 2: return ".jpg";
                case 3: return ".png";
                default:
                    console.error(`获取地图文件后缀类型[${type}]错误！！！默认返回'.jpg'`);
                    return ".jpg";
            }
        }

        // 获取行编号
        private getMapSplitColsNum(colsNo: number): number {

            // 挂机界面是循环的 所以需要进行求余取值
            if (SceneModel.instance.isHangupScene) {
                // return colsNo % 7;
                return colsNo % MapSpriteLayer.mapClos;
            }

            // 非挂机界面直接返回原值
            return colsNo;
        }

        // 加载地图切片
        private updateViewLayerTiles(rect: Laya.Rectangle, bounds: Laya.Rectangle): void {
            const formats = this._formats;
            formats[0] = this._tilePath;

            let right = bounds.right;
            let bottom = bounds.bottom;
            // for (let y = bounds.y; y < bottom; ++y) {
            //     for (let x = bounds.x; x < right; ++x) {
            //         if (DEBUG) {
            //             // 如果报错，先检查地图宽高是否匹配 行*512 列*512
            //             // 手机模式与pc模式互换时可能会报错，后期看情况处理
            //             if (this.getMapSplitColsNum(x) >= this._cols || y >= this._rows) {
            //                 throw new Error("地图-叫技术来看");
            //             }
            //         }
            //         if (!rect.contains(x, y)) {
            //             let type = this._flags[y * this._cols + this.getMapSplitColsNum(x)];
            //             if (type == 0) {
            //                 continue;
            //             }
            //             formats[1] = y;
            //             formats[3] = this.getMapSplitColsNum(x);
            //             formats[4] = this.getImgSuffix(type);
            //             let url = formats.join("");

            //             let entry = this._group[url];
            //             if (entry) {
            //                 if (!entry.handle) {
            //                     TexturePool.instance.cancel(entry.url, this.onTileComplete);
            //                 }
            //                 TileEntry.freeEntry(entry);
            //                 delete this._group[url];
            //             }
            //         }
            //     }
            // }


            const matrix = this._offsetMatrix4x4;
            const offset = this._offsetVector3;
            const cols = rect.right;
            const rows = rect.bottom;
            const halfSplitWidth = this._splitWidth >> 1;
            const halfSplitHeight = this._splitHeight >> 1;
            const scaleU = this._splitWidth / this._width;
            const scaleV = this._splitHeight / this._height;
            let index = 0;
            for (let row = rect.y; row < rows; ++row) {
                for (let col = rect.x; col < cols; ++col) {
                    let type = this._flags[row * this._cols + this.getMapSplitColsNum(col)];
                    if (type == 0 || type == undefined) {
                        continue;
                    }
                    let i = index >> 3;
                    let j = index % 8;
                    let sprite = this._visualBlocks[i];
                    let material = <base.materials.MultiTextureMaterial>sprite.meshRender.sharedMaterial;
                    offset.elements[0] = col * this._splitWidth + halfSplitWidth;
                    offset.elements[1] = -(row * this._splitHeight + halfSplitHeight);
                    Laya.Matrix4x4.createTranslate(offset, matrix);
                    material.offsetMatrix.set(matrix.elements, 16 * j);

                    formats[1] = row;
                    formats[3] = this.getMapSplitColsNum(col);
                    formats[4] = this.getImgSuffix(type);
                    let url = formats.join("");
                    // console.log("加载前景:",url);

                    let entry = this._group[url];
                    if (entry) {
                        material.setTextureAt(j + 1, entry.texture || this._small);
                    } else {
                        material.setTextureAt(j + 1, this._small);
                        entry = TileEntry.allocEntry();
                        entry.url = url;
                        this._group[url] = entry;
                        TexturePool.instance.load(url, this.onTileComplete, 3600);
                    }
                    entry.index = index;

                    let tilingOffset = material.tilingOffset;
                    if (entry.texture) {
                        tilingOffset[4 * j] = 1;
                        tilingOffset[4 * j + 1] = 1;
                        tilingOffset[4 * j + 2] = 0;
                        tilingOffset[4 * j + 3] = 0;
                    } else {
                        tilingOffset[4 * j] = scaleU;
                        tilingOffset[4 * j + 1] = scaleV;
                        tilingOffset[4 * j + 2] = col * scaleU;
                        tilingOffset[4 * j + 3] = row * scaleV;
                    }
                    index++;
                }
            }
        }

        private activeTextureMaterial(rect: Laya.Rectangle, blocks: Array<Laya.MeshSprite3D>): void {
            const limit = blocks.length * 8;
            let cursor = rect.width * rect.height;
            while (cursor < limit) {
                let sprite = blocks[cursor >> 3];
                let material = <base.materials.MultiTextureMaterial>sprite.meshRender.sharedMaterial;
                let offset = cursor % 8;
                if (offset != 0) {
                    for (let i = offset; i < 8; ++i) {
                        material.setTextureAt(i + 1, null);
                    }
                } else {
                    if (sprite.active) {
                        for (let i = 0; i < 8; ++i) {
                            material.setTextureAt(i + 1, null);
                        }
                        sprite.active = false;
                    }
                }
                cursor += 8 - (cursor % 8);
            }
        }

        private onTileComplete = (url: string, handle: number, res: Laya.BaseTexture): void => {
            let entry = this._group[url];
            if (entry) {
                entry.handle = handle;
                HandlePool.instance.lock(handle);
                entry.texture = res;
                let index = entry.index;
                let i = index >> 3;
                let j = index % 8;
                let sprite = this._visualBlocks[i];
                let material = <base.materials.MultiTextureMaterial>sprite.meshRender.sharedMaterial;
                material.setTextureAt(j + 1, res);
                let tilingOffset = material.tilingOffset;
                tilingOffset[4 * j] = 1;
                tilingOffset[4 * j + 1] = 1;
                tilingOffset[4 * j + 2] = 0;
                tilingOffset[4 * j + 3] = 0;
            }
        }
    }
}