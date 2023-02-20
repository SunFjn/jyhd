namespace modules.born {
    import BornAlertUI = ui.BornAlertUI;
    import CommonUtil = modules.common.CommonUtil;
    import era = Configuration.era;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import EraNode = Protocols.EraNode;
    import EraNodeFields = Protocols.EraNodeFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BagUtil = modules.bag.BagUtil;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    export class BornAlert extends BornAlertUI {

        private _itemEnough: boolean;
        private _icon: string;
        private _id: number;
        private _btnClip: CustomClip;

        protected initialize(): void {
            super.initialize();

            this._icon = CommonUtil.getIconById(13240001);
            this.propImg.skin = this._icon;

            this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._btnClip.pos(-5, -17);
            this._btnClip.scale(1, 1.25);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHnadler);
        }

        public onOpened(): void {
            super.onOpened();

            let lv: number = BornModel.instance.lv;
            let nextLv: number = BornCfg.instance.getNextLv(lv);
            let cfg: era = BornCfg.instance.getCfgByLv(lv);
            let nextCfg: era = BornCfg.instance.getCfgByLv(nextLv);
            let ids: number[];
            let needProp: Items;

            if (nextCfg) {
                ids = BornModel.instance.ids;
                this.btn.visible = true;
                this.maxTxt.visible = false;
                needProp = cfg[eraFields.eraDan][0];
            } else {
                let lastCfg: era = BornCfg.instance.getCfgByLv(lv, -1);
                ids = lastCfg[eraFields.tasklist];
                needProp = lastCfg[eraFields.eraDan][0];
                this.btn.visible = false;
                this.maxTxt.visible = true;
            }
            this.setItems(ids);
            let needId: number = needProp[ItemsFields.itemId];
            this._id = needProp[ItemsFields.itemId];
            let needCount: number = needProp[ItemsFields.count];
            let haveCount: number = CommonUtil.getPropCountById(needId);
            haveCount > needCount ? CustomClip.thisPlay(this._btnClip) : CustomClip.thisStop(this._btnClip);
            this.propTxt.text = `${haveCount}/${needCount}`;
            this.propTxt.color = haveCount >= needCount ? `#168a17` : `#ff3e3e`;
            this._itemEnough = haveCount >= needCount;
        }

        private setItems(ids: number[]) {
            let items: BornItem[] = [this.item_0, this.item_1, this.item_2, this.item_3];
            items.forEach((ele, index) => {
                let id: number = ids[index];
                ele.line = 1;
                ele.id = id;
            });
        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.stop();
        }

        private btnHnadler(): void {
            if (!this._itemEnough) {
                BagUtil.openLackPropAlert(this._id, 1);
            } else {
                let ids: number[] = BornModel.instance.ids;
                for (let id of ids) {
                    let node: EraNode = BornModel.instance.getEraNode(id);
                    let state: number = node[EraNodeFields.state];
                    if (!state) {
                        BornCtrl.instance.fastEra();
                        return;
                    }
                }
                SystemNoticeManager.instance.addNotice(`任务已全部完成，无需使用觉醒丹`, true);
            }
        }
    }
}