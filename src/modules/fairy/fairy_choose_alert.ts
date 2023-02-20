/////<reference path="../$$.ts"/>
/** 仙女选择弹框 */
namespace modules.fairy {
    import VipModel = modules.vip.VipModel;
    import BlendCfg = modules.config.BlendCfg;
    import CommonUtil = modules.common.CommonUtil;

    export class FairyChooseAlert extends ui.FairyChooseAlertUI {

        private _fairyImgs: Array<Laya.Image>;

        protected initialize(): void {
            super.initialize();

            this.titleTxt.color = "#ffffff";
            this.titleTxt.style.fontFamily = "SimHei";
            this.titleTxt.style.align = "middle";
            this.titleTxt.style.fontSize = 26;
            this.titleTxt.style.wordWrap = false;

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.wordWrap = false;
            this.contentTxt.style.leading = 5;

            this._fairyImgs = [this.fairyImg_0, this.fairyImg_1, this.fairyImg_2, this.fairyImg_3, this.fairyImg_4]
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.updateBtn, Laya.Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(this.selectBtn, Laya.Event.CLICK, this, this.selectBtnHandler);
            this.addAutoListener(this.goBtn, Laya.Event.CLICK, this, this.goBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_UPDATE, this, this.updateView);
            //    this.addAutoListener();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(FairyModel.instance.fairyId);
            let fairyName: string = cfg[Configuration.fairyFields.name];
            let items: Configuration.Items[] = cfg[Configuration.fairyFields.items];
            this.titleTxt.innerHTML = `当前仙女<span style='color:${CommonUtil.getColorByQuality(FairyModel.instance.fairyId)}'>【${fairyName}】</span>`;
            this.titleTxt.style.width = this.titleTxt.contextWidth;
            this.titleTxt.x = (this.width - this.titleTxt.width) / 2;

            let imgStr: string = ``;
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                imgStr += `<img src="${CommonUtil.getIconById(items[i][Protocols.ItemsFields.ItemId], true)}" width="40" height="40"/>${items[i][Protocols.ItemsFields.count]}&nbsp;&nbsp;`;
            }
            let needTime: number = cfg[Configuration.fairyFields.time];
            this.contentTxt.innerHTML = `护送时长:&nbsp;<span style='color:#168a17'>${CommonUtil.getTimeTypeAndTime(needTime)}</span><br/>` +
                `护送奖励:&nbsp;${imgStr}`;
            this.residueTxt.text = `今日还可护送${BlendCfg.instance.getCfgById(31005)[Configuration.blendFields.intParam][0] - FairyModel.instance.escort}次`;
            let consumItem_0: number[] = config.BlendCfg.instance.getCfgById(31011)[Configuration.blendFields.intParam];
            this.consumImg_0.skin = CommonUtil.getIconById(consumItem_0[0], true);
            this.consumTxt_0.text = `${consumItem_0[1]}`;
            let consumItem_1: number[] = config.BlendCfg.instance.getCfgById(31013)[Configuration.blendFields.intParam];
            this.consumImg_1.skin = CommonUtil.getIconById(consumItem_1[0], true);
            this.consumTxt_1.text = `${consumItem_1[1]}`;
            let needVipLv: number = config.BlendCfg.instance.getCfgById(31012)[Configuration.blendFields.intParam][0];
            let currVipLv: number = VipModel.instance.vipLevel;
            if (currVipLv >= needVipLv) {
                this.consumImg_1.x = 435;
                this.consumTxt_1.x = this.consumImg_1.x + this.consumImg_1.width;
                this.needVipTxt.visible = false;
            } else {
                this.needVipTxt.visible = true;
                this.needVipTxt.text = `SVIP${needVipLv}开启`;
                this.consumImg_1.x = 389;
                this.consumTxt_1.x = this.consumImg_1.x + this.consumImg_1.width;
                this.needVipTxt.x = this.consumTxt_1.x + this.consumTxt_1.width + 10;
            }
            let frameIndex: number = FairyModel.instance.fairyId - 1;
            this.frameImg.skin = `fairy/seltectd_hsxv_xv${frameIndex + 1}.png`;
            this.frameImg.x = this._fairyImgs[frameIndex].x;
        }

        private updateBtnHandler(): void {
            FairyCtrl.instance.refreshFairy();
        }

        private selectBtnHandler(): void {
            FairyCtrl.instance.selectBestFairy();
        }

        private goBtnHandler(): void {
            FairyCtrl.instance.escortFairy();
            this.close();
        }

        public destroy(): void {
            this._fairyImgs = this.destroyElement(this._fairyImgs);
            super.destroy();
        }
    }
}
