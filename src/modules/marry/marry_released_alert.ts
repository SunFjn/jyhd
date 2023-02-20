/** 姻缘 搜索*/

///<reference path="../config/blend_cfg.ts"/>


namespace modules.marry {

    import MarryReleasedAlertUI = ui.MarryReleasedAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BtnGroup = modules.common.BtnGroup;

    import blend = Configuration.blend;


    export class MarryReleasedAlert extends MarryReleasedAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _btnGroup: BtnGroup;
        private _grade: number = 0
        protected initialize(): void {
            super.initialize();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.grade1Btn, this.grade2Btn, this.grade3Btn);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.grade1Btn, LayaEvent.CLICK, this, this.setGrade, [0]);
            this.addAutoListener(this.grade2Btn, LayaEvent.CLICK, this, this.setGrade, [1]);
            this.addAutoListener(this.grade3Btn, LayaEvent.CLICK, this, this.setGrade, [2]);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendReleased);

        }


        private setGrade(level: number) {
            this._grade = level
        }
        protected removeListeners(): void {
            super.removeListeners();


        }

        private sendReleased() {
            if (this.descTxt.text.length == 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("不能发布空信息", true);
                return;
            }

            if (this.descTxt.text.length > BlendCfg.instance.getCfgById(70101)[blendFields.intParam][0]) {
                modules.notice.SystemNoticeManager.instance.addNotice("发布消息超过限制长度", true);
                return;
            }

            if (MarryModel.instance.isHave) {
                modules.notice.SystemNoticeManager.instance.addNotice("已有姻缘无法发布", true);
                return;
            }

            MarryCtrl.instance.ReleaseMarryWall(this.descTxt.text, this._grade)
            this.close()
        }

        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0
            this._grade = 0
            let icon = CommonUtil.getIconById(BlendCfg.instance.getCfgById(70102)[blendFields.intParam][0], true);
            let item: Array<number> = BlendCfg.instance.getCfgById(70103)[blendFields.intParam];
            for (let index = 0; index < item.length; index++) {
                this["grade" + (index + 1) + "icon"].skin = icon
                this["grade" + (index + 1) + "Txt"].text = item[index].toString();
            }


          
            let str = (BlendCfg.instance.getCfgById(70108)[blendFields.stringParam])
            let tips = str[CommonUtil.getRandomInt(0, str.length - 1)]
            this.descTxt.text = tips.substr(1, tips.length - 2) //每次打开随机话语

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}