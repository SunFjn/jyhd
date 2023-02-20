/////<reference path="../$.ts"/>
/** 聚灵厅的结算奖励面板 */
namespace modules.xianfu {
    import JulingAccountAlertUI = ui.JulingAccountAlertUI;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import CommonUtil = modules.common.CommonUtil;
    import hero_AuraFields = Configuration.hero_auraFields;

    export class JulingAccountAlert extends JulingAccountAlertUI {

        private _btnClip: CustomClip;
        private _time: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", `btn_light`, 16);
            this.getBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(1, 1.2);
            this._btnClip.visible = false;

            this._time = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getBtn, Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updateView);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.play();
            this.updateView();
        }

        private updateView(): void {
            //0汇灵阵->药草园 1聚宝盆->粮食园
            let panelType: number = XianfuModel.instance.buildType;
            this.titleTxt.text = panelType ? `粮食园` : `药草园`;
            this.moneyImg.skin = panelType ? `xianfu/19_s.png` : `xianfu/18_s.png`;
            this.moneyTxt.text = XianfuModel.instance.treasureInfos(panelType).toString();
            let buildInfo: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(panelType);
            let time: number = this._time = buildInfo[GetBuildingInfoReplyFields.time];
            let state: number = buildInfo[GetBuildingInfoReplyFields.state];/*建筑状态 0：闲置 1:产出中 2：可领取*/
            let output: number = buildInfo[GetBuildingInfoReplyFields.output];
            let sumOutPut: number = buildInfo[GetBuildingInfoReplyFields.sum];
            let addition: number = buildInfo[GetBuildingInfoReplyFields.addition];
            this.continueTimeTxt.text = panelType ? `粮食园已持续出产${CommonUtil.getTimeTypeAndTime(time)}` : `药草园已持续产药${CommonUtil.getTimeTypeAndTime(time)}`;
            this.valueTxt_0.text = output.toString();
            this.valueTxt_1.text = addition.toString();
            this.valueTxt_2.text = sumOutPut.toString();
            this.IconImg_0.skin = this.IconImg_1.skin = this.IconImg_2.skin = CommonUtil.getIconById(panelType ? 91930001 : 91830001, true);
            this.typeTxt.text = panelType ? `出产` : `产药`;
            let flag = heroAura.HeroAuraModel.instance.flag;
            if (flag == 1) {
                // 开通黑钻特权将聚灵上限时间变为72小时
                let arr = GlobalData.getConfig("user_halo")[0];
                
                let newText = panelType ? arr[hero_AuraFields.treasureGathering] : arr[hero_AuraFields.xianFuTime];
                this.timeTxt.text = newText.toString() + "小时";
            } else {
                this.timeTxt.text = CommonUtil.getTimeTypeAndTime(XianfuModel.instance.maxOutput[panelType]);
            }

            if (state == 1) {
                let needTime: number = XianfuModel.instance.stageOutput[panelType];
                this.hintTxt.text = `${panelType ? `出产` : `产药`}达到${CommonUtil.getTimeTypeAndTime(needTime)}才可领取收益`;
                this.hintTxt.visible = true;
                this._btnClip.visible = this.getBtn.visible = false;
            } else if (state == 2 || state == 3) {
                this.hintTxt.visible = false;
                this._btnClip.visible = this.getBtn.visible = true;
            }
        }

        private loopHandler(): void {
            let panelType: number = XianfuModel.instance.buildType;
            let needTime: number = XianfuModel.instance.maxOutput[panelType];
            if (this._time >= needTime) {
                return;
            } else {
                this.continueTimeTxt.text = panelType ? `粮食园已持续出产${CommonUtil.getTimeTypeAndTime(this._time)}` : `药草园已持续产药${CommonUtil.getTimeTypeAndTime(this._time)}`;
                this._time += 1000;
            }
        }

        private getBtnHandler(): void {
            let buildType: number = XianfuModel.instance.buildType;
            XianfuCtrl.instance.getBuildProduceAward([buildType]);
            this.close();
        }

        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy();
        }
    }
}