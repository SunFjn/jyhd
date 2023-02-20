/** 派对大奖*/


namespace modules.mission_party {
    import LayaEvent = modules.common.LayaEvent;
    import MissionPartySetpAwardAlertUI = ui.MissionPartySetpAwardAlertUI;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MissionPartyTaskCfg = modules.config.MissionPartyTaskCfg;
    import MissionPartyCfg = modules.config.MissionPartyCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import kuanghai2_rise = Configuration.kuanghai2_rise;
    import kuanghai2_riseFields = Configuration.kuanghai2_riseFields;
    export class MissionPartyGetAward extends MissionPartySetpAwardAlertUI {
        private awardStatus: number = 0;
        private _clipArr: Array<CustomClip>;
        private _showItem: Array<any>;
        private activityId: number;//活动id

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.activityId = MissionPartyModel.instance.id;
            this._clipArr = new Array<CustomClip>();
            this._showItem = [this.award01, this.award02, this.award03];
            // 给每个UIitem添加特效并默认关闭特效
            for (let i = 0; i < this._showItem.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();

                this._showItem[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                // for (let i = 0; i < 16; i++) {
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


        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.okHandler);
            // this.addAutoListener(this.closeBtn, LayaEvent.CLICK, this, this.close);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UpdateMissionAwardInfo, this, this.updateShowInfo);
        }
        private isBuy: number = 0
        //打开界面执行
        onOpened(): void {
            super.onOpened();
            this.updateBag();
            this.updateShowInfo();

            //播放UI item特效
            this._clipArr.forEach(clip => {
                clip.play();
                clip.visible = true;
            });
        }



        // 增加背包中道具数量
        private updateBag(): void {


        }
        public _itemCfg: kuanghai2_rise;/*子项展示使用*/
        private getState: number = 0
        // 更新奖励领取状态
        private updateShowInfo(): void {
            // // this.awardStatus=MissionPartyAwardModule.instance.awardInfo.status;
            // //可以领取奖励
            // if (this.awardStatus == 0) {
            //     this.sureBtn.disabled = false;
            // } else if (this.awardStatus == 1) {
            //     //已经领取过了(按钮图片切换)
            //     this.sureBtn.disabled = true;

            // } else {
            //     //未达到领取条件
            //     this.sureBtn.disabled = true;

            // }







            this._itemCfg = MissionPartyModel.instance._itemCfg
            console.log(" awardArr awardArr", this._itemCfg)
            let _riseList = MissionPartyModel.instance.getRisrNodeInfoByGrade(this._itemCfg[kuanghai2_riseFields.grade]) ? MissionPartyModel.instance.getRisrNodeInfoByGrade(this._itemCfg[kuanghai2_riseFields.grade]) : [0, 0];
            this.getState = _riseList[1] ? _riseList[1] : 0;
            switch (this.getState) {
                case 0:
                    this.sureBtn.label = "未达成"
                    this.sureBtn.disabled = true
                    break;
                case 1:
                    this.sureBtn.label = "领取"
                    this.sureBtn.disabled = false
                    break;
                case 2:
                    this.sureBtn.label = "已领取"
                    this.sureBtn.disabled = true
                    break;

                default:
                    break;
            }


            let awardArr = [];
            console.log(" awardArr awardArr", awardArr)
            awardArr = this._itemCfg[kuanghai2_riseFields.reward]

            let count: number = awardArr.length;
            let DayBase: modules.bag.BaseItem[] = [];
            this.hint.text = '完成' + this._itemCfg[kuanghai2_riseFields.condition] + '个任务可领取以下奖励'
            for (let i = 1; i < 5; i++) {
                DayBase.push(this['award0' + i]);
            }
            for (let i: int = 0; i < 3; i++) {
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

        //点击领取按钮出触发时间
        private okHandler(): void {
            // 判断是否能够领取
            // if (true) {
            //     SystemNoticeManager.instance.addNotice("未满足领取条件!", true);
            //     return;
            // }

            // if (this.isBuy == 1) {
            //     // 发送请求
            //     MissionPartyCtrl.instance.sendTinalReward();
            // } else {
            //     PlatParams.askPay(120, 1);        //购买通行证
            //     this.close();
            // }
            console.log("关闭")
            MissionPartyCtrl.instance.getKuanghaiAward(this._itemCfg[kuanghai2_riseFields.grade]);
            WindowManager.instance.close(WindowEnum.Mission_Party_GET);






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