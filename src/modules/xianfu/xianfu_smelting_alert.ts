///<reference path="../common/global_data.ts"/>
/** 合成中弹框 */
namespace modules.xianfu {
    import GlobalData = modules.common.GlobalData;
    import XianfuSmeltingAlertUI = ui.XianfuSmeltingAlertUI;
    import PairFields = Protocols.PairFields;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CommonUtil = modules.common.CommonUtil;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import item_materialFields = Configuration.item_materialFields;

    export class XianfuSmeltingAlert extends XianfuSmeltingAlertUI {

        private _cdTime: number;
        private _state: number;
        private _centerItem: BaseItem;

        protected initialize(): void {
            super.initialize();

            this._state = 0;
            this._cdTime = -1;

            this._centerItem = new BaseItem();
            this._centerItem.pos(280, 120);
            this.addChild(this._centerItem);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getBtn, Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updateView);

            Laya.timer.loop(1000, this, this.loopHandler);

        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            //2炼丹炉 3炼器炉 4炼魂炉
            let buildType: number = XianfuModel.instance.buildType;
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(buildType);
            let buildLv: number = info[GetBuildingInfoReplyFields.level];
            let leisureCDTime: number = info[GetBuildingInfoReplyFields.time];
            let state: number = this._state = info[GetBuildingInfoReplyFields.state];
            let currCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(XianfuModel.instance.buildType, buildLv);
            let products: Array<Array<number>> = currCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物

            if (state == 1) {
                this._cdTime = leisureCDTime;
                this.loopHandler();
                let recordList: Protocols.Pair = info[GetBuildingInfoReplyFields.indexList][0];
                let index: number = recordList[PairFields.first];
                this._centerItem.dataSource = [products[index][0], 0, 0, null];
                let maskCount: number = info[GetBuildingInfoReplyFields.makeCount];
                let sumTime: number = products[index][7];
                let yetCount: number = Math.ceil((leisureCDTime - GlobalData.serverTime) / sumTime);
                this.countTxt.text = `炼制次数: ${maskCount - yetCount}/${maskCount}`;
                let itemCfg = CommonUtil.getItemCfgById(products[index][0]);
                this.nameTxt.text = itemCfg[item_materialFields.name].toString()
            } else if (state == 2) { //完成
                WindowManager.instance.open(WindowEnum.XIANFU_SMELT_END_ALERT);
                this.close();
            }
        }

        private loopHandler(): void {
            if (this._cdTime - GlobalData.serverTime <= 0) {
                if (this._state == 0) {
                    WindowManager.instance.open(WindowEnum.XIANFU_SMELT_PANEL);
                    this.close();
                }
            } else {
                this.timeTxt.text = `剩余时间: ${CommonUtil.timeStampToMMSS(this._cdTime)}`;
            }
        }

        private getBtnHandler(): void {
            XianfuCtrl.instance.endSmelt();
            this.close();
        }
    }
}