/**单人boss单元项*/


///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
namespace modules.sheng_yu {
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    export class ShengYuBossItem extends ui.ShengYuBossItemUI {
        private _challengeClip: CustomClip;
        private _list: CustomList;
        private _taskBase: Array<BaseItem>;
        private _datas: scene_temple_boss;
        private _ceng: number;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 117 * 4;
            this._list.height = 193;
            this._list.hCount = 5;
            this._list.spaceX = 5;
            this._list.scrollDir = 2;
            this._list.itemRender = ShengYuBossInfoItem;
            this._list.x = 14;
            this._list.y = 0;
            this.bossInfoBox.addChild(this._list);
            this._taskBase = [this.reward1, this.reward2, this.reward3, this.reward4, this.reward5, this.reward6];
            this._ceng = 0;
        }

        protected setData(value: any): void {
            super.setData(value);
            if (!value) {
                return;
            }
            this._ceng = value;
            this._datas = ClasSsceneTempleBossCfg.instance.getCfgsByGrade(value, 0);
            this.showReward();
            this.showInfo();
            this.showBossInfo();
        }

        protected onOpened(): void {
            super.onOpened();
            this.oneSetOpen();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.challengeBtn, Event.CLICK, this, this.challengeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_OPENONE, this, this.oneSetOpen);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        public set isOpenRewad(value: boolean) {
            this.setWiht();
        }
        public setWiht() {
            this.rewardBox.visible = true;
            // GlobalData.dispatcher.event(CommonEventType.SHENG_YU_BOSS_OPENUPDATE);
        }
        /**
         * 第一个默认打开
         */
        public oneSetOpen() {
            if (this._ceng == ShengYuBossModel.instance._moRengCeng) {
                this.isOpenRewad = true;
            }
            else {
                this.isOpenRewad = false;
            }
        }
        private challengeHandler(): void {
            let tili = ShengYuBossModel.instance.stength;
            let eraCondition = this._datas[scene_temple_bossFields.eraLevel];//限制的 觉醒等级
            let lev = modules.born.BornModel.instance.lv;
            if (lev >= eraCondition) {
                // if (tili > 0) {
                let mapId = this._datas[scene_temple_bossFields.mapId];
                let level = this._datas[scene_temple_bossFields.level];
                if (mapId) {
                    DungeonCtrl.instance.reqEnterScene(mapId, level);
                }
                // }
                // else {
                // SystemNoticeManager.instance.addNotice("体力不足", true);
                // }
            }
            else {
                SystemNoticeManager.instance.addNotice("觉醒等级不足", true);
            }
        }
        private showInfo() {
            let level = this._datas[scene_temple_bossFields.level];
            let eraTips = this._datas[scene_temple_bossFields.eraTips];
            let eraCondition = this._datas[scene_temple_bossFields.eraLevel];//限制的 觉醒等级 

            this.level_text.value = ShengYuBossModel.instance.getName(level, true);
            this.openConditionText.text = eraTips + `开启`;
            let lev = modules.born.BornModel.instance.lv;
            if (lev >= eraCondition) {
                this.challengeBtn.visible = true;
                this.openConditionText.visible = false;
                this.openBg.visible = false;
            }
            else {
                this.challengeBtn.visible = false;
                this.openConditionText.visible = true;
                this.openBg.visible = true;
            }

        }
        //显示奖励
        private showReward() {
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let level = this._datas[scene_temple_bossFields.level];
            let shuju = ClasSsceneTempleBossCfg.instance.getCfgsByGrade(level, 0);
            let rewards = shuju[scene_temple_bossFields.tipsAward];//限制的 觉醒等级 
            let allAward = new Array<BaseItem>();
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    _taskBase.nameVisible = false;
                    allAward.push(_taskBase);
                }
            }
        }
        /**
         * showBoss显示boss信息列表
         */
        public showBossInfo() {
            let level = this._datas[scene_temple_bossFields.level];//限制的 觉醒等级 
            let infos = ClasSsceneTempleBossCfg.instance.getBossInfoByGrade(level);
            this._list.datas = infos
        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}