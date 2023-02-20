/////<reference path="../$.ts"/>
/** 现金装备-奇珍异宝 */
namespace modules.cashEquip {

    import SellCashEquipReply = Protocols.SellCashEquipReply;
    import SellCashEquipReplyFields = Protocols.SellCashEquipReplyFields;
    import CashEquipInfoReply = Protocols.CashEquipInfoReply;
    import CashEquipInfoReplyFields = Protocols.CashEquipInfoReplyFields;
    import MergeCashEquipReply = Protocols.MergeCashEquipReply;
    import MergeCashEquipReplyFields = Protocols.MergeCashEquipReplyFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class CashEquipCtrl extends BaseCtrl {
        private static _instance: CashEquipCtrl;
        public static get instance(): CashEquipCtrl {
            return this._instance = this._instance || new CashEquipCtrl();
        }

        public setup(): void {
            // SellCashEquip = 0x2021ba,                 /*出售现金装备*/
            // SellCashEquipReply = 0x100236a,           /*出售现金装备返回*/.

            // CashEquipInfo = 0x2021bd,                   /*现金装备信息*/
            // CashEquipInfoReply = 0x100236d,             /*现金装备信息返回*/

            // MergeCashEquip = 0x2021cb,							/*合成现金装备*/
            // MergeCashEquipReply = 0x100237c,                     /*合成现金装备返回*/

            Channel.instance.subscribe(SystemClientOpcode.SellCashEquipReply, this, this.SellCashEquipReply);
            Channel.instance.subscribe(SystemClientOpcode.CashEquipInfoReply, this, this.CashEquipInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.MergeCashEquipReply, this, this.MergeCashEquipReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.CashEquipInfo();
        }

        public SellCashEquip(id, count): void {
            Channel.instance.publish(UserFeatureOpcode.SellCashEquip, [id, count]);
        }

        //合成装备
        public MergeCashEquip(): void {
            console.log('苏丹运行测试:MergeCashEquip',);
            Channel.instance.publish(UserFeatureOpcode.MergeCashEquip, null);
            Laya.timer.once(500, this, () => {
                this.MergeCashEquipReply([0])
            })

        }
        private MergeCashEquipReply(tuple: MergeCashEquipReply) {
            console.log('苏丹运行测试:MergeCashEquipReply', tuple);
            if (tuple[SellCashEquipReplyFields.result] == 0) {
                //WindowManager.instance.close(WindowEnum.CashEquip_ALERT);
                //WindowManager.instance.close(WindowEnum.CashEquip_PANEL);
                this.CashEquipInfo();
                Laya.timer.once(500, this, () => {
                    modules.notice.SystemNoticeManager.instance.addNotice("恭喜您,合成成功!", false);
                    SuccessEffectCtrl.instance.play("assets/others/tx_hechengchenggong1.png");
                   
                })
                Laya.timer.once(1200, this, () => {
                    WindowManager.instance.open(WindowEnum.CashEquip_Share_Alert, [15260007, 1, 0, null]);
                })



                GlobalData.dispatcher.event(CommonEventType.CashEquip_showComposeEffect);
            } else {
                CommonUtil.codeDispose(tuple[SellCashEquipReplyFields.result], "");
            }

        }
        private SellCashEquipReply(tuple: SellCashEquipReply) {

          
            if (tuple[SellCashEquipReplyFields.result] == 0) {
                CashEquipModel.instance.sellPageChange(1, null)
                this.CashEquipInfo();
                CashEquipModel.instance.openTips(tuple[SellCashEquipReplyFields.iteamId], tuple[SellCashEquipReplyFields.count]);
            }
            else {
                CommonUtil.codeDispose(tuple[SellCashEquipReplyFields.result], "");
            }
        }

        public CashEquipInfo(): void {

            Channel.instance.publish(UserFeatureOpcode.CashEquipInfo, []);
        }

        private CashEquipInfoReply(tuple: CashEquipInfoReply) {

            CashEquipModel.instance.saveSurplusCount(tuple[0]);
        }


    }
}