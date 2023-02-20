///<reference path="../config/immortals_cfg.ts"/>
///<reference path="../config/wing_cfg.ts"/>
///<reference path="../immortals/sb_item.ts"/>

namespace modules.wing {
    import BtnGroup = modules.common.BtnGroup;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import skillFields = Configuration.skillFields;
    import Text = Laya.Text;
    import CustomClip = modules.common.CustomClip;
    import SkillInfo = Protocols.SkillInfo;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import BagModel = modules.bag.BagModel;
    import wing_feed = Configuration.wing_feed;
    import Image = Laya.Image;
    import WingCfg = modules.config.WingCfg;
    import wing_feedFields = Configuration.wing_feedFields;
    import BaseItem = modules.bag.BaseItem;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import WingShengjiViewUI = ui.WingShengjiViewUI;
    import CommonUtil = modules.common.CommonUtil;
    import SkillItem = modules.immortals.SkillItem;
    import FeedSkillType = ui.FeedSkillType;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import wing_magicShow = Configuration.wing_magicShow;
    import wing_magicShowFields = Configuration.wing_magicShowFields;

    export class WingShengjiPanel extends WingShengjiViewUI {
        // 按钮组
        private _btnGroup: BtnGroup;
        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;

        private _attrNameTxts: Array<Text>;
        private _attrValueTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;

        // private _showModelClip: AvatarClip;//展示的模型
        private _skeletonClip: SkeletonAvatar;
        private _numDiff: number;

        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._consumables = this.destroyElement(this._consumables);
            this.btnClip = this.destroyElement(this.btnClip);
            this._attrNameTxts = this.destroyElement(this._attrNameTxts);
            this._attrValueTxts = this.destroyElement(this._attrValueTxts);
            this._upAttrTxts = this.destroyElement(this._upAttrTxts);
            this._arrowImgs = this.destroyElement(this._arrowImgs);
            // this._showModelClip = this.destroyElement(this._showModelClip);
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this.creatEffect();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.upGradeTab, this.huanhuaTab, this.fuhunTab);

            this._consumables = new BaseItem();
            this._consumables.pos(318, 918);
            this._consumables.scale(0.8, 0.8);
            this.addChild(this._consumables);

            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];
            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];

            this._numDiff = 0;

            this.bgImg0.skin = "immortal/bg_gs_huanhua.png";
        }

        protected onOpened(): void {
            super.onOpened();

            this.btnClip.play();
            this.btnClip.visible = false;
            this._btnGroup.selectedIndex = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnFunc);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WING_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.changeHandler);

            this.addAutoRegisteRedPoint(this.dotImg_1, ["wingShengjiRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP", "wingHuanhuaDianchangRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["wingFuhunRP"]);
        }

        private changeHandler(): void {

            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.WING_HUANHUA_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.WING_FUHUN_PANEL);
                return;
            }

            let showId: number = WingModel.instance.otherValue["幻化id"];
            if (!showId) {
                let _arr: Array<wing_magicShow> = WingCfg.instance.getSkinCfgByType(3);
                showId = _arr[0][wing_magicShowFields.showId];
            }

            this._skeletonClip.reset(0, 0, showId, 0, 0, 0);
            this._skeletonClip.resetScale(AvatarAniBigType.wing, 1.3);

            let lev: int = WingModel.instance.otherValue["升级等级"];
            let cfg = WingCfg.instance.getShengjiCfgByLv(lev);
            let nextCfg = WingCfg.instance.getShengjiCfgByLv(lev + 1);

            this.atkMsz.value = WingModel.instance.otherValue["升级战力"].toString();
            this.levMsz.value = lev.toString();
            let _needCfg = WingCfg.instance.getShengjiSkillCfgByLev(lev);
            if (_needCfg) {
                this.needLevTxt.text = `${_needCfg[wing_feedFields.level] - lev}级`;
                this.retractTxt_1.x = this.needLevTxt.x + this.needLevTxt.textWidth + 6;
                let _name = SkillCfg.instance.getCfgById(_needCfg[wing_feedFields.skill][0]);
                this.retractTxt_2.x = this.retractTxt_1.x + this.retractTxt_1.textWidth;
                this.retractTxt_2.text = `【${_name[skillFields.name]}】${_needCfg[wing_feedFields.skill][1]}级`;
            } else {
                this.tipTxtBox.visible = false;
            }

            //设置战力居中
            let width = this.LVMsz.width + this.levMsz.width;
            let x = (this.width / 2) - (width / 2);
            this.LVMsz.x = x;
            this.levMsz.x = this.LVMsz.x + this.LVMsz.width;

            this.setAttr(cfg, nextCfg);

            // 设置技能
            let skillPureIds: number[] = WingCfg.instance.shengjiSkillIds;
            let skillInfos: Array<SkillInfo> = new Array<SkillInfo>();
            for (let i: int = 0, len: int = WingModel.instance.skillList.keys.length; i < len; i++) {
                skillInfos[i] = WingModel.instance.skillList.get(WingModel.instance.skillList.keys[i]);
            }
            for (let i: int = 0, len = skillPureIds.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    this.skillBox._childs[i].skillId = skillInfos.length > i && skillInfos[i][SkillInfoFields.level] > 0 ?
                        skillInfos[i][SkillInfoFields.skillId] : CommonUtil.getSkillIdByPureIdAndLv(skillPureIds[i], 1);
                    this.skillBox._childs[i].skillInfo = skillInfos.length > i ? skillInfos[i] : null;
                    (this.skillBox._childs[i] as SkillItem).type = FeedSkillType.wing;
                    (this.skillBox._childs[i] as SkillItem).stopUpgradeCallBack = () => {
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                    };
                }
            }
        }

        // 筛选能够升级Skill
        private filterOneSkillItem(): SkillItem {
            for (let i: int = 0, len = this.skillBox._childs.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    let skillItem: SkillItem = this.skillBox._childs[i];
                    if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                        return skillItem;
                    }
                }
            }
            return null;
        }


        private creatEffect(): void {
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 520, true);
            // this._skeletonClip.reset(0, 0, 3001, 0, 0, 0);
            this._skeletonClip.resetScale(AvatarAniBigType.wing, 0.8);


            this.btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);

            // this._showModelClip = AvatarClip.create(1024, 1024, 1024);
            // this.shengjiPanel.addChildAt(this._showModelClip, 2);
            // this._showModelClip.anchorX = 0.5;
            // this._showModelClip.anchorY = 0.5;
            // this._showModelClip.centerX = 0;
            // this._showModelClip.y = 435;
            // // this._showModelClip.reset(3001);
            // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(3001);
            // this._showModelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._showModelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._showModelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._showModelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._showModelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
        }

        //升级按钮
        private goBtnFunc(): void {

            let id = this._consumables.itemData[ItemFields.ItemId];

            if (this._numDiff >= 0) {
                WingCtrl.instance.feedShenbing();
            } else {
                BagUtil.openLackPropAlert(id, 1);
            }
        }


        //设置属性加成列表
        private setAttr(cfg: wing_feed, nextCfg: wing_feed): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg, nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                wing_feedFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 80;
            // else if (t <= 4) this.img_line0.y = 120;
            // else if (t <= 6) this.img_line0.y = 160;

            let items: Array<number>;

            items = (<wing_feed>cfg)[wing_feedFields.items];

            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._consumables.dataSource = [items[0], 0, 0, null];
                //消耗道具 颜色判定修改
                let colorStr = "#ff7462";
                if (hasItemNum < items[1]) {
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                } else {
                    colorStr = "#ffffff";
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                }
                this._numDiff = hasItemNum - items[1];
                this.btnClip.visible = this._numDiff >= 0;
            } else {          //没有下一级
                this._consumables.visible = false;
                this.goBtn.visible = false;
                this.fullLevelImg.visible = true;
                this.btnClip.visible = false;
            }
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20016);
        }
    }
}