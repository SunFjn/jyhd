if (typeof DouaiwanSdk !== "object") {
    DouaiwanSdk = {};
}

(function() {

    var uid = '';
    var token = '';
    var channel = '';
    var discount = '';
    var deviceID = '';
    // var system = JudgeSystem(); // 1.安卓 2 IOS 3 PC
    var system = 5; // h5
    var AppID = '';
    var ClientKey = '';
    var appUid = ''; // 小号ID
    var open_url_Status = 0; //0正常 1重新登陆
    var h5Params = {};


    var urlParams = window.location.search;
    var domain = 'http://v4.h5.haowusong.com'
    var h5Domain = domain + '/index.html'
    var host = 'http://v3.sdk.haowusong.com'
    var iframe = document.createElement("iframe");
    var div = document.createElement('div');
    var isLogin = false;

    /**
     * 把对象存入cookie
     * 把参数存入cookie,cookie 的key 带上前缀，比如master_
     */
    function setCookie(param, object) {
        $.cookie(param, JSON.stringify(object));
    }



    function getQueryString(name) {
        var result = urlParams.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }


    //支付接口
    /**
     *  支付回调
     *  method 状态码 1.onPaySucceed 支付成功 2.onPayFail 支付失败 3.notLogin 未登陆 4.onSending 发货中
     */
    if (typeof DouaiwanSdk.pay !== "function") {
        DouaiwanSdk.pay = function(orderInfo, callback) {
            window.top.postMessage({ method: 'daw_pay', info: orderInfo }, '*')
            console.log("dawSdk 打开支付 ", orderInfo)
            window.onmessage = function(e) {
                if (e.data.method === "daw_onPaySucceed") { // 支付成功
                    callback({ message: 'onPaySucceed', status: true });
                } else if (e.data.method === "daw_onSending") { // 支付成功,发货中
                    callback({ message: 'onSending', status: true })
                } else if (e.data.method === "daw_onPayFail") { // 支付失败
                    callback({ message: 'onPayFail', status: false })
                }
            }

        }
    }


    //提交角色信息接口
    if (typeof DouaiwanSdk.submitExtraData !== "function") {
        DouaiwanSdk.submitExtraData = function(roleInfo, callback) {

            window.top.postMessage({ method: 'daw_submitExtraData', info: roleInfo }, '*')
            console.log("dawSdk 游戏上报 ", roleInfo)
            window.onmessage = function(e) {
                if (e.data.method === "daw_onSubmitSucceed") { // 上报成功
                    callback({ message: 'onSubmitSucceed', status: true });
                } else if (e.data.method === "daw_onSubmitFail") { // 上报失败
                    callback({ message: 'onSubmitFail', status: true })
                }
            }
        }
    }

    //登出接口
    if (typeof DouaiwanSdk.logout !== "function") {
        DouaiwanSdk.logout = function() {
            window.top.postMessage({ method: 'daw_logout' }, '*')
            console.log("dawSdk 退出登录 ")
        }
    }
    //邀请好友
    if (typeof DouaiwanSdk.inviteFriend !== "function") {
        DouaiwanSdk.inviteFriend = function(data) {
            console.log(123564558)
            console.log("农场邀请好友功能", JSON.stringify(data))
            window.top.postMessage({ method: "daw_inviteFriend", data: data }, "*")
        }
    }
     //农场跳转其他游戏
     if (typeof DouaiwanSdk.jumpOtherGame !== "function") {
        DouaiwanSdk.jumpOtherGame = function(data) {
            console.log("跳转其他游戏", JSON.stringify(data))
            window.top.postMessage({ method: "daw_jumpOtherGame", data: data }, "*")
        }
    }

    function changeJSON2QueryString(JSON) {
        var temp = [];
        for (var k in JSON) {
            temp.push(k + "=" + encodeURIComponent(JSON[k]));
        }
        return temp.join("&");
    }

    function jointUrl(data, char = "=") {
        var params = '';
        for (var key in data) {
            params += key + char + data[key] + '&';
        }
        params = params.replace(/&{1}$/, '');
        return params;
    }

    function getSign(options, key) {
        return md5(jointUrl(options) + key).toLowerCase();
    }

    function getSpecialSign(options, key) {
        console.log("getSpecialSign  ===  ", key + jointUrl(options, ':') + key)
        return md5(key + jointUrl(options, ':') + key);
    }

    function openIframe(iframeUrl) {
        document.body.appendChild(iframe);
        iframe.style.display = "block"
        iframe.style.position = "fixed"

        if (window.innerWidth > window.innerHeight) { //横屏
            iframe.style.width = "70%"
            iframe.style.height = "95%"
        } else {
            iframe.style.width = "98%"
            iframe.style.height = "70%"
        }
        iframe.style.left = ((window.innerWidth - iframe.clientWidth) / 2) + 'px'
        iframe.style.top = ((window.innerHeight - iframe.clientHeight) / 2) + 'px'


        iframe.style.border = "none"

        iframe.src = iframeUrl
    }

    function closeIframe() {
        document.body.removeChild(iframe);
    }

    function closeFloatDiv() {
        document.body.removeChild(div);
    }

    function logout() {
        if (system === 1) {
            window.Android.logout();
        } else {
            window.location.reload();
        }
    }

    function JudgeSystem() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            return 1;
        } else if (isiOS) {
            return 2;
        } else {
            return 3;
        }
    }

    function loadUserCenter() {
        var imgUrl = 'http://douaiwan-sdk.oss-cn-beijing.aliyuncs.com/icon/icon.png'
        document.body.appendChild(div);
        div.style.position = "fixed"
        div.style.width = "50px"
        div.style.height = "50px"
        div.style.borderRadius = "50%"
        div.style.backgroundSize = "cover";
        div.style.backgroundImage = "url(" + imgUrl + ")";
        div.id = "DouaiwanSdk";
        div.style.top = "10%";
        div.style.left = "0";
        onMouseBox();
        hideUserCenter()
    }

    function onMouseBox() {
        var box = document.getElementById("DouaiwanSdk");
        var body = document.body;
        var x, y; //全局作用域
        var flag = 0;
        //鼠标按下事件 0级
        box.onmousedown = function(e) { //传入形参e
            flag = 0;
            var mx = e.clientX; //鼠标距离浏览器左
            var my = e.clientY; //鼠标距离浏览器上
            var bx = box.offsetLeft; //盒子距离浏览器左
            var by = box.offsetTop; //盒子距离浏览器上
            x = mx - bx; //实际盒子距离的浏览器左
            y = my - by; //实际盒子距离的浏览器上
            //鼠标移动事件 0级
            body.onmousemove = function(e) { //拿到全局x、y、
                flag = 1;
                //获取当前鼠标移动到的坐标点
                var mx = e.clientX;
                var my = e.clientY;
                //盒子距离浏览器
                box.style.left = mx - x + "px";
                box.style.top = my - y + "px";

            };
            //鼠标弹起事件(松开)
            box.onmouseup = function(e) {
                body.onmousemove = null; //不做任何操作//dom0级事件解除事件绑定
                //获取当前鼠标移动到的坐标点
                var mx = e.clientX;
                var my = e.clientY;
                //盒子距离浏览器
                box.style.left = mx - x + "px";
                box.style.top = my - y + "px";

                if (flag === 0) {
                    var params = {
                        uid,
                        appid: AppID,
                        appkey: ClientKey,
                        machine_code: deviceID,
                        system: system,
                        h5params: 'j4G190baDDe'
                    }
                    var url = h5Domain + '?' + changeJSON2QueryString(params)
                    console.log("userurl ", url)
                    openIframe(url);
                    window_onmessage();
                    // window.onmessage = function(e) {
                    // 	if(e.data.method === "closePay") { // 关闭页面
                    // 		closeIframe();
                    // 	}else if(e.data.method === "hideFloat") { // 隐藏悬浮球
                    // 		closeFloatDiv()
                    // 	}else if(e.data.method === "logout") {  // 退出登录
                    // 		logout()
                    // 	}else if(e.data.method === "copy") { // 复制礼包码
                    // 		console.log(e.data)
                    // 	}
                    // };
                } else {
                    hideUserCenter()
                }
            }
        };

        var oDiv = document.getElementById('DouaiwanSdk');
        var disX, moveX, L, T, starX, starY, starXEnd, starYEnd;
        oDiv.addEventListener('touchstart', function(e) {
            flag = 0;
            e.preventDefault(); //阻止触摸时页面的滚动，缩放
            disX = e.touches[0].clientX - this.offsetLeft;
            disY = e.touches[0].clientY - this.offsetTop;
            //手指按下时的坐标
            starX = e.touches[0].clientX;
            starY = e.touches[0].clientY;

        });
        oDiv.addEventListener('touchmove', function(e) {
            flag = 1;
            L = e.touches[0].clientX - disX;
            T = e.touches[0].clientY - disY;
            //移动时 当前位置与起始位置之间的差值
            starXEnd = e.touches[0].clientX - starX;
            starYEnd = e.touches[0].clientY - starY;
            // console.log("touchmove  ,starX,starY = ",starX,starY)
            console.log("touchmove  ,starXEnd,starYEnd = ", starXEnd, starYEnd)
                // console.log("touchmove  ,disX,disY = ",disX,disY)
                // console.log("touchmove  ,this.offsetLeft,this.offsetTop = ",this.offsetLeft,this.offsetTop)
            if (starXEnd < 10 && starYEnd < 10) {
                flag = 0;
                return;
            }
            if (L < 0) { //限制拖拽的X范围，不能拖出屏幕
                L = 0;
            } else if (L > document.documentElement.clientWidth - this.offsetWidth) {
                L = document.documentElement.clientWidth - this.offsetWidth;
            }
            if (T < 0) { //限制拖拽的Y范围，不能拖出屏幕
                T = 0;
            } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
                T = document.documentElement.clientHeight - this.offsetHeight;
            }
            moveX = L + 'px';
            moveY = T + 'px';

            this.style.left = moveX;
            this.style.top = moveY;
        });
        oDiv.addEventListener('touchend', function(e) {
            console.log("ooooooooooooooooooooooooooon touchend ", flag)
                //判断滑动方向
            if (flag === 0) { //点击
                var params = {
                    uid,
                    appid: AppID,
                    appkey: ClientKey,
                    machine_code: deviceID,
                    system: system,
                    h5params: 'j4G190baDDe'
                }
                var url = h5Domain + '?' + changeJSON2QueryString(params);
                console.log("userurl 222 ", url);
                openIframe(url);
                window_onmessage()
                    // window.onmessage = function(e) {
                    // 	if(e.data.method === "closePay") { // 关闭页面
                    // 		closeIframe();
                    // 	}else if(e.data.method === "hideFloat") { // 隐藏悬浮球
                    // 		closeFloatDiv()
                    // 	}else if(e.data.method === "logout") {  // 退出登录
                    // 		logout()
                    // 	}else if(e.data.method === "copy") { // 复制礼包码
                    // 		console.log(e.data)
                    // 	}
                    // }
            } else {
                hideUserCenter()
            }
        });
        
    }

    function hideUserCenter() {
        var count = 1;
        var timer = setInterval(function() {
            if (count <= 5) {
                count++
            } else {
                clearInterval(timer)
                if (div.style.left !== "-20px") {
                    div.style.left = "-20px";
                }
            }
        }, 2000)

    }
}());