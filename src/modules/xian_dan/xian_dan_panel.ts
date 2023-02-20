///<reference path="../config/xian_dan_cfg.ts"/>
///<reference path="../common/custom_list.ts"/>
/** 仙丹 */
namespace modules.xianDan {
    import XianDanViewUI = ui.XianDanViewUI;
    import CustomClip = modules.common.CustomClip;
    import BtnGroup = modules.common.BtnGroup;
    import XianDanCfg = modules.config.XianDanCfg;
    import CustomList = modules.common.CustomList;
    import xiandanFields = Configuration.xiandanFields;
    import xiandan = Configuration.xiandan;
    import BagUtil = modules.bag.BagUtil;

    export class XianDanPanel extends XianDanViewUI {

        private _btnClip: CustomClip;
        private _btnGroup: BtnGroup;
        private _list: CustomList;
        private _isEnough: boolean;
        private _tempArr: any[];
        private _arrLength: number;
        private _selectedOne: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this._tempArr = new Array<any>();
            this._selectedOne = 0;
            this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._btnClip.pos(-5, -22);
            this._btnClip.scale(1, 1.3);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.item_0, this.item_1, this.item_2, this.item_3, this.item_4, this.item_5, this.item_6, this.item_7);
            this._arrLength = this._btnGroup.btns.length;
            this._btnGroup.btns.forEach((ele, index) => {
                (<XianDanIcon>ele).iconImg.skin = `xian_dan/btn_xdxt_${index}.png`;
                console.log(this._btnGroup.btns[6]);
                (<XianDanIcon>ele).id = XianDanCfg.instance.sIds[index];
            });

            // 初始化tempArr的位置，0为初始选中项
            for (let i = 0; i < this._arrLength; i++) {
                this._tempArr.push([this._btnGroup.btns[i].x, this._btnGroup.btns[i].y]);
            }

            this._list = CustomList.create('v', 40, 478, 640, 485, XianDanItem, 3);
            this.addChild(this._list);
        }

        // 点击时，重置所有元素位置，取出点击位置，移动到初始选中项的位置，其余项跟随移动
        reSetArrPos(selectOne: number) {
            // 公式推演出点击项距离初始位置的距离，Xleft为左边间隔数，Xright为右边间隔数
            let Xleft = this._selectedOne - selectOne > 0 ? this._arrLength - this._selectedOne + selectOne : selectOne - this._selectedOne;
            let Xright = this._arrLength - Xleft;
            let turnNum = Xleft >= Xright ? -Xright : Xleft;

            for (let i = 0; i < this._arrLength; i++) {
                // LDis是指初始位置据目标点的距离，即index - 0, preDis是值每个当前项要移动的目标项,0是tempArr的默认初始位置
                let Ldis = selectOne - 0;
                let preDis = i - Ldis >= 0 ? i - Ldis : this._arrLength + i - Ldis;
                for (let m = 0; m < Math.abs(turnNum); m++) {
                    let dism = Math.abs(turnNum) - m - 1;
                    let rightTurn = preDis - dism >= 0 ? preDis - dism : this._arrLength + preDis - dism;
                    let leftTurn = preDis + dism >= this._arrLength ? preDis + dism - this._arrLength : preDis + dism;
                    let dis = turnNum > 0 ? leftTurn : rightTurn;
                    setTimeout(() => {
                        TweenJS.create(this._btnGroup.btns[i]).to({ x: this._tempArr[dis][0], y: this._tempArr[dis][1] }, 500 / Math.abs(turnNum))
                            .easing(utils.tween.easing.linear.None)
                            .start()
                        if (dis == 0) {
                            TweenJS.create(this._btnGroup.btns[i]).to({ scaleX: 1.12, scaleY: 1.12 }, 500 / Math.abs(turnNum))
                                .easing(utils.tween.easing.linear.None)
                                .start()
                        } else {
                            TweenJS.create(this._btnGroup.btns[i]).to({ scaleX: 1, scaleY: 1 }, 500 / Math.abs(turnNum))
                                .easing(utils.tween.easing.linear.None)
                                .start()
                        }
                    }, (m * 500 / Math.abs(turnNum)));
                }
            }
            // 重置当前选中项为初始位置项
            this._selectedOne = selectOne;
        }


        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.addBtn, common.LayaEvent.CLICK, this, this.addHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANDAN_INFO_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANDAN_INFO_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANDAN_ITEMS_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_POSITION_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.changeHandler);
        }

        public onOpened(): void {
            super.onOpened();
            let selectOne = false;
            for (let i = 0; i < this._btnGroup.btns.length; i++) {
                if ((this._btnGroup.btns[i] as XianDanIcon).isSelectedIndex) {
                    this._btnGroup.selectedIndex = i;
                    selectOne = true;
                    break;
                }
            }
            if (!selectOne) {
                this._btnGroup.selectedIndex = 0;
            }
            this.updateView();
            CustomList.showListAnim(modules.common.showType.HEIGHT, this._list);
        }

        private updateView(): void {
            //战力计算
            let fight: number = 0;
            let ids: number[] = XianDanCfg.instance.ids;
            for (let id of ids) {
                let count: number = XianDanModel.instance.getUseCountById(id);
                let tempF: number = XianDanCfg.instance.getCfgById(id)[xiandanFields.fight];
                fight += count * tempF;
            }
            this.fightMsz.value = fight.toString();
        }

        private changeHandler(): void {
            //列表赋值
            let index: number = this._btnGroup.selectedIndex;
            let sId: number = XianDanCfg.instance.sIds[index];
            let ids: int[] = XianDanCfg.instance.getIdsBySId(sId);
            this._list.datas = ids;
            let btn: XianDanIcon = <XianDanIcon>this._btnGroup.selectedBtn;
            btn.frameImg.visible = true;
            let oldBtn: XianDanIcon = <XianDanIcon>this._btnGroup.oldSelectedBtn;
            oldBtn && oldBtn != btn && (oldBtn.frameImg.visible = false);

            this.reSetArrPos(index);
            //进度计算
            let limit: number = 0, value: number = 0;
            for (let id of ids) {
                let tLimit: number = XianDanModel.instance.getLimit(id);
                limit += tLimit;
                let count: number = XianDanModel.instance.getUseCountById(id);
                value += count;
            }
            this.proTxt.text = `${common.AttrUtil.formatFloatNum(value / limit)}%`;

            if (value / limit == 1) {
                this._isEnough = true;
            } else {
                this._isEnough = false;
            }

            let yetCount: number = XianDanModel.instance.getUseCountBySId(sId);
            let canCount: number = XianDanModel.instance.getLimitByVipLv();
            this.countTxt.text = `${yetCount}/${canCount}`;
            this.countTxt.color = yetCount < canCount ? `#168a17` : `#ff3e3e`;
            this.desTxt.text = `今日${XianDanUtil.names[index]}丹服用个数:`;

            //按钮处理
            if (yetCount >= canCount) {
                this.stopEff();
            } else {
                for (let id of ids) {
                    let count: number = XianDanModel.instance.getItemCountById(id);
                    let useCount: number = XianDanModel.instance.getUseCountById(id);
                    let canCount: number = XianDanModel.instance.getLimit(id);
                    if (count > 0 && useCount < canCount) {
                        this.playEff();
                        return;
                    }
                }
                this.stopEff();
            }
        }

        private playEff(): void {
            this._btnClip.play();
            this._btnClip.visible = true;
        }

        private stopEff(): void {
            this._btnClip.stop();
            this._btnClip.visible = false;
        }

        private btnHandler(): void {
            let index: number = this._btnGroup.selectedIndex;
            let sId: number = XianDanCfg.instance.sIds[index];
            let ids: int[] = XianDanCfg.instance.getIdsBySId(sId);
            let haveCount: boolean = false;

            for (let i = 0; i < ids.length; i++) {
                let count: number = XianDanModel.instance.getItemCountById(ids[i]);
                if (count > 0) {
                    haveCount = true;
                }
            }

            if (this._isEnough == true) {
                CommonUtil.noticeError(41902);
            }
            else if (XianDanModel.instance.getUseCountBySId(sId) == XianDanModel.instance.getLimitByVipLv()) {
                CommonUtil.noticeError(41901);
            }
            else if (!haveCount) {
                //TODO
                let id: number = 0;
                switch (index) {
                    case 0:
                        id = 13740031;
                        break;
                    case 1:
                        id = 13740032;
                        break;
                    case 2:
                        id = 13740033;
                        break;
                    case 3:
                        id = 13740034;
                        break;
                    case 4:
                        id = 13740035;
                        break;
                    case 5:
                        id = 13740036;
                        break;
                    case 6:
                        id = 13740037;
                        break;
                    case 7:
                        id = 13740038;
                        break;
                    default:
                        id = 13740031;
                        break;
                }
                BagUtil.openLackPropAlert(id, 1);
            }
            else {
                XianDanCtrl.instance.oneKeyUseXianDan(sId);
            }

        }
        private addHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.xianDanCount);
        }
        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}