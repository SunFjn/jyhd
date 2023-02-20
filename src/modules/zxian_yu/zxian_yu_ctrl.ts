///<reference path="../config/treasure_cfg.ts"/>


namespace modules.zxian_yu {
    import BaseCtrl = modules.core.BaseCtrl;
    import AddXunbaoSelfBroadcastFields = Protocols.AddXunbaoSelfBroadcastFields;
    import UpdateXunbaoInfoFields = Protocols.UpdateXunbaoInfoFields;
    import GetXunbaoInfoReplyFields = Protocols.GetXunbaoInfoReplyFields;
    import TaskXianYuXunbaoBagItemListFields = Protocols.TaskXianYuXunbaoBagItemListFields;
    import TaskXianYuXunbaoBagAllItemFields = Protocols.TaskXianYuXunbaoBagAllItemFields;
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
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import GetXianYuInfoReply = Protocols.GetXianYuInfoReply;
    import GetXianYuInfoReplyFields = Protocols.GetXianYuInfoReplyFields;

    import GetYuGeInfoReply = Protocols.GetYuGeInfoReply;
    import GetYuGeInfoReplyFields = Protocols.GetYuGeInfoReplyFields;
    import BuyYuGeGoodsReply = Protocols.BuyYuGeGoodsReply;
    import BuyYuGeGoodsReplyFields = Protocols.BuyYuGeGoodsReplyFields;
    import F5YuGeReply = Protocols.F5YuGeReply;
    import F5YuGeReplyFields = Protocols.F5YuGeReplyFields;

    import GetXianYuFuYuInfoReply = Protocols.GetXianYuFuYuInfoReply;
    import GetXianYuFuYuInfoReplyFields = Protocols.GetXianYuFuYuInfoReplyFields;

    import GetFuYuanAwardReply = Protocols.GetFuYuanAwardReply;
    import GetFuYuanAwardReplyFields = Protocols.GetFuYuanAwardReplyFields;


    import TaskXianYuXunbaoBagItemListReplyFields = Protocols.TaskXianYuXunbaoBagItemListReplyFields;
    import TaskXianYuXunbaoBagAllItemReplyFields = Protocols.TaskXianYuXunbaoBagAllItemReplyFields;
    export class ZXianYuCtrl extends BaseCtrl {
        private static _instance: ZXianYuCtrl;
        private _redDot: boolean;
        private _exchangeRedDot: boolean;
        public static get instance(): ZXianYuCtrl {
            return this._instance = this._instance || new ZXianYuCtrl();
        }
        constructor() {
            super();
        }

        public setup() {

            Channel.instance.subscribe(SystemClientOpcode.GetXianYuInfoReply, this, this.GetXianYuInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetYuGeInfoReply, this, this.GetYuGeInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.BuyYuGeGoodsReply, this, this.BuyYuGeGoodsReply);
            Channel.instance.subscribe(SystemClientOpcode.F5YuGeReply, this, this.F5YuGeReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXianYuFuYuInfoReply, this, this.GetXianYuFuYuInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFuYuanAwardReply, this, this.GetFuYuanAwardReply);

            Channel.instance.subscribe(SystemClientOpcode.TaskXianYuXunbaoBagItemListReply, this, this.TaskXianYuXunbaoBagItemListReply);
            Channel.instance.subscribe(SystemClientOpcode.TaskXianYuXunbaoBagAllItemReply, this, this.TaskXianYuXunbaoBagAllItemReply);


            GlobalData.dispatcher.on(CommonEventType.ZXIANYU_EFFECT, this, this.itemEffect);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);

            GlobalData.dispatcher.on(CommonEventType.ZXIANYU_REPLY, this, ZXianYuModel.instance.setRP);
            GlobalData.dispatcher.on(CommonEventType.TASK_XUNBAO_ALL_REPLY, this, ZXianYuModel.instance.setRP);
            GlobalData.dispatcher.on(CommonEventType.ZXIANYU_ALL_REPLY, this, ZXianYuModel.instance.setRP);
            GlobalData.dispatcher.on(CommonEventType.ZXIANYU_REPLY, this, ZXianYuModel.instance.setRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, ZXianYuModel.instance.setRP);
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
         */
        public requsetAllData(): void {
            this.GetXianYuInfo();
            this.GetYuGeInfo();
            this.GetXianYuFuYuInfo();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.xianYu) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianYu)) {
                        ZXianYuModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public TaskXianYuXunbaoBagItemListReply(tuple: Protocols.TaskXianYuXunbaoBagItemListReply): void {
            // console.log("取探索仓库物品到背包返回...............:   ", tuple);
            let code: number = tuple[TaskXianYuXunbaoBagItemListReplyFields.result];
            CommonUtil.codeDispose(code, `取出成功`);
            GlobalData.dispatcher.event(CommonEventType.ZXIANYU_REPLY);
        }

        public TaskXianYuXunbaoBagAllItemReply(tuple: Protocols.TaskXianYuXunbaoBagAllItemReply): void {
            // console.log("取探索仓库所有返回...............:   ", tuple);
            let code: number = tuple[TaskXianYuXunbaoBagAllItemReplyFields.result];
            CommonUtil.codeDispose(code, `取出成功`);
            GlobalData.dispatcher.event(CommonEventType.ZXIANYU_ALL_REPLY);

        }

        /*获取点券信息*/
        public GetXianYuInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianYuInfo, null);
        }
        /*获取玉阁信息*/
        public GetYuGeInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetYuGeInfo, null);
        }
        /*goumai*/
        public BuyYuGeGoods(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.BuyYuGeGoods, [id]);
        }
        /*刷新玉阁*/
        public F5YuGe(): void {
            Channel.instance.publish(UserFeatureOpcode.F5YuGe, null);
        }
        /*获取福缘信息*/
        public GetXianYuFuYuInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianYuFuYuInfo, null);
        }
        /*领取福缘值奖励*/
        public GetFuYuanAward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetFuYuanAward, [id]);
        }
        public GetXianYuInfoReply(tuple: GetXianYuInfoReply): void {
            // console.log("点券信息返回...............:   ", tuple);
            ZXianYuModel.instance.xianyu = tuple[GetXianYuInfoReplyFields.xianyu];
            ZXianYuModel.instance.xianyuLimit = tuple[GetXianYuInfoReplyFields.xianyuLimit];
            GlobalData.dispatcher.event(CommonEventType.ZXIANYU_UPDATE);
            ZXianYuModel.instance.setRP();
        }
        public GetYuGeInfoReply(tuple: GetYuGeInfoReply): void {
            // console.log("玉阁信息返回...............:   ", tuple);
            ZXianYuModel.instance.idList = tuple[GetYuGeInfoReplyFields.idList];
            ZXianYuModel.instance.f5Time = tuple[GetYuGeInfoReplyFields.f5Time];
            GlobalData.dispatcher.event(CommonEventType.ZXIANYU_YUGE_UPDATE);
            ZXianYuModel.instance.setRP();
        }
        public BuyYuGeGoodsReply(tuple: BuyYuGeGoodsReply): void {
            // console.log("购买玉阁商品返回...............:   ", tuple);
            let code: number = tuple[BuyYuGeGoodsReplyFields.result];
            CommonUtil.codeDispose(code, `购买成功`);
        }
        public F5YuGeReply(tuple: F5YuGeReply): void {
            // console.log("刷新玉阁返回...............:   ", tuple);
            let code: number = tuple[F5YuGeReplyFields.result];
            CommonUtil.codeDispose(code, `刷新成功`);
        }

        public GetXianYuFuYuInfoReply(tuple: GetXianYuFuYuInfoReply): void {
            // console.log("获取福缘信息返回...............:   ", tuple);
            ZXianYuModel.instance.fuyu = tuple[GetXianYuFuYuInfoReplyFields.fuyu];
            ZXianYuModel.instance.stateList = tuple[GetXianYuFuYuInfoReplyFields.stateList];
            GlobalData.dispatcher.event(CommonEventType.ZXIANYU_FUYUAN_UPDATE);
            ZXianYuModel.instance.setRP();
        }
        public GetFuYuanAwardReply(tuple: GetFuYuanAwardReply): void {
            // console.log("领取福缘值奖励返回...............:   ", tuple);
            let code: number = tuple[GetFuYuanAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
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
            spr = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.xianyuCangKu);
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