///<reference path="../../utils/algorithm/astar.ts"/>
///<reference path="../../utils/array_utils.ts"/>
///<reference path="../../modules/config/map_path_cfg.ts"/>

namespace game.map {
    import MapPathFields = Configuration.MapPathFields;
    import Point = Laya.Point;
    import MapPathCfg = modules.config.MapPathCfg;
    import ArrayUtils = utils.ArrayUtils;
    import AStar = utils.collections.AStar;
    import MapPath = Configuration.MapPath;
    import SceneModel = modules.scene.SceneModel;

    export class MapUtils {
        public static readonly screenPos: Point = new Point();
        public static readonly cameraPos: Point = new Point();

        public static mapWidth: int;
        public static mapHeight: int;
        public static cellWidth: int;
        public static cellHeight: int;
        public static cellHalfWidth: int;
        public static cellHalfHeight: int;
        public static rows: int;
        public static cols: int;
        private static not_access_y_cell_count: int;

        private static readonly offset: uint = 2;

        private static navigator: AStar = new AStar();
        private static mapData: Uint8Array;
        public static currentID: number;
        // 挂机场景当前寻路点id
        public static hookSceneCurrentFindPathID: number;
        /** 用于寻路等待判断执行*/
        private static _waitTransition: WaitTransitionType;
        public static scale: number = 0;

        private static pathIds: Array<Array<number>>;
        private static pathNodes: Array<Point>;

        // 当前地图是否轮循加载 
        private static cycle_load: boolean = false;
        // 轮循加载的地图张数 
        private static cycle_map_count: number = 1;

        public static configs: Table<Uint8Array> = {};

        public static init(content: Table<Uint8Array>): void {
            MapUtils.configs = content;
        }

        public static setData(id: number, buffer: ArrayBuffer, byteOffset: number, width: number, height: number): void {
            MapUtils.currentID = id;
            let cfg: MapPath = MapPathCfg.instance.getCfgById(id.toString());
            MapUtils.pathIds = cfg ? cfg[MapPathFields.path] : [];

            MapUtils.mapData = new Uint8Array(buffer, byteOffset + MapUtils.offset);
            let bytes = new DataView(buffer, byteOffset);
            let offset = 0;

            MapUtils.mapWidth = width;
            MapUtils.mapHeight = height;
            MapUtils.cellWidth = bytes.getUint8(offset++);
            MapUtils.cellHeight = bytes.getUint8(offset++);
            MapUtils.cellHalfWidth = MapUtils.cellWidth >> 1;
            MapUtils.cellHalfHeight = MapUtils.cellHeight >> 1;

            MapUtils.cols = MapUtils.mapWidth / MapUtils.cellWidth;
            MapUtils.rows = MapUtils.mapHeight / MapUtils.cellHeight;

            MapUtils.navigator.reset(MapUtils.mapData, MapUtils.mapWidth, MapUtils.mapHeight, MapUtils.cellWidth, MapUtils.cellHeight, null);

            let spawnPointsArr = [];

            offset = MapUtils.offset + MapUtils.rows * MapUtils.cols;
            let spawnpoints = bytes.getUint8(offset++);
            for (let i = 0; i < spawnpoints; ++i) {
                let id = bytes.getUint8(offset++);
                let count = bytes.getUint8(offset++);
                let singleArr = [];
                for (let j = 0; j < count; ++j) {
                    let index = bytes.getUint32(offset, true);
                    offset += 4;
                    singleArr.push([(j + 1), "x:", index % MapUtils.cols, "y:", Math.floor((index - index % MapUtils.cols) / MapUtils.cols)])
                }
                spawnPointsArr.push("区域id:" + id, singleArr);
            }

            //console.log("出生点：", spawnPointsArr);

            let pathNodePointsArr = [];
            this.pathNodes = [];
            let paths = bytes.getUint8(offset++);
            for (let i = 0; i < paths; ++i) {
                let id = bytes.getUint8(offset++);
                let count = bytes.getUint8(offset++);
                let singleArr = [];
                for (let j = 0; j < count; ++j) {
                    let index = bytes.getUint32(offset, true);
                    offset += 4;
                    this.pathNodes[id] = new Point(index % MapUtils.cols, Math.floor(index / MapUtils.cols));
                    singleArr.push([j + 1, "x:", index % MapUtils.cols, "y:", Math.floor(index / MapUtils.cols)])
                }
                pathNodePointsArr.push("区域id:" + id, singleArr);
            }
            // 轮循加载和轮循加载的张数v
            MapUtils.cycle_map_count = 1;
            MapUtils.cycle_load = false;
            try {
                MapUtils.cycle_load = bytes.getUint8(offset++) == 1;
                MapUtils.cycle_map_count = bytes.getUint8(offset++);
            } catch (error) {
                console.log(`当前地图${id}没配置轮循地图配置信息!`);
            }
            MapUtils.hookSceneCurrentFindPathID = -1;
            MapUtils.waitTransition = WaitTransitionType.WaitTransitionOne;
            // 初始化挂机点
            MapUtils.initHKFindPathArray();
            //初始化普通场景寻路点(非轮巡场景)
            MapUtils.initCommonFindPathArray();
            GameCenter.instance.world.publish("setTransformDoorActive", false);
            //console.log("寻路点：", pathNodePointsArr);
            // 不可行走区域y轴行数
            // this.not_access_y_cell_count = bytes.getUint8(offset++);
        }

        /** 用于寻路等待判断执行*/
        public static get waitTransition(): WaitTransitionType {
            return MapUtils._waitTransition;
        }
        public static set waitTransition(value: WaitTransitionType) {
            MapUtils._waitTransition = value;
        }

        private static checkPos(pos: Point): boolean {
            return (pos.x >= 0 && pos.x < MapUtils.cols) && (pos.y >= 0 && pos.y < MapUtils.rows);
        }

        // 挂机场景寻路点集合
        public static HKFindPathArr: Array<Array<number>> = [];
        public static initHKFindPathArray() {
            if (!SceneModel.instance.isHangupScene) return;
            MapUtils.HKFindPathArr = [];
            for (let index = 0, len = MapUtils.cycle_map_count; index < len; index++) {
                for (let i = 1; i < MapUtils.pathNodes.length; i++) {
                    MapUtils.hookSceneCurrentFindPathID++;
                    let pathCount: number = this.pathNodes.length;
                    let curId: number = MapUtils.hookSceneCurrentFindPathID % pathCount;
                    // 0 是空的
                    if (curId == 0) {
                        curId = 1;
                        MapUtils.hookSceneCurrentFindPathID++;
                    }
                    // 测试使用
                    // if (index > 3) continue;
                    let p = MapUtils.pathNodes[i];
                    let x = MapUtils.cols * index + p.x;
                    MapUtils.HKFindPathArr.push([x, 100, curId]);
                }
            }
            //console.log("寻路点", this.HKFindPathArr);
        }

        /**
         * 挂机场景获取下一个寻路点
        */
        public static getHookSceneGetNextPath() {

            // 取一个点出来
            if (MapUtils.HKFindPathArr.length <= 0) {
                return null;
            }
            let point_data = MapUtils.HKFindPathArr.shift();
            // console.log("point:::", point_data, MapUtils.HKFindPathArr.length);
            return [1, new Laya.Point(point_data[0], point_data[1]), point_data[2]];
        }

        /**
         * 非轮巡场景寻路点
        */
        public static comonFindPathArr: Array<Array<number>> = [];
        public static initCommonFindPathArray() {
            MapUtils.comonFindPathArr = [];
            for (const data in MapUtils.pathNodes) {
                let p = MapUtils.pathNodes[data];
                let x = p.x;
                let y = p.y;
                let id = Number(data);
                MapUtils.comonFindPathArr.push([x, y, id]);
            }
            if (DEBUG) {
                console.log("场景寻路点", this.comonFindPathArr);
            }
        }

        /**
         * 非轮巡场景获取下一个寻路点
         * @param curPosX 角色当前位置
        */
        public static getComonSceneGetNextPath(curPosX: number) {
            //如果点在人物左边，舍弃这个点，因为人物一直向右走
            let filterArr =  MapUtils.comonFindPathArr.filter((data)=>{
                return data[0] > curPosX;
            });
            filterArr = filterArr.sort((a,b)=>a[0]-b[0]);//x 升序
            MapUtils.comonFindPathArr = filterArr;
            if (MapUtils.comonFindPathArr.length <= 0) {
                return null;
            }
            let point_data = MapUtils.comonFindPathArr.shift();
            return [1, new Laya.Point(point_data[0], point_data[1]), point_data[2]];
        }

        /** 是否准备转场 */
        public static isReadyTransitions(pos: Laya.Point, self_x: number) {
            let next_x: number = pos.x;
            let trans: boolean = Math.ceil(next_x / MapUtils.cols) > 20;
            return trans;
        }

        public static nearbyPathNode(pos: Point): [number, Point] {
            let distance = Number.POSITIVE_INFINITY;
            let result: [number, Point] = [-1, new Point()];
            let nodes = MapUtils.pathNodes;
            for (let i = 0, length = nodes.length; i < length; ++i) {
                let p = MapUtils.pathNodes[i];
                if (p == null) {
                    continue;
                }
                let value = MapUtils.calcDistance(p, pos);
                if (distance > value) {
                    distance = value;
                    result[0] = i;
                    result[1].x = p.x;
                    result[1].y = p.y;
                }
            }
            return result;
        }

        public static nearbyPathIdNode(pos: Point): [number, Point] {
            let distance = Number.POSITIVE_INFINITY;
            let nodes = MapUtils.pathNodes;
            let result: [number, Point] = [-1, new Point()];
            // console.log("苏丹 寻路1")
            for (let info of MapUtils.pathIds) {
                let p = nodes[info[0]];
                let value = MapUtils.calcDistance(p, pos);
                if (distance > value) {
                    distance = value;
                    result[0] = info[0];
                    result[1].x = p.x;
                    result[1].y = p.y;
                }
            }
            return result;
        }

        public static findNextPathNode(id: number): [number, Point] {
            if (id != -1) {

                //    console.log("苏丹 寻路2", MapUtils.pathIds, id) //后续找后整个
                for (let info of MapUtils.pathIds) {
                    if (info[0] == id) {
                        id = ArrayUtils.random(info, 1);
                        let pos = MapUtils.pathNodes[id];
                        return [id, new Point(pos.x, pos.y)];
                    }
                }
                // let arr = []; arr[0]['a']();//报错写法
            }
            return null;
        }

        public static findNodePath(id: number): Array<number> {
            if (id != -1) {
                // console.log("苏丹 寻路3")
                for (let info of MapUtils.pathIds) {
                    if (info[0] == id) {
                        return info;
                    }
                }
            }
            return null;
        }

        public static getPathNode(id: number): Point {
            return MapUtils.pathNodes[id];
        }

        /** 寻路 */
        public static findPath(start: Point, end: Point, motion: uint = 5, auth: uint = 0, result: Array<Point> = null, smooth: boolean = true): Array<Point> {

            // 非挂机场景都需要检测移动点是否在地图内
            // if (!SceneModel.instance.isHangupScene && (!MapUtils.checkPos(start) || !MapUtils.checkPos(end))) {
            //     return null;
            // }

            // 是否在可行走区域
            // if (this.not_access_y_cell_count > end.y) {
            // console.log(`移动到目标点失效(${end.toString()}):当前区域Y值(${end.y} 应该大于 ${this.not_access_y_cell_count} )不可通行`);
            // return;
            // }

            // console.log("DDDDMOveTO", end);
            result.push(end);
            return result;

            // 原始寻路方法 - 干掉
            //MapUtils.navigator.find(start.x, start.y, end.x, end.y, motion, auth, result);
            //return smooth ? MapUtils.smoothPathEx(start.x, start.y, result) : result;
        }

        private static smoothPathEx(startX: uint, startY: uint, result: Array<Point>): Array<Point> {

            MapUtils.calPassedPoints(startX, startY, result);
            //let k:number =
            return result;
        }

        private static calPassedPoints(startX: uint, startY: uint, result: Array<Point>, offset: int = 0) {
            // 起码有两个点才需要计算平滑
            if (!result || result.length < 2 + offset) return;
            startX += 0.5;
            startY += 0.5;
            let nextX: uint = result[result.length - 2 - offset].x + 0.5;
            let nextY: uint = result[result.length - 2 - offset].y + 0.5;
            let k: number = (nextY - startY) / (nextX - startX);
            let b: number = startY - k * startX;
            let tmpStartY: number = startY;
            let canPass: boolean = true;
            // 计算与y轴交点
            for (let i: int = Math.floor(startX); startX < nextX ? i < nextX : i > nextX; startX < nextX ? i++ : i--) {
                let tmpY: number = k * i + b;
                // 计算与X轴交点
                for (let j: int = Math.floor(tmpStartY) + 0.5; startY < nextY ? j < tmpY : j > tmpY; startY < nextY ? j++ : j--) {
                    let p1: Point = new Point();
                    p1.y = j;
                    p1.x = (p1.y - b) / k;
                    if (!MapUtils.isCanMove(Math.floor(p1.x), Math.floor(p1.y))) {
                        canPass = false;
                    }
                    if (!canPass) break;
                }
                tmpStartY = tmpY;
                if (!MapUtils.isCanMove(Math.floor(i), Math.floor(tmpY))) {
                    canPass = false;
                }
                if (!canPass) break;
            }
            if (canPass) {        // 如果可以通过，则删除中间不需要的点
                result.splice(result.length - 1 - offset, 1);
                MapUtils.calPassedPoints(startX - 0.5, startY - 0.5, result, offset);
            } else {      // 不可以通过则跳到下一个点计算
                let p: Point = result[result.length - 1 - offset];
                offset++;
                MapUtils.calPassedPoints(p.x, p.y, result, offset);
            }
        }

        public static AStarPath(start: Point, end: Point, motion: uint = 5, auth: uint = 0, result: Array<Point> = null, smooth: boolean = true): Array<Point> {
            if (!MapUtils.checkPos(start) || !MapUtils.checkPos(end)) {
                return null;
            }

            MapUtils.navigator.find(start.x, start.y, end.x, end.y, motion, auth, result);
            return smooth ? MapUtils.smoothPathEx(start.x, start.y, result) : result;
        }

        /**
         *  判断坐标所在的地方是否是透明区域
         * true 不透明区域
         * false 半透明区域
         * **/
        public static isOpaqueArea(x: int, y: int): boolean {
            let value: uint = MapUtils.mapData[MapUtils.cols * y + x];
            return (value & 0x80) == 0;
        }

        public static getAreaValue(x: int, y: int): uint {
            return MapUtils.mapData[MapUtils.cols * y + x];
        }

        public static isCanMove(x: int, y: int, motion: int = 5, auth: int = 0): boolean {
            if (x >= MapUtils.cols || x < 0) {
                return false;
            }

            if (y >= MapUtils.rows || y < 0) {
                return false;
            }

            let value: uint = MapUtils.mapData[MapUtils.cols * y + x];
            return ((value & 0x70) >> 4) <= motion && (value & 0x0F) <= auth;
        }

        /** 计算挂机场景 是否应该切换地图 > map.width*20*/
        public static needMapTransitions(next_x: number): boolean {
            let mapCount: number = Math.ceil(next_x / MapUtils.cols);
            // console.log("mapCount:", mapCount, "需要转场：", mapCount > 20);
            return mapCount > 20;
        }


        /** 计算挂机场景 虚拟的位置*/
        public static calcHKVerticalXPos(x: number): number {
            x = x % MapUtils.cols;
            return x;
        }

        /** 真实坐标转屏幕坐标 不用对Y进行逆转*/
        public static realToScreen(x: number, y: number, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(
                x * MapUtils.scale - MapUtils.screenPos.x
                , -y * MapUtils.scale - MapUtils.screenPos.y);
            return p;
        }

        /** 得到屏幕坐标 */
        public static getScreenPosition(x: int, y: int, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(
                (x * MapUtils.cellWidth + MapUtils.cellHalfWidth) * MapUtils.scale - MapUtils.screenPos.x
                , (y * MapUtils.cellHeight + MapUtils.cellHalfHeight) * MapUtils.scale - MapUtils.screenPos.y);
            return p;
        }

        /** 屏幕坐标转地图坐标 */
        public static screenToPosition(x: int, y: int, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(
                0xFFFFFFFF & (((x + MapUtils.screenPos.x) / MapUtils.scale - MapUtils.cellHalfWidth) / MapUtils.cellWidth)
                , 0xFFFFFFFF & (((y + MapUtils.screenPos.y) / MapUtils.scale - MapUtils.cellHalfHeight) / MapUtils.cellHeight));
            return p;
        }

        /** 得到真实坐标 */
        public static getRealPosition(x: int, y: int, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(
                x * MapUtils.cellWidth + MapUtils.cellHalfWidth
                , y * MapUtils.cellHeight + MapUtils.cellHalfHeight);

            return p;
        }

        /** 得到真实坐标 基于X轴无限 */
        public static getRealPositionEx(x: int, y: int, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(x, y);
            if (SceneModel.instance.isInMission) {
                let masterPos = GameCenter.instance._master.property.get("transform").localPosition;
                let real = MapUtils.getPosition(masterPos.x, -masterPos.y)
                let count: number = Math.floor(real.x / MapUtils.cols);
                let monsterX: number = p.x;
                if (monsterX < real.x % MapUtils.cols) count++;
                p.x += count * MapUtils.cols;

            }
            return p;
        }

        /** 得到2.5D地图坐标 x/16 y/16 */
        public static getPosition(x: int, y: int, p: Point = null): Point {
            if (p == null) {
                p = new Point();
            }
            p.setTo(0xFFFFFFFF & (x / MapUtils.cellWidth), 0xFFFFFFFF & (y / MapUtils.cellHeight));

            return p;
        }

        public static testPositionEquals(leftX: number, leftY: number, rightX: number, rightY: number): boolean {
            return ((0xFFFFFFFF & (leftX / MapUtils.cellWidth)) == (0xFFFFFFFF & (rightX / MapUtils.cellWidth))) && ((0xFFFFFFFF & (leftY / MapUtils.cellHeight)) == (0xFFFFFFFF & (rightY / MapUtils.cellHeight)));
        }

        public static calcDistance(start: Point, end: Point): number {
            let lengthX: number = end.x - start.x;
            let lengthY: number = end.y - start.y;
            return lengthX * lengthX + lengthY * lengthY;
        }

        public static calcDistanceEx(start: Point, end: Point): number {
            return MapUtils.getDistance(start.x, start.y, end.x, end.y);
        }

        public static calcPathDistance(path: Array<Point>): number {
            if (path.length < 2) {
                return 0;
            }

            let distance = 0;
            let start = path[0];
            for (let i = 1, length = path.length; i < length; ++i) {
                let end = path[i];
                let lengthX = (end.x - start.x) * MapUtils.cellWidth + MapUtils.cellHalfWidth;
                let lengthY = (end.y - start.y) * MapUtils.cellHeight + MapUtils.cellHalfHeight;
                distance += Math.sqrt(lengthX * lengthX + lengthY * lengthY);
                start = end;
            }
            return distance;
        }

        /** 测试两点的距离是否小于等于指定的长度 */
        public static testDistance(startX: number, startY: number, endX: number, endY: number, distance: number): boolean {
            let lengthX: number = endX - startX;
            let lengthY: number = endY - startY;
            let length: number = lengthX * lengthX + lengthY * lengthY;
            distance *= distance;
            return length <= distance;
        }
        /** 取两点之间长度 */
        public static getDistance(startX: number, startY: number, endX: number, endY: number): number {
            let lengthX: number = endX - startX;
            let lengthY: number = endY - startY;
            let length: number = lengthX * lengthX + lengthY * lengthY;
            return Math.sqrt(length);
        }

        private static direction(start: Point, end: Point, target: Point): number {
            return (start.x - target.x) * (end.y - target.y) - (end.x - target.x) * (start.y - target.y);
        }

        public static getAngleByPoint(start, end) {
            var x = Math.abs(end.x - start.x),
                y = Math.abs(end.y - start.y),
                z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            //无拖动
            if (x == 0 && y == 0) { return 0; }
            var cos = y / z;
            var radina = Math.acos(cos);//用反三角函数求弧度
            var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度
            //鼠标在第一象限
            if (start.x <= end.x && start.y > end.y) {
                angle = Math.abs(90 - angle);
            }
            //鼠标在第二象限
            if (start.x > end.x && start.y >= end.y) {
                angle += 90;

            }
            //鼠标在第三象限
            if (start.x >= end.x && start.y < end.y) {
                angle = 270 - angle;

            }
            //鼠标在第四象限
            if (start.x < end.x && start.y <= end.y) {
                angle += 270;
            }
            angle = 360 - angle;
            return angle == 360 ? 0 : angle;
        };

        public static getCycleMapCount() {
            return MapUtils.cycle_map_count;
        }
    }
}