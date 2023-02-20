namespace modules.shenqi {
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetShenQiInfoReply = Protocols.GetShenQiInfoReply;
    import GetShenQiInfoReplyFields = Protocols.GetShenQiInfoReplyFields;
    import Pair = Protocols.Pair;
    import EquipFragmentReply = Protocols.EquipFragmentReply;
    import EquipFragmentReplyFields = Protocols.EquipFragmentReplyFields;
    import EquipFragment = Protocols.EquipFragment;
    import ActivateShenQiReply = Protocols.ActivateShenQiReply;
    import UpdateFragmentList = Protocols.UpdateFragmentList;
    import ActivateShenQiReplyFields = Protocols.ActivateShenQiReplyFields;
    import ShenqiCfg = modules.config.ShenqiCfg;
    import shenqi = Configuration.shenqi;
    import shenqiFields = Configuration.shenqiFields;

    export class ShenqiCtrl extends BaseCtrl {
        private static _instance: ShenqiCtrl;

        public static get instance(): ShenqiCtrl {
            return this._instance = this._instance || new ShenqiCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.EquipFragmentReply, this, this.getFragmentReply);         //神器碎片返回
            Channel.instance.subscribe(SystemClientOpcode.GetShenQiInfoReply, this, this.ShenqiReply);              //神器信息返回
            Channel.instance.subscribe(SystemClientOpcode.ActivateShenQiReply, this, this.activateShenQiReply);     //神器激活信息返回
            Channel.instance.subscribe(SystemClientOpcode.UpdateFragmentList, this, this.updateFragmentList);     //更新协议返回

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetShenQiInfo, null);
        }

        //神器信息返回
        public ShenqiReply(tuple: GetShenQiInfoReply): void {
            // let fragments: Array<Pair> = tuple[GetShenQiInfoReplyFields.fragmentList];
            ShenqiModel.instance.getShenQiInfoReply(tuple);
        }

        //放入碎片返回
        public getFragmentReply(tuple: EquipFragmentReply): void {
            CommonUtil.noticeError(tuple[EquipFragmentReplyFields.result]);        //错误码返回
        }

        //神器激活信息返回
        public activateShenQiReply(tuple: ActivateShenQiReply): void {
            if (tuple[ActivateShenQiReplyFields.result] == 0) {
                let cfg: shenqi = ShenqiCfg.instance.getCfgById(ShenqiModel.instance.shenqi.length - 1);
                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [cfg[shenqiFields.showID], 11]);     //神器激活弹窗
                // GlobalData.dispatcher.event(CommonEventType.SHENQI_JIHUO);     //   
            }
            else {
                CommonUtil.noticeError(tuple[ActivateShenQiReplyFields.result]);        //错误码返回
            }
        }

        //更新碎片返回
        public updateFragmentList(tuple: UpdateFragmentList) {
            ShenqiModel.instance.updateFragmentList(tuple);
        }

        //激活神器
        public activateShenQi(): void {
            Channel.instance.publish(UserFeatureOpcode.ActivateShenQi, null);
        }

        //放入碎片
        public equipFragment(id: EquipFragment): void {
            Channel.instance.publish(UserFeatureOpcode.EquipFragment, id);
        }

        //获取神器信息
        public getShenQiInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetShenQiInfo, null);
        }
    }
}