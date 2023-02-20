/**
 * 钓鱼 数据
*/
///<reference path="../limit/limit_reap_model.ts"/>
namespace modules.fish {

    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import GetLimitXunbaoInfoReply = Protocols.GetLimitXunbaoInfoReply;
    import RunLimitXunbaoReplyFields = Protocols.RunLimitXunbaoReplyFields;
    import GetLimitXunbaoInfoReplyFields = Protocols.GetLimitXunbaoInfoReplyFields;
    import LimitXunbaoNote = Protocols.LimitXunbaoNote;

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RedPointCtrl = redPoint.RedPointCtrl;
    import LimitReapModel = modules.limit.LimitReapModel;
    import BlendCfg = modules.config.BlendCfg;
    import BagModel = modules.bag.BagModel;

    export class FishModel {
        private _awardArr: Array<GetLimitXunbaoInfoReply>;
        readonly FISHING_TYPE: Array<number>
        private static _instance: FishModel;
        public static get instance(): FishModel {
            return this._instance = this._instance || new FishModel();
        }

        // 结束时间戳
        public endTime: number;
        public type_tit: Array<string>;
        // 当前垂钓值，排行榜用，后端不好做，写在了钓鱼里
        public _myScore: number[];
        private _selectedIndex: number;
        // 奖励档次
        private _on_grade: number[];
        // private _coupon: number[];
        private _self_log: LimitXunbaoNote[][];

        private constructor() {
            this._awardArr = [];
            this.blessing = new Array();
            this.type_tit = ["黄金", "铂金", "钻石"];
            this._selectedIndex = 2;
            this.FISHING_TYPE = [LimitWeightType.fh, LimitWeightType.fb, LimitWeightType.fz];
            this._on_grade = new Array();
            this._on_grade[LimitWeightType.year] = 1;
            // this._coupon = new Array();
            // this._coupon[LimitWeightType.year] = 15650003;
            this._myScore = new Array();
            this._self_log = new Array();

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.rp);
        }

        private rp(bagId: BagId) {
            if (bagId == BagId.itemType) {
                RedPointCtrl.instance.setRPProperty("fishItemSate0", BagModel.instance.getItemCountById(BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishMaterial, 0)) > 0);
                RedPointCtrl.instance.setRPProperty("fishItemSate1", BagModel.instance.getItemCountById(BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishMaterial, 1)) > 0);
                RedPointCtrl.instance.setRPProperty("fishItemSate2", BagModel.instance.getItemCountById(BlendCfg.instance.getCftBuIdParamAttr(BlenId.fishMaterial, 2)) > 0);
            }
        }

        private _state: number;     //活动状态
        public get state(): number {
            return this._state;
        }

        public set selectedIndex(i: number) {
            this._selectedIndex = i;
        }

        public get selectedIndex() {
            return this._selectedIndex;
        }

        public get typeId() {
            return this.FISHING_TYPE[this.selectedIndex];
        }

        // 祝福值
        public blessing: Array<number>;

        public updateInfo(tuple: GetLimitXunbaoInfoReply) {
            this._awardArr[tuple[GetLimitXunbaoInfoReplyFields.type]] = tuple;

            this._self_log[tuple[GetLimitXunbaoInfoReplyFields.type]] = tuple[GetLimitXunbaoInfoReplyFields.selfBroadcastList]

            this.endTime = tuple[GetLimitXunbaoInfoReplyFields.endTime];
            this._myScore[tuple[GetLimitXunbaoInfoReplyFields.type] < 3 ? 3 : tuple[GetLimitXunbaoInfoReplyFields.type]] = tuple[GetLimitXunbaoInfoReplyFields.score];
            // console.log('vtz:this._myScore',this._myScore);

            // this._coupon[tuple[GetLimitXunbaoInfoReplyFields.type]] = tuple[GetLimitXunbaoInfoReplyFields.coupon];

            this.blessing[tuple[GetLimitXunbaoInfoReplyFields.type]] = tuple[GetLimitXunbaoInfoReplyFields.blessing];
            // console.log('vtz:this.endTime', this.endTime);
            this._state = FuncOpenModel.instance.getFuncStateById(ActionOpenId.fish);
            GlobalData.dispatcher.event(CommonEventType.FISH_UPDATE);

            if (tuple[GetLimitXunbaoInfoReplyFields.type] == LimitWeightType.year)
                this.judgeCode(tuple[GetLimitXunbaoInfoReplyFields.type], LimitTaskSmallType.cjjf);
            this.rp(BagId.itemType)
        }

        /**
         * 奖品列表
         */
        public getPrizeList(): Array<Items> {
            return FishingCfg.instance.getItemShow(this.typeId)[Configuration.fishing_cfgFields.showItem];
        }

        public updateOneInfo(tuple: Protocols.RunLimitXunbaoReply) {
            this._awardArr[tuple[RunLimitXunbaoReplyFields.type]][GetLimitXunbaoInfoReplyFields.blessing] = tuple[RunLimitXunbaoReplyFields.blessing];
            this.blessing[tuple[RunLimitXunbaoReplyFields.type]] = tuple[RunLimitXunbaoReplyFields.blessing];
            // let tt = tuple[RunLimitXunbaoReplyFields.type]
            if (tuple[RunLimitXunbaoReplyFields.type] == LimitWeightType.year) {
                WindowManager.instance.open(WindowEnum.YEAR_GAIN_ALERT, tuple);
            } else {
                WindowManager.instance.open(WindowEnum.FISH_GAIN_ALERT, tuple);
            }
            this._myScore[tuple[RunLimitXunbaoReplyFields.type] < 3 ? 3 : tuple[RunLimitXunbaoReplyFields.type]] = tuple[RunLimitXunbaoReplyFields.score];

            let type = tuple[GetLimitXunbaoInfoReplyFields.type];
            let luckItems = FishingCfg.instance.getItemLuckItemId(type);
            let items = tuple[RunLimitXunbaoReplyFields.items];
            let allItemId = new Array<number>();//所有符合弹窗的奖励
            for (let i = 0; i < items.length; i++) {
                let itemId = items[i][ItemsFields.itemId];
                if (luckItems.indexOf(itemId) >= 0) {
                    allItemId.push(itemId);
                }
            }
            if (allItemId.length > 0) {
                WindowManager.instance.open(WindowEnum.BIG_PRIZE_ALERT, [1, allItemId]);
            }

            GlobalData.dispatcher.event(CommonEventType.FISH_UPDATE);
            if (tuple[GetLimitXunbaoInfoReplyFields.type] == LimitWeightType.year)
                this.judgeCode(tuple[GetLimitXunbaoInfoReplyFields.type], LimitTaskSmallType.cjjf);
        }

        public judgeCode(bigType: LimitWeightType, smallType: number) {
            // console.log('vtz:code', code);
            // console.log('vtz:LimitReapModel.instance.getLeastCode(bigType, smallType)', LimitReapModel.instance.getLeastCode(bigType, smallType));
            if (this.getScoreByType(bigType) >= LimitReapModel.instance.getLeastCode(bigType, smallType)) {
                // console.log('vtz:"YearCjTaskRP", true');
                if (bigType == LimitWeightType.year && smallType == LimitWeightType.year) {
                    RedPointCtrl.instance.setRPProperty("YearCjTaskRP", true)
                }
            } else {
                if (bigType == LimitWeightType.year && smallType == LimitWeightType.year) {
                    RedPointCtrl.instance.setRPProperty("YearCjTaskRP", false)
                }
            }

        }

        public getgRadeRP(): boolean {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.oneBuy)) {
            }
            return false;
        }

        public getGradeByType(type: LimitWeightType): number {
            return this._on_grade[type];
        }

        public getScoreByType(type: LimitWeightType): number {
            if (type < 3) {
                type = 3;
            }
            return typeof this._myScore[type] == "undefined" ? 0 : this._myScore[type];
        }

        public getSelfLog(type: LimitWeightType): LimitXunbaoNote[] {
            return this._self_log[type];
        }

        public get Endtime(): number {
            return this.endTime
        }
    }
}