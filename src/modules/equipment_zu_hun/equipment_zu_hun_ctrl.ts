namespace modules.equipment_zu_hun {
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import GetZhuhunInfoReply = Protocols.GetZhuhunInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import ZhuhunOperReply = Protocols.ZhuhunOperReply;
    import ZhuhunOperOneKeyReply = Protocols.ZhuhunOperOneKeyReply;
    import ShihunOperReply = Protocols.ShihunOperReply;
    import ShihunOperOneKeyReply = Protocols.ShihunOperOneKeyReply;

    export class EquipmentZuHunCtrl extends BaseCtrl {

        private static _instance: EquipmentZuHunCtrl;
        public static get instance(): EquipmentZuHunCtrl {
            return this._instance = this._instance || new EquipmentZuHunCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {


            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetZhuhunInfoReply, this, this.infoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateZhuhunInfo, this, this.infoReply1);

            Channel.instance.subscribe(SystemClientOpcode.ZhuhunOperReply, this, this.upGradeReply);
            Channel.instance.subscribe(SystemClientOpcode.ZhuhunOperOneKeyReply, this, this.oneKeyUpGradeReply);

            Channel.instance.subscribe(SystemClientOpcode.ShihunOperReply, this, this.shihunOperReply);
            Channel.instance.subscribe(SystemClientOpcode.ShihunOperOneKeyReply, this, this.shihunOperOneKeyReply);

            GlobalData.dispatcher.on(CommonEventType.EQUIPMENT_ZUHUN_UPDATE, this, this.setRp);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.setRp);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIPS, this, this.setRp);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.setRp);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.setRp);

            this.requsetAllData();
        }

        public requsetAllData() {
            this.getZhuhunInfo();
        }

        private setRp() {
            EquipmentZuHunModel.instance.setRp();
        }

        public getZhuhunInfo() {
            // console.log("铸魂 噬魂 获取数据");
            Channel.instance.publish(UserFeatureOpcode.GetZhuhunInfo, null);
        }

        //铸魂
        public ZhuhunOper(part: number, id: number): void {
            // console.log("铸魂 请求");
            Channel.instance.publish(UserFeatureOpcode.ZhuhunOper, [part, id]);
        }

        //一键铸魂
        public ZhuhunOperOneKey(id: number): void {
            // console.log("一键铸魂 请求");
            Channel.instance.publish(UserFeatureOpcode.ZhuhunOperOneKey, [id]);
        }

        //噬魂
        public ShihunOper(sClass: number): void {
            // console.log("噬魂 请求");
            Channel.instance.publish(UserFeatureOpcode.ShihunOper, [sClass]);
        }

        //一键噬魂
        public ShihunOperOneKey(sClass: number): void {
            // console.log("一键噬魂 请求");
            Channel.instance.publish(UserFeatureOpcode.ShihunOperOneKey, [sClass]);
        }

        //更新
        private infoReply(tuple: GetZhuhunInfoReply): void {
            // console.log("铸魂 噬魂 获取数据 返回  ", tuple);
            EquipmentZuHunModel.instance.getValue(tuple);
        }

        private infoReply1(tuple: GetZhuhunInfoReply): void {
            // console.log("铸魂 噬魂 获取数据 更新  ", tuple);
            EquipmentZuHunModel.instance.updateValue(tuple);
        }

        private upGradeReply(tuple: ZhuhunOperReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("铸魂成功");

            } else
                CommonUtil.noticeError(tuple[0]);
        }

        private oneKeyUpGradeReply(tuple: ZhuhunOperOneKeyReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("铸魂成功");
                GlobalData.dispatcher.event(CommonEventType.EQUIPMENT_ZUHUN_UP, [tuple[Protocols.ZhuhunOperOneKeyReplyFields.parts]]);

            } else
                CommonUtil.noticeError(tuple[0]);
        }

        private shihunOperReply(tuple: ShihunOperReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("噬魂成功");
                // GlobalData.dispatcher.event(CommonEventType.INTENSIVE_SUCCESS, 0);
            } else
                CommonUtil.noticeError(tuple[0]);
        }

        private shihunOperOneKeyReply(tuple: ShihunOperOneKeyReply): void {
            if (tuple[0] == 0) {
                SystemNoticeManager.instance.addNotice("噬魂成功");
            } else
                CommonUtil.noticeError(tuple[0]);
        }
    }
}
