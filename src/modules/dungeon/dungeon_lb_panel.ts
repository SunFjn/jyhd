/** 副本左下面板*/


namespace modules.dungeon {
    import DungeonLBViewUI = ui.DungeonLBViewUI;
    import Event = Laya.Event;
    import CommonUtil = modules.common.CommonUtil;
    import Handler = Laya.Handler;
    import MissionModel = modules.mission.MissionModel;
    import Layer = ui.Layer;
    import SceneCfg = modules.config.SceneCfg;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import BossHomeModel = modules.bossHome.BossHomeModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import LadderModel = modules.ladder.LadderModel;
    import LayaEvent = modules.common.LayaEvent;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import GlovesBuyAlert = modules.gloves.GlovesBuyAlert;

    export class DungeonLBPanel extends DungeonLBViewUI {
        constructor() {
            super();
        }

        private _sceneType: number;
        private _sceneSkip: SceneTypeEx[];
        protected initialize(): void {
            super.initialize();

            this.left = 20;
            this.bottom = 240;
            this._sceneType = 0;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;
            this._sceneSkip = [SceneTypeEx.homestead]
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.exitBtn, LayaEvent.CLICK, this, this.exitHandler);
        }

        private exitHandler(): void {
            let str: string = "";
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            this._sceneType = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
            if (this._sceneType === SceneTypeEx.crossBoss || this._sceneType === SceneTypeEx.multiBoss) {      // 三界BOSS、多人BOSS
                // 未造成伤害时直接退出
                if (!DungeonModel.instance.ranks) {
                    this.exitCommitHandler();
                    return;
                }
                str = "是否确认退出副本，本次副本再次进入将不会消耗挑战次数";
            } else if (this._sceneType === SceneTypeEx.nineCopy) {
                str = `离开场景后，需要<span style="color:#FF3E3E">等待${BlendCfg.instance.getCfgById(10806)[blendFields.intParam][0] * 0.001}秒</span>才能再次进入，是否确定离开？`;
            } else if (this._sceneType === SceneTypeEx.tiantiCopy) {
                str = "退出将视为挑战失败，是否确认退出？";
                LadderModel.instance.autoMatch = false;
            } else if (this._sceneType === SceneTypeEx.richesCopy) {
                this.exitCommitHandler();
                // modules.day_drop_treasure.DayDropTreasureModel.instance._firstJoin = true;
                return;
            } else if (this._sceneType === SceneTypeEx.cloudlandCopy) {
                this.exitCommitHandler();
                return;
            } else if (this._sceneType === SceneTypeEx.swimming) {
                this.exitCommitHandler();
                return;
            } else if (this._sceneType === SceneTypeEx.templeBoss) {
                let isJL = modules.sheng_yu.ShenYuBossCtrl.instance.getState();
                if (isJL) {
                    let okHandler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [WindowEnum.SHENGYU_BOSS_SHOUYI_ALERT]);
                    let cancelHandler: Handler = Handler.create(this, this.exitCommitHandler);
                    CommonUtil.alert(`提示`, `收益记录中有未领取的奖励,是否前往领取？`, [okHandler, `领取奖励`], [cancelHandler, `直接离开`]);
                    // WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_ISLIKAI_ALERT);
                } else {
                    this.exitCommitHandler();
                }
                return;
            } else if (this._sceneType === SceneTypeEx.homeBoss) {
                let items: Item[] = BagModel.instance.getItemsByBagId(BagId.temple);
                let flag: boolean = items && items.length > 0;
                if (flag) {//有奖励可领
                    let okHandler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [WindowEnum.BOSS_HOME_AWARD_ALERT]);
                    let cancelHandler: Handler = Handler.create(this, this.exitCommitHandler);
                    CommonUtil.alert(`提示`, `收益记录中有未领取的奖励,是否前往领取？`, [okHandler, `领取奖励`], [cancelHandler, `直接离开`]);
                } else {
                    this.exitCommitHandler();
                }
                return;
            } else if (this._sceneSkip.indexOf(this._sceneType) > -1) {
                // 跳过退出副本提示直接退出

                this.exitCommitHandler();
                return;
            } else {

                str = "是否确定离开副本？";
            }
            CommonUtil.alert("温馨提示", str, [Handler.create(this, this.exitCommitHandler)], [], false);
        }

        private exitCommitHandler(): void {
            // 手动退出取消自动挂机
            MissionModel.instance.auto = false;
            DungeonCtrl.instance.reqEnterScene();
            if (this._sceneType === SceneTypeEx.homeBoss) {
                WindowManager.instance.open(WindowEnum.BOSS_HOME_PANEL);
            }
        }
    }
}