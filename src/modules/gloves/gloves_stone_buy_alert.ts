/** 徽章购买弹框*/


namespace modules.gloves {
    import GlovesStoneBuyAlertUI = ui.GlovesStoneBuyAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import CustomClip = modules.common.CustomClip;

    export class GlovesStoneBuyAlert extends GlovesStoneBuyAlertUI {
        private _items: Array<BaseItem>;
        private _btnClip: CustomClip;
        private _tipBox1Tween: TweenJS;
        private prizeEffect: CustomClip;      //装备光效
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];

            this._btnClip = new CustomClip();
            this._btnClip = CommonUtil.creatEff(this, `btn_light`, 15);
            this._btnClip.pos(this.buyBtn.x + 42, this.buyBtn.y + 32, true);
            this._btnClip.scale(1.47, 1.25);
            this._btnClip.visible = true;
            this._btnClip.play();

            this.prizeEffect = new CustomClip();
            this.addChildAt(this.prizeEffect, 2);
            this.prizeEffect.scale(2, 2);
            this.prizeEffect.skin = "assets/effect/scbaoxiang.atlas";
            let arr1 = [];
            for (let i: int = 0; i < 12; i++) {
                arr1[i] = `scbaoxiang/${i}.png`;
            }

            this.prizeEffect.frameUrls = arr1;
            this.prizeEffect.durationFrame = 5;
            this.prizeEffect.loop = true;
            this.prizeEffect.zOrder = 10;
            this.prizeEffect.anchorX = 0.5;
            this.prizeEffect.anchorY = 0.5;
            this.prizeEffect.pos(180, 450);
            this.prizeEffect.scale(3, 3);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(this.buyBtn, LayaEvent.CLICK, this, this.buyClickHandler);
        }

        onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.updateInfo();
            this.playEffectLoop();
            this.prizeEffect.play();
        }
        private playEffectLoop(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
            this.stoneImg.y = 346;
            this._tipBox1Tween = TweenJS.create(this.stoneImg).to({ y: this.stoneImg.y - 15 },
                1200).start().yoyo(true).repeat(99999999);
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.stop();
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
        }

        private updateInfo(): void {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            if (!info) return;
            if (info[GetGauntletReplyFields.jewel_index] === 0 && info[GetGauntletReplyFields.draw_index] === 0) {
                this.buyBtn.visible = false;
                this.gotImg.visible = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
                return;
            }
            let stoneId: number = info[GetGauntletReplyFields.jewel_index] || info[GetGauntletReplyFields.draw_index];
            if (info[GetGauntletReplyFields.jewel_index]) {
                this.buyBtn.label = "立即抢购";
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
                this._btnClip.visible = true;
                this._btnClip.play();

            } else if (info[GetGauntletReplyFields.draw_index]) {
                this.buyBtn.label = "领取奖励";
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
                this._btnClip.visible = true;
                this._btnClip.play();
            }
            let arr: Array<number> = BlendCfg.instance.getCfgById(stoneId + 51000)[blendFields.intParam];
            for (let i: int = 0, len: int = arr.length; i < len; i += 2) {
                this._items[i * 0.5].dataSource = [arr[i], arr[i + 1], 0, null];
            }
            this.stoneImg.skin = CommonUtil.getIconById(arr[0]);
            this.nameBigImg.skin = `gloves/${stoneId}.png`;
            this.nameSmallImg.skin = `gloves/${stoneId}_s.png`;
        }

        private buyClickHandler(): void {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            if (!info) return;
            if (info[GetGauntletReplyFields.jewel_index]) {
                GlovesCtrl.instance.buy(info[GetGauntletReplyFields.jewel_index]);
            } else if (info[GetGauntletReplyFields.draw_index]) {
                GlovesCtrl.instance.drawGauntlet();
            }
        }

        destroy(): void {
            this._items = this.destroyElement(this._items);
            this._btnClip = this.destroyElement(this._btnClip);
            this.prizeEffect = this.destroyElement(this.prizeEffect)
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            super.destroy();
        }
    }
}