namespace modules.rankingList {
    import Button = Laya.Button;

    export class RankingListBtn extends ItemRender {

        private _names: string[];
        private _btn: Button;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._btn = new Button("common/btn_tongyong_1.png");
            this._btn.stateNum = 2;
            this._btn.labelAlign = "center";
            this._btn.labelFont = "SimHei";
            this._btn.labelSize = 27;
            this._btn.labelColors = '#c9724b, #ffffff';
            this.addChild(this._btn);

            this._names = [
                `战力榜`,
                `等级榜`,
                `公会榜`,
                `宠物榜`,
                `精灵榜`,
                `幻武榜`,
                `翅膀榜`,
                `圣物榜`,
                `活跃值榜`,
                `成就榜`,
                `装备榜`,
            ];
        }

        protected setData(value: any): void {
            super.setData(value);
            this._btn.label = this._names[this.index];
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this._btn.selected = value;
        }
    }
}
