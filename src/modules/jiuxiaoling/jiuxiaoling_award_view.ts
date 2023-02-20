///<reference path="./jiuxiaoling_award_cfg.ts"/>
/** 九霄令奖励面板*/
namespace modules.jiuxiaoling {
    import JiuXiaoLingAwardViewUI = ui.JiuXiaoLingAwardViewUI;
    import CustomList = modules.common.CustomList;
    import jiuXiaoLingAward = Configuration.jiuXiaoLingAward;
    import jiuXiaoLingAwardFields = Configuration.jiuXiaoLingAwardFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;

    import JiuxiaoOrderInfoReply = Protocols.JiuxiaoOrderInfoReply;
    import JiuxiaoOrderInfoReplyFields = Protocols.JiuxiaoOrderInfoReplyFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import JiuXiaoLingAwardCfg = modules.config.JiuXiaoLingAwardCfg;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    export class JiuXiaoLingAwardView extends JiuXiaoLingAwardViewUI {
        private _list: CustomList;
        // private _modelClip: AvatarClip;
        private _bar: ProgressBarCtrl;
        private _inited: boolean;
        private _skeletonClip: SkeletonAvatar;

        protected initialize(): void {
            super.initialize();
            this._bar = new ProgressBarCtrl(this.imgpro, this.imgpro.width, this.expTxt);
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.width = 408;
            this._list.height = 360;
            this._list.spaceX = 0;
            this._list.itemRender = JiuXiaoLingAwardItem;
            this._list.x = 155;
            this._list.y = 572;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.y = 500;
            this._skeletonClip.centerX = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.taskBtn, Laya.Event.CLICK, this, this.goTaskView);
            this.addAutoListener(this.activateBtn, Laya.Event.CLICK, this, this.activateBtnHandler);
            this.addAutoListener(this.getExpBtn, Laya.Event.CLICK, this, this.goTaskView);
            this.addAutoListener(this.buyLevelBtn, Laya.Event.CLICK, this, this.buyLevelBtnHandler);
            this.addAutoListener(this.previewBtn, Laya.Event.CLICK, this, this.awardPreviewHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_JXL_AWARD_AND_STATUS, this, this.refreshView);

            this.addAutoRegisteRedPoint(this.awardRPImg, ["JiuXiaoLingAwardRP"]);
            this.addAutoRegisteRedPoint(this.taskRPImg, ["JiuXiaoLingTaskRP", "JiuXiaoLingExtralExpRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this.taskBtn.selected = false;
            JiuXiaoLingCtrl.instance.GetLevelAwardAndInfo();
        }

        private showAwardModel() {
            let final_award: Items = JiuXiaoLingAwardCfg.instance.getFinalAward();
            let itemCfg = CommonUtil.getItemCfgById(final_award[ItemsFields.itemId])
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(itemCfg[item_materialFields.showId]);

            this._skeletonClip.reset(0, 0, 0, 0, 0, modelCfg[ExteriorSKFields.id]);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.5);
            this._skeletonClip.visible = true;

            this.finalTxt.text = modelCfg[ExteriorSKFields.name];
            this.finalDescTxt.innerHTML = `<div style="fontSize:23; color:white; width:200px;">达到最高等级可获得<span style="color:orange">SSSR</span><span style="color:white">绝版外显</span><span style="color:orange">${modelCfg[ExteriorSKFields.name]}</span></div>`;
        }

        private setShowInfo(val: JiuxiaoOrderInfoReply) {
            this.seasonTxt.text = `第${val[JiuxiaoOrderInfoReplyFields.season]}赛季`;
            this.levelClip.value = `${val[JiuxiaoOrderInfoReplyFields.level]}`
            this.alreadyGet.visible = val[JiuxiaoOrderInfoReplyFields.finalAwards] == 2;

            // 活动时间
            let startDate: string = CommonUtil.getDate(val[JiuxiaoOrderInfoReplyFields.actionDate][0], false, "/");
            let endDate: string = CommonUtil.getDate(val[JiuxiaoOrderInfoReplyFields.actionDate][1], false, "/");
            this.datetimeTxt.text = `${startDate}- ${endDate}`;
            // 经验
            this._bar.maxValue = JiuXiaoLingAwardCfg.instance.getUpLevelExp(val[JiuxiaoOrderInfoReplyFields.level]);

            if (this._bar.maxValue == 0) {
                this._bar.value = 0;
            } else {
                this._bar.value = val[JiuxiaoOrderInfoReplyFields.exp];
            }
        }

        private refreshView(): void {
            // 获取数据
            let award_datas: JiuxiaoOrderInfoReply = JiuXiaoLingModel.instance.jiuxiaoOrderInfoData;
            let currentLecvel: number = JiuXiaoLingModel.instance.level;

            // 展示大奖模型动画
            this.showAwardModel();
            this.setShowInfo(award_datas);

            //是否购买九霄金令状态
            this.notBuyBox.visible = !JiuXiaoLingModel.instance.isBuy;
            this.item2.grayMask.visible = !JiuXiaoLingModel.instance.isBuy;
            this.alreadyBuy.visible = JiuXiaoLingModel.instance.isBuy;
            this.activateBtn.visible = !JiuXiaoLingModel.instance.isBuy;

            // 加载奖励数据
            let datas: Array<jiuXiaoLingAward> = JiuXiaoLingModel.instance.getAwardList();
            this._list.datas = datas;
            this._list.scrollCallback = (index: number) => {
                // 设置最右侧的等级奖励
                let showLevel: number = (((index + 1) / 5) >> 0) * 5 + 5;
                // 最高等级限制
                showLevel = showLevel >= datas.length ? datas.length : showLevel;

                // 展示数据
                let showData: jiuXiaoLingAward = datas[showLevel - 1];
                let awards = showData[jiuXiaoLingAwardFields.award];
                let gold_award = showData[jiuXiaoLingAwardFields.gold_award];

                this.item1.visible = awards.length != 0;
                this.item2.visible = gold_award.length != 0;
                this.noAward1.visible = awards.length == 0;
                this.noAward2.visible = gold_award.length == 0;
                this.showAwardTxt.text = `${showData[jiuXiaoLingAwardFields.level]}级可领`;
                // 奖励item显示
                if (awards.length != 0) {
                    this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
                }

                if (gold_award.length != 0) {
                    this.item2.dataSource = [gold_award[0][ItemsFields.itemId], gold_award[0][ItemsFields.count], 0, null];
                }
            };

            // 初始化执行一次
            this._list.scrollCallback();

            if (currentLecvel > 1) {
                this._list.scrollToIndex((currentLecvel - 1));
            }
        }


        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(68001);
        }

        //转到任务界面
        private goTaskView(): void {
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_TASK_VIEW);
        }

        //激活金令
        private activateBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_ACTIVATE_GOLD_ALERT);
        }

        //购买等级
        private buyLevelBtnHandler(): void {
            if (JiuXiaoLingModel.instance.level == JiuXiaoLingAwardCfg.instance.level) {
                SystemNoticeManager.instance.addNotice("您已经达到了最高等级!");
                return;
            }
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_BUY_LEVEL_ALERT);
        }

        //大奖预览
        private awardPreviewHandler(): void {
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_AWARD_PREVIEW_ALERT);
        }

        public close(): void {
            super.close();

        }

        public destroy(destroyChild: boolean = true): void {
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            this._bar = this.destroyElement(this._bar);
            this._list = this.destroyElement(this._list);
        }
    }
}