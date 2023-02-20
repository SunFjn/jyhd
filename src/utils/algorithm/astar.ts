namespace utils.collections {
    import Point = Laya.Point;

    const enum Direction {
        NORTH_WEST = 0,
        NORTH = 1,
        NORTH_EAST = 2,
        WEST = 3,
        CENTER = 4,
        EAST = 5,
        SOUTH_WEST = 6,
        SOUTH = 7,
        SOUTH_EAST = 8
    }

    const enum NodeFields {
        X = 0,
        Y = 1,
        VALUE = 2,
        G = 3,
        H = 4,
        F = 5,
        PARENT = 6,
        POINTER = 7,
        MARK = 8,
        CHILDREN = 9,
        LIMIT = 10,
    }

    const enum Constant {
        NULL = 0xFFFFFFFF,

        KEEP = 0x80000000,

        VV = 3,
        HV = 4,
        SV = 5,
        VH = 3,
        HH = 4
    }

    const OffsetList: Array<int> = [
        -1, -1, Constant.SV, Direction.NORTH_WEST, 0, -1, Constant.VV, Direction.NORTH, 1, -1, Constant.SV, Direction.NORTH_EAST,
        -1, 0, Constant.HV, Direction.WEST, 1, 0, Constant.HV, Direction.EAST,
        -1, 1, Constant.SV, Direction.SOUTH_WEST, 0, 1, Constant.VV, Direction.SOUTH, 1, 1, Constant.SV, Direction.SOUTH_EAST
    ];

    // const OffsetList: Int32Array = new Int32Array([
    //     -1, -1, Constant.SV, Direction.NORTH_WEST, 0, -1, Constant.VV, Direction.NORTH, 1, -1, Constant.SV, Direction.NORTH_EAST,
    //     -1, 0, Constant.HV, Direction.WEST, 1, 0, Constant.HV, Direction.EAST,
    //     -1, 1, Constant.SV, Direction.SOUTH_WEST, 0, 1, Constant.VV, Direction.SOUTH, 1, 1, Constant.SV, Direction.SOUTH_EAST
    // ]);

    export class AStar {
        private _limitX: int;
        private _limitY: int;

        private _open: Array<uint>;
        private _closeID: uint;
        private _openID: uint;

        //用Uin32Array性能更优
        // private _map: Array<uint>;
        private _map: Uint32Array;

        constructor() {
            this._open = [];
            this._closeID = 0;
            this._openID = 0;
        }

        public reset(mapData: Uint8Array, width: int, height: int, cellWidth: int, cellHeight: int, bridgeInfo: Array<any>): void {
            this._limitX = width / cellWidth;
            this._limitY = height / cellHeight;

            let limit: uint = this._limitY * this._limitX;
            let index: uint;
            let x: int;
            let y: int;
            let child: uint;

            this._map = new Uint32Array(limit * NodeFields.LIMIT);

            this._closeID = 0;
            this._openID = 0;

            let i: uint = 0;
            let mapElements = this._map;
            for (y = 0; y < this._limitY; ++y) {
                index = (this._limitX * y) * NodeFields.LIMIT;
                for (x = 0; x < this._limitX; ++x) {
                    mapElements[index + NodeFields.X] = x;
                    mapElements[index + NodeFields.Y] = y;
                    mapElements[index + NodeFields.VALUE] = mapData[i++];
                    mapElements[index + NodeFields.MARK] = 0;
                    mapElements[index + NodeFields.CHILDREN] = Constant.NULL;
                    index += NodeFields.LIMIT;
                }
            }

            if (bridgeInfo) {
                for (let info of bridgeInfo) {
                    index = (this._limitX * info["sourY"] + info["sourX"]) * NodeFields.LIMIT;
                    child = (this._limitX * info["desY"] + info["desX"]) * NodeFields.LIMIT;

                    mapElements[index + NodeFields.VALUE] |= Constant.KEEP;
                    mapElements[index + NodeFields.CHILDREN] = child;
                    mapElements[child + NodeFields.VALUE] |= Constant.KEEP;
                }
            }
        }

        private findReplacer(startX: int, startY: int, endX: int, endY: int, motion: uint, auth: uint): uint {
            let index: uint = (this._limitX * endY + endX) * NodeFields.LIMIT;
            let value: uint = this._map[index + NodeFields.VALUE];
            if (!(((value & 0x70) >> 4) > motion || (value & 0x0F) > auth)) {
                return index;
            }

            let minHNode: uint = Constant.NULL;
            let minH: uint = 0xFFFFFFFF;
            let rangeX: Array<uint> = [0, 0];
            let rangeY: Array<uint> = [0, 0];
            let x: int;
            let y: int;
            let h: uint = 0;
            let radius: int = 1;
            let limit: int;
            let cursor: int;

            while (Constant.NULL === minHNode) {
                rangeX[0] = endX - radius;
                rangeX[1] = endX + radius;
                rangeY[0] = endY - radius;
                rangeY[1] = endY + radius;

                // for (y of rangeY) {
                for (cursor = 0; cursor < 2; ++cursor) {
                    y = rangeY[cursor];
                    if (y < 0 || y >= this._limitY) {
                        continue;
                    }

                    limit = rangeX[1] < this._limitX ? rangeX[1] : this._limitX;
                    for (x = rangeX[0] > 0 ? rangeX[0] : 0; x < limit; ++x) {
                        index = (this._limitX * y + x) * NodeFields.LIMIT;
                        value = this._map[index + NodeFields.VALUE];
                        if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                            continue;
                        }

                        h = Math.abs(startY - y) * Constant.VH + Math.abs(startX - x) * Constant.HH;
                        if (h < minH) {
                            minH = h;
                            minHNode = index;
                        }
                    }
                }

                rangeY[0] += 1;
                rangeY[1] -= 1;
                // for (x of rangeX) {
                for (cursor = 0; cursor < 2; ++cursor) {
                    x = rangeX[cursor];
                    if (x < 0 || x >= this._limitX) {
                        continue;
                    }

                    limit = rangeY[1] < this._limitY ? rangeY[1] : this._limitY;
                    for (y = rangeY[0] > 0 ? rangeY[0] : 0; y < limit; ++y) {
                        index = (this._limitX * y + x) * NodeFields.LIMIT;
                        value = this._map[index + NodeFields.VALUE];
                        if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                            continue;
                        }

                        h = Math.abs(startY - y) * Constant.VH + Math.abs(startX - x) * Constant.HH;
                        if (h < minH) {
                            minH = h;
                            minHNode = index;
                        }
                    }
                }
                ++radius;
            }

            return minHNode;
        }

        public find(startX: uint, startY: uint, endX: uint, endY: uint, motion: uint = 5, auth: uint = 0, result: Array<Point> = null): Array<Point> {
            this._open.length = 0;
            this._closeID = this._openID + 1;
            this._openID = this._openID + 2;

            let counter: uint = 0;
            let node: uint = this.findReplacer(startX, startY, startX, startY, motion, auth);
            startX = this._map[node + NodeFields.X];
            startY = this._map[node + NodeFields.Y];
            node = this.findReplacer(startX, startY, endX, endY, motion, auth);
            endX = this._map[node + NodeFields.X];
            endY = this._map[node + NodeFields.Y];

            const end: uint = (this._limitX * endY + endX) * NodeFields.LIMIT;
            let minHNode: uint = this.pushToOpen(startX, startY, 0, Math.abs(endY - startY) * Constant.VH + Math.abs(endX - startX) * Constant.HH, Constant.NULL);

            let child: uint;
            let parent: uint;
            let value: uint;
            let g: uint;
            let i: uint;
            let len: uint = OffsetList.length;

            let col: int = endX;
            let row: int = endY;

            let x: int = startX;
            let y: int = startY;
            // let direction: uint = (x < col ? 0 : (x === col ? 1 : 2)) + (y < row ? 0 : (y === row ? 3 : 6));

            while (0 != this._open.length) {
                if (++counter >= 30000) {
                    return this.buildPath(minHNode, result);
                }

                node = this.popFromOpen();
                if (node === end) {
                    return this.buildPath(node, result);
                }

                col = this._map[node + NodeFields.X];
                row = this._map[node + NodeFields.Y];

                parent = this._map[node + NodeFields.PARENT];
                if (Constant.NULL != parent) {
                    x = this._map[parent + NodeFields.X];
                    y = this._map[parent + NodeFields.Y];
                    // direction = (x < col ? 0 : (x === col ? 1 : 2)) + (y < row ? 0 : (y === row ? 3 : 6));
                }

                //检测连通点
                for (i = 0; i < len; i += 4) {
                    x = col + OffsetList[i];
                    if (x < 0 || x >= this._limitX) {
                        continue;
                    }

                    y = row + OffsetList[i + 1];
                    if (y < 0 || y >= this._limitY) {
                        continue;
                    }

                    child = (this._limitX * y + x) * NodeFields.LIMIT;

                    value = this._map[child + NodeFields.VALUE];
                    if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                        continue;
                    }

                    if (this._map[child + NodeFields.MARK] === this._closeID) {
                        continue;
                    }

                    // if (OffsetList[i + 3] === direction) {
                    //     g = this._map[node + NodeFields.G];
                    // } else {
                    g = this._map[node + NodeFields.G] + OffsetList[i + 2];
                    // }

                    if (this._map[child + NodeFields.MARK] === this._openID) {
                        if (g < this._map[child + NodeFields.G]) {
                            this._map[child + NodeFields.PARENT] = node;
                            this._map[child + NodeFields.G] = g;
                            this._map[child + NodeFields.F] = g + this._map[child + NodeFields.H];
                            this.shiftUp(this._map[child + NodeFields.POINTER], child);
                        }
                    } else {
                        child = this.pushToOpen(x, y, g, Math.abs(endY - y) * Constant.VH + Math.abs(endX - x) * Constant.HH, node);

                        if (this._map[child + NodeFields.H] < this._map[minHNode + NodeFields.H]) {
                            minHNode = child;
                        }
                    }
                }

                //检测跳跃点
                child = this._map[node + NodeFields.CHILDREN];
                if (Constant.NULL === child) {
                    continue;
                }

                value = this._map[child + NodeFields.VALUE];
                if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                    continue;
                }

                if (this._map[child + NodeFields.MARK] === this._closeID) {
                    continue;
                }

                g = this._map[node + NodeFields.G] + 0;
                if (this._map[child + NodeFields.MARK] === this._openID) {
                    if (g < this._map[child + NodeFields.G]) {
                        this._map[child + NodeFields.PARENT] = node;
                        this._map[child + NodeFields.G] = g;
                        this._map[child + NodeFields.F] = g + this._map[child + NodeFields.H];
                        this.shiftUp(this._map[child + NodeFields.POINTER], child);
                    }
                } else {
                    x = this._map[child + NodeFields.X];
                    y = this._map[child + NodeFields.Y];
                    child = this.pushToOpen(x, y, g, Math.abs(endY - y) * Constant.VH + Math.abs(endX - x) * Constant.HH, node);

                    if (this._map[child + NodeFields.H] < this._map[minHNode + NodeFields.H]) {
                        minHNode = child;
                    }
                }
            }

            return this.buildPath(minHNode, result);
        }

        private pushToOpen(x: uint, y: uint, g: uint, h: uint, parent: uint): uint {
            let index: uint = (this._limitX * y + x) * NodeFields.LIMIT;
            this._map[index + NodeFields.PARENT] = parent;
            this._map[index + NodeFields.G] = g;
            this._map[index + NodeFields.H] = h;
            this._map[index + NodeFields.F] = g + h;
            this._map[index + NodeFields.MARK] = this._openID;
            this._open.push(index);
            this.shiftUp(this._open.length - 1, index);

            return index;
        }

        private popFromOpen(): uint {
            let result: uint = this._open[0];
            let value: uint = this._open.pop();

            if (0 != this._open.length) {
                this.shiftDown(0, value);
            }

            this._map[result + NodeFields.MARK] = this._closeID;
            return result;
        }

        private shiftDown(i: uint, e: uint): void {
            let l: uint = (i << 1) + 1;
            let r: uint = l + 1;
            let count: uint = this._open.length;
            let v: uint;
            while (l < count) {
                v = this._open[l];
                if (r < count && this._map[v + NodeFields.F] > this._map[this._open[r] + NodeFields.F]) {
                    v = this._open[r];
                    l = r;
                }

                if (this._map[e + NodeFields.F] < this._map[v + NodeFields.F]) {
                    break;
                }

                this._map[v + NodeFields.POINTER] = i;
                this._open[i] = v;
                i = l;
                l = (i << 1) + 1;
                r = l + 1;
            }

            this._map[e + NodeFields.POINTER] = i;
            this._open[i] = e;
        }

        private shiftUp(i: uint, e: uint): void {
            let p: uint = (i - 1) >> 1;
            let v: uint;
            while (0 != i) {
                v = this._open[p];
                if (this._map[v + NodeFields.F] <= this._map[e + NodeFields.F]) {
                    break;
                }

                this._map[v + NodeFields.POINTER] = i;
                this._open[i] = v;
                i = p;
                p = (i - 1) >> 1;
            }

            this._map[e + NodeFields.POINTER] = i;
            this._open[i] = e;
        }

        public isNeedKeep(pos: Point): boolean {
            let index: uint = (this._limitX * pos.y + pos.x) * NodeFields.LIMIT;
            return (this._map[index + NodeFields.VALUE] & Constant.KEEP) != 0;
        }

        private buildPath(node: uint, result: Array<Point>): Array<Point> {
            if (result == null) {
                result = [];
            }
            result.length = 0;

            if (Constant.NULL === node || Constant.NULL === this._map[node + NodeFields.PARENT]) {
                return result;
            }

            let start: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
            node = this._map[node + NodeFields.PARENT];
            result.push(start);

            let end: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
            let old: uint = node;
            node = this._map[node + NodeFields.PARENT];

            let target: Point;
            while (Constant.NULL != node) {
                target = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
                if (this._map[old + NodeFields.VALUE] & Constant.KEEP || 0 != this.direction(start, end, target)) {
                    result.push(end);
                    start = end;
                }
                end = target;
                old = node;
                node = this._map[node + NodeFields.PARENT];
            }

            return result;
        }

        // private buildPath(node: uint, result: Array<Point>): Array<Point> {
        //     if (result === null) {
        //         result = [];
        //     }
        //
        //     if (Constant.NULL === node || Constant.NULL === this._map[node + NodeFields.PARENT]) {
        //         return result;
        //     }
        //
        //     let start: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
        //     node = this._map[node + NodeFields.PARENT];
        //     result.unshift(start);
        //
        //     let end: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
        //     let old: uint = node;
        //     node = this._map[node + NodeFields.PARENT];
        //
        //     let target: Point;
        //     while (Constant.NULL != node) {
        //         target = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
        //         if (this._map[old + NodeFields.VALUE] & 0x80000000 || 0 != this.direction(start, end, target)) {
        //             result.unshift(end);
        //             start = end;
        //         }
        //         end = target;
        //         old = node;
        //         node = this._map[node + NodeFields.PARENT];
        //     }
        //
        //     return result;
        // }

        /*private _tempPaths: Array<Point> = [];

        private buildPath(node: uint, result: Array<Point>, motion: uint, auth: uint): Array<Point> {
            if (result === null) {
                result = [];
            }
            result.length = 0;

            if (Constant.NULL === node || Constant.NULL === this._map[node + NodeFields.PARENT]) {
                return result;
            }

            let paths = this._tempPaths;
            paths.length = 0;

            let start: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
            node = this._map[node + NodeFields.PARENT];
            paths.push(start);

            let end: Point = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
            let old: uint = node;
            node = this._map[node + NodeFields.PARENT];

            let target: Point;
            while (Constant.NULL != node) {
                target = new Point(this._map[node + NodeFields.X], this._map[node + NodeFields.Y]);
                if (this._map[old + NodeFields.VALUE] & 0x80000000 || 0 != this.direction(start, end, target)) {
                    paths.push(end);
                    start = end;
                }
                end = target;
                old = node;
                node = this._map[node + NodeFields.PARENT];
            }

            if (paths.length < 2) {
                result.push(paths.pop());
            } else {
                start = end;
                do {
                    target = paths.pop();
                    let index: uint = (this._limitX * target.y + target.x) * NodeFields.LIMIT;
                    if (this._map[index + NodeFields.VALUE] & 0x80000000) {
                        result.push(target);
                        start = target;
                    } else {
                        if (paths.length != 0) {
                            break;
                        }
                        end = paths.pop();
                        index = (this._limitX * end.y + end.x) * NodeFields.LIMIT;

                        let stepX = start.x > end.x ? -1 : (start.x === end.x ? 0 : 1);
                        let stepY = start.y > end.y ? -1 : (start.y === end.y ? 0 : 1);

                        let y = start.y;
                        let x = start.x;
                        let unobstructed = true;
                        if (stepX === 0) {
                            while (y != end.y) {
                                index = (this._limitX * y + x) * NodeFields.LIMIT;
                                let value = this._map[index + NodeFields.VALUE];
                                if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                                    unobstructed = false;
                                    break;
                                }
                                y += stepY;
                            }
                        }
                        if (stepY === 0) {
                            while (x != end.x) {
                                index = (this._limitX * y + x) * NodeFields.LIMIT;
                                let value = this._map[index + NodeFields.VALUE];
                                if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                                    unobstructed = false;
                                    break;
                                }
                                x += stepX;
                            }
                        } else {
                            for (let y = start.y; y != end.y; y += stepY) {
                                for (let x = start.x; x != end.x; x += stepX) {
                                    let value = this._map[index + NodeFields.VALUE];
                                    if (((value & 0x70) >> 4) > motion || (value & 0x0F) > auth) {
                                        unobstructed = false;
                                        break;
                                    }
                                }
                            }
                        }

                        if (unobstructed) {
                            target = end;
                        } else {
                            result.push(target);
                            start = target;
                        }
                    }
                } while (paths.length != 0);


                for (let i = 0; i < paths.length; ++i) {
                    target = paths[i];
                    let index: uint = (this._limitX * end.y + end.x) * NodeFields.LIMIT;
                }

                target = paths[0];
                for (let i = 1; i < paths.length; ++i) {
                    end = paths[i];
                    let index: uint = (this._limitX * end.y + end.x) * NodeFields.LIMIT;

                    let stepX = start.x > end.x ? -1 : (start.x === end.x ? 0 : 1);
                    let stepY = start.y > end.y ? -1 : (start.y === end.y ? 0 : 1);

                    for (let x = start.x; x <= end.x; x += stepX) {
                        for (let y = start.y; y <= end.y; y += stepY) {

                        }
                    }
                }
            }

            return result;
        }*/

        private direction(start: Point, end: Point, target: Point): number {
            return (start.x - target.x) * (end.y - target.y) - (end.x - target.x) * (start.y - target.y);
        }
    }
}