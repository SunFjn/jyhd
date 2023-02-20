/**
 * 姻缘面板
 */
namespace modules.marry {
    import MarryViewUI = ui.MarryViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import marry_intimacyFields = Configuration.marry_intimacyFields;
    // import AvatarClip = modules.common.AvatarClip;
    import MarryMemberFields = Protocols.MarryMemberFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomClip = modules.common.CustomClip;
    import FeedAttrType = ui.FeedAttrType;
    import SkeletonAvatar = modules.common.SkeletonAvatar;


    export class MarryPanel extends MarryViewUI {
        // private _showModelClipM: AvatarClip;//展示的模型
        // private _showModelClipW: AvatarClip;//展示的模型
        private _skeletonClipM: SkeletonAvatar;//展示的模型
        private _skeletonClipW: SkeletonAvatar;//展示的模型

        private btnClip: CustomClip;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"
            this.itemImg.skin = "assets/icon/item/10176_s.png"
            this.initModel();

            this.DDDPanel.mouseEnabled = false

            this.btnClip = new CustomClip();
            this.cultureBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -10);
            this.btnClip.visible = false;
        }



        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.separateBtn, LayaEvent.CLICK, this, this.openSeparate);
            this.addAutoListener(this.wallBtn, LayaEvent.CLICK, this, this.openWall);
            this.addAutoListener(this.rewardBtn, LayaEvent.CLICK, this, this.openReward);
            this.addAutoListener(this.taskBtn, LayaEvent.CLICK, this, this.openTask);
            this.addAutoListener(this.getTxt, LayaEvent.CLICK, this, this.openTips);

            this.addAutoListener(this.seekBtn, LayaEvent.CLICK, this, this.openWall);

            this.addAutoListener(this.cultureBtn, LayaEvent.CLICK, this, this.sendFeed);
            this.addAutoListener(this.getTxt, LayaEvent.CLICK, this, this.tips);
            this.addAutoListener(this.chatBtn, LayaEvent.CLICK, this, this.openChat);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_INFO_UPDATE, this, this.initData);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_TASK_UPDATE, this, this.initData);

            this.wallBtn[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
        }

 

        //打开分离面板
        private openSeparate(): void {
            WindowManager.instance.open(WindowEnum.MARRY_Separate_Alert);

        }
        //打开姻缘墙面板
        private openWall(): void {
            WindowManager.instance.open(WindowEnum.MARRY_Wall_PANEL);

        }
        //打开甜蜜度面板
        private openReward(): void {
            WindowManager.instance.open(WindowEnum.MARRY_IntimacyReward_Alert);

        }
        //打开姻缘任务面板
        private openTask(): void {
            WindowManager.instance.open(WindowEnum.MARRY_Task_PANEL);

        }

        private openChat(): void {
            WindowManager.instance.open(WindowEnum.CHAT_MARRY_PANEL);
        }

        private openTips(): void {
            //提示材料不足
            WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this._FeedId, 0, true]);
        }
        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            MarryCtrl.instance.GetMarryInfo();
        }
        private _FeedId: number = 0
        private sendFeed() {
            if (Number(this.cultureNum.text) <= 0) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this._FeedId, 0, true]);
            } else if (this._FeedId == 0) {
                SystemNoticeManager.instance.addNotice("已满级无法继续培养!", true);
            } else {
                MarryCtrl.instance.FeedMarry()
            }



        }
        private tips() {

            WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this._FeedId, 0, true]);
        }

        private initData(): void {
            let isStatus: boolean = MarryModel.instance.isHave;
            this.noHaveBox.visible = !isStatus;
            this.haveBox.visible = isStatus;
            if (isStatus) {

                let occ = [0, 90171, 90172]
                let other = MarryModel.instance.intimacyer[MarryMemberFields.occ] ? MarryModel.instance.intimacyer[MarryMemberFields.occ] : 2
                this.playModelAction(occ[PlayerModel.instance.occ], occ[other]);

                let power: number = MarryModel.instance.getPower(); // 计算战力
                let intimacyLevel: number = MarryModel.instance.getIntimacyLevel(); // 甜蜜度等级
                let exp = MarryModel.instance.getIntimacyExp(); // 当前经验
                let day = MarryModel.instance.getIntimacyDay(); // 结缘天数
                // this.powerNum.value = power.toString();


                this.marryDay.text = `已结缘${day}天`
                this.rewardLevel.text = `Lv.${intimacyLevel}`
                //let cfg = MarryCfg.instance.getLevelCfg(intimacyLevel)
                let nextCfg = MarryCfg.instance.getLevelCfg(intimacyLevel + 1)

                this.cultureBtn.visible = !!nextCfg;
                let widthMax = 415;// 当前进度条宽度
                if (!nextCfg) {
                    //已满级
                    this.progressTxt.text = "0/0";
                    this.progressBar.width = widthMax;
                    //this.cultureNum.text = "已满级"
                    this.itemImg.skin = ''
                } else {
                    let icon = CommonUtil.getIconById(nextCfg[marry_intimacyFields.items][0], true);
                    this.itemImg.skin = icon;
                    this._FeedId = nextCfg[marry_intimacyFields.items][0];
                    this.cultureNum.text = MarryModel.instance.getItemCountById(this._FeedId).toString();
                    this.progressTxt.text = exp + "/" + nextCfg[marry_intimacyFields.exp];
                    this.progressBar.width = (exp / nextCfg[marry_intimacyFields.exp]) * widthMax;
                }
                this.cultureNum.color = this.cultureNum.text == '0' ? "#a43a11" : "#a43a11"

                this.playerName1Txt.text = PlayerModel.instance.roleName;
                this.playerName2Txt.text = MarryModel.instance.intimacyer[MarryMemberFields.name]

                this.playerOnline1Txt.text = "在线";
                this.playerOnline2Txt.text = MarryModel.instance.intimacyer[MarryMemberFields.state] ? "在线" : "离线";
                this.playerOnline1Txt.color = this.playerOnline1Txt.text == "在线" ? "#4ffe28" : "#aba9a5"
                this.playerOnline2Txt.color = this.playerOnline2Txt.text == "在线" ? "#4ffe28" : "#aba9a5"

                if (this.cultureNum.text != "0") {
                    this.btnClip.visible = true;
                    this.btnClip.play();
                } else {
                    this.btnClip.visible = false;
                    this.btnClip.stop();
                }
                this.taskRP.visible = MarryModel.instance.getTaskRP();
                this.rewardRP.visible = MarryModel.instance.getRewardRP();
                this.feedRP.visible = MarryModel.instance.getFeedRP();
            } else {
                this.powerNum.value = "0"
            }

            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.view).toString()

        }

        public close(): void {
            super.close();
        }

        protected resizeHandler(): void {
        }

        //初始化模型
        public initModel(): void {
            // this._showModelClipW = AvatarClip.create(720, 1024, 1024);
            // this._showModelClipW.anchorX = 0.5;
            // this._showModelClipW.anchorY = 0.5;
            // this._showModelClipW.centerX = 0;
            // this._showModelClipW.y = 640;
            // this.DDDPanel.addChild(this._showModelClipW);
            this._skeletonClipW = SkeletonAvatar.createShow(this, this.DDDPanel);
            this._skeletonClipW.y = 680;
            this._skeletonClipW.scale(-0.9, 0.9);


            // this._showModelClipM = AvatarClip.create(720, 1024, 1024);
            // this._showModelClipM.anchorX = 0.5;
            // this._showModelClipM.anchorY = 0.5;
            // this._showModelClipM.centerX = 0;
            // this._showModelClipM.y = 640;
            // this.DDDPanel.addChild(this._showModelClipM);
            this._skeletonClipM = SkeletonAvatar.createShow(this, this.DDDPanel);
            this._skeletonClipM.y = 680;
            this._skeletonClipM.scale(0.9, 0.9);
        }
        //播放模型动画
        public playModelAction(id1, id2): void {

            let modelCfgW: ExteriorSK = ExteriorSKCfg.instance.getCfgById(id2);
            // this._showModelClipW.avatarScale = modelCfgW[ExteriorSKFields.scale] ? modelCfgW[ExteriorSKFields.scale] : 1;
            // this._showModelClipW.avatarRotationX = modelCfgW[ExteriorSKFields.rotationX];
            // this._showModelClipW.avatarRotationY = modelCfgW[ExteriorSKFields.rotationY];
            // this._showModelClipW.avatarY = modelCfgW[ExteriorSKFields.deviationY];
            // this._showModelClipW.avatarX = modelCfgW[ExteriorSKFields.deviationX];
            // //this._showModelClipW.x = 460
            // this._showModelClipW.reset(id2);
            // this._showModelClipW.setActionType(ActionType.DAIJI);
            // this._showModelClipW.mouseEnabled = false;
            this._skeletonClipW.reset(id2);
            this._skeletonClipW.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);

            let modelCfgM: ExteriorSK = ExteriorSKCfg.instance.getCfgById(id1);
            // this._showModelClipM.avatarScale = modelCfgM[ExteriorSKFields.scale] ? modelCfgM[ExteriorSKFields.scale] : 1;
            // this._showModelClipM.avatarRotationX = modelCfgM[ExteriorSKFields.rotationX];
            // this._showModelClipM.avatarRotationY = modelCfgM[ExteriorSKFields.rotationY];
            // this._showModelClipM.avatarY = modelCfgM[ExteriorSKFields.deviationY];
            // this._showModelClipM.avatarX = modelCfgM[ExteriorSKFields.deviationX];
            // //this._showModelClipM.x = 440;
            // this._showModelClipM.reset(id1);
            // this._showModelClipM.setActionType(ActionType.DAIJI);
            // this._showModelClipM.mouseEnabled = false;
            this._skeletonClipM.reset(id1);
            this._skeletonClipM.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);

            // this._showModelClipM.x = id1 == 90121 ? 440 : 310
            // this._showModelClipW.x = id2 == 90122 ? 460 : 600
            // this._showModelClipM.x = 310;
            // this._showModelClipW.x = 600;
            this._skeletonClipM.x = 250;
            this._skeletonClipW.x = 480;
        }

    }
}