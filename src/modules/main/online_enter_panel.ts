///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../notice/drop_notice_manager.ts"/>
///<reference path="../config/scene_copy_tianguan_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/online_reward_entrance.ts"/>
/** 主界面左下面板*/
namespace modules.main {
    import Event = Laya.Event;
    import OnlineEeterViewUI = ui.OnlineEeterViewUI;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import OnlineReward = Protocols.OnlineReward;
    import OnlineRewardFields = Protocols.OnlineRewardFields;
    import OnlineRewardEntranceCfg = modules.config.OnlineRewardEntranceCfg;
    import online_reward_entrance = Configuration.online_reward_entrance;
    import online_reward_entranceFields = Configuration.online_reward_entranceFields;
    import OnlineGiftCfg = modules.config.OnlineGiftCfg;
    import online_reward = Configuration.online_reward;
    import online_rewardFields = Configuration.online_rewardFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import LayaEvent = modules.common.LayaEvent;

    export class OnlineEeterPanel extends OnlineEeterViewUI {
        private _obtainId: number;
        private _obtainState: number;
        private _obtainTime: number;
        // private _modelClip1: AvatarClip;
        private _modelClip1: SkeletonAvatar;
        private _modelClipTween1: TweenJS;
        private _modelShowImgTween: TweenJS;
        private _modelClip1Y = 200;//模型位置
        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();
        }

        protected onOpened(): void {
            super.onOpened();
            this.initializeQuickToReceive();
        }

        public initializeQuickToReceive() {
            this._modelClip1 = this.destroyElement(this._modelClip1);
            this.initializeModelClip();
            this.showQuickToReceive();
        }

        public close(): void {
            if (this._modelClipTween1) {
                this._modelClipTween1.stop();
                this._modelClipTween1 = null;
            }
            if (this._modelShowImgTween) {
                this._modelShowImgTween.stop();
                this._modelShowImgTween = null;
            }

            super.close();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.bgImg, LayaEvent.CLICK, this, this.QuickToReceiveBoxHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_ONLINE_REWARD_REPLY, this, this.showQuickToReceive);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.showQuickToReceiveLoopHandler);
            if (this._modelClipTween1) {
                this._modelClipTween1.stop();
            }
            if (this._modelShowImgTween) {
                this._modelShowImgTween.stop();
            }


            this._modelClip1 = this.destroyElement(this._modelClip1);
        }

        //获取数据
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.sevenDay) {
                    if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sevenDay)) {
                        this.showQuickToReceive();
                    }
                }
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._modelClip1 = this.destroyElement(this._modelClip1);
            super.destroy(destroyChild);
        }

        //在线礼包快捷领取入口~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        /**
         * 显示 快捷领取
         */
        public showQuickToReceive() {
            let createDay = modules.player.PlayerModel.instance.getDay();
            let isOver = modules.onlineGift.OnlineGiftModel.instance.isOver();
            let sevenDayIsOpen = (FuncOpenModel.instance.getFuncStateById(ActionOpenId.sevenDay) === ActionOpenState.close);
            let getDay = modules.player.PlayerModel.instance.getDayNum();
            if (getDay >= 4) {
                // console.log("创角大于四天 关闭入口 ");
                this.removeSelf();
                this.close();
                return;
            }
            if (isOver) {
                if (sevenDayIsOpen) {//如果七日礼都关闭了 就没必要在显示了
                    this.removeSelf();
                    this.close();
                    return;
                } else {
                    if (createDay) {
                        this.removeSelf();
                        this.close();
                        return;
                    }
                }
            }
            Laya.timer.clear(this, this.showQuickToReceiveLoopHandler);
            let onlineRewardDate: OnlineReward = modules.onlineGift.OnlineGiftModel.instance.getTruerReward();
            // console.log("取得的數據： ", onlineRewardDate);
            if (onlineRewardDate) {
                this._obtainId = onlineRewardDate[OnlineRewardFields.id];
                this._obtainState = onlineRewardDate[OnlineRewardFields.state];
                this._obtainTime = onlineRewardDate[OnlineRewardFields.time];
                if (this._obtainState == 0) {
                    Laya.timer.loop(1000, this, this.showQuickToReceiveLoopHandler);
                    this.showQuickToReceiveLoopHandler();
                } else if (this._obtainState == 1) {
                    this.QuickToReceiveTimeText.text = "可领取";
                }
                let itemCfg = OnlineGiftCfg.instance.getCfgsById(this._obtainId);
                let showId: number = 0;
                let isMove: number = 0;
                let isModel: number = 0;
                if (itemCfg) {
                    showId = (<online_reward>itemCfg)[online_rewardFields.showId];
                    isMove = (<online_reward>itemCfg)[online_rewardFields.isMove];
                    isModel = (<online_reward>itemCfg)[online_rewardFields.isModel];
                }
                if (!showId) {
                    showId = 0;
                    isMove = 0;
                    isModel = 0;
                }
                this.showMode(showId, isMove, isModel, 1);
            } else {
                this.QuickToReceiveTimeText.text = "明日可领取";
                let openDay = modules.player.PlayerModel.instance.getDayNum1();
                // let createDay = modules.player.PlayerModel.instance.getDay();
                let itemCfg = OnlineRewardEntranceCfg.instance.getCfgById(openDay);
                let showId: number = 0;
                let isMove: number = 0;
                let isModel: number = 0;
                if (itemCfg) {
                    showId = (<online_reward_entrance>itemCfg)[online_reward_entranceFields.showId];
                    isMove = (<online_reward_entrance>itemCfg)[online_reward_entranceFields.isMove];
                    isModel = (<online_reward_entrance>itemCfg)[online_reward_entranceFields.isModel];
                } else {
                    this.removeSelf();
                    this.close();
                    return;
                }
                if (!showId) {
                    showId = 0;
                    isMove = 0;
                    isModel = 0;
                }
                this.showMode(showId, isMove, isModel, 2);
            }
        }

        private showQuickToReceiveLoopHandler(): void {
            if (this._obtainTime) {
                this.QuickToReceiveTimeText.text = `${modules.common.CommonUtil.timeStampToMMSS(this._obtainTime)}`;
                if (this._obtainTime < GlobalData.serverTime) {
                    this.QuickToReceiveTimeText.text = "可领取";
                    Laya.timer.clear(this, this.showQuickToReceiveLoopHandler);
                }
            } else {
                Laya.timer.clear(this, this.showQuickToReceiveLoopHandler);
            }
        }

        private QuickToReceiveBoxHandler(): void {
            let onlineRewardDate: OnlineReward = modules.onlineGift.OnlineGiftModel.instance.getTruerReward();
            if (onlineRewardDate) {
                if (this._obtainState == 0) {
                    WindowManager.instance.open(WindowEnum.ONLINE_PANEL);
                    // console.log("打开在线礼包界面");
                } else if (this._obtainState == 1) {
                    // console.log("领取在线礼包   " + this._obtainId);
                    WindowManager.instance.open(WindowEnum.ONLINE_PANEL);
                    // Channel.instance.publish(UserFeatureOpcode.GetOnlineRewardAward, [this._obtainId]);
                }
            } else {
                // let openDay = modules.player.PlayerModel.instance.openDay;
                let createDay = modules.player.PlayerModel.instance.getDay();
                let sevenDayIsOpen = (FuncOpenModel.instance.getFuncStateById(ActionOpenId.sevenDay) === ActionOpenState.close);
                if (!createDay) {
                    if (sevenDayIsOpen) {//第七天的特殊情况 如果七日礼领取完毕 关掉了 点击 关闭这个快捷界面
                        this.close();
                        return;
                    }
                    WindowManager.instance.open(WindowEnum.SEVEN_DAY_GIFT_PANEL);
                    // console.log("创建角色 小于7天 打开七日礼界面");
                } else {
                    // console.log("创建角色 大于7天 打开在线礼包界面");
                    this.removeSelf();
                    this.close();
                    return;
                }
            }

        }

        public showMode(showId: number, isMove: number, isModel: number, typeNum: number) {
            // showId = 2011;// 2011  5010  3010 4011 4013
            if (showId == 0) {
                this._modelClip1 = this.destroyElement(this._modelClip1);
                if (this._modelClipTween1) {
                    this._modelClipTween1.stop();
                }
                if (this._modelShowImgTween) {
                    this._modelShowImgTween.stop();
                }
                return;
            }
            if (this._modelClipTween1) {
                this._modelClipTween1.stop();
            }

            this.awardImg.visible = false;
            if (isModel == 0) {//模型
                let typeNum = Math.round(showId / 1000);
                if (typeNum == 11) {
                    this._modelClip1.reset(0, 0, 0, 0, 0, showId)
                } else {
                    this._modelClip1.reset(showId);
                }
            } else if (isModel == 1) {//特效
                this._modelClip1.reset(0, 0, 0, 0, showId);
            } else if (isModel == 2) {//图片
                if (typeNum == 1) {
                    this.awardImg.skin = `assets/icon/ui/online_reward/${showId}.png`;
                } else if (typeNum == 2) {
                    this.awardImg.skin = `assets/icon/ui/online_reward/${showId}.png`;
                }

                this.awardImg.visible = true;
            }
            if (isModel == 0 || isModel == 1) {
                let typeNum = Math.round(showId / 1000);
                this._modelClip1Y = 65;
                if (isModel == 1) {
                    if (typeNum == 9 || typeNum == 10) {//法阵
                        this._modelClip1Y = 50;
                    }
                } else {
                    if (typeNum == 2) {  //宠物
                        this._modelClip1Y = 65;
                    } else if (typeNum == 3) {//翅膀
                        this._modelClip1Y = 65;
                    } else if (typeNum == 4) {//精灵
                        this._modelClip1Y = 65;
                    } else if (typeNum == 5) {//幻武
                        this._modelClip1Y = 75;
                    } else if (typeNum == 90) { //时装
                        this._modelClip1Y = 75;
                    } else if (typeNum == 11) { //灵珠
                        // if (this._modelClip1) {
                        //     this._modelClip1.setActionType(ActionType.SHOW);
                        // }
                        this._modelClip1Y = 105;
                    } else {
                        this._modelClip1Y = 65;
                    }
                }
                this._modelClip1.y = this._modelClip1Y;
                if (isMove == 1) {
                    if (this._modelClipTween1) {
                        this._modelClipTween1.stop();
                    }
                    this._modelClip1.y = this._modelClip1Y;
                    this._modelClipTween1 = TweenJS.create(this._modelClip1).to({ y: this._modelClip1.y - 10 },
                        1000).start().yoyo(true).repeat(99999999);
                }
            } else {
                this.awardImg.y = 49;
                if (isMove == 1) {
                    if (this._modelShowImgTween) {
                        this._modelShowImgTween.stop();
                    }
                    this.awardImg.y = 49;
                    this._modelShowImgTween = TweenJS.create(this.awardImg).to({ y: this.awardImg.y - 10 },
                        1000).start().yoyo(true).repeat(99999999);
                }
                // console.log("是图片 尚未处理");
            }

        }

        /**
         * 初始化模型
         */
        public initializeModelClip() {
            // if (this._modelClip1) {
            // this._modelClip1 = AvatarClip.create(512, 512, 512);
            this._modelClip1 = SkeletonAvatar.createShow(this, this);
            // this.addChildAt(this._modelClip1, 1);
            this._modelClip1.pos(65, 65, true);
            this._modelClip1.anchorX = 0.5;
            this._modelClip1.anchorY = 0.5;
            this._modelClip1.scale(0.3, 0.3);
            this._modelClip1.mouseEnabled = false;
            // }
        }

        /**
         * 设置 并显示模型
         * @param showId
         */
        private setAvatar(showId: number): void {
            // let extercfg: Configuration.Exterior = ExteriorSKCfg.instance.getCfgById(showId);
            // if (!extercfg) return;
            // this._modelClip1.avatarRotationY = extercfg[Configuration.ExteriorSKFields.rotationY] ? extercfg[Configuration.ExteriorSKFields.rotationY] : 180;
            // this._modelClip1.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale] * 768 / 1280) : 1;
            // this._modelClip1.avatarRotationX = extercfg[Configuration.ExteriorSKFields.rotationX] ? extercfg[Configuration.ExteriorSKFields.rotationX] : 0;
            // this._modelClip1.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._modelClip1.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
        }

    }
}
