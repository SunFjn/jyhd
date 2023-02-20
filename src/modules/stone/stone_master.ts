///<reference path="../config/intensive_cfg.ts"/>
///<reference path="../intensive/intensive_model.ts"/>
///<reference path="../xi_lian/xi_lian_model.ts"/>
///<reference path="../xi_lian/xi_lian_ctrl.ts"/>
///<reference path="../config/xi_lian_rise_cfg.ts"/>


/**徽章大师-强化大师-强化神匠 弹框*/
namespace modules.stone {

    import StoneMasterUI = ui.StoneMasterUI;
    import StoneCfg = modules.config.StoneCfg;
    import gemRiseFields = Configuration.gemRiseFields;
    import Event = Laya.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CustomClip = modules.common.CustomClip;
    import IntensiveModel = modules.intensive.IntensiveModel;
    import IntensiveCfg = modules.config.IntensiveCfg;
    import strongRiseFields = Configuration.strongRiseFields;
    import Label = Laya.Label;
    import gemRise = Configuration.gemRise;
    import strongRise = Configuration.strongRise;
    //额外属性相关
    import xilian_rise = Configuration.xilian_rise;
    import xilian_riseFields = Configuration.xilian_riseFields;
    import XilianInfo = Protocols.XilianInfo;
    import XiLianModel = modules.xiLian.XiLianModel;
    import XilianInfoFields = Protocols.XilianInfoFields;
    import XiLianRiseCfg = modules.config.XiLianRiseCfg;
    import XiLianCtrl = modules.xiLian.XiLianCtrl;
    import attr = Configuration.attr;
    import AttrUtil = modules.common.AttrUtil;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;

    export class StoneMaster extends StoneMasterUI {

        private _btnClip: CustomClip;
        private _type: int;     // 0徽章 1强化大师 2强化神匠 3洗炼大师

        protected initialize(): void {
            super.initialize();

            this._btnClip = CommonUtil.creatEff(this.upGradeBtn, `btn_light`, 15);
            this._btnClip.pos(-9, -18);
            this._btnClip.scale(1.2,1.2)
        }

        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

            if (this._type === 0) {
                this.addAutoListener(GlobalData.dispatcher, CommonEventType.STONE_UPDATA, this, this.showView);
            } else if (this._type === 1 || this._type === 2) {
                this.addAutoListener(GlobalData.dispatcher, CommonEventType.INTENSIVE_UPDATE, this, this.showView);
            } else if (this._type === 3) {
                this.addAutoListener(GlobalData.dispatcher, CommonEventType.XI_LIAN_INFO_UPDATE, this, this.showView);
            }
            this.addAutoListener(this.upGradeBtn, Event.CLICK, this, this.upGrade);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._type = value;
            this.showView();
        }

        private setAttr(lv: int, cfg: gemRise | strongRise | xilian_rise, nextCfg: gemRise | strongRise | xilian_rise): void {
            this.attrTxt_1.visible = this.attrTxt_2.visible = this.attrTxt_3.visible = this.attrTxt_4.visible = false;
            this.onceTxt.visible = this.lastOnceTxt.visible = false;
            this.if0_act.visible = this.hintTxt.visible = false;
            if (lv == 0) {
                this.onceTxt.visible = true;
                this.introTxt_1.text = "当前阶段  ";
            } else if (!nextCfg) {
                this.lastOnceTxt.visible = true;
                this.introTxt_2.text = "下一阶段  ";
            }
            //显示新增的属性
            let attrIds: Array<number>;
            if (this._type === 0) {             // 徽章
                attrIds = [45, 46, 47, 48, 49, 50, 51, 52];
                if (cfg) this.setPerAttr(this.attrTxt_1, this.attrTxt_2, (cfg as gemRise)[gemRiseFields.attrs], attrIds);
                if (nextCfg) this.setPerAttr(this.attrTxt_3, this.attrTxt_4, (nextCfg as gemRise)[gemRiseFields.attrs], attrIds);
            } else if (this._type === 1 || this._type === 2) {      // 强化
                attrIds = [37, 38, 39, 40, 41, 42, 43, 44];
                if (cfg) this.setPerAttr(this.attrTxt_1, this.attrTxt_2, (cfg as strongRise)[strongRiseFields.attrs], attrIds);
                if (nextCfg) this.setPerAttr(this.attrTxt_3, this.attrTxt_4, (nextCfg as strongRise)[strongRiseFields.attrs], attrIds);
            } else if (this._type === 3) {              // 洗炼
                attrIds = [143, 144, 145, 146, 147, 148, 149, 150, 151];
                if (cfg) this.setPerAttr(this.attrTxt_1, this.attrTxt_2, (cfg as xilian_rise)[xilian_riseFields.attrs], attrIds);
                if (nextCfg) this.setPerAttr(this.attrTxt_3, this.attrTxt_4, (nextCfg as xilian_rise)[xilian_riseFields.attrs], attrIds);
            }
        }

        private setPerAttr(attrTxt1: Label, attrTxt2: Label, perAttr: Array<attr>, attrIds: Array<int>): void {
            if (perAttr) {
                let count: int = 0;
                for (let i: int = 0, len: int = attrIds.length; i < len; i++) {
                    let att: attr = AttrUtil.getAttrByType(attrIds[i], perAttr);
                    let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrIds[i]);
                    if (att) {
                        count++;
                        let txt: Label = count === 1 ? attrTxt1 : count === 2 ? attrTxt2 : null;
                        if (txt) {
                            let attrValue: number = att[attrFields.value];
                            txt.text = `${attrCfg[attr_itemFields.name]} +${attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue)}`;
                            txt.visible = true;
                        }
                        if (count === 2) break;
                    }
                }
            }
        }

        private showView(): void {
            let canUpgrade: boolean;
            let lv: int;
            let lastCfg: gemRise | strongRise | xilian_rise;
            let cfg: gemRise | strongRise | xilian_rise;
            let nextCfg: gemRise | strongRise | xilian_rise;
            let pro: number;
            let needPro: number;

            if (this._type === 0) {
                canUpgrade = StoneModel.instance.otherValue[1];
                lv = StoneModel.instance.otherValue[0];
                lastCfg = StoneCfg.instance.getUpStoneByLev(lv - 1);
                cfg = StoneCfg.instance.getUpStoneByLev(lv);
                nextCfg = StoneCfg.instance.getUpStoneByLev(lv + 1);
                if (lastCfg) this.introTxt_1.text = "当前阶段  镶嵌总等级达到" + lastCfg[gemRiseFields.refine_level] + "级";
                if (cfg) this.introTxt_2.text = "下一阶段  镶嵌总等级达到" + cfg[gemRiseFields.refine_level] + "级";
                pro = StoneModel.instance.otherValue[3];
                needPro = cfg[gemRiseFields.refine_level];
                this.titleTxt.text = "徽章镶嵌大师·" + lv + "阶";
                this.attValueTxt.value = Math.round(cfg[gemRiseFields.fighting]).toString();
            } else if (this._type === 1) {
                canUpgrade = IntensiveModel.instance.levState[0][1];
                lv = IntensiveModel.instance.levState[0][0];
                lastCfg = IntensiveCfg.instance.getCfgBy_DASHI_Lev(lv - 1);
                cfg = IntensiveCfg.instance.getCfgBy_DASHI_Lev(lv);
                nextCfg = IntensiveCfg.instance.getCfgBy_DASHI_Lev(lv + 1);
                if (lastCfg) this.introTxt_1.text = "当前阶段  8件装备强化+" + lastCfg[strongRiseFields.refineLevel];
                if (cfg) this.introTxt_2.text = "下一阶段  8件装备强化+" + cfg[strongRiseFields.refineLevel];
                pro = IntensiveModel.instance.getComProCount(cfg[strongRiseFields.refineLevel]);
                needPro = 8;
                this.titleTxt.text = "强化大师·" + lv + "阶";
                this.attValueTxt.value = Math.round(cfg[strongRiseFields.fighting]).toString();
            } else if (this._type === 2) {
                canUpgrade = IntensiveModel.instance.levState[1][1];
                lv = IntensiveModel.instance.levState[1][0];
                lastCfg = IntensiveCfg.instance.getCfgBy_SHENJIANG_Lev(lv - 1);
                cfg = IntensiveCfg.instance.getCfgBy_SHENJIANG_Lev(lv);
                nextCfg = IntensiveCfg.instance.getCfgBy_SHENJIANG_Lev(lv + 1);
                if (lastCfg) this.introTxt_1.text = "当前阶段  10件装备强化+" + lastCfg[strongRiseFields.refineLevel];
                if (cfg) this.introTxt_2.text = "下一阶段  10件装备强化+" + cfg[strongRiseFields.refineLevel];
                pro = IntensiveModel.instance.getComProCount(cfg[strongRiseFields.refineLevel]);
                needPro = 10;
                this.titleTxt.text = "强化神匠·" + lv + "阶";
                this.attValueTxt.value = Math.round(cfg[strongRiseFields.fighting]).toString();
            } else if (this._type === 3) {
                let info: XilianInfo = XiLianModel.instance.xiLianInfo;
                if (!info) return;
                canUpgrade = info[XilianInfoFields.xilianRisePoint];
                lv = info[XilianInfoFields.xilianRiseLevel];
                lastCfg = XiLianRiseCfg.instance.getCfgByLv(lv - 1);
                cfg = XiLianRiseCfg.instance.getCfgByLv(lv);
                nextCfg = XiLianRiseCfg.instance.getCfgByLv(lv + 1);
                let arr: Array<string> = ["白", "绿", "蓝", "紫", "橙", "红"];
                if (lastCfg) this.introTxt_1.text = "当前阶段  拥有" + lastCfg[xilian_riseFields.count] + "条" + arr[lastCfg[xilian_riseFields.color] - 1] + "品洗炼属性";
                if (cfg) this.introTxt_2.text = "下一阶段  拥有" + cfg[xilian_riseFields.count] + "条" + arr[cfg[xilian_riseFields.color] - 1] + "品洗炼属性";
                pro = XiLianModel.instance.getAttrCountByQuality(cfg[xilian_riseFields.color]);
                needPro = cfg[xilian_riseFields.count];
                this.titleTxt.text = "锻造大师·" + lv + "阶";
                this.attValueTxt.value = Math.round(cfg[xilian_riseFields.fighting]).toString();
            }

            this.blankImg.y = this.backImg.height = 562;
            this.maskImg.height = 274;
            this.upGradeBtn.visible = true;

            if (canUpgrade) { //可以升级
                this.upGradeBtn.gray = false;
                this._btnClip.visible = true;
                this._btnClip.play();
                this.ratioTxt.color = "#00ad35";
                //进度
                this.ratioTxt.text = `(${pro}/${needPro})`;
            } else { //不能升级 分为是否满级
                this.upGradeBtn.gray = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
                this.ratioTxt.color = "#ff0000";
                if (!nextCfg) {
                    this.upGradeBtn.visible = false;
                    this.blankImg.y = this.backImg.height = 450;
                    this.maskImg.height = 230;
                    this.ratioTxt.text = "";
                } else {
                    this.ratioTxt.text = `(${pro}/${needPro})`;
                }
            }

            this.setAttr(lv, cfg, nextCfg);
        }

        private upGrade(): void {
            if (this.upGradeBtn.gray) {
                // SystemNoticeManager.instance.addNotice("升级条件不满足", true);
                return;
            }
            if (this._type === 0) {
                Channel.instance.publish(UserFeatureOpcode.RiseGem, null);
            } else if (this._type === 1 || this._type === 2) {
                Channel.instance.publish(UserFeatureOpcode.RiseStrong, [this._type - 1]);
            } else if (this._type === 3) {
                XiLianCtrl.instance.xilianRiseAddLevel();
            }
        }
    }
}