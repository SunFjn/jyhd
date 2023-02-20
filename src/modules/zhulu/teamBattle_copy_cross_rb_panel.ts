///<reference path="../config/scene_copy_teamBattle_cfg.ts"/>
namespace modules.zhulu {
    import Event = Laya.Event;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import TeamBattleCrossRBViewUI = ui.TeamBattleCrossRBViewUI;
    import GetTeamPrepareCopyInfoReply = Protocols.GetTeamPrepareCopyInfoReply;
    import GetTeamPrepareCopyInfoReplyFields = Protocols.GetTeamPrepareCopyInfoReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import HumanShowFields = Protocols.HumanShowFields;
    import SceneModel = modules.scene.SceneModel;
    import HumanShow = Protocols.HumanShow;
    import NpcShow = Protocols.NpcShow;
    import ActorShowFields = Protocols.ActorShowFields;
    import CustomList = modules.common.CustomList;
    import SceneCopyTeamBattleCfg = modules.config.SceneCopyTeamBattleCfg;
    import ClanModel = modules.clan.ClanModel;
    import scene_copy_teamBattle = Configuration.scene_copy_teamBattle;
    import scene_copy_teamBattleFields = Configuration.scene_copy_teamBattleFields;
    import GameCenter = game.GameCenter;
    export class TeamBattleCrossRBView extends TeamBattleCrossRBViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private _listNpc: CustomList;
        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 200;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._list = new CustomList();
            this._list.pos(8 + 12, 304 + 44, true);
            this._list.itemRender = TeamBattleRBPlayerItem;
            this._list.width = 272;
            this._list.height = 150;

            this._listNpc = new CustomList();
            this._listNpc.pos(296 + 12, 304 + 44, true);
            this._listNpc.itemRender = TeamBattleRBBoxItem;
            this._listNpc.width = 272;
            this._listNpc.height = 150;
            this.addChild(this._list);
            this.addChild(this._listNpc);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ADD_HUMANS, this, this.updateHumans);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_REMOVE_HUMANS, this, this.updateHumans);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TeamBattle_Gather_UPDATA_DATA, this, this.updataGather);

            this.addAutoListener(this.noPlayerTxt, Laya.Event.CLICK, this, this.noPlayerTxtClickHandler);
            // this.addAutoListener(this.findBtn, Laya.Event.CLICK, this, this.findHandler);
            // this.addAutoListener(this.findBtn2, Laya.Event.CLICK, this, this.moveHandler);
            this.addAutoListener(this.cjAwardBtn, Laya.Event.CLICK, this, this.cjAwardBtnHandler);
            this.addAutoListener(this.noticeBtn, Laya.Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.scoreBtn, Laya.Event.CLICK, this, this.scoreBtnHandler);
            this.addAutoRegisteRedPoint(this.cjAwardRP, ["ZhuluCjAwardeRP"]);
            this.addAutoRegisteRedPoint(this.scoreRP, ["ZhuluScoreRP"]);
            Laya.timer.loop(1000, this, this.check)

        }

        private check() {
            let arr: Array<TeamBattleRBBoxItem> = this._listNpc.items as Array<TeamBattleRBBoxItem>
            for (const item of arr) {
                item.checkDistance();
            }
            this.updateHumans();
        }



        private scoreBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_HEADER_SCORE_AWARD_ALERT);
        }

        //打开成就面板
        private cjAwardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_ACHIEVEMENT_AWARD_ALERT);
        }

        //规则帮助界面
        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(73006);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.check)

        }

        public onOpened(): void {
            super.onOpened();
            this.updateHumans();
            this.updateNpcs();
            this.helpHandler();
            ZhuLuCtrl.instance.GetTeamChiefScoreAwardList();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }



        public close(): void {
            super.close();

        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
        public isAttack(objId: number) {
            /* 无敌状态 */
            let role = GameCenter.instance.getRole(!objId ? PlayerModel.instance.actorId : objId);
            if (role) {
                let actorState = role.property.get("actorState") || 0;
                return actorState & ActorState.wudi;
            }
            return true;
        }

        public unhurt(objId: number) {
            /* 免疫伤害状态 */
            let role = GameCenter.instance.getRole(!objId ? PlayerModel.instance.actorId : objId);
            if (role) {
                let actorState = role.property.get("actorState") || 0;
                return actorState & ActorState.unhurt;
            }
            return true;
        }
        private testTarget(objId: number) {
            let role = GameCenter.instance.getRole(!objId ? PlayerModel.instance.actorId : objId);
            if (role == null || !role.isValid) {
                return false;
            }
            if (role) {
                let actorState = role.property.get("actorState") || 0;
                if (actorState & ActorState.wudi) return false;
                if (actorState & ActorState.unhurt) return false;
                if (actorState & ActorState.dead) return false;
            }

            return true;
        }


        // 更新玩家列表
        private updateHumans(): void {
            // if (!this.isAttack()) {
            //     this._list.datas = []
            //     this.noPlayerTxt.visible = true;
            //     return;
            // }
            let humans: Array<HumanShow> = SceneModel.instance.humans;
            let arr: Array<HumanShow> = [];
            for (let i: int = 0, len: int = humans.length; i < len; i++) {
                if (humans[i][HumanShowFields.actorShow][ActorShowFields.objId] == PlayerModel.instance.actorId) continue;
                if (humans[i][HumanShowFields.actorShow][ActorShowFields.fightTeamId] == ClanModel.instance.ClanId) continue;
                if (!this.testTarget(humans[i][HumanShowFields.actorShow][ActorShowFields.objId])) continue;
                arr.push(humans[i]);
            }
            this.noPlayerTxt.visible = arr.length === 0;
            if (arr == this._list.datas) return;;
            this._list.datas = arr;

        }
        // 更新采集列表
        private updateNpcs(): void {
            let arr: Array<scene_copy_teamBattle> = SceneCopyTeamBattleCfg.instance.getAllCfg();
            this._listNpc.datas = arr;
            this.check();
        }

        private updataGather(code: number) {
            // console.log('研发测试_chy:updataGather', code);
            // if (code == -1 || code == 2) {
            //     this.transportTips.visible = false
            // } else if (code == 1) {
            //     this.transportTips.visible = true
            // }
        }


        private noPlayerTxtClickHandler(): void {
            SystemNoticeManager.instance.addNotice("场景中暂无玩家目标", true);
        }
    }
}