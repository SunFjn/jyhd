/*
 * @Author: yuyongyuan 1784394982@qq.com
 * @Date: 2022-12-19 13:17:15
 * @LastEditors: yuyongyuan 1784394982@qq.com
 * @LastEditTime: 2023-01-06 10:02:51
 * @FilePath: \jyhd_hengban\src\modules\gloves\gloves_ctrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
///<reference path="../config/recharge_cfg.ts"/>


/** 装备*/


namespace modules.gloves{
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import InlayGauntletReply = Protocols.InlayGauntletReply;
    import DrawGauntletReply = Protocols.DrawGauntletReply;
    import DrawGauntletReplyFields = Protocols.DrawGauntletReplyFields;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import InlayGauntletReplyFields = Protocols.InlayGauntletReplyFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class GlovesCtrl extends BaseCtrl{
        private static _instance:GlovesCtrl;
        public static get instance():GlovesCtrl{
            return this._instance = this._instance || new GlovesCtrl();
        }

        constructor(){
            super();
        }

        setup(): void {
            // 获取装备信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetGauntletReply, this, this.getGauntletReply);
            // 镶嵌返回
            Channel.instance.subscribe(SystemClientOpcode.InlayGauntletReply, this, this.inlayGauntletReply);
            // 领取奖励返回
            Channel.instance.subscribe(SystemClientOpcode.DrawGauntletReply, this, this.drawGauntletReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
         */
        public requsetAllData(): void {
            this.getGauntletInfo();
        }

        // 获取装备信息
        public getGauntletInfo():void{
            // console.log("获取装备信息..........");
            Channel.instance.publish(UserFeatureOpcode.GetGauntlet, null);
        }
        // 获取装备信息返回（更新也是走这条协议）
        private getGauntletReply(value:GetGauntletReply):void{
            // console.log("获取装备信息返回................." + value);
            GlovesModel.instance.glovesInfo = value;
        }

        // 镶嵌   index:123456
        public inlayGauntlet(index:number):void{
            // console.log("镶嵌.................." + index);
            Channel.instance.publish(UserFeatureOpcode.InlayGauntlet, [index]);
        }
        // 镶嵌返回
        private inlayGauntletReply(value:InlayGauntletReply):void{
            // console.log("镶嵌返回................" + value);
            let code:number = value[InlayGauntletReplyFields.result];
            if(code === ErrorCode.Success){
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            }else{
                CommonUtil.noticeError(code);
            }
        }

        // 购买
        public buy(id:number):void{
            PlatParams.askPay(id, RechargeCfg.instance.getRecharCfgByIndex(id)[rechargeFields.price]);
        }

        // 领取奖励
        public drawGauntlet():void{
            // console.log("领取奖励............");
            Channel.instance.publish(UserFeatureOpcode.DrawGauntlet, null);
        }
        // 领取奖励返回
        private drawGauntletReply(value:DrawGauntletReply):void{
            // console.log("领取奖励返回................" + value);
            CommonUtil.noticeError(value[DrawGauntletReplyFields.result]);
        }

        // 红点
        private checkRP():void{
            GlovesModel.instance.checkRP();
        }
    }
}