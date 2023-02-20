/** 全民狂嗨 控制器*/


namespace modules.mission_party {
    import GetKuanghai2InfoReply = Protocols.GetKuanghai2InfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateKuanghai2Task = Protocols.UpdateKuanghai2Task;
    import GetKuanghai2TaskAwardReply = Protocols.GetKuanghai2TaskAwardReply;
    import GetKuanghai2AwardReply = Protocols.GetKuanghai2AwardReply;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class MissionPartyCtrl extends BaseCtrl {
        //单例
        private static _instance: MissionPartyCtrl;
        public static get instance(): MissionPartyCtrl {
            return this._instance = this._instance || new MissionPartyCtrl();
        }
        //构造函数
        private constructor() {
            super();
        }

        public setup(): void {

            // GetKuanghai2Info = 0x2021a8,                        /*狂嗨2 daw 获取信息*/
            // GetKuanghai2TaskAward = 0x2021a9,                        /*狂嗨2 daw 领取任务奖励*/
            // GetKuanghai2Award = 0x2021aa,                        /*狂嗨2 daw 领取奖励*/
            // GetKuanghai2InfoReply = 0x1002339,                        /*狂嗨2 daw 获取狂嗨2信息返回*/
            // UpdateKuanghai2Task = 0x100233a,                        /*狂嗨2 daw 更新单个任务*/
            // GetKuanghai2TaskAwardReply = 0x100233b,                /*狂嗨2 daw 领取任务奖励返回*/
            // GetKuanghai2AwardReply = 0x100233c,                        /*狂嗨2 daw 领取奖励*/

            // GetKuanghai2InfoReply = 0x1002339,                        /*狂嗨2 daw 获取狂嗨2信息 返回*/
            // UpdateKuanghai2Task = 0x100233a,                        /*狂嗨2 daw 更新单个任务 返回*/
            // GetKuanghai2TaskAwardReply = 0x100233b,                /*狂嗨2 daw 领取任务奖励 返回*/
            // GetKuanghai2AwardReply = 0x100233c,                        /*狂嗨2 daw 领取奖励 返回*/



            // GetKuanghai2Info = 0x2021a8,                        /*狂嗨2 daw 获取信息*/
            // GetKuanghai2TaskAward = 0x2021a9,                        /*狂嗨2 daw 领取任务奖励*/
            // GetKuanghai2Award = 0x2021aa,                        /*狂嗨2 daw 领取奖励*/

            // JumpKuanghai2TaskReply = 0x100233d,                        /*狂嗨2 daw 直接完成任务 返回*/
            // JumpKuanghai2Task = 0x2021ab,                        /*狂嗨2 daw 直接完成任务*/


            // GetKuanghai2FinalRewardReply = 0x100233e,        /*狂嗨2 daw 最终奖励 返回*/
            // GetKuanghai2FinalReward = 0x2021ac,                /*狂嗨2 daw 获取最终奖励*/
            /*领取奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghai2FinalRewardReply, this, this.geTinalReward);
            /*领取奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.JumpKuanghai2TaskReply, this, this.getJumpKuanghai2TaskReply);
            /*返回历练数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghai2InfoReply, this, this.getKuanghaiInfoReply);
            /*更新单个任务*/
            Channel.instance.subscribe(SystemClientOpcode.UpdateKuanghai2Task, this, this.updateKuanghaiTask);
            /*领取任务奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghai2TaskAwardReply, this, this.getKuanghaiTaskAwardReply);
            /*领取奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghai2AwardReply, this, this.getKuanghaiAwardReply);
           
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getKuanghaiInfo();
        }

        /*返回历练数据*/
        private getKuanghaiInfoReply(tuple: GetKuanghai2InfoReply) {
            MissionPartyModel.instance.getdateInfo(tuple);
            MissionPartyModel.instance.setPayRewardRP();
        }
        /*更新单个任务*/
        private updateKuanghaiTask(tuple: UpdateKuanghai2Task) {
            MissionPartyModel.instance.singleTaskUpdate(tuple);
            MissionPartyModel.instance.setPayRewardRP();
        }
        /*领取任务奖励返回*/
        private getKuanghaiTaskAwardReply(tuple: GetKuanghai2TaskAwardReply) {
            //MissionPartyModel.instance.getdateInfo(tuple);
        }
        /*领取奖励返回*/
        private getKuanghaiAwardReply(tuple: GetKuanghai2AwardReply) {
            //MissionPartyModel.instance.getdateInfo(tuple);
        }

        //获得狂嗨信息
        public getKuanghaiInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghai2Info, null);
        }
        //领取任务奖励
        public getKuanghaiTaskAward(taskId: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghai2TaskAward, [taskId]);
        }
        //领取奖励
        public getKuanghaiAward(grade: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghai2Award, [grade]);
        }
        //领取奖励
        public JumpKuanghaiTask(grade: number): void {
            console.log("JumpKuanghai2Task 直接完成", grade)
            Channel.instance.publish(UserFeatureOpcode.JumpKuanghai2Task, [grade]);
        }
        /*领取奖励返回*/
        private getJumpKuanghai2TaskReply(tuple: GetKuanghai2AwardReply) {
            //MissionPartyModel.instance.getdateInfo(tuple);
            console.log("getJumpKuanghai2TaskReply 直接完成", tuple, tuple[0])
            CommonUtil.noticeError(tuple[0]);
        }

        // GetKuanghai2FinalRewardReply = 0x100233e,        /*狂嗨2 daw 最终奖励 返回*/
        // GetKuanghai2FinalReward = 0x2021ac,                /*狂嗨2 daw 获取最终奖励*/

        //最终奖励
        public sendTinalReward(): void {
            console.log("sendTinalReward 最终奖励")
            Channel.instance.publish(UserFeatureOpcode.GetKuanghai2FinalReward, []);
        }
        /*最终奖励返回*/
        private geTinalReward(tuple: GetKuanghai2AwardReply) {
            console.log("geTinalReward 最终奖励", tuple, tuple[0])
            if (tuple[0] == 0) {
                this.getKuanghaiInfo();
            } else {
                CommonUtil.noticeError(tuple[0]);
            }

        }



    }
}