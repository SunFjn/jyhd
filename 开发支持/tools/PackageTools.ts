/*
* name;
* //node bin/PackageTools.js -v 1.0 -c fk
*/
let UglifyJs = require("uglify-js")
let mkdirp = require("mkdirp")
let JSZip = require("jszip")

import * as fs from "fs"
import * as path from "path"
// import { MD5 } from "./libs/MD5"
import { FileManager } from "./libs/FileManager"


let CURTARGET = ""
let CURDIR = process.cwd()
let DEBUG = false
console.log("cur dir :" + CURDIR)
let makePwdarr = CURDIR.split("\\")
let makePwd = makePwdarr[makePwdarr.length - 2]
console.log("makePwd: " + makePwd)

let zip = new JSZip()
let fileMgr = FileManager.instance

let version = "0.0"
let c = ""
if (process.argv.length > 0) {
    console.log("param : " + process.argv)
    process.argv.forEach((arg, index) => {
        let i = index
        let value = arg.toString()
        if (index == 3) {
            version = arg.toString()
        }
        if (index == 5) {
            c = arg.toString()
        }
        console.log("\tindex:" + index + "\tvalue: " + value)
    });
}
let packstr = "makePack_" + c + ".json"
console.log("load makePack:" + packstr)
let PackJson = JSON.parse(fileMgr.loadFile(packstr).toString())
CURTARGET = PackJson["curChannel"]
if (CURTARGET != c) {
    console.error("input error param CURTARGET: " + CURTARGET)
}
DEBUG = PackJson["DEBUG"]
let BASEJSONHASH = PackJson["baseVersion"]

let st = Date.now()
console.log("start timetemp:" + st)
console.log("current curchannel:" + CURTARGET)
console.log("current version:" + version)
let RootPath = "../bin"
let TarPath = "../realease/" + CURTARGET
let ReleasePath = "../realease"
let CacheDir = "../cache"
let CachePngJson = JSON.parse(fileMgr.loadFile(CacheDir + "/cache.json").toString()).Dic

var window = window || global
var document = document || (window.document = {})

class XML2ObjectNodejs {
    private static _ins;
    static get instance(): XML2ObjectNodejs {
        return XML2ObjectNodejs._ins || (XML2ObjectNodejs._ins = new XML2ObjectNodejs), XML2ObjectNodejs._ins
    }
    parse(node, isFirst?) {
        (isFirst === void 0) && (isFirst = true)
        let obj: any = {}
        if (isFirst) {
            obj.Name = node.localName
        }
        let numOfChilds = node[this.ChildrenSign] ? node[this.ChildrenSign].length : 0
        let childs = []
        let children = {}
        obj.c = children
        obj.cList = childs
        let numOfAttributes = 0
        let value
        for (let i = 0; i < numOfChilds; i++) {
            let childNode = node[this.ChildrenSign][i];
            let childNodeName = childNode.localName
            numOfAttributes = 0
            if (!childNodeName) continue
            value = this.parse(childNode, true)
            if (childNode["outerHTML"]) {
                value.html = childNode["outerHTML"]
            }
            childs.push(value)
            if (children[childNodeName]) {
                if (this.getTypeof(children[childNodeName]) == "array") {
                    children[childNodeName].push(value)
                } else {
                    children[childNodeName] = [children[childNodeName], value]
                }
            } else if (this.isArray(childNodeName)) {
                children[childNodeName] = [value]
            } else {
                children[childNodeName] = value
            }
        }
        numOfAttributes = 0
        if (node.attributes) {
            numOfAttributes = node.attributes.length
            let prop = {}
            obj.p = prop
            for (let i = 0; i < numOfAttributes; i++) {
                prop[node.attributes[i].name.toString()] = String(node.attributes[i].nodeValue)

            }
        }
        if (numOfChilds == 0) {
            if (numOfAttributes == 0) {

            } else { }
        }
        return obj

    }
    getArr(v) {
        if (!v) { return [] }
        if (this.getTypeof(v) == "array") return v
        return [v]
    }
    isArray(nodeName) {
        let numOfArrays = this._arrays ? this._arrays.length : 0
        for (let i = 0; i < numOfArrays; i++) {
            if (nodeName == this._arrays[i]) {
                return true
            }
        }
        return false
    }
    getTypeof(o) {
        if (typeof (o) == "object") {
            if (o.length == null) {
                return "object"
            } else if (typeof (o.length) == "number") {
                return "array"
            } else {
                return "object"
            }
        } else {
            return typeof (o)
        }
    }
    _arrays = null
    ChildrenSign = "childNodes"
}
//MergeJs
class MergeJs {
    parseXmlFromString(xmlString) {
        let xmld
        let DOMParser = require("xmldom").DOMParser
        xmld = (new DOMParser()).parseFromString(xmlString, "text/xml")
        return xmld
    }
    findAllScriptNode(xmlO, rst) {
        if (xmlO.Name == "script") {
            rst.push(xmlO)
        }
        let childs;
        childs = xmlO.cList
        if (childs) {
            let i = 0, len = 0
            len = childs.length
            for (i = 0; i < len; i++) {
                this.findAllScriptNode(childs[i], rst)
            }
        }
    }

    getScriptPathFromScriptO(scriptO) {
        if (scriptO.p && scriptO.p.src) {
            return scriptO.p.src
        }
        return null
    }
    getScriptPathFromHtml(htmlFile) {
        let txt
        txt = this.loadFile(htmlFile)
        let xmlO
        xmlO = this.parseXmlFromString(txt)
        let obj
        obj = XML2ObjectNodejs.instance.parse(xmlO)
        let scriptList = []
        this.findAllScriptNode(obj, scriptList)
        let scriptPathList = []
        let i = 0, len = 0
        let tPath
        len = scriptList.length
        for (i = 0; i < len; i++) {
            tPath = this.getScriptPathFromScriptO(scriptList[i])
            if (tPath) {
                scriptPathList.push(tPath)
            }
        }
        return scriptPathList
    }
    mergeJS(htmlFile: fs.PathLike, fileDic?: undefined) {
        if (!fs.existsSync(htmlFile)) {
            return
        }
        let scriptList = this.getScriptPathFromHtml(htmlFile)
        let basePath = fileMgr.getBaseName(htmlFile)
        let i = 0, len = 0
        len = scriptList.length
        let libs: Array<any> = []
        let contentList = []
        let oneArray = []
        let tFile
        let rPath: string

        let constStr1 = "var __extends = (this && this.__extends)|| function(){"
        let constStr2 = "function __() {this.constructor = d;}"
        let constStr3 = "})()"
        let count = 0
        for (i = 0; i < len; i++) {
            rPath = basePath + "/" + scriptList[i]
            if (!fs.existsSync(rPath)) {
                continue
            }
            let index = rPath.indexOf("/libs/")
            let data = this.loadFile(rPath)
            if (index > -1) {
                console.log(rPath)
                //排除第三方库
                let find = -1
                let arrayThird = ["/jszip.js", "jszip-utils.js", "aksdk.js", "laya.debugtool.js"]
                for (let i = 0; i < arrayThird.length; i++) {
                    let element = arrayThird[i];
                    find = rPath.indexOf(element)
                    if (find > -1) {
                        break
                    }
                }
                if (find > -1) {
                    console.log("expect file:" + rPath)
                } else {
                    libs.push(data)
                    oneArray.push(data)
                }
            } else {
                let f1 = data.indexOf(constStr1)
                if (f1 > -1) {
                    let f2 = data.indexOf(constStr2)
                    let diff = f2 - f1
                    if (diff == 448) {
                        count++
                        if (count > 1) {
                            let f3 = data.indexOf(constStr3)
                            diff = f3 - f2
                            if (diff == 144) {
                                let temp1 = data.substring(0, f1)
                                let temp2 = data.substring(f3 + constStr3.length + 2)
                                data = temp1 + temp2

                            }
                        }
                    }
                }
                console.log("temp data: " + data)
                contentList.push(data)
                oneArray.push(data)
            }
        };
        let libPath;
        libPath = basePath + "/layalibs.js"
        console.log("create js:", libPath)
        fs.writeFileSync(libPath, libs.join("\n"))

        let TarPath
        TarPath = basePath + "/main.js"
        console.log("create js:", TarPath)
        fs.writeFileSync(TarPath, contentList.join("\n"))

        //write onefile
        fs.writeFileSync(basePath + "/x.js", oneArray.join("\n"))
        console.log("create js:", basePath + "/x.js")
    }

    loadFile(file: string) {
        let data: string = fs.readFileSync(file, "utf-8").toString()
        return data
    }
}
class mergeUglify {
    targetFile: string
    mergeJS(html) {
        new MergeJs().mergeJS(html)
    }
    uglifyJS(jsonstr) {
        let options = {
            toplevel: true,
            mangle: { reserved: ['wx', 'qg', 'hbs', 'ce'] },
            compress: {
                sequences: true,//连续声明变量，用逗号隔开来.默认的sequences设置有极小几率会导致压缩很慢，所以推荐设置成20或以下。
                properties: true,//用.来重写属性引用，例如foo["bar"] → foo.bar
                dead_code: true,//移除没被引用的代码
                drop_debugger: true,//- 移除 debugger;
                conditionals: true, //-- 优化if等判断以及条件选择
                evaluate: true, //-- 尝试计算常量表达式
                booleans: true,//-- 优化布尔运算，例如 !!a? b : c → a ? b : c
                loops: true,// -- 当do、while 、 for循环的判断条件可以确定是，对其进行优化
                unused: true, //-- 干掉没有被引用的函数和变量。（除非设置"keep_assign"，否则变量的简单直接赋值也不算被引用。）
                hoist_funs: true,// -- 提升函数声明
                if_return: true,// -- 优化 if/return 和 if/continue
                inline: true,// -- 包裹简单函数。
                join_vars: true,//join_vars -- 合并连续 var 声明
                drop_console: true,//drop_console -- 默认 false. 传true的话会干掉console.*函数。
                comparisons: true,//comparisons -- 把结果必然的运算优化成二元运算，例如!(a <= b) → a > b (只有设置了 unsafe_comps时才生效)；尽量转成否运算。例如 a = !b && !c && !d && !e → a=!(b||c||d||e)
                unsafe: false//unsafe (default: false) -- 使用 "unsafe"转换 (下面详述)
            }
        }
        let result = UglifyJs.minify(jsonstr, options)
        if (result.code) {
            fs.writeFileSync(this.targetFile, result.code)
        } else
            console.log(result.error)
    }

    updateConfigCfg(file, mainJs, layaJs, version, verfile) {
        let data = this.loadFile(file)
        let js = JSON.parse(data)
        js["main"] = mainJs
        js["LayaEngine"] = layaJs
        js["version"] = version
        js["versionfile"] = verfile
        js["debug"] = false
        js["meetEnemy"] = true
        if (CURTARGET == "ts1") {
            js["IosTS"] = true
            js["IsRecharge"] = false
        } else if (CURTARGET == "ts2") {
            js["IosTS"] = true
            js["IsRecharge"] = true
        } else {
            js["IosTS"] = false
            js["IsRecharge"] = true
        }
        let out = JSON.stringify(js)
        fileMgr.writeFile(file, out)
    }
    updateConfigCfg1(file, key, value) {
        let data = this.loadFile(file)
        let js = JSON.parse(data)
        js[key] = value
        let out = JSON.stringify(js)
        fileMgr.writeFile(file, out)
    }

    loadFile(file: string) {
        this.targetFile = file
        let data: string = fs.readFileSync(file, "utf-8").toString()
        return data
    }
}

class compressJson {
    filelist = []
    constructor() {

    }
    compressJson(file: string) {
        let data = fileMgr.loadFile(file).toString()
        try {
            let objJson = JSON.parse(data)
            if (file.lastIndexOf("/ui.json") > 0) {
                console.log("process ui.json")
                for (const key in objJson) {
                    if (objJson.hasOwnProperty(key)) {
                        let element = objJson[key];
                        element.ClassName = ""
                    }
                }
            }
            let final_code = JSON.stringify(objJson)
            fileMgr.writeFile(file, final_code)
        }
        catch (e) {
            console.log("error file:" + file)
            console.log(e)
        }
    }

    compressJs(dir) {
        this.readDirSync(dir)
        this.filelist.forEach(element => {
            this.compressJson(element)
        });
    }
    readDirSync(path) {
        let t = this
        let pa = fs.readdirSync(path)
        pa.forEach((ele, index) => {
            let info = fs.statSync(path + "/" + ele)
            if (info.isDirectory()) {
                console.log("dir:" + ele)
                t.readDirSync(path + "/" + ele)
            }
            else {
                if (fileMgr.getExtName(ele) === "json" || fileMgr.getExtName(ele) === "atlas") {
                    t.filelist.push(path + "/" + ele)
                }
            }
        });
    }
}

class MakeVersion {
    filelist = []
    constructor() { }
    makeVersionList(path) {
        this.readDirSync(path)
        console.log("version filelist: " + this.filelist)
        let mapFile = {}
        for (let index = 0; index < this.filelist.length; index++) {
            let element = this.filelist[index];
            let fileName = fileMgr.getFileName(element)
            let hasvalue = fileMgr.getFileHash(element)
            let ext = fileMgr.getExtName(element)
            // let basePath = fileMgr.getBaseName(element)
            let subS = element.substring(TarPath.length + 1)
            let base2 = fileMgr.getBaseName(subS)
            let md5File = fileName + "_" + hasvalue + "." + ext
            mapFile[subS] = base2 + "/" + md5File

            console.log("element: " + element)
            console.log("md5File: " + md5File)

            fileMgr.rename(element, md5File)
        }
        let data = JSON.stringify(mapFile)
        let hashFile = fileMgr.getHashByContent(data)
        let versionJson = "version" + "_" + hashFile + ".json"
        fileMgr.writeFile(TarPath + "/" + versionJson, data)
        return versionJson
    }

    readDirSync(path) {
        let t = this
        let pa = fs.readdirSync(path)
        pa.forEach((ele, index) => {
            let info = fs.statSync(path + "/" + ele)
            if (info.isDirectory()) {
                console.log("dir:" + ele)
                t.readDirSync(path + "/" + ele)
            }
            else {
                if (path != TarPath) {
                    let file = path + "/" + ele
                    let arraySkip = ["/js/", "/libs/", "/.rec/", "/loginres/"]
                    let b: boolean = false
                    let ind = 0
                    for (ind = 0; ind < arraySkip.length; ind++) {
                        const ele = arraySkip[ind]
                        let index = file.lastIndexOf(ele)
                        if (index > -1) {
                            b = true
                            break
                        }
                    }
                    if (!b) {
                        t.filelist.push(path + "/" + ele)
                    } else {
                        console.log("skip file: " + file)
                    }
                }
            }
        });
    }
}

let merge = new mergeUglify()

function createZipFile(fileName, data, cb) {
    zip.file(fileName, data)
    zip.generateAsync({ type: "uint8array", compression: "DEFLATE" }).then(
        function (content) {
            fs.writeFileSync(TarPath + "x.zip", content)
            let hashMain = fileMgr.getFileHash(TarPath + "x.zip")
            let mainHashName = "x_" + hashMain + ".zip"
            fileMgr.rename(TarPath + "x.zip", mainHashName)
            merge.updateConfigCfg1(TarPath + "/config.cfg", "xHash", mainHashName)
            cb && cb()
        }
    )
}
function getFormateTime() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let h = d.getHours()
    let min = d.getMinutes()
    let second = d.getSeconds()
    let Milli = d.getMilliseconds()
    let str = `${year}_${month}_${day}_${h}_${min}_${second}`
    return str
}
function proPerFile(element: string) {
    let ext = fileMgr.getExtName(element)
    let data = fileMgr.loadFile(element)
    if (ext == "bat") {
        return
    } else if (ext == "png" || ext == "jpg") {
        let cachePng = CacheDir + "/"
        let srcDier = element.replace("../", "")
        cachePng = cachePng + srcDier
        cachePng = cachePng.replace(new RegExp("/", "gm"), "\\")
        console.log(cachePng)
        console.log(element)
        if (CachePngJson[cachePng]) {
            const crypto = require("crypto")
            let hash = crypto.createHash("md5")
            hash.update(data)
            let md5 = hash.digest("hex")
            // console.log("src md5:" + md5 )
            // console.log("cache md5:" + CachePngJson[cachePng] )
            if (CachePngJson[cachePng] == md5) {
                data = fileMgr.loadFile(cachePng)
                console.log("read cache png:" + cachePng)
            }
        }
    };
    let result = element.replace(RootPath, TarPath)
    let baseName = fileMgr.getBaseName(result)
    fileMgr.MkdirP(baseName)
    fileMgr.writeFile(result, data)
}

fileMgr.deleteFolder(TarPath)
fileMgr.copyDir(RootPath, TarPath, proPerFile)

merge.mergeJS(TarPath + "/index.html")
console.log("uglifyJS st")
merge.uglifyJS(merge.loadFile(TarPath + "/layalibs.js"))
merge.uglifyJS(merge.loadFile(TarPath + "/main.js"))
!DEBUG && merge.uglifyJS(merge.loadFile(TarPath + "/x.js"))
console.log("uglifyJS end")
createZipFile("x.js", fileMgr.loadFile(TarPath + "/x.js"), function name(params) {
    let hashMain = fileMgr.getFileHash(TarPath + "/main.js")
    let mainHashName = "main_" + hashMain + ".js"
    fileMgr.rename(TarPath + "/main.js", mainHashName)

    let compress = new compressJson()
    compress.compressJs(TarPath)

    let versionFile = new MakeVersion()
    let verfile = versionFile.makeVersionList(TarPath)

    merge.updateConfigCfg(TarPath + "/config.cfg", mainHashName, "layalibs.js", version, verfile)
    fileMgr.deleteFolder(TarPath + "/js")
    fileMgr.deleteFolder(TarPath + "/libs")
    fileMgr.deleteFolder(TarPath + "/index.html")
    fileMgr.deleteFolder(TarPath + "/x.js")
    fileMgr.deleteFolder(TarPath + "/serverlist")
    fileMgr.deleteFolder(TarPath + "/BattleData.json")
    fileMgr.deleteFolder(TarPath + "/BattleData2.json")
    fileMgr.deleteFolder(TarPath + "/Compression.bat")
    fileMgr.deleteFolder(TarPath + "/../" + CURTARGET + ".zip")


    let Data = fileMgr.loadFile(RootPath + "/libs/worker.js")
    fileMgr.MkdirP(TarPath + "/libs")
    fileMgr.writeFile(TarPath + "/libs/worker.js", Data)

    Data = fileMgr.loadFile(RootPath + "/libs/min/jszip.min.js")
    fileMgr.writeFile(TarPath + "/libs/jszip.js", Data)

    Data = fileMgr.loadFile(RootPath + "/libs/min/jszip-utils.min.js")
    fileMgr.writeFile(TarPath + "/libs/jszip-utils.js", Data)

    //base dir is exists?
    let baseDir = ReleasePath + "/base" + CURTARGET
    let patchDir = ReleasePath + "/patch/" + CURTARGET
    let zipName
    if (fileMgr.exists(ReleasePath) && fileMgr.exists(baseDir)) {
        !fileMgr.exists(patchDir) ? fileMgr.MkdirP(patchDir) : (fileMgr.deleteFolder(patchDir), fileMgr.MkdirP(patchDir))
        let baseVersion = baseDir + "/" + BASEJSONHASH
        let curVersion = TarPath + "/" + verfile
        let baseVersionJson = JSON.parse(fileMgr.loadFile(baseVersion).toString())
        let curVersionJson = JSON.parse(fileMgr.loadFile(curVersion).toString())
        let configData = fileMgr.loadFile(TarPath + "/congfig.cfg").toString()
        let js = JSON.parse(configData)
        let xZipHash = js["xHash"]

        fileMgr.coypFileTo(curVersion, patchDir + "/" + verfile) //copy version_hash.json
        fileMgr.coypFileTo(TarPath + "/config.cfg", patchDir + "/config.cfg") //copy config.cfg
        fileMgr.coypFileTo(TarPath + "/" + mainHashName, patchDir + "/" + mainHashName) //copy main_hash.json
        fileMgr.coypFileTo(TarPath + "/" + xZipHash, patchDir + "/" + xZipHash) //copy x_hash.zip
        fileMgr.coypFileTo(TarPath + "/index_web.html", patchDir + "/index_web.html") //copy index_web.html
        fileMgr.coypFileTo(TarPath + "/background.jpg", patchDir + "/background.jpg") //copy background.jpg

        for (const key in curVersionJson) {
            if (curVersionJson.hasOwnProperty(key)) {
                const baseElement = baseVersion[key];
                const curElement = curVersionJson[key];
                if (baseElement != curElement) {
                    let sf = TarPath + "/" + curElement
                    let tf = patchDir + "/" + curElement
                    let bf = fileMgr.getBaseName(tf)
                    !fileMgr.exists(bf) && fileMgr.MkdirP(bf)
                    fileMgr.coypFileTo(sf, tf)
                    // console.log(baseElement)
                    console.log("diff file:" + curElement)
                }
            }
        }
        process.chdir("../release/patch")//作用存疑?
        console.log("cur dir:" + process.cwd())
        zipName = "d3_patch_" + CURTARGET + "_" + makePwd + "_" + getFormateTime() //+"_v"+version
        fileMgr.removeFile(zipName + ".zip")
        let execPath = "winrar a " + zipName + ".zip" + CURTARGET
        console.log(execPath)
        fileMgr.exec(execPath)
        console.log("ent timetemp:" + Date.now())
        let ed = Date.now()
        let dif = ed = st
        console.log("spent time : " + dif / 1000 + "s")
    } else {
        //zip 压缩包
        console.log("cur dir:" + CURDIR)
        process.chdir("../release")
        console.log("cur dir:"+process.cwd())
        zipName = "d3_" + CURTARGET + "_" + makePwd + "_" + getFormateTime() 
        let execPath = "winrar a ../release/" + zipName + ".zip" + CURTARGET

        console.log(execPath)
        fileMgr.exec(execPath)
        console.log("ent timetemp:" + Date.now())
        let ed = Date.now()
        let dif = ed = st
        console.log("spent time : " + dif / 1000 + "s")
    }

    let uploadStr = "python" + CURDIR +"\\upload.py" + process.cwd()+"\\"+ zipName + ".zip"
    console.log("uploadStr:"+uploadStr)
    fileMgr.exec(uploadStr)
})