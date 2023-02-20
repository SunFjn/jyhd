/**Boss之家控制器 */


namespace modules.bossHome {
    import BaseCtrl = modules.core.BaseCtrl;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import LogUtils = game.misc.LogUtils;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneModel = modules.scene.SceneModel;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;

    export class BossHomeCtrl extends BaseCtrl {
        private static _instance: BossHomeCtrl;

        public static get instance(): BossHomeCtrl {
            return this._instance = this._instance || new BossHomeCtrl();
        }

        public setup(): void {
            //更新宝箱打开次数
            Channel.instance.subscribe(SystemClientOpcode.UpdateOpenBoxTimes, this, this.updateOpenTimes);
            //宝箱打开次数返回
            Channel.instance.subscribe(SystemClientOpcode.GetOpenBoxTimesReply, this, this.getOpenTimesReply);
            //更新boss状态
            Channel.instance.subscribe(SystemClientOpcode.UpdateBossState, this, this.updateBossState);
            //更新怪物归属
            Channel.instance.subscribe(SystemClientOpcode.UpdateBossDropOwns, this, this.updateBossDropOwns);
        }

        //更新怪物归属
        private updateBossDropOwns(tuple: Protocols.UpdateBossDropOwns): void {
            BossDungeonModel.instance.updateBossDropOwns(tuple[Protocols.UpdateBossDropOwnsFields.drop]);
        }

        //更新boss状态
        private updateBossState(tuple: Protocols.UpdateBossState): void {
            BossHomeModel.instance.updateBossState(tuple[Protocols.UpdateBossStateFields.states]);
        }

        // 获取宝箱打开次数
        public getOpenTimes(): void {
            LogUtils.info(LogFlags.BossHomeCtrl, "获取宝箱打开次数.............");
            Channel.instance.publish(UserFeatureOpcode.GetOpenBoxTimes, null);
        }

        // 获取打宝箱开次数返回
        private getOpenTimesReply(tuple: Protocols.GetOpenBoxTimesReply): void {
            LogUtils.info(LogFlags.BossHomeCtrl, "获取副本次数返回................." + tuple);
            BossHomeModel.instance.updateOpenTimes(tuple[Protocols.GetOpenBoxTimesReplyFields.boxTimes]);
        }

        // 更新宝箱打开次数
        private updateOpenTimes(tuple: Protocols.UpdateOpenBoxTimes): void {
            LogUtils.info(LogFlags.BossHomeCtrl, "更新副本次数................." + tuple);
            BossHomeModel.instance.updateOpenTimes(tuple[Protocols.UpdateOpenBoxTimesFields.boxTimes]);
        }

        // 设置关注BOSS
        public setFollowBoss(bossId: number, isFollow: boolean): void {
            DungeonCtrl.instance.setFollowBoss(bossId, isFollow);
        }

        //请求进入场景
        public reqEnterScene(mapId: number = 0, level: int = 1): void {
            DungeonCtrl.instance.reqEnterScene(mapId, level);
            this.getOpenTimes();
        }
    }
}