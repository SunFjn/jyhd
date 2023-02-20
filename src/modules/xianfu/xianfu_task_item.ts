/////<reference path="../$.ts"/>
/** 任务item项 */
namespace modules.xianfu {
    import XianfuTaskItemUI = ui.XianfuTaskItemUI;
    import XianFuTask = Protocols.XianFuTask;
    import XianFuTaskFields = Protocols.XianFuTaskFields;
    import xianfu_task = Configuration.xianfu_task;
    import xianfu_taskFields = Configuration.xianfu_taskFields;
    import CustomClip = modules.common.CustomClip;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class XianfuTaskItem extends XianfuTaskItemUI {

        private _btnClip: CustomClip;
        private _taskId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._btnClip = CommonUtil.creatEff(this.getBtn, `btn_light`, 15);
            this._btnClip.pos(-6, -18);
            this._btnClip.scale(1.25, 1.3);
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getBtn, Laya.Event.CLICK, this, this.getBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.play();
        }

        public setData(value: any): void {
            let taskInfo: XianFuTask = value as XianFuTask;
            let id: number = this._taskId = taskInfo[XianFuTaskFields.id];
            let state: number = taskInfo[XianFuTaskFields.state];
            let taskCfg: xianfu_task = XianfuTaskCfg.instance.getCfgById(id);
            let name: string = taskCfg[xianfu_taskFields.name];
            this.nameTxt.text = name;
            let currValue: number = taskInfo[XianFuTaskFields.value];
            let type: number = taskCfg[xianfu_taskFields.type];
            let sumValue: number;
            if (type == 1) {
                sumValue = taskCfg[xianfu_taskFields.value][0];
            } else {
                sumValue = taskCfg[xianfu_taskFields.value][1];
            }
            this.rotioTxt.text = `${currValue}/${sumValue}`;
            let award: Array<Items> = taskCfg[xianfu_taskFields.award];
            this.iconImg.skin = CommonUtil.getIconById(award[0][ItemsFields.itemId]);
            this.awardTxt.text = award[0][ItemsFields.count].toString();
            /*状态 0：未完成 1:已完成 2：已领取*/
            this._btnClip.visible = this.receivedImg.visible = this.getBtn.visible = false;
            this._btnClip.visible = state == 1;
            if (state == 0) {
                this.receivedImg.visible = true;
                this.receivedImg.skin = `common/txt_commmon_wdc.png`;
            } else if (state == 1) {
                this.getBtn.visible = this._btnClip.visible = true;
            } else {
                this.receivedImg.visible = true;
                this.receivedImg.skin = `common/txt_commmon_ylq.png`;
            }
        }

        private getBtnHandler(): void {
            XianfuCtrl.instance.getXianFuTaskAward([this._taskId]);
        }

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}