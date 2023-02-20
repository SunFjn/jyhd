///<reference path="../bigtower/bigtower_model.ts"/>
///<reference path="../config/scene_copy_dahuang_cfg.ts"/>
///<reference path="../config/scene_copy_rune_cfg.ts"/>
///<reference path="../rune_copy/rune_copy_model.ts"/>
///<reference path="../ladder/ladder_model.ts"/>

/** 包含第一名的胜利面板*/
namespace modules.dungeon {
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;
    import BagItem = modules.bag.BagItem;
    import BlendCfg = modules.config.BlendCfg;
    import FirstWinViewUI = ui.FirstWinViewUI;
    import CustomList = modules.common.CustomList;
    import CopyJudgeAward = Protocols.CopyJudgeAward;
    import CopyJudgeAwardFields = Protocols.CopyJudgeAwardFields;
    import LayaEvent = modules.common.LayaEvent;

    export class FirstWinPanel extends FirstWinViewUI {

        private _duration: number;
        private _list: CustomList;
        private _tweenArr: Array<TweenJS>;
        private _tiemoutArr: Array<number>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.closeOnSide = false;
            //修改為列表顯示
            this._list = new CustomList();
            this._list.width = 560;
            this._list.height = 278;
            this._list.hCount = 4;
            this._list.spaceX = 24;
            // this._list.spaceY = 30;
            this._list.itemRender = BagItem;
            this._list.x = 128;
            this._list.y = 730;
            this.addChild(this._list);

            this.recordHtml.visible = false;
            this.tipTxt.text = `伤害第一: `;
            this.desTxt.text = `伤害第一可获得伤害第一宝箱`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Merge_Awards, this, this.updataCashEquip);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            this.loopHandler();

            this.showAward(this._list);
        }

        // 关闭tween
        private closeTween() {
            if (this._tweenArr && this._tweenArr.length > 0) {
                for (let index = 0; index < this._tweenArr.length; index++) {
                    this._tweenArr[index].stop();
                    this._tweenArr[index] = null;
                }
            }
            this._tweenArr = null;
        }

        // 关闭timeout定时器
        private closeTimeOut() {
            if (this._tiemoutArr && this._tiemoutArr.length > 0) {
                for (let index = 0; index < this._tiemoutArr.length; index++) {
                    clearTimeout(this._tiemoutArr[index]);
                }
            }
            this._tiemoutArr = null;
        }

        private showAward(list: CustomList) {
            for (const m of list.items) {
                m.scaleX = m.scaleY = 1.2;
                m.visible = false;
            }

            this.closeTween();
            this.closeTimeOut();
            this._tweenArr = [];
            this._tiemoutArr = [];

            let delta = 0;
            for (const n of list.items) {
                let tween = TweenJS.create(n).to({ scaleX: 0.9, scaleY: 0.9 }, 300)
                    .easing(utils.tween.easing.circular.InOut)
                    .delay(delta)
                    .start();


                let timeoutid = setTimeout(() => {
                    n.visible = true;
                }, delta);

                this._tweenArr.push(tween);
                this._tiemoutArr.push(timeoutid);

                delta += 100
            }
        }

        public close(): void {
            super.close();
            this.closeTween();
            this.closeTimeOut();
            DungeonCtrl.instance.reqEnterScene(0);
            if (this._item) GlobalData.dispatcher.event(CommonEventType.CashEquip_Completion_Callback, [this._item]);
        }
        private rewardData: Array<Protocols.Item>;
        public setOpenParam(value: CopyJudgeAward): void {
            super.setOpenParam(value);
            if (!value) return;
            let items: Protocols.Item[] = value[CopyJudgeAwardFields.items];
            console.log("结算胜利。。。。。" + items);
            this.rewardData = items
            this._list.datas = items;
            let occ: number = value[CopyJudgeAwardFields.occ];
            let name: string = value[CopyJudgeAwardFields.name];
            this.headImg.skin = `assets/icon/head/${occ}.png`;
            this.nameTxt.text = name;
            modules.common.CommonUtil.centerChainArr(this.width, [this.tipTxt, this.nameTxt]);
        }
        private _item: Protocols.Item
        private updataCashEquip(item: Protocols.Item) {
            if (this.rewardData && this._list) {
                this.rewardData.unshift(item)
                this._list.datas = this.rewardData;
                this._item = item
            }
        }
        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }

        public destroy(): void {
            this.closeTween();
            this.closeTimeOut();

            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }

}