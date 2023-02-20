///<reference path="../config/immortals_cfg.ts"/>

namespace modules.immortals {
    import BtnGroup = modules.common.BtnGroup;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import skillFields = Configuration.skillFields;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_feedFields = Configuration.shenbing_feedFields;
    import Text = Laya.Text;
    import CustomClip = modules.common.CustomClip;
    import SkillInfo = Protocols.SkillInfo;
    import shenbing_feed = Configuration.shenbing_feed;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import BagModel = modules.bag.BagModel;
    import Image = Laya.Image;
    import BaseItem = modules.bag.BaseItem;
    import BagUtil = modules.bag.BagUtil;
    import ItemFields = Protocols.ItemFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ImmortalShengjiViewUI = ui.ImmortalShengjiViewUI;
    import CommonUtil = modules.common.CommonUtil;
    import FeedSkillType = ui.FeedSkillType;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import shenbing_magicShow = Configuration.shenbing_magicShow;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;


    export class ImmortalShengjiPanel extends ImmortalShengjiViewUI {
        // 按钮组
        private _btnGroup: BtnGroup;

        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;

        private _attrNameTxts: Array<Text>;
        private _attrValueTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;

        private _numDiff: number;
        // private _showModelClip: AvatarClip;//展示的模型
        // private _showModelClipTween: TweenJS;
        private _skeletonClip: SkeletonAvatar;


        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._consumables = this.destroyElement(this._consumables);
            this.btnClip = this.destroyElement(this.btnClip);
            this._attrNameTxts = this.destroyElement(this._attrNameTxts);
            this._attrValueTxts = this.destroyElement(this._attrValueTxts);
            this._upAttrTxts = this.destroyElement(this._upAttrTxts);
            this._arrowImgs = this.destroyElement(this._arrowImgs);
            // this._showModelClip = this.destroyElement(this._showModelClip);
            // if (this._showModelClipTween) {
            //     this._showModelClipTween.stop();
            //     this._showModelClipTween = null;
            // }
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

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];

            this._numDiff = 0;

            this.title_txt.skin = "immortal/txt_xw.png";
            this.bgImg0.skin = "immortal/bg_cb_huanhua.png";


        }

        protected onOpened(): void {
            super.onOpened();

            this.btnClip.play();
            this.btnClip.visible = false;
            this._btnGroup.selectedIndex = 0;

            // this._showModelClip.y = 450;
            // this._showModelClipTween = TweenJS.create(this._showModelClip).to({ y: this._showModelClip.y - 20 },
            //     1000).start().yoyo(true).repeat(99999999);
            this.upGradeTab.label = "升级";
            this.huanhuaTab.label = "幻化";
            this.fuhunTab.label = "附魔";
        }

        public close(): void {
            // this._showModelClipTween && this._showModelClipTween.stop();
            super.close();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnFunc);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENBING_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.changeHandler);

            this.addAutoRegisteRedPoint(this.dotImg_1, ["immortalsShengjiRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["immortalsHuanhuaJipinRP", "immortalsHuanhuaZhenpinRP", "immortalsHuanhuaJuepinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["immortalsFuhunRP"]);
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.IMMORTAL_HUANHUA_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.IMMORTAL_FUHUN_PANEL);
                return;
            }

            let showId: number = ImmortalsModel.instance.otherValue["幻化id"];
            if (!showId) {
                let _arr: Array<shenbing_magicShow> = ImmortalsCfg.instance.getSkinCfgByType(3);;
                showId = _arr[0][shenbing_magicShowFields.showId];
            }
            this._skeletonClip.reset(0, showId);
            this._skeletonClip.resetScale(AvatarAniBigType.weapon, 1);
            this._skeletonClip.resetOffset(AvatarAniBigType.weapon, 0, 45);

            let lev: int = ImmortalsModel.instance.otherValue["升级等级"];
            let cfg = ImmortalsCfg.instance.getShengjiCfgByLv(lev);
            let nextCfg = ImmortalsCfg.instance.getShengjiCfgByLv(lev + 1);

            this.atkMsz.value = ImmortalsModel.instance.otherValue["升级战力"].toString();
            this.levMsz.value = lev.toString();
            let _needCfg = ImmortalsCfg.instance.getShengjiSkillCfgByLev(lev);
            if (_needCfg) {
                this.needLevTxt.text = `${_needCfg[shenbing_feedFields.level] - lev}级`;
                this.retractTxt_1.x = this.needLevTxt.x + this.needLevTxt.textWidth + 6;
                let _name = SkillCfg.instance.getCfgById(_needCfg[shenbing_feedFields.skill][0]);
                this.retractTxt_2.x = this.retractTxt_1.x + this.retractTxt_1.textWidth;
                this.retractTxt_2.text = `【${_name[skillFields.name]}】${_needCfg[shenbing_feedFields.skill][1]}级`;
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
            let skillPureIds: number[] = ImmortalsCfg.instance.skillIds;
            let skillInfos: Array<SkillInfo> = new Array<SkillInfo>();
            for (let i: int = 0, len: int = ImmortalsModel.instance.skillList.keys.length; i < len; i++) {
                skillInfos[i] = ImmortalsModel.instance.skillList.get(ImmortalsModel.instance.skillList.keys[i]);
            }
            for (let i: int = 0, len = skillPureIds.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    this.skillBox._childs[i].skillId = skillInfos.length > i && skillInfos[i][SkillInfoFields.level] > 0 ?
                        skillInfos[i][SkillInfoFields.skillId] : CommonUtil.getSkillIdByPureIdAndLv(skillPureIds[i], 1);
                    this.skillBox._childs[i].skillInfo = skillInfos.length > i ? skillInfos[i] : null;
                    (this.skillBox._childs[i] as SkillItem).type = FeedSkillType.immortals;
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

        //设置属性加成列表
        private setAttr(cfg: shenbing_feed, nextCfg: shenbing_feed): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                shenbing_feedFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 40;
            // else if (t <= 4) this.img_line0.y = 80;
            // else if (t <= 6) this.img_line0.y = 120;

            let items: Array<number>;

            items = (<shenbing_feed>cfg)[shenbing_feedFields.items];

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

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 520);

            this.btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);

            // this._showModelClip = AvatarClip.create(1024, 1024, 1024);
            // this.shengjiPanel.addChildAt(this._showModelClip, 1);
            // this._showModelClip.anchorX = 0.5;
            // this._showModelClip.anchorY = 0.5;
            // this._showModelClip.centerX = 0;
            // this._showModelClip.visible = false;
            // this._showModelClip.y = 450 - 70;
            // //this._showModelClip.reset(5001);
            // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(5001);
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
                ImmortalsCtrl.instance.feedShenbing();
            } else {
                BagUtil.openLackPropAlert(id, 1);
            }
        }
        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20013);
        }
    }
}