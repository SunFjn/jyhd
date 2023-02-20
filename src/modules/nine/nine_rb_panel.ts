/** 九天之巅右下角面板*/


namespace modules.nine {
    import NineRBViewUI = ui.NineRBViewUI;
    import CustomList = modules.common.CustomList;
    import HumanShow = Protocols.HumanShow;
    import SceneModel = modules.scene.SceneModel;
    import NineCopy = Protocols.NineCopy;
    import NineCopyFields = Protocols.NineCopyFields;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import HumanShowFields = Protocols.HumanShowFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UpdateScoreFields = Protocols.UpdateScoreFields;

    export class NineRBPanel extends NineRBViewUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 240;
            this.closeByOthers = false;

            this._list = new CustomList();
            this._list.pos(272, 44, true);
            this._list.itemRender = NineRBPlayerItem;
            this._list.width = 272;
            this._list.height = 150;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.NINE_SCORE_UPDATE, this, this.updateScore);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ADD_HUMANS, this, this.updateHumans);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_REMOVE_HUMANS, this, this.updateHumans);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.NINE_COPY_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);

            this.addAutoListener(this.killBtn, Laya.Event.CLICK, this, this.killHandler);
            this.addAutoListener(this.findBtn, Laya.Event.CLICK, this, this.findHandler);
            this.addAutoListener(this.noPlayerTxt, Laya.Event.CLICK, this, this.noPlayerTxtClickHandler);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateHumans();
            this.updateInfo();
            this.enterScene();
            this.updateScore();
        }

        // 更新积分
        private updateScore(): void {
            if (!NineModel.instance.score) return;
            let lv: number = SceneModel.instance.enterScene[EnterSceneFields.level];
            this.scoreTxt.text = `${NineModel.instance.score[UpdateScoreFields.score]}/${SceneCopyNineCfg.instance.getCfgByLevel(lv)[scene_copy_nineFields.totalScore]}`;
        }

        // 更新玩家列表
        private updateHumans(): void {
            let humans: Array<HumanShow> = SceneModel.instance.humans;
            let arr: Array<HumanShow> = [];
            for (let i: int = 0, len: int = humans.length; i < len; i++) {
                if (humans[i][HumanShowFields.actorShow][ActorShowFields.objId] !== PlayerModel.instance.actorId) {
                    arr.push(humans[i]);
                }
            }
            this._list.datas = arr;
            this.noPlayerTxt.visible = arr.length === 0;
        }

        // 更新副本信息
        private updateInfo(): void {
            let info: NineCopy = NineModel.instance.nineCopy;
            this.lifeTxt.text = `${info[NineCopyFields.remainTimes]}/${info[NineCopyFields.totalTimes]}`;
        }

        private enterScene(): void {
            this.lvTxt.text = `第${SceneModel.instance.enterScene[EnterSceneFields.level]}层`;
        }

        // 自动杀敌
        private killHandler(): void {
            // NineCtrl.instance.reqSearchObj(SearchType.monster);
            PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
        }

        // 自动索敌
        private findHandler(): void {
            // NineCtrl.instance.reqSearchObj(SearchType.actor);
            PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
        }

        private noPlayerTxtClickHandler(): void {
            SystemNoticeManager.instance.addNotice("场景中暂无玩家目标", true);
        }
    }
}