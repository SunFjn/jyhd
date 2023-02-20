/** 锻造*/


namespace modules.xiLian {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetXilianReply = Protocols.GetXilianReply;
    import OpenXilianReply = Protocols.OpenXilianReply;
    import UpdateXilian = Protocols.UpdateXilian;
    import EquipXilianReply = Protocols.EquipXilianReply;
    import LockXilianReply = Protocols.LockXilianReply;
    import LockXilianReplyFields = Protocols.LockXilianReplyFields;
    import EquipXilianReplyFields = Protocols.EquipXilianReplyFields;
    import OpenXilianReplyFields = Protocols.OpenXilianReplyFields;
    import XilianRiseAddLevelReply = Protocols.XilianRiseAddLevelReply;
    import XilianRiseAddLevelReplyFields = Protocols.XilianRiseAddLevelReplyFields;
    import GetXilianReplyFields = Protocols.GetXilianReplyFields;
    import UpdateXilianFields = Protocols.UpdateXilianFields;

    export class XiLianCtrl extends BaseCtrl {
        private static _instance: XiLianCtrl;
        public static get instance(): XiLianCtrl {
            return this._instance = this._instance || new XiLianCtrl();
        }

        constructor() {
            super();
        }

        setup(): void {
            // 获取洗炼信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetXilianReply, this, this.getXilianReply);
            // 更新洗炼信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateXilian, this, this.updateXilian);
            // 开启洗炼返回
            Channel.instance.subscribe(SystemClientOpcode.OpenXilianReply, this, this.openXilianReply);
            // 洗炼返回
            Channel.instance.subscribe(SystemClientOpcode.EquipXilianReply, this, this.equipXilianReply);
            // 锁定洗炼槽返回
            Channel.instance.subscribe(SystemClientOpcode.LockXilianReply, this, this.lockXilianReply);
            // 升级洗炼大师返回
            Channel.instance.subscribe(SystemClientOpcode.XilianRiseAddLevelReply, this, this.xilianRiseAddLevelReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getXilian();
        }

        // 获取洗炼信息
        public getXilian(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXilian, null);
        }

        // 获取洗炼信息返回
        private getXilianReply(value: GetXilianReply): void {
            XiLianModel.instance.xiLianInfo = value[GetXilianReplyFields.xilianInfo];
        }

        // 更新洗炼信息
        private updateXilian(value: UpdateXilian): void {
            XiLianModel.instance.updateXiLian(value[UpdateXilianFields.xilianInfo]);
        }

        // 开启洗炼 part:部位,num编号 0-4
        public openXilian(part: int, num: int): void {
            Channel.instance.publish(UserFeatureOpcode.OpenXilian, [part, num]);
        }

        // 开启洗炼返回
        private openXilianReply(value: OpenXilianReply): void {
            CommonUtil.noticeError(value[OpenXilianReplyFields.result]);
        }

        // 洗炼   part:部位,useGold:是否使用代币券，type:0没有消耗，1消耗极品洗炼石，2消耗完美洗炼石
        public equipXilian(part: int, useGold: boolean, type: number): void {
            Channel.instance.publish(UserFeatureOpcode.EquipXilian, [part, useGold, type]);
        }

        // 洗炼返回
        private equipXilianReply(value: EquipXilianReply): void {
            CommonUtil.noticeError(value[EquipXilianReplyFields.result]);
        }

        // 锁定洗炼编号槽  isLock:是否锁定，part:部位，num:编号0-4
        public lockXilian(isLock: boolean, part: int, num: int): void {
            Channel.instance.publish(UserFeatureOpcode.LockXilian, [isLock, part, num]);
        }

        // 锁定洗炼槽返回
        private lockXilianReply(value: LockXilianReply): void {
            CommonUtil.noticeError(value[LockXilianReplyFields.result]);
        }

        // 升级洗炼大师
        public xilianRiseAddLevel(): void {
            Channel.instance.publish(UserFeatureOpcode.XilianRiseAddLevel, null);
        }

        // 升级洗炼大师返回
        private xilianRiseAddLevelReply(value: XilianRiseAddLevelReply): void {
            CommonUtil.noticeError(value[XilianRiseAddLevelReplyFields.result]);
        }
    }
}