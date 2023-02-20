/** 全民狂嗨 奖励子项*/

namespace modules.the_carnival {

    import CustomClip = modules.common.CustomClip;
    import kuanghai_rise = Configuration.kuanghai_rise;
    import KuanghaiGradeNode = Protocols.KuanghaiGradeNode;
    import kuanghai_riseFields = Configuration.kuanghai_riseFields;
    import KuanghaiGradeNodeFields = Protocols.KuanghaiGradeNodeFields;
    import LayaEvent = modules.common.LayaEvent;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    export class TheCarnivalItem extends ui.TheCarnivalItemUI {
        private _btnClip: CustomClip;
        private _cfg: kuanghai_rise;
        private _riseList:KuanghaiGradeNode;/*档次列表*/
        private _riseGrade:number;/*档次*/
        private _activityId:number;/*活动id*/
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
            this._btnClip.play();
        }
        protected setData(value: any): void {
            super.setData(value);
            this._cfg = value;
            this._activityId = TheCarnivalModel.instance.id;
            this._riseGrade  = this._cfg[kuanghai_riseFields.grade];
            let a = TheCarnivalModel.instance.getRisrNodeInfoByGrade(this._riseGrade);
            this._riseList   = TheCarnivalModel.instance.getRisrNodeInfoByGrade(this._riseGrade)?TheCarnivalModel.instance.getRisrNodeInfoByGrade(this._riseGrade):[0,0];
            //所需嗨点
            this.needHappyPoint.text = `${this._cfg[kuanghai_riseFields.condition]}`;
            let getState = this._riseList[KuanghaiGradeNodeFields.state]?this._riseList[KuanghaiGradeNodeFields.state]:0;
            //领取状态/*状态 0未达成 1可领取 2已领取*/
            switch (getState) {
                case 0:
                    this.sureBtn.visible = true;
                    this.sureBtn.label = "嗨点不足";
                    this.sureBtn.disabled = true;
                    this.received.visible = false;
                    this.residueText.text = "剩余1/1";
                    this.residueText.color = "##344c6f";
                    this.received.visible = false;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    break;
                case 1:
                    this.sureBtn.visible = true;
                    this.sureBtn.label = "领取";
                    this.sureBtn.disabled = false;
                    this.received.visible = false;
                    this.residueText.text = "剩余1/1";
                    this.residueText.color = "#344c6f";

                    this._btnClip.visible = true;
                    this._btnClip.play();
                    break;
                case 2:
                    this.sureBtn.visible = false;
                    this.received.visible = true;
                    this.residueText.text = "剩余0/1";
                    this.residueText.color = "#ff3e3e";
                    this._btnClip.visible = true;
                    this._btnClip.stop();
                    break;
                default:
                    this.sureBtn.visible = false;
                    this.received.visible = false;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    break;
            }
            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            awardArr = this._cfg[kuanghai_riseFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;

            let DayBase: modules.bag.BaseItem[] = [];

            DayBase.push(this.carnivalBase1);

            DayBase.push(this.carnivalBase2);

            DayBase.push(this.carnivalBase3);

            for (let i: int = 0; i < 3; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
        }
        private createEffect(){
            this._btnClip = CommonUtil.creatEff(this.sureBtn, "btn_light", 15);
            this._btnClip.scale(0.8, 1.1);
            this._btnClip.pos(-5, -18);
            this._btnClip.play();
            this._btnClip.visible = false;
        }
        private sureBtnHandler(){
            TheCarnivalCtrl.instance.getKuanghaiAward(this._riseGrade);
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