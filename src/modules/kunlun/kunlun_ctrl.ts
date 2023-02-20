///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../pay_reward/pay_reward_model.ts"/>
///<reference path="../kunlun/kunlun_model.ts"/>
/** */
namespace modules.kunlun {
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserMapOpcode = Protocols.UserMapOpcode;
    /*获取数据*/
    import KunLunModel = modules.kunlun.KunLunModel;
    /*获取昆仑瑶池信息返回*/
    import GetSwimmingInfoReply = Protocols.GetSwimmingInfoReply;
    import GetSwimmingInfoReplyFields = Protocols.GetSwimmingInfoReplyFields;
    /*获取肥皂信息*/
    import GetSoapInfoReply = Protocols.GetSoapInfoReply;
    import GetSoapInfoReplyFields = Protocols.GetSoapInfoReplyFields;
    /*更新昆仑瑶池信息*/
    import UpdateSwimmingInfo = Protocols.UpdateSwimmingInfo;
    import UpdateSwimmingInfoFields = Protocols.UpdateSwimmingInfoFields;
    /*抓肥皂返回*/
    import GrabSoapReply = Protocols.GrabSoapReply;
    import GrabSoapReplyFields = Protocols.GrabSoapReplyFields;
    /*获取当前在副本里面得到的奖励返回*/
    import GetInCopyAwardReply = Protocols.GetInCopyAwardReply;
    import GetInCopyAwardReplyFields = Protocols.GetInCopyAwardReplyFields;
    import CommonUtil = modules.common.CommonUtil;

    export class KunLunCtrl extends BaseCtrl {
        private static _instance: KunLunCtrl;
        public static get instance(): KunLunCtrl {
            return this._instance = this._instance || new KunLunCtrl();
        }

        private destin: Point;
        private timeStart: number;

        constructor() {
            super();
            this.destin = new Point(180, 60);
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetSwimmingInfoReply, this, this.GetSwimmingInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSwimmingInfo, this, this.UpdateSwimmingInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetSoapInfoReply, this, this.GetSoapInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GrabSoapReply, this, this.GrabSoapReply);
            Channel.instance.subscribe(SystemClientOpcode.GetInCopyAwardReply, this, this.GetInCopyAwardReply);
            GlobalData.dispatcher.on(CommonEventType.KUNLUN_REWARD_EFFECT, this, this.itemEffect);
            // this.GetSwimmingInfo();
        }

        /** 获取昆仑瑶池信息 请求*/
        public GetSwimmingInfo() {
            // console.log("获取昆仑瑶池信息  请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetSwimmingInfo, null);
        }

        /** 获取肥皂信息 请求*/
        public GetSoapInfo() {
            console.log("获取肥皂信息  请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetSoapInfo, null);
        }

        /** 抓肥皂 请求*/
        public GrabSoap() {
            // console.log("抓肥皂  请求 ");
            let serverTime = GlobalData.serverTime;//传当前服务器时间
            Channel.instance.publish(UserFeatureOpcode.GrabSoap, [serverTime]);
        }

        /** 获取当前在副本里面得到的奖励 请求*/
        public GetInCopyAward() {
            // console.log("获取当前在副本里面得到的奖励  请求 ");
            Channel.instance.publish(UserMapOpcode.GetInCopyAward, null);
        }

        /** 获取昆仑瑶池信息返回*/
        private GetSwimmingInfoReply(tuple: GetSwimmingInfoReply): void {
            // console.log("获取昆仑瑶池信息返回 现在服务器的时间...............:   " + GlobalData.serverTime);
            // console.log("获取昆仑瑶池信息返回 返回数据...............:   ", tuple);
            KunLunModel.instance.time = tuple[GetSwimmingInfoReplyFields.time];
            KunLunModel.instance.buffTime = tuple[GetSwimmingInfoReplyFields.buffTime];
            KunLunModel.instance.count = tuple[GetSwimmingInfoReplyFields.count];
            this.timeStart = tuple[GetSwimmingInfoReplyFields.time];
            GlobalData.dispatcher.event(CommonEventType.KUNLUN_STATE_UPDATE);
        }

        /** 更新昆仑瑶池信息*/
        private UpdateSwimmingInfo(tuple: UpdateSwimmingInfo): void {
            // console.log("更新昆仑瑶池信息 现在服务器的时间...............:   " + GlobalData.serverTime);
            // console.log("更新昆仑瑶池信息 返回数据...............:   ", tuple);
            KunLunModel.instance.time = tuple[UpdateSwimmingInfoFields.time];
            KunLunModel.instance.buffTime = tuple[UpdateSwimmingInfoFields.buffTime];
            KunLunModel.instance.count = tuple[UpdateSwimmingInfoFields.count];
            if (this.timeStart != KunLunModel.instance.time) {
                // console.log("两次结算时间不一致！！！！！！this.timeStart：" + this.timeStart);
                // console.log("两次结算时间不一致！！！！！！KunLunModel.instance.time：" + KunLunModel.instance.time);
            }
            GlobalData.dispatcher.event(CommonEventType.KUNLUN_UPDATE);
        }

        /** 获取肥皂信息*/
        private GetSoapInfoReply(tuple: GetSoapInfoReply): void {
            console.log("获取肥皂信息 返回数据...............:   ", tuple);
            KunLunModel.instance.le = tuple[GetSoapInfoReplyFields.le];
            KunLunModel.instance.startPos = tuple[GetSoapInfoReplyFields.start];
            GlobalData.dispatcher.event(CommonEventType.KUNLUN_SHOWSOAP);
        }

        /** 抓肥皂返回*/
        private GrabSoapReply(tuple: GrabSoapReply): void {
            // console.log("抓肥皂返回 返回数据...............:   ", tuple);
            if (tuple[GrabSoapReplyFields.code] == 0) {
                KunLunModel.instance.result = tuple[GrabSoapReplyFields.result];
                GlobalData.dispatcher.event(CommonEventType.KUNLUN_ZHUAN);
            } else {
                CommonUtil.noticeError(tuple[GrabSoapReplyFields.code]);
            }
        }

        /** 获取当前在副本里面得到的奖励返回*/
        private GetInCopyAwardReply(tuple: GetInCopyAwardReply): void {
            // console.log("获取当前在副本里面得到的奖励返回 返回数据...............:   ", tuple);
            KunLunModel.instance.awardList = tuple[GetInCopyAwardReplyFields.awardList];
            GlobalData.dispatcher.event(CommonEventType.KUNLUN_GETDROPRECORD);
        }

        /**
         * 财宝获取 飞过去的动画
         * @param value
         */
        private itemEffect(value: any): void {
            let img = new Image();
            let id = value[0];
            let start = value[1];
            let heightP = value[2];
            if (id == null) return;
            let itemCfg = CommonUtil.getItemCfgById(id);
            let itemType = CommonUtil.getItemTypeById(id);
            img.skin = CommonUtil.getIconById(id);
            img.anchorX = img.anchorY = 0.5;
            let startX = start.x + 40 + (CommonConfig.viewWidth - 663) / 2;
            let startY = start.y + 90 + (CommonConfig.viewHeight - heightP) / 2;
            img.pos(startX, startY);
            LayerManager.instance.addToMidUILayer(img);
            let viewWidth = CommonConfig.viewWidth;
            let viewHeight = CommonConfig.viewHeight;
            let destinX = CommonConfig.viewWidth / 2 + this.destin.x;
            let destinY = CommonConfig.viewHeight - this.destin.y;
            TweenJS.create(img).to({scaleX: 1.5, scaleY: 1.5}, 400).onComplete((): void => {
                TweenJS.create(img).to({scaleX: 1.1, scaleY: 1.1}, 400).onComplete((): void => {
                    TweenJS.create(img).to({
                        x: destinX,
                        y: destinY,
                        scaleX: 0.2,
                        scaleY: 0.2
                    }, 600).onComplete((): void => {
                        img.destroy(true)
                    }).start()
                }).start()
            }).start()
        }
    }
}