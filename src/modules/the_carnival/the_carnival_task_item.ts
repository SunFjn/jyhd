///<reference path="../../../libs/generate/configuration.d.ts"/>
/** 全民狂嗨 任务子项*/

namespace modules.the_carnival {

    import CustomClip = modules.common.CustomClip;
    import kuanghai_task = Configuration.kuanghai_task;
    import LayaEvent = modules.common.LayaEvent;
    import kuanghai_taskFields = Configuration.kuanghai_taskFields;
    import KuanghaiTaskNode = Protocols.KuanghaiTaskNode;
    import KuanghaiTaskNodeFields = Protocols.KuanghaiTaskNodeFields;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    //import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class TheCarnivalTaskItem extends ui.TheCarnivalTaskItemUI {
        private _btnClip: CustomClip;
        private _cfg: kuanghai_task;
        private _taskList:KuanghaiTaskNode;/*任务列表*/
        private _taskId:number;/*任务id*/
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.gotoBtn, LayaEvent.CLICK, this, this.gotoBtnHandler);
        }
        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
        }
        protected setData(value: any): void {
            super.setData(value);
            this._cfg = value;
            this._taskId = this._cfg[kuanghai_taskFields.id];

            //任务名
            this.themeDrawText.text = this._cfg[kuanghai_taskFields.name];
            //奖励嗨点
            this.happyPointText.text = `奖励嗨点:${this._cfg[kuanghai_taskFields.exp]}`;

            this._taskList = TheCarnivalModel.instance.getNodeInfoById(this._taskId)?TheCarnivalModel.instance.getNodeInfoById(this._taskId):[0,0,2333];
            //进度
            let condition = this._cfg[kuanghai_taskFields.condition];
            let progress = this._taskList[KuanghaiTaskNodeFields.progress];
            this.percentText.text = `(${progress}/${condition})`;
            //领取状态 /*状态 0未达成 1可领取 2已领取*/
            switch (this._taskList[KuanghaiTaskNodeFields.state]) {
                case 0:
                    this.sureBtn.visible = false;
                    this.gotoBtn.visible = true;
                    this.received.visible = false;
                    this._btnClip.visible =false;
                    this._btnClip.stop();
                    break;
                case 1:
                    this.sureBtn.visible = true;
                    this.gotoBtn.visible = false;
                    this.received.visible = false;
                    this._btnClip.visible =true;
                    this._btnClip.play();
                    break;
                case 2:
                    this.sureBtn.visible = false;
                    this.gotoBtn.visible = false;
                    this.received.visible = true;
                    this._btnClip.visible =false;
                    this._btnClip.stop();
                    break;
                default:
                    this.sureBtn.visible = false;
                    this.gotoBtn.visible = false;
                    this._btnClip.visible =false;
                    this._btnClip.stop();
                    break;
            }
        }
        private sureBtnHandler(){
            TheCarnivalCtrl.instance.getKuanghaiTaskAward(this._taskId);
        }
        private gotoBtnHandler(){
            //跳转面板或场景
            let actionId :number = this._cfg[kuanghai_taskFields.skipId][0];
            PropAlertUtil.skipScene(actionId);
        }
        private createEffect(){
            this._btnClip = CommonUtil.creatEff(this.sureBtn, "btn_light", 15);
            this._btnClip.scale(0.65, 0.8);
            this._btnClip.pos(-5, -12);
            this._btnClip.play();
            this._btnClip.visible = false;
        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}