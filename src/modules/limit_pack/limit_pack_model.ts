namespace modules.limit_pack {
    import ThreeNumber = Protocols.ThreeNumber;
    import GetLimitPackInfoReply = Protocols.GetLimitPackInfoReply;

    export class LimitPackModel {

        private static _instance: LimitPackModel
        public static get instance(): LimitPackModel {
            return this._instance = this._instance || new LimitPackModel();
        }

        private _limitPackInfo: Array<ThreeNumber>;
        public get limitPackInfo(): Array<ThreeNumber> {
            return this._limitPackInfo;
        }

        private _updateTime: number;
        public get updateTime(): number {
            return this._updateTime;
        }

        public isBuyReply: boolean;      //是否购买后的返回，玩家点击购买后设为true，购买信息返回后设为false。礼包更新信息用这个来判断此次更新是否是因为购买后返回的

        //更新礼包信息
        public getLimitPackInfoReply(value: GetLimitPackInfoReply): void {
            this._limitPackInfo = value[0];
            this._updateTime = GlobalData.serverTime;
            GlobalData.dispatcher.event(CommonEventType.LIMIT_PACK_UPDATE, this.isBuyReply/*是否购买后的更新*/);
            this.isBuyReply = false;
        }

    }
}