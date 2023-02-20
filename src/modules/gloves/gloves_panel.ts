///<reference path="../config/gauntlet_cfg.ts"/>

/** 辅助装备*/


namespace modules.gloves {
    import Button = Laya.Button;
    import LayaEvent = modules.common.LayaEvent;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GlovesViewUI = ui.GlovesViewUI;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import PairFields = Protocols.PairFields;
    import gauntlet = Configuration.gauntlet;
    import GauntletCfg = modules.config.GauntletCfg;
    import gauntletFields = Configuration.gauntletFields;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import skill = Configuration.skill;
    import ItemsFields = Configuration.ItemsFields;
    import BagModel = modules.bag.BagModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomClip = modules.common.CustomClip;

    export class GlovesPanel extends GlovesViewUI {
        private _stoneGrids: Array<Laya.Image>;
        private _stoneIcons: Array<Laya.Image>;
        // private _stones: Array<Laya.Image>;
        public inlayBtn: Button;
        private _selectedIndex: int;
        private _attrNames: Array<Laya.Text>;
        private _attrValues: Array<Laya.Text>;
        private _matEnough: boolean;
        private _selectedStoneId: number;
        private _stoneSkillDescs: Array<string>;
        private _rps: Array<Laya.Image>;

        private _btnClip: CustomClip;
        private _matId: number;
        private _matCount: number;
        private _isMaxLv: boolean;

        private prizeEffect: CustomClip;      //装备光效

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._stoneGrids = [this.stoneGrid1, this.stoneGrid2, this.stoneGrid3, this.stoneGrid4, this.stoneGrid5, this.stoneGrid6];
            this._stoneIcons = [this.stoneIcon1, this.stoneIcon2, this.stoneIcon3, this.stoneIcon4, this.stoneIcon5, this.stoneIcon6];
            // this._stones = [this.stone1, this.stone2, this.stone3, this.stone4, this.stone5, this.stone6];
            this._attrNames = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._attrValues = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._rps = [this.rp1, this.rp2, this.rp3, this.rp4, this.rp5, this.rp6];

            this.skillDescTxt.color = "#FFFFFF";
            this.skillDescTxt.style.fontSize = this.stoneSkillDescTxt.style.fontSize = this.stoneRateTxt.style.fontSize = 24;
            this.skillDescTxt.style.fontFamily = this.stoneSkillDescTxt.style.fontFamily = this.stoneRateTxt.style.fontFamily = "SimHei";
            this.skillDescTxt.style.wordWrap = this.stoneSkillDescTxt.style.wordWrap = this.stoneRateTxt.style.wordWrap = true;
            this.stoneSkillDescTxt.color = this.stoneRateTxt.color = "#FFD2BF";

            this._stoneSkillDescs = [`它有着强大的精神力量，可通过心灵攻击摧毁BOSS的神识，持有者BOSS增伤<span color="#50ff28">+X%</span>`,
                `无论久远的过去，还是遥远的未来，持有者可操纵时间和因果，战斗中PVP减伤<span color="#50ff28">+X%</span>`,
                `能够窃取、侵入、操纵敌人魂魄，持有者更可凝练自身神魂，战斗中PVP增伤<span color="#50ff28">+X%</span>`,
                `破碎虚空，穿梭三界，一瞬千里，持有者拥有极快的身法，战斗中暴击减伤<span color="#50ff28">+X%</span>`,
                `拥有无可匹敌的法力，持有者力之所及可移山填海，战斗中暴击增伤<span color="#50ff28">+X%</span>`,
                `法眼无双，看破一切虚妄迷途，持有者可瞬间找到对方破绽，战斗中真实伤害<span color="#50ff28">+X</span>`];

            this._btnClip = CommonUtil.creatEff(this, `btn_light`, 15);
            this._btnClip.pos(this.inlayBtn.x - 5, this.inlayBtn.y - 18, true);
            this._btnClip.scaleY = 1.2;
            this._btnClip.visible = true;

            this.prizeEffect = new CustomClip();
            this.addChildAt(this.prizeEffect, 2);
            this.prizeEffect.scale(2, 2);
            this.prizeEffect.skin = "assets/effect/scbaoxiang.atlas";
            let arr1 = [];
            for (let i: int = 0; i < 12; i++) {
                arr1[i] = `scbaoxiang/${i}.png`;
            }

            this.prizeEffect.frameUrls = arr1;
            this.prizeEffect.durationFrame = 5;
            this.prizeEffect.loop = true;
            this.prizeEffect.zOrder = 10;
            this.prizeEffect.anchorX = 0.5;
            this.prizeEffect.anchorY = 0.5;
            this.prizeEffect.pos(300, 300);
            this.prizeEffect.scale(3, 3);

        }

        protected addListeners(): void {
            super.addListeners();
            for (let i: int = 0, len: int = this._stoneGrids.length; i < len; i++) {
                this.addAutoListener(this._stoneGrids[i], LayaEvent.CLICK, this, this.stoneClickHandler, [i]);
            }
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(this.inlayBtn, LayaEvent.CLICK, this, this.inlayHandler);
            this.addAutoListener(this, LayaEvent.CLICK, this, this.clickHandler);
            this.addAutoListener(this.attrImg, LayaEvent.CLICK, this, this.attrClickHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateInfo);
        }

        onOpened(): void {
            super.onOpened();
            this._matEnough = false;
            this._selectedIndex = -2;
            this.prizeEffect.play();
            this.selectedImg.visible = false;
            this._matId = this._matCount = 0;
            this._isMaxLv = false;
            this.selectStone(-1);

            this.effectRo.play(0, true);
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.stop();
            this.effectRo.stop();
        }

        // 点徽章
        private stoneClickHandler(index: int, e: Laya.Event): void {
            e.stopPropagation();
            this.selectStone(index);
        }

        private updateInfo(): void {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            if (!info) return;
            let t: Array<Protocols.Pair> = info[GetGauntletReplyFields.jewels];
            let arr: Array<number> = new Array<number>();
            for (let i: int = 0, len: int = t.length; i < len; i++) {
                arr[t[i][PairFields.first] - 1] = t[i][PairFields.second];
            }
            let per: number = 1;
            let fight: number = 0;
            for (let i: int = 0, len: int = this._stoneIcons.length; i < len; i++) {
                let cfg: gauntlet;
                if (!arr[i]) arr[i] = (i + 1) * 1000;
                if (arr[i] % 1000 === 0) {
                    this._stoneIcons[i].skin = "gloves/btn_wxst_add.png";
                    // this._stones[i].visible = false;
                    cfg = GauntletCfg.instance.getCfgById(arr[i] + 1);
                } else {
                    this._stoneIcons[i].skin = CommonUtil.getIconById(GauntletCfg.instance.getCfgById(arr[i])[gauntletFields.material][0][ItemsFields.itemId]);
                    cfg = GauntletCfg.instance.getCfgById(arr[i]);
                    per += cfg[gauntletFields.attrs][1][attrFields.value];
                    fight += cfg[gauntletFields.fight];
                    // this._stones[i].visible = false;// this._stones[i].visible = true;
                }
                let matId: number = cfg[gauntletFields.material][0][ItemsFields.itemId];
                let matCount: number = cfg[gauntletFields.material][0][ItemsFields.count];
                this._rps[i].visible = GauntletCfg.instance.getCfgById(cfg[gauntletFields.id] + 1) && BagModel.instance.getItemCountById(matId) >= matCount;
            }
            // 总属性
            let glovesCfg: gauntlet = GauntletCfg.instance.getCfgById(0);
            let attrs: Array<attr> = glovesCfg[gauntletFields.attrs];
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let cfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                this._attrNames[i].text = `${cfg[attr_itemFields.name]}:`;
                this._attrValues[i].text = `+${Math.floor(attrs[i][attrFields.value] * per)}`;
            }

            let cfg: skill = SkillCfg.instance.getCfgById(BlendCfg.instance.getCfgById(51101)[blendFields.intParam][0] * 10000 + 1);
            this.skillIcon.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png`;
            this.skillNameTxt.text = cfg[skillFields.name];
            this.skillDescTxt.innerHTML = cfg[skillFields.des];

            this._matEnough = false;
            this._matId = this._matCount = 0;
            this._isMaxLv = false;
            this._btnClip.visible = false;
            this._btnClip.stop();
            if (this._selectedIndex >= 0) {
                let stoneId: number = arr[this._selectedIndex];
                this._selectedStoneId = stoneId;
                let lv: number = stoneId % 1000;
                this.stoneLevel.text = `Lv.${lv}`;
                this.stoneLevel.visible = lv !== 0;
                let cfg: gauntlet = GauntletCfg.instance.getCfgById(stoneId + (lv ? 0 : 1));
                this.stoneName.text = cfg[gauntletFields.name];
                // 石头描述
                this.stoneSkillDescTxt.innerHTML = this._stoneSkillDescs[this._selectedIndex].replace("X", Math.ceil(cfg[gauntletFields.attrs][0][attrFields.value] * (this._selectedIndex === 5 ? 1 : 100)) + "");
                this.stoneRateTxt.innerHTML = `提升装备基础全属性<span color="#50ff28">${Math.ceil(cfg[gauntletFields.attrs][1][attrFields.value] * 100)}%</span>`;
                this.inlayBtn.label = lv === 0 ? "镶嵌" : "升级";
                this._matId = cfg[gauntletFields.material][0][ItemsFields.itemId];
                this._matCount = cfg[gauntletFields.material][0][ItemsFields.count];
                this._isMaxLv = !GauntletCfg.instance.getCfgById(stoneId + 1);
                this.updateMat();
            }

            this.fightClip.value = Math.floor(glovesCfg[gauntletFields.fight] * per + fight) + "";
        }

        // 更新材料
        private updateMat(): void {
            this.stoneSmallIcon.skin = CommonUtil.getIconById(this._matId, true);
            let hasCount: number = BagModel.instance.getItemCountById(this._matId);
            this.stoneNum.text = `${hasCount}/${this._matCount}`;
            this.stoneNum.color = hasCount < this._matCount ? "#ff3e3e" : "#50ff28";
            this._matEnough = hasCount >= this._matCount;
            if (this._matEnough && !this._isMaxLv) {
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        private clickHandler(e: Laya.Event): void {
            if (e.target === this.closeBtn) return;
            this.selectStone(-1);
        }

        private inlayHandler(e: Laya.Event): void {
            e.stopPropagation();
            if (this._selectedIndex < 0) return;
            if (this._isMaxLv) {
                SystemNoticeManager.instance.addNotice("徽章等级已达上限", true);
                return;
            }
            if (this._matEnough) {
                GlovesCtrl.instance.inlayGauntlet(this._selectedIndex + 1);
            } else {
                let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
                if (!info) return;
                // 镶嵌或者升阶的是正在卖的宝石
                if (this._selectedIndex + 1 === info[GetGauntletReplyFields.jewel_index] % 10 || this._selectedIndex + 1 === info[GetGauntletReplyFields.draw_index] % 10) {
                    WindowManager.instance.open(WindowEnum.GLOVES_STONE_BUY_ALERT);
                } else {
                    SystemNoticeManager.instance.addNotice(`购买徽章后可${this._selectedStoneId % 1000 === 0 ? "镶嵌" : "升级"}`);
                }
            }
        }

        // 选择的徽章索引，-1代表显示装备基属性
        private selectStone(index: int): void {
            if (index === this._selectedIndex) return;
            this._selectedIndex = index;
            this.line1.visible = this.line2.visible = this.skillBg.visible = this.skillIcon.visible = this.skillTitle.visible = this.skillNameTxt.visible =
                this.attrName1.visible = this.attrValue1.visible = this.attrName2.visible = this.attrValue2.visible = this.attrName3.visible =
                this.attrValue3.visible = this.attrName4.visible = this.attrValue4.visible = this.attrName5.visible = this.attrValue5.visible =
                this.attrName6.visible = this.attrValue6.visible = this.skillDescTxt.visible = this._selectedIndex === -1;
            this.dot1.visible = this.dot2.visible = this.inlayBtn.visible = this.stoneSmallIcon.visible = this.stoneName.visible =
                this.stoneLevel.visible = this.stoneNum.visible = this.stoneSkillDescTxt.visible = this.stoneRateTxt.visible = this._selectedIndex !== -1;
            if (this._selectedIndex >= 0) {
                this.selectedImg.visible = true;
                this.selectedImg.pos(this._stoneGrids[this._selectedIndex].x - 30, this._stoneGrids[this._selectedIndex].y - 31, true);
            } else {
                this.selectedImg.visible = false;
            }
            this.updateInfo();
        }

        // 点击属性
        private attrClickHandler(): void {
            WindowManager.instance.open(WindowEnum.GLOVES_TIPS_ALERT);
        }

        destroy(): void {
            this._stoneGrids = this.destroyElement(this._stoneGrids);
            this._stoneIcons = this.destroyElement(this._stoneIcons);
            // this._stones = this.destroyElement(this._stones);
            this._attrNames = this.destroyElement(this._attrNames);
            this._attrValues = this.destroyElement(this._attrValues);
            this._rps = this.destroyElement(this._rps);
            this._stoneSkillDescs.length = 0;
            this._stoneSkillDescs = null;
            this._btnClip = this.destroyElement(this._btnClip);
            this.prizeEffect = this.destroyElement(this.prizeEffect)
            super.destroy();
        }
    }
}