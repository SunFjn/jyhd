///<reference path="../quick_use/quick_use_ctrl.ts"/>
///<reference path="../mission/mission_ctrl.ts"/>
///<reference path="../npc/npc_ctrl.ts"/>
///<reference path="../sweeping_income/sweeping_income_ctrl.ts"/>
///<reference path="../firt_login_alert/first_login_alert_ctrl.ts"/>
///<reference path="../once_reward/once_reward_ctrl.ts"/>
///<reference path="../real_name/real_name_ctrl.ts"/>
///<reference path="../official_account/official_account_ctrl.ts"/>
///<reference path="../gloves/gloves_ctrl.ts"/>
///<reference path="../one_buy/one_buy_ctrl.ts"/>
///<reference path="../fight_talisman/fight_talisman_ctrl.ts"/>
/// <reference path="../money_cat/money_cat_ctrl.ts" />
/// <reference path="../xian_dan/xian_dan_ctrl.ts" />
///<reference path="../rename/rename_ctrl.ts"/>
///<reference path="../sheng_yu/sheng_yu_boss_ctrl.ts"/>
///<reference path="../the_carnival/the_carnival_ctrl.ts"/>
///<reference path="../mission_party/mission_party_ctrl.ts"/>
///<reference path="../mission_party_award/mpaward_ctrl.ts"/>
///<reference path="../res_back/res_back_ctrl.ts"/>
///<reference path="../clan/clan_ctrl.ts"/>
///<reference path="../xuanhuo/xuanhuo_ctrl.ts"/>
///<reference path="../extreme/extreme_ctrl.ts"/>
///<reference path="../cashEquip/cashEquip_ctrl.ts"/>
///<reference path="../jiuxiaoling/jiuxiaoling_ctrl.ts"/>
///<reference path="../custom_title/custom_title_ctrl.ts"/>
///<reference path="../drop_carnival/drop_carnival_ctrl.ts"/>
///<reference path="../ceremony_cash/ceremony_cash_ctrl.ts"/>
///<reference path="../ceremony_geocaching/ceremony_geocaching_ctrl.ts"/>
///<reference path="../limit_one_discount/limit_one_discount_ctrl.ts"/>
///<reference path="../marry/marry_ctrl.ts"/>
///<reference path="../ceremony_cash/ceremony_danbi_ctrl.ts"/>
///<reference path="../ceremony_cash/ceremony_continue_pay_ctrl.ts"/>
///<reference path="../fish/fish_ctrl.ts"/>
///<reference path="../limit/limit_gift_ctrl.ts"/>
///<reference path="../limit/limit_link_ctrl.ts"/>
///<reference path="../fish/fish_ck_ctrl.ts"/>
///<reference path="../limit/limit_reap_ctrl.ts"/>
///<reference path="../limit/limit_shop_ctrl.ts"/>
///<reference path="../limit/limit_rank_ctrl.ts"/>
///<reference path="../limit/limit_cumulate_ctrl.ts"/>
///<reference path="../limit/limit_day_cumulate_ctrl.ts"/>
///<reference path="../limit/limit_day_single_ctrl.ts"/>

///<reference path="../seven_activity/seven_activity_ctrl.ts"/>
///<reference path="../week_card/week_yuanbao_ctrl.ts"/>
///<reference path="../week_card/week_xianyu_ctrl.ts"/>
///<reference path="../week_card/week_card_ctrl.ts"/>
///<reference path="../hero_aura/hero_aura_ctrl.ts"/>
///<reference path="../demon_order_gift/demon_order_gift_ctrl.ts"/>
///<reference path="../di_shu/di_shu_ctrl.ts"/>
///<reference path="../redpack/redpack_ctrl.ts"/>
///<reference path="../explicit_suit/explicit_suit_ctrl.ts"/>
///<reference path="../guanghuan/guanghuan_ctrl.ts"/>

///<reference path="../zhulu/zhulu_ctrl.ts"/>
/** 模块初始化写在这里*/

namespace modules.common {
    import QuickUseCtrl = modules.quickUse.QuickUseCtrl;
    import MissionCtrl = modules.mission.MissionCtrl;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import SignCtrl = modules.sign.SignCtrl;
    import MagicWeaponCtrl = modules.magicWeapon.MagicWeaponCtrl;
    import OnlineGiftCtrl = modules.onlineGift.OnlineGiftCtrl;
    import TalismanCtrl = modules.talisman.TalismanCtrl;
    import IntensiveCtrl = modules.intensive.IntensiveCtrl;
    import StoneCtrl = modules.stone.StoneCtrl;
    import ComposeCtrl = modules.compose.ComposeCtrl;
    import PlayerRankingCtrl = modules.rankingList.PlayerRankingCtrl;
    import MonthCardCtrl = modules.monthCard.MonthCardCtrl;
    import ImmortalsCtrl = modules.immortals.ImmortalsCtrl;
    import ThreeWorldsCtrl = modules.threeWorlds.ThreeWorldsCtrl;
    import MultiBossCtrl = modules.multiBoss.MultiBossCtrl;
    import WingCtrl = modules.wing.WingCtrl;
    import RechargeCtrl = modules.recharge.RechargeCtrl;
    import BuffCtrl = modules.buff.BuffCtrl;
    import LineClearOutCtrl = modules.lineClearOut.LineClearOutCtrl;
    import ActivityPreviewCtrl = modules.activityPreview.ActivityPreviewCtrl;
    import NineCtrl = modules.nine.NineCtrl;
    import ZerobuyCtrl = modules.zerobuy.ZerobuyCtrl;
    import NpcCtrl = modules.npc.NpcCtrl;
    import PayRewardCtrl = modules.pay_reward.PayRewardCtrl;
    import KunLunCtrl = modules.kunlun.KunLunCtrl;
    import YunMengMiJingCtrl = modules.yunmeng.YunMengMiJingCtrl;
    import DayConsumeRewardCtrl = modules.day_consume_reward.DayConsumeRewardCtrl;
    import XianfuCtrl = modules.xianfu.XianfuCtrl;
    import actionPreviewCtrl = modules.action_preview.actionPreviewCtrl;
    import PlayerTitleCtrl = modules.player_title.PlayerTitleCtrl;
    import EquipSuitCtrl = modules.equipSuit.EquipSuitCtrl;
    import OpenAwardCtrl = modules.openAward.OpenAwardCtrl;
    import WeekLoginCtrl = modules.week_login.WeekLoginCtrl;
    import SinglePayCtrl = modules.singlePay.SinglePayCtrl;
    import RepeatPayCtrl = modules.repeatPay.RepeatPayCtrl;
    import ZhizunCtrl = modules.zhizun.ZhizunCtrl;
    import LimitPackCtrl = modules.limit_pack.LimitPackCtrl;
    import PayRankCtrl = modules.payRank.PayRankCtrl;
    import FirstPayCtrl = modules.first_pay.FirstPayCtrl;
    import OfflineCtrl = modules.Offline.OfflineCtrl;
    import DayPayCtrl = modules.day_pay.DayPayCtrl;
    import CumulatePayModelCtrl = modules.cumulate_pay.CumulatePayModelCtrl;
    import ContinuePayCtrl = modules.continue_pay.ContinuePayCtrl;
    import ConsumeRewardCtrl = modules.cousume_reward.ConsumeRewardCtrl;
    import InvestRewardCtrl = modules.invest_reward.InvestRewardCtrl;
    import SprintRankTaskCtrl = modules.sprint_rank.SprintRankTaskCtrl;
    import LadderCtrl = modules.ladder.LadderCtrl;
    import SprintRankCtrl = modules.sprint_rank.SprintRankCtrl;
    import GushenCtrl = modules.gushen.GushenCtrl;
    import KuangHuanCtrl = modules.kuanghuan.KuangHuanCtrl;
    import GuideCtrl = modules.guide.GuideCtrl;
    import SoundCtrl = modules.sound.SoundCtrl;
    import InvitationCtrl = modules.invitation.InvitationCtrl;
    import SingleBossCtrl = modules.single_boss.SingleBossCtrl;
    import TreasureCtrl = modules.treasure.TreasureCtrl;
    import DayDropTreasureCtrl = modules.day_drop_treasure.DayDropTreasureCtrl;
    import DiscountGiftCtrl = modules.discountGift.DiscountGiftCtrl;

    import Cumulate2PayCtrl = modules.cumulate2_pay.Cumulate2PayCtrl;
    /**daw  */
    import Cumulate3PayCtrl = modules.cumulate3_pay.Cumulate3PayCtrl;
    import AdventureCtrl = modules.adventure.AdventureCtrl;
    import FactionCtrl = modules.faction.FactionCtrl;
    import ArenaCtrl = modules.arena.ArenaCtrl;
    import SoaringRankCtrl = modules.soaring_rank.SoaringRankCtrl;
    import SoaringCumulatePayCtrl = modules.soaring_cumulatePay.SoaringCumulatePayCtrl;
    import SoaringSinglePayCtrl = modules.soaring_singlePay.SoaringSinglePayCtrl;
    import SoaringDayConsumeRewardCtrl = modules.soaring_dayConsumeReward.SoaringDayConsumeRewardCtrl;
    import SoaringPanicBuyingGiftCtrl = modules.soaring_panicBuyingGift.SoaringPanicBuyingGiftCtrl;
    import SoaringSpecialGiftCtrl = modules.soaring_specialGift.SoaringSpecialGiftCtrl;
    import EveryDayRebateCtrl = modules.every_day_rebate.EveryDayRebateCtrl;
    import FashionCtrl = modules.fashion.FashionCtrl;
    import TianZhuCtrl = modules.tianZhu.TianZhuCtrl;
    import SevenDayGiftCtrl = modules.sevenDayGift.SevenDayGiftCtrl;
    import HalfMonthGiftCtrl = modules.halfMonthGift.HalfMonthGiftCtrl;
    import XiLianCtrl = modules.xiLian.XiLianCtrl;
    import EquipmentZuHunCtrl = modules.equipment_zu_hun.EquipmentZuHunCtrl;
    import CumulatePayShenHunCtrl = modules.cumulatePay_shenHun.CumulatePayShenHunCtrl;
    import CumulatePayTianZhuCtrl = modules.cumulatePay_tianZhu.CumulatePayTianZhuCtrl;
    import RotaryTableSoaringCtrl = modules.rotary_table_soraing.RotaryTableSoaringCtrl;
    import LoginRewardCtrl = modules.login_reward.LoginRewardCtrl;
    import RotaryTableJiuZhouCtrl = modules.rotary_table_jiuzhou.RotaryTableJiuZhouCtrl;
    import FeedBackCtrl = modules.feed_back.FeedBackCtrl;
    import AnnouncementCtrl = modules.announcement.AnnouncementCtrl;
    import SweepingIncomeCtrl = modules.sweeping_income.SweepingIncomeCtrl;
    import FirstLoginAlertCtrl = modules.first_login_alert.FirstLoginAlertCtrl;
    import VipNewCtrl = modules.vip_new.VipNewCtrl;
    import OnceRewardCtrl = modules.onceReward.OnceRewardCtrl;
    import RealNameCtrl = modules.realName.RealNameCtrl;
    import OfficialAccountCtrl = modules.officialAccount.OfficialAccountCtrl;
    import GlovesCtrl = modules.gloves.GlovesCtrl;

    import ZXianYuCtrl = modules.zxian_yu.ZXianYuCtrl;
    import OneBuyCtrl = modules.one_buy.OneBuyCtrl;
    import FightTalismanCtrl = modules.fight_talisman.FightTalismanCtrl;
    import MoneyCatCtrl = modules.money_cat.MoneyCatCtrl;
    import XianDanCtrl = modules.xianDan.XianDanCtrl;
    import RenameCtrl = modules.rename.RenameCtrl;
    import ShenYuBossCtrl = modules.sheng_yu.ShenYuBossCtrl;
    import PreventFoolCtrl = modules.prevent_fool_question.PreventFoolCtrl;
    import TheCarnivalCtrl = modules.the_carnival.TheCarnivalCtrl;
    import MissionParty = modules.mission_party.MissionPartyCtrl;
    import MPAwardCtrl = modules.mission_party.MissionPartyAwardCtrl;
    import XuanHuoCtrl = modules.xuanhuo.XuanHuoCtrl;
    import ResBackCtrl = modules.resBack.ResBackCtrl;
    import ClanCtrl = modules.clan.ClanCtrl;

    import ExtremeCtrl = modules.extreme.ExtremeCtrl;
    import CashEquipCtrl = modules.cashEquip.CashEquipCtrl;
    import CustomTitleCtrl = modules.customtitle.CustomTitleCtrl;
    import JiuXiaoLingCtrl = modules.jiuxiaoling.JiuXiaoLingCtrl;
    import DropCarnivalCtrl = modules.drop_carnival.DropCarnivalCtrl;
    import CeremonyCashCtrl = modules.ceremony_cash.CeremonyCashCtrl;
    import LimitOneDiscountCtrl = modules.limit_one_discount.LimitOneDiscountCtrl;
    import CeremonyGeocachingCtrl = modules.ceremony_geocaching.CeremonyGeocachingCtrl;
    import MarryCtrl = modules.marry.MarryCtrl;
    import CeremonyDanbiCtrl = modules.ceremony_cash.CeremonyDanbiCtrl;
    import CeremonyContinuePayCtrl = modules.ceremony_cash.CeremonyContinuePayCtrl;

    import FishCtrl = modules.fish.FishCtrl;
    import FishCKCtrl = modules.fish.FishCKCtrl;
    import LimitGiftCtrl = modules.limit.LimitGiftCtrl;
    import LimitLinkCtrl = modules.limit.LimitLinkCtrl;
    import LimitDayCumulateCtrl = modules.limit.LimitDayCumulateCtrl;
    import LimitReapCtrl = modules.limit.LimitReapCtrl;
    import LimitShopCtrl = modules.limit.LimitShopCtrl;
    import LimitRankCtrl = modules.limit.LimitRankCtrl;
    import LimitCumulateCtrl = modules.limit.LimitCumulateCtrl;
    import LimitDaySingleCtrl = modules.limit.LimitDaySingleCtrl;
    import SevenActivityCtrl = modules.seven_activity.SevenActivityCtrl;

    import WeekYuanbaoCtrl = modules.weekYuanbao.WeekYuanbaoCtrl;
    import WeekXianyuCtrl = modules.weekXianyu.WeekXianyuCtrl;
    import WeekCardCtrl = modules.weekCard.WeekCardCtrl;

    import HeroAuraCtrl = modules.heroAura.HeroAuraCtrl;
    import DemonOrderGiftCtrl = modules.demonOrderGift.DemonOrderGiftCtrl;
    import DishuCtrl = modules.dishu.DishuCtrl;
    import RedPackCtrl = modules.redpack.RedPackCtrl;
    import ExplicitSuitCtrl = modules.explicit.ExplicitSuitCtrl;
    import GuangHuanCtrl = modules.guanghuan.GuangHuanCtrl;

    import ZhuLuCtrl = modules.zhulu.ZhuLuCtrl;
    export class ModulesUtil {
        private static _ctrlArray: Array<BaseCtrl>;
        constructor() { }

        /**
         * 添加控制器实例
         */
        private static addCtrlInstance(): void {
            this._ctrlArray = [
                RedPackCtrl.instance,           // part 1111
                BagCtrl.instance,
                TaskCtrl.instance,
                ChatCtrl.instance,
                MagicPetCtrl.instance,
                IllusionCtrl.instance,
                GoldBodyCtrl.instance,
                FuncOpenCtrl.instance,
                BigTowerCtrl.instance,
                MagicArtCtrl.instance,
                EmailCtrl.instance,
                BornCtrl.instance,
                ExerciseCrtl.instance,
                MagicPositionCtrl.Instance,
                WarDisplayCtrl.instance,
                BossHomeCtrl.instance,
                TeamBattleCtrl.instance,
                StoreCtrl.instance,
                VipCtrl.instance,
                RuneCopyCtrl.instance,
                RuneCtrl.instance,
                DailyDemonCtrl.instance,
                FairyCtrl.instance,
                ShenqiCtrl.instance,
                QuickUseCtrl.instance,
                MissionCtrl.instance,
                DungeonCtrl.instance,
                SignCtrl.instance,
                MagicWeaponCtrl.instance,
                SingleBossCtrl.instance,
                OnlineGiftCtrl.instance,
                TalismanCtrl.instance,
                IntensiveCtrl.instance,
                StoneCtrl.instance,
                MultiBossCtrl.instance,
                ComposeCtrl.instance,
                ThreeWorldsCtrl.instance,
                PlayerRankingCtrl.instance,
                MonthCardCtrl.instance,
                ImmortalsCtrl.instance,
                WingCtrl.instance,
                TreasureCtrl.instance,
                RechargeCtrl.instance,
                BuffCtrl.instance,
                LineClearOutCtrl.instance,
                ActivityPreviewCtrl.instance,
                NineCtrl.instance,
                ZerobuyCtrl.instance,
                NpcCtrl.instance,
                PayRewardCtrl.instance,
                DayDropTreasureCtrl.instance,
                KunLunCtrl.instance,
                YunMengMiJingCtrl.instance,
                DiscountGiftCtrl.instance,
                DayConsumeRewardCtrl.instance,
                XianfuCtrl.instance,
                actionPreviewCtrl.instance,         // part 222222222222
                PlayerTitleCtrl.instance,
                EquipSuitCtrl.instance,
                OpenAwardCtrl.instance,
                WeekLoginCtrl.instance,
                SinglePayCtrl.instance,
                RepeatPayCtrl.instance,
                WeekConsumeCtrl.instance,
                ZhizunCtrl.instance,
                LimitPackCtrl.instance,
                PayRankCtrl.instance,
                FirstPayCtrl.instance,
                FirstLoginAlertCtrl.instance,
                OfflineCtrl.instance,
                DayPayCtrl.instance,
                CumulatePayModelCtrl.instance,
                ContinuePayCtrl.instance,
                ConsumeRewardCtrl.instance,
                InvestRewardCtrl.instance,
                SprintRankTaskCtrl.instance,
                LadderCtrl.instance,
                SprintRankCtrl.instance,
                GushenCtrl.instance,
                KuangHuanCtrl.instance,
                Cumulate2PayCtrl.instance,
                Cumulate3PayCtrl.instance,
                AdventureCtrl.instance,
                FactionCtrl.instance,
                ArenaCtrl.instance,
                SoaringRankCtrl.instance,
                SoaringCumulatePayCtrl.instance,
                SoaringSinglePayCtrl.instance,
                SoaringDayConsumeRewardCtrl.instance,
                SoaringPanicBuyingGiftCtrl.instance,
                SoaringSpecialGiftCtrl.instance,
                EveryDayRebateCtrl.instance,
                FashionCtrl.instance,
                TianZhuCtrl.instance,
                SevenDayGiftCtrl.instance,
                HalfMonthGiftCtrl.instance,
                XiLianCtrl.instance,
                EquipmentZuHunCtrl.instance,
                CumulatePayShenHunCtrl.instance,
                CumulatePayTianZhuCtrl.instance,
                RotaryTableSoaringCtrl.instance,
                LoginRewardCtrl.instance,
                RotaryTableJiuZhouCtrl.instance,
                FeedBackCtrl.instance,
                AnnouncementCtrl.instance,
                InvitationCtrl.instance,
                SweepingIncomeCtrl.instance,
                VipNewCtrl.instance,
                OnceRewardCtrl.instance,
                RealNameCtrl.instance,
                OfficialAccountCtrl.instance,   // part 3333333333333
                GlovesCtrl.instance,
                ZXianYuCtrl.instance,
                OneBuyCtrl.instance,
                FightTalismanCtrl.instance,
                MoneyCatCtrl.instance,
                XianDanCtrl.instance,
                RenameCtrl.instance,
                ShenYuBossCtrl.instance,
                PreventFoolCtrl.instance,
                TheCarnivalCtrl.instance,
                MissionParty.instance,
                MPAwardCtrl.instance,
                ClanCtrl.instance,
                XuanHuoCtrl.instance,
                ExtremeCtrl.instance,
                CashEquipCtrl.instance,
                CustomTitleCtrl.instance,
                JiuXiaoLingCtrl.instance,
                DropCarnivalCtrl.instance,
                CeremonyCashCtrl.instance,
                LimitOneDiscountCtrl.instance,
                CeremonyGeocachingCtrl.instance,
                MarryCtrl.instance,
                CeremonyDanbiCtrl.instance,
                CeremonyContinuePayCtrl.instance,
                FishCtrl.instance,
                LimitLinkCtrl.instance,
                LimitGiftCtrl.instance,
                FishCKCtrl.instance,
                LimitReapCtrl.instance,
                LimitShopCtrl.instance,
                LimitRankCtrl.instance,
                LimitDayCumulateCtrl.instance,
                LimitCumulateCtrl.instance,
                LimitDaySingleCtrl.instance,
                SevenActivityCtrl.instance,
                WeekYuanbaoCtrl.instance,
                WeekXianyuCtrl.instance,
                WeekCardCtrl.instance,
                HeroAuraCtrl.instance,
                DemonOrderGiftCtrl.instance,
                DishuCtrl.instance,
                ResBackCtrl.instance,
                ExplicitSuitCtrl.instance,
                ZhuLuCtrl.instance,
                GuangHuanCtrl.instance,
                
                // 引导，这个必须放最后
                GuideCtrl.instance,
                SoundCtrl.instance,
            ]
        }

        /**
         * 初始化
         */
        public static init(): void {
            this.addCtrlInstance();
            this._ctrlArray.forEach(ins => {
                ins.setup();
            });
        }

        /**
         * 重连请求数据更新
         */
        public static reconnectRequest(): void {
            if (!this._ctrlArray) return;
            console.log("断线重连请求更新数据!!!");
            this._ctrlArray.forEach(ins => {
                ins.requsetAllData();
            });
        }
    }
}
