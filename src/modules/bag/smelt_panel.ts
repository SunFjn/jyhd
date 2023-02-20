namespace modules.bag {
    import Event = laya.events.Event;
    import Image = laya.ui.Image;
    import ItemFields = Protocols.ItemFields;
    import ItemSmeltCfg = modules.config.ItemSmeltCfg;
    import item_smeltFields = Configuration.item_smeltFields;
    import TweenGroup = utils.tween.TweenGroup;
    import CustomClip = modules.common.CustomClip;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class SmeltPanel extends ui.SmeltViewUI {
        // 熔炼进度条控制器
        private _smeltProCtrl: ProgressBarCtrl;

        // 熔炼格子背景是否已添加
        private _smeltGridBgsAdded: boolean;

        private _btnEff: CustomClip;
        private _showNum: number;
        private _showItem: Array<BaseItem>;
        private _smeltId: Array<number>;
        private _progressbarWidth: number;
        private _smeltLevel: number;

        private _hasClick: boolean;
        private _onePage: boolean;

        private _smeltClip: Array<CustomClip>;
        private _forwardWid: number;

        private _tweenGroup: TweenGroup;

        private _effectNum: number;
        private _effectPlayNum: number;
        private _effectStop: boolean;
        private _effectCache: Array<Image>;
        private _runingQueue: Array<Image>;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.bottom = 0;
            this._smeltClip = new Array<CustomClip>();
            this._showNum = 20;

            this._smeltLevel = -1;
            this._forwardWid = -1;
            this._hasClick = false;
            this._onePage = false;

            this._btnEff = CommonUtil.creatEff(this.smeltBtn, "btn_light", 15);
            this._btnEff.pos(-5, -18);
            this._btnEff.scaleY = 1.2;
            this._btnEff.scaleX = 1.23;
            this._btnEff.play();

            this._smeltId = new Array<number>();
            this._progressbarWidth = 380;

            this._effectNum = 0;
            this._effectStop = true;
            this._effectPlayNum = 0;
            this._smeltProCtrl = new ProgressBarCtrl(this.progressBar, this._progressbarWidth, this.progressTxt);

            this.regGuideSpr(GuideSpriteId.BAG_SMELT_ONE_KEY_BTN, this.smeltBtn);

            this._tweenGroup = new TweenGroup();
            this._effectCache = [];
            this._runingQueue = [];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.smeltBtn, LayaEvent.CLICK, this, this.smeltHandler);
            this.addAutoListener(this.colorSelectPanel, "select_color", this, this.colorSelectChange);
            this.addAutoListener(this.stageSelectPanel, "select_stage", this, this.stageSelectChange);
            this.addAutoListener(this.starSelectPanel, "select_star", this, this.starSelectChange);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SMELT_UPDATE, this, this.smeltSuccess);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.getSmeltList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SMELT_SUCCEED, this, this.starEffect);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.updateAuto);
            this.addAutoListener(this, Event.CLICK, this, this.hideSelectList);

            this.addAutoRegisteRedPoint(this._btnEff, ["smeltRP"]);
        }


        public onOpened(): void {
            super.onOpened();
            this._btnEff.play();

            BagCtrl.instance.getSmeltInfo();

            BagModel.instance.oneKeySmelt = false;
            // 初始化熔炼数据
            this.addSmeltGridBgs();
            //初始化炉子数据
            this.updateSmeltShow();
            // 选择熔炼装备
            this.selectSmeltEquips();

            this.updateAuto();

            this.defineSelect();
        }

        private updateAuto(): void {
            let state: boolean = zhizun.ZhizunModel.instance.state == 1;
            if (state) { //开了
                this.autoTxt.underline = false;
                this.autoTxt.off(common.LayaEvent.CLICK, this, this.autoTxtHandler);
                this.autoTxt.text = `已开启自动熔炼`;
            } else {
                this.autoTxt.underline = true;
                this.addAutoListener(this.autoTxt, common.LayaEvent.CLICK, this, this.autoTxtHandler);
                this.autoTxt.text = `开启自动熔炼`;
            }
        }

        private autoTxtHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
        }

        private hideSelectList(): void {
            if (this._smeltGridBgsAdded) {
                if (this.colorSelectPanel.isOpen) {
                    this.colorSelectPanel.openHandler(null);  //初始对应的内容
                }
                if (this.stageSelectPanel.isOpen) {
                    this.stageSelectPanel.openHandler(null);
                }
                if (this.starSelectPanel.isOpen) {
                    this.starSelectPanel.openHandler(null);
                }
            }
        }

        // 添加熔炼原始背景设置三个选项的对应数据
        private addSmeltGridBgs(): void {
            if (!this._smeltGridBgsAdded) { //没有初始化数据
                this._smeltGridBgsAdded = true;
                this._showItem = new Array<BaseItem>();
                for (let i: int = 0; i < this._showNum; i++) {//加入空格子
                    this._showItem[i] = new BaseItem();
                    this._showItem[i].needTip = false;
                    this.addChild(this._showItem[i]);
                    this._showItem[i].pos(i % 5 * 120 + 31 + 39, (i / 5 >> 0) * 120 + 148 + 400, true);
                    this._showItem[i].dataSource = null;
                    this._smeltClip[i] = this._smeltClip[i] || new CustomClip();
                    this._showItem[i].addChild(this._smeltClip[i]);
                    this._smeltClip[i].skin = "assets/effect/smelt_effect.atlas";
                    this._smeltClip[i].frameUrls = ["smelt_effect/0.png", "smelt_effect/1.png", "smelt_effect/2.png", "smelt_effect/3.png"];
                    this._smeltClip[i].durationFrame = 5;
                    this._smeltClip[i].loop = false;
                    this._smeltClip[i].pos(-49, -47, true);
                    this._smeltClip[i].visible = false;
                }
                this.addChild(this.colorSelectPanel);
                this.addChild(this.stageSelectPanel);
                this.addChild(this.starSelectPanel);

                this.colorSelectPanel.initData("color");
                this.stageSelectPanel.initData("stage");
                this.starSelectPanel.initData("star");
            }
            this.getSmeltList();
        }

        //获取最新的可熔炼列表
        private getSmeltList(): void {
            BagModel.instance.setSmeltRank();
            this.selectSmeltEquips();
        }

        private smeltSuccess(): void {
            this.updateSmeltShow();
            this._effectNum = 0;
            this._effectPlayNum = 0;
        }

        private updateSmeltShow(): void {
            let lv = BagModel.instance.smeltLevel;   //当前等级
            let exp = BagModel.instance.smeltExp;
            let cfg = ItemSmeltCfg.instance.getItemCfgByLevel(lv); //当前等级对应的表中的数据
            let nextCfg = ItemSmeltCfg.instance.getItemCfgByLevel(lv + 1);  //下一等级对应的表中的数据
            let maxExp = cfg[item_smeltFields.exp];

            this.levelTxt.text = ` LV.${lv}`;
            this.powerNum.value = `${cfg[item_smeltFields.fighting]}`;
            // this.progressTxt.text = `${exp}/${maxExp}`;
            this.attrTxt1.text = `${cfg[item_smeltFields.hp]}`;
            this.attrTxt2.text = `${cfg[item_smeltFields.attack]}`;
            if (nextCfg) {  //设置增长值
                let hp = nextCfg[item_smeltFields.hp] - cfg[item_smeltFields.hp];
                let attack = nextCfg[item_smeltFields.attack] - cfg[item_smeltFields.attack];
                this.attrIncreaseTxt1.text = `${hp}`;
                this.attrIncreaseTxt2.text = `${attack}`;
            }
            let wid = this._forwardWid;
            this._forwardWid = Math.floor(exp / maxExp * this._progressbarWidth);

            if (this._smeltLevel != -1) {
                if (lv > this._smeltLevel) { //跨级处理

                    TweenJS.create(this._smeltProCtrl, this._tweenGroup).to({ value: maxExp }, (this._progressbarWidth - wid) / this._progressbarWidth * 500).onComplete((): void => {
                        this._smeltProCtrl.value = 0;
                        this._smeltProCtrl.maxValue = maxExp;
                        if (this._forwardWid > 0) {
                            TweenJS.create(this._smeltProCtrl, this._tweenGroup).to({ value: exp }, Math.floor(exp / maxExp * 500)).start();
                        }
                    }).start();
                } else {      // 同级缓动至当前值
                    if (nextCfg) {
                        TweenJS.create(this._smeltProCtrl, this._tweenGroup).to({ value: exp }, Math.floor(exp / maxExp * 500)).start();
                    } else {
                        this._smeltProCtrl.maxValue = exp;
                        this._smeltProCtrl.value = exp;
                    }
                }
            } else {
                // this.progressBar.width = this._forwardWid;  //最开始的初始化
                if (!nextCfg) { //满级
                    this._smeltProCtrl.maxValue = exp;
                } else {
                    this._smeltProCtrl.maxValue = maxExp;
                }
                this._smeltProCtrl.value = exp;
            }
            this._smeltLevel = lv;
        }

        // 根据选择内容来选择熔炼装备（保存之前玩家选择）
        private selectSmeltEquips(): void {
            if (!this._effectStop) {
                return;
            }
            let equips: Protocols.Item[] = BagModel.instance.getSmeltRank();
            this._smeltId = []; //重置id
            if (!equips) {  //如果没有装备
                for (let j = 0; j < this._showNum; j++) {
                    this._showItem[j].dataSource = null;  //清空显示装备
                }
                return;
            }
            let len: int = 0;
            if (equips.length > this._showNum) {
                BagModel.instance.oneKeySmelt = true;
                this._onePage = false;
                len = this._showNum;
            } else {
                len = equips.length;
                this._onePage = true;
            }
            for (let i: int = 0; i < len; i++) {
                this._showItem[i].dataSource = equips[i];
                this._smeltId[i] = equips[i][ItemFields.uid];
            }
            if (this._onePage) {
                for (let j = len; j < this._showNum; j++) {
                    this._showItem[j].dataSource = null;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SELECT_SMELT_UPDATE);
        }

        //熔炼物品颜色选择
        private colorSelectChange(index: number): void {
            BagModel.instance.smeltColor = BagSmeltUtil.colorIndex[index];
            this.selectSmeltEquips();
        }

        //熔炼物品阶数选择
        private stageSelectChange(index: number): void {  //最低从第5阶开始选
            BagModel.instance.smeltStage = BagModel.instance.maxStage - (index ? --index : 0);
            this.selectSmeltEquips();
        }

        //熔炼物品星级选择
        private starSelectChange(index: number): void {
            BagModel.instance.smeltStar = BagSmeltUtil.starIndex[index];
            this.selectSmeltEquips();
        }

        //熔炼物品默认选择
        private defineSelect() {
            BagModel.instance.smeltColor = BagSmeltUtil.colorIndex[1];
            BagModel.instance.smeltStage = BagModel.instance.maxStage;
            BagModel.instance.smeltStar = BagSmeltUtil.starIndex[3];
            this.selectSmeltEquips();
        }

        // 一键熔炼
        private smeltHandler(): void {

            let animation = true

            //新增 一键熔炼取消动画  还未实装   animation=false
            if (animation) {
                for (let i: int = 0, len: int = this._tweenGroup.getAll().length; i < len; i++) {
                    let tween: TweenJS = this._tweenGroup.getAll()[i];
                    if (tween.isPlaying) {
                        CommonUtil.noticeError(18001);
                        return;
                    }
                }
                // if (this._hasClick && BagModel.instance.oneKeySmelt) {
                //     CommonUtil.noticeError(18001);
                //     return;
                // }
                this.oneKeySmelt();
                if (this._onePage) { //如果只有一页信息，没有必要开始循环
                    return;
                }
                this._hasClick = true;
                //Laya.timer.loop(1000, this, this.loopHander);
            } else {
                // 新需求：不需要展示动画 直接一键熔炼
                BagModel.instance._inBagQuicklySmelt = true;
                BagModel.instance.quicklyOneKeySmelt();
            }



        }

        private loopHander(): void {
            if (this._onePage) {
                //Laya.timer.clear(this, this.loopHander);
                this._hasClick = false;
                BagModel.instance.oneKeySmelt = false;
            }
            this.oneKeySmelt();
        }

        private oneKeySmelt(): void {
            //向服务器发起请求
            if (this._smeltId.length == 0) {
                CommonUtil.noticeError(18002);
                return;
            }
            BagCtrl.instance.oneKeySmelt(this._smeltId);
            this._effectStop = false;
        }

        private starEffect(): void {
            let hasListen = false;
            let len = 5 * this._effectPlayNum + 5;
            for (let i = 5 * this._effectPlayNum; i < len; i++) {
                if (!this._smeltId[i]) {
                    //this._effectStop = true
                    return;
                }
                this._smeltClip[i].play();
                this._smeltClip[i].visible = true;
                if (!hasListen) {
                    this._smeltClip[i].on(Event.COMPLETE, this, this.effectHandler);
                    hasListen = true;
                }

                // 飘星特效
                let img: Image = this._effectCache.length ? this._effectCache.pop() : new Image("bag/zs_hecheng_2.png");
                this.addChild(img);
                img.anchorX = img.anchorY = 0.5;
                img.pos(this._showItem[i].x + 55, this._showItem[i].y + 55, true);
                img.alpha = 1;
                this._runingQueue.push(img);
                let startX: number = img.x;
                let startY: number = img.y;
                let endX: number = 350;
                let endY: number = 300;
                let midX: number = 0.3 * endX + 0.7 * startX;
                let midY: number = 0.3 * endY + 0.7 * startY;
                let k: number = (startX - endX) / (endY - startY);
                let b: number = midY - k * midX;
                let angle: number = Math.atan(k);
                let rand: number = Math.random() + 0.5;
                let t: int = Math.random() < 0.5 ? 1 : -1;
                let destX: number = midX + 100 * Math.sin(angle) * rand * t;
                let destY: number = midY + 100 * Math.cos(angle) * rand * t;
                let callback = (): void => {
                    img.removeSelf();
                    ArrayUtils.remove(this._runingQueue, img);
                    this._effectCache.push(img);
                };
                TweenJS.create(img, this._tweenGroup).to({ x: destX, y: destY }, 300).chain(
                    TweenJS.create(img, this._tweenGroup).to({
                        x: endX,
                        y: endY,
                        alpha: 0.3
                    }, 400 + Math.random() * 400).onComplete(callback).onStop(callback)
                ).start();
                this._showItem[i].dataSource = null;
            }
            if (this._smeltId[len]) {
                this._effectPlayNum++;
                Laya.timer.once(200, this, this.starEffect);
            }
        }

        private effectHandler(): void {
            for (let i = 5 * this._effectNum; i < 5 * this._effectNum + 5; i++) {
                this._smeltClip[i].visible = false;
                this._smeltClip[i].off(Event.COMPLETE, this, this.effectHandler);
            }
            this._effectNum++;
            if (!this._effectStop) {
                if (!this._smeltId[this._effectNum * 5]) {
                    this._effectStop = true;
                }
            }
            if (this._effectStop) {
                this.selectSmeltEquips();//先进行选择
                if (this._hasClick) {
                    this.loopHander();
                } else {
                    BagModel.instance.showGetAlert();
                }
            }
        }

        private hideAllEffect(): void {
            if (this._smeltClip && this._smeltClip.length > 0) {
                for (let i = 0; i < this._showNum; i++) {
                    this._smeltClip[i].visible = false;
                }
            }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.starEffect);
            if (this._tweenGroup) {
                this._tweenGroup.removeAll();
            }
            for (let e of this._runingQueue) {
                e.removeSelf();
                this._effectCache.push(e);
            }
            this._onePage = true;
            this._effectStop = true;
            this.hideAllEffect();
            Laya.timer.clear(this, this.starEffect);
            this._hasClick = false;
            BagModel.instance.oneKeySmelt = false;
            BagModel.instance.initRecive();
            modules.bag.BagCtrl.instance.showSmelt_upgrade_alert(2);
        }

        private updateHandler(bagId: BagId): void {
            let index: int = bagId;
            if (index == 1) {  //装备为1而且界面可见,更新选择的装备
                this.selectSmeltEquips();
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._effectCache = this.destroyElement(this._effectCache);
            this._runingQueue = this.destroyElement(this._runingQueue);
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            this._btnEff = this.destroyElement(this._btnEff);
            this._showItem = this.destroyElement(this._showItem);
            this._smeltClip = this.destroyElement(this._smeltClip);
            this.colorSelectPanel = this.destroyElement(this.colorSelectPanel);
            this.stageSelectPanel = this.destroyElement(this.stageSelectPanel);
            this.starSelectPanel = this.destroyElement(this.starSelectPanel);

            super.destroy(destroyChild);
        }

    }
}