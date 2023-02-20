"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* name;
* //node bin/PackageTools.js -v 1.0 -c fk
*/
var UglifyJs = require("uglify-js");
var JSZip = require("jszip");
var fs = require("fs");
// import { MD5 } from "./libs/MD5"
var FileManager_1 = require("./libs/FileManager");
var CURTARGET = "";
var CURDIR = process.cwd();
var DEBUG = false;
console.log("cur dir :" + CURDIR);
var makePwdarr = CURDIR.split("\\");
var makePwd = makePwdarr[makePwdarr.length - 2];
console.log("makePwd: " + makePwd);
var zip = new JSZip();
var fileMgr = FileManager_1.FileManager.instance;
var version = "0.0";
var c = "";
var needGenghuanBase = false;  //是否需要更换base基础版本 默认false;
if (process.argv.length > 0) {
    console.log("param : " + process.argv);
    process.argv.forEach(function (arg, index) {
        var i = index;
        if (index == 3) {
            version = arg.toString();
        }
        if (index == 5) {
            c = arg.toString();
        }
        if (index == 6) {
            needGenghuanBase = Boolean(Number(arg));
        }
        console.log("\tindex:" + index + "\tvalue: " , arg);
    });
}
var packstr = "makePack_" + c + ".json";
console.log("load makePack:" + packstr);
var PackJson = JSON.parse(fileMgr.loadFile(packstr).toString());
CURTARGET = PackJson["curChannel"];
if (CURTARGET != c) {
    console.error("input error param CURTARGET: " + CURTARGET);
}
DEBUG = PackJson["DEBUG"];
var BASEJSONHASH = PackJson["baseVersion"];
var BANBENVERSION = PackJson["BanbenVersion"];
var st = Date.now();
console.log("start timetemp:" + st);
console.log("current curchannel:" + CURTARGET);
console.log("current version:" + version);
var RootPath = "../bin";
var TarPath = "../release/" + CURTARGET;
var ReleasePath = "../release";
// var CacheDir = "../cache";
// var CachePngJson = JSON.parse(fileMgr.loadFile(CacheDir + "/cache.json").toString());
var window = window || global;
var document = document || (window.document = {});
var XML2ObjectNodejs = /** @class */ (function () {
    function XML2ObjectNodejs() {
        this._arrays = null;
        this.ChildrenSign = "childNodes";
    }
    Object.defineProperty(XML2ObjectNodejs, "instance", {
        get: function () {
            return XML2ObjectNodejs._ins || (XML2ObjectNodejs._ins = new XML2ObjectNodejs), XML2ObjectNodejs._ins;
        },
        enumerable: false,
        configurable: true
    });
    XML2ObjectNodejs.prototype.parse = function (node, isFirst) {
        (isFirst === void 0) && (isFirst = true);
        var obj = {};
        if (isFirst) {
            obj.Name = node.localName;
        }
        var numOfChilds = node[this.ChildrenSign] ? node[this.ChildrenSign].length : 0;
        var childs = [];
        var children = {};
        obj.c = children;
        obj.cList = childs;
        var numOfAttributes = 0;
        var value;
        for (var i = 0; i < numOfChilds; i++) {
            var childNode = node[this.ChildrenSign][i];
            var childNodeName = childNode.localName;
            numOfAttributes = 0;
            if (!childNodeName)
                continue;
            value = this.parse(childNode, true);
            if (childNode["outerHTML"]) {
                value.html = childNode["outerHTML"];
            }
            childs.push(value);
            if (children[childNodeName]) {
                if (this.getTypeof(children[childNodeName]) == "array") {
                    children[childNodeName].push(value);
                }
                else {
                    children[childNodeName] = [children[childNodeName], value];
                }
            }
            else if (this.isArray(childNodeName)) {
                children[childNodeName] = [value];
            }
            else {
                children[childNodeName] = value;
            }
        }
        numOfAttributes = 0;
        if (node.attributes) {
            numOfAttributes = node.attributes.length;
            var prop = {};
            obj.p = prop;
            for (var i = 0; i < numOfAttributes; i++) {
                prop[node.attributes[i].name.toString()] = String(node.attributes[i].nodeValue);
            }
        }
        if (numOfChilds == 0) {
            if (numOfAttributes == 0) {
            }
            else { }
        }
        return obj;
    };
    XML2ObjectNodejs.prototype.getArr = function (v) {
        if (!v) {
            return [];
        }
        if (this.getTypeof(v) == "array")
            return v;
        return [v];
    };
    XML2ObjectNodejs.prototype.isArray = function (nodeName) {
        var numOfArrays = this._arrays ? this._arrays.length : 0;
        for (var i = 0; i < numOfArrays; i++) {
            if (nodeName == this._arrays[i]) {
                return true;
            }
        }
        return false;
    };
    XML2ObjectNodejs.prototype.getTypeof = function (o) {
        if (typeof (o) == "object") {
            if (o.length == null) {
                return "object";
            }
            else if (typeof (o.length) == "number") {
                return "array";
            }
            else {
                return "object";
            }
        }
        else {
            return typeof (o);
        }
    };
    return XML2ObjectNodejs;
}());
//MergeJs
var MergeJs = /** @class */ (function () {

    function MergeJs() {
        console.log("into MergeJs");
    }
    MergeJs.prototype.parseXmlFromString = function (xmlString) {
        var xmld;
        var DOMParser = require("xmldom").DOMParser;
        xmld = (new DOMParser()).parseFromString(xmlString, "text/xml");
        return xmld;
    };
    MergeJs.prototype.findAllScriptNode = function (xmlO, rst) {
        if (xmlO.Name == "script") {
            rst.push(xmlO);
        }
        var childs;
        childs = xmlO.cList;
        if (childs) {
            var i = 0, len = 0;
            len = childs.length;
            for (i = 0; i < len; i++) {
                this.findAllScriptNode(childs[i], rst);
            }
        }
    };
    MergeJs.prototype.getScriptPathFromScriptO = function (scriptO) {
        if (scriptO.p && scriptO.p.src) {
            return scriptO.p.src;
        }
        return null;
    };
    MergeJs.prototype.getScriptPathFromHtml = function (htmlFile) {
        var txt;
        txt = this.loadFile(htmlFile);
        var xmlO;
        xmlO = this.parseXmlFromString(txt);
        var obj;
        obj = XML2ObjectNodejs.instance.parse(xmlO);
        var scriptList = [];
        this.findAllScriptNode(obj, scriptList);
        var scriptPathList = [];
        var i = 0, len = 0;
        var tPath;
        len = scriptList.length;
        for (i = 0; i < len; i++) {
            tPath = this.getScriptPathFromScriptO(scriptList[i]);
            if (tPath) {
                scriptPathList.push(tPath);
            }
        }
        return scriptPathList;
    };
    MergeJs.prototype.mergeJS = function (htmlFile, fileDic) {
        if (!fs.existsSync(htmlFile)) {
            return;
        }
        var scriptList = this.getScriptPathFromHtml(htmlFile);
        var basePath = fileMgr.getBaseName(htmlFile);
        var i = 0, len = 0;
        len = scriptList.length;
        var libs = [];
        var contentList = [];
        var oneArray = [];
        var tFile;
        var rPath;
        var constStr1 = "var __extends = (this && this.__extends)|| function(){";
        var constStr2 = "function __() {this.constructor = d;}";
        var constStr3 = "})()";
        var count = 0;
        for (i = 0; i < len; i++) {
            rPath = basePath + "/" + scriptList[i];
            if (!fs.existsSync(rPath)) {
                continue;
            }
            var index = rPath.indexOf("/libs/");
            var data = this.loadFile(rPath);
            if (index > -1) {
                console.log(rPath);
                //排除第三方库
                var find = -1;
                var arrayThird = ["/jszip.js", "jszip-utils.js", "aksdk.js", "laya.debugtool.js"];
                for (var i_1 = 0; i_1 < arrayThird.length; i_1++) {
                    var element = arrayThird[i_1];
                    find = rPath.indexOf(element);
                    if (find > -1) {
                        break;
                    }
                }
                if (find > -1) {
                    console.log("expect file:" + rPath);
                }
                else {
                    libs.push(data);
                    oneArray.push(data);
                }
            }
            else {
                var f1 = data.indexOf(constStr1);
                if (f1 > -1) {
                    var f2 = data.indexOf(constStr2);
                    var diff = f2 - f1;
                    if (diff == 448) {
                        count++;
                        if (count > 1) {
                            var f3 = data.indexOf(constStr3);
                            diff = f3 - f2;
                            if (diff == 144) {
                                var temp1 = data.substring(0, f1);
                                var temp2 = data.substring(f3 + constStr3.length + 2);
                                data = temp1 + temp2;
                            }
                        }
                    }
                }
                // console.log("temp data: " + data);
                contentList.push(data);
                oneArray.push(data);
            }
        }
        ;
        var libPath;
        libPath = basePath + "/layalibs.js";
        console.log("create js:", libPath);
        fs.writeFileSync(libPath, libs.join("\n"));
        var TarPath;
        TarPath = basePath + "/main.js";
        console.log("create js:", TarPath);
        fs.writeFileSync(TarPath, contentList.join("\n"));
        //write onefile
        fs.writeFileSync(basePath + "/x.js", oneArray.join("\n"));
        console.log("create js:", basePath + "/x.js");
    };
    MergeJs.prototype.loadFile = function (file) {
        var data = fs.readFileSync(file, "utf-8").toString();
        return data;
    };
    return MergeJs;
}());
var mergeUglify = /** @class */ (function () {
    function mergeUglify() {
        console.log("into mergeUglify");
    }
    mergeUglify.prototype.mergeJS = function (html) {
        new MergeJs().mergeJS(html);
    };
    mergeUglify.prototype.uglifyJS = function (jsonstr) {
        var options = {
            toplevel: true,
            mangle: { reserved: ['wx', 'qg', 'hbs', 'ce'] },
            compress: {
                sequences: true,
                properties: true,
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                if_return: true,
                inline: true,
                join_vars: true,
                drop_console: true,
                comparisons: true,
                unsafe: false //unsafe (default: false) -- 使用 "unsafe"转换 (下面详述)
            }
        };
        var result = UglifyJs.minify(jsonstr, options);
        if (result.code) {
            fs.writeFileSync(this.targetFile, result.code);
        }
        else
            console.log(result.error);
    };
    mergeUglify.prototype.updateConfigCfg = function (file, mainJs, layaJs, version, verfile) {
        var data = this.loadFile(file);
        var js = JSON.parse(data);
        js["main"] = mainJs;
        js["LayaEngine"] = layaJs;
        js["version"] = version;
        js["versionfile"] = verfile;
        js["debug"] = false;
        js["meetEnemy"] = true;
        if (CURTARGET == "ts1") {
            js["IosTS"] = true;
            js["IsRecharge"] = false;
        }
        else if (CURTARGET == "ts2") {
            js["IosTS"] = true;
            js["IsRecharge"] = true;
        }
        else {
            js["IosTS"] = false;
            js["IsRecharge"] = true;
        }
        var out = JSON.stringify(js);
        fileMgr.writeFile(file, out);
    };
    mergeUglify.prototype.updateConfigCfg1 = function (file, key, value) {
        var data = this.loadFile(file);
        var js = JSON.parse(data);
        js[key] = value;
        var out = JSON.stringify(js);
        fileMgr.writeFile(file, out);
    };
    mergeUglify.prototype.loadFile = function (file) {
        this.targetFile = file;
        var data = fs.readFileSync(file, "utf-8").toString();
        return data;
    };
    return mergeUglify;
}());
var compressJson = /** @class */ (function () {
    function compressJson() {
        this.filelist = [];
    }
    compressJson.prototype.compressJson = function (file) {
        var data = fileMgr.loadFile(file).toString();
        try {
            var objJson = JSON.parse(data);
            if (file.lastIndexOf("/ui.json") > 0) {
                console.log("process ui.json");
                for (var key in objJson) {
                    if (objJson.hasOwnProperty(key)) {
                        var element = objJson[key];
                        element.ClassName = "";
                    }
                }
            }
            var final_code = JSON.stringify(objJson);
            fileMgr.writeFile(file, final_code);
        }
        catch (e) {
            console.log("error file:" + file);
            console.log(e);
        }
    };
    compressJson.prototype.compressJs = function (dir) {
        var _this = this;
        this.readDirSync(dir);
        this.filelist.forEach(function (element) {
            _this.compressJson(element);
        });
    };
    compressJson.prototype.readDirSync = function (path) {
        var t = this;
        var pa = fs.readdirSync(path);
        pa.forEach(function (ele, index) {
            var info = fs.statSync(path + "/" + ele);
            if (info.isDirectory()) {
                // console.log("dir:" + ele);
                t.readDirSync(path + "/" + ele);
            }
            else {
                if (fileMgr.getExtName(ele) === "json" || fileMgr.getExtName(ele) === "atlas") {
                    t.filelist.push(path + "/" + ele);
                }
            }
        });
    };
    return compressJson;
}());
var MakeVersion = /** @class */ (function () {
    function MakeVersion() {
        this.filelist = [];
    }
    MakeVersion.prototype.makeVersionList = function (path) {
        console.log("00000000" + path);
        this.readDirSync(path);
        console.log("version filelist: " + this.filelist.length);
        var mapFile = {};
        for (var index = 0; index < this.filelist.length; index++) {
            var element = this.filelist[index];
            var fileName = fileMgr.getFileName(element);
            var hasvalue = fileMgr.getFileHash(element);
            var ext = fileMgr.getExtName(element);
            // let basePath = fileMgr.getBaseName(element)
            var subS = element.substring(TarPath.length + 1);
            var base2 = fileMgr.getBaseName(subS);
            var md5File = fileName + "_" + hasvalue + "." + ext;
            mapFile[subS] = base2 + "/" + md5File;
            // console.log("element: " + element);
            // console.log("md5File: " + md5File);
            // fileMgr.rename(element, md5File);
        }
        var data = JSON.stringify(mapFile);
        var hashFile = fileMgr.getHashByContent(data);
        var versionJson = "version" + "_" + hashFile + ".json";
        fileMgr.writeFile(TarPath + "/" + versionJson, data);
        return versionJson;
    };
    
    MakeVersion.prototype.readDirSync = function (path) {
        var t = this;
        var pa = fs.readdirSync(path);
        
        pa.forEach(function (ele, index) {
            var info = fs.statSync(path + "/" + ele);
            if (info.isDirectory()) {
                // console.log("dir:" + ele);
                t.readDirSync(path + "/" + ele);
            }
            else {
                // if(path != TarPath) {
                //     var file = path + "/" + ele;
                // }else{
                //     var file = ele;
                // }
                // if (path != TarPath) {
                    var file = path + "/" + ele;
                    var arraySkip = ["/res/", "/libs/", "/.rec/", "readme", "/loginres/"];
                    var b = false;
                    var ind = 0;
                    for (ind = 0; ind < arraySkip.length; ind++) {
                        var ele_1 = arraySkip[ind];
                        var index_1 = file.lastIndexOf(ele_1);
                        if (index_1 > -1) {
                            b = true;
                            break;
                        }
                    }
                    if (!b) {
                        // console.log("push file: " + file);
                        t.filelist.push(file);
                        // t.filelist.push(path + "/" + ele);
                    }
                    else {
                        console.log("skip file: " + file);
                    }
                }
            // }
        });
    };
    return MakeVersion;
}());
var merge = new mergeUglify();
function createZipFile(fileName, data, cb) {
    zip.file(fileName, data);
    zip.generateAsync({ type: "uint8array", compression: "DEFLATE" }).then(function (content) {
        fs.writeFileSync(TarPath + "x.zip", content);
        var hashMain = fileMgr.getFileHash(TarPath + "x.zip");
        var mainHashName = "x_" + hashMain + ".zip";
        fileMgr.rename(TarPath + "x.zip", mainHashName);
        // merge.updateConfigCfg1(TarPath + "/config.cfg", "xHash", mainHashName);
        cb && cb();
    });
}
function getFormateTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var second = d.getSeconds();
    var Milli = d.getMilliseconds();
    var str = year + "_" + month + "_" + day + "_" + h + "_" + min + "_" + second;
    return str;
}
var outputStr = ""
function proPerFile(element) {
    var ext = fileMgr.getExtName(element);
    var data = fileMgr.loadFile(element);
    if (ext == "bat") {
        return;
    }
    else if (ext == "png" || ext == "jpg" || ext == "atlas") {
        var cachePng = CacheDir + "/";
        var srcDier = element.replace("../", "");
        cachePng = cachePng + srcDier;
        cachePng = cachePng.replace(new RegExp("/", "gm"), "\\");
        // console.log("cachePng:  "+cachePng);
        // console.log("element:   "+ element);
        if (CachePngJson[cachePng]) {
            var crypto_1 = require("crypto");
            var hash = crypto_1.createHash("md5");
            hash.update(data);
            var md5 = hash.digest("hex");
            // console.log("src md5:" + md5 )
            // console.log("cache md5:" + CachePngJson[cachePng] )
            if (CachePngJson[cachePng] == md5) {
                data = fileMgr.loadFile(cachePng);
                outputStr += ".";
                if(outputStr == "...................................") outputStr = "";
                console.log(outputStr);
                // console.log("read cache png:" + cachePng);
            }
        } else {
            var crypto_1 = require("crypto");
            var hash = crypto_1.createHash("md5");
            hash.update(data);
            var md5 = hash.digest("hex");
            // console.log("src md5:" + md5 )
            CachePngJson[cachePng] = md5
            // var result = element.replace(RootPath, CacheDir);
            var result = element.replace("../", "../cache/");
            var baseName = fileMgr.getBaseName(result);
            // console.log("MkdirP:   ",baseName)
            fileMgr.MkdirP(baseName);
            fileMgr.writeFile(result, data);
            var ss = JSON.stringify(CachePngJson);
            fs.writeFileSync(CacheDir + "/cache.json", ss);
        }
    }


    var result = element.replace(RootPath, TarPath);
    var baseName = fileMgr.getBaseName(result);
    // console.log("MkdirP:   ", baseName)
    fileMgr.MkdirP(baseName);
    fileMgr.writeFile(result, data);
}
console.log("TarPath:   ", TarPath)
fileMgr.deleteFolder(TarPath);
console.log("RootPath:   ", RootPath)

console.log("copyDir st");
fileMgr.copyDir(RootPath, TarPath);
// fileMgr.copyDir(RootPath, TarPath, proPerFile);
console.log("copyDir end");
name()
function name(params) {
    var compress = new compressJson();
    compress.compressJs(TarPath);
    var versionFile = new MakeVersion();
    var verfile = versionFile.makeVersionList(TarPath);
    fileMgr.deleteFolder(TarPath + "/../" + CURTARGET + ".zip");
    //base dir is exists?
    var baseVersion = ReleasePath + "/" + BASEJSONHASH;
    var baseDir = ReleasePath + "/base";
    var patchDir = ReleasePath + "/patch/" + CURTARGET;
    var zipName;
    console.log("ReleasePath ===    ", ReleasePath)
    console.log("baseDir ===    ", baseDir)
    console.log("TarPath ===    ", TarPath)
    console.log("patchDir ===    ", patchDir)
    console.log("ReleasePath ===    ", fileMgr.exists(ReleasePath) && fileMgr.exists(baseDir))
    if (fileMgr.exists(ReleasePath) && fileMgr.exists(baseDir)) {
        !fileMgr.exists(patchDir) ? fileMgr.MkdirP(patchDir) : (fileMgr.deleteFolder(patchDir), fileMgr.MkdirP(patchDir));
        var baseVersion = baseDir + "/" + BASEJSONHASH;
        var curVersion = TarPath + "/" + verfile;

        console.log("baseVersion == ", baseVersion)
        console.log("curVersion == ", curVersion)
        var baseVersionJson = JSON.parse(fileMgr.loadFile(baseVersion).toString());
        var curVersionJson = JSON.parse(fileMgr.loadFile(curVersion).toString());
        
        fileMgr.coypFileTo(curVersion, patchDir + "/" + verfile); //copy version_hash.json
        var find = false
        for (var key in curVersionJson) {
            if (curVersionJson.hasOwnProperty(key)) {
                var baseElement = baseVersionJson[key];
                var curElement = curVersionJson[key];

                if (baseElement != curElement) {
                    // console.log("baseElement==  ", key)
                    // console.log("curElement==  ", key)
                    var sf = TarPath + "/" + key;
                    var tf = patchDir + "/" + key;
                    var bf = fileMgr.getBaseName(tf);
                    !fileMgr.exists(bf) && fileMgr.MkdirP(bf);
                    fileMgr.coypFileTo(sf, tf);

                    console.log("diff file:" + curElement);
                    find = true
                }
            }
        }
        fileMgr.deleteFolder(patchDir + "/" + verfile);
        fileMgr.deleteFolder(patchDir + "/config.json" );
        if (!find) { return }
        var v = BANBENVERSION.split(".")
        var newV = v[0]+"."+v[1]+"."+(Number(v[2])+1)
        //版本管理版本+1操作
        process.chdir("../release/patch/"+CURTARGET); 
        console.log("cur dir:" + process.cwd());
        var data = JSON.stringify({"version":newV});
        var versionFile = "version.json";
        fileMgr.writeFile(versionFile, data);

        process.chdir("../../patch"); 
        console.log("cur dir:" + process.cwd());
        zipName = "patch_" + CURTARGET + "_" + makePwd + "_" + getFormateTime()+"v_"+newV;
        fileMgr.removeFile(zipName + ".zip");
        var execPath = "winrar a " + zipName + ".zip " + CURTARGET;
        console.log(execPath);
        fileMgr.exec(execPath);

        //删除base并将当前最新替换为base
        if(needGenghuanBase == true){
            console.log("删除base并将当前最新替换为base  == ",needGenghuanBase== true)
            process.chdir("../../release");
            console.log("cur dir:" + process.cwd());
            console.log("deleteFolder ===    ", baseDir)
            fileMgr.rename(baseDir,"base_"+getFormateTime());
            fileMgr.rename(TarPath, "base");
            //更新 makePack_douaiwan.json
            PackJson["baseVersion"] = verfile 
            PackJson["BanbenVersion"] = newV
            console.log('PackJson  == ',PackJson["baseVersion"])     
            var data = JSON.stringify(PackJson);
            process.chdir("../tools");
            console.log("cur dir:" + process.cwd());
            var packstr = "makePack_" + c + ".json";
            console.log("reChange makePack:" + packstr);
            fileMgr.writeFile(packstr, data);
        }else{
            //版本管理版本+1操作  
            PackJson["BanbenVersion"] = newV
            var data = JSON.stringify(PackJson);
            process.chdir("../../tools");
            console.log("cur dir:" + process.cwd());
            var packstr = "makePack_" + c + ".json";
            console.log("reChange makePack:" + packstr);
            fileMgr.writeFile(packstr, data);
        }
        


        console.log("end timetemp:" + Date.now());
        var ed = Date.now();
        var dif = ed - st;
        console.log("spent time : " + dif / 1000 + "s");
    }
    else {
        //zip 压缩包
        console.log("cur dir:" + CURDIR);
        process.chdir("../release");
        console.log("cur dir:" + process.cwd());
        zipName =  CURTARGET + "_" + makePwd + "_" + getFormateTime();
        var execPath = "winrar a " + zipName + ".zip " + CURTARGET;
        console.log(execPath);
        fileMgr.exec(execPath);
        fileMgr.copyDir(TarPath, baseDir);
        console.log("ent timetemp:" + Date.now());
        var ed = Date.now();
        var dif = ed - st;
        console.log("spent time : " + dif / 1000 + "s");
    }
    // var uploadStr = "python" + CURDIR + "\\upload.py" + process.cwd() + "\\" + zipName + ".zip";
    // console.log("uploadStr:" + uploadStr);
    // fileMgr.exec(uploadStr);
}
// );
//# sourceMappingURL=PackageTools.js.map