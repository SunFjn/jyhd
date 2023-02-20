///<reference path="../config/tian_zhu_feed_cfg.ts"/>


/** 时装升级面板*/


namespace modules.tianZhu {
    import ImmortalShengjiViewUI = ui.ImmortalShengjiViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import Image = Laya.Image;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import TianZhuFeedCfg = modules.config.TianZhuFeedCfg;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import SkillItem = modules.immortals.SkillItem;
    import FeedSkillType = ui.FeedSkillType;
    import tianzhu_feedFields = Configuration.tianzhu_feedFields;
    import tianzhu_feed = Configuration.tianzhu_feed;
    import UpdateTianZhuInfo = Protocols.UpdateTianZhuInfo;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class TianZhuShengJiPanel extends ImmortalShengjiViewUI {
        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;

        private _attrNameTxts: Array<Laya.Text>;
        private _attrValueTxts: Array<Laya.Text>;
        private _upAttrTxts: Array<Laya.Text>;
        private _arrowImgs: Array<Image>;

        private _numDiff: number;
        // private _showModelClip: AvatarClip;//展示的模型
        private _skeletonClip: SkeletonAvatar;
        // private _showModelClipTween: TweenJS;
        private _needMatCount: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._attrNameTxts.length = 0;
            this._attrNameTxts = null;
            this._attrValueTxts.length = 0;
            this._attrValueTxts = null;
            this._upAttrTxts.length = 0;
            this._upAttrTxts = null;
            this._arrowImgs.length = 0;
            this._arrowImgs = null;
            // if (this._showModelClipTween) {
            //     this._showModelClipTween.stop();
            //     this._showModelClipTween = null;
            // }
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            // if (this._showModelClip) {
            //     this._showModelClip.removeSelf();
            //     this._showModelClip.destroy();
            //     this._showModelClip = null;
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

            this.upGradeTab.selected = true;

            this._consumables = new BaseItem();
            this._consumables.pos(318, 918);
            this._consumables.scale(0.8, 0.8);
            this.addChild(this._consumables);

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];

            this._numDiff = 0;

            this.titleTxt.text = "鬼神之力";
            this.bgImg0.skin = "immortal/bg_gs_huanhua.png";
            this.title_txt.skin = "immortal/txt_bw.png";
            //this.title_skill.skin = "immortal/image_tz_jn.png"
        }

        protected onOpened(): void {
            super.onOpened();

            this.btnClip.visible = false;

            // this._showModelClip.y = 450;
            // this._showModelClipTween = TweenJS.create(this._showModelClip).to({y: this._showModelClip.y - 20},
            //     1000).start().yoyo(true).repeat(99999999);

            this.updateTianZhuInfo();
            this.upGradeTab.label = "升级";
            this.huanhuaTab.label = "幻化";
            this.fuhunTab.label = "唤醒";
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.huanhuaTab, LayaEvent.CLICK, this, this.huanhuaHandler);
            this.addAutoListener(this.fuhunTab, LayaEvent.CLICK, this, this.fuhunHandler);

            this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.goBtnFunc);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TIAN_ZHU_INFO_UPDATE, this, this.updateTianZhuInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.changeHandler);

            this.addAutoRegisteRedPoint(this.dotImg_1, ["tianZhuShengJiRP", "tianZhuShengJiMatRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaZhenPinRP", "tianZhuHuanHuaJuePinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["tianZhuFuHunRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            // if (this._showModelClipTween != null) {
            //     this._showModelClipTween.stop();
            // }
        }

        private huanhuaHandler(): void {
            WindowManager.instance.open(WindowEnum.TIAN_ZHU_HUAN_HUA_PANEL);
        }

        private fuhunHandler(): void {
            WindowManager.instance.open(WindowEnum.TIAN_ZHU_FU_HUN_PANEL);
        }

        private updateBag(): void {
            let item: Item = this._consumables.itemData;
            if (item && this._needMatCount) {
                let count: number = BagModel.instance.getItemCountById(item[ItemFields.ItemId]);
                //消耗道具 颜色判定修改
                let colorStr = "#ff7462";
                if (count < this._needMatCount) {
                    this._consumables.setNum(`${count}/${this._needMatCount}`, colorStr);
                } else {
                    colorStr = "#ffffff";
                    this._consumables.setNum(`${count}/${this._needMatCount}`, colorStr);
                }
                this._numDiff = count - this._needMatCount;
                this.btnClip.visible = this._numDiff >= 0;
                this._numDiff >= 0 ? this.btnClip.play() : this.btnClip.stop();
            }
        }

        private updateTianZhuInfo(): void {
            let info: UpdateTianZhuInfo = TianZhuModel.instance.tianZhuInfo;
            if (!info) return;
            let showId: number = info[UpdateTianZhuInfoFields.curShowId];
            if (showId === 0) showId = BlendCfg.instance.getCfgById(15)[blendFields.intParam][PlayerModel.instance.occ - 1];
            if (showId) {
                // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(showId);
                // this._showModelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
                // this._showModelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
                // this._showModelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
                // this._showModelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
                // this._showModelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
                // this._showModelClip.reset(showId);

                this._skeletonClip.reset(0, 0, 0, 0, 0, showId);
                this._skeletonClip.resetScale(AvatarAniBigType.tianZhu, 0.5);
                // this._showModelClip.setActionType(ActionType.SHOW)
                this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW);

            }

            let lev: int = info[UpdateTianZhuInfoFields.feedLevel];
            let cfg = TianZhuFeedCfg.instance.getCfgByLevel(lev);
            let nextCfg = TianZhuFeedCfg.instance.getCfgByLevel(lev + 1);

            this.atkMsz.value = info[UpdateTianZhuInfoFields.feedFighting].toString();
            this.levMsz.value = lev.toString();
            let needCfg = TianZhuFeedCfg.instance.getUpSkillCfgByLv(lev);
            if (needCfg) {
                this.needLevTxt.text = `${needCfg[tianzhu_feedFields.level] - lev}级`;
                this.retractTxt_1.x = this.needLevTxt.x + this.needLevTxt.textWidth + 6;
                let name = SkillCfg.instance.getCfgById(needCfg[tianzhu_feedFields.skill][0]);
                this.retractTxt_2.x = this.retractTxt_1.x + this.retractTxt_1.textWidth;
                this.retractTxt_2.text = `【${name[skillFields.name]}】${needCfg[tianzhu_feedFields.skill][1]}级`;
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
            let skillPureIds: number[] = TianZhuFeedCfg.instance.skillPureIds;
            let skillInfos: Array<SkillInfo> = info[UpdateTianZhuInfoFields.feedSkillList];
            for (let i: int = 0, len = skillPureIds.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    this.skillBox._childs[i].skillId = skillInfos.length > i && skillInfos[i][SkillInfoFields.level] > 0 ?
                        skillInfos[i][SkillInfoFields.skillId] : CommonUtil.getSkillIdByPureIdAndLv(skillPureIds[i], 1);
                    this.skillBox._childs[i].skillInfo = skillInfos.length > i ? skillInfos[i] : null;
                    (this.skillBox._childs[i] as SkillItem).type = FeedSkillType.tianZhu;
                    (this.skillBox._childs[i] as SkillItem).stopUpgradeCallBack = ()=>{
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                     };
                }
            }
        }

        // 筛选能够升级Skill
        private filterOneSkillItem():SkillItem{
            for (let i: int = 0, len = this.skillBox._childs.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    let skillItem:SkillItem = this.skillBox._childs[i];
                    if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                        return skillItem;
                    }
                }
            }
            return null;
        }


        //设置属性加成列表
        private setAttr(cfg: tianzhu_feed, nextCfg: tianzhu_feed): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                tianzhu_feedFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 80;
            // else if (t <= 4) this.img_line0.y = 120;
            // else if (t <= 6) this.img_line0.y = 160;

            let items: Array<number> = cfg[tianzhu_feedFields.items];

            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._needMatCount = items[1];
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
                this._numDiff >= 0 ? this.btnClip.play() : this.btnClip.stop();
            } else {          //没有下一级
                this._consumables.visible = false;
                this.goBtn.visible = false;
                this.fullLevelImg.visible = true;
                this.btnClip.visible = false;
                this.btnClip.stop();
            }
        }

        private creatEffect(): void {
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 550, true);
            // this._skeletonClip.reset(5001, 0, 0, 0, 0, 0);

            this.btnClip = new CustomClip();
            this.goBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);
            this.btnClip.visible = false;

            // this._showModelClip = AvatarClip.create(1024, 1024, 1024);
            // this.shengjiPanel.addChildAt(this._showModelClip, 1);
            // this._showModelClip.anchorX = 0.5;
            // this._showModelClip.anchorY = 0.5;
            // this._showModelClip.centerX = 0;
            // this._showModelClip.y = 450;
            // // this._showModelClip.reset(5001);
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
                TianZhuCtrl.instance.feedTianZhu();
            } else {
                BagUtil.openLackPropAlert(id, 1);
            }
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20050);
        }
    }
}