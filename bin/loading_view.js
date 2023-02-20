"use strict";

var initW = window.innerWidth || document.body.clientWidth;
var initH = window.innerHeight || document.body.clientHeight;

function createElement(tagName, id, name, src, style,){
    let ele = document.createElement(tagName);
    if(id) ele.id = id;
    if(name) ele.name = name;
    if(src) ele.src = window.cdn + src;
    ele.style.cssText = style;
    return ele;
}
document.body.style.cssText = "position:fixed;margin:0;overflow:hidden;overflow-x:hidden;overflow-y:hidden;background-color: #000000;";
let con = createElement("div", "con", null, null, "position:absolute;height:1280px;width:720px;visibility: hidden");
con.appendChild(createElement("img", "loadingBg", null, "html_login/image_loading_bg.jpg?v=3", "position: absolute;left:-120px;top:-140px;"));
let scrollDiv = createElement("div", "scrollDiv", null, null, "position: absolute;left:130px;top:860px;width: 444px;height: 112px;overflow: hidden;");
con.appendChild(scrollDiv);
let items = [];
let tops = [112, 140, 168, 196, 224];
let sexImgs = [];
let nameTxts = [];
let descTxts = [];
for(let i = 0; i < 5; i++){
    let item = createElement("div", null, null, null, "position: absolute;width: 444px;height: 30px;text-align: center;");
    sexImgs[i] = createElement("img", null, null, null, "vertical-align: middle;");
    item.appendChild(sexImgs[i]);
    nameTxts[i] = createElement("span", null, null, null, "font-size:22px;font-family: 'SimHei';vertical-align: middle;");
    item.appendChild(nameTxts[i]);
    descTxts[i] = createElement("span", null, null, null, "color:#FFFFFF;font-size:22px;font-family: 'SimHei';vertical-align: middle;");
    item.appendChild(descTxts[i]);
    items[i] = item;
    scrollDiv.appendChild(item);
}
let proDiv = createElement("div", "proDiv", null, null, "position: absolute;width:720px;heigh:100px;bottom:240px;");
con.appendChild(proDiv);
proDiv.appendChild(createElement("img", "progressBg1", null, "html_login/progress_jz_jdt2_0.png", "position:absolute;left:0px;top:0px;width:720px;height:56px;"));
proDiv.appendChild(createElement("img", "progressBar1", null, "html_login/progress_jz_jdt_1.png", "position:absolute;left:60px;top:20px;width:596px;height:16px;"));
proDiv.appendChild(createElement("img", "progressBg2", null, "html_login/progress_jz_jdt1_0.png", "position:absolute;left:0px;top:50px;width:720px;height:56px;"));
proDiv.appendChild(createElement("img", "progressBar2", null, "html_login/progress_jz_jdt_1.png", "position:absolute;left:60px;top:70px;width:596px;height:16px;"));
proDiv.appendChild(createElement("img", "progressWalker", null, "html_login/progressWalker.gif", "position:absolute;left:123px;top:-76px;width:111px;height:88px;"));
proDiv.appendChild(createElement("img", "progressLight", null, "html_login/progressLight.png", "position:absolute;left:123px;top:-11px;width:167px;height:54px;"));
proDiv.appendChild(createElement("label", "proLabel", null, null, "position:absolute;left:10px;top:-16px;width: 700px; text-align: center;color: #FFF8D7;font-size:24px;font-family:'SimHei';text-shadow: 0 1px 3px #A56A3E, 1px 0 3px #A56A3E, -1px 0 3px #A56A3E, 0 -1px 3px #A56A3E"));
proDiv.appendChild(createElement("label", "proLabel1", null, null, "position:absolute;left:10px;top:18px;width:700px;text-align:center;color:#FFFFFF;font-size:20px;font-family: 'SimHei';text-shadow: 0 1px 3px #430B51, 1px 0 3px #430B51, -1px 0 3px #430B51, 0 -1px 3px #430B51"));
proDiv.appendChild(createElement("label", "proLabel2", null, null, "position:absolute;left:10px;top:68px;width:700px;text-align:center;color:#FFFFFF;font-size:20px;font-family: 'SimHei';text-shadow: 0 1px 3px #430B51, 1px 0 3px #430B51, -1px 0 3px #430B51, 0 -1px 3px #430B51"));
let label = createElement("label", null, null, null, "position:absolute;left:10px;top:100px;width:700px;text-align:center;color:#FFacac;font-size:22px;font-family: 'SimHei';");
label.innerText = "首次加载耗时较长，再等等就好了哦~";
proDiv.appendChild(label);
label = createElement("label", null, null, null, "position:absolute;left:10px;top:140px;width:700px;text-align:center;color:#7B5B76;font-size:22px;font-family: 'SimHei';");
label.innerText = "抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。";
proDiv.appendChild(label);
label = createElement("label", null, null, null, "position:absolute;left:10px;top:164px;width:700px;text-align:center;color:#7B5B76;font-size:22px;font-family: 'SimHei';");
label.innerText = "适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。";
proDiv.appendChild(label);
label = createElement("label", null, null, null, "position:absolute;left:10px;top:198px;width:700px;text-align:center;color:#7B5B76;font-size:18px;font-family: 'SimHei';");
label.innerText = "审批文号：国新出审[2019]1369号，著作权人：深圳悠悠互动科技有限公司";
proDiv.appendChild(label);
label = createElement("label", null, null, null, "position:absolute;left:10px;top:218px;width:700px;text-align:center;color:#7B5B76;font-size:18px;font-family: 'SimHei';");
label.innerText = "出版单位：成都盈众九州网络科技有限公司，出版物号：ISBN 978-7-498-06499-8";
proDiv.appendChild(label);
document.body.appendChild(con);

var doomLoaded = false;
// 禁用拖动
document.body.addEventListener("touchmove", touchMoveHandler);

function touchMoveHandler(e) {
    e.preventDefault();
}

// document.body.addEventListener("touch", touchStartHandler);
function zoom() {
    if (!doomLoaded) return;
    // alert(window.innerWidth + "   " + window.innerHeight + "   " + document.body.clientWidth + "   " + document.body.clientHeight);
    var con = document.getElementById("con");
    initW = window.innerWidth || document.body.clientWidth;
    initH = window.innerHeight || document.body.clientHeight;
    if (initW > screen.availWidth) {
        initW = screen.availWidth;
    }
    var zoomW = initW / 720;
    var zoomH = initH / 1280;
    var zoom = zoomW < zoomH ? zoomW : zoomH;
    // con.style.webkitTransform = "translate(" + (initW - 720 * zoom) * 0.5 + "px,0px) scale("+ zoom + ")";
    con.style.webkitTransform = "scale(" + zoom + ")";
    con.style.left = (initW - 720) * 0.5 + "px";
    con.style.top = (initH - 1280) * 0.5 + "px";
}

function domLoadedHandler() {
    document.getElementById("con").style.visibility = "visible";
    doomLoaded = true;
    zoom();

    window.requestAnimationFrame(scrollLoop);
    if(window.enterGame) enterGame();
}

window.addEventListener("resize", zoom);
// document.addEventListener("DOMContentLoaded", domLoadedHandler);
domLoadedHandler();


var mainLoaded = false;
let firstGenerate = true;
function scrollLoop() {
    if(mainLoaded) return;
    window.requestAnimationFrame(scrollLoop);
    if(window._familyNames) {
        if(firstGenerate){
            firstGenerate = false;
            for (let i = 0; i < items.length; i++) {
                randomGenerate(i);
            }
        }
        for (let i = 0; i < items.length; i++) {
            if (tops[i] === -28) {
                tops[i] = 112;
                randomGenerate(i);
            }
            items[i].style.top = tops[i] + "px";
            tops[i]--;
        }
    }
}

let familyArr = [];
let symbolArr = [];
// 随机生成
function randomGenerate(index){
    let isMan = Math.random() < 0.25;
    let needSymbol = Math.random() < 0.5;
    sexImgs[index].src = window.cdn + (isMan ? "html_login/icon_loading_nansfh.png" : "html_login/icon_loading_nsfh.png");
    nameTxts[index].style.color = isMan ? "#0f81f5" : "#ff6da7";
    let prefix = isMan ? _manPrefix : _womanPrefix;
    let suffix = isMan ? _manSuffix : _womanSuffix;
    if(needSymbol){
        let randomIndex = Math.floor((_commonPrefix.length + prefix.length) * Math.random());
        let randomPrefix = randomIndex >= _commonPrefix.length ? prefix[randomIndex - _commonPrefix.length] : _commonPrefix[randomIndex];
        symbolArr[0] = randomPrefix;
        symbolArr[1] = _symbols[Math.floor(_symbols.length * Math.random())];
        symbolArr[2] = suffix[Math.floor(suffix.length * Math.random())];
        nameTxts[index].innerHTML = symbolArr.join("");
    }else{
        familyArr[0] = _familyNames[Math.floor(_familyNames.length * Math.random())];
        familyArr[1] = suffix[Math.floor(suffix.length * Math.random())];
        nameTxts[index].innerHTML = familyArr.join("");
    }
    descTxts[index].innerHTML = _descs[Math.floor(_descs.length * Math.random())];
}