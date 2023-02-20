///<reference path="../config/fight_talisman_cfg.ts"/>

namespace modules.fight_talisman {
    import Event = Laya.Event;
    import CustomClip = common.CustomClip;
    import CustomList = modules.common.CustomList;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FightTalismanCfg = modules.config.FightTalismanCfg;
    import fight_talisman = Configuration.fight_talisman;
    import fight_talismanFields = Configuration.fight_talismanFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendCfg = config.BlendCfg;
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    import BtnGroup = modules.common.BtnGroup;

    export class FightTalismanPanel extends ui.FightTalismanMedalAlertUI {
        constructor() {
            super();
        }

        private _list: CustomList;
        private _activeBtnEff: CustomClip;  //按钮粒子效果
        private _btnGroup: BtnGroup;
        protected initialize(): void {
            super.initialize();
            //按钮粒子效果
            this._activeBtnEff = CommonUtil.creatEff(this.activateBtn, "btn_light", 15);
            this._activeBtnEff.pos(-5, -15);
            this._activeBtnEff.scaleX = 1.12;
            // this.centerX = this.centerY = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.medal1, this.medal2, this.medal3, this.medal4);

            this._list = new CustomList();
            this._list.width = 711;
            this._list.height = 440;
            this._list.x = 95;
            this._list.y = 494;
            this._list.spaceY = 6;
            this._list.itemRender = FightTalismanItem;
            this.addChildAt(this._list, 2);

            for (let i = 1; i <= 4; i++) {
                this[`medal${i}`].icon.skin = `fight_talisman_and_money_cat/image_item${i}.png`;
            }
        }

        public destroy(): void {
            super.destroy();
            if (this._activeBtnEff) {
                this._activeBtnEff.destroy();
                this._activeBtnEff = null;
            }
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._list = this.destroyElement(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.activateBtn, Event.CLICK, this, this.activateBtnHandler);        //一键激活
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.update);       //画面刷新事件
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.update);
            this.addAutoListener(this.rightTip, Event.CLICK, this, this.turnRight);
            this.addAutoListener(this.leftTip, Event.CLICK, this, this.turnLeft);

            for (let index = 1; index <= 4; index++) {
                this.addAutoListener(this[`medal${index}`], Event.MOUSE_OVER, this, this.mouseEnter, [index - 1]);
                this.addAutoListener(this[`medal${index}`], Event.MOUSE_OUT, this, this.mouseLeave, [index - 1]);
            }

            this.addAutoRegisteRedPoint(this.medal1.rpImg, ["fightTalismanYeShouRP"]);
            this.addAutoRegisteRedPoint(this.medal2.rpImg, ["fightTalismanZhuFuRP"]);
            this.addAutoRegisteRedPoint(this.medal3.rpImg, ["fightTalismanJueXingRP"]);
            this.addAutoRegisteRedPoint(this.medal4.rpImg, ["fightTalismanTuTengRP"]);
        }

        private mouseEnter(enterone: number) {
            console.log("MOUSEENTER", enterone);
            if (typeof enterone !== "number" || this._btnGroup.selectedIndex == enterone) return;
            this[`medal${enterone + 1}`].imgseleted.visible = true;
        }

        private mouseLeave(enterone: number) {
            console.log("MOUSELEAVE", enterone);
            if (typeof enterone !== "number" || this._btnGroup.selectedIndex == enterone) return;
            this[`medal${enterone + 1}`].imgseleted.visible = false;
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
        }

        private update(): void {
            //显示隐藏获取途径
            FightTalismanModel.instance.selected = this._btnGroup.selectedIndex;
            console.log("UPDATETIMES", this._btnGroup.selectedIndex);
            let actived: number = FightTalismanModel.instance.actived;      //已激活的护符
            let canActive: number = FightTalismanModel.instance.canActived;   //可激活的护符

            this.updateMedal(FightTalismanModel.instance.currMedalType()); // 激活的勋章类型
            this.changeHandler();
            //按钮特效
            if (actived != -1 && actived < canActive) {
                this._activeBtnEff.visible = true;
                this._activeBtnEff.play();
            }
            else {
                this._activeBtnEff.visible = false;
            }

            if (actived == -1 && (FightTalismanModel.instance.allState[this._btnGroup.selectedIndex] == true)) {
                this._activeBtnEff.visible = true;
                this._activeBtnEff.play();
            }

            // 列表排序&列表随index更新
            let dats: Array<FightTalismanItemValue> = [];
            let tempArr: Array<fight_talisman> = FightTalismanCfg.instance.arr;
            let id = this._btnGroup.selectedIndex + 1;
            let arr = tempArr.filter((ele) => ele[fight_talismanFields.id] === id)
            let len: number = arr.length;


            for (let i = 0; i < len; ++i) {
                if (arr[i][fight_talismanFields.era] <= actived) {
                    dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.actived]);
                }
                else if (arr[i][fight_talismanFields.era] <= canActive) {
                    dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.canActive]);
                }
                else {
                    dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.unActive]);
                }
            }

            this._list.datas = dats;
            this.atkValue();
            this.visTips();
        }

        private atkValue() {
            let tempArr: Array<fight_talisman> = FightTalismanCfg.instance.arr;
            let actived: Array<number> = FightTalismanModel.instance.allActived;      //已激活的护符
            let canActive: number = FightTalismanModel.instance.canActived;   //可激活的护符
            let arr = tempArr;
            let sumFightValue: number = 0;
            let sumCanValue: number = 0;
            for (let i = 0; i < tempArr.length; i++) {
                if (FightTalismanModel.instance.currMedalType() == 1 && tempArr[i][fight_talismanFields.id] == 1) {
                    if (tempArr[i][fight_talismanFields.era] <= actived[0]) {
                        sumFightValue += tempArr[i][fight_talismanFields.fighting];
                    }
                    if (tempArr[i][fight_talismanFields.era] <= canActive) {
                        sumCanValue += tempArr[i][fight_talismanFields.fighting];
                    }
                } else if (FightTalismanModel.instance.currMedalType() == 2) {
                    if (arr[i][fight_talismanFields.id] == 1) {
                        if (arr[i][fight_talismanFields.era] <= actived[0]) {
                            sumFightValue += tempArr[i][fight_talismanFields.fighting];
                        }
                        if (tempArr[i][fight_talismanFields.era] <= canActive) {
                            sumCanValue += tempArr[i][fight_talismanFields.fighting];
                        }
                    } else if (arr[i][fight_talismanFields.id] == 2) {
                        if (arr[i][fight_talismanFields.era] <= actived[1]) {
                            sumFightValue += tempArr[i][fight_talismanFields.fighting];
                        }
                        if (tempArr[i][fight_talismanFields.era] <= canActive) {
                            sumCanValue += tempArr[i][fight_talismanFields.fighting];
                        }
                    }
                } else if (FightTalismanModel.instance.currMedalType() == 3 || FightTalismanModel.instance.currMedalType() == 4) {
                    for (let j = 0; j < 4; j++) {
                        if (arr[i][fight_talismanFields.id] == j + 1) {
                            if (arr[i][fight_talismanFields.era] <= actived[j]) {
                                sumFightValue += tempArr[i][fight_talismanFields.fighting];
                            }
                        }
                    }
                    if (tempArr[i][fight_talismanFields.era] <= canActive) {
                        sumCanValue += tempArr[i][fight_talismanFields.fighting];
                    }
                }
            }

            this.sumFight.value = sumFightValue.toString();
            this.sumCan.text = sumCanValue.toString();
            this.sumCan.visible = sumCanValue == sumFightValue ? false : true;
            this.sumCan.visible = (FightTalismanModel.instance.currMedalType() !== 1);
        }

        // 当前勋章激活状态
        private updateMedal(mel: number) {
            for (let i = 1; i <= 4; i++) this[`medal${i}`].visible = true;
            this.activateBtn.y = 950;
            this.frontBg.visible = true;
            this._list.height = 450;
            switch (mel) {
                case 1:
                    for (let i = 1; i <= 4; i++) this[`medal${i}`].visible = false;
                    this.activateBtn.y = 1060;
                    this.frontBg.visible = false;
                    this._list.height = 540;
                    break;
                case 2:
                    this.medal1.centerX = -65;
                    this.medal2.centerX = 65;
                    this.medal3.visible = this.medal4.visible = false;
                    break;
                case 3:
                case 4:// 全开状态
                    this.medal1.centerX = -196;
                    this.medal2.centerX = -65;
                    this.medal3.centerX = 65;
                    this.medal4.centerX = 196;
                    break;
                default:
                    break;
            }
        }

        private changeHandler() {
            switch (this._btnGroup.selectedIndex) {
                case 0:
                    this.selected(0);
                    break;
                case 1:
                    this.selected(1);
                    break;
                case 2:
                    this.selected(2);
                    break;
                case 3:
                    this.selected(3);
                    break;
            }
        }

        private selected(index: number) {
            // icon变化
            this.medalIcon.skin = `fight_talisman_and_money_cat/image_xz${index + 1}.png`;
            this.medalIconBg.skin = `fight_talisman_and_money_cat/img_xz${index + 1}.png`;
            let items: Array<number>
            switch (index) {
                case 0:
                case 1:
                    items = BlendCfg.instance.getCfgById(49002 + index)[blendFields.intParam];
                    this.baseItem.dataSource = [items[0], items[1], 0, null];
                    break;
                case 2:
                    items = BlendCfg.instance.getCfgById(49004)[blendFields.intParam];
                    this.baseItem.dataSource = [items[0], items[1], 0, null];
                    break;
                case 3:
                    items = BlendCfg.instance.getCfgById(49004)[blendFields.intParam];
                    this.baseItem.dataSource = [items[2], items[3], 0, null];
                    break;
                default:
                    break;
            }

            // 按钮变化
            for (let i = 1; i <= 4; i++) this[`medal${i}`].imgseleted.visible = false;
            this[`medal${index + 1}`].imgseleted.visible = true;

            let currType = FightTalismanModel.instance.currMedalType();
            if (index == 3) index = 2;
            if (currType !== index + 1) {
                if (FightTalismanModel.instance.allActived[index] == -1) {
                    this.activateBtn.label = "点击领取";
                } else {
                    this.activateBtn.label = "一键领取";
                }
            } else {
                this.activateBtn.label = "激活勋章";
            }
        }

        //一键激活
        private activateBtnHandler(): void {

            console.log("actived", FightTalismanModel.instance.actived, FightTalismanModel.instance.allActived, FightTalismanModel.instance.allState);
            if (!FirstPayModel.instance.giveState) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }

            if (FightTalismanModel.instance.actived == -1) {
                this.wayToGetHandler();     //如果还没购买或激活，将跳转到购买页面
            }
            else if (FightTalismanModel.instance.actived < FightTalismanModel.instance.canActived) {
                FightTalismanCtrl.instance.activeTalisman(this._btnGroup.selectedIndex + 1);
            }
            else if (FightTalismanModel.instance.actived == FightTalismanCfg.instance.arr[FightTalismanCfg.instance.arr.length - 1][fight_talismanFields.era]) {
                SystemNoticeManager.instance.addNotice("已激活护符的全部战力", false);      //系统提示
            }
            else {
                SystemNoticeManager.instance.addNotice("提升转生数可领取战力", true);      //系统提示
            }
        }

        //获取途径
        private wayToGetHandler(): void {
            //如果已首充
            // if(FirstPayModel.instance.giveState){
            WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);      //战力护符购买页面
            // }
            // else{
            //     WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);      //首充页面
            // }
        }

        close() {
            super.close();
        }

        private turnRight() {
            let currIndex = this._btnGroup.selectedIndex;
            this._btnGroup.selectedIndex = currIndex + 1 >= 3 ? 3 : currIndex + 1;
            this.update();
        }

        private turnLeft() {
            let currIndex = this._btnGroup.selectedIndex;
            this._btnGroup.selectedIndex = currIndex - 1 <= 0 ? 0 : currIndex - 1;
            this.update();
        }

        private visTips() {

            if (this._btnGroup.selectedIndex == 3) {
                this.leftTip.visible = true;
                this.rightTip.visible = false;
            } else if (this._btnGroup.selectedIndex == 0) {
                this.leftTip.visible = false;
                this.rightTip.visible = true;

            } else {
                this.leftTip.visible = true;
                this.rightTip.visible = true;
                if (FightTalismanModel.instance.currMedalType() == 2) {
                    this.rightTip.visible = false;
                }
            }
            if (FightTalismanModel.instance.currMedalType() == 1) {
                this.leftTip.visible = this.rightTip.visible = false;
            }
        }
    }
}