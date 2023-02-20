/** 背包控制器*/


namespace modules.bag {
    import Dictionary = Laya.Dictionary;
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Channel = net.Channel;
    import ItemFields = Protocols.ItemFields;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CommonUtil = modules.common.CommonUtil;
    import useBagItemReply = Protocols.useBagItemReply;
    import useBagItemReplyFields = Protocols.useBagItemReplyFields;
    import Item = Protocols.Item;
    import item_material = Configuration.item_material;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import PlayerModel = modules.player.PlayerModel;
    import item_materialFields = Configuration.item_materialFields;
    import LogUtils = game.misc.LogUtils;
    import VipModel = modules.vip.VipModel;
    import RideRankCfg = modules.config.RideRankCfg;
    export class BagCtrl extends BaseCtrl {
        private static _instance: BagCtrl;

        public static get instance(): BagCtrl {
            return this._instance = this._instance || new BagCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetBagReply, this, this.getBagReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateBag, this, this.updateBag);
            Channel.instance.subscribe(SystemClientOpcode.WearEquipReply, this, this.wearEquipReply);
            Channel.instance.subscribe(SystemClientOpcode.GetSmeltInfoReply, this, this.getSmeltInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.SmeltReply, this, this.smeltReply);
            Channel.instance.subscribe(SystemClientOpcode.useBagItemReply, this, this.useBagItemReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateBagItemShow, this, this.updateBagItemShow);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipsInitedHandler);

            GlobalData.dispatcher.on(CommonEventType.SMELT_UPDATE, this, this.showSmelt_upgrade_alert, [0]);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateSmelt);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateSmelt);
            GlobalData.dispatcher.on(CommonEventType.SELECT_SMELT_UPDATE, this, this.updateSmelt);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateSmelt);
            GlobalData.dispatcher.on(CommonEventType.SMELT_UPDATE, this, this.updateSmelt);
            GlobalData.dispatcher.on(CommonEventType.ZHIZUN_UPDATE, this, this.updateSmelt);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.VIP_UPDATE, this, this.checkRP);

            this.requsetAllData();
        }

        /**
         * 像服务器请求数据
         */
        public requsetAllData() {
            this.getBag(BagId.itemType);
            this.getBag(BagId.equipType);
            this.getBag(BagId.stoneType);
            this.getBag(BagId.magicWeaponType);
            this.getBag(BagId.xunbao);
            this.getBag(BagId.rune);
            this.getBag(BagId.xianyu);
            this.getBag(BagId.temple);
            // 请求装备列表
            PlayerCtrl.instance.getActorEquip();

            this.getSmeltInfo();
        }

        /**
         * 熔炼成功  判断是否升级了 并且熔炼界面的开启状态
         * @param isWai  0熔炼界面开启  1熔炼界面关闭  2无视熔炼界面
         */
        public showSmelt_upgrade_alert(isWai: number) {
            if (BagModel.instance._isUp) {
                if (isWai == 0) {
                    if (!WindowManager.instance.isOpened(WindowEnum.SMELT_PANEL)) {
                        WindowManager.instance.open(WindowEnum.SMELT_UPGRADE_ALERT);
                        BagModel.instance._isUp = false;
                    }
                } else if (isWai == 1) {
                    if (WindowManager.instance.isOpened(WindowEnum.SMELT_PANEL)) {
                        WindowManager.instance.open(WindowEnum.SMELT_UPGRADE_ALERT);
                        BagModel.instance._isUp = false;
                    }
                } else if (isWai == 2) {
                    // if (WindowManager.instance.isOpened(WindowEnum.SMELT_PANEL)) {
                    WindowManager.instance.open(WindowEnum.SMELT_UPGRADE_ALERT);
                    BagModel.instance._isUp = false;
                    // }
                }
            }
        }

        // 获取背包，0道具1装备2仙石3圣物
        private getBag(bagId: BagId): void {
            Channel.instance.publish(UserFeatureOpcode.GetBag, [bagId]);
        }

        // 获取熔炼信息
        public getSmeltInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSmeltInfo, null);
        }

        //获取熔炼信息返回
        private getSmeltInfoReply(tuple: Protocols.GetSmeltInfoReply): void {
            BagModel.instance.initSmeltInfo(tuple[Protocols.GetSmeltInfoReplyFields.level], tuple[Protocols.GetSmeltInfoReplyFields.exp]);
        }

        // 获取背包返回
        private getBagReply(tuple: Protocols.GetBagReply): void {
            if (tuple) {
                let bagId: number = tuple[Protocols.GetBagReplyFields.bagId];
                let items: Array<Protocols.Item> = tuple[Protocols.GetBagReplyFields.items];
                BagModel.instance.addItemsByBagId(bagId, items);
                LogUtils.info(LogFlags.BagCtrl, "获取背包返回.................." + tuple);
            }

        }

        // 更新背包
        private updateBag(tuple: Protocols.UpdateBag): void {
            LogUtils.info(LogFlags.BagCtrl, "更新背包................" + tuple);
            BagModel.instance.updateBag(tuple);
        }

        // 使用道具
        public useProp(uid: number): void {

        }

        // 一键熔炼
        public oneKeySmelt(equips: Array<number>): void {
            Channel.instance.publish(UserFeatureOpcode.Smelt, [equips]);
        }

        //熔炼信息返回
        public smeltReply(tuple: Protocols.SmeltReply): void {
            let result: number = tuple[Protocols.WearEquipReplyFields.result];
            if (result) {

                if (result != ErrorCode.NotFoundItem) {
                    CommonUtil.noticeError(result);
                } else {
                    console.log(`熔炼返回错误码为---${result}`);
                }
            } else {
                BagModel.instance.updateSmeltInfo(tuple);
                GlobalData.dispatcher.event(CommonEventType.SMELT_SUCCEED);
            }
        }

        //

        // 穿戴装备
        public wearEquip(uid: number): void {
            Channel.instance.publish(UserFeatureOpcode.WearEquip, [uid]);
        }

        // 穿戴装备返回
        public wearEquipReply(tuple: Protocols.WearEquipReply): void {
            let result: number = tuple[Protocols.WearEquipReplyFields.result];
            if (result === 0) {
                SystemNoticeManager.instance.addNotice("装备成功");
                WindowManager.instance.close(WindowEnum.EQUIP_WEAR_ALERT);
            } else {
                // SystemNoticeManager.instance.addNotice(`装备失败：${result}`, "#ff0000");
                CommonUtil.noticeError(result);
            }
        }

        // 一键快速装备
        public fastWearEquip(): void {
            let uids: Array<number> = new Array<number>();
            let partDic: Dictionary = BagModel.instance.getBestEquipDic();
            for (let i: int = 0, len = partDic.values.length; i < len; i++) {
                uids.push(partDic.values[i][ItemFields.uid]);
            }
            Channel.instance.publish(UserFeatureOpcode.FastWearEquip, [uids]);
        }

        // 使用背包物品
        public useBagItem(uid: number, itemId: number, count: number = 1, exValue: number = 0): void {

            if (count < 1) {
                SystemNoticeManager.instance.addNotice("物品数量不足", true);
                return;
            }

            if (DEBUG) {
                if (typeof uid != "number" || typeof itemId != "number" || typeof count != "number" || typeof exValue != "number") {
                    throw new Error(`useBagItem(${uid}, ${itemId}, ${count}, ${exValue})`);
                }
            }
            LogUtils.info(LogFlags.BagCtrl, "使用背包物品................" + uid + "     " + itemId + "    " + count + "   " + exValue);
            // console.info("client 发送 = ", [uid, itemId, count, exValue], " 消息号：0x", (UserFeatureOpcode.useBagItem as Number).toString(16));
            Channel.instance.publish(UserFeatureOpcode.useBagItem, [uid, itemId, count, exValue]);
        }

        //.使用背包物品返回
        public useBagItemReply(value: useBagItemReply): void {
            LogUtils.info(LogFlags.BagCtrl, "使用背包物品返回......................." + value);
            let code: number = value[useBagItemReplyFields.result];
            CommonUtil.noticeError(code);
        }

        // 根据道具ID使用背包物品
        public useBagItemById(itemId: number, count: number = 1): void {
            LogUtils.info(LogFlags.BagCtrl, "根据道具ID使用背包物品..............." + itemId + "     " + count);
            if (count < 1) return;
            let items: Array<Item> = BagModel.instance.getItemsById(itemId);
            let num: int = 0;
            let flag: boolean = false;
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                let item: Item = items[i];
                num += item[ItemFields.count];
                if (num >= count) {
                    if (i === 0) {            // 第一个道具数量已经足够，直接使用
                        this.useBagItem(item[ItemFields.uid], itemId, count);
                    } else {
                        flag = true;
                    }
                    break;
                }
            }
            if (flag) {
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    let item: Item = items[i];
                    num = item[ItemFields.count];
                    if (count > num) {
                        this.useBagItem(item[ItemFields.uid], itemId, num);
                        count -= num;
                    } else {
                        this.useBagItem(item[ItemFields.uid], itemId, count);
                    }
                }
            } else {
                SystemNoticeManager.instance.addNotice("物品数量不足", true);
            }
        }

        // 根据道具ID和唯一ID使用背包物品（会判断道具使用条件）
        public useBagItemByIdUid(itemId: number, uid: number, count: number = 1): void {
            let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
            if (PlayerModel.instance.level < cfg[item_materialFields.useLvl]) {
                SystemNoticeManager.instance.addNotice("等级不足", true);
            } else if (VipModel.instance.vipLevel < cfg[item_materialFields.vipLvl]) {
                SystemNoticeManager.instance.addNotice("SVIP等级不足", true);
            } else {
                this.useBagItem(uid, itemId, count);
            }
        }

        // 装备初始化时重新判断熔炼装备
        private equipsInitedHandler(): void {
            BagModel.instance.setSmeltRank();
        }

        //功能未开启时
        private updateBagItemShow(tuple: Protocols.UpdateBagItemShow): void {
            let showId: number = tuple[Protocols.UpdateBagItemShowFields.showId];
            console.log("showidshowid", showId);

            if (showId == 4001) return;
            if (showId == 5001) return;// 基础幻武获取不展示
            if (showId == 90140) return;// 基础服装获取不展示
            //法阵获取不展示
            let typeNum = Math.floor(showId / 1000);
            if (typeNum == 9 || typeNum == 10) return;

            WindowManager.instance.openDialog(WindowEnum.COMMON_ACTIVE_ALERT, showId);
        }
        /**
         * 因为精灵获取无通知 登录显示vip后 显示精灵获得
         */
        public showWeaponGet() {
            WindowManager.instance.openDialog(WindowEnum.COMMON_ACTIVE_ALERT, RideRankCfg.instance.showIds[0]);
        }

        //更新监控自动熔炼
        private updateSmelt(): void {
            let restNum = BagModel.instance.getBagEnoughById(1);
            let isEnough: boolean = restNum > config.BlendCfg.instance.getCfgById(10007)[Configuration.blendFields.intParam][0];
            let isHaveZhizun: boolean = zhizun.ZhizunModel.instance.state == 1;
            if (!isEnough && isHaveZhizun) {
                // console.log(`更新监控自动熔炼--- `);
                BagModel.instance.quicklyOneKeySmelt();
            }
        }

        // 检测红点
        private checkRP(): void {
            BagModel.instance.checkRP();
        }
    }
}