/**掉落狂欢 主界面*/
namespace modules.fish {

    export class FishCarnivalPanel extends modules.dishu.DishuCarnivalPanel {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.infoTxt.innerHTML = '活动期间内，参与玩法可掉落<font color="#d9880f">鱼饵</font><br>可在<font color="#5fcc7d">【幸运垂钓】</font>中兑换稀有奖励'

        }

        protected get gET(): number {
            return FishModel.instance.Endtime;
        }
    }
}