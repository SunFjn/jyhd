/** 战面福地板 */
namespace modules.clan {
    import WindowManager = modules.core.WindowManager;
    import ClanLuckyFieldViewUI = ui.ClanLuckyFieldViewUI;

    export class ClanLuckyFieldPanel extends ClanLuckyFieldViewUI {

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();

        }

        public onOpened(): void {
            super.onOpened();
            
        }

        public close(): void {
            super.close();
            WindowManager.instance.close(WindowEnum.CLAN_BLESSED_PANEL);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}
