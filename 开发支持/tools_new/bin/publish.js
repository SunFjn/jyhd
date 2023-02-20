"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publish = void 0;
const path = require("path");
const fs = require("fs");
const msgpack5 = require("msgpack5");
const zlib = require("zlib");
const file_utils_1 = require("./utils/file_utils");
const keys = [
    [
        "111@qq.com",
        "P4BbC0lcBpfpq4JVP5J2xlgj8LjNqJ0b"
    ]
];
class Publish {
    constructor(root, exportPath, filter) {
        this.collect = (filepath, stats) => {
            let key = file_utils_1.formatPathSep(file_utils_1.splitRoot(filepath, this._root));
			
            if (this._filter.isExclude(key)) {
                return false;
            }
            if (stats.isDirectory()) {
                return true;
            }
			
            this._files[key] = true;
            let md5 = file_utils_1.fileToMD5(filepath);
            let tuple = this._db[key];
            if (tuple != null && tuple[0] === md5) {
                return false;
            }
            this._needUpdate = true;
            let ext = path.extname(filepath).toLowerCase();
            if ((ext == ".jpg" || ext == ".png")) {
                if (!this._filter.isExcludeCompress(key)) {
                    this._db[key] = [md5, this._version + 1];
                    this._updateExcludeCompressFiles++;
                }
                else {
                    this._compressionList.push(filepath);
                }
            }
            else {
                this._db[key] = [md5, this._version + 1];
            }
            this._updateFiles++;
            return true;
        };
        this._msgpack = msgpack5();
        this._root = root;
        this._exportPath = exportPath;
        this._needUpdate = false;
        this._updateFiles = 0;
        this._updateExcludeCompressFiles = 0;
        this._compressionList = [];
        this._filter = filter;
        this._files = {};
        this.initVersion();
        this.initDB();
    }
    initVersion() {
        let filepath = path.join(this._exportPath, "version");
        if (fs.existsSync(filepath)) {
            this._version = parseInt(fs.readFileSync(filepath, { encoding: 'utf8' }));
        }
        else {
            this._version = 0;
        }
    }
    initDB() {
        let filepath = path.join(this._exportPath, "db.bin");
        if (fs.existsSync(filepath)) {
            this._db = this._msgpack.decode(zlib.inflateSync(fs.readFileSync(filepath)));
        }
        else {
            this._db = {};
        }
    }
    async run() {
        console.log("遍历文件");
        file_utils_1.walk(this._root, this.collect);
        let total = 0;
        for (let _ in this._db) {
            ++total;
        }
        console.log(`总文件数为${total}, 更新文件数为${this._updateFiles}, 过滤压缩数为${this._updateExcludeCompressFiles}, 待压缩数为${this._compressionList.length}`);
        await this.compress();
        if (this._needUpdate) {
            console.log("更新version......");
            let filepath = path.join(this._exportPath, "version");
            fs.writeFileSync(filepath, (this._version + 1).toString(), { encoding: 'utf8' });
        }
        this.exportDB();
        this.exportCheck();
        console.log(`生成完成！当前资源版本号为${this._needUpdate ? this._version + 1 : this._version}`);
    }
    exportDB() {
        let db = {};
        for (let name in this._db) {
            if (this._filter.isExclude(name) || !this._files[name]) {
                continue;
            }
            db[name] = this._db[name];
        }
        this._db = db;
        console.log("更新db.bin......");
        let filepath = path.join(this._exportPath, "db.bin");
        fs.writeFileSync(filepath, zlib.deflateSync(this._msgpack.encode(this._db)));
    }
    exportCheck() {
        let size = 0;
        let check = {};
        for (let name in this._db) {
            if (this._filter.isExclude(name) || !this._files[name]) {
                continue;
            }
            let tuple = this._db[name];
            check[name] = tuple[1];
            size++;
        }
        console.log("生成brother.big......", size);
        let filepath = path.join(this._exportPath, "brother.big");
        fs.writeFileSync(filepath, zlib.deflateSync(this._msgpack.encode(check)));
    }
    async compress() {
        return;
    }
}
exports.Publish = Publish;
//# sourceMappingURL=publish.js.map