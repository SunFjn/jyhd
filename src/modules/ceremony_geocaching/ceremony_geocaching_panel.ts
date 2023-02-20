///<reference path="../config/ceremony_geocaching_cfg.ts"/>
///<reference path="../treasure/treasure_model.ts"/>
/**庆典探索 主界面*/
namespace modules.ceremony_geocaching {
    import Event = laya.events.Event;
    import CeremonyGeocachingViewUI = ui.CeremonyGeocachingViewUI;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import xunbao_weightFields = Configuration.xunbao_weightFields;
    import xunbao_weight = Configuration.xunbao_weight;
    import TreasureCfg = modules.config.TreasureCfg;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import SystemNoticeManager = notice.SystemNoticeManager;
    import BagModel = modules.bag.BagModel;
    import idCountFields = Configuration.idCountFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import XunbaoNoteFields = Protocols.XunbaoNoteFields;
    import TreasureModel = modules.treasure.TreasureModel;

    export class CeremonyGeocachingView extends CeremonyGeocachingViewUI {
        private _activityTime: number = 0;
        private _leaderAwardTween: TweenJS;
        private _bar: ProgressBarCtrl;
        private _cdFlag: boolean;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _btnGroup: BtnGroup;
        private _personalList: CustomList;
        private _sevTextArr: Array<any>;
        private _sevStringArr: Array<any>;
        private severListLen: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.severList, this.selfList);
            this._bar = new ProgressBarCtrl(this.scoreBar, this.scoreBar.width, this.scoreTxt);

            this._personalList = new CustomList();
            this._personalList.itemRender = CeremonyGeocachingItemText;
            this._personalList.hCount = 1;
            this._personalList.spaceY = 8;
            this._personalList.width = 500;
            this._personalList.height = 112;
            this._personalList.x = 0;
            this._personalList.y = 0;
            this.selfPanel.addChild(this._personalList);

            this._sevTextArr = new Array<any>();
            this._sevStringArr = new Array<any>();

            this.severListLen = 4;
            for (let i = 0; i < this.severListLen; i++) {
                let text = new laya.html.dom.HTMLDivElement();
                text.width = 499;
                text.style.height = 20;
                text.pos(0, i * 28);
                this._sevTextArr.push(text);
                this.severPanel.addChild(text);
            }

        }

        public onOpened(): void {
            super.onOpened();
            //this.showLeaderAwardTween();
            this.showCost();
            this.getSeverList();
            Laya.timer.loop(10000, this, this.getSeverList);
            Laya.timer.frameLoop(1, this, this.updateList);
            this._cdFlag = false;
            CeremonyGeocachingCtrl.instance.getBaseInfo();
            // 配置奖励
            this.configAward();
        }

        private getSeverList(): void {
            Channel.instance.publish(UserCenterOpcode.GetXunbaoServerBroadcast, [6]);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_CEREMONY_GEOCACHING_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_CEREMONY_SELF_BROADCAST_LIST, this, this.updateSelfList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEVER_BROADCAST_LIST, this, this.updateSeverList);

            this.addAutoListener(this.rankBtn, Laya.Event.CLICK, this, this.rankBtnHandler);
            this.addAutoListener(this.getBtn, Laya.Event.CLICK, this, this.getBtnHandler);
            //this.addAutoListener(this.leaderCloseBtn, Laya.Event.CLICK, this, this.leaderCloseBtnHandler);
            this.addAutoListener(this.oneBtn, Laya.Event.CLICK, this, this.xunBaoHandler, [0]);
            this.addAutoListener(this.tenBtn, Laya.Event.CLICK, this, this.xunBaoHandler, [1]);
            this.addAutoListener(this.fiftyBtn, Laya.Event.CLICK, this, this.xunBaoHandler, [2]);

            this._btnGroup.on(Event.CHANGE, this, this.changeList);
            this._btnGroup.selectedIndex = 0;

            this.addAutoRegisteRedPoint(this.getedRPImg, ["ceremonyGeocachingGetedRP"]);

            this.initializeModelClip();
        }
        protected removeListeners(): void {
            super.removeListeners();

            this._btnGroup.off(Event.CHANGE, this, this.changeList);
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
        }

        private updateSelfList() {
            let ap = CeremonyGeocachingModel.instance.personGetedList;
            if (ap != null) {
                if (ap.length > 0) {
                    this._personalList.datas = ap;
                    this._personalList.scrollTo(this._personalList.datas.length * 28);
                }
            }
        }

        /**
         * 初始化模型
         */
        public initializeModelClip() {
            // if (!this._modelClip) {
            //     this._modelClip = AvatarClip.create(1024, 1024, 800);
            //     this.leaderAwardImg.addChildAt(this._modelClip, 1);
            //     this._modelClip.zOrder = 10;
            //     this._modelClip.pos(80, 120, true);
            //     this._modelClip.anchorX = 0.5;
            //     this._modelClip.anchorY = 0.5;
            //     this._modelClip.scaleX = 0.4;
            //     this._modelClip.scaleY = 0.4;
            //     this._modelClip.mouseEnabled = false;
            // }
            if (!this._skeletonClip) {
                this._skeletonClip = SkeletonAvatar.createShow(this, this);
                this._skeletonClip.pos(80, 120, true);
            }
        }

        // 更新全服列表数据
        private updateSeverList() {
            let svrList = TreasureModel.instance.getSvrBroadcast(6);

            if (svrList != null) {
                if (svrList.length > 0) {
                    if (this._sevStringArr.length > 0) {
                        this._sevStringArr.length = 0;
                    }
                    for (let i = 0; i < svrList.length; i++) {
                        let name = svrList[i][XunbaoNoteFields.name];
                        let itemId = svrList[i][XunbaoNoteFields.itemId];
                        let itemName = CommonUtil.getNameByItemId(itemId);
                        let itemColor = CommonUtil.getColorById(itemId);
                        var html: string = "<span style='color:#2d2d2d;font-size: 20px'>天赐鸿福,</span>";
                        html += `<span style='color:rgb(13,121,255);font-size: 20px;'>${name}</span>`;
                        html += "<span style='color:#2d2d2d;font-size: 20px'>获得了</span>";
                        html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
                        this._sevStringArr.push(html);
                    }
                }

            }
        }

        private updateList(): void {
            for (let i = 0; i < this._sevTextArr.length; i++) {
                this._sevTextArr[i].y -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                if (this._sevTextArr[i].y <= -10) {
                    this._sevTextArr[i].y = 102;
                    if (this.severListLen < this._sevStringArr.length) {
                        this.severListLen++;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    } else {
                        this.severListLen = 1;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    }
                }
            }
        }

        private showCost() {
            let cost0 = this.getCost(0);
            let cost1 = this.getCost(1);
            let cost2 = this.getCost(2);
            // 拥有的抽奖券与各个阶级的消耗显示
            this.card1Txt.text = `${cost0[0]}/${cost0[1]}`;
            this.card10Txt.text = `${cost1[0]}/${cost1[1]}`;
            this.card50Txt.text = `${cost2[0]}/${cost2[1]}`;
            // 字体颜色
            this.card1Txt.color = cost0[0] > cost0[1] ? "#ffffff" : "#be2422";
            this.card10Txt.color = cost1[0] > cost1[1] ? "#ffffff" : "#be2422";
            this.card50Txt.color = cost2[0] > cost2[1] ? "#ffffff" : "#be2422";
        }

        private setFlag(): void {
            this._cdFlag = false;
        }

        // 探索处理
        private xunBaoHandler(value: any): void {
            // 判断条件
            if (this.checkEnoughCost(value)) {

                if (value != null) {
                    if (this._cdFlag) {
                        SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                        return;
                    }
                    this._cdFlag = true;
                    Laya.timer.once(500, this, this.setFlag);
                }

                CeremonyGeocachingCtrl.instance.startGeocaching([value]);
            } else {
                SystemNoticeManager.instance.addNotice("抽奖券不足", true);
            }
        }

        // 检测抽奖券是否足够
        private checkEnoughCost(grade: 0 | 1 | 2): boolean {
            let data = this.getCost(grade);
            let count = data[0];
            let cost = data[1];

            return count >= cost;
        }

        // 获取抽奖消费
        private getCost(grade: 0 | 1 | 2): Array<number> {
            let condition = TreasureCfg.instance.getItemConditionByGrad(6, grade);
            let cost = condition[idCountFields.count];
            let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);

            return [count, cost]
        }

        // 更新视图
        private updateView() {
            // 刷新全服记录
            this.getSeverList;
            // 刷新消费
            this.showCost();
            // 活动结束时间
            this._activityTime = CeremonyGeocachingModel.instance.endTime;
            // 更新倒计时
            this.setActivitiTime();
            // 积分
            this._bar.maxValue = CeremonyGeocachingModel.instance.scorePos;
            this._bar.value = CeremonyGeocachingModel.instance.score;
        }

        // 打开榜单面板
        private rankBtnHandler() {
            WindowManager.instance.open(WindowEnum.OPENSERVICE_CEREMONYGEO_RANK_ALERT);
        }

        // 配置奖励
        private configAward() {
            // 普通抽奖奖励
            let configs: xunbao_weight = TreasureCfg.instance.getItemShow(6)[0];
            let show_itemids: Array<number> = configs[xunbao_weightFields.showItem];

            for (let index = 1; index <= 14; index++) {
                const item: modules.bag.BaseItem = this["item" + index];
                const id: number = show_itemids[index - 1];
                item.dataSource = [id, 1, 0, null];
                if (index >= 13) {
                    this[`item${index}Txt`].text = ItemMaterialCfg.instance.getItemCfgById(id)[item_materialFields.name];
                    this[`item${index}Txt`].color = "#ffffff";
                }
            }
            // 榜首奖励预览
            let ad: Items = CeremonyGeocachingModel.instance.leaderAwrd;
            if (ad == null) {
                console.log("开服时间已过，没有奖励!!!");
                return;
            }
            let item_data: item_material = ItemMaterialCfg.instance.getItemCfgById(ad[ItemsFields.itemId]);
            let showId: number = item_data[item_materialFields.showId];
            let isShow: boolean = showId != 0;
            this.item.visible = !isShow;
            // this._modelClip.visible = isShow;
            this._skeletonClip.visible = isShow;
            this.nameTxt.text = item_data[item_materialFields.name];

            // 展示模型 (fuck，运营配置的奖励竟然没用到这个，经典白写！！！)
            if (isShow) {
                let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
                if (!extercfg) return;
                // this._modelClip.avatarRotationY = extercfg[Configuration.ExteriorSKFields.rotationY] ? extercfg[Configuration.ExteriorSKFields.rotationY] : 180;
                // this._modelClip.avatarRotationX = extercfg[Configuration.ExteriorSKFields.rotationX] ? extercfg[Configuration.ExteriorSKFields.rotationX] : 0;
                // this._modelClip.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
                // this._modelClip.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
                
                let isModel = item_data[item_materialFields.isModel];
                // 0-模型 1-特效 2-图片
                if (isModel == 0) {
                    this._skeletonClip.pos(73, 120, true);
                    this._skeletonClip.reset(showId);
                } else if (isModel == 1) {
                    this._skeletonClip.pos(70, 110, true);
                    this._skeletonClip.reset(0, 0, 0, 0, showId);
                } else {
                    console.log("图片不显示，配置错误？");
                }
            }
            // 展示item
            else {
                this.item.dataSource = [ad[ItemsFields.itemId], ad[ItemsFields.count], 0, null];
            }

        }

        // 关闭榜首奖励显示和动画
        private leaderCloseBtnHandler() {
            this._leaderAwardTween.stop();
            this.leaderAwardImg.visible = false;
        }

        // 领取奖励/开打积分奖励榜
        private getBtnHandler() {
            //可以领取奖励，发起请求
            if (CeremonyGeocachingModel.instance.canGeted) {
                CeremonyGeocachingCtrl.instance.getAward();
            }
            //不能领取，打开积分奖励榜
            else {
                WindowManager.instance.open(WindowEnum.OPENSERVICE_CEREMONYGEO_SCORE_ALERT);
            }
        }

        // 榜首奖励动画
        private showLeaderAwardTween() {
            this.leaderAwardImg.visible = true;
            this._leaderAwardTween = TweenJS.create(this.leaderAwardImg).to({ y: this.leaderAwardImg.y - 10 },
                1000).start().yoyo(true).repeat(99999999);
            this._leaderAwardTween.to({ y: this.leaderAwardImg.y - 10 }, 1000).start();
        }

        private setActivitiTime(): void {
            // 拿到活动结束时间
            if (this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#cc0000";
            }
        }

        // 活动倒计时
        private activityHandler(): void {
            if (this._activityTime > GlobalData.serverTime) {
                this.downcountTxt.color = "#2ad200";
                this.downcountTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(this._activityTime)}`;
            } else {
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#cc0000";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private changeList(): void {
            switch (this._btnGroup.selectedIndex) {
                case 0: {
                    this.severPanel.visible = true;
                    this.selfPanel.visible = false;
                }
                    break;
                case 1: {
                    this.severPanel.visible = false;
                    this.selfPanel.visible = true;
                }
                    break;
            }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.getSeverList);
            if (this._leaderAwardTween) {
                this._leaderAwardTween.stop();
                this.leaderAwardImg.y = 657;
            }
        }
        public destroy(destroyChild?: boolean): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._personalList = this.destroyElement(this._personalList);
        }
    }
}