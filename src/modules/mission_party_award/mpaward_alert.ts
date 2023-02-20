/** 派对大奖*/


namespace modules.mission_party {
    import LayaEvent = modules.common.LayaEvent;
    import MissionPartyAwardUI = ui.MissionPartyAwardUI;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MissionPartyTaskCfg = modules.config.MissionPartyTaskCfg;
    import MissionPartyCfg = modules.config.MissionPartyCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    export class MissionPartyAward extends MissionPartyAwardUI {
        private awardStatus: number = 0;
        private _clipArr: Array<CustomClip>;
        private _showItem: Array<any>;
        private activityId: number;//活动id
        private _missionLabel: string;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._missionLabel = MissionPartyModel.instance.getCurrentMissionLabel();
            this.activityId = MissionPartyModel.instance.id;
            this._showItem = [this.award01, this.award02, this.award03, this.award04];

            this._clipArr = new Array<CustomClip>();
            // 给每个UIitem添加特效并默认关闭特效
            for (let i = 0; i < 4; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();

                this._showItem[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                for (let i = 0; i < 8; i++) {
                    let str = `item_effect2/${i}.png`;
                    urlArr.push(str);
                }
                clip.frameUrls = urlArr;
                clip.durationFrame = 6;
                // clip.play();
                clip.visible = false;
                clip.name = "clip";
                this._clipArr.push(clip);
            }

            this.showRealUI();

            let arr = MissionPartyCfg.instance.getCfgById(this.activityId);
            let awardArr = [];
            awardArr = arr[0][6]//返回cfg 长度4 索引6位置是奖品 1-4都是一样的物品
            console.log("awardArr", awardArr)
            let count: number = arr.length;
            let DayBase: modules.bag.BaseItem[] = [];

            for (let i = 1; i <= 4; i++) {
                DayBase.push(this['award0' + i]);
            }
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                    this._clipArr[i].stop()
                    this._clipArr[i].visible = false
                }
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.okHandler);
            // this.addAutoListener(this.closeBtn, LayaEvent.CLICK, this, this.close);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_UPDATE, this, this.updateShowInfo);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UpdateMissionAwardInfo, this, this.updateShowInfo);
        }
        private isBuy: number = 0
        //打开界面执行
        onOpened(): void {
            super.onOpened();
            //播放UI item特效
            this._clipArr.forEach(clip => {
                clip.play();
                clip.visible = true;
            });

            this.updateShowInfo();
        }

        /**
         * 根据不通的活动展示不通的UI界面（效果图）
        */
        private showRealUI() {
            this.bgImg.skin = `mission_party/${this._missionLabel}/image_award_bg.png`;
            this.closeBtn.skin = `mission_party/${this._missionLabel}/btn_close.png`;
        }

        // 增加背包中道具数量
        private updateBag(): void {


        }

        // 更新奖励领取状态
        private updateShowInfo(): void {
            this.isBuy = MissionPartyModel.instance.isBuy;
            this.updateBag();
            this.hint.text = `完成${MissionPartyModel.instance.missionName}全部任务即可领取派对大奖`

            this.sureBtn.label = this.isBuy == 1 ? "领取" : "激活"
            if (MissionPartyModel.instance._isFinish == 1) {
                this.sureBtn.disabled = true;
                this.sureBtn.label = "已领取"
            } else {
                this.sureBtn.disabled = false;
            }
        }

        //点击领取按钮出触发时间
        private okHandler(): void {
            // 判断是否能够领取
            // if (true) {
            //     SystemNoticeManager.instance.addNotice("未满足领取条件!", true);
            //     return;
            // }

            if (this.isBuy == 1) {
                // 发送请求
                MissionPartyCtrl.instance.sendTinalReward();
            } else {
                PlatParams.askPay(120, 1);        //购买通行证
                WindowManager.instance.close(WindowEnum.Mission_Party_Award_ALERT);
            }







        }

        public destroy(destroyChild: boolean = true): void {
            if (this._clipArr) {
                for (let index = 0; index < this._clipArr.length; index++) {
                    let element = this._clipArr[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._clipArr.length = 0;
                this._clipArr = null;
            }
        }

    }
}