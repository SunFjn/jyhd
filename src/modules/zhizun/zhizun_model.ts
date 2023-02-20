/////<reference path="../$.ts"/>
/** 至尊礼包数据 */
namespace modules.zhizun {
    import UpdateZhizunCardInfo = Protocols.UpdateZhizunCardInfo;
    import UpdateZhizunCardInfoFields = Protocols.UpdateZhizunCardInfoFields;

    export class ZhizunModel {
        private static _instance: ZhizunModel;
        public static get instance(): ZhizunModel {
            return this._instance = this._instance || new ZhizunModel();
        }


        /** 至尊白虎娘开启状态 */
        public zhizhun_opened: boolean = false;

        public state: number;
        public count: number;
        public restDay: number;

        //更新
        public updateZhizunCardInfo(tuple: UpdateZhizunCardInfo, update: boolean = false) {
            // console.log("至尊",tuple)
            this.state = tuple[UpdateZhizunCardInfoFields.flag];
            this.count = tuple[UpdateZhizunCardInfoFields.addCount];
            this.restDay = tuple[UpdateZhizunCardInfoFields.restDay];
            this.zhizhun_opened = this.state == 1;

            // 更新超级红包红点状态
            if (update) {
                modules.redpack.RedPackModel.instance.checkRP(true, 3);
            }

            GlobalData.dispatcher.event(CommonEventType.ZHIZUN_UPDATE);
        }
    }
}