/** 快速使用*/


///<reference path="../common/common_util.ts"/>
///<reference path="../config/blend_cfg.ts"/>
namespace modules.quickUse {
    import ItemFields = Protocols.ItemFields;
    import ImmortalsModel = modules.immortals.ImmortalsModel;
    import WingModel = modules.wing.WingModel;
    import TianZhuModel = modules.tianZhu.TianZhuModel;
    import FashionModel = modules.fashion.FashionModel;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import ShenqiModel = modules.shenqi.ShenqiModel;

    export class QuickUseHuanHuaModel {
        private static _instance: QuickUseHuanHuaModel;
        public static get instance(): QuickUseHuanHuaModel {
            return this._instance = this._instance || new QuickUseHuanHuaModel();
        }
        constructor() {

        }
        /**
         * 筛选幻化
         */
        public screeningHuanHua(item: Protocols.Item): [boolean, number] {
            if (!item) {
                return [false, 0];
            }
            let itemId: number = item[ItemFields.ItemId];
            if (ImmortalsModel.instance.haveItem(itemId)) {
                return [true, appearance.shenBing];
            } else if (WingModel.instance.haveItem(itemId)) {
                return [true, appearance.xianiYi];
            }
            else if (TianZhuModel.instance.haveItem(itemId)) {
                return [true, appearance.tianZhu];
            }
            else if (FashionModel.instance.haveItem(itemId)) {
                return [true, appearance.shiZhuang];
            }
            else if (MagicPetModel.instance.haveItemHh(itemId)) {
                return [true, appearance.lingChong];
            }
            else if (MagicPetModel.instance.haveItem(itemId)) {
                return [true, appearance.lingChongFaZhen];
            }
            else if (MagicWeaponModel.instance.haveItemHh(itemId)) {
                return [true, appearance.xianQi];
            }
            else if (MagicWeaponModel.instance.haveItem(itemId)) {
                return [true, appearance.xianQiFaZhen];
            }
            else {
                return [false, 0];
            }
        }
        public useHandler(item: Protocols.Item): number {
            let shuju = this.screeningHuanHua(item);
            let WindowEnumstr = null;
            if (shuju[0]) {
                switch (shuju[1]) {
                    case appearance.shenBing:
                        return WindowEnum.IMMORTAL_HUANHUA_PANEL;
                    case appearance.xianiYi:
                        return WindowEnum.WING_HUANHUA_PANEL;
                    case appearance.shiZhuang:
                        return WindowEnum.FASHION_HUAN_HUA_PANEL;
                    case appearance.tianZhu:
                        return WindowEnum.TIAN_ZHU_HUAN_HUA_PANEL;
                    case appearance.lingChong:
                        return WindowEnum.PET_ILLUSION_PANEL;
                    case appearance.lingChongFaZhen:
                        return WindowEnum.MAGIC_PET_FAZHEN_PANEL;
                    case appearance.xianQi:
                        return WindowEnum.WEAPON_ILLUSION_PANEL;
                    case appearance.xianQiFaZhen:
                        return WindowEnum.MAGIC_WEAPON_FAZHEN_PANEL;
                    default:
                        return WindowEnumstr;
                }
            }
            else {
                return WindowEnumstr;
            }
        }
    }
}
