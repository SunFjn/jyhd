///<reference path="../magic_pet/magic_pet_model.ts"/>
///<reference path="../config/pet_magicshow_cfg.ts"/>
///<reference path="../common/custom_list.ts"/>
///<reference path="../config/get_way_cfg.ts"/>
///<reference path="../config/ride_magicshow_cfg.ts"/>
///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>

/**
 * 幻化面板
 */
namespace modules.illusion {
    import IllusionViewUI = ui.IllusionViewUI;
    import Event = Laya.Event;
    import CommonUtil = modules.common.CommonUtil;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import PetMagicShowFields = Protocols.PetMagicShowFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import PetMagicShow = Protocols.PetMagicShow;
    import Image = Laya.Image;
    import Text = laya.display.Text;
    import CustomList = modules.common.CustomList;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import BaseItem = modules.bag.BaseItem;
    import BagModel = modules.bag.BagModel;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import RideMagicShowCfg = modules.config.RideMagicShowCfg;
    import rideMagicShow = Configuration.rideMagicShow;
    import rideMagicShowFields = Configuration.rideMagicShowFields;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import BagUtil = modules.bag.BagUtil;
    import ItemFields = Protocols.ItemFields;
    import CustomClip = modules.common.CustomClip;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    // import AvatarClip = modules.common.AvatarClip;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class WeaponIllusionPanel extends IllusionViewUI {

        private static _instance: WeaponIllusionPanel;
        public static get instance(): WeaponIllusionPanel {
            return this._instance = this._instance || new WeaponIllusionPanel();
        }

        private _info: PetMagicShow;
        // 培养、进阶、修炼按钮组
        private _btnGroup: FuncBtnGroup;
        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;

        private _showTable: Table<MagicShowInfo>;

        private _list: CustomList;

        private _bagItem: BaseItem;
        private _countDiff: number;
        private _selectedId: int;
        //按钮特效
        private _btnClip: CustomClip;
        //private _modelClip: AvatarClip;
        private _showId: number;
        private _tiaoZhuanItemId: number;

        private _skeletonClip: SkeletonAvatar;

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._btnClip = this.destroyElement(this._btnClip);
            // this._modelClip = this.destroyElement(this._modelClip);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            super.destroy(destroyChild);
        }

        // 添加按钮回调
        protected addListeners(): void {
            this.addAutoListener(this.closeBtn, Event.CLICK, this, this.openJinjiePanel);
            super.addListeners();
            GlobalData.dispatcher
                .on(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo)
                .on(CommonEventType.MAGIC_PET_INITED, this, this.updatePetInfo)
                .on(CommonEventType.MAGIC_PET_HUANHUA_SHOWID, this, this.selectHandler)
                .on(CommonEventType.MAGIC_WEAPON_HUANHUA_SHOWID, this, this.selectHandler)
                .on(CommonEventType.MAGIC_PET_HUANHUA_SHOWID, this, this.updatePetInfo)
                .on(CommonEventType.MAGIC_WEAPON_HUANHUA_SHOWID, this, this.updatePetInfo)
                .on(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updatePetInfo);

            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);
            this.upgradeBtn.on(Event.CLICK, this, this.upgrade);
            this.switchBtn.on(Event.CLICK, this, this.switchHandler);
            this.totalAttrTxt.on(Event.CLICK, this, this.totalAttrHandler);
            this._list.on(Event.SELECT, this, this.selectHandler);
            this._btnGroup.on(Event.CHANGE, this, this.changeAllMenuHandler);

            this.preBtn.on(Event.CLICK, this, this.pageUpHandler);
            this.nextBtn.on(Event.CLICK, this, this.pageDownHandler);
            BottomTabCtrl.instance.tab.on(Event.CHANGE, this, this.changeMenuHandler);

            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["weaponFeedSkillRP", "weaponFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["weaponRankSkillRP", "weaponRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["weaponRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["weaponIllusionRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher
                .off(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo)
                .off(CommonEventType.MAGIC_PET_INITED, this, this.updatePetInfo)
                .off(CommonEventType.MAGIC_PET_HUANHUA_SHOWID, this, this.selectHandler)
                .off(CommonEventType.MAGIC_WEAPON_HUANHUA_SHOWID, this, this.selectHandler)
                .off(CommonEventType.MAGIC_PET_HUANHUA_SHOWID, this, this.updatePetInfo)
                .off(CommonEventType.MAGIC_WEAPON_HUANHUA_SHOWID, this, this.updatePetInfo)
                .off(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updatePetInfo);

            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);
            this.upgradeBtn.off(Event.CLICK, this, this.upgrade);
            this.switchBtn.off(Event.CLICK, this, this.switchHandler);
            this.totalAttrTxt.off(Event.CLICK, this, this.totalAttrHandler);
            this._list.off(Event.SELECT, this, this.selectHandler);
            this._btnGroup.off(Event.CHANGE, this, this.changeAllMenuHandler);

            this.preBtn.off(Event.CLICK, this, this.pageUpHandler);
            this.nextBtn.off(Event.CLICK, this, this.pageDownHandler);
            BottomTabCtrl.instance.tab.on(Event.CHANGE, this, this.changeMenuHandler);

            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
            RedPointCtrl.instance.retireRedPoint(this.hhDotImg);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.rideFeed, ActionOpenId.rideRank, ActionOpenId.rideMagicShow, ActionOpenId.rideRefine, ActionOpenId.rideFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);


            this._showId = -1;
            this._nameTxts = [this.nameTxt1, this.nameTxt2, this.nameTxt3, this.nameTxt4, this.nameTxt5, this.nameTxt6];
            this._valueTxts = [this.valueTxt1, this.valueTxt2, this.valueTxt3, this.valueTxt4, this.valueTxt5, this.valueTxt6];
            this._upImgs = [this.upImg1, this.upImg2, this.upImg3, this.upImg4, this.upImg5, this.upImg6];
            this._upTxts = [this.upTxt1, this.upTxt2, this.upTxt3, this.upTxt4, this.upTxt5, this.upTxt6];

            this.totalAttrTxt.underline = true;

            this._showTable = {};
            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.width = 562;
            this._list.height = 141;
            this._list.vCount = 1;
            this._list.spaceX = 20;
            this._list.itemRender = IllusionItem;
            this._list.x = 82;
            this._list.y = 774;
            this._list.hCount = 3;
            this.addChild(this._list);

            this._list.scrollBtn = [this.preBtn, this.nextBtn]

            this._bagItem = new BaseItem();
            this.addChild(this._bagItem);
            this._bagItem.pos(310, 913, true);

            this._btnClip = new CustomClip();
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.upgradeBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(0.96, 1);
            this._btnClip.visible = false;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.y = 475;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.notChangeSkinModel = false;;
            this._skeletonClip.pos(360, 475);
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "强化"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "附魔"
            this.methodArrayBtn.label = "精灵造物"
            MagicPetModel.instance.panelType = 0;
            this._btnGroup.selectedIndex = 2;
            this._btnClip.play();
            this._selectedId = -1;
            if (this._tiaoZhuanItemId) {
                this.selectQualityById(this._tiaoZhuanItemId);
            } else {
                this.setListIndex()
            }
            this.updatePetInfo();
            this._tiaoZhuanItemId = null;
        }
        private changeAllMenuHandler(): void {

            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 3) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_REFINE_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FAZHEN_PANEL);
            }
        }

        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            this._tiaoZhuanItemId = value;
        }

        public setListIndex() {
            let showIds: number[] = RideMagicShowCfg.instance.getShowIds();
            let num = showIds.length;
            let width1 = num * 100 + this._list.spaceX * (num - 1);
            // this._list.x = (this.width / 2) - (width1 / 2);
            this._list.datas = showIds;
            this._list.selectedIndex = 0;
            for (let i: int = 0, len: int = showIds.length; i < len; i++) {
                let lv: number = 0;
                let showInfo = MagicWeaponModel.instance.getShowInfoById(showIds[i]);
                if (showInfo) {
                    lv = showInfo[MagicShowInfoFields.star];
                }
                let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv);
                let nextCfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv + 1);
                let consumableId: number = cfg[rideMagicShowFields.items][0];
                let needNum: number = cfg[rideMagicShowFields.items][1];
                let hasNum: number = BagModel.instance.getItemCountById(consumableId);
                if (hasNum >= needNum && nextCfg) {
                    this._list.selectedIndex = i;
                    break;
                }
                if (IllusionModel.instance.rideMagicShowId == showIds[i] && nextCfg) {
                    this._list.selectedIndex = i;
                    break;
                }
            }
        }

        public selectQualityById(id: number) {
            let showIds: number[] = RideMagicShowCfg.instance.getShowIds();
            let num = showIds.length;
            let width1 = num * 100 + this._list.spaceX * (num - 1);
            // this._list.x = (this.width / 2) - (width1 / 2);
            this._list.datas = showIds;
            this._list.selectedIndex = 0;
            for (let i: int = 0, len: int = showIds.length; i < len; i++) {
                let lv: number = 0;
                let showInfo = MagicWeaponModel.instance.getShowInfoById(showIds[i]);
                console.log("selectQualityById", showInfo)
                if (showInfo) {
                    lv = showInfo[MagicShowInfoFields.star];
                }
                let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv);
                let nextCfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showIds[i], lv + 1);
                let consumableId: number = cfg[rideMagicShowFields.items][0];
                let needNum: number = cfg[rideMagicShowFields.items][1];
                let hasNum: number = BagModel.instance.getItemCountById(consumableId);
                if (consumableId == id && nextCfg) {
                    this._list.selectedIndex = i;
                    break;
                }
            }
        }

        private openJinjiePanel(): void {
            WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
        }

        private changeMenuHandler(): void {

        }

        private selectShowModel(): void {
            this._skeletonClip.reset(this._selectedId);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.55);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
        }

        // 宠物更新
        private updatePetInfo(): void {
            this._info = MagicWeaponModel.instance.magicShow;
            let showIds: Array<int> = RideMagicShowCfg.instance.getShowIds();
            let scroll = this._list.scrollPos;
            if (this._info) {
                this.powerNum.value = `${this._info[PetMagicShowFields.fighting]}`;
                this._list.datas = showIds;
                this._list.scroll(scroll);
                this.selectHandler()
            } else {
                this.powerNum.value = "0";
            }
        }

        private selectHandler(): void {
            let showId: int = this._list.selectedData;
            if (showId === undefined) return;
            this._selectedId = showId;
            let showInfo: MagicShowInfo = MagicWeaponModel.instance.getShowInfoById(showId);
            let star: int = showInfo ? showInfo[MagicShowInfoFields.star] : 0;
            let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showId, star);
            let itemId: int = cfg[rideMagicShowFields.items][0];
            let count: int = cfg[rideMagicShowFields.items][1];
            this._bagItem.dataSource = [itemId, count, 0, null];
            let bagCount: int = BagModel.instance.getItemCountById(itemId);
            this._countDiff = bagCount - count;
            this._btnClip.visible = this._countDiff >= 0;
            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (bagCount < count) {
                this._bagItem.setNum(`${bagCount}/${count}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._bagItem.setNum(`${bagCount}/${count}`, colorStr);
            }

            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            this.petNameTxt.text = exteriorSKCfg[ExteriorSKFields.name].toString();

            let usingShowId: number = IllusionModel.instance.rideMagicShowId;

            if (usingShowId == this._selectedId) {
                this.useImg.visible = true;
                this.switchBtn.visible = false;
            } else {
                this.useImg.visible = false;
                this.switchBtn.visible = true;
            }

            if (star === 0) {
                this.showTip(showId);
                this.tipBox.visible = this.noActImg.visible = this.tips_bg.visible = true;
                this.switchBtn.visible = this.rankMsz.visible = this.rankNumMsz.visible = false;
                this.upgradeBtn.label = "激活";
            } else {
                this.tipBox.visible = this.noActImg.visible = this.tips_bg.visible = false;
                this.rankMsz.visible = this.rankNumMsz.visible = true;
                this.upgradeBtn.label = "升级";
                this.rankNumMsz.value = star + "";

                let charNum = star.toString().length;
                let rankNumMszWidth = 22 * (charNum) + this.rankNumMsz.spaceX * charNum;
                let width = rankNumMszWidth + 5 + this.rankMsz.width;
                let x = (this.width - width) / 2;
                this.rankNumMsz.x = x;
                this.rankMsz.x = x + rankNumMszWidth + 5;
            }

            this.selectShowModel();
            let nextCfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(showId, star + 1);
            this.setAttrs(cfg, nextCfg);
        }

        // 设置属性加成列表
        private setAttrs(cfg: rideMagicShow, nextCfg: rideMagicShow) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                rideMagicShowFields.attrs
            );
            if (nextCfg) {
                this.fullLvImg.visible = false;
                this.upgradeBtn.visible = true;
            } else {
                this.fullLvImg.visible = true;
                this.upgradeBtn.visible = false;
            }
        }

        private showTip(pitchId: int): void {

            let cfg: rideMagicShow = RideMagicShowCfg.instance.getCfgByIdAndLv(pitchId, 0);
            let str: string = cfg[petMagicShowFields.getWay];
            let str1: string = "", str2: string = "";
            let j = str.length;
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') {
                    str2 += '+';
                    j = i;
                    continue;
                }
                i < j == true ? str1 += str[i] : str2 += str[i];
            }
            this.tipTxt_1.text = str1;
            this.tipTxt_4.text = str2;

            let numWidth: number = 15;
            for (let i: int = 0, len: int = this.tipBox._childs.length; i < len; i++) {
                numWidth += this.tipBox._childs[i].textWidth;
            }
            let startX: number = (this.tipBox.width - numWidth) / 2;
            this.tipTxt_1.x = startX;
            this.tipTxt_2.x = this.tipTxt_1.x + this.tipTxt_1.textWidth + 5;
            this.tipTxt_3.x = this.tipTxt_2.x + this.tipTxt_2.textWidth + 5;
            this.tipTxt_4.x = this.tipTxt_3.x + this.tipTxt_3.textWidth + 5;
        }

        private totalAttrHandler(): void {
            if (!this._info) return;
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["翅膀幻化总属性",
                    this._info[PetMagicShowFields.fighting],
                    this._info[PetMagicShowFields.attr],
                    RideMagicShowCfg.instance.attrIndices
                ]);
        }

        // 宠物幻化提示
        private tipsHandler(): void {
            CommonUtil.alertHelp(20023);
        }
        // 激活/升星
        private upgrade(): void {
            if (this._countDiff >= 0) {
                IllusionCtrl.instance.riseRideMagicShow([this._selectedId]);
                IllusionModel.instance._rideMagicSelectId = this._selectedId;
            } else
                BagUtil.openLackPropAlert(this._bagItem.itemData[ItemFields.ItemId], -this._countDiff);
        }

        // 更换幻化外观
        private switchHandler(): void {
            let showInfo: MagicShowInfo = MagicWeaponModel.instance.getShowInfoById(this._selectedId);
            console.log("switchHandler", showInfo)
            if (showInfo && showInfo[MagicShowInfoFields.star] > 0) {
                IllusionCtrl.instance.changeRideMagicShow([this._selectedId]);
            }
        }

        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._list.scroll(-100);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._list.scroll(100);
        }
    }
}