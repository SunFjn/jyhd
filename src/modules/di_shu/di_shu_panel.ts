namespace modules.dishu {
    import BaseItem = modules.bag.BaseItem;
    import AutoSC_DiShuItemFields = Protocols.AutoSC_DiShuItemFields;
    import ItemsFields = Configuration.ItemsFields;
    import BagModel = modules.bag.BagModel;
    import di_shu_main_cfgFields = Configuration.di_shu_main_cfgFields;
    import AutoSC_DiShuInfo = Protocols.AutoSC_DiShuInfo;
    import AutoSC_DiShuOpenOpen = Protocols.AutoSC_DiShuOpenOpen;
    import AutoSC_DiShuOpenOpenFields = Protocols.AutoSC_DiShuOpenOpenFields;
    import Image = laya.ui.Image;
    import Text = Laya.Text;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import CustomClip = modules.common.CustomClip;
    import LackPropAlert = modules.commonAlert.LackPropAlert;
    import BagUtil = modules.bag.BagUtil;

    export class DishuPanel extends ui.DishuViewUI {
        private args: AutoSC_DiShuInfo;
        private tween_arr: Array<TweenJS>;
        private lianjiTween: TweenJS;
        private tween_bp: TweenJS;
        private _cfg: Array<Array<any>>
        private _chuiziPivot: Array<number>;
        private _chuiziImgArr: Array<laya.ui.Image>;
        private _bjIconArr: Array<laya.ui.Image>;
        private _bjTxtArr: Array<laya.ui.FontClip>;
        private lianjiTitImg: laya.ui.Image;
        private lianjiNumFont: laya.ui.FontClip;
        private _getbtnImg_arr: Array<Image>;
        private _pressBar_arr: Array<laya.ui.ProgressBar>
        private _Actuvated_arr: Array<Text>;
        private _notActuvated_arr: Array<Text>;
        private _acts_arr: Array<Image>;
        private _notacts_arr: Array<Image>;
        private _row_arr: Array<BaseItem>;
        private _geted_arr: Array<Image>;
        private _getsuc_arr: Array<Image>;
        private _getsucBox_arr: Array<any>;
        private _eff: Array<CustomClip>;
        private _bigeff: CustomClip;
        private _geteff: Array<CustomClip>;
        private _getbigeff: CustomClip;

        private _dishueff: Array<CustomClip>
        private _dishu_arr: Array<Image>

        private startTime: number
        private times: number

        private _Diglett: Array<laya.ui.Image>;
        private _base: Array<BaseItem>

        private _img: laya.ui.Image

        protected initialize(): void {
            super.initialize();
            this._chuiziPivot = [65, 69];
            this._chuiziImgArr = [];
            this._bjIconArr = []
            this._bjTxtArr = []
            this.tween_arr = [];
            this._dishueff = [];
            this._dishu_arr = [];
            this._Diglett = [];
            this.times = 1;
            this.startTime = 0;
            this._base = [];

            this.args = DishuModel.instance.DiShuData;
            for (let row = 0; row < this.args.length; row++) {
                for (let line = 0; line < this.args[row].length; line++) {
                    let XY = row * 5 + line
                    this._Diglett[XY] = new laya.ui.Image();
                    this._Diglett[XY].skin = "dishu/image_shu.png";
                    this._base[XY] = new BaseItem();
                    this._base[XY].scaleX = 0.8
                    this._base[XY].scaleY = 0.8
                    if (XY == 0) {
                        this._base[0].x = this._Diglett[0].x = 0
                    } else {
                        if (row == 0) {
                            this._Diglett[XY].x = this._Diglett[XY - 1].x + 100
                            this._Diglett[XY].y = 0
                        }
                        else {
                            this._Diglett[XY].x = this._Diglett[XY - this.args.length].x
                            this._Diglett[XY].y = 100 * row
                        }
                    }
                    this._base[XY].x = this._Diglett[XY].x + 10
                    this._base[XY].y = this._Diglett[XY].y + 10

                    this._base[XY].visible = true
                    this._Diglett[XY].visible = true
                    this.zhijia.addChildAt(this._base[XY], 0)
                    this.zhijia.addChildAt(this._Diglett[XY], 1)

                }
            }
            for (let i = 0; i < this._Diglett.length; i++) {
                // 创建大锤子
                this._chuiziImgArr[i] = new laya.ui.Image();
                this._chuiziImgArr[i].alpha = 0;
                this._chuiziImgArr[i].skin = CommonUtil.getIconById(DishuModel.instance.maozhua);
                this._chuiziImgArr[i].x = this._Diglett[i].x - 20
                this._chuiziImgArr[i].y = this._Diglett[i].y
                this._chuiziImgArr[i].visible = false;
                this._chuiziImgArr[i].pivot(this._chuiziPivot[0], this._chuiziPivot[1]);
                this.chuiziBox.addChild(this._chuiziImgArr[i])

                //暴击
                this._bjIconArr[i] = new laya.ui.Image();
                this._bjIconArr[i].alpha = 1;
                this._bjIconArr[i].skin = "dishu/baoji.png"
                this._bjIconArr[i].x = this._Diglett[i].x - 10
                this._bjIconArr[i].y = this._Diglett[i].y
                this._bjIconArr[i].scale(0.8, 0.8);
                this._bjIconArr[i].visible = false;
                this.bjBox.addChild(this._bjIconArr[i])

                this._bjTxtArr[i] = new laya.ui.FontClip();
                this._bjTxtArr[i].skin = "dishu/hongse.png";
                this._bjTxtArr[i].sheet = "1234567890";
                this._bjTxtArr[i].value = "2";
                this._bjTxtArr[i].x = 56;
                this._bjTxtArr[i].scale(1.8, 1.8);
                this._bjIconArr[i].addChild(this._bjTxtArr[i]);

                this._dishu_arr[i] = this._Diglett[i]
                this.creatExplodeeffect(i)

            }


            // 归类组件
            this._getbtnImg_arr = [this.getbtnImg1, this.getbtnImg2, this.getbtnImg3, this.getbtnImg4];
            this._pressBar_arr = [this.pressBar1, this.pressBar2, this.pressBar3, this.pressBar4];
            this._Actuvated_arr = [this.Actuvated1, this.Actuvated2, this.Actuvated3, this.Actuvated4];
            this._notActuvated_arr = [this.notActuvated1, this.notActuvated2, this.notActuvated3, this.notActuvated4];
            this._acts_arr = [this.acts1, this.acts2, this.acts3, this.acts4];
            this._notacts_arr = [this.notacts1, this.notacts2, this.notacts3, this.notacts4];
            this._row_arr = [this.row1, this.row2, this.row3, this.row4];
            this._geted_arr = [this.geted1, this.geted2, this.geted3, this.geted4];
            this._getsuc_arr = [this.getsuc1, this.getsuc2, this.getsuc3, this.getsuc4];
            this._getsucBox_arr = [this.Box1, this.Box2, this.Box3, this.Box4]
            this.bigPrize.needTip = true;

            // 设置材料
            this.chuiziImgs.skin = CommonUtil.getIconById(DishuModel.instance.maozhua, true);

            // 获取配置
            this._cfg = DishuCfg.instance.getDishuByLevel(DishuModel.instance.level);

            //进度条
            for (let i = 0; i < this._pressBar_arr.length; i++) {
                this._pressBar_arr[i].sizeGrid = "0,0,0,0,1"//上右下左
                this._pressBar_arr[i].x = this._getbtnImg_arr[i].x - 6
                this._pressBar_arr[i].y = this._getbtnImg_arr[i].y + 153
                this._pressBar_arr[i].rotation = -90
            }
            //初始化特效
            this._eff = [];
            this._geteff = [];
            this.creatbigEffect()
            for (let i = 0; i < this._row_arr.length; i++) {
                this.creatEffect(i)
            }
            //连击
            this.lianjiTitImg = new laya.ui.Image();
            this.lianjiTitImg.alpha = 1;
            this.lianjiTitImg.skin = "dishu/baoji.png"
            this.lianjiTitImg.x = 442
            this.lianjiTitImg.y = 666
            this.lianjiTitImg.visible = false;
            this.lianjiTitImg.pivot(56, 56);
            this.addChild(this.lianjiTitImg)

            this.lianjiNumFont = new laya.ui.FontClip();
            this.lianjiNumFont.skin = "dishu/hongse.png";
            this.lianjiNumFont.sheet = "1234567890";
            this.lianjiNumFont.value = "2";
            this.lianjiNumFont.x = 56;
            this.lianjiNumFont.scale(1.8, 1.8);
            this.lianjiTitImg.addChild(this.lianjiNumFont);
            // DishuModel.instance.p = this.test.bind(this)    
        }

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.getBtnHandler);           // 奖励预览
            this.addAutoListener(this.autobtn, laya.events.Event.CLICK, this, this.gainAlldishu)
            // this.autobtn.mouseEnabled=false
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_CKICK_UPDATE, this, this.dishuBtnHandlerReply); //地鼠成功返回
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_PANEL_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_ROWPRIZE_UPDATE, this, this.getbtnBtnHandlerReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_BIGPRIZE_UPDATE, this, this.gainBigPrizeReply); //领取终极大奖
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.setItemNun);



        }


        protected removeListeners(): void {
            super.removeListeners();
       
        }

        public onOpened(): void {
            super.onOpened();
            DishuModel.instance.dishuObj(this, this.bigPrizeShow);
            this.setItemNun();
            DishuCtrl.instance.getLoginInfo();

            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.dishu);
            if (DishuModel.instance.getEndTime < 0) {
                this.activityTxt.text = "无时限";
                this.activityTxt.color = "#B2F4B2";
            } else if (DishuModel.instance.getEndTime >= GlobalData.serverTime && isOpen) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityTxt.text = "活动已结束";
                this.activityTxt.color = "#FF2727";
            }
        }

        public updateView() {
            // Laya.stage.cacheAs = "normal"


            this.dishuListener()
            // 设置地鼠列表 - - - -
            this.autobtn.selected = false
            this.addAutoListener(this.autobtn, common.LayaEvent.CLICK, this, this.gainAlldishu);





            // 获取配置
            this._cfg = DishuCfg.instance.getDishuByLevel(DishuModel.instance.level);

            // 层文字
            this.ceng.text = DishuModel.instance.level as any as string;
            this.args = DishuModel.instance.DiShuData;
            let _rowAwd: Array<number> = DishuModel.instance.RowAwd;

            // 设置每个地鼠奖励
            this.args.forEach((item, row) => {
                item.forEach((element, line) => {
                    let num = this.arrKeyToIndex([row, line])
                    this.bj(num, element[AutoSC_DiShuItemFields.violence])
                    if (element[AutoSC_DiShuItemFields.Type] == 1) {
                        this._Diglett[num].visible = true
                        this._base[num].visible = false
                    }
                    else if (element[AutoSC_DiShuItemFields.Type] == 2) {
                        this._Diglett[num].visible = false
                        this._base[num].visible = true
                    }
                    else if (element[AutoSC_DiShuItemFields.Type] == 3) {
                        this._Diglett[num].visible = false
                        this._base[num].visible = false
                    }

                    // 判断道具是否存在
                    if (CommonUtil.getItemCfgById(element[AutoSC_DiShuItemFields.id])) {
                        this._base[num].dataSource = [this.args[row][line][AutoSC_DiShuItemFields.id], this.args[row][line][AutoSC_DiShuItemFields.count], 0, null];
                    }

                    //进度条
                    if (row < 2) {
                        let _dishu_arr1: Array<number> = this.getJihuoStatusByRowLine(0, true) as Array<number>;
                        this.dishuPress(0, _dishu_arr1.length)
                    } else if (row > 2) {
                        let _dishu_arr2: Array<number> = this.getJihuoStatusByRowLine(1, true) as Array<number>;
                        this.dishuPress(1, _dishu_arr2.length)
                    }
                    if (line < 2) {
                        let _dishu_arr3: Array<number> = this.getJihuoStatusByRowLine(2, true) as Array<number>;
                        this.dishuPress(2, _dishu_arr3.length)

                    } else if (line > 2) {
                        let _dishu_arr4: Array<number> = this.getJihuoStatusByRowLine(3, true) as Array<number>;
                        this.dishuPress(3, _dishu_arr4.length)
                    }
                });
            })




            // 设置行奖励状态
            for (let i = 0; i < this._row_arr.length; i++) {
                this._row_arr[i].dataSource = [this._cfg[di_shu_main_cfgFields.Row][i][ItemsFields.itemId], this._cfg[di_shu_main_cfgFields.Row][i][ItemsFields.count], 0, null];
                if (typeof _rowAwd[i] != 'undefined' && _rowAwd[i] == 1) {
                    //已领取
                    this._getsuc_arr[i].visible = false
                    this._geted_arr[i].visible = true
                    this._notacts_arr[i].visible = this._notActuvated_arr[i].visible = this._pressBar_arr[i].visible = false
                    this._acts_arr[i].visible = this._Actuvated_arr[i].visible = this._getbtnImg_arr[i].visible = true
                    this._row_arr[i].needTip = true

                    continue
                }
                //未领取
                // 判断是否可领取
                if (this.getJihuoStatusByRowLine(i, false)) {
                    // console.log('// 可领取');
                    // 可领取
                    this.setJihuoStatus(i);
                } else {
                    // console.log('// 不可领取');
                    // 不可领取
                    this._getsuc_arr[i].visible = false
                    this._geted_arr[i].visible = false

                    this._notacts_arr[i].visible = this._notActuvated_arr[i].visible = this._pressBar_arr[i].visible = true
                    this._acts_arr[i].visible = this._Actuvated_arr[i].visible = this._getbtnImg_arr[i].visible = false

                    // 监听事件
                    this.addAutoListener(this._notActuvated_arr[i], common.LayaEvent.CLICK, this, this.getjihuoBtnHandler, [i]);
                }
            }

            this.bigPrizeShow()
        }
        //倒计时
        private activityHandler(): void {
            this.activityTxt.color = "#B2F4B2";
            this.activityTxt.text = `倒计时：${modules.common.CommonUtil.timeStampToDayHourMinSecond(DishuModel.instance.getEndTime)}`;
            if (DishuModel.instance.getEndTime < GlobalData.serverTime) {
                this.activityTxt.color = "#FF2727";
                this.activityTxt.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }
        // 坐标转换
        private indexToArrkey = (index: number) => [Math.trunc(index / 5), index % 5]
        // 坐标转换
        private arrKeyToIndex = (arr: Array<number>) => arr[0] * 5 + arr[1]


        // 监听地鼠点击事件
        public dishuListener() {
            for (let i = 0; i < this._Diglett.length; i++) {
                this.addAutoListener(this._Diglett[i], common.LayaEvent.CLICK, this, this.dishuBtnHandler, [i]);
            }
            // this.notAlert()
        }

        // 判断道具是否足够
        public get judgeItemNum(): boolean {
            return BagModel.instance.getItemCountById(DishuModel.instance.maozhua) >= this._cfg[di_shu_main_cfgFields.OpenCount][0][ItemsFields.count]
        }

        // 设置拥有道具数量
        public setItemNun() {
            this.itemNumText.text = `${BagModel.instance.getItemCountById(DishuModel.instance.maozhua)}/${this._cfg[di_shu_main_cfgFields.OpenCount][0][ItemsFields.count]}`;
            if (this.judgeItemNum) {
                this.itemNumText.color = "#71E722";
            } else {
                this.itemNumText.color = "#FF2727";
            }
        }

        /**
         * 获取行奖励按钮激活状态
         * @param rowLine 行奖励序号
         * @param count 是否获取数量
         * @returns 
         */
        private getJihuoStatusByRowLine(rowLine: number, count: boolean): Array<number> | boolean {
            // 获取未打的地鼠
            let _dishu_arr: Array<number> = [];

            if (rowLine < 2) {
                let f_i: number = rowLine < 1 ? 0 : 15;
                for (let i = f_i; i < f_i + 10; i++) {
                    if (this._Diglett[i].visible) {
                        if (count)
                            _dishu_arr.push(i);
                        else
                            return false;
                    }
                }
            } else {
                let f_i: number = rowLine < 3 ? 0 : 3;
                for (let i = f_i; i < 25; i = i + 5) {
                    for (let ii = i; ii < i + 2; ii++) {
                        if (this._Diglett[ii].visible) {
                            if (count)
                                _dishu_arr.push(ii);
                            else
                                return false;
                        }
                    }
                }
            }
            return count ? _dishu_arr : true;
        }

        // 设置成激活状态
        private setJihuoStatus(rowLine: number) {
            // 展示状态
            this._getsuc_arr[rowLine].visible = true
            this._geted_arr[rowLine].visible = false
            this._row_arr[rowLine].needTip = false
            this._notacts_arr[rowLine].visible = this._notActuvated_arr[rowLine].visible = this._pressBar_arr[rowLine].visible = false
            this._acts_arr[rowLine].visible = this._Actuvated_arr[rowLine].visible = this._getbtnImg_arr[rowLine].visible = true
            this._eff[rowLine].play()
            this._geteff[rowLine].play()

            // 监听可领取事件
            this.addAutoListener(this._getsucBox_arr[rowLine], common.LayaEvent.CLICK, this, this.getbtnBtnHandler, [rowLine]);
            this.bigPrizeShow();
        }

        //可领取特效
        private creatEffect(rowLine: number) {
            this._eff[rowLine] = CustomClip.createAndPlay("assets/effect/activityEnter.atlas", "activityEnter", 8);
            this._getbtnImg_arr[rowLine].addChild(this._eff[rowLine]);
            this._eff[rowLine].pos(5, 7);
            this._eff[rowLine].scale(1.7, 1.7);
            this._eff[rowLine].visible = true;

            this._geteff[rowLine] = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this._getsuc_arr[rowLine].addChild(this._geteff[rowLine])
            this._geteff[rowLine].pos(-5, -6);//向上-y 向左-x
            this._geteff[rowLine].scale(0.6, 0.5);
            this._geteff[rowLine].visible = true;
        }
        private creatbigEffect() {
            this._bigeff = CustomClip.createAndPlay("assets/effect/activityEnter.atlas", "activityEnter", 8);
            this.getBigImg.addChild(this._bigeff)
            this._bigeff.pos(5, 10);//向上-y 向左-x
            this._bigeff.scale(1.9, 1.9);
            this._bigeff.visible = true;

            this._getbigeff = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.getsucBigImage.addChild(this._getbigeff)
            this._getbigeff.pos(-5, -6);//向上-y 向左-x
            this._getbigeff.scale(0.6, 0.5);
            this._getbigeff.visible = true;
        }
        //打击特效
        private creatExplodeeffect(index: number) {
            this._dishueff[index] = CustomClip.createAndPlay("assets/effect/HitEffect.atlas", "HitEffect", 5, true, false);
            this._dishu_arr[index].addChild(this._dishueff[index])
            this._dishueff[index].pos(16, -6);// 向左-x 向上-y
            this._dishueff[index].scale(0.6, 0.5);
            this._dishueff[index].visible = false;

        }




        //发送打击地鼠消息号
        public dishuBtnHandler(index: number) {
            this.bigPrizeShow()
            // this._Diglett[index].off(laya.events.Event.CLICK, this, this.dishuBtnHandler);
            if (!this.bigPrizeShow()) {
                return;
            }
            if (!this.judgeItemNum) {
                this.notAlert()
                return CommonUtil.noticeError(44108);
            }
            
            let _arr = this.indexToArrkey(index)
            DishuCtrl.instance.getDishuInfo(_arr[0], _arr[1])
        }

        // 打地鼠成功返回消息
        public dishuBtnHandlerReply(tupleArr: Array<AutoSC_DiShuOpenOpen>) {
            for (let i = 0; i < tupleArr.length; i++) {
                let row = tupleArr[i][AutoSC_DiShuOpenOpenFields.row]
                let line = tupleArr[i][AutoSC_DiShuOpenOpenFields.line]
                let b = tupleArr[i][AutoSC_DiShuOpenOpenFields.b]
                DishuModel.instance.setDishuGetStatus(row, line);
                this.deadth(row, line, b)
            }

        }
        //暴击
        private bj(index: number, b: number) {

            switch (b) {
                case 0:
                    this._bjIconArr[index].visible = false;
                    break
                case 1:
                    this._bjIconArr[index].visible = true;
                    this._bjTxtArr[index].value = "2";
                    break;
                case 2:
                    this._bjIconArr[index].visible = true;
                    this._bjTxtArr[index].value = "3";
                    break;
            }
        }
        //连击
        private double() {
            if (GlobalData.serverTime - this.startTime > 2400) {
                this.times = 1;
                return;
            }
            this.times++;

            if (this.lianjiTitImg.visible) {
                if (typeof this.lianjiTween != "undefined") {
                    this.lianjiTween.stop();
                }
            } else {
                this.lianjiTitImg.visible = true;
            }

            this.lianjiNumFont.value = this.times as any as string;
            let that = this;
            this.lianjiTween = TweenJS.create(this.lianjiTitImg)
                .to({ scaleX: 1.5, scaleY: 1.5 }, 300)
                .repeat(0)
                .onComplete(function () {

                    that.lianjiTween = TweenJS.create(that.lianjiTitImg)
                        .to({ scaleX: 1, scaleY: 1 }, 300)
                        .repeat(0)
                        .onComplete(function () {


                            that.lianjiTween = TweenJS.create(that.lianjiTitImg)
                                .delay(1800)
                                .onComplete(function () {
                                    that.lianjiTitImg.visible = false;
                                })
                                .start()
                        })
                        .start()
                })
                .start()
        }

        // 打地鼠结尾---锤子动画
        private deadth(row: number, line: number, b: number) {
            this.double()
            this.startTime = GlobalData.serverTime;
            let index = this.arrKeyToIndex([row, line]);
            this._chuiziImgArr[index].rotation = this._chuiziImgArr[index].alpha = 0;
            this._chuiziImgArr[index].x = this._Diglett[index].x - 10
            this._chuiziImgArr[index].y = this._Diglett[index].y
            this._chuiziImgArr[index].visible = true;
            let that = this
            that.tween_arr[index] = TweenJS.create(this._chuiziImgArr[index])
                .to({ alpha: 1, rotation: 40 }, 200)
                .repeat(0)
                .onComplete(function () {
                    that.tween_arr[index] = TweenJS.create(that._chuiziImgArr[index])
                        .to({ alpha: 1, rotation: -40 }, 150)
                        .repeat(0).onComplete(function () {

                            that._dishueff[index].play()
                            that._dishueff[index].visible = true

                            that.tween_arr[index] = TweenJS.create(that._chuiziImgArr[index])
                                .to({ alpha: 1, rotation: -40 }, 20)
                                .repeat(0)
                                .delay(150)
                                .onComplete(function () {
                                    that._chuiziImgArr[index].visible = false;
                                    // b  暴击
                                    that.bj(index, b)
                                    that.bagShow(index, row, line, b)
                                    that._dishueff[index].visible = false
                                })
                                .start()
                        })
                        .start()
                })
                .start()
        }

        //进度条pressbar
        private dishuPress(rowLine: number, num: number) {
            for (let i = 0; i < this._pressBar_arr.length; i++) {
                this._pressBar_arr[rowLine].value = (10 - num) / 10
            }
        }

        // 显示道具
        private bagShow(index: number, row: number, line: number, b: number) {
            let _pos = this.indexToArrkey(index);
            this.args[_pos[0]][_pos[1]][AutoSC_DiShuItemFields.Type] = 2
            this._Diglett[index].visible = false
            this._base[index].visible = true

            // 获取所属行
            if (row < 2) {
                let _dishu_arr1: Array<number> = this.getJihuoStatusByRowLine(0, true) as Array<number>;
                this.dishuPress(0, _dishu_arr1.length)
                if (this.getJihuoStatusByRowLine(0, false)) {
                    this.setJihuoStatus(0);
                }
            } else if (row > 2) {
                let _dishu_arr2: Array<number> = this.getJihuoStatusByRowLine(1, true) as Array<number>;
                this.dishuPress(1, _dishu_arr2.length)

                if (this.getJihuoStatusByRowLine(1, false)) {
                    this.setJihuoStatus(1);
                }
            }
            if (line < 2) {
                let _dishu_arr3: Array<number> = this.getJihuoStatusByRowLine(2, true) as Array<number>;
                this.dishuPress(2, _dishu_arr3.length)

                if (this.getJihuoStatusByRowLine(2, false)) {
                    this.setJihuoStatus(2);
                }
            } else if (line > 2) {
                let _dishu_arr4: Array<number> = this.getJihuoStatusByRowLine(3, true) as Array<number>;
                this.dishuPress(3, _dishu_arr4.length)
                if (this.getJihuoStatusByRowLine(3, false)) {
                    this.setJihuoStatus(3);
                }
            }
        }

        // 一键激活按钮
        public getjihuoBtnHandler(rowLine: number) {
            // 移除一键激活事件
            // this._notActuvated_arr[rowLine].off(laya.events.Event.CLICK, this, this.getjihuoBtnHandler);
            if (!this.bigPrizeShow()) {
                return;
            }
            if (!this.judgeItemNum) { 
                this.notAlert()
                return CommonUtil.noticeError(44108);
           

            }

            // 获取拥有道具
            let have = BagModel.instance.getItemCountById(DishuModel.instance.maozhua);
            // 获取每次消耗
            let need = this._cfg[di_shu_main_cfgFields.OpenCount][0][ItemsFields.count];
            // 计算总打击次数
            let _max = Math.trunc(have / need);

            // 获取未打的地鼠
            let _dishu_arr: Array<number> = this.getJihuoStatusByRowLine(rowLine, true) as Array<number>;

            for (let i = 0; i < _max && i < 10 && i < _dishu_arr.length; i++) {
                this.dishuBtnHandler(_dishu_arr[i]);
            }

        }

        // 领取按钮
        public getbtnBtnHandler(rowLine: number) {
            this._row_arr[rowLine].needTip = true
            DishuCtrl.instance.GainRank(rowLine);
        }

        public getbtnBtnHandlerReply(rowLine: number) {
            this._getsuc_arr[rowLine].visible = false
            this._geted_arr[rowLine].visible = true
            // 取消监听
            this._getsucBox_arr[rowLine].off(laya.events.Event.CLICK, this, this.getbtnBtnHandler);
            // 设置大奖可领取
            this.setBigPrizeStatus();
        }

        // 设置大奖可领取
        private setBigPrizeStatus() {
            for (let i = 0; i < this._geted_arr.length; i++) {
                if (this._geted_arr[i].visible != true) {
                    return false;
                }
            }
            this.getsucBigImage.visible = true;
            this.getBigImg.visible = true

            // this.bigPrize.needTip = false;

            this.addAutoListener(this.bigBox, common.LayaEvent.CLICK, this, this.gainBigPrizeHandler);
        }

        /**
         * 领取最终大奖
         */
        public gainBigPrizeHandler() {

            this.bigBox.off(laya.events.Event.CLICK, this, this.gainBigPrizeHandler);
            DishuCtrl.instance.GainBig();
        }

        public gainBigPrizeReply() {
            for (let i = 0; i < this._row_arr.length; i++) {
                if (this._getsuc_arr[i].visible == true) {
                    // 未全打开
                    this.getbtnBtnHandler(i)
                }
            }
            // 隐藏列表
            DishuModel.instance.ultimate[AutoSC_DiShuItemFields.Type] = 3
            // 进入下一层
            DishuCtrl.instance.getLoginInfo();
            this.bigPrize.needTip = true;
            for (let i = 0; i < this._row_arr.length; i++) {
                this._row_arr[i].needTip = true
            }

        }

        // 奖励预览
        public getBtnHandler(): void {

            WindowManager.instance.open(WindowEnum.DI_SHU_ALERT);
        }

        // 自动打地鼠
        public gainAlldishu() {

            this.notAlert()


            if (!this.bigPrizeShow()) {
                this.autobtn.selected = false;
                return;
            }
            // 判断四个按钮是未激活状态
            for (let i = 0; i < this._row_arr.length; i++) {
                if (!this.getJihuoStatusByRowLine(i, false)) {
                    // 未全打开
                    this.autobtn.selected = true;
                    DishuCtrl.instance.DiShuOpenAll();
                    return;
                }
            }
        }

        private notAlert(){

            if (BagModel.instance.getItemCountById(DishuModel.instance.maozhua) < this._cfg[di_shu_main_cfgFields.OpenCount][0][ItemsFields.count]) {
                let maozhuaId: number = DishuModel.instance.maozhua
                let needNum: number = this._cfg[di_shu_main_cfgFields.OpenCount][0][ItemsFields.count] - BagModel.instance.getItemCountById(DishuModel.instance.maozhua)
                BagUtil.openLackPropAlert(maozhuaId, needNum);

            }
        }

        private dishuAlert() {
            WindowManager.instance.open(WindowEnum.DI_SHU_PRIZE_ALERT);

        }
        //大奖展示
        public bigPrizeShow() {

            if (DishuModel.instance.ultimate[AutoSC_DiShuItemFields.Type] == 3) {
                this.dishuAlert()
                this.bigPrize.dataSource = null;
                this.bigPrize.addImg.visible = true
                this.getsucBigImage.visible = false
                this.getBigImg.visible = false
                this.dishuListener()
                for (let i = 0; i < this._row_arr.length; i++) {
                    this.addAutoListener(this._notActuvated_arr[i], common.LayaEvent.CLICK, this, this.getjihuoBtnHandler, [i]);
                    this._pressBar_arr[i].value = 0
                }
                this.addAutoListener(this.autobtn, common.LayaEvent.CLICK, this, this.gainAlldishu);
                this.addAutoListener(this.bigPrize, common.LayaEvent.CLICK, this, this.dishuAlert);


                return false;
            } else {
                this.bigPrize.off(laya.events.Event.CLICK, this, this.dishuAlert);
                this.bigPrize.dataSource = [DishuModel.instance.ultimate[AutoSC_DiShuItemFields.id], DishuModel.instance.ultimate[AutoSC_DiShuItemFields.count], 0, null]
                this.bigPrize.addImg.visible = false
                for (let i = 0; i < this._row_arr.length; i++) {
                    if (!this.getJihuoStatusByRowLine(i, false)) {
                        this.getsucBigImage.visible = false
                        this.getBigImg.visible = false
                        return true;
                    }
                }
                this.getsucBigImage.visible = true
                this.getBigImg.visible = true
                this.bigPrize.needTip = false

                this._bigeff.play()
                this._getbigeff.play()
                this.addAutoListener(this.bigBox, common.LayaEvent.CLICK, this, this.gainBigPrizeHandler);
                return true;
            }
        }

        public destroy() {
            super.destroy();
        }

        public close() {
            if (this.tween_arr.length > 0) {
                for (let key of this.tween_arr) {
                    if (typeof key != "undefined") {
                        key.stop();
                    }
                }
            }
            if (typeof this.tween_bp != "undefined") {
                this.tween_bp.stop();
            }
            if (this._eff.length > 0) {
                for (let key of this._eff) {
                    if (typeof key != "undefined") {
                        key.stop();
                    }
                }
            }
            if (this._geteff.length > 0) {
                for (let key of this._geteff) {
                    if (typeof key != "undefined") {
                        key.stop();
                    }
                }
            }
            if (this._dishueff.length > 0) {
                for (let key of this._dishueff) {
                    if (typeof key != "undefined") {
                        key.stop()
                    }
                }
            }
            if (this._bigeff) {
                this._bigeff.stop()
            }
            if (this._getbigeff) {
                this._getbigeff.stop()
            }


            super.close();

        }
    }

}

