namespace modules.heroAura {
    import HeroAuraItemUI = ui.HeroAuraItemUI;
    import hero_awardItem = Configuration.hero_awardItem
    import hero_awardItemFields = Configuration.hero_awardItemFields;


    export class HeroAuraItem extends HeroAuraItemUI {

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: hero_awardItem): void {
            super.setData(value);
            this.awardTxt.text = value[hero_awardItemFields.awardTxt];
            this.baseBg.skin = `hero_aura/${value[hero_awardItemFields.awardIcon]}`;
            this.awardName.skin = `hero_aura/${value[hero_awardItemFields.awardNameIcon]}`;
        }
    }
}