namespace modules.rune {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetRuneInfoReply = Protocols.GetRuneInfoReply;
    import InlayRune = Protocols.InlayRune;
    import RuneRefine = Protocols.RuneRefine;
    import ResolveRune = Protocols.ResolveRune;
    import SetResolveRuneFlag = Protocols.SetResolveRuneFlag;
    import InlayRuneReply = Protocols.InlayRuneReply;
    import RuneRefineReply = Protocols.RuneRefineReply;
    import ResolveRuneReply = Protocols.ResolveRuneReply;
    import UpdateRuneInfo = Protocols.UpdateRuneInfo;
    import GetRuneInfoReplyFields = Protocols.GetRuneInfoReplyFields;
    import InlayRuneReplyFields = Protocols.InlayRuneReplyFields;
    import SystemNoticeManager = notice.SystemNoticeManager;
    import RuneRefineReplyFields = Protocols.RuneRefineReplyFields;
    import SetResolveRuneFlagFields = Protocols.SetResolveRuneFlagFields;
    import ComposeRunePreview = Protocols.ComposeRunePreview;
    import ComposeRunePreviewReply = Protocols.ComposeRunePreviewReply;
    import ComposeRunePreviewReplyFields = Protocols.ComposeRunePreviewReplyFields;
    import ComposeRuneReply = Protocols.ComposeRuneReply;
    import ComposeRuneReplyFields = Protocols.ComposeRuneReplyFields;
    import UnsnatchRunePlaceReply = Protocols.UnsnatchRunePlaceReply;
    import UnsnatchRunePlaceReplyFields = Protocols.UnsnatchRunePlaceReplyFields;
    import ComposeRune = Protocols.ComposeRune;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import blendFields = Configuration.blendFields;
    import BlendCfg = modules.config.BlendCfg;
    import ItemFields = Protocols.ItemFields;
    import ResolveRuneReplyFields = Protocols.ResolveRuneReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import RuneCollectDismantleReply = Protocols.RuneCollectDismantleReply;
    import RuneCollectDismantleReplyFields = Protocols.RuneCollectDismantleReplyFields;
    import RuneCollectSingleInfoReply = Protocols.RuneCollectSingleInfoReply;
    import RuneCollectUpLevelReply = Protocols.RuneCollectUpLevelReply;
    import RuneCollectUpLevel = Protocols.RuneCollectUpLevel;
    import RuneCollectDismantle = Protocols.RuneCollectDismantle;
    import RuneCollectInfoReply = Protocols.RuneCollectInfoReply;
    import RuneCollectSPLevel = Protocols.RuneCollectSPLevel;
    import RuneCollectUpJieReply = Protocols.RuneCollectUpJieReply;
    import RuneCollectUpJieReplyFields = Protocols.RuneCollectUpJieReplyFields;

    export class RuneCtrl extends BaseCtrl {
        private static _instance: RuneCtrl;
        public static get instance(): RuneCtrl {
            return this._instance = this._instance || new RuneCtrl();
        }

        private _isRegisterAutoResolve: Table<boolean>;
        private _maxCount: number;

        constructor() {
            super();
            this._isRegisterAutoResolve = {};
            this._maxCount = BlendCfg.instance.getCfgById(10008)[blendFields.intParam][0];
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetRuneInfoReply, this, this.getRuneInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRuneInfo, this, this.updateRuneInfo);
            Channel.instance.subscribe(SystemClientOpcode.InlayRuneReply, this, this.inlayRuneReply);
            Channel.instance.subscribe(SystemClientOpcode.ResolveRuneReply, this, this.resolveRuneReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneRefineReply, this, this.runeRefineReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneComposePreviewReply, this, this.runeComposePreviewReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneComposeReply, this, this.runeComposeReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneCollectDismantleReply, this, this.runeCollectDismantleReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneCollectUpLevelReply, this, this.runeCollectUpLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneCollectSingleInfoReply, this, this.runeCollectSingleInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneCollectInfoReply, this, this.runeCollectInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.RuneCollectUpJieReply, this, this.runeCollectUpJieReply);
            Channel.instance.subscribe(SystemClientOpcode.UnsnatchRunePlaceReply, this, this.unsnatchRunePlaceReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.autoResolveRune);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetRuneInfo, null);
            // 获取玉荣收集箱数据
            this.getRuneCollectInfoReq();
        }

        //获取玉荣信息返回
        public getRuneInfoReply(tuple: GetRuneInfoReply): void {
            RuneModel.instance.exp = tuple[GetRuneInfoReplyFields.exp];
            RuneModel.instance.saveData(tuple[GetRuneInfoReplyFields.slots]);
            RuneModel.instance.rflags = tuple[GetRuneInfoReplyFields.rflags];
            this._isRegisterAutoResolve = {};
            for (let i: int = 0, len: int = tuple[GetRuneInfoReplyFields.rflags].length; i < len; i++) {
                this._isRegisterAutoResolve[tuple[GetRuneInfoReplyFields.rflags][i]] = true;
            }
            RuneModel.instance.checkRP();
        }

        //玉荣合成预览返回
        public runeComposePreviewReply(tuple: ComposeRunePreviewReply): void {
            GlobalData.dispatcher.event(CommonEventType.UPDATE_COMPSOE_FINAL_LEVEL, tuple[ComposeRunePreviewReplyFields.level]);
        }

        //玉荣收集箱拆解返回
        public runeCollectDismantleReply(tuple: RuneCollectDismantleReply): void {
            if (!tuple[RuneCollectDismantleReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("拆解成功");
                GlobalData.dispatcher.event(CommonEventType.RUNE_DISMANTLE_FINISH_UPDATE);
            } else {
                CommonUtil.noticeError(tuple[RuneCollectDismantleReplyFields.result]);
            }
        }

        //玉荣收集箱升级返回
        public runeCollectUpLevelReply(tuple: RuneCollectUpLevelReply): void {
            if (!tuple[InlayRuneReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("升级成功");
            } else {
                CommonUtil.noticeError(tuple[InlayRuneReplyFields.result]);
            }
        }

        //玉荣收集箱收集专家升阶返回
        public runeCollectUpJieReply(tuple: RuneCollectUpJieReply): void {
            if (!tuple[RuneCollectUpJieReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("升阶成功");
            } else {
                CommonUtil.noticeError(tuple[RuneCollectUpJieReplyFields.result]);
            }
        }

        //玉荣收集箱信息获取返回
        public runeCollectInfoReply(tuple: RuneCollectInfoReply): void {
            RuneModel.instance.runeCollectData = tuple;
        }

        //玉荣收集箱单个信息返回
        public runeCollectSingleInfoReply(tuple: RuneCollectSingleInfoReply): void {
            // console.log("tuple:", tuple);
            RuneModel.instance.updateCollectData = tuple;
        }

        //获取玉荣收集箱信息
        public getRuneCollectInfoReq(): void {
            Channel.instance.publish(UserFeatureOpcode.RuneCollectInfo, null);
        }

        //获取收集箱收集专家升阶
        public runeCollectSPLevelReq(): void {
            Channel.instance.publish(UserFeatureOpcode.RuneCollectSPLevel, null);
        }

        //升级搜集箱中玉荣
        public runeCollectUpLevelReq(tuple: RuneCollectUpLevel): void {
            Channel.instance.publish(UserFeatureOpcode.RuneCollectUpLevel, tuple);
        }

        //拆解搜集箱中玉荣
        public runeCollectDismantleReq(tuple: RuneCollectDismantle): void {
            Channel.instance.publish(UserFeatureOpcode.RuneCollectDismantle, tuple);
        }

        //玉荣合成返回
        public runeComposeReply(tuple: ComposeRuneReply): void {
            if (!tuple[ComposeRuneReplyFields.result]) {
                GlobalData.dispatcher.event(CommonEventType.RUNE_COMPOSE_FINISH_UPDATE, tuple[ComposeRuneReplyFields.id]);
                // GlobalData.dispatcher.event(CommonEventType.RUNE_COMPOSE_FINISH_UPDATE, 72550001);
            } else {
                CommonUtil.noticeError(tuple[RuneRefineReplyFields.result]);
            }
        }

        //更新玉荣信息返回
        public updateRuneInfo(tuple: UpdateRuneInfo): void {
            RuneModel.instance.exp = tuple[GetRuneInfoReplyFields.exp];
            RuneModel.instance.saveData(tuple[GetRuneInfoReplyFields.slots]);
            RuneModel.instance.checkRP();
        }

        //镶嵌玉荣
        public inlayRune(tuple: InlayRune): void {
            Channel.instance.publish(UserFeatureOpcode.InlayRune, tuple);
        }

        //合成玉荣预览
        public runeComposePreview(tuple: ComposeRunePreview): void {
            Channel.instance.publish(UserFeatureOpcode.RuneComposePreview, tuple);
        }

        //合成玉荣
        public runeCompose(tuple: ComposeRune): void {
            Channel.instance.publish(UserFeatureOpcode.RuneCompose, tuple);
        }

        //镶嵌玉荣返回
        public inlayRuneReply(tuple: InlayRuneReply): void {
            if (!tuple[InlayRuneReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("镶嵌成功");
                GlobalData.dispatcher.event(CommonEventType.RUNE_INALY_SUCCEED, RuneModel.instance.currClickPit);
            } else {
                CommonUtil.noticeError(tuple[InlayRuneReplyFields.result]);
            }
        }

        //卸下插槽的玉荣
        public unsnatchRunePlaceReply(tuple: UnsnatchRunePlaceReply): void {
            RuneModel.instance.unInstallSlots(tuple[UnsnatchRunePlaceReplyFields.list]);
        }

        //玉荣升级
        public runeRefine(tuple: RuneRefine): void {
            Channel.instance.publish(UserFeatureOpcode.RuneRefine, tuple);
        }

        //玉荣升级返回
        public runeRefineReply(tuple: RuneRefineReply): void {
            if (!tuple[RuneRefineReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("升级成功");
            } else {
                CommonUtil.noticeError(tuple[RuneRefineReplyFields.result]);
            }
        }

        //分解玉荣
        public resolveRune(pairs: Protocols.Pair[]): void {
            Channel.instance.publish(UserFeatureOpcode.ResolveRune, [pairs]);
        }

        //分解玉荣返回
        public resolveRuneReply(tuple: ResolveRuneReply): void {
            if (!tuple[ResolveRuneReplyFields.result]) {
                RuneModel.instance.resolveList = {};
                GlobalData.dispatcher.event(CommonEventType.RUNE_RESOLVE_SUCCEED);
            } else {
                CommonUtil.noticeError(tuple[ResolveRuneReplyFields.result]);
            }
        }

        //分解标记勾选
        public setResolveRuneFlag(tuple: SetResolveRuneFlag): void {
            Channel.instance.publish(UserFeatureOpcode.SetResolveRuneFlag, tuple);
            this._isRegisterAutoResolve = {};
            for (let i: int = 0, len: int = tuple[SetResolveRuneFlagFields.flags].length; i < len; i++) {
                this._isRegisterAutoResolve[tuple[SetResolveRuneFlagFields.flags][i]] = true;
            }
        }

        //自动分解玉荣
        public autoResolveRune(): void {
            RuneModel.instance.checkRP();
            if (!this._isRegisterAutoResolve[0]) return;
            let pairs: Protocols.Pair[] = [];
            let runeItems: Array<Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            if (runeItems.length >= this._maxCount) { //进行一键分解
                for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                    let quality: number = CommonUtil.getItemQualityById(runeItems[i][ItemFields.ItemId]);
                    let type: number = CommonUtil.getStoneTypeById(runeItems[i][ItemFields.ItemId]);
                    if (this._isRegisterAutoResolve[quality - 1] || type == config.ItemRuneCfg.instance.resolveRuneSubTypeId) { //注册了 加入Uid
                        let uId: Uid = runeItems[i][ItemFields.uid];
                        let count: number = runeItems[i][ItemFields.count];
                        pairs.push([uId, count]);
                    }
                }
                this.resolveRune(pairs);
            }
        }
    }
}