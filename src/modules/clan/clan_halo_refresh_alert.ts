/** 战队刷新消耗弹框*/
namespace modules.clan {
    import LayaEvent = modules.common.LayaEvent;
    import ClanHaloRefreshAlertUI = ui.ClanHaloRefreshAlertUI;
    import ClanBuildAndHalRefresh = Protocols.ClanBuildAndHalRefresh;
    import ClanBuildAndHalRefreshFiedls = Protocols.ClanBuildAndHalRefreshFiedls;
    import BlendCfg = modules.config.BlendCfg;

    export class ClanHaloRefreshAlert extends ClanHaloRefreshAlertUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.gbBtn, LayaEvent.CLICK, this, this.gbBtnHandler);
        }


        onOpened(): void {
            super.onOpened();
            let consume: Array<string> = ClanModel.instance.getRefreshHaloConsume();
            this.costTypeImg.skin = consume[0];
            this.costTxt.text = consume[1];
        }

        okBtnHandler(): void {
            ClanCtrl.instance.clanRefreshHaloRequset();
        }

        gbBtnHandler(): void {
            console.log("close");

            this.close();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
    }
}