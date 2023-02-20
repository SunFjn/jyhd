/** 成就显示单元项 */


///<reference path="../config/xianwei_task_cfg.ts"/>

namespace modules.magicPosition {
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import MagicPositionItemUI = ui.MagicPositionItemUI;
    import Event = Laya.Event;
    import XianweiTaskCfg = modules.config.XianweiTaskCfg;
    import xianwei_taskFields = Configuration.xianwei_taskFields;
    import CustomClip = modules.common.CustomClip;
    import XianweiTaskNode = Protocols.XianweiTaskNode;
    import XianweiTaskNodeFields = Protocols.XianweiTaskNodeFields;
    import ItemsFields = Configuration.ItemsFields;
    import Point = Laya.Point;

    export class MagicPositionItem extends MagicPositionItemUI {

        private taskId: number;
        private linkTo: number;
        private maxWidth: number;
        private _btnClip: CustomClip;
        private _bar: ProgressBarCtrl;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._bar = this.destroyElement(this._bar);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.maxWidth = 238;
            this._bar = new ProgressBarCtrl(this.progressImg, this.maxWidth, this.showProgress);
            this._btnClip = CommonUtil.creatEff(this.getBtn, `btn_light`, 15);
            this._btnClip.scale(0.7, 0.95);
            this._btnClip.pos(-5, -16);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getAward);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goOtherPanel);
        }

        private getAward() {
            if (common.ItemRenderNoticeManager.instance.isPlaying) return;
            MagicPositionModel.Instance.showPoint = this.localToGlobal(new Point(0, 0));
            common.ItemRenderNoticeManager.instance.index = this.index;
            MagicPositionCtrl.Instance.getTaskAward(this.taskId);
        }

        private goOtherPanel() {
            if (this.linkTo === -1) {
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [MoneyItemId.exp, 0, true]);
            } else if (this.linkTo != 0) {
                WindowManager.instance.openByActionId(this.linkTo);
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            let info = value as XianweiTaskNode;
            this.taskId = info[XianweiTaskNodeFields.id];
            let barValue: number = info[XianweiTaskNodeFields.progress];
            //读取对应表的数据
            let cfg: Configuration.xianwei_task = XianweiTaskCfg.instance.getXianweiTaskDataById(this.taskId);
            let isHeight = cfg[xianwei_taskFields.rank] < 100 ? true : false;
            if (isHeight) {
                this.showBg.skin = "magic_position/dt_xianwei_1.png";
            } else {
                this.showBg.skin = "magic_position/dt_xianwei_2.png";
            }
            this.linkTo = cfg[xianwei_taskFields.skipId][0];
            //设置任务目标名称
            this.teskName.text = cfg[xianwei_taskFields.name];
            //设置任务对应仙力值
            this.achieveValue.value = cfg[xianwei_taskFields.reward][0][ItemsFields.count].toString();
            //设置获得的代币券数量
            this.goldNum.text = cfg[xianwei_taskFields.reward][1][ItemsFields.count].toString();
            //获取需要的数量
            let needNum = cfg[xianwei_taskFields.taskCondition];
            this._bar.maxValue = needNum;
            if (info[XianweiTaskNodeFields.state] == 1) {  //可领取
                this.getBtn.visible = true;
                this._btnClip.play();
                this.goBtn.visible = false;
                this._bar.value = needNum == 1 ? 1 : barValue;
            } else {
                this.getBtn.visible = false;
                this._btnClip.stop();
                this.goBtn.visible = true;
                this._bar.value = needNum == 1 ? 0 : barValue;
            }
        }
    }
}
