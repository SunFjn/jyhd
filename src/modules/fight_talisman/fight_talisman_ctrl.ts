namespace modules.fight_talisman {
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateTalismanState = Protocols.UpdateTalismanState;
    import UpdateTalismanStateFields = Protocols.UpdateTalismanStateFields;
    import GetTalismanInfoReply = Protocols.GetTalismanInfoReply;
    import GetTalismanInfoReplyFields = Protocols.GetTalismanInfoReplyFields;
    import ActiveTalismanReply = Protocols.ActiveTalismanReply;
    import ActiveTalismanReplyFields = Protocols.ActiveTalismanReplyFields;
    export class FightTalismanCtrl extends BaseCtrl {
        private static _instance: FightTalismanCtrl;

        public static get instance(): FightTalismanCtrl {
            return this._instance = this._instance || new FightTalismanCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.UpdateTalismanState, this, this.updateTalismanState);     //护符状态更新
            Channel.instance.subscribe(SystemClientOpcode.GetTalismanInfoReply, this, this.getTalismanInfoReply);     //护符信息返回
            Channel.instance.subscribe(SystemClientOpcode.ActiveTalismanReply, this, this.activeTalismanReply);     //护符信息返回

            this.requsetAllData();
        }

        /**
        * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getTalismanState();
            this.getTalismanInfo();
        }

        //获取护符状态
        public getTalismanState(): void {
            Channel.instance.publish(UserFeatureOpcode.GetTalismanState, null);
        }

        //获取护符信息
        public getTalismanInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetTalismanInfo, null);// 初始打开页为1时传递1的信息
        }

        //激活护符
        public activeTalisman(selected: number): void {
            Channel.instance.publish(UserFeatureOpcode.ActiveTalisman, [selected + 1]);
        }

        //护符状态更新
        private updateTalismanState(value: UpdateTalismanState): void {
            FightTalismanModel.instance.updateTalismanState(value[UpdateTalismanStateFields.state]);
        }

        //护符信息返回
        private getTalismanInfoReply(value: GetTalismanInfoReply): void {
            FightTalismanModel.instance.getTalismanInfoReply(value);
        }

        //激活护符返回
        private activeTalismanReply(value: ActiveTalismanReply): void {
            //CommonUtil.noticeError(value[ActiveTalismanReplyFields.result]);        //错误码返回
        }
    }
}