///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../pay_reward/pay_reward_model.ts"/>
/** */
namespace modules.pay_reward {
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import PayRewardModel = modules.pay_reward.PayRewardModel;
    /*返回数据*/
    import GetPayRewardInfoReply = Protocols.GetPayRewardInfoReply;
    import GetPayRewardInfoReplyFields = Protocols.GetPayRewardInfoReplyFields;
    /*更新数据*/
    import UpdatePayRewardInfo = Protocols.UpdatePayRewardInfo;
    /*转盘抽奖返回*/
    import PayRewardRunReply = Protocols.PayRewardRunReply;
    import PayRewardRunReplyFields = Protocols.PayRewardRunReplyFields;
    /*获取抽奖记录返回*/
    import GetPayRewardNotesReply = Protocols.GetPayRewardNotesReply;
    import GetPayRewardNotesReplyFields = Protocols.GetPayRewardNotesReplyFields;
    /*获取财富值奖励返回*/
    import GetPayRewardRewardReply = Protocols.GetPayRewardRewardReply;
    import GetPayRewardRewardReplyFields = Protocols.GetPayRewardRewardReplyFields;
    /*获取全服记录返回*/
    import GetPayRewardServerBroadcastReply = Protocols.GetPayRewardServerBroadcastReply;
    import GetPayRewardServerBroadcastReplyFields = Protocols.GetPayRewardServerBroadcastReplyFields;
    import CommonUtil = modules.common.CommonUtil;

    export class PayRewardCtrl extends BaseCtrl {
        private static _instance: PayRewardCtrl;
        public static get instance(): PayRewardCtrl {
            return this._instance = this._instance || new PayRewardCtrl();
        }

        private destin: Point;

        constructor() {
            super();
            this.destin = new Point(150, 21);
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetPayRewardInfoReply, this, this.GetPayRewardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdatePayRewardInfo, this, this.UpdatePayRewardInfo);
            Channel.instance.subscribe(SystemClientOpcode.PayRewardRunReply, this, this.PayRewardRunReply);
            Channel.instance.subscribe(SystemClientOpcode.GetPayRewardNotesReply, this, this.GetPayRewardNotesReply);
            Channel.instance.subscribe(SystemClientOpcode.GetPayRewardRewardReply, this, this.GetPayRewardRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetPayRewardServerBroadcastReply, this, this.GetPayRewardServerBroadcastReply);
            
            GlobalData.dispatcher.on(CommonEventType.PAY_REWARD_EFFECT, this, this.itemEffect);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.getPayRewardInfo();
            this.GetPayRewardServerBroadcast();
        }

        /** 获取数据 请求*/
        public getPayRewardInfo() {
            // console.log("充值轉盤 获取数据 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetPayRewardInfo, null);
        }

        /** 转盘抽奖 请求*/
        public payRewardRun(flag: number) {
            // console.log("充值轉盤 转盘抽奖 请求 ");
            Channel.instance.publish(UserFeatureOpcode.PayRewardRun, [flag]);
        }

        /** 获取抽奖记录 请求*/
        public getPayRewardNotes() {
            // console.log("充值轉盤 获取抽奖记录 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetPayRewardNotes, null);
        }

        /** 获取财富值奖励 请求*/
        public getPayRewardReward() {
            // console.log("充值轉盤 获取财富值奖励 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetPayRewardReward, null);
        }

        /** 获取全服记录 请求*/
        public GetPayRewardServerBroadcast() {
            // console.log(获取全服记录 请求 ");
            Channel.instance.publish(UserCenterOpcode.GetPayRewardServerBroadcast, null);
        }

        /** 返回数据*/
        private GetPayRewardInfoReply(tuple: GetPayRewardInfoReply): void {
            // console.log("充值轉盤 返回数据...............:   ", tuple);
            PayRewardModel.instance.rewardCount = tuple[GetPayRewardInfoReplyFields.rewardCount];
            PayRewardModel.instance.caifu = tuple[GetPayRewardInfoReplyFields.caifu];
            PayRewardModel.instance.rewardList = tuple[GetPayRewardInfoReplyFields.rewardList];
            PayRewardModel.instance.setPayRewardRP();
        }

        /** 更新数据*/
        private UpdatePayRewardInfo(tuple: UpdatePayRewardInfo): void {
            // console.log("充值轉盤 更新数据...............:   ", tuple);
            PayRewardModel.instance.rewardCount = tuple[GetPayRewardInfoReplyFields.rewardCount];
            PayRewardModel.instance.caifu = tuple[GetPayRewardInfoReplyFields.caifu];
            PayRewardModel.instance.rewardList = tuple[GetPayRewardInfoReplyFields.rewardList];
            PayRewardModel.instance.UpdatePayRewardInfo();
            PayRewardModel.instance.setPayRewardRP();
        }

        /** 转盘抽奖返回*/
        private PayRewardRunReply(tuple: PayRewardRunReply): void {
            // console.log("充值轉盤 转盘抽奖返回...............:   ", tuple);
            if (tuple[PayRewardRunReplyFields.result] == 0) {
                PayRewardModel.instance.noteList = tuple[PayRewardRunReplyFields.noteList];
                PayRewardModel.instance.PayRewardRunReply();
                this.GetPayRewardServerBroadcast();//获取全服记录数据
            } else {
                CommonUtil.noticeError(tuple[PayRewardRunReplyFields.result]);
            }
        }

        /** 获取抽奖记录返回*/
        private GetPayRewardNotesReply(tuple: GetPayRewardNotesReply): void {
            // console.log(" 获取抽奖记录返回...............:   ", tuple);
            PayRewardModel.instance.PayRewardNoteList = tuple[GetPayRewardNotesReplyFields.noteList];
            PayRewardModel.instance.openMyRecord();
        }

        /** 获取财富值奖励返回*/
        private GetPayRewardRewardReply(tuple: GetPayRewardRewardReply): void {
            // console.log(" 获取财富值奖励返回...............:   ", tuple);
            let code: number = tuple[GetPayRewardRewardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
            PayRewardModel.instance.result = code;
        }

        /** 获取全服记录返回*/
        private GetPayRewardServerBroadcastReply(tuple: GetPayRewardServerBroadcastReply): void {
            // console.log(" 获取全服记录返回...............:   ", tuple);
            if (tuple) {
                PayRewardModel.instance.svrBroadcastList = tuple[GetPayRewardServerBroadcastReplyFields.svrBroadcastList];
                PayRewardModel.instance.updateSeverList();
            }

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
            let spr: Point = null;
            let _itemType = CommonUtil.getItemSubTypeById(id);
            let _itemType1 = CommonUtil.getItemTypeById(id);
            // if (_itemType1 == ItemMType.Unreal) {
            //     if (_itemType == UnrealItemType.gold || _itemType == UnrealItemType.bind_gold) {
            //         spr = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.yuanbao);
            //     } else if (_itemType == UnrealItemType.copper || _itemType == UnrealItemType.zq) {
            //         spr = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.cion);
            //     } else {
            //         spr = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.beiBao);
            //     }
            // } else {
            spr = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.beiBao);
            // }
            if (spr) {
                img.skin = CommonUtil.getIconById(id);
                img.anchorX = img.anchorY = 0.5;
                let startX = start.x + 40 + (CommonConfig.viewWidth - 663) / 2;
                let startY = start.y + 90 + (CommonConfig.viewHeight - heightP) / 2;
                img.pos(startX, startY);
                LayerManager.instance.addToEffectLayer(img);

                Point.TEMP.setTo(spr.x, spr.y);
                LayerManager.instance.getLayerById(ui.Layer.EFFECT_LAYER).globalToLocal(Point.TEMP);
                let destinX = Point.TEMP.x;
                let destinY = Point.TEMP.y;
                // let viewWidth = CommonConfig.viewWidth;
                // let viewHeight = CommonConfig.viewHeight;
                // let destinX = CommonConfig.viewWidth / 2 + this.destin.x;
                // let destinY = CommonConfig.viewHeight - this.destin.y;
                TweenJS.create(img).to({
                    x: destinX,
                    y: destinY,
                    scaleX: 0.2,
                    scaleY: 0.2
                }, 500).onComplete((): void => {
                    img.destroy(true)
                }).start()
            }
        }
    }
}