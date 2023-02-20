///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../config/first_pay_cfg.ts"/>
///<reference path="../config/pet_fazhen_cfg.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
///<reference path="../config/fashion_magic_show_cfg.ts"/>
///<reference path="../config/tian_zhu_magic_show_cfg.ts"/>
/// <reference path="../config/shenqi_cfg.ts" />
/// <reference path="../shenqi/shenqi_model.ts" />
namespace modules.commonAlert {
    import CustomClip = modules.common.CustomClip;
    //法阵相关
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import rideMagicShowFields = Configuration.rideMagicShowFields;
    import rideRankFields = Configuration.rideRankFields;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import petRankFields = Configuration.petRankFields;
    import pet_fazhenFields = Configuration.pet_fazhenFields;
    import ExteriorActiveAlertUI = ui.ExteriorActiveAlertUI;
    import fashion_magicShowFields = Configuration.fashion_magicShowFields;
    import tianzhu_magicShowFields = Configuration.tianzhu_magicShowFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class CommonActiveAlert extends ExteriorActiveAlertUI {

        private _effect: CustomClip;      //特效
        // private _modelClip: AvatarClip;    //模型
        private _skeletonClip: SkeletonAvatar;
        // private _tweenJS: TweenJS;
        public destroy(): void {
            this._effect = this.destroyElement(this._effect);
            // this._modelClip = this.destroyElement(this._modelClip);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            // if(this._tweenJS){
            //     this._tweenJS.stop();
            //     this._tweenJS = null;
            // }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._effect = CommonUtil.creatEff(null, `ok_state`, 7);
            this.addChildAt(this._effect, 1);
            this._effect.scale(2.5, 2.5);
            this._effect.y = 100;
            this._effect.centerX = 0;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.y = 500;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.y = 500;
            this._skeletonClip.centerX = 0;

            this.clickCD = true;

            // this._tweenJS = TweenJS.create(this._modelClip).yoyo(true).repeat(99999999);
        }

        public close(): void {
            super.close();
            // this._tweenJS && this._tweenJS.stop();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            let showId = value;

            let exteriorCfg = ExteriorSKCfg.instance.getCfgById(showId);
            let name = exteriorCfg[ExteriorSKFields.name];
            this.nameTXt.text = name;
            // this._modelClip.avatarScale = ExteriorSKCfg[ExteriorSKFields.scale] ? ExteriorSKCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = ExteriorSKCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = ExteriorSKCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarY = ExteriorSKCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = ExteriorSKCfg[ExteriorSKFields.deviationX];
            let typeNum = showId / 1000 >> 0;
            if (typeNum == 9 || typeNum == 10 || typeNum == 2) {
                //this._modelClip.reset(0, 0, 0, 0, showId);
                this._skeletonClip.reset(showId);
                this._effect.stop();
                this._effect.visible = false;
            } else if (typeNum == 11) {
                this._skeletonClip.reset(0, 0, 0, 0, 0, showId);
            } else {
                this._effect.play();
                this._effect.visible = true;
                // this._modelClip.reset(showId);
                this._skeletonClip.reset(showId);
            }


            this.tipTxt.visible = true;
            this.closeBtn.visible = false;
            this.closeOnSide = true;
            this.height = 714;

            // this._tweenJS.stop();
            //this._modelClip.y = 500;
            this._skeletonClip.y = 500;

            let cfg: any;
            if (cfg = config.ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(showId, 1)) { //幻武
                this.atkValueMsz.value = cfg[shenbing_magicShowFields.fighting].toString();
                // this._tweenJS.to({y: this._modelClip.y - 20}, 1000).start();
            } else if (cfg = config.WingCfg.instance.getHuanhuaCfgByIdAndLv(showId, 1)) {  //翅膀
                this.atkValueMsz.value = cfg[wing_magicShowFields.fighting].toString();
            } else if (cfg = config.RideMagicShowCfg.instance.getCfgByIdAndLv(showId, 1)) {//精灵 幻化
                this.atkValueMsz.value = (cfg[rideMagicShowFields.fighting]).toString();
            } else if (cfg = config.PetMagicShowCfg.instance.getCfgByIdAndLv(showId, 1)) { //宠物幻化
                this.atkValueMsz.value = (cfg[petMagicShowFields.fighting]).toString();
            } else if (config.RideRankCfg.instance.getActivateCfgByShowId(showId)) { //精灵 进阶
                this.atkValueMsz.value = config.RideRankCfg.instance.cfgs[0][rideRankFields.fighting].toString();
            } else if (config.PetRankCfg.instance.getActivateCfgByShowId(showId)) { //宠物 进阶
                this.atkValueMsz.value = config.PetRankCfg.instance.cfgs[0][petRankFields.fighting].toString();
            } else if (cfg = config.PetFazhenCfg.instance.getHuanhuaCfgByIdAndLev(showId, 1)) { //宠物 法阵
                this.atkValueMsz.value = cfg[pet_fazhenFields.fighting].toString();
                // this._tweenJS.to({y: this._modelClip.y - 20}, 1000).start();
            } else if (cfg = config.RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(showId, 1)) { //精灵 法阵
                this.atkValueMsz.value = cfg[pet_fazhenFields.fighting].toString();
                // this._tweenJS.to({y: this._modelClip.y - 20}, 1000).start();
            } else if (cfg = config.FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, 1)) { //时装幻化
                this.atkValueMsz.value = cfg[fashion_magicShowFields.fighting].toString();
            } else if (cfg = config.TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, 1)) { //神兽幻化
                this.atkValueMsz.value = cfg[tianzhu_magicShowFields.fighting].toString();
                // this._modelClip.setActionType(ActionType.SHOW);
                // this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW);
            }
            this._skeletonClip.zOrder = this._effect.zOrder + 1;
        }
    }
}