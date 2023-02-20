namespace modules.bigTower {
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;

    export class BigTowerLevelPanle extends ui.BigTowerLevelViewUI {

        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.top = 390;
            this._type = 0;
        }

        protected onOpened(): void {
            super.onOpened();

            let lv: number = this._type == 0 ? BigTowerModel.instance.finishLevel + 1 : RuneCopyModel.instance.currLv;
            this.levelImg2.skin = this._type == 0 ? "big_tower/msz_guta_2.png" : "big_tower/msz_tianguan_2.png";
            this.levelClip.value = lv.toString();

            let charNum: number = lv.toString().length;
            let mszWidth: number = charNum * (36 + this.levelClip.spaceX);
            let sumWidth: number = this.levelImg1.width + 5 + mszWidth + 5 + this.levelImg2.width;
            let initX: number = (this.width - sumWidth) / 2;
            this.levelImg1.x = initX;
            this.levelClip.x = this.levelImg1.x + this.levelImg1.width;
            this.levelImg2.x = this.levelClip.x + mszWidth + 5;

            Laya.timer.once(1000, this, () => {
                this.close();
            })
        }

        public setOpenParam(value: any) {
            super.setOpenParam(value);
            this._type = value;
        }
    }
}