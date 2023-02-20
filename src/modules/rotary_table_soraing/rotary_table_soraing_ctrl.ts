///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
/** */
namespace modules.rotary_table_soraing {
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import UserCrossOpcode = Protocols.UserCrossOpcode;
    /*返回数据*/
    import GetDuobaoInfoReply = Protocols.GetDuobaoInfoReply;
    /*更新数据*/
    import UpdateDuobaoInfo = Protocols.UpdateDuobaoInfo;
    /*转盘抽奖返回*/
    import DuobaoRunReply = Protocols.DuobaoRunReply;
    import DuobaoRunReplyFields = Protocols.DuobaoRunReplyFields;
    /*获取抽奖记录返回*/
    import GetDuobaoNotesReply = Protocols.GetDuobaoNotesReply;
    import GetDuobaoNotesReplyFields = Protocols.GetDuobaoNotesReplyFields;
    /*获取积分奖励返回*/
    import GetDuobaoRewardReply = Protocols.GetDuobaoRewardReply;
    import GetDuobaoRewardReplyFields = Protocols.GetDuobaoRewardReplyFields;
    /*获取全服记录返回*/
    import GetDuobaoServerBroadcastReply = Protocols.GetDuobaoServerBroadcastReply;
    import GetDuobaoServerBroadcastReplyFields = Protocols.GetDuobaoServerBroadcastReplyFields;
    // /*返回个人排名*/
    import GetDuobaoRankInfoReply = Protocols.GetDuobaoRankInfoReply;
    import GetDuobaoRankInfoReplyFields = Protocols.GetDuobaoRankInfoReplyFields;
    export class RotaryTableSoaringCtrl extends BaseCtrl {
        private static _instance: RotaryTableSoaringCtrl;
        public static get instance(): RotaryTableSoaringCtrl {
            return this._instance = this._instance || new RotaryTableSoaringCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetDuobaoInfoReply, this, this.GetDuobaoInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDuobaoInfo, this, this.UpdateDuobaoInfo);
            Channel.instance.subscribe(SystemClientOpcode.DuobaoRunReply, this, this.DuobaoRunReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDuobaoNotesReply, this, this.GetDuobaoNotesReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDuobaoRewardReply, this, this.GetDuobaoRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDuobaoServerBroadcastReply, this, this.GetDuobaoServerBroadcastReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDuobaoRankInfoReply, this, this.GetDuobaoRankInfoReply);
            GlobalData.dispatcher.on(CommonEventType.ROTARYTABLE_SOARING_EFFECT, this, this.itemEffect);
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
                if (element == ActionOpenId.duobao) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.duobao)) {
                        RotaryTableSoaringModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public GetDuobaoInfo() {
            // console.log("封神，冲榜 夺宝 获取数据 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetDuobaoInfo, null);
        }
        public DuobaoRun(flag: number) {
            // console.log("封神，冲榜 夺宝 转盘抽奖 请求 ");
            Channel.instance.publish(UserFeatureOpcode.DuobaoRun, [flag]);
        }
        public GetDuobaoNotes() {
            // console.log("封神，冲榜 夺宝 获取抽奖记录 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetDuobaoNotes, null);
        }
        public GetDuobaoReward() {
            // console.log("封神，冲榜 夺宝 获取积分奖励 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetDuobaoReward, null);
        }
        public GetDuobaoServerBroadcast() {
            // console.log("获取 封神，冲榜 夺宝 全服记录 请求 ");
            Channel.instance.publish(UserCenterOpcode.GetDuobaoServerBroadcast, null);
        }
        public getDuobaoRankCharInfo(type: number) {
            // console.log("返回 封神，冲榜 夺宝 夺宝排名 请求 ");
            Channel.instance.publish(UserCrossOpcode.GetDuobaoRankInfo, [type]);
        }
        /** 返回数据*/
        private GetDuobaoInfoReply(tuple: GetDuobaoInfoReply): void {
            // console.log("封神，冲榜 夺宝 返回数据...............:   ", tuple);
            RotaryTableSoaringModel.instance.getInfo(tuple);
        }
        /** 更新数据*/
        private UpdateDuobaoInfo(tuple: UpdateDuobaoInfo): void {
            // console.log("封神，冲榜 夺宝 更新数据...............:   ", tuple);
            RotaryTableSoaringModel.instance.updateInfo(tuple);
        }
        /** 转盘抽奖返回*/
        private DuobaoRunReply(tuple: DuobaoRunReply): void {
            // console.log("封神，冲榜 夺宝 转盘抽奖返回...............:   ", tuple);
            if (tuple[DuobaoRunReplyFields.result] == 0) {
                RotaryTableSoaringModel.instance.noteList = tuple[DuobaoRunReplyFields.noteList];
                RotaryTableSoaringModel.instance.PayRewardRunReply();
                this.GetDuobaoServerBroadcast();//获取全服记录数据
            } else {
                CommonUtil.noticeError(tuple[DuobaoRunReplyFields.result]);
            }
        }
        /** 获取抽奖记录返回*/
        private GetDuobaoNotesReply(tuple: GetDuobaoNotesReply): void {
            // console.log("封神，冲榜 夺宝 获取抽奖记录返回...............:   ", tuple);
            RotaryTableSoaringModel.instance.PayRewardNoteList = tuple[GetDuobaoNotesReplyFields.noteList];
            RotaryTableSoaringModel.instance.openMyRecord();
        }
        /** 获取积分奖励返回*/
        private GetDuobaoRewardReply(tuple: GetDuobaoRewardReply): void {
            // console.log("封神，冲榜 夺宝 获取积分奖励返回...............:   ", tuple);
            RotaryTableSoaringModel.instance.result = tuple[GetDuobaoRewardReplyFields.result];
        }
        /** 获取全服记录返回*/
        private GetDuobaoServerBroadcastReply(tuple: GetDuobaoServerBroadcastReply): void {
            // console.log("封神，冲榜 夺宝 获取全服记录返回...............:   ", tuple);
            if (tuple) {
                RotaryTableSoaringModel.instance.svrBroadcastList = tuple[GetDuobaoServerBroadcastReplyFields.svrBroadcastList];
                RotaryTableSoaringModel.instance._totalScore = tuple[GetDuobaoServerBroadcastReplyFields.totalScore];
                if (!tuple[GetDuobaoServerBroadcastReplyFields.totalScore]) {
                    RotaryTableSoaringModel.instance._totalScore = 0;
                }
                RotaryTableSoaringModel.instance.updateSeverList();
            }
        }
        private GetDuobaoRankInfoReply(tuple: GetDuobaoRankInfoReply): void {
            // console.log("封神，冲榜 夺宝 返回夺宝排名...............:   ", tuple);
            if (tuple[GetDuobaoRankInfoReplyFields.type] == 0) {
                RotaryTableSoaringModel.instance.getInfoMyNodeList(tuple[GetDuobaoRankInfoReplyFields.nodeList]);
            } else if (tuple[GetDuobaoRankInfoReplyFields.type] == 1) {
                RotaryTableSoaringModel.instance.getInfoQuNodeList(tuple[GetDuobaoRankInfoReplyFields.nodeList]);
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