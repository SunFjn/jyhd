///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
namespace modules.day_drop_treasure {
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import SceneRichesCfg = modules.config.SceneRichesCfg;
    import PlayerModel = modules.player.PlayerModel;

    export class DayDropTreasureRewardAlert extends ui.DayDropTreasureRewardAlertUI {
        private _list: CustomList;
        private _pos: Point;
        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 520;
            this._list.height = 150;
            this._list.hCount = 4;
            this._list.spaceX = 30;
            this._list.spaceY = 5;
            //  30=  this._list.spaceX * (this._list.hCount );
            this._list.itemRender = DayDropTreasureItem;
            this._list.x = 70;
            this._list.y = 151;
            this.addChild(this._list);
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.updateList(value);
            if (value == 1) {
                this.titleTxt.text = "秘宝宝箱产出奖励预览";
            } else {
                this.titleTxt.text = "驭灵宝箱产出奖励预览";
            }
        }

        public updateList(type: number): void {
            let level = PlayerModel.instance.level;
            let Items: Array<Protocols.Items> = SceneRichesCfg.instance.get_reward(level, type);
            if (Items) {
                this._list.datas = Items;
            }
        }
    }
}