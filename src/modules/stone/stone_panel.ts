///<reference path="../config/stone_cfg.ts"/>
///<reference path="../bottom_tab/bottom_tab.ts"/>
///<reference path="../bag/bag_item.ts"/>
///<reference path="../intensive/intensive_model.ts"/>
///<reference path="../vip/vip_model.ts"/>
///<reference path="../config/privilege_cfg.ts"/>

namespace modules.stone {
    import WindowManager = modules.core.WindowManager;
    import StoneUI = ui.StoneUI;
    import Dictionary = Laya.Dictionary;
    import PlayerModel = modules.player.PlayerModel;
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import StoneCfg = modules.config.StoneCfg;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import gemRiseFields = Configuration.gemRiseFields;
    import BagModel = modules.bag.BagModel;
    import gemRefineFields = Configuration.gemRefineFields;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import Image = Laya.Image;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import TableUtils = utils.TableUtils;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class StonePanel extends StoneUI {

        // private _scheEffect: CustomClip;   //大师进度特效
        private _upGradeStone: Array<CustomClip>; //石头升级特效
        private _currEqiup: int;   //当前选中的装备
        private _keysArr: number[];
        private _partDic: Dictionary;  //部位字典
        private _equipPos: Array<[number, number]>;  //装备位置
        private _stoneDia: StoneDialog;
        private _cenItem: BaseItem;  //中间位置的item
        private _recordLev: Table<string>;  //等级存放
        private _currFrame: Image;    //装备的选中框
        private _strIndex: Table<number>;
        private _btnClip: CustomClip;  //按钮特效
        private _tween: TweenJS;
        private _skeleton: Laya.Skeleton;

        protected initialize(): void {

            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._currEqiup = 1;

            this.effectInit();

            this._recordLev = {};

            this._cenItem = new BaseItem();
            this._cenItem.valueDisplay = false;
            this._cenItem.pos(310, 646);
            this._cenItem.setNum("", "#ffffff");

            this.addChild(this._cenItem);

            // 流水特效生成
            this.initEffectBg();

            this._keysArr = [];

            this._stoneDia = new StoneDialog();

            this._partDic = new Dictionary();

            this._equipPos = new Array<[number, number]>();
            this._equipPos.push([49, 245], [49, 365], [49, 486], [49, 605], [49, 725],
                [569, 245], [569, 365], [569, 486], [569, 605], [569, 725]);

            this.pit_0.type = 0;
            this.pit_1.type = 1;
            this.pit_2.type = 2;
            this.pit_3.type = 3;
            this.pit_4.type = 4;

            this._strIndex = {};

            let needVipLv: number = config.PrivilegeCfg.instance.getOpenFuncByType(Privilege.gemGridOpen);
            this.vipTxt.text = `SVIP${needVipLv}专属`;
            this._tween = TweenJS.create(this.nowLevImg).yoyo(true).onComplete(() => { this.nowLevImg.scale(1, 1, true) });
            this.regGuideSpr(GuideSpriteId.STONE_ONE_KEY_BTN, this.oneKeyBtn);
        }

        private initEffectBg() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this.conBg.addChild(this._skeleton);
            this._skeleton.pos(56, 0);
            this._skeleton.load("res/skeleton/wave/UI_duanzao_Ball3.sk", Laya.Handler.create(this, () => {
                this._skeleton.play(0, true);
            }));
        }


        public destroy(): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            // this._scheEffect = this.destroyElement(this._scheEffect);
            this._stoneDia = this.destroyElement(this._stoneDia);
            this._cenItem = this.destroyElement(this._cenItem);
            this._currFrame = this.destroyElement(this._currFrame);
            this._btnClip = this.destroyElement(this._btnClip);
            this._upGradeStone = this.destroyElement(this._upGradeStone);

            if (this._partDic) {
                let values = this._partDic.values;
                for (let e of values) {
                    e.destroy(true);
                }
                this._partDic = null;
            }
            if (this._skeleton) {
                this._skeleton = this.destroyElement(this._skeleton);
            }

            this._keysArr.length = 0;
            this._equipPos.length = 0;
            TableUtils.clear(this._recordLev);
            this._recordLev = null;
            TableUtils.clear(this._strIndex);
            this._strIndex = null;

            super.destroy();
        }

        public close(): void {
            if (this._tween) {
                this._tween.stop();
            }
            super.close();
            if (this._stoneDia) {
                this._stoneDia.close();
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.addTipsBtn2, common.LayaEvent.CLICK, this, this.addTipsBtnHandler, [1]);
            this.addAutoListener(this.addTipsBtn3, common.LayaEvent.CLICK, this, this.addTipsBtnHandler, [2]);
            for (let i: int = 0, len: int = this._upGradeStone.length; i < len; i++) {
                this.addAutoListener(this._upGradeStone[i], common.LayaEvent.COMPLETE, this, this.closeEff, [i]);
            }
            this.addAutoListener(BottomTabCtrl.instance.tab, common.LayaEvent.CHANGE, this, this.selectPanel);
            this.addAutoListener(this.about, common.LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.masterImg, common.LayaEvent.CLICK, this, this.openMaster);
            this.addAutoListener(this.compoundTxt, common.LayaEvent.CLICK, this, this.openComposePanel);
            this.addAutoListener(this.getTxt, common.LayaEvent.CLICK, this, this.getWay);
            this.addAutoListener(this.oneKeyBtn, common.LayaEvent.CLICK, this, this.oneKeyBtnHandler);
            this.addAutoListener(this.maskImg, common.LayaEvent.CLICK, this, this.maskImgHandler);
            for (let i: int = 0, len: int = this._partDic.keys.length; i < len; i++) {
                this.addAutoListener(this._partDic.get(this._partDic.keys[i]), common.LayaEvent.CLICK, this, this.itemClickHandler, [this._partDic.keys[i]]);
            }

            GlobalData.dispatcher.once(CommonEventType.GET_EQUIP, this, this.searchOne);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updataStonePit);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UP_EFFECT, this, this.playUpEff);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ONEKEY_UP_EFFECT, this, this.playOneKeyUpEff);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UP_MASTER, this, this.upMaster);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.vipPitHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.STONE_UPDATA, this, this.master);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_PIT, this, this.openUpGradeView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.showAddTipsBtn);//戒指和项链的加号

            let len = this.equipBgBox._childs.length
            for (let index = 0; index < len; index++) {
                this.addAutoListener(this.equipBgBox._childs[index], Event.CLICK, this, this.equipBgBoxClickHandler);
            }

            this.compoundTxt[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.getTxt[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.masterImg[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
        }

        protected removeListeners(): void {
            GlobalData.dispatcher.off(CommonEventType.GET_EQUIP, this, this.searchOne);
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();

            this.equipInitedHandler();
            this.searchOne();
            this.vipPitHandler();
            this.showAddTipsBtn(); //戒指加号

            // this._scheEffect.play();
            this._btnClip.play();

            for (let i: int = 0, len: int = this._upGradeStone.length; i < len; i++) {
                this._upGradeStone[i].visible = false;
            }
        }

        private addTipsBtnHandler(type: number): void {
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoEquip)) {
                let str = "戒指";
                switch (type) {
                    case 0:
                        str = "手镯";
                        break;
                    case 1:
                        str = "戒指";
                        break;
                    case 2:
                        str = "玉佩";
                        break;
                    default:
                        break;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(`${str}可通过探索获得`, true);
            } else {
                WindowManager.instance.open(WindowEnum.TREASURE_PANEL);
            }
        }

        private vipPitHandler(): void {

            let _id: number = StoneModel.instance.getValueByPart().get(this._currEqiup * 10);

            if (StoneModel.instance.vipIsOpen) {  //vip功能开启
                this.maskImg.visible = this.lockImg.visible = false;
                this.pit_0.addImg.visible = !_id;
            } else {
                this.maskImg.visible = this.lockImg.visible = true;
                this.pit_0.redImg.visible = this.pit_0.addImg.visible = false;
            }
        }

        private openComposePanel(): void {
            WindowManager.instance.open(WindowEnum.COMPOSE_PANEL, [0]);
        }

        private getWay(): void {
            //获取途径
            WindowManager.instance.open(WindowEnum.USUAL_STORE_PANEL, "stoneSkin");
        }

        private selectPanel(): void {
            if (BottomTabCtrl.instance.tab.selectedIndex == 0)
                WindowManager.instance.open(WindowEnum.INTENSIVE_PANEL);
        }

        private oneKeyBtnHandler() {

            if (!this._strIndex[this._currEqiup]) {
                SystemNoticeManager.instance.addNotice("当前无可操作的徽章", true);
            } else {
                StoneCtrl.instance.oneKeyHandler([this._currEqiup, this._strIndex[this._currEqiup] - 1]);
                // this.itemClickHandler
                // for (let i: int = 0, len: int = this._keysArr.length; i < len; i++) {
                // }
                if (this._strIndex[this._currEqiup] == 0) {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong11.png");
                } else if (this._strIndex[this._currEqiup] == 1) {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong11.png");
                } else if (this._strIndex[this._currEqiup] == 2) {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong9.png");
                } else if (this._strIndex[this._currEqiup] == 3) {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong10.png");
                }
            }
        }

        //部位的监听
        private itemClickHandler(index: int): void {
            this._currEqiup = index;
            StoneModel.instance.currEqiup = this._currEqiup;
            this.partName.text = CommonUtil.getNameByPart(this._currEqiup);
            (this._partDic.get(this._currEqiup) as BaseItem).addChildAt(this._currFrame, 1);
            this.select();
        }

        //特效初始化
        private effectInit(): void {

            // this._scheEffect = CommonUtil.creatEff(this.con, `wave`, 7);
            // this._scheEffect.play();
            // this._scheEffect.pos(-10, 100, true);

            this._btnClip = CommonUtil.creatEff(this.oneKeyBtn, `btn_light`, 15);
            this._btnClip.play();
            this._btnClip.pos(-5, -18);
            this._btnClip.scaleY = 1.2;
            this._btnClip.visible = false;

            this._upGradeStone = new Array<CustomClip>();
            for (let i: int = 0; i < 5; i++) {
                let eff: CustomClip = new CustomClip();
                this._upGradeStone[i] = eff;
                this.addChild(eff);
                eff.skin = "assets/effect/activate.atlas";
                eff.frameUrls = ["activate/0.png", "activate/1.png", "activate/2.png", "activate/3.png"];
                eff.durationFrame = 5;
                eff.loop = false;
            }

            for (let i: int = 0; i < 5; i++) {
                if (i == 0)
                    this._upGradeStone[0].pos(230, 762);
                else if (i == 1)
                    this._upGradeStone[1].pos(143, 480);
                else if (i == 2)
                    this._upGradeStone[2].pos(315, 480);
                else if (i == 3)
                    this._upGradeStone[3].pos(87, 644);
                else if (i == 4)
                    this._upGradeStone[4].pos(370, 644);
            }
        }

        //仙石大师弹框
        private openMaster(): void {
            WindowManager.instance.openDialog(WindowEnum.STONE_MASTER_DIALOG, 0);
        }

        //宝石可升级的弹窗
        private openUpGradeView(): void {

            if (!this._stoneDia) {
                this._stoneDia = new StoneDialog();
            }
            this.addChild(this._stoneDia);
            this._stoneDia.setOpenParam(StoneModel.instance.currStonePic);
        }

        //面板更新
        private updataStonePit(): void {

            this.powerNum.value = StoneModel.instance.otherValue[2].toString();
            this.master();
            this.select();
        }

        //面板的切换
        private select(): void {

            //初始化等级
            for (let i: int = 1; i <= 10; i++) {
                let _partLev: number = 0;
                for (let j: int = 0; j < 5; j++) {
                    let _id: number = StoneModel.instance.getValueByPart().get(i * 10 + j);
                    if (_id != null)
                        _partLev += StoneCfg.instance.getCfgById(_id)[gemRefineFields.level];
                }
                if (this._partDic.get(i)) {
                    if (_partLev == 0) this._recordLev[i] = "";
                    else {
                        this._partDic.get(i).setNum((_partLev + "级"), "#ffffff");
                        this._recordLev[i] = (_partLev + "级");
                    }
                }
            }

            if (this._currEqiup && this._partDic.keys.length != 0) {
                this._cenItem.dataSource = (this._partDic.get(this._currEqiup) as BaseItem).itemData;
                this._cenItem.setNum(this._recordLev[this._currEqiup], "#ffffff");
            }

            //装备可操作具体状态 红点
            for (let i: int = 0, len: int = this._keysArr.length; i < len; i++) {       //哪几个装备
                (this._partDic.get(this._keysArr[i]).getChildByName("redImg") as Image).visible = false;
                this._partDic.get(this._keysArr[i]).hintTxt.text = "";
                this._strIndex[this._keysArr[i]] = 0;
                for (let j: int = 0; j < 5; j++) {                              //每一个宝石槽
                    let _id: number = StoneModel.instance.getValueByPart().get(this._keysArr[i] * 10 + j);
                    if (_id == null)   //如果没有宝石   但是背包有多余宝石
                    {
                        if (j == 0 && StoneModel.instance.vipIsOpen) {
                            if (BagModel.instance.getItemsByBagId(BagId.stoneType).length > 0) {
                                (this._partDic.get(this._keysArr[i]).getChildByName("redImg") as Image).visible = true;
                                this._strIndex[this._keysArr[i]] = 1;
                                this._partDic.get(this._keysArr[i]).hintTxt.text = "可镶嵌";
                                break;
                            }
                        } else {
                            if (StoneModel.instance.getStonesByType(j).length > 0) {
                                (this._partDic.get(this._keysArr[i]).getChildByName("redImg") as Image).visible = true;
                                this._strIndex[this._keysArr[i]] = 1;
                                this._partDic.get(this._keysArr[i]).hintTxt.text = "可镶嵌";
                                break;
                            }
                        }
                    } else {  //如果有宝石,并且可以升级或替换更高级的

                        //如果能替换成高级石头

                        let stones: Array<Item> = null;
                        if (j == 0 && StoneModel.instance.vipIsOpen) {
                            stones = BagModel.instance.getItemsByBagId(BagId.stoneType).concat();
                        } else {
                            stones = StoneModel.instance.getStonesByType(StoneCfg.instance.getCfgById(_id)[gemRefineFields.type]).concat();
                        }
                        stones = stones.sort(StoneModel.instance.sortStones);
                        for (let l: int = 0; l < stones.length; l++) {
                            //如果有高等级的
                            if (StoneCfg.instance.getCfgById(stones[l][ItemFields.ItemId])[gemRefineFields.level] > StoneCfg.instance.getCfgById(_id)[gemRefineFields.level]) {
                                (this._partDic.get(this._keysArr[i]).getChildByName("redImg") as Image).visible = true;
                                this._strIndex[this._keysArr[i]] = 2;
                                this._partDic.get(this._keysArr[i]).hintTxt.text = "可替换";
                                break;
                            }
                        }

                        //如果能合成升级
                        if (StoneCfg.instance.getCfgById(_id)[gemRefineFields.level] != StoneCfg.instance.stoneMaxLv) {
                            if (BagModel.instance.getItemCountById(_id) + 1 >= StoneCfg.instance.getCfgById(_id)[gemRefineFields.refine_count]) {
                                (this._partDic.get(this._keysArr[i]).getChildByName("redImg") as Image).visible = true;
                                if (this._strIndex[this._keysArr[i]] == 2) {

                                } else {
                                    this._strIndex[this._keysArr[i]] = 3;
                                    this._partDic.get(this._keysArr[i]).hintTxt.text = "可升级";
                                }
                            }
                        }
                    }
                }
            }
            this._btnClip.visible = true;
            if (this._strIndex[this._currEqiup] == 0) {
                this.oneKeyBtn.label = "一键镶嵌";
                this._btnClip.visible = false;
            } else if (this._strIndex[this._currEqiup] == 1) {
                this.oneKeyBtn.label = "一键镶嵌";
            } else if (this._strIndex[this._currEqiup] == 2) {
                this.oneKeyBtn.label = "一键替换";
            } else if (this._strIndex[this._currEqiup] == 3) {
                this.oneKeyBtn.label = "一键升级";
            }

            this.vipPitHandler();
        }

        //寻找第一个可操作的
        private searchOne(): void {

            if (this._keysArr.length == 0) return;
            for (let i: int = 0, len: int = this._keysArr.length; i < len; i++) {
                if (((this._partDic.get(this._keysArr[i]) as BaseItem).getChildByName("redImg") as Image).visible) {
                    this.itemClickHandler(this._keysArr[i]);
                    return;
                }
            }
            this._currEqiup = this._keysArr[0];
            this.itemClickHandler(this._currEqiup);
        }

        //仙石大师
        private master(): void {
            let maxY = 100;
            this.levTxt.text = "徽章镶嵌大师" + StoneModel.instance.otherValue[0] + "阶";

            //没有满级
            if (StoneModel.instance.otherValue[0] != StoneCfg.instance.maxLv) {

                let needLev: number = StoneCfg.instance.getUpStoneByLev(StoneModel.instance.otherValue[0])[gemRiseFields.refine_level];

                //可以升级的时候
                if (StoneModel.instance.otherValue[1]) {
                    this.redImg.visible = true;
                    // this._scheEffect.y = -15;
                } else  //不能升级的时候
                {
                    this.redImg.visible = false;

                    //比例
                    let ratio: number = StoneModel.instance.otherValue[3] / needLev;

                    // this._scheEffect.y = (1 - ratio) * 100;

                }
                this.nowLevImg.text = StoneModel.instance.otherValue[3].toString() + "/" + needLev;
                // this.nextLevImg.text = needLev.toString();
                this.wavePosition(needLev);
            } else {
                let maxValue: number = StoneCfg.instance.getUpStoneByLev(StoneCfg.instance.maxLv - 1)[gemRiseFields.refine_level];
                this.nowLevImg.text = StoneModel.instance.otherValue[3].toString() + "/" + maxValue;
                // this.nextLevImg.text = maxValue.toString();
                this.wavePosition(maxValue);
                this.redImg.visible = false;
                // this._scheEffect.y = -15;
            }

        }

        private wavePosition(num: number) {
            if (!num) return;
            let ratio = StoneModel.instance.otherValue[3] / num;
            if (ratio >= 1) ratio = 1;
            // this._skeleton.y = 100 - 100 * ratio;
            TweenJS.create(this._skeleton).to({ y: 100 - 100 * ratio }, 100)
                .easing(utils.tween.easing.linear.None)
                .start()
        }

        //仙石大师升级
        private upMaster(): void {
            // this.nowLevImg.pivot(this.nowLevImg.textField.width / 2, this.nowLevImg.textField.height / 2);
            this.nowLevImg.scaleX = this.nowLevImg.scaleY = 1;
            if (!this._tween.isPlaying) {
                this._tween.to({ scaleX: 1.2, scaleY: 1.2 }, 200).start();
            }

            if (!this._strIndex[this._currEqiup]) {
                this.searchOne();
            }
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20006);
        }

        //vip槽 充值跳转
        private maskImgHandler(): void {
            let needVipLv: number = config.PrivilegeCfg.instance.getOpenFuncByType(Privilege.gemGridOpen);
            let intNum = 0;
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                intNum = WindowEnum.VIP_PANEL;
            } else {
                intNum = WindowEnum.VIP_NEW_PANEL;
            }
            let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [intNum], true);
            CommonUtil.alert("温馨提示", `专属徽章镶嵌栏需要SVIP${needVipLv}开启,是否前往提升SVIP?`, [handler]);
        }

        //播放升级特效
        private playUpEff(): void {

            let index: number = StoneModel.instance.currStonePic;
            this._upGradeStone[index].visible = true;
            this._upGradeStone[index].play();
        }

        private playOneKeyUpEff(): void {

            for (let i: int = 0, len: int = StoneModel.instance.oneKeyPit.length; i < len; i++) {
                this._upGradeStone[StoneModel.instance.oneKeyPit[i]].visible = true;
                this._upGradeStone[StoneModel.instance.oneKeyPit[i]].play();
            }
        }

        // 装备数据初始化
        private equipInitedHandler(): void {

            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) return;
            for (let i: int = 0, len = equipsDic.keys.length; i < len; i++) {
                this.setEquip(equipsDic.keys[i], equipsDic.values[i]);
            }

            GlobalData.dispatcher.event(CommonEventType.GET_EQUIP);

            this.updataStonePit();
        }

        private setEquip(part: int, equip: Protocols.Item): void {
            if (!this._currFrame) {
                this._currFrame = new Image("common/dt_tongyong_29.png");
                this._currFrame.pos(-4, -4);
            }
            let bagItem: BaseItem = this._partDic.get(part);
            if (!equip) {
                if (bagItem) {
                    bagItem.dataSource = null;
                    bagItem.removeSelf();
                }
            } else {
                if (!bagItem) {
                    bagItem = new BaseItem();
                    bagItem.needTip = false;
                    bagItem.valueDisplay = false;
                    this._partDic.set(part, bagItem);
                    this._keysArr.push(part);
                    this._strIndex[part] = 0;
                    bagItem.pos(this._equipPos[part - 1][0], this._equipPos[part - 1][1], true);
                    bagItem.on(Event.CLICK, this, this.itemClickHandler, [part]);

                    let _redImg: Image = new Image("common/image_common_xhd.png");
                    _redImg.visible = false;
                    _redImg.name = "redImg";
                    _redImg.pos(80, -8);
                    bagItem.addChildAt(_redImg, 6);
                }
                this.addChildAt(bagItem, 2);
                bagItem.dataSource = equip;
            }
            this._keysArr = this._keysArr.sort(this.sortDic);
        }

        //排序keys
        public sortDic(a: int, b: int): int {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else return 0;
        }

        private closeEff(index: number): void {
            this._upGradeStone[index].visible = false;
        }

        //戒指加号
        private showAddTipsBtn() {
            let playLevel: number = PlayerModel.instance.level;
            let showLevel: Array<number> = BlendCfg.instance.getCfgById(53001)[blendFields.intParam];
            if (playLevel >= showLevel[0]) {
                this.addTipsBtn2.visible = true;
                this.addTipsBtn3.visible = true;
            } else {
                this.addTipsBtn2.visible = false;
                this.addTipsBtn3.visible = false;
            }
        }

        private equipBgBoxClickHandler() {
            WindowManager.instance.open(WindowEnum.EQUIPMENT_SOURCE_ALERT, null);
        }
    }
}