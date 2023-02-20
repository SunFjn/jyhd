/** 成就控制器 */


namespace modules.magicPosition {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CommonUtil = modules.common.CommonUtil;

    export class MagicPositionCtrl extends BaseCtrl {

        private static _instance = new MagicPositionCtrl();

        public static get Instance(): MagicPositionCtrl {
            return this._instance;
        }

        private constructor() {
            super();
        }

        public setup(): void {
            // 成就信息获取
            Channel.instance.subscribe(SystemClientOpcode.GetXianweiInfoReply, this, this.getXianweiInfoReply);
            // 成就信息更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateXianweiAll, this, this.updateXianweiAll);
            // 成就任务更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateXianweiTask, this, this.updateXianweiTask);
            // 领取任务奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetXianweiTaskAwardReply, this, this.getXianweiTaskAwardReply);
            // 领取日奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetXianweiDayAwardReply, this, this.getXianweiDayAwardReply);

           

            this.requsetAllData();
        }

        public requsetAllData(): void {
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.xianwei, UserFeatureOpcode.GetXianweiInfo);
            this.getXianweiInfo();
        }
        
        // 获取成就信息
        public getXianweiInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianweiInfo, null);
            // console.log(`请求成就信息-----`);
        }

        // 返回成就信息
        private getXianweiInfoReply(tuple: Protocols.GetXianweiInfoReply): void {
            // console.log(`请求成就信息返回-----`);
            MagicPositionModel.Instance.dataInit(tuple);
        }

        // 更新成就信息
        private updateXianweiAll(tuple: Protocols.UpdateXianweiAll): void {
            MagicPositionModel.Instance.updateData(tuple);
        }

        //成就任务更新
        private updateXianweiTask(tuple: Protocols.UpdateXianweiTask): void {
            MagicPositionModel.Instance.updataXianweiTask(tuple[Protocols.UpdateXianweiTaskFields.task]);
        }

        //领取任务奖励返回
        private getXianweiTaskAwardReply(tuple: Protocols.GetXianweiTaskAwardReply): void {
            let result = tuple[Protocols.AddSkillLevelReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                GlobalData.dispatcher.event(CommonEventType.MAGIC_POSITION_GET_AWARD);
            }
        }

        //领取每日俸禄返回
        private getXianweiDayAwardReply(tuple: Protocols.GetXianweiDayAwardReply): void {
            let result = tuple[Protocols.AddSkillLevelOfAllReplyFields.result];
            if (result != 0)
                CommonUtil.noticeError(result);
        }

        /**
         * 请求领取任务奖励
         */
        public getTaskAward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianweiTaskAward, [id]);
        }

        /**
         * 请求领取每日俸禄
         */
        public getDailyAward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianweiDayAward, [id]);
        }
    }
}