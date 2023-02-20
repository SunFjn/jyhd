/** 副本工具类*/


namespace modules.dungeon {
    import BossTimes = Protocols.BossTimes;
    import BossTimesFields = Protocols.BossTimesFields;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import DelSceneTimes = Protocols.DelSceneTimes;
    import DelSceneTimesFields = Protocols.DelSceneTimesFields;

    export class DungeonUtil {

        private static _ids: Table<number>;

        constructor() {

        }

        private static init(): void {
            if (!this._ids) {
                this._ids = {};
                this._ids[SceneTypeEx.singleBossCopy] = 20730003;
                this._ids[SceneTypeEx.multiBoss] = 20730004;
                this._ids[SCENE_ID.scene_copper_copy] = 20730005;
                this._ids[SCENE_ID.scene_zq_copy] = 20730006;
                this._ids[SCENE_ID.scene_xianqi_copy] = 20730007;
                this._ids[SCENE_ID.scene_pet_copy] = 20730008;
                this._ids[SCENE_ID.scene_team_copy] = 20730009;
                this._ids[SceneTypeEx.crossBoss] = 20730010;
            }
        }

        // 根据场景类型检测BOSS挑战是否用券
        public static checkUseTicketBySceneType(sceneType: SceneTypeEx, level: number): boolean {
            this.init();
            let flag: boolean = false;
            // 先检测有没剩余次数，如果没有则检测背包中有没劵
            let timeInfo: BossTimes = DungeonModel.instance.getBossTimesBySceneType(sceneType);
            if (timeInfo && timeInfo[BossTimesFields.remainTimes] > 0) {
                flag = false;
            } else if (timeInfo && timeInfo[BossTimesFields.remainTimes] === 0) {     // 0次且需要扣除次数时用券
                let arr: Array<DelSceneTimes> = timeInfo[BossTimesFields.delTimes];
                if (arr) {
                    for (let i: int = 0, len: int = arr.length; i < len; i++) {
                        if (level === arr[i][DelSceneTimesFields.level]) {
                            console.log(`场景类型 SceneTypeEx---${timeInfo[BossTimesFields.sceneType]}`);
                            console.log(`level---${level}`);
                            console.log(`是否消耗次数---${arr[i][DelSceneTimesFields.isDelTimes]}`);
                            if (arr[i][DelSceneTimesFields.isDelTimes]) {
                                let items: Array<Item> = BagModel.instance.getItemsById(this._ids[sceneType]);
                                if (items.length > 0) {
                                    // 没有次数但有券时弹出使用框
                                    flag = true;
                                    WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, [items[0], false]);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            return flag;
        }

        // 根据场景ID检测BOSS挑战是否用券
        public static checkUseTicketBySceneId(sceneId: SCENE_ID): boolean {
            this.init();
            let flag: boolean = false;
            let timeInfo: Protocols.CopyTimes = DungeonModel.instance.timesTable[sceneId];
            if (timeInfo && timeInfo[Protocols.CopyTimesFields.challengeRemainTimes] > 0) {
                flag = false;
            } else if (timeInfo && timeInfo[Protocols.CopyTimesFields.challengeRemainTimes] === 0) {
                let needItemId: number = this._ids[sceneId];
                let haveItems: Array<Item> = BagModel.instance.getItemsById(needItemId);
                if (haveItems.length > 0) {
                    flag = true;
                    WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, [haveItems[0], false]);
                }
            }
            return flag;
        }
    }
}