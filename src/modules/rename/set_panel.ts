/** 重命名弹框*/

///<reference path="set_ctrl.ts"/>
///<reference path="../../game/game_center.ts"/>
namespace modules.rename {
    import LayaEvent = modules.common.LayaEvent;
    import SetViewUI = ui.SetViewUI;
    import SetName = modules.rename.SetName;
    import GameCenter = game.GameCenter;
    export class SetPanel extends SetViewUI {
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.gszlBtn, LayaEvent.CLICK, this, this.gszlBtnHandler);
            this.addAutoListener(this.cwBtn, LayaEvent.CLICK, this, this.cwBtnHandler);
            this.addAutoListener(this.cbBtn, LayaEvent.CLICK, this, this.cbBtnHandler);
            this.addAutoListener(this.jlBtn, LayaEvent.CLICK, this, this.jlBtnHandler);
            this.addAutoListener(this.rwjntxBtn, LayaEvent.CLICK, this, this.rwjntxBtnHandler);
            this.addAutoListener(this.cwjltxBtn, LayaEvent.CLICK, this, this.cwjltxBtnHandler);
            this.addAutoListener(this.bossjltxBtn, LayaEvent.CLICK, this, this.bossjltxBtnHandler);
            this.addAutoListener(this.sywxBtn, LayaEvent.CLICK, this, this.sywxBtnHandler);
            this.addAutoListener(this.sytxBtn, LayaEvent.CLICK, this, this.sytxBtnHandler);
            this.addAutoListener(this.vioceBtn, LayaEvent.CLICK, this, this.vioceBtnHandler);
            this.addAutoListener(this.soundBtn, LayaEvent.CLICK, this, this.soundBtnHandler);
            this.addAutoListener(this.ghBtn, LayaEvent.CLICK, this, this.ghBtnHandler);
        }

        onOpened(): void {
            super.onOpened();
            this.updateBtnsTag();
            this.updateBtnsSkin();
        }

        //更新按钮状态
        private updateBtnsTag() {
            this.gszlBtn.tag = !SetCtrl.instance.isHideSelfGSZL;
            this.cwBtn.tag = !SetCtrl.instance.isHideSelfPet;
            this.cbBtn.tag = !SetCtrl.instance.isHideSelfWing;
            this.jlBtn.tag = !SetCtrl.instance.isHideSelfSpirit;
            this.rwjntxBtn.tag = !SetCtrl.instance.isHideSelfSkillEffect;
            this.cwjltxBtn.tag = !SetCtrl.instance.isHideSelfPetSkillEffect;
            this.bossjltxBtn.tag = !SetCtrl.instance.isHideBossSkillEffect;
            this.sywxBtn.tag = !SetCtrl.instance.isHideOtherPalyerAllExtents;
            this.sytxBtn.tag = !SetCtrl.instance.isHideOtherPalyerAllEffects;
            this.ghBtn.tag = !SetCtrl.instance.isHideSelfGuangHuan;
            this.vioceBtn.tag = modules.sound.SoundCtrl.instance.bgMusicEnabled;
            this.soundBtn.tag = modules.sound.SoundCtrl.instance.soundEnabled;
        }

        private updateBtnsSkin() {
            this.gszlBtn.skin = this.gszlBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.cwBtn.skin = this.cwBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.cbBtn.skin = this.cbBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.jlBtn.skin = this.jlBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.rwjntxBtn.skin = this.rwjntxBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.cwjltxBtn.skin = this.cwjltxBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.bossjltxBtn.skin = this.bossjltxBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.sywxBtn.skin = this.sywxBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.sytxBtn.skin = this.sytxBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.ghBtn.skin = this.ghBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.vioceBtn.skin = this.vioceBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
            this.soundBtn.skin = this.soundBtn.tag ? "head/btn_select.png" : "head/btn_unselect.png";
        }

        //鬼神之力
        private gszlBtnHandler() {
            this.gszlBtn.tag = !this.gszlBtn.tag;
            let value = this.gszlBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfGSZL, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
        }

        //翅膀
        private cbBtnHandler() {
            this.cbBtn.tag = !this.cbBtn.tag;
            let value = this.cbBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfWing, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
        }

        //宠物
        private cwBtnHandler() {
            this.cwBtn.tag = !this.cwBtn.tag;
            let value = this.cwBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfPet, value.toString());

            this.cwjltxBtn.tag = this.cwBtn.tag;
            value = this.cwjltxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfPetSkillEffect, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
            GameCenter.instance.updateSetRolePetComponent();
        }

        //精灵
        private jlBtnHandler() {
            this.jlBtn.tag = !this.jlBtn.tag;
            let value = this.jlBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfSpirit, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
        }

        //光环
        private ghBtnHandler() {
            this.ghBtn.tag = !this.ghBtn.tag;
            let value = this.ghBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfGuangHuan, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
        }


        //人物技能特效
        private rwjntxBtnHandler() {
            this.rwjntxBtn.tag = !this.rwjntxBtn.tag;
            let value = this.rwjntxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfSkillEffect, value.toString());
            this.updateBtnsSkin();
        }

        //宠物技能特效
        private cwjltxBtnHandler() {
            this.cwjltxBtn.tag = !this.cwjltxBtn.tag;
            let value = this.cwjltxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideSelfPetSkillEffect, value.toString());
            if (this.cwjltxBtn.tag) {
                this.cwBtn.tag = this.cwjltxBtn.tag;
                let value = this.cwBtn.tag ? 0 : 1;
                CommonUtil.localStorageSetItem(SetName.isHideSelfPet, value.toString());
            }
            this.updateBtnsSkin();
            GameCenter.instance.updateSetRolePetComponent();
        }

        //boss技能特效
        private bossjltxBtnHandler() {
            this.bossjltxBtn.tag = !this.bossjltxBtn.tag;
            let value = this.bossjltxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideBossSkillEffect, value.toString());
            this.updateBtnsSkin();
        }

        //所有外显
        private sywxBtnHandler() {
            this.sywxBtn.tag = !this.sywxBtn.tag;
            let value = this.sywxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideOtherPalyerAllExtents, value.toString());

            this.sytxBtn.tag = this.sywxBtn.tag;
            value = this.sytxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideOtherPalyerAllEffects, value.toString());
            GameCenter.instance.world.publish("updateSet");
            this.updateBtnsSkin();
            GameCenter.instance.updateSetRolePetComponent();
        }

        //所有特效
        private sytxBtnHandler() {
            this.sytxBtn.tag = !this.sytxBtn.tag;
            let value = this.sytxBtn.tag ? 0 : 1;
            CommonUtil.localStorageSetItem(SetName.isHideOtherPalyerAllEffects, value.toString());

            if (this.sytxBtn.tag) {
                this.sywxBtn.tag = this.sytxBtn.tag;
                let value = this.sywxBtn.tag ? 0 : 1;
                CommonUtil.localStorageSetItem(SetName.isHideOtherPalyerAllExtents, value.toString());
            }
            this.updateBtnsSkin();
            GameCenter.instance.updateSetRolePetComponent();
        }

        //声音
        private vioceBtnHandler() {
            modules.sound.SoundCtrl.instance.bgMusicEnabled = !modules.sound.SoundCtrl.instance.bgMusicEnabled;
            this.vioceBtn.tag = modules.sound.SoundCtrl.instance.bgMusicEnabled;
            this.updateBtnsSkin();
        }

        //音效
        private soundBtnHandler() {
            modules.sound.SoundCtrl.instance.soundEnabled = !modules.sound.SoundCtrl.instance.soundEnabled;
            this.soundBtn.tag = modules.sound.SoundCtrl.instance.soundEnabled;
            this.updateBtnsSkin();
        }

    }
}