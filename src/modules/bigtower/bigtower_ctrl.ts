///<reference path="./bigtower_model.ts"/>
//古塔控制器

namespace modules.bigTower {

    import BaseCtrl = modules.core.BaseCtrl;

    import Channel = net.Channel;

    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import BigTowerModel = modules.bigTower.BigTowerModel;
    import LevelCopyData = Protocols.LevelCopyData;


    export class BigTowerCtrl extends BaseCtrl {
        private static _instance: BigTowerCtrl;
        public static get instance(): BigTowerCtrl {
            return this._instance = this._instance || new BigTowerCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCopyDahuangReply, this, this.getCopyDahuangReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDahuangCopy, this, this.upDateDahuangCopy);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_FIGHT, BigTowerModel.instance, BigTowerModel.instance.checkRP);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getDahuang();
        }

        private getDahuang(): void {
            Channel.instance.publish(UserFeatureOpcode.GetDahuangCopy, null);
        }

        //获取大荒

        public getCopyDahuangReply(tuple: Protocols.GetCopyDahuangReply): void {
            BigTowerModel.instance.getCopyDahuangReply(tuple[Protocols.GetCopyDahuangReplyFields.copyData]);
        }


        //更新大荒层数和奖励
        public upDateDahuangCopy(tuple: Protocols.UpdateDahuangCopy): void {
            BigTowerModel.instance.getCopyDahuangReply(tuple[Protocols.UpdateDahuangCopyFields.copyData]);
        }
    }

}