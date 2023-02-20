/** 圣装至尊面板*/
namespace modules.extreme {
    import Event = Laya.Event;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import CustomList = modules.common.CustomList;
    import ExtremePanelUI = ui.ExtremeViewUI;
    import CustomClip = modules.common.CustomClip;
    import zhizun_feed = Configuration.zhizun_feed;
    import zhizun_feedFields = Configuration.zhizun_feedFields;
    import BagModel = modules.bag.BagModel;
    import attr = Configuration.attr;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import BaseItem = modules.bag.BaseItem;
    type Postion = {
        x: number,
        y: number
    }
    export class ExtremePanel extends ExtremePanelUI {
        constructor() {
            super();
        }
        private _tween: TweenJS;

        private _attrNameTxts: Array<Text>;
        private _consumables: BaseItem;
        private _property_texts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;
        private _skillEff1: CustomClip;
        private _skillEff2: CustomClip;
        private _challengeClip: CustomClip;
        private _defaultPos: Postion[];
        private _equipItems: ItemRender[]
        private _btnClip: CustomClip;
        /**
         * 史诗装备编号
         */
        private _equipNum: number[] = [15160001, 15160002, 15160003, 15160004, 15160005, 15160006, 15160007, 15160008, 15160009, 15160010]
        public destroy(destroyChild: boolean = true): void {
            this._challengeClip = this.destroyElement(this._challengeClip);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];
            this._property_texts = [this.property_1, this.property_2, this.property_3, this.property_4];

            this._challengeClip = new CustomClip();
            this.itemIcon.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-120, -100, true);
            this._challengeClip.scale(1, 1);
            let name = "extreme_" + (1001)
            this._challengeClip.skin = "assets/effect/extreme/" + name + ".atlas";
            this._challengeClip.frameUrls = [
                name + "/0.png",
                name + "/1.png",
                name + "/2.png",
                name + "/3.png",
                name + "/4.png",
                name + "/5.png",
                name + "/6.png",
                name + "/7.png",
            ];
            this._challengeClip.durationFrame = 10;
            this._challengeClip.play();

            if (!this._skillEff1) {
                this._skillEff1 = CommonUtil.creatEff(this.iconImg_1, `activityEnter`, 15);
                this._skillEff1.scale(1.3, 1.3);
                this._skillEff1.visible = true;
                this._skillEff1.play();

            }
            if (!this._skillEff2) {
                this._skillEff2 = CommonUtil.creatEff(this.iconImg_2, `activityEnter`, 15);
                this._skillEff2.scale(1.3, 1.3);
                this._skillEff2.visible = true;
                this._skillEff2.play();
            }

            if (!this._tween) {
                this._tween = TweenJS.create(this.itemIcon).yoyo(true).repeat(99999999);
                this._tween.to({ y: 200 }, 1200).start().onComplete(() => {
                    this._tween.to({ y: 240 }, 1000).start().onComplete(() => {
                    });
                });
            }
            this._consumables = new BaseItem();
            this._consumables.pos(318, 970);
            this._consumables.scale(0.8, 0.8);
            this._defaultPos = []
            this.itemParents._childs.forEach(element => {
                let temp: Postion = {
                    x: element.x - 8,
                    y: element.y - 20
                }
                this._defaultPos.push(temp)
            });
            this.createEquipItem()
            this.createBtnClip()
            this.addChild(this._consumables);
        }
        // private showSelectTween(defaultPos: Postion[], nodes: ItemRender[], nowsSelect: number, lastSelect: number) {
        //     if (defaultPos.length != nodes.length) {
        //         console.error("参数错误")
        //     }
        //     let movetime: number = 1000;
        //     let temp = Math.abs((lastSelect + 10 - nowsSelect) % 10)
        //     let turnNum: number = temp <= 5 ? temp : 10 - temp;
        //     let turnRight: number = temp <= 5 ? 1 : - 1;
        //     let moveOnetime: number = movetime / turnNum;
        //     console.log("movetime turnNum turnRight moveOnetime", movetime, turnNum, turnRight, moveOnetime ,nowsSelect,lastSelect)
        //     for (let index = 0; index < turnNum; index++) {
        //         for (let i = 0; i < nodes.length; i++) {
        //             let moveTo = Math.abs(((i + lastSelect + 10) + ((index + 1) * turnRight)) % 10)
        //             console.log("移动到哪里", moveTo)
        //             setTimeout(() => {
        //                 TweenJS.create(nodes[i]).to({ x: defaultPos[moveTo].x, y: defaultPos[moveTo].y }, moveOnetime)
        //                     .easing(utils.tween.easing.linear.None)
        //                     .start()
        //             }, moveOnetime * index)
        //         }
        //     }
        // }
        private reSetArrPos(defaultPos: Postion[], nodes: ItemRender[], nowsSelect: number, lastSelect: number) {
            // 公式推演出点击项距离初始位置的距离，Xleft为左边间隔数，Xright为右边间隔数
            let arrLength = nodes.length
            let Xleft = lastSelect - nowsSelect > 0 ? arrLength - lastSelect + nowsSelect : nowsSelect - lastSelect;
            let Xright = arrLength - Xleft;
            let turnNum = Xleft >= Xright ? -Xright : Xleft;

            for (let i = 0; i < arrLength; i++) {
                // LDis是指初始位置据目标点的距离，即index - 0, preDis是值每个当前项要移动的目标项,0是tempArr的默认初始位置
                let Ldis = nowsSelect - 0;
                let preDis = i - Ldis >= 0 ? i - Ldis : arrLength + i - Ldis;
                for (let m = 0; m < Math.abs(turnNum); m++) {
                    let dism = Math.abs(turnNum) - m - 1;
                    let rightTurn = preDis - dism >= 0 ? preDis - dism : arrLength + preDis - dism;
                    let leftTurn = preDis + dism >= arrLength ? preDis + dism - arrLength : preDis + dism;
                    let dis = turnNum > 0 ? leftTurn : rightTurn;
                    setTimeout(() => {
                        TweenJS.create(nodes[i]).to({ x: defaultPos[dis].x, y: defaultPos[dis].y }, 500 / Math.abs(turnNum))
                            .easing(utils.tween.easing.linear.None)
                            .start()
                    }, (m * 500 / Math.abs(turnNum)));
                }
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.upBtn.on(Event.CLICK, this, this.FeedZhizhun);
            this.iconImg_1.on(Event.CLICK, this, this.OpenUpSkil, [0]);
            this.iconImg_2.on(Event.CLICK, this, this.OpenUpSkil, [1]);
            this.unbeatenBtn.on(Event.CLICK, this, this.openSkill);
            this.help_btn.on(Event.CLICK, this, this.helpClick)
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LuxuryEquip_ZhiZun_UPDATE, this, this.selectHandler);
        }
        private OpenUpSkil(type: number) {
            let id = extremeModel.instance.nowsSelect + 1
            WindowManager.instance.openDialog(WindowEnum.LuxuryEquip_ZhiZun_UPGRADE_ALERT, [this.skills[type], id])
        }
        private openSkill() {
            WindowManager.instance.openDialog(WindowEnum.LuxuryEquip_ZhiZun_GRADE_ALERT, extremeModel.instance.skillKing)
        }
        private helpClick() {
            CommonUtil.alertHelp(74701);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.iconImg_1.off(Event.CLICK, this, this.OpenUpSkil);
            this.iconImg_2.off(Event.CLICK, this, this.OpenUpSkil);
            this.upBtn.off(Event.CLICK, this, this.FeedZhizhun);
            this.unbeatenBtn.off(Event.CLICK, this, this.openSkill);
            this.help_btn.off(Event.CLICK, this, this.helpClick)
        }
        // 更新金身信息
        private updateSoulInfo(): void {

        }

        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }
        protected onOpened(): void {
            super.onOpened();
            ExtremeCtrl.instance.GetZhizhunInfo();
        }
        private skills = [[0, 0], [0, 0]]
        //选择某个页签,开放则刷新显示页面
        private selectHandler(): void {
            this.reSetArrPos(this._defaultPos, this._equipItems, extremeModel.instance.nowsSelect, extremeModel.instance.lastSelect);
            if (extremeModel.instance.lastSelect !== extremeModel.instance.nowsSelect) {
                WindowManager.instance.closeAllDialog();
            }
            extremeModel.instance.lastSelect = extremeModel.instance.nowsSelect;
            for (let i = 0; i < 10; i++) {
                this._equipItems[i].data = extremeModel.instance.equipDatas[i];
            }

            this.unbeatenBtn.gray = extremeModel.instance.skillKing[0] == 0;
            let id = extremeModel.instance.nowsSelect + 1
            let item = extremeModel.instance.getIcon(id)
            let name = "extreme_" + (Number(id) + 1000)
            this._challengeClip.skin = "assets/effect/extreme/" + name + ".atlas";
            this._challengeClip.frameUrls = [
                name + "/0.png",
                name + "/1.png",
                name + "/2.png",
                name + "/3.png",
                name + "/4.png",
                name + "/5.png",
                name + "/6.png",
                name + "/7.png",
            ];
            this._challengeClip.play();
            this._skillEff1.play();
            this._skillEff2.play();
            this._consumables.dataSource = [this._equipNum[extremeModel.instance.nowsSelect], 0, 0, null];

            let lev: number = extremeModel.instance.getLevel(id);
            let cfg = ExtremeCfg.instance.getInfo(id, lev)
            let nextCfg = ExtremeCfg.instance.getInfo(id, lev + 1)
            let _powerNum = 0
            this.uoTxt.text ="";
            if (nextCfg != null) {
                let haveCount = BagModel.instance.getItemCountById(nextCfg[zhizun_feedFields.items][0]);
                this.uoTxt.text = haveCount + "/" + nextCfg[zhizun_feedFields.items][1]
                this.upRP.visible = haveCount >= nextCfg[zhizun_feedFields.items][1]
                if (haveCount >= nextCfg[zhizun_feedFields.items][1]) {
                    this._btnClip.play();
                    this._btnClip.visible = true;
                } else {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                if (haveCount >= nextCfg[zhizun_feedFields.items][1]) {
                    this.uoTxt.color = "#ffffff"
                } else {
                    this.uoTxt.color = "#ff0300"
                }
            }

            for (let i = 1; i <= 4; i++) {
                this['liftTxt_' + i].visible = true
                this['upArrImg_' + i].visible = true
            }
            this.upBtn.disabled = false
            if (nextCfg == null) {
                //已满级
                this.setAttr(cfg, cfg)
                _powerNum = Number(cfg[zhizun_feedFields.fighting])
                this.upBtn.disabled = true
                this.upBtn.label = "已满级"
                this.upRP.visible = false
                for (let i = 1; i <= 4; i++) {
                    this['liftTxt_' + i].visible = false
                    this['upArrImg_' + i].visible = false
                }
                this._btnClip.visible = false;
            } else if (cfg == null) {
                //未激活
                cfg = [id, lev, new Array<number>(), new Array<[number, number, number]>(), 0, new Array<attr>()]
                this.upBtn.label = "激活";
                this.setAttr(cfg, nextCfg)
                cfg = nextCfg
            } else {
                this.upBtn.label = "升级";
                this.setAttr(cfg, nextCfg)
                _powerNum = Number(cfg[zhizun_feedFields.fighting])
            }

            this._skillEff1.visible = false;
            this._skillEff2.visible = false;
            let skills = extremeModel.instance.getSkill(id)
            let len = skills.length
            this.iconImg_1.visible = this.iconImg_2.visible = false
            this.iconImg_1.x = len == 2 ? 45 : 180
            for (let i = 1; i <= skills.length; i++) {
                this['skillRp' + i].visible = false;
                this['upskill_' + i].skin = ``
                let skiId = skills[i - 1][0]
                let skiLevel = skills[i - 1][1]
                this.skills[i - 1][0] = skiId
                this.skills[i - 1][1] = skiLevel
                let Ski: skill = skiLevel == 0 ? SkillCfg.instance.getCfgById(Number(skiId) + 1) : SkillCfg.instance.getCfgById(skiId)
                this['iconImg_' + i].visible = true // 最外层控制盒子
                this['icon_' + i].skin = `assets/icon/skill/${Ski[skillFields.icon]}.png` // 技能外观
                this['skillLevel_' + i].text = skiLevel + ""
                this['skillName_' + i].text = Ski[skillFields.name]
                this['skillDesc_' + i].text = Ski[skillFields.shortDes] ? Ski[skillFields.shortDes] : Ski[skillFields.des]
                this['iconImg_' + i].disabled = false
                let skillinfo = ExtremeCfg.instance.getSkillUp(skiId, skiLevel + 1, id)
                if (skillinfo && Number(extremeModel.instance.getLevel(skillinfo[0])) >= Number(skillinfo[1])) {
                    this['upskill_' + i].skin = skiLevel == 0 ? `common/txt_xq_kjh.png` : `common/txt_xq_ksj.png`
                    this['_skillEff' + i].visible = true;
                    this['skillRp' + i].visible = true;
                }
                skillinfo = ExtremeCfg.instance.getSkillUp(skiId, skiLevel, id)
                if (skillinfo && skiLevel > 0) _powerNum += Number(skillinfo[2])
            }
            if (skills.length == 0) {
                let skillEx = ExtremeCfg.instance.getInfo(id, 1)[3]
                len = skillEx.length
                this.iconImg_1.visible = this.iconImg_2.visible = false
                this.iconImg_1.x = len == 2 ? 45 : 180
                for (let i = 1; i <= skillEx.length; i++) {
                    this['skillRp' + i].visible = false;
                    this['upskill_' + i].skin = ``
                    let skiId = skillEx[i - 1][0]
                    let skiLevel = 0
                    let Ski: skill = SkillCfg.instance.getCfgById(skiId)
                    this['iconImg_' + i].visible = true // 最外层控制盒子
                    this['icon_' + i].skin = `assets/icon/skill/${Ski[skillFields.icon]}.png` // 技能外观
                    this['skillLevel_' + i].text = skiLevel + ""
                    this['skillName_' + i].text = Ski[skillFields.name]
                    this['skillDesc_' + i].text = Ski[skillFields.shortDes] ? Ski[skillFields.shortDes] : Ski[skillFields.des]
                    this['iconImg_' + i].disabled = skiLevel == 0
                }

            }
            // `assets/icon/item/10079.png`

            this.powerNum.value = _powerNum + ""
        }

        private playEff() {

        }
        //设置属性加成列表
        private setAttr(cfg: zhizun_feed, nextCfg: zhizun_feed): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._property_texts,
                this._attrNameTxts,
                this._arrowImgs,
                this._upAttrTxts,
                zhizun_feedFields.attrs,
            );
        }

        private FeedZhizhun() {
            let id = extremeModel.instance.nowsSelect + 1
            let lev: number = extremeModel.instance.getLevel(id);
            let nextCfg = ExtremeCfg.instance.getInfo(id, lev + 1)
            let haveCount: number = BagModel.instance.getItemCountById(nextCfg[zhizun_feedFields.items][0]);
            this.uoTxt.text = haveCount + "/" + nextCfg[zhizun_feedFields.items][1]
            if (haveCount < Number(nextCfg[zhizun_feedFields.items][1])) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [nextCfg[zhizun_feedFields.items][0], 0, true]);
            } else {
                ExtremeCtrl.instance.FeedZhizhun(id)
            }
        }

        private createEquipItem() {
            //创建装备item
            let value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            this._equipItems = [];
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                let item: ItemRender;
                if (!item) {
                    item = new ExtremeItem();
                    this.itemParents.addChild(item)
                    let equipPos = Math.abs(extremeModel.instance.nowsSelect + i) % 10
                    item.pos(this._defaultPos[equipPos].x, this._defaultPos[equipPos].y)
                    item.index = i;
                    item.data = extremeModel.instance.equipDatas[i];
                    this._equipItems.push(item)
                }
            }
        }
        // 关闭
        private closeHandler(): void {
            this.close();
        }
        private createBtnClip() {
            this._btnClip = new CustomClip();
            this.upBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.scaleY = 1;
            this._btnClip.scaleX = 0.92;
            this._btnClip.visible = false;
            this._btnClip.pos(-2, -14, true);
        }



    }
}
