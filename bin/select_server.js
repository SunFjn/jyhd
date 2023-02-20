"use strict";
var selectServerView = {

    isVideo: false,
    cdn: "",
    versions: {
        "loading.js": Date.now()
    },
    selectedLeftItem: null,

    createElement: function (tagName, style, id) {
        var e = document.createElement(tagName);
        if (id)
            e.id = id;
        e.style.cssText = style;
        return e;
    },
    createImageElement: function (src, style, id) {
        var e = this.createElement("img", style, id);
        var v = this.versions[src];
        e.src = v ? "" + this.cdn + src + "?v=" + v : "" + this.cdn + src;
        return e;
    },
    clearItems: function (items) {
        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].remove();
            }
            items.length = 0;
        }
    },
    getStateUrl: function (status) {
        var str = "";
        switch (status) {
            case -1:
                str = "html_login/image_xfy_wh.png"; // 维护
                break;
            case 2:
            case 3:
                str = "html_login/image_xfy_fm.png"; // 繁忙
                break;
            default:
                str = "html_login/image_xfy_ct.png"; // 正常
                break;
        }

        return str;
    },
    getStateDesc: function (status) {
        var str = "";
        switch (status) {
            case 1:
                str = '<span style="color: rgb(0, 100, 0); font-family: 黑体; font-size: 20px;">'+'[推荐]'+'</span></label>'; 
                break;
            case 3:
                str = '<span style="color: rgb(255, 0, 0); font-family: 黑体; font-size: 20px;">'+'[爆满]'+'</span></label>'; 
                break;
        }
        // rgb(255, 0, 0)红色 rgb(80, 80, 80) 灰色 rgb(0, 100, 0) 绿色
        return str;
    },
    createRightItem: function (server) {
        var div = this.createElement("div", "position:absolute;width:381px;height:66px;");
        div.appendChild(this.createImageElement("html_login/btn_xfy_fwq.png", "position:absolute;width:89%;height:98%;"));
        var stateImg = this.createImageElement(this.getStateUrl(server.status), "position:absolute;left:18px;top:16px;pointer-events:none;");
        div.appendChild(stateImg);
        var serverName = this.createElement("label", "position:absolute;left:80px;top:18px;color:#000000;line-height:30px;font-size:30px;font-family:'SimHei';pointer-events:none;");
        div.appendChild(serverName);
        serverName.innerText = server.name;
        return div;
    },
    clearItems: function (items) {
        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].remove();
            }
            items.length = 0;
        }
    },

    formatUrl: function (url) {
        var v = this.versions[url];
        return v ? "" + this.cdn + url + "?v=" + v : "" + this.cdn + url;
    },
    selectServerList: function (index) {
        var _this = this;
        if (this.selectedLeftItem) {
            this.selectedLeftItem.children("img:eq(0)").attr("src", this.formatUrl("html_login/btn_xfy_qf_0.png"));
        }
        this.selectedLeftItem = $("#leftDiv div:eq(" + index + ")");
        this.selectedLeftItem.children("img:eq(0)").attr("src", this.formatUrl("html_login/btn_xfy_qf_1.png"));
        this.clearItems(this.rightItems);
        if (!gameParams.serverZones)
            return;
        var arr = gameParams.serverZones[index];
        if (!arr)
            return;
        this.rightItems = this.rightItems || [];
        var _loop_2 = function (i, len) {
            var div = "";
            div += '<div class="server_list">'; // top: ' + i * 69 + "px" + ';
            div += '    <img class="bg" src="html_login/btn_xfy_fwq.png">';
            div += '    <img class="icon" src="' + _this.getStateUrl(arr[i].status) + '">';
            // div += '    <label>' + arr[i].name + '    </label>';
            // div += arr[i].html;
            console.log('vtz:', arr[i].name,"--",_this.getStateDesc(arr[i].status));
            div += '<label>'+arr[i].name+_this.getStateDesc(arr[i].status)+'</label>';
            // rgb(255, 0, 0)红色 rgb(80, 80, 80) 灰色 rgb(0, 100, 0) 绿色
            div += '</div>'
            $("#rightDiv").html($("#rightDiv").html() + div);
        };
        $("#rightDiv").html("");
        for (var i = 0, len = arr.length; i < len; i++) {
            _loop_2(i, len);
        }
        $("#rightDiv div").click(function () {
            console.log('arr[$(this).index()].server_num', arr[$(this).index()].server_num);

            if (arr[$(this).index()].status === -1) {
                _this.noticeTip();
                return;
            } else if (arr[$(this).index()].status === 3) {
                var s = false;
                for (let i = 0; i < haveRoleServers.length; i++) {
                    if (haveRoleServers[i]["server_num"] == arr[$(this).index()].server_num) {
                        s = true;
                        break;
                    }
                }
                // 主播渠道可以进爆满的服务器
                if (!s && dawSDK.current_platform != 3) {
                    alert("当前服务器爆满，请选择其他服");
                    return;
                }
            }
            _this.selectServer(arr[$(this).index()]);
            $("#closeBtn").click();
        })
    },
    selectServer: function (server) {
        // console.log('vtz:server', server);
        $("#servername").text(server.name);
        $("#stateImg").attr("src", this.formatUrl(this.getStateUrl(server.status)))
        gameParams.cdn = server.cdn || "";
        gameParams.selectedServer = server;
    },
    refreshServerList: function () {
        var _this = this;
        this.clearItems(this.leftItems);
        var names = gameParams.serverZoneNames;
        if (!names || names.length === 0)
            return;
        this.leftItems = this.leftItems || [];
        var _loop_1 = function (i, len) {
            // console.log('vtz:names[i]', names[i]);
            var div = "";
            div += '<div class="select_list">'; //  top: ' + i * 76 + 'px; left: 0px;"
            div += '    <img src="html_login/btn_xfy_qf_0.png">';
            div += '    <label>' + names[i] + '</label>';
            div += '</div>';
            // console.log('vtz:div', div);
            $("#leftDiv").html($("#leftDiv").html() + div);
        };
        var this_1 = this;
        $("#leftDiv").html("")
        for (var i = 0, len = names.length; i < len; i++) {
            _loop_1(i, len);
        }

        $("#leftDiv div").click(function () {
            _this.selectServerList($(this).index());
        })
        this.selectServerList(0);
    },

    open: function () {
        // 正式服！新用户直接进入创角界面
        if (gameParams.newregister === 1 && gameParams.platform == "0") {
            console.log("正式服!!!新号直接进入最新服务并加载创角界面!!!");
            this.gotoLoadingJs(false);
            return;
        }

        let _this = this;
        req_server_list();

        if (!!($("#video1").canPlayType)) {
            isVideo = true
        } else {
            $("#bgImg").src = "html_login/image_xfy_bg2.png";
            $("#bgImg").show();
        }
        this.cdn = gameParams.cdn;
        let arr = ['html_login/bg_hd_01.png', 'html_login/btn_xfy_qf_1.png', 'html_login/checked0.png', 'html_login/checked1.png']

        this.selectServer(gameParams.selectedServer);
        let alert1 = true;
        let text = [
            '《游戏适龄提醒》 <br> （1）本游戏是一款角色扮演类游戏，适用于年满16周岁及以上的用户，建议未成年人在家长监护下使用游戏产品。<br> （2）本游戏基于架空的故事背景和幻想世界观，但不会与现实生活相混淆。设有竞技对抗比赛，鼓励玩家提升和挑战自我。游戏中有基于文字的陌生人社交系统。<br> （3）游戏中有用户实名认证系统，认证为未成年人的用户将接受以下管理：<br> 游戏中部分玩法和道具需要付费。未满8周岁的用户不能付费；8周岁以上未满16周岁的未成年人用户，单次充值金额不得超过50元人民币，每月充值金额累计不得超过200元人民币；16周岁以上的未成年人用户，单次充值金额不得超过100元人民币，每月充值金额累计不得超过400元人民币<br> 登录时间限制：未成年玩家可在周五、周六、周日和法定节假日每日晚20时至21时登录游戏，其他时间无法登录游戏。<br> （4）本游戏将人物设计、背景故事等创作内容，积极向上简单易懂，游戏设有组队模式，并设有大型团队任各和比赛，需要玩家互相配合完成比赛，有助于培养玩家的团队协作能力。',
            '隐私保护协议<br>本应用尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本应用会按照本隐私权政策的规定使用和披露您的个人信息。但本应用将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本应用不会将这些信息对外披露或向第三方提供。本应用会不时更新本隐私权政策。 您在同意本应用服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本应用服务使用协议不可分割的一部分。<br>1. 适用范围<br>(a) 在您注册本应用帐号时，您根据本应用要求提供的个人注册信息；<br>(b) 在您使用本应用网络服务，或访问本应用平台网页时，本应用自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；<br>(c) 本应用通过合法途径从商业伙伴处取得的用户个人数据。<br>您了解并同意，以下信息不适用本隐私权政策：<br>(a) 您在使用本应用平台提供的搜索服务时输入的关键字信息；<br>(b) 本应用收集到的您在本应用发布的有关信息数据，包括但不限于参与活动、成交信息及评价详情；<br>(c) 违反法律规定或违反本应用规则行为及本应用已对您采取的措施。<br>2. 信息使用<br>(a)本应用不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和本应用（含本应用关联公司）单独或共同为您提供服务，且在该服务结束后，其将被禁止访问包括其以前能够访问的所有这些资料。<br>(b) 本应用亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何本应用平台用户如从事上述活动，一经发现，本应用有权立即终止与该用户的服务协议。<br>(c) 为服务用户的目的，本应用可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，或者与本应用合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。<br>3. 信息披露<br>在如下情况下，本应用将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：<br>(a) 经您事先同意，向第三方披露；<br>(b)为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；<br>(c) 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；<br>(d) 如您出现违反中国有关法律、法规或者本应用服务协议或相关规则的情况，需要向第三方披露；<br>(e) 如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；<br>(f) 在本应用平台上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，本应用有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决。<br>(g) 其它本应用根据法律、法规或者网站政策认为合适的披露。<br>4. 信息存储和交换<br>本应用收集的有关您的信息和资料将保存在本应用及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本应用收集信息和资料所在地的境外并在境外被访问、存储和展示。<br>5. Cookie的使用<br>(a) 在您未拒绝接受cookies的情况下，本应用会在您的计算机上设定或取用cookies ，以便您能登录或使用依赖于cookies的本应用平台服务或功能。本应用使用cookies可为您提供更加周到的个性化服务，包括推广服务。<br>(b) 您有权选择接受或拒绝接受cookies。您可以通过修改浏览器设置的方式拒绝接受cookies。但如果您选择拒绝接受cookies，则您可能无法登录或使用依赖于<br>cookies的本应用网络服务或功能。<br>(c) 通过本应用所设cookies所取得的有关信息，将适用本政策。<br>6. 信息安全<br>(a) 本应用帐号均有安全保护功能，请妥善保管您的用户名及密码信息。本应用将通过对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在“完善的安全措施”。<br>(b) 在使用本应用网络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对<br>7.本隐私政策的更改<br>(a)如果决定更改隐私政策，我们会在本政策中、本公司网站中以及我们认为适当的位置发布这些更改，以便您了解我们如何收集、使用您的个人信息，哪些人可以访问这些信息，以及在什么情况下我们会透露这些信息。<br>(b)本公司保留随时修改本政策的权利，因此请经常查看。如对本政策作出重大更改，本公司会通过网站通知的形式告知。<br>为防止向第三方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是本应用用户名及密码发生泄露，请您立即联络本应用客服，以便本应用采取相应措施。'
        ];
        $("#selectImg").click(() => {
            if (!gameParams.hasReq) {
                gameParams.hasReq = true;
                req_server_list();
            }
            // console.log('vtz:serverList');
            $("#服务器列表背景2").show()
            $("#serverList").show();
        })

        $("#服务器列表背景2").click(() => {
            $("#closeBtn").click();
        })

        $("#DomImg2").click(() => {
            if (alert1) {
                $("#DomImg2").attr("src", arr[3]);
                alert1 = false;
            } else {
                $("#DomImg2").attr("src", arr[2]);
                alert1 = true;
            }
        })

        $("#Domspan").click(() => {
            this.openMask();
            $("#Domdiv1").show();
            zoom();
            $("#Domdiv4").html(text[1]);
        })

        $("#DomImg11").click(() => {
            this.openMask();
            $("#Domdiv5").show();
            zoom();
        })
        $("#showNotice").click(() => {
            $("#noticeTitle").click();
        })

        $("#noticeTitle").click(() => {
            if ($("#DomdivNoticeText").is(":hidden")) {
                $("#DomdivNoticeText").show();
                $("#showNotice").css({ "background-image": 'url("html_login/btn_hd_jt.png")' });
            } else {
                $("#DomdivNoticeText").hide();
                $("#showNotice").css({ "background-image": 'url("html_login/btn_hd_jt2.png")' });
            }
        })

        $("#Domdiv3").click(() => {
            this.closeAll()
        })

        $("#noticeConfirmBtn").click(() => {
            this.closeAll()
        })

        $("#DomImg1").click(() => {
            this.openMask();
            $("#Domdiv1").show();
            zoom();
            $("#Domdiv4").html(text[0]);
        })

        $("#loginBtn").click(() => {
            // console.log('vtz:loginBtnloginBtnloginBtn');
            if (alert1) {
                _this.cdn = gameParams.cdn;
                _this.gotoLoadingJs(false);
            } else {
                $("#Domdivalert").show();
                setTimeout(() => {
                    $("#Domdivalert").hide();
                }, 5000)
                /*
                window.alert = function(name){
                    var iframe = document.createElement("IFRAME");
                iframe.style.display="none";
                iframe.setAttribute("src", 'data:text/plain,');
                document.documentElement.appendChild(iframe);
                window.frames[0].window.alert(name);
                iframe.parentNode.removeChild(iframe);
                }
                alert('请勾选同意隐私进入游戏')
                */
            }
        })
        $("#closeBtn").click(() => {
            $("#serverList").hide();
            $("#服务器列表背景2").hide()
        })
        $("#DomCloseMask").click(() => {
            this.closeAll()
        })
    },
    openUpdateNotice: function () {
        $("#DomdivNoticeText").html(gameParams.notices.html);
        // $("#noticeTitle").html(gameParams.notices.title);
        if (!getUrlParamsCode("skip")) {
            $("#DomImg11").click();
        } else {
            $("#loginBtn").click()
        }
    },
    closeAll: function () {
        $("#服务器列表背景2").hide()
        $("#Domdiv1").hide()
        $("#Domdiv5").hide()
        $("#DomCloseMask").hide()
    },
    openMask: function () {
        $("#DomCloseMask").show();
    },
    gotoLoadingJs: function (isNew) {
        if (isNew === void 0) { isNew = false; }
        if (gameParams.selectedServer.status === -1) {
            if (isNew) {
                alert("当前服务器正在维护中");
            }
            else {
                this.noticeTip();
            }
            return;
        }
        this.close();
        this.loadScriptFromUrl("loading.js", function (e) {
            enterGame();
        });
    },
    close: function () {
        document.getElementById("serverCon") && document.getElementById("serverCon").remove();
        document.getElementById("videoCon") && document.getElementById("videoCon").remove();
    },
    loadScriptFromUrl: function (url, onComplete) {
        var script = window.document.createElement("script");
        script.type = "text/javascript";
        script.src = this.formatUrl(url);
        script.onload = onComplete.bind(this);
        document.body.appendChild(script);
    },
}
