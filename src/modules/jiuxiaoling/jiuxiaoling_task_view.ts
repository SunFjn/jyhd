/** 九霄令任务面板*/

namespace modules.jiuxiaoling {
    import CustomList = modules.common.CustomList;
    import JiuXiaoLingTaskViewUI = ui.JiuXiaoLingTaskViewUI;
    import jiuXiaoLingTask = Configuration.jiuXiaoLingTask;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import JiuXiaoLingAwardCfg = modules.config.JiuXiaoLingAwardCfg;
    import JiuxiaoOrderInfoReplyFields = Protocols.JiuxiaoOrderInfoReplyFields;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import JiuxiaoOrderDayTaskReply = Protocols.JiuxiaoOrderDayTaskReply;
    import JiuxiaoOrderDayTaskReplyFields = Protocols.JiuxiaoOrderDayTaskReplyFields;
    import JiuxiaoOrderSeasonTaskReplyFields = Protocols.JiuxiaoOrderSeasonTaskReplyFields;
    import JiuxiaoOrderSeasonTaskReply = Protocols.JiuxiaoOrderSeasonTaskReply;
    import JiuxiaoOrderExpWrapNode = Protocols.JiuxiaoOrderExpWrapNode;
    import JiuxiaoOrderExpWrapNodeFields = Protocols.JiuxiaoOrderExpWrapNodeFields;

    export class JiuXiaoLingTaskView extends JiuXiaoLingTaskViewUI {
        private _list: CustomList;
        private _type: number;
        private _bar: ProgressBarCtrl;

        protected initialize(): void {
            super.initialize();
            this._bar = new ProgressBarCtrl(this.imgpro, this.imgpro.width, this.expTxt);
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.width = 675;
            this._list.height = 628;
            this._list.spaceX = 8;
            this._list.itemRender = JiuXiaoLingTaskItem;
            this._list.x = 25;
            this._list.y = 131;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.awardBtn, Laya.Event.CLICK, this, this.awardBtnHandler);
            this.addAutoListener(this.typeBtn, Laya.Event.CLICK, this, this.typeBtnHandler);
            this.addAutoListener(this.packageBtn, Laya.Event.CLICK, this, this.packageBtnHandler);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_JXL_AWARD_AND_STATUS, this, this.setShowInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_JXL_SEASON_TASK_INFO, this, this.jxlSeasonTaskUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_JXL_DAILY_TASK_INFO, this, this.jxlDailyTaskUpdate);

            this.addAutoRegisteRedPoint(this.expRPImg, ["JiuXiaoLingExtralExpRP"]);
            this.addAutoRegisteRedPoint(this.typeRPImg, ["JiuXiaoLingTaskRP"]);
            this.addAutoRegisteRedPoint(this.awardRPImg, ["JiuXiaoLingAwardRP"]);
            this.addAutoRegisteRedPoint(this.taskRPImg, ["JiuXiaoLingTaskRP", "JiuXiaoLingExtralExpRP"]);
        }

        // 帮助界面
        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(68001);
        }

        // 切换赛季任务和阶段任务战士
        private typeBtnHandler(): void {
            this._type = this._type == 0 ? 1 : 0;
            this.updateShow();
        }

        protected onOpened(): void {
            super.onOpened();
            this._type = JiuXiaoLingModel.instance.currentTaskView;
            this.awardBtn.selected = false;
            this.updateShow();
        }

        // 九霄令奖励面板
        private awardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_AWARD_VIEW);
        }

        // 经验包领取按钮
        private packageBtnHandler(): void {
            let isBuy: boolean = JiuXiaoLingModel.instance.isBuy;

            if (isBuy) {
                JiuXiaoLingCtrl.instance.GetExtralExp();
            } else {
                let exp: number = BlendCfg.instance.getCfgById(68003)[blendFields.intParam][0];
                let handler: Handler = Handler.create(this, () => {
                    WindowManager.instance.open(WindowEnum.JIUXIAOLING_ACTIVATE_GOLD_ALERT);
                });
                CommonUtil.alert(`温馨提示`, `激活<p color="#ba774b">【九霄金令】</p>每阶段还可以免费领取<p color="#ba774b">${exp}</p>点<p color="#ba774b">额外升级经验</p>哦~是否前往激活`, [handler]);
            }
        }

        // 九霄令赛季任务数据刷新
        private jxlSeasonTaskUpdate() {
            let jxl_data: JiuxiaoOrderSeasonTaskReply = JiuXiaoLingModel.instance.seasonTaskInfo;

            // 结束时间
            this.overtimeTxt.text = `本赛季任务结束时间：${CommonUtil.getDate(jxl_data[JiuxiaoOrderSeasonTaskReplyFields.endTime], false, "/")}`;
            // 赛季任务数
            this.exp2Txt.text = `${jxl_data[JiuxiaoOrderSeasonTaskReplyFields.taskNum]}/${jxl_data[JiuxiaoOrderSeasonTaskReplyFields.totalNum]}`

            this._list.datas = JiuXiaoLingModel.instance.getSeasonTaskList();
            this.setShowInfo();
        }

        // 九霄令日常任务数据刷新
        private jxlDailyTaskUpdate() {
            let jxl_data: JiuxiaoOrderDayTaskReply = JiuXiaoLingModel.instance.dailyTaskInfo;
            let exp_data: JiuxiaoOrderExpWrapNode = JiuXiaoLingModel.instance.extralExpData;
            // 额外经验包展示
            this.refreshTxt.text = `${CommonUtil.getDate(exp_data[JiuxiaoOrderExpWrapNodeFields.expWrapTime], false, "/")}零点刷新`;
            this.packageBtn.visible = exp_data[JiuxiaoOrderExpWrapNodeFields.state] != 2;
            // this.packageBtn.disabled = exp_data[JiuxiaoOrderExpWrapNodeFields.state] == 0;
            this.alreadyGeted.visible = exp_data[JiuxiaoOrderExpWrapNodeFields.state] == 2;
            // 结束时间
            this.overtimeTxt.text = `本阶段任务结束时间：${CommonUtil.getDate(jxl_data[JiuxiaoOrderDayTaskReplyFields.endTime], false, "/")}`;
            // 阶段经验
            this.exp2Txt.text = `${jxl_data[JiuxiaoOrderDayTaskReplyFields.stageExp]}/${jxl_data[JiuxiaoOrderDayTaskReplyFields.totalexp]}`

            this._list.datas = JiuXiaoLingModel.instance.getStageTaskList();
            this.setShowInfo();
        }

        private updateShow() {

            // 隐藏或展示额外经验包
            this.extralBox.visible = this._type == 0;

            // 0 打开阶段任务
            if (this._type == 0) {
                JiuXiaoLingModel.instance.currentTaskView = 0;
                JiuXiaoLingCtrl.instance.GetTaskList([1]);
                this.typeBtn.skin = "jiuxiaoling/image_icon_113.png";
                this.typeTxt.text = "赛季任务";
                this.titleTxt.text = "阶段任务";
                this.exphint.text = "阶段经验";
            }
            // 1 打开赛季任务
            else {
                JiuXiaoLingModel.instance.currentTaskView = 1;
                JiuXiaoLingCtrl.instance.GetTaskList([2]);
                this.typeBtn.skin = "jiuxiaoling/image_icon_112.png";
                this.typeTxt.text = "阶段任务";
                this.titleTxt.text = "赛季任务";
                this.exphint.text = "任务数量";
            }

            this.setShowInfo();
        }

        private setShowInfo() {
            // 当前等级
            let level: number = JiuXiaoLingModel.instance.level;
            this.levelClip.value = level.toString();

            // 经验
            this._bar.maxValue = JiuXiaoLingAwardCfg.instance.getUpLevelExp(level);

            if (this._bar.maxValue == 0) {
                this._bar.value = 0;
            } else {
                this._bar.value = JiuXiaoLingModel.instance.exp;
            }
        }

        public close(): void {
            super.close();

        }

        public destroy(destroyChild: boolean = true): void {
            this._bar = this.destroyElement(this._bar);
            this._list = this.destroyElement(this._list);
        }
    }
}