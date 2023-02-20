/////<reference path="../$.ts"/>
/** 仙盟任务item */
namespace modules.faction {
    import BaseItem = modules.bag.BaseItem;
    import CustomList = modules.common.CustomList;
    import FactionTaskItemUI = ui.FactionTaskItemUI;
    import FactionBossAwardCfg = modules.config.FactionBossAwardCfg;
    import faction_boss_award = Configuration.faction_boss_award;
    import faction_boss_awardFields = Configuration.faction_boss_awardFields;
    import CustomClip = modules.common.CustomClip;

    export class FactionTaskItem extends FactionTaskItemUI {

        private _btnClip: CustomClip;
        private _index: number;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._btnClip.scale(0.83, 0.88, true);
            this._btnClip.pos(-2, -5);
            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.x = 212;
            this._list.y = 14;
            this._list.width = 270;
            this._list.height = 100;
            this._list.vCount = 1;
            this._list.itemRender = BaseItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            super.addListeners();
        }

        protected setData(value: [number, operaState]): void {
            super.setData(value);
            this._index = value[0];
            let state: operaState = value[1];

            let lv: number = FactionModel.instance.lv;
            let cfg: faction_boss_award = FactionBossAwardCfg.instance.getCfgBylv(lv);
            let values: number[] = cfg[faction_boss_awardFields.value];
            this.txt.text = CommonUtil.bigNumToString(values[this._index]);

            this._btnClip.stop();
            this._btnClip.visible = this.btn.visible = this.img.visible = false;
            if (state == operaState.can) {
                this._btnClip.visible = this.btn.visible = true;
                this._btnClip.play();
            } else if (state == operaState.cant) { //不能领
                this.img.visible = true;
                this.img.skin = `common/txt_commmon_wdc.png`;
            } else {
                this.img.visible = true;
                this.img.skin = `common/txt_commmon_ylq.png`;
            }

            let params: Protocols.Items[] = cfg[faction_boss_awardFields.award][this.index];
            let datas: Protocols.Item[] = [];
            for (let e of params) {
                let id: number = e[Protocols.ItemsFields.ItemId];
                let count: number = e[Protocols.ItemsFields.count];
                datas.push([id, count, 0, null]);
            }
            this._list.datas = datas;
        }

        private btnHandler(): void {
            FactionCtrl.instance.getHurtAward(this._index);
        }

        public destroy(destroyChild: boolean = true): void {

            if (this._btnClip) {
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._list) {
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}