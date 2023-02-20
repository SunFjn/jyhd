/**单人BOSS控制*/


namespace modules.single_boss {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import  GetSingleBossCopyReply = Protocols.GetSingleBossCopyReply;
    import  GetSingleBossCopyReplyFields = Protocols.GetSingleBossCopyReplyFields;

    import  UpdateSingleBossCopy = Protocols.UpdateSingleBossCopy;
    import  UpdateSingleBossCopyFields = Protocols.UpdateSingleBossCopyFields;


    export class SingleBossCtrl extends BaseCtrl {

        private static _instance: SingleBossCtrl;

        public static get instance(): SingleBossCtrl {
            return this._instance = this._instance || new SingleBossCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetSingleBossCopyReply, this, this.GetSingleBoss);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSingleBossCopy, this, this.UpdateSingleBossCopy);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSingleBossCopy, null);
        }

        public GetSingleBoss(tuple: GetSingleBossCopyReply): void {
            // console.log("获取单人boss返回....................." + tuple);
            SingleBossModel.instance.SingleBossCopy = tuple[GetSingleBossCopyReplyFields.singleBossCopys];
        }

        public UpdateSingleBossCopy(tuple: UpdateSingleBossCopy): void {
            // console.log("更新单人boss返回....................." + tuple);
            SingleBossModel.instance.UpdateSingleBossCopy = tuple[UpdateSingleBossCopyFields.singleBossCopys];
        }
    }
}