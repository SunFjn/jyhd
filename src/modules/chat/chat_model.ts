///<reference path="../config/chat_face_cfg.ts"/>
///<reference path="../../utils/string_utils.ts"/>
///<reference path="../faction/faction_model.ts"/>
///<reference path="../marry/marry_model.ts"/>

namespace modules.chat {
    import UpdateChat = Protocols.UpdateChat;
    import ChatPackage = Protocols.ChatPackage;
    import UpdateChatFields = Protocols.UpdateChatFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BlackInfo = Protocols.BlackInfo;
    import UpdateBlackList = Protocols.UpdateBlackList;
    import UpdateBlackListFields = Protocols.UpdateBlackListFields;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatContentFields = Protocols.ChatContentFields;
    import ChatPlayerInfoFields = Protocols.ChatPlayerInfoFields;

    import Item = Protocols.Item;
    import ChatPlayerDetailedInfo = Protocols.ChatPlayerDetailedInfo;
    import ChatFaceCfg = modules.config.ChatFaceCfg;
    import StringUtils = utils.StringUtils;
    import FactionModel = modules.faction.FactionModel;
    import MarryModel = modules.marry.MarryModel;
    export class ChatModel {
        private static _instance: ChatModel;
        public static get instance(): ChatModel {
            return this._instance = this._instance || new ChatModel();
        }

        private _faceType: number;  //选中的表情类型 0普通 1vip
        private _unlockLv: number[];
        private _chatCDTime: number[];   //各个频道的聊天冷却时间
        private _sendVipFaceTime: number;
        private _blackList: BlackInfo[];
        private _jiuzhouChatRecord: ChatPackage[];  //九州聊天记录
        private _benfuChatRecord: ChatPackage[];   //本服聊天记录
        private _systemChatRecord: ChatPackage[];  //系统聊天记录
        private _factionChatRecord: ChatPackage[];  //仙盟聊天记录
        private _marryChatRecord: ChatPackage[];  //姻缘聊天记录
        private _currChatChannel: ChatChannel;  //当前类型
        private _checkedFace: string[];  //选中的表情
        private _maxExpertFaceTime: number;
        private _minSendVipFaceLv: number;
        private _blackListOpt: number;
        private _otherPlayerInfo: ChatPlayerDetailedInfo;

        public virtualItem: Item;
        public sendChatInfo: string;  //记录发送失败的消息
        public noSeeMessage: boolean = false;
        public maxCacheMessageNum: number[]; //消息的最大缓存数量 26005  0广播 1九州 2本服 3系统

        constructor() {
            this._faceType = 0;
            this._unlockLv = BlendCfg.instance.getCfgById(26001)[blendFields.intParam];
            this._maxExpertFaceTime = BlendCfg.instance.getCfgById(26002)[blendFields.intParam][0];
            this.maxCacheMessageNum = BlendCfg.instance.getCfgById(26005)[blendFields.intParam];
            this._chatCDTime = BlendCfg.instance.getCfgById(26006)[blendFields.intParam];
            this._minSendVipFaceLv = BlendCfg.instance.getCfgById(26003)[blendFields.intParam][0];
            this._sendVipFaceTime = 0;
            this._blackList = [];
            this._jiuzhouChatRecord = [];
            this._benfuChatRecord = [];
            this._systemChatRecord = [];
            this._factionChatRecord = [];
            this._marryChatRecord = [];
            this._currChatChannel = ChatChannel.cross;
            this.virtualItem = [0, 0, 0, [null, null, null, null, [0, null], 0, 0, 0, 0]];
            this._checkedFace = [];
            this._blackListOpt = -1;
        }

        public updateChat(tuple: UpdateChat, isRecord: boolean = false): void {
            let type: number = tuple[UpdateChatFields.chatPack][ChatPackageFields.content][ChatContentFields.channel];
            if (type == ChatChannel.system) {  //系统
                this._systemChatRecord.push(tuple[UpdateChatFields.chatPack]);
                this.isDeleteMessage(this._systemChatRecord, ChatChannel.system);
                GlobalData.dispatcher.event(CommonEventType.SYSTEM_MESSAGE_UPDATE);
            } else if (type == ChatChannel.cross) {//九洲
                this._jiuzhouChatRecord.push(tuple[UpdateChatFields.chatPack]);
                this.isDeleteMessage(this._jiuzhouChatRecord, ChatChannel.cross);
                GlobalData.dispatcher.event(CommonEventType.JIUZHOU_MESSAGE_UPDATE);
            } else if (type == ChatChannel.local) {   //本服
                this._benfuChatRecord.push(tuple[UpdateChatFields.chatPack]);
                this.isDeleteMessage(this._benfuChatRecord, ChatChannel.local);
                GlobalData.dispatcher.event(CommonEventType.BENFU_MESSAGE_UPDATE);
            } else if (type == ChatChannel.faction) {//  仙盟
                this._factionChatRecord.push(tuple[UpdateChatFields.chatPack]);
                this.isDeleteMessage(this._factionChatRecord, ChatChannel.faction);
                if (FactionModel.instance.factionId && !isRecord && this._currChatChannel != ChatChannel.faction) {
                    this.noSeeMessage = true;
                }
                GlobalData.dispatcher.event(CommonEventType.FACTION_MESSAGE_UPDATE);
            } else if (type == ChatChannel.marry) {//  姻缘
                this._marryChatRecord.push(tuple[UpdateChatFields.chatPack]);
                this.isDeleteMessage(this._marryChatRecord, ChatChannel.marry);
                if (MarryModel.instance.isHave && !isRecord && this._currChatChannel != ChatChannel.marry) {
                    this.noSeeMessage = true;
                }
                GlobalData.dispatcher.event(CommonEventType.MARRY_MESSAGE_UPDATE);
            }
            GlobalData.dispatcher.event(CommonEventType.CHAT_UPDATE);
        }



        public deleteChat(tuple: UpdateChat, isRecord: boolean = false): void {
            let type: number = tuple[UpdateChatFields.chatPack][ChatPackageFields.content][ChatContentFields.channel];
            if (type == ChatChannel.cross) {//九洲
                this.deleteMessage(this._jiuzhouChatRecord, tuple)
                this.isDeleteMessage(this._jiuzhouChatRecord, ChatChannel.cross);
                GlobalData.dispatcher.event(CommonEventType.JIUZHOU_MESSAGE_UPDATE);
            } else if (type == ChatChannel.local) {   //本服
                this.deleteMessage(this._benfuChatRecord, tuple)
                this.isDeleteMessage(this._benfuChatRecord, ChatChannel.local);
                GlobalData.dispatcher.event(CommonEventType.BENFU_MESSAGE_UPDATE);
            } else if (type == ChatChannel.faction) {//  仙盟
                this.deleteMessage(this._factionChatRecord, tuple)
                this.isDeleteMessage(this._factionChatRecord, ChatChannel.faction);
                if (FactionModel.instance.factionId && this._currChatChannel != ChatChannel.faction) {
                    this.noSeeMessage = true;
                }
                GlobalData.dispatcher.event(CommonEventType.FACTION_MESSAGE_UPDATE);
            } else if (type == ChatChannel.marry) {//  姻缘
                this.deleteMessage(this._marryChatRecord, tuple)
                this.isDeleteMessage(this._marryChatRecord, ChatChannel.marry);
                if (MarryModel.instance.isHave && this._currChatChannel != ChatChannel.marry) {
                    this.noSeeMessage = true;
                }
                GlobalData.dispatcher.event(CommonEventType.MARRY_MESSAGE_UPDATE);
            }
            GlobalData.dispatcher.event(CommonEventType.CHAT_UPDATE);
        }
        public deleteMessage(chatRecord: ChatPackage[], tuple: UpdateChat): void {

            let delObjid = tuple[UpdateChatFields.chatPack][ChatPackageFields.senderInfo][ChatPlayerInfoFields.agentId]
            let deltime = tuple[UpdateChatFields.chatPack][ChatPackageFields.content][ChatContentFields.create_time][0]
            for (let index = 0; index < chatRecord.length; index++) {
                if (chatRecord[index][ChatPackageFields.content].length > ChatContentFields.create_time) {
                    let objid = chatRecord[index][ChatPackageFields.senderInfo][ChatPlayerInfoFields.agentId]
                    let time = chatRecord[index][ChatPackageFields.content][ChatContentFields.create_time][0]
                    if (objid == delObjid && time == deltime) {
                        chatRecord.splice(index, 1)
                        return;
                    }
                }
            }
        }


        private isDeleteMessage(arr: ChatPackage[], type: ChatChannel): void {
            if (arr.length > this.maxCacheMessageNum[type]) {
                arr.shift();
            }
        }

        public updateBlackList(tuple: UpdateBlackList): void {
            this._blackList = tuple[UpdateBlackListFields.blackList];
            GlobalData.dispatcher.event(CommonEventType.CHAT_BLACK_LIST_UPDATE);
        }

        public initOtherPlayerInfo(tuple: ChatPlayerDetailedInfo): void {
            this._otherPlayerInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.OTHER_PLAYER_INFO);
        }

        public initChatInfoByType(type: number): void {
            if (type == ChatChannel.system) {  //系统
                this._systemChatRecord.length = 0;
            } else if (type == ChatChannel.cross) {//九洲
                this._jiuzhouChatRecord.length = 0;
            } else if (type == ChatChannel.local) {   //本服
                this._benfuChatRecord.length = 0;
            } else if (type == ChatChannel.faction) {   //仙盟
                this._factionChatRecord.length = 0;
            } else if (type == ChatChannel.marry) {   //姻缘
                this._marryChatRecord.length = 0;
            }
        }

        public get otherPlayerInfo(): ChatPlayerDetailedInfo {
            return this._otherPlayerInfo;
        }

        public get jiuzhouChatRecord(): ChatPackage[] {
            return this._jiuzhouChatRecord;
        }

        public get benfuChatRecord(): ChatPackage[] {
            return this._benfuChatRecord;
        }

        public get systemChatRecord(): ChatPackage[] {
            return this._systemChatRecord;
        }

        public get factionChatRecord(): ChatPackage[] {
            return this._factionChatRecord;
        }

        public get marryChatRecord(): ChatPackage[] {
            return this._marryChatRecord;
        }

        public set faceType(type: number) {
            this._faceType = type;
        }

        public get faceType(): number {
            return this._faceType;
        }

        public set sendVipFaceTime(type: number) {
            this._sendVipFaceTime = type;
        }

        public get sendVipFaceTime(): number {
            return this._sendVipFaceTime;
        }

        public get blackList(): Array<BlackInfo> {
            return this._blackList;
        }

        public set currChatChannel(value: number) {
            this._currChatChannel = value;
            if (this._currChatChannel == ChatChannel.faction) {
                this.noSeeMessage = false;
            }
        }

        public get currChatChannel(): number {
            return this._currChatChannel;
        }

        public get checkedFace(): string[] {
            return this._checkedFace;
        }

        public get maxExpertFaceTime(): number {
            return this._maxExpertFaceTime;
        }

        public get minSendVipFaceLv(): number {
            return this._minSendVipFaceLv;
        }

        public set blackListOpt(type: number) {
            this._blackListOpt = type;
        }

        public get blackListOpt(): number {
            return this._blackListOpt;
        }

        //26001 分别对应 0文字 1快捷语句 2高级表情 3道具 解锁等级
        public getUnlockLv(index: number): number {
            return this._unlockLv[index];
        }

        //聊天的cd时间 0广播 1九州 2本服 3系统
        public getChatCDTime(index: number): number {
            return this._chatCDTime[index];
        }

        public isValidContent(name: string): boolean {
            return StringUtils.isValidWords(name);
        }

        //将敏感词汇转换成*
        public wordReplace(content: string): string {
            return StringUtils.replaceFilterWords(content, "*");
        }

        // 聊天表情格式化
        public chatFaceformatStr(str: string): string {
            let names = ChatFaceCfg.instance.getFaceNamesByType(0);
            let imgs = ChatFaceCfg.instance.getFaceImgsByType(0);
            for (let i: int = 0, len = names.length; i < len; i++) {
                let exp = names[i];
                exp.lastIndex = 0;
                if (exp.test(str)) {
                    exp.lastIndex = 0;
                    str = str.replace(exp, imgs[i]);
                }
            }
            return str;
        }

        // 聊天高级表情格式化
        public setFaceEffFrame(eff: common.CustomClip, id: number): void {
            eff.skin = `assets/effect/chat_face/${id}.atlas`;
            let str: string[] = [];
            for (let i: int = 1; i <= 8; i++) {
                str.push(`${id}/000${i}.png`);
            }
            eff.frameUrls = str;
        }
    }
}
