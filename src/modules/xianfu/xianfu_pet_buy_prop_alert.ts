///<reference path="../config/xianfu_travel_cfg.ts"/>
/** 仙府-家园宠物的购买道具提示弹框*/
namespace modules.xianfu {

    import XianfuPetBuyPropAlertUI = ui.XianfuPetBuyPropAlertUI;
    import XianfuTravelCfg = modules.config.XianfuTravelCfg;
    import xianfu_travel = Configuration.xianfu_travel;
    import xianfu_travelFields = Configuration.xianfu_travelFields;
    import Event = Laya.Event;

    export class XianfuPetBuyPropAlert extends XianfuPetBuyPropAlertUI {

        private _travelId: number;

        protected initialize(): void {
            super.initialize();

            this.onceBox.visible = false;
            this.contentTxt.visible = true;

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.wordWrap = true;
            this.contentTxt.style.leading = 5;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let disType: number = XianfuModel.instance.selectSite;
            let disStr: string = disType == 0 ? `方圆百里` : disType == 1 ? `千里之遥` : disType == 2 ? `四海八荒` : `九州三界`;
            let buyPropType: number = XianfuModel.instance.selectBuyProp;
            let id: number = this._travelId = XianfuTravelCfg.instance.ids[disType];
            let travelCfg: xianfu_travel = XianfuTravelCfg.instance.getCfgById(id);
            let propId: number;
            let needPropId: number;
            let needPropNum: number;
            let buyHintWord: string[] = travelCfg[xianfu_travelFields.hintWords];
            if (buyPropType == 0) { //罗盘
                propId = travelCfg[xianfu_travelFields.extraItems][0];
                needPropId = travelCfg[xianfu_travelFields.extraItems][1];
                needPropNum = travelCfg[xianfu_travelFields.extraItems][2];
                this.contentTxt.innerHTML = `游历终点:<span style='color:#168a17'>${disStr}</span>,${buyHintWord[0]}<br/><br/>
                 是否花费: <img src='${CommonUtil.getIconById(needPropId)}' width="40" height="40"/>${needPropNum} 进行购买?`;
            } else { //护身符
                propId = travelCfg[xianfu_travelFields.amuletId][0];
                needPropId = travelCfg[xianfu_travelFields.amuletId][1];
                needPropNum = travelCfg[xianfu_travelFields.amuletId][2];
                this.contentTxt.innerHTML = `游历终点:<span style='color:#168a17'>${disStr}</span>,${buyHintWord[1]}<br/><br/>
                是否花费: <img src='${CommonUtil.getIconById(needPropId)}' width="40" height="40"/>${needPropNum} 进行购买?`;
            }
        }

        private okBtnHandler(): void {
            XianfuCtrl.instance.buyTravelItem([this._travelId, XianfuModel.instance.selectBuyProp]);
        }
    }
}
