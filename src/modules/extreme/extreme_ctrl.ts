/////<reference path="../$.ts"/>
/** 至尊装备 */
namespace modules.extreme {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetZhizhunInfoReply = Protocols.GetZhizhunInfoReply;
    import UpdateZhizhunInfo = Protocols.UpdateZhizhunInfo;
    import FeedZhizhunReply = Protocols.FeedZhizhunReply;
    import GetHolyRechargeInfoReply = Protocols.GetHolyRechargeInfoReply;
    import AddZhizhunSkillLevelReply = Protocols.AddZhizhunSkillLevelReply;

    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;


    import GetZhizhunInfoFields = Protocols.GetZhizhunInfoFields;
    export class ExtremeCtrl extends BaseCtrl {
        private static _instance: ExtremeCtrl;
        public static get instance(): ExtremeCtrl {
            return this._instance = this._instance || new ExtremeCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetZhizhunInfoReply, this, this.GetZhizhunInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateZhizhunInfo, this, this.UpdateZhizhunInfo);
            Channel.instance.subscribe(SystemClientOpcode.FeedZhizhunReply, this, this.FeedZhizhunReply);
            Channel.instance.subscribe(SystemClientOpcode.GetHolyRechargeInfoReply, this, this.GetHolyRechargeInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.AddZhizhunSkillLevelReply, this, this.AddZhizhunSkillLevelReply);

            this.requsetAllData();
            // GetZhizhunInfoReply = 0x1002368,						    /*获取至尊信息返回*/√√
            // UpdateZhizhunInfo = 0x1002365,							/*更新至尊信息*/    √√

            // FeedZhizhunReply = 0x1002366,							/*至尊培养返回*/
            // AddZhizhunSkillLevelReply = 0x1002367,					/*至尊激活/升级技能返回*/
            // GetHolyRechargeInfoReply = 0x1002369,					/*圣装礼包信息返回*/




            // GetZhizhunInfo = 0x2021b6,								/*获取至尊*/        √
            // FeedZhizhun = 0x2021b7,									/*喂养至尊*/
            // AddZhizhunSkillLevel = 0x2021b8,						    /*激活/升级技能*/

            // GetHolyRechargeInfo = 0x2021b9,							/*圣装礼包信息*/

        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.GetZhizhunInfo();
            this.GetHolyRechargeInfo();   
        }

        public AddZhizhunSkillLevel(type, skill): void {
            Channel.instance.publish(UserFeatureOpcode.AddZhizhunSkillLevel, [type, skill]);
        }
        private AddZhizhunSkillLevelReply(tuple: AddZhizhunSkillLevelReply) {
            if (tuple[0] == 0) SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");

            extremeModel.instance.setRP()
        }

        public GetZhizhunInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetZhizhunInfo, null);
        }
        private GetZhizhunInfoReply(tuple: GetZhizhunInfoReply) {
            extremeModel.instance.setData(tuple)
        }

        private UpdateZhizhunInfo(tuple: UpdateZhizhunInfo) {
            extremeModel.instance.setData(tuple)
        }
        public FeedZhizhun(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.FeedZhizhun, [id]);
        }
        private FeedZhizhunReply(tuple: FeedZhizhunReply) {
            if (tuple[0] == 0) SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
            extremeModel.instance.setRP()

        }
        private GetHolyRechargeInfoReply(tuple: GetHolyRechargeInfoReply) {
            extremeModel.instance.setBuyData(tuple)

        }
        public GetHolyRechargeInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetHolyRechargeInfo, null);
        }
    }
}