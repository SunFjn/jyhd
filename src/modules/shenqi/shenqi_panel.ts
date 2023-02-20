///<reference path="../config/shenqi_cfg.ts"/>
///<reference path="../config/attr_buff_cfg.ts"/>


namespace modules.shenqi {
    import BtnGroup = modules.common.BtnGroup;
    // import AvatarClip = modules.common.AvatarClip;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import ShenqiCfg = modules.config.ShenqiCfg;
    import shenqi = Configuration.shenqi;
    import shenqiFields = Configuration.shenqiFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_item = Configuration.attr_item;
    import attr_itemFields = Configuration.attr_itemFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class ShenqiPanel extends ui.ShenQiViewUI {

        private _fragmentSelects: Array<Image>;    //碎片选中框
        private _fragmentBtns: BtnGroup;     //碎片按钮组
        private _fragmentLabelBgs: Array<Image>;       //碎片提示背景
        private _fragmentIcons: Array<Image>; //碎片图标
        private _fragmentTxts: Array<Text>;  //碎片提示

        private _index: number;       //当前页面

        private _fragmentBtnEff: common.CustomClip;  //碎片操作按钮粒子效果
        private _activateBtnEff: common.CustomClip;  //激活按钮粒子效果

        // private _showModelClip: AvatarClip;//展示的模型
        private _skeletonClip: SkeletonAvatar;//2d模型

        private _tween: TweenJS;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;
            //选中框组
            this._fragmentSelects = [this.fragmentSelect0, this.fragmentSelect1, this.fragmentSelect2, this.fragmentSelect3];
            //碎片选择按钮组
            this._fragmentBtns = new BtnGroup();
            this._fragmentBtns.setBtns(this.fragment0, this.fragment1, this.fragment2, this.fragment3);
            //碎片提示背景
            this._fragmentLabelBgs = [this.fragmentLabelBg0, this.fragmentLabelBg1, this.fragmentLabelBg2, this.fragmentLabelBg3];
            //碎片图标
            this._fragmentIcons = [this.fragmentIcon0, this.fragmentIcon1, this.fragmentIcon2, this.fragmentIcon3];
            //碎片提示
            this._fragmentTxts = [this.fragmentTxt0, this.fragmentTxt1, this.fragmentTxt2, this.fragmentTxt3];
            //总战力
            this.totalAttr.underline = true;

            //碎片操作按钮粒子效果
            this._fragmentBtnEff = CommonUtil.creatEff(this.fragmentCtrlBtn, "btn_light", 15);
            this._fragmentBtnEff.pos(-5, -22);
            this._fragmentBtnEff.scaleY = 1.3;

            //激活按钮粒子效果
            this._activateBtnEff = CommonUtil.creatEff(this.activateBtn, "btn_light", 15);
            this._activateBtnEff.pos(-5, -22);
            this._activateBtnEff.scaleY = 1.3;

            //模型创建
            // this._showModelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._showModelClip, 20);
            // this._showModelClip.anchorX = 0.5;
            // this._showModelClip.anchorY = 0.5;
            // this._showModelClip.centerX = 0;
            // this._showModelClip.y = 500;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.y = 550;
            this._skeletonClip.centerX = 0;
            this._skeletonClip.zOrder = 20;
            //模型待机动作
            // this._tween = TweenJS.create(this._showModelClip).yoyo(true).repeat(Number.POSITIVE_INFINITY);
        }

        public close(): void {
            this._tween && this._tween.stop();
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            this._fragmentSelects = this.destroyElement(this._fragmentSelects);
            this._fragmentBtns = this.destroyElement(this._fragmentBtns);
            this._fragmentLabelBgs = this.destroyElement(this._fragmentLabelBgs);
            this._fragmentIcons = this.destroyElement(this._fragmentIcons);
            this._fragmentTxts = this.destroyElement(this._fragmentTxts);
            this._fragmentBtnEff = this.destroyElement(this._fragmentBtnEff);
            this._activateBtnEff = this.destroyElement(this._activateBtnEff);
            // this._showModelClip = this.destroyElement(this._showModelClip);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            this._tween && (this._tween = null);
            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._fragmentBtns, common.LayaEvent.CHANGE, this, this.selectFragment);
            this.addAutoListener(this.lastBtn, common.LayaEvent.CLICK, this, this.switchShenqi, [0]);
            this.addAutoListener(this.nextBtn, common.LayaEvent.CLICK, this, this.switchShenqi, [1]);
            this.addAutoListener(this.totalAttr, common.LayaEvent.CLICK, this, this.openShenqiAttr);
            this.addAutoListener(this.activateBtn, common.LayaEvent.CLICK, this, this.activate);
            this.addAutoListener(this.fragmentCtrlBtn, common.LayaEvent.CLICK, this, this.fragmentCtrl);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENQI_UPDATE, this, this.refresh);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENQI_JIHUO, this, this.switchShenqi, [1]);
        }

        public onOpened(): void {
            super.onOpened();
            // this._showModelClip.y = 500;
            this._skeletonClip.y = 550;
            // this._tween.to({ y: this._showModelClip.y + 10 }, 1000).start();
            //隐藏选择框
            for (let i = 0; i < this._fragmentSelects.length; ++i) {
                this._fragmentSelects[i].visible = false;
            }
            this.index = ShenqiModel.instance.shenqi.length;
            this._fragmentBtns.selectedIndex = 0;
            this.fragmentSelect();
        }

        //碎片按钮
        private selectFragment(): void {
            //切换选中框
            if (this._fragmentBtns.oldSelectedIndex >= 0) {
                this._fragmentSelects[this._fragmentBtns.oldSelectedIndex].visible = false;
            }
            this._fragmentSelects[this._fragmentBtns.selectedIndex].visible = true;

            let cfg: shenqi = ShenqiCfg.instance.getCfgById(this.index);
            let fragment: number = cfg[shenqiFields.fragment][this._fragmentBtns.selectedIndex];
            //碎片信息显示
            this.fragmentName.text = ItemMaterialCfg.instance.getItemCfgById(fragment)[item_materialFields.name];
            let attrCfg0: attr_item = AttrItemCfg.instance.getCfgById(cfg[shenqiFields.fragmentAttr][this._fragmentBtns.selectedIndex][0]);
            let attrCfg1: attr_item = AttrItemCfg.instance.getCfgById(cfg[shenqiFields.fragmentAttr][this._fragmentBtns.selectedIndex][2]);
            this.fragmentAttr0.text = "+" + cfg[shenqiFields.fragmentAttr][this._fragmentBtns.selectedIndex][1];
            this.fragmentAttr1.text = "+" + cfg[shenqiFields.fragmentAttr][this._fragmentBtns.selectedIndex][3];// attrCfg1[attr_itemFields.name] + 
            //碎片操作按钮
            if ((this.index < ShenqiModel.instance.shenqi.length) || ShenqiModel.instance.equipFragmentsDic.get(fragment)) {
                this.fragmentCtrlBtn.visible = false;
            } else if (ShenqiModel.instance.fragmentsDic.get(fragment)) {
                // this.fragmentCtrlBtn.skin = "common/btn_tongyong_6.png";
                // this.fragmentCtrlBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                this.fragmentCtrlBtn.label = "放入碎片";
                this.fragmentCtrlBtn.visible = true;

                this._fragmentBtnEff.visible = true;
                this._fragmentBtnEff.play();
            } else {
                // this.fragmentCtrlBtn.skin = "common/btn_tongyong_18.png";
                // this.fragmentCtrlBtn.labelColors = "#2d2d2d,#2d2d2d,#2d2d2d,#2d2d2d";
                this.fragmentCtrlBtn.label = "前往获取";
                this.fragmentCtrlBtn.visible = true;
                this._fragmentBtnEff.visible = false;
            }
        }

        //选择第一个未激活的的碎片
        private fragmentSelect(): void {
            let cfg: shenqi = ShenqiCfg.instance.getCfgById(this.index);
            if (ShenqiModel.instance.shenqi.length > this.index) {
                this._fragmentBtns.selectedIndex = cfg[shenqiFields.fragment].length - 1;
            }
            else {
                for (let i = 0; i < cfg[shenqiFields.fragment].length; ++i) {
                    if (!ShenqiModel.instance.equipFragmentsDic.get(cfg[shenqiFields.fragment][i])) {
                        this._fragmentBtns.selectedIndex = i;
                        this.selectFragment();
                        return;
                    }
                }
            }
            this.selectFragment();
        }

        //显示战力
        private showPower() {
            this.powerNum.value = ShenqiModel.instance.fighting.toString();
        }

        //设置页面
        private set index(value: number) {
            this.showPower();
            //如果越界，就设为最后一个传承
            if (ShenqiCfg.instance.count <= value) {
                value = ShenqiCfg.instance.count - 1;
            }

            if (value <= ShenqiModel.instance.shenqi.length + 1) {
                let cfg: shenqi = ShenqiCfg.instance.getCfgById(value);
                if (cfg) {
                    this._index = value;
                    //切页按钮显示设置
                    if (value <= 0) {
                        this.lastBtn.visible = false;
                    } else {
                        this.lastBtn.visible = true;
                    }
                    if (ShenqiCfg.instance.count - 1 == value) {
                        this.nextBtn.visible = false;
                    } else {
                        this.nextBtn.visible = true;
                    }
                    if (value == ShenqiModel.instance.shenqi.length + 1) {
                        this.nextBtn.gray = true;
                    } else {
                        this.nextBtn.gray = false;
                    }
                    //显示传承信息
                    this.shenqiName.text = cfg[shenqiFields.name];
                    this.shenqiAttr.text = SkillCfg.instance.getCfgById(cfg[shenqiFields.skillId])[skillFields.des];
                    this.AttrImg.skin = `assets/icon/ui/shenqi/${cfg[shenqiFields.skillStr]}.png`;
                    //显示传承模型
                    let showId: number = cfg[shenqiFields.showID];
                    if (showId) {
                        let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
                        // this._showModelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
                        // this._showModelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX] ? modelCfg[ExteriorSKFields.rotationX] : 0;
                        // this._showModelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY] ? modelCfg[ExteriorSKFields.rotationY] : 0;
                        // this._showModelClip.avatarY = modelCfg[ExteriorSKFields.deviationY] ? modelCfg[ExteriorSKFields.deviationY] : 0;
                        // this._showModelClip.avatarX = modelCfg[ExteriorSKFields.deviationX] ? modelCfg[ExteriorSKFields.deviationX] : 0;
                        // this._showModelClip.reset(showId);
                        // this._showModelClip.setActionType(ActionType.SHOW)
                        this._skeletonClip.reset(showId);
                        this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.4)
                        this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
                    }
                    //如果不是两碎片传承
                    if (cfg[shenqiFields.fragment].length > 2) {
                        this.fragment2.visible = true;
                        this.fragment3.visible = true;
                        this.fragmentIcon2.visible = true;
                        this.fragmentIcon3.visible = true;
                        this.fragmentLabelBg2.visible = true;
                        this.fragmentLabelBg3.visible = true;
                        this.fragmentTxt2.visible = true;
                        this.fragmentTxt3.visible = true;
                        this.fragment1.pos(164, 160);
                        this.fragmentSelect1.pos(159, 149);
                        this.fragmentIcon1.pos(241, 228);
                        this.fragmentTxt1.pos(159, 298);
                        this.fragmentLabelBg1.pos(155, 300);
                    }
                    //如果是两碎片传承
                    else {
                        this.fragment2.visible = false;
                        this.fragment3.visible = false;
                        this.fragmentIcon2.visible = false;
                        this.fragmentIcon3.visible = false;
                        this.fragmentLabelBg2.visible = false;
                        this.fragmentLabelBg3.visible = false;
                        this.fragmentTxt2.visible = false;
                        this.fragmentTxt3.visible = false;
                        this.fragment1.pos(this.fragment3.x, this.fragment3.y);
                        this.fragmentSelect1.pos(this.fragmentSelect3.x, this.fragmentSelect3.y);
                        this.fragmentIcon1.pos(this.fragmentIcon3.x, this.fragmentIcon3.y);
                        this.fragmentTxt1.pos(this.fragmentTxt3.x, this.fragmentTxt3.y);
                        this.fragmentLabelBg1.pos(this.fragmentLabelBg3.x, this.fragmentLabelBg3.y);
                    }
                    //碎片遍历
                    let activateEnable: boolean = true;
                    for (let i = 0; i < cfg[shenqiFields.fragment].length; ++i) {
                        let fragment: number = cfg[shenqiFields.fragment][i];
                        let itemCfg: item_material = ItemMaterialCfg.instance.getItemCfgById(fragment);
                        this._fragmentIcons[i].skin = `assets/icon/item/${itemCfg[item_materialFields.ico]}.png`;
                        if (fragment) {
                            //碎片已放入
                            if ((value < ShenqiModel.instance.shenqi.length) || ShenqiModel.instance.equipFragmentsDic.get(fragment)) {
                                this._fragmentLabelBgs[i].visible = false;
                                this._fragmentIcons[i].gray = false;
                                this._fragmentTxts[i].color = "#000000";
                                this._fragmentTxts[i].text = "";
                            }
                            //碎片可放入
                            else if (ShenqiModel.instance.fragmentsDic.get(fragment)) {
                                this._fragmentLabelBgs[i].visible = true;
                                this._fragmentIcons[i].gray = true;
                                this._fragmentTxts[i].color = "#00FF00";
                                this._fragmentTxts[i].text = "可放入";
                                activateEnable = false;
                            }
                            //没获得碎片
                            else {
                                this._fragmentLabelBgs[i].visible = true;
                                this._fragmentIcons[i].gray = true;
                                this._fragmentTxts[i].color = "#FF0000";
                                this._fragmentTxts[i].text = `第${cfg[shenqiFields.conditions][i]}关获取`;
                                activateEnable = false;
                            }
                        }
                    }
                    //传承激活状态
                    if (value < ShenqiModel.instance.shenqi.length) {
                        // this._showModelClip.gray = false;
                        this._skeletonClip.gray = false;
                        this.activateBtn.visible = false;
                        this._activateBtnEff.visible = false;
                        this.activated.visible = true;
                        this.unActivate.visible = false;
                    } else {
                        if ((value == ShenqiModel.instance.shenqi.length) && activateEnable) {
                            this.activateBtn.visible = true;
                            this._activateBtnEff.visible = true;
                            this._activateBtnEff.play();
                            this.unActivate.visible = false;
                        } else {
                            this.activateBtn.visible = false;
                            this._activateBtnEff.visible = false;
                            this.unActivate.visible = true;
                        }
                        this.activated.visible = false;
                        // this._showModelClip.gray = true;
                        this._skeletonClip.gray = true;
                    }
                }
            }
        }

        private get index(): number {
            return this._index;
        }

        //传承翻页
        private switchShenqi(dir: number): void {
            let oldIndex = this.index;
            if (dir) {
                this.index++;
            } else {
                this.index--;
            }
            if (this.index != oldIndex) {
                this.fragmentSelect();
            }
            else if (this.index != 0) {
                if (this.index != oldIndex) {
                    SystemNoticeManager.instance.addNotice("需激活上一个传承方可查看", false);      //系统提示
                }
            }
        }

        //碎片操作按钮
        private fragmentCtrl(): void {
            let cfg: shenqi = ShenqiCfg.instance.getCfgById(this.index);       //当前传承
            let id: [number] = [cfg[shenqiFields.fragment][this._fragmentBtns.selectedIndex]];     //当前选择碎片的id
            //如果有这个碎片
            if (ShenqiModel.instance.fragmentsDic.get(id[0])) {
                //如果当前页面是下一个未激活传承
                if (this.index > ShenqiModel.instance.shenqi.length) {
                    SystemNoticeManager.instance.addNotice("请先激活上一个传承", false);      //系统提示
                } else {
                    ShenqiCtrl.instance.equipFragment(id);
                }
            } else {
                WindowManager.instance.openByActionId(ActionOpenId.tianguan);
            }
        }

        //激活
        private activate(): void {
            ShenqiCtrl.instance.activateShenQi();
        }

        public refresh(): void {
            this.index = this.index;
            this.selectFragment();
            //选择下一个可激活的
            this.fragmentSelect();
        }

        private openShenqiAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["传承总属性",
                    ShenqiModel.instance.fighting,
                    ShenqiModel.instance.attr,
                    ShenqiCfg.instance.attrIndices      //[0,4,2,6,8,11,14,17]
                ]);
        }
    }
}