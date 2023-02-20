/**  头像 item */


namespace modules.rename {
    import RenameItemUI = ui.RenameItemUI;
    import BagModel = modules.bag.BagModel;
    import headFields = Configuration.headFields;

    export class RenameItem extends RenameItemUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.updateInfo();
            this.selectImg.visible = value

        }
        private headId: number = 0
        protected setData(value: any): void {
            super.setData(value);
            this.headId = value as number;
            this.updateInfo();
        }

        private updateInfo(){
            if (this.headId == 0) this.headImg.skin = `assets/icon/head/${this.headId + PlayerModel.instance.occ}.png`
            else this.headImg.skin = `assets/icon/head/${this.headId + PlayerModel.instance.occ}.jpg`
            this.selectImg.visible = this.selected
            this.maskImg.visible = RenameModel.instance.getHeadLevel(this.headId) == 0
            this.onImg.visible = this.headId == RenameModel.instance.selectHeadId

            // 是否为未激活状态
            let notActive = RenameModel.instance.getHeadLevel(this.headId) == 0;
            let activecfg = HeadCfg.instance.getLevelConfig(this.headId, 1);

            let data = activecfg[headFields.items];
            let level = RenameModel.instance.getHeadLevel(this.headId)
            let nextcfg = HeadCfg.instance.getLevelConfig(this.headId, level + 1);
            let canActive = BagModel.instance.getItemCountById(Number(data[0])) >= data[1] && nextcfg != null;

            // 激活红点状态
            this.rpImg.visible = canActive;
        }

    }
}
