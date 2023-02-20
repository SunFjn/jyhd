///<reference path="../config/wing_cfg.ts"/>

namespace modules.immortals {
    import BinghunIconUI = ui.BinghunIconUI;
    import RefineInfo = Protocols.RefineInfo;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import shenbing_refine = Configuration.shenbing_refine;
    import shenbing_refineFields = Configuration.shenbing_refineFields;
    import BagModel = modules.bag.BagModel;
    import wing_refine = Configuration.wing_refine;
    import WingCfg = modules.config.WingCfg;
    import wing_refineFields = Configuration.wing_refineFields;
    import PlayerModel = modules.player.PlayerModel;
    import FeedSkillType = ui.FeedSkillType;
    import fashion_refine = Configuration.fashion_refine;
    import tianzhu_refine = Configuration.tianzhu_refine;
    import FashionRefineCfg = modules.config.FashionRefineCfg;
    import fashion_refineFields = Configuration.fashion_refineFields;
    import TianZhuRefineCfg = modules.config.TianZhuRefineCfg;
    import tianzhu_refineFields = Configuration.tianzhu_refineFields;
    import TianZhuModel = modules.tianZhu.TianZhuModel;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import FashionModel = modules.fashion.FashionModel;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import guanghuan_refineFields = Configuration.guanghuan_refineFields;
    import UpdateGuangHuanInfoFields = Protocols.UpdateGuangHuanInfoFields;
    import WingModel = modules.wing.WingModel;
    import UpdateWingInfoFields = Protocols.UpdateWingInfoFields;
    import item_materialFields = Configuration.item_materialFields;
    import guanghuan_refine = Configuration.guanghuan_refine;

    export class BinghunItem extends BinghunIconUI {

        private _refineInfo: RefineInfo;
        private _index: int;
        private _type: int;
        private _textColor:string[]
        constructor() {
            super();
            this._textColor = ["#299AD9","#B738E1","#EF7C30","#FF2E2D"];
        }

        public setIndex(index: int) {
            this._index = index - 1;
            if (this._type === FeedSkillType.immortals) {
                //this.icon.skin = `immortal/btn_shengbing_${index}.png`;
                let cfg;
                if (!ImmortalsModel.instance.getFuhunListByType(this._index)) {  //未激活技能
                    cfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(this._index, 0);
                } else {
                    let _lev = ImmortalsModel.instance.getFuhunListByType(this._index)[RefineInfoFields.level];
                    cfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(this._index, _lev);
                }
                if (cfg) {
                    let items: Array<number> = cfg[shenbing_refineFields.items];
                    let itemId: int = items[Protocols.ItemFields.ItemId];
                    this.icon.skin = CommonUtil.getIconById(itemId);
                    let itemCfg = CommonUtil.getItemCfgById(itemId);
                    this.label_rt.text = itemCfg[item_materialFields.name].toString();
                    this.label_rt.color = this._textColor[this._index];
                }
            } else if (this._type === FeedSkillType.wing) {
                //this.icon.skin = `immortal/btn_shengbing_${index}.png`;
                let cfg;
                if (!WingModel.instance.getFuhunListByType(this._index)) {  //未激活技能
                    cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._index, 0);
                } else {
                    let _lev = WingModel.instance.getFuhunListByType(this._index)[RefineInfoFields.level];
                    cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._index, _lev);
                }
                if (cfg) {
                    let items: Array<number> = cfg[wing_refineFields.items];
                    let itemId: int = items[Protocols.ItemFields.ItemId];
                    this.icon.skin = CommonUtil.getIconById(itemId);
                    let itemCfg = CommonUtil.getItemCfgById(itemId);
                    this.label_rt.text = itemCfg[item_materialFields.name].toString();
                    this.label_rt.color = this._textColor[this._index];
                }
            } else if (this._type === FeedSkillType.fashion) {
                //this.icon.skin = `immortal/icon_sz_${index}.png`;
                let refineInfo: RefineInfo;
                let arr: Array<RefineInfo> = FashionModel.instance.fashionInfo[UpdateFashionInfoFields.refineList];
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    if (this._index === arr[i][RefineInfoFields.type]) {
                        refineInfo = arr[i];
                        break;
                    }
                }
                let lev = refineInfo ? refineInfo[RefineInfoFields.level] : 0;
                let cfg = FashionRefineCfg.instance.getCfgByTypeAndLv(this._index, lev);
                if (cfg) {
                    let items: Array<number> = cfg[fashion_refineFields.items];
                    let itemId: int = items[Protocols.ItemFields.ItemId];
                    this.icon.skin = CommonUtil.getIconById(itemId);
                    let itemCfg = CommonUtil.getItemCfgById(itemId);
                    this.label_rt.text = itemCfg[item_materialFields.name].toString();
                    this.label_rt.color = this._textColor[this._index];
                }
            } else if (this._type === FeedSkillType.tianZhu) {
                //this.icon.skin = `immortal/icon_tz_${index}.png`;
                let refineInfo: RefineInfo;
                let arr: Array<RefineInfo> = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.refineList];
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    if (this._index === arr[i][RefineInfoFields.type]) {
                        refineInfo = arr[i];
                        break;
                    }
                }
                let lev = refineInfo ? refineInfo[RefineInfoFields.level] : 0;
                let cfg = TianZhuRefineCfg.instance.getCfgByTypeAndLv(this._index, lev);
                if (cfg) {
                    let items: Array<number> = cfg[tianzhu_refineFields.items];
                    let itemId: int = items[Protocols.ItemFields.ItemId];
                    this.icon.skin = CommonUtil.getIconById(itemId);
                    let itemCfg = CommonUtil.getItemCfgById(itemId);
                    this.label_rt.text = itemCfg[item_materialFields.name].toString();
                    this.label_rt.color = this._textColor[this._index];
                }
            }else if (this._type === FeedSkillType.guangHuan) {
                //this.icon.skin = `immortal/icon_sz_${index}.png`;
                let refineInfo: RefineInfo;
                let arr: Array<RefineInfo> = modules.guanghuan.GuangHuanModel.instance.guangHuanInfo[UpdateGuangHuanInfoFields.refineList];
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    if (this._index === arr[i][RefineInfoFields.type]) {
                        refineInfo = arr[i];
                        break;
                    }
                }
                let lev = refineInfo ? refineInfo[RefineInfoFields.level] : 0;
                let cfg = modules.config.GuangHuanRefineCfg.instance.getCfgByTypeAndLv(this._index, lev);
                if (cfg) {
                    let items: Array<number> = cfg[guanghuan_refineFields.items];
                    let itemId: int = items[Protocols.ItemFields.ItemId];
                    this.icon.skin = CommonUtil.getIconById(itemId);
                    let itemCfg = CommonUtil.getItemCfgById(itemId);
                    this.label_rt.text = itemCfg[item_materialFields.name].toString();
                    this.label_rt.color = this._textColor[this._index];
                }
            } 
            this.bg.skin = `immortal/icon_bg_${index}.png`;
        }

        public setType(type: int): void {
            this._type = type;
        }

        public set refineInfo(value: RefineInfo) {

            this._refineInfo = value;
            let cfg: shenbing_refine | wing_refine | fashion_refine | tianzhu_refine | guanghuan_refine;
            let nextCfg: shenbing_refine | wing_refine | fashion_refine | tianzhu_refine | guanghuan_refine;

            let lv: number = this._refineInfo ? this._refineInfo[RefineInfoFields.level] : 0;
            let maxLv: number;
            let itemsIndex: number;
            let lvIndex: number;
            if (this._type === FeedSkillType.immortals) {
                maxLv = ImmortalsCfg.instance.getMaxFuhunLvByTypeAndLev(this._index, lv);
                cfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(this._index, lv);
                nextCfg = ImmortalsCfg.instance.getFuhunCfgByTypeAndLev(this._index, lv + 1);
                itemsIndex = shenbing_refineFields.items;
                lvIndex = shenbing_refineFields.humanLevel;
            } else if (this._type === FeedSkillType.wing) {
                maxLv = WingCfg.instance.getMaxFuhunLvByTypeAndLev(this._index, lv);
                cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._index, lv);
                nextCfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._index, lv + 1);
                itemsIndex = wing_refineFields.items;
                lvIndex = wing_refineFields.humanLevel;
            } else if (this._type === FeedSkillType.fashion) {
                maxLv = FashionRefineCfg.instance.getMaxFuhunLvByTypeAndLev(this._index, lv);
                cfg = FashionRefineCfg.instance.getCfgByTypeAndLv(this._index, lv);
                nextCfg = FashionRefineCfg.instance.getCfgByTypeAndLv(this._index, lv + 1);
                itemsIndex = fashion_refineFields.items;
                lvIndex = fashion_refineFields.humanLevel;
            } else if (this._type === FeedSkillType.tianZhu) {
                maxLv = TianZhuRefineCfg.instance.getMaxFuhunLvByTypeAndLev(this._index, lv);
                cfg = TianZhuRefineCfg.instance.getCfgByTypeAndLv(this._index, lv);
                nextCfg = TianZhuRefineCfg.instance.getCfgByTypeAndLv(this._index, lv + 1);
                itemsIndex = tianzhu_refineFields.items;
                lvIndex = tianzhu_refineFields.humanLevel;
            }else if (this._type === FeedSkillType.guangHuan) {
                maxLv = modules.config.GuangHuanRefineCfg.instance.getMaxFuhunLvByTypeAndLev(this._index, lv);
                cfg = modules.config.GuangHuanRefineCfg.instance.getCfgByTypeAndLv(this._index, lv);
                nextCfg = modules.config.GuangHuanRefineCfg.instance.getCfgByTypeAndLv(this._index, lv + 1);
                itemsIndex = guanghuan_refineFields.items;
                lvIndex = guanghuan_refineFields.humanLevel;
            }
            this.ratioTxt.text = `${lv}/${maxLv}`;

            let itemId: int = (<Array<number>>cfg[itemsIndex])[0];
            let count: int = (<Array<number>>cfg[itemsIndex])[1];

            //人物等级足够
            let b: boolean = cfg[lvIndex] <= PlayerModel.instance.level;

            if (nextCfg)
                this.dotImg.visible = (BagModel.instance.getItemCountById(itemId) >= count) && b;
            else
                this.dotImg.visible = false;
        }
    }
}