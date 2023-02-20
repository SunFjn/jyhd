///<reference path="../config/onhook_drop_cfg.ts"/>

//挂机扫荡弹框
namespace modules.lineClearOut {
    import OnhookDropCfg = modules.config.OnhookDropCfg;
    import CustomClip = modules.common.CustomClip;
    import BlendCfg = modules.config.BlendCfg;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BaseItem = modules.bag.BaseItem;
    import Text = Laya.Text;
    import BagUtil = modules.bag.BagUtil;
    import GetMonthCardInfoReply = Protocols.GetMonthCardInfoReply;
    import GetMonthCardInfoReplyFields = Protocols.GetMonthCardInfoReplyFields;

    export class LineClearOutAlert extends ui.LineClearOutUI {

        private _allClearTime: number; //扫荡上限
        private _btnClip: CustomClip;
        private _numTxtArr: Array<Text>;
        private _equipItem: BaseItem;
        private _equipId: number;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._allClearTime = BlendCfg.instance.getCfgById(24002)[Configuration.blendFields.intParam][0];

            this._btnClip = new CustomClip();
            this.clearBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png",
                "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png",
                "btn_light/14.png", "btn_light/15.png"
            ];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-7, -21);
            this._btnClip.scale(1.26, 1.3);
            this._btnClip.visible = false;

            let times = BlendCfg.instance.getCfgById(24001)[Configuration.blendFields.intParam][0];
            this.timeClip.value = times.toString();

            this._numTxtArr = [this.coinNumTxt, this.exNumtTxt, this.genuineNumTxt, this.equipNumtxt, this.dragontNumTxt, this.smeltNumTxt];
            let iconArr: number[] = [MoneyItemId.copper, MoneyItemId.exp, MoneyItemId.zq, 50142011, 10120001, 90730001];

            for (let i: number = 0; i < 6; i++) {
                let item: BaseItem = new BaseItem();
                if (i == 3) {
                    this._equipItem = item;
                }
                this.addChild(item);
                item.dataSource = [iconArr[i], 0, 0, null];
                item.nameVisible = false;
                item.x = 89 + Math.floor(i % 3) * 183;
                item.y = 421 + Math.floor(i / 3) * (144);
            }

            this._equipId = BlendCfg.instance.getCfgById(24005)[Configuration.blendFields.intParam][0];
        }

        public onOpened(): void {
            super.onOpened();
            Channel.instance.publish(UserFeatureOpcode.GetSweepingState, null);

            this._btnClip.play();
            this.updateAlert();
            this.showVenerateOpen();
            this.showZhizunBtn();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.clearBtn, common.LayaEvent.CLICK, this, this.clearFighting);
            this.addAutoListener(this.addTimesBtn, common.LayaEvent.CLICK, this, this.addTimes);
            this.addAutoListener(this.monthCardBox, common.LayaEvent.CLICK, this, this.openMonthCard);
            this.addAutoListener(this.zhizunBox, common.LayaEvent.CLICK, this, this.zhizunHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SWEEPING_UPDATE, this, this.updateAlert);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showZhizunBtn);
        }

        private openMonthCard(): void {
            WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
            this.close();
        }

        private zhizunHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            this.close();
        }

        public showVenerateOpen() {
            let info: GetMonthCardInfoReply = modules.monthCard.MonthCardModel.instance.MonthCardInfoReply;
            if (info) {
                if (info[GetMonthCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启
                    this.monthCardBox.gray = true;
                    this.monthCardTxt.text = "点击开通";
                } else {
                    this.monthCardBox.gray = false;
                    this.monthCardTxt.text = "已开通";
                }
            } else {
                this.monthCardBox.gray = true;
                this.monthCardTxt.text = "点击开通";
            }
        }

        private showZhizunBtn(): void {
            let state: number = zhizun.ZhizunModel.instance.state;
            if (state == null) return;
            let openState: boolean = state == 1;
            if (openState) {
                this.zhizunBox.gray = false;
                this.zhizunTxt.text = "已开通";
            } else {
                this.zhizunBox.gray = true;
                this.zhizunTxt.text = "点击开通";
            }
        }

        private clearFighting(): void {
            if (!BagUtil.checkNeedSmeltTip()) {
                Channel.instance.publish(UserFeatureOpcode.OneKeySweeping, null);
            }
        }

        private addTimes(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.canBuySweppingTimes);
        }

        private updateAlert(): void {
            if (!LineClearOutModel.instance.getSweepingState) return;
            let numArr: number[] = [
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.coin],
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.exp],
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.zq],
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.equip],
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.stone],
                LineClearOutModel.instance.getSweepingState[Protocols.GetSweepingStateReplyFields.smeltExp],
            ];

            for (let i: number = 0, len: int = this._numTxtArr.length; i < len; i++) {
                this._numTxtArr[i].text = `×${modules.common.CommonUtil.bigNumToString(numArr[i])}`;
            }

            let cfg: Configuration.onhook_drop = OnhookDropCfg.instance.getCfgByLv(PlayerModel.instance.bornLev);
            let equipNum: number = cfg[Configuration.onhook_dropFields.equip][1];
            this._equipItem.dataSource = [this._equipId, equipNum, 0, null];

            let clearTimes: number = LineClearOutModel.instance.clearTime;        //已经扫荡次数
            let canClearTime: number = LineClearOutModel.instance.availableTimes; //可扫荡次数
            this.fightTimesTxt.text = canClearTime + "/" + this._allClearTime;

            this.addTimesBtn.x = this.fightTimesTxt.x + this.fightTimesTxt.width + 10;
            let needNum: number = 0;
            if (clearTimes == 0) {  //首次扫荡免费
                this.firstTxt.visible = true;
                this.goldImg.visible = false;
                this.goldNumTxt.visible = false;
            } else {
                this.firstTxt.visible = false;
                this.goldImg.visible = true;
                this.goldNumTxt.visible = true;
                if (clearTimes > 9) clearTimes = 9;
                needNum = BlendCfg.instance.getCfgById(24003)[Configuration.blendFields.intParam][clearTimes];
                this.goldNumTxt.text = needNum.toString();
            }
            if (canClearTime > 0) {
                let haveNum: number = PlayerModel.instance.ingot;
                if (haveNum >= needNum) {
                    this._btnClip.visible = true;
                } else {
                    this._btnClip.visible = false;
                }
                this.fightTimesTxt.color = "#444444";
            } else {
                this._btnClip.visible = false;
                this.fightTimesTxt.color = "#ff3e3e";
            }
        }
    }

}