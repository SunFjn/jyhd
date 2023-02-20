///<reference path="../sprint_rank/sprint_rank_item.ts"/>
///<reference path="../config/soaring_rank_cfg.ts"/>
///<reference path="../config/soaring_rank_task_cfg.ts"/>
//封神榜面板
namespace modules.soaring_rank {
    import ItemsFields = Configuration.ItemsFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SoaringRankTaskCfg = modules.config.SoaringRankTaskCfg;
    import feisheng_rank_task = Configuration.feisheng_rank_task;
    import feisheng_rank_taskFields = Configuration.feisheng_rank_taskFields;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;

    export class SoaringRankPanel extends ui.SoaringRankViewUI {
        private _cfg: feisheng_rank_task;
        private _btnClip: CustomClip;//按钮特效
        private _list: CustomList;
        private _taskBase: Array<BaseItem>;
        private _allMingCiArr: Array<number>;
        private _isUpdateBtnClickNum = 1000;//刷新按钮CD
        private _isUpdateBtnClick = true;//刷新按钮是否可点击
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._taskBase = [this.rushReward1, this.rushReward2, this.rushReward3, this.rushReward4];
            this._list = new CustomList();
            this._list.width = 681;
            this._list.height = 510;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 4;
            this._list.itemRender = SoaringRankItem;
            this._list.x = 22;
            this._list.y = 322;
            this.addChildAt(this._list, 10);
            this.creatEffect();
            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "left";
            this._allMingCiArr = new Array<number>();
            for (var index = 1; index <= 50; index++) {
                this._allMingCiArr.push(index);
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.instructionsBtn.on(Event.CLICK, this, this.instructionsBtnHandler);
            this.updateBtn.on(Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_LIONQU_UPDATE, this, this.showTaskReward);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_UPDATE, this, this.showUI);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.getFeishengRankTaskInfo);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_UPDATE, this, this.getFeishengRankTaskInfo);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.getFeishengRankAllInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
            this.instructionsBtn.off(Event.CLICK, this, this.instructionsBtnHandler);
            this.updateBtn.off(Event.CLICK, this, this.updateBtnHandler);
            Laya.timer.clear(this, this.activityHandler);
            Laya.timer.clear(this, this.chuang_isUpdateBtnClick);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public showUI() {
            this.showIntegralDescriptionText();
            this.showUPUiTip();
            this.setActivitiTime();
            if (this._allMingCiArr) {
                this._list.datas = this._allMingCiArr;
            }
            this.showMySocre();
        }

        public getFeishengRankTaskInfo() {
            SoaringRankCtrl.instance.getFeishengRankTaskInfo();
        }

        public getFeishengRankAllInfo() {
            SoaringRankCtrl.instance.getFeishengRankAllInfo();
        }

        public onOpened(): void {
            super.onOpened();
            this._isUpdateBtnClick = true;
            this.getFeishengRankAllInfo();
            this.showUI();
            this.showTaskReward();
        }

        public sureBtnHandler() {
            let state = SoaringRankModel.instance.state;//根据当前任务状态 显示按钮状态
            let shuju = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, 0);
            switch (state) {
                case 0:
                    let skipId: number = shuju[feisheng_rankFields.skipId];
                    if (skipId == ActionOpenId.amulet) {
                        WindowManager.instance.openByActionId(skipId, 2);
                    } else {
                        WindowManager.instance.openByActionId(skipId);
                    }
                    break;
                case 1:
                    let items: Array<Item> = [];

                    this._cfg = SoaringRankTaskCfg.instance.getCfgById(SoaringRankModel.instance.taskId);
                    let rewards = this._cfg[feisheng_rank_taskFields.reward];
                    if (rewards) {
                        for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                            let item: Items = rewards[i];
                            items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                        }
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            SoaringRankCtrl.instance.getFeishengRankTaskReward();
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        public updateBtnHandler() {
            if (this._isUpdateBtnClick) {
                this._isUpdateBtnClick = false;
                Laya.timer.once(this._isUpdateBtnClickNum, this, this.chuang_isUpdateBtnClick);
                // console.log("请求刷新 封神榜数据");
                this.getFeishengRankAllInfo();
                SystemNoticeManager.instance.addNotice("刷新成功", false);

            } else {
                SystemNoticeManager.instance.addNotice("操作过于频繁", true);
            }
        }

        private chuang_isUpdateBtnClick() {
            this._isUpdateBtnClick = true;
        }

        public instructionsBtnHandler() {
            let shuju = BlendCfg.instance.getCfgById(20046);
            if (shuju) {
                CommonUtil.alertHelp(20046);
            } else {
                SystemNoticeManager.instance.addNotice("读取说明配置失败", true);
            }

        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank);
            if (SoaringRankModel.instance.restTm >= GlobalData.serverTime &&
                isOpen &&
                SoaringRankModel.instance.endFlag == 0) {
                this.activityText1.color = "#ffffff";
                this.activityText.visible = true;
                this.activityText1.text = "活动倒计时:";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SoaringRankModel.instance.restTm)}`;
            // console.log("SoaringRankModel.instance.restTm：" + SoaringRankModel.instance.restTm);
            // console.log("GlobalData.serverTime：" + GlobalData.serverTime);
            if (SoaringRankModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        /**
         * 任务相关显示
         */
        public showTaskReward() {
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let taskId: number = 0;
            let param: number = SoaringRankModel.instance.param;
            //根据当前任务id 获取任务信息
            this._cfg = SoaringRankTaskCfg.instance.getCfgById(SoaringRankModel.instance.taskId);
            let rewards = this._cfg[feisheng_rank_taskFields.reward];
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            this.StatementHTML.innerHTML = `积分达到<span style='color:#168a17'>${this._cfg[feisheng_rank_taskFields.condition]}</span>可领取!`;
            this.scheduleText.text = `(${param}/${this._cfg[feisheng_rank_taskFields.condition][0]})`;
            if (param >= this._cfg[feisheng_rank_taskFields.condition][0]) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
            this.setBtnSure();
            this.showMySocre();
        }

        public setBtnSure() {
            let state = SoaringRankModel.instance.state;//根据当前任务状态 显示按钮状态
            if (SoaringRankModel.instance.endFlag == 0) {
                if (state == 0) {
                    // this.sureBtn.skin = "common/btn_tongyong_18.png";
                    // this.sureBtn.labelColors = "#465460,#465460,#465460,#465460";
                    this.sureBtn.label = "前往提升";
                    this.sureBtn.visible = true;
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.receivedImg.visible = false;
                    this.overImg.visible = false;
                } else if (state == 1) {
                    // this.sureBtn.skin = "common/btn_tongyong_6.png";
                    // this.sureBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                    this.sureBtn.label = "领取";
                    this.sureBtn.visible = true;
                    this._btnClip.play();
                    this._btnClip.visible = true;
                    this.receivedImg.visible = false;
                    this.overImg.visible = false;
                } else {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                    this.overImg.visible = false;
                }
            } else {
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.sureBtn.visible = false;
                this.receivedImg.visible = false;
                this.overImg.visible = true;
            }

        }

        /**
         * 显示我的积分信息
         */
        public showMySocre() {
            let param: number = SoaringRankModel.instance.param;
            this.myIntegralText.text = `积分:${param}`;
            let actorId = modules.player.PlayerModel.instance.actorId;
            let mingci = SoaringRankModel.instance.nodeListByObjId[actorId];
            if (mingci) {
                let rank = mingci[FeishengRankInfoFields.rank];
                this.myRankNumText.text = `我的排名:${rank} `;
                if (rank == 1) {//如果我第第一名
                    this.otherBox.visible = false;
                    this.otherBox.y = 863 - 10;
                    this.myRankNumText.y = this.myIntegralText.y = 875 - 10;
                } else {
                    this.otherBox.visible = true;
                    this.otherBox.y = 863 - 10;
                    this.myRankNumText.y = this.myIntegralText.y = 890 - 10;
                    this.showUpPlayerScore(rank - 1);
                }
            } else {
                this.myRankNumText.text = `我的排名:未上榜`;
                this.showUpPlayerScore(50);
            }
        }

        /**
         * 显示上个排名的 玩家信息
         */
        public showUpPlayerScore(mignci: number) {
            let lastDate: FeishengRankInfo = SoaringRankModel.instance.nodeList[mignci];//获取第mignci名玩家的积分数据
            if (lastDate) {
                this.otherRankMingCiNumText.text = `${mignci}`;
                this.otherRankNumText.text = `${lastDate[FeishengRankInfoFields.name]}`;
                this.otherIntegralNameText.text = `积分`;
                this.otherIntegralText.text = `${lastDate[FeishengRankInfoFields.param]}`;
            } else {
                this.otherRankMingCiNumText.text = `${mignci}`;
                this.otherRankNumText.text = `虚位以待...`;
                let grade = 0;
                grade = SoaringRankCfg.instance.getGradeByRank(mignci);
                let shuju = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, grade);
                let condition = shuju[feisheng_rankFields.condition];
                this.otherIntegralNameText.text = `上榜所需积分`;
                this.otherIntegralText.text = `${condition}`;
            }
        }

        /**
         * 显示消耗的物品和消耗能得的积分 说明 文本
         */
        public showIntegralDescriptionText() {
            let shuju = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, 0);
            let nextType = shuju[feisheng_rankFields.nextType];
            let ItemId = shuju[feisheng_rankFields.ItemId];
            let str = CommonUtil.getNameByItemId(ItemId);
            let colorStr = CommonUtil.getColorById(ItemId);
            this.integralDescriptionText.text = `消耗1个 ${str} 获得10积分`;
            let widthNum = this.integralDescriptionText.width + this.instructionsBtn.width;
            let posX = (this.width - widthNum) / 2;
            this.integralDescriptionText.x = posX;
            this.instructionsBtn.x = this.integralDescriptionText.x + this.integralDescriptionText.width + 2;
        }

        /**
         * 顶部当前活动 和 明日活动
         */
        public showUPUiTip() {
            let shuju = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, 0);
            let nextType = shuju[feisheng_rankFields.nextType];
            let nextName = shuju[feisheng_rankFields.nextName];
            this.NowRankTypeImg.skin = `soaring_rank/txt_fsb_${SoaringRankModel.instance.curType}.png`;
            this.TomorrowRankTypeText.text = nextName;

            let timeStr = this.serverTimeToHHMMSS();
            this.updateTimeText.text = `上次更新:${timeStr}`;
        }

        public serverTimeToHHMMSS(): string {
            let str: string = "";
            let nowDate: Date = new Date(GlobalData.serverTime);
            let minute: int = nowDate.getMinutes() >> 0;
            let hours: int = nowDate.getHours() >> 0;
            str = (hours < 10 ? "0" : "") + hours + "时" + (minute < 10 ? "0" : "") + minute + "分";
            return str;
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-12, -19, true);
            this._btnClip.scale(1.3, 1.26);
            this._btnClip.visible = false;
        }
    }
}
