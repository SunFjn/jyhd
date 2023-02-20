///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
/** */
namespace modules.rotary_table_jiuzhou {
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import UserCrossOpcode = Protocols.UserCrossOpcode;
    /*返回数据*/
    import GetJzduobaoInfoReply = Protocols.GetJzduobaoInfoReply;
    /*更新数据*/
    import UpdateJzduobaoInfo = Protocols.UpdateJzduobaoInfo;
    /*转盘抽奖返回*/
    import JzduobaoRunReply = Protocols.JzduobaoRunReply;
    import JzduobaoRunReplyFields = Protocols.JzduobaoRunReplyFields;
    /*获取抽奖记录返回*/
    import GetJzduobaoNotesReply = Protocols.GetJzduobaoNotesReply;
    import GetJzduobaoNotesReplyFields = Protocols.GetJzduobaoNotesReplyFields;
    /*获取积分奖励返回*/
    import GetJzduobaoRewardReply = Protocols.GetJzduobaoRewardReply;
    import GetJzduobaoRewardReplyFields = Protocols.GetJzduobaoRewardReplyFields;
    /*获取全服记录返回*/
    import GetJzduobaoServerBroadcastReply = Protocols.GetJzduobaoServerBroadcastReply;
    import GetJzduobaoServerBroadcastReplyFields = Protocols.GetJzduobaoServerBroadcastReplyFields;
    // /*返回个人排名*/
    import GetJzduobaoRankInfoReply = Protocols.GetJzduobaoRankInfoReply;
    import GetJzduobaoRankInfoReplyFields = Protocols.GetJzduobaoRankInfoReplyFields;
    //
    import UpdateJzduobaoJackpot = Protocols.UpdateJzduobaoJackpot;
    import UpdateJzduobaoJackpotFields = Protocols.UpdateJzduobaoJackpotFields;
    export class RotaryTableJiuZhouCtrl extends BaseCtrl {
        private static _instance: RotaryTableJiuZhouCtrl;
        public static get instance(): RotaryTableJiuZhouCtrl {
            return this._instance = this._instance || new RotaryTableJiuZhouCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetJzduobaoInfoReply, this, this.GetJzduobaoInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateJzduobaoInfo, this, this.UpdateJzduobaoInfo);
            Channel.instance.subscribe(SystemClientOpcode.JzduobaoRunReply, this, this.JzduobaoRunReply);
            Channel.instance.subscribe(SystemClientOpcode.GetJzduobaoNotesReply, this, this.GetJzduobaoNotesReply);
            Channel.instance.subscribe(SystemClientOpcode.GetJzduobaoRewardReply, this, this.GetJzduobaoRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetJzduobaoServerBroadcastReply, this, this.GetJzduobaoServerBroadcastReply);
            Channel.instance.subscribe(SystemClientOpcode.GetJzduobaoRankInfoReply, this, this.GetJzduobaoRankInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateJzduobaoJackpot, this, this.UpdateJzduobaoJackpot);
            GlobalData.dispatcher.on(CommonEventType.ROTARYTABLE_JIUZHOU_EFFECT, this, this.itemEffect);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetDuobaoInfo();
            this.GetDuobaoServerBroadcast();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.jzduobao) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.jzduobao)) {
                        RotaryTableJiuZhouModel.instance.setActionOpen();
                        RotaryTableJiuZhouModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public GetDuobaoInfo() {
            // console.log("九州 夺宝 获取数据 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetJzduobaoInfo, null);
        }
        public DuobaoRun(flag: number) {
            // console.log("九州 夺宝 转盘抽奖 请求 ");
            Channel.instance.publish(UserFeatureOpcode.JzduobaoRun, [flag]);
        }
        public GetDuobaoNotes() {
            // console.log("九州 夺宝 获取抽奖记录 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetJzduobaoNotes, null);
        }
        public GetDuobaoReward() {
            // console.log("九州 夺宝 获取积分奖励 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetJzduobaoReward, null);
        }
        public GetDuobaoServerBroadcast() {
            // console.log("获取 九州 夺宝 全服记录 请求 ");
            Channel.instance.publish(UserCenterOpcode.GetJzduobaoServerBroadcast, null);
        }
        public getDuobaoRankCharInfo(type: number) {
            // console.log("返回 九州 夺宝 夺宝排名 请求 ");
            Channel.instance.publish(UserCrossOpcode.GetJzduobaoRankInfo, [type]);
        }
        /** 返回数据*/
        private GetJzduobaoInfoReply(tuple: GetJzduobaoInfoReply): void {
            // console.log("九州 夺宝 返回数据...............:   ", tuple);
            RotaryTableJiuZhouModel.instance.getInfo(tuple);
        }
        /** 更新数据*/
        private UpdateJzduobaoInfo(tuple: UpdateJzduobaoInfo): void {
            // console.log("九州 夺宝 更新数据...............:   ", tuple);
            RotaryTableJiuZhouModel.instance.updateInfo(tuple);
        }
        public UpdateJzduobaoJackpot(tuple: UpdateJzduobaoJackpot): void {
            // console.log("九州 夺宝 更新奖池...............:   ", tuple);
            RotaryTableJiuZhouModel.instance._jackPot = tuple[UpdateJzduobaoJackpotFields.jackpot];
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE_JACKPOT);
        }
        /** 转盘抽奖返回*/
        private JzduobaoRunReply(tuple: JzduobaoRunReply): void {
            // console.log("九州 夺宝 转盘抽奖返回...............:   ", tuple);
            if (tuple[JzduobaoRunReplyFields.result] == 0) {
                RotaryTableJiuZhouModel.instance.noteList = tuple[JzduobaoRunReplyFields.noteList];
                RotaryTableJiuZhouModel.instance.PayRewardRunReply();
                this.GetDuobaoServerBroadcast();//获取全服记录数据
            } else {
                CommonUtil.noticeError(tuple[JzduobaoRunReplyFields.result]);
            }
        }
        /** 获取抽奖记录返回*/
        private GetJzduobaoNotesReply(tuple: GetJzduobaoNotesReply): void {
            // console.log("九州 夺宝 获取抽奖记录返回...............:   ", tuple);
            RotaryTableJiuZhouModel.instance.PayRewardNoteList = tuple[GetJzduobaoNotesReplyFields.noteList];
            RotaryTableJiuZhouModel.instance.openMyRecord();
        }
        /** 获取积分奖励返回*/
        private GetJzduobaoRewardReply(tuple: GetJzduobaoRewardReply): void {
            // console.log("九州 夺宝 获取积分奖励返回...............:   ", tuple);
            RotaryTableJiuZhouModel.instance.result = tuple[GetJzduobaoRewardReplyFields.result];
        }
        /** 获取全服记录返回*/
        private GetJzduobaoServerBroadcastReply(tuple: GetJzduobaoServerBroadcastReply): void {
            // console.log("九州 夺宝 获取全服记录返回...............:   ", tuple);
            if (tuple) {
                RotaryTableJiuZhouModel.instance.svrBroadcastList = tuple[GetJzduobaoServerBroadcastReplyFields.svrBroadcastList];
                RotaryTableJiuZhouModel.instance._totalScore = tuple[GetJzduobaoServerBroadcastReplyFields.totalScore];
                if (!tuple[GetJzduobaoServerBroadcastReplyFields.totalScore]) {
                    RotaryTableJiuZhouModel.instance._totalScore = 0;
                }
                RotaryTableJiuZhouModel.instance.updateSeverList();
            }
        }
        private GetJzduobaoRankInfoReply(tuple: GetJzduobaoRankInfoReply): void {
            // console.log("九州 夺宝 返回夺宝排名...............:   ", tuple);
            if (tuple[GetJzduobaoRankInfoReplyFields.type] == 0) {
                RotaryTableJiuZhouModel.instance.getInfoMyNodeList(tuple[GetJzduobaoRankInfoReplyFields.nodeList]);
            } else if (tuple[GetJzduobaoRankInfoReplyFields.type] == 1) {
                RotaryTableJiuZhouModel.instance.getInfoQuNodeList(tuple[GetJzduobaoRankInfoReplyFields.nodeList]);
            }
        }
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