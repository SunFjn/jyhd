/** 多人BOSS单元项*/


namespace modules.multiBoss {
    import MultiBossItemUI = ui.MultiBossItemUI;
    import scene_multi_boss = Configuration.scene_multi_boss;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import PlayerModel = modules.player.PlayerModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BossInfo = Protocols.BossInfo;
    import BossTimes = Protocols.BossTimes;
    import DungeonModel = modules.dungeon.DungeonModel;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;
    import BossTimesFields = Protocols.BossTimesFields;
    import FollowBoss = Protocols.FollowBoss;
    import FollowBossFields = Protocols.FollowBossFields;

    export class MultiBossItem extends MultiBossItemUI {
        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_TIMES_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE, this, this.checkRP);
        }

        protected removeListeners(): void {
            super.removeListeners();

            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_TIMES_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.off(CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE, this, this.checkRP);
        }

        protected onOpened(): void {
            super.onOpened();
            this.selectedImg.visible = false;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.selectedImg.visible = value;
        }

        public close(): void {
            super.close();
            this.rpImg.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg: scene_multi_boss = value as scene_multi_boss;
            let monsterCfg: MonsterRes = MonsterResCfg.instance.getCfgById(cfg[scene_multi_bossFields.occ]);
            this.iconImg.skin = `assets/icon/monster/${monsterCfg[MonsterResFields.icon]}.png`;
            this.lb_name.text = monsterCfg[MonsterResFields.name];
            this.lvTxt.text = cfg[scene_multi_bossFields.eraTips];
            let needLv: int = cfg[scene_multi_bossFields.actorLevel];
            let needEra: int = cfg[scene_multi_bossFields.eraLevel];
            if (PlayerModel.instance.level >= needLv && PlayerModel.instance.eraLevel >= needEra) {
                this.iconImg.gray = false;
                this.lockImg.visible = false;
                this._selectEnable = true;
            } else {
                this.iconImg.gray = true;
                this.lockImg.visible = true;
                this._selectEnable = false;
            }
        }

        protected clickHandler(): void {
            super.clickHandler();
            let cfg: scene_multi_boss = this._data as scene_multi_boss;
            let needLv: int = cfg[scene_multi_bossFields.actorLevel];
            let needEra: int = cfg[scene_multi_bossFields.eraLevel];
            if (PlayerModel.instance.level < needLv || PlayerModel.instance.eraLevel < needEra) {
                // CommonUtil.alert("提示", "觉醒等级不足，请提升后再来。");
                SystemNoticeManager.instance.addNotice("觉醒等级不足，请提升后再来。", true);
            }
        }

        private checkRP(): void {
            let flag: boolean = false;
            if (this._data) {
                let cfg: scene_multi_boss = this._data as scene_multi_boss;
                let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(cfg[scene_multi_bossFields.occ]);
                if (bossInfo && !bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {
                    let timeInfo: BossTimes = DungeonModel.instance.getBossTimesBySceneType(SceneTypeEx.multiBoss);
                    if (timeInfo) {
                        if (timeInfo[BossTimesFields.remainTimes] > 0) {
                            let follow: FollowBoss = DungeonModel.instance.getFollowBossById(cfg[scene_multi_bossFields.occ]);
                            if (follow && follow[FollowBossFields.follow]) {
                                flag = true;
                            }
                        }
                    }
                }
            }
            this.rpImg.visible = flag;
        }
    }
}