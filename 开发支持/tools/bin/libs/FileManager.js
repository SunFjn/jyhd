"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
/*
* name;
*/
var fs = require("fs");
var mkdirp = require("mkdirp");
// import { MD5 } from "./MD5"
var crypto = require("crypto");
var execSync = require("child_process").execSync;
var outputStr = "";
var FileManager = /** @class */ (function () {
    function FileManager() {
        this.filelist = [];
        this.outputStr = ""
    }
    Object.defineProperty(FileManager, "instance", {
        get: function () {
            return FileManager._ins || (FileManager._ins = new FileManager), FileManager._ins;
        },
        enumerable: false,
        configurable: true
    });
    FileManager.prototype.deleteFolder = function (path) {
        var t = this;
        var files = [];
        if (fs.existsSync(path)) {
            if (fs.statSync(path).isDirectory()) {
                files = fs.readdirSync(path);
                files.forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.statSync(curPath).isDirectory()) { //recurse
                        t.deleteFolder(curPath);
                    }
                    else { //delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }else{
                fs.unlinkSync(path);
            }
            
        }
    };
    FileManager.prototype.MkdirP = function (path) {
        mkdirp.sync(path);
    };
    FileManager.prototype.rename = function (oldFile, newFile) {
        var basename = this.getBaseName(oldFile);
        fs.renameSync(oldFile, basename + "/" + newFile);
    };
    FileManager.prototype.getBaseName = function (url) {
        var name =url.substring(0, url.lastIndexOf("/"))
        return name;
    };
    FileManager.prototype.getFileName = function (url) {
        var findstFlag = url.lastIndexOf("/") + 1;
        var findenFlag = url.lastIndexOf(".");
        return url.substring(findstFlag, findenFlag);
    };
    FileManager.prototype.writeFile = function (fileName, data) {
        fs.writeFileSync(fileName, data);
    };
    FileManager.prototype.loadFile = function (file) {
        var data = fs.readFileSync(file);
        return data;
    };
    //获取后缀名
    FileManager.prototype.getExtName = function (url) {
        var arr = url.split(".");
        var len = arr.length;
        return arr[len - 1];
    };
    FileManager.prototype.getFileHash = function (file) {
        // console.log("FileManager.prototype.getFileHash  ",file)
        var Data = this.loadFile(file).toString();
        return this.getHashByContent(Data);
    };
    FileManager.prototype.getHashByContent = function (content) {
        // let value: string = MD5.encrypt(content)
        var value = crypto.createHash("md5").update(content).digest("hex");
        value = value.substr(0, 8);
        return value;
    };
    FileManager.prototype.readDirSync = function (path) {
        var t = this;
        // console.log("readDirSync  path == "+path+"   start")
        var pa = fs.readdirSync(path);
        // console.log("readDirSync  path == "+path+"   succeed")
        pa.forEach(function (elem, index) {
            var info = fs.statSync(path + "/" + elem);
            if (info.isDirectory()) {
                t.readDirSync(path + "/" + elem);
            }
            else {
                t.filelist.push(path + "/" + elem);
            }
        });
        // console.log(t.filelist)
    };
    FileManager.prototype.copyDir = function (srcPath, desPath, callback) {
        this.filelist = [];
        this.readDirSync(srcPath);
        console.log("copying start")
        for (var index = 0; index < this.filelist.length; index++) {
            var element = this.filelist[index];
            //过滤 文件
            var skipFile = [".rec","/res/","/atlas80/"];
            var b = false;
            for (var i = 0; i < skipFile.length; i++) {
                var value = skipFile[i];
                var pos = element.indexOf(value);
                if (pos > -1) {
                    b = true;
                    break;
                }
            }
            if (b == false) {
                if (callback) {
                    callback(element);
                }
                else {
                    var data = this.loadFile(element);
                    var result = element.replace(srcPath, desPath);
                    var basename = this.getBaseName(result);
                    this.MkdirP(basename);
                    this.writeFile(result, data);
                    this.outputStr += ".";
                    if(this.outputStr == "...................................") this.outputStr = "";
                    console.log(this.outputStr);
                
                }
            }
        }
    };
    FileManager.prototype.coypFileTo = function (srcFile, toPath) {
        var srcData = this.loadFile(srcFile);
        this.writeFile(toPath, srcData);
    };
    FileManager.prototype.removeFile = function (file) {
        if (!fs.existsSync(file))
            return;
        fs.unlinkSync(file);
    };
    FileManager.prototype.md5 = function (file) {
        var basename = this.getBaseName(file);
        var md5Value = crypto.createHash("md5").update(this.loadFile(file)).digest("hex");
        // let md5Value = MD5.encrypt(this.loadFile(file))
        fs.renameSync(file, basename + "/" + md5Value);
        return md5Value;
    };
    FileManager.prototype.getMd5 = function (file) {
        return crypto.createHash("md5").update(this.loadFile(file)).digest("hex");
        // return MD5.encrypt(this.loadFile(file).toString())
    };
    FileManager.prototype.exists = function (path) {
        return fs.existsSync(path);
    };
    FileManager.prototype.exec = function (exePath) {
        execSync(exePath);
    };
    return FileManager;
}());
exports.FileManager = FileManager;
//# sourceMappingURL=FileManager.js.map