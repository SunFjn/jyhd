///<reference path="../magic_position/magic_position_model.ts"/>


namespace modules.chat {
    import ChatModel = modules.chat.ChatModel;
    import FactionModel = modules.faction.FactionModel;
    import MarryModel = modules.marry.MarryModel;
    import ChatViewUI = ui.ChatViewUI;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomList = modules.common.CustomList;
    import ChatPackage = Protocols.ChatPackage;
    import ChatContent = Protocols.ChatContent;
    import Button = Laya.Button;
    import Event = Laya.Event;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatPlayerInfoFields = Protocols.ChatPlayerInfoFields;
    import GuideModel = modules.guide.GuideModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ChatPlayerInfo = Protocols.ChatPlayerInfo;
    import VipModel = modules.vip.VipModel;
    import MagicPositionModel = modules.magicPosition.MagicPositionModel;
    import ExerciseModel = modules.exercise.ExerciseModel;
    import VipNewModel = modules.vip_new.VipNewModel;
    import guide = Configuration.guide;


    export class ChatJiuzhouPanel extends ChatViewUI {

        protected _list: CustomList;
        protected _type: ChatChannel;
        protected _selectBtn: Button;
        protected _selectBtnHandler: any;
        private _maxInputChar: number;
        protected _messageType: CommonEventType;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.bottom = 113;
            this.scaleX = this.scaleY = 0.88;

            this._list = new CustomList();
            this._list.width = 614;
            this._list.x = 140;
            this._list.hCount = 1;
            this._list.spaceY = 5;
            this._list.y = 30;
            this._list.height = 547;
            this._list.itemRender = ChatMessageItem;
            this.addChild(this._list);

            this.banBox.visible = this.blackListBox.visible = false;
            this._maxInputChar = 38;
            this.inputTxt.maxChars = this._maxInputChar;
            this.inputBox.visible = true;

            this._type = ChatChannel.cross;

            this._selectBtn = this.jiuzhouBtn;
            this._selectBtnHandler = this.jiuzhouBtnHandler;

            this._messageType = CommonEventType.JIUZHOU_MESSAGE_UPDATE;

            this.regGuideSpr(GuideSpriteId.CHAT_BACK_BTN, this.backBtn);
            this.regGuideSpr(GuideSpriteId.CHAT_SEND_BTN, this.sendBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.inputTxt, Event.ENTER, this, this.inputEnterHandler);
            this.addAutoListener(this.inputTxt, Event.INPUT, this, this.charNumCheck);
            this.addAutoListener(this.faceBtn, Event.CLICK, this, this.faceBtnHandler);
            this.addAutoListener(this.jiuzhouBtn, Event.CLICK, this, this.jiuzhouBtnHandler);
            this.addAutoListener(this.benfuBtn, Event.CLICK, this, this.benfuBtnHandler);
            this.addAutoListener(this.xianmengBtn, Event.CLICK, this, this.xianmengBtnHandler);
            this.addAutoListener(this.xianyuanBtn, Event.CLICK, this, this.marryBtnHandler);
            this.addAutoListener(this.xitongBtn, Event.CLICK, this, this.xitongBtnHandler);
            this.addAutoListener(this.blackListBtn, Event.CLICK, this, this.blackListBtnHandler);
            this.addAutoListener(this.sendBtn, Event.CLICK, this, this.sendBtnHandler);
            this.addAutoListener(this.inputTxt, Event.MOUSE_DOWN, this, this.inputDownHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_LEVEL, this, this.setInputPrompt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_LEVEL, this, this.judgeCanInput);
            this.addAutoListener(GlobalData.dispatcher, this._messageType, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CHECKED_FACE, this, this.inputHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEND_RESULT, this, this.chatSendResult);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GUIDE_CUR_UPDATE, this, this.guideCurHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_MESSAGE_UPDATE, this, this.factionMessageHint);

            this._selectBtn.off(Event.CLICK, this, this._selectBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.maskImg.off(Event.CLICK, this, this.unlockHintWord);
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.cross;
            this._selectBtn.skin = `chat/btn_lt_bqbtn_1.png`;
            this.initListPos();
            this.judgeCanInput();

            this.guideCurHandler();

            this.factionMessageHint();
        }

        private guideCurHandler(): void {
            if (!GuideModel.instance.curGuide) return;
            if (guide.GuideModel.instance.curGuide[Configuration.guideFields.id] == 3902) {
                let strs: Array<string> = config.BlendCfg.instance.chatMarkedWords;
                this.inputTxt.text = ArrayUtils.random(strs);
            }
        }

        private judgeCanInput(): void {
            let lv: number = PlayerModel.instance.level;
            let textUnlockLv: number = ChatModel.instance.getUnlockLv(0);  //文本开启
            this.inputTxt.editable = lv >= textUnlockLv;
            if (lv < textUnlockLv) {
                this.maskImg.on(Event.CLICK, this, this.unlockHintWord);
            } else {
                this.maskImg.off(Event.CLICK, this, this.unlockHintWord);
                this.maskImg.removeSelf();
            }
        }

        public close(): void {
            super.close();
            WindowManager.instance.close(WindowEnum.CHAT_FACE_PANEL);
            this._selectBtn.skin = `chat/btn_lt_bqbtn_0.png`;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        protected getListDatas(): ChatPackage[] {
            let listInfos: ChatPackage[] = ChatModel.instance.jiuzhouChatRecord;
            return listInfos;
        }

        protected updateView(): void {

            let listInfos: ChatPackage[] = this.getListDatas();

            if (!listInfos || !listInfos.length) {
                this._list.datas = []
                return;
            }
     

            if (!listInfos[listInfos.length - 1][ChatPackageFields.senderInfo]) {
                this.listMoveUp(listInfos);
                return;
            }
            let playerId: number = listInfos[listInfos.length - 1][ChatPackageFields.senderInfo][ChatPlayerInfoFields.agentId];
            if (playerId == PlayerModel.instance.actorId) {
                this.initListPos();
            } else {
                this.listMoveUp(listInfos);
            }
        }

        private initListPos(): void {
            this.setInputPrompt();
            let listInfos: ChatPackage[] = this.getListDatas();
            this._list.datas = listInfos;
            if (!listInfos || !listInfos.length) return;
            if (this._list.conHeight >= this._list.height) {  //聊天框上移
                this._list.scrollPos = this._list.conHeight - this._list.height;
            }
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
        }

        private listMoveUp(listInfos: ChatPackage[]): void {
            this._list.datas = listInfos;
            if (listInfos.length >= ChatModel.instance.maxCacheMessageNum[ChatModel.instance.currChatChannel]) {
                this._list.scrollPos = this._list.scrollPos;
            } else {
                this._list.scrollPos += this._list.items[listInfos.length - 1].height;
            }
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
        }

        private unlockHintWord(): void {
            let lv: number = PlayerModel.instance.level;
            let markedWordsUnlockLv: number = ChatModel.instance.getUnlockLv(1);  //快捷语句开启
            let textUnlockLv: number = ChatModel.instance.getUnlockLv(0);  //文本开启

            //快捷语句没开
            if (lv < markedWordsUnlockLv) {
                SystemNoticeManager.instance.addNotice(`人物达到${markedWordsUnlockLv}级开启快捷语句功能`, true);
            } else if (lv < textUnlockLv) {  //文本内容没开 但是快捷语句开了
                WindowManager.instance.open(WindowEnum.CHAT_MARKED_WORDS_PANEL);
            }
        }

        private inputHandler(): void {
            let content: string = this.inputTxt.text;
            let faceStr: string = ChatModel.instance.checkedFace[ChatModel.instance.checkedFace.length - 1];
            if (content.length + faceStr.length > this._maxInputChar) {
                SystemNoticeManager.instance.addNotice(`最大输入字数${this._maxInputChar}个`, true);
                return;
            }
            this.inputTxt.text = content + faceStr;
            this.inputTxt.focus = true;
        }

        private charNumCheck(): void {
            let content: string = this.inputTxt.text;
            if (content.length > this._maxInputChar) {
                SystemNoticeManager.instance.addNotice(`最大输入字数${this._maxInputChar}个`, true);
            }
        }

        /**  发送消息 -----------  */
        private inputEnterHandler(): void {

            let lv: number = PlayerModel.instance.level;
            let textUnlockLv: number = ChatModel.instance.getUnlockLv(0);  //文本开启
            if (lv < textUnlockLv) {
                SystemNoticeManager.instance.addNotice(`主角${textUnlockLv}级开启`, true);
                return;
            }

            let content: string = this.inputTxt.text;
            if (!content) {
                SystemNoticeManager.instance.addNotice(`发送内容不能为空`, true);
                return;
            } else if (!ChatModel.instance.isValidContent(content)) {
                SystemNoticeManager.instance.addNotice(`包含非法字符`, true);
                return;
            }
            // 判断是不是新手引导的发送，新手引导的发送按一定概率发给服务器
            let flag: boolean = false;
            let curGuide: guide = guide.GuideModel.instance.curGuide;
            if (curGuide && curGuide[Configuration.guideFields.id] === 3902) {
                flag = Math.random() < BlendCfg.instance.getCfgById(26010)[blendFields.intParam][0];
            }
            //发送协议
            let chatInfo: ChatContent = [ChatModel.instance.currChatChannel, 0, 0, content, ChatModel.instance.virtualItem, [], [], []];
            // flag = true;
            if (!flag) {
                ChatCtrl.instance.sendChatMessage(chatInfo);
            } else {
                // let senderInfo: ChatPlayerInfo = [PlayerModel.instance.actorId, "", PlayerModel.instance.roleName, PlayerModel.instance.occ, PlayerModel.instance.level, VipModel.instance.vipLevel,
                // MagicPositionModel.Instance.position, ExerciseModel.instance.currLev, PlayerModel.instance.fight, PlayerModel.instance.serverPgId, VipNewModel.instance.getVipLevelTrue()];
                // ChatModel.instance.updateChat([[senderInfo, chatInfo]]);
                ChatCtrl.instance.sendChatMessage(chatInfo);
            }
            ChatModel.instance.sendChatInfo = content;
            //新增 清空输入框，关闭表情面板
            this.inputTxt.text = "";
            WindowManager.instance.close(WindowEnum.CHAT_FACE_PANEL);
        }

        //0 失败 1成功
        private chatSendResult(result: number): void {
            if (result) {
                ChatModel.instance.checkedFace.length = 0;
                this.inputTxt.text = ``;
            }
        }

        private inputDownHandler(e: Event): void {
            e.stopPropagation();
        }

        protected setInputPrompt(): void {
            let lv: number = PlayerModel.instance.level;
            let textUnlockLv: number = ChatModel.instance.getUnlockLv(0);  //文本开启
            let wordUnlockLv: number = ChatModel.instance.getUnlockLv(1);  //文本开启
            if (lv < wordUnlockLv) {
                if (!this.inputTxt.focus) {
                    this.inputTxt.prompt = `${wordUnlockLv}级可发送快捷语句`;
                }
            } else if (lv < textUnlockLv) {
                if (!this.inputTxt.focus) {
                    this.inputTxt.prompt = `点击选择快捷语句（${textUnlockLv}级可自由聊天）`;
                }
            } else {
                if (!this.inputTxt.focus) {
                    this.inputTxt.prompt = `点击输入聊天内容`;
                }
            }
        }

        private factionMessageHint(): void {
            this.factionRP.visible = ChatModel.instance.noSeeMessage;
        }

        private faceBtnHandler(): void {
            let unlockLv: number = ChatModel.instance.getUnlockLv(2);
            let playerLv: number = PlayerModel.instance.level;
            if (playerLv < unlockLv) {
                SystemNoticeManager.instance.addNotice(`等级达到${unlockLv}解锁`, true);
                return;
            }
            if (WindowManager.instance.isOpened(WindowEnum.CHAT_FACE_PANEL)) {
                WindowManager.instance.close(WindowEnum.CHAT_FACE_PANEL);
            } else {
                WindowManager.instance.open(WindowEnum.CHAT_FACE_PANEL);
            }
        }

        protected benfuBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CHAT_BENFU_PANEL);
        }

        protected xianmengBtnHandler(): void {
            if (!FactionModel.instance.factionId) {
                SystemNoticeManager.instance.addNotice(`请先加入公会`, true);
                return;
            }
            WindowManager.instance.open(WindowEnum.CHAT_FACTION_PANEL);
        }
        protected marryBtnHandler(): void {
            if (!MarryModel.instance.isHave) {
                SystemNoticeManager.instance.addNotice(`请先结缘`, true);
                return;
            }
            WindowManager.instance.open(WindowEnum.CHAT_MARRY_PANEL);
        }


        protected xitongBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CHAT_SYSTEM_PANEL);
        }

        protected blackListBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CHAT_BLACK_LIST_PANEL);
        }

        protected jiuzhouBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CHAT_JIUZHOU_PANEL);
        }

        private sendBtnHandler(): void {
            this.inputEnterHandler();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this.maskImg) {
                this.maskImg.destroy(true);
                this.maskImg = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}