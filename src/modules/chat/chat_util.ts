/** 聊天工具类*/
///<reference path="../config/broadcast_cfg.ts"/>
namespace modules.chat {
    import WindowManager = modules.core.WindowManager;
    import FactionCtrl = modules.faction.FactionCtrl;
    import ChatContent = Protocols.ChatContent;
    import ChatContentFields = Protocols.ChatContentFields;
    import BroadcastCfg = modules.config.BroadcastCfg;
    import broadcastFields = Configuration.broadcastFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import ItemStoneCfg = modules.config.ItemStoneCfg;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_composeFields = Configuration.item_composeFields;
    import ComposeCfg = modules.config.ComposeCfg;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import lilian_riseFields = Configuration.lilian_riseFields;
    import ExerciseCfg = modules.config.ExerciseCfg;

    export class ChatUtil {

        // 广播字符串格式化
        public static formatStr(str: string, ...args: Array<string>): string {
            for (let i: int = 0, len: int = args.length; i < len; i++) {
                str = str.replace(`#${i}#`, args[i]);
            }
            return str;
        }

        // 系统广播解析
        public static parseBroadcaset(value: ChatContent): string {
            let id: number = value[ChatContentFields.contentId];
            if (id == 0) {
                return value[ChatContentFields.content];
            }
            let channel: ChatChannel = value[ChatContentFields.channel];
            let strParam: string[] = value[ChatContentFields.strParam];
            let numParam: number[] = value[ChatContentFields.numParam];
            let cfg: Configuration.broadcast = BroadcastCfg.instance.getCfgById(id);
            if (!cfg) return;
            let str: string = cfg[broadcastFields.content];
            let tempStr: string[] = [];
            let linkParams: string; //id  和任意参数
            if (id == BroadcastId.month_card) {
                /** 1 月卡*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.vip_level) {
                /** 2 vip升级*/
                tempStr = [strParam[0], numParam[0].toString()];
            } else if (id == BroadcastId.ride_grade) {
                /** 3 精灵进阶*/
                tempStr = [strParam[0], numParam[0].toString()];
            } else if (id == BroadcastId.ride_magic) {
                /** 4 精灵幻化*/
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.ride_refine) {
                /** 5 精灵修炼*/
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21001)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.pet_grade) {
                /** 6 宠物进阶*/
                tempStr = [strParam[0], numParam[0].toString()];
            } else if (id == BroadcastId.pet_magic) {
                /** 7 宠物幻化*/
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.pet_refine) {
                /** 8 宠物修炼*/
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21002)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.amulet_activate) {
                /** 9 圣物激活*/
                let itemId: number = numParam[0];
                let name: string = ItemMaterialCfg.instance.getItemCfgById(itemId)[item_materialFields.name];
                let quality: number = CommonUtil.getItemQualityById(itemId);
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.amulet_grade) {
                /** 10 圣物属性*/
                let name: string = config.AmuletRiseCfg.instance.getCfgBylevel(numParam[0])[Configuration.amuletRiseFields.cultivatText];
                tempStr = [strParam[0], name];
            } else if (id == BroadcastId.skill_train_activate) {
                /** 11 秘术激活*/
                let skillId: number = numParam[0] * 10000 + 1;
                let name: string = config.SkillCfg.instance.getCfgById(skillId)[Configuration.skillFields.name];
                tempStr = [strParam[0], `${name}`];
            } else if (id == BroadcastId.strong_rise2) {
                /** 12 强化神将*/
                tempStr = [strParam[0], numParam[0].toString()];
            } else if (id == BroadcastId.gem_inlay) {
                /** 13 仙石镶嵌*/
                let itemId: number = numParam[0];
                let name: string = ItemStoneCfg.instance.getItemCfgById(itemId)[item_stoneFields.name];
                let quality: number = CommonUtil.getItemQualityById(itemId);
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.gem_compose) {
                /** 14 仙石合成*/
                //  try {
                let itemId: number = numParam[0];
                let name: string = ComposeCfg.instance.getCfgById(itemId)[item_composeFields.name][Configuration.idNameFields.name];
                let quality: number = CommonUtil.getItemQualityById(itemId);
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
                // } catch (error) {
                //     console.error("徽章合成出错:", "道具id:", numParam[0], "数据:", value, "err:", error);
                // }
            } else if (id == BroadcastId.shenbing_magic) {
                /** 15 幻武*/
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.shenbing_rise) {
                /** 16 幻武附魂*/
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21003)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.wing_magic) {
                /** 17 翅膀幻化*/
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.wing_rise) {
                /** 18 翅膀附魂*/
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21004)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.dahuang_layer) {
                /** 19 大荒层数*/
                tempStr = [strParam[0], numParam[0].toString()];
            } else if (id == BroadcastId.three_boss) {
                /** 20 击杀三界BOSS*/
                let name: string = config.MonsterCfg.instance.getMonsterById(numParam[0])[Configuration.monsterFields.name];
                tempStr = [strParam[0], name];
            } else if (id == BroadcastId.multi_boss) {
                /** 21 多人BOSS伤害排名第一*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.xianwei_grade) {
                /** 22 成就达到阶级*/
                let name: string = config.XianweiRiseCfg.instance.getXianweiRiseByLevel(numParam[0])[Configuration.xianwei_riseFields.name];
                tempStr = [strParam[0], name];
            } else if (id == BroadcastId.era) {
                /** 23 达到几转*/
                let lv: number = numParam[0];
                let cfg: Configuration.era = BornCfg.instance.getCfgByLv(lv);
                let name: string = cfg ? cfg[eraFields.name] : `觉醒等级未配置`;
                tempStr = [strParam[0], name];
            } else if (id == BroadcastId.lilian) {
                /** 24 历炼*/
                let lv: number = numParam[0];
                let name: string = ExerciseCfg.instance.getZLLCfgByLev(lv)[lilian_riseFields.name];
                tempStr = [strParam[0], name];
            } else if (id == BroadcastId.nineCopyPrepare) {
                /** 25 副本预备*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.nineCopyOpen) {
                /** 26 副本开启*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.nideCopyRankFirst) {
                /** 27 九天之巅第一名*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.nideCopyRankSecond) {
                /** 28 九天之巅第二名*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.nideCopyRankThird) {
                /** 29 九天之巅第三名*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.nineCopyClose) {
                /** 30 副本关闭*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.firstPay) {
                /** 31 首充完成*/
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.faction) {
                /** 32 仙盟*/
                linkParams = strParam[1];  //仙盟id
                tempStr = [strParam[0]];
            } else if (id == BroadcastId.factionBox) {
                /** 33 仙盟宝箱求助*/
                linkParams = strParam[1];  //宝藏id
                let name: string = strParam[0];
                let boxColor: FactionBoxColor = numParam[0];
                let boxName: string = faction.FactionUtil.boxName[boxColor];
                let nameColor: string = channel === ChatChannel.system ? `#e97900` : `#ea8706`;
                tempStr = [`<span style='color:${nameColor}'>${name}</span>`, `<span style='color:${CommonUtil.getColorByQuality(boxColor + 1)}'>${boxName}</span>`];
            } else if (id == BroadcastId.fashion_magic) {       // 时装幻化
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.fashion_rise) {           // 时装附魂
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21005)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.tianZhu_magic) {          // 神兽幻化
                let itemId: number = numParam[0];
                let name: string = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.name];
                let quality: number = ExteriorSKCfg.instance.getCfgById(itemId)[ExteriorSKFields.quality];
                tempStr = [strParam[0], `<span style='color:${CommonUtil.getColorByQuality(quality)}'>${name}</span>`];
            } else if (id == BroadcastId.tianZhu_rise) {           // 神兽附魂
                let index: number = numParam[0];
                let name: string = BlendCfg.instance.getCfgById(21006)[blendFields.stringParam][index];
                tempStr = [strParam[0], name, numParam[1].toString()];
            } else if (id == BroadcastId.zhizun_card) {
                let name: string = strParam[0];
                tempStr = [name];
            }

            str = this.formatStr(str, ...tempStr);
            let linkParam: string[] = BroadcastCfg.instance.getCfgById(id)[broadcastFields.link];
            linkParams = `${linkParam[1]}#${linkParams}`;
            let color: string = channel === ChatChannel.system ? `#50ff28` : `#168a17`;
            let linkTxt: string = `<a href="${linkParams}"><span style='color:${color}'>${linkParam[0]}</span></a>`;
            if (!linkTxt) linkTxt = ``;
            str += linkTxt;
            return str;
        }

        public static linkHandler(linkParams: string): void {
            let id: number = parseInt(linkParams.split(`#`)[0]);
            if (id == ActionOpenId.factionJoin) {
                let param: string = linkParams.split(`#`)[1];
                FactionCtrl.instance.joinFaction([param, 0]);
            } else if (id == ActionOpenId.helpBaozang) { //宝藏帮助列表
                let boxId: string = linkParams.split(`#`)[1];
                WindowManager.instance.open(WindowEnum.BAOZANG_HELP_LIST_PANEL, boxId);
            } else if (id == ActionOpenId.factionCopy) { //仙盟副本
                WindowManager.instance.open(WindowEnum.FACTION_COPY_PANEL);
            } else {
                WindowManager.instance.openByActionId(id);
            }
        }

        public static getChatPanelByChatType(type: ChatChannel): WindowEnum {
            let panel: WindowEnum;
            switch (type) {
                case ChatChannel.cross: {
                    panel = WindowEnum.CHAT_JIUZHOU_PANEL;
                    break;
                }
                case ChatChannel.local: {
                    panel = WindowEnum.CHAT_BENFU_PANEL;
                    break;
                }
                case ChatChannel.faction: {
                    panel = WindowEnum.CHAT_FACTION_PANEL;
                    break;
                }
                case ChatChannel.marry: {
                    panel = WindowEnum.CHAT_MARRY_PANEL;
                    break;
                }
                case ChatChannel.system: {
                    panel = WindowEnum.CHAT_SYSTEM_PANEL;
                    break;
                }
            }
            return panel;
        }
    }
}
