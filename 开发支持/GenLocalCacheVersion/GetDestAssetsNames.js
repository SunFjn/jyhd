/*文件处理模块,目前是同步,有时间改为异步*/
const fs = require("fs");
const path = require("path");

// 最终需要被处理的文件的源目录！！！
// let sourceRealRoot = "E:\\WORKSPACE\\Laya\\hengban_game\\bin";
let sourceRealRoot = path.join(__dirname, "..", "..", "bin");

//虚拟的文件根文件夹(不需要存在app本地的资源)
let virtualPaths = [
    // sourceRealRoot + "\\assets\\icon\\activity_preview",
    // sourceRealRoot + "\\assets\\icon\\expression",
    // sourceRealRoot + "\\res\\atlas",
];

// 虚拟文件的前缀，获取相对文件名时使用
let virtualPrefix = sourceRealRoot;
let virtualExts = [".png", ".jpg", ".sk", ".mp4", ".mp3"];

//源文件的根文件夹(需要存在app本地的资源)
let rootSourcepath = path.join(__dirname, "SourceDirectory");

//数组
let obj = {};
let arr = [];

// 固定的虚拟资源
let virtual = [
    // "assets/configs.obj",
    // // "assets/as.obj",
    // // "assets/mb.obj",
    // // "assets/ss.obj",
    // // "db.bin",
    // // "version",
    // // "brother.big",
    // "js/main.js",
    // "res/skeleton/zhujue/nanzhu.png",
    // "res/skeleton/zhujue/nanzhu.sk",
    // "res/skeleton/zhujue/nvzhu.png",
    // "res/skeleton/zhujue/nvzhu.sk",
];

//核心
function handler(sourceDirArr, parentDir, virtualPathTemp) {

    sourceDirArr.forEach(element => {

        let fullname = path.join(parentDir ? parentDir : (virtualPathTemp ? virtualPathTemp : rootSourcepath), element);

        if (fs.lstatSync(fullname).isDirectory()) {
            //文件夹则继续查找下级目录
            let newDirArr = fs.readdirSync(fullname)

            handler(newDirArr, fullname, virtualPathTemp);
        } else {
            let relativeName = fullname.replace((virtualPathTemp ? virtualPrefix : rootSourcepath) + "\\", "");

            relativeName = relativeName.replace(/\\/g, "/");

            if (!virtualPathTemp) {
                arr.push(relativeName);
            } else {
                if (virtualExts.indexOf(path.parse(fullname).ext) != -1) {
                    if (arr.indexOf(relativeName) == -1) {
                        virtual.push(relativeName);
                    }
                    else {
                        console.log("\tTips:【", relativeName + "】文件已经存在 Real文件数组 中, Virtual数组 中不重复添加!");
                    }

                }
            }
        }
    });
}

//开始
function boot() {
    let rootDir = fs.readdirSync(rootSourcepath)
    handler(rootDir, null, null);
    console.log(`1.处理必须存app本地的文件数据[Count:${arr.length}]!!!\n`);

    virtualPaths.forEach(path => {
        let dir = fs.readdirSync(path)
        handler(dir, null, path);
    });
    console.log(`\n2.处理虚拟的(首次可不放在app本地的)文件名[Count:${virtual.length}]!!!`);


    let datetime = new Date();
    let dest = path.join(__dirname, "Filenames.json");
    obj.desc = "这是由【GetDestAssetsNames.js】脚本生成的文件,最好不要手动修改,如有修改时请重新生成!";
    obj.total = virtual.length + arr.length;

    // 创建时间

    obj.datetime = datetime.getFullYear() + "年" + (datetime.getMonth() + 1) + "月" + datetime.getDate() + "日 "
        + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds() + " " + datetime.getMilliseconds();

    obj.source_path = sourceRealRoot;
    obj.real = arr;
    obj.virtual = virtual;

    if (fs.existsSync(dest)) {
        fs.rmSync(dest);
    }
    fs.writeFileSync(dest, JSON.stringify(obj));

    console.log(`\n3.finisfh-文件路径获取完成[Total:${obj.total}]!!!`);
}

boot();