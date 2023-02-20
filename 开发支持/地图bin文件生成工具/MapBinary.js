/**
 * 描述：九州地图生成工具
 * 作者：by 杉木说
 * 日期：2022-07-21
 * */

const Buffer = require('buffer').Buffer;
const fs = require('fs');
const zlib = require('zlib');
const nodeXlsx = require("node-xlsx");
const path = require('path');

/*******************************************************/
/**********************地图生成配置**********************/
/*******************************************************/
function MapConfig() {
    this.map_id;                                     /*地图id*/
    this.map_width;                                  /*完整地图宽度*/
    this.map_heigth;                                 /*完整地图高度*/
    this.split_width;                                /*地图切片宽度 -- 一般为512*/
    this.split_height;                               /*地图切片高度 -- 一般为512*/
    this.cell_width;                                 /*单元格宽度 -- 一般为16*/
    this.cell_height;                                /*单元格高度 -- 一般为16*/
    this.map_files_url;                              /*地图文件存放地址，生成地图数据时使用*/
    this.spawn_points;                               /*出生点-数组形式*/
    this.monster_counts;                             /*出生点怪物的数量-数组形式*/
    this.spawn_points_byte_length;                   /*出生点-存储需要的字节计数*/
    this.path_node;                                  /*寻路点-数组形式*/
    this.path_node_byte_length;                      /*寻路点-存储需要的字节计数*/
    this.comments;                                   /*注释-对生成地图无影响*/
    this.not_access_y_cell_count;                    /*y轴寻路不能通过的单元格数量，从上往下数*/
}

/*******************************************************/
/***********************执行方法************************/
/*******************************************************/

// 生成类型和前缀
let client_type = "client";
let server_type = "server";

// 地图切页默认写入的格式 .jpg=2 .til=1 .png=3 
let defaultWriteType = 3;

// 入口方法
function start() {
    // 读取excel表格
    let __path = path.join(__dirname, "地图文件生成配置表.xlsx");
    let all_shells = nodeXlsx.parse(__path);
    let sheet = all_shells[0];

    // 将数据保存到对象数组中
    let allrows = sheet.data
    // 保存列字段
    let fieldArr = allrows[0];
    let fieldDescArr = allrows[1];

    for (var i = 2; i < allrows.length; i++) {
        let row = allrows[i]
        let map_id = -1;
        // console.log(`${sheet.name}表  第${i + 1}行 数据: ${row}`);=
        let map_data = new MapConfig();
        //该行每列的的数据
        for (let index = 0; index < row.length; index++) {
            let column = row[index];
            // console.log(`${sheet.name}表  第${i + 1}行 第${index + 1}列的 数据: ${column}`);

            // 获取到地图id
            if (fieldArr[index] == "map_id") map_id = column;

            // 出生点和寻路点
            if (fieldArr[index] == "spawn_points" || fieldArr[index] == "path_node") {
                if (column == undefined || column == null) {
                    console.log(`当前地图（${map_id}）没有配置【${fieldDescArr[index]}】属性!!! 【${column}】`);
                    continue;
                }
                let dataArrays = compositeArray(column);
                map_data[fieldArr[index]] = dataArrays[0];
                map_data[fieldArr[index] + "_byte_length"] = dataArrays[1];
            }
            else {
                map_data[fieldArr[index]] = column;
            }
        }

        // 获取到一个地图的数据。处理数据！
        if (map_id != -1) {
            // console.log(`地图${map_id}的配置文件：`, map_data);
            doHandle(writeData(map_data, client_type), map_id, client_type);
            doHandle(writeData(map_data, server_type), map_id, server_type);
        } else {
            console.log(`请检测第${i}行是否为空数据！！！`);
        }
    }
}

// 检查目录是否存在.不存在则创建
function checkAndMkDir(dir) {
    if (!fs.existsSync(dir)) {
        let parentDir = path.parse(dir).dir;
        if (!fs.existsSync(parentDir)) {
            checkAndMkDir(parentDir)
        }
        fs.mkdirSync(dir)
    }
}

// 合成三维数组（形参规则 ,,,#,,|,#,,#,,|,,#,,,）
function compositeArray(str) {
    let outSiteArr = [];
    let bigArr = str.split("|");
    let needByteLen = 0;

    for (let index = 0; index < bigArr.length; index++) {
        const str_temp = bigArr[index];
        let midArr = str_temp.split("#");
        let midArrOut = [];

        for (let i = 0; i < midArr.length; i++) {
            let singleArr = midArr[i];
            singleArr = singleArr.split(",");
            midArrOut.push(singleArr);
            // 描述信息长度
            needByteLen += 2;
            // 位置点位长度
            needByteLen += 4;
        }
        outSiteArr.push(midArrOut);
    }
    // 返回二维数组和需要存取时需要的字节长度
    return [outSiteArr, needByteLen];
}

// 计算分配的字节长度
function calcAllocLength(map_data, type) {
    // 1.默认使用的字节长度
    let len = 10;

    // 服务端只有6个字节 不需要splitwidth，splitheight
    if (type == server_type) {
        len = 6;
    }

    // 2.地图切片占用的字节(客户端才需要这个)
    if (type == client_type) {
        let split_cols = map_data.map_width / map_data.split_width;
        let split_rows = map_data.map_heigth / map_data.split_height;
        len += split_rows * split_cols;
    }

    // 3.单元格（cell）宽、高度各占一个字节
    len += 2;

    // 4.单元格地图数据占用的位移 cell_rows * cell_cols;
    let cell_cols = map_data.map_width / map_data.cell_width;
    let cell_rows = map_data.map_heigth / map_data.cell_height;
    len += cell_cols * cell_rows;

    // 5.出生点数量计数占用一个字节
    len += 1;

    // 6.出生点占用的字节
    len += map_data.spawn_points_byte_length;

    // 7.寻路点计数占用一个字节
    len += 1;

    // 8.寻路点占用字节
    len += map_data.path_node_byte_length;

    // 9.地图可通过的行数
    // len += 1;

    // console.log(type + " 预计需要分配空间大小：" + len);
    return len;
}

// 写数据 （切记，写入顺序不能变！！！）
function writeData(map_data, type) {
    // 分配带有内存字节数组
    let bufferArr = Buffer.alloc(calcAllocLength(map_data, type));

    // 写入偏移量
    let offset = 0;

    // 地图id
    offset = bufferArr.writeInt16LE(map_data.map_id, offset);

    // 完整地图宽高
    offset = bufferArr.writeInt16LE(map_data.map_width, offset);
    offset = bufferArr.writeInt16LE(map_data.map_heigth, offset);

    // 只有客户端需要这些数据
    if (type == client_type) {
        // 切片地图宽高
        offset = bufferArr.writeInt16LE(map_data.split_width, offset);
        offset = bufferArr.writeInt16LE(map_data.split_height, offset);

        // 地图切片占用的字节.后续的图片都为.jpg结尾所以都为2
        offset = writeSplitType(map_data, bufferArr, offset);
    }

    // 单元格宽高 
    offset = bufferArr.writeUInt8(map_data.cell_width, offset);
    offset = bufferArr.writeUInt8(map_data.cell_height, offset);

    // 单元格地图数据占用的位移 cell_rows * cell_cols;
    let cell_cols = map_data.map_width / map_data.cell_width;
    let cell_rows = map_data.map_heigth / map_data.cell_height;

    // 单元格地图数据对应的值 [0->0,15->1,128->2,143->3]其中之一
    let not_access_y_cell_count = map_data.not_access_y_cell_count;
    for (let x = 0; x < cell_rows; x++) {
        for (let y = 0; y < cell_cols; y++) {
            // 不可通过的单元行 -- 15
            if (x <= not_access_y_cell_count) {
                offset = bufferArr.writeUInt8(15, offset);
            }
            // 可以通过的单元行 -- 0
            else {
                offset = bufferArr.writeUInt8(0, offset);
            }
        }
    }

    // console.log(map_data.spawn_points);
    // 出生点 --新代码
    offset = bufferArr.writeUInt8(map_data.spawn_points.length, offset);
    for (let index = 0; index < map_data.spawn_points.length; index++) {
        const sps = map_data.spawn_points[index];

        offset = bufferArr.writeUInt8(index + 1, offset);               //id
        // console.log(offset, index + 1);
        offset = bufferArr.writeUInt8(sps.length, offset);              //count
        // console.log(offset, sps.length);

        for (let index = 0; index < sps.length; index++) {
            let arr = sps[index];

            let realVal = parseInt(arr[1] * cell_cols) + parseInt(arr[0]);
            offset = bufferArr.writeUInt32LE(realVal, offset);            //具体点位
            // console.log(offset, realVal);
        }
    }

    // 寻路点
    offset = bufferArr.writeUInt8(map_data.path_node.length, offset);
    for (let index = 0; index < map_data.path_node.length; index++) {
        const pn = map_data.path_node[index];

        offset = bufferArr.writeUInt8(index + 1, offset);               //id
        // console.log(offset, index + 1);
        offset = bufferArr.writeUInt8(pn.length, offset);              //count
        // console.log(offset, pn.length);

        for (let index = 0; index < pn.length; index++) {
            let arr = pn[index];

            let realVal = parseInt(arr[1] * cell_cols) + parseInt(arr[0]);
            offset = bufferArr.writeUInt32LE(realVal, offset);            //具体点位
            // console.log(offset, realVal);
        }
    }

    // 角色不可通过的行数（从上往下数）
    // offset = bufferArr.writeUInt8(not_access_y_cell_count, offset);

    // console.log("实际写入的字节长度：" + offset);
    return bufferArr;
}

// 写入地图切片的类型
function writeSplitType(map_data, bufferArr, offset) {
    let map_id = map_data.map_id.toString();
    let map_root_path = path.join(__dirname, "map", map_id);
    let url = map_data.map_files_url
    // 是否配置了地图路径，是则替换为设置的地址
    if (url != null && url != undefined && url != "null" && url.trim() != "") {
        map_root_path = url.toString();
    }
    // 地图切片占用的字节.后续的图片都为.jpg结尾所以都为2
    let split_cols = map_data.map_width / map_data.split_width;
    let split_rows = map_data.map_heigth / map_data.split_height;
    // console.log(split_rows, split_cols);

    // flag
    let notEnoughImg = false;
    for (let x = 0; x < split_rows; x++) {
        for (let y = 0; y < split_cols; y++) {
            let tilEnd = path.join(map_root_path, `${x}_${y}.til`);
            let jpgEnd = path.join(map_root_path, `${x}_${y}.jpg`);
            let pngEnd = path.join(map_root_path, `${x}_${y}.png`);

            // console.log("x:", x, "y", y);
            // 根据后缀写入数据.jpg=2 .til=1 .png=3 没找到则写入默认值=2但需提示
            if (fs.existsSync(tilEnd)) {
                offset = bufferArr.writeUInt8(1, offset);
            } else if (fs.existsSync(jpgEnd)) {
                offset = bufferArr.writeUInt8(2, offset);
            } else if (fs.existsSync(pngEnd)) {
                offset = bufferArr.writeUInt8(3, offset);
            } else {
                offset = bufferArr.writeUInt8(defaultWriteType, offset);
                notEnoughImg = true;
                // console.log(`警告:路径"${map_root_path}"下，地图(${map_id})的切片不存在：${x}_${y}.??? !!! 写入默认格式:${defaultWriteType}(${desc})`);
            }
        }
    }
    // 没有对应的地图切片
    if (notEnoughImg) {
        let desc = getMapWriteTypeDesc(defaultWriteType);
        console.log(`警告:路径"${map_root_path}"下，地图(${map_id})的切片有缺失.??? !!! 写入默认格式:${defaultWriteType}(${desc}) --【defaultWriteType】`);
    }

    return offset;
}

function getMapWriteTypeDesc(key) {
    switch (key) {
        case 1: return ".til";
        case 2: return ".jpg";
        case 3: return ".png";
        default: return ".???错误 -- !!!";
    }
}

// 压缩并写出到次持久化路径
function doHandle(bufferArr, map_id, type) {
    let origionLen = bufferArr.length;
    zlib.deflate(bufferArr, (err, result) => {
        if (!err) {
            let newLen = result.length;
            // console.log(`生成成功! 压缩前:${origionLen}字节！压缩后${newLen} 字节！【节省 ${origionLen - newLen} 字节】`);
            // bin文件写出地址
            let rootPath = type == "client" ? "client_bin" : "server_bin";
            let __dir = path.join(__dirname, "bins");
            let __path = path.join(__dir, rootPath, map_id + ".bin");
            let __checkDir;

            if (type == "client") {
                __path = path.join(__dir, rootPath, map_id.toString(), "main", "info.bin");
                __checkDir = path.join(__dir, rootPath, map_id.toString(), "main");
            } else {
                __checkDir = __dir + "/server_bin";
            }

            // 处理未存在的文件夹
            checkAndMkDir(__checkDir);

            // 写出到本地磁盘
            fs.writeFileSync(__path, result);
            console.log(`生成成功！${__path.toUpperCase()}`);
        } else {
            console.log("生成错误！", err);
        }
    });
}

// 入口方法
start();