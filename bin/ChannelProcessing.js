//解析url参数
function getUrlParamsCode(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

// 通用XHR发送请求方法
function sendXHR(url, data, callBack) {
    // console.log("Http XHR Request:", url);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onload = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 301)) {
            if (callBack) callBack(xhr.response);
        }
    };
    xhr.open("GET", url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

// 发起支付，实际是向后台发送支付信息，由后台生成并返回订单，然后再向平台发起支付
function ask_pay(roleId, roleName, roleLevel, roleCareer, productId, price) {
    let params = `server_id=${modules.login.LoginModel.instance.selectedServer.server_id}&channel=${gameParams.channel}&role_name=${roleName}&account=${gameParams.account}&product_id=${productId}&role_level=${roleLevel}&package=${gameParams.package}&role_id=${roleId}&role_career=${roleCareer}`;
    console.log(params);
    var str = utf8_to_b64(params);

    let requestUrl = gameParams.backstage + "game/makeOrder";
    if (dawSDK.current_platform == dawSDK.platform.formal) {
        requestUrl = gameParams.backstage + "game/make/order";
    }

    dawSDK.send(requestUrl, 'POST', { p: str }, askPayCallBack);
}

// 支付后台回调，生成订单信息和要发给平台的信息
function askPayCallBack(res) {
    if (!res || res.errCode != 1) {
        alert('生成订单失败');
        return;
    }
    var payInfo = {};
    payInfo.productID = res.data.data.props_name;                                                        //产品ID
    payInfo.productNAME = res.data.data.props_name;                                                      //产品名称
    payInfo.extension = res.data.data.trade_no;                                                          //游戏透传，自定义数据
    payInfo.roleID = res.data.data.role_id;                                                              //角色ID
    payInfo.roleNAME = res.data.data.role_name;                                                          //角色名称
    payInfo.serverID = 'sf' + res.data.data.server_id;                                                   //服务器ID
    payInfo.serverNAME = res.data.data.server_name;                                                      //服务器名字
    payInfo.amount = (res.data.data.amount / 100).toFixed(2);                                            //单位 元（精确到小数后两位）

    dawSDK.pay(payInfo);
}

var dawSDK = {
    // game_id: 1071, // 测试服
    // pack: "8070",  // 测试服
    game_id: 1080,    // 正式服
    pack: "1000",     // 正式服
    token: null,
    user_token: null,
    daw_channel: 'test',
    only_server: 0,
    current_platform: 0,
};

dawSDK.platform = {
    sdk: 0,                 // 正式
    sdk_test: 1,            // 测试
    sdk_inner_test: 2,      // 内网测试
    sdk_zhubo: 3,           // 主播服
    formal: 4,              // 正式服·新
}
dawSDK.platformStr = [
    "SDK-正式服", "SDK-测试服", "内网测试", "SDK-主播服", "SDK-正式服·新",
]

// sdk交互地址
dawSDK.PHPApi = [
    "https://v3.sdk.haowusong.com/",                // SDK-正式服
    "https://v5.sdk.ssche.cn/",                     // SDK-测试服
    "http://192.168.10.30/",                        // 内网测试
    "https://awy.ssche.cn/",                        // SDK-主播服
    "https://v3.sdk.haowusong.com/"                 // SDK-正式服·新
]

// 后台交互地址 老余那边 ，获取服务器数据，账号数据
dawSDK.GmApi = [
    "https://admin.jyhd.ssche.cn/api/",             // SDK-正式服
    "https://test.admin.lkjh.ssche.cn/api/",        // SDK-测试服
    "http://192.168.10.30:8024/api/",               // 内网测试
    "https://admin.jyhd.ssche.cn/api/",             // SDK-主播服
    "http://jyhd.api.ssche.cn/"                     // SDK-正式服·新
]
dawSDK.Api_host = dawSDK.GmApi[dawSDK.platform.sdk]                                         // 游戏访问区服链接
dawSDK.Php_host = dawSDK.PHPApi[dawSDK.platform.sdk]                                        // 游戏后台访问链接
dawSDK.gameParams = {}
dawSDK.startParams = {}
dawSDK.init = function () { }

// 快手审核 
function kuaiShouData(token) {
    // 提审模式  1-提审 0-正常
    let is_set = 0;
    if (window.location.host == "game.bycq.douaiwan.net") {
        token = "kuaishou_" + Math.round((Math.random() * 900000))
        is_set = 1;
    }
    return { is_set, token }
}
//清除用户缓存
dawSDK.clearCache = function () {
    if (window.indexedDB) {
        try {
            window.indexedDB.deleteDatabase("routine");
            console.log("清理完毕");
        } catch (e) {
            console.log("清理异常");
        }
    }
    else {
        console.log("清理返回");
    }
}

// 初次进入游戏加载数据
dawSDK.onEnter = function (callBack) {
    var platform = getUrlParamsCode("platform") || "0";                                     // 平台类型
    var daw_channel = getUrlParamsCode("daw_channel") || dawSDK.daw_channel;                // 渠道
    var user_token = getUrlParamsCode("user_token") || dawSDK.user_token;                   // sdk平台访问token
    var acc_token = getUrlParamsCode("token") || dawSDK.token;                              // 用户token
    var daw_gameid = getUrlParamsCode("daw_gameid") || dawSDK.game_id;                      // 游戏id
    var pack = getUrlParamsCode("package") || dawSDK.pack;                                  // 游戏包
    var debugModel = getUrlParamsCode("debug") || false;                                    // 测试模式
    var only_server = getUrlParamsCode("only_server") || dawSDK.only_server;                // 是否为专服  0-混服 1-专服
    var debug_configs = getUrlParamsCode("configs") || null;                                // 策划调试

    dawSDK.game_id = daw_gameid;
    dawSDK.user_token = user_token;
    dawSDK.daw_channel = daw_channel;
    dawSDK.current_platform = platform;

    if (!acc_token) {
        let arr = [];
        arr.push('token' + "=" + "yanfa_1");
        arr.push('platform' + "=" + "0");
        arr.push('daw_channel' + "=" + daw_channel);
        arr.push('user_token' + "=" + user_token);
        arr.push('daw_gameid' + "=" + daw_gameid);
        arr.push('package' + "=" + dawSDK.pack);
        arr.push("t=" + (new Date()).getTime());
        window.location.href = "index.html?" + arr.join("&");
        return;
    }

    let { is_set, token } = kuaiShouData(acc_token);

    dawSDK.platformLoad(debugModel);
    if (DEBUG) {
        dawSDK.startParams.configs = debug_configs
    } else {
        dawSDK.startParams = {}
    }

    // 请求地址
    let requestUrl = `${dawSDK.Api_host}game/getTestServer?only_server=${only_server}&package=${pack}&account=${token}&is_set=${is_set}`;
    // 新的正式服地址
    if (dawSDK.current_platform == dawSDK.platform.formal) {
        requestUrl = `${dawSDK.Api_host}game/server?only_server=${only_server}&package=${pack}&account=${token}&is_set=${is_set}`;
    }

    dawSDK.send(requestUrl, "GET", {}, function (result) {
        // console.log("服务器返回：", result);
        if (!result) return;
        if (result.errCode == 1) {
            var Data = {};
            var resultData = result.data;
            var serverData = resultData.s;
            Data.account = resultData.user.openId;
            Data.uid = resultData.user.openId;
            Data.token = resultData.user.openId.slice(6);
            Data.channel = resultData.channel;
            Data.package = resultData.package;
            Data.mac = '';
            Data.cdn = resultData.cdn;
            Data.rvtype = 0;
            Data.newregister = resultData.newregister;
            Data.sign = resultData.sign;
            Data.platform = platform
            Data.daw_channel = daw_channel
            Data.user_token = user_token
            Data.only_server = only_server
            Data.is_set = is_set

            var serverSelect = {
                'server_id': serverData.server_id,
                'name': serverData.name,
                'server_num': parseInt(serverData.server_num),
                'channel_num': parseInt(serverData.channel_num),
                'server_addr': serverData.server_addr,
                'server_port': parseInt(serverData.server_port),
                'status': parseInt(serverData.status),
                'tick': parseInt(serverData.tick),
                'sign': serverData.sign,
                'package': parseInt(resultData.package),
                'cdn': '',
                'resVer': serverData.resVer || '',
            };
            Data.notices = { alert: 0, html: "祝您游戏愉快", title: "公告" }
            Data.selected_server = serverSelect;

            Data.userId = Data.uid
            Data.account = Data.uid
            Data.backstage = dawSDK.Api_host
            Data.cdn = "";
            Data.mac = 0;
            Data.selectedServer = Data.selected_server

            dawSDK.gameParams = Data
            callBack && callBack()

            //判断是否缓存
            let web_version = localStorage.getItem("web_version") || "";
            if (resultData.web_version != web_version) {
                localStorage.setItem("web_version", resultData.web_version);
                // dawSDK.setClearCache();
                dawSDK.clearCache();
            }
        } else {
            alert("获取用户信息：" + result.error);
        }
    })
};

dawSDK.setServerParams = function (params) {
    if (!params) return;

    let selectedServer = params.selectedServer

    var platform = getUrlParamsCode("platform") || null;                                                                    // 平台类型
    if (platform == 2) dawSDK.startParams.configs = selectedServer.server_num + ""
}

dawSDK.send = function (url, type, arr, callBack) {
    // console.log("发送http请求:", url, type, arr);
    $.ajax({
        url: url /*+ "?ver=1.0"*/,                                                                                               //地址
        dataType: 'json',                                                                                                    //数据类型
        type: type == 'GET' ? 'GET' : "POST",                                                                                //类型
        timeout: 5000,                                                                                                       //超时
        data: arr,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': arr['token'],
            'user_token': arr['user_token'],
        },
        //请求成功
        success: function (result) {
            callBack && callBack(result)
        },
        error: function (result) {
            if (!result.responseJSON) {
                callBack && callBack({ code: 400, error: '网络错误' })
            } else {
                callBack && callBack(result.responseJSON)
            }
        }
    })
}
dawSDK.wxtSend = function (url, arr, callBack) {
    let _arr = {}
    _arr = arr
    _arr['token'] = dawSDK.platform.token
    _arr['server_id'] = _arr['qu_id'] = _arr['serverID'] = modules.login.LoginModel.instance.selectedServer.server_id;      //服务器ID
    _arr['serverName'] = modules.login.LoginModel.instance.selectedServer.namem;                                            //服务器名称
    _arr['game_id'] = dawSDK.game_id;
    _arr['role_id'] = modules.player.PlayerModel.instance.actorId;
    _arr['channel'] = gameParams.daw_channel || null;
    dawSDK.send(dawSDK.Php_host + "api/jiuzhou/sign", 'POST', _arr, (result) => {
        _arr['sign'] = result.data
        dawSDK.send(dawSDK.Php_host + url, 'POST', _arr, (data) => {
            callBack && callBack(data)
        })
    })
}
dawSDK.platformLoad = function (isDebugModel) {
    var platform = getUrlParamsCode("platform") || null;                                                                    // 平台类型
    let token = getUrlParamsCode("token") || null;                                                                    // 平台类型
    if (platform == '0' || !platform) {
        platform = dawSDK.platform.sdk;
    }
    dawSDK.Api_host = dawSDK.GmApi[platform]
    dawSDK.Php_host = dawSDK.PHPApi[platform]
    DEBUG = platform % 2 != 0;

    // 主播服debug关闭
    if (platform == 3) {
        DEBUG = false;
    }                                                                                              // 奇数都为测试服
    if (isDebugModel) DEBUG = isDebugModel;                                                                                 // 地址栏控制是否为debug模式
    //console.log('认证测试', location.host.indexOf('192.168.10.30'), location.host)
    // if (location.host.indexOf('192.168.10.30') > -1) {
    //     dawSDK.Api_host = 'http://192.168.10.30:8024/api/game/';
    // }

    console.log("渠道来源:", dawSDK.platformStr[platform], "平台:" + platform, "调试模式:" + DEBUG, "游戏账号:" + token)

}

dawSDK.pay = function (data) {
    console.log("渠道:SDK九州  调起支付", data.extension)

    DouaiwanSdk.pay(data, function (callBackData) {
        console.log("渠道:SDK九州支付回调:", callBackData);

        if (callBackData.status == true) {
            if (callBackData.message == "onPaySucceed") {
                modules.notice.SystemNoticeManager.instance.addNotice("支付成功!");
            } else if (callBackData.message == "onSending") {
                modules.notice.SystemNoticeManager.instance.addNotice("支付成功，发货中!");
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("支付回调参数异常!", true);
            }
        } else {
            modules.notice.SystemNoticeManager.instance.addNotice("支付失败!", true);
        }
        // 支付回调后请求数据
        modules.redpack.RedPackCtrl.instance.touchSuperRedPackData();
    });
}

// 平台支付回调
function platformPayCallBack(status, data) {
    // 支付成功
    if (status === 0) {
        alert("支付成功");
    }
    // 支付失败
    else if (status === 1) {
        modules.common.CommonUtil.alert("提示", "支付失败");
    }
    // 支付取消
    else if (status === 2) {
        modules.common.CommonUtil.alert("提示", "支付取消");
    }
}

//sdk请求 使用http 
function SDKNet(url, any, call, that) {
    let api = dawSDK.Php_host;
    let _arr = any;

    _arr['token'] = dawSDK.user_token;
    _arr['server_id'] = _arr['qu_id'] = _arr['serverID'] = modules.login.LoginModel.instance.selectedServer.server_id;  //服务器ID
    _arr['serverName'] = modules.login.LoginModel.instance.selectedServer.namem;                                        //服务器名称
    _arr['role_id'] = modules.player.PlayerModel.instance.actorId;
    _arr['game_id'] = dawSDK.game_id;//游戏ID
    _arr['channel'] = dawSDK.daw_channel || null;

    if (!_arr['api_type'] || _arr['api_type'] == 'GET') {
        dawSDK.send(api + url, 'GET', _arr, (data) => {
            call && call.call(that, data)
        })
    } else {
        dawSDK.send(api + url, 'POST', _arr, (data) => {
            call && call.call(that, data)
        })
    }

}

// 后台创建角色
function player_create(role_id, role_name, role_level) {
    var roleInfo = {};
    roleInfo.serverID = modules.login.LoginModel.instance.selectedServer.server_id;                     //服务器ID
    roleInfo.serverName = modules.login.LoginModel.instance.selectedServer.name;                        //服务器名称
    roleInfo.roleID = role_id;                                                                          //角色ID
    roleInfo.roleName = role_name;                                                                      //角色名称
    roleInfo.roleLevel = role_level;                                                                    //角色等级
    roleInfo.money = 0;                                                                                 //游戏币数量（充值代币）
    roleInfo.vip = 1;                                                                                   //vip等级
    roleInfo.power = 0;                                                                                 //战斗力
    //自营九州 SDK方式
    DouaiwanSdk.submitExtraData(roleInfo, function (callbackData) {
        console.log(dawSDK.platformStr[dawSDK.gameParams.platform], "游戏上报_创建角色", callbackData)
    });
}
// 后台登录
function player_login(role_id, role_name, role_level) {
    let roleInfo = {};
    //自营九州 SDK方式
    roleInfo.serverID = modules.login.LoginModel.instance.selectedServer.server_id;             //服务器ID
    roleInfo.serverName = modules.login.LoginModel.instance.selectedServer.name;                //服务器名称
    roleInfo.roleID = role_id;                                                                  //角色ID
    roleInfo.roleName = role_name;                                                              //角色名称
    roleInfo.roleLevel = role_level;                                                            //角色等级
    roleInfo.money = 100;                                                                       //游戏币数量（充值代币）
    roleInfo.vip = 1;                                                                           //vip等级
    roleInfo.power = PlayerModel.instance.fight;                                                //战斗力

    //如果战力没有获取到 取消此次上报 防止异常错误
    if (PlayerModel.instance.fight > 0) {
        DouaiwanSdk.submitExtraData(roleInfo, function (callbackData) {
            console.log(dawSDK.platformStr[dawSDK.gameParams.platform], "游戏上报_后台登录", callbackData)
        });
    }
}
// 后台角色升级
function player_level_up(role_id, role_name, role_level) {
    let roleInfo = {};
    roleInfo.serverID = modules.login.LoginModel.instance.selectedServer.server_id;                     //服务器ID
    roleInfo.serverName = modules.login.LoginModel.instance.selectedServer.name;                        //服务器名称
    roleInfo.roleID = role_id;                                                                          //角色ID
    roleInfo.roleName = role_name;                                                                      //角色名称
    roleInfo.roleLevel = role_level;                                                                    //角色等级
    roleInfo.money = 100;                                                                               //游戏币数量（充值代币）
    roleInfo.vip = 1;                                                                                   //vip等级
    roleInfo.power = PlayerModel.instance.fight;                                                        //战斗力

    //锦衣寒刀 SDK方式
    DouaiwanSdk.submitExtraData(roleInfo, function (callbackData) {
        console.log(dawSDK.platformStr[dawSDK.gameParams.platform], "游戏上报_角色升级", callbackData)
    });
}

// 登出
function logout() {
    DouaiwanSdk.logout();
}
// 登出回调
function logoutCallBack(status) {
    alert(status);
}


// 后台分享
function player_share(role_id, callback) { }
// 关注
function player_follow(role_id, callback) { }
//实名认证
function player_realname(callback) { }
//手机绑定
function player_bindphone(callback) { }
// 后台收藏
function player_collect(id, name) { }

// 埋点
function record_step(step, role_id) {
    // console.log("埋点!!!!!!!!!!!");
    if (gameParams.channel != null && gameParams.package != null) {
        var serverTmpId = 0;
        var str;
        if (gameParams.newregister === 1) {
            serverTmpId = gameParams.selectedServer.server_id;
        }
        if (step > 3) {
            serverTmpId = modules.login.LoginModel.instance.selectedServer.server_id;
        }
        str = utf8_to_b64(`channel=${gameParams.channel}&package=${gameParams.package}&server=${serverTmpId}&status=${step}&account=${gameParams.account}&only_server=${gameParams.only_server}&sign=${gameParams.sign}&mac=${gameParams.mac}&role_id=${role_id}`);
        sendXHR(gameParams.backstage + "game/node?p=" + str, null, null);
    }
}
function saveJSON(data, filename) {
    if (!data) {
        alert('保存的数据为空');
        return;
    }
    if (!filename)
        filename = 'json.json'
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], { type: 'text/json' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}