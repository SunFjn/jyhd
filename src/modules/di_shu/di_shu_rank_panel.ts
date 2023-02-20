
namespace modules.dishu {

    import BaseItem = modules.bag.BaseItem;
    import CustomList = modules.common.CustomList;
    import di_shu_rank_cfg = Configuration.di_shu_rank_cfg;
    import di_shu_rank_cfgFields = Configuration.di_shu_rank_cfgFields;
    import ItemsFields = Configuration.ItemsFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RankUserBaseInfoFields = Protocols.RankUserBaseInfoFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import LayaEvent = modules.common.LayaEvent;
    import GameCenter = game.GameCenter;
    import ChatCtrl = modules.chat.ChatCtrl;
    import ChatModel = modules.chat.ChatModel;
    import ChatPlayerDetailedInfo = Protocols.ChatPlayerDetailedInfo;
    import ChatPlayerDetailedInfoFields = Protocols.ChatPlayerDetailedInfoFields;

    export class DishuRankPanel extends ui.DishuRankViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private _showItem: Array<BaseItem>;
        private _skeletonClip: SkeletonAvatar;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = DishuRankItem;
            this._list.hCount = 1;
            this._list.width = 694;
            this._list.height = 439;//460
            this.itemPanel.addChild(this._list)

            this._showItem = [
                this.continueBase1,
                this.continueBase2,
                this.continueBase3,
                this.continueBase4,
            ]
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_RANKLIST_UPDATE, this, this.updateView);
            this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
        }

        protected removeListeners(): void {

            super.removeListeners();
        }
        public onOpened(): void {
            DishuModel.instance.myRankObj(this, this.setMyRank);
            DishuCtrl.instance.getRankInfo();
            super.onOpened();
            this.updateView();

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

        private activityHandler(): void {
            this.activityTxt.color = "#B2F4B2";
            this.activityTxt.text = `倒计时：${modules.common.CommonUtil.timeStampToDayHourMinSecond(DishuModel.instance.getEndTime)}`;
            if (DishuModel.instance.getEndTime < GlobalData.serverTime) {
                this.activityTxt.color = "#FF2727";
                this.activityTxt.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }


        private updateView(): void {

            let arr: Array<di_shu_rank_cfg> = DishuCfg.instance.rank;
            //第一名信息
            let no_1_cfg: di_shu_rank_cfg = arr.slice(0, 1)[0];
            this.myRank.text = "未上榜";

            // 榜首奖励
            for (let i = 0; i < this._showItem.length; i++) {
                if (typeof no_1_cfg[di_shu_rank_cfgFields.RankingAwds] == "undefined") {
                    this._showItem[i].visible = false;
                } else {
                    this._showItem[i].visible = true;
                    this._showItem[i].dataSource = [no_1_cfg[di_shu_rank_cfgFields.RankingAwds][i][ItemsFields.itemId], no_1_cfg[di_shu_rank_cfgFields.RankingAwds][i][ItemsFields.count], 0, null]
                }
            }
            if (typeof DishuModel.instance.rankInfo != "undefined") {
                let rankInfo = DishuModel.instance.rankInfo;
                if (typeof rankInfo[1] != "undefined") {
                    // let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
                    // console.log('rankInfo[1][RankUserBaseInfoFields.objId]', rankInfo[1][RankUserBaseInfoFields.objId]);
                    // 模拟测试
                    // rankInfo[1][RankUserBaseInfoFields.objId] = PlayerModel.instance.actorId
                    // 获取其他玩家信息
                    // if (PlayerModel.instance.actorId == rankInfo[1][RankUserBaseInfoFields.objId]) {
                    //     this._skeletonClip.pos(368, 700, true);
                    //     console.log('自己');
                    //     // 自己
                    //     let role = GameCenter.instance.getRole(rankInfo[1][RankUserBaseInfoFields.objId]);

                    //     if (role) {
                    //         console.log('role', role);
                    //         let shuju: Array<number> = role.property.get("exterior");
                    //         this._skeletonClip.reset(shuju[0], shuju[1], 0, 0, 0, shuju[5]);
                    //         this._skeletonClip.resetOffset(AvatarAniBigType.tianZhu, -110, 330);
                    //         this._skeletonClip.resetOffset(AvatarAniBigType.wing, -100, -30);
                    //         this._skeletonClip.resetOffset(AvatarAniBigType.clothes, 0, 220);
                    //         this._skeletonClip.resetScale(AvatarAniBigType.tianZhu, 0.2);
                    //         this._skeletonClip.resetScale(AvatarAniBigType.weapon, 0.18);
                    //         this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);
                    //     }
                    // } else {
                        // console.log('非自己');
                        this.addAutoListener(GlobalData.dispatcher, CommonEventType.OTHER_PLAYER_INFO, this, this.updatePlayerModel);
                        ChatCtrl.instance.getChatDetailedInfo([PlayerModel.instance.actorId, rankInfo[1][RankUserBaseInfoFields.objId], rankInfo[1][RankUserBaseInfoFields.pgId]])
                    // }

                    this.nullRankImg.visible = false;
                    this.cengTxt.text = rankInfo[1][RankUserBaseInfoFields.param] as any as string;
                    this.cengTitTxt.text = "第  层";
                    if (PlayerModel.instance.actorId == rankInfo[1][RankUserBaseInfoFields.objId]) {
                        this.setMyRank(rankInfo[1][RankUserBaseInfoFields.rank]);
                    }

                    this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(rankInfo[1][RankUserBaseInfoFields.occ])}` || null;
                    this.nameTxt.text = rankInfo[1][RankUserBaseInfoFields.name]
                } else {
                    this.cengTxt.text = no_1_cfg[di_shu_rank_cfgFields.TaskCondition] as any as string;
                    this.cengTitTxt.text = "需  层";
                    this.nullRankImg.visible = true;
                }
            }

            this._list.datas = arr.slice(1, arr.length)
            this.myNum.text = DishuModel.instance.level as any as string;
        }

        public updatePlayerModel() {
            let info: ChatPlayerDetailedInfo = ChatModel.instance.otherPlayerInfo;
            if (!info) return;
            this._skeletonClip.pos(368, 500, true);
            this._skeletonClip.scale(0.85, 0.85);
            let fashionId: number = info[ChatPlayerDetailedInfoFields.fashionId];/*时装ID*/
            let sbId: number = info[ChatPlayerDetailedInfoFields.sbId]; /*幻武ID*/
            let wingId: number = info[ChatPlayerDetailedInfoFields.wingId];/*翅膀ID*/
            let rideId: number = info[ChatPlayerDetailedInfoFields.rideId];/*精灵ID*/
            let clothes: number = fashionId;
            this._skeletonClip.reset(clothes, sbId, wingId, rideId);
        }

        public setMyRank(index: number) {
            this.myRank.text = Number(index) as any as string;
        }

        /**
         * 关于
         */
        private openAbout(): void {
            CommonUtil.alertHelp(74601);
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip = this.destroyElement(this._skeletonClip);
            }
            super.destroy();
        }
        public close() {
            super.close();
        }

    }
}