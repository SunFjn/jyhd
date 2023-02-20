"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const msgpack5 = require("msgpack5");
const zlib = require("zlib");
const file_utils_1 = require("./utils/file_utils");
const uglify_js_1 = require("uglify-js");
const snowflake_utils_1 = require("./utils/snowflake_utils");
const path_filter_1 = require("./utils/path_filter");
const publish_1 = require("./publish");
function mergeShaders(root) {
    let table = {};
    const dirpath = path.join(root, "assets/shader");
    file_utils_1.walk(dirpath, (filepath, stats) => {
        if (stats.isDirectory()) {
            return false;
        }
        let ext = path.extname(filepath);
        if (ext != ".vert" && ext != ".frag") {
            return false;
        }
        let key = file_utils_1.formatPathSep(file_utils_1.splitRoot(filepath, root));
        table[key] = fs.readFileSync(filepath, { encoding: 'utf8' });
        return true;
    });
    const filepath = path.join(root, "assets/vf.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(msgpack5().encode(table)));
}
function readScript(filepath, mini = true, include = "", miniInclude = false, options) {
    let code = fs.readFileSync(filepath, { encoding: 'utf8' });
    if (include) {
        if (miniInclude) {
            let result = uglify_js_1.minify(include);
            include = result.code;
        }
    }
    if (mini) {
        let result = uglify_js_1.minify(code, options);
        code = result.code;
    }
    code = `${include}\n${code}`;
    return Buffer.alloc(Buffer.byteLength(code), code);
}
function mergeScripts(root) {
    let libs = ["core", "webgl", "html", "ui", "d3", "ani"];
    let includes = [];
    for (let name of libs) {
        let code = fs.readFileSync(path.join(root, `libs/laya.${name}.js`), { encoding: 'utf8' });
        includes.push(code);
    }
    let table = [
        readScript(path.join(root, "js/main.js"), true, includes.join("\n"), true, {
            compress: {
                global_defs: { DEBUG: false },
                drop_debugger: true
            }, mangle: false, output: { beautify: true }
        }),
        readScript(path.join(root, "routine.js"))
    ];
    let filepath = path.join(root, "assets/ss.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(msgpack5().encode(table)));
}
function mergeMaterials(root, materials) {
    let table = {};
    const dirpath = path.join(root, "assets/particle");
    for (let key of materials) {
        let filepath = path.join(dirpath, key);
        table[path.join("assets/particle", key)] = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8' }));
    }
    return table;
}
function mergeMeshs(root, meshs) {
    let table = {};
    const dirpath = path.join(root, "assets/particle");
    for (let key of meshs) {
        let filepath = path.join(dirpath, key);
        table[path.join("assets/particle", key)] = fs.readFileSync(filepath);
    }
    return table;
}
function exportBundleResource(bundle, materials, meshs) {
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
function mergeEffects(root) {
    let table = {};
    const dirpath = path.join(root, "assets/particle");
    file_utils_1.walk(dirpath, (filepath, stats) => {
        if (stats.isDirectory()) {
            return false;
        }
        let ext = path.extname(filepath);
        if (ext != ".lh") {
            return false;
        }
        let key = file_utils_1.formatPathSep(file_utils_1.splitRoot(filepath, root));
        let content = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8' }));
        table[key] = snowflake_utils_1.formatSnowflakeBundle(content);
        return true;
    });
    let materials = new Set();
    let meshs = new Set();
    for (let key in table) {
        exportBundleResource(table[key], materials, meshs);
    }
    let content = {
        "config": table,
        "meshs": mergeMeshs(root, Array.from(meshs)),
        "materials": mergeMaterials(root, Array.from(materials))
    };
    const filepath = path.join(root, "assets/ps.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(msgpack5().encode(content)));
}
function mergeAtlas(root) {
    let table = {};
    const callback = (filepath, stats) => {
        if (stats.isDirectory()) {
            return true;
        }
        let ext = path.extname(filepath);
        if (ext != ".atlas") {
            return false;
        }
        let key = file_utils_1.formatPathSep(file_utils_1.splitRoot(filepath, root));
        let content = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8' }));
        table[key] = content;
        return true;
    };
    file_utils_1.walk(root, callback);
    const filepath = path.join(root, "assets/as.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(msgpack5().encode(table)));
}
function mergeMapBin(root) {
    let table = {};
    const dirpath = path.join(root, "assets/map");
    file_utils_1.walk(dirpath, (filepath, stats) => {
        if (stats.isDirectory()) {
            return true;
        }
        let ext = path.basename(filepath);
        if (ext != "info.bin") {
            return false;
        }
        let key = file_utils_1.splitRoot(filepath, dirpath).split(path.sep)[0];
        table[key] = zlib.inflateSync(fs.readFileSync(filepath));
        return true;
    });
    const filepath = path.join(root, "assets/mb.obj");
    fs.writeFileSync(filepath, zlib.deflateSync(msgpack5().encode(table)));
}
function buildLoadingJS(exportPath, loadingRoot, root) {
    let db = {};
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
    let versions = {};
    for (let name of names) {
        if (db[name]) {
            versions[name] = db[name];
        }
    }
    let code = fs.readFileSync(path.join(loadingRoot, "loading.js"), { encoding: 'utf8' });
    code += "\nversions = " + JSON.stringify(versions);
    let result = uglify_js_1.minify(code, {
        compress: {
            global_defs: { DEBUG: false },
            drop_debugger: true
        }
    });
    code = result.code;
    fs.writeFileSync(path.join(root, "loading.js"), code);
}
async function publishResource(root, exportPath) {
    let filter = new path_filter_1.PathFilter([
        ".DS_Store",
        ".js",
        ".js.map",
        ".html",
        ".j",
        ".lh",
        ".lmat",
        ".lm",
        ".atlas",
        ".rec"
    ], ["version", "db.bin", "brother.big"], ["js", "libs", ".svn"], [], [], ["assets/map"]);
    let publish = new publish_1.Publish(root, exportPath, filter);
    await publish.run();
}
async function mergeFiles() {
    let t = Date.now();
    const root = path.resolve("../../bin/");
    const exportPath = path.resolve("../../bin/");
    console.log(root);
    console.log(exportPath);
    // mergeShaders(root);
    // mergeEffects(root);
    mergeScripts(root);
    mergeAtlas(root);
    mergeMapBin(root);
    file_utils_1.walk(root, (filepath, stats) => {
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
    console.log(`打包完成，耗时为：${(Date.now() - t) / 1000}`);
}
mergeFiles();
//# sourceMappingURL=merge_file.js.map