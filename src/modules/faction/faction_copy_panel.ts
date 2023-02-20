///<reference path="../config/scene_copy_faction_cfg.ts"/>
/** 仙盟副本 */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import BagUtil = modules.bag.BagUtil;
    import BlendCfg = modules.config.BlendCfg;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import FactionCopyViewUI = ui.FactionCopyViewUI;
    import BaseItem = modules.bag.BaseItem;
    import scene_copy_faction = Configuration.scene_copy_faction;
    import SceneCopyFactionCfg = modules.config.SceneCopyFactionCfg;
    import Items = Configuration.Items;
    import scene_copy_factionFields = Configuration.scene_copy_factionFields;
    import ItemsFields = Configuration.ItemsFields;
    import GetFactionCopyInfoReplyFields = Protocols.GetFactionCopyInfoReplyFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MonsterResFields = Configuration.MonsterResFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import GetFactionInfoReplyFields = Protocols.GetFactionInfoReplyFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class FactionCopyPanel extends FactionCopyViewUI {

        private _items: Array<BaseItem>;
        private _time: number;
        private _bar: ProgressBarCtrl;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._items = [];
            this._time = 0;

            this._bar = new ProgressBarCtrl(this.barImg, this.barImg.width, this.barTxt);

            this.tipTxt.color = "#ffffff";
            this.tipTxt.style.fontFamily = "SimHei";
            this.tipTxt.style.fontSize = 26;
            this.tipTxt.mouseEnabled = false;
            this.tipTxt.style.wordWrap = false;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 5);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.x = 360;
            // this._modelClip.y = 562;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.x = 360;
            this._skeletonClip.y = 562;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(this.addBtn, common.LayaEvent.CLICK, this, this.addBtnHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.aboutBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateData);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_COPY_INFO, this, this.updateInfo);
        }

        public onOpened(): void {
            super.onOpened();
            if (!FactionModel.instance.factionId) {
                this.close();
                return;
            }
            FactionCtrl.instance.getFactionCopyInfo();
            FactionCtrl.instance.getFactionCopyData();
            this.updateView();
        }

        private updateView(): void {
            let index: number = FactionModel.instance.bossIndex;
            let cfg: scene_copy_faction = SceneCopyFactionCfg.instance.getCfgByIndex(index);
            if (!cfg) return;
            let awards: Array<Items> = cfg[scene_copy_factionFields.award];
            for (let i: int = 0, len: int = awards.length; i < len; i++) {
                if (!this._items[i]) {
                    let item: BaseItem = new BaseItem();
                    this.addChild(item);
                    this._items.push(item);
                    item.y = 840;
                }
                this._items[i].dataSource = [awards[i][ItemsFields.itemId], awards[i][ItemsFields.count], 0, null];
            }

            CommonUtil.centerChainArr(720, this._items, 35);
            this.updateInfo();
            this.updateData();
        }

        private updateInfo(): void {
            if (!FactionModel.instance.copyInfo) return;
            this._time = FactionModel.instance.copyInfo[GetFactionCopyInfoReplyFields.time];
            this.timeTxt.text = `剩余挑战时长 ${CommonUtil.msToMMSS(this._time)}`;
            this.timeTxt.color = this._time > 0 ? `#168a17` : `#ff3e3e`;
        }

        private updateData(): void {

            let index: number = FactionModel.instance.bossIndex;
            let cfg: scene_copy_faction = SceneCopyFactionCfg.instance.getCfgByIndex(index);
            let bossId: number = cfg[scene_copy_factionFields.boosId];
            let monsterCfg: Configuration.monster = config.MonsterCfg.instance.getMonsterById(bossId);
            let maxHp: number = FactionModel.instance.baseInfo[GetFactionInfoReplyFields.bossMaxHp];
            this._bar.maxValue = maxHp;
            let value: number = maxHp - FactionModel.instance.bossHp;
            this._bar.value = value;
            let bossName: string = monsterCfg[Configuration.monsterFields.name];
            this.nameTxt.text = bossName;

            let id: number = MonsterResCfg.instance.getCfgById(bossId)[MonsterResFields.res];
            // this._modelClip.reset(id);
            this._skeletonClip.reset(id);
            let modelCfg: Configuration.ExteriorSK = config.ExteriorSKCfg.instance.getCfgById(id);
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX] ? modelCfg[ExteriorSKFields.rotationX] : 0;
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY] ? modelCfg[ExteriorSKFields.rotationY] : 180;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY] ? modelCfg[ExteriorSKFields.deviationY] : 0;
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX] ? modelCfg[ExteriorSKFields.deviationX] : 0;
            let currNum: number = FactionModel.instance.copyManCount;

            this.goingNumTxt.text = `正在进攻:${currNum}人`;
            let needManNum: number = BlendCfg.instance.getCfgById(36025)[Configuration.blendFields.intParam][0];
            let skillName: string = BlendCfg.instance.getCfgById(36025)[Configuration.blendFields.stringParam][0];
            let wordStr: string = `(正在进攻超过<span style='color:#ffffff'>${needManNum}人</span>即可激活<span style='color:#ff9f47'>【${skillName ? skillName : `山鸡哥`}】</span>BUFF,<span style='color:#ff9f47'>攻击暴涨</span>!)`;
            this.tipTxt.innerHTML = wordStr;
            this.tipTxt.x = (this.width - this.tipTxt.width) / 2;
        }

        private btnHandler(): void {
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_faction);
        }

        private addBtnHandler(): void {
            let id: number = BlendCfg.instance.getCfgById(36035)[Configuration.blendFields.intParam][0];
            let count: number = bag.BagModel.instance.getItemCountById(id);
            if (count > 0) {
                WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, [[id, count, 0, null], true]);
            } else {
                BagUtil.openLackPropAlert(id, 1);
            }
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20053);
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._items) {
                for (let e of this._items) {
                    e.destroy();
                }
                this._items = null;
            }
            if (this._bar) {
                this._bar.destroy();
                this._bar = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}