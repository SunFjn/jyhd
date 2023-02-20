/** GM 地图编辑器 数据 */
namespace modules.gm {
    import Point = Laya.Point;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    export class GM_MapModel {
        private static _instance: GM_MapModel = new GM_MapModel();
        public static get instance(): GM_MapModel {
            return this._instance;
        }
        public _map: Uint32Array;
        public _quyu = []

        constructor() {
            this.Init();
        }

        //
        /**
         * 初始化需要的数据
         */
        public Init() {


        }
        private _mapId: number;
        private _single: boolean;
        public _width: number;
        public _height: number;
        public _splitWidth: number;
        public _splitHeight: number;
        public _rows: number;
        public _cols: number;
        private _viewArea: Laya.Rectangle;
        private _tilePath: string;
        private _backgroundPath: string;
        public _flags: Uint8Array;
        public _onCompleteToPanl: () => {} = null;
        public onConfigComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            if (buffer == null) {
                throw new Error(`场景文件${url}不存在`);
            }
            console.log('研发测试_chy:地图', '加载地图返回', url)
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
            this._single = false;

            let flags = new Uint8Array(buffer, offset, this._rows * this._cols);
            offset += flags.byteLength;
            this._flags = flags;
            console.log('研发测试_chy:flags', flags);

            this.setData(this._mapId, buffer, offset, this._width, this._height);
        };
        private offset: uint = 2;
        public spawnpointNodes = []
        public pathNodes = []
        public setData(id: number, buffer: ArrayBuffer, byteOffset: number, width: number, height: number): void {
            let MapUtilsData = {
                mapWidth: 0,
                mapHeight: 0,
                cellWidth: 0,
                cellHeight: 0,
                cellHalfWidth: 0,
                cellHalfHeight: 0,
                cols: 0,
                rows: 0,


            }
            let mapData = new Uint8Array(buffer, byteOffset + this.offset);
            console.log('研发测试_chy:地图', 'mapData', mapData.length)
            let bytes = new DataView(buffer, byteOffset);
            let offset = 0;

            MapUtilsData.mapWidth = width;
            MapUtilsData.mapHeight = height;
            MapUtilsData.cellWidth = bytes.getUint8(offset++);
            MapUtilsData.cellHeight = bytes.getUint8(offset++);
            MapUtilsData.cellHalfWidth = MapUtilsData.cellWidth >> 1;
            MapUtilsData.cellHalfHeight = MapUtilsData.cellHeight >> 1;
            MapUtilsData.cols = MapUtilsData.mapWidth / MapUtilsData.cellWidth;
            MapUtilsData.rows = MapUtilsData.mapHeight / MapUtilsData.cellHeight;
            this.reset(mapData, MapUtilsData.mapWidth, MapUtilsData.mapHeight, MapUtilsData.cellWidth, MapUtilsData.cellHeight, null);


            offset = this.offset + MapUtilsData.rows * MapUtilsData.cols;
            let spawnpointNodes = [];
            let spawnpoints = bytes.getUint8(offset++);
            for (let i = 0; i < spawnpoints; ++i) {
                let id = bytes.getUint8(offset++);
                let count = bytes.getUint8(offset++);
                let item = []
                item.push(id)
                for (let j = 0; j < count; ++j) {
                    let index = bytes.getUint32(offset, true);
                    offset += 4;
                    //spawnpointNodes[id] = new Point(index % MapUtilsData.cols, Math.floor(index / MapUtilsData.cols));
                    item.push([index % MapUtilsData.cols, Math.floor(index / MapUtilsData.cols)])
                }
                spawnpointNodes.push(item)
            }
            this.spawnpointNodes = spawnpointNodes
            let pathNodes = [];
            let paths = bytes.getUint8(offset++);
            for (let i = 0; i < paths; ++i) {
                let id = bytes.getUint8(offset++);
                let count = bytes.getUint8(offset++);
                let item = []
                item.push(id)
                for (let j = 0; j < count; ++j) {
                    let index = bytes.getUint32(offset, true);
                    offset += 4;
                    //pathNodes[id] = new Point(index % MapUtilsData.cols, Math.floor(index / MapUtilsData.cols));
                    item.push([index % MapUtilsData.cols, Math.floor(index / MapUtilsData.cols)])
                }
                pathNodes.push(item)
            }
            this.pathNodes = pathNodes
            SystemNoticeManager.instance.addNotice("加载完成", false);
            if (this._onCompleteToPanl != null) this._onCompleteToPanl();
        }
        public reset(mapData: Uint8Array, width: int, height: int, cellWidth: int, cellHeight: int, bridgeInfo: Array<any>): void {
            let _limitX = width / cellWidth;
            let _limitY = height / cellHeight;
            let limit: uint = _limitX * _limitY
            let index: uint;
            let x: int;
            let y: int;
            let child: uint;
            this._map = new Uint32Array(limit);
            let i: uint = 0;
            for (y = 0; y < _limitY; ++y) {
                for (x = 0; x < _limitX; ++x) {
                    this._map[i] = mapData[i++]
                }
            }

        }


        public getRegionId(x, y, type) {
            let id = -1;
            if (type == 0) {
                for (const key in this.spawnpointNodes) {
                    let region = this.spawnpointNodes[key][0]
                    let len = this.spawnpointNodes[key].length
                    for (let index = 1; index < len; index++) {
                        let pos = this.spawnpointNodes[key][index]
                        if (pos[0] == x && pos[1] == y) return region
                    }
                }
            }

            if (type == 1) {
                for (const key in this.pathNodes) {
                    let region = this.pathNodes[key][0]
                    let len = this.pathNodes[key].length
                    for (let index = 1; index < len; index++) {
                        let pos = this.pathNodes[key][index]
                        if (pos[0] == x && pos[1] == y) return region
                    }
                }
            }
            return id;
        }

    }
}