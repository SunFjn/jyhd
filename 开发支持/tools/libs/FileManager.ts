/*
* name;
*/
import * as fs from "fs"
import * as path from "path"
let mkdirp = require("mkdirp")
// import { MD5 } from "./MD5"
import * as crypto from "crypto"
var execSync = require("child_process").execSync
export class FileManager {
    private static _ins;
    static get instance(): FileManager {
        return FileManager._ins || (FileManager._ins = new FileManager), FileManager._ins
    }
    filelist = []
    deleteFolder(path) {
        let t = this;
        var files = []
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path)
            files.forEach((file, index) => {
                var curPath = path + "/" + file
                if (fs.statSync(curPath).isDirectory()) {//recurse
                    t.deleteFolder(curPath)
                } else {//delete file
                    fs.unlinkSync(curPath)
                }
            });
            fs.rmdirSync(path)
        }
    }
    MkdirP(path) {
        mkdirp.sync(path)
    }
    rename(oldFile, newFile) {
        let basename = this.getBaseName(oldFile)
        fs.renameSync(oldFile, basename + "/" + newFile)
    }
    getBaseName(url) {
        return url.substring(0, url.lastIndexOf("/"))
    }
    getFileName(url: string) {
        let findstFlag = url.lastIndexOf("/") + 1
        let findenFlag = url.lastIndexOf(".")
        return url.substring(findstFlag, findenFlag)
    }
    writeFile(fileName, data) {
        fs.writeFileSync(fileName, data)
    }
    loadFile(file: string) {
        let data = fs.readFileSync(file)
        return data
    }
    //获取后缀名
    getExtName(url: string) {
        let arr = url.split(".")
        let len = arr.length
        return arr[len - 1]
    }
    getFileHash(file) {
        let Data = this.loadFile(file).toString()
        return this.getHashByContent(Data)
    }
    getHashByContent(content) {
        // let value: string = MD5.encrypt(content)
        let value: string = crypto.createHash("md5").update(content).digest("hex")

        value = value.substr(0, 8)
        return value
    }
    readDirSync(path) {
        let t = this
        let pa = fs.readFileSync(path)
        pa.forEach((elem, index) => {
            let info = fs.statSync(path + "/" + elem)
            if (info.isDirectory()) {
                t.readDirSync(path + "/" + elem)
            } else {
                t.filelist.push(path + "/" + elem)
            }
        });
    }
    copyDir(srcPath, desPath, callback) {
        this.filelist = []
        this.readDirSync(srcPath)
        for (let index = 0; index < this.filelist.length; index++) {
            let element: string = this.filelist[index];
            //过滤 文件
            let skipFile = [".rec"]
            let b = false
            for (let i = 0; i < skipFile.length; i++) {
                let value = skipFile[i];
                let pos = element.indexOf(value)
                if (pos > -1) {
                    b = true
                    break
                }
            }
            if (b = false) {
                if (callback) {
                    callback(element)
                }
                else {
                    let data = this.loadFile(element)
                    let result = element.replace(srcPath, desPath)
                    let basename = this.getBaseName(result)
                    this.MkdirP(basename)
                    this.writeFile(result, data)
                }
            }
        }
    }

    coypFileTo(srcFile, toPath) {
        let srcData = this.loadFile(srcFile)
        this.writeFile(toPath, srcData)
    }
    removeFile(file) {
        if (!fs.existsSync(file)) return
        fs.unlinkSync(file)
    }
    md5(file) {
        let basename = this.getBaseName(file)
        let md5Value = crypto.createHash("md5").update(this.loadFile(file)).digest("hex")
        // let md5Value = MD5.encrypt(this.loadFile(file))
        fs.renameSync(file, basename + "/" + md5Value)
        return md5Value
    }
    getMd5(file) {
        return crypto.createHash("md5").update(this.loadFile(file)).digest("hex")
        // return MD5.encrypt(this.loadFile(file).toString())

    }
    exists(path) {
        return fs.existsSync(path)
    }
    exec(exePath) {
        execSync(exePath)
    }
}