/** 秘术单元项 */

namespace modules.magicArt {
    import MagicArtItemViewUI = ui.MagicArtItemViewUI;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;

    export class magicArtItem extends MagicArtItemViewUI {
        constructor() {
            super();
        }

        private _rowWidth = 478;
        private _rowX = 150;

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setData(value: any): void {
            super.setData(value);
            let skillInfo = value as skillTrain;
            this.skillNameTxt.text = skillInfo[skillTrainFields.name];
            let skillId = skillInfo[skillTrainFields.id];
            let hasGet = MagicArtModel.instance.checkHasSkill(Math.floor(skillId / 10000));
            if (hasGet) {
                this.hasOpen.visible = true;
                this.skillGetCondition.visible = false;
            } else {
                this.hasOpen.visible = false;
                this.skillGetCondition.visible = true;
                //技能开启条件
                this.skillGetCondition.text = skillInfo[skillTrainFields.show_condition];
            }
            let skillDes: skill = MagicArtModel.instance.getCfgById(skillId);
            this.skillIcon.skin = `assets/icon/skill/${skillDes[skillFields.icon]}.png`;
            let des: string = skillDes[skillFields.des];
            this.skillDescribeTxt.text = des;
            // if (des.length <= 19) {
            //     this.skillDescribeTxt.width = this._rowWidth;
            //     this.skillDescribeTxt.x = this._rowX;
            // } else if (des.length <= 26) {
            //     this.skillDescribeTxt.width = 332;
            //     this.skillDescribeTxt.x = this._rowX + Math.floor((this._rowWidth - 332) / 2);
            // } else if (des.length <= 32) {
            //     this.skillDescribeTxt.width = 405;
            //     this.skillDescribeTxt.x = this._rowX + Math.floor((this._rowWidth - 405) / 2);
            // } else {
            //     this.skillDescribeTxt.width = this._rowWidth;
            //     this.skillDescribeTxt.x = this._rowX;
            // }
        }
    }
}