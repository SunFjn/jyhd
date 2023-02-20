/** 精灵宠物左上面板*/


namespace modules.dailyDungeon {
    import PetLTViewUI = ui.PetLTViewUI;
    import BroadcastCopyStar = Protocols.BroadcastCopyStar;
    import BroadcastCopyStarFields = Protocols.BroadcastCopyStarFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import Layer = ui.Layer;

    export class PetLTPanel extends PetLTViewUI {
        private _star: int;
        private _restTime: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.left = 0;
            this.top = 300;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this.txt.color = "#FFFFFF";
            this.txt.style.fontFamily = "SimHei";
            this.txt.style.fontSize = 24;
            this.txt.style.lineHeight = 28;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BROADCAST_COPY_STAR, this, this.starUpdate);

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        protected onOpened(): void {
            super.onOpened();

            this._star = 3;
            this._restTime = -1;
            this.txt.innerHTML = "";
            this.star1.visible = this.star2.visible = this.star3.visible = true;
            this.star1.pos(32, 10, true);
            this.star2.pos(13, 44, true);
            this.star3.pos(52, 44, true);
        }

        private starUpdate(): void {

            let star: BroadcastCopyStar = DungeonModel.instance.broadcastCopyStar;
            if (!star) return;
            this._restTime = star[BroadcastCopyStarFields.remainTime];
            this.loopHandler();
            let starNum: int = star[BroadcastCopyStarFields.curStar];
            this._star = starNum;
            if (starNum === 3) {
                this.star1.visible = this.star2.visible = this.star3.visible = true;
                this.star1.pos(32, 10, true);
                this.star2.pos(13, 44, true);
                this.star3.pos(52, 44, true);
            } else if (starNum === 2) {
                this.star1.visible = this.star2.visible = true;
                this.star3.visible = false;
                this.star1.pos(11, 32, true);
                this.star2.pos(53, 32, true);
            } else if (starNum === 1) {
                this.star1.visible = true;
                this.star2.visible = this.star3.visible = false;
                this.star1.pos(32, 32, true);
            }
        }

        private loopHandler(): void {
            if (this._restTime <= 0) return;
            let timeStr: string = modules.common.CommonUtil.msToMMSS(this._restTime);
            this.txt.innerHTML = `<span style="color:#00AD35">${timeStr}</span>后降为${this._star - 1}星评价`;
            this._restTime -= 1000;
        }
    }
}