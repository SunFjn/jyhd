namespace modules.stone {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import RefineGemReply = Protocols.RefineGemReply;
    import InlayGemReply = Protocols.InlayGemReply;
    import RiseGemReply = Protocols.RiseGemReply;
    import InlayGemReplyFields = Protocols.InlayGemReplyFields;
    import RefineGemReplyFields = Protocols.RefineGemReplyFields;
    import RiseGemReplyFields = Protocols.RiseGemReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GemOneKeyOperation = Protocols.GemOneKeyOperation;
    import OneKeyRefineGemReply = Protocols.OneKeyRefineGemReply;
    import OneKeyRefineGemReplyFields = Protocols.OneKeyRefineGemReplyFields;
    import CommonUtil = modules.common.CommonUtil;

    export class StoneCtrl extends BaseCtrl {

        private static _instance: StoneCtrl;

        public static get instance(): StoneCtrl {
            return this._instance = this._instance || new StoneCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            //获取返回
            Channel.instance.subscribe(SystemClientOpcode.GetGemInfoReply, this, this.infoReply);
            //更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateGemInfo, this, this.infoReply);
            //镶嵌返回
            Channel.instance.subscribe(SystemClientOpcode.InlayGemReply, this, this.inlayGem);
            //升级返回
            Channel.instance.subscribe(SystemClientOpcode.RefineGemReply, this, this.refineGem);
            //升级仙石大师返回
            Channel.instance.subscribe(SystemClientOpcode.RiseGemReply, this, this.riseGem);
            //一键操作返回
            Channel.instance.subscribe(SystemClientOpcode.OneKeyRefineGemReply, this, this.oneKeyRefineGemReply);

            //更新装备事件
            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIPS, this, this.updateEquip);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateEquip);

            //更新背包数据
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);

            this.requsetAllData();            
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetGemInfo, null);
        }

        //获取仙石返回
        private infoReply(tuple: Protocols.UpdateGemInfo): void {
            StoneModel.instance.updataValue(tuple);
        }

        //镶嵌返回
        private inlayGem(tuple: InlayGemReply): void {
            if (tuple[InlayGemReplyFields.result]) {
                CommonUtil.noticeError(tuple[0]);
            } else {
                GlobalData.dispatcher.event(CommonEventType.UP_MASTER);
                GlobalData.dispatcher.event(CommonEventType.UP_EFFECT);
                SystemNoticeManager.instance.addNotice(StoneModel.instance.inlay == 0 ? "镶嵌成功" : "替换成功");
                StoneModel.instance.setDotDis();
            }
        }


        //升级返回
        private refineGem(tuple: RefineGemReply): void {
            if (tuple[RefineGemReplyFields.result]) {
                CommonUtil.noticeError(tuple[0]);
            } else {
                SystemNoticeManager.instance.addNotice("升级成功");
                GlobalData.dispatcher.event(CommonEventType.UP_MASTER);
                GlobalData.dispatcher.event(CommonEventType.UP_EFFECT);
                StoneModel.instance.setDotDis();
            }
        }

        //一键操作返回
        private oneKeyRefineGemReply(tuple: OneKeyRefineGemReply): void {
            if (tuple[OneKeyRefineGemReplyFields.result]) {
                CommonUtil.noticeError(tuple[0]);
            } else {
                if (tuple[OneKeyRefineGemReplyFields.type] == 0) {
                    SystemNoticeManager.instance.addNotice("镶嵌成功");

                } else if (tuple[OneKeyRefineGemReplyFields.type] == 1) {
                    SystemNoticeManager.instance.addNotice("替换成功");

                } else if (tuple[OneKeyRefineGemReplyFields.type] == 2) {
                    SystemNoticeManager.instance.addNotice("升级成功");
                }
                StoneModel.instance.setDotDis();
                StoneModel.instance.oneKeyPit = tuple[OneKeyRefineGemReplyFields.part];
                GlobalData.dispatcher.event(CommonEventType.UP_MASTER);
                GlobalData.dispatcher.event(CommonEventType.ONEKEY_UP_EFFECT);
            }
        }

        //升级仙石大师返回
        private riseGem(tuple: RiseGemReply): void {
            if (tuple[RiseGemReplyFields.result])
                CommonUtil.noticeError(tuple[0]);
            else {
                SystemNoticeManager.instance.addNotice("徽章大师升级成功");
                StoneModel.instance.setDotDis();
            }
        }

        //更新装备
        private updateEquip(): void {
            StoneModel.instance.setDotDis();
        }

        //更新背包
        private updateBag(): void {
            StoneModel.instance.setDotDis();
        }

        //一键操作
        public oneKeyHandler(tuple: GemOneKeyOperation) {
            Channel.instance.publish(UserFeatureOpcode.GemOneKeyOperation, tuple);
        }
    }
}