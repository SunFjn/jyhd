/////<reference path="../$.ts"/>
/** 仙府-家园上部面板 */
namespace modules.xianfu {
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import Event = Laya.Event;
    export class XianfuTopPanel extends ui.XianfuTopViewUI {


        protected initialize(): void {
            super.initialize();

            this.left = 0;
            // this.centerX = 0
            this.top = 150;
            this.closeByOthers = false;
        }

        protected addListeners(): void {
            super.addListeners();
            // this.addAutoListener(this, Event.CLICK, this, this.clickHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_XIANFU_AREA, this, this.updata);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updata);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_PET_UPDATE, this, this.updata);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updata);

        }

        public close(): void {
            super.close();
        }

        public destroy(): void {
            super.destroy();
        }

        private updata(): void {

            // 药草
            // let cy_info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(0);
            this.caoYaoNumTxt.text = XianfuModel.instance.treasureInfos(0).toString();

            // 粮食
            // let xm_info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(1);
            this.xiaoMaiNumTxt.text = XianfuModel.instance.treasureInfos(1).toString();

            // let panelType: number = XianfuModel.instance.panelType;
            // if (panelType == 0) { // 农场 0聚灵厅 ----0药草园 1粮食园
            // } else if (panelType == 1) { // index 炼金室 1炼制崖 ----2炼丹炉 3炼器炉 4炼魂炉
            // } else if (panelType == 2) { //游历 2灵兽阁
            // } else {
            //     return;
            // }
        }

        private clickHandler(): void {
            PlayerModel.instance.selectTarget(SelectTargetType.Npc, 0);
        }

    }
}