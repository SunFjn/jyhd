/** 副本结算管理*/


namespace modules.dungeon {
    import CopyJudgeAward = Protocols.CopyJudgeAward;
    import CopyJudgeAwardFields = Protocols.CopyJudgeAwardFields;
    import Item = Protocols.Item;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import scene_cross_boss = Configuration.scene_cross_boss;
    import ThreeWorldsModel = modules.threeWorlds.ThreeWorldsModel;

    export class DungeonResultManager {
        private static _instance: DungeonResultManager;
        public static get instance(): DungeonResultManager {
            return this._instance = this._instance || new DungeonResultManager();
        }

        private _table: Table<CopyJudgeAward>;

        constructor() {
            // GlobalData.dispatcher.on(CommonEventType.PANEL_OPEN, this, this.panelOpenHandler);
            GlobalData.dispatcher.on(CommonEventType.PANEL_CLOSE, this, this.panelCloseHandler);
        }

        // 添加一个结算
        public addResult(value: CopyJudgeAward): void {
            if (!value) return;
            if (!this._table) this._table = {};
            let type: number = value[CopyJudgeAwardFields.type];
            this._table[type] = value;
            let items: Array<Item> = value[CopyJudgeAwardFields.items];
            // 1最后一击  2MVP  3参与 4三界BOSS伤害排行
            if (type === 1) {
                WindowManager.instance.open(WindowEnum.LAST_HIT_AWARD_ALERT, items || []);
                WindowManager.instance.close(WindowEnum.MVP_AWARD_ALERT);
                WindowManager.instance.close(WindowEnum.WIN_PANEL);
                WindowManager.instance.close(WindowEnum.THREE_WORLDS_RANK_PANEL);
            } else if (type === 2) {
                if (WindowManager.instance.isOpened(WindowEnum.LAST_HIT_AWARD_ALERT)) return;
                WindowManager.instance.open(WindowEnum.MVP_AWARD_ALERT, items || []);
                WindowManager.instance.close(WindowEnum.WIN_PANEL);
                WindowManager.instance.close(WindowEnum.THREE_WORLDS_RANK_PANEL);
            } else if (type === 3) {  //云梦秘境 多人BOSS
                if (WindowManager.instance.isOpened(WindowEnum.LAST_HIT_AWARD_ALERT)) return;
                if (WindowManager.instance.isOpened(WindowEnum.MVP_AWARD_ALERT)) return;
                WindowManager.instance.open(WindowEnum.FIRST_WIN_PANEL, value);
            } else if (type === 4) {
                if (WindowManager.instance.isOpened(WindowEnum.LAST_HIT_AWARD_ALERT)) return;
                if (WindowManager.instance.isOpened(WindowEnum.MVP_AWARD_ALERT)) return;
                WindowManager.instance.open(WindowEnum.THREE_WORLDS_RANK_PANEL, [0, 2]);
            } else if (type === 5) {
                if (WindowManager.instance.isOpened(WindowEnum.SMELT_SUCCESS_ALERT)) return;
                let datas: Array<Item> = value[Protocols.CopyJudgeAwardFields.items];
                WindowManager.instance.open(WindowEnum.BOX_AWARD_ALERT, [datas]);
            }
        }

        private panelCloseHandler(dialogId: WindowEnum): void {
            if (!this._table) return;
            // 最后一击 > MVP > 胜利结算
            if (dialogId === WindowEnum.LAST_HIT_AWARD_ALERT) {
                let award: CopyJudgeAward = this._table[2];
                if (award) {
                    WindowManager.instance.open(WindowEnum.MVP_AWARD_ALERT, award[CopyJudgeAwardFields.items] || []);
                    delete this._table[2];
                    return;
                }
                award = this._table[3];
                if (award) {
                    WindowManager.instance.open(WindowEnum.FIRST_WIN_PANEL, award);
                    delete this._table[3];
                    return;
                }
                award = this._table[4];
                if (award) {
                    WindowManager.instance.open(WindowEnum.THREE_WORLDS_RANK_PANEL, [0, 2]);
                    delete this._table[4];
                    return;
                }
            } else if (dialogId === WindowEnum.MVP_AWARD_ALERT) {
                let award: CopyJudgeAward = this._table[3];
                if (award) {
                    WindowManager.instance.open(WindowEnum.FIRST_WIN_PANEL, award);
                    delete this._table[3];
                    return;
                }
                award = this._table[4];
                if (award) {
                    WindowManager.instance.open(WindowEnum.THREE_WORLDS_RANK_PANEL, [0, 2]);
                    delete this._table[4];
                    return;
                }
            }
        }
    }
}
