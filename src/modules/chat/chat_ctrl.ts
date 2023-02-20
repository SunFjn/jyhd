///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../notice/server_broadcast_manager.ts"/>


/** 聊天*/
namespace modules.chat {
    import BlendCfg = modules.config.BlendCfg;
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GMCommand = Protocols.GMCommand;
    import GMCommandReply = Protocols.GMCommandReply;
    import GMCommandReplyFields = Protocols.GMCommandReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CommonUtil = modules.common.CommonUtil;
    import UpdateChat = Protocols.UpdateChat;
    import UserChatOpcode = Protocols.UserChatOpcode;
    import GetChatDetailedInfo = Protocols.GetChatDetailedInfo;
    import GetChatRecordReply = Protocols.GetChatRecordReply;
    import GetChatPlayerDetailedInfoReply = Protocols.GetChatPlayerDetailedInfoReply;
    import BlackListOpt = Protocols.BlackListOpt;
    import BlackListOptReply = Protocols.BlackListOptReply;
    import UpdateBlackList = Protocols.UpdateBlackList;
    import BlackListOptReplyFields = Protocols.BlackListOptReplyFields;
    import GetChatRecordReplyFields = Protocols.GetChatRecordReplyFields;
    import ChatPackage = Protocols.ChatPackage;
    import UpdateChatFields = Protocols.UpdateChatFields;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatContentFields = Protocols.ChatContentFields;
    import BlackInfoFields = Protocols.BlackInfoFields;
    import ChatPlayerInfoFields = Protocols.ChatPlayerInfoFields;
    import ChatReply = Protocols.ChatReply;
    import ChatReplyFields = Protocols.ChatReplyFields;
    import GetChatInfoReply = Protocols.GetChatInfoReply;
    import GetChatInfoReplyFields = Protocols.GetChatInfoReplyFields;
    import GetChatPlayerDetailedInfoReplyFields = Protocols.GetChatPlayerDetailedInfoReplyFields;
    import UpdateChatInfo = Protocols.UpdateChatInfo;
    import UpdateChatInfoFields = Protocols.UpdateChatInfoFields;
    import ServerBroadcastManager = modules.notice.ServerBroadcastManager;
    import ChatContent = Protocols.ChatContent;
    import FactionModel = modules.faction.FactionModel;
    import MarryModel = modules.marry.MarryModel;


    export class ChatCtrl extends BaseCtrl {
        private static _instance: ChatCtrl;
        public static get instance(): ChatCtrl {
            return this._instance = this._instance || new ChatCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GMCommandReply, this, this.gmCommandReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateChat, this, this.updateChat);
            Channel.instance.subscribe(SystemClientOpcode.GetChatRecordReply, this, this.getChatRecordReply);
            Channel.instance.subscribe(SystemClientOpcode.GetChatPlayerDetailedInfoReply, this, this.getChatPlayerDetailedInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBlackListReply, this, this.getBlackListReply);
            Channel.instance.subscribe(SystemClientOpcode.BlackListOptReply, this, this.blackListOptReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateBlackList, this, this.updateBlackList);
            Channel.instance.subscribe(SystemClientOpcode.ChatReply, this, this.chatReply);
            Channel.instance.subscribe(SystemClientOpcode.GetChatInfoReply, this, this.getChatInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateChatInfo, this, this.updateChatInfo);

            this.requsetAllData();
            this.buildSystemMassage();
        }

        public requsetAllData(): void {
            this.getBlackList();
            this.getCharInfo();
        }

        private buildSystemMassage(): void {
            let delayTime: number = BlendCfg.instance.getCfgById(26009)[Configuration.blendFields.intParam][0];
            let words: string[] = BlendCfg.instance.getCfgById(26008)[Configuration.blendFields.stringParam];
            let word: string = words[Math.floor(Math.random() * words.length)];
            let chatContent: ChatContent = [3, 0, 0, word, null, null, null, []];
            let chatPackage: ChatPackage = [null, chatContent];
            ChatModel.instance.updateChat([chatPackage]);
            Laya.timer.once(delayTime, this, this.buildSystemMassage);
        }

        // 发送GM命令
        public gmCommand(command: string): void {
            let gmCommand: GMCommand = [command];
            Channel.instance.publish(UserFeatureOpcode.GMCommand, gmCommand);
        }

        //获取聊天记录返回
        public getChatRecordReply(tuple: GetChatRecordReply): void {
            let records: Array<ChatPackage> = tuple[GetChatRecordReplyFields.chatRecord];
            let channel: number = tuple[GetChatRecordReplyFields.channel];
            ChatModel.instance.initChatInfoByType(channel);
            for (let i: int = 0, len: int = records.length; i < len; i++) {
                this.updateChat([records[i]], true);
            }
        }

        //更新聊天信息            isRecord:是否是历史记录
        private updateChat(tuple: UpdateChat, isRecord: boolean = false): void {
            let content: ChatContent = tuple[UpdateChatFields.chatPack][ChatPackageFields.content];
            if (!content) return;
            if (content[ChatContentFields.channel] === ChatChannel.broadcast) {       // 跑马灯
                ServerBroadcastManager.instance.addBroadcast(ChatUtil.parseBroadcaset(content));
            }
            let del = false
            if (content.length > ChatContentFields.create_time) {
                if (content[ChatContentFields.create_time].length >= 2 &&
                    content[ChatContentFields.create_time][1] == -1)
                    del = true
            }

            if (del) {
                //长度等于2时判断异常
                //删除一条记录
                ChatModel.instance.deleteChat(tuple, isRecord);
            } else {
                //黑名单判断
                let currId: number = tuple[UpdateChatFields.chatPack][ChatPackageFields.senderInfo][ChatPlayerInfoFields.agentId];
                for (let i: int = 0, len: int = ChatModel.instance.blackList.length; i < len; i++) {
                    let id: number = ChatModel.instance.blackList[i][BlackInfoFields.agentId];
                    if (id == currId) {
                        return;
                    }
                }

                //敏感字处理
                if (currId) {
                    //聊天类型是文字 转换敏感词汇
                    if (content[ChatContentFields.contentType] == 0) {
                        let contentStr: string = content[ChatContentFields.content];
                        //判断敏感词汇
                        contentStr = ChatModel.instance.wordReplace(contentStr);
                        contentStr = contentStr.substr(0, 38);
                        content[ChatContentFields.content] = ChatModel.instance.chatFaceformatStr(contentStr);
                    }
                }

                ChatModel.instance.updateChat(tuple, isRecord);
            }

        }



        //请求聊天玩家详细信息
        public getChatDetailedInfo(tuple: GetChatDetailedInfo): void {
            Channel.instance.publish(UserChatOpcode.GetChatDetailedInfo, tuple);
        }

        //获取聊天玩家详细信息返回
        private getChatPlayerDetailedInfoReply(tuple: GetChatPlayerDetailedInfoReply): void {
            if (!tuple[GetChatPlayerDetailedInfoReplyFields.result]) {
                ChatModel.instance.initOtherPlayerInfo(tuple[GetChatPlayerDetailedInfoReplyFields.info]);
            } else {
                ChatModel.instance.initOtherPlayerInfo(null);
            }
        }

        //发送聊天
        public sendChatMessage(content: ChatContent): void {
            let mineId: number = PlayerModel.instance.actorId;
            Channel.instance.publish(UserChatOpcode.Chat, [mineId, content]);
            let channel: number = content[ChatContentFields.channel];
            let type: number = content[ChatContentFields.contentType];
            CommonUtil.runActorOper(ActorOperType.chat, [channel, type]);
        }

        //发送聊天返回
        private chatReply(tuple: ChatReply): void {
            let code: number = tuple[ChatReplyFields.result];
            if (!code) {
                SystemNoticeManager.instance.addNotice("发送成功");
                GlobalData.dispatcher.event(CommonEventType.SEND_RESULT, 1);
            } else {
                CommonUtil.noticeError(code);
                GlobalData.dispatcher.event(CommonEventType.SEND_RESULT, 0);
            }
        }

        /**获取高级表情的次数*/
        public getCharInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetChatInfo, null);
        }

        private getChatInfoReply(tuple: GetChatInfoReply): void {
            ChatModel.instance.sendVipFaceTime = tuple[GetChatInfoReplyFields.adExpreCount];
        }

        private updateChatInfo(tuple: UpdateChatInfo): void {
            ChatModel.instance.sendVipFaceTime = tuple[UpdateChatInfoFields.adExpreCount];
        }

        //获取聊天记录
        public getChatRecord(channel: ChatChannel): void {
            let playerId: number = PlayerModel.instance.actorId;
            if (DEBUG) {
                if (typeof channel != "number" || typeof playerId != "number") {
                    throw new Error(`getChatRecord(${playerId}, ${channel})`);
                }
            }
            Channel.instance.publish(UserChatOpcode.GetChatRecord, [playerId, channel]);
        }

        //黑名单操作
        public blackListOpt(tuple: BlackListOpt): void {
            Channel.instance.publish(UserFeatureOpcode.BlackListOpt, tuple);
        }

        //黑名单操作回复
        public blackListOptReply(tuple: BlackListOptReply): void {
            let code: number = tuple[BlackListOptReplyFields.result];
            if (!code) {
                if (ChatModel.instance.blackListOpt == 1) {
                    SystemNoticeManager.instance.addNotice("加入黑名单成功");
                }
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //获取黑名单
        public getBlackList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetBlackList, null);
        }

        //黑名单返回
        public getBlackListReply(tuple: UpdateBlackList): void {
            ChatModel.instance.updateBlackList(tuple);
            this.getChatRecord(ChatChannel.cross);
            this.getChatRecord(ChatChannel.local);
            this.getChatRecord(ChatChannel.system);
            this.getFactionChat();
            this.getMarryChat();
        }

        public getFactionChat(): void {
            if (FactionModel.instance.factionId === undefined) {
                Laya.timer.once(500, this, this.getFactionChat);
            } else if (FactionModel.instance.factionId) {
                this.getChatRecord(ChatChannel.faction);
            }
        }

        public getMarryChat(): void {
            if (!MarryModel.instance.isHave) {
                Laya.timer.once(500, this, this.getMarryChat);
            } else if (MarryModel.instance.isHave) {
                this.getChatRecord(ChatChannel.marry);
            }
        }

        //更新黑名单
        public updateBlackList(tuple: UpdateBlackList): void {
            ChatModel.instance.updateBlackList(tuple);
        }

        // GM命令回调
        private gmCommandReply(tuple: GMCommandReply): void {
            let code: number = tuple[GMCommandReplyFields.result];
            if (code === 0) {
                SystemNoticeManager.instance.addNotice("GM命令执行成功");
            } else {
                CommonUtil.noticeError(code);
            }
        }
    }
}