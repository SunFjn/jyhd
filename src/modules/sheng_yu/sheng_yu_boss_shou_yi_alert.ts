///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
namespace modules.sheng_yu {
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import Event = Laya.Event;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    export class ShengYuBossShouYiAlert extends ui.ShengYuBossShouYiAlertUI {
        private _list: CustomList;
        private _listBoss: CustomList;
        private _listXiaoGuai: CustomList;
        private _showIds: Array<any>;
        private _tenBtnBtnClip: CustomClip;
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
            this._list.itemRender = ShenYuRewradItem1;
            this._list.x = 0;
            this._list.y = 0;
            this.jinRShouYiBox.addChild(this._list);

            this._listBoss = new CustomList();
            this._listBoss.width = 532;
            this._listBoss.height = 283;
            this._listBoss.hCount = 5;
            this._listBoss.spaceX = 8;
            this._listBoss.itemRender = ShenYuRewradItem;
            this._listBoss.x = 0;
            this._listBoss.y = 0;
            this.BossListBox.addChild(this._listBoss);

            this._listXiaoGuai = new CustomList();
            this._listXiaoGuai.width = 532;
            this._listXiaoGuai.height = 283;
            this._listXiaoGuai.hCount = 5;
            this._listXiaoGuai.spaceX = 8;
            this._listXiaoGuai.itemRender = ShenYuRewradItem;
            this._listXiaoGuai.x = 0;
            this._listXiaoGuai.y = 0;
            this.xiaoGuaiListBox.addChild(this._listXiaoGuai);
            this.initializeClip();
        }

        public onOpened(): void {
            super.onOpened();
            this.showReward();
            this.updateBag();
        }
        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);
            if (value) {
                this._list.datas = value;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Event.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_SCENE_UPDATE, this, this.showReward);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        private btnHandler() {
            if (ShenYuBossCtrl.instance.getState()) {
                ShenYuBossCtrl.instance.PickTempReward();
            }
            else {
                modules.notice.SystemNoticeManager.instance.addNotice("暂无奖励可领", true);
            }
        }

        private showReward() {
            let shuju = ClasSsceneTempleBossCfg.instance.getCfgsByGrade(ShengYuBossModel.instance.nowCeng, 0);
            let tipsAward = shuju[scene_temple_bossFields.tipsAward];//限制的 觉醒等级 
            let tipsXiaoGuaiAward = shuju[scene_temple_bossFields.tipsXiaoGuaiAward];//限制的 觉醒等级 
            this._listBoss.datas = tipsAward;
            this._listXiaoGuai.datas = tipsXiaoGuaiAward;
            this.BossText.text = `BOSS奖励预览:(${ShengYuBossModel.instance.nowCeng}层)`;

            this.xiaoGuaiText.text = `小怪奖励预览:(${ShengYuBossModel.instance.nowCeng}层)`;
        }
        //更新背包
        private updateBag(bagId: number = BagId.temple): void {
            if (bagId == BagId.temple) {
                this._showIds = this.genGrids();
                if (this._showIds) {
                    this._list.datas = this._showIds;
                    if (this._showIds.length > 0) {
                        if (this._tenBtnBtnClip) {
                            this._tenBtnBtnClip.visible = true;
                            this._tenBtnBtnClip.play();
                        }
                        this.btn.gray = false;
                        this.btn.mouseEnabled = true;

                    } else {
                        if (this._tenBtnBtnClip) {
                            this._tenBtnBtnClip.visible = false;
                            this._tenBtnBtnClip.stop();
                        }
                        this.btn.gray = true;
                        this.btn.mouseEnabled = false;
                    }
                }
                else {
                    if (this._tenBtnBtnClip) {
                        this._tenBtnBtnClip.visible = false;
                        this._tenBtnBtnClip.stop();
                    }
                    this.btn.gray = true;
                    this.btn.mouseEnabled = false;
                }
            }
        }
        private genGrids(): Array<Protocols.Item> {
            if (BagModel.instance.getItemsByBagId(BagId.temple)) {
                let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.temple).concat();
                // let newItems = new Array<Protocols.Item>();
                // for (let index = 0; index < items.length; index++) {
                //     let element = items[index];
                //     if (element) {
                //         newItems.push([element[ItemFields.ItemId], element[ItemFields.count], 0, null]);
                //     }
                // }
                items = items.sort(this.sortFunc.bind(this));
                return items;
            }
            return [];
        }

        private sortFunc(a: Item, b: Item): number {
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            if (aQuality > bQuality) {
                return -1;
            } else if (aQuality < bQuality) {
                return 1;
            } else {
                if (aItemId > bItemId) {
                    return -1;
                } else if (aItemId < bItemId) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        /**
     * 初始化特效
     */
        public initializeClip() {
            this._tenBtnBtnClip = new CustomClip();
            this.btn.addChild(this._tenBtnBtnClip);
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.scale(1, 1, true);
            this._tenBtnBtnClip.pos(-6, -8, true);
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
            if (this._listBoss) {
                this._listBoss.removeSelf();
                this._listBoss.destroy();
                this._listBoss = null;
            }
            if (this._listXiaoGuai) {
                this._listXiaoGuai.removeSelf();
                this._listXiaoGuai.destroy();
                this._listXiaoGuai = null;
            }
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            super.destroy();
        }
    }
}