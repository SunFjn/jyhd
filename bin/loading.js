"use strict";

var versions = {};
var loadingView = {
    bg: null,
    progressBg1: null,
    progressBar1: null,
    progressBg2: null,
    progressBar2: null,
    progressWalker: null,
    progressLight: null,
    proLabel: null,
    proLabel1: null,
    proLabel2: null,
    createElement: function (tagName, style, id) {
        var e = document.createElement(tagName);
        if (id)
            e.id = id;
        e.style.cssText = style;
        return e;
    },
    createImageElement: function (src, style, id) {
        var e = this.createElement("img", style, id);
        var v = versions[src];
        e.src = v ? "" + gameParams.cdn + src + "?v=" + v : "" + gameParams.cdn + src;
        return e;
    },
    appendProgress: function (div) {
        var images = [
            ["html_login/progress_jz_jdt2_0.png", "position:absolute;left:51px;top:9px;width:616px;height:29px;", "progressBg1"],
            ["html_login/progress_jz_jdt_1.png", "position:absolute;left:60px;top:13px;width:596px;height:20px;", "progressBar1"],
            ["html_login/progress_jz_jdt1_0.png", "position:absolute;left:51px;top:59px;width:616px;height:29px;", "progressBg2"],
            ["html_login/progress_jz_jdt_1.png", "position:absolute;left:60px;top:63px;width:596px;height:20px;", "progressBar2"],
            ["html_login/progressWalker.gif", "position:absolute;left:123px;top:-76px;width:111px;height:88px;", "progressWalker"],
            ["html_login/progressLight.png", "position:absolute;left:123px;top:-2px;width:167px;height:54px;", "progressLight"],
        ];
        for (var i = 0, length_1 = images.length; i < length_1; ++i) {
            var style = images[i];
            this[style[2]] = div.appendChild(this.createImageElement.apply(this, style));
        }
        var labels = [
            ["proLabel", "position:absolute;left:10px;top:-18px;width:700px;text-align:center;color:#FFF8D7;font-size:24px;font-family:'SimHei';text-shadow: 0 1px 3px #A56A3E, 1px 0 3px #A56A3E, -1px 0 3px #A56A3E, 0 -1px 3px #A56A3E"],
            ["proLabel1", "position:absolute;left:10px;top:11px;width:700px;text-align:center;color:#FFFFFF;font-size:22px;font-family:'SimHei';text-shadow: 0 1px 3px #430B51, 1px 0 3px #430B51, -1px 0 3px #430B51, 0 -1px 3px #430B51"],
            ["proLabel2", "position:absolute;left:10px;top:62px;width:700px;text-align:center;color:#FFFFFF;font-size:22px;font-family:'SimHei';text-shadow: 0 1px 3px #430B51, 1px 0 3px #430B51, -1px 0 3px #430B51, 0 -1px 3px #430B51"]
        ];
        for (var i = 0, length_2 = labels.length; i < length_2; ++i) {
            var style = labels[i];
            this[style[0]] = div.appendChild(this.createElement("label", style[1], style[0]));
        }
    },
    appendCopyright: function (div) {
        var texts = [
            "首次加载耗时较长，再等等就好了哦~",
            "抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。",
            "适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。",
            "审批文号：国新出审[2019]1369号，著作权人：深圳悠悠互动科技有限公司",
            "出版单位：成都盈众九州网络科技有限公司，出版物号：ISBN 978-7-498-06499-8"
        ];
        var styles = [
            "position:absolute;left:10px;top:108px;width:700px;text-align:center;color:#ff0000;font-size:22px;font-family:'SimHei';",
            "position:absolute;left:10px;top:140px;width:700px;text-align:center;color:#ffffff;font-size:22px;font-family:'SimHei';",
            "position:absolute;left:10px;top:164px;width:700px;text-align:center;color:#ffffff;font-size:22px;font-family:'SimHei';",
            "position:absolute;left:10px;top:198px;width:700px;text-align:center;color:#ffffff;font-size:18px;font-family:'SimHei';",
            "position:absolute;left:10px;top:218px;width:700px;text-align:center;color:#ffffff;font-size:18px;font-family:'SimHei';"
        ];
        for (var i = 0, length_3 = texts.length; i < length_3; ++i) {
            var label = this.createElement("label", styles[i]);
            label.innerText = texts[i];
            div.appendChild(label);
        }
    },
    appendProgressDiv: function (root) {
        var div = this.createElement("div", "position:absolute;width:720px;heigh:100px;bottom:240px;", "proDiv");
        this.appendProgress(div);
        this.appendCopyright(div);
        root.appendChild(div);
    },

    removeScrollDiv: function () {
        var div = document.getElementById("scrollDiv");
        if (div) {
            div.remove();
        }
    },
    init: function () {
        document.body.style.cssText = "position:fixed;margin:0;overflow:hidden;overflow-x:hidden;overflow-y:hidden;background-color:#000000;";
        var con = this.createElement("div", "position:absolute;height:1280px;width:720px;visibility:visible", "con");
        this.bg = this.createImageElement("html_login/image_loading_bg.jpg", "position: absolute;left:-120px;top:-140px; visible:'true';", "loadingBg");
        this.bg.style.visibility = selectServerView.isVideo ? "hidden" : "visible";
        con.appendChild(this.bg);
        this.appendProgressDiv(con);
        document.body.appendChild(con);
        function touchMoveHandler(e) {
            // e.preventDefault();
        }
        document.body.addEventListener("touchmove", touchMoveHandler);
        function zoom() {
            var initW = window.innerWidth || document.body.clientWidth;
            var initH = window.innerHeight || document.body.clientHeight;
            if (initW > screen.availWidth) {
                initW = screen.availWidth;
            }
            var zoomW = initW / 720;
            var zoomH = initH / 1280;
            var zoom = zoomW < zoomH ? zoomW : zoomH;
            con.style.webkitTransform = "scale(" + zoom + ")";
            con.style.left = (initW - 720) * 0.5 + "px";
            con.style.top = (initH - 1280) * 0.5 + "px";
        }
        zoom();
        window.addEventListener("resize", zoom);
    },
};

var bootstrap = {
    step: 0,
    start: 0,
    routine: "",
    scriptCount: 0,
    scriptQueue: new Array(),
    libraryAsset: null,
    mainAsset: null,
    loadScriptFromUrl: function (url, onComplete) {
        var script = window.document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = onComplete.bind(this);
        document.body.appendChild(script);
    },
    loadScriptFromMemory: function (content, onComplete) {
        var _this = this;
        var url = URL.createObjectURL(new Blob([content]));
        this.loadScriptFromUrl(url, function (e) {
            URL.revokeObjectURL(url);
            onComplete.call(_this, e);
        });
    },
    openRequest: function (url, type, onComplete) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.responseType = type;
        request.onreadystatechange = function (e) {
            var request = e.target;
            if (request.readyState != 4) {
                return;
            }
            if (request.status == 200 || (request.status == 0 && request.response != null && request.response.byteLength > 0)) {
                onComplete.call(_this, e);
            }
            else {
                onComplete.call(_this, e);
            }
        };
        request.open("GET", url);
        request.send();
        return request;
    },

    onLoadComplete: function () {
        this.step = 3;
        // console.log("引导加载完成......", Date.now() - this.start, Date.now());
        record_step(2, 0);
        showProgressInterface(3, 3, 1, "初始化中。。。");
        modules.common.PlatParams.platform = gameParams.channel;
        modules.common.PlatParams.account = gameParams.account;
        modules.common.PlatParams.userId = gameParams.userId;
        modules.common.PlatParams.serverId = gameParams.serverId;
        modules.common.PlatParams.cdn = gameParams.cdn;
        modules.common.PlatParams.data = gameParams.data;
        modules.common.PlatParams.package = gameParams.package ? parseInt(gameParams.package) : 0;
        modules.common.PlatParams.newRegister = gameParams.newregister;
        modules.login.LoginModel.instance.selectedServer = gameParams.selectedServer;
        modules.login.LoginModel.instance.allParams = gameParams;
        dawSDK.setServerParams(gameParams);
        modules.login.LoginModel.instance.startParams = dawSDK.startParams;
        var routine = this.routine;
        setTimeout(function () {
            //DEBUG = true;
            new Main(gameParams.userId, routine);
            if (selectServerView.isVideo) {
                setTimeout(function () {
                    loadingView.bg.style.visibility = "visible";
                    document.getElementById("videoCon") && document.getElementById("videoCon").remove()
                }, 10000);
            }
            if (window.location.href.indexOf("http://192.168.") != -1) {
                console.log("测试号 默认显示帧率数据(无论正式服测试服都显示)!!!");
                Laya.Stat.show()
            }
        }, 0);
    },

    loadScriptQueue: function () {
        showProgressInterface(0, 3, this.scriptCount ? (this.scriptCount - this.scriptQueue.length) / this.scriptCount : 1, "加载工具库。。。");
        if (this.scriptQueue.length != 0) {
            var asset = this.scriptQueue.shift();
            this.loadScriptFromUrl(asset.url, this.loadScriptQueue);
        }
        else {
            this.step = 1;
            this.onLoadComplete();
        }
    },
    init: function () {
        this.start = Date.now();
        var host = gameParams.cdn;
        if (host != "" && host[host.length - 1] != "/") {
            host += "/";
        }
        gameParams.cdn = host;
        record_step(1, 0);
        var version = Date.now();
        function buildAsset(name, type) {
            var v = versions[name];
            return {
                url: "" + host + name + "?v=" + (v ? v : version),
                type: type,
                desc: "",
                status: 0
            };
        }
        // 加载Laya库文件
        var libs = ["core", "webgl", "html", "ui", "d3", "ani"];
        for (var _i = 0, libs_1 = libs; _i < libs_1.length; _i++) {
            var name_1 = libs_1[_i];
            this.scriptQueue.push(buildAsset("libs/laya." + name_1 + ".js", "js"));
        }
        this.scriptQueue.push(buildAsset("js/main.js", "js"));
        this.scriptCount = this.scriptQueue.length;

        updateTotalProgress(-1);
        this.loadScriptQueue();
    }
};
var totalPer = 0;
function showProgressInterface(curIndex, maxCount, value, str) {
    var pro = value * 596;
    var per = curIndex / maxCount;
    loadingView.progressBar1.style.width = (per * 596).toString();
    loadingView.proLabel1.innerText = (per * 100 >> 0) + "%";
    loadingView.progressBar2.style.width = (pro > 596 ? 596 : pro).toString();
    loadingView.progressWalker.style.left = (per * 596 - 40).toString();
    loadingView.progressLight.style.left = (per * 596 - 77).toString();
    loadingView.proLabel.innerText = str;
    loadingView.proLabel2.innerText = (value * 100 >> 0) + "%";
}
var loadingPer = 0;
var loadingTimeStamp = 0;
var requestAnimationFrameId = 0;
function updateTotalProgress(time) {
    if (time === -1) {
        window.cancelAnimationFrame(requestAnimationFrameId);
        loadingTimeStamp = -1;
        loadingPer = 0;
        requestAnimationFrameId = window.requestAnimationFrame(updateTotalProgress);
        return;
    }
    else if (time === -2) {
        window.cancelAnimationFrame(requestAnimationFrameId);
        return;
    }
    if (loadingTimeStamp === -1)
        loadingTimeStamp = time;
    var t = time - loadingTimeStamp;
    loadingTimeStamp = time;
    if (totalPer > loadingPer)
        loadingPer = totalPer;
    if (loadingPer < 0.3) {
        loadingPer += (Math.random() * 0.02 + 0.01) / (Math.random() * 300 + 200) * t;
    }
    else if (loadingPer < 0.6) {
        loadingPer += (Math.random() * 0.15 + 0.01) / (Math.random() * 400 + 400) * t;
    }
    else if (loadingPer < 0.9) {
        loadingPer += (Math.random() * 0.01 + 0.01) / (Math.random() * 600 + 600) * t;
    }
    else if (loadingPer < 1) {
        loadingPer += 0.01 / 100 * t;
    }
    if (loadingPer > 0.9999)
        loadingPer = 0.9999;
    loadingView.progressBar1.style.width = (loadingPer * 596).toString();
    loadingView.progressWalker.style.left = (loadingPer * 596 - 40).toString();
    loadingView.progressLight.style.left = (loadingPer * 596 - 77).toString();
    loadingView.proLabel1.innerText = (loadingPer * 100).toFixed(2) + "%";
    if (loadingPer < 0.9999) {
        requestAnimationFrameId = window.requestAnimationFrame(updateTotalProgress);
    }
}
function firstEnterGameScene() {
    bootstrap = null;
    loadingView.removeScrollDiv();
}
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
function reqRecordError(error) {
    if (error instanceof Array) {
        error.unshift(`sdk: ${dawSDK.user_token}`)
    }
    var serverId = "0";
    if (modules && modules.login && modules.login.LoginModel.instance.selectedServer) {
        serverId = modules.login.LoginModel.instance.selectedServer.server_id || "0";
    }
    /* 错误类型  0-100
     * 0-未定义的系统错误
     * 1-待完善
     */
    let type = 0; 
    let parmas = `server_id=${serverId}&account=${gameParams.account}&error="${error}"&type=${type}`;

    let requestUrl = gameParams.backstage + "game/errorCollection";
    if (dawSDK.current_platform == dawSDK.platform.formal) { 
        requestUrl = gameParams.backstage + "game/error/upload";
    }
    console.log(utf8_to_b64(parmas));
    $.ajax({
        url: requestUrl,
        dataType: 'json',
        type: "POST",
        timeout: 5000,
        data: {
            p: utf8_to_b64(parmas)
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })


}
window.onerror = function (event, source, lineno, colno, error) {
    if (error) {
        reqRecordError(gameParams.account + ": \n" + event + "\n" + (error.stack || error));
    }
};
function enterGame() {
    var fillFun = function (value, start, end) {
        start = start || 0;
        end = end || this.length;
        if (start < 0) {
            start = this.length + start;
        }
        if (end < 0) {
            end = this.length + end;
        }
        if (start >= this.length) {
            return;
        }
        if (end > this.length) {
            end = this.length;
        }
        while (start < end) {
            this[start++] = value;
        }
        return this;
    };
    var types = [Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Int8Array, Int16Array, Int32Array, Float32Array, Float64Array];
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var t = types_1[_i];
        if (!t.prototype.fill) {
            t.prototype.fill = fillFun;
        }
    }
    function launchFullScreen(element) {
        if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    }
    // if (window.navigator.userAgent.indexOf("Mobile") > -1)
    //     launchFullScreen(document.documentElement);
    loadingView.init();
    requestAnimationFrameId = window.requestAnimationFrame(updateTotalProgress);
    bootstrap.init();
}
