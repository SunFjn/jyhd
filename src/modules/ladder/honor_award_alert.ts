///<reference path="../config/tianti_cfg.ts"/>


/** 每日荣誉奖励弹框*/



namespace modules.ladder {
    import HonorAwardAlertUI = ui.HonorAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import tianti = Configuration.tianti;
    import TiantiCfg = modules.config.TiantiCfg;
    import tiantiFields = Configuration.tiantiFields;
    import TiantiScoreFields = Protocols.TiantiScoreFields;

    export class HonorAwardAlert extends HonorAwardAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this.addChild(this._list);
            this._list.itemRender = HonorAwardItem;
            this._list.pos(41, 162, true);
            this._list.size(578, 570);
            let arr: Array<tianti> = TiantiCfg.instance.cfgs;
            this._list.datas = arr;
        }

        public onOpened(): void {
            super.onOpened();
            let arr: Array<tianti> = TiantiCfg.instance.cfgs;
            let index: int = 0;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (arr[i][tiantiFields.id] === LadderModel.instance.tiantiScore[TiantiScoreFields.seg]) {
                    index = i;
                    break;
                }
            }
            this._list.scrollTo(73 * index);
        }
    }
}