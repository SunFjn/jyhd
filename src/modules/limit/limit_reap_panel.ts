///<reference path="../config/limit_reap_cfg.ts"/>
namespace modules.limit {

    import CustomList = modules.common.CustomList;
    import LimitReapCfg = modules.config.LimitReapCfg;
    import limit_xunbao_cumulative_task_cfg = Configuration.limit_xunbao_cumulative_task_cfg;
    import LimitXunBaoCumulativeTaskReward = Protocols.LimitXunBaoCumulativeTaskReward;
    import LimitXunBaoCumulativeTaskRewardFields = Protocols.LimitXunBaoCumulativeTaskRewardFields;
    import limit_xunbao_cumulative_task_cfgField = Configuration.limit_xunbao_cumulative_task_cfgField;

    import LayaEvent = modules.common.LayaEvent;

    export class LimitReapPanel extends ui.LimitReapViewUI {
        private _list: CustomList;
        public arr :limit_xunbao_cumulative_task_cfg[]
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = this.listItemClass;
            this._list.vCount = 6;
            this._list.hCount = 1;
            this._list.width = 670;
            this._list.height = 760;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;
            this.HeadLink.skin ="fish/TXT_xycd_cdfl.png"
            this.bannerLink.skin = "fish/banner3.png"
            this.arr = []


        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.null;
        }
        protected get listItemClass() {
            return LimitReapItem
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_REAP_UPDATE, this, this._updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this._updateView();

        }

        private _updateView(): void {
            this.setActivitiTime();
            //    this.HeadLink.skin = "cumulate/txt_xbjm_xfzl.png"
            this.priceText.text = String(LimitReapModel.instance.totalValue(this.bigtype,this.smallType));
            // let arr: limit_xunbao_cumulative_task_cfg[] = LimitReapCfg.instance.cfgs.concat();
            this.arr = LimitReapCfg.instance.getCfgsByType(this.bigtype,this.smallType).concat()
            this.TitleText.text = `累计${this.arr[0][limit_xunbao_cumulative_task_cfgField.name]}`
            LimitReapCfg.instance.getCfgsByType(this.bigtype,this.smallType)
            
            this.arr.sort(this.sortFunc.bind(this));
            
            this._list.datas = this.arr;
        }

        private setActivitiTime(): void {
            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitReapModel.instance.activityTime(this.bigtype,this.smallType))}`;
            this.activityText.color = "#50ff28";
            if (LimitReapModel.instance.activityTime(this.bigtype,this.smallType) < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private sortFunc(a: limit_xunbao_cumulative_task_cfg, b: limit_xunbao_cumulative_task_cfg): number {
            let table: Table<LimitXunBaoCumulativeTaskReward> = LimitReapModel.instance.rewarTable(this.bigtype,this.smallType);
            let aID: number = a[LimitXunBaoCumulativeTaskRewardFields.id];
            let bID: number = b[LimitXunBaoCumulativeTaskRewardFields.id];
            //1 可  0不可 2领完
            let aState: int = table[aID] ? table[aID][LimitXunBaoCumulativeTaskRewardFields.state] : 0;
            let bState: int = table[bID] ? table[bID][LimitXunBaoCumulativeTaskRewardFields.state] : 0;
            // 交换0跟1状态，方便排序（可领》不可领》已领）
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState - bState === 0) {      // 状态相同时按ID排
                return aID - bID;
            }
            return aState - bState;
        }

    }
}