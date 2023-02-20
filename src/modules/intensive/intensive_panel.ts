///<reference path="../config/intensive_cfg.ts"/>
///<reference path="../stone/stone_model.ts"/>

namespace modules.intensive {

    import IntensiveViewUI = ui.IntensiveViewUI;
    import Dictionary = Laya.Dictionary;
    import PlayerModel = modules.player.PlayerModel;
    import Image = Laya.Image;
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import BagModel = modules.bag.BagModel;
    import IntensiveCfg = modules.config.IntensiveCfg;
    import strongRefineFields = Configuration.strongRefineFields;
    import ItemsFields = Configuration.ItemsFields;
    import Label = Laya.Label;
    import CustomClip = modules.common.CustomClip;
    import strongRiseFields = Configuration.strongRiseFields;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import BagUtil = modules.bag.BagUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class IntensivePanel extends IntensiveViewUI {

        private _currFrame: Image;    //装备的选中框
        private _equipPos: Array<[number, number]>;  //装备位置
        private _partDic: Dictionary;  //部位字典
        private _cenItem: BaseItem;  //中间位置的item
        private _currEqiup: int;   //当前选中的装备
        private _recordLev: Table<number>;  //等级存放
        private _btnClip: CustomClip;  //按钮特效
        // private _scheEffect1: CustomClip; //进度1
        // private _scheEffect2: CustomClip; //进度2
        private _upGradeEffect: Table<CustomClip>; //装备升级特效
        private _effKeyArr: number[];
        private _intensiveStoneId: number;
        private _attrNameTxts: Label[];
        private _attrTxts: Label[];
        private _upAttrTxts: Label[];
        private _arrowImgs: Image[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._recordLev = {};

            this._effKeyArr = [];

            this._upGradeEffect = {};

            this._equipPos = new Array<[number, number]>();
            this._equipPos.push([49, 210], [49, 330], [49, 450], [49, 570], [49, 690],
                [569, 210], [569, 330], [569, 450], [569, 570], [569, 690]);

            this._partDic = new Dictionary();

            this._intensiveStoneId = IntensiveCfg.instance.getCfgByPart(1, 0)[strongRefineFields.items][0][ItemsFields.itemId];

            this._cenItem = new BaseItem();
            this._cenItem.valueDisplay = false;
            this._cenItem.pos(310, 569);
            this._cenItem.setNum("", "#ffffff");

            this._attrNameTxts = [this.pro_1, this.pro_2];
            this._attrTxts = [this.proNumTxt_1, this.proNumTxt_2];
            this._upAttrTxts = [this.upProNumTxt_1, this.upProNumTxt_2];
            this._arrowImgs = [this.arrImg_1, this.arrImg_2];

            this.addChild(this._cenItem);

            this.initEffectBg();
            this.effectInit();

            this.regGuideSpr(GuideSpriteId.INTENSIVE_ONE_KEY_BTN, this.oneInstenBtn);
        }
        private _skeletonMaster: Laya.Skeleton;
        private _skeletonCrafts: Laya.Skeleton;
        private initEffectBg() {
            if (this._skeletonCrafts) return;
            this._skeletonCrafts = new Laya.Skeleton();
            this.conBox2.addChild(this._skeletonCrafts);
            this._skeletonCrafts.pos(56, 0);
            this._skeletonCrafts.load("res/skeleton/wave/UI_duanzao_Ball2.sk", Laya.Handler.create(this, () => {
                this._skeletonCrafts.play(0, true);
            }));

            if (this._skeletonMaster) return;
            this._skeletonMaster = new Laya.Skeleton();
            this.conBox1.addChild(this._skeletonMaster);
            this._skeletonMaster.pos(56, 0);
            this._skeletonMaster.load("res/skeleton/wave/UI_duanzao_Ball1.sk", Laya.Handler.create(this, () => {
                this._skeletonMaster.play(0, true);
            }));
        }

        protected onOpened(): void {
            super.onOpened();

            this.equipInitedHandler();

            this._btnClip.play();
            // this._scheEffect1.play();
            // this._scheEffect2.play();
            this.showAddTipsBtn(); //戒指加号

            for (let i: int = 0, len: int = this._effKeyArr.length; i < len; i++) {
                this._upGradeEffect[this._effKeyArr[i]].visible = false;
            }

            this.searchOne();

            this.update();
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIPS, this, this.equipInitedHandler);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.equipInitedHandler);
            GlobalData.dispatcher.on(CommonEventType.INTENSIVE_UPDATE, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.UPGRADE_SUCCESS, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.INTENSIVE_SUCCESS, this, this.playUpEff);

            this.addTipsBtn2.on(Event.CLICK, this, this.addTipsBtnHandler, [1]);
            this.addTipsBtn3.on(Event.CLICK, this, this.addTipsBtnHandler, [2]);

            BottomTabCtrl.instance.tab.on(Event.CHANGE, this, this.changeHandler);
            this.oneInstenBtn.on(Event.CLICK, this, this.oneKeyUpGrade);
            this.instenBtn.on(Event.CLICK, this, this.upGrade);
            this.DSFrameImg.on(Event.CLICK, this, this.popAlert, [1]);
            this.SJFrameImg.on(Event.CLICK, this, this.popAlert, [2]);
            GlobalData.dispatcher.once(CommonEventType.GET_EQUIP, this, this.searchOne);

            for (let i: int = 0, len: int = this._partDic.keys.length; i < len; i++) {
                this._partDic.get(this._partDic.keys[i]).on(Event.CLICK, this, this.itemClickHandler, [this._partDic.keys[i]]);
            }

            for (let i: int = 0, len: int = this._effKeyArr.length; i < len; i++) {
                this._upGradeEffect[this._effKeyArr[i]].on(Event.COMPLETE, this, this.closeEff, [this._effKeyArr[i]]);
            }

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.showAddTipsBtn);//戒指和项链的加号

            let len = this.equipBgBox._childs.length
            for (let index = 0; index < len; index++) {
                this.addAutoListener(this.equipBgBox._childs[index], Event.CLICK, this, this.equipBgBoxClickHandler);
            }

            this.DSFrameImg[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.SJFrameImg[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
        }

        protected removeListeners(): void {

            GlobalData.dispatcher.off(CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_WEAR_EQUIPS, this, this.equipInitedHandler);
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.equipInitedHandler);
            GlobalData.dispatcher.off(CommonEventType.INTENSIVE_UPDATE, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.UPGRADE_SUCCESS, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.INTENSIVE_SUCCESS, this, this.playUpEff);
            GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.update);

            this.addTipsBtn2.off(Event.CLICK, this, this.addTipsBtnHandler);
            this.addTipsBtn3.off(Event.CLICK, this, this.addTipsBtnHandler);
            BottomTabCtrl.instance.tab.off(Event.CHANGE, this, this.changeHandler);
            this.oneInstenBtn.off(Event.CLICK, this, this.oneKeyUpGrade);
            this.instenBtn.off(Event.CLICK, this, this.upGrade);
            this.DSFrameImg.off(Event.CLICK, this, this.popAlert);
            this.SJFrameImg.off(Event.CLICK, this, this.popAlert);
            GlobalData.dispatcher.off(CommonEventType.GET_EQUIP, this, this.searchOne);

            for (let i: int = 0, len: int = this._partDic.keys.length; i < len; i++) {
                this._partDic.get(this._partDic.keys[i]).off(Event.CLICK, this, this.itemClickHandler, [this._partDic.keys[i]]);
            }
            for (let i: int = 0, len: int = this._effKeyArr.length; i < len; i++) {
                this._upGradeEffect[this._effKeyArr[i]].off(Event.COMPLETE, this, this.closeEff);
            }

            super.removeListeners();
        }

        private changeHandler(): void {
            if (BottomTabCtrl.instance.tab.selectedIndex == 1)
                WindowManager.instance.open(WindowEnum.STONE_PANEL);
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
                        str = "魔法石";
                        break;
                    default:
                        break;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(`${str}可通过探索获得`, true);
            } else {
                WindowManager.instance.open(WindowEnum.TREASURE_PANEL);
            }
        }

        //切换选中框  下标1~10
        private itemClickHandler(index: int): void {

            this._currEqiup = index;

            (this._partDic.get(this._currEqiup) as BaseItem).addChildAt(this._currFrame, 1);

            this.setResource();

        }

        private update(): void {

            if (this._partDic.keys.length == 0 || IntensiveModel.instance.partLev.keys.length == 0) {
                this.noEquipBox.visible = false;
                return;
            } else this.noEquipBox.visible = true;

            this.master();

            this.atkValueMsz.value = IntensiveModel.instance.atkNum.toString();

            let copper = PlayerModel.instance.copper;
            let sotneNum = BagModel.instance.getItemCountById(this._intensiveStoneId);
            this._btnClip.visible = false;

            //初始化等级 和 红点显示
            for (let i: int = 1; i <= 10; i++) {
                let equipLev = IntensiveModel.instance.partLev.get(i);
                if (!this._partDic.get(i)) continue;
                if (equipLev == 0)
                    this._partDic.get(i).setNum("", "#ffffff");
                else {
                    this._partDic.get(i).setNum((equipLev + "级"), "#ffffff");
                }
                this._recordLev[i] = equipLev;
                let needItems: Configuration.Items[] = IntensiveCfg.instance.getCfgByPart(i, equipLev)[strongRefineFields.items];
                let needCopper: number = IntensiveCfg.instance.getCfgByPart(i, equipLev)[strongRefineFields.copper];
                if (needItems.length > 0) {
                    if (sotneNum >= needItems[0][ItemsFields.count] && copper >= needCopper) {
                        this._partDic.get(i).rpImg.visible = true;
                        this._btnClip.visible = true;
                    } else {
                        this._partDic.get(i).rpImg.visible = false;
                    }
                } else {
                    this._partDic.get(i).rpImg.visible = false;
                }
            }
            this.setResource();
        }

        private searchOne(): void {

            if (this._partDic.keys.length == 0 || IntensiveModel.instance.partLev.keys.length == 0) return;

            let _copper = PlayerModel.instance.copper;
            let _sotneNum = BagModel.instance.getItemCountById(this._intensiveStoneId);

            //设置选中装备
            for (let i: int = 0; i < 10; i++) {
                let _partIndex = IntensiveModel.instance.getKeysArr(i);
                let _lev = IntensiveModel.instance.partLev.get(_partIndex);
                if (!this._partDic.get(_partIndex)) continue;
                if (IntensiveCfg.instance.getCfgByPart(_partIndex, _lev)[strongRefineFields.items][0] && (_sotneNum >= IntensiveCfg.instance.getCfgByPart(_partIndex, _lev)[strongRefineFields.items][0][ItemsFields.count] &&
                    _copper >= IntensiveCfg.instance.getCfgByPart(_partIndex, _lev)[strongRefineFields.copper])) {
                    this.itemClickHandler(_partIndex);
                    return;
                }
            }

            if (this._partDic.keys.length != 0) {
                for (let i: int = 0; i < 10; i++) {
                    let _partIndex = IntensiveModel.instance.getKeysArr(i);
                    let _lev = IntensiveModel.instance.partLev.get(_partIndex);
                    if (this._partDic.get(_partIndex)) {
                        this.itemClickHandler(_partIndex);
                        return;
                    }
                }
            }

        }

        //刷新资源   
        private setResource(): void {

            let haveSotneNum: number = BagModel.instance.getItemCountById(this._intensiveStoneId);
            let haveCopper: number = PlayerModel.instance.copper;

            if (!this._currEqiup) this._currEqiup = this._partDic.keys[0];
            this._cenItem.dataSource = (this._partDic.get(this._currEqiup) as BaseItem).itemData;
            if (this._recordLev[this._currEqiup] == 0)
                this._cenItem.setNum("", "#ffffff");
            else
                this._cenItem.setNum((this._recordLev[this._currEqiup] + "级"), "#ffffff");
            let cfg = IntensiveCfg.instance.getCfgByPart(this._currEqiup, IntensiveModel.instance.partLev.get(this._currEqiup));
            let nextCfg = IntensiveCfg.instance.getCfgByPart(this._currEqiup, IntensiveModel.instance.partLev.get(this._currEqiup) + 1);
            common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrTxts,
                this._arrowImgs,
                this._upAttrTxts,
                strongRefineFields.attrs
            );

            let needItems: Configuration.Items[] = cfg[strongRefineFields.items];
            let needCopper: number = cfg[strongRefineFields.copper];
            if (needItems.length > 0) {
                this.manjiText.visible = false;
                this.stoneTxt.visible = this.goldTxt.visible = this.goldImg.visible = this.stoneImg.visible = true;
                this.goldTxt.text = needCopper.toString();
                this.goldTxt.color = haveCopper >= needCopper ? "#000000" : "#ff3e3e";
                this.stoneTxt.text = haveSotneNum + "/" + cfg[strongRefineFields.items][0][ItemsFields.count];
                this.stoneTxt.color = haveSotneNum >= cfg[strongRefineFields.items][0][ItemsFields.count] ? "#000000" : "#ff3e3e";
            } else {
                this.manjiText.visible = true;
                this.stoneTxt.visible = this.goldTxt.visible = this.goldImg.visible = this.stoneImg.visible = false;
            }
        }

        private master(): void {

            if (IntensiveModel.instance.levState[0][1]) {  //大师可以升级
                this.proDotImg_1.visible = true;
                // this._scheEffect1.y = -15;
                this.wavePosition(this._skeletonMaster, 8, 8)
                this.proTxt_1.text = 8 + "/" + 8;

            } else {

                this.proDotImg_1.visible = false;

                let _DSCfg = IntensiveCfg.instance.getCfgBy_DASHI_Lev(IntensiveModel.instance.levState[0][0]);
                let _count: int = 0;
                for (let i: int = 1; i <= 10; i++) {
                    if (IntensiveModel.instance.partLev.get(i) >= _DSCfg[strongRiseFields.refineLevel])
                        _count++;
                }

                let _DSPlan = _count / 8;

                if (_count > 8) _count = 8;
                this.proTxt_1.text = _count + "/" + 8;

                // this._scheEffect1.y = (1 - _DSPlan) * 100;
                this.wavePosition(this._skeletonMaster, _count, 8)
            }
            this.conTxt1.text = "强化大师·" + IntensiveModel.instance.levState[0][0] + "阶";

            //-------------------------------------------------------------------------------------------------
            if (IntensiveModel.instance.levState[1][1])  //神匠可以升级
            {
                this.proDotImg_2.visible = true;
                // this._scheEffect2.y = -15;
                this.proTxt_2.text = 10 + "/" + 10;
                this.wavePosition(this._skeletonCrafts, 10, 10)
            } else {

                this.proDotImg_2.visible = false;

                // console.log(IntensiveModel.instance.levState[1][0]);
                let _SJCfg = IntensiveCfg.instance.getCfgBy_SHENJIANG_Lev(IntensiveModel.instance.levState[1][0]);
                let _count: int = 0;
                for (let i: int = 1; i <= 10; i++) {
                    if (IntensiveModel.instance.partLev.get(i) >= _SJCfg[strongRiseFields.refineLevel])
                        _count++;
                }

                let _SJPlan = _count / 10;

                this.proTxt_2.text = _count + "/" + 10;

                // this._scheEffect2.y = (1 - _SJPlan) * 100;
                this.wavePosition(this._skeletonCrafts, _count, 10)
            }
            this.conTxt2.text = "强化神匠·" + IntensiveModel.instance.levState[1][0] + "阶";

        }

        private wavePosition(skeleton: Laya.Skeleton, numkid: number, num: number) {
            if (!num) return;
            let ratio = numkid / num;
            if (ratio >= 1) ratio = 1;
            // this._skeleton.y = 100 - 100 * ratio;
            TweenJS.create(skeleton).to({ y: 100 - 100 * ratio }, 100)
                .easing(utils.tween.easing.linear.None)
                .start()
        }

        // 装备数据初始化
        private equipInitedHandler(): void {
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) return;
            for (let i: int = 0, len = equipsDic.keys.length; i < len; i++) {
                this.setEquip(equipsDic.keys[i], equipsDic.values[i]);
            }

            GlobalData.dispatcher.event(CommonEventType.GET_EQUIP);

            this.update();
        }

        private setEquip(part: int, equip: Protocols.Item): void {
            if (!this._currFrame) {
                this._currFrame = new Image("common/dt_tongyong_29.png");
                this._currFrame.pos(-4, -4);
            }
            let bagItem: BaseItem = this._partDic.get(part);
            if (!equip) {
                if (bagItem) bagItem.removeSelf();
            } else {
                if (!bagItem) {
                    bagItem = new BaseItem();
                    bagItem.needTip = false;
                    bagItem.valueDisplay = false;
                    this._partDic.set(part, bagItem);
                    bagItem.pos(this._equipPos[part - 1][0], this._equipPos[part - 1][1], true);
                    bagItem.on(Event.CLICK, this, this.itemClickHandler, [part]);

                    // let _redImg: Image = new Image("common/image_common_xhd.png");
                    // _redImg.visible = false;
                    // _redImg.name = "redImg";
                    // _redImg.pos(80, -8);
                    // //bagItem.addChildAt(_redImg, 3);
                    // bagItem.addChildAt(_redImg, 4);

                    let _eff = new CustomClip();
                    _eff.visible = false;
                    _eff.on(Event.COMPLETE, this, this.closeEff, [part]);
                    this._upGradeEffect[part] = _eff;
                    this._effKeyArr.push(part);
                    //bagItem.addChild(_eff);
                    bagItem.addChildAt(_eff, 6);
                    _eff.pos(-75, -75);
                    _eff.skin = "assets/effect/activate.atlas";
                    _eff.frameUrls = ["activate/0.png", "activate/1.png", "activate/2.png", "activate/3.png"];
                    _eff.durationFrame = 5;
                    _eff.loop = false;

                }
                this.addChildAt(bagItem, 3);
                bagItem.dataSource = equip;
            }
        }

        private closeEff(index: int): void {
            this._upGradeEffect[index].visible = false;
        }

        public destroy(): void {
            if (this._currFrame) {
                this._currFrame.destroy(true);
                this._currFrame = null;
            }
            if (this._partDic) {
                let list = this._partDic.values;
                for (let e of list) {
                    e.destroy(true);
                }
                this._partDic = null;
            }

            if (this._upGradeEffect) {
                for (let key in this._upGradeEffect) {
                    let e = this._upGradeEffect[key];
                    if (e) {
                        e.destroy(true);
                    }
                }
                this._upGradeEffect = null;
            }

            if (this._cenItem) {
                this._cenItem.destroy(true);
                this._cenItem = null;
            }

            if (this._btnClip) {
                this._btnClip.destroy(true);
                this._btnClip = null;
            }
            if (this._skeletonMaster) {
                this._skeletonMaster = this.destroyElement(this._skeletonMaster);
            }
            if (this._skeletonCrafts) {
                this._skeletonCrafts = this.destroyElement(this._skeletonCrafts);
            }
            // if (this._scheEffect1) {
            //     this._scheEffect1.destroy(true);
            //     this._scheEffect1 = null;
            // }

            // if (this._scheEffect2) {
            //     this._scheEffect2.destroy(true);
            //     this._scheEffect2 = null;
            // }

            super.destroy();
            this._equipPos.length = 0;
            this._effKeyArr.length = 0;
        }

        //特效初始化
        private effectInit(): void {

            this._btnClip = new CustomClip();
            this.oneInstenBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -18);
            this._btnClip.scaleY = 1.2;
            this._btnClip.visible = false;

            // this._scheEffect1 = new CustomClip();
            // this.conBox1.addChildAt(this._scheEffect1, 0);
            // this._scheEffect1.skin = "assets/effect/wave.atlas";
            // this._scheEffect1.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png",
            //     "wave/5.png", "wave/6.png", "wave/7.png"];
            // this._scheEffect1.durationFrame = 5;
            // this._scheEffect1.play();
            // this._scheEffect1.loop = true;
            // this._scheEffect1.pos(-10, 100, true);


            // this._scheEffect2 = new CustomClip();
            // this.conBox2.addChildAt(this._scheEffect2, 0);
            // this._scheEffect2.skin = "assets/effect/wave.atlas";
            // this._scheEffect2.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png",
            //     "wave/5.png", "wave/6.png", "wave/7.png"];
            // this._scheEffect2.durationFrame = 5;
            // this._scheEffect2.play();
            // this._scheEffect2.loop = true;
            // this._scheEffect2.pos(-10, 100, true);
        }

        private upGrade(): void {
            if (this.judgeCanUpgrade(0))
                IntensiveCtrl.instance.upGrade(this._currEqiup);
        }

        private oneKeyUpGrade(): void {
            if (this.judgeCanUpgrade(1))
                IntensiveCtrl.instance.oneKeyUpGrade();
        }

        // 1 大师 2 神匠
        private popAlert(index: int): void {
            if (index == 1)
                WindowManager.instance.openDialog(WindowEnum.STONE_MASTER_DIALOG, 1);
            else
                WindowManager.instance.openDialog(WindowEnum.STONE_MASTER_DIALOG, 2);
        }

        private playUpEff(index: any) {

            //一键升级

            if (index == 0) {
                this._upGradeEffect[this._currEqiup].visible = true;
                this._upGradeEffect[this._currEqiup].play();
            } else {
                for (let i: int = 0, len: int = (<Array<number>>index).length; i < len; i++) {
                    this._upGradeEffect[index[i]].visible = true;
                    this._upGradeEffect[index[i]].play();
                }
            }
        }

        private judgeCanUpgrade(type: number): boolean {
            if (type == 0) {
                //部位可以强化
                let cfg = IntensiveCfg.instance.getCfgByPart(this._currEqiup, IntensiveModel.instance.partLev.get(this._currEqiup));
                let copperNum = PlayerModel.instance.copper;//玩家金币
                let sotneNum = BagModel.instance.getItemCountById(this._intensiveStoneId);//背包里的数量
                if (cfg[strongRefineFields.items][0] || cfg[strongRefineFields.copper]) {
                    let stoneDiff: number = cfg[strongRefineFields.items][0][ItemsFields.count] - sotneNum;
                    let copperDiff: number = cfg[strongRefineFields.copper] - copperNum;
                    if (stoneDiff > 0) {
                        //道具不足
                        BagUtil.openLackPropAlert(this._intensiveStoneId, type ? 1 : stoneDiff);
                        return false;
                    } else if (copperDiff > 0) {
                        //金币不足
                        BagUtil.openLackPropAlert(90330001, type ? 1 : copperDiff);
                        return false;
                    }
                }
                return true;
            } else {
                let element1 = 99999999999999;
                let idNum = 1;
                for (let i: int = 1; i <= 10; i++) {
                    let element = this._recordLev[i];
                    if (element < element1) {
                        element1 = element;
                        idNum = i;
                    }
                }
                let cfg = IntensiveCfg.instance.getCfgByPart(this._currEqiup, IntensiveModel.instance.partLev.get(idNum));
                if (cfg) {
                    let copperNum = PlayerModel.instance.copper;//玩家金币
                    let sotneNum = BagModel.instance.getItemCountById(this._intensiveStoneId);//背包里的数量
                    if (cfg[strongRefineFields.items][0] || cfg[strongRefineFields.copper]) {
                        let stoneDiff: number = cfg[strongRefineFields.items][0][ItemsFields.count] - sotneNum;
                        let copperDiff: number = cfg[strongRefineFields.copper] - copperNum;
                        if (copperDiff > 0) {
                            //金币不足
                            BagUtil.openLackPropAlert(90330001, type ? 1 : copperDiff);
                            return false;
                        } else if (stoneDiff > 0) {

                            //道具不足
                            BagUtil.openLackPropAlert(this._intensiveStoneId, type ? 1 : stoneDiff);
                            return false;
                        }
                    }
                }
                return true;
            }

        }
        //戒指加号
        private showAddTipsBtn() {
            let playLevel: number = PlayerModel.instance.level;
            let showLevel: Array<number> = BlendCfg.instance.getCfgById(53001)[blendFields.intParam];
            if (playLevel >= showLevel[0]) {
                this.addTipsBtn2.visible = true;
                this.addTipsBtn3.visible = true;
            }
            else {
                this.addTipsBtn2.visible = false;
                this.addTipsBtn3.visible = false;
            }
        }

        private equipBgBoxClickHandler() {
            // let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(101);
            WindowManager.instance.open(WindowEnum.EQUIPMENT_SOURCE_ALERT, null);
        }
    }
}