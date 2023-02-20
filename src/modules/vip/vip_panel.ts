/**vip面板 */


namespace modules.vip {
    import VipViewUI = ui.VipViewUI;
    import Event = Laya.Event;
    import BagItem = modules.bag.BagItem;
    import Item = Protocols.Item;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import CustomClip = modules.common.CustomClip;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class VipPanel extends VipViewUI {
        constructor() {
            super();
        }

        private _showAward: Array<BagItem>;
        private _showNum: number;
        private _showY: number;
        private _starX: number;
        private _interX: number;
        private _halfInterX: number;
        private _showVip: number;
        private _state: number; //0前往,1可领，2已领
        private _isOdd: boolean; //判断是否为奇数
        private _initX: number;
        private _initAddX: number;
        private _initInterX: number;
        private _initHalfInterX: number;
        private _increaseShow: Array<[Image, Text]>;
        private _initIsOdd: boolean;
        private _initNum: number;
        private _progressWidth: number;
        private _btnClip: CustomClip;

        private prizeEffect: CustomClip;      //奖品特效
        // private _modelClip: AvatarClip;//奖品模型
        private _iconImgTweenJS: TweenJS;
        private _modelClipTweenJS: TweenJS;
        private _skeletonClip: SkeletonAvatar;

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this.prizeEffect) {
                this.prizeEffect.removeSelf();
                this.prizeEffect.destroy();
                this.prizeEffect = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip = this.destroyElement(this._skeletonClip);
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._showAward = new Array<BagItem>();
            this._increaseShow = new Array<[Image, Text]>();
            this._increaseShow[0] = [this.increaseShow1, this.increaseNum1];
            this._increaseShow[1] = [this.increaseShow2, this.increaseNum2];
            this._increaseShow[2] = [this.increaseShow3, this.increaseNum3];
            this._showNum = 5;
            this._showY = 953;
            this._starX = 60;
            this._interX = 124;
            this._halfInterX = 62;
            this._state = 0;
            this._initX = 65;
            this._initInterX = 210;
            this._initAddX = 18;
            this._initNum = 3;
            this._initHalfInterX = 105;
            this._progressWidth = 330;
            this.allLink.underline = true;
            this._isOdd = true;
            this._initIsOdd = true;

            this._btnClip = new CustomClip();
            this.receiveBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -15);
            this._btnClip.scale(0.8, 1);

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 4);
            // this._modelClip.pos(360, 604, true);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.mouseEnabled = false;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 674);
            this._skeletonClip.mouseEnabled = false;

            this.prizeEffect = new CustomClip();
            this.addChildAt(this.prizeEffect, 2);
            this.prizeEffect.scale(2, 2);
            this.prizeEffect.skin = "assets/effect/ok_state.atlas";
            this.prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this.prizeEffect.durationFrame = 5;
            // this.prizeEffect.play();
            this.prizeEffect.loop = true;
            this.prizeEffect.pos(103, 345);
            this.initAward();
        }

        private initAward(): void {
            for (let i = 0; i < this._showNum; i++) {
                this._showAward[i] = new BagItem();
                this.addChild(this._showAward[i]);
                this._showAward[i].y = this._showY;
                this._showAward[i].dataSource = null;
                this._showAward[i].visible = false;
            }
        }

        private setIncreasePos(): void {
            if (this._initIsOdd) {
                for (let i = 0; i < this._initNum; i++) {
                    let x = this._initX + i * this._initInterX;
                    this._increaseShow[i][0].x = x;
                    this._increaseShow[i][1].x = x + this._initAddX;
                    this._increaseShow[i][0].visible = this._increaseShow[i][1].visible = false;
                }
            } else {
                for (let i = 0; i < this._initNum; i++) {
                    if (i < this._initNum - 1) {
                        let x = this._initX + i * this._initInterX + this._initHalfInterX;
                        this._increaseShow[i][0].x = x;
                        this._increaseShow[i][1].x = x + this._initAddX;
                    }
                    this._increaseShow[i][0].visible = this._increaseShow[i][1].visible = false;
                }
            }
        }

        private setPos(): void {
            if (this._isOdd) {
                for (let i = 0; i < this._showNum; i++) {
                    let x = this._starX + i * this._interX;
                    this._showAward[i].x = x;
                    this._showAward[i].visible = false;
                }
            } else {
                for (let i = 0; i < this._showNum; i++) {
                    if (i < this._showNum - 1) {
                        let x = this._starX + i * this._interX + this._halfInterX;
                        this._showAward[i].x = x;
                    }
                    this._showAward[i].visible = false;
                }
            }
        }

        protected onOpened(): void {
            super.onOpened();
            WindowManager.instance.close(WindowEnum.LINE_CLEAR_OUT_ALERT);

            this.updatePage();
            this.levelUpdate();
            this.showMeiRiBox();
        }

        protected addListeners(): void {
            super.addListeners();
            this.allLink.on(Event.CLICK, this, this.allLineHandler);
            this.goBtn.on(Event.CLICK, this, this.goBtnHandler);
            this.goBottomBtn.on(Event.CLICK, this, this.goBtnHandler);
            this.leftBtn.on(Event.CLICK, this, this.leftBtnHandler);
            this.rightBtn.on(Event.CLICK, this, this.rightBtnHandler);
            this.receiveBtn.on(Event.CLICK, this, this.reciveBtnHandler);

            this.meiRiBox.on(Event.CLICK, this, this.meiRiBoxHandler);
            this.VipZeKouBox.on(Event.CLICK, this, this.VipZeKouBoxHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.updateShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_GET_REWARD, this, this.updatePage);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.showMeiRiBox);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.allLink.off(Event.CLICK, this, this.allLineHandler);
            this.goBtn.off(Event.CLICK, this, this.goBtnHandler);
            this.goBottomBtn.off(Event.CLICK, this, this.goBtnHandler);
            this.leftBtn.off(Event.CLICK, this, this.leftBtnHandler);
            this.rightBtn.off(Event.CLICK, this, this.rightBtnHandler);
            this.receiveBtn.off(Event.CLICK, this, this.reciveBtnHandler);

            this.meiRiBox.off(Event.CLICK, this, this.meiRiBoxHandler);
            this.VipZeKouBox.off(Event.CLICK, this, this.VipZeKouBoxHandler);
            if (this._iconImgTweenJS != null) {
                this._iconImgTweenJS.stop();
                this._iconImgTweenJS = null;
            }

            if (this._modelClipTweenJS != null) {
                this._modelClipTweenJS.stop();
                this._modelClipTweenJS = null;
            }
        }


        private meiRiBoxHandler(): void {
            WindowManager.instance.open(WindowEnum.VIP_MEIRI_AWARD_ALERT);
        }

        private VipZeKouBoxHandler(): void {
            WindowManager.instance.open(WindowEnum.GOLD_STORE_PANEL);
        }

        public showMeiRiBox() {
            // this.meiRiBox.visible = VipModel.instance.vipLevel > 0;
            this.meiRiBoxRpImg.visible = (!VipModel.instance.dayRewardState && VipModel.instance.vipLevel > 0);
            // this.meiRiBoxImg.gray = VipModel.instance.dayRewardState;
            this.receiveImg.visible = VipModel.instance.dayRewardState;
        }

        private updatePage(): void {
            this._showVip = VipModel.instance.getCanGetAward();
            this.refreshShow();
        }

        private updateShow(): void {
            this.levelUpdate();
            this.updateState();
        }

        private levelUpdate(): void {
            let level = VipModel.instance.vipLevel;
            let have = VipModel.instance.haveNum;
            let need = VipModel.instance.needNum;
            this.levelNum.value = level.toString();
            if (level == VipModel.instance.maxVipLevel) {
                this.showTxt.visible = this.differNum.visible = this.rmbName.visible = this.turnTo.visible = this.vipName.visible = this.upLevel.visible = false;
                this.progressShow.text = `${have}`;
                this.progressUp.width = this._progressWidth;
                this.maxBox.visible = true;
            } else {
                this.showTxt.visible = this.differNum.visible = this.rmbName.visible = this.turnTo.visible = this.vipName.visible = this.upLevel.visible = true;
                this.progressShow.text = `${have}/${need}`;
                this.progressUp.width = Math.floor((have / need) * this._progressWidth);
                let differ: string = (need - have).toString();
                this.differNum.value = differ;
                this.setTopNoticePos(differ.length);
                let vipLevel = level + 1;
                this.upLevel.value = vipLevel.toString();
                this.maxBox.visible = false;
            }
        }

        private setTopNoticePos(lenght: number): void {
            let firX = 254 + 24 * lenght;
            this.rmbName.x = firX;
            this.turnTo.x = firX + 50;
            this.vipName.x = firX + 150;
            this.upLevel.x = firX + 230;
        }

        private updateBtnShow(): void {
            if (this._showVip == VipModel.instance.maxVipLevel) {
                this.rightBtn.visible = false;
                this.leftBtn.visible = true;
            } else if (this._showVip == 1) {
                this.leftBtn.visible = false;
                this.rightBtn.visible = true;
            } else {
                this.leftBtn.visible = true;
                this.rightBtn.visible = true;
            }
        }

        private refreshShow(): void {
            this.updateBtnShow();
            //通过等级读取对应数据
            let cfg: privilege = VipModel.instance.getVipCfgByLevel(this._showVip);
            this.levelGiftName.skin = `assets/icon/ui/privilege/${cfg[privilegeFields.bigRewardName]}.png`;
            this.levelGiftShow.value = `${this._showVip}`;

            let powerNum = cfg[privilegeFields.bigRewardPower];
            let powerStr = powerNum.toString();
            if (powerNum == 0) {
                this.levelGiftPower.visible = this.levelGiftPowerNum.visible = this.powerEnd.visible = false;
            } else {
                this.levelGiftPowerNum.align = 'left';
                this.levelGiftPower.visible = this.levelGiftPowerNum.visible = true;
                this.levelGiftPowerNum.value = powerStr;
                this.powerEnd.visible = false;
            }

            this.levelPowerShow.value = `${this._showVip}`;
            let allPower: Array<string> = cfg[privilegeFields.addPower];
            let powerLenght = allPower.length;
            if (powerLenght % 2 == 0) {
                this._initIsOdd = false;
                this.setIncreasePos();
                if (powerLenght == 2) {
                    this.setPowerShow(0, allPower);
                }
            } else {
                this._initIsOdd = true;
                this.setIncreasePos();
                if (powerLenght == 1) {
                    this.setPowerShow(1, allPower);
                } else if (powerLenght == 3) {
                    this.setPowerShow(0, allPower);
                }
            }
            let reward: Array<Items> = cfg[privilegeFields.reward];
            let lenght = reward.length;
            if (lenght % 2 == 0) {
                this._isOdd = false;
                this.setPos();  //设置位置居中显示
                if (lenght == 4) {
                    this.setRewardShow(0, reward);
                } else if (lenght == 2) {
                    this.setRewardShow(1, reward);
                }
            } else {
                this._isOdd = true;
                this.setPos();
                if (lenght == 5) {
                    this.setRewardShow(0, reward);
                } else if (lenght == 3) {
                    this.setRewardShow(1, reward);
                } else if (lenght == 1) {
                    this.setRewardShow(2, reward);
                }
            }
            this.updateState();
            let isModel: number = cfg[privilegeFields.isModel];
            let bigReward: number = cfg[privilegeFields.bigReward];
            let isMove: number = cfg[privilegeFields.isMove];
            let isTeXiao: number = cfg[privilegeFields.isTeXiao];
            if (isTeXiao == 1) {
                this.prizeEffect.visible = true;
                this.prizeEffect.play();
            } else {
                this.prizeEffect.visible = false;
                this.prizeEffect.stop();
            }
            if (isModel == 2) {
                bigReward = cfg[privilegeFields.bigReward];
            }
            this.showMode(isModel, bigReward, isMove);

            if (this._showVip < VipModel.instance.getPrivilegeRange()) {
                this.rightBtn.gray = false;
            } else if (this._showVip == VipModel.instance.getPrivilegeRange()) {
                if (this._showVip != VipModel.instance.maxVipLevel) {
                    SystemNoticeManager.instance.addNotice("提升vip等级可查看更多特权信息", true);
                }
                this.rightBtn.gray = true;
            }
        }

        public showMode(isModel: number, bigReward: number, isMove: number) {
            if (isModel == 0) {
                this.levelGiftIcon.visible = false;
                // this._modelClip.visible = false;
                this._skeletonClip.visible = true;
                this.setAvatar(bigReward);
                let typeN = Math.round(bigReward / 1000);
                if (typeN == 11) {//鬼神之力特殊处理
                    this._skeletonClip.reset(0, 0, 0, 0, 0, bigReward);
                } else {
                    this._skeletonClip.reset(bigReward);
                }
            } else if (isModel == 1) {
                this.levelGiftIcon.visible = false;
                // this._modelClip.visible = true;
                this._skeletonClip.visible = false;
                this.setAvatar(bigReward);
                // this._modelClip.reset(0, 0, 0, 0, bigReward);
            } else {
                // this._modelClip.visible = false;
                this._skeletonClip.visible = false;
                this.levelGiftIcon.visible = true;
                this.levelGiftIcon.skin = `assets/icon/ui/privilege/${bigReward}.png`;
            }
            let modelClipY = 674;
            if (isModel != 2) {
                let typeNum = Math.round(bigReward / 1000);
                if (isModel == 1) {
                    if (typeNum == 9 || typeNum == 10) {//法阵
                        modelClipY = 674;
                    }
                } else {
                    if (typeNum == 2) {  //宠物
                    } else if (typeNum == 3) {//翅膀
                        modelClipY = 674;
                    } else if (typeNum == 4) {//精灵
                    } else if (typeNum == 5) {//幻武
                        modelClipY = 674;
                    } else if (typeNum == 90) { //时装
                        modelClipY = 674;
                        this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                    } else if (typeNum == 11) { //灵珠
                        // if (this._skeletonClip) {
                        //     this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
                        // }
                        modelClipY = 850;
                    } else {
                        
                    }
                }
            }
            this._skeletonClip.y = modelClipY;

            this.isMoveIconImg(isMove, isModel);
            this.isMoveModelClip(isMove, isModel, modelClipY);
        }

        private setPowerShow(init: number, power: Array<string>): void {
            let lenght = power.length + init;
            let j: number = 0;
            for (let i = init; i < lenght; i++) {
                this._increaseShow[i][1].text = power[j];
                this._increaseShow[i][0].visible = this._increaseShow[i][1].visible = true;
                j++;
            }
        }

        private setRewardShow(init: number, reward: Array<Items>): void {
            let lenght = reward.length + init;
            let j: number = 0;
            for (let i = init; i < lenght; i++) {
                let data: Item = [reward[j][ItemsFields.ItemId], reward[j][ItemsFields.count], 0, null];
                this._showAward[i].dataSource = data;
                this._showAward[i].visible = true;
                j++;
            }
        }

        private updateState(): void {
            this._state = VipModel.instance.checkCanReceive(this._showVip);
            if (this._state == 0) {
                this.receiveBtn.visible = false;
                this._btnClip.stop();
                this.hasRecive.visible = false;
                this.goBottomBtn.visible = true;
            } else if (this._state == 1) {
                this.receiveBtn.visible = true;
                this._btnClip.play();
                this.hasRecive.visible = false;
                this.goBottomBtn.visible = false;
            } else {
                this.receiveBtn.visible = false;
                this._btnClip.stop();
                this.hasRecive.visible = true;
                this.goBottomBtn.visible = false;
            }
        }

        //向左按
        private leftBtnHandler(): void {
            if (this._showVip == 1) {
                return;
            }
            this._showVip--;
            this.refreshShow();
        }

        //向右按
        private rightBtnHandler(): void {
            if (this._showVip == VipModel.instance.getPrivilegeRange()) {
                return;
            }
            this._showVip++;
            this.refreshShow();
        }

        //前往充值 --------------------------------------尚未处理---------------------------------
        private goBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        //下方按钮处理
        private reciveBtnHandler(): void {
            //未做检测处理
            let cfg: privilege = VipModel.instance.getVipCfgByLevel(this._showVip);
            let reward: Array<Items> = cfg[privilegeFields.reward];
            let items: Array<Item> = [];
            if (reward) {
                for (let i: int = 0, len: int = reward.length; i < len; i++) {
                    let item: Items = reward[i];
                    items.push([item[0], item[1], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    VipCtrl.instance.getVipReward(this._showVip);
                }
            }
        }

        //打开vip弹窗
        private allLineHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_ALERT, this._showVip);
        }

        private setAvatar(showId: number): void {
            let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // if (this._modelClip) {
            //     this._modelClip.avatarRotationY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 180;
            //     this._modelClip.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale] * 0.8) : 1;
            //     this._modelClip.avatarRotationX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            //     this._modelClip.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            //     this._modelClip.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
            // }
        }

        /**
         * 根据是否缓动 是否模型 判断  图片是否缓动
         */
        public isMoveIconImg(isMove: number, isModel: number) {
            if (isModel == 2) {
                if (isMove == 1) {
                    if (this._iconImgTweenJS) {
                        this._iconImgTweenJS.stop();
                    }
                    this.levelGiftIcon.centerY = 0;//重置下位置
                    this._iconImgTweenJS = TweenJS.create(this.levelGiftIcon).to({ centerY: this.levelGiftIcon.centerY - 7 },
                        1000).start().yoyo(true).repeat(99999999);
                } else {
                    if (this._iconImgTweenJS) {
                        this._iconImgTweenJS.stop();
                    }
                }
            } else {
                if (this._iconImgTweenJS) {
                    this._iconImgTweenJS.stop();
                }
            }

        }

        /**
         * 根据是否缓动 是否模型 判断  模型是否缓动
         */
        public isMoveModelClip(isMove: number, isModel: number, Y: number = 500) {
            // this._modelClip.y = Y;//重置下位置
            if (isModel != 2) {
                if (isMove == 1) {
                    if (this._modelClipTweenJS) {
                        this._modelClipTweenJS.stop();
                    }
                    // this._modelClipTweenJS = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 20 },
                    //     1000).start().yoyo(true).repeat(99999999);
                } else {
                    if (this._modelClipTweenJS) {
                        this._modelClipTweenJS.stop();
                    }
                }
            } else {
                if (this._modelClipTweenJS) {
                    this._modelClipTweenJS.stop();
                }
            }
        }
    }
}