///<reference path="../config/open_award_cfg.ts"/>
///<reference path="./open_award_model.ts"/>
/** 开服礼包 */
namespace modules.openAward {
    import OpenAwardModel = modules.openAward.OpenAwardModel;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import OpenAwardViewUI = ui.OpenAwardViewUI;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import OpenAwardCfg = modules.config.OpenAwardCfg;
    import open_reward = Configuration.open_reward;
    import Items = Configuration.Items;
    import open_rewardFields = Configuration.open_rewardFields;
    import Item = Protocols.Item;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ItemsFields = Configuration.ItemsFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class OpenAwardPanel extends OpenAwardViewUI {

        private _list: CustomList;
        private _items: Array<BaseItem>;
        private _time: number;
        // private _avatar: AvatarClip;
        private _tween: TweenJS;
        private _eff: CustomClip;
        private _canBug: boolean;
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.x = 40;
            this._list.y = 95;
            this._list.width = 640;
            this._list.height = 242;
            this._list.vCount = 1;
            this._list.itemRender = OpenAwardItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
            this.addChild(this.closeBtn);

            // this._avatar = AvatarClip.create(1024, 1024, 1024);
            // this._avatar.anchorX = 0.5;
            // this._avatar.anchorY = 0.5;
            // this._avatar.pos(360, 742, true);
            // this.addChildAt(this._avatar, 3);
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 742, true);

            this._items = [];
            this._time = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OPEN_AWARD_UPDATE, this, this.updateView);
            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.updateShow);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            OpenAwardCtrl.instance.getOpenReward();
            this.updateView();
        }

        private updateView(): void {
            this._time = OpenAwardModel.instance.time;
            if (this._time > GlobalData.serverTime) {
                Laya.timer.loop(1000, this, this.loopHandler);
                this.loopHandler();
            }
            let ids: number[] = OpenAwardCfg.instance.ids.concat().sort(this.sortByState.bind(this));
            this._list.datas = ids;
            this._list.selectedIndex = 0;
            this.updateShow();
        }

        private updateShow(): void {
            let id: number = this._list.selectedData;
            let cfg: open_reward = OpenAwardCfg.instance.getCfgById(id);
            this.fightMsz.value = cfg[open_rewardFields.fight].toString();
            this.nameTxt.text = cfg[open_rewardFields.name];
            let awards: Items[] = cfg[open_rewardFields.award];
            let itemDatas: Item[] = CommonUtil.formatItemData(awards);
            for (let i: int = 0, len: int = itemDatas.length; i < len; i++) {
                let item: BaseItem = this._items[i];
                if (!item) {
                    item = new BaseItem();
                    item.nameVisible = false;
                    item.y = 872;
                    item.scale(0.8, 0.8, true);
                    this._items[i] = item;
                    this.addChild(item);
                }
                item.dataSource = itemDatas[i];
            }
            CommonUtil.centerChainArr(this.width, this._items, -15);

            let index: number = this._list.selectedIndex;
            if (index == 0 || index == 1) {
                //this._avatar.y = this.showImg.y;
                this._skeletonClip.y = this.showImg.y;
            } else {
                //this._avatar.y = 742;
                this._skeletonClip.y = 742;
            }

            let showId: number = cfg[open_rewardFields.iconID];
            let type: number = cfg[open_rewardFields.isModel];
            if (type == 0) { //模型
                this.showImg.skin = ``;
                // this._avatar.visible = true;
                // this._avatar.reset(showId);
                this._skeletonClip.visible = true;
                this._skeletonClip.reset(showId);
            } else if (type == 1) {
                this.showImg.skin = ``;
                // this._avatar.visible = true;
                // this._avatar.reset(0, 0, 0, 0, showId);
                this._skeletonClip.visible = true;
                this._skeletonClip.reset(0, 0, 0, 0, showId);
            } else {
                // this._avatar.visible = false;
                this._skeletonClip.visible = false;
                this.showImg.skin = `assets/icon/ui/open_award/${showId}.png`;
            }
            this.setAvatar(showId);

            let needEff: boolean = cfg[open_rewardFields.isTeXiao] == 1;
            if (needEff) {
                if (!this._eff) { //特效不存在
                    this._eff = CommonUtil.creatEff(this, `ok_state`, 7);
                    this.addChildAt(this._eff, 2);
                    this._eff.scale(2, 2);
                    this._eff.pos(104, 380);
                }
                this._eff.play();
                this._eff.visible = true;
            } else {
                if (this._eff) {
                    this._eff.stop();
                    this._eff.visible = false;
                }
            }

            let needMove: boolean = cfg[open_rewardFields.isMove] == 1;
            if (needMove) {
                if (this._tween) {
                    this._tween.stop();
                    this._tween = null;
                }
                if (type == 0 || type == 1) {
                    // this._tween = TweenJS.create(this._avatar);
                    // this._tween.to({ y: this._avatar.y - 20 }, 1000).yoyo(true).repeat(Number.POSITIVE_INFINITY);
                } else {
                    this._tween = TweenJS.create(this.showImg);
                    this._tween.to({ y: this.showImg.y - 20 }, 1000).yoyo(true).repeat(Number.POSITIVE_INFINITY);
                }
                this._tween.start();
            } else {
                if (this._tween) {
                    this._tween.stop();
                }
            }

            let state: boolean = OpenAwardModel.instance.getStateById(id) == 1;
            if (state) { //如果冲过
                this.btn.skin = `common/txt_common_ygm.png`;
                this.propBox.visible = this.btn.mouseEnabled = false;
                this.btn.label = ``;
                this.btn.pos(309, 1064, true);
            } else {
                this.btn.skin = `common/btn_tongyong_6.png`;
                this.propBox.visible = this.btn.mouseEnabled = true;
                this.btn.label = `购买`;
                this.btn.pos(265, 1055, true);
                let propItem: ItemId = cfg[open_rewardFields.cost][ItemsFields.itemId];
                let propNum: number = cfg[open_rewardFields.cost][ItemsFields.count];
                this.propImg.skin = CommonUtil.getIconById(propItem, true);
                this.propTxt.text = `${propNum}`;
                let haveNum: number = CommonUtil.getPropCountById(propItem);
                this.propTxt.color = haveNum >= propNum ? `#2d1a1a` : `#ff3e3e`;
                this._canBug = haveNum >= propNum;
            }
        }

        private sortByState(l: number, r: number): number {
            let lState: number = OpenAwardModel.instance.getStateById(l);
            let rState: number = OpenAwardModel.instance.getStateById(r);
            return lState > rState ? 1 : lState < rState ? -1 : CommonUtil.smallToBigSort(l, r);
        }

        private setAvatar(showId: number): void {
            let extercfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // this._avatar.avatarRotationY = extercfg[Configuration.ExteriorSKFields.rotationY] ? extercfg[Configuration.ExteriorSKFields.rotationY] : 180;
            // this._avatar.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? extercfg[Configuration.ExteriorSKFields.scale] : 1;
            // this._avatar.avatarRotationX = extercfg[Configuration.ExteriorSKFields.rotationX] ? extercfg[Configuration.ExteriorSKFields.rotationX] : 0;
            // this._avatar.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._avatar.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
        }

        private loopHandler(): void {
            if (this._time > GlobalData.serverTime) { //大于现在时间 进行中
                this.remainTxt.text = CommonUtil.timeStampToDayHourMin(this._time);
            } else { //结束
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        private btnHandler(): void {
            if (this._canBug) {
                let id: number = this._list.selectedData;
                OpenAwardCtrl.instance.buyOpenReward(id);
            } else {
                CommonUtil.goldNotEnoughAlert();
            }
        }

        public close(): void {

            if (this._tween) {
                this._tween.stop();
            }
            super.close();
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._items = this.destroyElement(this._items);
            // this._avatar = this.destroyElement(this._avatar);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            this._eff = this.destroyElement(this._eff);
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            super.destroy();
        }
    }
}