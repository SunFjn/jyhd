///<reference path="../config/xianfu_build_cfg.ts"/>
/** 丹炉属性alert */
namespace modules.xianfu {
    import XianfuDanluAttrAlertUI = ui.XianfuDanluAttrAlertUI;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;

    export class XianfuDanluAttrAlert extends XianfuDanluAttrAlertUI {

        private _bar: ProgressBarCtrl;

        protected initialize(): void {
            super.initialize();

            this._bar = new ProgressBarCtrl(this.barImg, this.barImg.width, this.barTxt);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let build: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(2);
            if (!build) return;
            let lv: number = build[GetBuildingInfoReplyFields.level];
            this.lvMsz.value = lv.toString();
            let cfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(2, lv);
            let fight: number = cfg[xianfu_buildFields.fight];
            this.fightMsz.value = fight.toString();

            let needExp: number = cfg[xianfu_buildFields.exp];
            let currExp: number = build[GetBuildingInfoReplyFields.exp];
            this._bar.maxValue = needExp ? needExp : currExp;
            this._bar.value = currExp;

            let nextCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(2, lv + 1);
            let attrNameTxts: Text[] = [this.attrNameTxt_0, this.attrNameTxt_1];
            let attrTxts: Text[] = [this.attTxt_0, this.attTxt_1];
            let imgs: Image[] = [this.arrImg_0, this.arrImg_1];
            let proTxts: Text[] = [this.proTxt_0, this.proTxt_1];
            common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                attrNameTxts,
                attrTxts,
                imgs,
                proTxts,
                xianfu_buildFields.attr
            );
        }

        public destroy(): void {
            this._bar = this.destroyElement(this._bar);
            super.destroy();
        }
    }
}