namespace modules.explicit {
    import BaseCtrl = modules.core.BaseCtrl;
    import AutoSC_ShowSuitInfo = Protocols.AutoSC_ShowSuitInfo;
    import AutoSC_ShowSuitUpLevel = Protocols.AutoSC_ShowSuitUpLevel;
    import AutoSC_ShowSuitUpPosHallucination = Protocols.AutoSC_ShowSuitUpPosHallucination;
    import AutoSC_ShowSuitInfoFields = Protocols.AutoSC_ShowSuitInfoFields;
    import AutoSC_ShowSuitLevel = Protocols.AutoSC_ShowSuitLevel;
    import AutoSC_ShowSuitLevelFields = Protocols.AutoSC_ShowSuitLevelFields;
    export class ExplicitSuitCtrl extends BaseCtrl {
        private static _instance: ExplicitSuitCtrl;
        public static get instance(): ExplicitSuitCtrl {
            return this._instance = this._instance || new ExplicitSuitCtrl();
        }

        constructor() {
            super();
        }

        setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_ShowSuitInfo, this, this.getSuitInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_ShowSuitUpLevel , this, this.upLevelSuitReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_ShowSuitUpPosHallucination, this, this.upPosHallucinationReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.EXPLICIT_SUIT_UPDATE, this, this.checkRP);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getSuitInfo();
        }

        // 请求获取外显信息
        public getSuitInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUF_ShowSuitInfo, null);
        }

        // 获取外显信息返回
        private getSuitInfoReply(value: AutoSC_ShowSuitInfo): void {
            ExplicitSuitModel.instance.suitInfo = value;
            GlobalData.dispatcher.event(CommonEventType.EXPLICIT_SUIT_UPDATE);
        }

        //外显套装升级
        public upLevelSuit(id:number): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUF_ShowSuitUpLevel , [id]);
        }

        //外显套装升级返回
        private upLevelSuitReply(value: AutoSC_ShowSuitUpLevel): void {
            if (!value[0]) {
                let showSuitLevel:AutoSC_ShowSuitLevel = value[1];
                for (let index = 0,len = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.level].length; index < len; index++) {
                    let cur = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.level][index];
                    if (showSuitLevel[AutoSC_ShowSuitLevelFields.id] == cur[AutoSC_ShowSuitLevelFields.id]) {
                         ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.level][index] = showSuitLevel;
                         break;
                    }
                }
                GlobalData.dispatcher.event(CommonEventType.EXPLICIT_SUIT_UPDATE);
            } else {
                CommonUtil.noticeError(value[0]);
            }
        }

        //外显套装幻化
        public hallAucinationSuit(id:number): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUF_ShowSuitHallucination, [id]);
        }

        // 外显套装幻化返回
        private upPosHallucinationReply(value: AutoSC_ShowSuitUpPosHallucination): void {
            ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posHallucinationID] = value[0];
            GlobalData.dispatcher.event(CommonEventType.EXPLICIT_SUIT_UPDATE);
        }

        //激活外显套装
        public activationSuit(id:number,type:number): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUF_ShowSuitActivation, [id,type]);
        }
        //更新红点
        private checkRP(): void {
            ExplicitSuitModel.instance.checkAllRedPoint();
        }
    }
}