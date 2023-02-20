/** 超级红包红包单元项*/


namespace modules.redpack {
    import SuperRedPackItemUI = ui.SuperRedPackItemUI;
    import CustomClip = modules.common.CustomClip;

    export class SuperRedPackItem extends SuperRedPackItemUI {
        private config_id: number;
        private is_double: boolean;
        private _btnClip: CustomClip;

        constructor() {
            super();
        }


        protected initialize() {
            super.initialize();
            this._btnClip = CommonUtil.creatEff(this.btn_get, `btn_light`, 15);
            this._btnClip.pos(-11, -15);
        }

        protected clickHandler(): void {
            super.clickHandler();
            if (this._data.status == 1) {
                SDKNet("api/red/bag/high/level/money", { config_id: this.config_id }, (res) => {
                    console.log(res);
                    if (res.code == 200) {
                        RedPackModel.instance.updateSingleSuperRedPackState(this._data.level, 2);
                        WindowManager.instance.open(WindowEnum.REDPACK_GETED_ALERT, { ...res.data, config_id: this.config_id, is_double: this.is_double, type: 3 });
                        return;
                    }
                    modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
                })
                return;
            }
            if (this._data.status == 2) {
                return;
            }
            modules.notice.SystemNoticeManager.instance.addNotice("未到达领取条件!!!", true);
        }

        protected setData(value: any): void {
            super.setData(value);

            this.txt_desc.text = value.description;
            this.txt_level.text = "LV." + value.level;
            this.txt_amount.text = value.money + "元";
            this.config_id = value.id;
            this.is_double = value.is_double;

            this.btn_get.disabled = value.status != 1;
            switch (value.status) {
                case 0:
                    this.btn_get.label = "未达成";
                    this.rp_bg.skin = "super_redpack/imgae_2.png";
                    this.img_bg.skin = "super_redpack/image_bg2.png";
                    CustomClip.thisStop(this._btnClip);
                    break;
                case 1:
                    CustomClip.thisPlay(this._btnClip);
                    this.btn_get.label = "领取";
                    this.rp_bg.skin = "super_redpack/imgae_2.png";
                    this.img_bg.skin = "super_redpack/image_bg2.png";
                    break;
                case 2:
                    this.btn_get.label = "已领取";
                    this.rp_bg.skin = "super_redpack/imgae_3.png";
                    this.img_bg.skin = "super_redpack/image_bg3.png";
                    CustomClip.thisStop(this._btnClip);
                    break;
            }
        }

        public destroy(destroyChild?: boolean): void {
            super.destroy(destroyChild);
            this._btnClip = this.destroyElement(this._btnClip);
        }
    }
}