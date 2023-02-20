namespace modules.warDisplay {


    import BaseCtrl = modules.core.BaseCtrl;
    import PlayerModel = modules.player.PlayerModel;

    export class WarDisplayCtrl extends BaseCtrl {

        public static _instance: WarDisplayCtrl;
        public static get instance(): WarDisplayCtrl {
            return WarDisplayCtrl._instance = WarDisplayCtrl._instance || new WarDisplayCtrl();
        }

        constructor() {
            super();
        }

        public setup() {
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_FIGHT, this, this.openwardisplay);
        }

        private openwardisplay(): void {
            if (PlayerModel.instance.fight > PlayerModel.instance.beforefight) {
                if (!WindowManager.instance.isOpened(WindowEnum.WAR_DISPLAY_PANEL)) {
                    WindowManager.instance.open(WindowEnum.WAR_DISPLAY_PANEL);
                } else {
                    let panel: WarDisplay = WindowManager.instance.getPanelById(WindowEnum.WAR_DISPLAY_PANEL) as WarDisplay;
                    if (panel) {
                        // Laya.timer.loop(200, this, ():void=>{panel.updataWar();});
                        panel.updataWar();
                    }
                }
            }
        }
    }
}