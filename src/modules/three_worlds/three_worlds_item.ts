/** 三界BOSS单元项*/



namespace modules.threeWorlds {
    import BossSelectItemUI = ui.BossSelectItemUI;
    import scene_cross_boss = Configuration.scene_cross_boss;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import MonsterResFields = Configuration.MonsterResFields;
    import PlayerModel = modules.player.PlayerModel;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;
    export class ThreeWorldsItem extends BossSelectItemUI {

        private _reviveTimeStamp: number;
        protected initialize(): void {
            super.initialize();
        }

        protected onOpened(): void {
            super.onOpened();
            this.selectedImg.visible = false;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);

            this.selectedImg.visible = value;
            this.lvTxt.strokeColor = value ? "#7f950c" : "#ff0400";
        }

        protected downHandler(): void {
            super.downHandler();
            if (!this.selected) {
                this.selectedImg.visible = true;
            }

        }
        protected upHandler(): void {
            super.upHandler();
            if (!this.selected) {
                this.selectedImg.visible = false;
            }
        }
        protected outHandler(): void {
            super.outHandler();
            if (!this.selected) {
                this.selectedImg.visible = false;
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg: scene_cross_boss = value as scene_cross_boss;
            let monsterCfg: MonsterRes = MonsterResCfg.instance.getCfgById(cfg[scene_cross_bossFields.occ]);
            this.iconImg.skin = `assets/icon/monster/${monsterCfg[MonsterResFields.icon]}.png`;
            this.bossName.text = monsterCfg[MonsterResFields.name]
            this.lvTxt.text = cfg[scene_cross_bossFields.eraTips];
            let needEra: Array<number> = cfg[scene_cross_bossFields.eraLevelSection];
            if (ThreeWorldsModel.instance.canChallenge == value[1] - 1) {
                // this.selectedImg.visible = true;//不可挑战显示
                this.state_image.skin = "three_worlds/state_can.png"
                let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(value[scene_cross_bossFields.occ]);
                if (bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {
                    this.state_image.skin = "three_worlds/state_resurgence.png"
                    this._reviveTimeStamp = bossInfo[BossInfoFields.bossState][BossStateFields.reviveTime];
                    if (this._reviveTimeStamp > GlobalData.serverTime) {
                        Laya.timer.loop(1000, this, this.reviveCDHandler);
                        this.reviveCDHandler();
                    }
                }
            } else {
                this.state_image.skin = "three_worlds/state_noOpen.png"
            }
            if (this.selected) {
                this.selectedImg.visible = true;
            }
            if (PlayerModel.instance.eraLevel >= needEra[0] && PlayerModel.instance.eraLevel <= needEra[1]) {
                this._selectEnable = true;
            } else {
                this._selectEnable = true;
            }
        }
        private reviveCDHandler() {
            if (this._reviveTimeStamp <= GlobalData.serverTime) {
                Laya.timer.clear(this, this.reviveCDHandler);
                this.state_image.skin = "three_worlds/state_can.png"
            }
        }
        public close(): void {
            Laya.timer.clear(this, this.reviveCDHandler);
        }
    }

}