///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
/** */
namespace modules.sheng_yu {
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    import GetStrengthRelpy = Protocols.GetStrengthRelpy;
    import GetStrengthRelpyFields = Protocols.GetStrengthRelpyFields;
    import UpdateStrongInfoReply = Protocols.UpdateStrongInfoReply;
    import UpdateStrongInfoReplyFields = Protocols.UpdateStrongInfoReplyFields;


    import PickTempRewardReply = Protocols.PickTempRewardReply;
    import PickTempRewardReplyFields = Protocols.PickTempRewardReplyFields;
    import UseStrengthItemReply = Protocols.UseStrengthItemReply;
    import UseStrengthItemReplyFields = Protocols.UseStrengthItemReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import EnterSceneFields = Protocols.EnterSceneFields;

    import BossDungeonCtrl = modules.bossDungeon.BossDungeonCtrl;
    import SceneModel = modules.scene.SceneModel;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import BossInfoFields = Protocols.BossInfoFields;

    export class XuanhuoBossBossCtrl extends BaseCtrl {
        private static _instance: XuanhuoBossBossCtrl;
        public static get instance(): XuanhuoBossBossCtrl {
            return this._instance = this._instance || new XuanhuoBossBossCtrl();
        }

        private destin: Point;

        constructor() {
            super();
            this.destin = new Point(180, 60);
        }

        public setup(): void {
            // 圣域boss 
            Channel.instance.subscribe(SystemClientOpcode.GetStrengthRelpy, this, this.GetStrengthRelpy);
            Channel.instance.subscribe(SystemClientOpcode.UpdateStrongInfoReply, this, this.UpdateStrongInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.PickTempRewardReply, this, this.PickTempRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.UseStrengthItemReply, this, this.UseStrengthItemReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateRP);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
            GlobalData.dispatcher.on(CommonEventType.SCENE_ENTER, this, this.nowCengShu);
            this.GetStrength();
        }
        public GetStrength() {
            // console.log("圣域boss 获取体力 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetStrength, null);
        }

        public SetStrength(auto: number) {
            // console.log("圣域boss 设置自动体力 请求 :" + auto);
            Channel.instance.publish(UserFeatureOpcode.SetStrength, [auto]);
        }

        public PickTempReward() {
            // console.log("圣域boss 领取圣殿奖励 请求 ");
            Channel.instance.publish(UserFeatureOpcode.PickTempReward, null);
        }

        public UseStrengthItem(num: number) {
            // console.log("圣域boss 使用体力丹 请求 :" + num);
            Channel.instance.publish(UserFeatureOpcode.UseStrengthItem, [num]);
        }

        private GetStrengthRelpy(tuple: GetStrengthRelpy): void {
            // console.log("获取圣域 获取体力 返回数据...............:   ", tuple);
            if (tuple) {
                ShengYuBossModel.instance.stength = tuple[GetStrengthRelpyFields.stength];
                let auto = tuple[GetStrengthRelpyFields.auto];
                let bollll = auto == 1;
                ShengYuBossModel.instance._bollZiDong = auto == 1;
                GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_ZIDONG_UPDATE);
                GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_UPDATE);
                this.updateRP();
            }
        }

        private UpdateStrongInfoReply(tuple: UpdateStrongInfoReply): void {
            // console.log("获取圣域更新体力 返回数据...............:   ", tuple);

            if (tuple) {
                ShengYuBossModel.instance.stength = tuple[UpdateStrongInfoReplyFields.stength];
                GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_UPDATE);
                this.updateRP();
            }
        }

        private PickTempRewardReply(tuple: PickTempRewardReply): void {
            // console.log("获取圣域 领取奖励 返回数据...............:   ", tuple);

            let code: number = tuple[PickTempRewardReplyFields.result];
            if (code === 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        private UseStrengthItemReply(tuple: UseStrengthItemReply): void {
            // console.log("获取圣域 使用体力 返回数据...............:   ", tuple);

            let code: number = tuple[UseStrengthItemReplyFields.result];
            if (code === 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("使用成功", false);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        public nowCengShu() {
            if (modules.scene.SceneModel.instance.enterScene) {
                ShengYuBossModel.instance.nowCeng = modules.scene.SceneModel.instance.enterScene[EnterSceneFields.level];
                this.nullChuLi();
                GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_SCENE_UPDATE);
            }
        }

        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.shengYu) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.shengYu)) {
                        this.updateRP();
                        return;
                    }
                }
            }
        }

        public getState(): boolean {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.shengYu)) {
                if (modules.bag.BagModel.instance.getItemsByBagId(BagId.temple)) {
                    let items: Array<Protocols.Item> = modules.bag.BagModel.instance.getItemsByBagId(BagId.temple);
                    if (items) {
                        return items.length > 0
                    }
                    else {
                        return false;
                    }
                }
            }
            return false;
        }

        private updateRP(bagId: number = BagId.temple): void {
            if (bagId == BagId.temple) {
                RedPointCtrl.instance.setRPProperty("shenYuBossRP", this.getState());
            }
        }

        //如果进来是挂机的话 去找一下boss 就好了  boss死了 自然就去打小怪了
        public nullChuLi() {
            let mapId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (mapId === SCENE_ID.scene_temple_boss) {
                PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                let infos = ClasSsceneTempleBossCfg.instance.getBossInfoByGrade(ShengYuBossModel.instance.nowCeng);
                if (infos) {
                    BossDungeonModel.instance.selectLastBoss = infos[0][scene_temple_bossFields.occ];
                    if (DungeonModel.instance.getBossInfoById(BossDungeonModel.instance.selectLastBoss)) {
                        BossDungeonModel.instance.selectTargetPos = DungeonModel.instance.getBossInfoById(BossDungeonModel.instance.selectLastBoss)[BossInfoFields.pos];
                        this.fuHuoIsQieHuan();
                    }
                }
            }
        }

        /**
         * 复活的时候 判断之前打的boss有没有死  没死继续打
         */
        public fuHuoIsQieHuan() {
            let searchCount: int = DungeonModel.instance.liveCount();
            BossDungeonCtrl.instance.setAutoFindWay(searchCount);
        }
    }
}