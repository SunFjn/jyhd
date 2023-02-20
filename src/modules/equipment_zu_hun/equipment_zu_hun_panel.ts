///<reference path="../config/equipment_zhuhun_cfg.ts"/>
///<reference path="../config/equipment_shihun_cfg.ts"/>

namespace modules.equipment_zu_hun {

    import EquipmentZuHunViewUI = ui.EquipmentZuHunViewUI;
    import Dictionary = Laya.Dictionary;
    import PlayerModel = modules.player.PlayerModel;
    import Image = Laya.Image;
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;

    import Label = Laya.Label;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BtnGroup = modules.common.BtnGroup;
    import EquipmentZhuHunCfg = modules.config.EquipmentZhuHunCfg;
    import zhuhunFields = Configuration.zhuhunFields;
    import ZhuhunGridsFields = Protocols.ZhuhunGridsFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import LayaEvent = modules.common.LayaEvent;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class EquipmentZuHunPanel extends EquipmentZuHunViewUI {
        private _proCtrl: ProgressBarCtrl;
        private _scienceTabGroup: BtnGroup;
        private _currFrame: Image;    //装备的选中框
        private _equipPos: Array<[number, number]>;  //装备位置
        private _partDic: Dictionary;  //部位字典
        private _currPart: int;   //当前选中的装备 装备部位 ID
        private _recordLev: Table<number>;  //等级存放
        private _btnClip: CustomClip;//按钮特效1
        private _btnClip1: CustomClip;//按钮特效2
        private _upGradeEffect: Table<CustomClip>; //装备升级特效
        private _effKeyArr: number[];

        private _attrNameTxts: Label[];
        private _attrTxts: Label[];
        private _upAttrTxts: Label[];
        private _arrowImgs: Image[];

        private _typeBtnAll: Array<SEquipmentSiHunItem>;
        private _typeBtnDate: Array<number>;
        private _proCtrlTween: TweenJS;

        private isDianJi: boolean;//是否点击换 装备 查看
        constructor() {
            super();

        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._typeBtnAll = [
                this.typeBtn1,
                this.typeBtn2,
                this.typeBtn3,
                this.typeBtn4,
                this.typeBtn5,
                this.typeBtn6];
            this._typeBtnDate = [1, 2, 3, 4, 5, 6];
            this._recordLev = {};
            this._effKeyArr = [];
            this._upGradeEffect = {};
            this._equipPos = new Array<[number, number]>();
            this._equipPos.push(
                [20, 147],
                [20, 264],
                [20, 381],
                [20, 497],
                [20, 615],
                [598, 147],
                [598, 264],
                [598, 381],
                [598, 497],
                [598, 615]);
            this._partDic = new Dictionary();


            this.cenItem.valueDisplay = false;
            this.cenItem.setNum("", "#ffffff");
            this.cenItem.visible = false;
            this.cenItemText.visible = false;

            this._attrNameTxts = [this.pro_1, this.pro_2, this.pro_3];
            this._attrTxts = [this.proNumTxt_1, this.proNumTxt_2, this.proNumTxt_3];
            this._upAttrTxts = [this.upProNumTxt_1, this.upProNumTxt_2, this.upProNumTxt_3];
            this._arrowImgs = [this.arrImg_1, this.arrImg_2, this.arrImg_3];

            this.creatEffect();
            this.regGuideSpr(GuideSpriteId.INTENSIVE_ONE_KEY_BTN, this.oneInstenBtn);

            this._proCtrl = new ProgressBarCtrl(this.blessImg, 380, this.blessTxt);
            this._scienceTabGroup = new BtnGroup();
            this._scienceTabGroup.setBtns(this.ToggleBtn1, this.ToggleBtn2, this.ToggleBtn3);
            this.showAddTipsBtn(); //戒指加号
        }

        protected onOpened(): void {
            super.onOpened();
            this.showTypeBtnAll();
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) {
                return;
            }
            this.isDianJi = false;
            this.equipInitedHandler();

            this.searchOne();
            this.update();
            this.showAddTipsBtn(); //戒指加号
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EQUIPMENT_ZUHUN_UP, this, this.playUpEff);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EQUIPMENT_ZUHUN_UPDATE, this, this.update);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.update);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.INTENSIVE_SUCCESS, this, this.playUpEff);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.showAddTipsBtn);//戒指和项链的加号

            this.addAutoListener(this.addTipsBtn2, LayaEvent.CLICK, this, this.addTipsBtnHandler, [1]);
            this.addAutoListener(this.addTipsBtn3, LayaEvent.CLICK, this, this.addTipsBtnHandler, [2]);
            this.addAutoListener(this._scienceTabGroup, LayaEvent.CHANGE, this, this.changeswitchBtnTabHandler);
            this.addAutoListener(this.oneInstenBtn, LayaEvent.CLICK, this, this.oneKeyUpGrade);
            this.addAutoListener(this.instenBtn, LayaEvent.CLICK, this, this.upGrade);
            for (let i: int = 0, len: int = this._partDic.keys.length; i < len; i++) {
                let key = this._partDic.keys[i];
                this.addAutoListener(this._partDic.get(key), LayaEvent.CLICK, this, this.itemClickHandler, [key]);
            }
            for (let i: int = 0, len: int = this._effKeyArr.length; i < len; i++) {
                let key = this._effKeyArr[i];
                this.addAutoListener(this._upGradeEffect[key], LayaEvent.COMPLETE, this, this.closeEff, [key]);
            }

            let len = this.equipBgBox._childs.length
            for (let index = 0; index < len; index++) {
                this.addAutoListener(this.equipBgBox._childs[index], LayaEvent.CLICK, this, this.equipBgBoxClickHandler);
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

        private changeswitchBtnTabHandler(): void {
            //这里判断当前选中材料 的个数 能否升一阶  能就加流光特效
            EquipmentZuHunModel.instance._materialItemID = EquipmentZuHunModel.instance._consumptionMaterialItem[this._scienceTabGroup.selectedIndex];
            this.showClip();

        }

        /**
         * 显示噬魂相关
         */
        public showTypeBtnAll() {
            for (let index = 0; index < this._typeBtnAll.length; index++) {
                let element = this._typeBtnAll[index];
                if (element) {
                    element.data = this._typeBtnDate[index];
                }
            }
        }

        //切换选中框  下标1~10
        private itemClickHandler(index: int): void {
            this._currPart = index;
            this.isDianJi = true;
            EquipmentZuHunModel.instance._currPart = this._currPart;
            if (this._partDic.get(this._currPart)) {
                (this._partDic.get(this._currPart) as BaseItem).addChildAt(this._currFrame, 1);
                let select_num = this._scienceTabGroup.selectedIndex < 0 ? 0 : EquipmentZuHunModel.instance.getConsumptionNum(this._scienceTabGroup.selectedIndex);
                if (select_num <= 0) {
                    let num1 = EquipmentZuHunModel.instance.getConsumptionNum(0);
                    let num2 = EquipmentZuHunModel.instance.getConsumptionNum(1);
                    let num3 = EquipmentZuHunModel.instance.getConsumptionNum(2);
                    if (num1 > 0) {
                        this._scienceTabGroup.selectedIndex = 0;
                    } else if (num2 > 0) {
                        this._scienceTabGroup.selectedIndex = 1;
                    } else if (num3 > 0) {
                        this._scienceTabGroup.selectedIndex = 2;
                    } else {
                        this._scienceTabGroup.selectedIndex = 0;
                    }
                }
                this.setResource();
            }

        }

        //更新所有装备的阶数 以及 红点判断
        private update(): void {
            this.atkValueMsz.value = EquipmentZuHunModel.instance.atkNum.toString();
            //初始化等级 和 红点显示
            this._partDic.values.forEach(element => {
                if (element) {
                    (element.getChildByName("redImg") as Image).visible = false;
                }
            });
            let exp1 = EquipmentZuHunModel.instance.getConsumptionExp(0);
            let exp2 = EquipmentZuHunModel.instance.getConsumptionExp(1);
            let exp3 = EquipmentZuHunModel.instance.getConsumptionExp(2);
            for (var index = 1; index <= 10; index++) {
                let element = EquipmentZuHunModel.instance.zhuhunList[index];
                if (!element) {
                    return;
                }
                let level = element[ZhuhunGridsFields.level];
                let part = element[ZhuhunGridsFields.part];
                let exp = element[ZhuhunGridsFields.exp];
                let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
                let baseITEM = this._partDic.get(part);
                if (baseITEM) {
                    level = level > maxValue ? maxValue : level;//判断最大等级防止越界
                    if (level == 0)
                        baseITEM.setNum("", "#ffffff");
                    else {
                        baseITEM.setNum((level + "阶"), "#ffffff");
                    }

                    baseITEM.visible = true;
                    if (level < maxValue) {
                        let EquipmentZhuHunDate = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
                        let maxExp = EquipmentZhuHunDate[zhuhunFields.exp];
                        let needExp = maxExp - exp;
                        let allExp = exp1 + exp2 + exp3;
                        if (allExp >= needExp) {
                            (baseITEM.getChildByName("redImg") as Image).visible = true;
                        } else {
                            (baseITEM.getChildByName("redImg") as Image).visible = false;
                        }
                    } else {
                        (baseITEM.getChildByName("redImg") as Image).visible = false;
                    }
                }
            }
            this.setResource();
            this.showClip();
            this.setcaiLiaoText();
            this.showTypeBtnAll();

        }

        public setJieClipPos() {
            let changdu = this.jieClip.width + this.jieImg.width;
            let Pox = (this.width - changdu) / 2;
            this.jieClip.x = Pox;
            this.jieImg.x = this.jieClip.x + this.jieClip.width;
        }

        public setcaiLiaoText() {
            let num1 = EquipmentZuHunModel.instance.getConsumptionNum(0);
            let num2 = EquipmentZuHunModel.instance.getConsumptionNum(1);
            let num3 = EquipmentZuHunModel.instance.getConsumptionNum(2);
            this.caiLiaoText1.text = `${num1}`;
            this.caiLiaoText2.text = `${num2}`;
            this.caiLiaoText3.text = `${num3}`;
            if (num1 == 0) {
                this.caiLiaoText1.color = "#ff3e3e";
            } else {
                this.caiLiaoText1.color = "#343434";
            }
            if (num2 == 0) {
                this.caiLiaoText2.color = "#ff3e3e";
            } else {
                this.caiLiaoText2.color = "#343434";
            }
            if (num3 == 0) {
                this.caiLiaoText3.color = "#ff3e3e";
            } else {
                this.caiLiaoText3.color = "#343434";
            }
        }

        //设置选中
        private setResource(): void {
            let dff = this._partDic.get(this._currPart) as BaseItem;
            if (!dff) {
                return;
            }
            this.cenItem.dataSource = dff.itemData;
            this.cenItem.visible = true;
            this.cenItemText.visible = true;
            this.cenItemText.text = CommonUtil.getNameByPart(this._currPart);
            //多少阶
            if (!this._currPart) this._currPart = this._partDic.keys[0];

            let EquipmentZhuHunDate = EquipmentZuHunModel.instance.zhuhunList[this._currPart];
            let level = EquipmentZhuHunDate[ZhuhunGridsFields.level];
            let part = EquipmentZhuHunDate[ZhuhunGridsFields.part];
            let exp = EquipmentZhuHunDate[ZhuhunGridsFields.exp];
            let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
            level = level > maxValue ? maxValue : level;//判断最大等级防止越界
            if (level == 0)
                this.cenItem.setNum("", "#ffffff");
            else
                this.cenItem.setNum((level + "阶"), "#ffffff");
            this.jieClip.value = `${level}`;
            this.jieClip.visible = this.jieImg.visible = true;

            let cfg = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
            let nextCfg = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level + 1);
            let maxExp = cfg[zhuhunFields.exp];
            //进度条
            this._proCtrl.maxValue = maxExp;

            if (this._proCtrlTween) {
                this._proCtrlTween.stop();
                this._proCtrlTween = null;
            }
            if (this.isDianJi) {
                this._proCtrl.value = exp;
            } else {
                if (EquipmentZuHunModel.instance._isjinjie) {
                    // 升星的话经验缓动至满
                    this._proCtrlTween = TweenJS.create(this._proCtrl,).to({ value: this._proCtrl.maxValue }, (1 - this._proCtrl.value / this._proCtrl.maxValue) * 400).onComplete((): void => {
                        this._proCtrl.maxValue = maxExp;
                        this._proCtrl.value = exp;
                    }).start();
                    // this.playUpEff();
                } else {
                    this._proCtrlTween = TweenJS.create(this._proCtrl).to({ value: exp }, 400).onComplete(() => {
                        this._proCtrl.value = exp;
                    }).start();
                }
            }

            EquipmentZuHunModel.instance._isjinjie = false;

            //设置属性
            common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrTxts,
                this._arrowImgs,
                this._upAttrTxts,
                zhuhunFields.attrs
            );
            this.ToggleBtn1.visible = this.ToggleBtn2.visible = this.ToggleBtn3.visible = maxValue > level;
            this.ToggleImg1.visible = this.ToggleImg2.visible = this.ToggleImg3.visible = maxValue > level;
            this.caiLiaoText1.visible = this.caiLiaoText2.visible = this.caiLiaoText3.visible = maxValue > level;
            this.blessTxt.visible = this.blessBgImg.visible = this.blessImg.visible = maxValue > level;
            this.manjiText.visible = maxValue === level;
            this.instenBtn.visible = this.oneInstenBtn.visible = maxValue > level;
            this.isDianJi = false;

        }

        //确定第一个可以升阶的部位
        private searchOne(): void {
            if (this._partDic.keys.length == 0 || EquipmentZuHunModel.instance.zhuhunList.length == 0) {
                return;
            }
            //获取三种道具的数量
            let exp1 = EquipmentZuHunModel.instance.getConsumptionExp(0);
            let exp2 = EquipmentZuHunModel.instance.getConsumptionExp(1);
            let exp3 = EquipmentZuHunModel.instance.getConsumptionExp(2);

            for (let num = 1; num <= 2; num++) { //第一层找可以升级的部位  第二层找第一个未到最大等级的部位

                for (var index = 1; index <= 10; index++) {
                    let element = EquipmentZuHunModel.instance.zhuhunList[index];
                    if (element) {
                        let level = element[ZhuhunGridsFields.level];
                        let part = element[ZhuhunGridsFields.part];
                        let exp = element[ZhuhunGridsFields.exp];
                        let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
                        let baseITEM = this._partDic.get(part);
                        if (baseITEM) {
                            baseITEM.visible = true;
                            level = level > maxValue ? maxValue : level;//判断最大等级防止越界
                            if (level < maxValue) {
                                if (num == 1) {
                                    let EquipmentZhuHunDate = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
                                    let maxExp = EquipmentZhuHunDate[zhuhunFields.exp];
                                    let needExp = maxExp - exp;
                                    let allExp = exp1 + exp2 + exp3;

                                    if (allExp >= needExp) {
                                        this.itemClickHandler(part);
                                        // console.log("第一个可以升级的部位： " + part);
                                        return;
                                    }
                                } else if (num == 1) {
                                    this.itemClickHandler(part);
                                    return;
                                }
                            }
                        }
                    }
                }
            }


            // 如果都没有满足升阶的 默认第一个
            if (this._partDic.keys.length != 0) {
                for (var index = 1; index <= 10; index++) {
                    let element = EquipmentZuHunModel.instance.zhuhunList[index];
                    if (element) {
                        let level = element[ZhuhunGridsFields.level];
                        let part = element[ZhuhunGridsFields.part];
                        let exp = element[ZhuhunGridsFields.exp];
                        let baseITEM = this._partDic.get(part);
                        if (baseITEM) {

                            this.itemClickHandler(this._currPart = part);
                            return;
                        }


                    }
                }

            }
        }

        /**
         * 根据当前选中装备 和当前选中材料类型 判断 按钮 特效
         */
        public showClip(): boolean {
            let bolll = false;
            let getmaterialExp = EquipmentZuHunModel.instance.getmaterialItemExp();
            let getmaterialNum = EquipmentZuHunModel.instance.getmaterialItemNum();
            if (getmaterialNum <= 0) {
                if (this._btnClip) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                if (this._btnClip1) {
                    this._btnClip1.stop();
                    this._btnClip1.visible = false;
                }
                return bolll;
            }
            let element = EquipmentZuHunModel.instance.zhuhunList[this._currPart];
            let level = element[ZhuhunGridsFields.level];
            let part = element[ZhuhunGridsFields.part];
            let exp = element[ZhuhunGridsFields.exp];
            let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
            level = level > maxValue ? maxValue : level;//判断最大等级防止越界
            let EquipmentZhuHunDate = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
            let maxExp = EquipmentZhuHunDate[zhuhunFields.exp];
            let needExp = maxExp - exp;
            // console.log("getmaterialExp: " + getmaterialExp);
            // console.log("needExp: " + needExp);
            if (getmaterialExp >= needExp && maxValue > level) {
                bolll = true;
                if (this._btnClip) {
                    this._btnClip.play();
                    this._btnClip.visible = true;
                }
                if (this._btnClip1) {
                    this._btnClip1.play();
                    this._btnClip1.visible = true;
                }
                return bolll;
            } else {
                if (this._btnClip) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                if (this._btnClip1) {
                    this._btnClip1.stop();
                    this._btnClip1.visible = false;
                }
            }
        }

        //铸魂
        private upGrade(): void {
            if (EquipmentZuHunModel.instance.getmaterialItemNum() > 0) {
                EquipmentZuHunCtrl.instance.ZhuhunOper(this._currPart, EquipmentZuHunModel.instance._materialItemID[0]);

                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
            } else {
                BagUtil.openLackPropAlert(EquipmentZuHunModel.instance._materialItemID[0], 1);
            }
        }

        //一键铸魂
        private oneKeyUpGrade(): void {
            if (EquipmentZuHunModel.instance.getmaterialItemNum() > 0) {
                // let exp1 = EquipmentZuHunModel.instance.getmaterialItemExp();
                // let exp2 = this.isUpMin();
                // if (exp1 < exp2) {
                //     BagUtil.openLackPropAlert(EquipmentZuHunModel.instance._materialItemID[0], 1);
                //     return;
                // }
                EquipmentZuHunCtrl.instance.ZhuhunOperOneKey(EquipmentZuHunModel.instance._materialItemID[0]);

                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
            } else {
                BagUtil.openLackPropAlert(EquipmentZuHunModel.instance._materialItemID[0], 1);
            }
        }

        /**
         * 一键铸魂 当前选中材料时候 满足 最小升级需求的 部位 需求经验
         */
        public isUpMin(): number {
            let zongNum = EquipmentZuHunModel.instance.getmaterialItemNum();
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) return;

            // let minPart = this._currPart;
            let minExp = 0;
            let minLv = 0;
            for (let index = 0; index < equipsDic.keys.length; index++) {
                let part: int = equipsDic.keys[index];
                let equip: Protocols.Item = equipsDic.get(part);
                let EquipmentZhuHunDate = EquipmentZuHunModel.instance.zhuhunList[part];
                if (EquipmentZhuHunDate) {
                    let exp = EquipmentZhuHunDate[ZhuhunGridsFields.exp];
                    let level = EquipmentZhuHunDate[ZhuhunGridsFields.level];
                    let maxValue = EquipmentZhuHunCfg.instance.getMaxLevelByPart(part);//当前部位最大等级
                    level = level > maxValue ? maxValue : level;//判断最大等级防止越界
                    let cfg = EquipmentZhuHunCfg.instance.getDateByPartAndLevel(part, level);
                    let maxExp = cfg[zhuhunFields.exp];
                    let chaExp = maxExp - exp;
                    if (minLv == 0) {
                        minLv = level;
                    }
                    if (minExp == 0) {
                        minExp = chaExp;
                    }
                    //....
                    // if (level <= minLv) {
                    if (chaExp < minExp) {
                        minExp = chaExp;
                    }
                }

            }
            return minExp;
        }
        /**
         * 播放升阶动画
         * @param index 如果需要播放多个  这个传数组
         */
        private playUpEff(index: any = 0) {
            //一键升级
            if (index == 0) {
                this._upGradeEffect[this._currPart].visible = true;
                this._upGradeEffect[this._currPart].play();
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong.png");
            } else {
                for (let i: int = 0, len: int = (<Array<number>>index).length; i < len; i++) {
                    this._upGradeEffect[index[i]].visible = true;
                    this._upGradeEffect[index[i]].play();
                }
            }
            this.itemClickHandler(this._currPart);
        }

        private closeEff(index: int): void {
            this._upGradeEffect[index].visible = false;
        }


        // 装备数据初始化
        private equipInitedHandler(): void {
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic || equipsDic.keys.length == 0) return;

            for (let index = 0; index < equipsDic.keys.length; index++) {
                let key = equipsDic.keys[index];
                let value = equipsDic.get(key);
                this.setEquip(key, value);
            }
            for (let index = 0; index < this._effKeyArr.length; index++) {
                let element = this._effKeyArr[index];
                this._upGradeEffect[element].visible = false;
            }

            // let arrKey = new Array<number>();
            // for (let index = 0; index < equipsDic.keys.length; index++) {
            //     let element = equipsDic.keys[index];
            //     if (element) {
            //         arrKey.push(element);
            //     }
            // }
            // this._partDic.keys.sort((A: number, B: number): number => {
            //     return A > B ? 1 : -1;
            // });
            // for (let index = 0; index < arrKey.length; index++) {
            //     let key = arrKey[index];
            //     let value = equipsDic.get(arrKey[index]);
            //     this.setEquip(key, value);
            // }
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

                    let _redImg: Image = new Image("common/image_common_xhd.png");
                    _redImg.visible = false;
                    _redImg.name = "redImg";
                    _redImg.pos(80, -8);
                    //bagItem.addChildAt(_redImg, 3);
                    bagItem.addChildAt(_redImg, 5);
                    bagItem.visible = true;
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
                this.addChild(bagItem);
                bagItem.dataSource = equip;
            }
        }

        public close(): void {
            super.close();
            if (this._proCtrlTween) {
                this._proCtrlTween.stop();
            }
            if (this._btnClip) this._btnClip.stop();
            if (this._btnClip1) this._btnClip1.stop();
        }

        public destroy(): void {
            this._currFrame = this.destroyElement(this._currFrame);
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
            this._btnClip = this.destroyElement(this._btnClip);
            this._btnClip1 = this.destroyElement(this._btnClip1);
            if (this._proCtrlTween) {
                this._proCtrlTween.stop();
                this._proCtrlTween = null;
            }
            this._proCtrl = this.destroyElement(this._proCtrl);
            super.destroy();
            this._equipPos.length = 0;
            this._effKeyArr.length = 0;
        }

        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.instenBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -16, true);
            this._btnClip.scaleY = 1.2;
            // this._btnClip.scale(0.8, 0.8);
            this._btnClip.visible = false;

            // this._btnClip1 = new CustomClip();
            // this._btnClip1.skin = "assets/effect/btn_light.atlas";
            // this._btnClip1.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip1.durationFrame = 5;
            // this._btnClip1.loop = true;
            this._btnClip1 = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.oneInstenBtn.addChild(this._btnClip1);
            this._btnClip1.pos(-6, -17, true);
            this._btnClip1.scaleY = 1.2;
            // this._btnClip1.scale(0.8, 0.8);
            this._btnClip1.visible = false;
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
            WindowManager.instance.open(WindowEnum.EQUIPMENT_SOURCE_ALERT, null);
        }
    }
}
