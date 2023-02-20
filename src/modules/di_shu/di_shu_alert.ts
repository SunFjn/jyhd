namespace modules.dishu {
    import di_shu_main_cfgFields = Configuration.di_shu_main_cfgFields;
    import ItemsFields = Configuration.ItemsFields;
    import BaseItem = modules.bag.BaseItem;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip

    export class DishuAlert extends ui.DishuAlertUI {

        private _cfg: Array<Array<any>>
        private rowAward: Array<any>
        private UltimateAward: Array<any>
        private _list: CustomList;
        private _list2: CustomList;
        private _dishueff: CustomClip
        constructor() {
            super();
        }

        public initialize(): void {

            super.initialize();
            this.rowAward = []
            this.UltimateAward = []
            this.rowAward = []
            this._dishueff = new CustomClip()
            this.Ceng.text = DishuModel.instance.level as any as string;
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = DishuItem;
            this._list.width = this.CengBox.width
            this._list.height = this.CengBox.height
            this._list.hCount = 4;
            this._list.autoX = true;
            this._list.spaceY = 30
            this.CengBox.addChild(this._list)

            this._list2 = new CustomList();
            this._list2.scrollDir = 1;
            this._list2.itemRender = DishuItem;
            this._list2.width = this.BigBox.width
            this._list2.height = this.BigBox.height
            this._list2.hCount = 4;
            this._list2.autoX = true;
            this._list2.spaceY = 30
            this.BigBox.addChild(this._list2)
           
        }
        // protected addListeners(): void {
        //     super.addListeners();
        // }

        // protected removeListeners(): void {

        //     super.removeListeners();
        // }
        public onOpened(): void {
            // console.log(this._cfg)
            this._cfg = DishuCfg.instance.getDishuByLevel(DishuModel.instance.level);
            this.rowAward = this._cfg[di_shu_main_cfgFields.Row]
            this.UltimateAward = this._cfg[di_shu_main_cfgFields.Ultimate]
            this._list.datas = this.rowAward
            this._list2.datas = this.UltimateAward
            super.onOpened();
            // this.demoeffect()
            // this._dishueff.play()
            // DishuModel.instance.p()
        }
        // private demoeffect() {
        //     this._dishueff = new CustomClip()

        //     this._dishueff.frameUrls = ["assets/effect/baozha/dadishu_HitEffect01.png", "assets/effect/baozha/dadishu_HitEffect02.png", "assets/effect/baozha/dadishu_HitEffect03.png", "assets/effect/baozha/dadishu_HitEffect04.png",
        //         "assets/effect/baozha/dadishu_HitEffect05.png"];
        //     this._dishueff.durationFrame = 15;
        //     this._dishueff.loop = false;
        //     this._dishueff.pos(-5, 0);//向上-y 向左-x
        //     this._dishueff.scale(0.6, 0.5);
        //     this.CengBox.addChild(this._dishueff)
        //     this._dishueff.visible = true;
        // }

        // public destroy(): void {
        //     super.destroy();
        // }
        // public close() {
        //     super.close();
        // }

    }

}