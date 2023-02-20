/** 逐鹿膜拜面板 */

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuKneelAlertUI = ui.ZhuLuKneelAlertUI;
    // import AvatarClip = modules.common.AvatarClip;
    import GameCenter = game.GameCenter;
    import ChatModel = modules.chat.ChatModel;
    import ChatPlayerDetailedInfo = Protocols.ChatPlayerDetailedInfo;
    import ChatPlayerDetailedInfoFields = Protocols.ChatPlayerDetailedInfoFields;

    import GetTeamBattleWorshipInfoReply = Protocols.GetTeamBattleWorshipInfoReply;
    import GetTeamBattleWorshipInfoReplyFields = Protocols.GetTeamBattleWorshipInfoReplyFields;
    export class ZhuLuKneelAlert extends ZhuLuKneelAlertUI {
        // private _avatarClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _lastMouseX: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            // this._avatarClip = AvatarClip.create(1560, 1560, 850);
            // this.addChildAt(this._avatarClip, 4);
            // this._avatarClip.pos(350, 680, true);
            // this._avatarClip.anchorX = 0.5;
            // this._avatarClip.anchorY = 0.5;
            // this._avatarClip.mouseEnabled = false;
            // this._avatarClip.avatarRotationY = 180;
            // this._avatarClip.zOrder = 2;
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.y = 650;
            this._skeletonClip.centerX = 0;
            this._skeletonClip.zOrder = 5;
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OTHER_PLAYER_INFO, this, this.updatePlayerInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_WORSHIP_UPDATA_DATA, this, this.updateView);
            this.addAutoListener(this.kneelBtn, Laya.Event.CLICK, this, this.wrship);
        }
        public destroy(destroyChild: boolean = true): void {
            // if (this._avatarClip) {
            //     this._avatarClip.removeSelf();
            //     this._avatarClip.destroy();
            //     this._avatarClip = null;
            // }
        }

        private wrship() {
            ZhuLuCtrl.instance.GetTeamBattleWorship();
        }
        //更新界面
        private updateView(): void {
            let data = ZhuLuModel.instance.WorshipInfo;
            this.clanTxt.text = data[GetTeamBattleWorshipInfoReplyFields.teamName] || '虚位以待';
            this.personTxt.text = data[GetTeamBattleWorshipInfoReplyFields.leaderName] || '虚位以待';
            this.kneelBtn.visible = !data[GetTeamBattleWorshipInfoReplyFields.is]
            if (data[GetTeamBattleWorshipInfoReplyFields.leaderId] > 0)
                console.log('研发测试_chy:请求模型信息', [PlayerModel.instance.actorId, data[GetTeamBattleWorshipInfoReplyFields.leaderId], data[GetTeamBattleWorshipInfoReplyFields.leaderPgId]]);
            ChatCtrl.instance.getChatDetailedInfo([PlayerModel.instance.actorId, data[GetTeamBattleWorshipInfoReplyFields.leaderId], data[GetTeamBattleWorshipInfoReplyFields.leaderPgId]])
        }

        onOpened(): void {
            super.onOpened();
            ZhuLuCtrl.instance.GetTeamBattleWorshipInfo();
            // ChatCtrl.instance.getChatDetailedInfo([PlayerModel.instance.actorId, info[LimitXunbaoRankInfoFields.objId], info[LimitXunbaoRankInfoFields.pgId]]);
            // let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            // if (role) {
            //    let shuju: Array<number> = role.property.get("exterior");
            //    this._avatarClip.reset(shuju[0], shuju[1], shuju[2], 0, 0, shuju[5]);
            //    this._avatarClip.avatarRotationY = 180;
            // }
        }
        private updatePlayerInfo() {
            let data = ZhuLuModel.instance.WorshipInfo;
            console.log('研发测试_chy:模型返回',);
            if (!data[GetTeamBattleWorshipInfoReplyFields.leaderId]) return;
            let info: ChatPlayerDetailedInfo = ChatModel.instance.otherPlayerInfo;
            if (!info) return;
            console.log('研发测试_chy:显示模型',info);
            // this._skeletonClip.pos(368, 500, true);
            // this._skeletonClip.scale(0.85, 0.85);
            let fashionId: number = info[ChatPlayerDetailedInfoFields.fashionId];/*时装ID*/
            let sbId: number = info[ChatPlayerDetailedInfoFields.sbId]; /*幻武ID*/
            let wingId: number = info[ChatPlayerDetailedInfoFields.wingId];/*翅膀ID*/
            let rideId: number = info[ChatPlayerDetailedInfoFields.rideId];/*精灵ID*/
            let clothes: number = fashionId;
            if (sbId == 0) sbId = 5001;
            this._skeletonClip.reset(clothes, sbId, wingId);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
            this._skeletonClip.visible = true;
        }

        public close(): void {
            super.close();
        }


    }
}