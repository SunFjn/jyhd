/** 姻缘 副本*/

///<reference path="../config/blend_cfg.ts"/>


namespace modules.marry {

    import MarryCopyAlertUI = ui.MarryCopyAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;
    import CustomClip = modules.common.CustomClip;

    export class MarryCopyAlert extends MarryCopyAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private btnClip: CustomClip;
        protected initialize(): void {
            super.initialize();
            let cfg: blend = BlendCfg.instance.getCfgById(70109);
            let arr: number[] = cfg[blendFields.intParam]
            for (let i: int = 0, len = arr.length; i < len; i++) {
                if (this.itemBox._childs.length > i) {
                    (this.itemBox._childs[i] as modules.bag.BaseItem).dataSource = [arr[i], 0, 0, null];
                }
            }
            this.btnClip = EffUtil.creatBtnEff1(this.goBtn)

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendCopy);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_COPY_UPDATE, this, this.setTxt);
        }
        private openTips() {
            CommonUtil.alertHelp(70001)
        }

        private sendCopy() {
            if (MarryModel.instance.isHave) {
                this.reqEnterScene()
            } else {

                let cfg: blend = BlendCfg.instance.getCfgById(70113);
                let content: string = cfg[blendFields.stringParam][0];
                let handler = Handler.create(this, this.reqEnterScene);
                CommonUtil.alert(`温馨提示`, content, [handler]);
            }

        }
        private reqEnterScene() {
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_marry_copy);
        }
        protected removeListeners(): void {
            super.removeListeners();


        }
        private setTxt() {
            this.numTxt.text = MarryModel.instance.copyNum + "/" + MarryModel.instance.copyMaxNum
            if (MarryModel.instance.getCopyRP()) {
                this.btnClip.visible = true;
                this.btnClip.play();
            } else {
                this.btnClip.visible = false;
                this.btnClip.stop();
            }

        }


        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();
            this.setTxt()
            MarryCtrl.instance.GetMarryCopyTimes();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}