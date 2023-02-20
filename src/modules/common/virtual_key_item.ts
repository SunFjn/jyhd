namespace modules.common {
    import VirtualKeyItemUI = ui.VirtualKeyItemUI;

    import Point = Laya.Point;
    import Event = Laya.Event;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import Sprite = Laya.Sprite;
    import ColorFilter = Laya.ColorFilter;
    import SkillFields = Protocols.SkillFields;
    import GameCenter = game.GameCenter;
    import SkillComponent = game.role.component.SkillComponent;
    export class VirtualKeyItem extends VirtualKeyItemUI {
        private _skillId: number;
        private _totalTime: number;
        private _startTime: number;
        private _maskSpr: Sprite;
        private _skillClass: number;
        private _skillCd: number;
        public isCd: boolean = false
        constructor() {
            super();
            this._maskSpr = new Sprite();
            this._maskSpr.pos(67, 71, true);
            // this.addChild(this._maskSpr);
            this.lightCircle.mask = this._maskSpr;
            this._skillClass = 0;
            this._skillId = 0;
            this._totalTime = 0;
            this._skillCd = 0
            this.skillMaskImg.alpha = 0;
            this.alpha = 0;
        }
        public set skillClass(value: number) {
            let skills = PlayerModel.instance.skills
            for (let skill of skills) {
                let skillClass = skill[SkillFields.skillId];
                let id = skillClass * 10000 + skill[SkillFields.level];
                if (value == skillClass) {
                    this.skillId = id
                    break;
                }

            }
        }


        public set skillId(value: number) {
            this._skillId = value;
            let skillCfg: skill = SkillCfg.instance.getCfgById(value);
            if (skillCfg[skillFields.icon] == '') {
                // console.log('研发测试_chy:虚拟键位 ', value, '无图标');
            } else {
                this.skillicon.skin = `assets/icon/skill/${skillCfg[skillFields.icon]}.png`;
            }

            this.levTxt.text = CommonUtil.getSkillLvById(value).toString();
            this._skillClass = CommonUtil.getSkillPureIdById(value)
            this._skillCd = skillCfg[skillFields.cd]
            this.clear();
        }
        public get skillId() {
            return this._skillId;
        }
        public get skillClass() {
            return this._skillClass;
        }

        private loopHandler(): void {
            if (GlobalData.serverTime < this._startTime + this._totalTime) {
                this._maskSpr.graphics.clear();
                let angle: number = (GlobalData.serverTime - this._startTime) / this._totalTime * 360;
                this._maskSpr.graphics.drawPie(0, 0, 71, -90, -90 + angle, "#FF0000");
                angle = angle * Math.PI / 180;
                this.pointImg.pos(67 + 57 * Math.sin(angle), 71 - 57 * Math.cos(angle), true);
            } else {
                this.clear();
            }
        }

        private reset(): void {
            this._maskSpr.graphics.clear();
            this._maskSpr.graphics.drawCircle(0, 360, 71, "#FF0000");
            this.pointImg.pos(67, 11, true);
        }


        public cdPlay(value: number) {
            if (this.isCd) return;
            this.clear();
            this.cd(true)
            this._startTime = GlobalData.serverTime - (this._skillCd - value);
            this._totalTime = value;
            Laya.timer.frameLoop(1, this, this.loopHandler);
            this.loopHandler();
        }
        private clear() {
            this.reset();
            Laya.timer.clear(this, this.loopHandler);
            this.cd(false)
        }
        private cd(value: boolean) {
            if (value) {
                var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
                this.skillicon.filters = [new ColorFilter(grayscaleMat)]
                this.skillMaskImg.alpha = 0;
            } else {
                this.skillicon.filters = []
                this.maskEff()
            }
            this.isCd = value
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, LayaEvent.CLICK, this, this.clickHandler);
        }
        private clickHandler(): void {
            // console.log('研发测试_chy:准备释放技能', this.skillClass);
            if (GameCenter.instance._master.getComponent(SkillComponent).setNextSkill(this.skillClass)) {
                // PlayerModel.instance.autoAi = false
                // console.log('研发测试_chy:释放真');
                TweenJS.create(this.skillicon)
                    .combine(true)
                    .to({ scaleX: 1, scaleY: 1 }, 75)
                    .onComplete(this.recoveryEff)
                    .start()

            }


        }
        private recoveryEff(element) {
            TweenJS.create(element)
                .combine(true)
                .to({ scaleX: 1.2, scaleY: 1.2 }, 75)
                .start()
            // PlayerModel.instance.autoAi = true

        }

        private maskEff() {
            TweenJS.create(this.skillMaskImg)
                .combine(true)
                .to({ alpha: 1 }, 200)
                .start()
        }
    }
}