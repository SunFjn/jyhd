///<reference path="../core/window_manager.ts"/>
///<reference path="../create_role/create_role_panel.ts"/>
///<reference path="../core/base_ctrl.ts"/>
///<reference path="../core/window_config.ts"/>
///<reference path="../effect/success_effect_ctrl.ts"/>
///<reference path="../pay_rank/pay_rank_model.ts"/>

/**
 * 玩家控制类
 */
module modules.player {
    import BaseCtrl = modules.core.BaseCtrl;
    import DropNoticeManager = modules.notice.DropNoticeManager;
    import Channel = net.Channel;
    import Income = Protocols.Income;
    import IncomeFields = Protocols.IncomeFields;
    import Item = Protocols.Item;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UpdateActorEquipFields = Protocols.UpdateActorEquipFields;
    import UpdateFight = Protocols.UpdateFight;
    import UpdateFightFields = Protocols.UpdateFightFields;
    import UpdateIncome = Protocols.UpdateIncome;
    import UpdateIncomeFields = Protocols.UpdateIncomeFields;
    import UpdateZQ = Protocols.UpdateZQ;
    import UpdateZQFields = Protocols.UpdateZQFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import Dictionary = Laya.Dictionary;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import Layer = ui.Layer;
    import UpdateServerDayFields = Protocols.UpdateServerDayFields;
    import GetServerDayReplyFields = Protocols.GetServerDayReplyFields;
    import UpdateTotalAttrFields = Protocols.UpdateTotalAttrFields;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import PayRankModel = modules.payRank.PayRankModel;


    export class PlayerCtrl extends BaseCtrl {
        private static _instance: PlayerCtrl;

        public static get instance(): PlayerCtrl {
            return PlayerCtrl._instance = PlayerCtrl._instance || new PlayerCtrl();
        }

        private _delayedArrItem: Array<Item>;

        private constructor() {
            super();
            this._delayedArrItem = new Array<Item>();
        }

        public setup(): void {
            // Channel.instance.subscribe(SystemClientOpcode.GetActorBaseAttrReply, this, this.getActorBaseAttrReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTotalAttr, this, this.updateTotalAttr);
            // Channel.instance.subscribe(SystemClientOpcode.UpdateLevel, this, this.updateLevel);
            Channel.instance.subscribe(SystemClientOpcode.UpdateExp, this, this.updateExp);
            Channel.instance.subscribe(SystemClientOpcode.UpdateMoney, this, this.UpdateMoney);
            Channel.instance.subscribe(SystemClientOpcode.GetActorEquipReply, this, this.GetActorEquipReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateActorEquip, this, this.updateActorEquip);
            // 更新战力
            Channel.instance.subscribe(SystemClientOpcode.UpdateFight, this, this.UpdateFight);
            // 更新魔力
            Channel.instance.subscribe(SystemClientOpcode.UpdateZQ, this, this.updateZQ);
            // 更新收益
            Channel.instance.subscribe(SystemClientOpcode.UpdateIncome, this, this.updateIncome);

            //Channel.instance.subscribe(SystemClientOpcode.GetSkillsReply, this, this.getSkillsReply);

            // GlobalData.dispatcher.once(CommonEventType.LOGIN_SUCCESS, this, this.onLoginSuccess);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);

            Channel.instance.subscribe(SystemClientOpcode.UpdateServerDay, this, this.UpdateServerDay);
            Channel.instance.subscribe(SystemClientOpcode.GetServerDayReply, this, this.GetServerDayReply);

        }

        //请求开服天数数据
        public getServerDay(): void {
            // 请求开服天数数据
            // console.log("请求开服天数数据");
            Channel.instance.publish(UserFeatureOpcode.GetServerDay, null);
        }

        private GetServerDayReply(tuple: Protocols.GetServerDayReply): void {
            PlayerModel.instance.openDay = tuple[GetServerDayReplyFields.day];
            // console.log("请求开服天数数据 返回 ", tuple);
        }

        private UpdateServerDay(tuple: Protocols.UpdateServerDay): void {
            if (!PlayerModel.instance.openDay) return;       // 没设置过开服天数不更新，防报错
            PlayerModel.instance.openDay = tuple[UpdateServerDayFields.day];
            // console.log("请求开服天数数据 更新 ", tuple);
        }

        // private onLoginSuccess(actorId: number): void {
        //     PlayerModel.instance.actorId = actorId;
        //     // 请求玩家基本属性
        //     Channel.instance.publish(UserFeatureOpcode.GetActorBaseAttr, null);
        // }

        // 初始化玩家基本信息，玩家身份认证成功或者创建登录成功后调用
        public initBaseInfo(actorId: number, baseInfo: ActorBaseAttr, isCreateRole: boolean): void {
            PlayerModel.instance.actorId = actorId;
            PlayerModel.instance.playerBaseAttr = baseInfo;
            // 登录成功后开始同步时间
            Channel.instance.publish(UserNexusOpcode.SynTime, [Browser.now()]);
            if (isCreateRole) {
                PlatParams.playerCreate();
                // PlatParams.playerLogin();
                PlatParams.recordStep(RecordStep.RoleCreated);
                PlatParams.recordStep(RecordStep.LoginSuccess);
            } else {
                // PlatParams.playerLogin();
                PlatParams.recordStep(RecordStep.LoginSuccess);
            }

            GlobalData.dispatcher.event(CommonEventType.LOGIN_SUCCESS);
        }

        // // 请求玩家基本属性返回
        // private getActorBaseAttrReply(tuple: Protocols.GetActorBaseAttrReply): void {
        //     PlayerModel.instance.playerBaseAttr = tuple;
        //     if (GlobalData.isCreateRole) {
        //         PlatParams.playerCreate();
        //         PlatParams.playerLogin();
        //     } else {
        //         PlatParams.playerLogin();
        //     }
        //     // console.log("getActorBaseAttrReply................." + tuple);
        // }

        // 服务器更新玩家总属性
        private updateTotalAttr(tuple: Protocols.UpdateTotalAttr): void {
            // 服务器发送非0的属性
            // let attrs: Array<TypesAttr> = PlayerModel.instance.playerTotolAttrs;
            // if (!attrs) {
            PlayerModel.instance.playerTotolAttrs = tuple[UpdateTotalAttrFields.totalAttr];
            // } else {
            //     let tAttrs = tuple[UpdateTotalAttrFields.totalAttr];
            //     let flag: boolean = false;
            //     for (let i: int = 0, len: int = tAttrs.length; i < len; i++) {       // 有的修改，没有的加入
            //         let att: attr = AttrUtil.getAttrByType(tAttrs[i][attrFields.type], attrs);
            //         if (att) {
            //             flag = att[attrFields.value] !== tAttrs[i][attrFields.value];
            //             att[attrFields.value] = tAttrs[i][attrFields.value];
            //         } else {
            //             flag = true;
            //             attrs.push(tAttrs[i]);
            //         }
            //     }
            //     if (flag) {
            //         PlayerModel.instance.playerTotolAttrs = PlayerModel.instance.playerTotolAttrs;
            //     }
            // }
            // console.log("updateTotalAttr....................." + tuple);
            // console.log("更新玩家总属性.........." + PlayerModel.instance.playerTotolAttrs[AttrFields.hp] + "   " + PlayerModel.instance.playerTotolAttrs[AttrFields.hpPer]);
        }

        // 更新等级
        // private updateLevel(tuple: Protocols.UpdateLevel): void {
        //     let level: number = tuple[Protocols.UpdateLevelFields.level];
        //     PlayerModel.instance.updateLevel(level);
        //     // 播放升级特效
        //     // SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
        // }

        // 更新经验
        private updateExp(tuple: Protocols.UpdateExp): void {
            let level: number = tuple[Protocols.UpdateExpFields.level];
            PlayerModel.instance.updateLevel(level);
            let exp: number = tuple[Protocols.UpdateExpFields.curExp];
            PlayerModel.instance.updateExp(exp);
        }

        // 更新货币
        private UpdateMoney(tuple: Protocols.UpdateMoney): void {
            PlayerModel.instance.UpdateMoney(tuple);
        }

        // 更新战力
        private UpdateFight(tuple: UpdateFight): void {
            PlayerModel.instance.UpdateFight(tuple[UpdateFightFields.fight]);
        }

        // 更新魔力
        private updateZQ(tuple: UpdateZQ): void {
            PlayerModel.instance.updateZQ(tuple[UpdateZQFields.count]);
        }

        // 更新收益
        private updateIncome(tuple: UpdateIncome): void {
            // 打怪掉落不入包提示
            let index: number = BagModel.instance.noTipSources.indexOf(tuple[UpdateIncomeFields.source]);
            if (index !== -1) return;
            let arr: Array<Item> = new Array<Item>();
            for (let i: int = 0, len: int = tuple[UpdateIncomeFields.incomes].length; i < len; i++) {
                let income: Income = tuple[UpdateIncomeFields.incomes][i];
                if (income[IncomeFields.type] === UnrealItemType.bind_gold) {
                    arr.push([MoneyItemId.bind_gold, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.copper) {
                    arr.push([MoneyItemId.copper, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.exp) {
                    arr.push([MoneyItemId.exp, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.gold) {
                    arr.push([MoneyItemId.glod, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.zq) {
                    arr.push([MoneyItemId.zq, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.runeExp) {
                    arr.push([MoneyItemId.fwjh, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.tiantiHonor) {
                    arr.push([MoneyItemId.honor, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.lingQi) {
                    arr.push([MoneyItemId.lingqi, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.riches) {
                    arr.push([MoneyItemId.fugui, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.adventurePoint) {
                    arr.push([MoneyItemId.adventurePoint, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.adventureYunli) {
                    arr.push([MoneyItemId.adventureYunli, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.contribution) {
                    arr.push([MoneyItemId.factionContribute, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.factionExp) {
                    arr.push([MoneyItemId.factionExp, income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.shenQiFragment) {
                    arr.push([income[IncomeFields.itemId], income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.xianDan) {
                    arr.push([income[IncomeFields.itemId], income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.xianYu) {
                    arr.push([income[IncomeFields.itemId], income[IncomeFields.param], 0, null]);
                }
                if (income[IncomeFields.type] === UnrealItemType.clanCoin) {
                    arr.push([MoneyItemId.clanCoin, income[IncomeFields.param], 0, null]);
                }
            }
            // 有面板打开时挂机收益不提示
            if (tuple[UpdateIncomeFields.source] === ItemSource.onhook) {
                if (arr.length > 0 && LayerManager.instance.getLayerById(Layer.UI_LAYER).numChildren === 0) DropNoticeManager.instance.addItems(arr);
            } else if (tuple[UpdateIncomeFields.source] === ItemSource.swimming) {
                modules.kunlun.KunLunModel.instance._all_Item = arr;
                GlobalData.dispatcher.event(CommonEventType.KUNLUN_SHOUYI);
            } else if ((tuple[UpdateIncomeFields.source] === ItemSource.payReward) ||
                (tuple[UpdateIncomeFields.source] === ItemSource.payRewardTen) ||
                (tuple[UpdateIncomeFields.source] === ItemSource.runeDial) ||
                (tuple[UpdateIncomeFields.source] === ItemSource.factionTurn) ||
                (tuple[UpdateIncomeFields.source] === ItemSource.duobao) ||
                (tuple[UpdateIncomeFields.source] === ItemSource.jzduobao)) {
                for (let index = 0; index < arr.length; index++) {
                    let element = arr[index];
                    if (element) {
                        this._delayedArrItem.push(element);
                    }
                }
            } else {
                DropNoticeManager.instance.addItems(arr);
            }
        }

        //转盘类延迟 虚拟道具（只有代币券？？） addItems
        //延时 addItems
        public delayedPutInAddItems(): void {
            if (this._delayedArrItem) {
                DropNoticeManager.instance.addItems(this._delayedArrItem);
                PlayerCtrl.instance._delayedArrItem.length = 0;
            }
        }

        // 获取角色装备
        public getActorEquip(): void {
            Channel.instance.publish(UserFeatureOpcode.GetActorEquip, null);
        }

        // 获取角色装备返回
        private GetActorEquipReply(tuple: Protocols.GetActorEquipReply): void {
            let equips: Array<Protocols.Item> = tuple[Protocols.GetActorEquipReplyFields.items];
            PlayerModel.instance.setEquips(equips);
            this.checkPartRP();
        }

        // 更新角色的穿戴装备
        private updateActorEquip(tuple: Protocols.UpdateActorEquip): void {
            PlayerModel.instance.wearEquips(tuple[UpdateActorEquipFields.partItem]);
            this.checkPartRP();
        }

        // 更新背包
        private updateBag(): void {
            this.checkPartRP();
        }

        private checkPartRP(): void {
            let flag: boolean = false;
            let dic: Dictionary = BagModel.instance.getBestEquipDic();
            for (let i: int = 0; i < 10; i++) {
                if (dic.get(i + 1)) {
                    flag = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("equipPartRP", flag);
        }
    }
}