///<reference path="../sheng_yu/sheng_yu_boss_model.ts"/>
/** boss副本系列 */
namespace modules.bossDungeon {
    import ShengYuBossModel = modules.sheng_yu.ShengYuBossModel;
    import BaseCtrl = modules.core.BaseCtrl;

    export class BossDungeonCtrl  extends BaseCtrl {
        private static _instance: BossDungeonCtrl;
        public static get instance(): BossDungeonCtrl {
            return this._instance = this._instance || new BossDungeonCtrl();
        }

        public setup(): void {

        }

        public setSelectTarget(id: int = -1, isBoss: boolean = true): void {
            let mapId: int = BossDungeonModel.instance.searchBossType;
            if (mapId == SCENE_ID.scene_home_boss) {
                BossHomeModel.instance.setSelectTarget(id, isBoss);
            } else {
                ShengYuBossModel.instance.setSelectTarget(id, isBoss);
            }
        }

        public setAutoFindWayFuHuo(): void {
            let tFlag: boolean = DungeonModel.instance.isDeadSearch();
            if (tFlag) {
                this.noneWhileOneHandler();
            } else {
                this.setSelectTarget(BossDungeonModel.instance.selectLastBoss);
            }
        }

        public setAutoFindWay(lastCount: int): void {
            let tCount: int = DungeonModel.instance.liveCount();
            switch (BossDungeonModel.instance.searchBossType) {
                case SCENE_ID.scene_home_boss: {
                    if (lastCount === 0 && tCount > 0) {
                        this.noneWhileOneHandler();
                    }
                    break;
                }
            }
        }

        //如果没有存活的BOSS，则在原地待机，直到有boss复活，再按BOSSID从小到大，自动寻路至下一个存活的BOSS。
        //多模块统一处理
        public noneWhileOneHandler(): void {
            let id: int = DungeonModel.instance.searchBoss(null, BossDungeonModel.instance.searchBossIds);
            switch (BossDungeonModel.instance.searchBossType) {
                case SCENE_ID.scene_home_boss:
                case SCENE_ID.scene_temple_boss:
                    this.setSelectTarget(id);
                    break;
            }
        }
    }
}