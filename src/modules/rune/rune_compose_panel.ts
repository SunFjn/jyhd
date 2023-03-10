///<reference path="../config/rune_compose_cfg.ts"/>

namespace modules.rune {
    import RuneComposeViewUI = ui.RuneComposeViewUI;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefineFields = Configuration.runeRefineFields;
    import attr = Configuration.attr;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import RuneComposeCfg = modules.config.RuneComposeCfg;
    import rune_compose = Configuration.rune_compose;
    import rune_composeFields = Configuration.rune_composeFields;
    import ComposeRune = Protocols.ComposeRune;
    import ComposeRuneFields = Protocols.ComposeRuneFields;

    export class RuneComposePanel extends RuneComposeViewUI {
        private _list: CustomList;
        private _big_class_btns: Array<Laya.Button>;
        private _big_calss_item_height: number;
        private _big_calss_item_width: number;
        private _big_calss_item_spaceY: number;
        private _small_item_height: number;
        private _small_item_space_y: number;
        private _right_box_top_padding: number;
        private _select_big_id: number = 0;
        private _select_small_id: number = 0;
        private _big_class_name: string;
        private _big_class_arr: Array<string>;
        private _compose_data: ComposeRune;
        private _compose_money_enough: boolean;

        protected initialize(): void {
            super.initialize();
            this._big_calss_item_height = 53;
            this._big_calss_item_width = 199;
            this._big_calss_item_spaceY = 5;
            this._right_box_top_padding = 75;
            this._small_item_height = 48;
            this._small_item_space_y = 3;
            this.centerX = this.centerY = 0;
            this._big_class_btns = [];
            this._big_class_arr = ["??????", "??????", "??????"];

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = RuneComposeItem;
            this._list.hCount = 1;
            this._list.width = 173;
            this._list.x = 68;
            this._list.spaceY = this._small_item_space_y;
            this._list.visible = false;
            this.box_right.addChild(this._list);
            this.initBigClassList();
        }

        /**
         * ????????????????????? ?????????????????? ??????????????????
         */
        private initBigClassList() {
            let big_class_arr = RuneComposeCfg.instance.getBigClassArr();
            for (let index = 0; index < big_class_arr.length; index++) {
                const big_class = big_class_arr[index];
                let img = new Laya.Image("common/image_common_xhd.png");
                img.size(25, 25);
                img.right = 0;
                img.top = 0;
                img.visible = false;
                let btn = new Laya.Button("rune_compose/btn-d.png", big_class[1]);
                this._big_class_btns.push(btn);
                this.box_right.addChild(btn);
                btn.size(this._big_calss_item_width, this._big_calss_item_height);
                btn.labelColors = "#834c10,#834c10,#834c10";
                btn.sizeGrid = "10,17,11,16";
                btn.labelSize = 28;
                btn.stateNum = 2;
                btn.toggle = true;
                btn["bigClass"] = big_class[0];
                btn.addChild(img);
                btn.pos(53, this._right_box_top_padding + (this._big_calss_item_spaceY + btn.height) * index);

                btn.on(Laya.Event.CLICK, this, () => {
                    this._select_big_id = big_class[0];
                    this.refreshView();
                });
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this.refreshView();
        }

        /**
         * ???????????? ???????????????????????????
         * 
         * @param geted_id ?????????????????????id
         */
        protected refreshView(geted_id: number = 0): void {
            // ????????????????????????
            if (geted_id) {
                let data = [geted_id, 1, 0, null]
                WindowManager.instance.open(WindowEnum.COMMON_ITEMS_ALERT, [[data], "????????????", null, "???????????????", true]);
            }
            // ??????????????????
            let temp_big_id: number = this._select_big_id || 1;
            let temp_small_id: number = this._select_small_id;
            // ???????????????????????????????????????
            let hasRP = RuneModel.instance.compsoeRPTab["bigClass" + this._select_big_id];
            if (hasRP) {
                // ???????????????????????????????????????
                let curSmallHasRP = RuneModel.instance.compsoeRPTab[this._select_big_id][this._select_small_id];
                if (curSmallHasRP) {
                    // console.log("????????????!");
                } else {
                    let { ret_sc } = RuneModel.instance.getComposeHasRPItemData(temp_big_id);
                    // ????????????????????????????????????????????????????????????????????????
                    if (ret_sc != -1) {
                        temp_small_id = ret_sc;
                    }
                }
                // ???????????????????????? ?????????????????????
            }
            // ??????????????????????????????????????????????????????
            else {
                let { ret_bc, ret_sc } = RuneModel.instance.getComposeHasRPItemData(temp_big_id);
                if (ret_bc != -1 && ret_sc != -1) {
                    temp_big_id = ret_bc;
                    temp_small_id = ret_sc;
                }
                // ???????????????????????????????????????
            }

            // ??????????????????????????????
            this._select_big_id = temp_big_id;
            this._select_small_id = temp_small_id;

            // ????????????
            this.selectBigClass(this._select_big_id);
        }

        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(20072);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_help, Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.btn_compose, Event.CLICK, this, this.composeHandler);
            this.addAutoListener(this._list, Event.SELECT, this, this.selectComposeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_COMPSOE_FINAL_LEVEL, this, this.updateComposeFinalLevel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COMPOSE_FINISH_UPDATE, this, this.refreshView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COMPOSE_RP_UPDATE, this, this.updateRP);
        }

        /**
         * ??????????????????
         */
        private composeHandler(): void {
            let rune1State = this._compose_data[ComposeRuneFields.uids][0];
            let rune2State = this._compose_data[ComposeRuneFields.uids][1];
            let neewWarn = RuneModel.instance.needComposeWarn(this._list.selectedData[rune_composeFields.id]);
            // ????????????????????????
            if (!this._compose_money_enough) {
                let need_id = this._list.selectedData[rune_composeFields.needItems][0];
                modules.bag.BagUtil.openLackPropAlert(need_id, 1);
            }
            // ??????1??????
            else if (rune1State == -1) {
                let need_id = this._list.selectedData[rune_composeFields.needRunes][0][0];
                modules.bag.BagUtil.openLackPropAlert(need_id, 1);
            }
            // ??????2??????
            else if (rune2State == -1) {
                let need_id = this._list.selectedData[rune_composeFields.needRunes][1][0];
                modules.bag.BagUtil.openLackPropAlert(need_id, 1);
            }
            // ??????????????????
            else if (neewWarn) {
                let handler: Handler = Handler.create(this, () => {
                    RuneCtrl.instance.runeCompose(this._compose_data);
                });
                CommonUtil.alert(`????????????`, "?????????????????????,???????????????????", [handler]);
            }
            // ??????????????????
            else {
                RuneCtrl.instance.runeCompose(this._compose_data);
            }
        }

        /**
         * ????????????????????????
         */
        private updateRP(): void {
            for (let index = 0; index < this._big_class_btns.length; index++) {
                const btn = this._big_class_btns[index];
                let state = RuneModel.instance.compsoeRPTab["bigClass" + btn["bigClass"]];
                (btn.getChildAt(1) as Laya.Sprite).visible = state;
            }
        }

        /**
         * ????????????
         * 
         */
        private selectComposeHandler(): void {
            GlobalData.dispatcher.event(CommonEventType.RUNE_COMPOSE_UPDATE_SELECT_SMALL_HANDLER, this._list.selectedIndex);
            let compose_data: rune_compose = this._list.selectedData;

            this._select_small_id = compose_data[rune_composeFields.id];

            let need_id = compose_data[rune_composeFields.needItems][0];
            let need_count = compose_data[rune_composeFields.needItems][1];

            let left_id = compose_data[rune_composeFields.needRunes][0][0];
            let right_id = compose_data[rune_composeFields.needRunes][1][0];
            let final_id = compose_data[rune_composeFields.id];

            let total_count = modules.bag.BagModel.instance.getItemCountById(need_id);
            this._compose_money_enough = need_count <= total_count;
            this.txt_consume.text = need_count + "/" + total_count;
            this.txt_consume.color = need_count > total_count ? "red" : "#008e11";
            // ??????
            let itemData = modules.config.ItemMaterialCfg.instance.getItemCfgById(need_id);
            this.consume_icon.skin = `assets/icon/item/${itemData[Configuration.item_materialFields.ico]}.png`;

            // ????????????item 2??? ??????
            this.item_left.event(CommonEventType.UPDATE_RUNE_COMPOSE_SHOW_DATA, [left_id, false, this._big_class_name]);
            this.item_right.event(CommonEventType.UPDATE_RUNE_COMPOSE_SHOW_DATA, [right_id, false, this._big_class_name]);
            // ????????????item 1??? ??????
            this.item_final.event(CommonEventType.UPDATE_RUNE_COMPOSE_SHOW_DATA, [final_id, true, this._big_class_name]);
            // ?????????????????? 2??? ??????
            let leftData = this.getComposeData(this.item_left, left_id);
            let rightData = this.getComposeData(this.item_right, right_id);
            let finalData = this.getComposeData(this.item_final, final_id);

            this.txt_left_name.text = leftData.nameLV;
            this.txt_left_name.color = CommonUtil.getColorById(left_id);

            this.txt_right_name.text = rightData.nameLV;
            this.txt_right_name.color = CommonUtil.getColorById(right_id);

            this.txt_left_attr.text = leftData.desc;
            this.txt_right_attr.text = rightData.desc;

            // ???????????? 1??? ?????? 
            this.txt_final_name.text = this._big_class_name + "." + finalData.nameLV;
            this.txt_final_name.color = CommonUtil.getColorById(final_id);
            this.txt_final_attr.text = finalData.desc;

            // ?????????????????????????????????????????????
            let realid1: number = RuneModel.instance.getComposeUseSendID(this.item_left["real_id"]);
            let realid2: number = RuneModel.instance.getComposeUseSendID(this.item_right["real_id"]);

            RuneCtrl.instance.runeComposePreview([final_id, [realid1, realid2]]);
            // ?????????????????????????????????????????????
            this._compose_data = [final_id, [realid1, realid2]];

            // ????????????????????????
            let neewWarn = RuneModel.instance.needComposeWarn(this._list.selectedData[rune_composeFields.id]);
            this.txt_have.visible = neewWarn;
        }

        /**
         * ???????????? ??????????????????
         * 
         * @param class_id ??????id
         */
        private selectBigClass(class_id: number) {
            if (!this._list.visible) {
                this._list.visible = true;
            }

            this._select_big_id = class_id;
            let small_arr: Array<rune_compose> = RuneComposeCfg.instance.getCfgByCategory(class_id);
            this._list.height = (this._small_item_height + this._small_item_space_y) * small_arr.length + 10;

            // ??????List????????????
            let list_y = (this._big_calss_item_height + this._big_calss_item_spaceY) * class_id + this._right_box_top_padding;
            this._list.y = list_y;

            // ????????????????????????
            for (let index = 0; index < this._big_class_btns.length; index++) {
                const btn = this._big_class_btns[index];
                if ((class_id - 1) >= index) {
                    btn.y = this._right_box_top_padding + (this._big_calss_item_spaceY + btn.height) * index;
                } else {
                    btn.y = this._right_box_top_padding + (this._big_calss_item_spaceY + btn.height) * index + this._list.height;
                }

                btn.selected = (class_id - 1) == index;
            }

            // List??????????????????
            this._list.datas = small_arr;
            this._big_class_name = this._big_class_arr[class_id - 1];

            // ????????????????????????????????????????????????????????????????????????
            let select_index = 0;
            for (let index = 0; index < small_arr.length; index++) {
                const rc: rune_compose = small_arr[index];
                if (rc[runeRefineFields.id] == this._select_small_id) {
                    select_index = index;
                    // console.log("??????????????????", index);
                    break;
                }
            }

            this._list.selectedIndex = select_index;
            this._list.selectedItem["onClickHandler"]();

            // ??????????????????
            this.updateRP();
        }

        /**
         * ??????????????????????????????????????????
         * 
         * @param level 
         */
        private updateComposeFinalLevel(level: number) {
            let arr = this.txt_final_name.text.split("LV.");
            this.txt_final_name.text = arr[0] + "LV." + level;
        }

        /**
         * ?????????????????????
         * 
         * @param item ?????????????????????
         * @param dimID ??????id
         * @returns ????????????  ???  ??????
         */
        private getComposeData(item: any, dimID: number): { desc: string, nameLV: string } {
            let runeRefineData: runeRefine = RuneRefineCfg.instance.getCfgById(item["attr_id"]);
            let attrs: Array<attr> = runeRefineData[runeRefineFields.attrs];
            let desc = "", nameLV = "";
            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimID);
            let currLV: number = runeRefineData[runeRefineFields.id] % 10000;

            nameLV = dimCfg[item_runeFields.name] + " LV." + currLV;
            for (let index = 0; index < attrs.length; index++) {
                const att: attr = attrs[index];
                let attData: Configuration.attr_item = AttrItemCfg.instance.getCfgById(att[attrFields.type]);
                let isPercent = attData[attr_itemFields.isPercent];
                let attrName = attData[attr_itemFields.name];
                let val: number | string = att[attrFields.value];

                val = isPercent ? modules.common.AttrUtil.formatFloatNum(val) + "%" : Math.round(val) + "";

                desc += attrName + "\t\t" + val;
                if (index < attrs.length - 1) {
                    desc += "\n";
                }
            }
            return { desc, nameLV };
        }


        public destroy(destroyChild: boolean = true): void {
            // this._runePitArr = this.destroyElement(this._runePitArr);

            super.destroy(destroyChild);
        }

    }
}