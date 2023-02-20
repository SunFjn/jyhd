/** 微信小游戏-登录界面*/

namespace modules.login {
    import CustomClip = modules.common.CustomClip;
    import Sprite = Laya.Sprite;
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;

    export class LoginPanel extends ui.LoginViewUI {
        private _listNames: CustomList;
        private _listBtns: CustomList;
        private agreeTogged: boolean = true;
        private timeID: number = 0;
        private bar_width: number = 584;

        constructor() {
            super();
        }

        public destroy(): void {
            super.destroy();
            this.destroyElement(this._listNames);
            this.destroyElement(this._listBtns);
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;

            this._listNames = new CustomList();
            this._listNames.width = 193;
            this._listNames.itemRender = ServerListItem;
            this._listNames.x = 210;
            this.selectServer.addChild(this._listNames);

            this._listBtns = new CustomList();
            this._listBtns.width = 330;
            this._listBtns.x = 450;
            this.selectServer.addChild(this._listBtns);
            // console.log(modules.login.ServerOptionsItem);

            this._listNames.y = this._listBtns.y = 405;
            this._listNames.hCount = this._listBtns.hCount = 1;
            this._listNames.spaceY = this._listBtns.spaceY = 5;
            this._listNames.height = this._listBtns.height = 790;
            this._listNames.scrollDir = this._listBtns.scrollDir = 1;
            this._listBtns.selectedIndex = this._listNames.selectedIndex = 0;

            this._listBtns.itemRender = modules.login.ServerOptionsItem;
        }

        public onOpened(): void {
            // 刷新视图数据
            this.updateView();
            // 打开公告界面 -- 在微信小游戏code.js代码处理
            // WindowManager.instance.open(WindowEnum.LOGIN_NOTICE_ALERT);
        }

        // 更新视图
        private updateView(): void {
            // console.log("LoginModel.instance.allParams::", LoginModel.instance.allParams);

            let alldata = LoginModel.instance.allParams;
            let server_status = parseInt(alldata.selectedServer.status);
            // 服务器名字
            this.serverName.text = alldata.selectedServer.name;
            // 1 红色 2 绿色
            this.stateImg.skin = `${server_status == 1 ? "login/image_xfy_fm.png" : "login/image_xfy_ct.png"}`;

        }

        protected addListeners(): void {
            this.addAutoListener(this.ageTipBtn, LayaEvent.CLICK, this, this.openTips, [0]);
            this.addAutoListener(this.agreeMent, LayaEvent.CLICK, this, this.openTips, [1]);
            this.addAutoListener(this.noticeBtn, LayaEvent.CLICK, this, this.noticeBtnHandler);
            // this.addAutoListener(this.clearCacheBtn, LayaEvent.CLICK, this, this.clearCacheBtnHandler);
            this.addAutoListener(this.serverBtn, LayaEvent.CLICK, this, this.hqBtnHandler);
            this.addAutoListener(this.closeSelectBtn, LayaEvent.CLICK, this, this.closeHQHandler);
            this.addAutoListener(this.closeSelectBtn2, LayaEvent.CLICK, this, this.closeHQHandler);
            this.addAutoListener(this.tog1, LayaEvent.CLICK, this, this.togChangeHandler);
            this.addAutoListener(this.tog0, LayaEvent.CLICK, this, this.togChangeHandler);
            this.addAutoListener(this.loginBtn, LayaEvent.CLICK, this, this.loginBtnHandler);

            this.addAutoListener(this._listNames, LayaEvent.SELECT, this, this.selectListNames);
            this.addAutoListener(this._listBtns, LayaEvent.SELECT, this, this.chooseServerHandler);
            this.addAutoListener(GlobalData.dispatcher, "UPDATE_ASSETS_PROCESS", this, this.updateProcessHandler);
        }

        // 刷新进度条
        private updateProcessHandler(curIndex: number, maxCount: number, val: number, str: string): void {
            if (!this.loadingBox.visible) this.loadingBox.visible = true;
            // console.log("刷新进度条:", curIndex, maxCount, val, str);
            // 总进度
            let bar2_val = ((val * 10000) >> 0) / 100 + "%";
            this.process_bar2.width = val * this.bar_width;
            this.process_txt2.text = bar2_val;
            // 子进度
            let bar1_val = ((curIndex / maxCount * 10000) >> 0) / 100 + "%";
            this.process_bar1.width = curIndex / maxCount * this.bar_width;
            this.process_txt1.text = bar1_val;
            // 描述
            this.process_desc1.text = str;
        }

        // 选择服务器名字
        private selectListNames(): void {
            let alldata = LoginModel.instance.allParams;

            GlobalData.dispatcher.event("CHOOSE_SERVER_LIST_BY_NAME", this._listNames.selectedIndex);
            this._listBtns.datas = alldata.serverZones[this._listNames.selectedIndex];
        }

        // 选择服务器回调
        private chooseServerHandler(): void {
            this.selectServer.visible = false;
            let chooseData = this._listBtns.selectedData;

            if (typeof GameGlobal == "undefined") {
                let GameGlobal = new Object();
            }
            if (typeof GameGlobal.judgeHaveRoleServers == "undefined") {
                let judgeHaveRoleServers = () => false;
            }
            // 判断是否爆满
            if (!GameGlobal.judgeHaveRoleServers(chooseData.server_num)) {
                wx.showToast({
                    title: '爆满，请换服',
                    icon: 'error'
                })
                return;
            }

            let server_status = parseInt(chooseData.status);
            // 服务器名字
            this.serverName.text = chooseData.name;
            // 1 红色 2 绿色
            this.stateImg.skin = `${server_status == 1 ? "login/image_xfy_fm.png" : "login/image_xfy_ct.png"}`;
            LoginModel.instance.selectedServer = chooseData;
        }

        // 同意用户协议
        private togChangeHandler(): void {
            if (this.tog1.visible) {
                this.tog1.visible = false;
                this.tog0.visible = true;
                this.agreeTogged = false;
            } else {
                this.tog1.visible = true;
                this.tog0.visible = false;
                this.agreeTogged = true;
            }
        }

        // 登录按钮
        private loginBtnHandler(): void {
            if (!this.agreeTogged) {
                this.agreeMentBox.visible = true;
                clearTimeout(this.timeID);
                this.timeID = setTimeout(() => {
                    this.agreeMentBox.visible = false;
                }, 2000);
                return;
            }
            this.loginBtn.mouseEnabled = false;
            Main.instance.startLogin();
        }


        // 关闭换区
        private closeHQHandler(): void {
            this.selectServer.visible = false;
        }

        // 打开换区
        private hqBtnHandler(): void {
            this.selectServer.visible = true;
            let alldata = LoginModel.instance.allParams;

            this._listNames.datas = alldata.serverZoneNames;
            this._listBtns.datas = alldata.serverZones[0];
        }

        // 清理换wx缓存
        // private clearCacheBtnHandler(): void {
        //     Laya.MiniAdpter.removeAll();
        //     wx.showToast({
        //         title: '缓存清理成功'
        //     } as _showToastObject);
        // }

        // 打开提示面板
        private openTips(type: 0 | 1): void {
            LoginModel.instance.tipsType = type;
            WindowManager.instance.open(WindowEnum.LOGIN_TIPS_ALERT)
        }

        // 公告面板
        private noticeBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.LOGIN_NOTICE_ALERT)
        }

        protected removeListeners(): void {

        }

    }
}