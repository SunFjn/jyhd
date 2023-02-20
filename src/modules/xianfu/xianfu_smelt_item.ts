/////<reference path="../$.ts"/>
/** 仙府-家园炼丹炉的合成产品item */
namespace modules.xianfu {
    import BagItem = modules.bag.BagItem;
    import XianfuCfg = modules.config.XianfuCfg;
    import Item = Protocols.Item;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;

    export class XianfuSmeltItem extends BagItem {

        private _index: number;
        private _state: boolean;

        protected initialize(): void {
            super.initialize();

            this.lvImg.visible = this.needTip = false;
            this.addChild(this._numTxt);
        }

        public setData(value: any): void {
            value = value as [Item, number];
            let item: Item = value[0];
            let index: number = value[1];
            this._index = index;
            let buildType: number = XianfuModel.instance.buildType;
            //当前建筑等级
            let buildLv: number = XianfuModel.instance.getBuildInfo(buildType)[GetBuildingInfoReplyFields.level];
            let cfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(buildType, buildLv);
            let products: Array<Array<number>> = cfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let len: number = products.length;
            this._state = index < len;
            this._qualityBg.gray = this._icon.gray = this.lockImg.gray = this.lockImg.visible = !this._state;



            
            this.selectEnable = this._state;
            this.dataSource = item;
            this.isbtnClipIsPlayer = false;
        }

        protected clickHandler(): void {
            super.clickHandler();

            if (!this._state) {
                SystemNoticeManager.instance.addNotice(`丹炉达到${XianfuBuildCfg.instance.getOpenLvByTypeAndIndex(XianfuModel.instance.buildType, this._index)}级解锁`, true);
            }
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}