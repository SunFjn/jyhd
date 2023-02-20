/** 法术控制器 */


namespace modules.talisman {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateAmuletInfo = Protocols.UpdateAmuletInfo;
    import RefineAmuletReplay = Protocols.RefineAmuletReply;

    export class TalismanCtrl extends BaseCtrl {
        private static _instance: TalismanCtrl;
        public static get instance(): TalismanCtrl {
            return this._instance = this._instance || new TalismanCtrl();
        }

        constructor() {
            super();

        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetAmuletInfoReply, this, this.GetAmuletInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateAmuletInfo, this, this.UpdateAmuletInfo);
            Channel.instance.subscribe(SystemClientOpcode.RefineAmuletReply, this, this.RefineAmuletReply);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetAmuletInfo, null);
        }

        private GetAmuletInfoReply(tuple: Protocols.GetAmuletInfoReply): void {
            TalismanModel.instance.GetAmuletInfoReply = tuple;
            // console.log(".........................获取圣物返回"
            // +"圣物升级"+tuple[GetAmuletInfoReplyFields.refine]
            // +"圣物属性"+tuple[GetAmuletInfoReplyFields.rise]);
        }

        private UpdateAmuletInfo(tuple: UpdateAmuletInfo): void {
            TalismanModel.instance.UpdateAmuletInfoReply = tuple;
            // console.log(".........................更新圣物返回"
            //     +"圣物升级"+tuple[GetAmuletInfoReplyFields.refine]
            // +"圣物属性"+tuple[GetAmuletInfoReplyFields.rise]);
        }

        private RefineAmuletReply(tuple: RefineAmuletReplay): void {
            let code: number = tuple[Protocols.RefineAmuletReplyFields.result];
            TalismanModel.instance.RefineAmuletReplay = tuple;
            if (code == ErrorCode.ItemNotEnough) {
                WindowManager.instance.close(WindowEnum.TALISMAN_DIALOG);
            }
            // console.log(".........................圣物升级返回"+tuple);
        }

        private updateBag(): void {
            TalismanModel.instance.setDotDis();
        }

    }
}