///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../config/first_pay_cfg.ts"/>
///<reference path="../config/pet_fazhen_cfg.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
///<reference path="../config/fashion_magic_show_cfg.ts"/>
///<reference path="../config/tian_zhu_magic_show_cfg.ts"/>
/// <reference path="../config/shenqi_cfg.ts" />
/// <reference path="../shenqi/shenqi_model.ts" />
///<reference path="../config/guanghuan_magic_show_cfg.ts"/>



namespace modules.commonAlert {
    import CustomClip = modules.common.CustomClip;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_magicShow = Configuration.shenbing_magicShow;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import wing_magicShow = Configuration.wing_magicShow;
    import WingCfg = modules.config.WingCfg;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import RideMagicShowCfg = modules.config.RideMagicShowCfg;
    import rideMagicShow = Configuration.rideMagicShow;
    import rideMagicShowFields = Configuration.rideMagicShowFields;
    import petMagicShow = Configuration.petMagicShow;
    import PetMagicShowCfg = modules.config.PetMagicShowCfg;
    import RideRankCfg = modules.config.RideRankCfg;
    import rideRank = Configuration.rideRank;
    import rideRankFields = Configuration.rideRankFields;
    import petRank = Configuration.petRank;
    import PetRankCfg = modules.config.PetRankCfg;
    import FirstPayCfg = modules.config.FirstPayCfg;
    import first_pay = Configuration.first_pay;
    import first_payFields = Configuration.first_payFields;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import petRankFields = Configuration.petRankFields;
    import pet_fazhen = Configuration.pet_fazhen;
    import pet_fazhenFields = Configuration.pet_fazhenFields;
    import PetFazhenCfg = modules.config.PetFazhenCfg;
    import RideFazhenCfg = modules.config.RideFazhenCfg;
    import ExteriorActiveAlertUI = ui.ExteriorActiveAlertUI;
    import fashion_magicShow = Configuration.fashion_magicShow;
    import FashionMagicShowCfg = modules.config.FashionMagicShowCfg;
    import fashion_magicShowFields = Configuration.fashion_magicShowFields;
    import guanghuan_magicShow = Configuration.guanghuan_magicShow;
    import GuangHuanMagicShowCfg = modules.config.GuangHuanMagicShowCfg;
    import guanghuan_magicShowFields = Configuration.guanghuan_magicShowFields;
    import tianzhu_magicShow = Configuration.tianzhu_magicShow;
    import TianZhuMagicShowCfg = modules.config.TianZhuMagicShowCfg;
    import tianzhu_magicShowFields = Configuration.tianzhu_magicShowFields;
    import ShenqiCfg = modules.config.ShenqiCfg;
    import shenqiFields = Configuration.shenqiFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;

    export class ExteriorActiveAlert extends ExteriorActiveAlertUI {

        private _effect: CustomClip;      //特效
        private _skeletonClip: SkeletonAvatar;
        private _type: number;
        public destroy(): void {
            this._effect = this.destroyElement(this._effect);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._effect = new CustomClip();
            this.addChildAt(this._effect, 1);
            this._effect.scale(2.5, 2.5);
            this._effect.skin = "assets/effect/ok_state.atlas";
            this._effect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._effect.durationFrame = 5;
            this._effect.play();
            this._effect.loop = true;
            this._effect.y = 100;
            this._effect.centerX = 0;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 500);

            this.clickCD = true;
        }

        public close(): void {
            super.close();
            if (this._type == 11) {
                GlobalData.dispatcher.event(CommonEventType.SHENQI_JIHUO);
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.titleImage.skin = "immortal/txt_common_hdxwg.png";
            // 外观id
            let id = value[0];
            let type = value[1];
            this._type = type;

            let exteriorSkCfg = ExteriorSKCfg.instance.getCfgById(id);
            let name = exteriorSkCfg[ExteriorSKFields.name];
            this.nameTXt.text = name;
            let typeNum = id / 1000 >> 0;
            // 精灵造物 宠物装备
            if (typeNum == 9 || typeNum == 10) {
                this._skeletonClip.reset(0, 0, 0, 0, id);
                this._effect.visible = false;
                this._skeletonClip.y = 500;
            }
            // 鬼神之力
            else if (typeNum == 11) {
                this._skeletonClip.reset(0, 0, 0, 0, 0, id);
                this._effect.visible = false;
                this._skeletonClip.y = 610;

            }
            // 光环
            else if (typeNum == 11) {
                this._skeletonClip.reset(0, 0, 0, 0, 0, 0, id);
                this._effect.visible = false;
                this._skeletonClip.y = 610;

            }
            // 时装 其他啥的都在这
            else {
                this._effect.visible = true;
                this._skeletonClip.reset(id);
                this._skeletonClip.y = 500;
            }
            this.tipTxt.visible = true;
            this.closeBtn.visible = false;
            this.closeOnSide = true;
            this.height = 714;

            if (type == -1) {                   //首充激活弹框
                this.closeOnSide = false;
                this.tipTxt.visible = false;
                this.closeBtn.visible = true;
                this.height = 850;
                let cfg: first_pay = FirstPayCfg.instance.getCfgByShiftAndDay(6, 1);
                this.atkValueMsz.value = cfg[first_payFields.fighting].toString();
            } else if (type == 1) {             //幻武
                let cfg: shenbing_magicShow = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(id, 1);
                this.atkValueMsz.value = cfg[shenbing_magicShowFields.fighting].toString();
            } else if (type == 2) {             //翅膀
                this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1.2)
                let cfg: wing_magicShow = WingCfg.instance.getHuanhuaCfgByIdAndLv(id, 1);
                this._skeletonClip.y = 600;
                this.atkValueMsz.value = cfg[wing_magicShowFields.fighting].toString();
            } else if (type == 3) {             //精灵 幻化
                let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(id, 1);
                this.atkValueMsz.value = cfg[rideMagicShowFields.fighting].toString();
            } else if (type == 4) {             //宠物 幻化
                let cfg: petMagicShow = PetMagicShowCfg.instance.getCfgByIdAndLv(id, 1);
                this.atkValueMsz.value = cfg[petMagicShowFields.fighting].toString();
            } else if (type == 5) {             //精灵 进阶
                let cfg: rideRank = RideRankCfg.instance.getActivateCfgByShowId(id);
                this.atkValueMsz.value = cfg[rideRankFields.fighting].toString();
            } else if (type == 6) {             //宠物 进阶
                let cfg: petRank = PetRankCfg.instance.getActivateCfgByShowId(id);
                this.atkValueMsz.value = cfg[petRankFields.fighting].toString();
            } else if (type == 7) {             //宠物 法阵
                let cfg: pet_fazhen = PetFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, 1);
                this.atkValueMsz.value = cfg[pet_fazhenFields.fighting].toString();
            } else if (type == 8) {             //精灵 法阵
                let cfg: pet_fazhen = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(id, 1);
                this.atkValueMsz.value = cfg[pet_fazhenFields.fighting].toString();
            } else if (type === 9) {            // 时装幻化
                this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.75)
                let cfg: fashion_magicShow = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(id - PlayerModel.instance.occ, 1);
                this.atkValueMsz.value = cfg[fashion_magicShowFields.fighting].toString();
            } else if (type === 10) {           // 神兽幻化
                let cfg: tianzhu_magicShow = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(id, 1);
                this.atkValueMsz.value = cfg[tianzhu_magicShowFields.fighting].toString();
            } else if (type === 11) {           //神器激活
                this.atkValueMsz.value = SkillCfg.instance.getCfgById(ShenqiCfg.instance.getCfgByShowId(id)[shenqiFields.skillId])[skillFields.fight].toString();
                this.titleImage.skin = "immortal/txt_common_jhsq.png";
                this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.5)
            }else if (type === 12) {           //光环
                this._skeletonClip.resetScale(AvatarAniBigType.guangHuan, 0.5)
                let cfg: guanghuan_magicShow = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(id, 1);
                this.atkValueMsz.value = cfg[guanghuan_magicShowFields.fighting].toString();
            }
            this._skeletonClip.zOrder = this._effect.zOrder + 1

            this._skeletonClip.defaultPlayAnim = ActionType.DAIJI;
        }
    }
}