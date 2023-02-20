namespace modules.compose {
    import BaseCtrl = modules.core.BaseCtrl;
    import ComposeReplyFields = Protocols.ComposeReplyFields;

    export class ComposeCtrl extends BaseCtrl {
        private static _instance: ComposeCtrl;
        public static get instance(): ComposeCtrl {
            return this._instance = this._instance || new ComposeCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.ComposeReply, this, this.GetComposeReply);
            Channel.instance.subscribe(SystemClientOpcode.ResolveReply, this, this.GetResolveReply);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, ComposeModel.instance.setDotDic);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, ComposeModel.instance.setDotDic);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            ComposeModel.instance.setDotDic();
        }

        private GetComposeReply(tuple: Protocols.ComposeReply): void {
            ComposeModel.instance.ComposeReply = tuple[ComposeReplyFields.result];
            console.log("---------------合成返回" + tuple,tuple[ComposeReplyFields.result]);
        }

        private GetResolveReply(tuple: Protocols.ResolveReply): void {
            ComposeModel.instance.ResolveReply = tuple[ComposeReplyFields.result];
            console.log("---------------分解返回" + tuple);
        }
    }
}