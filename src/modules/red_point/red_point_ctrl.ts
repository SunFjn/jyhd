/** 红点控制器*/

///<reference path="../func_open/func_open_model.ts"/>


namespace modules.redPoint {
    import RedPointProperty = ui.RedPointProperty;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Sprite = Laya.Sprite;
    //                              紅點名字           是否已經顯示過
    type typeShowOnceLogin = [keyof RedPointProperty, boolean];

    export class RedPointCtrl {
        private static _instance: RedPointCtrl;
        public static get instance(): RedPointCtrl {
            return this._instance = this._instance || new RedPointCtrl();
        }

        private _rpImgs: Array<Sprite>;
        private _propertyNamesArr: Array<Array<keyof RedPointProperty>>;
        private _funcIdsTable: Table<Array<ActionOpenId>>;
        //登陆期间只显示一次的红点，点过后就不在显示,可做提示作用，只能控制单个红点的图片
        private _showOnceLogin: Array<typeShowOnceLogin> = new Array<typeShowOnceLogin>();

        // 属性值table
        private _propertyValueTable: Table<boolean>;

        constructor() {
            this._rpImgs = [];
            this._propertyNamesArr = [];
            this._propertyValueTable = {};
            this._funcIdsTable = {};
            this.setup();
            this.setShowOnceLogin();

            this.registeFuncIds("petFeedSkillRP", [ActionOpenId.petFeed]);        // 宠物培养技能红点
            this.registeFuncIds("petFeedMatRP", [ActionOpenId.petFeed]);         // 宠物培养材料红点
            this.registeFuncIds("petRankSkillRP", [ActionOpenId.petRank]);        // 宠物进阶技能红点
            this.registeFuncIds("petIllusionRP", [ActionOpenId.petMagicShow]);              //宠物幻化红点
            this.registeFuncIds("petRefineMaterialRP", [ActionOpenId.petRefine]);   // 宠物修炼材料红点
            this.registeFuncIds("weaponFeedSkillRP", [ActionOpenId.rideFeed]);     // 精灵培养技能红点
            this.registeFuncIds("weaponFeedMatRP", [ActionOpenId.rideFeed]);       // 精灵培养材料红点
            this.registeFuncIds("weaponIllusionRP", [ActionOpenId.rideMagicShow]);              //精灵幻化红点
            this.registeFuncIds("weaponRankSkillRP", [ActionOpenId.rideRank]);     // 精灵进阶技能红点
            this.registeFuncIds("weaponRefineMaterialRP", [ActionOpenId.rideRefine]);// 精灵修炼材料红点
            this.registeFuncIds("weaponIllusionRP");           //幻化页签红点
            this.registeFuncIds("talismanRP", [ActionOpenId.amulet]);           // 圣物红点
            this.registeFuncIds("intensiveRP", [ActionOpenId.strong]);          // 强化红点
            this.registeFuncIds("stoneRP", [ActionOpenId.gem]);              // 仙石红点
            this.registeFuncIds("exerciseRP", [ActionOpenId.lilian]);           // 历练红点
            this.registeFuncIds("bornRP", [ActionOpenId.era]);               // 觉醒红点
            this.registeFuncIds("sevenDayGiftRP", [ActionOpenId.sevenDay]);       // 七日礼红点
            this.registeFuncIds("magicArtRP", [ActionOpenId.skill]);           // 技能红点
            this.registeFuncIds("goldBodyRP", [ActionOpenId.soul]);           // 金身红点
            this.registeFuncIds("magicPositionRP", [ActionOpenId.xianwei]);      // 成就红点
            this.registeFuncIds("vipRP", [ActionOpenId.vip]);                // vip红点
            this.registeFuncIds("vipNewRP", [ActionOpenId.vipF]);                // vip红点
            this.registeFuncIds("immortalsShengjiRP", [ActionOpenId.shenbingFeed]);   // 幻武升级红点
            this.registeFuncIds("immortalsHuanhuaJipinRP", [ActionOpenId.shenbingMagicShow]);   // 幻武极品红点
            this.registeFuncIds("immortalsHuanhuaZhenpinRP", [ActionOpenId.shenbingMagicShow]); //幻武珍品红点
            this.registeFuncIds("immortalsHuanhuaJuepinRP", [ActionOpenId.shenbingMagicShow]);  // 幻武绝品红点
            this.registeFuncIds("immortalsHuanhuaDianchangRP", [ActionOpenId.shenbingMagicShow]);  // 幻武绝品红点
            this.registeFuncIds("immortalsFuhunRP", [ActionOpenId.shenbingRefine]);     // 幻武附魂红点
            this.registeFuncIds("wingShengjiRP", [ActionOpenId.wingFeed]);        // 翅膀升级红点
            this.registeFuncIds("wingHuanhuaJipinRP", [ActionOpenId.wingMagicShow]);   // 翅膀幻化极品红点
            this.registeFuncIds("wingHuanhuaZhenpinRP", [ActionOpenId.wingMagicShow]); // 翅膀幻化珍品红点
            this.registeFuncIds("wingHuanhuaJuepinRP", [ActionOpenId.wingMagicShow]);  // 翅膀幻化绝品红点
            this.registeFuncIds("wingHuanhuaDianchangRP", [ActionOpenId.wingMagicShow]);  // 翅膀幻化典藏红点
            this.registeFuncIds("wingFuhunRP", [ActionOpenId.wingRefine]);          // 翅膀附魂红点
            this.registeFuncIds("dailyDungeonRP", [ActionOpenId.shilian]);           // 玩法试炼红点
            this.registeFuncIds("monthCardRP", [ActionOpenId.monthCard]);          // 月卡红点
            this.registeFuncIds("weekCardRP", [ActionOpenId.weekCard]);          // 周卡红点
            this.registeFuncIds("weekXianyuRP", [ActionOpenId.weekXianyu]);          // 点券周卡红点
            this.registeFuncIds("weekYuanbaoRP", [ActionOpenId.weekYuanbao]);          // 代币券周卡红点
            this.registeFuncIds("heroAuraRP", [ActionOpenId.heroAura]);          // 代币券周卡红点
            this.registeFuncIds("demonOrderGiftRP", [ActionOpenId.demonOrderGift]);          // 代币券周卡红点
            this.registeFuncIds("bigTowerRP", [ActionOpenId.dahuang]);           // 大荒红点
            this.registeFuncIds("multiBossRP", [ActionOpenId.multiBoss]);          // 多人BOSS红点
            this.registeFuncIds("threeWorldsRP", [ActionOpenId.threeWorldsBoss]);        // 三界BOSS红点
            this.registeFuncIds("bossHomeRP", [ActionOpenId.bossHome]);           // BOSS之家
            this.registeFuncIds("shenYuBossRP", [ActionOpenId.shengYu]);           // 圣域BOSS
            this.registeFuncIds("singleBossRP", [ActionOpenId.singleBossCopy]);       //单人boss红点
            this.registeFuncIds("equipPartRP");                                            // 装备部位红点
            this.registeFuncIds("signRP", [ActionOpenId.sign]);                //签到红点
            this.registeFuncIds("onlineGiftRP", [ActionOpenId.onlineReward]);          //在线礼包红点
            this.registeFuncIds("composeRP", [ActionOpenId.compose]);           //合成红点
            this.registeFuncIds("resolveRP", [ActionOpenId.resolve]);             //分解红点
            this.registeFuncIds("missionRP", [ActionOpenId.tianguan]);            // 天关红点
            this.registeFuncIds("treasureRP", [ActionOpenId.xunbao]);            // 探索红点
            this.registeFuncIds("firstPayRP", [ActionOpenId.firstPay]);            //首充红点
            this.registeFuncIds("treasureExchangeRP", [ActionOpenId.xunbaoExchange]);   // 探索兑换红点
            this.registeFuncIds("teamBattleRP", [ActionOpenId.teamCopy]);   // 组队副本红点
            this.registeFuncIds("dailyDemonRP", [ActionOpenId.xiangyao]);       //每日降妖红点
            this.registeFuncIds("runeCopyRP", [ActionOpenId.runeCopy]);       //未央幻境副本
            this.registeFuncIds("daypayRP", [ActionOpenId.dayPay]);           //日充入口红点
            this.registeFuncIds("cumulateRP", [ActionOpenId.cumulatePay]);     //累充入口红点
            this.registeFuncIds("runeRP", [ActionOpenId.rune]);                //玉荣功能红点
            this.registeFuncIds("zeroBuyOneRP", [ActionOpenId.zeroBuy]);   // 零元购档次一红点
            this.registeFuncIds("zeroBuyTwoRP", [ActionOpenId.zeroBuy]); //零元购档次二红点
            this.registeFuncIds("zeroBuyThreeRP", [ActionOpenId.zeroBuy]);  // 零元购档次三红点
            this.registeFuncIds("zeroBuyFourRP", [ActionOpenId.zeroBuy]);  // 零元购档次四红点
            this.registeFuncIds("zeroBuyEntranceRP", [ActionOpenId.zeroBuy]);  // 零元购档次入口红点
            this.registeFuncIds("magicPetFazhenJipinRP", [ActionOpenId.petFazhen]);   // 宠物法阵极品红点
            this.registeFuncIds("magicPetFazhenZhenpinRP", [ActionOpenId.petFazhen]); //宠物法阵珍品红点
            this.registeFuncIds("magicPetFazhenJuepinRP", [ActionOpenId.petFazhen]);  // 宠物法阵绝品红点
            this.registeFuncIds("weaponFazhenJipinRP", [ActionOpenId.rideFazhen]);   // 精灵法阵极品红点
            this.registeFuncIds("weaponFazhenZhenpinRP", [ActionOpenId.rideFazhen]); //精灵法阵珍品红点
            this.registeFuncIds("weaponFazhenJuepinRP", [ActionOpenId.rideFazhen]);  //精灵法阵绝品红点
            this.registeFuncIds("activityAllItemRP", [ActionOpenId.actionList]);       //活动列表红点
            this.registeFuncIds("yunMengBossRP", [ActionOpenId.cloudlandCopy]);       //云梦秘境
            this.registeFuncIds("zzRP", [ActionOpenId.HolyEquip]);                //至尊功能红点

            this.registeFuncIds("kuangHuanRP", [ActionOpenId.kuanghuan2]);       //全民狂欢红点
            this.registeFuncIds("kuangHuanLevelRP", [ActionOpenId.kuanghuan]);       //全民等级狂欢红点
            this.registeFuncIds("kuangHuanPowarRP", [ActionOpenId.kuanghuan3]);       //全民等级狂欢红点

            this.registeFuncIds("investLoginRP", [ActionOpenId.investLogin]);       //登录返利 切页 红点
            this.registeFuncIds("investRecruitRP", [ActionOpenId.investRecruit]);       //闯关返利 切页 红点
            this.registeFuncIds("investGrowthRP", [ActionOpenId.investReward]);       //成长返利 切页 红点

            this.registeFuncIds("continuePayRP", [ActionOpenId.continuePay]);       //连充 切页 红点
            this.registeFuncIds("cumulateRP", [ActionOpenId.cumulatePay]);       //累充 切页 红点
            this.registeFuncIds("consumeRP", [ActionOpenId.consumeReward]);       //消费赠礼 切页 红点
            this.registeFuncIds("payRewardRP", [ActionOpenId.payReward]);       //充值抽奖红点
            this.registeFuncIds("dayconsumeRP", [ActionOpenId.consumeReward2]);       //消费赠礼2 切页 红点


            this.registeFuncIds("sprintRankXianQiRP", [ActionOpenId.sprintRank]);       //精灵排行 切页 红点
            this.registeFuncIds("sprintRankLingChongRP", [ActionOpenId.sprintRank2]);       //宠物排行 切页 红点
            this.registeFuncIds("sprintRankShenBingRP", [ActionOpenId.sprintRank3]);       //幻武排行 切页 红点
            this.registeFuncIds("sprintRankXianYiRP", [ActionOpenId.sprintRank4]);       //翅膀排行 切页 红点
            this.registeFuncIds("sprintRankFaBaoRP", [ActionOpenId.sprintRank5]);       //仙法排行 切页 红点
            this.registeFuncIds("sprintRankEquipmentRP", [ActionOpenId.sprintRank6]);       //装备排行 切页 红点
            this.registeFuncIds("sprintRankFighitingRP", [ActionOpenId.sprintRank7]);       //战力排行 切页 红点

            this.registeFuncIds("guShenRP", [ActionOpenId.gushen]);       //古神问道 切页 红点
            this.registeFuncIds("cumulate2RP", [ActionOpenId.cumulatePay2]);       //每日累充 切页 红点
            this.registeFuncIds("cumulate3RP", [ActionOpenId.cumulatePay3]);       //daw 消费赠礼3 切页 红点
            this.registeFuncIds("discountGiftPayRP", [ActionOpenId.payReward]);       //特惠礼包红点

            this.registeFuncIds("xunBao1", [ActionOpenId.xunbaoExchange]);   // 探索红点1
            this.registeFuncIds("xunBao2", [ActionOpenId.xunbaoExchange]);   // 探索红点2
            this.registeFuncIds("xunBao3", [ActionOpenId.xunbaoExchange]);   // 探索红点3
            this.registeFuncIds("xunBao4", [ActionOpenId.xunbaoExchange]);   // 探索红点4

            this.registeFuncIds("bagRP", [ActionOpenId.bag]);   // 背包切页红点
            this.registeFuncIds("smeltRP", [ActionOpenId.smelt]);   // 熔炼切页红点
            this.registeFuncIds("shenqiRP", [ActionOpenId.shenqi]);   // 神器切页红点

            this.registeFuncIds("shangchengRP", [ActionOpenId.store]);   // 商城切页红点
            this.registeFuncIds("shangdianRP", [ActionOpenId.store]);   // 商店切页红点

            this.registeFuncIds("emailRP", [ActionOpenId.recharge]);   // 邮件切页红点
            this.registeFuncIds("rechargeRP", [ActionOpenId.recharge]);   // 充值切页红点
            this.registeFuncIds("rankingListRP", [ActionOpenId.paihangbang]);   // 排行榜切页红点
            this.registeFuncIds("tianTiRP", [ActionOpenId.tianti]);   // 天梯按钮红点
            this.registeFuncIds("actionPreviewEnterRP", [ActionOpenId.actionPreviewEnter]);   // 功能预览入口空点

            this.registeFuncIds("playerTitleRP", [ActionOpenId.playerTitle]);   // 功能预览入口空点
            this.registeFuncIds("soaringRankRP", [ActionOpenId.soaringRank]);   // 封神榜切页入口红点

            this.registeFuncIds("soaringCumulatePayRP", [ActionOpenId.cumulatePayFS]);   // 累计充值（封神榜）切页红点
            this.registeFuncIds("soaringDayConsumeRewardRP", [ActionOpenId.consumeRewardFS]);   // 消费赠礼（封神榜)切页红点
            this.registeFuncIds("soaringPanicBuyingGifRP", [ActionOpenId.rushBuyFS]);   // 抢购礼包（封神榜切页红点 
            this.registeFuncIds("soaringSinglePayRP", [ActionOpenId.paySingleFS]);   // 单笔充值（封神榜）切页红点
            this.registeFuncIds("soaringSpecialGiftRP", [ActionOpenId.discountGiftFS]);   // 特惠礼包（封神榜）切页红点

            this.registeFuncIds("everyDayRebateRP", [ActionOpenId.everydayRebate]);   // 天天返利切页红点
            this.registeFuncIds("equipmentZuHunRP", [ActionOpenId.zhuhun]);          // 铸魂红点

            this.registeFuncIds("rotaryTableSoaringRP", [ActionOpenId.duobao]);          //封神转盘切页红点
            this.registeFuncIds("cumulatePayShenHunRP", [ActionOpenId.singlePayJade]);          //单笔充值（炽星魔锤）
            this.registeFuncIds("cumulatePayTianZhuRP", [ActionOpenId.singlePayPrint]);          //单笔充值（天尊）

            this.registeFuncIds("loginRewardRP", [ActionOpenId.loginReward]);//登录豪礼切页红点
            this.registeFuncIds("rotaryTableJiuZhouRP", [ActionOpenId.jzduobao]);          //九州夺宝切页红点
            this.registeFuncIds("weekLoginRP", [ActionOpenId.weekLogin]);    //周末登录切页红点
            this.registeFuncIds("feedBackRP", [ActionOpenId.feedBack]);          //意见反馈入口红点
            this.registeFuncIds("announcementRP", [ActionOpenId.announcement]);          //意见反馈入口红点

            this.registeFuncIds("payRankRP", [ActionOpenId.consumeRank]);//消费排行
            this.registeFuncIds("invitationRP", [ActionOpenId.invitationEnter]);//邀请有礼
            this.registeFuncIds("shangchengRP", [ActionOpenId.store_1]);//商城免费商品

            this.registeFuncIds("zxianYuBagPanelRP", [ActionOpenId.xianYu3]);//点券背包红点
            this.registeFuncIds("zxianYuPanelRP", [ActionOpenId.xianYu]);//点券红点
            this.registeFuncIds("zxianYuStorePanelRP", [ActionOpenId.xianYu2]);//点券商店红点
            this.registeFuncIds("zxianYuTreasurePanelRP", [ActionOpenId.xianYu1]);//点券抽奖红点

            this.registeFuncIds("fashionShengJiRP", [ActionOpenId.fashionFeed]);        // 时装升级红点
            this.registeFuncIds("fashionShengJiMatRP", [ActionOpenId.fashionFeed]);     // 时装升级材料红点
            this.registeFuncIds("fashionHuanHuaJiPinRP", [ActionOpenId.fashionMagicShow]);      // 时装幻化极品红点
            this.registeFuncIds("fashionHuanHuaZhenPinRP", [ActionOpenId.fashionMagicShow]);        // 时装幻化珍品红点
            this.registeFuncIds("fashionHuanHuaJuePinRP", [ActionOpenId.fashionMagicShow]);         // 时装幻化绝品红点
            this.registeFuncIds("fashionHuanHuaDianchangRP", [ActionOpenId.fashionMagicShow]);      // 时装幻化典藏红点
            this.registeFuncIds("fashionFuHunRP", [ActionOpenId.fashionRefine]);                    // 时装附魂红点

            this.registeFuncIds("guanghuanShengJiRP", [ActionOpenId.guangHuanShengJi]);        // 光环升级红点
            this.registeFuncIds("guanghuanShengJiMatRP", [ActionOpenId.guangHuanShengJi]);     // 光环升级材料红点
            this.registeFuncIds("guanghuanHuanHuaJiPinRP", [ActionOpenId.guangHuanHuanHua]);      // 光环幻化极品红点
            this.registeFuncIds("guanghuanHuanHuaZhenPinRP", [ActionOpenId.guangHuanHuanHua]);        // 光环幻化珍品红点
            this.registeFuncIds("guanghuanHuanHuaJuePinRP", [ActionOpenId.guangHuanHuanHua]);         // 光环幻化绝品红点
            this.registeFuncIds("guanghuanHuanHuaDianchangRP", [ActionOpenId.guangHuanHuanHua]);      // 光环幻化典藏红点
            this.registeFuncIds("guanghuanFuHunRP", [ActionOpenId.guangHuanFuHun]);                    // 光环附魂红点

            this.registeFuncIds("tianZhuShengJiRP", [ActionOpenId.tianZhuFeed]);                    // 神兽升级红点
            this.registeFuncIds("tianZhuShengJiMatRP", [ActionOpenId.tianZhuFeed]);                 // 神兽升级材料红点
            this.registeFuncIds("tianZhuHuanHuaJiPinRP", [ActionOpenId.tianZhuMagicShow]);          // 神兽幻化极品红点
            this.registeFuncIds("tianZhuHuanHuaZhenPinRP", [ActionOpenId.tianZhuMagicShow]);          // 神兽幻化珍品红点
            this.registeFuncIds("tianZhuHuanHuaJuePinRP", [ActionOpenId.tianZhuMagicShow]);          // 神兽幻化绝品红点
            this.registeFuncIds("tianZhuFuHunRP", [ActionOpenId.tianZhuRefine]);          // 神兽附魂红点

            this.registeFuncIds("equipSuitRP_0", [ActionOpenId.equipSuit]);         // 套装红点
            this.registeFuncIds("equipSuitRP_1", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_2", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_3", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_4", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_5", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_6", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_7", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_8", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_9", [ActionOpenId.equipSuit]);
            
            this.registeFuncIds("equipSuitRP_10", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_11", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_12", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_13", [ActionOpenId.equipSuit]);
            this.registeFuncIds("equipSuitRP_14", [ActionOpenId.equipSuit]);

            this.registeFuncIds("preventFoolRP", [ActionOpenId.preventFool])
            this.registeFuncIds("theCarnivalRP", [ActionOpenId.theCarnival]);
            this.registeFuncIds("theSuperVipRP", [ActionOpenId.superVip]);
            this.registeFuncIds("everydayFirstPayRP", [ActionOpenId.everyday_firstpay]);
            this.registeFuncIds("customTitleRP", [ActionOpenId.customTitle]);
            this.registeFuncIds("CeremonyDanbiRP", [ActionOpenId.singleRecharge]);   // 单笔充值（开服活动）切页红点
            this.registeFuncIds("ceremonyContinuePayRP", [ActionOpenId.ceremonyContinuePay]);       //开服 连充 切页 红点

            this.registeFuncIds("ExplicitSuitBest", [ActionOpenId.explicitSuitBest]);     //外显套装-极品
            this.registeFuncIds("ExplicitSuitUnique", [ActionOpenId.explicitSuitBest]);     //外显套装-绝品
            this.registeFuncIds("ExplicitSuitCollection", [ActionOpenId.explicitSuitCollecttion]);     //外显套装-典藏
        }

        private registeFuncIds(property: keyof RedPointProperty, funcIds: Array<ActionOpenId> = null): void {
            this._funcIdsTable[property] = funcIds;
        }

        public setup(): void {
            GlobalData.dispatcher.on(CommonEventType.RED_POINT, this, this.rpHandler);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.checkRedPoints);
        }

        //登陆期间只显示一次的红点数组注册
        public setShowOnceLogin(): void {
            this.registerShowOnceLogin("theSuperVipRP");
            this.registerShowOnceLogin("customTitleRP");
        }

        private registerShowOnceLogin(rpName: keyof RedPointProperty): void {
            this._showOnceLogin.push([rpName, false]);
        }

        //检测每次登陆只显示一次的红点的状态是否已经显示过
        private checkRPByOnlyShowOnce(rpName: keyof RedPointProperty, flag: boolean): boolean {
            if (!flag) {
                return flag;
            }

            for (let index = 0, len = this._showOnceLogin.length; index < len; index++) {
                const curRPData = this._showOnceLogin[index];
                if (rpName == curRPData[0]) return !curRPData[1];
            }

            return flag;
        }

        //获取每次登陆只显示一次的红点的状态
        public getRPStatusByOnlyShowOnce(rpName: keyof RedPointProperty): boolean {
            for (let index = 0, len = this._showOnceLogin.length; index < len; index++) {
                const curRPData = this._showOnceLogin[index];
                if (rpName == curRPData[0]) {
                    return !curRPData[1] && this._propertyValueTable[rpName];
                }
            }

            console.error("@@@ 意外的红点参数:" + rpName);
            return false;
        }

        private rpHandler(propertyName: keyof RedPointProperty): void {
            this.checkRedPoints();
        }

        // 注册红点
        public registeRedPoint(rpImg: Sprite, propertyNames: Array<keyof RedPointProperty>): void {
            let index: int = this._rpImgs.indexOf(rpImg);
            if (index === -1) {
                this._rpImgs.push(rpImg);
                this._propertyNamesArr.push(propertyNames);
            } else {
                this._rpImgs[index] = rpImg;
                this._propertyNamesArr[index] = propertyNames;
            }
            this.checkRedPoint(rpImg);
        }

        // 取消注册红点
        public retireRedPoint(rpImg: Sprite): void {
            let index = ArrayUtils.remove(this._rpImgs, rpImg);
            if (index !== -1) {
                ArrayUtils.removeAt(this._propertyNamesArr, index);
            }
        }

        // 检测所有红点
        private checkRedPoints(): void {
            if (this._rpImgs && this._rpImgs.length > 0) {
                for (let i: int = 0, len: int = this._rpImgs.length; i < len; i++) {
                    this.checkRedPoint(this._rpImgs[i]);
                }
            }
        }

        // 检测红点
        private checkRedPoint(rpImg: Sprite): void {
            let index: int = this._rpImgs.indexOf(rpImg);
            if (index !== -1) {
                let propertyNames: Array<keyof RedPointProperty> = this._propertyNamesArr[index];
                let flag: boolean = false;
                for (let i: int = 0, len: int = propertyNames.length; i < len; i++) {
                    flag = flag || this._propertyValueTable[propertyNames[i]];
                    if (flag) {
                        // 判断功能是否开启
                        let funcIds: Array<ActionOpenId> = this._funcIdsTable[propertyNames[i]];
                        if (funcIds) {
                            for (let i: int = 0, len: int = funcIds.length; i < len; i++) {
                                if (funcIds[i] === ActionOpenId.begin) continue;
                                flag = FuncOpenModel.instance.getFuncIsOpen(funcIds[i]);
                                if (!flag) break;
                            }
                        }
                        if (flag) break;
                    }
                }
                //登陆期间只显示一次的校验,只能控制单个红点的图片
                flag = this.checkRPByOnlyShowOnce(propertyNames[0], flag);

                rpImg.visible = flag;
            }
        }

        // 关闭红点显示（针对登陆期间只显示一次的红点）
        public checkCloseOnceStatus(name: keyof RedPointProperty, value: boolean) {
            if (value) return;

            for (let index = 0, len = this._showOnceLogin.length; index < len; index++) {
                const curRPData = this._showOnceLogin[index];
                if (name == curRPData[0] && this._propertyValueTable[name] === true) {
                    curRPData[1] = true;
                }
            }
        }

        // 设置属性
        public setRPProperty(name: keyof RedPointProperty, value: boolean) {
            this.checkCloseOnceStatus(name, value);
            if (this._propertyValueTable[name] !== true) this._propertyValueTable[name] = false;
            if (this._propertyValueTable[name] !== value) {
                this._propertyValueTable[name] = value;
                GlobalData.dispatcher.event(CommonEventType.RED_POINT, name);
            }
        }

        // 获取红点属性的值
        public getRPProperty(name: keyof RedPointProperty): boolean {
            return this._propertyValueTable[name];
        }
    }
}