/** 姻缘 甜蜜度奖励 领取*/


namespace modules.marry {

    import MarryIntimacyRewardAlertUI = ui.MarryIntimacyRewardAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import marry_intimacyFields = Configuration.marry_intimacyFields;
    import LayaEvent = modules.common.LayaEvent;
    import CustomClip = modules.common.CustomClip;
    export class MarryIntimacyRewardAlert extends MarryIntimacyRewardAlertUI {

        private btnClip: CustomClip;
        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.btnClip = new CustomClip();
            this.lingquBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-7, -19);
            this.btnClip.scale(1.24, 1.25);
            this.btnClip.visible = false;


        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.lingquBtn, LayaEvent.CLICK, this, this.getReward);
        }

        protected removeListeners(): void {
            super.removeListeners();


        }



        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();
            this.btnClip.visible = false;
            this.btnClip.stop();
            //获取现在领取了奖励的等级
            let lv: number = MarryModel.instance.getMinRewardLevel() + 1;

            let cfg = MarryCfg.instance.getLevelCfg(lv)
            if (!cfg) {
                lv -= 1
                cfg = MarryCfg.instance.getLevelCfg(lv)
                this.conditionTxt.visible = true;
                this.lingquBtn.visible = false;
                this.conditionTxt.text = '已全部领取完毕'
            } else {
                if (lv > MarryModel.instance.getIntimacyLevel()) {
                    this.conditionTxt.visible = true;
                    this.lingquBtn.visible = false;
                    this.conditionTxt.text = `甜蜜度达到${lv}级可领取`
                } else {
                    this.conditionTxt.visible = false;
                    this.lingquBtn.visible = true;
                    this.lingquBtn.label = "领取";
                    this.btnClip.visible = true;
                    this.btnClip.play();
                }
            }

            this.titleTXt.text = `甜蜜度Lv.${lv}奖励`
            let reward = cfg[marry_intimacyFields.reward]
            for (let i = 0; i < reward.length; i++) {
                this['item' + (i + 1)].dataSource = [reward[i][0], reward[i][1], 0, null]
            }

        }

        private getReward(): void {
            MarryCtrl.instance.GetLevelAward(MarryModel.instance.getMinRewardLevel() + 1)
            this.close();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}