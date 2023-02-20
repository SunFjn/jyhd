///<reference path="../jslibs/common.js"/>
///<reference path="net/channel.ts"/>
///<reference path="base/background/actor.ts"/>
///<reference path="base/materials/unlit_material.ts"/>
///<reference path="base/assets/resource_pool.ts"/>
///<reference path="base/materials/material_initializer.ts"/>
///<reference path="base/assets/asset_pool_base.ts"/>
///<reference path="modules/core/base_view.ts" />
///<reference path="modules/core/base_dialog.ts" />
///<reference path="modules/common/item_render.ts"/>
///<reference path="ui/layaUI.max.all.ts"/>
///<reference path="modules/player/player_ctrl.ts" />
///<reference path="modules/create_role/create_role_ctrl.ts" />
///<reference path="modules/common/common_config.ts" />
///<reference path="modules/common/common_event_type.ts" />
///<reference path="modules/common/global_data.ts" />
///<reference path="modules/bag/bag_ctrl.ts"/>
///<reference path="modules/scene/scene_ctrl.ts"/>
///<reference path="modules/scene/map_effect_ctrl.ts"/>
///<reference path="modules/task/task_ctrl.ts"/>
///<reference path="modules/quick_use/quick_use_ctrl.ts"/>
///<reference path="utils/tween/tween.ts"/>
///<reference path="modules/magic_pet/magic_pet_ctrl.ts"/>
///<reference path="modules/illusion/illusion_ctrl.ts"/>
///<reference path="modules/seven_day_gift/seven_day_gift_crtl.ts"/>
///<reference path="modules/gold_body/gold_body_ctrl.ts"/>
///<reference path="modules/func_open/func_open_ctrl.ts"/>
///<reference path="modules/stone/stone_ctrl.ts"/>
///<reference path="modules/single_boss/single_boss_ctrl.ts"/>
///<reference path="modules/magic_art/magic_art_ctrl.ts"/>
///<reference path="modules/email/email_ctrl.ts"/>
///<reference path="modules/born/born_ctrl.ts"/>
///<reference path="modules/exercise/exercise_crtl.ts"/>
///<reference path="modules/magic_position/magic_position_ctrl.ts"/>
///<reference path="modules/immortals/immortals_ctrl.ts"/>
///<reference path="modules/war_display/war_display_ctrl.ts"/>
///<reference path="modules/boss_home/boss_home_ctrl.ts"/>
///<reference path="modules/treasure/treasure_ctrl.ts"/>
///<reference path="modules/team_battle/team_battle_ctrl.ts"/>
///<reference path="modules/store/store_ctrl.ts"/>
///<reference path="modules/vip/vip_ctrl.ts"/>
///<reference path="modules/common/plat_params.ts"/>
///<reference path="modules/rune/rune_ctrl.ts"/>
///<reference path="modules/rune_copy/rune_copy_ctrl.ts"/>
///<reference path="modules/daily_demon/daily_demon_ctrl.ts"/>
///<reference path="modules/xianfu/xianfu_ctrl.ts"/>
///<reference path="modules/login/login_model.ts"/>
///<reference path="modules/fairy/fairy_ctrl.ts"/>
///<reference path="base/background/forward_actor.ts"/>
///<reference path="utils/trace_utils.ts"/>
///<reference path="modules/sound/sound_ctrl.ts"/>
///<reference path="base/mesh/avatar_data_pool.ts"/>
/// <reference path="modules/shenqi/shenqi_ctrl.ts" />
///<reference path="modules/week_consume/week_consume_ctrl.ts"/>
///<reference path="modules/scene/scene_ctrl.ts"/>


///<reference path="modules/dungeon/dungeon_model.ts"/>
///<reference path="modules/boss_home/boss_home_model.ts"/>
///<reference path="modules/core/window_manager.ts"/>
///<reference path="modules/common/eff_util.ts"/>
///<reference path="modules/common/skeleton_util.ts"/>
///<reference path="modules/main/health_point_item.ts"/>


import ResourcePool = base.assets.ResourcePool;
import Actor = base.background.Actor;
import MaterialInitializer = base.materials.MaterialInitializer;
import Browser = Laya.Browser;
import Font = Laya.Font;
import BagCtrl = modules.bag.BagCtrl;
import BigTowerCtrl = modules.bigTower.BigTowerCtrl;
import BornCtrl = modules.born.BornCtrl;
import BossHomeCtrl = modules.bossHome.BossHomeCtrl;
import ChatCtrl = modules.chat.ChatCtrl;
import CommonConfig = modules.common.CommonConfig;
import CommonEventType = modules.common.CommonEventType;
import GlobalData = modules.common.GlobalData;
import PlatParams = modules.common.PlatParams;
import WindowManager = modules.core.WindowManager;
import CreateRoleCtrl = modules.createRole.CreateRoleCtrl;
import EmailCtrl = modules.email.EmailCtrl;
import ExerciseCrtl = modules.exercise.ExerciseCrtl;
import FuncOpenCtrl = modules.funcOpen.FuncOpenCtrl;
import GoldBodyCtrl = modules.goldBody.GoldBodyCtrl;
import IllusionCtrl = modules.illusion.IllusionCtrl;
import LayerManager = modules.layer.LayerManager;
import MagicArtCtrl = modules.magicArt.MagicArtCtrl;
import MagicPetCtrl = modules.magicPet.MagicPetCtrl;
import MagicPositionCtrl = modules.magicPosition.MagicPositionCtrl;
import PlayerCtrl = modules.player.PlayerCtrl;
import PlayerModel = modules.player.PlayerModel;
import RuneCtrl = modules.rune.RuneCtrl;
import RuneCopyCtrl = modules.rune_copy.RuneCopyCtrl;
import SceneCtrl = modules.scene.SceneCtrl;
import StoreCtrl = modules.store.StoreCtrl;
import MapEffectCtrl = modules.scene.MapEffectCtrl;
import TaskCtrl = modules.task.TaskCtrl;
import TeamBattleCtrl = modules.teamBattle.TeamBattleCtrl;
import VipCtrl = modules.vip.VipCtrl;
import WarDisplayCtrl = modules.warDisplay.WarDisplayCtrl;
import Channel = net.Channel;
import AuthClientReply = Protocols.AuthClientReply;
import AuthClientReplyFields = Protocols.AuthClientReplyFields;
import CloseClient = Protocols.CloseClient;
import CloseClientFields = Protocols.CloseClientFields;
import SynTimeReply = Protocols.SynTimeReply;
import SynTimeReplyFields = Protocols.SynTimeReplyFields;
import SystemClientOpcode = Protocols.SystemClientOpcode;
import UserNexusOpcode = Protocols.UserNexusOpcode;
import WindowEnum = ui.WindowEnum;
import ArrayUtils = utils.ArrayUtils;
import TweenJS = utils.tween.TweenJS;
import DailyDemonCtrl = modules.dailyDemon.DailyDemonCtrl;
import InitCommand = base.background.InitCommand;
import InitCompleteCommand = base.background.InitCompleteCommand;
import LoginModel = modules.login.LoginModel;
import FairyCtrl = modules.fairy.FairyCtrl;
import ForwardActor = base.background.ForwardActor;
import TraceUtils = utils.TraceUtils;
import StringUtils = utils.StringUtils;
// import SnowflakeParticleBundle = base.particle.snowflake.SnowflakeParticleBundle;
import MapUtils = game.map.MapUtils;
import Input = Laya.Input;
import Render = Laya.Render;
import Handler = Laya.Handler;
import AssetPoolBase = base.assets.AssetPoolBase;
import CommonUtil = modules.common.CommonUtil;
import AvatarDataPool = base.mesh.AvatarDataPool;
import ShenqiCtrl = modules.shenqi.ShenqiCtrl;
import WeekConsumeCtrl = modules.weekConsume.WeekConsumeCtrl;
import BossHomeModel = modules.bossHome.BossHomeModel;
import DungeonModel = modules.dungeon.DungeonModel;
import ErrorCodeCfg = modules.config.ErrorCodeCfg;
import erorr_codeFields = Configuration.erorr_codeFields;
import EffUtil = modules.common.EffUtil;
import HealthPointItem = modules.main.HealthPointItem;
import SystemNoticeManager = modules.notice.SystemNoticeManager;
import ModulesUtil = modules.common.ModulesUtil;
import SkeletonAvatar = modules.common.SkeletonAvatar;
import LiteralComponent = game.world.component.LiteralComponent;

let view: any;

class Launcher {
    private static _instance: Launcher;

    public static get instance(): Launcher {
        return Launcher._instance = Launcher._instance || new Launcher();
    }

    private constructor() {
        Channel.instance.subscribe(SystemClientOpcode.AuthClientReply, this, this.authClientReply);
        Channel.instance.subscribe(SystemClientOpcode.SynTimeReply, this, this.synTimeReply);
        Channel.instance.subscribe(SystemClientOpcode.CloseClient, this, this.closeClientReply);

        CreateRoleCtrl.instance.setup();
        PlayerCtrl.instance.setup();
        //场景
        SceneCtrl.instance.setup();
        MapEffectCtrl.instance.setup();

    }


    public auth(user: string, entryId: number): void {
        let server: any = LoginModel.instance.selectedServer;
        Channel.instance.publish(UserNexusOpcode.AuthClient, [user, server.channel_num, server.server_num, server.sign, server.tick, PlatParams.package || 0]);

    }

    private closeClientReply(tuple: CloseClient) {
        if (tuple[CloseClientFields.error] == 9) {
            Main.instance.accountConflict = true;
        } else {
            CommonUtil.noticeError(tuple[CloseClientFields.error])
        }

    }
    private authClientReply(tuple: AuthClientReply): void {
        TraceUtils.trace("authClientReply");
        let result = tuple[AuthClientReplyFields.error];
        switch (result) {
            case ErrorCode.Success: {
                // Statistics.authRequest(2, tuple[Protocols.AuthClientReplyFields.actor]);
                // PlayerModel.instance.actorId = tuple[Protocols.AuthClientReplyFields.actor];
                // PlatParams.playerLogin();
                PlayerCtrl.instance.initBaseInfo(tuple[AuthClientReplyFields.actor], tuple[AuthClientReplyFields.baseAttr], false);
                // 登录成功后同步一次服务器时间，之后每分钟同步一次
                // this.syncTimeHandler();
                // GlobalData.dispatcher.event(CommonEventType.LOGIN_SUCCESS, tuple[Protocols.AuthClientReplyFields.actor]);
                break;
            }
            case ErrorCode.NoActor: {
                PlatParams.recordStep(RecordStep.GotoCreateRole);
                // 初始化shader
                MaterialInitializer.setup((): void => {
                    base.particle.snowflake.SnowflakeParticleUtils.init();
                    base.particle.snowflake.SnowflakeParticleUtils.precompileShaderWithCreate();
                    // console.log("打开角色,关闭登录界面!");
                    WindowManager.instance.close(WindowEnum.LOGIN_PANEL);
                    WindowManager.instance.open(WindowEnum.CREATE_ROLE_PANEL);
                });
                break;
            }
            case ErrorCode.OpenServicePast: {
                let tuple = ErrorCodeCfg.instance.getErrorCfgById(result);
                let temp = tuple ? tuple[erorr_codeFields.msg_ZN] : `错误：${result}`;
                CommonUtil.alert("提示", temp, [Handler.create(this, () => {
                    window.location.reload();
                })], null, false);
                break;
            }
            default: {
                PlatParams.recordStep(RecordStep.LoginFailed);
                alert(`服务器登陆失败: ${ErrorCodeCfg.instance.getErrorCfgById(result)[erorr_codeFields.msg_ZN]}`);
                break;
            }
        }
    }

    private synTimeReply(tuple: SynTimeReply): void {
        // 不精确，不考虑加速器等情况
        // 从发送到返回的时间
        let offset: number = Browser.now() - tuple[SynTimeReplyFields.timeReq];
        // 来回网络延迟当成一样的处理
        GlobalData.serverTime = Math.floor(tuple[SynTimeReplyFields.timeRep] + offset * 0.5);
        GlobalData.localTime = Browser.now();
        // 每分钟同步一次
        Laya.timer.once(60000, this, this.syncTimeHandler);
    }

    private syncTimeHandler(): void {
        Channel.instance.publish(UserNexusOpcode.SynTime, [Browser.now()]);
    }
}

class Main {
    public static instance: Main;

    // 统计信息是否显示
    private _statShow: boolean = true;
    private _preloadOver: boolean = false;
    private _channelOpen: boolean = false;
    public assets: Array<number> = [];
    // * isWXChannel * true为小游戏模式
    public isWXChannel: boolean;
    private _isWXiOSPay: boolean;
    private _isWXiOSPayFunId: Array<ActionOpenId>;
    private _isWXiOSPayWinId: Array<WindowEnum>;

    /**
     *微信小游戏ios 不允许充值
     * @type {boolean}
     */
    public get isWXiOSPay(): boolean {
        return this._isWXiOSPay;
    }
    public set isWXiOSPay(b: boolean) {
        this._isWXiOSPay = b;
        // GlobalData.dispatcher.event(CommonEventType.UPDATE_SHOW_PAY_STATUS);
    }
    public get isWXiOSPayFunId(): Array<ActionOpenId> {
        return this._isWXiOSPayFunId;
    }

    public get isWXiOSPayWinId(): Array<WindowEnum> {
        return this._isWXiOSPayWinId;
    }

    constructor(public user: string, routineScript?: string, WXChannel: boolean = false, isWXiOSPay: boolean = false) {
        // console.log("进入Laya程序...", "user:" + user, "routineScript:" + routineScript);
        // 是否为微信游戏模式
        this.isWXChannel = WXChannel;
        // iOS端微信小游戏  不可支付
        this.isWXiOSPay = isWXiOSPay;
        // this._isWXiOSPay = true;
        console.log('vtz:this.isWXiOSPay', this._isWXiOSPay);
        this._isWXiOSPayFunId = [
            ActionOpenId.ceremonyContinuePay,
            ActionOpenId.consumeRank,
            ActionOpenId.consumeRewardFS,
            ActionOpenId.continuePay,
            ActionOpenId.cumulatePay2,
            ActionOpenId.cumulatePay3,
            ActionOpenId.cumulatePay,
            ActionOpenId.cumulatePayFS,
            ActionOpenId.dayPay,
            ActionOpenId.everyday_firstpay,
            ActionOpenId.everydayRebate,
            ActionOpenId.fishAtv,
            ActionOpenId.fish,
            ActionOpenId.fishGift,
            ActionOpenId.fishLink,
            ActionOpenId.firstPay,
            ActionOpenId.monthCard,
            ActionOpenId.payReward,
            ActionOpenId.paySingleFS,
            ActionOpenId.recharge,
            ActionOpenId.singlePayJade,
            ActionOpenId.singlePayPrint,
            ActionOpenId.weekAccumulate,
            ActionOpenId.weekCard,
            ActionOpenId.weekSinglePay,
            ActionOpenId.weekXianyu,
            ActionOpenId.weekYuanbao,
            ActionOpenId.xianYu,
            ActionOpenId.xunbaoZhizun,
            ActionOpenId.zhanLiHuFu,
            ActionOpenId.xianYuEnter,
            ActionOpenId.weekRevelry,
            ActionOpenId.heroAura,
            ActionOpenId.superVip,
            ActionOpenId.vip,
            ActionOpenId.vipF,
            ActionOpenId.rushBuyFS,
            ActionOpenId.cumulatePayFS,
            ActionOpenId.paySingleFS,
            ActionOpenId.jiuxiaoling,
            ActionOpenId.gushen,
            ActionOpenId.zhizunCard,
            ActionOpenId.customTitle,
            ActionOpenId.loginReward,
            ActionOpenId.duobao,
            ActionOpenId.soaringRank,
            ActionOpenId.dishu,
            ActionOpenId.limitPack,
            ActionOpenId.superhb,
            ActionOpenId.levelhb,
            ActionOpenId.oneBuy,
            ActionOpenId.Daw_UI_QUZHANG,
            ActionOpenId.Daw_UI_ZHANLI,
            ActionOpenId.zeroBuy,
            ActionOpenId.investLogin,
            ActionOpenId.zhuanPanEnter,
            ActionOpenId.activity,
            ActionOpenId.investReward,
            ActionOpenId.investRecruit,
            ActionOpenId.store,
            ActionOpenId.store_1,
            ActionOpenId.store_2,
            ActionOpenId.store_3,
            ActionOpenId.store_4,
            ActionOpenId.storeAndShop
        ];
        this._isWXiOSPayWinId = [
            WindowEnum.SOARING_RANK_PANEL,
            WindowEnum.ROTARYTABLE_SOARING_PANEL,
            WindowEnum.LOGIN_REWARD_PANEL,
            WindowEnum.CONTINUE_PAY_PANEL,
            WindowEnum.CUMULATE_PAY2_UPDATE,
            WindowEnum.CUMULATE_PAY3_UPDATE,
            WindowEnum.CUMULATE_PAY_UPDATE,
            WindowEnum.CUMULATEPAY_SHENHUN,
            WindowEnum.CUMULATEPAY_TAINZHU,
            WindowEnum.DAY_PAY_PANEL,
            WindowEnum.EVERYDAY_REBATE_PANEL,
            WindowEnum.FIGHT_TALISMAN_BUY_ALERT,
            WindowEnum.FIRST_PAY_PANEL,
            WindowEnum.FISH_PANEL,
            WindowEnum.FISH_GIFT_PANEL,
            WindowEnum.FISH_LINK_PANEL,
            WindowEnum.MAGICPET_AUTOMATICPAY_ALERT,
            WindowEnum.MAGICWEAPON_AUTOMATICPAY_ALERT,
            WindowEnum.MONEY_CAT_BUY_ALERT,
            WindowEnum.MONTH_CARD_PANEL,
            WindowEnum.OPENSERVICE_CONTINUE_PAY_VIEW,
            WindowEnum.PAY_RANK_PANEL,
            WindowEnum.PAY_REWARD_PANEL,
            WindowEnum.PAYREWARD_ALERT,
            WindowEnum.PAYREWARDMYRECORD_ALERT,
            WindowEnum.PAYREWARDRANK_ALERT,
            WindowEnum.RECHARGE_PANEL,
            WindowEnum.REPEAT_PAY_PANEL,
            WindowEnum.SINGLE_PAY_PANEL,
            WindowEnum.SOARING_CUMULATEPAY_PANEL,
            WindowEnum.SOARING_DAYCONSUMEREWARD_PANEL,
            WindowEnum.SOARING_SINGLEPAY_PANEL,
            WindowEnum.WEEK_CARD_PANEL,
            WindowEnum.WEEK_XIANYU_PANEL,
            WindowEnum.WEEK_YUANBAO_PANEL,
            WindowEnum.ZHIZUN_PANEL,
            WindowEnum.ZXIANYU_PANEL,
            WindowEnum.HERO_AURA_PANEL,
            WindowEnum.SUPER_VIP_ENJOY_VIEW,
            WindowEnum.VIP_PANEL,
            WindowEnum.VIP_NEW_PANEL,
            WindowEnum.JIUXIAOLING_AWARD_VIEW,
            WindowEnum.GUSHEN_PANEL,
            WindowEnum.DI_SHU_PANEL,
            WindowEnum.DI_SHU_TASK_PANEL,
            WindowEnum.DI_SHU_RANK_PANEL,
            WindowEnum.DI_SHU_ALERT,
            WindowEnum.CUSTOM_TITLE_ALERT,
            WindowEnum.DI_SHU_PRIZE_ALERT,
            WindowEnum.LIMIT_PACK_ALERT,
            WindowEnum.SUPRER_REDPACK_PANEL,
            WindowEnum.REDPACK_LEVEL_PANEL,
            WindowEnum.ONE_BUY_PANEL,
            WindowEnum.ZEROBUY_PANEL,
            WindowEnum.INVEST_LOGIN_PANEL,
            WindowEnum.Daw_UI_QUZHANG,
            WindowEnum.Daw_UI_ZHANLI,
            WindowEnum.LIMIT_STORE_PANEL,
            WindowEnum.USUAL_STORE_PANEL,
            WindowEnum.GOLD_STORE_PANEL,
            WindowEnum.VIP_STORE_PANEL
        ];
        Main.instance = this;
        GlobalData.user = user;
        GlobalData.startTime = Date.now();
        this.init(routineScript);

        // 非微信小游戏渠道直接处理
        if (!WXChannel) {
            this.startLogin();
        }
    }

    private openChannel(): void {
        // 埋点 记录开始连接服务器
        PlatParams.recordStep(RecordStep.StartConnectServer);
        showProgressInterface(1, 4, 0, "正在连接服务器......");
        TraceUtils.trace("Channel.instance.open");
        this._reconnect = false;
        this.doReconnectHandle();
        // Laya.loader.load(["res/atlas/common.atlas", "res/atlas/bottom_tab.atlas"]);
    }

    public _reconnect: boolean = false; // 是否重连进入游戏
    public accountConflict: boolean = false; // 异地登录
    public errorConflict: boolean = false; // 报错中断
    public reconnect_enterscene: boolean = false; // 重连进入场景
    private _pingHandle: number = 0; // 心跳索引
    private _tryReconnectCount: number = 0; // 尝试重连次数

    private _reconnectTime: number = 0; // 默认大于0 关闭自动重连 重连计时每次生命周期只有一次计时
    private reconnect() {
        if (this._reconnect) return;
        if (!this._reconnectTime) this._reconnectTime = Date.now();
        if (this._pingHandle > 0) { // 重连执行关闭心跳
            clearInterval(this._pingHandle);
            this._pingHandle = 0;
        }
        // 打开断线重连提示面板
        if (!WindowManager.instance.isOpened(WindowEnum.RECONNECT_ALERT)) {
            WindowManager.instance.open(WindowEnum.RECONNECT_ALERT);
        }

        // PlatParams.recordStep(RecordStep.StartConnectServer);
        showProgressInterface(1, 4, 0, "重新连接服务器......");
        this._reconnect = true;

        this.doReconnectHandle(true);
        Laya.timer.loop(3000, this, this.doReconnectHandle, [true]);
    }

    /**
     * 执行连接socket
     */
    private doReconnectHandle(isReconenct: boolean = false) {
        if (isReconenct) {
            this._tryReconnectCount++;
        }
        console.log(isReconenct ? "Channel => 断线重连,尝试" : "Channel => 登录游戏,", "连接WebSocket....");
        Channel.instance.open(this.webSocketUrl, this, this.onChannelOpen, this.onChannelClose, this.onChannelError);
    }

    /**
     * 获取 websocket 的连接的地址
     * 
     * @returns 
     */
    private get webSocketUrl(): string {
        let protocol = Browser.window.location.protocol;
        let server_addr = LoginModel.instance.selectedServer.server_addr;
        let server_port = LoginModel.instance.selectedServer.server_port;
        return `${"https:" === protocol ? "wss://" : "ws://"}${server_addr}:${server_port}`;
    }

    public startLogin(): void {
        if (!this.isWXChannel) Browser.container.setAttribute("style", "visibility: hidden;");
        MaterialInitializer.setup();

        // 预加载列表
        let preloadList: Array<[string, (url: string, handle: number, res: ArrayBuffer) => void]> = [
            [
                "words.bin",
                (url: string, handle: number, res: ArrayBuffer): void => {
                    GlobalData.wordsStatus = res ? 1 : -1;
                    StringUtils.init(msgpack.decode(new Uint8Array(res)));
                }
            ]
        ];

        // 伤害字体优先加载
        let urls = [
            "assets/image/hit/hit.atlas",
            // 重连
            "res/atlas/reconnect_alert.png",
            // 红包相关的
            "res/atlas/redpack_common.png"
        ]
        for (let i: int = 3, len: int = 10; i < len; i++) {
            urls.push(`assets/effect/hurt/1/${i}.png`);
        }
        for (let url of urls) {
            preloadList.push([url, null]);
        }

        // 正式服预加载列表
        if (!DEBUG) {
            //图集包
            preloadList.push(
                [
                    "assets/as.obj",
                    (url: string, handle: number, res: ArrayBuffer): void => {
                        let content: Table<any> = msgpack.decode(new Uint8Array(res));
                        let preLoadedMap = Laya.Loader.preLoadedMap;
                        for (let url in content) {
                            preLoadedMap[url] = content[url];
                        }
                    }
                ]);
            //地图配置包
            preloadList.push(
                [
                    "assets/mb.obj",
                    (url: string, handle: number, res: ArrayBuffer): void => {
                        let content = msgpack.decode(new Uint8Array(res));
                        MapUtils.init(content);
                    }
                ]);

            // 实体资源(zlib压缩过的才行) 
            let urls = [

            ];

            let fun = (url: string, handle: number, res: ArrayBuffer) => {
                if (res != null) {
                    base.assets.HandlePool.instance.lock(handle);
                    this.assets.push(handle);
                }
            };
            for (let url of urls) {
                preloadList.push([url, fun]);
            }

            // 图片资源
            urls = [
                "res/skeleton/zhujue/nanzhu.png",
                "res/skeleton/zhujue/nvzhu.png",
                "res/skeleton/tx/chuansongmen/yxjc_zhenfa.png",
                "res/skeleton/other/kanbanniang.png",
                "res/skeleton/other/sceneEffect_Rain.png",
            ];

            for (let url of urls) {
                preloadList.push([url, null]);
            }
        }

        // 埋点 记录开始加载配置文件
        PlatParams.recordStep(RecordStep.StartLoadConfig);
        showProgressInterface(0, 4, 0, "开始加载配置文件......");

        updateTotalProgress(-1);
        TraceUtils.reset("init");

        let loadLimit = preloadList.length;
        let callback = (url: string, handle: number, res: ArrayBuffer) => {
            for (let i = 0; i < preloadList.length; ++i) {
                let tuple = preloadList[i];
                if (tuple[0] == url) {
                    if (res != null) {
                        if (tuple[1]) {
                            tuple[1](url, handle, res);
                        } else {
                            base.assets.HandlePool.instance.lock(handle);
                            this.assets.push(handle);
                        }
                    }
                    ArrayUtils.removeAt(preloadList, i);
                }
            }

            showProgressInterface(1, 4, (loadLimit - preloadList.length) / loadLimit, "正在加载配置文件......");

            if (preloadList.length != 0) {
                return;
            }
            this._preloadOver = true;
            this.tryToAuth();
        };

        // 资源池加载开始资源
        for (let i = 0; i < preloadList.length; ++i) {
            ResourcePool.instance.load(preloadList[i][0], callback, 0, false, false, preloadList[i][1] != null ? 1 : 0);
        }

        // 初始化WebSocket通讯
        this.openChannel();
    }

    protected resetUI(): void {
        let stage = Laya.stage;
        let w = Math.floor(stage.width);
        let h = Math.floor(stage.height);

        if (h / w < 1.7777778) {
            // 宽屏
            CommonConfig.viewWidth = Math.floor(w / (h / 1280));
            CommonConfig.viewHeight = 1280;
            CommonConfig.viewScale = h / 1280;
        } else {
            // 长屏
            CommonConfig.viewWidth = 720;
            CommonConfig.viewHeight = Math.floor(h / (w / 720));
            CommonConfig.viewScale = w / 720;
        }

        GlobalData.dispatcher.event(CommonEventType.RESIZE_UI);
    }

    protected resetStage(): void {
        if (Input.isInputting && Browser.onMobile) {
            Browser.container.style.position = "absolute";
            let top: number = parseInt((<any>Input).inputContainer.style.top.replace("px", ""));
            let inputH: number = parseInt((<any>Input).inputElement.style.height.replace("px", "")) * CommonConfig.viewScale;
            let rate: number = Browser.clientWidth / Render.canvas.width;
            // Browser.container.style.top = (Browser.clientHeight - Render.canvas.height * Browser.clientWidth / Render.canvas.width) + "px";
            top = Browser.clientHeight - inputH * rate - top;
            if (top > 0) top = 0;
            Browser.container.style.top = top + "px";
            return;
        } else {
            Browser.container.style.top = "0px";
        }

        let w = Math.floor(Browser.width);
        let h = Math.floor(Browser.height);
        w = (w + 1) & 0x7FFFFFFE;
        h = (h + 1) & 0x7FFFFFFE;

        // if (!this.isWXChannel) {
        let stage = Laya.stage;
        if (w > h) {
            stage.scaleMode = Laya.Stage.SCALE_NOSCALE;
            stage.width = /*w > DesignConstant.BackgroundWidth ? DesignConstant.BackgroundWidth :*/ w;//(Math.floor(w / (h / 1280)) + 1) & 0x7FFFFFFE;
            stage.height = /*h > DesignConstant.BackgroundHeight ? DesignConstant.BackgroundHeight :*/ h;//1280;
        } else {
            stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
            stage.width = 840;
            stage.height = (Math.floor(h / (w / 840)) + 1) & 0x7FFFFFFE;
        }
        // }

        this.resetUI();
    }

    private init(routineScript: string): void {
        // 初始化Laya程序
        // if (!this.isWXChannel) {
        Laya3D.init(0, 0, false, false, false);
        // }
        // //设置版本控制类型为使用文件名映射的方式
        // Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        // //加载版本信息文件
        // Laya.ResourceVersion.enable("version.json", Handler.create(this, function(){}));        
        Render.canvas.addEventListener('webglcontextlost', function (e: WebGLContextEvent) {
            GlobalData.isContextLost = true;
            GlobalData.lostMessage = e.statusMessage;
        });
        Render.canvas.addEventListener('webglcontaxtrestored', function (e: Event) {
            GlobalData.isContaxtRestored = true;
        });
        if (!this.isWXChannel) Browser.container.setAttribute("style", "visibility: hidden;");
        // 适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.frameRate = Laya.Stage.FRAME_FAST;

        // 正式模式错误处理
        if (!DEBUG) {
            Laya.alertGlobalError = false;
            let isRecursive = false;
            Browser.window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
                this.errorConflict = true;
                if (!isRecursive) {
                    isRecursive = true;
                    GlobalData.recordError(event, error);
                    if (this.isWXChannel) {
                        wx.hideLoading();
                    }
                    CommonUtil.alert("错误信息", "描述:" + event + " \n\n堆栈:" + (error.stack || error));
                }
            };
        } else {
            Laya.alertGlobalError = true;
        }

        this.resetStage();

        let host = PlatParams.cdn;
        if (host != "" && host[host.length - 1] != "/") {
            PlatParams.cdn = host += "/";
        }
        Laya.URL.rootPath = Laya.URL.basePath = "";

        // 多线程routine！！！
        let actor = new ForwardActor(new Actor(`${host}routine.js?v=${Date.now()}`));
        actor.registerOpcode(InitCommand.opcode, InitCommand);
        actor.registerOpcode(InitCompleteCommand.opcode, InitCompleteCommand);
        actor.addCommandHandler(InitCompleteCommand.opcode, (command: InitCompleteCommand): void => {
            // console.log(`routine初始化状态：${command.status}`);
        });
        let command = new InitCommand();
        command.enableCache = !DEBUG;
        command.enableCheck = !DEBUG;
        command.host = PlatParams.cdn;
        actor.sendCommand(command);
        ResourcePool.instance.init(actor);

        Laya.timer.frameLoop(1, ResourcePool.instance, ResourcePool.instance.update);
        Laya.timer.frameLoop(1, null, AssetPoolBase.onUpdate);
        Laya.timer.frameLoop(1, null, TweenJS.update);
        Laya.timer.loop(3000, null, SkeletonAvatar.slowUpdate);
        //Laya.timer.loop(5000, null, SkeletonAvatar.timerClearAtlasRes);

        // 重置舞台监听
        Laya.Browser.window.addEventListener(Laya.Event.RESIZE, () => {
            this.resetStage();
        });

        UIConfig.popupBgAlpha = 0.8;

        // UI层级初始化
        LayerManager.instance.init();

        GlobalData.dispatcher.once(CommonEventType.LOGIN_SUCCESS, this, this.loginHandler);

        // 隐藏状态信息
        if (DEBUG) {
            Laya.stage.on(laya.events.Event.KEY_DOWN, this, this.statHandler);
        }

        // 微信小游戏渠道-需要打开登录界面
        if (this.isWXChannel) {
            WindowManager.instance.open(WindowEnum.LOGIN_PANEL);
        }

    }
    private statHandler(e: laya.events.Event): void {
        if (e.keyCode === 220) {
            this._statShow = !this._statShow;
            if (this._statShow) Laya.Stat.show();
            else Laya.Stat.hide();
        }
    }

    private onChannelOpen(e: Event): void {

        this._reconnectTime = 0;
        this._tryReconnectCount = 0;
        Laya.timer.clear(this, this.doReconnectHandle);
        if (this._reconnect) {
            console.log("Channel Socket ReConnected!");
            ModulesUtil.reconnectRequest();
            this.reconnect_enterscene = true;
            this._reconnect = false;
        } else {
            console.log("Channel Socket Connected!");
            PlatParams.recordStep(RecordStep.ServerConnected);
            this.reconnect_enterscene = false;
        }
        Channel.instance.setSend(true)

        // 关闭断线重连提示面板-如果有的话
        if (WindowManager.instance.isOpened(WindowEnum.RECONNECT_ALERT)) {
            WindowManager.instance.close(WindowEnum.RECONNECT_ALERT);
        }

        this._pingHandle = setInterval(() => {
            Channel.instance.publish(UserNexusOpcode.ClientPing, null);
        }, 10 * 1000);
        this._channelOpen = true;
        this.tryToAuth();
    }

    private tryToAuth(): void {
        if (this._channelOpen && this._preloadOver) {
            TraceUtils.trace("auth");
            Launcher.instance.auth(this.user, LoginModel.instance.selectedServer.server_num);
        }
    }
    // 服务器断开链接操作
    private serverDisconnected(errorTips: string) {
        if (!this._channelOpen) {
            // 还没有进行过成功链接 不触发重连操作
        } else if (this.errorConflict) {
            // 错误捕获导致的中断 捕获时已经弹窗 这里无操作即可
        } else if (this.accountConflict) {
            CommonUtil.alert("提示", "帐号在别处登录", [Handler.create(this, this.reconnectHandler)], null, false);
        } else if ((this._reconnectTime != 0 && Date.now() - this._reconnectTime > 30 * 1000) || this._tryReconnectCount >= 10) {
            console.log("重连超时,取消重连...");
            this._tryReconnectCount = 0;
            Laya.timer.clear(this, this.doReconnectHandle);
            Channel.instance.socket.close();
            CommonUtil.alert("提示", errorTips, [Handler.create(this, this.reconnectHandler)], null, false);
        } else {
            this.reconnect();
        }
    }



    private onChannelClose(e: CloseEvent): void {
        Channel.instance.setSend(false)
        console.log("on websocket channel close!!!");
        this.serverDisconnected("与服务器断开连接！")
    }

    private onChannelError(e: Event): void {
        Channel.instance.setSend(false)
        console.log("on websocket channel error!!!");
        this.serverDisconnected("连接失败！")
    }

    // 重连（刷新页面）
    private reconnectHandler(): void {
        if (this.isWXChannel) {
            // 重启小游戏或则重连
            // wx.restartMiniProgram();
        } else {
            window.location.reload();
        }
    }


    // 登录成功处理
    private loginHandler(actorId: number) {
        if (!this.isWXChannel) Browser.container.setAttribute("style", "visibility: hidden;");
        //开启统计信息
        if (DEBUG && this._statShow) {
            Laya.Stat.show();
        }

        Font.defaultFamily = "SimHei";
        Font.defaultSize = 24;
        Font.defaultColor = "#2d2d2d";
    }
}
