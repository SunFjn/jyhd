///<reference path="../config/limit_rank_cfg.ts"/>
///<reference path="../fish/fish_model.ts"/>
/**
 * 活动排行 面板
*/
namespace modules.limit {
    import BaseItem = modules.bag.BaseItem;
    // import AvatarClip = modules.common.AvatarClip;
    import CustomList = modules.common.CustomList;
    import FishModel = modules.fish.FishModel;

    import limit_xunbao_rankFields = Configuration.limit_xunbao_rankFields;
    import ItemsFields = Configuration.ItemsFields;
    import LimitXunbaoRankInfo = Protocols.LimitXunbaoRankInfo;
    import LimitXunbaoRankInfoFields = Protocols.LimitXunbaoRankInfoFields;
    import ChatPlayerDetailedInfo = Protocols.ChatPlayerDetailedInfo;
    import LayaEvent = modules.common.LayaEvent;
    import ChatPlayerDetailedInfoFields = Protocols.ChatPlayerDetailedInfoFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import LimitRankCfg = modules.config.LimitRankCfg;
    export class LimitRankPanel extends ui.LimitRankViewUI {

        constructor() {
            super();
        }

        public destroy(): void {
            super.destroy();
        }
        private _List: CustomList;
        private _showItem: Array<BaseItem>;
        // private _avatarClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._List = new CustomList();
            this._List.scrollDir = 1;
            this._List.itemRender = this.listItemClass;

            this._List.vCount = 7;
            this._List.hCount = 1;
            this._List.width = 634;
            this._List.height = 400;
            this.list.addChild(this._List)

            this._showItem = [
                this.itemBase1,
                this.itemBase2,
                this.itemBase3,
                this.itemBase4,
                this.itemBase5,
            ]
            // this._avatarClip = AvatarClip.create(1024, 1024, 768);
            // this.fashionBox.addChild(this._avatarClip);
            // this._avatarClip.pos(340 - 70, 500 - 130, true);
            // this._avatarClip.anchorX = 0.5;
            // this._avatarClip.anchorY = 0.5;
            // this._avatarClip.scaleX = 0.8;
            // this._avatarClip.scaleY = 0.8;
            // this._avatarClip.mouseEnabled = false;
            // this._avatarClip.avatarRotationY = 180;

            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(368, 600, true);

            //第一名展示奖励
            let cfg = LimitRankCfg.instance.getFishRankCfg(1);

            this.numTxt.text = '至少' + cfg[limit_xunbao_rankFields.condition_show];
            let items = cfg[limit_xunbao_rankFields.Items];
            for (let index = 0; index < this._showItem.length; index++) {
                let bagItem: BaseItem = this._showItem[index];
                if (items.length > index) {
                    if (bagItem) {
                        bagItem.dataSource = [items[index][ItemsFields.itemId], items[index][ItemsFields.count], 0, null];
                        bagItem.visible = true;
                    }
                }
            }
        }




        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_RANKLIST_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OTHER_PLAYER_INFO, this, this.updatePlayerInfo);
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_UPDATE, this, this.initMyScore);

        }

        protected removeListeners(): void {


            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            LimitRankCtrl.instance.GetLimitXunbaoRankInfo(this.bigtype);
        }

        private updateView(): void {
            //this._List.datas = FishModel.instance.rankList
            let data = []

            // console.log("data",LimitRankModel.instance.rankMax(this.bigtype))
            for (let index = 2; index <= LimitRankModel.instance.rankMax(this.bigtype); index++) {
                data.push(index)
            }

            this._List.datas = data

            //第一名信息
            let info: LimitXunbaoRankInfo = LimitRankModel.instance.rankList(this.bigtype)[1] || null
            this.firstplayervalue.visible = false;
            this.numTxt.visible = true;
            if (info) {
                this.firstplayervalue.visible = true;
                this.numTxt.visible = false;
                this.firstplayervalue.value = info[LimitXunbaoRankInfoFields.param].toString()
                this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(info[LimitXunbaoRankInfoFields.headImg] + info[LimitXunbaoRankInfoFields.occ])}`;
                this.nameTxt.text = info[LimitXunbaoRankInfoFields.name]
                ChatCtrl.instance.getChatDetailedInfo([PlayerModel.instance.actorId, info[LimitXunbaoRankInfoFields.objId], info[LimitXunbaoRankInfoFields.pgId]]);
            }
            this.myRank.text = LimitRankModel.instance.myRank(this.bigtype) == -1 ? "未上榜" : LimitRankModel.instance.myRank(this.bigtype).toString()
            // console.log('vtz:FishModel.instance.myScore',FishModel.instance.myScore);
            this.initMyScore();
            this.setActivitiTime();
        }

        private initMyScore() {
            this.myNum.text = String(FishModel.instance.getScoreByType(this.weighttype));
        }

        private updatePlayerInfo() {
            let info: ChatPlayerDetailedInfo = modules.chat.ChatModel.instance.otherPlayerInfo;
            let fashionId: number = info[ChatPlayerDetailedInfoFields.fashionId];/*时装ID*/
            let sbId: number = info[ChatPlayerDetailedInfoFields.sbId]; /*幻武ID*/
            let wingId: number = info[ChatPlayerDetailedInfoFields.wingId];/*翅膀ID*/
            let rideId: number = info[ChatPlayerDetailedInfoFields.rideId];/*精灵ID*/
            let clothes: number = fashionId;
            if (sbId == 0) sbId = 5001;
            // this._avatarClip.reset(clothes, sbId, wingId, rideId);
            this._skeletonClip.reset(clothes, sbId, wingId, rideId);
            this._skeletonClip.resetOffset(AvatarAniBigType.immortals, 250, 60);
            this._skeletonClip.resetScale(AvatarAniBigType.immortals, 0.3);
        }

        private setActivitiTime(): void {
            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitRankModel.instance.endTime_rank[this.bigtype])}`;
            this.activityText.color = "#50ff28";
            if (LimitRankModel.instance.endTime_rank[this.bigtype] < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private sureBtnHandler() {
            WindowManager.instance.open(WindowEnum.FISH_PANEL);

            // this.close();
        }

        /**
         * 关于
         */
        private openAbout(): void {
            CommonUtil.alertHelpReplaceVar(72011, CommonUtil.getDate(LimitRankModel.instance.endTime_rank, true, "/"));
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get listItemClass() {
            return LimitRankItem;
        }

        protected get weighttype(): LimitWeightType {
            return LimitWeightType.fz;
        }

    }
}