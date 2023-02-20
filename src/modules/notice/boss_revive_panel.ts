/** BOSS复活提示框*/


namespace modules.notice {
    import BossReviveUI = ui.BossReviveUI;
    import Event = Laya.Event;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import SceneMultiBossCfg = modules.config.SceneMultiBossCfg;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    import scene_home_bossFields = Configuration.scene_home_bossFields;

    export class BossRevivePanel extends BossReviveUI {
        private _bossId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.right = 20;
            this.bottom = 200;
        
        }

        protected addListeners(): void {
            super.addListeners();
            this.gotoBtn.on(Event.CLICK, this, this.gotoHandler);
            this.closeBtn1.on(Event.CLICK, this, this.closeHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.gotoBtn.off(Event.CLICK, this, this.gotoHandler);
            this.closeBtn1.off(Event.CLICK, this, this.closeHandler);
        }

        private gotoHandler(): void {
            if (this._bossId) {
                if (SceneMultiBossCfg.instance.getCfgByBossId(this._bossId)) {
                    WindowManager.instance.open(WindowEnum.MULTI_BOSS_PANEL, this._bossId);
                } else if (SceneCrossBossCfg.instance.getCfgByBossId(this._bossId)) {
                    WindowManager.instance.open(WindowEnum.THREE_WORLDS_PANEL);
                } else if (SceneHomeBossCfg.instance.getCfgByBossId(this._bossId)) {
                    let arr: Array<number> = [];
                    arr[0] = SceneHomeBossCfg.instance.getCfgByBossId(this._bossId)[scene_home_bossFields.level] - 1;
                    arr[1] = this._bossId;
                    WindowManager.instance.open(WindowEnum.BOSS_HOME_PANEL, arr);
                }
                BossReviveManager.instance.passAll();
            }
        }

        private closeHandler(): void {
            BossReviveManager.instance.passOne();
        }

        public setBoss(bossId: number): void {
            this._bossId = bossId;
            let monsterCfg: MonsterRes = MonsterResCfg.instance.getCfgById(bossId);
            this.headImg.skin = `assets/icon/monster/${monsterCfg[MonsterResFields.icon]}.png`;
            this.nameTxt.text = monsterCfg[MonsterResFields.name];
        }
    }
}