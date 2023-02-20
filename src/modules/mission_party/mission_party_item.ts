/** 全民狂嗨 奖励子项*/

namespace modules.mission_party {

    import CustomClip = modules.common.CustomClip;
    import kuanghai2_rise = Configuration.kuanghai2_rise;
    import kuanghai2_riseFields = Configuration.kuanghai2_riseFields;
    import Kuanghai2GradeNode = Protocols.Kuanghai2GradeNode;

    import Kuanghai2GradeNodeFields = Protocols.Kuanghai2GradeNodeFields;
    import LayaEvent = modules.common.LayaEvent;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    export class MissionPartyItem extends ui.MissionPartyItemUI {
        // private _btnClip: CustomClip;
        private _btnClip: CustomClip;
        private _cfg: kuanghai2_rise;
        private _riseList: Kuanghai2GradeNode;/*档次列表*/
        private _riseGrade: number;/*档次*/
        private _activityId: number;/*活动id*/
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }
        public onOpened(): void {
            super.onOpened();
            //this.createEffect();
            // this._btnClip.play();
        }
        protected setData(value: any): void {
            super.setData(value);
            this._cfg = value;
            // console.log("  this._cfg ", this._cfg)
            this.sureBtn.skin = 'mission_party/image_bx_' + this._cfg[2] + '.png'
            this._activityId = MissionPartyModel.instance.id;
            this._riseGrade = this._cfg[kuanghai2_riseFields.grade];
            let a = MissionPartyModel.instance.getRisrNodeInfoByGrade(this._riseGrade);
            this._riseList = MissionPartyModel.instance.getRisrNodeInfoByGrade(this._riseGrade) ? MissionPartyModel.instance.getRisrNodeInfoByGrade(this._riseGrade) : [0, 0];
            //所需嗨点
            // this.needHappyPoint.text = `${this._cfg[kuanghai2_riseFields.condition]}`;
            let getState = this._riseList[Kuanghai2GradeNodeFields.state] ? this._riseList[Kuanghai2GradeNodeFields.state] : 0;
            //领取状态/*状态 0未达成 1可领取 2已领取*/
            this.sureBtn.visible = true;
            this.sureBtn.disabled = false;
            this.received.visible = false;
            this._btnClip.stop();
            this._btnClip.visible = false;
            this.residueText.text = "(" + MissionPartyModel.instance.exp + "/" + this._cfg[kuanghai2_riseFields.condition] + ")";
            if (MissionPartyModel.instance.exp > this._cfg[kuanghai2_riseFields.condition])
                this.residueText.text = "(" + this._cfg[kuanghai2_riseFields.condition] + "/" + this._cfg[kuanghai2_riseFields.condition] + ")";
            switch (getState) {
                case 0:
                    // this.sureBtn.disabled = true;
                    this.residueText.color = "#ffffff";
                    break;
                case 1:
                    // this.sureBtn.disabled = false
                    this.residueText.color = "#344c6f";
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    break;
                case 2:
                    // this.sureBtn.disabled = false;
                    this.received.visible = true;
                    this.residueText.color = "#344c6f";
                    break;
                default:
                    this.sureBtn.visible = false;
                    this.received.visible = false;
                    break;
            }
            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            awardArr = this._cfg[kuanghai2_riseFields.reward];
            // console.log(" awardArr", awardArr)
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;

            let DayBase: modules.bag.BaseItem[] = [];

            DayBase.push(this.carnivalBase1);

            DayBase.push(this.carnivalBase2);

            DayBase.push(this.carnivalBase3);

            
            for (let i: int = 0; i < 3; i++) {
                DayBase[i].visible = false;
            }

        }
        private createEffect() {
            this._btnClip = CommonUtil.creatEff(this.sureBtn, "activityEnter", 15);
            this._btnClip.scale(1, 1);
            this._btnClip.pos(0, 5);
            this._btnClip.play();
            this._btnClip.visible = false;
        }
        private sureBtnHandler() {
            // let getState = this._riseList[Kuanghai2GradeNodeFields.state] ? this._riseList[Kuanghai2GradeNodeFields.state] : 0;
            // if (getState == 1) {

            // } else if (getState == 0) {
            MissionPartyModel.instance._itemCfg = this._cfg
            // MissionPartyCtrl.instance.getKuanghaiAward(this._riseGrade);
            WindowManager.instance.open(WindowEnum.Mission_Party_GET);

            // }

        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}