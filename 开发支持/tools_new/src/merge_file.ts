import * as path from "path";
import * as fs from "fs";
import * as msgpack5 from "msgpack5";
import * as zlib from "zlib";
import {formatPathSep, splitRoot, walk} from "./utils/file_utils";
import {minify, MinifyOptions} from "uglify-js";
import {formatSnowflakeBundle} from "./utils/snowflake_utils";
import {SnowflakeBundle} from "../libs/interface";
import {PathFilter} from "./utils/path_filter";
import {Publish} from "./publish";

function mergeShaders(root: string): void {
    let table: Table<string> = {};
    const dirpath = path.join(root, "res/shader");
    walk(dirpath, (filepath: string, stats: fs.Stats): boolean => {
        if (stats.isDirectory()) {
            return false;
        }

        let ext = path.extname(filepath);
        if (ext != ".vert" && ext != ".frag") {
            return false;
        }

        let key = formatPathSep(splitRoot(filepath, root));
        table[key] = fs.readFileSync(filepath, {encoding: 'utf8'});
        return true;
    });

    const filepath = path.join(root, "assets/vf.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(<any>msgpack5().encode(table)));
}

function readScript(filepath: string, mini: boolean = true, include: string = "", miniInclude: boolean = false, options?: MinifyOptions): Buffer {
    let code = fs.readFileSync(filepath, {encoding: 'utf8'});
    if (include) {
        if (miniInclude) {
            let result = minify(include);
            include = result.code;
        }
    }
    if (mini) {
        let result = minify(code, options);
        code = result.code;
    }
    code = `${include}\n${code}`;
    return Buffer.alloc(Buffer.byteLength(code), code);
}

function mergeScripts(root: string): void {
    //根据加载顺序
    let libs = ["core", "webgl", "html", "ui", "d3"];
    let includes: string[] = [];
    for (let name of libs) {
        let code = fs.readFileSync(path.join(root, `libs/laya.${name}.js`), {encoding: 'utf8'});
        includes.push(code);
    }
    //main必须在最前面
    let table: Array<Buffer> = [
        readScript(path.join(root, "js/main.js"), true, includes.join("\n"), true, {
            compress: {
                global_defs: {DEBUG: false},
                drop_debugger: true
            }, mangle: false, output: {beautify: true}
        }),
        // readScript(path.join(root, "js/main.js"), false, includes.join("\n"), true),
        readScript(path.join(root, "routine.js"))
    ];
    let filepath = path.join(root, "assets/ss.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(<any>msgpack5().encode(table)));
}

function mergeMaterials(root: string, materials: Array<string>): Table<string> {
    let table: Table<string> = {};
    const dirpath = path.join(root, "assets/particle");
    for (let key of materials) {
        let filepath = path.join(dirpath, key);
        table[path.join("assets/particle", key)] = JSON.parse(fs.readFileSync(filepath, {encoding: 'utf8'}));
    }
    return table;
}

function mergeMeshs(root: string, meshs: Array<string>): Table<Uint8Array> {
    let table: Table<Uint8Array> = {};
    const dirpath = path.join(root, "assets/particle");
    for (let key of meshs) {
        let filepath = path.join(dirpath, key);
        table[path.join("assets/particle", key)] = fs.readFileSync(filepath);
    }
    return table;
}

function exportBundleResource(bundle: SnowflakeBundle, materials: Set<string>, meshs: Set<string>): void {
    let customProps = bundle.customProps;
    if (customProps) {
        if (customProps.material && customProps.material.path) {
            materials.add(customProps.material.path);
        }
        if (customProps.materialPath) {
            console.log("--->>", customProps.materialPath);
            materials.add(customProps.materialPath);
        }
        if (customProps.texturePath) {
            console.log("--->", customProps.texturePath);
            materials.add(customProps.texturePath);
        }
        if (customProps.meshPath) {
            meshs.add(customProps.meshPath);
        }
    }
    let children = bundle.child;
    if (children) {
        for (let c of children) {
            exportBundleResource(c, materials, meshs);
        }
    }
}

function mergeEffects(root: string): void {
    let table: Table<SnowflakeBundle> = {};
    const dirpath = path.join(root, "assets/particle");
    walk(dirpath, (filepath: string, stats: fs.Stats): boolean => {
        if (stats.isDirectory()) {
            return false;
        }

        let ext = path.extname(filepath);
        if (ext != ".lh") {
            return false;
        }

        let key = formatPathSep(splitRoot(filepath, root));
        let content = JSON.parse(fs.readFileSync(filepath, {encoding: 'utf8'}));
        table[key] = formatSnowflakeBundle(content);
        return true;
    });

    let materials = new Set<string>();
    let meshs = new Set<string>();
    for (let key in table) {
        exportBundleResource(table[key], materials, meshs);
    }

    let content = {
        "config": table,
        "meshs": mergeMeshs(root, Array.from(meshs)),
        "materials": mergeMaterials(root, Array.from(materials))
    };
    const filepath = path.join(root, "assets/ps.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(<any>msgpack5().encode(content)));
}

function mergeAtlas(root: string): void {
    let table: Table<string> = {};
    const callback = (filepath: string, stats: fs.Stats): boolean => {
        if (stats.isDirectory()) {
            return true;
        }

        let ext = path.extname(filepath);
        if (ext != ".atlas") {
            return false;
        }

        let key = formatPathSep(splitRoot(filepath, root));
        let content = JSON.parse(fs.readFileSync(filepath, {encoding: 'utf8'}));
        table[key] = content;
        return true;
    };
    walk(root, callback);

    const filepath = path.join(root, "assets/as.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(<any>msgpack5().encode(table)));
}

function mergeMapBin(root: string): void {
    let table: Table<Uint8Array> = {};
    const dirpath = path.join(root, "assets/map");
    walk(dirpath, (filepath: string, stats: fs.Stats): boolean => {
        if (stats.isDirectory()) {
            return true;
        }

        let ext = path.basename(filepath);
        if (ext != "info.bin") {
            return false;
        }

        let key = splitRoot(filepath, dirpath).split(path.sep)[0];
        table[key] = zlib.inflateSync(fs.readFileSync(filepath));
        return true;
    });

    const filepath = path.join(root, "assets/mb.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(<any>msgpack5().encode(table)));
}


function buildLoadingJS(exportPath: string, loadingRoot: string, root: string) {
    let db: Table<number> = {};
    let filepath = path.join(exportPath, "brother.big");
    if (fs.existsSync(filepath)) {
        db = msgpack5().decode(zlib.inflateSync(fs.readFileSync(filepath)));
    }

    let names = [
        "image_loading_bg.jpg",
        "image_loading_bg_2.jpg",
        "progress_jz_jdt2_0.png",
        "progress_jz_jdt_1.png",
        "progress_jz_jdt1_0.png",
        "progress_jz_jdt_1.png",
        "icon_loading_nansfh.png",
        "icon_loading_nsfh.png",
        "assets/ss.obj"
    ];

    let versions: Table<number> = {};
    for (let name of names) {
        if (db[name]) {
            versions[name] = db[name];
        }
    }

    let code = fs.readFileSync(path.join(loadingRoot, "loading.js"), {encoding: 'utf8'});
    code += "\nversions = " + JSON.stringify(versions);
    let result = minify(code, {
        compress: {
            global_defs: {DEBUG: false},
            drop_debugger: true
        }
    });
    code = result.code;
    fs.writeFileSync(path.join(root, "loading.js"), code);
}

async function publishResource(root: string, exportPath: string): Promise<void> {
    let filter = new PathFilter([
            ".DS_Store"
            , ".js"
            , ".js.map"
            , ".html"
            , ".j"
            , ".lh"
            , ".lmat"
            , ".lm"
            , ".atlas"
            , ".rec"
        ],//过滤的文件名或者扩展名
        ["version", "db.bin", "brother.big"],//过滤的文件
        ["js", "libs", ".svn"],//过滤的文件夹
        [],//过滤压缩的文件名或者扩展名
        [],//过滤压缩的文件夹
        ["assets/map"]//过滤压缩的文件夹
    );

    let publish = new Publish(root, exportPath, filter);
    await publish.run();
}

async function mergeFiles() {
    let t = Date.now();
    const root = path.resolve("../client/bin/");
    const exportPath = path.resolve("../client/bin/");

    //const loadingRoot = path.resolve("../loading/bin/");

    mergeShaders(root);
    mergeEffects(root);
    mergeScripts(root);
    mergeAtlas(root);
    mergeMapBin(root);

    walk(root, (filepath: string, stats: fs.Stats): boolean => {
        if (stats.isDirectory()) {
            return true;
        }

        if (filepath.endsWith(".js.map")) {
            console.log(filepath);
            fs.unlinkSync(filepath);
            return false;
        }

        return true;
    });

    await publishResource(root, exportPath);
    //buildLoadingJS(exportPath, loadingRoot, root);
    console.log(`打包完成，耗时为：${(Date.now() - t) / 1000}`);
}

mergeFiles();
