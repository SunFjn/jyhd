/* 七日活动任务item */
namespace modules.seven_activity {
    import SevenActivityTaskItemUI = ui.SevenActivityTaskItemUI;

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import seven_activityItem = Configuration.seven_activityItem;
    import seven_activityItemFields = Configuration.seven_activityItemFields;
    import CommonUtil = modules.common.CommonUtil;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class SevenActivityTaskItem extends SevenActivityTaskItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.gotoBtn, common.LayaEvent.CLICK, this, this.goBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: seven_activityItem): void {
            super.setData(value);
            // 任务状态 0-未达成 1-可领取 2-已领取
            let state: number = value[seven_activityItemFields.status];

            // console.log(value);
            let item: Items = value[seven_activityItemFields.items][0];
            let taskName: string = value[seven_activityItemFields.describe];
            let process: string = `(${value[seven_activityItemFields.process]}/${value[seven_activityItemFields.total]})`;
            // 超过最大值则设置为最大值
            if (value[seven_activityItemFields.process] >= value[seven_activityItemFields.total]) {
                process = `(${value[seven_activityItemFields.total]}/${value[seven_activityItemFields.total]})`;
            }
            let proValue = value[seven_activityItemFields.process] / value[seven_activityItemFields.total]
            this.proAddSign.width = proValue * 203;
            if (this.proAddSign.width >= 203) {
                this.proAddSign.width = 203;
            }

            this.themeDrawText.text = taskName;
            this.percentText.text = process;

            // 类型为26跳转的觉醒类型的项去掉进度条
            if (value[seven_activityItemFields.taskId] == 26) {
                let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
                if (!attr) return;
                let transformLv: number = attr[ActorBaseAttrFields.eraLvl];
                let transformNum: number = attr[ActorBaseAttrFields.eraNum];
                this.percentText.text = transformLv === 0 && transformNum === 0 ? "未觉醒" : `${transformLv}阶${transformNum}段`;

                this.proAddSign.visible = false;
            } else {
                this.proAddSign.visible = true;
            }

            // 状态按钮显示
            this.gotoBtn.visible = state == 0;
            this.sureBtn.visible = state == 1;
            this.received.visible = state == 2;

            // 奖励
            this.item.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            let taskId = this._data[seven_activityItemFields.id];
            let currentDay = SevenActivityModel.instance.currentDay;
            SevenActivityCtrl.instance.getAward([currentDay, taskId]);
        }

        //前往
        private goBtnHandler(): void {
            let actionId: number = this._data[seven_activityItemFields.taskId];
            // console.log("七日活动跳转面板ID：" + actionId);
            if (actionId == 0) {
                // CommonUtil.noticeError(43218)
                // 击杀首领由于在主界面所以无法跳转
                SystemNoticeManager.instance.addNotice(ErrorCodeCfg.instance.getErrorCfgById(43218)[erorr_codeFields.msg_ZN]);
                return;
            } else if (actionId == 57) {
                WindowManager.instance.open(WindowEnum.DAILY_DUNGEON_PANEL);
                return;
            }
            PropAlertUtil.skipScene(actionId);
        }
    }
}