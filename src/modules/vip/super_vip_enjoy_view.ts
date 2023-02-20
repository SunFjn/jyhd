/** 超级vip专属 */

namespace modules.vip {
    import SuperVipEnjoyViewUI = ui.SuperVipEnjoyViewUI;
    import ItemsFields = Configuration.ItemsFields;
    import BaseItem = modules.bag.BaseItem;
    import BlendCfg = modules.config.BlendCfg;
    import Item = Protocols.Item;
    import blendFields = Configuration.blendFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetCumulateSuperVipTaskFields = Protocols.GetCumulateSuperVipTaskFields;
    import GetCumulateSuperVipTask = Protocols.GetCumulateSuperVipTask;
    import GetCumulateSuperVipReplyFields = Protocols.GetCumulateSuperVipReplyFields;
    import GetCumulateSuperVipReply = Protocols.GetCumulateSuperVipReply;

    export class SuperVipEnjoyView extends SuperVipEnjoyViewUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.handleGetBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SUPERVIP_STATUS_INFO_CHANGE, this, this.updateShow);
            // this.addAutoRegisteRedPoint(this.rpImg, ["theSuperVipRP"]);
        }

        onOpened(): void {
            super.onOpened();

            this.updateShow();
        }

        public close(): void {
            super.close();

        }

        public handleGetBtn(): void {
            RedPointCtrl.instance.setRPProperty("theSuperVipRP", false);
            this.rpImg.visible = false;
            WindowManager.instance.open(WindowEnum.SUPER_VIP_CONTACT_ALERT);
        }

        //奖励数据展示
        private updateShow() {
            let superVipStatus: GetCumulateSuperVipReply = VipModel.instance.getSuperVipStatus();
            this.sureBtn.disabled = superVipStatus[GetCumulateSuperVipReplyFields.getState] == 0;

            this.rpImg.visible = RedPointCtrl.instance.getRPStatusByOnlyShowOnce("theSuperVipRP");
            //奖励展示
            let _items: Array<BaseItem> = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];
            let params: number[] = BlendCfg.instance.getCfgById(66001)[blendFields.intParam];
            let itemDatas: Item[] = [];
            for (let i: int = 0, len: int = params.length; i < len; i += 2) {
                itemDatas.push([params[i], params[i + 1], 0, null]);
            }
            for (let i: int = 0, len: int = _items.length; i < len; i++) {
                _items[i].dataSource = itemDatas[i];
            }

            //客服名字展示
            this.qqTxt.text = `客服：小酒窝`

            //进度展示
            let t1: GetCumulateSuperVipTask = superVipStatus[GetCumulateSuperVipReplyFields.dayTotalMoney];
            let t2: GetCumulateSuperVipTask = superVipStatus[GetCumulateSuperVipReplyFields.totalMoney];

            this.process1Txt.text = `(${t1[GetCumulateSuperVipTaskFields.build]}/${t1[GetCumulateSuperVipTaskFields.quota]})`
            this.process2Txt.text = `(${t2[GetCumulateSuperVipTaskFields.build]}/${t2[GetCumulateSuperVipTaskFields.quota]})`
        }
    }
}