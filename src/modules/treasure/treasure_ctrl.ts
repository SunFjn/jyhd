///<reference path="../config/treasure_cfg.ts"/>
///<reference path="../ceremony_cash/ceremony_cash_model.ts"/>


namespace modules.treasure {
    import BaseCtrl = modules.core.BaseCtrl;
    import AddXunbaoSelfBroadcastFields = Protocols.AddXunbaoSelfBroadcastFields;
    import UpdateXunbaoInfoFields = Protocols.UpdateXunbaoInfoFields;
    import GetXunbaoInfoReplyFields = Protocols.GetXunbaoInfoReplyFields;
    import TaskXunbaoBagItemListReplyFields = Protocols.TaskXunbaoBagItemListReplyFields;
    import TaskXunbaoBagAllItemReplyFields = Protocols.TaskXunbaoBagAllItemReplyFields;
    import GetXunbaoServerBroadcastReplyFields = Protocols.GetXunbaoServerBroadcastReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import LogUtils = game.misc.LogUtils;
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import XunBaoExchangeReplyFields = Protocols.XunBaoExchangeReplyFields;
    import TreasureCfg = modules.config.TreasureCfg;
    import GetXunBaoHintReply = Protocols.GetXunBaoHintReply;
    import GetXunBaoHintReplyFields = Protocols.GetXunBaoHintReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import CeremonyCashModel = modules.ceremony_cash.CeremonyCashModel;
    export class TreasureCtrl extends BaseCtrl {
        private static _instance: TreasureCtrl;
        private _redDot: boolean;
        private _exchangeRedDot: boolean;

        public static get instance(): TreasureCtrl {
            return this._instance = this._instance || new TreasureCtrl();
        }

        private destin: Point;

        constructor() {
            super();
            this.destin = new Point(180, 60);
        }

        public setup() {
            Channel.instance.subscribe(SystemClientOpcode.AddXunbaoSelfBroadcast, this, this.SelfBroadcast);
            Channel.instance.subscribe(SystemClientOpcode.UpdateXunbaoInfo, this, this.UpdateXunbaoInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetXunbaoServerBroadcastReply, this, this.SeverBroadcast);
            Channel.instance.subscribe(SystemClientOpcode.GetXunbaoInfoReply, this, this.GetXunbaoInfo);
            Channel.instance.subscribe(SystemClientOpcode.RunXunbaoReply, this, this.RunXunbaoReply);
            Channel.instance.subscribe(SystemClientOpcode.TaskXunbaoBagItemListReply, this, this.TaskXunBaoBagItemReply);
            Channel.instance.subscribe(SystemClientOpcode.TaskXunbaoBagAllItemReply, this, this.TaskXunbaoBagAllItemReply);
            Channel.instance.subscribe(SystemClientOpcode.XunBaoExchangeReply, this, this.ExchangeReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXunBaoHintReply, this, this.GetHintList);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.setDotDic);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.setDotDic);
            
            GlobalData.dispatcher.on(CommonEventType.XUNBAO_EFFECT, this, this.itemEffect);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
        
            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            let types = TreasureCfg.instance.getExchangeType();
            for (let i = 0; i < types.length; i++) {
                Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [i]);
            }
            Channel.instance.publish(UserFeatureOpcode.GetXunBaoHint, null);
            this.setDotDic();
        }


        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.xunbaoTalisman ||
                    element == ActionOpenId.xunbaoEquip ||
                    element == ActionOpenId.xunbaoDianfeng ||
                    element == ActionOpenId.xunbaoZhizun ||
                    element == ActionOpenId.xunbaoXianfu) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoTalisman) ||
                        FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoEquip) ||
                        FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoDianfeng) ||
                        FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoZhizun) ||
                        FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoXianfu)) {
                        Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [0]);
                        Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [1]);
                        Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [2]);
                        Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [3]);
                        Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [4]);
                        return;
                    }
                }
            }
        }
        public TaskXunBaoBagItemReply(tuple: Protocols.TaskXunbaoBagItemListReply): void {
            TreasureModel.instance.taskXunbao = tuple[TaskXunbaoBagItemListReplyFields.result];
        }

        public TaskXunbaoBagAllItemReply(tuple: Protocols.TaskXunbaoBagAllItemReply): void {
            TreasureModel.instance.taskAllXunbao = tuple[TaskXunbaoBagAllItemReplyFields.result];

        }

        public RunXunbaoReply(tuple: Protocols.RunXunbaoReply): void {
            TreasureModel.instance.runXunbaoReply = tuple;
        }

        public SelfBroadcast(tuple: Protocols.AddXunbaoSelfBroadcast): void {
            let selfList = tuple[AddXunbaoSelfBroadcastFields.selfBroadcastList];
            let type = tuple[AddXunbaoSelfBroadcastFields.type];
            TreasureModel.instance.setSelfBroadcast(type, selfList);
            LogUtils.info(LogFlags.Treasure, `个人------------${tuple}`);

        }

        public SeverBroadcast(tuple: Protocols.GetXunbaoServerBroadcastReply): void {
            let type = tuple[GetXunbaoServerBroadcastReplyFields.type];
            let severList = tuple[GetXunbaoServerBroadcastReplyFields.svrBroadcastList];
            TreasureModel.instance.setSvrBroadcast(type, severList);
            LogUtils.info(LogFlags.Treasure, `全服------------${tuple}`);

        }

        public UpdateXunbaoInfo(tuple: Protocols.UpdateXunbaoInfo): void {
            let type = tuple[UpdateXunbaoInfoFields.type];
            let blessing = tuple[UpdateXunbaoInfoFields.blessing];
            let coupon = tuple[UpdateXunbaoInfoFields.coupon];
            let firstFlag = tuple[UpdateXunbaoInfoFields.firstFlag];
            let isFree = tuple[UpdateXunbaoInfoFields.isFree];
            TreasureModel.instance.setXunbaoInfo(type, blessing, coupon, firstFlag, isFree);
            LogUtils.info(LogFlags.Treasure, `更新------------${tuple}`);

        }

        public GetXunbaoInfo(tuple: Protocols.GetXunbaoInfoReply): void {
            let type = tuple[GetXunbaoInfoReplyFields.type];
            let blessing = tuple[GetXunbaoInfoReplyFields.blessing];
            let restime = tuple[GetXunbaoInfoReplyFields.restTime];
            let selfList = tuple[GetXunbaoInfoReplyFields.selfBroadcastList];
            let coupon = tuple[GetXunbaoInfoReplyFields.coupon];
            let firstFlag = tuple[GetXunbaoInfoReplyFields.firstFlag];
            let isFree = tuple[GetXunbaoInfoReplyFields.isFree];

            TreasureModel.instance.setXunbaoInfo(type, blessing, coupon, firstFlag, isFree);
            TreasureModel.instance.restTime = restime;
            TreasureModel.instance.setSelfBroadcast(type, selfList);

            LogUtils.info(LogFlags.Treasure, `获得------------${tuple}`);
        }

        public GetHintList(tuple: GetXunBaoHintReply): void {
            let hintList = tuple[GetXunBaoHintReplyFields.hintList];
            TreasureModel.instance.setHintList(hintList);
        }

        public ExchangeReply(tuple: Protocols.XunBaoExchangeReply): void {
            let result = tuple[XunBaoExchangeReplyFields.result];
            let id = tuple[XunBaoExchangeReplyFields.id];
            let exCount = tuple[XunBaoExchangeReplyFields.limitCount];
            TreasureModel.instance.xunBaoExchangeReply = result;
            TreasureModel.instance.setXunBaoExchangeData(id, exCount);
        }

        public setDotDic() {
            let items = BagModel.instance.getItemsByBagId(BagId.xunbao);
            if (items != null && items.length > 0) {
                this._redDot = true;
            } else {
                this._redDot = false;
            }
            RedPointCtrl.instance.setRPProperty("treasureBagRP", this._redDot);
            TreasureModel.instance.panduianRp();
        }

        public runXunbao(type: number, value: number, isBuy: boolean = false): void {
            Channel.instance.publish(UserFeatureOpcode.RunXunbao, [type, value, isBuy]);
            // if(value==0){
            //     Channel.instance.publish(UserFeatureOpcode.RunXunbao,[type,value]);
            // }else{
            //     if(this.flag==false){
            //         Channel.instance.publish(UserFeatureOpcode.RunXunbao,[type,value]);
            //         this.flag=true;
            //         Laya.timer.once(2000,this,this.setFlag);
            //     }else{
            //         SystemNoticeManager.instance.addNotice("当前操作太频繁")
            //     }
            // }
        }

        public exchange(type: number, id: number): void {
            Channel.instance.publish(UserFeatureOpcode.XunBaoExchange, [type, id]);
        }

        private itemEffect(value: any): void {
            let img = new Image();
            let id = value[0];
            let start = value[1];
            let heightP = value[2];
            if (id == null) return;
            let spr: any = null;
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
            spr = modules.action_preview.actionPreviewModel.instance.getPosSpriteAny(specialAniPoin.xunBaoCangKu);
            // }
            if (spr) {
                img.skin = CommonUtil.getIconById(id);
                img.anchorX = img.anchorY = 0.5;
                let startX = start.x + 40 + (CommonConfig.viewWidth - 663) / 2;
                let startY = start.y + 90 + (CommonConfig.viewHeight - heightP) / 2;
                img.pos(startX, startY);
                LayerManager.instance.addToEffectLayer(img);
                let sprImg = spr as Image;
                Laya.Point.TEMP.setTo(sprImg.width / 2, sprImg.height / 2);
                let pos1 = sprImg.localToGlobal(Laya.Point.TEMP, true);
                Point.TEMP.setTo(pos1.x, pos1.y);
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