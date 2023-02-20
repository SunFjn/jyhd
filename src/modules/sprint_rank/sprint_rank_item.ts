/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.spring_rank {
    import SprintRankInfo = Protocols.SprintRankInfo;
    import ThreeWorldsRankItemUI = ui.ThreeWorldsRankItemUI;
    import SprintRankInfoFields = Protocols.SprintRankInfoFields;

    export class springRankItem extends ThreeWorldsRankItemUI {
        private rankNum: number = 0;
        private rankid: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.nameTxt.y = 35;
            this.nameTxt.x = 200;
            this.damageTxt.x = 400;
            this.damageTxt.y = 36;
        }

        protected addListeners(): void {
            super.addListeners();

            // this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();

            this._updateView();
        }

        public setData(value: any): void {
            if (!value[SprintRankInfoFields.param]) { //虚位以待
                this.nameTxt.text = "虚位以待...";
                this.damageTxt.text = "";
                //this.rankImg.visible=false;
                this.rankTxt.visible = false;
                this.rankid = value[SprintRankInfoFields.rank];
                if (this.rankid == 1) {
                    this.rankImg.skin = "common/zs_tongyong_7.png";
                } else if (this.rankid == 2) {
                    this.rankImg.skin = "common/zs_tongyong_8.png";
                } else if (this.rankid == 3) {
                    this.rankImg.skin = "common/zs_tongyong_9.png";
                } else {
                    this.rankImg.skin = "common/dt_tongyong_15.png";
                    this.rankTxt.visible = true;
                    this.rankTxt.text = this.rankid.toString();
                }
            } else {
                value = value as SprintRankInfo;
                this.rankNum = value[SprintRankInfoFields.rank];
                this.rankTxt.visible = false;

                if (this.rankNum === 1) {
                    this.rankImg.skin = "common/zs_tongyong_7.png";
                } else if (this.rankNum === 2) {
                    this.rankImg.skin = "common/zs_tongyong_8.png";
                } else if (this.rankNum === 3) {
                    this.rankImg.skin = "common/zs_tongyong_9.png";
                } else {
                    this.rankImg.skin = "common/dt_tongyong_15.png";
                    this.rankTxt.visible = true;
                    this.rankTxt.text = this.rankNum.toString();
                }
                this.damageTxt.text = `${value[SprintRankInfoFields.param]}`;
                this.nameTxt.text = value[SprintRankInfoFields.name];
            }
            //this.myRankTxt.text =  `我的排名：${myRank === null ? "未上榜" : myRank[SprintRankInfoFields.rank]}`;
        }

        private _updateView(): void {

        }

        public close(): void {
            super.close();
        }
    }
}