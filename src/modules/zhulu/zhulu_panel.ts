/** 战队逐鹿主面板*/
namespace modules.zhulu {
    import ZhuLuViewUI = ui.ZhuLuViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import GetTeamChiefRankListReply = Protocols.GetTeamChiefRankListReply;
    import GetTeamChiefRankListReplyFields = Protocols.GetTeamChiefRankListReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import GetTeamBattleWorshipInfoReply = Protocols.GetTeamBattleWorshipInfoReply;
    import GetTeamBattleWorshipInfoReplyFields = Protocols.GetTeamBattleWorshipInfoReplyFields;

    export class ZhuLuPanel extends ZhuLuViewUI {
        private curViewIndex: number = 0;
        private changingStatus: boolean = false;
        constructor() {
            super();
        }
        private _btnGroup: BtnGroup;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            //副本开启时间
            this.headerTimeTxt.text = BlendCfg.instance.getCfgById(63004)[blendFields.stringParam][0];
            this.battleTimeTxt.text = BlendCfg.instance.getCfgById(63005)[blendFields.stringParam][0];
            this.peakTimeTxt.text = BlendCfg.instance.getCfgById(63006)[blendFields.stringParam][0];

            this.exhibitionView.mouseThrough = true

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.qinglongBtn, this.baihuBtn, this.zhuqueBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            //面板公共按钮
            this.addAutoListener(this.cjAwardBtn, Laya.Event.CLICK, this, this.cjAwardBtnHandler);
            this.addAutoListener(this.rankAwardBtn, Laya.Event.CLICK, this, this.rankAwardBtnHandler);
            this.addAutoListener(this.xhBtn, Laya.Event.CLICK, this, this.xhBtnHandler);
            this.addAutoListener(this.nextViewBtn, Laya.Event.CLICK, this, this.changeViewHandler, [true]);
            this.addAutoListener(this.lastViewBtn, Laya.Event.CLICK, this, this.changeViewHandler, [false]);
            this.addAutoListener(this.xhBtn, Laya.Event.CLICK, this, this.xhBtnHandler);
            //规则配置
            this.addAutoListener(this.headerWarHelp, Laya.Event.CLICK, this, this.helpHandler, [63001]);
            this.addAutoListener(this.battleHelp, Laya.Event.CLICK, this, this.helpHandler, [63002]);
            this.addAutoListener(this.peakHelp, Laya.Event.CLICK, this, this.helpHandler, [63003]);

            //副本进入按钮
            this.addAutoListener(this.goHeaderWarBtn, Laya.Event.CLICK, this, this.goHeaderWarBtnHandler);
            this.addAutoListener(this.goBattleBtn, Laya.Event.CLICK, this, this.goBattleBtnHandler);
            this.addAutoListener(this.goPeakBtn, Laya.Event.CLICK, this, this.goPeakBtnHandler);
            //其他按钮
            this.addAutoListener(this.damageAwardBtn, Laya.Event.CLICK, this, this.damageAwardBtnHandler);
            this.addAutoListener(this.scoreRankBtn, Laya.Event.CLICK, this, this.scoreRankBtnHandler);
            this.addAutoListener(this.guessBtn, Laya.Event.CLICK, this, this.guessBtnHandler);
            this.addAutoListener(this.peakGuessBtn, Laya.Event.CLICK, this, this.guessBtnHandler);

            this.addAutoListener(this.worshipBtn, Laya.Event.CLICK, this, this.kneelBtnHandler);

            this.addAutoRegisteRedPoint(this.battleRP, ["ZhuluCjAwardeRP", "ZhuluDamageRP"]);
            this.addAutoRegisteRedPoint(this.cjAwardRP, ["ZhuluCjAwardeRP"]);
            this.addAutoRegisteRedPoint(this.damageRPImg, ["ZhuluDamageRP"]);


            //其他监听
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.NINE_COPY_INFO_UPDATE, this, this.updateHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_COPY_UPDATA_DATA, this, this.updateBattleUI);
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.updateBattleUI);
            Laya.timer.loop(1000, this, this.updateUI);
        }
        protected removeListeners(): void {
            Laya.timer.clear(this, this.updateUI);
            super.removeListeners();
        }
        protected onOpened(): void {
            super.onOpened();
            this.curViewIndex = 0;
            ZhuLuCtrl.instance.GetTeamBattleWorshipInfo();
            // this.headerWarView.zOrder = 2;
            // this.headerWarView.centerX = 0;
            // this.headerWarView.scaleX = 1;
            // this.headerWarView.scaleY = 1;

            // this.battleView.zOrder = 1;
            // this.battleView.centerX = 0;
            // this.battleView.scaleX = 1.1;
            // this.battleView.scaleY = 0.9;

            // this.peakView.zOrder = 1;
            // this.peakView.centerX = 0;
            // this.peakView.scaleX = 1.1;
            // this.peakView.scaleY = 0.9;

            // TweenJS.create(this.headerWarView).to({ zOrder: 2, centerX: 0, scaleX: 1, scaleY: 1 }, 150).start();
            // TweenJS.create(this.battleView).to({ zOrder: 1, centerX: 0, scaleX: 1.1, scaleY: 0.9 }, 150).start();
            // TweenJS.create(this.peakView).to({ zOrder: 1, centerX: 0, scaleX: 1.1, scaleY: 0.9 }, 150).start();

            this.changingStatus = false;
            this.nextViewBtn.visible = true;
            this.lastViewBtn.visible = false;

            this.updateHandler();
            this._btnGroup.selectedIndex = 0
            this.updateUI();

            this.worshipBtn.visible = !!ZhuLuModel.instance.WorshipInfo[GetTeamBattleWorshipInfoReplyFields.leaderId]
            this.checkOpen();
        }
        private checkOpen() {
            let status = -1
            if (ZhuLuModel.instance.chiefRankList[GetTeamChiefRankListReplyFields.status] == 1) status = 0
            else {
                switch (ZhuLuModel.instance._status - 2) {
                    case 0:
                    case 1:
                        status = 1
                        break;
                    case 2:
                        status = 2
                        break;

                }
            }
            console.log('研发测试_chy:checkOpen', status, ZhuLuModel.instance._status);
            if (status >= 0 && status <= 2) this.openIndex(status)
        }


        //切换面板 【首领战0 争夺战1 巅峰战2】
        private changeViewHandler(goNext: boolean): void {
            //处于切换状态则点击不生效
            if (this.changingStatus) return;
            this.changingStatus = true;
            //检测不合法的切换
            if (goNext && this.curViewIndex == 2) return;
            if (!goNext && this.curViewIndex == 0) return;
            //更新索引
            let oldIndex = this.curViewIndex;
            goNext ? this.curViewIndex++ : this.curViewIndex--;
            //首领战切换至争夺战
            if (oldIndex == 0) {
                this.scaleBackTween(this.headerWarView, goNext);
                this.scaleFrontTween(this.battleView);
            }
            //争夺战切换首领战或巅峰战
            if (oldIndex == 1 && goNext) {
                this.scaleBackTween(this.battleView, goNext);
                this.scaleFrontTween(this.peakView);
            }
            if (oldIndex == 1 && !goNext) {
                this.scaleBackTween(this.battleView, goNext);
                this.scaleFrontTween(this.headerWarView);
            }
            //巅峰战切换至争夺战
            if (oldIndex == 2) {
                this.scaleBackTween(this.peakView, goNext);
                this.scaleFrontTween(this.battleView);
            }

            //面板切换完成，判断监听是否还需要现实
            this.nextViewBtn.visible = this.curViewIndex == 2 ? false : true;
            this.lastViewBtn.visible = this.curViewIndex == 0 ? false : true;
        }

        private openIndex(idnex: number) {
            this.changingStatus = true;
            this.curViewIndex = idnex
            switch (idnex) {
                case 0:
                    this.scaleBackTween(this.battleView, false);
                    this.scaleBackTween(this.peakView, true);
                    this.scaleFrontTween(this.headerWarView);
                    break;
                case 1:
                    this.scaleBackTween(this.headerWarView, false);
                    this.scaleBackTween(this.peakView, true);
                    this.scaleFrontTween(this.battleView);
                    break;
                case 2:
                    this.scaleBackTween(this.battleView, false);
                    this.scaleBackTween(this.headerWarView, true);
                    this.scaleFrontTween(this.peakView);
                    break;
            }
            //面板切换完成，判断监听是否还需要现实
            this.nextViewBtn.visible = this.curViewIndex == 2 ? false : true;
            this.lastViewBtn.visible = this.curViewIndex == 0 ? false : true;
        }



        // 缓动到最后面 
        private scaleBackTween(node, goNext: boolean = true) {
            TweenJS.create(node).to({ centerX: goNext ? 42 : -42, scaleX: 0.9, scaleY: 0.9 }, 150).onComplete((): void => {
                node.zOrder = 1;
                node.centerX = 0;
                node.scaleX = 1.1;
            }).start();
        }
        // 缓动到最前面
        private scaleFrontTween(node) {
            node.zOrder = 2;
            TweenJS.create(node).to({ centerX: 0, scaleX: 1, scaleY: 1 }, 150).onComplete((): void => {
                node.zOrder = 3;
                this.changingStatus = false;
            }).start();
        }


        private updateHandler(): void {

        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value && value.type) {
                if (value.type == 'open') {
                    this.checkOpen();
                }
            }
        }

        public close(): void {
            super.close();
            // Laya.timer.clear(this, this.loopHandler);
        }

        //规则帮助界面
        private helpHandler(id: number): void {
            modules.common.CommonUtil.alertHelp(id);
        }

        //进入玄火主界面
        private xhBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.XUANHUO_PANEL);
        }

        //进入首领战副本
        private goHeaderWarBtnHandler(): void {
            console.log('研发测试_chy:进入争夺战战副本', ZhuLuModel.instance.chiefRankList[GetTeamChiefRankListReplyFields.status], ZhuLuModel.instance._status, ZhuLuModel.instance._copyStatis);
            switch (ZhuLuModel.instance.chiefRankList[GetTeamChiefRankListReplyFields.status]) {
                case 0:
                    SystemNoticeManager.instance.addNotice("首领战未开启!", true);
                    break;
                case 1:
                    DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_teamchief_copy);
                    break;
                case 2:
                case -1:
                case 99:
                    SystemNoticeManager.instance.addNotice("首领战已结束!", true);
                    break;
            }
        }

        //进入争夺战战副本
        private goBattleBtnHandler(): void {
            console.log('研发测试_chy:进入争夺战战副本', ZhuLuModel.instance._status, ZhuLuModel.instance._copyStatis);
            if (ZhuLuModel.instance._status < copyState.DOINGVS27) {
                SystemNoticeManager.instance.addNotice("活动副本还未开启!", true);
                return;
            } else if (ZhuLuModel.instance._status > copyState.DOINGVS9) {
                SystemNoticeManager.instance.addNotice("活动副本已结束!", true);
                return;
            }

            switch (ZhuLuModel.instance._copyStatis) {
                case -1:
                    SystemNoticeManager.instance.addNotice("休整阶段 请稍后进入!", true);
                    break;
                case 0:
                    if (ZhuLuModel.instance.eliminate) {
                        SystemNoticeManager.instance.addNotice("您已被淘汰无法进入!", true);
                        return;
                    }

                    DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_teamPrepare_copy);
                    break;
                case 1:

                    if (ZhuLuModel.instance.eliminate) {
                        SystemNoticeManager.instance.addNotice("您已被淘汰无法进入!", true);
                        return;
                    }
                    DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_teamBattle_copy);
                    break;
            }



        }

        //进入巅峰战副本
        private goPeakBtnHandler(): void {
            console.log('研发测试_chy:进入巅峰战副本', ZhuLuModel.instance._status, ZhuLuModel.instance._copyStatis);
            // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_nine_copy);
            if (ZhuLuModel.instance._status < copyState.DOINGVS3) {
                SystemNoticeManager.instance.addNotice("活动副本还未开启!", true);
                return;
            } else if (ZhuLuModel.instance._status > copyState.DOINGVS3) {
                SystemNoticeManager.instance.addNotice("活动副本已结束!", true);
                return;
            }

            switch (ZhuLuModel.instance._copyStatis) {
                case -1:
                    SystemNoticeManager.instance.addNotice("休整阶段 请稍后进入!", true);
                    break;
                case 0:

                    if (ZhuLuModel.instance.eliminate) {
                        SystemNoticeManager.instance.addNotice("您已被淘汰无法进入!", true);
                        return;
                    }
                    DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_teamPrepare_copy);
                    break;
                case 1:

                    if (ZhuLuModel.instance.eliminate) {
                        SystemNoticeManager.instance.addNotice("您已被淘汰无法进入!", true);
                        return;
                    }
                    DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_teamBattle_copy);
                    break;
            }

        }
        private updateUI() {
            switch (ZhuLuModel.instance.chiefRankList[GetTeamChiefRankListReplyFields.status]) {
                case copyState.NOT:
                    this.headerTimeTxt.text = `周二凌晨5点开启首领战`
                    break;
                case 1:
                    this.headerTimeTxt.text = `首领战正在进行!`
                    break;
                case 2:
                case -1:
                case 99:
                    this.headerTimeTxt.text = `首领战已结束!`
                    break;
            }
            let status = ZhuLuModel.instance._status
            let node = ['未开启', '入围名单公示', '争夺战半决赛', '争夺战决赛', '巅峰赛', '发放奖励', '活动结束', '人数不足 轮空']
            switch (ZhuLuModel.instance._status) {
                case copyState.NOT:
                case copyState.LIST:
                    this.battleTimeTxt.text = '周三晚上20点开启争夺战'
                    this.peakTimeTxt.text = '周三晚上21点开启巅峰赛'
                    break;
                case copyState.DOINGVS27:
                case copyState.DOINGVS9:
                    this.peakTimeTxt.text = '周三晚上21点开启巅峰赛'
                    switch (ZhuLuModel.instance._copyStatis) {
                        case -1:
                            this.battleTimeTxt.text = `${node[status]}休整中 正在分配下阶段`
                        case 0:
                            let t = ZhuLuModel.instance._copyTime[status] - GlobalData.serverTime
                            t = t < 0 ? 0 : t
                            this.battleTimeTxt.text = `${node[status]}${CommonUtil.msToMMSS(t)}后开启`
                            break;
                        case 1:
                            if (ZhuLuModel.instance.eliminate) {
                                this.battleTimeTxt.text = `${node[status]}正在进行 您已被淘汰`
                            } else {
                                this.battleTimeTxt.text = `${node[status]}正在进行`
                            }

                            break;
                    }
                    break;
                case copyState.DOINGVS3:
                    this.battleTimeTxt.text = '本周争夺战已结束'
                    switch (ZhuLuModel.instance._copyStatis) {
                        case -1:
                            this.battleTimeTxt.text = `${node[status]}结束 等待发放奖励`
                        case 0:
                            let t = ZhuLuModel.instance._copyTime[status] - GlobalData.serverTime
                            t = t < 0 ? 0 : t
                            this.peakTimeTxt.text = `${node[status]}${CommonUtil.msToMMSS(t)}后开启`
                            break;
                        case 1:
                            if (ZhuLuModel.instance.eliminate) {
                                this.peakTimeTxt.text = `${node[status]}正在进行 您已被淘汰`
                            } else {
                                this.peakTimeTxt.text = `${node[status]}正在进行`
                            }

                            break;
                    }
                    break;
                case copyState.GRANT:
                case copyState.NULL:
                case copyState.CLOSE:
                    this.battleTimeTxt.text = '本周争夺战已结束'
                    this.peakTimeTxt.text = '本周巅峰赛已结束'
                    break;
                default:
                    this.battleTimeTxt.text = '周三晚上20点开启争夺战'
                    this.peakTimeTxt.text = '周三晚上21点开启巅峰赛'
                    break;
            }

            this.worshipBtn.visible = !!ZhuLuModel.instance.WorshipInfo[GetTeamBattleWorshipInfoReplyFields.leaderId]
        }

        //打开成就面板
        private cjAwardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_ACHIEVEMENT_AWARD_ALERT);
        }

        //打开逐鹿【争夺战 巅峰战】排行榜奖励
        private rankAwardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_WAR_RANK_AWARD_ALERT);
        }

        //打开首领战积分排行榜
        private scoreRankBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_HEADERWAR_RANK_ALERT);
        }

        //打开首领战伤害奖励面板
        private damageAwardBtnHandler(): void {
            console.log('研发测试_chy:打开首领战伤害奖励面板',);
            WindowManager.instance.open(WindowEnum.ZHULU_HEADER_DAMAGE_AWARD_ALERT);
        }

        //打开竞猜面板
        private guessBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_WAR_GUESS_ALERT);
        }

        //打开膜拜面板
        private kneelBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_KNEEL_ALERT);
        }

        private updateBattleUI() {
            ZhuLuCtrl.instance.GetTeamBattleWorshipInfo();
            // (<Laya.Button>this._btnGroup.selectedBtn).selected = true;
            this.teaName9.text = ZhuLuModel.instance._status < copyState.DOINGVS3 ? '虚位以待' : '轮空';
            this.icon9.skin = 'zhulu/btn_lock.png'
            for (let index = 0; index < 9; index++) {
                if (this['icon' + index]) this['icon' + index].skin = 'zhulu/btn_lock.png'
                if (this['teaName' + index]) this['teaName' + index].text = ZhuLuModel.instance._status < 1 ? '虚位以待' : '轮空'
                if (this['line' + index]) this['line' + index].visible = false
            }
            let map = ZhuLuModel.instance._battleInfo[copyState.DOINGVS27 - 2];

            console.log('研发测试_chy:map', map);
            let count = 0
            // 选择分组 青龙组那些 每组 3场比赛
            for (let index = this._btnGroup.selectedIndex * 3; index < this._btnGroup.selectedIndex * 3 + 3; index++) {
                let battle = map.get(index)
                if (!battle) break;
                for (const e of battle[1]) {
                    if (e) {
                        if (this['line' + count]) this['line' + count].visible = e[teamInfoFields.name] == battle[victoryInfoFields.victory];
                        if (this['teaName' + count]) this['teaName' + count].text = e[teamInfoFields.name] // 名字
                        if (this['icon' + count]) this['icon' + count].skin = `clan/totem_${e[teamInfoFields.flagIndex]}.png` // 旗帜

                    }
                    count++;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (this['linenext' + index]) this['linenext' + index].visible = false
            }
            count = 0
            map = ZhuLuModel.instance._battleInfo[copyState.DOINGVS9 - 2];
            let battle = map.get(this._btnGroup.selectedIndex)
            if (battle) {
                for (const e of battle[1]) {
                    if (e) {

                        if (this['linenext' + count]) {
                            this['linenext' + count].visible = e[0] == battle[0];
                            if (this['linenext' + count].visible) {
                                if (this['icon' + 9]) this['icon' + 9].skin = `clan/totem_${e[1]}.png`
                                if (this['teaName' + 9]) this['teaName' + 9].text = e[0]
                            }
                        }
                    }
                    count++;
                }
            }
            for (let index = 1; index < 4; index++) {
                this['clan' + index + 'Img'].skin = 'zhulu/btn_lock.png'
                this['clan' + index + 'Txt'].text = ZhuLuModel.instance._status < 4 ? '虚位以待' : '轮空'
                this['lineTop' + index + ''].visible = false
            }
            this.clanTopTxt.text = ZhuLuModel.instance._status < 5 ? '虚位以待' : '轮空'
            this.clanTopImg.skin = 'zhulu/btn_lock.png'
            count = 1
            map = ZhuLuModel.instance._battleInfo[copyState.DOINGVS3 - 2];
            battle = map.get(0)
            if (battle) {
                for (const team of battle[1]) {
                    console.log('研发测试_chy:lineTop + count + ', 'lineTop' + count + '', team[0], battle[0], team[0] == battle[0]);
                    if (team) {
                        if (this['lineTop' + count + '']) this['lineTop' + count + ''].visible = team[0] == battle[0];
                        if (this['clan' + count + 'Img']) this['clan' + count + 'Img'].skin = `clan/totem_${team[1]}.png`
                        if (this['clan' + count + 'Txt']) this['clan' + count + 'Txt'].text = team[0]
                        if (team[0] == battle[0]) {
                            this.clanTopTxt.text = team[0]
                            this.clanTopImg.skin = `clan/totem_${team[1]}.png`
                        }
                    }
                    count++;
                }
            }



        }
    }
}