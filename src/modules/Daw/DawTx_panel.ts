/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.daw {
    import DawTiXianUI = ui.DawTiXian2UI;
    import CustomList = modules.common.CustomList;
    // import gushen_task = Configuration.gushen_task;
    // import gushen = Configuration.gushen;
    // import CustomList = modules.common.CustomList;
    // import Event = laya.events.Event;
    // import gushenFields = Configuration.gushenFields;
    // import SkillTrainCfg = modules.config.SkillTrainCfg;
    // import skillTrain = Configuration.skillTrain;
    // import skillTrainFields = Configuration.skillTrainFields;
    // import gushen_taskFields = Configuration.gushen_taskFields;
    // import Button = laya.ui.Button;
    // import Text = laya.display.Text;
    // import CustomClip = modules.common.CustomClip;
    // import GushenNote = Protocols.GushenNote;
    // import GushenNoteFields = Protocols.GushenNoteFields;
    // import SystemNoticeManager = modules.notice.SystemNoticeManager;
    // import GushenTask = Protocols.GushenTask;
    // import GushenTaskFields = Protocols.GushenTaskFields;
    // import Image = laya.ui.Image;
    // import SkillCfg = modules.config.SkillCfg;
    // import skill = Configuration.skill;
    // import skillFields = Configuration.skillFields;
    // import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Event = laya.events.Event;
    export class DawTixianPanl extends DawTiXianUI {
        private _List: CustomList;
        constructor() {
            super();

        }

        public destroy(): void {

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._List = new CustomList();
            this._List.scrollDir = 1;

            this._List.itemRender = DawTxItem;

            this._List.vCount = 7;

            this._List.spaceX = 12;
            this._List.spaceY = 12;
            this._List.hCount = 3;

            this._List.width = 489;
            this._List.height = 176;
            this._List.x = 0;
            this._List.y = 0;
            this.list.addChild(this._List);


        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAW_TiXian_updataList, this, this.updataUI);
            this.btnTixian.on(Event.CLICK, this, this.sendTiXian, [1]);
            this.btnTixian2.on(Event.CLICK, this, this.sendTiXian, [2]);
            this.imglist.on(Event.CLICK, this, this.openList);
        }



        protected removeListeners(): void {
            super.removeListeners();
        }
        private count: number = 0
        onOpened(): void {
            super.onOpened();
            this.OpenUI()



        }
        private _netData = [];
        private OpenUI() {
            let s = this;
            window['SDKNet']("api/game/bonus/withdraw/config", {}, (data) => {
                if (data.code == 200) {
                    s.strtitle.text = Number(data.data.money) + "元"
                    let arr = CommonUtil.PHPArray(data.data.withdraw_config)
                    this._netData = []
                    for (let i = 0; i < arr.length; i++) {
                        this._netData.push({
                            tag: i,
                            money: arr[i].money,
                            config: arr[i]
                        })
                    }
                    s.updataUI();
                }
            })

        }
        private updataUI() {
            this._List.datas = this._netData
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        private sendTiXian(type) {
            if (this._netData.length <= 0) {
                SystemNoticeManager.instance.addNotice('提现列表为空', true);
                return;
            }
            if (this._List.selectedIndex <= -1) {
                SystemNoticeManager.instance.addNotice('请选择提现金额', true);
                return;
            }
            let arr = {
                api_type: "POST",
                pay_type: type,
                config_id: this._netData[this._List.selectedIndex].config.id,
                method: "tixian"
            }
            window['SDKNet']("api/game/bonus/withdraw/apply", arr, (data) => {
                if (data.code == 200) {
                    SystemNoticeManager.instance.addNotice("提现申请成功", false);
                } else {
                    SystemNoticeManager.instance.addNotice(data.error, true);
                }
                this.OpenUI()
            })
        }
        private openList() {
            WindowManager.instance.open(WindowEnum.Daw_UI_TiXianList)
        }
    }
}