///<reference path="../config/ride_rank_cfg.ts"/>

/** 宠物进自动购买*/
namespace modules.magicPet {
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import Event = Laya.Event;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import CommonUtil = modules.common.CommonUtil;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import PetRankCfg = modules.config.PetRankCfg;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import rideRank = Configuration.rideRank;
    import RideRankCfg = modules.config.RideRankCfg;
    import rideRankFields = Configuration.rideRankFields;
    import MagicWeaponCtrl = modules.magicWeapon.MagicWeaponCtrl;
    import PetRankFields = Protocols.PetRankFields;
    import CustomClip = modules.common.CustomClip;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import BaseItem = modules.bag.BaseItem;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_materialFields = Configuration.item_materialFields;
    import GetWayCfg = modules.config.GetWayCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import StoreCfg = modules.config.StoreCfg;
    import StoreModel = modules.store.StoreModel;
    import erorr_codeFields = Configuration.erorr_codeFields;
    import ErrorCodeCfg = modules.config.ErrorCodeCfg;
    import PlayerModel = modules.player.PlayerModel;
    import runeRefine = Configuration.runeRefine;
    import Handler = laya.utils.Handler;
    export class MagicPetAutomaticPayAlert extends ui.AutomaticPayAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.qXBtn, Event.CLICK, this, this.qXBtnHandler);
            this.addAutoListener(this.toggleBtn, Event.CLICK, this, this.toggleBtnHandler);
        }
        protected removeListeners(): void {
            super.removeListeners();

        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.itemView.dataSource = value;
            let itemId = value[0];
            let itemCfg: item_material | item_equip | item_stone | runeRefine = CommonUtil.getItemCfgById(itemId);
            let isStone: boolean = CommonUtil.getItemTypeById(itemId) === ItemMType.Stone;
            let arr: Array<number> = <Array<number>>itemCfg[isStone ? item_stoneFields.itemSourceId : item_materialFields.itemSourceId];
            let mallCfg: Configuration.mall = StoreCfg.instance.getCfgByitemId(<number>itemCfg[isStone ? item_stoneFields.shortcutBuy : item_materialFields.shortcutBuy]);
            let moneyNum = mallCfg[Configuration.mallFields.realityPrice][1];
            this.moneyTxt.text = `${moneyNum}`;
        }
        private okBtnHandler(): void {
            this.cclose(true);
        }
        private qXBtnHandler(): void {
            this.cclose(false);
        }
        private toggleBtnHandler(): void {
            if (MagicPetModel.instance._bollTips) {
                MagicPetModel.instance._bollTips = false;
                this.toggleBtn.selected = false;
            }
            else {
                MagicPetModel.instance._bollTips = true;
                this.toggleBtn.selected = true;
            }
        }
        public cclose(bolll: boolean = false): void {
            super.close();
            MagicPetModel.instance._bollZiDong = bolll;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_ZIDONG);
        }
        public destroy(): void {
            super.destroy();
        }

    }
}