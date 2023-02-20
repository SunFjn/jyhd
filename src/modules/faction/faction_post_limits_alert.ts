/////<reference path="../$.ts"/>
/** 职位权限弹框 */
namespace modules.faction {
    import BlendCfg = modules.config.BlendCfg;
    import CustomList = modules.common.CustomList;
    import FactionPostLimitsAlertUI = ui.FactionPostLimitsAlertUI;
    import blendFields = Configuration.blendFields;

    export class FactionPostLimitsAlert extends FactionPostLimitsAlertUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 46;
            this._list.y = 170;
            this._list.width = 570;
            this._list.height = 500;
            this._list.hCount = 1;
            this._list.itemRender = FactionPostLimitsItem;
            this._list.spaceY = 5;
            this.addChild(this._list);

            this.initLimitList();
        }

        private initLimitList(): void {
            let value: number[] = BlendCfg.instance.getCfgById(36003)[blendFields.intParam];
            let datas: boolean[][] = [];
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                for (let j: int = 0; j < FactionUtil.limitShowList.length; j++) {
                    let flag: boolean = !!((value[i] >> FactionUtil.limitShowList[j]) & 1);
                    if (!datas[j]) {
                        datas[j] = [];
                    }
                    datas[j][i] = flag;
                }
            }
            this._list.datas = datas;
        }

        public destroy(): void {
            if (this._list) {
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
    }
}
