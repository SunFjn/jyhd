/**圣物激活弹窗*/


namespace modules.talisman {
    import TalismanCfg = modules.config.TalismanCfg;
    import amuletRiseFields = Configuration.amuletRiseFields;
    import CustomClip = modules.common.CustomClip;

    export class TalismanUpAlert extends ui.TalismanUpAlertUI {
        constructor() {
            super();
        }

        private talismanLevel: number;
        private upClip: CustomClip;

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.talismanLevel = value as number;
            this.showInfo();
            this.upClip.play();
        }

        public destroy(): void {
            if (this.upClip) {
                this.upClip.removeSelf();
                this.upClip.destroy();
                this.upClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this.upClip = new CustomClip();
            this.addChildAt(this.superMan, 2);
            this.addChildAt(this.upClip, 2);
            this.upClip.pos(122, -90, true);
            this.upClip.scale(2, 2);
            this.upClip.skin = "assets/effect/state.atlas";
            this.upClip.frameUrls = ["state/0.png", "state/1.png", "state/2.png", "state/3.png", "state/4.png", "state/5.png", "state/6.png", "state/7.png"];
            this.upClip.durationFrame = 5;
            this.upClip.play();
            this.upClip.visible = true;

            this.clickCD = true;
        }

        public showInfo(): void {
            let cfg = TalismanCfg.instance.getRiseCfgByLevel(this.talismanLevel);
            this.levelImg.skin = `assets/icon/ui/amulet/${this.talismanLevel}.png`;
            this.magicUpLimit.text = cfg[amuletRiseFields.maxSkillLevel].toString();
            this.magicUpAttack.text = "+" + (cfg[amuletRiseFields.skillDamage] * 100).toFixed() + "%";
        }

        public close(): void {
            super.close();
            this.upClip.stop();
        }
    }
}