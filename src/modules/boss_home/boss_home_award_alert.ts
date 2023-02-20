/////<reference path="../$.ts"/>
/**boss之家背包弹框 */
namespace modules.bossHome {
    import BossHomeAwardAlertUI = ui.BossHomeAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    import BagModel = modules.bag.BagModel;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import Items = Configuration.Items;
    import ShenYuBossCtrl = modules.sheng_yu.ShenYuBossCtrl;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import CustomClip = modules.common.CustomClip;
    import BagItem = modules.bag.BagItem;
    import BaseItem = modules.bag.BaseItem;
    import ItemFields = Protocols.ItemFields;
    export class BossHomeAwardAlert extends BossHomeAwardAlertUI {

        private _showList: CustomList;
        private _itemList: CustomList;
        private _eff: CustomClip;

        protected initialize(): void {
            super.initialize();

            this._showList = CustomList.create('h', 64, 139, 532, 100, BaseItem, 8);
            this.addChild(this._showList);

            this._itemList = CustomList.create('v', 64, 315, 532, 270, BaseItem, 8, 5);
            this.addChild(this._itemList);

            this._eff = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._eff.pos(-5, -10);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.update);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        public onOpened(): void {
            super.onOpened();
            let layer: int = SceneModel.instance.enterScene[EnterSceneFields.level];
            this.txt.text = `(${layer}层)`;
            this.showAwards(layer);
            this.update();
        }

        private showAwards(layer: int): void {
            let cfg: scene_home_boss = SceneHomeBossCfg.instance.getCfgByFirstLayer(layer);
            if (!cfg) {
                throw new Error(`boss之家取不到配置getCfgByFirstLayer layer--->${layer}`);
            }
            let itemss: Items[] = cfg[scene_home_bossFields.awardByLayer];
            if (!itemss) return;
            let awards: Item[] = CommonUtil.formatItemData(itemss);
            this._showList.datas = awards;
        }

        private update(): void {
            let items: Item[] = BagModel.instance.getItemsByBagId(BagId.temple);
            if (!items) return;


            let newItems = new Array<Protocols.Item>();
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                if (element) {
                    newItems.push([element[ItemFields.ItemId], element[ItemFields.count], 0, null]);
                }
            }
            this._itemList.datas = newItems;

            if (items.length === 0) {
                this.btn.disabled = true;
                CustomClip.thisStop(this._eff);
            } else {
                this.btn.disabled = false;
                CustomClip.thisPlay(this._eff);
            }
        }

        private btnHandler(): void {
            ShenYuBossCtrl.instance.PickTempReward();
            this.close();
        }

        public destroy(): void {
            this._itemList = this.destroyElement(this._itemList);
            this._showList = this.destroyElement(this._showList);
            this._eff = this.destroyElement(this._eff);
            super.destroy();
        }
    }
}