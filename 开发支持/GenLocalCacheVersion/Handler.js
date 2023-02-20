// 1.复制指定文件到指定目录
// 2.生成资源版本配置文件

const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

//要复制的源文件的根文件夹
let realPath = path.join(__dirname, "..", "..", "bin");
console.log(realPath);
let realAssetsArray;
let virtualAssetsArray;
//文件夹
let targetFilespath = __dirname + "/web.jyhd.ssche.cn";
let targetVersionpath = __dirname + "/source_version.json";
//复制的文件计数
let count1 = 0;
let count2 = 0;


getFilenames();

// 获得文件md5码
function md5(fullname) {
    const buffer = fs.readFileSync(fullname);
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');
    return md5;
}

//复制的核心算法
function myCopyFile() {
    let versionRealObj = {};
    let versionVirtualObj = {};
    let totalObj = {};

    let realListArr = [];
    let virtualListArr = [];
    let totalListArr = [];
    let totalVerListObj = [];
    // console.log(realAssetsArray);
    realAssetsArray.forEach(file => {
        let fullname = realPath + "/" + file;

        //相对目录
        let destPath = path.join(targetFilespath, file);
        //如果不存在则创建目录
        let dir = path.parse(destPath).dir
        checkAndMkMyDir(dir);

        //复制到指定目录去
        if (fs.existsSync(fullname)) {
            fs.copyFileSync(fullname, destPath)

            count1++;
            realListArr.push(file);
            versionRealObj[file] = md5(fullname);
        } else {
            console.log("不存在文件,无法复制到发布目录:", fullname);
        }
    });

    // virtualAssetsArray.forEach(file => {
    //     let fullname = realPath + "/" + file;
    //     count2++;
    //     virtualListArr.push(file);
    //     versionVirtualObj[file] = md5(fullname);
    // });

    let datetime = new Date();
    totalObj.createtime = "资源版本生成时间:" + datetime.getFullYear() + "年" + (datetime.getMonth() + 1) + "月" + datetime.getDate() + "日 "
        + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds() + " " + datetime.getMilliseconds();

    totalListArr = [...realListArr, ...virtualListArr];
    totalVerListObj = { ...versionRealObj, ...versionVirtualObj };
    totalObj.totalCount = count1 + count2;
    // totalObj.realVersion = versionRealObj;
    // totalObj.virtualVersion = versionVirtualObj;
    // totalObj.realListArray = realListArr;
    // totalObj.virtualListArray = virtualListArr;
    totalObj.VersionListObject = totalVerListObj;


    // totalObj.totalListArray = totalListArr;

    // if (fs.existsSync(targetVersionpath)) {
    // fs.rmSync(targetVersionpath);
    // }
    fs.writeFileSync(path.join(targetFilespath, "source_version.json"), JSON.stringify(totalObj));

    //复制一份
    fs.writeFileSync(path.join(__dirname, "..", "..", "bin", "source_version.json"), JSON.stringify(totalObj));

    console.log("资源复制完成,版本文件生成完成!");
}


//检查目录是否存在.不存在则创建
function checkAndMkMyDir(dir) {
    if (!fs.existsSync(dir)) {
        let parentDir = path.parse(dir).dir;
        if (!fs.existsSync(parentDir)) {
            checkAndMkMyDir(parentDir)
        }
        fs.mkdirSync(dir)
    }
}

// 获取配置文件
function getFilenames() {
    let jsonFile = JSON.parse(fs.readFileSync(__dirname + "/Filenames.json", "utf-8"));
    // realPath = jsonFile.source_path;
    realAssetsArray = jsonFile.real;
    virtualAssetsArray = jsonFile.virtual;
}

/**
 * 删除指定目录下所有子文件
 * @param {*} path 
 */
function emptyDir(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            emptyDir(filePath);
        } else {
            fs.unlinkSync(filePath);
            // console.log(`删除${file}文件成功`);
        }
    });
}

//开始
function StartCopyFileAndCreateVer(config) {
    //如果不存在则创建目录
    if (fs.existsSync(targetFilespath)) {
        fs.rmSync(targetFilespath, { recursive: true })
        console.log("清理目录:" + targetFilespath);
    }
    fs.mkdirSync(targetFilespath)

    //开始遍历复制
    myCopyFile()
}

StartCopyFileAndCreateVer();