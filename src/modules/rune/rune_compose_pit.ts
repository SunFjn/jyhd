///<reference path="../rune_copy/rune_copy_model.ts"/>

namespace modules.rune {
    import RuneComposePitItemUI = ui.RuneComposePitItemUI;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;

    export class RuneComposePit extends RuneComposePitItemUI {

        private _view_id: number;
        private _hasRune: boolean;                   //是否有该玉荣
        public attr_id: number;
        public real_id: number;
        public isFinalClass: boolean;

        protected initialize(): void {
            super.initialize();
        }

        protected onOpened(): void {
            super.onOpened();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this, CommonEventType.UPDATE_RUNE_COMPOSE_SHOW_DATA, this, this.initView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_COMPSOE_FINAL_LEVEL, this, this.updateComposeFinalLevel);
            this.addAutoListener(this, Laya.Event.CLICK, this, this.clickHandler);
        }

        private initView(dimID: any, compound: boolean, big_class_name: string): void {
            // console.log("PIT:", show_data);
            let realID: number = RuneModel.instance.getMaxLVCanComposeRuneID(dimID);
            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimID);

            // 是否是合成的那一个
            if (!compound) {
                this.addBtn.visible = !realID;
                this.iconImg.gray = !realID;
                this._hasRune = !!realID;
                this.namebg.skin = "rune_compose/image_bottom1.png";
                big_class_name = "";
                this.isFinalClass = false;
            } else {
                this.isFinalClass = true;
                this.addBtn.visible = false;
                this.iconImg.gray = false;
                this._hasRune = true;
                this.namebg.skin = "rune_compose/image_bottom.png";
                big_class_name = big_class_name + ".";
            }
            this.already.visible = RuneModel.instance.currentRuneAtBody(dimID);
            this.attr_id = realID || (dimID + 1);
            this.real_id = realID;
            // 没有该玉荣默认查看第一等级的
            this._view_id = dimID + 1;
            // 名字等级 如果没有则默认1级
            let currLV: number = (realID % 10000) || 1;
            this.lvTxt.text = big_class_name + dimCfg[item_runeFields.name] + " LV." + currLV;
            this.lvTxt.color = CommonUtil.getColorById(dimID);
            // icon
            this.iconImg.skin = `assets/icon/item/${dimCfg[item_runeFields.ico]}.png`;
        }

        /**
         * 更新合成大类的预览的等级信息
         * 
         * @param level 
         */
        private updateComposeFinalLevel(level: number) {
            if (!this.isFinalClass) return;

            let arr = this.lvTxt.text.split("LV.");
            this.lvTxt.text = arr[0] + "LV." + level;
        }


        protected clickHandler(): void {
            //有玉荣
            // if (this._hasRune) {

            // }
            //没有玉荣 
            // else {
            WindowManager.instance.open(WindowEnum.PROP_ALERT, [this._view_id, 1, 0, null]);
            // }
        }

    }
}