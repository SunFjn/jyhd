/** 等级红包单元项*/


namespace modules.redpack {
    import LevelRedPackItemUI = ui.LevelRedPackItemUI;

    export class LevelRedPackItem extends LevelRedPackItemUI {
        private config_id: number;
        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();
            if (this._data.status == 2) return;
            if (this._data.status == 1) {
                // 等级红包没有双倍功能 id_double=0
                SDKNet("api/red/bag/level", { config_id: this.config_id, id_double: 0 }, (res) => {
                    console.log(res);
                    if (res.code == 200) {
                        WindowManager.instance.open(WindowEnum.REDPACK_GETED_ALERT, { ...res.data, type: 2 });
                        GlobalData.dispatcher.event(CommonEventType.UPDATE_LEVEL_REDPACK_REMIAN, res.data);
                        // GlobalData.dispatcher.event(CommonEventType.UPDATE_LEVEL_REDPACK_ITEM);
                        RedPackModel.instance.updateSingleLevelRedPackState(this._data.level, 2);
                        this._data["money"] = res.data.add_money;
                        this._data["status"] = 2;
                        this.eff_light.visible = false;
                        this.setData(this._data);
                        return;
                    }
                    modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
                })
                return;
            }
            modules.notice.SystemNoticeManager.instance.addNotice("未到达领取条件!!!", true);
        }

        protected setData(value: any): void {
            super.setData(value);

            this.img_bg.skin = value.status == 2 ? "level_redpack/image_rp_1.png" : "level_redpack/image_rp_2.png"
            this.txt_alreadyGeted.visible = value.status == 2;
            this.txt_notGeted.visible = value.status != 2;
            switch (value.status) {
                case 0:
                    this.txt_notGeted.text = "未达成";
                    this.eff_light.visible = false;
                    break;
                case 1:
                    this.txt_notGeted.text = "可领取";
                    this.eff_light.visible = true;
                    break;
                case 2:
                    this.txt_notGeted.text = "已领取";
                    this.eff_light.visible = false;
                    break;
            }
            this.txt_getedCount.text = value.money + "元";
            this.txt_desc.text = value.level + "级红包";
            this.config_id = value.id;
        }
    }
}