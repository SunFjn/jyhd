///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../config/error_code_cfg.ts"/>
///<reference path="../config/item_equip_cfg.ts"/>
///<reference path="../config/item_material_cfg.ts"/>
///<reference path="../config/item_stone_cfg.ts"/>
///<reference path="../config/item_attr_pool_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/item_rune_cfg.ts"/>
///<reference path="../config/rune_refine_cfg.ts"/>
///<reference path="../config/store_cfg.ts"/>
///<reference path="../../modules/scene/scene_model.ts"/>

/**
 * 通用的动画目标点
 */
enum specialAniPoin {
    cion = 9999999,//金币
    yuanbao,//代币券
    beiBao,//背包
    offLine,//右上角离线经验展示点
    yugao,//活动预告点
    xianyuCangKu,//点券仓库
    xunBaoCangKu//探索仓库
}

enum appearance {
    shenBing = 1,//幻武
    xianiYi,//翅膀
    shiZhuang,//时装
    tianZhu,//神兽
    lingChong,//宠物
    lingChongFaZhen,//宠物法阵
    xianQi,//精灵
    xianQiFaZhen,//精灵法阵
}

/**
 * 用于 防止 本地存储 key 冲突
 */
enum localStorageStrKey {
    LeftBottomPanel = "_count",
    SoundCtrl = "joytime_jzpmz_sound",
    MusicCtrl = "joytime_jzpmz_music",
    SoaringRankModel = "SoaringRankIsShowAndTime",//封神榜 是否显示排行记录 显示时间
    SprintRankModel = "SprintRankIsShowAndTime",//开服冲榜 是否显示排行记录 显示时间
    SoaringPanicBuyingGiftModel = "_totalCountRandom",//偽-剩余可购买总数
    SoaringPanicBuyingGiftModelNotBuy = "SoaringPanicBuyingGiftModelNotBuy",//未购买
    SoaringPanicBuyingGiftModelOutTime = "_outTime",//首次打开面板
}

/** 通用工具类*/
namespace modules.common {

    import erorr_codeFields = Configuration.erorr_codeFields;
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import ErrorCodeCfg = modules.config.ErrorCodeCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import IMsgFields = Protocols.IMsgFields;
    import ItemFields = Protocols.ItemFields;
    import Handler = Laya.Handler;
    import item_material = Configuration.item_material;
    import item_stone = Configuration.item_stone;
    import ItemEquipCfg = modules.config.ItemEquipCfg;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import ItemStoneCfg = modules.config.ItemStoneCfg;
    import blend = Configuration.blend;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_materialFields = Configuration.item_materialFields;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import item_rune = Configuration.item_rune;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import Unit = utils.Unit;
    import NoMoreNoticeId = ui.NoMoreNoticeId;
    import OkInfo = commonAlert.OkInfo;
    import CancelInfo = commonAlert.CancelInfo;
    import TipTxtInfo = commonAlert.TipTxtInfo;
    import StoreCfg = modules.config.StoreCfg;
    import Image = Laya.Image;
    import FontClip = Laya.FontClip;
    import SceneModel = modules.scene.SceneModel;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import EnterSceneFields = Protocols.EnterSceneFields;

    export class CommonUtil {

        private static _numStr: string = `零一二三四五六七八九十`;

        constructor() {

        }

        // 当前场景类型
        public static getMapType(id: number = -1): number {
            let mapId = id != -1 ? id : SceneModel.instance.enterScene[EnterSceneFields.mapId]
            let type = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
            return type;
        }

        public static getMapLevel(): number {
            return SceneModel.instance.enterScene[EnterSceneFields.level]
        }

        public static setMapTo(x: number, y: number) {
            PlayerModel.instance.autoAi = false
            PlayerModel.instance.customizePoint = new Laya.Point(x, y)
        }


        public static get isSlow() {
            return SceneModel.instance.isSlow
        }
        public static set isSlow(slow) {
            SceneModel.instance.isSlow = slow;
        }

        // 根据道具ID获取道具配置
        public static getItemCfgById(itemId: int): item_equip | item_material | item_stone | runeRefine | item_rune {
            return ItemEquipCfg.instance.getItemCfgById(itemId) || ItemMaterialCfg.instance.getItemCfgById(itemId)
                || ItemStoneCfg.instance.getItemCfgById(itemId) || ItemRuneCfg.instance.getCfgById(itemId) || RuneRefineCfg.instance.getCfgById(itemId);
        }

        /**
         * 根据道具ID获取商城配置
         */
        public static getMallByItemId(itemId: number): Configuration.mall {
            let itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(itemId);
            let isStone: boolean = CommonUtil.getItemTypeById(itemId) === ItemMType.Stone;
            let mallCfg: Configuration.mall = StoreCfg.instance.getCfgByitemId(<number>itemCfg[isStone ? item_stoneFields.shortcutBuy : item_materialFields.shortcutBuy]);
            return mallCfg;
        }

        // 根据道具ID获取道具类型
        public static getItemTypeById(itemId: number): int {
            return itemId / 10000000 >> 0;
        }

        // 根据道具ID获取道具子类型
        public static getItemSubTypeById(itemId: number): int {
            return (itemId / 100000 >> 0) % 100;
        }

        // 根据道具ID获取道具品质(1-8)
        public static getItemQualityById(itemId: number): int {
            let quality: int = 0;
            // 品质在第4位
            quality = (itemId * 0.0001 >> 0) % 10;
            return quality;
        }

        //根据装备id获得阶数
        public static getStageById(id: number): number {
            return (id / 100000 >> 0) % 100;
        }

        //根据装备获取星级
        public static getStarById(id: number): number {
            return (id / 1000 >> 0) % 10 - 1;
        }

        //根据仙石ID获取仙石类型 (1~4) 青龙 白虎 朱雀 玄武   ps:玉荣可通用
        public static getStoneTypeById(stoneId: number): int {
            return (stoneId * 0.00001 >> 0) % 100;
        }

        /**
         * 获取玉荣名字和lv
         */
        public static getFuWenNameAndLv(_itemId: number): any {
            let type: number = CommonUtil.getStoneTypeById(_itemId);
            let dimId: number = (_itemId * 0.0001 >> 0) * 10000;  //模糊Id
            let lv: number = _itemId % 10000;
            let cfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
            let name: string = "";
            if (cfg) {
                name = cfg[item_runeFields.name];
            }
            return [name, lv];
        }

        // 根据道具ID获取背包ID
        public static getBagIdById(itemId: number): int {
            let type: int = CommonUtil.getItemTypeById(itemId);
            let bagId: int = 0;
            if (type === ItemMType.Equip) {
                bagId = BagId.equipType;
            } else if (type === ItemMType.Stone) {
                bagId = BagId.stoneType;
            } else if (type === ItemMType.MagicWeapon) {
                bagId = BagId.magicWeaponType;
            } else if (type === ItemMType.Rune) {
                bagId = BagId.rune;
            }
            else {
                bagId = BagId.itemType;
            }
            return bagId;
        }


        // 根据品质获取颜色
        private static _qualityColors: Array<string> = [
            "#FFFFFF",
            "#0ECF09",
            "#0F81F5",
            "#d738f4",
            "#EA8706",
            "#FF3E3E",
            "#E97900",
        ];

        // 根据品质获取颜色名
        private static _qualityNames: Array<string> = [
            "白",
            "绿",
            "蓝",
            "紫",
            "橙",
            "红",
            "黄",
        ];

        public static getColorByQuality(quality: int): string {
            let color: string = "";
            if (quality > 0 && quality <= this._qualityColors.length) {
                color = this._qualityColors[quality];
            }
            return color;
        }

        public static getColorNameByQuality(quality: int): string {
            let name: string = "";
            if (quality > 0 && quality <= this._qualityColors.length) {
                name = this._qualityNames[quality];
            }
            return name;
        }

        // 根据品质获取颜色
        private static _qualityBgImgUrl: Array<string> = [
            "common/image_tips_1.png",
            "common/image_tips_2.png",
            "common/image_tips_3.png",
            "common/image_tips_4.png",
            "common/image_tips_5.png",
            "common/image_tips_6.png",
        ];

        public static getBgImgByQuality(quality: int): string {
            let color: string = "";
            if (quality > 0 && quality <= this._qualityBgImgUrl.length) {
                color = this._qualityBgImgUrl[quality - 1];
            }
            return color;
        }

        // 根据itemID获取品质颜色
        public static getColorById(itemId: int): string {
            let quality: int = CommonUtil.getItemQualityById(itemId);
            return CommonUtil.getColorByQuality(quality);
        }

        // 根据itemID获取品质背景图
        public static getBgImgById(itemId: int): string {
            let quality: int = CommonUtil.getItemQualityById(itemId);
            return CommonUtil.getBgImgByQuality(quality);
        }

        // 根据装备ID获取装备部位
        public static getPartById(equipId: int): int {
            return (equipId * 0.1 >> 0) % 100;
        }

        // 根据装备部位 获取部位名称
        public static getNameByPart(part: EquipCategory): string {
            let nameStr: string;
            if (part == EquipCategory.weapon) {
                nameStr = "武器";
            } else if (part == EquipCategory.hats) {
                nameStr = "头肩";
            } else if (part == EquipCategory.clothes) {
                nameStr = "上装";
            } else if (part == EquipCategory.hand) {
                nameStr = "下装";
            } else if (part == EquipCategory.shoes) {
                nameStr = "鞋子";
            } else if (part == EquipCategory.belt) {
                nameStr = "腰带";
            } else if (part == EquipCategory.necklace) {
                nameStr = "项链";
            } else if (part == EquipCategory.bangle) {
                nameStr = "手镯";
            } else if (part == EquipCategory.ring) {
                nameStr = "戒指";
            } else if (part == EquipCategory.jude) {
                nameStr = "魔法石";
            }
            return nameStr;
        }

        // 根据技能ID获取技能纯粹ID（不含技能等级）
        public static getSkillPureIdById(skillId: int): int {
            return skillId / 10000 >> 0;
        }

        // 根据技能纯粹ID和等级获取技能ID
        public static getSkillIdByPureIdAndLv(pureId: int, lv: int = 0): int {
            return pureId * 10000 + lv;
        }

        // 文本弹框
        public static alert(title: string, content: string, okInfo: OkInfo = [], cancelInfo: CancelInfo = null,
            isShowHintTxt: boolean = true, tipTxtInfo: TipTxtInfo = null, noticeId: NoMoreNoticeId = NoMoreNoticeId.none): void {
            if (GlobalData.noMoreNoticeArr[noticeId]) {       // 本次登录不再提示，默认执行okHandler
                if (okInfo[commonAlert.OkInfoFields.handler]) okInfo[commonAlert.OkInfoFields.handler].run();
                return;
            }
            let params: commonAlert.InwardParams = [
                title,
                content,
                okInfo,
                cancelInfo,
                isShowHintTxt,
                tipTxtInfo,
                noticeId
            ];
            WindowManager.instance.openDialog(12, params);
        }

        // 系统规则弹框
        public static alertHelp(id: int): void {
            let cfg: blend = BlendCfg.instance.getCfgById(id);
            CommonUtil.alert(cfg[blendFields.des], cfg[blendFields.stringParam][0], null);
        }

        /**
         * 系统规则弹框
         * @param s 策划表%s要替换的值（暂订一个）
         * @memberof CommonUtil
         */
        public static alertHelpReplaceVar(id: int, s: any): void {
            let cfg: blend = BlendCfg.instance.getCfgById(id);
            // for (let i = 0; i < cfg[blendFields.stringParam].length; i++) {
            //     cfg[blendFields.stringParam][i] = cfg[blendFields.stringParam][i].replace(/%s/, s);
            // }
            cfg[blendFields.stringParam][0] = cfg[blendFields.stringParam][0].replace(/%s/, s);
            CommonUtil.alert(cfg[blendFields.des], cfg[blendFields.stringParam][0], null);
        }

        // 弹错误码
        public static noticeError(code: number): void {
            if (code === 0) return;
            //console.log(code, "code", ErrorCodeCfg.instance.getErrorCfgById(code), ErrorCodeCfg.instance.getErrorCfgById(code)[erorr_codeFields.msg_ZN])
            if (!ErrorCodeCfg.instance.getErrorCfgById(code)) {

                SystemNoticeManager.instance.addNotice(code.toString(), true);
            } else {
                SystemNoticeManager.instance.addNotice(ErrorCodeCfg.instance.getErrorCfgById(code)[erorr_codeFields.msg_ZN], true);
            }
        }

        // 检查装备，判断是否满足装备条件
        public static checkEquip(item: Protocols.Item): boolean {
            let bool: boolean = false;
            if (item) {
                let itemId: number = item[ItemFields.ItemId];
                let itemCfg: item_equip = CommonUtil.getItemCfgById(itemId) as item_equip;
                let era: number = PlayerModel.instance.eraLevel;
                let lv: number = PlayerModel.instance.level;
                // 觉醒、等级
                if (itemCfg[item_equipFields.era] <= era && lv >= itemCfg[item_equipFields.wearLvl]) {
                    let part: int = CommonUtil.getPartById(itemId);
                    let equipedItem: Protocols.Item = modules.player.PlayerModel.instance.getEquipByPart(part);
                    // 评分
                    if (!equipedItem || item[ItemFields.iMsg][IMsgFields.baseScore] > equipedItem[ItemFields.iMsg][IMsgFields.baseScore]) {
                        bool = true;
                    }
                }
            }
            return bool;
        }

        // 时间戳毫秒转成秒倒计时
        public static timeStampToS(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;
            if (offset <= 0) {
                str = "00";
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                sec = sec % 60;
                str = "" + sec;
            }
            return str;
        }

        // 时间戳毫秒转成00:00倒计时
        public static timeStampToMMSS(timeStamp: number): string {
            let str: string = "";
            let offset: number = timeStamp - GlobalData.serverTime;
            if (offset <= 0) {
                str = "00:00";
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                sec = sec % 60;
                str = (minute < 10 ? "0" : "") + minute + ":" + (sec < 10 ? "0" : "") + sec;
            }
            return str;
        }
        // 时间戳毫秒转成00倒计时
        public static timeStampToSS(timeStamp: number): string {
            let str: string = "";
            let offset: number = timeStamp - GlobalData.serverTime;
            if (offset <= 0) {
                str = "0";
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                sec = sec % 60;
                str = "" + sec;
            }
            return str;
        }
        // 时间戳毫秒转成00:00:00倒计时
        public static timeStampToHHMMSS(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;
            if (offset <= 0) {
                str = "00:00:00";
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = (sec / 60 >> 0) % 60;
                let hours: int = sec / 3600 >> 0;
                sec = sec % 60;
                str = (hours < 10 ? "0" : "") + hours + ":" + (minute < 10 ? "0" : "") + minute + ":" + (sec < 10 ? "0" : "") + sec;
            }
            return str;
        }

        public static timeStampToDayHourMin(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;
            if (offset <= 0) {
                str = "已过期";
            } else {
                let minute: int = (offset / Unit.minute >> 0) % 60;
                let hours: int = (offset / Unit.hour >> 0) % 24;
                let day: int = offset / Unit.day >> 0;
                str = `${day}天${hours}时${minute}分`;
            }
            return str;
        }

        public static timeStampToDayHourMinSecond(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;
            if (offset <= 0) {
                str = "已过期";
            } else {
                let minute: int = (offset / Unit.minute >> 0) % 60;
                let second: int = (offset / Unit.second >> 0) % 60;
                let hours: int = (offset / Unit.hour >> 0) % 24;
                let day: int = offset / Unit.day >> 0;
                str = `${day}天${hours}时${minute}分${second}秒`;
            }
            return str;
        }

        // 时间戳毫秒转成00:00:00倒计时(分：秒：毫秒)
        public static timeStampToHMMSSMS(ms: number): string {
            let str: string = "";
            let offset: number = ms - GlobalData.serverTime;
            if (offset <= 0) {
                str = "00:00:00";
            } else {

                let sec: int = offset * 0.001 >> 0;
                let minute: int = (sec / 60 >> 0) % 60;
                let hours: int = sec / 3600 >> 0;
                sec = sec % 60;
                let secMs: int = (offset % 1000) * 0.1 >> 0;
                if (sec === 0) {
                    secMs = 0;
                }
                str = (minute < 10 ? "0" : "") + minute + ":" + (sec < 10 ? "0" : "") + sec + ":" + (secMs < 10 ? "0" : "") + secMs;
            }
            return str;
        }

        // 毫秒转成00:00倒计时
        public static msToMMSS(ms: number): string {
            let str: string = "";
            if (ms <= 0) {
                str = "00:00";
            } else {
                let sec: int = ms * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                sec = sec % 60;
                str = (minute < 10 ? "0" : "") + minute + ":" + (sec < 10 ? "0" : "") + sec;
            }
            return str;
        }
        // 毫秒转成00倒计时
        public static msToSS(ms: number): string {
            let str: string = "";
            if (ms <= 0) {
                str = "00:00";
            } else {
                let sec: int = ms * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                sec = sec % 60;
                str = (sec < 10 ? "0" : "") + sec;
            }
            return str;
        }
        // 毫秒转成00:00:00倒计时
        public static msToHHMMSS(ms: number): string {
            let str: string = "";
            if (ms <= 0) {
                str = "00:00:00";
            } else {
                let sec: int = ms * 0.001 >> 0;
                let minute: int = (sec / 60 >> 0) % 60;
                let hours: int = sec / 3600 >> 0;
                sec = sec % 60;
                str = (hours < 10 ? "0" : "") + hours + ":" + (minute < 10 ? "0" : "") + minute + ":" + (sec < 10 ? "0" : "") + sec;
            }
            return str;
        }

        // 根据道具ID获取道具小图标
        public static getIconById(itemId: number, isSmall: boolean = false): string {
            let smallString: string = isSmall ? "_s" : "";
            let itemType: number = this.getItemTypeById(itemId);
            let str: string = "";
            if (itemType === ItemMType.Equip) {
                str = "assets/icon/item/" + ItemEquipCfg.instance.getItemCfgById(itemId)[item_equipFields.ico] + smallString + ".png";
            } else if (itemType === ItemMType.Stone) {
                str = "assets/icon/item/" + ItemStoneCfg.instance.getItemCfgById(itemId)[item_stoneFields.ico] + smallString + ".png";
            } else if (itemType === ItemMType.Rune) {
                let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                str = `assets/icon/item/${ItemRuneCfg.instance.getCfgById(dimId)[item_runeFields.ico]}${smallString}.png`;
            } else {
                let subType: number = CommonUtil.getItemSubTypeById(itemId);
                let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
                let icon: number = parseInt(cfg[item_materialFields.ico]);


                // 头像
                if ((itemType === ItemMType.Consume && (subType === 16))) {
                    icon = icon + PlayerModel.instance.occ;
                }
                // 时装
                if ((itemType === ItemMType.Material && (subType === 23 || subType === 25)) || (itemType === ItemMType.Unreal && subType === UnrealItemType.fashionShow)) {
                    icon = icon + PlayerModel.instance.occ;
                }
                str = "assets/icon/item/" + icon + smallString + ".png";
            }
            return str;
        }

        // 获取资产图标by UnrealItemType
        public static getAssetsIcon(type: UnrealItemType, isSmall: boolean = false): string {
            let smallString: string = isSmall ? "_s" : "";
            let str: string = "";

            switch (type) {
                case UnrealItemType.copper:
                    str = `assets/icon/item/3${smallString}.png`;
                    break;
                case UnrealItemType.gold:
                    str = `assets/icon/item/1${smallString}.png`;
                    break;
                case UnrealItemType.xianYu:
                    str = `assets/icon/item/41${smallString}.png`;
                    break;
            }

            return str;
        }

        // 获取资产图标by 道具id
        public static getAssetsIconByItemID(itemid: number, isSmall: boolean = false): string {
            let type: UnrealItemType;

            if (itemid == 90140001) {
                type = UnrealItemType.gold;
            } else if (itemid == 90330001) {
                type = UnrealItemType.copper;
            } else if (itemid == 94150001) {
                type = UnrealItemType.xianYu;
            }

            return this.getAssetsIcon(type, isSmall);
        }

        /**
         * 将大number转成“万”、“亿”
         * @param num 
         * @param isXiaoShu true 去尾 false 四舍五入
         * @returns str
         */
        public static bigNumToString(num: number, isXiaoShu: boolean = true): string {
            if (num >= 10000000000000000) {
                if (isXiaoShu) {
                    return Math.floor(num / 100000000000000) / 100 + "京";
                } else {
                    return Math.round(Math.floor(num / 100000000000000) / 100) + "京";
                }
            } else if (num >= 1000000000000) {
                if (isXiaoShu) {
                    return Math.floor(num / 10000000000) / 100 + "兆";
                } else {
                    return Math.round(Math.floor(num / 10000000000) / 100) + "兆";
                }
            } else if (num >= 100000000) {
                if (isXiaoShu) {
                    return Math.floor(num / 1000000) / 100 + "亿";
                } else {
                    return Math.round(Math.floor(num / 1000000) / 100) + "亿";
                }
            } else if (num >= 100000) {
                if (isXiaoShu) {
                    return Math.floor(num / 100) / 100 + "万";
                } else {
                    return Math.round(Math.floor(num / 100) / 100) + "万";
                }
            }
            return num.toString();
        }

        // 从小到大排序
        public static smallToBigSort(a: number, b: number): number {
            return a < b ? -1 : 1;
        }

        //埋点事件发送
        public static runActorOper(eventType: ActorOperType, params: number[]): void {
            Channel.instance.publish(UserFeatureOpcode.RunActorOper, [eventType, params]);
        }

        /**传入毫秒判断时间多少 */
        public static getTimeTypeAndTime(msTime: number): string {
            if (msTime > utils.Unit.day) {
                return `${Math.floor(msTime / utils.Unit.day)}天`;
            } else if (msTime > utils.Unit.hour) {
                return `${Math.floor(msTime / utils.Unit.hour)}小时`;
            } else if (msTime > utils.Unit.minute) {
                return `${Math.floor(msTime / utils.Unit.minute)}分钟`;
            } else if (msTime > utils.Unit.second) {
                return `${Math.floor(msTime / utils.Unit.second)}秒`;
            }
            return `1秒`;
        }

        public static formatTime(msTime: number): string {
            let day: number = 0, hour: number = 0, minute: number = 0, second: number = 0;
            if (msTime > utils.Unit.day) {
                day = Math.floor(msTime / utils.Unit.day);
                hour = Math.round((msTime % utils.Unit.day) / utils.Unit.hour);
                return `${day}天${hour}小时`;
            } else if (msTime > utils.Unit.hour) {
                hour = Math.floor(msTime / utils.Unit.hour);
                minute = Math.round((msTime % utils.Unit.hour) / utils.Unit.minute);
                return `${hour}小时${minute}分钟`;
            } else if (msTime > utils.Unit.minute) {
                return `${Math.floor(msTime / utils.Unit.minute)}分钟`;
            }
            return `午时已到`;
        }

        //创建特效
        public static creatEff(parentNode: Laya.Node, name: string, maxFrameUrls: number, minFrameUrls: number = 0, loop: boolean = true, durationFrame: number = 5): CustomClip {
            let eff = new CustomClip();
            eff.skin = `assets/effect/${name}.atlas`;
            let resName: string = name.split("/").pop();
            let frameStrs: string[] = [];
            for (let i: int = minFrameUrls; i <= maxFrameUrls; i++) {
                frameStrs.push(`${resName}/${i}.png`);
            }
            eff.frameUrls = frameStrs;
            eff.durationFrame = durationFrame;
            eff.loop = loop;
            if (parentNode) {
                parentNode.addChild(eff);
            }
            return eff;
        }

        // 根据道具id获取道具重叠上限
        public static getOverlapByItemId(itemId: number): number {
            let overlap: number = 1;
            let itemType: ItemMType = CommonUtil.getItemTypeById(itemId);
            if (itemType === ItemMType.Rune) {
                let pureId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                overlap = ItemRuneCfg.instance.getCfgById(pureId)[item_runeFields.overlap];
            } else if (itemType === ItemMType.Equip) {
                overlap = ItemEquipCfg.instance.getItemCfgById(itemId)[item_equipFields.overlap];
            } else if (itemType === ItemMType.Stone) {
                overlap = ItemStoneCfg.instance.getItemCfgById(itemId)[item_stoneFields.overlap];
            } else {
                overlap = ItemMaterialCfg.instance.getItemCfgById(itemId)[item_materialFields.overlap];
            }
            return overlap;
        }

        //元素根据第一个接连适配位置
        public static chainArr(params: Laya.Sprite[], widthSpace: number = 0): void {
            for (let i: int = 1, len: int = params.length; i < len; i++) {
                params[i].x = params[i - 1].x + params[i - 1].width + widthSpace;
            }
        }

        //所有元素居中适配   1父节点宽度 2元素 3 4左侧留白距离
        public static centerChainArr(parentNodeWidth: number, param: Array<any>, space: number = 0, leftDistance: number = 0): number {
            let sumWidth: number = (param.length - 1) * space;
            for (let i: int = 0, len: int = param.length; i < len; i++) {
                sumWidth += param[i].width;
            }

            let initX: int = (parentNodeWidth - sumWidth + leftDistance) / 2;
            param[0].x = initX;
            for (let i: int = 1, len: int = param.length; i < len; i++) {
                param[i].x = param[i - 1].x + param[i - 1].width + space;
            }
            return initX
        }


        //根据父节点宽度适配items
        public static autoFitBySumWidth(parentWidth: number, childWidth: number, items: BaseItem[]): void {
            let objWidth: number = childWidth;
            let len: number = items.length;
            let space: number = (parentWidth - objWidth * len) / (len + 1);
            for (let i: int = 0; i < len; i++) {
                items[i].x = space + i * (objWidth + space);
            }
        }

        //阿拉伯数字转中文大写
        public static numToUpperCase(num: number): string {
            if (num <= 10) {
                return CommonUtil._numStr[num];
            } else {
                let temp = num + ""
                return "十" + CommonUtil._numStr[Number(temp[1])];
            }

        }

        //常规错误码处理
        public static codeDispose(code: number, succeedWord: string): void {
            if (code) {
                CommonUtil.noticeError(code);
            } else {
                SystemNoticeManager.instance.addNotice(succeedWord);
            }
        }

        /**
         * 根据道具ID获取名字
         * @param itemId 道具id
         */
        public static getNameByItemId(itemId: number): string {
            let _itemCfg = CommonUtil.getItemCfgById(itemId);
            let nameStr = "";
            if (!_itemCfg) return nameStr;
            let _itemType = CommonUtil.getItemTypeById(itemId);
            switch (_itemType) {
                case ItemMType.Material:
                    nameStr = _itemCfg[item_materialFields.name].toString();
                    break;
                case ItemMType.Giftbag:
                    nameStr = _itemCfg[item_materialFields.name].toString();
                    break;
                case ItemMType.Consume:
                    nameStr = _itemCfg[item_materialFields.name].toString();
                    break;
                case ItemMType.MagicWeapon:
                case ItemMType.Unreal:
                    nameStr = _itemCfg[item_materialFields.name].toString();
                    break;
                case ItemMType.Equip:
                    nameStr = _itemCfg[item_equipFields.name].toString();
                    break;
                case ItemMType.Stone:
                    nameStr = _itemCfg[item_stoneFields.name].toString();
                    break;
                case ItemMType.Unreal:
                    nameStr = (<item_material>_itemCfg)[item_materialFields.name];
                    break;
                case ItemMType.Rune:
                    let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                    let cfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                    nameStr = cfg[item_runeFields.name];
                    break;
            }
            return nameStr;
        }

        public static timeStampToDate(ms: number): string {
            let date: Date = new Date(ms);
            let minute: number = date.getMinutes();
            let minuteStr: string;
            if (minute < 10) {
                minuteStr = `0` + minute;
            } else {
                minuteStr = minute.toString();
            }
            let str: string = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${minuteStr}`;
            return str;
        }

        //根据id取数量
        public static getPropCountById(itmeId: number): number {
            let num: number = PlayerModel.instance.getCurrencyById(itmeId);
            if (num == null) {
                num = bag.BagModel.instance.getItemCountById(itmeId);
            }
            return num;
        }

        /**
         *
         * @param stage 阶数
         * @param quality 品质
         * @param star 星级
         * @param part 部位
         */
        public static getEquipIdByCondition(stage: number, quality: number, star: number, part: EquipCategory): number {
            return 5 * 10000000 + stage * 100000 + quality * 10000 + star * 1000 + part * 10 + 1;
        }

        public static goldNotEnoughAlert(handlerChuanRu: Handler = null): void {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0 && modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.FIRST_PAY_PANEL]);
                if (handlerChuanRu) {
                    handler = handlerChuanRu
                }
                CommonUtil.alert('温馨提示', '代币券不足，是否前往首充？', [handler]);
            } else {
                if (!modules.money_cat.MoneyCatModel.instance.state) {
                    //打开提示 招财猫跳转的界面
                    WindowManager.instance.open(WindowEnum.COMMON_TXT_CAT_ALERT);
                } else {
                    let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.RECHARGE_PANEL]);
                    if (handlerChuanRu) {
                        handler = handlerChuanRu
                    }
                    CommonUtil.alert('温馨提示', '代币券不足，是否前往充值界面充值？', [handler]);
                }
            }

        }

        public static vipLvNotEnoughAlert(): void {
            let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.RECHARGE_PANEL]);
            CommonUtil.alert('温馨提示', 'SVIP等级不足，是否前往提升SVIP等级？', [handler]);
        }

        public static formatItemData(datas: Items[]): Item[] {
            if (!datas) return null;
            let itemDatas: Item[] = [];
            for (let e of datas) {
                let itemId: number = e[ItemsFields.ItemId];
                let count: number = e[ItemsFields.count];
                itemDatas.push([itemId, count, 0, null]);
            }
            return itemDatas;
        }

        public static formatHtmlStrByColor(color: string, content: string): string {
            return `<span style='color:${color}'>${content}</span>`;
        }

        /**
         * 设置SVIP和VIP  初步处理
         */
        public static setSVIPandVIP(vipF: number, vip: number, bg: Image, msz: FontClip) {
            msz.sheet = `0123456789`;
            if (vip >= 1) {
                bg.skin = `common/image_common_svip.png`;
                msz.skin = `common/num_common_svip.png`;
                msz.value = vip.toString();
                msz.x = 65;
            } else {
                bg.skin = `common/image_common_vip.png`;
                msz.skin = `common/num_common_vip.png`;
                msz.value = vipF.toString();
                msz.x = 61;
            }
        }

        /**
         * 随机整数
         */
        public static getRandomInt(min: number, max: number): number {
            var Range = max - min;
            var Rand = Math.random();
            return (min + Math.round(Rand * Range));
        }



        /**
         * 背包道具虚拟道具统一延迟执行
         */
        public static delayedPutInBag() {
            bag.BagModel.instance.delayedPutInBag();
            modules.quickUse.QuickUseCtrl.instance.delayedPutInBag();
            modules.player.PlayerCtrl.instance.delayedPutInAddItems();
        }

        /**
         * 判断是否同一仙盟
         */
        public static isTongXianMeng(other: number): boolean {
            if (other) {
                // let myRole: game.role.Role = game.GameCenter.instance.getRole(PlayerModel.instance.actorId);
                // let otherRole: game.role.Role = game.GameCenter.instance.getRole(other);
                // if (myRole && otherRole) {
                //     let myFactionName: string = myRole.property.get("factionName");
                //     let otherFactionName: string = otherRole.property.get("factionName");
                //     if (myFactionName == otherFactionName) {
                //         modules.notice.SystemNoticeManager.instance.addNotice("不可攻击同一仙盟玩家", true);
                //         return true;
                //     }
                // }
                if (modules.faction.FactionModel.instance.memberList) {
                    if (modules.faction.FactionModel.instance.isTongXianMeng(other)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {

                    return false;
                }
            }
            else {
                return false;
            }
        }
        /**
         * 判断是否同一战队
         */
        public static isSameTeam(other: number): boolean {
            if (!other) return false;
            if (!modules.clan.ClanModel.instance.ClanMemberNum) return false;
            return modules.clan.ClanModel.instance.isSameMember(other) ? true : false
        }

        public static checkNullObject(value: any, word: string): void {
            if (value && value != 0) return;
            let str: string;
            if (value === null) {
                str = `值为 null`;
            } else if (value === undefined) {
                str = `值为 undefined`;
            }
            throw new Error(`${str} ${word}`);
        }

        public static showTimeFormat(time: number) {
            time = parseInt("" + time / 1000);
            var d = parseInt("" + time / (3600 * 24));
            time = time % (3600 * 24);
            var h = parseInt("" + time / (3600));
            time = time % (3600);
            var m = parseInt("" + time / 60);
            time = time % 60;
            var s = parseInt("" + time);
            if (d <= 0 && h <= 0 && m <= 0) {
                return s + "秒";
            }
            if (d <= 0 && h <= 0) {
                return m + "分" + (s > 9 ? s : "0" + s) + "秒";
            }
            if (d <= 0) {
                return h + "时" + (m > 0 ? m : "0" + m) + "分" + (s > 9 ? s : "0" + s) + "秒";
            }
            return d + "天" + (h > 0 ? h : "0" + h) + "时" + (m > 0 ? m : "0" + m) + "分";
        }

        /**
         * 转换成日期格式
         * @param time
         */
        public static getDate(time, needTime: boolean = true, separator: string = "-"): string {
            var now = new Date(Number(time));
            var yy = now.getFullYear();      //年
            var mm = now.getMonth() + 1;     //月
            var dd = now.getDate();          //日
            var hh = now.getHours();         //时
            var ii = now.getMinutes();       //分
            var ss = now.getSeconds();       //秒
            var clock = yy + separator;
            if (mm < 10) clock += "0";
            clock += mm + separator;
            if (dd < 10) clock += "0";
            clock += dd + " ";

            if (needTime) {
                if (hh < 10) clock += "0";
                clock += hh + ":";
                if (ii < 10) clock += '0';
                clock += ii + ":";
                if (ss < 10) clock += '0';
                clock += ss;
            }

            return clock
        }


        public static PHPArray(data: any) {
            let arr = []
            for (let i in data) {
                arr.push(data[i])
            }
            return arr


        }
        public static getHeadUrl(id: number): string {
            let suffix = id <= 2 ? '.png' : '.jpg';
            if (id == 4) return '2.png';
            return id + suffix;
        }

        public static splitNumber2(t, e, i = 0) {
            void 0 === i && (i = -1);
            var n = Math.pow(10, e),
                s = Math.floor(t / n);
            return -1 == i ? s : s < (n = Math.pow(10, i)) ? s : s % (Math.floor(s / n) * n)
        }

        // 根据技能ID 获取等级
        public static getSkillLvById(skillId: int): int {
            return skillId % 10000;
        }

        //计算传入时间与当前时间的时间差 返回单位天数
        public static calculateDay(time: number): number {
            time -= GlobalData.serverTime
            time = parseInt("" + time / 1000);
            var d = parseInt("" + time / (3600 * 24));
            return d < 0 ? 0 : d;

        }

        public static fillItems(items: Array<Items>, len: number, type: number = 0): Array<Items> {
            let arr = []
            items.forEach(e => {
                arr.push(e)
            })
            if (items.length < len) {
                let l = len - items.length
                if (type == 0) {
                    //头部填充
                    for (let index = 0; index < l; index++) {
                        arr.unshift(null)
                    }
                } else {
                    //尾部填充
                    for (let index = 0; index < l; index++) {
                        arr.push(null)
                    }
                }

            }
            return arr;
        }

        // 获取道具数量，包含代币券、点券
        public static getItemNum(id: number) {
            if (id == MoneyItemId.glod) {
                // 90140001 代币券
                return PlayerModel.instance.ingot;
            } else if (id == MoneyItemId.FairyCoin) {
                // 94150001 点券
                return modules.zxian_yu.ZXianYuModel.instance.xianyu;
            } else {
                return modules.bag.BagModel.instance.getItemCountById(id);
            }
        }

        /**
         * 贝塞尔曲线 让平移表现更平滑 抛弧线
         * @param cp 
         * p[0] = { x: 10, y: 10 } // 起点
         * p[1] = { x: 20, y: 5 }  // 第一个控制点
         * p[2] = { x: 30, y: 15 } // 第二个控制点
         * p[3] = { x: 40, y: 10 } // 终点
         * @param t // 0-1 时间
         * @returns 
         */
        public static PointOnCubicBezier(cp, t) {
            var ax, bx, cx;
            var ay, by, cy;
            var tSquared, tCubed;
            var result = { x: 0, y: 0 }

            cx = 3.0 * (cp[1].x - cp[0].x);
            bx = 3.0 * (cp[2].x - cp[1].x) - cx;
            ax = cp[3].x - cp[0].x - cx - bx;
            cy = 3.0 * (cp[1].y - cp[0].y);
            by = 3.0 * (cp[2].y - cp[1].y) - cy;
            ay = cp[3].y - cp[0].y - cy - by;

            /*計算位於參數值t的曲線點*/
            tSquared = t * t;
            tCubed = tSquared * t;
            result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
            result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
            return result;
        }

        public static layerToRoleType(layer: LayerType): RoleType {
            let result = RoleType.Unknown
            switch (layer) {
                case LayerType.Monster:
                    result = RoleType.Monster
                    break;
                case LayerType.Player:
                    result = RoleType.Player
                    break;
                case LayerType.Master:
                    result = RoleType.Master
                    break;
                case LayerType.Npc:
                    result = RoleType.Npc
                    break;
                case LayerType.Package:
                    result = RoleType.Package
                    break;
            }
            return result;
        }
        public static roleTolLayerType(role: RoleType) {
            let result = LayerType.Monster
            switch (role) {
                case RoleType.Monster:
                    result = LayerType.Monster
                    break;
                case RoleType.Player:
                    result = LayerType.Player
                    break;
                case RoleType.Master:
                    result = LayerType.Master
                    break;
                case RoleType.Npc:
                    result = LayerType.Npc
                    break;
                case RoleType.Package:
                    result = LayerType.Package
                    break;
            }
            return result;
        }

        public static randomColor() {
            return new Array(7).fill('#').reduce((prev, cur) => {
                return prev + Math.floor(Math.random() * 16).toString(16)
            })
        }

        /**
         * 获取随机名字
         */
        public static getRandomName(): string {
            let _familyNames = nameGenerator.familyNames;
            let _symbols = nameGenerator.symbols;
            let _manPrefix = nameGenerator.manPrefix;
            let _manSuffix = nameGenerator.manSuffix;
            let _womanPrefix = nameGenerator.womanPrefix;
            let _womanSuffix = nameGenerator.womanSuffix;
            let _commonPrefix = nameGenerator.commonPrefix;

            let isMan = Math.random() >= 0.5;
            let result: string;
            if (Math.random() >= 0.5) {
                result = `${ArrayUtils.random(_familyNames)}${ArrayUtils.random(isMan ? _manSuffix : _womanSuffix)}`;
            } else {
                let prefix: Array<string> = isMan ? _manPrefix : _womanPrefix;
                let randomIndex: number = Math.floor(Math.random() * (_commonPrefix.length + prefix.length));
                result = `${randomIndex >= _commonPrefix.length ? prefix[randomIndex - _commonPrefix.length] : _commonPrefix[randomIndex]}${ArrayUtils.random(_symbols)}${ArrayUtils.random(isMan ? _manSuffix : _womanSuffix)}`;
            }

            return result;
        }

        /**
       * 仙玉/点卷 不足提示
       */
        public static xianyuTips() {
            if (!modules.first_pay.FirstPayModel.instance._lowestRechargeShift) {
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.FIRST_PAY_PANEL]);
                CommonUtil.alert('温馨提示', '点卷不足，是否前往首充？', [handler]);
            } else {
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.ZXIANYU_PANEL]);
                CommonUtil.alert('温馨提示', '点卷不足，是否前往充值？', [handler]);
            }


        }

        /**
         * @param copyStr 内容
         * 复制内容到剪切板
         */
        public static clipboardCopyValue(copyStr: string) {
            if (navigator.clipboard && window.isSecureContext) {
                // navigator clipboard 向剪贴板写文本
                SystemNoticeManager.instance.addNotice("复制成功", false);
                return navigator.clipboard.writeText(copyStr)
            } else {
                const el = document.createElement('textarea');
                el.value = copyStr;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                SystemNoticeManager.instance.addNotice("复制成功", false);
            }
        }

        /**
         * localStorage.setItem
         * @param key 键
         * @param value 值
         */
        public static localStorageSetItem(key: string, value: string) {
            localStorage.setItem(`${PlayerModel.instance.actorId}${key}`, value);
        }

        /**
         * 返回 localStorage.getItem
         * @param key 
         * @returns string | null
         */
        public static localStorageGetItem(key: string): string | null {
            return localStorage.getItem(`${PlayerModel.instance.actorId}${key}`);
        }
    }
}
