/** 技能系统 */


namespace modules.magicArt {
    import MagicArtViewUI = ui.MagicArtViewUI;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import Skill = Protocols.Skill;
    import SkillFields = Protocols.SkillFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PlayerModel = modules.player.PlayerModel;
    import BagUtil = modules.bag.BagUtil;
    import CommonUtil = modules.common.CommonUtil;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class MagicArtPanel extends MagicArtViewUI {

        // 切页按钮组
        private _tabGroup: BtnGroup;
        private _scienceTabGroup: BtnGroup;
        private _iconImgGroup: BtnGroup;
        private _iconImgs: Array<Image>;
        private _skillNamesTxt: Array<Text>;
        private _skillLevelsTxt: Array<Text>;
        private _skillProgressTxt: Array<Text>;
        private _skillProgressImg: Array<Image>;
        private _skillSelectImg: Array<Image>;
        private _skillProgressUnderImg: Array<Image>;
        private _skillLevelUnderImg: Array<Image>;
        private _skillRedImg: Array<Image>;
        private _skillOpenDesTxt: Array<Text>;
        private _list: CustomList;
        private _scienceSelectIndex: number;
        private _showId: Array<number>;  //可显示内容的id  绝学
        private _showInfoId: number;   //当前显示内容的id  绝学
        private _btnClip: CustomClip;
        private _trainSuccessClip: Array<CustomClip>;
        private _levelUpCost: number;

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._btnClip = this.destroyElement(this._btnClip);
            this._tabGroup = this.destroyElement(this._tabGroup);
            this._scienceTabGroup = this.destroyElement(this._scienceTabGroup);
            this._iconImgGroup = this.destroyElement(this._iconImgGroup);
            this._trainSuccessClip = this.destroyElement(this._trainSuccessClip);
            this._iconImgs = this.destroyElement(this._iconImgs);
            this._skillNamesTxt = this.destroyElement(this._skillNamesTxt);
            this._skillLevelsTxt = this.destroyElement(this._skillLevelsTxt);
            this._skillProgressTxt = this.destroyElement(this._skillProgressTxt);
            this._skillProgressImg = this.destroyElement(this._skillProgressImg);
            this._skillSelectImg = this.destroyElement(this._skillSelectImg);
            this._skillProgressUnderImg = this.destroyElement(this._skillProgressUnderImg);
            this._skillLevelUnderImg = this.destroyElement(this._skillLevelUnderImg);
            this._skillRedImg = this.destroyElement(this._skillRedImg);
            this._skillOpenDesTxt = this.destroyElement(this._skillOpenDesTxt);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._tabGroup = new BtnGroup();
            this._scienceTabGroup = new BtnGroup();
            this._iconImgGroup = new BtnGroup();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 649;
            this._list.height = 761;
            this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.itemRender = magicArtItem;
            this._list.x = 0;
            this._list.y = 0;
            this._btnClip = new CustomClip();
            this._trainSuccessClip = new Array<CustomClip>();
            this.oneKeyBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.pos(-5, -17, true);
            this._btnClip.scaleY = 1.2;
            this._iconImgGroup.setBtns(this.skillIcon3, this.skillIcon4, this.skillIcon5, this.skillIcon6, this.skillIcon7, this.skillIcon0, this.skillIcon1, this.skillIcon2);
            this._iconImgs = [this.skillIcon3, this.skillIcon4, this.skillIcon5, this.skillIcon6, this.skillIcon7, this.skillIcon0, this.skillIcon1, this.skillIcon2];
            this._skillNamesTxt = [this.skillName3, this.skillName4, this.skillName5, this.skillName6, this.skillName7, this.skillName0, this.skillName1, this.skillName2];
            this._skillLevelsTxt = [this.skillLevelTxt3, this.skillLevelTxt4, this.skillLevelTxt5, this.skillLevelTxt6, this.skillLevelTxt7, this.skillLevelTxt0, this.skillLevelTxt1, this.skillLevelTxt2];
            this._skillProgressTxt = [this.skillProgressTxt3, this.skillProgressTxt4, this.skillProgressTxt5, this.skillProgressTxt6,
            this.skillProgressTxt7, this.skillProgressTxt0, this.skillProgressTxt1, this.skillProgressTxt2];
            this._skillProgressImg = [this.skillProgressImg3, this.skillProgressImg4, this.skillProgressImg5, this.skillProgressImg6,
            this.skillProgressImg7, this.skillProgressImg0, this.skillProgressImg1, this.skillProgressImg2];
            this._skillSelectImg = [this.skillSelect3, this.skillSelect4, this.skillSelect5, this.skillSelect6, this.skillSelect7, this.skillSelect0, this.skillSelect1, this.skillSelect2];
            this._skillProgressUnderImg = [this.skillProgress3, this.skillProgress4, this.skillProgress5, this.skillProgress6, this.skillProgress7, this.skillProgress0, this.skillProgress1, this.skillProgress2];
            this._skillLevelUnderImg = [this.skillLevelUnder3, this.skillLevelUnder4, this.skillLevelUnder5, this.skillLevelUnder6,
            this.skillLevelUnder7, this.skillLevelUnder0, this.skillLevelUnder1, this.skillLevelUnder2];
            this._skillRedImg = [this.skillRed3, this.skillRed4, this.skillRed5, this.skillRed6, this.skillRed7, this.skillRed0, this.skillRed1, this.skillRed2];
            this._tabGroup.setBtns(this.knowledgeBtn, this.scienceBtn);
            this._skillOpenDesTxt = [this.skillOpenDes3, this.skillOpenDes4, this.skillOpenDes5, this.skillOpenDes6, this.skillOpenDes7, this.skillOpenDes0, this.skillOpenDes1, this.skillOpenDes2];
            this._scienceTabGroup.setBtns(this.famineBtn, this.oldGodBtn, this.turnBirthBtn);
            this.listShow.addChild(this._list);
            this.initTrainSuccess();

            this.regGuideSpr(GuideSpriteId.MAGIC_ART_ONE_KEY_BTN, this.oneKeyBtn);
        }

        private initTrainSuccess(): void {
            let posArr: Array<[number, number]> = [[116, 130], [301, 118], [486, 131], [298, 315], [121, 499], [297, 499], [490, 499], [303, 687]];
            for (let i = 0; i < posArr.length; i++) {
                this._trainSuccessClip[i] = new CustomClip();
                this.kownledgeShow.addChild(this._trainSuccessClip[i]);
                this._trainSuccessClip[i].skin = "assets/effect/xiu_lian.atlas";
                this._trainSuccessClip[i].frameUrls = ["xiu_lian/0.png", "xiu_lian/1.png", "xiu_lian/2.png", "xiu_lian/3.png", "xiu_lian/4.png", "xiu_lian/5.png",
                    "xiu_lian/6.png", "xiu_lian/7.png", "xiu_lian/8.png", "xiu_lian/9.png", "xiu_lian/10.png", "xiu_lian/11.png"];
                this._trainSuccessClip[i].durationFrame = 5;
                this._trainSuccessClip[i].loop = false;
                this._trainSuccessClip[i].pos(posArr[i][0], posArr[i][1], true);
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._iconImgGroup, common.LayaEvent.CHANGE, this, this.selectTabHandler);
            this.addAutoListener(this._tabGroup, common.LayaEvent.CHANGE, this, this.changeTabHandler);
            this.addAutoListener(this._scienceTabGroup, common.LayaEvent.CHANGE, this, this.changeScienceTabHandler);
            this.addAutoListener(this.levelUpBtn, common.LayaEvent.CLICK, this, this.levelUpHandler);
            this.addAutoListener(this.oneKeyBtn, common.LayaEvent.CLICK, this, this.oneKeyHandler);
            this.addAutoListener(BottomTabCtrl.instance.tab, common.LayaEvent.CHANGE, this, this.changeMenuHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SKILL_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_ZQ, this, this.knowledgeUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_ZQ, this, this.updateZQ);

            this.addAutoRegisteRedPoint(this.point_red, ["magicArtRP"]);
            this.addAutoRegisteRedPoint(this._btnClip, ["magicArtRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this._tabGroup.selectedIndex = 0;
            this._scienceTabGroup.selectedIndex = 0;
            this._scienceSelectIndex = 0;
            this._btnClip.play();
            this.updateZQ();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (!value) value = 0;
            for (let i = 0; i < this._skillSelectImg.length; i++) {
                this._skillLevelsTxt[i].visible = this._skillProgressImg[i].visible = this._skillLevelUnderImg[i].visible = false;
                this._skillRedImg[i].visible = this._skillNamesTxt[i].visible = false;
                this._skillProgressTxt[i].visible = this._skillProgressUnderImg[i].visible = this._skillSelectImg[i].visible = false;
                let rowSkillId = MagicArtModel.instance.getRowSkillId(i);
                let skillInfo: skill = MagicArtModel.instance.getCfgById(rowSkillId * 10000 + 1);
                let skillTrainInfo: skillTrain = MagicArtModel.instance.getKnowledgeInfoById(rowSkillId * 10000 + 1);
                this._skillOpenDesTxt[i].text = skillTrainInfo[skillTrainFields.show_condition];   //设置condition
                this._iconImgs[i].skin = `assets/icon/skill/${skillInfo[skillFields.icon]}.png`;   //设置技能图片
                this._iconImgs[i].disabled = true;
            }
            this.knowledgeHandler();
            if (this._showId) {
                let index = this._showId[value] % 1000 - 1;
                if (this._skillSelectImg[index])
                    this._skillSelectImg[index].visible = true;
                this.setKnowledgeInfo(true, this._showId[value]);
            }

            this._tabGroup.selectedIndex = 0;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_ART_OPEN);
        }

        //更新魔力
        private updateZQ(): void {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let haveNum: number = attr[ActorBaseAttrFields.zq];
            let needNum: number = (this._levelUpCost ? this._levelUpCost : 0);
            if (attr) {
                this.levelUpCostTxt.text = `${haveNum}/${needNum}`;
                this.levelUpCostTxt.color = needNum <= haveNum ? '#ffffff' : `#ff0c00`;
            }
        }

        //重写父类close方法
        public close(): void {
            super.close();
        }

        //绝学中8个选项的选择框
        private selectTabHandler(): void {
            if (this._showId) {
                for (let i = 0; i < this._showId.length; i++) {
                    let index = this._showId[i] % 1000 - 1;
                    if (this._iconImgGroup.selectedIndex == index) {
                        for (let j = 0; j < this._skillSelectImg.length; j++) {
                            this._skillSelectImg[j].visible = false;
                        }
                        this._skillSelectImg[this._iconImgGroup.selectedIndex].visible = true;
                        this.setKnowledgeInfo(true, this._showId[i]);
                        WindowManager.instance.open(WindowEnum.MAGIC_ART_ALERT, this._showId[i]);
                        break;
                    }
                }
            }
        }

        //相应按钮切换
        private changeTabHandler(): void {
            switch (this._tabGroup.selectedIndex) {
                case 0:     // 绝学
                    this.knowledgeHandler();
                    break;
                case 1:     // 秘术
                    this._scienceTabGroup.selectedIndex = 0;
                    this._scienceSelectIndex = 0;
                    this.scienceHandler();
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._list);
                    break;
            }
        }

        //秘术按钮切换
        private changeScienceTabHandler(): void {
            switch (this._scienceTabGroup.selectedIndex) {
                case 0:     // 大荒秘术
                    this._scienceSelectIndex = 0;
                    break;
                case 1:     // 古神秘术
                    this._scienceSelectIndex = 1;
                    break;
                case 2:     //觉醒秘术
                    this._scienceSelectIndex = 2;
                    break;
            }
            this.scienceUpdate();
        }

        //更新信息
        private updateInfo(): void {
            this.knowledgeUpdate();
            this.scienceUpdate();
        }

        //显示绝学信息
        private knowledgeHandler(): void {
            this.kownledgeShow.visible = true;
            this.scienceShow.visible = false;
            this.knowledgeUpdate();
        }

        //显示秘术信息
        private scienceHandler(): void {
            this.kownledgeShow.visible = false;
            this.scienceShow.visible = true;
            this.scienceUpdate();
        }

        //更新绝学信息
        private knowledgeUpdate(): void {
            let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
            this._showId = new Array<number>();
            for (let i = 0; i < haveKnowledge.length; i++) {
                let knowledgeSkillId = haveKnowledge[i][SkillFields.skillId];
                let index = knowledgeSkillId % 1000 - 1;
                let level = haveKnowledge[i][SkillFields.level];
                this._skillOpenDesTxt[index].visible = false;
                this._skillLevelsTxt[index].visible = this._skillLevelUnderImg[index].visible = this._skillProgressImg[index].visible = true;
                this._skillProgressTxt[index].visible = this._skillProgressUnderImg[index].visible = this._skillNamesTxt[index].visible = true;
                if (MagicArtModel.instance.hasLevelUp[index]) {
                    this._trainSuccessClip[index].play();
                    this._trainSuccessClip[index].visible = true;
                    MagicArtModel.instance.hasLevelUp[index] = false;
                    this._trainSuccessClip[index].on(Event.COMPLETE, this, this.effectHandler);
                } else {
                    this._trainSuccessClip[index].stop();
                    this._trainSuccessClip[index].visible = false;
                }
                let maxLevel = MagicArtModel.instance.maxLevel;
                this._skillProgressTxt[index].text = `${level}/${maxLevel}`;   //设置进度显示
                let pro = (level / maxLevel)
                if (pro > 1) pro = 1
                this._skillProgressImg[index].width = (pro) * 116;  //设置进度条
                this._skillLevelsTxt[index].text = level.toString();//设置等级显示
                this._iconImgs[index].disabled = false;
                if (MagicArtModel.instance.checkLevelUp(i) && level < maxLevel) {
                    this._skillRedImg[index].visible = true;
                } else {
                    this._skillRedImg[index].visible = false;
                }
                this._skillNamesTxt[index].text = MagicArtModel.instance.getKnowledgeInfoById(knowledgeSkillId * 10000 + level)[skillTrainFields.name];//显示名称
                this._showId.push(knowledgeSkillId);
            }
            this.setKnowledgeInfo(false);
            this.powerNum.value = MagicArtModel.instance._fighting.toString();
        }

        private effectHandler(index: number) {
            for (let i = 0; i < this._trainSuccessClip.length; i++) {
                this._trainSuccessClip[i].off(Event.COMPLETE, this, this.effectHandler);
                this._trainSuccessClip[i].visible = false;
            }
        }

        //设置绝学单个内容显示信息
        private setKnowledgeInfo(isChange: boolean, id?: number): void {
            // this.HaveRedPoint()
            if (isChange) {
                this._showInfoId = id;
            }
            let canOneKey: boolean = false;
            if (this._showInfoId) {
                let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
                let level: number = 0;
                for (let i = 0; i < haveKnowledge.length; i++) {
                    if (this._showInfoId == haveKnowledge[i][SkillFields.skillId]) {
                        level = haveKnowledge[i][SkillFields.level];
                        let enoughtZQ = MagicArtModel.instance.checkLevelUp(i);
                        if (enoughtZQ) {
                            this.levelUpCostTxt.color = '#ffffff';
                        } else {
                            this.levelUpCostTxt.color = '#ff0c00';
                        }
                        break;
                    }
                }

                let cfg: skillTrain = MagicArtModel.instance.getKnowledgeInfoById(this._showInfoId * 10000 + level);
                // this.skillInfoTxt.text = cfg[skillTrainFields.name] + ' Lv.' + `${level}`;
                this._levelUpCost = cfg[skillTrainFields.zq];
                this.updateZQ();
                let skillInfo: skill = MagicArtModel.instance.getCfgById(this._showInfoId * 10000 + level);
                // this.skillDescribeTxt.text = skillInfo[skillFields.des]    //设置描述
            }
        }

        //更新秘术信息
        private scienceUpdate(): void {
            let allInfo: Array<skillTrain> = MagicArtModel.instance.getScienceCfg(this._scienceSelectIndex + 1);
            let infos: Array<skillTrain> = this.resortInfo(allInfo, this._scienceSelectIndex + 1);
            MagicArtModel.instance.setScienceCfgBySort(this._scienceSelectIndex + 1, infos);
            this._list.datas = infos;
        }

        //根据是否开启重新排序
        private resortInfo(infos: Array<skillTrain>, type: number): Array<skillTrain> {
            let haveScience: Array<number> = MagicArtModel.instance._scienceSkill;
            let hasGet: Array<skillTrain> = new Array<skillTrain>();
            for (let i = 0; i < haveScience.length; i++) {
                for (let j = 0; j < infos.length; j++) {
                    let id = Math.floor(infos[j][skillTrainFields.id] / 10000);
                    if (haveScience[i] == id) {
                        hasGet.push(infos[j]);
                        infos.splice(j, 1);
                        break;
                    }
                }
            }
            let allInfos: Array<skillTrain> = new Array<skillTrain>();
            allInfos = hasGet.concat(infos);
            return allInfos;
        }

        //进行升级
        private levelUpHandler(): void {
            if (this._levelUpCost > PlayerModel.instance.getCurrencyById(MoneyItemId.zq)) {
                BagUtil.openLackPropAlert(MoneyItemId.zq, 1);
            }
            let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
            for (let i = 0; i < haveKnowledge.length; i++) {
                if (haveKnowledge[i][SkillFields.skillId] == this._showInfoId) {
                    if (haveKnowledge[i][SkillFields.level] < MagicArtModel.instance.maxLevel) {
                        MagicArtCtrl.instance.addSkillLevel(this._showInfoId);
                        return;
                    } else {
                        if (haveKnowledge[i][SkillFields.level] == config.AmuletRiseCfg.instance.maxLv) {
                            CommonUtil.noticeError(ErrorCode.MagicArtMaxLevel);
                        } else {
                            SystemNoticeManager.instance.addNotice(`技能等级达到上限，提升圣物属性可突破上限`, true);
                        }
                        return;
                    }
                }
            }
            SystemNoticeManager.instance.addNotice("需先激活技能才可升级", true);
        }

        //一键升级
        private oneKeyHandler(): void {


            let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
            if (haveKnowledge.length == 0) {
                SystemNoticeManager.instance.addNotice("需先激活技能才可升级", true);
                return;
            }
            let isMax = true;
            for (let i = 0; i < haveKnowledge.length; i++) {
                let lv: number = haveKnowledge[i][SkillFields.level];
                if (lv < MagicArtModel.instance.maxLevel) {
                    isMax = false;
                    let skillId: number = haveKnowledge[i][SkillFields.skillId];
                    let cfg: skillTrain = MagicArtModel.instance.getKnowledgeInfoById(skillId * 10000 + lv);
                    let needNum: number = cfg[skillTrainFields.zq];
                    if (needNum <= PlayerModel.instance.getCurrencyById(MoneyItemId.zq)) {
                        MagicArtCtrl.instance.addSkillLevelOfAll();
                        return;
                    }
                }
            }

            if (MagicArtModel.instance.maxLevel == config.AmuletRiseCfg.instance.maxLv) {
                CommonUtil.noticeError(ErrorCode.MagicArtMaxLevel);
            } else if (isMax) {
                SystemNoticeManager.instance.addNotice(`技能等级达到上限，提升圣物属性可突破上限`, true);
            } else {
                BagUtil.openLackPropAlert(MoneyItemId.zq, 1);
            }
        }

        //下方选择按钮设置
        private changeMenuHandler(): void {
            switch (BottomTabCtrl.instance.tab.selectedIndex) {
                case 0:
                    break;
                default:
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.amulet)) {
                        WindowManager.instance.open(WindowEnum.TALISMAN_PANEL);
                    } else {
                        SystemNoticeManager.instance.addNotice("功能未开启", true);
                    }
                    BottomTabCtrl.instance.tab.selectedIndex = 0;
            }
        }

        //关闭界面
        private closeHandler(): void {

            this.close();
        }
    }
}
