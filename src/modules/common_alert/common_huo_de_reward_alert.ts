///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
namespace modules.commonAlert {
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import Event = Laya.Event;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import List = laya.ui.List;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BtnGroup = modules.common.BtnGroup;
    import CustomClip = modules.common.CustomClip;
    export class CommonHuoDeRewardAlert extends ui.CommonHuoDeRewardAlertUI {
        private _list: CustomList;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 532;
            this._list.height = 283;
            this._list.hCount = 5;
            this._list.spaceX = 8;
            this._list.itemRender = CommonHuoDeRewardItem;
            this._list.x = 0;
            this._list.y = 0;
            this.jinRShouYiBox.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
        }
        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);
            if (value) {
                this._list.datas = value;
            }
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        public close(): void {
            super.close();
        }
        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
    }
}