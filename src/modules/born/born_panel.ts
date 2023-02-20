///<reference path="../config/born_cfg.ts"/>


namespace modules.born {
    import BornViewUI = ui.BornViewUI;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import era = Configuration.era;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import SkillTrainCfg = modules.config.SkillTrainCfg;
    import skillTrainFields = Configuration.skillTrainFields;
    import EraNodeFields = Protocols.EraNodeFields;
    import EraNode = Protocols.EraNode;

    export class BornPanel extends BornViewUI {

        private _btnClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize() {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._btnClip.pos(-5, -22);
            this._btnClip.scaleY = 1.3;

            // 不再从icon中调取而是在box中的预制
            // this.iconImg.skin = `assets/icon/item/10079.png`; 

            this.regGuideSpr(GuideSpriteId.BORN_GOTO_BTN, this.btn);
        }

        protected onOpened(): void {
            super.onOpened();

            BornCtrl.instance.getEraInfo();

            this.updateView();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.iconImg, common.LayaEvent.CLICK, this, this.iconHandler);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BORN_UPDATE, this, this.updateView);
        }

        private updateView(): void {
            let lv: number = BornModel.instance.lv;
            let nextBigLv: number = BornCfg.instance.getBigLv(lv);
            let nextLv: number = BornCfg.instance.getNextLv(lv);
            let cfg: era = BornCfg.instance.getCfgByLv(lv);
            let nextCfg: era = BornCfg.instance.getCfgByLv(nextLv);
            let ids: number[];
            let needProp: Items;

            if (nextCfg) {
                ids = BornModel.instance.ids;
                needProp = cfg[eraFields.eraDan][0];
                this.setPrizes(lv);
                if (!lv) {
                    this.noImg.visible = true;
                    this.currBox.visible = false;
                } else {
                    this.noImg.visible = false;
                    this.currBox.visible = true;
                }
                this.nextMsz.value = BornModel.instance.formatLv(nextLv);
                if (!nextBigLv) {
                    this.setRightHidden();
                }
            } else {
                let lastCfg: era = BornCfg.instance.getCfgByLv(lv, -1);
                ids = lastCfg[eraFields.tasklist];
                needProp = lastCfg[eraFields.eraDan][0];
                this.setAllHidden();
            }
            this.currMsz.value = BornModel.instance.formatLv(lv);
            this.setItems(ids);
            let needId: number = needProp[ItemsFields.itemId];
            let needCount: number = needProp[ItemsFields.count];
            let haveCount: number = CommonUtil.getPropCountById(needId);
            this.numTxt.text = `${haveCount}/${needCount}`;
            this.ZSDRP.visible = !!(haveCount > 0 && nextCfg);
            this.numTxt.color = haveCount >= needCount ? `#168a17` : `#ff3e3e`;
            this.setAttr(cfg, nextCfg);
            let fight: number = cfg[eraFields.fighting];
            this.fightMsz.value = fight.toString();

        }

        private setItems(ids: number[]) {
            let flag: boolean = true;
            let items: BornItem[] = [this.item_0, this.item_1, this.item_2, this.item_3];
            items.forEach((ele, index) => {
                let id: number = ids[index];
                ele.line = 0;
                ele.id = id;
                let node: EraNode = BornModel.instance.getEraNode(id);
                if (!node || node[EraNodeFields.state] != 2) {
                    flag = false;
                }
            });
            flag ? CustomClip.thisPlay(this._btnClip) : CustomClip.thisStop(this._btnClip);
        }

        private setPrizes(lv: number): void {
            let nextBigLv: number = BornCfg.instance.getBigLv(lv);
            if (!nextBigLv) {
                nextBigLv = BornCfg.instance.getBigLv(lv - 100);
            }
            let numStr: string = BornModel.instance.formatLv(nextBigLv,false);
            this.lockTxt.text = `${numStr}阶解锁`;
            let nextBigCfg: era = BornCfg.instance.getCfgByLv(nextBigLv);
            let nowBigCfg: era = BornCfg.instance.getCfgByLv(lv);
            let prizes: Items[] = nextBigCfg[eraFields.items];
            let skillId: number = prizes[0][ItemsFields.itemId];
            let skillIcon: string = CommonUtil.getIconById(skillId);
            this.skillImg.skin = skillIcon;
            let skillName: string = CommonUtil.getNameByItemId(skillId);
            this.skillNameTxt.text = `秘术·${skillName}`;
            let pureId: number = ItemMaterialCfg.instance.getItemCfgById(skillId)[item_materialFields.values][0];
            let tempId: number = CommonUtil.getSkillIdByPureIdAndLv(pureId, 1);
            let skillDes: string = SkillTrainCfg.instance.getScienceCfgById(tempId)[skillTrainFields.short_des];
            this.skillDesTxt.text = skillDes;

            let propId: number = prizes[1][ItemFields.ItemId];
            let propData: Item = [propId, prizes[1][ItemFields.count], 0, null];
            this.propItem.dataSource = propData;
            let propName: string = CommonUtil.getNameByItemId(propId);
            this.propNameTxt.text = propName;
            let propDes: string = nowBigCfg[eraFields.tips];
            this.propDesTxt.text = propDes;
        }

        private setRightHidden(): void {
            this.propItem.visible = this.hidden_6.visible = this.propNameTxt.visible = this.propDesTxt.visible =
                this.skillDesTxt.visible = this.skillNameTxt.visible = this.hidden_5.visible = this.lockTxt.visible =
                this.hidden_3.visible = this.hidden_4.visible = this.skillImg.visible = false;
            this.maxTxt.visible = true;
        }

        private setAllHidden(): void {
            this.hidden_0.visible = this.nextMsz.visible = this.btn.visible = this.noImg.visible = false;
            this.setRightHidden();
            CommonUtil.centerChainArr(this.width, [this.currBox]);
            CommonUtil.centerChainArr(this.width, [this.attrBox]);
        }

        private setAttr(cfg: era, nextCfg: era): void {
            let attrTxts: Text[] = [this.attrTxt_0, this.attrTxt_1, this.attrTxt_2];
            let imgs: Image[] = [this.arrImg_0, this.arrImg_1, this.arrImg_2];
            let proTxts: Text[] = [this.proTxt_0, this.proTxt_1, this.proTxt_2];
            let attack: number = cfg[eraFields.attack];
            let hp: number = cfg[eraFields.hp];
            let def: number = cfg[eraFields.defense];
            let attrs: number[] = [attack, hp, def];
            let lv: number = BornModel.instance.lv;
            attrs.forEach((value, index) => {
                attrTxts[index].text = CommonUtil.bigNumToString(value,false);
            });
            imgs.forEach((_, index) => {
                imgs[index].visible = proTxts[index].visible = !!nextCfg;
            });
            if (nextCfg) {
                let proAttack: number = Math.round(nextCfg[eraFields.attack] - attack);
                let proHP: number = Math.round(nextCfg[eraFields.hp] - hp);
                let proDef: number = Math.round(nextCfg[eraFields.defense] - def);
                let proAttrs: number[] = [proAttack, proHP, proDef];
                proAttrs.forEach((value, index) => {
                    proTxts[index].text = CommonUtil.bigNumToString(value,false);
                });
            }
        }

        private iconHandler(): void {
            WindowManager.instance.open(WindowEnum.BORN_ALERT);
        }

        private btnHandler(): void {
            let flag: boolean = true;
            let ids: number[] = BornModel.instance.ids;
            for (let id of ids) {
                let state: number = BornModel.instance.getEraNode(id)[EraNodeFields.state];
                if (!state) {
                    notice.SystemNoticeManager.instance.addNotice(`请先完成所有觉醒任务`, true);
                    return;
                } else if (state == 1) {
                    flag = false;
                }
            }
            if (!flag) {
                notice.SystemNoticeManager.instance.addNotice(`请先领完所有觉醒任务奖励`, true);
                return;
            }
            BornCtrl.instance.era();
        }
    }
}