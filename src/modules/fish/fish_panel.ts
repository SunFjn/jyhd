/**
 * 钓鱼面板
 */
namespace modules.fish {

    import Event = Laya.Event;
    import BagModel = modules.bag.BagModel;
    import BtnGroup = modules.common.BtnGroup;
    import BlendCfg = modules.config.BlendCfg;
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    const enum POND_FIELD {
        x_min,
        x_max,
        y_min,
        y_max
    }

    export class FishPanel extends ui.FishViewUI {

        constructor() {
            super();
        }

        private secKillTopBtnArr: BtnGroup;//顶部按钮数组
        private fishingBtnStatus: boolean;
        private ll: CustomList;
        private rl: CustomList;
        private list_data: Array<Configuration.Items>;
        private tween_obj: Array<TweenJS>;//滚动对象
        private tween_pot_max: number;
        private tween_duration: number;
        private youyu: Array<CustomClip>;
        // private pondEff: CustomClip;  //水波
        private pond: Array<number>; // 鱼塘范围 Xmin,max,Ymin,max
        private _btnClip: CustomClip;
        private _btnClip_ten: CustomClip;

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this.secKillTopBtnArr = new BtnGroup();//[this.secKillTopBtn1,this.secKillTopBtn2,this.secKillTopBtn3];//顶部按钮
            this.secKillTopBtnArr.setBtns(...this.tabBtnBox._childs);
            this.ll = new CustomList();
            this.rl = new CustomList();
            this.ll.hCount = this.rl.hCount = 1;
            this.ll.itemRender = this.rl.itemRender = modules.bag.BaseItem;
            this.ll.height = this.rl.height = 450;
            this.ll.width = this.rl.width = 100;
            // this.ll.spaceY = this.rl.spaceY = 10;
            // this.rl.x = this.listBox.width - this.rl.width;
            this.leftListPanel.addChild(this.ll);
            this.rightListPanel.addChild(this.rl);

            // 鱼塘范围 Xmin,max,Ymin,max
            // youyu width:144 height:68
            // 34 = 68 / 2
            // this.pond = new Array(127, 524, -34, this.pondPanel.height + 34);
            this.pond = new Array(21.6, 448.4, 10.2, 73.8);
            let _pond_pos3 = [
                new Array(this.pond[POND_FIELD.x_min], this.pond[POND_FIELD.x_max], (this.pond[POND_FIELD.x_max] - this.pond[POND_FIELD.x_min]) / 2),
                new Array(this.pond[POND_FIELD.y_min], this.pond[POND_FIELD.y_max], (this.pond[POND_FIELD.y_max] - this.pond[POND_FIELD.y_min]) / 2)
            ];

            this.youyu = new Array<CustomClip>();
            for (let i = 0; i < 8; i++) {
                this.youyu[i] = CustomClip.createAndPlay("assets/effect/youyu.atlas", "youyu", 5);
                // 缩放
                this.youyu[i].scale(0.3, 0.3);
                // 初始位置
                // console.log('vtz:',i % 3,Math.trunc(i / 3));
                this.youyu[i].pos(_pond_pos3[0][i % 3], _pond_pos3[1][Math.trunc(i / 3)]);
                // 锚点
                this.youyu[i].anchorX = this.youyu[i].anchorY = 0.5
            }

            this.pondPanel.addChildren(...this.youyu);
            // this.pondEff = CustomClip.createAndPlay("assets/effect/pond.atlas", "pond", 10, true, true, 10);
            // this.pondPanel.addChildren(this.pondEff);

            this.tween_obj = new Array();
            this.creatEffect();
        }

        public runYouyu(i: number) {
            var that = this;
            let x_to = CommonUtil.getRandomInt(this.pond[POND_FIELD.x_min], this.pond[POND_FIELD.x_max]);
            let y_to = CommonUtil.getRandomInt(this.pond[POND_FIELD.y_min], this.pond[POND_FIELD.y_max]);
            this.youyu[i].scaleX = x_to > this.youyu[i].x ? -0.3 : 0.3;
            if (this.tween_obj[i]) {
                this.tween_obj[i].stop();
            }
            this.tween_obj[i] = TweenJS.create(this.youyu[i]).to({ x: x_to, y: y_to }, 3141 + i * 100).start().repeat(0).onComplete(() => {
                that.runYouyu(i);
            });
            this.youyu[i].play();
        }

        protected addListeners(): void {
            super.addListeners();
            this.setFishBtnDisabled(true);
            this.addAutoListener(this.prizeBtn, LayaEvent.CLICK, this, this.prizeHandler);//奖励预览
            this.addAutoListener(this.showBtn, LayaEvent.CLICK, this, this.showHandler);//玩法说明
            this.addAutoListener(this.ckBtn, LayaEvent.CLICK, this, this.ckHandler);//垂钓宝库
            this.addAutoListener(this.rollBtn, LayaEvent.CLICK, this, this.rollHandler);//概率公示

            this.addAutoListener(this.secKillTopBtnArr, LayaEvent.CHANGE, this, this.selectHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.setItemNun);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_UPDATE, this, this.setItemNun);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_UPDATE, this, this.setFishBtnDisabled, [true]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[0], ["fishItemSate0"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[1], ["fishItemSate1"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[2], ["fishItemSate2"]);
        }

        protected removeListeners(): void {
            this.tweenObjStop();
            this.setFishBtnDisabled(false);
            super.removeListeners();
        }

        private tweenObjStop() {
            if (this.tween_obj[0]) {
                // 游鱼/列表缓动
                for (let i = 0; i < this.tween_obj.length; i++) {
                    this.tween_obj[i].stop();
                }
                // 游鱼帧动画
                for (let i = 0; i < this.youyu.length; i++) {
                    this.youyu[i].stop();
                }
            }
            // this.pondEff.stop();
        }


        private updateView() {
            this.setItemNun();
            this.setListData();

            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.fish);
            // console.log('vtz:GlobalData.serverTime', FishModel.instance.endTime);
            // console.log('vtz:isOpen', isOpen);
            if (FishModel.instance.endTime < 0) {
                this.setFishBtnDisabled(false);
                // console.log('vtz:abc');
                this.activityTxt.text = "无时限";
                this.activityTxt.color = "#61D24E";
            } else if (FishModel.instance.endTime >= GlobalData.serverTime && isOpen) {
                this.setFishBtnDisabled(true);
                // console.log('vtz:abc');
                this.activityTxt.color = "#61D24E";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.setFishBtnDisabled(false);
                // console.log('vtz:abc');
                this.activityTxt.text = "活动已结束";
                this.activityTxt.color = "#DD2800";
            }
        }

        private setItemNun() {
            let fish_grade = FishingCfg.instance.getFishGrade();
            // console.log('vtz:fish_grade', fish_grade);
            // console.log('vtz:FishModel.instance.blessing', FishModel.instance.blessing);
            let now_val = FishModel.instance.blessing[FishModel.instance.typeId];
            let max_val = fish_grade[FishModel.instance.typeId][Configuration.fishing_cfg__gradeFields.max];
            this.progressTxt.text = now_val + "/" + max_val;
            this.progressBar.value = now_val / max_val;

            let itemid = BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishMaterial, this.secKillTopBtnArr.selectedIndex);
            // console.log('vtz:itemid', itemid);
            // 材料
            this.priceImg1.skin = this.priceImg2.skin = CommonUtil.getIconById(itemid, true);

            let have = BagModel.instance.getItemCountById(itemid);
            let need = [1, 10];
            // 获取材料数量
            this.priceText1.text = have + "/" + need[0];
            this.priceText2.text = have + "/" + need[1];
            if (have < need[0]) {
                this.priceText1.color = this.priceText2.color = "#ff0000";
                this._btnClip.visible = false;
                this._btnClip.stop();
                this._btnClip_ten.visible = false;
                this._btnClip_ten.stop();
            } else if (have < need[1]) {
                this.priceText1.color = "#ffffff";
                this.priceText2.color = "#ff0000";
                this._btnClip.visible = true;
                this._btnClip.play();
                this._btnClip_ten.visible = false;
                this._btnClip_ten.stop();
            } else {
                this._btnClip.visible = true;
                this._btnClip.play();
                this._btnClip_ten.visible = true;
                this._btnClip_ten.play();
                this.priceText1.color = this.priceText2.color = "#ffffff";
            }
        }

        private activityHandler(): void {
            // this.setFishBtnDisabled(true);
            this.activityTxt.color = "#2ad200";
            this.activityTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(FishModel.instance.endTime)}`;
            if (FishModel.instance.endTime < GlobalData.serverTime) {
                this.setFishBtnDisabled(false);
                this.activityTxt.color = "#FF3e3e";
                this.activityTxt.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        /**
         * 奖励预览点击
         */
        private prizeHandler() {
            WindowManager.instance.open(WindowEnum.FISH_PRIZE_ALERT, FishModel.instance.typeId);
        }
        /**
         * 玩法说明点击
         */
        private showHandler() {
            // console.log('vtz:aaa', BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishAboutInfo, this.secKillTopBtnArr.selectedIndex));
            CommonUtil.alertHelp(BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishAboutInfo, this.secKillTopBtnArr.selectedIndex));
        }
        /**
         * 垂钓宝库点击
         */
        private ckHandler() {
            // console.log('vtz:aaa');
            WindowManager.instance.open(WindowEnum.FISH_CK_PANEL);
        }
        /**
         * 概率公示点击
         */
        private rollHandler() {
            // console.log('vtz:aaa', BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishRollInfo, this.secKillTopBtnArr.selectedIndex));
            CommonUtil.alertHelp(BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishRollInfo, this.secKillTopBtnArr.selectedIndex));
        }

        public onOpened(): void {
            super.onOpened();
            this.secKillTopBtnArr.selectedIndex = FishModel.instance.selectedIndex;


            // this.listPanel.height
        }

        private setListData() {
            // 设置列表内容
            this.list_data = FishModel.instance.getPrizeList();
            this.ll.datas = this.rl.datas = this.list_data;
            // 设置滚动对象
            // console.log('vtz:this.rl.getListH', this.rl.getListH);
            this.tween_pot_max = this.rl.getListH - this.rightListPanel.height;
            this.tween_duration = this.list_data.length * 1800;
            // 滚动起来
            // console.log('vtz:tweenRestart');
            this.ll.scrollPos = 0;
            this.rl.scrollPos = this.tween_pot_max;
            this.tweenObjStop();
            for (let i = 0; i < this.youyu.length; i++) {
                this.runYouyu(i);
            }
            // this.pondEff.play();
            this.tween_obj[this.youyu.length] = TweenJS.create(this.ll).to({ scrollPos: this.tween_pot_max }, this.tween_duration).yoyo(true).repeat(99999999).start();
            this.tween_obj[this.youyu.length + 1] = TweenJS.create(this.rl).to({ scrollPos: 0 }, this.tween_duration).yoyo(true).repeat(99999999).start();
        }

        /**
         * 钓鱼点击
         * @param num<number> 次数
         */
        private fishingHandler(num: number) {
            if (FishModel.instance.endTime < GlobalData.serverTime || !FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.fish)) {
                this.setFishBtnDisabled(false);
                return;
            }
            let num_id = [1, 10];
            // console.log('vtz:num', num);
            // console.log('vtz:num_id[num]', num_id[num]);

            // 禁用按钮
            this.setFishBtnDisabled(false);

            // 判断本钱够不够
            let itemid = BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishMaterial, this.secKillTopBtnArr.selectedIndex);
            // console.log('vtz:BagModel.instance.getItemCountById(itemid)', BagModel.instance.getItemCountById(itemid));
            if (BagModel.instance.getItemCountById(itemid) < num_id[num]) {
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [itemid, 0, true]);
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                this.setFishBtnDisabled(true);
                return;
            }

            // 发送请求
            FishCtrl.instance.GainFish(FishModel.instance.typeId, num);

            // 播放动画
        }

        /**
         * 设置按钮禁用状态
         * @param d<boolean> 是/否
         */
        private setFishBtnDisabled(d: boolean) {
            // console.log('vtz:d', d);
            this.fishingBtn.disabled = this.fishingTopBtn.disabled = this.fishingTenBtn.disabled = !d;
            if (d) {
                this.fishingBtn.on(Event.CLICK, this, this.fishingHandler, [0]);
                this.fishingTopBtn.on(Event.CLICK, this, this.fishingHandler, [0]);
                this.fishingTenBtn.on(Event.CLICK, this, this.fishingHandler, [1]);
            } else if (this.fishingBtnStatus) {
                this.fishingBtn.off(Event.CLICK, this, this.fishingHandler);
                this.fishingTopBtn.off(Event.CLICK, this, this.fishingHandler);
                this.fishingTenBtn.off(Event.CLICK, this, this.fishingHandler);

            }
            this.fishingBtnStatus = d;
        }

        /**
         * 切页
         */
        private selectHandler() {
            FishModel.instance.selectedIndex = this.secKillTopBtnArr.selectedIndex;
            if (this.secKillTopBtnArr.oldSelectedIndex >= 0) {
                this.tabBtnBgBox._childs[this.secKillTopBtnArr.oldSelectedIndex].visible = this.tabBorBox._childs[this.secKillTopBtnArr.oldSelectedIndex].visible = false;
            }
            this.tabBtnBgBox._childs[this.secKillTopBtnArr.selectedIndex].visible = this.tabBorBox._childs[this.secKillTopBtnArr.selectedIndex].visible = true;
            this.updateView();
            FishCtrl.instance.getLoginInfo(FishModel.instance.typeId);
        }

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.fishingBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -14, true);
            this._btnClip.scale(0.81, 0.85);
            this._btnClip.visible = false;
            this._btnClip_ten = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.fishingTenBtn.addChild(this._btnClip_ten);
            this._btnClip_ten.pos(-6, -14, true);
            this._btnClip_ten.scale(0.81, 0.85);
            this._btnClip_ten.visible = false;
        }

        public destroy(): void {
            super.destroy();
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._btnClip_ten) {
                this._btnClip_ten.removeSelf();
                this._btnClip_ten.destroy();
                this._btnClip_ten = null;
            }
        }
        public close() {
            this.tweenObjStop();
            super.close();
        }
    }
}