//版本文件生成工具

import * as path from "path";
import * as fs from "fs";
import * as msgpack5 from "msgpack5";
import * as zlib from "zlib";
import {PathFilter} from "./utils/path_filter";
import {fileToMD5, formatPathSep, splitRoot, walk} from "./utils/file_utils";

const keys = [
    [
        "111@qq.com",
        "P4BbC0lcBpfpq4JVP5J2xlgj8LjNqJ0b"
    ]
];

export class Publish {
    private readonly _root: string;
    private readonly _exportPath: string;
    private _version: number;
    private _db: Table<[string, number]>;
    private _files: Table<boolean>;
    private _needUpdate: boolean;
    private readonly _compressionList: Array<string>;
    private _updateFiles: number;
    private _updateExcludeCompressFiles: number;
    private _filter: PathFilter;
    private readonly _msgpack: msgpack5.MessagePack;

    constructor(root: string, exportPath: string, filter: PathFilter) {
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

    private initVersion(): void {
        let filepath = path.join(this._exportPath, "version");
        if (fs.existsSync(filepath)) {
            this._version = parseInt(fs.readFileSync(filepath, {encoding: 'utf8'}));
        } else {
            this._version = 0;
        }
    }

    private initDB(): void {
        let filepath = path.join(this._exportPath, "db.bin");
        if (fs.existsSync(filepath)) {
            this._db = this._msgpack.decode(zlib.inflateSync(fs.readFileSync(filepath)));
        } else {
            this._db = {};
        }
    }

    public async run(): Promise<void> {
        console.log("遍历文件");
        walk(this._root, this.collect);
        let total = 0;
        for (let _ in this._db) {
            ++total;
        }
        console.log(`总文件数为${total}, 更新文件数为${this._updateFiles}, 过滤压缩数为${this._updateExcludeCompressFiles}, 待压缩数为${this._compressionList.length}`);
        await this.compress();

        if (this._needUpdate) {
            console.log("更新version......");
            let filepath = path.join(this._exportPath, "version");
            fs.writeFileSync(filepath, (this._version + 1).toString(), {encoding: 'utf8'});
        }
        this.exportDB();
        this.exportCheck();
        console.log(`生成完成！当前资源版本号为${this._needUpdate ? this._version + 1 : this._version}`);
    }

    private exportDB() {
        let db: Table<[string, number]> = {};
        for (let name in this._db) {
            if (this._filter.isExclude(name) || !this._files[name]) {
                continue;
            }
            db[name] = this._db[name];
        }
        this._db = db;
        console.log("更新db.bin......");
        let filepath = path.join(this._exportPath, "db.bin");
        fs.writeFileSync(filepath, zlib.deflateSync(<any>this._msgpack.encode(this._db)));
    }

    private exportCheck() {
        let size = 0;
        let check: Table<number> = {};
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
        fs.writeFileSync(filepath, zlib.deflateSync(<any>this._msgpack.encode(check)));
    }

    private async compress(): Promise<void> {
        return;
    }

    private collect = (filepath: string, stats: fs.Stats): boolean => {
        let key = formatPathSep(splitRoot(filepath, this._root));
        if (this._filter.isExclude(key)) {
            return false;
        }

        if (stats.isDirectory()) {
            return true;
        }
        this._files[key] = true;

        let md5 = fileToMD5(filepath);
        let tuple = this._db[key];
        if (tuple != null && tuple[0] === md5) {
            return false;
        }
        this._needUpdate = true;
        let ext = path.extname(filepath).toLowerCase();
        if ((ext == ".jpg" || ext == ".png")) {
            if (this._filter.isExcludeCompress(key)) {
                this._db[key] = [md5, this._version + 1];
                this._updateExcludeCompressFiles++;
            } else {
                this._compressionList.push(filepath);
            }
        } else {
            this._db[key] = [md5, this._version + 1];
        }
        this._updateFiles++;

        return true;
    };
}

// let filter = new PathFilter([
//         ".DS_Store"
//         , ".js"
//         , ".js.map"
//         , ".html"
//         , ".j"
//         , ".lh"
//         , ".lmat"
//         , ".lm"
//         , ".atlas"
//         , "as.obj"
//         , "ls.obj"
//         , "mb.obj"
//         , "ps.obj"
//         , "ss.obj"
//     ],//过滤的文件名或者扩展名
//     ["version", "db.bin", "brother.big"],//过滤的文件
//     ["js", "libs", ".svn"],//过滤的文件夹
//     [],//过滤压缩的文件名或者扩展名
//     [],//过滤压缩的文件夹
//     ["assets/map"]//过滤压缩的文件夹
// );
//
// const root = path.resolve("../client/bin/");
// const exportPath = path.resolve("../client/bin/");
// // const root = path.resolve("/Users/xiaoxuchu/Jobs/game/test/client/");
// // const exportPath = path.resolve("/Users/xiaoxuchu/Jobs/game/test/client/");
// // const root = path.resolve("../client/laya/assets/");
// // const exportPath = path.resolve("../client/laya/");
// // const root = path.resolve("/Users/xiaoxuchu/Jobs/bin");
// // const exportPath = path.resolve("/Users/xiaoxuchu/Jobs/bin");
// let publish = new Publish(root, exportPath, filter);
// publish.run();
